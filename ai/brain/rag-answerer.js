/**
 * ============================================================================
 * GROUNDED RAG ANSWERER
 * ============================================================================
 *
 * Builds fast, deterministic answers directly from retrieved knowledge.
 */

import { INTENT } from "../utils/constants.js";

const MISSING_INFO_RESPONSE = "I don't have that information in Vivan's portfolio.";

export function buildGroundedAnswer({ intent, userMessage, knowledge, analysis = null }) {
    const modules = knowledge?.modules ?? {};

    switch (intent) {
        case INTENT.PROJECTS:
            return answerProjects(userMessage, modules.projects, analysis);

        case INTENT.SKILLS:
            return answerSkills(modules.skills, modules.projects, analysis);

        case INTENT.EDUCATION:
            return answerEducation(modules.education, userMessage);

        case INTENT.CONTACT:
            return answerContact(modules.contact, userMessage);

        case INTENT.CERTIFICATIONS:
            return answerCertifications(modules.certifications);

        case INTENT.ACHIEVEMENTS:
            return answerAchievements(modules.achievements, userMessage);

        case INTENT.EXPERIENCE:
            return answerExperience(modules.experience, userMessage);

        case INTENT.ABOUT:
            return answerAbout(modules.about, userMessage);

        case INTENT.GREETING:
            return answerGreeting(modules.about);

        case INTENT.ASSISTANT:
            return answerAssistantIdentity(modules, userMessage);

        case INTENT.HIRE:
        case INTENT.RECRUITER:
        case INTENT.RESUME:
            return answerProfessionalSummary(modules, userMessage);

        case INTENT.GENERAL:
            return answerGeneral(modules, userMessage);

        case INTENT.PERSONALITY:
            return answerPersonality(modules.personality);

        default:
            return answerUnknown(userMessage);
    }
}

export function getMissingInfoResponse() {
    return MISSING_INFO_RESPONSE;
}

function answerProjects(userMessage, data, analysis) {
    const projects = data?.projects;
    const question = normalize(userMessage);

    if (!Array.isArray(projects) || projects.length === 0) {
        return MISSING_INFO_RESPONSE;
    }

    if (analysis?.concepts?.missingProject) {
        if (question.includes("android")) {
            return "I don't have information about an Android app in Vivan's portfolio.";
        }

        if (question.includes("banking")) {
            return MISSING_INFO_RESPONSE;
        }

        return MISSING_INFO_RESPONSE;
    }

    if (/\bhow many\b.*\b(project|projects)\b|\bcompleted\b.*\b(project|projects)\b/.test(question)) {
        const completed = projects.filter(project => normalize(project.status) === "completed");
        return `Vivan's portfolio lists ${projects.length} software projects, with ${completed.length} marked as completed: ${completed.map(project => project.name).join(", ")}.`;
    }

    if (analysis?.concepts?.fullStack) {
        return answerFullStackProject(projects);
    }

    if (analysis?.concepts?.ai) {
        return answerAIProject(projects);
    }

    const requestedProject = findProjectByQuestion(userMessage, projects, analysis);
    const technologyMatchedProjects = findProjectsByMentionedTechnology(userMessage, projects);

    if (technologyMatchedProjects.length > 0 && !requestedProject) {
        return technologyMatchedProjects
            .map(project => {
                const matchedTech = flattenTechStack(project.techStack)
                    .filter(tech => normalize(userMessage).includes(normalize(tech)));

                return `**${project.name}** uses ${matchedTech.join(", ")}.`;
            })
            .join("\n");
    }

    if (requestedProject === null) {
        return MISSING_INFO_RESPONSE;
    }

    const selectedProjects = requestedProject ? [requestedProject] : projects;

    if (/\b(simple words|explain it simply|simple language)\b/.test(question)) {
        const project = selectedProjects[0];
        return `In simple words, **${project.name}** is ${project.description.replace(/^A\s+/i, "a ")} It shows how Vivan turns an idea into a working software project with real users and practical features.`;
    }

    if (/\b(hardest|most difficult|challenging)\b/.test(question)) {
        const hardest = projects.find(project => project.id === "lost-found") ?? projects[0];
        return [
            `Based on the portfolio evidence, **${hardest.name}** appears to be the most technically challenging project.`,
            "Why: it combines frontend work, Python/Flask backend development, PostgreSQL database integration, authentication, uploads, search, and an administrator dashboard."
        ].join("\n");
    }

    if (/\b(problem|problems|solve|solves)\b/.test(question)) {
        return selectedProjects.map(project => [
            `**${project.name}:** ${project.objective ?? project.description}`,
            project.features?.length ? `It addresses that through ${project.features.slice(0, 4).join(", ")}.` : ""
        ].filter(Boolean).join("\n")).join("\n\n");
    }

    if (/\b(learn|learned|learning)\b/.test(question)) {
        return selectedProjects.map(project => {
            const concepts = project.concepts?.length ? project.concepts.join(", ") : "practical software development";
            return `From **${project.name}**, Vivan demonstrates learning in ${concepts}.`;
        }).join("\n");
    }

    if (/\b(industry|real world|production)\b/.test(question)) {
        const project = selectedProjects[0];
        const evidence = getProjectCapabilityEvidence(project);
        return [
            `Yes, **${project.name}** is relevant to industry-style learning because it moves beyond theory into applied software development.`,
            evidence.length ? `Industry-aligned signals: ${evidence.join(", ")}.` : "",
            "It should be viewed as student project evidence, not professional production experience."
        ].filter(Boolean).join("\n");
    }

    if (asksCompare(userMessage)) {
        return compareProjects(selectedProjects);
    }

    if (asksForTechnology(userMessage)) {
        return selectedProjects
            .map(project => {
                const tech = flattenTechStack(project.techStack);
                return `**${project.name}:** ${tech.length ? tech.join(", ") : "No technologies listed."}`;
            })
            .join("\n");
    }

    if (asksWhy(userMessage) && selectedProjects.length === 1) {
        return explainProjectValue(selectedProjects[0]);
    }

    if (asksForBestProject(userMessage) || /\b(favorite|proud)\b/.test(question)) {
        const strongest = selectedProjects.find(project => project.id === "portfolio-ai") ?? selectedProjects[0];
        const tech = flattenTechStack(strongest.techStack);

        return [
            `Based on the portfolio knowledge, **${strongest.name}** is the strongest project to discuss for recruiter conversations because it combines practical product thinking with AI-focused implementation.`,
            strongest.description,
            tech.length ? `It uses ${tech.join(", ")}.` : "",
            "That said, the portfolio does not rank projects formally."
        ].filter(Boolean).join("\n");
    }

    return [
        "Vivan's project work shows practical software engineering through real portfolio and academic builds.",
        "",
        selectedProjects.map(project => {
            const tech = flattenTechStack(project.techStack);
            const features = Array.isArray(project.features) ? project.features.slice(0, 3).join(", ") : "";

            return [
                `**${project.name}** (${project.status})`,
                `Overview: ${project.description}`,
                tech.length ? `Technologies: ${tech.join(", ")}` : "",
                features ? `Key highlights: ${features}` : "",
                project.objective ? `Impact/Learning: ${project.objective}` : ""
            ].filter(Boolean).join("\n");
        }).join("\n\n")
    ].join("\n");
}

