/**
 * ============================================================================
 * AI ENGINE
 * ============================================================================
 *
 * Purpose:
 * --------
 * Central orchestration layer for the AI Portfolio Assistant.
 *
 * Responsibilities:
 * -----------------
 * • Validate incoming user messages.
 * • Retrieve conversation context.
 * • Build the final AI prompt.
 * • Request an AI-generated response.
 * • Format the final response for the UI.
 *
 * This file coordinates all AI modules but contains
 * no provider-specific or UI-specific logic.
 *
 * Workflow:
 * ---------
 * User Message
 *      │
 *      ▼
 * Message Validator
 *      │
 *      ▼
 * Context Manager
 *      │
 *      ▼
 * Prompt Builder
 *      │
 *      ▼
 * AI Service
 *      │
 *      ▼
 * Response Builder
 *      │
 *      ▼
 * Final Response
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Access the DOM
 * ✗ Call Ollama directly
 * ✗ Read knowledge files
 * ✗ Build provider requests
 * ✗ Handle networking
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import { validatePrompt } from "../utils/validators.js";
import { sanitize } from "../utils/sanitizer.js";
import { logError, logInfo, logStage } from "../utils/logger.js";

import { getConversationContext } from "./context-manager.js";
import { analyzeIntent } from "./semantic-analyzer.js";
import { buildPrompt } from "./prompt-builder.js";
import { retrieveKnowledge } from "../knowledge/knowledge-loader.js";
import { buildGroundedAnswer } from "./rag-answerer.js";
import { generateAIResponse } from "../api/ai-service.js";
import { buildResponse } from "./response-builder.js";

/**
 * ============================================================================
 * Processes a user message and returns the final AI response.
 * ============================================================================
 *
 * @param {string} userMessage
 * User input received from the chatbot UI.
 *
 * @returns {Promise<string>}
 * Final formatted AI response.
 */
export async function processUserMessage(userMessage) {

    try {

        const sanitizedMessage = sanitize(userMessage);

        logStage("[AI ENGINE] Entering processUserMessage", {
            inputType: typeof userMessage
        });

        logInfo("[AI ENGINE] Processing message", {
            originalLength: userMessage?.length ?? 0,
            sanitizedLength: sanitizedMessage.length
        });

        // Validate user input
        validatePrompt(sanitizedMessage);

        // Retrieve current conversation context
        const context = getConversationContext();
        const semanticAnalysis = analyzeIntent(sanitizedMessage, context);
        const intent = semanticAnalysis.intent;
        const retrievedKnowledge = await retrieveKnowledge(intent, semanticAnalysis);
        const groundedAnswer = buildGroundedAnswer({
            intent,
            userMessage: sanitizedMessage,
            knowledge: retrievedKnowledge,
            analysis: semanticAnalysis
        });

        if (groundedAnswer) {

            logInfo("[AI ENGINE] Grounded RAG response generated", {
                intent,
                concepts: semanticAnalysis.concepts,
                selectedKnowledgeFiles: retrievedKnowledge.selectedFiles,
                responseLength: groundedAnswer.length
            });

            return buildResponse(groundedAnswer);

        }

        // Build the final AI prompt
        const prompt = await buildPrompt({

            userMessage: sanitizedMessage,

            context,

            intent

        });

        logInfo("[AI ENGINE] Prompt generated", {
            promptLength: prompt.length,
            contextSize: context.length
        });

        // Generate AI response
        const aiResponse = await generateAIResponse(prompt);

        logInfo("[AI ENGINE] Response generated", {
            responseLength: aiResponse.length,
            preview: aiResponse.slice(0, 200)
        });

        // Format response before sending to UI
        const response = buildResponse(aiResponse);

        logInfo("[AI ENGINE] Response object built", {
            outputType: typeof response,
            contentType: typeof response.content,
            contentLength: response.content.length
        });

        return response;

    }

    catch (error) {

        logError("[AI ENGINE] Processing failed", error);

        throw error;

    }

}
