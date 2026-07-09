/**
 * ============================================================================
 * AI INITIALIZER
 * ============================================================================
 *
 * Purpose:
 * --------
 * Entry point for the AI Portfolio Assistant.
 *
 * Responsibilities:
 * -----------------
 * • Initialize the AI system.
 * • Verify browser compatibility.
 * • Load the chatbot shell.
 * • Initialize UI and controller modules.
 * • Restore chat history.
 * • Verify AI provider configuration.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import { initializeChatUI } from "./chatbot/chat-ui.js";
import { initializeChatWindow } from "./chatbot/chat-window.js";
import { initializeChatController } from "./chatbot/chat-controller.js";
import { initializeQuickActions } from "./chatbot/quick-actions.js";
import { AI_CONFIG } from "./api/api-config.js";
import { logInfo, logError, logWarning } from "./utils/logger.js";

let chatbotComponentLoaded = false;

/**
 * ============================================================================
 * Initializes the AI Portfolio Assistant.
 * ============================================================================
 */
export async function initializeAI() {
    try {
        logInfo("Initializing AI Portfolio Assistant...");

        verifyBrowserSupport();
        verifyConfiguration();
        await loadChatbotComponent();
        initializeChatUI();
        initializeChatWindow();
        initializeQuickActions();
        initializeChatController();
        await verifyOllamaConnection();

        logInfo("AI Portfolio Assistant initialized successfully.");
    }
    catch (error) {
        logError("AI initialization failed.", error);
    }
}

/**
 * ============================================================================
 * Loads the chatbot markup shell into the page.
 * ============================================================================
 */
async function loadChatbotComponent() {
    if (chatbotComponentLoaded || document.getElementById("chatbot")) {
        chatbotComponentLoaded = true;
        return;
    }

    try {
        const response = await fetch("./ai/components/chatbot.html");

        if (!response.ok) {
            throw new Error(`Failed to load chatbot component: ${response.status}`);
        }

        const html = await response.text();
        document.body.insertAdjacentHTML("beforeend", html);
        chatbotComponentLoaded = true;
    }
    catch (error) {
        logError("Unable to load chatbot component.", error);
        document.body.insertAdjacentHTML(
            "beforeend",
            `
                <div id="chatbot" class="chatbot" role="dialog" aria-label="AI assistant" aria-modal="false">
                    <div class="chatbot-shell">
                        <div class="chatbot-header">
                            <button id="back-to-welcome" class="chatbot-back" type="button" aria-label="Back to welcome screen" hidden><i class="fas fa-arrow-left"></i></button>
                            <div>
                                <h3>Vivan AI</h3>
                                <p>Ask me anything</p>
                            </div>
                            <button id="close-chat" class="chatbot-close" type="button" aria-label="Close chat">×</button>
                        </div>
                        <div id="chat-window" class="chatbot-window">
                            <section id="chat-welcome" class="chat-welcome" aria-labelledby="chat-welcome-title">
                                <div class="chat-welcome-card">
                                    <div class="chat-welcome-icon" aria-hidden="true"><i class="fas fa-hand-sparkles"></i></div>
                                    <h2 id="chat-welcome-title">Welcome to Vivan AI</h2>
                                    <p class="chat-welcome-subtitle">I'm your AI Portfolio Assistant.</p>
                                    <p class="chat-welcome-copy">I can answer questions about Vivan's projects, skills, education, experience, achievements, certifications, resume, and contact information.</p>
                                    <div class="chat-start-actions" aria-label="Choose how to start chatting">
                                        <button id="start-new-chat" class="chat-start-button primary" type="button" aria-label="Start a fresh conversation">
                                            <span class="chat-start-icon" aria-hidden="true"><i class="fas fa-sparkles"></i></span>
                                            <span><strong>New Chat</strong><small>Start a fresh conversation.</small></span>
                                        </button>
                                        <button id="continue-chat" class="chat-start-button" type="button" aria-label="Continue your last conversation">
                                            <span class="chat-start-icon" aria-hidden="true"><i class="fas fa-clock-rotate-left"></i></span>
                                            <span><strong>Continue Previous Chat</strong><small>Continue your last conversation.</small></span>
                                        </button>
                                    </div>
                                    <p id="no-chat-history" class="chat-history-empty" hidden>No previous conversations found.</p>
                                    <div class="chat-welcome-suggestions" aria-label="Suggested portfolio questions">
                                        <button type="button" data-welcome-suggestion="Tell me about Vivan's projects."><i class="fas fa-briefcase" aria-hidden="true"></i><span>Tell me about Vivan's projects</span></button>
                                        <button type="button" data-welcome-suggestion="What are Vivan's technical skills?"><i class="fas fa-screwdriver-wrench" aria-hidden="true"></i><span>What are his technical skills?</span></button>
                                        <button type="button" data-welcome-suggestion="Tell me about Vivan's education."><i class="fas fa-graduation-cap" aria-hidden="true"></i><span>Tell me about his education</span></button>
                                        <button type="button" data-welcome-suggestion="How can I download Vivan's resume?"><i class="fas fa-file-arrow-down" aria-hidden="true"></i><span>Download his resume</span></button>
                                        <button type="button" data-welcome-suggestion="How can I contact Vivan?"><i class="fas fa-address-card" aria-hidden="true"></i><span>Contact Vivan</span></button>
                                    </div>
                                </div>
                            </section>
                            <div id="chat-session" class="chat-session" hidden>
                                <div id="chat-messages" class="chatbot-messages" role="log" aria-live="polite" aria-relevant="additions"></div>
                                <div class="chatbot-quick-actions" id="quick-actions">
                                    <button type="button" class="quick-action" data-quick-action="Tell me about Vivan's projects.">Projects</button>
                                    <button type="button" class="quick-action" data-quick-action="What skills does Vivan have?">Skills</button>
                                    <button type="button" class="quick-action" data-quick-action="How can I contact Vivan?">Contact</button>
                                </div>
                                <div class="chatbot-input-row">
                                    <input id="chat-input" type="text" placeholder="Ask me anything about Vivan..." autocomplete="off" aria-label="Ask Vivan AI">
                                    <button id="send-message" type="button" aria-label="Send message">Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button id="open-chat" class="chatbot-launcher" type="button" aria-controls="chatbot" aria-expanded="false">
                    <i class="fas fa-comments"></i>
                    <span>Ask AI</span>
                </button>
            `
        );
        chatbotComponentLoaded = true;
    }
}