function compareProjects(projects) {
    if (!Array.isArray(projects) || projects.length === 0) {
        return MISSING_INFO_RESPONSE;
    }

    return projects.map(project => {
        const evidence = getProjectCapabilityEvidence(project);
        const tech = flattenTechStack(project.techStack);

        return [
            `**${project.name}:** ${project.description}`,
            tech.length ? `Technology focus: ${tech.join(", ")}` : "",
            evidence.length ? `Strengths shown: ${evidence.join(", ")}` : ""
        ].filter(Boolean).join("\n");
    }).join("\n\n");
}

function explainProjectValue(project) {
    const evidence = getProjectCapabilityEvidence(project);
    const tech = flattenTechStack(project.techStack);

    return [
        `**${project.name}** is valuable because it demonstrates practical implementation rather than only theory.`,
        project.objective ? `Purpose: ${project.objective}` : project.description,
        evidence.length ? `Engineering evidence: ${evidence.join(", ")}.` : "",
        tech.length ? `Technologies used: ${tech.join(", ")}.` : ""
    ].filter(Boolean).join("\n");
}

function findProjectsByMentionedTechnology(userMessage, projects) {
    const question = normalize(userMessage);

    if (!/\b(which|what)\b/.test(question)) {
        return [];
    }

    return projects.filter(project =>
        flattenTechStack(project.techStack).some(tech => question.includes(normalize(tech)))
    );
}

function answerSkills(data, projectsData, analysis) {
    if (!data) {
        return MISSING_INFO_RESPONSE;
    }

    const question = analysis?.normalizedMessage ?? "";
    const recentText = analysis?.recentText ?? "";

    if (/\b(strongest|which one|best)\b/.test(question)) {
        return [
            "Vivan's strongest technical area appears to be full-stack web development fundamentals.",
            "Evidence: his portfolio combines JavaScript/HTML/CSS on the frontend with Python, Flask, REST APIs, SQL, and PostgreSQL in project work."
        ].join("\n");
    }

    if (/\b(where did|where was|where has|which project uses|project uses|uses it|use that)\b/.test(question)) {
        if (recentText.includes("full stack") || recentText.includes("full-stack") || question.includes("full stack")) {
            return "Vivan demonstrates full-stack development most clearly in the **Lost & Found Management System**, which uses frontend, backend, database, authentication, and application workflow features.";
        }

        if (recentText.includes("postgresql") || question.includes("postgresql")) {
            return "PostgreSQL is used in the **Lost & Found Management System**.";
        }

        if (recentText.includes("flask") || question.includes("flask") || recentText.includes("framework")) {
            return "Flask is used in the **Lost & Found Management System** as the backend framework.";
        }

    }

    if (/\b(repeat that|repeat|what framework)\b/.test(question)) {
        return [
            "The backend stack I mentioned is **Python** with **Flask** and REST API development.",
            "For database work, the portfolio shows **PostgreSQL** and **MySQL**, with PostgreSQL used in the Lost & Found Management System."
        ].join("\n");
    }

    if (/\bdevelop full stack|build full stack|full stack applications\b/.test(question)) {
        return [
            "Yes. Vivan has portfolio evidence for full-stack application development.",
            "The clearest example is the **Lost & Found Management System**, which includes frontend work, Python/Flask backend development, PostgreSQL database integration, authentication, and CRUD-style workflows."
        ].join("\n");
    }

    const focusedSkillAnswer = answerFocusedSkillQuestion(data, projectsData, analysis);

    if (focusedSkillAnswer) {
        return focusedSkillAnswer;
    }

    if (analysis?.concepts?.backend) {
        return answerBackendLanguage(data, projectsData);
    }

    return [
        "Vivan's skills are strongest around full-stack fundamentals, practical web development, and clean software engineering habits.",
        formatList("Programming", data.programmingLanguages?.map(skill => `${skill.name} (${skill.level})`)),
        formatList("Frontend", data.frontend),
        formatList("Backend", data.backend),
        formatList("Databases", data.databases),
        formatList("Tools", data.developmentTools),
        formatList("Software engineering", data.softwareEngineering),
        "Overall, the portfolio presents him as a growing developer with hands-on project experience and a strong learning mindset."
    ].filter(Boolean).join("\n");
}

