/**
 * Portfolio Website Interactions
 * Author: Vivan Pandya
 * Description: Controls hero text, counters, navigation state, scroll reveals,
 * scroll progress, and the Three.js technology sphere.
 */

/* ===================================== */
/* PAGE INTERACTIONS */
/* ===================================== */

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Typewriter Effect
   * Displays rotating role titles in the hero section with matching typing,
   * pause, and deletion timings.
   */
  const roles = [
    "Full Stack Developer",
    "AI/ML Engineer",
    "Software Engineer"
  ];
  const TYPE_SPEED_MS = 90;
  const DELETE_SPEED_MS = 45;
  const ROLE_PAUSE_MS = 1800;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typedText = document.getElementById("typed-text");

  function typeEffect() {

      const currentRole = roles[roleIndex];

      if (!isDeleting) {

          typedText.textContent = currentRole.substring(0, charIndex);

          charIndex++;

          if (charIndex > currentRole.length) {

              isDeleting = true;

              setTimeout(typeEffect, ROLE_PAUSE_MS);

              return;
          }

          setTimeout(typeEffect, TYPE_SPEED_MS);

      }

      else {

          typedText.textContent = currentRole.substring(0, charIndex);

          charIndex--;

          if (charIndex < 0) {

              isDeleting = false;

              roleIndex = (roleIndex + 1) % roles.length;

              charIndex = 0;

              setTimeout(typeEffect, 300);

              return;
          }

          setTimeout(typeEffect, DELETE_SPEED_MS);

      }

  }

  if (typedText) {
    typeEffect();
  }

  /**
   * Statistics Counters
   * Animates each hero statistic from zero to its configured data target.
   */
  const COUNTER_STEPS = 100;
  const COUNTER_INTERVAL_MS = 20;
  const counters = document.querySelectorAll(".count");

  counters.forEach(counter => {
    const updateCount = () => {
      const target = Number(counter.getAttribute("data-target"));
      const current = Number(counter.innerText);
      const increment = target / COUNTER_STEPS;

      if (current < target) {
        counter.innerText = Math.ceil(current + increment);
        window.setTimeout(updateCount, COUNTER_INTERVAL_MS);
      } else {
        const hasPlus = counter.getAttribute("data-plus") === "true";
        counter.innerText = hasPlus ? target + "+" : target;
      }
    };

    updateCount();
  });

  /**
   * Navigation State
   * Adds the scrolled navbar treatment and highlights the link associated
   * with the section currently crossing the viewport focus area.
   */
  const NAV_SCROLL_THRESHOLD = 20;
  const NAV_OBSERVER_ROOT_MARGIN = "-35% 0px -55% 0px";
  const navLinks = document.querySelectorAll(".navbar nav a[href^='#']");
  const sections = document.querySelectorAll("section[id]");
  const navbar = document.querySelector(".navbar");

  function updateNavbarState() {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > NAV_SCROLL_THRESHOLD);
    }
  }

  function setActiveLink(sectionId) {
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + sectionId);
    });
  }

  updateNavbarState();
  window.addEventListener("scroll", updateNavbarState, { passive: true });

  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      const sectionId = this.getAttribute("href").slice(1);
      setActiveLink(sectionId);
    });
  });

  const heroChatButton = document.getElementById("hero-open-chat");

  heroChatButton?.addEventListener("click", () => {
    const chatLauncher = document.getElementById("open-chat");

    if (chatLauncher) {
      chatLauncher.click();
      heroChatButton.setAttribute("aria-expanded", "true");
    }
  });

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, {
    rootMargin: NAV_OBSERVER_ROOT_MARGIN,
    threshold: 0
  });

  sections.forEach(section => navObserver.observe(section));

  if (sections.length > 0) {
    setActiveLink(sections[0].id);
  }

  /**
   * Scroll Reveal Registration
   * Assigns directional reveal classes and stagger delays without modifying
   * the underlying layout or component styles.
   */
  const REVEAL_THRESHOLD = 0.16;
  const REVEAL_ROOT_MARGIN = "0px 0px -10% 0px";
  const revealItems = [];

  function addReveal(selector, direction, staggerStep = 0, delayOffset = 0) {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal", "reveal-" + direction);
      element.style.setProperty("--reveal-delay", delayOffset + index * staggerStep + "ms");
      revealItems.push(element);
    });
  }

  addReveal(".hero-left .badge, .hero-left h1, .typing, .hero-left p, .buttons, .socials", "left", 80);
  addReveal(".stats .card", "right", 90, 180);
  addReveal(".about .section-title, .about-heading", "up", 90);
  addReveal(".about-left", "left");
  addReveal(".about-right", "right", 0, 120);
  addReveal(".skills-section .section-tag, .skills-section .section-title", "up", 90);
  addReveal(".skill-card", "up", 85);
  addReveal(".projects-section .section-tag, .projects-section .section-title", "up", 90);
  addReveal(".project-card", "up", 110);
  addReveal(".achievements-section .section-tag, .achievements-section .section-title", "up", 90);
  addReveal(".achievement-card", "up", 110);
  addReveal(".contact-section .section-tag, .contact-section .section-title", "up", 90);
  addReveal(".contact-left", "left");
  addReveal(".contact-box", "left", 80, 90);
  addReveal(".contact-form", "right", 0, 120);

  const cinematicSphere = document.getElementById("tech-sphere");

  if (cinematicSphere) {
    revealItems.push(cinematicSphere);
  }

  const reducedMotionEnabled = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || reducedMotionEnabled) {
    revealItems.forEach(element => element.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: REVEAL_THRESHOLD,
    rootMargin: REVEAL_ROOT_MARGIN
  });

  revealItems.forEach(element => revealObserver.observe(element));
});

