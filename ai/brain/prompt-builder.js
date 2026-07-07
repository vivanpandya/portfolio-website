/**
 * ============================================================================
 * PROMPT BUILDER
 * ============================================================================
 *
 * Purpose:
 * --------
 * Builds the final prompt that will be sent to the AI provider.
 *
 * Responsibilities:
 * -----------------
 * • Combine system instructions.
 * • Include conversation context.
 * • Include portfolio knowledge.
 * • Include current user message.
 * • Generate the final prompt.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Call any AI provider.
 * ✗ Manipulate the DOM.
 * ✗ Perform network requests.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */


import { classifyIntent } from "./intent-classifier.js";
import { validatePrompt } from "../utils/validators.js";
import { retrieveKnowledge } from "../knowledge/knowledge-loader.js";
import { logInfo, logStage } from "../utils/logger.js";

import {
    isRecruiterMode,
    getRecruiterInstructions
} from "./recruiter-mode.js";


/**
 * ============================================================================
 * Builds the final AI prompt.
 * ============================================================================
 *
 * @param {Object} data
 * @param {string} data.userMessage
 * @param {Array} data.context
 * @param {string} [data.intent]
 *
 * @returns {string}
 */
export async function buildPrompt({

    userMessage,

    context = [],

    intent = null

}) {

    validatePrompt(userMessage);

    const detectedIntent = intent ?? classifyIntent(userMessage, context);

    const conversation = formatConversation(context);
    const knowledge = await retrieveKnowledge(detectedIntent);
    const recruiterPrompt = isRecruiterMode(userMessage)
        ? getRecruiterInstructions()
        : "";

    logStage("[PROMPT BUILDER] Building prompt", {
        userMessageType: typeof userMessage,
        contextType: Array.isArray(context) ? "array" : typeof context,
        contextSize: conversation === "None" ? 0 : conversation.split("\n").length,
        selectedKnowledgeFiles: knowledge.selectedFiles,
        knowledgeLength: knowledge.promptText.length
    });


    const prompt = [
        "SYSTEM:",
        knowledge.systemPrompt.trim(),
        recruiterPrompt ? `RECRUITER_NOTE: ${recruiterPrompt.trim()}` : "",
        `INTENT: ${detectedIntent}`,
        `KNOWLEDGE_FILES: ${knowledge.selectedFiles.join(", ")}`,
        "KNOWLEDGE:",
        knowledge.promptText,
        `RECENT_CONTEXT: ${conversation}`,
        `USER_QUESTION: ${userMessage}`,
        "ANSWER:"
    ].filter(Boolean).join("\n");

    logInfo("[PROMPT BUILDER] Prompt built", {
        outputType: typeof prompt,
        outputLength: prompt.length,
        intent: detectedIntent,
        selectedKnowledgeFiles: knowledge.selectedFiles
    });

    return prompt;



}

/**
 * ============================================================================
 * Converts conversation history into prompt text.
 * ============================================================================
 *
 * @param {Array} context
 *
 * @returns {string}
 */
function formatConversation(context) {

    if (!Array.isArray(context)) {

        return "None";

    }

    if (context.length === 0) {

        return "None";

    }

    return context
        .filter(message => message?.role && message?.content)
        .slice(-4)
        .map(message => `${message.role}: ${message.content}`)
        .join("\n");
}

