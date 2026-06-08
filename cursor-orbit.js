/**
 * Custom Cursor Orbit System
 * Author: Vivan Pandya
 * Description: Creates the dual-ring cursor used across the portfolio.
 * Features: Smooth lerp movement, hover feedback, click feedback,
 * window leave handling, and reduced-motion support.
 */

(function initializeOrbitCursor() {
  const OFFSCREEN_POSITION = -200;
  const LERP_FACTOR = 0.18;
  const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

  /**
   * Native Cursor Override
   * Hides the operating-system cursor so the custom cursor can represent all
   * pointer interactions consistently across the page.
   */
  const nativeCursorStyle = document.createElement("style");
  nativeCursorStyle.textContent = `
    *, *::before, *::after { cursor: none !important; }
  `;
  document.head.appendChild(nativeCursorStyle);

  /**
   * Cursor Markup
   * Builds the outer ring, inner ring, and center dot as one fixed layer.
   */
  const cursorRoot = document.createElement("div");
  cursorRoot.id = "orbit-cursor";
  cursorRoot.setAttribute("aria-hidden", "true");
  cursorRoot.innerHTML = `
    <div class="oc-ring oc-ring--outer"></div>
    <div class="oc-ring oc-ring--inner"></div>
    <div class="oc-dot"></div>
  `;

  /**
   * Cursor Presentation
   * The style block remains colocated with the generated cursor because the
   * component is created dynamically and has no static HTML counterpart.
   */
  const cursorStyle = document.createElement("style");
  cursorStyle.textContent = `
    #orbit-cursor {
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 99999;
      transform: translate(${OFFSCREEN_POSITION}px, ${OFFSCREEN_POSITION}px);
      will-change: transform;
    }

    .oc-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform-origin: center;
      will-change: transform;
    }

    .oc-ring--outer {
      width: 38px;
      height: 38px;
      margin: -19px 0 0 -19px;
      border: 1.5px dashed rgba(99, 102, 241, 0.75);
      animation: orbitCW var(--oc-speed-outer, 3s) linear infinite;
      transition: border-color 0.3s ease, opacity 0.3s ease,
                  width 0.25s ease, height 0.25s ease, margin 0.25s ease;
    }

    .oc-ring--inner {
      width: 24px;
      height: 24px;
      margin: -12px 0 0 -12px;
      border: 1px solid rgba(56, 189, 248, 0.55);
      animation: orbitCCW var(--oc-speed-inner, 2s) linear infinite;
      transition: border-color 0.3s ease, opacity 0.3s ease,
                  width 0.25s ease, height 0.25s ease, margin 0.25s ease;
    }

    .oc-dot {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 5px;
      height: 5px;
      margin: -2.5px 0 0 -2.5px;
      background: #e2e8f0;
      border-radius: 50%;
      box-shadow: 0 0 4px rgba(255,255,255,0.6);
      transition: transform 0.2s ease, background 0.3s ease;
      will-change: transform;
    }

    #orbit-cursor.is-hovering .oc-ring--outer {
      width: 48px;
      height: 48px;
      margin: -24px 0 0 -24px;
      border-color: rgba(99, 102, 241, 1);
    }

    #orbit-cursor.is-hovering .oc-ring--inner {
      width: 30px;
      height: 30px;
      margin: -15px 0 0 -15px;
      border-color: rgba(56, 189, 248, 0.9);
    }

    #orbit-cursor.is-hovering .oc-dot {
      background: #38bdf8;
      transform: scale(1.6);
    }

    #orbit-cursor.is-clicking .oc-ring--outer {
      width: 30px;
      height: 30px;
      margin: -15px 0 0 -15px;
      opacity: 0.5;
    }

    #orbit-cursor.is-clicking .oc-ring--inner {
      width: 18px;
      height: 18px;
      margin: -9px 0 0 -9px;
      opacity: 0.5;
    }

    #orbit-cursor.is-clicking .oc-dot {
      transform: scale(0.6);
    }

    @keyframes orbitCW {
      to { transform: rotate(360deg); }
    }

    @keyframes orbitCCW {
      to { transform: rotate(-360deg); }
    }

    #orbit-cursor.is-hovering {
      --oc-speed-outer: 1.1s;
      --oc-speed-inner: 0.7s;
    }
  `;

  document.head.appendChild(cursorStyle);
  document.body.appendChild(cursorRoot);

  /**
   * Smooth Position Tracking
   * Stores the latest pointer coordinates and interpolates the rendered cursor
   * toward them on each animation frame.
   */
  let mouseX = OFFSCREEN_POSITION;
  let mouseY = OFFSCREEN_POSITION;
  let cursorX = OFFSCREEN_POSITION;
  let cursorY = OFFSCREEN_POSITION;

  document.addEventListener("mousemove", event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  /**
   * Interactive Hover State
   * Expands and accelerates the cursor while it is over actionable elements.
   */
  const HOVER_SELECTOR = [
    "a",
    "button",
    "[role='button']",
    "input",
    "textarea",
    "select",
    "label",
    ".btn",
    ".cv-btn",
    ".project-btn",
    ".skill-card",
    ".modern-project-card",
    ".achievement-card",
    ".interest-tag",
    ".badge",
    ".social-icons a",
    ".contact-box",
    ".nav a",
    ".navbar nav a"
  ].join(", ");

  document.addEventListener("mouseover", event => {
    if (event.target.closest(HOVER_SELECTOR)) {
      cursorRoot.classList.add("is-hovering");
    }
  });

  document.addEventListener("mouseout", event => {
    if (event.target.closest(HOVER_SELECTOR)) {
      cursorRoot.classList.remove("is-hovering");
    }
  });

  /** Click feedback contracts the rings until the pointer is released. */
  document.addEventListener("mousedown", () => {
    cursorRoot.classList.add("is-clicking");
  });

  document.addEventListener("mouseup", () => {
    cursorRoot.classList.remove("is-clicking");
  });

  /** Hide the custom cursor whenever the pointer leaves the document. */
  document.addEventListener("mouseleave", () => {
    cursorRoot.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    cursorRoot.style.opacity = "1";
  });

  /** Continuously applies lerped pointer coordinates to the cursor layer. */
  function updateCursorPosition() {
    cursorX += (mouseX - cursorX) * LERP_FACTOR;
    cursorY += (mouseY - cursorY) * LERP_FACTOR;
    cursorRoot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

    window.requestAnimationFrame(updateCursorPosition);
  }

  window.requestAnimationFrame(updateCursorPosition);

  /** Disable ring rotation for users who request reduced motion. */
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
    cursorStyle.textContent += `
      .oc-ring--outer { animation: none !important; }
      .oc-ring--inner { animation: none !important; }
      #orbit-cursor { transition: none !important; }
    `;
  }
})();