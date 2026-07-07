/**
 * ============================================================================
 * KNOWLEDGE RETRIEVAL LAYER
 * ============================================================================
 *
 * Loads only the knowledge file(s) required for the detected user intent.
 */

import { INTENT, KNOWLEDGE } from "../utils/constants.js";
import { logError, logInfo, logStage } from "../utils/logger.js";

const MODULE_FILES = Object.freeze({
    about: "about.json",
    achievements: "achievements.json",
    certifications: "certifications.json",
    contact: "contact.json",
    education: "education.json",
    experience: "experience.json",
    faqs: "faqs.json",
    personality: "personality.json",
    projects: "projects.json",
    skills: "skills.json"
});

const INTENT_MODULES = Object.freeze({
    [INTENT.ABOUT]: ["about"],
    [INTENT.SKILLS]: ["skills"],
    [INTENT.PROJECTS]: ["projects"],
    [INTENT.EDUCATION]: ["education"],
    [INTENT.EXPERIENCE]: ["experience"],
    [INTENT.ACHIEVEMENTS]: ["achievements"],
    [INTENT.CERTIFICATIONS]: ["certifications"],
    [INTENT.CONTACT]: ["contact"],
    [INTENT.PERSONALITY]: ["personality"],
    [INTENT.ASSISTANT]: ["about", "projects", "personality"],
    [INTENT.RECRUITER]: ["projects", "skills", "education", "experience", "achievements", "personality"],
    [INTENT.GENERAL]: ["about", "skills", "projects", "education", "experience", "achievements"],
    [INTENT.RESUME]: ["about", "education", "skills", "projects", "experience", "achievements", "certifications", "contact"],
    [INTENT.HIRE]: ["about", "education", "skills", "projects", "experience", "achievements", "contact"],
    [INTENT.GREETING]: ["about"],
    [INTENT.UNKNOWN]: ["faqs"]
});

const jsonCache = new Map();
const SYSTEM_PROMPT = [
    "You are Vivan AI.",
    "You are NOT ChatGPT and not a general assistant.",
    "Answer ONLY from the supplied KNOWLEDGE block.",
    "If the answer is not explicitly present, say exactly: I don't have that information in Vivan's portfolio.",
    "Never invent projects, skills, achievements, education, experience, tools, links, dates, or certifications.",
    "Never use external knowledge or fill gaps from assumptions.",
    "Always summarize professionally instead of dumping raw JSON.",
    "Adapt tone to the user: recruiter-focused for hiring questions, visitor-friendly for general questions, and clear technical explanations for students.",
    "Keep answers concise, factual, confident, friendly, and never arrogant."
].join(" ");

export async function retrieveKnowledge(intent, analysis = null) {
    const startedAt = Date.now();
    const moduleNames = selectModules(intent, analysis);
    const selectedFiles = moduleNames.map(name => MODULE_FILES[name]).filter(Boolean);

    logStage("[KNOWLEDGE] Retrieving intent knowledge", {
        intent,
        selectedFiles
    });

    try {
        const [systemPrompt, loadedModules] = await Promise.all([
            loadSystemPrompt(),
            Promise.all(moduleNames.map(loadModule))
        ]);

        const modules = Object.fromEntries(
            loadedModules.map((value, index) => [moduleNames[index], value])
        );
        const promptText = formatRetrievedKnowledge(modules);

        logInfo("[KNOWLEDGE] Retrieval complete", {
            intent,
            selectedFiles,
            moduleCount: moduleNames.length,
            promptTextLength: promptText.length,
            elapsedMs: Date.now() - startedAt
        });

        return {
            intent,
            selectedFiles,
            systemPrompt,
            modules,
            promptText
        };
    }
    catch (error) {
        logError("[KNOWLEDGE] Retrieval failed", error);
        throw error;
    }
}

function selectModules(intent, analysis) {
    const modules = new Set(INTENT_MODULES[intent] ?? INTENT_MODULES[INTENT.UNKNOWN]);
    const concepts = analysis?.concepts ?? {};

    if (concepts.fullStack || concepts.ai || concepts.best || concepts.compare) {
        modules.add("projects");
    }

    if (concepts.backend || concepts.frontend || concepts.database || concepts.technology) {
        modules.add("skills");

        if (concepts.backend || concepts.database || analysis?.contextTopic === INTENT.PROJECTS || intent === INTENT.PROJECTS) {
            modules.add("projects");
        }
    }

    if (intent === INTENT.SKILLS) {
        modules.add("projects");
    }

    if (intent === INTENT.RECRUITER) {
        ["projects", "skills", "education", "experience", "achievements", "personality"].forEach(module => modules.add(module));
    }

    return [...modules];
}

