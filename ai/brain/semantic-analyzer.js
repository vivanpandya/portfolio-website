/**
 * ============================================================================
 * SEMANTIC ANALYZER
 * ============================================================================
 *
 * Lightweight local semantic analysis for portfolio questions.
 * Uses concept scoring and recent conversation, not single keyword routing.
 */

import { INTENT } from "../utils/constants.js";

const CONCEPTS = Object.freeze({
    greeting: {
        intent: INTENT.GREETING,
        terms: ["hi", "hello", "hey", "greetings", "hii", "heya", "yo"],
        phrases: ["good morning", "good evening", "good afternoon"]
    },
    assistant: {
        intent: INTENT.ASSISTANT,
        terms: ["yourself"],
        phrases: ["who are you", "what are you", "introduce yourself", "tell me about yourself", "what can you do", "who created you"]
    },
    recruiter: {
        intent: INTENT.RECRUITER,
        terms: ["hire", "select", "candidate", "recruit", "recruiter", "internship", "employee", "fit", "convince", "company", "job", "offer", "team", "suitable", "interview", "contribute", "value", "ready", "role", "recommend", "different", "strengths", "weaknesses"],
        phrases: ["why should", "why him", "why hire", "why select", "should i interview", "should i hire", "would he fit", "good candidate", "choose him", "fast learner", "real world problems", "compare with other students", "work in a team"]
    },
    projects: {
        intent: INTENT.PROJECTS,
        terms: ["project", "projects", "application", "app", "built", "developed", "made", "portfolio", "favorite", "hardest", "proud"],
        phrases: ["vivan s projects", "his projects", "what did he build", "things he built", "work he has done", "lost found project", "ai portfolio assistant", "personal portfolio website", "how many projects", "what problems", "what did he learn", "simple words", "help in industry"]
    },
    skills: {
        intent: INTENT.SKILLS,
        terms: ["skill", "skills", "language", "languages", "framework", "tool", "tools", "technical", "stack", "javascript", "python", "java", "sql", "flask", "postgresql", "mysql", "rest", "git", "github", "frontend", "backend", "database", "databases"],
        phrases: ["tech stack", "good at", "knows how to", "does he know", "can he code", "programming languages", "projects using", "experience with"]
    },
    education: {
        intent: INTENT.EDUCATION,
        terms: ["education", "college", "degree", "study", "studying", "attend", "university", "pdeu", "graduation", "graduate", "academic", "cgpa", "year"],
        phrases: ["where does vivan study", "which college", "computer science student", "when will he graduate"]
    },
    experience: {
        intent: INTENT.EXPERIENCE,
        terms: ["experience", "work", "worked", "professional", "internship", "internships", "company", "industrial", "freelance", "practical"],
        phrases: ["professional experience", "industry experience", "internship experience", "worked in any company", "completed any internships", "practical experience", "freelance experience"]
    },
    achievements: {
        intent: INTENT.ACHIEVEMENTS,
        terms: ["achievement", "achievements", "award", "awards", "competition", "competitions", "hackathon", "milestone", "accomplishment", "accomplishments"],
        phrases: []
    },
    about: {
        intent: INTENT.ABOUT,
        terms: ["about", "profile", "intro", "introduction", "summary", "background", "overview", "biography", "bio"],
        phrases: ["who is vivan", "introduce vivan", "tell me about vivan", "tell me about him", "about him", "what does vivan do", "who created this portfolio", "what is this portfolio about", "explain vivan", "short bio"]
    },
    certifications: {
        intent: INTENT.CERTIFICATIONS,
        terms: ["certificate", "certificates", "certification", "certifications", "course"],
        phrases: []
    },
    contact: {
        intent: INTENT.CONTACT,
        terms: ["contact", "email", "linkedin", "github", "phone", "reach", "connect", "resume", "cv", "download"],
        phrases: ["get in touch", "contact details", "reach vivan", "reach him", "connect with him", "download his resume", "download cv"]
    },
    general: {
        intent: INTENT.GENERAL,
        terms: ["help", "visitor", "student", "random", "highlights", "interesting", "explore"],
        phrases: ["tell me something", "what should i explore first", "portfolio highlights", "interesting about vivan", "build projects like him", "how can i build projects"]
    },
    personality: {
        intent: INTENT.PERSONALITY,
        terms: ["personality", "attitude", "mindset", "values", "communication"],
        phrases: ["work style", "soft skill", "learning attitude"]
    }
});

const INTENT_PRIORITY = [
    INTENT.GREETING,
    INTENT.ASSISTANT,
    INTENT.RECRUITER,
    INTENT.CONTACT,
    INTENT.PROJECTS,
    INTENT.SKILLS,
    INTENT.EDUCATION,
    INTENT.ACHIEVEMENTS,
    INTENT.EXPERIENCE,
    INTENT.ABOUT,
    INTENT.GENERAL,
    INTENT.UNKNOWN
];

