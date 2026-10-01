/**
 * js/render.js
 * Monta partes da página a partir de config/hotel.js e config/rooms.js:
 * cards dos quartos, opções do formulário, contato, mapa e links.
 * Todo texto é inserido com textContent (nunca innerHTML).
 */
(function () {
  "use strict";

  var cfg = window.HOTEL_CONFIG || {};
  var rooms = Array.isArray(window.ROOMS) ? window.ROOMS : [];
  var waReady = isWhatsAppConfigured();
  var WA_PENDING_MESSAGE =
    "O WhatsApp do hotel ainda não foi configurado neste site de demonstração.";

  /* ---------- helpers ---------- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function placeholder(text) {
    var node = el("span", "is-placeholder", text);
    node.setAttribute("data-placeholder", "");
    return node;
  }

  function clearAndAppend(node, child) {
    node.textContent = "";
    node.appendChild(child);
  }

  /* ---------- aviso (toast) ---------- */
  var toastTimer;
  window.showNotice = function (message) {
    var toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 4500);
  };

  /* ---------- textos vindos da configuração ---------- */
  document.querySelectorAll("[data-config]").forEach(function (node) {
    var value = cfg[node.getAttribute("data-config")];
    if (value) node.textContent = value;
  });

  /* ---------- quartos ---------- */
  function buildList(title, items, emptyText) {
    var group = el("div", "room-card__group");
    group.appendChild(el("h4", "room-card__group-title", title));
    var list = el("ul", "room-card__list");
    if (Array.isArray(items) && items.length) {
      items.forEach(function (item) {
        list.appendChild(el("li", null, item));
      });
    } else {
      var li = el("li");
      li.appendChild(placeholder(emptyText));
      list.appendChild(li);
    }
    group.appendChild(list);
    return group;
  }

  function buildRoomCard(room, index) {
    var card = el("article", "room-card");
    card.setAttribute("data-reveal", "");
    card.style.transitionDelay = Math.min(index, 3) * 70 + "ms";

    /* Foto */
    var media = el("div", "room-card__media");
    var isDemoImage = /\.svg$/i.test(room.image || "");
    var img = document.createElement("img");
    img.src = room.image || "";
    img.width = 900;
    img.height = 675;
    img.loading = "lazy";
    img.decoding = "async";
    if (isDemoImage) {
      img.alt = "Imagem de demonstração do quarto — a foto real será inserida";
    } else {
      img.alt = room.imageAlt || (room.name ? "Foto do " + room.name : "Foto do quarto");
    }
    media.appendChild(img);
    if (isDemoImage) media.appendChild(el("span", "demo-tag", "Imagem de demonstração"));
    card.appendChild(media);

    /* Corpo */
    var body = el("div", "room-card__body");

    var name = el("h3", "room-card__name");
    if (room.name) name.textContent = room.name;
    else name.appendChild(placeholder("[Nome do quarto]"));
    body.appendChild(name);

    var capacity = el("p", "room-card__capacity");
    capacity.appendChild(el("span", "room-card__label", "Capacidade: "));
    if (room.capacity) capacity.appendChild(document.createTextNode(room.capacity));
    else capacity.appendChild(placeholder("[a confirmar]"));
    body.appendChild(capacity);

    body.appendChild(buildList("Características", room.features, "[Confirmar características]"));
    body.appendChild(buildList("Comodidades", room.amenities, "[Confirmar comodidades]"));

    if (room.price) {
      var price = el("p", "room-card__price", room.price);
      if (room.priceNote) price.appendChild(el("span", "room-card__price-note", " " + room.priceNote));
      body.appendChild(price);
    }

    /* Botão de reserva */
    var actions = el("div", "room-card__actions");
    var label = "Solicitar reserva";
    var cta;
    if (waReady) {
      cta = el("a", "btn btn--primary btn--block", label);
      cta.href = buildWhatsAppLink(buildRoomMessage(room));
      cta.target = "_blank";
      cta.rel = "noopener";
    } else {
      cta = el("button", "btn btn--primary btn--block", label);
      cta.type = "button";
      cta.addEventListener("click", function () {
        window.showNotice(WA_PENDING_MESSAGE);
      });
    }
    if (room.name) cta.setAttribute("aria-label", label + " — " + room.name);
    actions.appendChild(cta);
    body.appendChild(actions);

    card.appendChild(body);
    return card;
  }

  var grid = document.getElementById("rooms-grid");
  if (grid) {
    grid.textContent = "";
    rooms.forEach(function (room, i) {
      grid.appendChild(buildRoomCard(room, i));
    });
  }

  /* Opções do formulário: somente quartos com nome confirmado */
  var roomSelect = document.getElementById("roomType");
  if (roomSelect) {
    rooms.forEach(function (room) {
      if (!room.name) return;
      var option = document.createElement("option");
      option.value = room.name;
      option.textContent = room.name;
      roomSelect.appendChild(option);
    });
  }

  /* ---------- contato ---------- */
  var waSlot = document.querySelector('[data-contact="whatsapp"]');
  if (waSlot && waReady) {
    var waLink = el("a", null, "Enviar mensagem");
    waLink.href = buildWhatsAppLink("Olá! Gostaria de mais informações sobre o " + cfg.HOTEL_NAME + ".");
    waLink.target = "_blank";
    waLink.rel = "noopener";
    clearAndAppend(waSlot, waLink);
  }

  var phoneSlot = document.querySelector('[data-contact="phone"]');
  if (phoneSlot && cfg.PHONE_DISPLAY && cfg.PHONE_E164) {
    var phoneLink = el("a", null, cfg.PHONE_DISPLAY);
    phoneLink.href = "tel:" + cfg.PHONE_E164.replace(/[^\d+]/g, "");
    clearAndAppend(phoneSlot, phoneLink);
  }

  var igSlot = document.querySelector('[data-contact="instagram"]');
  if (igSlot && cfg.INSTAGRAM_URL) {
    var igLink = el("a", null, cfg.INSTAGRAM_HANDLE || "Instagram");
    igLink.href = cfg.INSTAGRAM_URL;
    igLink.target = "_blank";
    igLink.rel = "noopener";
    clearAndAppend(igSlot, igLink);
  }

  var hoursSlot = document.querySelector('[data-contact="hours"]');
  if (hoursSlot) {
    var rows = [];
    if (cfg.RECEPTION_HOURS) rows.push("Recepção: " + cfg.RECEPTION_HOURS);
    if (cfg.CHECKIN_TIME) rows.push("Check-in: " + cfg.CHECKIN_TIME);
    if (cfg.CHECKOUT_TIME) rows.push("Check-out: " + cfg.CHECKOUT_TIME);
    if (rows.length) {
      var wrap = el("div", "contact-card__lines");
      rows.forEach(function (row) {
        wrap.appendChild(el("span", null, row));
      });
      clearAndAppend(hoursSlot, wrap);
    }
  }

  /* ---------- localização ---------- */
  var mapLink = document.getElementById("maps-link");
  if (mapLink && cfg.GOOGLE_MAPS_URL) mapLink.href = cfg.GOOGLE_MAPS_URL;
  var mapFrame = document.getElementById("map-embed");
  if (mapFrame && cfg.GOOGLE_MAPS_EMBED_URL) mapFrame.src = cfg.GOOGLE_MAPS_EMBED_URL;

  /* ---------- rodapé ---------- */
  var footerIg = document.getElementById("footer-instagram-link");
  if (footerIg && cfg.INSTAGRAM_URL) footerIg.href = cfg.INSTAGRAM_URL;
  var footerWa = document.getElementById("footer-whatsapp-link");
  if (footerWa && waReady) {
    footerWa.href = buildWhatsAppLink("Olá! Gostaria de mais informações sobre o " + cfg.HOTEL_NAME + ".");
    footerWa.hidden = false;
  }

  /* ---------- botão flutuante ---------- */
  var floatBtn = document.getElementById("whatsapp-float");
  if (floatBtn) {
    if (waReady) {
      floatBtn.href = buildWhatsAppLink("Olá! Tenho interesse em me hospedar no " + cfg.HOTEL_NAME + " e gostaria de mais informações.");
      floatBtn.target = "_blank";
      floatBtn.rel = "noopener";
    } else {
      floatBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.showNotice(WA_PENDING_MESSAGE);
      });
    }
  }
})();
