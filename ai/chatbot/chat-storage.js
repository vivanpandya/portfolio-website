/**
 * ============================================================================
 * CHAT STORAGE
 * ============================================================================
 *
 * Purpose:
 * --------
 * Manages persistent chat history for the AI Portfolio Assistant.
 *
 * Responsibilities:
 * -----------------
 * • Save chat messages.
 * • Load chat history.
 * • Clear stored conversations.
 * • Limit stored message count.
 * • Handle corrupted storage safely.
 *
 * Storage Provider:
 * -----------------
 * Local Storage
 *
 * Future Upgrade:
 * ---------------
 * IndexedDB
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import {
    STORAGE_KEY,
    CHAT_CONFIG
} from "../utils/constants.js";

import {
    validateArray,
    validateChatMessage
} from "../utils/validators.js";

import {
    save,
    load,
    remove
} from "../utils/storage.js";

import {
    logError
} from "../utils/logger.js";

/**
 * ============================================================================
 * Returns all stored chat messages.
 * ============================================================================
 *
 * @returns {Array}
 */
export function loadChatHistory() {

    try {

        const history = load(
            STORAGE_KEY.CHAT_HISTORY,
            []
        );

        return Array.isArray(history)
            ? history
            : [];

    }

    catch (error) {

        logError(
            "Failed to load chat history.",
            error
        );

        return [];

    }

}

/**
 * ============================================================================
 * Saves the complete chat history.
 * ============================================================================
 *
 * @param {Array} messages
 */
export function saveChatHistory(messages) {

    validateArray(
        messages,
        "Chat History"
    );

    try {

        const trimmedMessages = messages.slice(
            -CHAT_CONFIG.MAX_HISTORY
        );

        save(
            STORAGE_KEY.CHAT_HISTORY,
            trimmedMessages
        );

    }

    catch (error) {

        logError(
            "Failed to save chat history.",
            error
        );

    }

}

/**
 * ============================================================================
 * Adds a new message to storage.
 * ============================================================================
 *
 * @param {Object} message
 */
export function addChatMessage(message) {

    validateChatMessage(message);

    const history = loadChatHistory();

    history.push(message);

    saveChatHistory(history);

}

/**
 * ============================================================================
 * Clears the stored chat history.
 * ============================================================================
 */
export function clearChatHistory() {

    remove(
        STORAGE_KEY.CHAT_HISTORY
    );

}

/**
 * ============================================================================
 * Returns the total number of stored messages.
 * ============================================================================
 *
 * @returns {number}
 */
export function getChatHistoryLength() {

    return loadChatHistory().length;

}

/**
 * ============================================================================
 * Checks whether chat history exists.
 * ============================================================================
 *
 * @returns {boolean}
 */
export function hasChatHistory() {

    return getChatHistoryLength() > 0;

}