function answerEducation(data, userMessage) {
    const current = data?.currentEducation;
    const question = normalize(userMessage);

    if (!current) {
        return MISSING_INFO_RESPONSE;
    }

    if (/\bcgpa\b/.test(question)) {
        return current.cgpa
            ? `Vivan's CGPA is ${current.cgpa}.`
            : MISSING_INFO_RESPONSE;
    }

    if (/\bwhere|college|university|attend|study\b/.test(question) && !/\bdegree\b/.test(question)) {
        return `Vivan studies at ${current.university}, where he is pursuing ${current.degree} in ${current.branch}.`;
    }

    if (/\bdegree\b/.test(question)) {
        return `Vivan is pursuing a ${current.degree} in ${current.branch}.`;
    }

    if (/\bcomputer science\b|\bcse\b/.test(question)) {
        return `Yes. Vivan is a ${current.branch} student at ${current.university}.`;
    }

    if (/\bgraduate|graduation\b/.test(question)) {
        return `Vivan's expected graduation year is ${current.expectedGraduation}.`;
    }

    if (/\byear\b/.test(question)) {
        return [
            `The portfolio lists Vivan's B.Tech timeline as ${current.startYear}-${current.expectedGraduation}.`,
            "It does not explicitly state his current semester or academic year."
        ].join(" ");
    }

    return [
        `${current.degree} in ${current.branch}`,
        current.university,
        `Expected graduation: ${current.expectedGraduation}`,
        current.status && `Status: ${current.status}`
    ].filter(Boolean).join("\n");
}

function answerContact(data, userMessage) {
    if (!data) {
        return MISSING_INFO_RESPONSE;
    }

    const question = normalize(userMessage);
    const resumePath = data.professional?.resume ?? "assets/Vivan_Pandya_Resume.pdf";

    if (/\bresume|cv|download\b/.test(question)) {
        return `Yes. Vivan's resume is available here: ${resumePath}`;
    }

    return [
        data.personal?.email && `Email: ${data.personal.email}`,
        data.professional?.linkedin && `LinkedIn: ${data.professional.linkedin}`,
        data.professional?.github && `GitHub: ${data.professional.github}`,
        `Portfolio: ${data.professional?.portfolio ?? MISSING_INFO_RESPONSE}`,
        `Resume: ${resumePath}`
    ].filter(Boolean).join("\n") || MISSING_INFO_RESPONSE;
}

function answerCertifications(data) {
    const certifications = data?.certifications;
    const planned = data?.plannedCertifications;

    if ((!Array.isArray(certifications) || certifications.length === 0) && (!Array.isArray(planned) || planned.length === 0)) {
        return MISSING_INFO_RESPONSE;
    }

    return [
        formatCertificationGroup("Completed", certifications?.filter(cert => normalize(cert.status) === "completed")),
        formatCertificationGroup("In Progress", certifications?.filter(cert => normalize(cert.status) === "in progress")),
        formatCertificationGroup("Upcoming", planned)
    ].filter(Boolean).join("\n");
}

function answerAchievements(data, userMessage) {
    const achievements = data?.highlights;
    const question = normalize(userMessage);

    if (!Array.isArray(achievements) || achievements.length === 0) {
        return MISSING_INFO_RESPONSE;
    }

    if (/\b(won|competition|competitions|award|awards|hackathon)\b/.test(question)) {
        return "I don't have that information in Vivan's portfolio.";
    }

    return achievements
        .map(item => [
            `**${item.title}**`,
            item.year && `Year: ${item.year}`,
            item.description
        ].filter(Boolean).join("\n"))
        .join("\n\n");
}

function answerExperience(data, userMessage) {
    const question = normalize(userMessage);
    const experience = [
        ...(data?.professionalExperience ?? []),
        ...(data?.academicExperience ?? []),
        ...(data?.projectExperience ?? [])
    ];

    if (/\b(internship|internships|company|industrial|professional)\b/.test(question)) {
        const professional = data?.professionalExperience ?? [];

        if (professional.length === 0) {
            return [
                "I don't have company or internship experience listed in Vivan's portfolio.",
                "The portfolio shows academic and project-based experience instead."
            ].join("\n");
        }
    }

    if (/\bfreelance\b/.test(question)) {
        return data?.careerStatus?.availableForFreelancing
            ? "The portfolio says Vivan is available for freelancing, but it does not list completed freelance experience."
            : MISSING_INFO_RESPONSE;
    }

    if (/\bpractical\b/.test(question)) {
        const projects = data?.projectExperience ?? [];

        if (projects.length > 0) {
            return [
                "Vivan's practical experience is mainly project-based.",
                projects.map(item => `**${item.title}:** ${item.description}`).join("\n")
            ].join("\n");
        }
    }

    if (!Array.isArray(experience) || experience.length === 0) {
        return MISSING_INFO_RESPONSE;
    }

    return experience
        .map(item => [
            `**${item.role ?? item.title ?? "Experience"}**`,
            item.organization,
            item.duration,
            item.description
        ].filter(Boolean).join("\n"))
        .join("\n\n");
}