/* ===================================== */
/* SCROLL PROGRESS */
/* ===================================== */

/**
 * Scroll Progress Indicator
 * Converts the document scroll position into a percentage used by the fixed
 * progress bar at the top of the viewport.
 */
const scrollProgress = document.getElementById("scrollProgress");
const scrollProgressBar = scrollProgress?.querySelector(".scroll-progress-bar");

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const documentScrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / documentScrollRange) * 100;

  if (scrollProgressBar) {
    scrollProgressBar.style.width = scrollPercent + "%";
  }
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

/* ===================================== */
/* THREE.JS TECHNOLOGY SPHERE */
/* ===================================== */

/**
 * Technology Sphere
 * Renders the hero's wireframe sphere, orbital rings, technology labels, and
 * ambient particles. The renderer is scoped to #tech-sphere and pauses while
 * the document is hidden.
 */
const sphereContainer = document.getElementById("tech-sphere");

if (sphereContainer && window.THREE) {
  const MAX_PIXEL_RATIO = 1.8;
  const MAX_FRAME_DELTA = 0.033;
  const LABEL_CANVAS_WIDTH = 448;
  const LABEL_CANVAS_HEIGHT = 144;
  const LABEL_ORBIT_RADIUS = 2.92;
  const AMBIENT_PARTICLE_COUNT = 90;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.pointerEvents = "none";
  sphereContainer.appendChild(renderer.domElement);

  /** Wireframe sphere and layered glow meshes. */
  const hudGroup = new THREE.Group();
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.55, 56, 36),
    new THREE.MeshBasicMaterial({
      color: 0x28e9ff,
      wireframe: true,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  const innerCore = new THREE.Mesh(
    new THREE.SphereGeometry(1.45, 40, 28),
    new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  const outerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(1.9, 40, 28),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.09,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );

  /** Independent orbital rings create the HUD-style motion around the sphere. */
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x67e8f9,
    transparent: true,
    opacity: 0.26,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const ringOne = new THREE.Mesh(new THREE.TorusGeometry(2.08, 0.006, 8, 160), ringMaterial);
  const ringTwo = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.005, 8, 160), ringMaterial.clone());
  const ringThree = new THREE.Mesh(new THREE.TorusGeometry(1.82, 0.004, 8, 160), ringMaterial.clone());

  ringOne.rotation.x = Math.PI / 2.6;
  ringTwo.rotation.y = Math.PI / 2.15;
  ringThree.rotation.x = Math.PI / 2;
  ringThree.rotation.z = Math.PI / 5;
  ringTwo.material.opacity = 0.2;
  ringThree.material.opacity = 0.18;

  hudGroup.add(outerGlow, innerCore, sphere, ringOne, ringTwo, ringThree);
  scene.add(hudGroup);

  /** Technology labels are rendered to canvas textures and mapped to sprites. */
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "Express.js",
    "Python",
    "C++",
    "GitHub"
  ];
  const skillSprites = [];

  function drawRoundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
  }

  function createLabelTexture(label) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = LABEL_CANVAS_WIDTH;
    canvas.height = LABEL_CANVAS_HEIGHT;
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawRoundedRect(context, 28, 34, 392, 76, 23);
    context.fillStyle = "rgba(2, 6, 23, 0.84)";
    context.fill();
    context.strokeStyle = "rgba(56, 189, 248, 0.78)";
    context.lineWidth = 2.4;
    context.stroke();

    context.shadowColor = "rgba(34, 211, 238, 1)";
    context.shadowBlur = 20;
    context.font = "700 36px Poppins, Arial, sans-serif";
    context.fillStyle = "#e0fbff";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(label, 224, 72);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    return texture;
  }

  skills.forEach((skill, index) => {
    const spriteMaterial = new THREE.SpriteMaterial({
      map: createLabelTexture(skill),
      transparent: true,
      opacity: 0.95,
      depthTest: false,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    const angle = (index / skills.length) * Math.PI * 2;

    sprite.scale.set(1.22, 0.4, 1);
    sprite.renderOrder = 10;
    scene.add(sprite);

    skillSprites.push({
      sprite,
      angle,
      orbitRadius: LABEL_ORBIT_RADIUS
    });
  });

  camera.position.set(0, 0.08, 6.2);

  /** Ambient points add subtle depth around the primary sphere. */
  const particlesGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(AMBIENT_PARTICLE_COUNT * 3);

  for (let index = 0; index < particlePositions.length; index++) {
    particlePositions[index] = (Math.random() - 0.5) * 7.2;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3)
  );

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.024,
    color: 0x67e8f9,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);

  scene.add(particlesMesh);

  const clock = new THREE.Clock();
  let animationFrameId;

  /** Keeps the WebGL viewport synchronized with its responsive container. */
  function resizeSphere() {
    const sphereWidth = sphereContainer.clientWidth;
    const sphereHeight = sphereContainer.clientHeight;

    if (!sphereWidth || !sphereHeight) {
      return;
    }

    renderer.setSize(sphereWidth, sphereHeight, false);
    camera.aspect = sphereWidth / sphereHeight;
    camera.updateProjectionMatrix();
  }

  /** Advances all rotations and orbit positions using frame-rate-independent time. */
  function animateSphere() {
    if (document.hidden) {
      animationFrameId = null;
      return;
    }

    animationFrameId = window.requestAnimationFrame(animateSphere);
    const delta = Math.min(clock.getDelta(), MAX_FRAME_DELTA);
    const elapsed = clock.elapsedTime;

    hudGroup.rotation.y += delta * 0.34;
    hudGroup.rotation.x = Math.sin(elapsed * 0.35) * 0.08;

    ringOne.rotation.z += delta * 0.34;
    ringTwo.rotation.x += delta * 0.26;
    ringThree.rotation.y -= delta * 0.22;

    skillSprites.forEach((item, index) => {
      const angle = item.angle + elapsed * 0.45;
      const yFloat = Math.sin(angle * 1.7 + index) * 0.34;
      const zPosition = Math.sin(angle) * item.orbitRadius;
      const depthOpacity = THREE.MathUtils.clamp(
        0.58 + ((zPosition + item.orbitRadius) / (item.orbitRadius * 2)) * 0.42,
        0.58,
        1
      );

      item.sprite.position.set(
        Math.cos(angle) * item.orbitRadius,
        yFloat,
        zPosition * 0.62
      );
      item.sprite.material.opacity = depthOpacity;
    });

    particlesMesh.rotation.y += delta * 0.16;
    particlesMesh.rotation.x += delta * 0.06;

    renderer.render(scene, camera);
  }

  resizeSphere();
  animateSphere();

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(resizeSphere);
    resizeObserver.observe(sphereContainer);
  } else {
    window.addEventListener("resize", resizeSphere);
  }

  /** Pauses GPU work in background tabs and resumes from a fresh clock delta. */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    } else if (!animationFrameId) {
      clock.getDelta();
      animateSphere();
    }
  });
}


