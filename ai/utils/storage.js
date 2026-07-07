/**
 * ============================================================================
 * STORAGE UTILITY
 * ============================================================================
 *
 * Purpose:
 * --------
 * Provides a centralized wrapper around browser localStorage.
 *
 * Responsibilities:
 * -----------------
 * • Save data.
 * • Load data.
 * • Remove data.
 * • Clear storage.
 * • Safe JSON parsing.
 * • Safe JSON serialization.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Access the DOM.
 * ✗ Perform network requests.
 * ✗ Contain business logic.
 * ✗ Depend on chatbot modules.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import {

    safeJsonParse,
    safeJsonStringify

} from "./helpers.js";

/**
 * ============================================================================
 * Saves a value to localStorage.
 * ============================================================================
 *
 * @param {string} key
 * @param {*} value
 *
 * @returns {boolean}
 */
export function save(key, value) {

    try {

        localStorage.setItem(

            key,

            safeJsonStringify(value)

        );

        return true;

    }

    catch {

        return false;

    }

}

/**
 * ============================================================================
 * Loads a value from localStorage.
 * ============================================================================
 *
 * @param {string} key
 * @param {*} defaultValue
 *
 * @returns {*}
 */
export function load(

    key,

    defaultValue = null

) {

    try {

        const value = localStorage.getItem(key);

        if (value === null) {

            return defaultValue;

        }

        return safeJsonParse(

            value,

            defaultValue

        );

    }

    catch {

        return defaultValue;

    }

}

/**
 * ============================================================================
 * Removes a value from localStorage.
 * ============================================================================
 *
 * @param {string} key
 */
export function remove(key) {

    localStorage.removeItem(key);

}

/**
 * ============================================================================
 * Clears all localStorage.
 * ============================================================================
 */
export function clear() {

    localStorage.clear();

}

/**
 * ============================================================================
 * Checks whether a key exists.
 * ============================================================================
 *
 * @param {string} key
 *
 * @returns {boolean}
 */
export function exists(key) {

    return localStorage.getItem(key) !== null;

}

/**
 * ============================================================================
 * Returns all localStorage keys.
 * ============================================================================
 *
 * @returns {string[]}
 */
export function keys() {

    return Object.keys(localStorage);

}

/**
 * ============================================================================
 * Returns total number of stored entries.
 * ============================================================================
 *
 * @returns {number}
 */
export function size() {

    return localStorage.length;

}