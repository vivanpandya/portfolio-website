/**
 * ============================================================================
 * APPLICATION CONSTANTS
 * ============================================================================
 *
 * Purpose:
 * --------
 * Stores application-wide constants used throughout the
 * AI Portfolio Assistant.
 *
 * Responsibilities:
 * -----------------
 * • Chat configuration.
 * • Storage keys.
 * • Message roles.
 * • AI providers.
 * • Default limits.
 * • UI configuration.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Contain business logic.
 * ✗ Access the DOM.
 * ✗ Call APIs.
 * ✗ Import application modules.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

/**
 * ============================================================================
 * Application Information
 * ============================================================================
 */
export const APP = Object.freeze({

    NAME: "Vivan AI",

    VERSION: "1.0.0",

    AUTHOR: "Vivan Pandya"

});

/**
 * ============================================================================
 * Supported AI Providers
 * ============================================================================
 */
export const AI_PROVIDER = Object.freeze({

    OLLAMA: "ollama"

});

/**
 * ============================================================================
 * Chat Message Roles
 * ============================================================================
 */
export const MESSAGE_ROLE = Object.freeze({

    USER: "user",

    ASSISTANT: "assistant",

    SYSTEM: "system"

});

/**
 * ============================================================================
 * Browser Storage Keys
 * ============================================================================
 */
export const STORAGE_KEY = Object.freeze({

    CHAT_HISTORY: "vivan-ai-chat-history",

    CHAT_SETTINGS: "vivan-ai-chat-settings"

});

/**
 * ============================================================================
 * Chat Configuration
 * ============================================================================
 */
export const CHAT_CONFIG = Object.freeze({

    MAX_HISTORY: 100,

    MAX_CONTEXT_MESSAGES: 4,

    MAX_MESSAGE_LENGTH: 2000,

    MAX_USER_MESSAGE_LENGTH: 1000,

    DEFAULT_PLACEHOLDER:
        "Ask me anything about Vivan Pandya...",

    DEFAULT_DEBOUNCE_DELAY: 300,

    DEFAULT_THROTTLE_DELAY: 100

});

/**
 * ============================================================================
 * Knowledge Base
 * ============================================================================
 */
export const KNOWLEDGE = Object.freeze({

    ROOT: "./ai/knowledge/",

    MASTER_FILE: "portfolio.json",

    SYSTEM_PROMPT: "system-prompt.txt"

});

/**
 * ============================================================================
 * Request Configuration
 * ============================================================================
 */
export const REQUEST = Object.freeze({

    DEFAULT_TIMEOUT: 120000

});

/**
 * ============================================================================
 * Typing Indicator
 * ============================================================================
 */
export const TYPING = Object.freeze({

    MIN_VISIBLE_TIME: 500

});

/**
 * ============================================================================
 * Supported Intent Names
 * ============================================================================
 */
export const INTENT = Object.freeze({

    ABOUT: "ABOUT",

    SKILLS: "SKILLS",

    PROJECTS: "PROJECTS",

    EDUCATION: "EDUCATION",

    EXPERIENCE: "EXPERIENCE",

    ACHIEVEMENTS: "ACHIEVEMENTS",

    CERTIFICATIONS: "CERTIFICATIONS",

    CONTACT: "CONTACT",

    PERSONALITY: "PERSONALITY",

    ASSISTANT: "ASSISTANT",

    RECRUITER: "RECRUITER",

    GENERAL: "GENERAL",

    RESUME: "RESUME",

    HIRE: "HIRE",

    GREETING: "GREETING",

    UNKNOWN: "UNKNOWN"

});

/**
 * ============================================================================
 * Response Status
 * ============================================================================
 */
export const RESPONSE_STATUS = Object.freeze({

    SUCCESS: "success",

    ERROR: "error"

});
