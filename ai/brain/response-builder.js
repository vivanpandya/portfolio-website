/**
 * ============================================================================
 * RESPONSE BUILDER
 * ============================================================================
 *
 * Purpose:
 * --------
 * Formats and sanitizes AI responses before they are displayed
 * in the chatbot interface.
 *
 * Responsibilities:
 * -----------------
 * • Clean AI responses.
 * • Normalize whitespace.
 * • Remove unnecessary formatting.
 * • Generate response metadata.
 * • Return a standardized response object.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Call AI providers.
 * ✗ Manipulate the DOM.
 * ✗ Build prompts.
 * ✗ Perform network requests.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import {
    MESSAGE_ROLE,
    AI_PROVIDER
} from "../utils/constants.js";

import { timestamp } from "../utils/helpers.js";
import { validateNonEmptyString } from "../utils/validators.js";

/**
 * ============================================================================
 * Builds the final chatbot response.
 * ============================================================================
 *
 * @param {string} aiResponse
 * @returns {Object}
 */
export function buildResponse(aiResponse) {

    validateResponse(aiResponse);

    const cleanedResponse = cleanResponse(aiResponse);

    return {

        role: MESSAGE_ROLE.ASSISTANT,

        content: cleanedResponse,

        timestamp: timestamp(),

        metadata: {

            source: AI_PROVIDER.OLLAMA,

            formatted: true,

            version: "1.0"

        }

    };

}

/**
 * ============================================================================
 * Validates the AI response.
 * ============================================================================
 *
 * @param {string} response
 */
function validateResponse(response) {

    validateNonEmptyString(response, "AI Response");

}

/**
 * ============================================================================
 * Cleans and formats the AI response.
 * ============================================================================
 *
 * @param {string} response
 * @returns {string}
 */
function cleanResponse(response) {

    return response

        // Remove extra spaces
        .replace(/[ \t]+/g, " ")

        // Normalize line breaks
        .replace(/\n{3,}/g, "\n\n")

        // Remove leading/trailing whitespace
        .trim();

}