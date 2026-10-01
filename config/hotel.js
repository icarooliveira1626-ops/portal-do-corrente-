/**
 * config/hotel.js
 * ---------------------------------------------------------------
 * Configuração central do site do Hotel Portal do Corrente.
 *
 * Este é o ÚNICO lugar onde dados de contato e institucionais
 * devem ser editados. Nenhum outro arquivo deve conter telefone,
 * WhatsApp, Instagram ou endereço "hardcoded".
 *
 * IMPORTANTE:
 * - Nada aqui é secreto. Número de telefone e WhatsApp de um
 *   estabelecimento comercial são informações públicas e podem
 *   aparecer no frontend sem problema.
 * - NUNCA coloque aqui (ou em qualquer arquivo do frontend):
 *   API keys, tokens, senhas ou credenciais de qualquer serviço.
 *   Se um backend for adicionado no futuro, segredos devem viver
 *   em variáveis de ambiente do servidor, nunca neste arquivo.
 *
 * Campos marcados com "CONFIRMAR" são placeholders e precisam
 * ser substituídos pela equipe do hotel antes da publicação.
 * ---------------------------------------------------------------
 */

window.HOTEL_CONFIG = {
  // Identidade
  HOTEL_NAME: "Hotel Portal do Corrente",
  HOTEL_SHORT_NAME: "Portal do Corrente",
  CITY: "Santa Maria da Vitória",
  STATE: "BA",
  STATE_FULL: "Bahia",

  // Contato — CONFIRMAR com o hotel antes de publicar.
  // Deixe vazio ("") enquanto não houver o número real: o site mostra
  // "a confirmar" e não cria links de telefone/WhatsApp inválidos.
  PHONE_DISPLAY: "", // CONFIRMAR TELEFONE. Ex.: "(77) 3000-0000"
  PHONE_E164: "", // CONFIRMAR TELEFONE no formato internacional. Ex.: "+557730000000"

  // Número usado para gerar links de WhatsApp (wa.me).
  // Formato: código do país + DDD + número, apenas dígitos.
  // Ex.: "5577999999999". Ao preencher, todos os botões de reserva,
  // o botão flutuante e os links de contato passam a funcionar sozinhos.
  WHATSAPP_NUMBER: "", // CONFIRMAR NÚMERO OFICIAL DO WHATSAPP

  // Redes sociais
  INSTAGRAM_HANDLE: "@hotelportaldocorrente",
  INSTAGRAM_URL: "https://www.instagram.com/hotelportaldocorrente/",

  // Endereço
  ADDRESS_STREET: "Rua Jeremias Rodrigues da Silva, nº 750",
  ADDRESS_DISTRICT: "Bairro AABB",
  ADDRESS_CITY_LINE: "Santa Maria da Vitória - BA",
  ADDRESS_CEP: "47640-000",
  ADDRESS_FULL:
    "Rua Jeremias Rodrigues da Silva, 750 - Bairro AABB, Santa Maria da Vitória - BA, 47640-000",

  // Link "Como chegar" (Google Maps, sem necessidade de API key)
  GOOGLE_MAPS_URL:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "Rua Jeremias Rodrigues da Silva, 750, Bairro AABB, Santa Maria da Vitória - BA, 47640-000"
    ),

  // URL do embed do mapa (também sem API key)
  GOOGLE_MAPS_EMBED_URL:
    "https://www.google.com/maps?q=" +
    encodeURIComponent(
      "Rua Jeremias Rodrigues da Silva, 750, Bairro AABB, Santa Maria da Vitória - BA, 47640-000"
    ) +
    "&output=embed",

  // Horários — deixar em branco/oculto até confirmação
  CHECKIN_TIME: null, // CONFIRMAR HORÁRIO DE CHECK-IN, ex: "14:00"
  CHECKOUT_TIME: null, // CONFIRMAR HORÁRIO DE CHECK-OUT, ex: "12:00"
  RECEPTION_HOURS: null, // CONFIRMAR HORÁRIO DE FUNCIONAMENTO DA RECEPÇÃO

  // URL canônica do site — CONFIRMAR domínio definitivo antes do deploy final
  SITE_URL: "https://www.hotelportaldocorrente.com.br",
};
