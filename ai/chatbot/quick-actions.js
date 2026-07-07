/**
 * ============================================================================
 * QUICK ACTIONS
 * ============================================================================
 *
 * Purpose:
 * --------
 * Manages predefined quick action buttons inside the chatbot.
 *
 * Responsibilities:
 * -----------------
 * • Register quick action events.
 * • Handle button clicks.
 * • Send predefined prompts.
 * • Keep the UI responsive.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Call AI providers directly.
 * ✗ Build prompts.
 * ✗ Manipulate message rendering.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import {
    handleUserMessage,
    startNewChat
} from "./chat-controller.js";

/**
 * ============================================================================
 * Initializes all quick action buttons.
 * ============================================================================
 */
export function initializeQuickActions() {

    const buttons = document.querySelectorAll("[data-quick-action]");
    const suggestionButtons = document.querySelectorAll("[data-welcome-suggestion]");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const message = button.dataset.quickAction;

            if (!message) {

                return;

            }

            handleUserMessage(message);

        });

    });

    suggestionButtons.forEach(button => {

        button.addEventListener("click", () => {

            const message = button.dataset.welcomeSuggestion;

            if (!message) {

                return;

            }

            startNewChat(message);

        });

    });

}

/**
 * ============================================================================
 * Enables all quick action buttons.
 * ============================================================================
 */
export function enableQuickActions() {

    document
        .querySelectorAll("[data-quick-action]")
        .forEach(button => {

            button.disabled = false;

        });

}

/**
 * ============================================================================
 * Disables all quick action buttons.
 * ============================================================================
 */
export function disableQuickActions() {

    document
        .querySelectorAll("[data-quick-action]")
        .forEach(button => {

            button.disabled = true;

        });

}