function answerAbout(data, userMessage) {
    if (!data) {
        return MISSING_INFO_RESPONSE;
    }

    const personal = data.personal;
    const about = data.about;
    const objective = data.careerObjective;
    const tone = normalize(userMessage);

    if (!personal || !about) {
        return MISSING_INFO_RESPONSE;
    }

    if (/\b(short bio|bio|summary)\b/.test(tone)) {
        return [
            `${personal.fullName} is a ${personal.title} at ${personal.university?.name ?? "PDEU"}.`,
            "His portfolio focuses on full stack development, artificial intelligence, software engineering, and practical project-based learning."
        ].join(" ");
    }

    if (/\b(introduce|introduction)\b/.test(tone)) {
        return [
            `${personal.fullName} is an aspiring software engineer with a strong interest in full stack development and AI-powered applications.`,
            about.medium,
            objective?.short ? `Recruiter takeaway: ${objective.short}` : ""
        ].filter(Boolean).join("\n\n");
    }

    if (/\b(what does|does vivan do)\b/.test(tone)) {
        return [
            `${personal.fullName} is currently a ${personal.title}.`,
            `He focuses on ${listNatural(data.interests?.slice(0, 5))}, and builds practical software projects to strengthen those skills.`,
            objective?.long
        ].filter(Boolean).join("\n\n");
    }

    if (/\b(created this portfolio|portfolio about)\b/.test(tone)) {
        return [
            `This is ${personal.fullName}'s personal portfolio, built to present his technical profile as a ${personal.title}.`,
            "It presents his education, skills, software projects, achievements, certifications, and contact information in one professional experience."
        ].join("\n\n");
    }

    if (/\b(tell me about|overview|profile|biography|about him)\b/.test(tone)) {
        return [
            about.medium,
            objective?.short ? `Career direction: ${objective.short}` : "",
            data.strengths?.length ? `Strengths: ${listNatural(data.strengths.slice(0, 5))}.` : ""
        ].filter(Boolean).join("\n\n");
    }

    return [
        `${personal.fullName} is a ${personal.title} whose portfolio centers on full stack development, artificial intelligence, and software engineering.`,
        about.short
    ].join("\n\n");
}

function answerGreeting(data) {
    const name = data?.personal?.fullName ?? "Vivan";

    return `Hello! I'm Vivan AI. Ask me about ${name}'s projects, skills, education, achievements, experience, or contact details.`;
}

function answerAssistantIdentity(modules, userMessage) {
    const about = modules.about;
    const assistantProject = modules.projects?.projects?.find(project => project.id === "portfolio-ai");
    const style = modules.personality?.communication?.style;
    const name = about?.personal?.fullName ?? "Vivan Pandya";
    const tone = normalize(userMessage);

    if (/\b(created you|who created you)\b/.test(tone)) {
        return [
            "I'm Vivan AI, the conversational assistant built into Vivan Pandya's portfolio.",
            assistantProject?.description ? `The portfolio knowledge describes this assistant as: ${assistantProject.description}` : "",
            "My role is to answer questions about Vivan's projects, skills, education, achievements, certifications, and contact details using the portfolio knowledge base."
        ].filter(Boolean).join("\n\n");
    }

    if (/\b(what can you do)\b/.test(tone)) {
        return [
            `I can help visitors and recruiters understand ${name}'s portfolio quickly.`,
            "I can summarize his profile, explain projects, infer skills from project evidence, answer recruiter-style fit questions, and provide contact links when asked."
        ].join("\n\n");
    }

    if (/\b(introduce yourself|tell me about yourself)\b/.test(tone)) {
        return [
            `I'm Vivan AI, a portfolio assistant for ${name}.`,
            "I answer in a professional, recruiter-friendly way using the structured portfolio knowledge instead of guessing or pulling from outside sources.",
            style ? `My intended communication style is ${stripTrailingPeriod(style)}.` : ""
        ].filter(Boolean).join("\n\n");
    }

    return [
        `I'm Vivan AI, the assistant for ${name}'s portfolio.`,
        "I help explain his background, skills, projects, education, achievements, certifications, and contact information in a clear professional format."
    ].join("\n\n");
}

