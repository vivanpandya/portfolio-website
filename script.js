document.addEventListener("DOMContentLoaded", function () {

  const roles = [
    "Full Stack Developer",
    "AI/ML Engineer",
    "Software Engineer"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typedText = document.getElementById("typed-text");

  function typeEffect() {
    let currentRole = roles[roleIndex];

    if (isDeleting) {
      typedText.innerHTML = "Aspiring " + currentRole.substring(0, charIndex--);
    } else {
      typedText.innerHTML = "Aspiring " + currentRole.substring(0, charIndex++);
    }

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
      speed = 1500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }

    setTimeout(typeEffect, speed);
  }

  typeEffect();
});

const counters = document.querySelectorAll(".count");

counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute("data-target");
    const current = +counter.innerText;

    const increment = target / 100;

    if (current < target) {
      counter.innerText = Math.ceil(current + increment);
      setTimeout(updateCount, 20);
    } else {
      const hasPlus = counter.getAttribute("data-plus") === "true";
      counter.innerText = hasPlus ? target + "+" : target;
    }
  };

  updateCount();
});