async function loadSystemPrompt() {
    return SYSTEM_PROMPT;
}

async function loadModule(name) {
    const file = MODULE_FILES[name];

    if (!file) {
        throw new Error(`No knowledge file mapped for module: ${name}`);
    }

    if (jsonCache.has(file)) {
        return jsonCache.get(file);
    }

    const data = await fetchJson(`${KNOWLEDGE.ROOT}${file}`);
    jsonCache.set(file, data);
    return data;
}

async function fetchJson(url) {
    const response = await fetch(url, {
        headers: {
            "Accept": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to load JSON knowledge file ${url}: HTTP ${response.status}`);
    }

    return response.json();
}

function formatRetrievedKnowledge(modules) {
    return Object.entries(modules)
        .map(([name, data]) => `${name.toUpperCase()}:\n${formatModule(name, data)}`)
        .join("\n");
}

function formatModule(name, data) {
    switch (name) {
        case "about":
            return [
                data.personal?.fullName && `Name: ${data.personal.fullName}`,
                data.personal?.title && `Title: ${data.personal.title}`,
                data.personal?.headline && `Headline: ${data.personal.headline}`,
                data.personal?.university && `University: ${data.personal.university.name}, ${data.personal.university.program} ${data.personal.university.branch}, graduating ${data.personal.university.graduationYear}`,
                data.about?.short && `About: ${data.about.short}`,
                data.careerObjective?.short && `Career objective: ${data.careerObjective.short}`,
                Array.isArray(data.interests) && `Interests: ${data.interests.join(", ")}`,
                Array.isArray(data.strengths) && `Strengths: ${data.strengths.join(", ")}`
            ].filter(Boolean).join("\n");

        case "skills":
            return [
                formatNamedList("Programming", data.programmingLanguages?.map(skill => `${skill.name} (${skill.level})`)),
                formatNamedList("Frontend", data.frontend),
                formatNamedList("Backend", data.backend),
                formatNamedList("Databases", data.databases),
                formatNamedList("Version control", data.versionControl),
                formatNamedList("Tools", data.developmentTools),
                formatNamedList("Software engineering", data.softwareEngineering),
                formatNamedList("Currently learning", data.currentlyLearning),
                formatNamedList("Soft skills", data.softSkills)
            ].filter(Boolean).join("\n");

        case "projects":
            return (data.projects ?? [])
                .map(project => [
                    `Project: ${project.name}`,
                    `Status: ${project.status}`,
                    `Type: ${project.type}`,
                    `Description: ${project.description}`,
                    formatNamedList("Tech", flattenTechStack(project.techStack)),
                    formatNamedList("Features", project.features?.slice(0, 5))
                ].filter(Boolean).join(" | "))
                .join("\n");

        case "education":
            return JSON.stringify(data);

        case "experience":
            return JSON.stringify(data);

        case "achievements":
            return JSON.stringify(data);

        case "certifications":
            return JSON.stringify(data);

        case "contact":
            return JSON.stringify(data);

        case "personality":
            return [
                data.communication?.style && `Style: ${data.communication.style}`,
                data.communication?.tone && `Tone: ${data.communication.tone}`,
                data.behavior && `Behavior: ${Object.entries(data.behavior).filter(([, enabled]) => enabled).map(([key]) => key).join(", ")}`,
                data.recruiterMode && `Recruiter mode: ${Object.entries(data.recruiterMode).filter(([, enabled]) => enabled).map(([key]) => key).join(", ")}`
            ].filter(Boolean).join("\n");

        case "faqs":
            return JSON.stringify(data);

        default:
            return JSON.stringify(data);
    }
}

function formatNamedList(label, values) {
    if (!Array.isArray(values) || values.length === 0) {
        return "";
    }

    return `${label}: ${values.filter(Boolean).join(", ")}`;
}

function flattenTechStack(techStack) {
    if (!techStack || typeof techStack !== "object") {
        return [];
    }

    return Object.values(techStack).flat().filter(Boolean);
}