const COMMON_CORRECTIONS = Object.freeze({
    contavct: "contact",
    contcat: "contact",
    conatct: "contact",
    contct: "contact",
    contect: "contact",
    emial: "email",
    eamil: "email",
    linkedn: "linkedin",
    linkdin: "linkedin",
    githb: "github",
    skil: "skill",
    skils: "skills",
    projct: "project",
    projet: "project",
    experiance: "experience",
    certifcation: "certification"
});

const REASONING_CONCEPTS = Object.freeze({
    fullStack: ["full stack", "end to end", "frontend backend", "complete application"],
    backend: ["backend", "server", "api", "flask", "database language", "backend language"],
    frontend: ["frontend", "ui", "responsive", "html", "css", "client side"],
    database: ["database", "databases", "db", "postgresql", "mysql", "sql"],
    ai: ["ai", "artificial intelligence", "ollama", "chatbot", "machine learning", "ml", "nlp"],
    technology: ["technology", "technologies", "tech stack", "used", "tools used", "built with"],
    best: ["best", "strongest", "most impressive", "which one"],
    compare: ["compare", "difference", "versus", "vs"],
    why: ["why", "reason", "explain", "how does that help"],
    skillEvidence: ["does he know", "can he code", "project using", "projects using", "experience with", "can he build rest", "can he develop full stack"],
    missingProject: ["android app", "banking application"],
    careerExperience: ["internship experience", "worked in any company", "industrial experience", "completed any internships", "freelance experience"],
    unavailableCareer: ["worked at google", "work at google", "worked at microsoft", "work at microsoft", "smart india hackathon"],
    exactLocation: ["where does he live exactly", "exact address", "home address"],
    summaryAll: ["summarize everything", "summary of everything"],
    salary: ["salary", "compensation", "pay"],
    personalLife: ["relationship", "personal life", "religion", "politics", "medical", "phone number", "favorite color", "married"]
});

export function analyzeIntent(message, context = []) {
    const text = normalizeQuery(message);
    const recentText = normalize(context.slice(-6).map(item => item?.content ?? "").join(" "));
    const lastUserText = normalize([...context].reverse().find(item => item?.role === "user")?.content ?? "");
    const scores = scoreIntentConcepts(text);
    const reasoning = scoreReasoningConcepts(text);
    const contextTopic = inferContextTopic(recentText, lastUserText);
    const projectReference = findProjectReference(text, context);
    const isFollowUp = isFollowUpQuestion(text);
    const intent = chooseIntent({ scores, reasoning, contextTopic, isFollowUp });

    return {
        intent,
        scores,
        concepts: reasoning,
        contextTopic,
        recentText,
        projectReference,
        isFollowUp,
        normalizedMessage: text
    };
}

function scoreIntentConcepts(text) {
    const scores = {};

    for (const [name, concept] of Object.entries(CONCEPTS)) {
        let score = 0;

        for (const phrase of concept.phrases) {
            if (text.includes(normalize(phrase))) {
                score += 3;
            }
        }

        for (const term of concept.terms) {
            if (hasWord(text, term)) {
                score += 2;
            }
        }

        if (score > 0) {
            scores[concept.intent] = Math.max(scores[concept.intent] ?? 0, score);
        }
    }

    return scores;
}

function scoreReasoningConcepts(text) {
    const concepts = {};

    for (const [name, patterns] of Object.entries(REASONING_CONCEPTS)) {
        concepts[name] = patterns.some(pattern => {
            const normalized = normalize(pattern);
            return normalized.includes(" ") ? text.includes(normalized) : hasWord(text, normalized);
        });
    }

    return concepts;
}