function answerProfessionalSummary(modules, userMessage) {
    const education = modules.education?.currentEducation;
    const skills = modules.skills;
    const projects = modules.projects?.projects;
    const achievements = modules.achievements?.highlights;
    const experience = [
        ...(modules.experience?.academicExperience ?? []),
        ...(modules.experience?.projectExperience ?? [])
    ];
    const personalityStyle = modules.personality?.communication?.style;
    const strengths = modules.personality?.recruiterMode;
    const skillNames = [
        ...(skills?.programmingLanguages?.map(skill => skill.name) ?? []),
        ...(skills?.frontend ?? []),
        ...(skills?.backend ?? []),
        ...(skills?.databases ?? [])
    ];

    const facts = {
        projects: Array.isArray(projects) && projects.length ? projects.map(project => project.name).join(", ") : "",
        skills: skillNames.length ? unique(skillNames).slice(0, 12).join(", ") : "",
        education: education ? `${education.degree} in ${education.branch} at ${education.university}, expected graduation ${education.expectedGraduation}` : "",
        experience: experience.length ? experience.map(item => item.title).filter(Boolean).slice(0, 3).join(", ") : "",
        achievements: Array.isArray(achievements) && achievements.length ? achievements.map(item => item.title).join(", ") : "",
        personality: personalityStyle || strengths ? "professional communication, learning ability, problem solving, and honest self-representation" : ""
    };
    const tone = normalize(userMessage);

    if (/\b(weakness|weaknesses)\b/.test(tone)) {
        return [
            "The portfolio does not list personal weaknesses directly, so I won't invent one.",
            "A fair recruiter view is that Vivan is still an early-career student: his strongest evidence is project-based, while formal company or internship experience is not listed yet.",
            "That means he is best evaluated for internships, guided junior work, and roles where learning speed matters."
        ].join("\n\n");
    }

    if (/\b(strength|strengths|fast learner|different)\b/.test(tone)) {
        return [
            "Vivan's strengths are practical execution, fast learning, and the ability to connect fundamentals with working projects.",
            facts.skills && `Technically, the portfolio shows ${facts.skills}.`,
            facts.projects && `What makes him stand out is that he has applied those skills in visible projects: ${facts.projects}.`,
            facts.personality && `His profile also emphasizes ${facts.personality}.`
        ].filter(Boolean).join("\n\n");
    }

    if (/\b(recommend|interview)\b/.test(tone)) {
        return [
            "Yes, I would recommend interviewing Vivan for an internship or early software engineering opportunity.",
            facts.education && `He has an active academic base: ${facts.education}.`,
            facts.projects && `His interview discussion points should include ${facts.projects}.`,
            "The interview should focus on fundamentals, project decisions, debugging ability, and how he explains tradeoffs."
        ].filter(Boolean).join("\n\n");
    }

    if (/\b(compare|other students)\b/.test(tone)) {
        return [
            "I can compare only from Vivan's portfolio evidence, not from private information about other students.",
            "Compared with a typical resume-only student profile, Vivan's advantage is visible project work plus a clear interest in full stack development and AI.",
            facts.projects && `His evidence includes ${facts.projects}.`
        ].filter(Boolean).join("\n\n");
    }

    if (/\b(real world|problem|problems|solve)\b/.test(tone)) {
        return [
            "Yes, his portfolio shows an ability to approach practical problems through software projects.",
            "The Lost & Found Management System addresses a concrete coordination problem with reporting, search, authentication, database management, and admin workflow.",
            "That is useful early evidence of problem-solving, although it should be evaluated as student project experience."
        ].join("\n\n");
    }

    if (/\b(value|bring)\b/.test(tone)) {
        return [
            "The value Vivan brings is a practical mix of software fundamentals, project ownership, and willingness to keep learning.",
            facts.skills && `From the portfolio, his usable technical base includes ${facts.skills}.`,
            facts.projects && `He has applied those skills in projects such as ${facts.projects}.`,
            facts.achievements && `His achievements show follow-through through ${facts.achievements}.`
        ].filter(Boolean).join("\n\n");
    }

    if (/\b(contribute|team)\b/.test(tone)) {
        return [
            "Vivan can contribute value as a hands-on learner who has already turned core software concepts into working projects.",
            facts.projects && `His project base includes ${facts.projects}, giving him practical exposure to building and explaining real software.`,
            facts.skills && `He can support development tasks involving ${facts.skills}.`,
            facts.personality && `For a team environment, the strongest signal is ${facts.personality}.`
        ].filter(Boolean).join("\n\n");
    }

    if (/\b(interview|ready|internship)\b/.test(tone)) {
        return [
            "Yes, based on the portfolio, Vivan is a reasonable candidate to interview for an internship or guided early-career role.",
            facts.education && `He is currently pursuing ${facts.education}.`,
            facts.experience && `His readiness comes from project-driven experience: ${facts.experience}.`,
            facts.achievements && `His portfolio also highlights ${facts.achievements}.`,
            "He should be evaluated as a motivated student with practical project exposure, not as someone claiming senior industry experience."
        ].filter(Boolean).join("\n\n");
    }

    if (/\b(fit|role|software engineering|developer)\b/.test(tone)) {
        return [
            "Vivan fits a software engineering learning path because his portfolio connects fundamentals with practical implementation.",
            facts.skills && `His technical base includes ${facts.skills}.`,
            facts.projects && `His projects show applied work through ${facts.projects}.`,
            facts.education && `Academically, he is pursuing ${facts.education}.`
        ].filter(Boolean).join("\n\n");
    }

    if (/\b(select|why select)\b/.test(tone)) {
        return [
            "Vivan is worth selecting if the role values a student developer with visible initiative and practical project work.",
            facts.projects && `His strongest evidence is project-based: ${facts.projects}.`,
            facts.skills && `The portfolio shows useful foundations across ${facts.skills}.`,
            facts.personality && `He also presents the kind of ${facts.personality} that helps in collaborative environments.`
        ].filter(Boolean).join("\n\n");
    }

    if (/\b(hire|why hire|why should)\b/.test(tone)) {
        return [
            "A recruiter should consider Vivan because his portfolio shows learning translated into working software.",
            facts.education && `He brings an active CSE academic foundation: ${facts.education}.`,
            facts.projects && `He has built practical examples such as ${facts.projects}.`,
            facts.skills && `His current technical base includes ${facts.skills}.`,
            "The right expectation is a fast-learning internship candidate who can grow with mentorship and contribute through implementation-focused tasks."
        ].filter(Boolean).join("\n\n");
    }

    return [
        "Vivan is a strong candidate for internship or early-career software roles because his portfolio shows practical execution, not just academic learning.",
        facts.projects && `He demonstrates hands-on development through ${facts.projects}.`,
        facts.skills && `Technically, he has exposure to ${facts.skills}.`,
        facts.education && `He is pursuing ${facts.education}.`,
        facts.experience && `His experience is project-driven: ${facts.experience}.`,
        facts.achievements && `His portfolio highlights ${facts.achievements}.`,
        facts.personality && `His profile emphasizes ${facts.personality}.`,
        "I would position him as a motivated CSE student who can learn quickly, build real projects, and contribute well in a guided engineering environment."
    ].filter(Boolean).join("\n\n") || MISSING_INFO_RESPONSE;
}

