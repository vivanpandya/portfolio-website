/**
 * ============================================================================
 * MESSAGE RENDERER
 * ============================================================================
 *
 * Purpose:
 * --------
 * Renders chat messages within the chatbot interface.
 *
 * Responsibilities:
 * -----------------
 * • Render new messages.
 * • Restore stored conversation history.
 * • Convert markdown to safe HTML.
 * • Scroll to the latest message.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import { MESSAGE_ROLE } from "../utils/constants.js";
import { getMessageContainer, scrollToBottom } from "./chat-window.js";
import { renderMarkdown } from "./markdown-renderer.js";

/**
 * ============================================================================
 * Renders a single chat message.
 * ============================================================================
 *
 * @param {Object} message
 */
export function renderMessage(message) {
    const container = getMessageContainer();

    if (!container || !message) {
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = `chat-message ${message.role === MESSAGE_ROLE.USER ? "user" : "assistant"}`;

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";

    const content = typeof message.content === "string"
        ? message.content
        : String(message.content ?? "");

    bubble.innerHTML = renderMarkdown(content);

    wrapper.appendChild(bubble);

    if (message.timestamp) {
        const meta = document.createElement("div");
        meta.className = "chat-meta";
        meta.textContent = new Date(message.timestamp).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });
        wrapper.appendChild(meta);
    }

    container.appendChild(wrapper);
    scrollToBottom();
}

/**
 * ============================================================================
 * Renders a list of stored messages.
 * ============================================================================
 *
 * @param {Array} messages
 */
export function renderStoredMessages(messages) {
    if (!Array.isArray(messages)) {
        return;
    }

    messages.forEach(renderMessage);
}

/**
 * ============================================================================
 * Removes all rendered chat messages from the active window.
 * ============================================================================
 */
export function clearRenderedMessages() {
    const container = getMessageContainer();

    if (!container) {
        return;
    }

    container.replaceChildren();
}

