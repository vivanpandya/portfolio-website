/**
 * ============================================================================
 * MARKDOWN RENDERER
 * ============================================================================
 *
 * Purpose:
 * --------
 * Converts AI-generated Markdown into safe HTML for rendering
 * inside the chatbot interface.
 *
 * This version avoids external dependencies so it works directly in the
 * browser without a build step.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import { validateString } from "../utils/validators.js";
import { escapeHtml } from "../utils/sanitizer.js";

/**
 * ============================================================================
 * Converts Markdown into safe HTML.
 * ============================================================================
 *
 * @param {string} markdown
 * @returns {string}
 */
export function renderMarkdown(markdown) {
    validateString(markdown, "Markdown content");

    if (!markdown.trim()) {
        return "";
    }

    const normalized = markdown
        .replace(/\r\n?/g, "\n")
        .replace(/\n{3,}/g, "\n\n");

    const paragraphs = normalized.split(/\n\n+/).map(part => part.trim()).filter(Boolean);

    return paragraphs
        .map(paragraph => {
            const html = convertInlineMarkdown(paragraph);
            return `<p>${html}</p>`;
        })
        .join("");
}

function convertInlineMarkdown(text) {
    let html = escapeHtml(text);

    html = html.replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`);
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, (_, label, url) => {
        const safeUrl = isSafeUrl(url) ? url : "#";
        return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
    });
    html = html.replace(/\n/g, "<br>");

    return html;
}

function isSafeUrl(url) {
    try {
        const parsed = new URL(url);
        return ["http:", "https:", "mailto:"].includes(parsed.protocol);
    }
    catch {
        return false;
    }
}