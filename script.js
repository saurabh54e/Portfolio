/* ===============================
   HERO ROLE ROTATION
================================ */
const titles = [
  "UI/UX Designer |",
  "Web Developer |",
  "AI/ML Enthusiast |",
  "Robotics Explorer |"
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


   /*MOBILE MENU TOGGLE*/

document.addEventListener("DOMContentLoaded", () => {
  const openMenu = document.getElementById("openMenu");
  const closeMenu = document.getElementById("closeMenu");
  const mobileMenu = document.getElementById("mobileMenu");

  openMenu.addEventListener("click", () => {
    mobileMenu.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  closeMenu.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  });

  document.querySelectorAll(".mobile-links a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
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

/* End of form */
