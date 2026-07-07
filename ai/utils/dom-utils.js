/**
 * ============================================================================
 * DOM UTILITIES
 * ============================================================================
 *
 * Purpose:
 * --------
 * Provides reusable DOM helper functions used throughout the
 * AI Portfolio Assistant.
 *
 * Responsibilities:
 * -----------------
 * • Query DOM elements.
 * • Create elements.
 * • Show and hide elements.
 * • Toggle classes.
 * • Set text and HTML.
 * • Attach event listeners.
 *
 * This file should NEVER:
 * -----------------------
 * ✗ Call APIs.
 * ✗ Perform network requests.
 * ✗ Contain business logic.
 *
 * Author : Vivan Pandya
 * Project: AI Portfolio Assistant
 * ============================================================================
 */

/**
 * ============================================================================
 * Returns the first matching element.
 * ============================================================================
 *
 * @param {string} selector
 * @param {ParentNode} [parent=document]
 *
 * @returns {Element|null}
 */
export function query(selector, parent = document) {

    return parent.querySelector(selector);

}

/**
 * ============================================================================
 * Returns all matching elements.
 * ============================================================================
 *
 * @param {string} selector
 * @param {ParentNode} [parent=document]
 *
 * @returns {Element[]}
 */
export function queryAll(selector, parent = document) {

    return [...parent.querySelectorAll(selector)];

}

/**
 * ============================================================================
 * Creates a DOM element.
 * ============================================================================
 *
 * @param {string} tag
 *
 * @returns {HTMLElement}
 */
export function createElement(tag) {

    return document.createElement(tag);

}

/**
 * ============================================================================
 * Sets text content.
 * ============================================================================
 *
 * @param {Element} element
 * @param {string} text
 */
export function setText(element, text) {

    element.textContent = text;

}

/**
 * ============================================================================
 * Sets HTML content.
 * ============================================================================
 *
 * @param {Element} element
 * @param {string} html
 */
export function setHTML(element, html) {

    element.innerHTML = html;

}

/**
 * ============================================================================
 * Shows an element.
 * ============================================================================
 *
 * @param {HTMLElement} element
 */
export function show(element) {

    element.hidden = false;

}

/**
 * ============================================================================
 * Hides an element.
 * ============================================================================
 *
 * @param {HTMLElement} element
 */
export function hide(element) {

    element.hidden = true;

}

/**
 * ============================================================================
 * Toggles an element's visibility.
 * ============================================================================
 *
 * @param {HTMLElement} element
 */
export function toggle(element) {

    element.hidden = !element.hidden;

}

/**
 * ============================================================================
 * Adds a CSS class.
 * ============================================================================
 *
 * @param {Element} element
 * @param {string} className
 */
export function addClass(element, className) {

    element.classList.add(className);

}

/**
 * ============================================================================
 * Removes a CSS class.
 * ============================================================================
 *
 * @param {Element} element
 * @param {string} className
 */
export function removeClass(element, className) {

    element.classList.remove(className);

}

/**
 * ============================================================================
 * Toggles a CSS class.
 * ============================================================================
 *
 * @param {Element} element
 * @param {string} className
 */
export function toggleClass(element, className) {

    element.classList.toggle(className);

}

/**
 * ============================================================================
 * Registers an event listener.
 * ============================================================================
 *
 * @param {Element|Window|Document} target
 * @param {string} event
 * @param {Function} handler
 * @param {Object|boolean} [options]
 */
export function on(

    target,

    event,

    handler,

    options = false

) {

    target.addEventListener(

        event,

        handler,

        options

    );

}

/**
 * ============================================================================
 * Removes an event listener.
 * ============================================================================
 *
 * @param {Element|Window|Document} target
 * @param {string} event
 * @param {Function} handler
 * @param {Object|boolean} [options]
 */
export function off(

    target,

    event,

    handler,

    options = false

) {

    target.removeEventListener(

        event,

        handler,

        options

    );

}