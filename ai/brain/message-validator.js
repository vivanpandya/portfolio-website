/**
 * ============================================================================
 * MESSAGE VALIDATOR
 * ============================================================================
 *
 * Purpose:
 * --------
 * Validates incoming user messages before they are processed
 * by the AI Engine.
 *
 * Responsibilities:
 * -----------------
 * • Validate message type.
 * • Remove unnecessary whitespace.
 * • Prevent empty messages.
 * • Enforce maximum message length.
 * • Prevent invalid input values.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Call any AI provider.
 * ✗ Manipulate the DOM.
 * ✗ Read knowledge files.
 * ✗ Build prompts.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import {
    validateNonEmptyString,
    validateString
} from "../utils/validators.js";
import { CHAT_CONFIG } from "../utils/constants.js";

/**
 * Maximum allowed message length.
 */
const MAX_MESSAGE_LENGTH = CHAT_CONFIG.MAX_USER_MESSAGE_LENGTH;

/**
 * ============================================================================
 * Validates a user message.
 * ============================================================================
 *
 * @param {string} message
 * @returns {string}
 *
 * @throws {Error}
 */
export function validateUserMessage(message) {

    validateString(message, "Message");

    // Remove extra whitespace
    const cleanedMessage = message.trim();

    validateNonEmptyString(cleanedMessage, "Message");

    // Maximum length validation
    if (cleanedMessage.length > MAX_MESSAGE_LENGTH) {

        throw new Error(

            `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`

        );

    }

    // Reject invalid values
    if (

        cleanedMessage === "null" ||

        cleanedMessage === "undefined"

    ) {

        throw new Error("Invalid message.");

    }

    return cleanedMessage;

}