/**
 * ============================================================================
 * Verifies browser compatibility.
 * ============================================================================
 */
function verifyBrowserSupport() {
    const requiredFeatures = ["fetch", "localStorage", "AbortController"];

    for (const feature of requiredFeatures) {
        if (!(feature in window)) {
            throw new Error(`Browser does not support ${feature}.`);
        }
    }
}

/**
 * ============================================================================
 * Verifies AI configuration.
 * ============================================================================
 */
function verifyConfiguration() {
    if (!AI_CONFIG.endpoint) {
        throw new Error("Missing AI endpoint.");
    }

    if (!AI_CONFIG.model) {
        throw new Error("Missing AI model.");
    }

    logInfo("[AI INIT] Configuration verified", {
        endpoint: AI_CONFIG.endpoint,
        model: AI_CONFIG.model,
        timeout: AI_CONFIG.timeout
    });
}

async function verifyOllamaConnection() {
    try {
        const endpointUrl = new URL(AI_CONFIG.endpoint);
        const tagsUrl = `${endpointUrl.protocol}//${endpointUrl.host}/api/tags`;

        logInfo("[AI INIT] Verifying Ollama endpoint", { tagsUrl });

        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 5000);

        const response = await fetch(tagsUrl, {
            method: "GET",
            signal: controller.signal
        });

        window.clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Ollama tags request failed with ${response.status}`);
        }

        const data = await response.json();
        const models = Array.isArray(data?.models) ? data.models : [];
        const availableModels = models.map(model => model.name).filter(Boolean);

        logInfo("[AI INIT] Ollama models discovered", availableModels);

        if (!availableModels.includes(AI_CONFIG.model)) {
            const fallbackModel = availableModels[0] || AI_CONFIG.model;
            logWarning("[AI INIT] Configured model is not available; using fallback model", {
                configuredModel: AI_CONFIG.model,
                fallbackModel
            });
            AI_CONFIG.model = fallbackModel;
        }
    }
    catch (error) {
        logWarning("[AI INIT] Ollama verification failed; chat will fall back only if a request also fails", {
            endpoint: AI_CONFIG.endpoint,
            message: error.message,
            name: error.name,
            stack: error.stack
        });
    }
}

/**
 * ============================================================================
 * Automatically initialize after DOM is ready.
 * ============================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
    initializeAI();
});