function chooseIntent({ scores, reasoning, contextTopic, isFollowUp }) {
    if (scores[INTENT.GREETING]) {
        return INTENT.GREETING;
    }

    if (scores[INTENT.ASSISTANT]) {
        return INTENT.ASSISTANT;
    }

    if (reasoning.salary || reasoning.personalLife || reasoning.unavailableCareer || reasoning.exactLocation) {
        return INTENT.UNKNOWN;
    }

    if (reasoning.summaryAll) {
        return INTENT.RESUME;
    }

    if (reasoning.careerExperience) {
        return INTENT.EXPERIENCE;
    }

    if (scores[INTENT.RECRUITER]) {
        return INTENT.RECRUITER;
    }

    if (scores[INTENT.CONTACT]) {
        return INTENT.CONTACT;
    }

    if (scores[INTENT.GENERAL] &&
        scores[INTENT.GENERAL] >= (scores[INTENT.PROJECTS] ?? 0) &&
        !scores[INTENT.SKILLS] &&
        !scores[INTENT.EDUCATION] &&
        !scores[INTENT.EXPERIENCE] &&
        !scores[INTENT.ACHIEVEMENTS] &&
        !scores[INTENT.CERTIFICATIONS]) {
        return INTENT.GENERAL;
    }

    if (reasoning.skillEvidence) {
        return INTENT.SKILLS;
    }

    if (scores[INTENT.PROJECTS] && scores[INTENT.PROJECTS] > (scores[INTENT.ABOUT] ?? 0)) {
        return INTENT.PROJECTS;
    }

    if (reasoning.best && contextTopic === INTENT.SKILLS) {
        return INTENT.SKILLS;
    }

    if (reasoning.fullStack || reasoning.ai || reasoning.best || reasoning.compare || reasoning.missingProject) {
        return INTENT.PROJECTS;
    }

    if (reasoning.backend || reasoning.frontend || reasoning.database || reasoning.technology) {
        if (scores[INTENT.SKILLS] && !scores[INTENT.PROJECTS]) {
            return INTENT.SKILLS;
        }

        if (contextTopic === INTENT.PROJECTS) {
            return INTENT.PROJECTS;
        }

        return scores[INTENT.PROJECTS] ? INTENT.PROJECTS : INTENT.SKILLS;
    }

    const ranked = Object.entries(scores).sort((a, b) => {
        if (b[1] !== a[1]) {
            return b[1] - a[1];
        }

        return INTENT_PRIORITY.indexOf(a[0]) - INTENT_PRIORITY.indexOf(b[0]);
    });

    if (ranked[0]) {
        return ranked[0][0];
    }

    if (isFollowUp && contextTopic) {
        return contextTopic;
    }

    return INTENT.UNKNOWN;
}

function inferContextTopic(recentText, lastUserText = "") {
    if (/\b(project|projects|lost found|ai portfolio assistant|personal portfolio website)\b/.test(lastUserText)) {
        return INTENT.PROJECTS;
    }

    if (/\b(skill|skills|programming|frontend|backend|database|tools)\b/.test(lastUserText)) {
        return INTENT.SKILLS;
    }

    if (/\b(hire|candidate|recruiter|internship|team)\b/.test(lastUserText)) {
        return INTENT.RECRUITER;
    }

    if (!recentText) {
        return null;
    }

    if (/\b(skill|skills|programming|frontend|backend|database|tools)\b/.test(recentText)) {
        return INTENT.SKILLS;
    }

    if (/\b(hire|candidate|recruiter|internship|team)\b/.test(recentText)) {
        return INTENT.RECRUITER;
    }

    if (/\b(project|projects|portfolio website|lost found|ai portfolio assistant|meteor madness)\b/.test(recentText)) {
        return INTENT.PROJECTS;
    }

    return null;
}

function findProjectReference(text, context = []) {
    const projectAliases = [
        { id: "lost-found", patterns: ["lost found", "lost and found", "lost found management"] },
        { id: "portfolio-ai", patterns: ["ai portfolio assistant", "ai assistant", "chatbot", "ollama"] },
        { id: "portfolio-website", patterns: ["portfolio website", "personal portfolio", "website"] }
    ];

    const directMatch = findLatestProjectMention(text, projectAliases);

    if (directMatch) {
        return directMatch.id;
    }

    if (!Array.isArray(context)) {
        return null;
    }

    for (const message of [...context].reverse()) {
        const content = normalize(message?.content ?? "");
        const match = findLatestProjectMention(content, projectAliases);

        if (match) {
            return match.id;
        }
    }

    return null;
}

function findLatestProjectMention(text, projectAliases) {
    let latest = null;

    for (const project of projectAliases) {
        for (const pattern of project.patterns) {
            const index = text.lastIndexOf(pattern);

            if (index !== -1 && (!latest || index > latest.index)) {
                latest = { id: project.id, index };
            }
        }
    }

    return latest ? { id: latest.id } : null;
}

function isFollowUpQuestion(text) {
    return /^(why|how|which|explain more|tell me more|what about|what technologies|would that|does that|is it|and )\b/.test(text) ||
        /\b(that|this|it|one|him|his)\b/.test(text);
}

function hasWord(text, term) {
    const normalized = normalize(term);
    return new RegExp(`\\b${escapeRegex(normalized)}\\b`).test(text);
}

function normalize(value) {
    return String(value ?? "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeQuery(value) {
    return normalize(value)
        .split(" ")
        .map(correctToken)
        .join(" ");
}

function correctToken(token) {
    if (COMMON_CORRECTIONS[token]) {
        return COMMON_CORRECTIONS[token];
    }

    if (token.length < 4) {
        return token;
    }

    const canonicalTokens = ["contact", "email", "linkedin", "github", "projects", "project", "skills", "education", "certification", "achievement", "experience"];

    if (canonicalTokens.includes(token)) {
        return token;
    }

    const closeMatch = canonicalTokens.find(candidate => levenshteinDistance(token, candidate) <= 2);

    return closeMatch ?? token;
}

function levenshteinDistance(a, b) {
    if (!a || !b) {
        return Math.max(a.length, b.length);
    }

    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }

    return dp[a.length][b.length];
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
