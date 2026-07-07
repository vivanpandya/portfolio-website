/**
 * ============================================================================
 * AI CONFIGURATION
 * ============================================================================
 *
 * Purpose:
 * --------
 * Stores all configuration values related to AI providers.
 *
 * Responsibilities:
 * -----------------
 * • Define active AI provider.
 * • Store API endpoints.
 * • Store model names.
 * • Configure request timeout.
 * • Enable future provider switching.
 *
 * Supported Providers:
 * --------------------
 * • Ollama (Current)
 * • OpenAI (Future)
 * • Gemini (Future)
 * • Claude (Future)
 *
 * NOTE:
 * -----
 * No business logic should exist in this file.
 * This file only exports configuration values.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import {
    AI_PROVIDER,
    REQUEST
} from "../utils/constants.js";


export const AI_CONFIG = {

    /**
     * Active AI Provider
     */
    provider: AI_PROVIDER.OLLAMA,

    /**
     * Default Ollama Model
     *
     * Recommended Models:
     *
     * llama3.1:latest
     * llama3:latest
     * mistral
     * phi3
     * qwen2.5-coder:7b
     */
    model: "llama3.1:latest",

    /**
     * Ollama Local API Endpoint
     */
    endpoint: "http://127.0.0.1:11434/api/generate",

    /**
     * Request Timeout
     * (milliseconds)
     */
    timeout: REQUEST.DEFAULT_TIMEOUT,

    /**
     * Generate Streaming Responses
     *
     * false → Complete response
     * true  → Token-by-token streaming
     */
    stream: false,

    /**
     * AI Generation Parameters
     */

    temperature: 0.1,

    topP: 0.7,

    topK: 20,

    repeatPenalty: 1.05,

    maxTokens: 140,

    contextWindow: 2048

};


/**
 * ============================================================================
 * Available AI Providers
 * ============================================================================
 */

export const AI_PROVIDERS = Object.freeze({

    OLLAMA: "ollama",

    OPENAI: "openai",

    GEMINI: "gemini",

    CLAUDE: "claude"

});


/**
 * ============================================================================
 * Available Ollama Models
 * ============================================================================
 */

export const OLLAMA_MODELS = Object.freeze({

    LLAMA_3_2_1B: "llama3.2:1b",

    LLAMA_3_2_3B: "llama3.2:3b",

    MISTRAL: "mistral",

    PHI3: "phi3",

    GEMMA2: "gemma2",

    QWEN2_5: "qwen2.5"

});
