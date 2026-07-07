/**
 * ============================================================================
 * CONTEXT MANAGER
 * ============================================================================
 *
 * Purpose:
 * --------
 * Manages the conversation context for the AI Portfolio Assistant.
 *
 * Responsibilities:
 * -----------------
 * • Store conversation history.
 * • Retrieve conversation context.
 * • Add new messages.
 * • Limit conversation memory.
 * • Clear conversation history.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Call any AI provider.
 * ✗ Manipulate the DOM.
 * ✗ Build prompts.
 * ✗ Read knowledge files.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */
import {
    CHAT_CONFIG
} from "../utils/constants.js";

import { timestamp } from "../utils/helpers.js";
import {
    validateMessageRole,
    validateNonEmptyString
} from "../utils/validators.js";

/**
 * In-memory conversation history.
 *
 * Each object:
 * {
 *    role: "user" | "assistant",
 *    content: string,
 *    timestamp: number
 * }
 */
let conversationHistory = [];

/**
 * ============================================================================
 * Adds a message to the conversation history.
 * ============================================================================
 *
 * @param {"user"|"assistant"} role
 * @param {string} content
 */
export function addMessage(role, content) {

    validateMessageRole(role);

    validateNonEmptyString(
        content,
        "Message"
    );

    conversationHistory.push({

        role,

        content,

        timestamp: timestamp()

    });

    trimConversation();

}

/**
 * ============================================================================
 * Returns the current conversation history.
 * ============================================================================
 *
 * @returns {Array}
 */
export function getConversationContext() {

    return [...conversationHistory];

}

/**
 * ============================================================================
 * Replaces conversation history with validated restored messages.
 * ============================================================================
 *
 * @param {Array} messages
 */
export function hydrateConversationContext(messages) {

    if (!Array.isArray(messages)) {

        conversationHistory = [];
        return;

    }

    conversationHistory = messages
        .filter(message => {

            try {

                validateMessageRole(message?.role);
                validateNonEmptyString(message?.content, "Message");
                return true;

            }

            catch {

                return false;

            }

        })
        .slice(-CHAT_CONFIG.MAX_CONTEXT_MESSAGES)
        .map(message => ({

            role: message.role,

            content: message.content,

            timestamp: typeof message.timestamp === "number"
                ? message.timestamp
                : timestamp()

        }));

}

/**
 * ============================================================================
 * Clears the entire conversation history.
 * ============================================================================
 */
export function clearConversationContext() {

    conversationHistory = [];

}

/**
 * ============================================================================
 * Returns the total number of stored messages.
 * ============================================================================
 *
 * @returns {number}
 */
export function getConversationLength() {

    return conversationHistory.length;

}

/**
 * ============================================================================
 * Returns the last message.
 * ============================================================================
 *
 * @returns {Object|null}
 */
export function getLastMessage() {

    if (conversationHistory.length === 0) {

        return null;

    }

    return conversationHistory[
        conversationHistory.length - 1
    ];

}

/**
 * ============================================================================
 * Trims conversation history to the configured limit.
 * ============================================================================
 */
function trimConversation() {

    if (conversationHistory.length <= CHAT_CONFIG.MAX_CONTEXT_MESSAGES) {

        return;

    }

    conversationHistory.splice(

        0,

        conversationHistory.length - CHAT_CONFIG.MAX_CONTEXT_MESSAGES

    );

}
