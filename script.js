/* ---------- THEME  ---------- */

function getSavedTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch (e) {}
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

document.documentElement.setAttribute("data-theme", getSavedTheme());

document.addEventListener("DOMContentLoaded", () => {
  /* HERO ROLE ROTATION */

  (function initRoleRotation() {
    const titles = [
      "UI/UX Designer |",
      "Product Designer |",
      "Frontend Developer |",
    ];

    const role = document.querySelector(".des");
    if (!role) return;

    let index = 0;

    setInterval(() => {
      index = (index + 1) % titles.length;
      role.textContent = titles[index];
    }, 3000);
  })();

  /* NAVIGATION ACTIVE LINK */

  (function initActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav_links a, .mobile-links a");

    if (!sections.length || !navLinks.length) return;

    let ticking = false;

    function setActiveLink() {
      const scrollPos = window.scrollY + 140;
      let currentSection = "";

      sections.forEach((section) => {
        if (scrollPos >= section.offsetTop) {
          currentSection = section.id;
        }
      });

      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          currentSection !== "" &&
            link.getAttribute("href") === `#${currentSection}`,
        );
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setActiveLink();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    /* Correct state immediately on load */
    setActiveLink();
  })();

  /* MOBILE MENU TOGGLE */

  (function initMobileMenu() {
    const openMenu = document.getElementById("openMenu");
    const closeMenu = document.getElementById("closeMenu");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!openMenu || !closeMenu || !mobileMenu) return;

    function closeMobileMenu() {
      mobileMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "";
      openMenu.setAttribute("aria-expanded", "false");
    }

    function openMobileMenu() {
      mobileMenu.classList.add("active");
      document.body.classList.add("menu-open");
      document.body.style.overflow = "hidden";
      openMenu.setAttribute("aria-expanded", "true");
    }

    /* In the HTML these are a <div> and a <span>, so give them button behaviour */
    [
      [openMenu, "Open menu", openMobileMenu],
      [closeMenu, "Close menu", closeMobileMenu],
    ].forEach(([el, label, handler]) => {
      if (el.tagName !== "BUTTON") {
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
      }
      el.setAttribute("aria-label", label);
      el.addEventListener("click", handler);
      el.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handler();
        }
      });
    });

    openMenu.setAttribute("aria-expanded", "false");

    document.querySelectorAll(".mobile-links a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileMenu.classList.contains("active")) {
        closeMobileMenu();
      }
    });
  })();

  /* THEME TOGGLE */

  (function initThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    const themeIcon = themeToggle.querySelector(".theme-icon");
    const backgroundVideo = document.getElementById("themeBackgroundVideo");

    const themeVideos = {
      light: "assets/videos/black_bone_orange_light.mp4",
      dark: "assets/videos/black_bone_orange_dark.mp4",
    };

    function getTheme() {
      return document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
    }

    function updateThemeIcon() {
      const currentTheme = getTheme();

      if (themeIcon) {
        themeIcon.textContent = currentTheme === "dark" ? "☀" : "☾";
      }

      themeToggle.setAttribute(
        "aria-label",
        currentTheme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode",
      );
    }

    function updateBackgroundVideo() {
      if (!backgroundVideo) return;

      const newSource = themeVideos[getTheme()];
      if (!newSource) return;

      /* Compare against the attribute we set ourselves */
      const currentSrc = backgroundVideo.getAttribute("src") || "";

      if (currentSrc.endsWith(newSource)) return;

      backgroundVideo.setAttribute("src", newSource);

      try {
        backgroundVideo.load();

        const playPromise = backgroundVideo.play();

        if (playPromise !== undefined) {
          playPromise.catch(() => {
            /* Autoplay may be blocked by the browser */
          });
        }
      } catch (error) {
        /* Prevent video errors from breaking the rest of the JS */
      }
    }

    updateThemeIcon();
    updateBackgroundVideo();

    themeToggle.addEventListener("click", () => {
      const newTheme = getTheme() === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);

      try {
        localStorage.setItem("theme", newTheme);
      } catch (e) {
        /* Ignore storage errors */
      }

      updateThemeIcon();
      updateBackgroundVideo();
    });
  })();

  /* CONTACT FORM */

  (function initContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("formStatus");
    const button = document.getElementById("submitBtn");

    if (!form || !status || !button) return;

    let hideTimer = null;

    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      clearTimeout(hideTimer);

      button.classList.add("loading");
      button.disabled = true;

      status.style.display = "none";
      status.style.color = "";

      const data = new FormData(form);

      try {
        const response = await fetch("https://formspree.io/f/xnjjagjj", {
          method: "POST",
          body: data,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          form.reset();

          status.innerHTML = `
            <span class="status-title">Message sent!</span>
            <span class="status-subtitle">
              Thanks for reaching out. I'll get back to you soon.
            </span>
          `;

          status.style.display = "block";

          hideTimer = setTimeout(() => {
            status.style.display = "none";
          }, 4000);
        } else {
          status.textContent = "Something went wrong! Please try again.";
          status.style.color = "red";
          status.style.display = "block";
        }
      } catch (error) {
        status.textContent = "Network error! Please try again later.";
        status.style.color = "red";
        status.style.display = "block";
      } finally {
        button.classList.remove("loading");
        button.disabled = false;
      }
    });
  })();

  /* REVEAL ON SCROLL */

  (function initReveal() {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    /* Fallback for very old browsers: just show everything */
    if (!("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("active"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    reveals.forEach((el) => observer.observe(el));
  })();

  /* =======================================================
     PROJECT FILTER + MOBILE PROJECT TAP
  ======================================================= */

  (function initProjects() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    if (!projectCards.length) return;

    const DEFAULT_FILTER = "featured";

    function filterProjects(filter) {
      projectCards.forEach((card) => {
        const categories = (card.dataset.category || "")
          .split(/\s+/)
          .filter(Boolean);

        const featured = card.dataset.featured === "true";

        const shouldShow =
          filter === "featured" ? featured : categories.includes(filter);

        card.classList.toggle("project-hidden", !shouldShow);

        /* Avoid stale mobile state on hidden cards */
        if (!shouldShow) {
          card.classList.remove("mobile-active");
        }
      });
    }

    function setActiveButton(filter) {
      filterButtons.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.filter === filter);
      });
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        setActiveButton(filter);
        filterProjects(filter);
      });
    });

    /* Default view, with matching active button */
    setActiveButton(DEFAULT_FILTER);
    filterProjects(DEFAULT_FILTER);

    /* ----- Mobile tap ----- */

    const MOBILE_BREAKPOINT = 768;

    projectCards.forEach((card) => {
      card.addEventListener("click", (event) => {
        if (window.innerWidth > MOBILE_BREAKPOINT) return;

        /* Don't toggle when using buttons/links inside the image */
        if (event.target.closest(".image-actions")) return;

        projectCards.forEach((otherCard) => {
          if (otherCard !== card) {
            otherCard.classList.remove("mobile-active");
          }
        });

        card.classList.toggle("mobile-active");
      });
    });

    /* Clear mobile state when the viewport grows (debounced) */
    let resizeTimer = null;

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
          projectCards.forEach((card) => {
            card.classList.remove("mobile-active");
          });
        }
      }, 150);
    });
  })();

  /* CASE STUDY MODAL*/

  (function initCaseStudyModal() {
    const caseStudyModal = document.getElementById("caseStudyModal");
    const caseStudyContent = document.getElementById("caseStudyContent");
    const caseStudyClose = document.getElementById("caseStudyClose");
    const caseStudyBackdrop = document.getElementById("caseStudyBackdrop");

    if (
      !caseStudyModal ||
      !caseStudyContent ||
      !caseStudyClose ||
      !caseStudyBackdrop
    ) {
      console.error("Case Study Modal elements not found.");
      return;
    }

    /* Accessibility attributes (HTML also sets these; kept as a safety net) */
    caseStudyModal.setAttribute("role", "dialog");
    caseStudyModal.setAttribute("aria-modal", "true");
    caseStudyModal.setAttribute("aria-hidden", "true");
    caseStudyClose.setAttribute("aria-label", "Close case study");

    const caseStudies = {
      amazon: {
        label: "UI/UX • Product Design",
        title: "AI-Powered Amazon Creative SaaS",
        intro:
          "A SaaS UI/UX concept designed for an AI-powered platform that helps Amazon sellers generate product creatives through a clearer and more structured workflow.",
        role: "UI/UX Designer",
        tools: "Figma",
        type: "SaaS Product",
        problem:
          "The goal was to create a product experience that makes an AI-driven creative generation workflow easier to understand and navigate.",
        process: ["Research", "User Flow", "Wireframes", "UI Design"],
        solution:
          "The interface was structured around clear navigation, organized content, and a scalable product experience that keeps the creative generation workflow easy to follow.",
        outcome:
          "A complete SaaS interface concept focused on simplifying complex AI workflows while maintaining a clean and professional product experience.",
        hero: "assets/images/Project-01.png",
        gallery: [
          "assets/images/case-studies/amazon/amazon-01.png",
          "assets/images/case-studies/amazon/amazon-02.png",
          "assets/images/case-studies/amazon/amazon-03.png",
          "assets/images/case-studies/amazon/amazon-04.png",
        ],
        actions: [
          {
            label: "View Design",
            url: "https://www.figma.com/design/xTW4QseeJBXcI4cAgo9PAo/Untitled?node-id=2-2&t=yiEk9UtQv9cSlZNK-1",
            icon: "fa-brands fa-figma",
          },
          {
            label: "View Prototype",
            url: "https://www.figma.com/proto/xTW4QseeJBXcI4cAgo9PAo/Untitled?node-id=2-2",
            icon: "fa-solid fa-arrow-up-right-from-square",
          },
        ],
      },

      "employee-leave-management": {
        label: "UI/UX • Dashboard",
        title: "Employee Leave Management System",
        intro:
          "A dashboard experience designed to simplify employee leave requests, employee records, and administrative management.",
        role: "UI/UX Designer",
        tools: "Figma",
        type: "Dashboard",
        problem:
          "The interface needed to make employee leave management easier to understand while keeping important administrative information accessible.",
        process: ["User Flow", "Wireframes", "Dashboard Design", "Prototype"],
        solution:
          "A structured dashboard system was designed with clear navigation, organized information, and consistent UI patterns.",
        outcome:
          "A professional dashboard experience that makes workplace information easier to navigate and manage.",
        hero: "assets/images/Project-02.png",
        gallery: [
          "assets/images/case-studies/employee-leave-management/employee-leave-management-01.png",
          "assets/images/case-studies/employee-leave-management/employee-leave-management-02.png",
          "assets/images/case-studies/employee-leave-management/employee-leave-management-03.png",
          "assets/images/case-studies/employee-leave-management/employee-leave-management-04.png",
        ],
        actions: [
          {
            label: "View Design",
            url: "https://www.figma.com/community/file/1591701817203026728/company-dashboard-ui-production",
            icon: "fa-brands fa-figma",
          },
          {
            label: "View Prototype",
            url: "https://www.figma.com/proto/reAu3hW2VfCRQXzb2toAke/Company-Dashboard-%E2%80%93-UI-Production?node-id=3-139",
            icon: "fa-solid fa-arrow-up-right-from-square",
          },
        ],
      },

      rajratan: {
        label: "UI/UX • Web Design",
        title: "Rajratan Business Website",
        intro:
          "A professional business website designed in Figma using structured wireframes and carefully planned content sections.",
        role: "UI/UX Designer",
        tools: "Figma",
        type: "Website",
        problem:
          "The website needed a clear visual hierarchy and structured presentation to communicate business information effectively.",
        process: [
          "Research",
          "Information Architecture",
          "Wireframes",
          "UI Design",
        ],
        solution:
          "The interface focuses on visual hierarchy, typography, spacing, and clear presentation.",
        outcome: "A polished and user-friendly business website concept.",
        hero: "assets/images/Project-03.png",
        gallery: [
          "assets/images/case-studies/rajratan-01.png",
          "assets/images/case-studies/rajratan-02.png",
          "assets/images/case-studies/rajratan-03.png",
          "assets/images/case-studies/rajratan-04.png",
        ],
        actions: [
          {
            label: "View Design",
            url: "https://www.figma.com/community/file/1591710610125375348",
            icon: "fa-brands fa-figma",
          },
          {
            label: "View Prototype",
            url: "https://www.figma.com/proto/NonXMai6QtKYMJMB7Rx6lX/Rajratan?node-id=3-2",
            icon: "fa-solid fa-arrow-up-right-from-square",
          },
        ],
      },

      "course-enrollment": {
        label: "UI/UX • App Design",
        title: "Student Course Enrollment App",
        intro:
          "A course enrollment application designed to make course discovery and enrollment simple and intuitive.",
        role: "UI/UX Designer",
        tools: "Figma",
        type: "Application",
        problem:
          "Students need a straightforward way to browse courses and complete enrollment without unnecessary complexity.",
        process: ["User Flow", "Wireframes", "UI Design", "Prototype"],
        solution:
          "The interface was structured around a clear enrollment journey with simple navigation and organized course information.",
        outcome:
          "A clean course enrollment experience focused on usability and clarity.",
        hero: "assets/images/Project-04.png",
        gallery: [
          "assets/images/case-studies/course-enrollment/course-enrollment-01.png",
          "assets/images/case-studies/course-enrollment/course-enrollment-02.png",
          "assets/images/case-studies/course-enrollment/course-enrollment-03.png",
          "assets/images/case-studies/course-enrollment/course-enrollment-04.png",
        ],
        actions: [
          {
            label: "View Design",
            url: "https://www.figma.com/design/D5u3nWbx81Cx56dM3jS27x/Course--Enrollment-System?node-id=2-2",
            icon: "fa-brands fa-figma",
          },
          {
            label: "View Prototype",
            url: "https://www.figma.com/proto/D5u3nWbx81Cx56dM3jS27x/Course--Enrollment-System?node-id=2-2",
            icon: "fa-solid fa-arrow-up-right-from-square",
          },
        ],
      },

      framer: {
        label: "Framer • Web Design",
        title: "Portfolio Website — Framer",
        intro:
          "A modern portfolio website designed and built in Framer with a focus on visual presentation and responsive interaction.",
        role: "Designer & Builder",
        tools: "Framer",
        type: "Portfolio Website",
        problem:
          "The portfolio needed a modern presentation that could communicate design skills and projects effectively.",
        process: [
          "Structure",
          "Visual Design",
          "Interaction",
          "Responsive Design",
        ],
        solution:
          "A responsive portfolio experience combining visual design, content structure, and interactive elements.",
        outcome: "A polished Framer portfolio experience.",
        hero: "assets/images/Project-05.png",
        gallery: [
          "assets/images/case-studies/framer/framer-01.png",
          "assets/images/case-studies/framer/framer-02.png",
          "assets/images/case-studies/framer/framer-03.png",
          "assets/images/case-studies/framer/framer-04.png",
        ],
        actions: [
          {
            label: "View Live Site",
            url: "https://saurabh54e.framer.website/",
            icon: "fa-solid fa-arrow-up-right-from-square",
          },
        ],
      },

      javascript: {
        label: "Frontend • JavaScript",
        title: "30 Days JavaScript Projects",
        intro:
          "A collection of JavaScript projects created as part of a 30-day challenge to strengthen frontend development and JavaScript fundamentals.",
        role: "Frontend Developer",
        tools: "HTML • CSS • JavaScript",
        type: "Frontend Projects",
        problem:
          "The challenge was to consistently build practical projects while improving JavaScript fundamentals, UI implementation, and problem-solving skills.",
        process: ["Concept", "UI Design", "Development", "Testing"],
        solution:
          "Each project focused on a specific interaction or functionality, turning JavaScript concepts into small, usable web experiences.",
        outcome:
          "A growing collection of practical frontend projects demonstrating consistency, JavaScript fundamentals, and hands-on development experience.",
        hero: "assets/images/Project-06.png",
        gallery: [
          "assets/images/case-studies/javascript/javascript-01.png",
          "assets/images/case-studies/javascript/javascript-02.png",
          "assets/images/case-studies/javascript/javascript-03.png",
          "assets/images/case-studies/javascript/javascript-04.png",
        ],
        actions: [
          {
            label: "View GitHub",
            url: "https://github.com/saurabh54e/30-JavaScript-Project-Collection",
            icon: "fa-brands fa-github",
          },
          {
            label: "View Live Project",
            url: "https://saurabh54e.github.io/30-JavaScript-Project-Collection/",
            icon: "fa-solid fa-arrow-up-right-from-square",
          },
        ],
      },
    };

    let lastFocusedElement = null;

    function buildCaseStudyHTML(data) {
      const hero = data.hero
        ? `
          <div class="case-study-hero">
            <img src="${data.hero}" alt="${data.title}" loading="eager">
          </div>
        `
        : "";

      const processItems = data.process
        .map(
          (step, index) => `
            <div class="case-study-process-item">
              <span class="case-study-process-number">0${index + 1}</span>
              <span class="case-study-process-title">${step}</span>
            </div>
          `,
        )
        .join("");

      const actions =
        data.actions && data.actions.length
          ? `
            <div class="case-study-actions">
              ${data.actions
                .map(
                  (action) => `
                    <a
                      href="${action.url}"
                      class="case-study-action"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i class="${action.icon}" aria-hidden="true"></i>
                      ${action.label}
                    </a>
                  `,
                )
                .join("")}
            </div>
          `
          : "";

      return `
        ${hero}

        <div class="case-study-header">
          <span class="case-study-label">${data.label}</span>
          <h2 class="case-study-title" id="caseStudyTitle">${data.title}</h2>
          <p class="case-study-intro">${data.intro}</p>
        </div>

        <div class="case-study-meta">
          <div class="case-study-meta-item">
            <span class="case-study-meta-label">Role</span>
            <span class="case-study-meta-value">${data.role}</span>
          </div>
          <div class="case-study-meta-item">
            <span class="case-study-meta-label">Tools</span>
            <span class="case-study-meta-value">${data.tools}</span>
          </div>
          <div class="case-study-meta-item">
            <span class="case-study-meta-label">Project Type</span>
            <span class="case-study-meta-value">${data.type}</span>
          </div>
        </div>

        <section class="case-study-section">
          <h3>The Problem</h3>
          <p>${data.problem}</p>
        </section>

        <section class="case-study-section">
          <h3>Design Process</h3>
          <div class="case-study-process">${processItems}</div>
        </section>

         

        <section class="case-study-section">
          <h3>The Solution</h3>
          <p>${data.solution}</p>
        </section>

        <div class="case-study-section">
         <h3>Gallery</h3>

        <div class="case-study-gallery">
        ${data.gallery
          .map(
            (image, index) => `
        <div class="case-study-gallery-item">
        <img
          src="${image}"
          alt="${data.title} — Screen ${index + 1}"
          loading="lazy"
        >
        </div>
        `,
          )
          .join("")}
        </div>
        </div>
        <section class="case-study-section">
          <h3>Outcome</h3>
          <div class="case-study-outcome">
            <p>${data.outcome}</p>
          </div>
        </section>

        ${actions}
      `;
    }

    function openCaseStudy(project) {
      const data = caseStudies[project];

      if (!data) {
        console.error("Case study not found:", project);
        return;
      }

      lastFocusedElement = document.activeElement;

      caseStudyContent.innerHTML = buildCaseStudyHTML(data);

      /* Always start at the top of the modal */
      caseStudyContent.scrollTop = 0;
      caseStudyModal.scrollTop = 0;

      caseStudyModal.setAttribute("aria-hidden", "false");
      caseStudyModal.classList.add("active");
      document.body.style.overflow = "hidden";

      /* Move focus into the dialog */
      caseStudyClose.focus();
    }

    function closeCaseStudy() {
      if (!caseStudyModal.classList.contains("active")) return;

      caseStudyModal.classList.remove("active");
      caseStudyModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";

      /* Return focus to the button that opened the modal */
      if (
        lastFocusedElement &&
        typeof lastFocusedElement.focus === "function"
      ) {
        lastFocusedElement.focus();
      }
      lastFocusedElement = null;
    }

    /* Case study buttons */
    document.querySelectorAll(".case-study-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        openCaseStudy(button.dataset.caseStudy);
      });
    });

    caseStudyClose.addEventListener("click", closeCaseStudy);
    caseStudyBackdrop.addEventListener("click", closeCaseStudy);

    /* Escape to close + simple focus trap */
    document.addEventListener("keydown", (event) => {
      if (!caseStudyModal.classList.contains("active")) return;

      if (event.key === "Escape") {
        closeCaseStudy();
        return;
      }

      if (event.key === "Tab") {
        const focusable = caseStudyModal.querySelectorAll(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  })();
});
