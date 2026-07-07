/**
 * ============================================================================
 * FORMATTER UTILITY
 * ============================================================================
 *
 * Purpose:
 * --------
 * Provides reusable formatting utilities used throughout the
 * AI Portfolio Assistant.
 *
 * Responsibilities:
 * -----------------
 * • Format dates.
 * • Format timestamps.
 * • Capitalize text.
 * • Format names.
 * • Format message previews.
 * • Normalize whitespace.
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

/**
 * ============================================================================
 * Capitalizes the first letter of a string.
 * ============================================================================
 *
 * @param {string} text
 * @returns {string}
 */
export function capitalize(text) {

    if (typeof text !== "string") {

        return "";

    }

    if (text.length === 0) {

        return "";

    }

    return text.charAt(0).toUpperCase() + text.slice(1);

}

/**
 * ============================================================================
 * Converts text to Title Case.
 * ============================================================================
 *
 * @param {string} text
 * @returns {string}
 */
export function toTitleCase(text) {

    if (typeof text !== "string") {

        return "";

    }

    return text

        .toLowerCase()

        .split(" ")

        .map(capitalize)

        .join(" ");

}

/**
 * ============================================================================
 * Removes unnecessary whitespace.
 * ============================================================================
 *
 * @param {string} text
 * @returns {string}
 */
export function normalizeWhitespace(text) {

    if (typeof text !== "string") {

        return "";

    }

    return text.replace(/\s+/g, " ").trim();

}

/**
 * ============================================================================
 * Formats a timestamp into local time.
 * ============================================================================
 *
 * @param {number} timestamp
 * @returns {string}
 */
export function formatTime(timestamp) {

    return new Date(timestamp).toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

}

/**
 * ============================================================================
 * Formats a date into a readable string.
 * ============================================================================
 *
 * @param {number|string|Date} date
 * @returns {string}
 */
export function formatDate(date) {

    return new Date(date).toLocaleDateString([], {

        year: "numeric",

        month: "long",

        day: "numeric"

    });

}

/**
 * ============================================================================
 * Truncates text to the specified length.
 * ============================================================================
 *
 * @param {string} text
 * @param {number} maxLength
 *
 * @returns {string}
 */
export function truncate(text, maxLength = 100) {

    if (typeof text !== "string") {

        return "";

    }

    if (text.length <= maxLength) {

        return text;

    }

    return `${text.slice(0, maxLength).trim()}...`;

}

/**
 * ============================================================================
 * Formats a person's full name.
 * ============================================================================
 *
 * @param {string} firstName
 * @param {string} lastName
 *
 * @returns {string}
 */
export function formatName(firstName, lastName) {

    return normalizeWhitespace(

        `${firstName} ${lastName}`

    );

}

/**
 * ============================================================================
 * Formats file size.
 * ============================================================================
 *
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {

    if (

        typeof bytes !== "number" ||

        bytes < 0

    ) {

        return "0 B";

    }

    const units = [

        "B",

        "KB",

        "MB",

        "GB",

        "TB"

    ];

    let size = bytes;

    let unitIndex = 0;

    while (

        size >= 1024 &&

        unitIndex < units.length - 1

    ) {

        size /= 1024;

        unitIndex++;

    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;

}

/**
 * ============================================================================
 * Formats a percentage.
 * ============================================================================
 *
 * @param {number} value
 * @returns {string}
 */
export function formatPercentage(value) {

    if (typeof value !== "number") {

        return "0%";

    }

    return `${value}%`;

}