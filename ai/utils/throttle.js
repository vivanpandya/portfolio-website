/**
 * ============================================================================
 * THROTTLE UTILITY
 * ============================================================================
 *
 * Purpose:
 * --------
 * Limits how frequently a function can be executed.
 *
 * Responsibilities:
 * -----------------
 * • Prevent excessive function execution.
 * • Improve UI performance.
 * • Optimize high-frequency events.
 *
 * Common Use Cases:
 * -----------------
 * • Scroll events
 * • Mouse move events
 * • Window resize events
 * • Cursor animations
 * • Drag events
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
 * Creates a throttled version of a function.
 * ============================================================================
 *
 * @template {(...args: any[]) => any} T
 *
 * @param {T} callback
 * @param {number} [delay=100]
 *
 * @returns {(...args: Parameters<T>) => void}
 */
export function throttle(callback, delay = CHAT_CONFIG.DEFAULT_THROTTLE_DELAY) {

    validateFunction(callback);

    validateNumber(delay, "Delay");

    let lastExecution = 0;

    return function (...args) {

        const now = Date.now();

        if (now - lastExecution >= delay) {

            lastExecution = now;

            callback.apply(this, args);

        }

    };

}

/**
 * ============================================================================
 * Creates a throttle that executes both at the beginning and end.
 * ============================================================================
 *
 * @template {(...args: any[]) => any} T
 *
 * @param {T} callback
 * @param {number} [delay=100]
 *
 * @returns {(...args: Parameters<T>) => void}
 */
export function throttleTrailing(callback, delay = CHAT_CONFIG.DEFAULT_THROTTLE_DELAY) {

    validateFunction(callback);

    validateNumber(delay, "Delay");

    let lastExecution = 0;

    let timeoutId = null;

    return function (...args) {

        const now = Date.now();

        const remaining = delay - (now - lastExecution);

        if (remaining <= 0) {

            clearTimeout(timeoutId);

            timeoutId = null;

            lastExecution = now;

            callback.apply(this, args);

            return;

        }

        if (!timeoutId) {

            timeoutId = setTimeout(() => {

                lastExecution = Date.now();

                timeoutId = null;

                callback.apply(this, args);

            }, remaining);

        }

    };

}