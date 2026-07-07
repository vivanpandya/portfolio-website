/**
 * ============================================================================
 * CHAT CONTROLLER
 * ============================================================================
 *
 * Purpose:
 * --------
 * Coordinates all chatbot interactions between the user interface
 * and the AI Engine.
 *
 * Responsibilities:
 * -----------------
 * • Handle user messages.
 * • Validate chat flow.
 * • Display typing indicator.
 * • Request AI responses.
 * • Render messages.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import { processUserMessage } from "../brain/ai-engine.js";
import {
    addMessage as addContextMessage,
    clearConversationContext,
    hydrateConversationContext
} from "../brain/context-manager.js";
import { MESSAGE_ROLE } from "../utils/constants.js";
import { validateUserMessage } from "../brain/message-validator.js";
import { logError, logInfo, logStage } from "../utils/logger.js";
import {
    addChatMessage,
    clearChatHistory,
    hasChatHistory,
    loadChatHistory
} from "./chat-storage.js";
import {
    clearInput,
    disableInput,
    enableInput,
    getContinueChatButton,
    getInputValue,
    getSendButton,
    getStartNewChatButton,
    registerInputHandler,
    scrollToBottom,
    setContinueChatAvailability,
    showChatSession,
    showWelcomeScreen
} from "./chat-window.js";
import {
    clearRenderedMessages,
    renderMessage,
    renderStoredMessages
} from "./message-renderer.js";
import { showTypingIndicator, hideTypingIndicator } from "./typing-indicator.js";

let isProcessing = false;

const DEFAULT_WELCOME_MESSAGE = "Hi! I'm Vivan AI.\n\nAsk me anything about Vivan's projects, skills, education, achievements, or career.";

/**
 * ============================================================================
 * Initializes chat interactions.
 * ============================================================================
 */
export function initializeChatController() {
    const sendButton = getSendButton();
    const startNewChatButton = getStartNewChatButton();
    const continueChatButton = getContinueChatButton();

    const submitMessage = () => {
        const message = getInputValue();

        if (!message) {
            return;
        }

        clearInput();
        handleUserMessage(message);
    };

    sendButton?.addEventListener("click", submitMessage);
    startNewChatButton?.addEventListener("click", () => {
        startNewChat();
    });
    continueChatButton?.addEventListener("click", continuePreviousChat);
    registerInputHandler(submitMessage);
    initializeChatStartup();
}

/**
 * ============================================================================
 * Prepares the chatbot startup state without restoring previous messages.
 * ============================================================================
 */
export function initializeChatStartup() {
    showWelcomeScreen();
    setContinueChatAvailability(hasChatHistory());
}

/**
 * ============================================================================
 * Starts a clean conversation and optionally sends an initial prompt.
 * ============================================================================
 *
 * @param {string} initialMessage
 */
export function startNewChat(initialMessage = "") {
    resetActiveChatState();
    clearChatHistory();
    clearConversationContext();

    const welcomeMessage = {
        role: MESSAGE_ROLE.ASSISTANT,
        content: DEFAULT_WELCOME_MESSAGE,
        timestamp: Date.now()
    };

    showChatSession();
    document.getElementById("back-to-welcome").hidden = false;
    renderMessage(welcomeMessage);
    addChatMessage(welcomeMessage);
    addContextMessage(MESSAGE_ROLE.ASSISTANT, welcomeMessage.content);
    setContinueChatAvailability(true);
    enableInput();

    if (initialMessage) {
        handleUserMessage(initialMessage);
    }
}

/**
 * ============================================================================
 * Restores the exact previous conversation from browser storage.
 * ============================================================================
 */
export function continuePreviousChat() {
    const history = loadChatHistory();

    if (history.length === 0) {
        setContinueChatAvailability(false);
        showWelcomeScreen();
        return;
    }

    resetActiveChatState();
    hydrateConversationContext(history);
    showChatSession();
    document.getElementById("back-to-welcome").hidden = false;
    renderStoredMessages(history);
    scrollToBottom();
    enableInput();
}

/**
 * ============================================================================
 * Resets rendered messages and any in-flight chat UI state.
 * ============================================================================
 */
function resetActiveChatState() {
    isProcessing = false;
    hideTypingIndicator();
    clearRenderedMessages();
    clearInput();
}

/**
 * ============================================================================
 * Handles a complete chat interaction.
 * ============================================================================
 *
 * @param {string} message
 */
export async function handleUserMessage(message) {
    if (isProcessing) {
        return;
    }

    isProcessing = true;
    disableInput();

    try {
        logStage("[CHAT CONTROLLER] Entering handleUserMessage", {
            inputType: typeof message
        });

        const cleanedMessage = validateUserMessage(message);

        const userMessage = {
            role: MESSAGE_ROLE.USER,
            content: cleanedMessage,
            timestamp: Date.now()
        };

        renderMessage(userMessage);
        addChatMessage(userMessage);
        showTypingIndicator();

        const response = await processUserMessage(cleanedMessage);

        hideTypingIndicator();
        renderMessage(response);
        addChatMessage(response);
        addContextMessage(MESSAGE_ROLE.USER, cleanedMessage);
        addContextMessage(MESSAGE_ROLE.ASSISTANT, response.content);

        logInfo("[CHAT CONTROLLER] Message flow completed", {
            responseType: typeof response,
            contentLength: response.content.length
        });
    }
    catch (error) {
        hideTypingIndicator();
        logError("[CHAT CONTROLLER] Message flow failed", error);

        const fallbackMessage = {
            role: MESSAGE_ROLE.ASSISTANT,
            content: "Sorry, something went wrong while processing your request.",
            timestamp: Date.now()
        };

        renderMessage(fallbackMessage);
        addChatMessage(fallbackMessage);
    }
    finally {
        isProcessing = false;
        enableInput();
    }
}

/**
 * ============================================================================
 * Returns whether the chatbot is currently processing a request.
 * ============================================================================
 *
 * @returns {boolean}
 */
export function isChatBusy() {
    return isProcessing;
}
