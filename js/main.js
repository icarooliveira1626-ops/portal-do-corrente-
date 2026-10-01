/**
 * js/main.js
 * Comportamento de interface: navbar, revelação suave ao rolar e
 * formulário de reserva. Nenhum dado do formulário é armazenado —
 * a solicitação apenas monta uma mensagem e abre o WhatsApp.
 */
(function () {
  "use strict";

  // Só ativa o estado "oculto antes de revelar" depois que este script
  // confirma que está rodando — ver nota em css/styles.css.
  document.documentElement.classList.add("js-ready");

  /* ---------------- Navbar ---------------- */
  const navbar = document.querySelector(".navbar");
  const toggleBtn = document.querySelector(".navbar__toggle");
  const mobilePanel = document.querySelector(".navbar__mobile-panel");

  function onScroll() {
    navbar.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMobilePanel(open) {
    mobilePanel.classList.toggle("is-open", open);
    toggleBtn.setAttribute("aria-expanded", String(open));
    toggleBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggleBtn && mobilePanel) {
    toggleBtn.addEventListener("click", () => {
      setMobilePanel(!mobilePanel.classList.contains("is-open"));
    });
    mobilePanel.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setMobilePanel(false))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMobilePanel(false);
    });
    // Se a tela for ampliada com o menu aberto, fecha o painel
    window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => {
      if (e.matches) setMobilePanel(false);
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
      { threshold: 0.12 }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------- Formulário de reserva ---------------- */
  const form = document.querySelector("#reservation-form");
  if (form) {
    const statusEl = form.querySelector(".form-status");
    const checkinInput = form.querySelector("#checkin");
    const checkoutInput = form.querySelector("#checkout");

    // Data de hoje no fuso do visitante (toISOString usaria UTC e
    // bloquearia "hoje" no fim da noite no Brasil).
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const todayISO = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    checkinInput.min = todayISO;
    checkoutInput.min = todayISO;

    checkinInput.addEventListener("change", () => {
      if (checkinInput.value) checkoutInput.min = checkinInput.value;
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
      } else {
        setFieldError("name");
      }

      if (!data.checkin) {
        setFieldError("checkin", "Selecione a data de check-in.");
        valid = false;
      } else if (data.checkin < todayISO) {
        setFieldError("checkin", "O check-in não pode ser em uma data passada.");
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

      if (!isWhatsAppConfigured()) {
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

      statusEl.textContent = "Abrindo o WhatsApp com sua solicitação…";
      statusEl.setAttribute("data-state", "success");
      window.open(buildWhatsAppLink(message), "_blank", "noopener");
    });
  }

  /* ---------------- Ano atual no rodapé ---------------- */
  const yearEl = document.querySelector("#current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
