/**
 * ============================================================================
 * VALIDATORS
 * ============================================================================
 *
 * Purpose:
 * --------
 * Centralized validation utilities for the AI Portfolio Assistant.
 *
 * Responsibilities:
 * -----------------
 * • Validate strings.
 * • Validate arrays.
 * • Validate objects.
 * • Validate chat messages.
 * • Validate message roles.
 * • Validate prompts.
 * • Validate URLs.
 * • Validate numbers.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Access the DOM.
 * ✗ Call APIs.
 * ✗ Perform network requests.
 * ✗ Contain business logic.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import { MESSAGE_ROLE } from "./constants.js";

/**
 * ============================================================================
 * Validates a string.
 * ============================================================================
 *
 * @param {*} value
 * @param {string} fieldName
 */
export function validateString(value, fieldName = "Value") {

    if (typeof value !== "string") {

        throw new TypeError(`${fieldName} must be a string.`);

    }

}

/**
 * ============================================================================
 * Validates a non-empty string.
 * ============================================================================
 *
 * @param {*} value
 * @param {string} fieldName
 */
export function validateNonEmptyString(

    value,

    fieldName = "Value"

) {

    validateString(value, fieldName);

    if (value.trim().length === 0) {

        throw new Error(`${fieldName} cannot be empty.`);

    }

}

/**
 * ============================================================================
 * Validates an array.
 * ============================================================================
 *
 * @param {*} value
 * @param {string} fieldName
 */
export function validateArray(value, fieldName = "Array") {

    if (!Array.isArray(value)) {

        throw new TypeError(`${fieldName} must be an array.`);

    }

}

/**
 * ============================================================================
 * Validates an object.
 * ============================================================================
 *
 * @param {*} value
 * @param {string} fieldName
 */
export function validateObject(value, fieldName = "Object") {

    if (

        value === null ||

        typeof value !== "object" ||

        Array.isArray(value)

    ) {

        throw new TypeError(`${fieldName} must be an object.`);

    }

}

/**
 * ============================================================================
 * Validates a number.
 * ============================================================================
 *
 * @param {*} value
 * @param {string} fieldName
 */
export function validateNumber(value, fieldName = "Number") {

    if (

        typeof value !== "number" ||

        Number.isNaN(value)

    ) {

        throw new TypeError(`${fieldName} must be a valid number.`);

    }

}

/**
 * ============================================================================
 * Validates a message role.
 * ============================================================================
 *
 * @param {string} role
 */
export function validateMessageRole(role) {

    const validRoles = [

        MESSAGE_ROLE.USER,

        MESSAGE_ROLE.ASSISTANT,

        MESSAGE_ROLE.SYSTEM

    ];

    if (!validRoles.includes(role)) {

        throw new Error("Invalid message role.");

    }

}

/**
 * ============================================================================
 * Validates a chat message.
 * ============================================================================
 *
 * @param {Object} message
 */
export function validateChatMessage(message) {

    validateObject(message, "Message");

    validateMessageRole(message.role);

    validateNonEmptyString(

        message.content,

        "Message content"

    );

}

/**
 * ============================================================================
 * Validates prompt text.
 * ============================================================================
 *
 * @param {string} prompt
 */
export function validatePrompt(prompt) {

    validateNonEmptyString(

        prompt,

        "Prompt"

    );

}

/**
 * ============================================================================
 * Validates a URL.
 * ============================================================================
 *
 * @param {string} url
 */
export function validateUrl(url) {

    validateNonEmptyString(url, "URL");

    try {

        new URL(url);

    }

    catch {

        throw new Error("Invalid URL.");

    }

}

/**
 * ============================================================================
 * Validates a callback function.
 * ============================================================================
 *
 * @param {*} callback
 */
export function validateFunction(callback) {

    if (typeof callback !== "function") {

        throw new TypeError(

            "Callback must be a function."

        );

    }

}