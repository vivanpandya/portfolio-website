/**
 * ============================================================================
 * TYPING INDICATOR
 * ============================================================================
 *
 * Purpose:
 * --------
 * Manages the chatbot typing indicator displayed while the AI
 * is generating a response.
 *
 * Responsibilities:
 * -----------------
 * • Show the typing indicator.
 * • Hide the typing indicator.
 * • Track visibility state.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Call AI providers.
 * ✗ Render chat messages.
 * ✗ Build prompts.
 * ✗ Handle networking.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import {
    getMessageContainer,
    scrollToBottom
} from "./chat-window.js";

let typingIndicator = null;

let isVisible = false;

/**
 * ============================================================================
 * Displays the typing indicator.
 * ============================================================================
 */
export function showTypingIndicator() {

    if (isVisible) {

        return;

    }

    typingIndicator = document.createElement("div");

    typingIndicator.className = "chat-message assistant typing-indicator";

    typingIndicator.innerHTML = `
        <div class="chat-bubble typing-bubble">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    getMessageContainer().appendChild(

        typingIndicator

    );

    scrollToBottom();

    isVisible = true;

}

/**
 * ============================================================================
 * Removes the typing indicator.
 * ============================================================================
 */
export function hideTypingIndicator() {

    if (!typingIndicator) {

        return;

    }

    typingIndicator.remove();

    typingIndicator = null;

    isVisible = false;

}

/**
 * ============================================================================
 * Returns whether the typing indicator is visible.
 * ============================================================================
 *
 * @returns {boolean}
 */
export function isTypingIndicatorVisible() {

    return isVisible;

}