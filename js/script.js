/* =========================================================
   THEME
========================================================= */

const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const storageKey = "igpontes-theme";

const savedTheme = localStorage.getItem(storageKey);

if (savedTheme === "dark" || savedTheme === "light") {
  root.dataset.theme = savedTheme;
} else {
  root.dataset.theme = "dark";
}

function syncThemeColor() {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  if (!metaThemeColor) return;

  metaThemeColor.setAttribute(
    "content",
    root.dataset.theme === "dark" ? "#0b0d0f" : "#f3f3ef"
  );
}

syncThemeColor();

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem(storageKey, nextTheme);
  syncThemeColor();
});

/* =========================================================
   HEADER / MOBILE MENU
========================================================= */

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileLinks = mobileMenu?.querySelectorAll("a") ?? [];

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

function setMobileMenuState(isOpen) {
  mobileMenu?.classList.toggle("is-open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  menuToggle?.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  document.body.classList.toggle("menu-open", isOpen);
}

function closeMobileMenu() {
  setMobileMenuState(false);
}

menuToggle?.addEventListener("click", () => {
  const isOpen = !mobileMenu?.classList.contains("is-open");
  setMobileMenuState(Boolean(isOpen));
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileMenu?.classList.contains("is-open")) {
    closeMobileMenu();
    menuToggle?.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1100 && mobileMenu?.classList.contains("is-open")) {
    closeMobileMenu();
  }
});

/* =========================================================
   GSAP
========================================================= */

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion) {
    gsap.set(".hero-eyebrow, .hero-title, .hero-text, .hero-actions, .hero-panel", {
      autoAlpha: 0
    });

    const heroTl = gsap.timeline({
      defaults: {
        ease: "power3.out"
      }
    });

    heroTl
      .fromTo(
        ".hero-orbit__car",
        { xPercent: -170 },
        { xPercent: 75, duration: 1.5, ease: "power2.inOut" }
      )
      .fromTo(
        ".hero-orbit__cable",
        { scaleY: 0, transformOrigin: "top" },
        { scaleY: 1, duration: 0.65 },
        "-=0.55"
      )
      .fromTo(
        ".hero-orbit__hook",
        { y: -34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55 },
        "-=0.35"
      )
      .to(".hero-eyebrow", { autoAlpha: 1, duration: 0.5 }, "-=0.2")
      .fromTo(
        ".hero-title",
        { y: 70, clipPath: "inset(0 0 100% 0)" },
        { y: 0, clipPath: "inset(0 0 0% 0)", autoAlpha: 1, duration: 0.95 },
        "-=0.2"
      )
      .fromTo(
        ".hero-text",
        { y: 24 },
        { y: 0, autoAlpha: 1, duration: 0.6 },
        "-=0.45"
      )
      .fromTo(
        ".hero-actions",
        { y: 18 },
        { y: 0, autoAlpha: 1, duration: 0.5 },
        "-=0.35"
      )
      .fromTo(
        ".hero-panel",
        { x: 45 },
        { x: 0, autoAlpha: 1, duration: 0.8 },
        "-=0.5"
      );

    gsap.utils.toArray(".section-heading, .manifesto-copy").forEach((item) => {
      gsap.from(item, {
        y: 55,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 82%"
        }
      });
    });

    // Scroll-Linked Text Reveal
    const splitScrollRevealText = (element) => {
      if (!element || element.dataset.revealReady === "true") return;

      const lines = element.querySelectorAll(".scroll-reveal-line");

      lines.forEach((line) => {
        const text = line.textContent.trim();
        line.textContent = "";
        line.setAttribute("aria-hidden", "true");

        [...text].forEach((char) => {
          const span = document.createElement("span");

          if (char === " ") {
            span.className = "scroll-reveal-space";
            span.innerHTML = "&nbsp;";
          } else {
            span.className = "scroll-reveal-char";
            span.textContent = char;
          }

          line.appendChild(span);
        });
      });

      element.dataset.revealReady = "true";
    };

    document.querySelectorAll(".scroll-reveal-text").forEach(splitScrollRevealText);

    document.querySelectorAll(".scroll-reveal-text:not(.scroll-reveal-text--manifesto)").forEach((heading) => {
      const chars = heading.querySelectorAll(".scroll-reveal-char");

      gsap.fromTo(
        chars,
        {
          opacity: 0.045,
          filter: "brightness(0.54)"
        },
        {
          opacity: 1,
          filter: "brightness(1)",
          ease: "none",
          stagger: {
            each: 0.018,
            from: "start"
          },
          scrollTrigger: {
            trigger: heading,
            start: "top 88%",
            end: "bottom 38%",
            scrub: 0.9,
            invalidateOnRefresh: true
          }
        }
      );
    });

    const serviceStory = document.querySelector(".service-detail--story");
    const serviceStage = serviceStory?.querySelector(".service-detail__story-stage");
    const serviceHat = serviceStory?.querySelector(".scroll-reveal-text--service-hat");
    const serviceTitle = serviceStory?.querySelector(".scroll-reveal-text--service-title");
    const serviceText = serviceStory?.querySelector(".service-detail__story-text");

    if (serviceStory && serviceStage && serviceHat && serviceTitle) {
      const hatChars = serviceHat.querySelectorAll(".scroll-reveal-char");
      const titleChars = serviceTitle.querySelectorAll(".scroll-reveal-char");
      const serviceMM = gsap.matchMedia();

      serviceMM.add("(min-width: 1181px)", () => {
        gsap.set([...hatChars, ...titleChars], {
          opacity: 0.015,
          filter: "brightness(0.42)"
        });

        gsap.set(serviceHat, {
          borderColor: "rgba(255, 196, 0, 0)",
          color: "rgba(255, 196, 0, 0.02)"
        });

        gsap.set(serviceText, {
          y: 18,
          autoAlpha: 0.2
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: serviceStage,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.75,
            invalidateOnRefresh: true
          }
        });

        tl.to(
          serviceHat,
          {
            borderColor: "rgba(255, 196, 0, 0.78)",
            color: "rgba(255, 196, 0, 1)",
            duration: 0.12
          },
          0
        )
          .to(
            hatChars,
            {
              opacity: 1,
              filter: "brightness(1)",
              stagger: {
                each: 0.035,
                from: "start"
              },
              duration: 0.12
            },
            0
          )
          .to(
            titleChars,
            {
              opacity: 1,
              filter: "brightness(1)",
              stagger: {
                each: 0.016,
                from: "start"
              },
              duration: 0.72
            },
            0.10
          )
          .to(
            serviceText,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.18,
              ease: "power1.out"
            },
            0.80
          );
      });

      serviceMM.add("(max-width: 1180px)", () => {
        gsap.fromTo(
          serviceHat,
          {
            borderColor: "rgba(255, 196, 0, 0)",
            color: "rgba(255, 196, 0, 0.05)"
          },
          {
            borderColor: "rgba(255, 196, 0, 0.78)",
            color: "rgba(255, 196, 0, 1)",
            ease: "none",
            scrollTrigger: {
              trigger: serviceStage,
              start: "top 84%",
              end: "center 58%",
              scrub: 0.8,
              invalidateOnRefresh: true
            }
          }
        );

        gsap.fromTo(
          [...hatChars, ...titleChars],
          {
            opacity: 0.015,
            filter: "brightness(0.42)"
          },
          {
            opacity: 1,
            filter: "brightness(1)",
            ease: "none",
            stagger: {
              each: 0.018,
              from: "start"
            },
            scrollTrigger: {
              trigger: serviceStage,
              start: "top 84%",
              end: "bottom 42%",
              scrub: 0.8,
              invalidateOnRefresh: true
            }
          }
        );

        gsap.fromTo(
          serviceText,
          {
            y: 16,
            autoAlpha: 0
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: serviceText,
              start: "top 88%"
            }
          }
        );
      });
    }

    gsap.utils.toArray(".service-item").forEach((item, index) => {
      gsap.from(item, {
        y: 30,
        autoAlpha: 0,
        duration: 0.65,
        delay: Math.min(index * 0.04, 0.2),
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 90%"
        }
      });
    });

    gsap.utils.toArray(".process-step").forEach((item, index) => {
      gsap.from(item, {
        y: 36,
        autoAlpha: 0,
        duration: 0.7,
        delay: index * 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".process-grid",
          start: "top 80%"
        }
      });
    });

    gsap.from(".cta h2", {
      yPercent: 25,
      autoAlpha: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".cta",
        start: "top 72%"
      }
    });

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      gsap.to(".hero-orbit__car", {
        xPercent: -100,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.8
        }
      });

      gsap.to(".hero-orbit", {
        y: 90,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });
    });
  }
}


