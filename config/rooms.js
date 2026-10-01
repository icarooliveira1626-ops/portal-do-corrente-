/**
 * config/rooms.js
 * ---------------------------------------------------------------
 * Dados dos quartos exibidos na seção "Acomodações".
 * Os cards são gerados automaticamente por js/render.js a partir
 * desta lista, e o campo "Tipo de quarto" do formulário de reserva
 * usa os mesmos nomes.
 *
 * COMO PREENCHER (um bloco { ... } por quarto):
 *   name       Nome/tipo do quarto, exatamente como o hotel o chama.
 *   image      Caminho da foto. Coloque o arquivo em assets/images/ e
 *              troque o caminho aqui (ex.: "assets/images/quarto-casal.jpg").
 *              Enquanto o arquivo terminar em .svg, o card mostra a etiqueta
 *              "Imagem de demonstração" — ela some sozinha ao usar a foto real.
 *   imageAlt   Descrição da foto para leitores de tela (opcional).
 *   capacity   Capacidade, em texto (ex.: "2 hóspedes").
 *   features   Lista de características do quarto (ex.: tipo de cama, tamanho).
 *   amenities  Lista de comodidades do quarto.
 *   price      SOMENTE se o preço real for confirmado (texto, ex.: "R$ 000,00").
 *              Com null, nenhum preço aparece no card.
 *   priceNote  Complemento do preço (ex.: "por diária"). Opcional.
 *   message    Mensagem do WhatsApp deste quarto (opcional). Se vazio, o site
 *              usa: "Olá! Gostaria de consultar a disponibilidade do <name>
 *              no Hotel Portal do Corrente."
 *
 * Campo null ou lista vazia = o card mostra um espaço reservado
 * ("a confirmar"). Nada aqui foi inventado.
 * Para adicionar um quarto, copie um bloco; para remover, apague-o.
 * ---------------------------------------------------------------
 */

window.ROOMS = [
  {
    id: "quarto-1",
    name: null, // CONFIRMAR NOME/TIPO
    image: "assets/images/quarto-01.svg", // SUBSTITUIR pela foto real
    imageAlt: null,
    capacity: null, // CONFIRMAR CAPACIDADE
    features: [], // CONFIRMAR CARACTERÍSTICAS
    amenities: [], // CONFIRMAR COMODIDADES
    price: null, // CONFIRMAR PREÇO (deixe null se não for divulgar)
    priceNote: null,
    message: null,
  },
  {
    id: "quarto-2",
    name: null,
    image: "assets/images/quarto-02.svg",
    imageAlt: null,
    capacity: null,
    features: [],
    amenities: [],
    price: null,
    priceNote: null,
    message: null,
  },
  {
    id: "quarto-3",
    name: null,
    image: "assets/images/quarto-03.svg",
    imageAlt: null,
    capacity: null,
    features: [],
    amenities: [],
    price: null,
    priceNote: null,
    message: null,
  },
];
