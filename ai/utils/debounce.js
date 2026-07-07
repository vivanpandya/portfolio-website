/**
 * ============================================================================
 * DEBOUNCE UTILITY
 * ============================================================================
 *
 * Purpose:
 * --------
 * Delays the execution of a function until a specified period has
 * elapsed since the last invocation.
 *
 * Responsibilities:
 * -----------------
 * • Prevent excessive function execution.
 * • Improve UI responsiveness.
 * • Reduce unnecessary API calls.
 * • Optimize event listeners.
 *
 * Common Use Cases:
 * -----------------
 * • Search inputs
 * • Window resize events
 * • Scroll listeners
 * • Auto-save
 * • Live validation
 * • AI input processing
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

import { CHAT_CONFIG } from "./constants.js";
import {
    validateFunction,
    validateNumber
} from "./validators.js";

/**
 * ============================================================================
 * Creates a debounced version of a function.
 * ============================================================================
 *
 * @template {(...args: any[]) => any} T
 *
 * @param {T} callback
 *        Function to debounce.
 *
 * @param {number} [delay=300]
 *        Delay in milliseconds.
 *
 * @returns {(...args: Parameters<T>) => void}
 */
export function debounce(callback, delay = CHAT_CONFIG.DEFAULT_DEBOUNCE_DELAY) {

    validateFunction(callback);

    validateNumber(delay, "Delay");

    let timeoutId = null;

    return function (...args) {

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {

            callback.apply(this, args);

        }, delay);

    };

}

/**
 * ============================================================================
 * Creates a debounced function with immediate execution.
 * ============================================================================
 *
 * Executes immediately on the first call,
 * then ignores subsequent calls until the delay expires.
 *
 * @template {(...args: any[]) => any} T
 *
 * @param {T} callback
 *
 * @param {number} [delay=300]
 *
 * @returns {(...args: Parameters<T>) => void}
 */
export function debounceLeading(callback, delay = CHAT_CONFIG.DEFAULT_DEBOUNCE_DELAY) {

    validateFunction(callback);

    let timeoutId = null;

    return function (...args) {

        const shouldCall = timeoutId === null;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {

            timeoutId = null;

        }, delay);

        if (shouldCall) {

            callback.apply(this, args);

        }

    };

}

/**
 * ============================================================================
 * Cancels an active debounce timer.
 * ============================================================================
 *
 * This helper is useful when components are destroyed
 * or event listeners are removed.
 *
 * @param {number|null} timeoutId
 */
export function cancelDebounce(timeoutId) {

    if (timeoutId !== null) {

        clearTimeout(timeoutId);

    }

}