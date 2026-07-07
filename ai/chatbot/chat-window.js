/**
 * ============================================================================
 * CHAT WINDOW
 * ============================================================================
 *
 * Purpose:
 * --------
 * Manages the chatbot window elements.
 *
 * Responsibilities:
 * -----------------
 * • Initialize the chat window.
 * • Cache DOM elements.
 * • Provide access to UI components.
 * • Handle automatic scrolling.
 * • Manage input field.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Render messages.
 * ✗ Call the AI Engine.
 * ✗ Build prompts.
 * ✗ Handle networking.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

let chatWindow = null;
let welcomeScreen = null;
let chatSession = null;
let startNewChatButton = null;
let continueChatButton = null;
let noHistoryMessage = null;
let messageContainer = null;
let messageInput = null;
let sendButton = null;

/**
 * ============================================================================
 * Initializes the chat window.
 * ============================================================================
 */
export function initializeChatWindow() {

    chatWindow = document.getElementById("chat-window");

    welcomeScreen = document.getElementById("chat-welcome");

    chatSession = document.getElementById("chat-session");

    startNewChatButton = document.getElementById("start-new-chat");

    continueChatButton = document.getElementById("continue-chat");

    noHistoryMessage = document.getElementById("no-chat-history");

    messageContainer = document.getElementById("chat-messages");

    messageInput = document.getElementById("chat-input");

    sendButton = document.getElementById("send-message");

    if (
        !chatWindow ||
        !welcomeScreen ||
        !chatSession ||
        !startNewChatButton ||
        !continueChatButton ||
        !noHistoryMessage ||
        !messageContainer ||
        !messageInput ||
        !sendButton
    ) {

        throw new Error("Failed to initialize chat window.");

    }

    showWelcomeScreen();

    const backButton = document.getElementById("back-to-welcome");

    if(backButton){

        backButton.hidden = true;

    }

}

/**
 * ============================================================================
 * Returns the chat window element.
 * ============================================================================
 */
export function getChatWindow() {

    return chatWindow;

}

/**
 * ============================================================================
 * Returns the welcome screen element.
 * ============================================================================
 */
export function getWelcomeScreen() {

    return welcomeScreen;

}

/**
 * ============================================================================
 * Returns the active chat session element.
 * ============================================================================
 */
export function getChatSession() {

    return chatSession;

}

/**
 * ============================================================================
 * Returns the new chat button.
 * ============================================================================
 */
export function getStartNewChatButton() {

    return startNewChatButton;

}

/**
 * ============================================================================
 * Returns the continue chat button.
 * ============================================================================
 */
export function getContinueChatButton() {

    return continueChatButton;

}

/**
 * ============================================================================
 * Returns the messages container.
 * ============================================================================
 */
export function getMessageContainer() {

    return messageContainer;

}

/**
 * ============================================================================
 * Returns the message input element.
 * ============================================================================
 */
export function getMessageInput() {

    return messageInput;

}

/**
 * ============================================================================
 * Returns the send button.
 * ============================================================================
 */
export function getSendButton() {

    return sendButton;

}

/**
 * ============================================================================
 * Shows the onboarding screen and disables chat input.
 * ============================================================================
 */
export function showWelcomeScreen(){

    if(!welcomeScreen || !chatSession){

        return;

    }

    welcomeScreen.hidden=false;

    chatSession.hidden=true;

    disableInput();

    const backButton=document.getElementById("back-to-welcome");

    if(backButton){

        backButton.hidden=true;

    }

}


/**
 * ============================================================================
 * Shows the active chat session and enables chat input.
 * ============================================================================
 */
export function showChatSession(){

    if(!welcomeScreen || !chatSession){

        return;

    }

    welcomeScreen.hidden=true;

    chatSession.hidden=false;

    enableInput();

    const backButton=document.getElementById("back-to-welcome");

    if(backButton){

        backButton.hidden=false;

    }

}

/**
 * ============================================================================
 * Focuses the best available control for the current chat state.
 * ============================================================================
 */
export function focusInitialChatControl() {

    if (welcomeScreen && !welcomeScreen.hidden) {

        startNewChatButton?.focus();
        return;

    }

    focusInput();

}

/**
 * ============================================================================
 * Updates whether visitors can continue a stored conversation.
 * ============================================================================
 *
 * @param {boolean} hasHistory
 */
export function setContinueChatAvailability(hasHistory) {

    if (!continueChatButton || !noHistoryMessage) {

        return;

    }

    continueChatButton.disabled = !hasHistory;
    continueChatButton.setAttribute(
        "aria-disabled",
        String(!hasHistory)
    );
    noHistoryMessage.hidden = hasHistory;

}

/**
 * ============================================================================
 * Gets the current input value.
 * ============================================================================
 *
 * @returns {string}
 */
export function getInputValue() {

    return messageInput.value.trim();

}

/**
 * ============================================================================
 * Sets the input value.
 * ============================================================================
 *
 * @param {string} value
 */
export function setInputValue(value) {

    messageInput.value = value;

}

/**
 * ============================================================================
 * Clears the input field.
 * ============================================================================
 */
export function clearInput() {

    messageInput.value = "";

    if (
        !messageInput.disabled &&
        !messageInput.closest("[hidden]")
    ) {

        messageInput.focus();

    }

}

/**
 * ============================================================================
 * Sets the input placeholder.
 * ============================================================================
 *
 * @param {string} text
 */
export function setPlaceholder(text) {

    messageInput.placeholder = text;

}

/**
 * ============================================================================
 * Returns whether the input is empty.
 * ============================================================================
 *
 * @returns {boolean}
 */
export function isInputEmpty() {

    return getInputValue().length === 0;

}

/**
 * ============================================================================
 * Registers Enter key handler.
 * ============================================================================
 *
 * @param {Function} callback
 */
export function registerInputHandler(callback) {

    messageInput.addEventListener("keydown", event => {

        if (

            event.key === "Enter" &&

            !event.shiftKey

        ) {

            event.preventDefault();

            if (!isInputEmpty()) {

                callback();

            }

        }

    });

}

/**
 * ============================================================================
 * Focuses the input field.
 * ============================================================================
 */
export function focusInput() {

    messageInput.focus();

}

/**
 * ============================================================================
 * Scrolls to the latest message.
 * ============================================================================
 */
export function scrollToBottom() {

    if (!messageContainer) {

        return;

    }

    messageContainer.scrollTop =
        messageContainer.scrollHeight;

}

/**
 * ============================================================================
 * Enables the input field.
 * ============================================================================
 */
export function enableInput() {

    messageInput.disabled = false;

    sendButton.disabled = false;

}

/**
 * ============================================================================
 * Disables the input field.
 * ============================================================================
 */
export function disableInput() {

    messageInput.disabled = true;

    sendButton.disabled = true;

}
