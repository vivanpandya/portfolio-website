/**
 * ============================================================================
 * SANITIZER UTILITY
 * ============================================================================
 *
 * Purpose:
 * --------
 * Provides reusable sanitization utilities for user input
 * and AI-generated content.
 *
 * Responsibilities:
 * -----------------
 * • Escape HTML.
 * • Sanitize plain text.
 * • Validate URLs.
 * • Normalize whitespace.
 * • Prevent XSS attacks.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Access the DOM.
 * ✗ Perform network requests.
 * ✗ Contain business logic.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

/**
 * ============================================================================
 * Escapes HTML special characters.
 * ============================================================================
 *
 * @param {string} text
 * @returns {string}
 */
export function escapeHtml(text) {

    if (typeof text !== "string") {

        return "";

    }

    const replacements = {

        "&": "&amp;",

        "<": "&lt;",

        ">": "&gt;",

        "\"": "&quot;",

        "'": "&#39;"

    };

    return text.replace(

        /[&<>"']/g,

        character => replacements[character] ?? character

    );

}

/**
 * ============================================================================
 * Removes unnecessary whitespace.
 * ============================================================================
 *
 * @param {string} text
 *
 * @returns {string}
 */
export function sanitizeText(text) {

    if (typeof text !== "string") {

        return "";

    }

    return text

        .replace(/\s+/g, " ")

        .trim();

}

/**
 * ============================================================================
 * Removes HTML tags.
 * ============================================================================
 *
 * @param {string} text
 *
 * @returns {string}
 */
export function stripHtml(text) {

    if (typeof text !== "string") {

        return "";

    }

    return text.replace(

        /<[^>]*>/g,

        ""

    );

}

/**
 * ============================================================================
 * Sanitizes user input.
 * ============================================================================
 *
 * @param {string} input
 *
 * @returns {string}
 */
export function sanitizeInput(input) {

    return sanitizeText(

        stripHtml(input)

    );

}

/**
 * ============================================================================
 * Checks whether a URL is valid.
 * ============================================================================
 *
 * @param {string} url
 *
 * @returns {boolean}
 */
export function isValidUrl(url) {

    try {

        new URL(url);

        return true;

    }

    catch {

        return false;

    }

}

/**
 * ============================================================================
 * Sanitizes URLs.
 * ============================================================================
 *
 * @param {string} url
 *
 * @returns {string}
 */
export function sanitizeUrl(url) {

    if (!isValidUrl(url)) {

        return "";

    }

    const parsed = new URL(url);

    if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) {

        return "";

    }

    return parsed.href;

}

/**
 * ============================================================================
 * Removes control characters.
 * ============================================================================
 *
 * @param {string} text
 *
 * @returns {string}
 */
export function removeControlCharacters(text) {

    if (typeof text !== "string") {

        return "";

    }

    return text.replace(

        /[\u0000-\u001F\u007F]/g,

        ""

    );

}

/**
 * ============================================================================
 * Fully sanitizes plain text.
 * ============================================================================
 *
 * @param {string} text
 *
 * @returns {string}
 */
export function sanitize(text) {

    return sanitizeInput(

        removeControlCharacters(text)

    );

}
