/**
 * ============================================================================
 * INTENT CLASSIFIER
 * ============================================================================
 *
 * Purpose:
 * --------
 * Detects the user's intent before generating an AI response.
 *
 * Responsibilities:
 * -----------------
 * • Classify user queries.
 * • Match keywords to supported intents.
 * • Return a standardized intent.
 * • Improve prompt quality.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Call any AI provider.
 * ✗ Manipulate the DOM.
 * ✗ Read knowledge files.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import {
    INTENT
} from "../utils/constants.js";
import { validateString } from "../utils/validators.js";
import { analyzeIntent } from "./semantic-analyzer.js";

/**
 * ============================================================================
 * Classifies the user's message.
 * ============================================================================
 *
 * @param {string} message
 * @returns {string}
 */
export function classifyIntent(message, context = []) {

    try {

        validateString(message, "Message");

    }

    catch {

        return INTENT.UNKNOWN;

    }

    return analyzeIntent(message, context).intent ?? INTENT.UNKNOWN;
}