/* =========================================================
   CONTACT FORM
   Configure os dados reais abaixo antes de publicar.
========================================================= */

const IGP_CONTACT_EMAIL = "";
const IGP_WHATSAPP_NUMBER = "";

const contactForm = document.querySelector("[data-contact-form]");
const contactFeedback = document.querySelector("[data-contact-feedback]");
const whatsappLink = document.querySelector("[data-whatsapp-link]");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const nome = String(formData.get("nome") || "").trim();
  const empresa = String(formData.get("empresa") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const telefone = String(formData.get("telefone") || "").trim();
  const mensagem = String(formData.get("mensagem") || "").trim();

  if (!IGP_CONTACT_EMAIL) {
    if (contactFeedback) {
      contactFeedback.textContent = "Defina o e-mail comercial da IGPontes no script.js para ativar o envio.";
    }
    return;
  }

  const subject = encodeURIComponent(`Solicitação pelo site — ${nome}${empresa ? ` / ${empresa}` : ""}`);
  const body = encodeURIComponent(
    `Nome: ${nome}\nEmpresa: ${empresa || "-"}\nE-mail: ${email}\nTelefone: ${telefone || "-"}\n\nMensagem:\n${mensagem}`
  );

  window.location.href = `mailto:${IGP_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});

whatsappLink?.addEventListener("click", (event) => {
  if (!IGP_WHATSAPP_NUMBER) {
    event.preventDefault();

    if (contactFeedback) {
      contactFeedback.textContent = "Defina o número comercial da IGPontes no script.js para ativar o WhatsApp.";
    }
    return;
  }

  const message = encodeURIComponent("Olá! Vim pelo site da IGPontes e gostaria de solicitar um atendimento.");
  whatsappLink.href = `https://wa.me/${IGP_WHATSAPP_NUMBER}?text=${message}`;
});
