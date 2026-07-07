/**
 * ============================================================================
 * HTTP REQUEST SERVICE
 * ============================================================================
 *
 * Purpose:
 * --------
 * Provides a reusable HTTP request utility for all AI providers.
 *
 * Responsibilities:
 * -----------------
 * • Send HTTP requests.
 * • Handle request timeout.
 * • Handle network failures.
 * • Validate server responses.
 * • Return parsed JSON data.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Build prompts
 * ✗ Manage chat history
 * ✗ Contain provider-specific logic
 * ✗ Manipulate the UI
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

import { safeJsonParse, safeJsonStringify } from "../utils/helpers.js";
import { validateUrl } from "../utils/validators.js";
import { logError, logInfo, logStage } from "../utils/logger.js";

/**
 * Sends an HTTP request.
 *
 * @param {Object} config
 * @param {string} config.url
 * @param {string} [config.method="POST"]
 * @param {Object} [config.headers={}]
 * @param {Object|string|null} [config.body=null]
 * @param {number} [config.timeout=60000]
 *
 * @returns {Promise<Object>} Response envelope with status, headers, rawText, and data.
 */
export async function sendRequest({

    url,

    method = "POST",

    headers = {},

    body = null,

    timeout = 60000

}) {

    validateUrl(url);
    const startedAt = Date.now();

    const controller = new AbortController();
    const serializedBody = typeof body === "string"
        ? body
        : body
            ? safeJsonStringify(body)
            : null;

    if (body && typeof body !== "string" && !serializedBody) {

        throw new TypeError("Request body could not be serialized to JSON.");

    }

    const timeoutId = setTimeout(() => {

        controller.abort();

    }, timeout);

    logStage("[REQUEST] Entering sendRequest", {
        inputType: typeof body,
        url,
        method
    });

    logInfo("[REQUEST] Sending request", {
        url,
        method,
        timeout,
        bodyPreview: serializedBody ? serializedBody.slice(0, 240) : null
    });

    try {

        const response = await fetch(url, {

            method,

            headers,

            signal: controller.signal,

            body: serializedBody

        });

        clearTimeout(timeoutId);

        const contentType =
            response.headers.get("content-type") || "";

        logInfo("[REQUEST] Response headers received", {
            url,
            status: response.status,
            statusText: response.statusText,
            contentType
        });

        if (!response.ok) {

            const errorText = await response.text();
            const httpError = new Error(

                `HTTP ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ""}`

            );

            httpError.name = "ProviderRequestError";
            httpError.responseBody = errorText;
            httpError.rawResponse = errorText;
            throw httpError;

        }

        const rawText = await response.text();
        let parsedBody = null;

        if (rawText && (contentType.includes("application/json") || rawText.trim().startsWith("{") || rawText.trim().startsWith("["))) {
            parsedBody = safeJsonParse(rawText, null);

            if (parsedBody === null) {
                const parseError = new Error("Failed to parse JSON response.");
                parseError.name = "ProviderResponseError";
                parseError.rawResponse = rawText;
                throw parseError;
            }
        }

        const envelope = {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            contentType,
            headers: Object.fromEntries(response.headers.entries()),
            rawText,
            data: parsedBody ?? rawText
        };

        logInfo("[REQUEST] Response body received", {
            url,
            status: response.status,
            statusText: response.statusText,
            contentType,
            outputType: typeof envelope.data,
            responseObject: envelope.data,
            responseLength: rawText.length,
            elapsedMs: Date.now() - startedAt
        });

        return envelope;

    }

    catch (error) {

        clearTimeout(timeoutId);

        const errorMessage = error instanceof Error
            ? error.message
            : String(error);

        logError("[REQUEST] Request failed", {
            url,
            method,
            error: errorMessage,
            stack: error instanceof Error ? error.stack : null,
            responseBody: error?.responseBody || null,
            elapsedMs: Date.now() - startedAt
        });

        if (error.name === "AbortError") {

            const timeoutError = new Error("Request timed out.");
            timeoutError.name = "ProviderRequestError";
            timeoutError.responseBody = null;
            throw timeoutError;

        }

        if (error.name === "ProviderRequestError" || error.name === "ProviderResponseError") {
            throw error;
        }

        const providerError = new Error(

            `Network Error: ${errorMessage}`

        );

        providerError.name = "ProviderRequestError";
        providerError.responseBody = error?.responseBody || null;
        providerError.rawResponse = error?.rawResponse || null;
        throw providerError;

    }

}
