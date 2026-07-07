/**
 * ============================================================================
 * HELPER UTILITIES
 * ============================================================================
 *
 * Purpose:
 * --------
 * Provides reusable helper functions used throughout the
 * AI Portfolio Assistant.
 *
 * Responsibilities:
 * -----------------
 * • Generate unique IDs.
 * • Create delays.
 * • Deep clone objects.
 * • Check object types.
 * • Safe JSON parsing.
 * • Random selections.
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
 * Generates a unique identifier.
 * ============================================================================
 *
 * @returns {string}
 */
export function generateId() {

    return crypto.randomUUID();

}

/**
 * ============================================================================
 * Creates an async delay.
 * ============================================================================
 *
 * @param {number} milliseconds
 *
 * @returns {Promise<void>}
 */
export function sleep(milliseconds) {

    return new Promise(resolve => {

        setTimeout(resolve, milliseconds);

    });

}

/**
 * ============================================================================
 * Creates a deep clone.
 * ============================================================================
 *
 * @template T
 *
 * @param {T} value
 *
 * @returns {T}
 */
export function deepClone(value) {

    return structuredClone(value);

}

/**
 * ============================================================================
 * Safely parses JSON.
 * ============================================================================
 *
 * @param {string} json
 * @param {*} fallback
 *
 * @returns {*}
 */
export function safeJsonParse(

    json,

    fallback = null

) {

    try {

        return JSON.parse(json);

    }

    catch {

        return fallback;

    }

}

/**
 * ============================================================================
 * Safely converts an object into JSON.
 * ============================================================================
 *
 * @param {*} value
 *
 * @returns {string}
 */
export function safeJsonStringify(value) {

    try {

        return JSON.stringify(value);

    }

    catch {

        return "";

    }

}

/**
 * ============================================================================
 * Returns whether the value is an object.
 * ============================================================================
 *
 * @param {*} value
 *
 * @returns {boolean}
 */
export function isObject(value) {

    return (

        value !== null &&

        typeof value === "object" &&

        !Array.isArray(value)

    );

}

/**
 * ============================================================================
 * Returns whether the value is empty.
 * ============================================================================
 *
 * @param {*} value
 *
 * @returns {boolean}
 */
export function isEmpty(value) {

    if (

        value === null ||

        value === undefined

    ) {

        return true;

    }

    if (

        typeof value === "string"

    ) {

        return value.trim().length === 0;

    }

    if (

        Array.isArray(value)

    ) {

        return value.length === 0;

    }

    if (

        isObject(value)

    ) {

        return Object.keys(value).length === 0;

    }

    return false;

}

/**
 * ============================================================================
 * Returns a random array element.
 * ============================================================================
 *
 * @template T
 *
 * @param {T[]} array
 *
 * @returns {T|null}
 */
export function randomItem(array) {

    if (

        !Array.isArray(array) ||

        array.length === 0

    ) {

        return null;

    }

    const index = Math.floor(

        Math.random() * array.length

    );

    return array[index];

}

/**
 * ============================================================================
 * Creates a timestamp.
 * ============================================================================
 *
 * @returns {number}
 */
export function timestamp() {

    return Date.now();

}

/**
 * ============================================================================
 * Converts unknown errors into readable messages.
 * ============================================================================
 *
 * @param {*} error
 *
 * @returns {string}
 */
export function getErrorMessage(error) {

    if (

        error instanceof Error

    ) {

        return error.message;

    }

    return String(error);

}