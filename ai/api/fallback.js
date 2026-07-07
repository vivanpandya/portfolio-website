/**
 * ============================================================================
 * FALLBACK RESPONSE SERVICE
 * ============================================================================
 *
 * Purpose:
 * --------
 * Provides professional fallback responses whenever the AI
 * cannot generate a valid answer.
 *
 * Responsibilities:
 * -----------------
 * • Return user-friendly error messages.
 * • Prevent blank chatbot responses.
 * • Maintain a professional recruiter experience.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Call any AI provider
 * ✗ Build prompts
 * ✗ Manipulate the UI
 * ✗ Perform network requests
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

/**
 * Collection of professional fallback responses.
 */

const FALLBACK_RESPONSES = [

    "I'm currently unable to access my AI knowledge base. Please try again in a few moments.",

    "I'm experiencing a temporary issue while generating a response. Please try your question again shortly.",

    "The AI assistant is temporarily unavailable. Meanwhile, feel free to explore Vivan's Projects, Skills, and Achievements sections.",

    "I couldn't generate a response right now. You can also download Vivan's resume or visit his GitHub profile for more information.",

    "Sorry, something unexpected happened while processing your request. Please try again."

];

/**
 * ============================================================================
 * Returns a random professional fallback response.
 * ============================================================================
 *
 * @returns {string}
 */
export function useFallbackResponse() {

    const randomIndex = Math.floor(

        Math.random() * FALLBACK_RESPONSES.length

    );

    return FALLBACK_RESPONSES[randomIndex];

}

/**
 * ===========================================================================l=
 * Returns all fallback responses.
 * Useful for debugging or testing.
 * ============================================================================
 *
 * @returns {string[]}
 */
export function getAllFallbackResponses() {

    return [...FALLBACK_RESPONSES];

}
