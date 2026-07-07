/**
 * ============================================================================
 * LOGGER UTILITY
 * ============================================================================
 *
 * Purpose:
 * --------
 * Centralized logging utility for the AI Portfolio Assistant.
 *
 * Responsibilities:
 * -----------------
 * • Log informational messages.
 * • Log warnings.
 * • Log errors.
 * • Log debug messages.
 * • Add timestamps.
 * • Disable debug logging in production.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Access the DOM.
 * ✗ Call APIs.
 * ✗ Contain business logic.
 * ✗ Throw application errors.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

const DEBUG_MODE = true;

function normalizeLogValue(value) {
    if (value instanceof Error) {
        return {
            name: value.name,
            message: value.message,
            stack: value.stack,
            responseBody: value.responseBody ?? null,
            rawResponse: value.rawResponse ?? null
        };
    }

    return value;
}

/**
 * ============================================================================
 * Creates a formatted timestamp.
 * ============================================================================
 *
 * @returns {string}
 */
function getTimestamp() {

    return new Date().toISOString();

}

/**
 * ============================================================================
 * Logs informational messages.
 * ============================================================================
 *
 * @param {...any} message
 */
export function logInfo(...message) {

    console.info(

        `[INFO] ${getTimestamp()}`,

        ...message.map(normalizeLogValue)

    );

}

/**
 * ============================================================================
 * Logs warning messages.
 * ============================================================================
 *
 * @param {...any} message
 */
export function logWarning(...message) {

    console.warn(

        `[WARNING] ${getTimestamp()}`,

        ...message.map(normalizeLogValue)

    );

}

/**
 * ============================================================================
 * Logs error messages.
 * ============================================================================
 *
 * @param {...any} message
 */
export function logError(...message) {

    console.error(

        `[ERROR] ${getTimestamp()}`,

        ...message.map(normalizeLogValue)

    );

}

/**
 * ============================================================================
 * Logs debug messages.
 * ============================================================================
 *
 * Debug logs are disabled when DEBUG_MODE is false.
 *
 * @param {...any} message
 */
export function logDebug(...message) {

    if (!DEBUG_MODE) {

        return;

    }

    console.debug(

        `[DEBUG] ${getTimestamp()}`,

        ...message.map(normalizeLogValue)

    );

}

export function logStage(stage, details = {}) {
    logInfo(stage, details);
}

/**
 * ============================================================================
 * Logs grouped messages.
 * ============================================================================
 *
 * @param {string} title
 * @param {Function} callback
 */
export function logGroup(title, callback) {

    console.group(

        `[GROUP] ${title}`

    );

    try {

        callback();

    }

    finally {

        console.groupEnd();

    }

}
