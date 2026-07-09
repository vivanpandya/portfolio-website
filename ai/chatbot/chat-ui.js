/**
 * ============================================================================
 * CHAT USER INTERFACE
 * ============================================================================
 *
 * Purpose:
 * --------
 * Manages the chatbot user interface.
 *
 * Responsibilities:
 * -----------------
 * • Open chatbot.
 * • Close chatbot.
 * • Toggle chatbot visibility.
 * • Register UI events.
 * • Provide access to UI elements.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Call the AI Engine.
 * ✗ Build prompts.
 * ✗ Render chat messages.
 * ✗ Handle networking.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import {

focusInitialChatControl,

showWelcomeScreen

} from "./chat-window.js";


let welcomeScreen = null;
let chatSession = null;
let backButton = null;

let chatContainer = null;
let openButton = null;
let heroOpenButton = null;
let closeButton = null;

let isOpen = false;

/**
 * ============================================================================
 * Initializes the chatbot UI.
 * ============================================================================
 */
export function initializeChatUI() {

    chatContainer = document.getElementById("chatbot");

    openButton = document.getElementById("open-chat");

    heroOpenButton = document.getElementById("hero-open-chat");

    closeButton = document.getElementById("close-chat");

    welcomeScreen = document.getElementById("chat-welcome");

    chatSession = document.getElementById("chat-session");

    backButton = document.getElementById("back-to-welcome");

    if (!chatContainer) {

        throw new Error("Chat container not found.");

    }

    registerEvents();

}

/**
 * ============================================================================
 * Registers UI event listeners.
 * ============================================================================
 */
function registerEvents() {

    openButton?.addEventListener(
        "click",
        openChat
    );

    // NOTE: The hero "Ask Vivan AI" button (#hero-open-chat) is intentionally
    // NOT bound to openChat() here. script.js (outside this module) already
    // forwards hero button clicks to the #open-chat launcher via a synthetic
    // click, and that launcher is bound to openChat() above. Binding
    // heroOpenButton directly here as well caused openChat() to run twice
    // for every single hero button click.

    closeButton?.addEventListener(
        "click",
        closeChat
    );

    backButton?.addEventListener(

        "click",

        () => {

            showWelcomeScreen();

        }

    );

}

/**
 * ============================================================================
 * Opens the chatbot.
 * ============================================================================
 */
export function openChat() {

    if (!chatContainer) {

        return;

    }

    if (isOpen) {

        return;

    }

    chatContainer.classList.add("chat-open");
    openButton?.setAttribute("aria-expanded", "true");
    heroOpenButton?.setAttribute("aria-expanded", "true");

    isOpen = true;
    showWelcomeScreen();
    focusInitialChatControl();

}

/**
 * ============================================================================
 * Closes the chatbot.
 * ============================================================================
 */
export function closeChat() {

    if (!chatContainer) {

        return;

    }

    chatContainer.classList.remove("chat-open");
    openButton?.setAttribute("aria-expanded", "false");
    heroOpenButton?.setAttribute("aria-expanded", "false");

    isOpen = false;

    openButton?.focus();

}

/**
 * ============================================================================
 * Toggles chatbot visibility.
 * ============================================================================
 */
export function toggleChat() {

    if (isOpen) {

        closeChat();

    }

    else {

        openChat();

    }

}

/**
 * ============================================================================
 * Returns whether the chatbot is currently open.
 * ============================================================================
 *
 * @returns {boolean}
 */
export function isChatOpen() {

    return isOpen;

}

/**
 * ============================================================================
 * Returns the main chatbot container.
 * ============================================================================
 *
 * @returns {HTMLElement|null}
 */
export function getChatContainer() {

    return chatContainer;

}