/**
 * js/whatsapp.js
 * ---------------------------------------------------------------
 * Função reutilizável para gerar links do WhatsApp (wa.me).
 *
 * Nenhuma outra parte do código deve montar uma URL de WhatsApp
 * manualmente — sempre passar por buildWhatsAppLink() para manter
 * o número centralizado em config/hotel.js.
 * ---------------------------------------------------------------
 */

/**
 * Monta a URL do wa.me com uma mensagem pré-preenchida.
 * @param {string} message - Texto da mensagem (sem encode).
 * @returns {string} URL pronta para abrir em nova aba.
 */
function buildWhatsAppLink(message) {
  const config = window.HOTEL_CONFIG;
  const number = (config && config.WHATSAPP_NUMBER) || "";
  const cleanNumber = number.replace(/\D/g, "");
  const text = encodeURIComponent(message || "");
  return `https://wa.me/${cleanNumber}?text=${text}`;
}

/**
 * Monta a mensagem padrão de solicitação de reserva a partir dos
 * dados informados no formulário. Campos vazios aparecem como
 * "a confirmar" para não gerar uma mensagem com espaços em branco
 * confusos para o hóspede.
 */
function buildReservationMessage({ name, checkin, checkout, guests, roomType, phone }) {
  const hotelName = (window.HOTEL_CONFIG && window.HOTEL_CONFIG.HOTEL_NAME) || "o hotel";
  const line = (label, value) => `${label}: ${value && value.trim() ? value.trim() : "a confirmar"}`;

  const lines = [
    `Olá! Gostaria de solicitar uma reserva no ${hotelName}.`,
    "",
    line("Nome", name),
    line("Check-in", formatDateBR(checkin)),
    line("Check-out", formatDateBR(checkout)),
    line("Hóspedes", guests),
    line("Tipo de quarto", roomType),
  ];

  if (phone && phone.trim()) {
    lines.push(line("Telefone para contato", phone));
  }

  lines.push("", "Gostaria de verificar a disponibilidade e as condições da reserva.");

  return lines.join("\n");
}

/**
 * Converte uma data no formato YYYY-MM-DD (valor nativo de <input type="date">)
 * para o formato DD/MM/AAAA, mais natural em português.
 */
function formatDateBR(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}
