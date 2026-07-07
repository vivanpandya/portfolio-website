/**
 * ============================================================================
 * RECRUITER MODE
 * ============================================================================
 *
 * Purpose:
 * --------
 * Detects recruiter-oriented queries and generates additional
 * context instructions for the AI model.
 *
 * Responsibilities:
 * -----------------
 * • Detect recruiter-specific questions.
 * • Enable recruiter response mode.
 * • Provide recruiter-focused AI instructions.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Call AI providers.
 * ✗ Read portfolio knowledge.
 * ✗ Manipulate the DOM.
 * ✗ Build complete prompts.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import { validateString } from "../utils/validators.js";

/**
 * Keywords indicating recruiter intent.
 */
const RECRUITER_KEYWORDS = [

    "hire",
    "recruit",
    "internship",
    "candidate",
    "resume",
    "cv",
    "experience",
    "strength",
    "weakness",
    "qualification",
    "eligible",
    "fit",
    "team",
    "developer",
    "software engineer",
    "full stack",
    "why should i hire",
    "why hire",
    "employment"

];

/**
 * ============================================================================
 * Detects whether the current message is recruiter-related.
 * ============================================================================
 *
 * @param {string} message
 * @returns {boolean}
 */
export function isRecruiterMode(message) {

    try {

        validateString(message, "Message");

    }

    catch {

        return false;

    }

    const normalizedMessage = message.toLowerCase();

    return RECRUITER_KEYWORDS.some(keyword =>
        normalizedMessage.includes(keyword)
    );

}

/**
 * ============================================================================
 * Returns recruiter-specific system instructions.
 * ============================================================================
 *
 * @returns {string}
 */
export function getRecruiterInstructions() {

    return `

You are currently responding to a recruiter or hiring manager.

Response Guidelines:

• Be professional and concise.

• Highlight Vivan Pandya's strengths.

• Focus on technical skills, projects, education, achievements, and problem-solving ability.

• Maintain a confident but honest tone.

• Never exaggerate or invent experience.

• If information is unavailable, clearly state that it is not available.

• Encourage the recruiter to review the portfolio, resume, GitHub, and LinkedIn when appropriate.

`;

}