/**
 * ============================================================================
 * SKILLS CAROUSEL
 * ============================================================================
 *
 * Vanilla JS carousel for the Skills section.
 *
 * Features:
 * - Left / right arrow navigation
 * - Mouse drag-to-scroll (touch swipe is handled natively by the browser)
 * - CSS scroll-snap for smooth, aligned stops
 * - Seamless infinite looping via a "triple strip" clone technique:
 *   [clones][real cards][clones], silently re-centered when the user
 *   scrolls into a cloned region.
 *
 * No external libraries.
 * ============================================================================
 */
(function () {
  "use strict";

  function initCarousel(prefix) {
    const carousel = document.getElementById(prefix + "Carousel");
    const viewport = document.getElementById(prefix + "Viewport");
    const track = document.getElementById(prefix + "Track");
    const prevButton = document.getElementById(prefix + "Prev");
    const nextButton = document.getElementById(prefix + "Next");

    if (!carousel || !viewport || !track || !prevButton || !nextButton) {
      return;
    }

    const realCards = Array.from(track.querySelectorAll("[data-card]"));
    const realCount = realCards.length;

    if (realCount === 0) {
      return;
    }

    const reduceMotion = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

    /**
     * Builds one cloned copy of every real card for the infinite-loop buffer.
     * Clones are hidden from assistive tech and removed from tab order.
     */
    function buildCloneSet() {
      return realCards.map(function (card) {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("tabindex", "-1");
        clone.removeAttribute("id");
        clone.removeAttribute("data-card");
        clone.querySelectorAll("[id]").forEach(function (node) {
          node.removeAttribute("id");
        });
        return clone;
      });
    }

    const leadingClones = buildCloneSet();
    const trailingClones = buildCloneSet();

    track.prepend(...leadingClones);
    track.append(...trailingClones);

    let cardStep = 0;
    let currentIndex = realCount;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;
    let settleTimer = null;

    /** Measures the pixel distance between two adjacent real cards. */
    function measure() {
      const first = realCards[0].getBoundingClientRect();

      if (realCount > 1) {
        const second = realCards[1].getBoundingClientRect();
        cardStep = Math.round(Math.abs(second.left - first.left));
      } else {
        cardStep = Math.round(first.width);
      }

      if (!cardStep) {
        cardStep = Math.round(realCards[0].offsetWidth) || 1;
      }
    }

    /** Instantly sets scroll position with no animation. */
    function jumpTo(scrollLeft) {
      const previousBehavior = viewport.style.scrollBehavior;
      viewport.style.scrollBehavior = "auto";
      viewport.scrollLeft = scrollLeft;
      viewport.style.scrollBehavior = previousBehavior || "";
    }

    /** Navigates to an absolute card index within the triple strip. */
    function goTo(index, options) {
      const smooth = !reduceMotion && !(options && options.smooth === false);

      currentIndex = index;
      const left = index * cardStep;

      if (smooth && typeof viewport.scrollTo === "function") {
        viewport.scrollTo({ left: left, behavior: "smooth" });
      } else {
        jumpTo(left);
      }
    }

    /** Silently re-centers the strip if the user has scrolled into a clone region. */
    function handleSettle() {
      if (isDragging || !cardStep) {
        return;
      }

      let changed = false;

      while (currentIndex < realCount) {
        currentIndex += realCount;
        changed = true;
      }

      while (currentIndex >= realCount * 2) {
        currentIndex -= realCount;
        changed = true;
      }

      if (changed) {
        jumpTo(currentIndex * cardStep);
      }
    }

    function scheduleSettleCheck() {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(handleSettle, 220);
    }

    function goNext() {
      goTo(currentIndex + 1);
    }

    function goPrev() {
      goTo(currentIndex - 1);
    }

    nextButton.addEventListener("click", goNext);
    prevButton.addEventListener("click", goPrev);

    carousel.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        goNext();
      } else if (event.key === "ArrowLeft") {
        goPrev();
      }
    });

    viewport.addEventListener("scroll", scheduleSettleCheck, { passive: true });
    if ("onscrollend" in window) {
      viewport.addEventListener("scrollend", handleSettle);
    }

    /** Mouse drag-to-scroll. Native touch swipe is left to the browser. */
    function onPointerDown(event) {

        // Agar button ya link pe click hua hai to drag start mat karo
        if (event.target.closest("a")) {
            return;
        }

        if (event.pointerType === "touch") {
            return;
        }

        isDragging = true;
        dragStartX = event.clientX;
        dragStartScrollLeft = viewport.scrollLeft;
        viewport.classList.add("is-dragging");

        if (viewport.setPointerCapture) {
            viewport.setPointerCapture(event.pointerId);
        }
    }

    function onPointerMove(event) {

        if (!isDragging) {
            return;
        }

        if (!event.target.closest("a")) {
            event.preventDefault();
        }

        const delta = event.clientX - dragStartX;
        viewport.scrollLeft = dragStartScrollLeft - delta;
    }

    function endDrag() {
      if (!isDragging) {
        return;
      }

      isDragging = false;
      viewport.classList.remove("is-dragging");

      if (cardStep) {
        currentIndex = Math.round(viewport.scrollLeft / cardStep);
      }

      goTo(currentIndex);
    }

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", function (event) {
      if (isDragging && event.buttons === 0) {
        endDrag();
      }
    });

    /** Keeps the visible card stable (by relative position) across breakpoint changes. */
    let resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        const relativeIndex = ((currentIndex - realCount) % realCount + realCount) % realCount;
        measure();
        goTo(realCount + relativeIndex, { smooth: false });
      }, 150);
    });

    function init() {
      measure();
      goTo(realCount, { smooth: false });
    }

    init();

    track.querySelectorAll("a").forEach(link => {

        link.addEventListener("pointerdown", function(e){
            e.stopPropagation();
        });

        link.addEventListener("click", function(e){
            e.stopPropagation();
        });

    });

    window.addEventListener("load", measure);
  }

if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", function () {

        initCarousel("skills");
        initCarousel("projects");
        initCarousel("achievement");

    });

} else {

    initCarousel("skills");
    initCarousel("projects");
    initCarousel("achievement");

}

})();