function answerFullStackProject(projects) {
    const ranked = projects
        .map(project => ({
            project,
            evidence: getProjectCapabilityEvidence(project),
            score: scoreFullStackProject(project)
        }))
        .sort((a, b) => b.score - a.score);
    const best = ranked[0];

    if (!best || best.score === 0) {
        return MISSING_INFO_RESPONSE;
    }

    return [
        `**${best.project.name}** best demonstrates full stack development in Vivan's portfolio.`,
        `Reasoning: it includes ${best.evidence.join(", ")}.`,
        best.project.description
    ].join("\n");
}

function answerAIProject(projects) {
    const aiProject = projects
        .map(project => ({
            project,
            score: scoreAIProject(project)
        }))
        .sort((a, b) => b.score - a.score)[0]?.project;

    if (!aiProject || scoreAIProject(aiProject) === 0) {
        return MISSING_INFO_RESPONSE;
    }

    const tech = flattenTechStack(aiProject.techStack);

    return [
        `**${aiProject.name}** is the clearest AI-focused project in Vivan's portfolio.`,
        aiProject.description,
        tech.length ? `It uses ${tech.join(", ")}.` : "",
        "It demonstrates AI-oriented product thinking through a local knowledge base and conversational assistant workflow."
    ].filter(Boolean).join("\n");
}

function scoreAIProject(project) {
    const fields = {
        id: normalize(project.id),
        name: normalize(project.name),
        description: normalize(project.description),
        tech: normalize(flattenTechStack(project.techStack).join(" ")),
        features: normalize((project.features ?? []).join(" ")),
        concepts: normalize((project.concepts ?? []).join(" "))
    };
    let score = 0;

    if (fields.id.includes("ai")) score += 4;
    if (/\b(ai|artificial intelligence)\b/.test(fields.name)) score += 4;
    if (/\b(ollama|chatbot|knowledge base)\b/.test(fields.tech)) score += 3;
    if (/\b(ai chatbot|recruiter mode|intent classification|local ai)\b/.test(fields.features)) score += 3;
    if (/\b(artificial intelligence|prompt engineering|context management)\b/.test(fields.concepts)) score += 2;
    if (/\b(ai|assistant|chatbot|ollama|knowledge base)\b/.test(fields.description)) score += 1;

    return score;
}

function answerBackendLanguage(skills, projectsData) {
    const skillLanguages = skills.programmingLanguages?.map(skill => skill.name) ?? [];
    const projectTech = (projectsData?.projects ?? []).flatMap(project => flattenTechStack(project.techStack));
    const backendStack = [...(skills.backend ?? []), ...projectTech];
    const backendLanguages = skillLanguages.filter(language =>
        backendStack.some(item => normalize(item).includes(normalize(language)))
    );
    const frameworks = backendStack.filter(item => /\b(flask|rest api|node|express)\b/.test(normalize(item)));
    const databases = [...(skills.databases ?? []), ...projectTech.filter(item => /\b(sql|postgresql|mysql|mongodb)\b/.test(normalize(item)))];

    if (backendLanguages.length === 0 && frameworks.length === 0) {
        return MISSING_INFO_RESPONSE;
    }

    return [
        `Vivan's backend language shown in the portfolio is **${unique(backendLanguages)[0] ?? "Python"}**.`,
        frameworks.length ? `The backend evidence includes ${unique(frameworks).join(", ")}.` : "",
        databases.length ? `For databases, the portfolio lists ${unique(databases).join(", ")}.` : "",
        "This is inferred from both his skills data and project technology stacks, especially the Lost & Found Management System."
    ].filter(Boolean).join("\n");
}

function answerFocusedSkillQuestion(skills, projectsData, analysis) {
    const question = analysis?.normalizedMessage ?? "";

    if (!question) {
        return "";
    }

    if (/\bbackend language\b|\blanguage.*backend\b|\bbackend.*language\b/.test(question)) {
        return "";
    }

    const catalog = buildSkillCatalog(skills);
    const matchedSkill = catalog
        .map(skill => ({
            ...skill,
            matchedAliasLength: Math.max(
                0,
                ...skill.aliases
                    .filter(alias => containsConcept(question, alias))
                    .map(alias => alias.length)
            )
        }))
        .filter(skill => skill.matchedAliasLength > 0)
        .sort((a, b) => b.matchedAliasLength - a.matchedAliasLength)[0];
    const asksEvidenceQuestion = /^(does|do|can|has|have|is|are)\b/.test(question) ||
        /\b(projects using|experience with|know|code in|uses?|using)\b/.test(question);

    if (!matchedSkill) {
        const categoryAnswer = answerSkillCategoryQuestion(skills, question);

        if (categoryAnswer) {
            return categoryAnswer;
        }

        return asksEvidenceQuestion ? MISSING_INFO_RESPONSE : "";
    }

    const projects = findProjectsUsingTechnology(projectsData?.projects, matchedSkill.name);
    const projectEvidence = projects.length
        ? `Project evidence: ${projects.map(project => project.name).join(", ")}.`
        : "";

    if (/^(does|do|can|has|have|is|are)\b/.test(question)) {
        return [
            `Yes. Vivan has portfolio evidence for **${matchedSkill.name}**.`,
            matchedSkill.detail,
            projectEvidence
        ].filter(Boolean).join("\n");
    }

    if (/\b(projects using|using|uses?)\b/.test(question)) {
        if (projects.length === 0) {
            return `Vivan lists **${matchedSkill.name}** in his skills, but I don't have a project entry that explicitly uses it.`;
        }

        return [
            `The portfolio shows **${matchedSkill.name}** in ${projects.length === 1 ? "this project" : "these projects"}:`,
            projects.map(project => `**${project.name}:** ${project.description}`).join("\n")
        ].join("\n");
    }

    if (/^how\b/.test(question) && projects.length > 0) {
        return [
            `From the portfolio evidence, Vivan learned and applied **${matchedSkill.name}** through hands-on project work.`,
            `The clearest example is ${projects.map(project => project.name).join(", ")}.`
        ].join("\n");
    }

    return [
        `Vivan has working knowledge of **${matchedSkill.name}**.`,
        matchedSkill.detail,
        projectEvidence || "This is listed in his structured skills profile."
    ].filter(Boolean).join("\n");
}

