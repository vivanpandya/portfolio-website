/**
 * ============================================================================
 * OLLAMA CLIENT
 * ============================================================================
 *
 * Purpose:
 * --------
 * Handles all communication with the local Ollama server.
 *
 * Responsibilities:
 * -----------------
 * • Prepare requests for the Ollama API.
 * • Send prompts using the generic HTTP request service.
 * • Validate AI responses.
 * • Return clean AI-generated text.
 * • Isolate all Ollama-specific logic.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Build prompts
 * ✗ Manage conversation history
 * ✗ Manipulate the UI
 * ✗ Contain generic networking logic
 *
 * Dependencies:
 * -------------
 * • api-config.js
 * • request.js
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import { AI_CONFIG } from "./api-config.js";
import { sendRequest } from "./request.js";
import { logError, logInfo, logStage } from "../utils/logger.js";
import { validateNonEmptyString, validatePrompt } from "../utils/validators.js";

/**
 * ============================================================================
 * Generates an AI response using the configured Ollama model.
 * ============================================================================
 *
 * @param {string} prompt
 * Final prompt prepared by the Prompt Builder.
 *
 * @returns {Promise<string>}
 * Clean AI response.
 */
export async function generateOllamaResponse(prompt) {

    validatePrompt(prompt);

    const payload = buildRequestPayload(prompt);
    const startedAt = Date.now();

    logStage("[OLLAMA CLIENT] Entering generateOllamaResponse", {
        inputType: typeof prompt,
        promptLength: prompt.length
    });

    logInfo("[OLLAMA CLIENT] Sending request", {
        endpoint: AI_CONFIG.endpoint,
        model: AI_CONFIG.model,
        promptLength: prompt.length,
        stream: AI_CONFIG.stream
    });

    try {

        const httpResponse = await sendRequest({

            url: AI_CONFIG.endpoint,

            method: "POST",

            timeout: AI_CONFIG.timeout,

            headers: {

                "Content-Type": "application/json"

            },

            body: payload

        });

        logInfo("[OLLAMA CLIENT] HTTP response received", {
            status: httpResponse.status,
            statusText: httpResponse.statusText,
            contentType: httpResponse.contentType,
            dataType: typeof httpResponse.data,
            responseObject: httpResponse.data
        });

        const data = normalizeOllamaResponse(httpResponse);

        validateResponse(data);

        const responseText = data.response.trim();

        logInfo("[OLLAMA CLIENT] Response received", {
            model: AI_CONFIG.model,
            responseObject: data,
            responseLength: responseText.length,
            preview: responseText.slice(0, 240),
            generationTimeMs: Date.now() - startedAt,
            promptEvalCount: data.prompt_eval_count ?? null,
            evalCount: data.eval_count ?? null,
            ollamaTotalDurationNs: data.total_duration ?? null
        });

        return responseText;

    }

    catch (error) {

        logError("[OLLAMA CLIENT] Request failed", {
            endpoint: AI_CONFIG.endpoint,
            model: AI_CONFIG.model,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : null,
            responseBody: error?.responseBody || null,
            rawResponse: error?.rawResponse || null
        });

        throw error;

    }

}

/**
 * ============================================================================
 * Builds the request payload for Ollama.
 * ============================================================================
 *
 * @param {string} prompt
 * @returns {Object}
 */
function buildRequestPayload(prompt) {

    return {

        model: AI_CONFIG.model,

        prompt,

        stream: AI_CONFIG.stream,

        options: {

            temperature: AI_CONFIG.temperature,

            top_p: AI_CONFIG.topP,

            top_k: AI_CONFIG.topK,

            repeat_penalty: AI_CONFIG.repeatPenalty,

            num_predict: AI_CONFIG.maxTokens,

            num_ctx: AI_CONFIG.contextWindow

        }

    };

}

/**
 * ============================================================================
 * Normalizes Ollama JSON or accidental streaming NDJSON into one response object.
 * ============================================================================
 *
 * @param {Object} httpResponse
 * @returns {Object}
 */
function normalizeOllamaResponse(httpResponse) {

    const data = httpResponse?.data;

    if (data && typeof data === "object" && !Array.isArray(data)) {

        return data;

    }

    if (typeof data === "string" && data.trim()) {

        const streamedResponse = parseStreamingResponse(data);

        if (streamedResponse) {

            return streamedResponse;

        }

    }

    const error = new Error("Invalid Ollama response: expected parsed JSON object.");
    error.name = "ProviderResponseError";
    error.rawResponse = httpResponse?.rawText ?? data ?? null;
    throw error;

}

/**
 * ============================================================================
 * Supports Ollama NDJSON if stream is accidentally enabled by config drift.
 * ============================================================================
 *
 * @param {string} rawText
 * @returns {Object|null}
 */
function parseStreamingResponse(rawText) {

    const lines = rawText
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    if (lines.length === 0) {

        return null;

    }

    const chunks = [];
    let lastChunk = null;

    for (const line of lines) {

        try {

            const chunk = JSON.parse(line);

            if (!chunk || typeof chunk !== "object" || typeof chunk.response !== "string") {

                return null;

            }

            chunks.push(chunk.response);
            lastChunk = chunk;

        }

        catch {

            return null;

        }

    }

    return {

        ...lastChunk,

        response: chunks.join(""),

        streamed: true

    };

}

/**
 * ============================================================================
 * Validates the response returned by Ollama.
 * ============================================================================
 *
 * @param {Object} data
 */
function validateResponse(data) {

    logStage("[OLLAMA CLIENT] Validating response", {
        inputType: Array.isArray(data) ? "array" : typeof data,
        responseObject: data
    });

    if (!data || typeof data !== "object" || Array.isArray(data)) {

        const error = new Error("Invalid Ollama response: expected an object.");
        error.name = "ProviderResponseError";
        error.rawResponse = data;
        throw error;

    }

    if (!Object.prototype.hasOwnProperty.call(data, "response")) {

        const error = new Error("Invalid Ollama response: missing 'response' field.");
        error.name = "ProviderResponseError";
        error.rawResponse = data;
        throw error;

    }

    if (typeof data.response !== "string") {

        const error = new TypeError("Invalid Ollama response: 'response' must be a string.");
        error.name = "ProviderResponseError";
        error.rawResponse = data;
        throw error;

    }

    validateNonEmptyString(data.response, "Ollama response");

    logInfo("[OLLAMA CLIENT] Validation result", {
        valid: true,
        done: data.done ?? null,
        responseLength: data.response.trim().length
    });

}
