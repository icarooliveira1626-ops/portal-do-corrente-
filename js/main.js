/**
 * js/main.js
 * Comportamento de interface: navbar, revelação suave ao rolar,
 * lightbox da galeria e validação do formulário de reserva.
 * Nenhum dado do formulário é armazenado — a solicitação apenas
 * monta uma mensagem e abre o WhatsApp.
 */
(function () {
  "use strict";

  /* ---------------- Navbar ---------------- */
  const navbar = document.querySelector(".navbar");
  const toggleBtn = document.querySelector(".navbar__toggle");
  const mobilePanel = document.querySelector(".navbar__mobile-panel");

  function onScroll() {
    if (window.scrollY > 12) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMobilePanel() {
    mobilePanel.classList.remove("is-open");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (toggleBtn && mobilePanel) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = mobilePanel.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    mobilePanel.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", closeMobilePanel)
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobilePanel();
    });
  }

  /* ---------------- Revelação suave ao rolar ---------------- */
  const revealTargets = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealTargets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------- Galeria / Lightbox ---------------- */
  const galleryButtons = Array.from(document.querySelectorAll(".gallery-item button"));
  const lightbox = document.querySelector(".lightbox");

  if (galleryButtons.length && lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".lightbox__close");
    const prevBtn = lightbox.querySelector(".lightbox__prev");
    const nextBtn = lightbox.querySelector(".lightbox__next");
    let currentIndex = 0;
    let lastFocused = null;

    function openLightbox(index) {
      currentIndex = index;
      const sourceImg = galleryButtons[index].querySelector("img");
      lightboxImg.src = sourceImg.src;
      lightboxImg.alt = sourceImg.alt;
      lastFocused = document.activeElement;
      lightbox.classList.add("is-open");
      closeBtn.focus();
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    function showRelative(step) {
      currentIndex = (currentIndex + step + galleryButtons.length) % galleryButtons.length;
      const sourceImg = galleryButtons[currentIndex].querySelector("img");
      lightboxImg.src = sourceImg.src;
      lightboxImg.alt = sourceImg.alt;
    }

    galleryButtons.forEach((btn, i) =>
      btn.addEventListener("click", () => openLightbox(i))
    );
    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", () => showRelative(-1));
    nextBtn.addEventListener("click", () => showRelative(1));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showRelative(1);
      if (e.key === "ArrowLeft") showRelative(-1);
    });
  }

  /* ---------------- Formulário de reserva ---------------- */
  const form = document.querySelector("#reservation-form");
  if (form) {
    const statusEl = form.querySelector(".form-status");
    const checkinInput = form.querySelector("#checkin");
    const checkoutInput = form.querySelector("#checkout");

    const todayISO = new Date().toISOString().split("T")[0];
    checkinInput.min = todayISO;
    checkoutInput.min = todayISO;

    checkinInput.addEventListener("change", () => {
      if (checkinInput.value) {
        checkoutInput.min = checkinInput.value;
      }
    });

    function setFieldError(fieldName, message) {
      const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
      if (errorEl) errorEl.textContent = message || "";
    }

    function validate(data) {
      let valid = true;

      if (!data.name || data.name.trim().length < 2) {
        setFieldError("name", "Informe seu nome completo.");
        valid = false;
      } else if (data.name.length > 80) {
        setFieldError("name", "Nome muito longo.");
        valid = false;
      } else {
        setFieldError("name");
      }

      if (!data.checkin) {
        setFieldError("checkin", "Selecione a data de check-in.");
        valid = false;
      } else {
        setFieldError("checkin");
      }

      if (!data.checkout) {
        setFieldError("checkout", "Selecione a data de check-out.");
        valid = false;
      } else if (data.checkin && data.checkout <= data.checkin) {
        setFieldError("checkout", "O check-out deve ser depois do check-in.");
        valid = false;
      } else {
        setFieldError("checkout");
      }

      if (!data.guests || data.guests < 1 || data.guests > 20) {
        setFieldError("guests", "Informe um número de hóspedes válido (1 a 20).");
        valid = false;
      } else {
        setFieldError("guests");
      }

      if (data.phone && !/^[0-9()+\-\s]{8,20}$/.test(data.phone)) {
        setFieldError("phone", "Informe um telefone válido ou deixe em branco.");
        valid = false;
      } else {
        setFieldError("phone");
      }

      return valid;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      statusEl.textContent = "";
      statusEl.removeAttribute("data-state");

      const formData = new FormData(form);
      const data = {
        name: (formData.get("name") || "").toString().slice(0, 80),
        checkin: (formData.get("checkin") || "").toString(),
        checkout: (formData.get("checkout") || "").toString(),
        guests: parseInt(formData.get("guests"), 10),
        roomType: (formData.get("roomType") || "").toString(),
        phone: (formData.get("phone") || "").toString().slice(0, 20),
      };

      if (!validate(data)) {
        statusEl.textContent = "Verifique os campos destacados acima.";
        statusEl.setAttribute("data-state", "error");
        return;
      }

      if (!window.HOTEL_CONFIG || !window.HOTEL_CONFIG.WHATSAPP_CONFIGURED) {
        statusEl.textContent =
          "O número de WhatsApp ainda não foi configurado neste site de demonstração.";
        statusEl.setAttribute("data-state", "error");
        return;
      }

      const message = buildReservationMessage({
        name: data.name,
        checkin: data.checkin,
        checkout: data.checkout,
        guests: String(data.guests),
        roomType: data.roomType,
        phone: data.phone,
      });

      const link = buildWhatsAppLink(message);
      statusEl.textContent = "Abrindo o WhatsApp com sua solicitação…";
      statusEl.setAttribute("data-state", "success");
      window.open(link, "_blank", "noopener");
    });
  }

  /* ---------------- Botões "Solicitar reserva" que pré-selecionam o quarto ---------------- */
  document.querySelectorAll("[data-request-room]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const roomSelect = document.querySelector("#roomType");
      const roomValue = btn.getAttribute("data-request-room");
      if (roomSelect && roomValue) {
        roomSelect.value = roomValue;
      }
    });
  });

  /* ---------------- Botão flutuante de WhatsApp ---------------- */
  const floatBtn = document.querySelector(".whatsapp-float");
  if (floatBtn) {
    floatBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const message =
        "Olá! Tenho interesse em me hospedar no Hotel Portal do Corrente e gostaria de mais informações.";
      window.open(buildWhatsAppLink(message), "_blank", "noopener");
    });
  }

  /* ---------------- Ano atual no footer ---------------- */
  const yearEl = document.querySelector("#current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