function answerSkillCategoryQuestion(skills, question) {
    const categories = [
        { pattern: /\bfrontend|front end|ui\b/, label: "Frontend", values: skills.frontend },
        { pattern: /\bbackend|back end|server\b/, label: "Backend", values: skills.backend },
        { pattern: /\bdatabase|databases|db\b/, label: "Databases", values: skills.databases },
        { pattern: /\bprogramming languages|languages\b/, label: "Programming languages", values: skills.programmingLanguages?.map(skill => `${skill.name} (${skill.level})`) },
        { pattern: /\bgit|github|version control\b/, label: "Version control", values: skills.versionControl },
        { pattern: /\btools?\b/, label: "Development tools", values: skills.developmentTools },
        { pattern: /\brest api|api\b/, label: "REST/API", values: skills.backend?.filter(value => /\brest|api\b/i.test(value)) }
    ];
    const category = categories.find(item => item.pattern.test(question));

    if (!category || !Array.isArray(category.values) || category.values.length === 0) {
        return "";
    }

    return `For **${category.label}**, Vivan's portfolio lists ${category.values.join(", ")}.`;
}

function buildSkillCatalog(skills) {
    const catalog = [];

    for (const skill of skills.programmingLanguages ?? []) {
        catalog.push({
            name: skill.name,
            aliases: getSkillAliases(skill.name),
            detail: `${skill.name} is listed as ${skill.level}${skill.experience ? ` with experience through ${skill.experience}` : ""}.`
        });
    }

    const groups = [
        ["Frontend", skills.frontend],
        ["Backend", skills.backend],
        ["Database", skills.databases],
        ["Version control", skills.versionControl],
        ["Development tool", skills.developmentTools],
        ["Software engineering", skills.softwareEngineering],
        ["Currently learning", skills.currentlyLearning]
    ];

    for (const [label, values] of groups) {
        for (const value of values ?? []) {
            catalog.push({
                name: value,
                aliases: getSkillAliases(value),
                detail: `${value} appears in the ${label.toLowerCase()} section of his portfolio.`
            });
        }
    }

    return uniqueByName(catalog);
}

function getSkillAliases(value) {
    const normalized = normalize(value);
    const aliases = new Set([normalized]);
    const aliasMap = {
        javascript: ["js"],
        html5: ["html"],
        css3: ["css"],
        postgresql: ["postgres", "postgres sql"],
        "rest api development": ["rest api", "api"],
        github: ["git hub"],
        "responsive web design": ["responsive design"],
        "object oriented programming": ["oop"],
        "visual studio code": ["vscode", "vs code"]
    };

    for (const alias of aliasMap[normalized] ?? []) {
        aliases.add(alias);
    }

    return [...aliases];
}

function findProjectsUsingTechnology(projects, technology) {
    if (!Array.isArray(projects)) {
        return [];
    }

    const aliases = getSkillAliases(technology);

    return projects.filter(project =>
        flattenTechStack(project.techStack).some(tech =>
            aliases.some(alias => normalize(tech) === alias || normalize(tech).includes(alias) || alias.includes(normalize(tech)))
        )
    );
}

function containsConcept(text, concept) {
    const normalizedConcept = normalize(concept);

    if (normalizedConcept.length <= 2) {
        return hasWord(text, normalizedConcept);
    }

    return text.includes(normalizedConcept);
}

function answerPersonality(data) {
    if (!data) {
        return MISSING_INFO_RESPONSE;
    }

    const style = stripTrailingPeriod(data.communication?.style ?? "professional, friendly, confident, and respectful");

    return [
        `Vivan AI's communication style is ${style}.`,
        "For recruiter conversations, the assistant focuses on projects, skills, problem solving, learning mindset, and honest representation without exaggerating experience."
    ].join("\n");
}

function answerGeneral(modules, userMessage) {
    const question = normalize(userMessage);
    const about = modules.about;
    const projects = modules.projects?.projects ?? [];
    const skills = modules.skills;
    const achievements = modules.achievements?.highlights ?? [];

    if (/\b(student|build projects like him|how can i build projects)\b/.test(question)) {
        return [
            "A student can learn from Vivan's approach by building small but complete projects instead of only reading theory.",
            "His portfolio shows a useful path: learn web fundamentals, add backend logic with Python/Flask, connect a database like PostgreSQL, then explain the project clearly.",
            "A good starting project would include one real problem, simple UI, CRUD operations, Git/GitHub, and a short write-up of what you learned."
        ].join("\n\n");
    }

    if (/\b(visitor|highlights|interesting|explore first)\b/.test(question)) {
        return [
            "A visitor should explore Vivan's projects first, because they show how his skills turn into working software.",
            projects.length ? `Highlights: ${projects.map(project => project.name).join(", ")}.` : "",
            skills ? "After that, the skills and education sections give useful context for his technical foundation." : "",
            achievements.length ? `The achievements section reinforces his project progress, including ${achievements.map(item => item.title).join(", ")}.` : ""
        ].filter(Boolean).join("\n\n");
    }

    if (/\b(tell me something|help|random)\b/.test(question) || isLowSignal(question)) {
        return [
            "I can help with Vivan's portfolio.",
            "Try asking about his projects, skills, education, achievements, certifications, experience, recruiter fit, or contact details."
        ].join(" ");
    }

    if (about?.about?.short) {
        return [
            about.about.short,
            "You can also ask me for projects, skills, education, contact details, or a recruiter-style summary."
        ].join("\n\n");
    }

    return "I can help with Vivan's portfolio. Please ask about his projects, skills, education, achievements, experience, certifications, or contact details.";
}

