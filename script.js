/* Hero Role Rotation */
const titles = [
  "UI/UX Designer |",
  "Product Designer |",
  "Frontend Developer |"
];

const role = document.querySelector(".des");
let i = 0;

if (role) {
  setInterval(() => {
    i = (i + 1) % titles.length;
    role.textContent = titles[i];
  }, 3000);
}

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(
  ".nav_links a, .mobile-links a"
);


function setActiveLink() {
  const scrollY = window.scrollY + 140;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.id;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${sectionId}`
        );
      });
    }
  });
}

window.addEventListener("scroll", setActiveLink);


   /* MOBILE MENU TOGGLE */


document.addEventListener("DOMContentLoaded", () => {
  const openMenu = document.getElementById("openMenu");
  const closeMenu = document.getElementById("closeMenu");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!openMenu || !closeMenu || !mobileMenu) return;

  openMenu.addEventListener("click", () => {
    mobileMenu.classList.add("active");
    document.body.classList.add("menu-open");
    document.body.style.overflow = "hidden";
  });

  closeMenu.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    document.body.classList.remove("menu-open");
    document.body.style.overflow = "";
  });

  document.querySelectorAll(".mobile-links a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "";
    });
  });
});

/* THEME TOGGLE */

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle?.querySelector(".theme-icon");
  const backgroundVideo = document.getElementById("themeBackgroundVideo");

  if (!themeToggle) return;

  const themeVideos = {
    light: "assets/videos/black_bone_orange_light.mp4",
    dark: "assets/videos/black_bone_orange_dark.mp4"
  };

  const savedTheme = localStorage.getItem("theme") || "light";

  document.documentElement.setAttribute("data-theme", savedTheme);

  function updateThemeIcon() {
    const currentTheme =
      document.documentElement.getAttribute("data-theme");

    if (themeIcon) {
      themeIcon.textContent =
        currentTheme === "dark" ? "☀" : "☾";
    }

    themeToggle.setAttribute(
      "aria-label",
      currentTheme === "dark"
        ? "Switch to light mode"
        : "Switch to dark mode"
    );
  }

  function updateBackgroundVideo() {
    if (!backgroundVideo) return;

    const currentTheme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";

    const newSource = themeVideos[currentTheme];

    if (!backgroundVideo.src.endsWith(newSource)) {
      backgroundVideo.src = newSource;
      backgroundVideo.load();

      backgroundVideo.play().catch(() => {});
    }
  }

  updateThemeIcon();
  updateBackgroundVideo();

  themeToggle.addEventListener("click", () => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme");

    const newTheme =
      currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute(
      "data-theme",
      newTheme
    );

    localStorage.setItem("theme", newTheme);

    updateThemeIcon();
    updateBackgroundVideo();
  });
});

/*form*/
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("formStatus");
  const button = document.getElementById("submitBtn");

  if (!form || !status || !button) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    button.classList.add("loading");
    button.disabled = true;
    status.style.display = "none";

    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xnjjagjj", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
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

        // auto-hide after 4 seconds
        setTimeout(() => {
          status.style.display = "none";
        }, 4000);
      } else {
        status.textContent = "Something went wrong! Please try again.";
        status.style.color = "red";
        status.style.display = "block";
      }
    } catch {
      status.textContent = "Network error! Please try again later.";
      status.style.color = "red";
      status.style.display = "block";
    } finally {
      button.classList.remove("loading");
      button.disabled = false;
    }
  });
});


const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.2
});

reveals.forEach(el => observer.observe(el));

/* PROJECT FILTER */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

function filterProjects(filter) {
  projectCards.forEach((card) => {
    const categories = (card.dataset.category || "").split(" ");
    const featured = card.dataset.featured === "true";

    const shouldShow =
      filter === "featured"
        ? featured
        : categories.includes(filter);

    card.classList.toggle("project-hidden", !shouldShow);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {

    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    filterProjects(button.dataset.filter);
  });
});

/* Default view */
filterProjects("featured");