function answerUnknown(userMessage) {
    const question = normalize(userMessage);

    if (isLowSignal(question)) {
        return "I can help with Vivan's portfolio. Please ask about his projects, skills, education, achievements, experience, certifications, or contact details.";
    }

    if (question.includes("android app")) {
        return "I don't have information about an Android app in Vivan's portfolio.";
    }

    return MISSING_INFO_RESPONSE;
}

function findProjectByQuestion(userMessage, projects, analysis) {
    const normalizedQuestion = normalize(userMessage);
    const questionTokens = new Set(tokenize(userMessage));
    const asksProjectFollowUp = asksForTechnology(userMessage) || asksForBestProject(userMessage);
    const genericProjectRequest = /\b(all|list|tell|overview|briefly|projects)\b/.test(normalizedQuestion) &&
        !/\b(do you have|have you built|did you build)\b/.test(normalizedQuestion);

    if (analysis?.projectReference) {
        const referencedProject = projects.find(project => project.id === analysis.projectReference);

        if (referencedProject) {
            return referencedProject;
        }
    }

    if (asksProjectFollowUp) {
        return undefined;
    }

    const matchedProject = projects.find(project => {
        const projectTokens = tokenize(project.name).filter(word => word.length > 2);

        return projectTokens.length > 0 && projectTokens.every(word => questionTokens.has(word));
    });

    if (matchedProject) {
        return matchedProject;
    }

    return genericProjectRequest ? undefined : null;
}

function formatList(label, values) {
    if (!Array.isArray(values) || values.length === 0) {
        return "";
    }

    return `**${label}:** ${values.filter(Boolean).join(", ")}`;
}

function formatCertificationGroup(label, certifications) {
    if (!Array.isArray(certifications) || certifications.length === 0) {
        return "";
    }

    return `**${label}:** ${certifications
        .map(cert => [cert.title, cert.issuer, cert.platform].filter(Boolean).join(" - "))
        .join("; ")}`;
}

function flattenTechStack(techStack) {
    if (!techStack || typeof techStack !== "object") {
        return [];
    }

    return Object.values(techStack).flat().filter(Boolean);
}

function scoreFullStackProject(project) {
    return getProjectCapabilityEvidence(project).length;
}

function getProjectCapabilityEvidence(project) {
    const combined = normalize([
        project.description,
        project.objective,
        ...(project.features ?? []),
        ...flattenTechStack(project.techStack),
        ...(project.concepts ?? [])
    ].join(" "));
    const evidence = [];

    if (/\b(html|css|javascript|frontend|responsive|ui)\b/.test(combined)) {
        evidence.push("frontend/UI work");
    }

    if (/\b(python|flask|backend|rest|api|server)\b/.test(combined)) {
        evidence.push("backend development");
    }

    if (/\b(postgresql|mysql|mongodb|database|sql|sqlite)\b/.test(combined)) {
        evidence.push("database integration");
    }

    if (/\b(authentication|login|secure)\b/.test(combined)) {
        evidence.push("authentication/security");
    }

    if (/\b(crud|reporting|dashboard|management)\b/.test(combined)) {
        evidence.push("application workflow");
    }

    return evidence;
}

function normalize(value) {
    return String(value ?? "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function hasWord(text, term) {
    return new RegExp(`\\b${escapeRegex(term)}\\b`).test(text);
}

function tokenize(value) {
    return normalize(value).split(" ").filter(Boolean);
}

function asksForTechnology(value) {
    return /\b(technology|technologies|tech stack|tech used|tools used|used)\b/.test(normalize(value));
}

function asksForBestProject(value) {
    return /\b(best|strongest|most impressive|which one)\b/.test(normalize(value));
}

function asksWhy(value) {
    return /\b(why|reason|valuable|help|industry|impact)\b/.test(normalize(value));
}

function asksCompare(value) {
    return /\b(compare|difference|versus|vs)\b/.test(normalize(value));
}

function unique(values) {
    return [...new Set(values.filter(Boolean))];
}

function uniqueByName(values) {
    const seen = new Set();

    return values.filter(value => {
        const key = normalize(value.name);

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

function listNatural(values) {
    const items = values?.filter(Boolean) ?? [];

    if (items.length <= 1) {
        return items.join("");
    }

    if (items.length === 2) {
        return `${items[0]} and ${items[1]}`;
    }

    return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function stripTrailingPeriod(value) {
    return String(value ?? "").replace(/\.+$/, "");
}

function isLowSignal(value) {
    const text = normalize(value);

    return text.length === 0 ||
        /^\d+$/.test(text) ||
        text.length <= 3 ||
        /^[a-z]{5,}$/.test(text) && !/\b(help|skills?|projects?|education|contact|resume|random)\b/.test(text);
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
