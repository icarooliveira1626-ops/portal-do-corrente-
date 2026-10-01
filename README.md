# Hotel Portal do Corrente — Site (Demonstração Comercial)

Site institucional para o **Hotel Portal do Corrente**, em Santa Maria da Vitória (BA).
Este projeto é uma **demonstração comercial**, feita para ser apresentada ao hotel antes
da contratação/publicação oficial. Onde uma informação real não estava confirmada, foi
usado um placeholder claramente identificado — nada foi inventado.

> **Nota desta revisão:** a seção "Changelog da revisão" no final deste documento lista
> tudo que mudou na última rodada de ajustes e tudo que ainda depende de informação sua.

---

## 1. Estrutura de pastas

```
portal-do-corrente/
├── index.html              # Página principal (home, seção única com âncoras)
├── privacidade.html         # Política de privacidade
├── robots.txt
├── sitemap.xml
├── vercel.json               # Config de deploy + headers de segurança
├── css/
│   └── styles.css            # Todos os estilos (tokens de design, layout, componentes)
├── js/
│   ├── whatsapp.js            # Funções reutilizáveis para montar links e mensagens do WhatsApp
│   ├── render.js               # Monta os cards de quarto, contato, mapa e links a partir dos arquivos de config
│   └── main.js                  # Navbar, scroll reveal, validação do formulário
├── config/
│   ├── hotel.js                  # ÚNICO arquivo com telefone, WhatsApp, Instagram, endereço
│   └── rooms.js                   # ÚNICO arquivo com os dados de cada quarto
└── assets/
    ├── favicon.svg
    └── images/                      # Imagens — atualmente placeholders SVG de demonstração
        ├── hero-hotel.svg
        ├── fachada.svg
        ├── quarto-01.svg / 02 / 03
        ├── cafe-da-manha.svg
        ├── area-externa.svg
        └── recepcao.svg
```

Não há backend, banco de dados ou build step: é HTML, CSS e JavaScript puro, o que
mantém o site rápido, simples de hospedar e fácil de auditar.

## 2. Tecnologias utilizadas

- **HTML5 semântico** + **CSS3** (custom properties, grid, flexbox, `clamp()` para
  tipografia fluida) + **JavaScript puro (vanilla)**, sem frameworks.
- **Google Fonts**: Fraunces (títulos) e Work Sans (texto), carregadas via `<link>`.
- Sem dependências de build, sem `node_modules`, sem etapa de compilação.

Essa escolha foi deliberada: um site institucional de hotel, sem sistema de pagamento
ou área logada, não se beneficia da complexidade de um framework — e um site estático
tende a ter melhor desempenho (Core Web Vitals) e menor superfície de ataque.

## 3. Como executar localmente

Como é um site estático, basta servir a pasta com qualquer servidor HTTP simples.
Abrir `index.html` direto no navegador (`file://`) também funciona, mas alguns
recursos (como o `<iframe>` do mapa) se comportam melhor com um servidor local:

```bash
cd portal-do-corrente
python3 -m http.server 8080
# depois acesse http://localhost:8080
```

ou, com Node instalado:

```bash
npx serve .
```

## 4. Como configurar as informações do hotel

Todas as informações de contato (telefone, WhatsApp, Instagram, endereço, links do
Google Maps) estão centralizadas em **`config/hotel.js`**, e todos os dados dos
quartos estão em **`config/rooms.js`**. Nenhum desses dados fica espalhado pelo
HTML — os cards e links são montados automaticamente por `js/render.js`.

### 4.1 Onde alterar o telefone
Editar `PHONE_DISPLAY` e `PHONE_E164` em `config/hotel.js`. Enquanto esses campos
estiverem vazios (`""`), o card de contato mostra "Telefone a confirmar" em vez
de um número falso.

### 4.2 Onde alterar o WhatsApp
Editar `WHATSAPP_NUMBER` em `config/hotel.js` com o número real, apenas dígitos e
com código do país (ex.: `"5577999999999"`). **Não é preciso mexer em mais nada**:
assim que um número válido é salvo, o site detecta automaticamente
(`isWhatsAppConfigured()` em `js/whatsapp.js`) e passa a:
- habilitar o botão flutuante de WhatsApp;
- habilitar o botão "Solicitar reserva" de cada quarto (com mensagem já
  identificando qual quarto foi escolhido, ex.: *"Olá! Gostaria de consultar a
  disponibilidade do Quarto Casal no Hotel Portal do Corrente."*);
- habilitar o formulário da seção "Solicitar reserva";
- preencher o link de WhatsApp no card de Contato e no rodapé.

**Enquanto o número não for preenchido**, nenhum desses botões aponta para um
número inventado — eles mostram um aviso ("O WhatsApp do hotel ainda não foi
configurado neste site de demonstração") em vez de abrir um link inválido.

### 4.3 Onde trocar as fotos
Substituir os arquivos dentro de `assets/images/` e apontar para o novo arquivo em
`config/rooms.js` (campo `image` de cada quarto) ou em `index.html` (seção "O Hotel",
que usa `assets/images/fachada.svg`). Pode usar os nomes sugeridos no pedido original
(`fachada.jpg`, `quarto-casal.jpg`, `quarto-familia.jpg`, `banheiro.jpg`,
`area-externa.jpg`) ou manter os atuais — o importante é que o caminho em
`config/rooms.js`/`index.html` aponte para o arquivo certo.
**Enquanto a imagem referenciada for um `.svg` destes placeholders, o card mostra
sozinho a etiqueta "Imagem de demonstração"; ao trocar por uma foto real
(`.jpg`/`.webp`), a etiqueta some automaticamente** — não precisa editar nada além
do caminho da imagem.

### 4.4 Onde alterar os quartos
Tudo em **`config/rooms.js`**. Cada quarto é um bloco com `name`, `image`,
`capacity`, `features`, `amenities`, `price` (opcional) e `message` (opcional,
texto do WhatsApp específico daquele quarto). Para adicionar um quarto, copie um
bloco e cole no array `ROOMS`; para remover, apague o bloco. Os cards em
`index.html` são gerados automaticamente a partir dessa lista — **não é
necessário editar o HTML**. Campos deixados como `null` ou `[]` aparecem no
card como "a confirmar", nunca como um dado inventado.

### 4.5 Onde alterar informações do hotel (texto institucional)
O texto da seção "O Hotel" está em `index.html`, dentro de `<section id="o-hotel">`.
Está marcado como demonstração e deve ser revisado com a administração do hotel.

### 4.6 Onde alterar o endereço e o mapa
Editar `ADDRESS_*`, `GOOGLE_MAPS_URL` e `GOOGLE_MAPS_EMBED_URL` em `config/hotel.js`
(o `<iframe>` do mapa e o botão "Como chegar" em `index.html` são preenchidos
automaticamente a partir dessas variáveis).

### 4.7 Onde alterar horário de atendimento
Editar `CHECKIN_TIME`, `CHECKOUT_TIME` e `RECEPTION_HOURS` em `config/hotel.js`.
Enquanto estiverem como `null`, o card de Contato mostra "Horários a confirmar".

## 5. Como fazer deploy na Vercel

1. Criar uma conta na [Vercel](https://vercel.com) (ou usar uma existente).
2. Subir esta pasta para um repositório Git (GitHub/GitLab/Bitbucket) **ou**
   instalar a CLI da Vercel (`npm i -g vercel`) e rodar `vercel` dentro da pasta
   do projeto.
3. Como é um projeto estático (sem framework), a Vercel detecta automaticamente
   — não é necessário configurar comando de build nem diretório de output.
4. Depois do primeiro deploy, configurar o domínio definitivo do hotel em
   **Project Settings → Domains**, e atualizar `SITE_URL` em `config/hotel.js`
   e as URLs em `index.html`, `robots.txt` e `sitemap.xml` para o domínio real.

## 6. O que funciona atualmente

- Layout completo, responsivo (320px a telas grandes), com navbar, hero,
  seção institucional, acomodações, comodidades, formulário de reserva,
  localização, contato e rodapé.
- Cards de quarto gerados automaticamente a partir de `config/rooms.js`, prontos
  para receber fotos e dados reais sem precisar editar HTML.
- O formulário de reserva valida nome, datas (check-out após check-in, sem
  datas passadas), número de hóspedes e telefone (quando informado), e monta
  uma mensagem para abrir no WhatsApp — **sem armazenar nenhum dado**.
- Botão flutuante de WhatsApp e botões "Solicitar reserva" de cada quarto, cada
  um gerando uma mensagem identificando o quarto escolhido.
- Enquanto o WhatsApp não estiver configurado, todos esses botões mostram um
  aviso claro em vez de um link quebrado ou inventado.
- Conteúdo visível mesmo sem JavaScript (o efeito de revelação suave só é
  ativado depois que o site confirma que o JavaScript carregou).
- SEO básico (title, description, Open Graph, canonical, robots, sitemap,
  dados estruturados Schema.org do tipo `Hotel` com apenas informações reais).
- Acessibilidade básica: HTML semântico, navegação por teclado, foco visível,
  `aria-label`/`aria-live` onde apropriado, suporte a `prefers-reduced-motion`.
- Política de privacidade descrevendo, de forma real, que o site não armazena
  dados dos visitantes.

## 7. O que depende de informação ou autorização do hotel

Estes pontos estão marcados no próprio site com placeholders ("a confirmar") e
**precisam ser preenchidos antes da publicação**:

- Número de telefone e WhatsApp oficiais (`config/hotel.js`).
- Fotos reais dos quartos, fachada, café da manhã, área externa e recepção
  (atualmente todas são ilustrações de demonstração, geradas internamente —
  nenhuma foto de terceiros foi utilizada).
- Nomes, capacidades, características, comodidades e (se o hotel quiser
  divulgar) preços reais de cada tipo de quarto (`config/rooms.js`).
- Texto institucional definitivo sobre o hotel (história, proposta, público).
- Horários de check-in/check-out e de funcionamento da recepção.
- Autorização para uso de eventuais avaliações reais de hóspedes (a seção
  de avaliações foi deixada como uma nota transparente, sem depoimentos
  fictícios).
- Domínio definitivo do site, para atualizar `SITE_URL`, `robots.txt` e
  `sitemap.xml`.

## 8. Checklist de segurança

- [x] Nenhuma API key, token, senha ou credencial no frontend.
- [x] Nenhum backend criado sem necessidade real (o site não processa
      pagamentos nem armazena dados — por isso não existe servidor).
- [x] Número de WhatsApp centralizado em `config/hotel.js` (não é um segredo,
      mas fica em um único lugar, fácil de auditar e atualizar) — e nenhum
      link de WhatsApp é gerado enquanto esse número não for preenchido.
- [x] Formulário valida entradas no cliente (nome, datas, hóspedes, telefone)
      e não envia dados a nenhum servidor — apenas monta uma mensagem local.
- [x] Nenhuma reserva é confirmada automaticamente; nenhum pagamento é
      processado.
- [x] Nenhuma foto de outro hotel é apresentada como sendo do Hotel Portal
      do Corrente — os placeholders atuais são ilustrações geradas
      internamente para este projeto, não fotografias de terceiros.
- [x] `vercel.json` define cabeçalhos básicos de segurança
      (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
      `Permissions-Policy`).
- [ ] **Antes de publicar**: revisar se o domínio final usa HTTPS (padrão na
      Vercel) e se nenhuma nova integração futura (ex.: sistema de reservas
      com backend) introduz dados sensíveis sem a devida proteção.

## 9. Melhorias futuras (fora do escopo desta demonstração)

- Substituir as imagens de demonstração pelas fotos oficiais do hotel.
- Se o hotel quiser controle de disponibilidade em tempo real no futuro, isso
  exigiria um backend/integração com um sistema de reservas real (PMS) —
  o que está fora do escopo desta primeira versão, que é intencionalmente
  "WhatsApp-first" e sem promessas de disponibilidade que o site não pode
  garantir.
- Adicionar avaliações reais e verificadas, com autorização do hotel.
- Internacionalização (ex.: versão em inglês/espanhol), caso o hotel receba
  hóspedes estrangeiros com frequência.
- Analytics simples e compatível com a LGPD (ex.: uma ferramenta sem cookies
  de rastreamento pessoal), caso o hotel queira métricas de visitas.
- Trazer de volta uma galeria de fotos quando houver um conjunto real de
  imagens do hotel — a estrutura de `assets/images/` já está pronta para isso.

---

## 10. Changelog desta revisão

### O que foi alterado
1. **Galeria removida.** A seção "Galeria" (que só tinha imagens genéricas de
   demonstração) e o link "Galeria" do menu (desktop e mobile) foram removidos.
   O CSS e o JavaScript específicos dela (grid da galeria, lightbox) também
   foram removidos — nada ficou "morto" no código. Nenhum link quebrado: os
   itens de menu restantes (Início, O Hotel, Acomodações, Comodidades,
   Localização, Contato, Reservar) apontam todos para seções que existem.
2. **Quartos reestruturados.** Em vez de três quartos fixos escritos no HTML,
   os quartos agora vêm de **`config/rooms.js`** e são renderizados por
   **`js/render.js`**. Isso cria cards profissionais com foto, nome,
   capacidade, características, comodidades, preço (só se informado) e botão
   de reserva — e deixa pronto para receber fotos e dados reais só editando
   um arquivo, sem mexer no HTML.
3. **Imagens organizadas.** Caminhos centralizados em `config/rooms.js`
   (quartos) e `assets/images/` (demais fotos). Enquanto o arquivo referenciado
   for um `.svg` de demonstração, o card avisa sozinho que é uma imagem
   temporária — isso some automaticamente ao trocar pela foto real.
4. **Botões de reserva com função real.** Todos os botões "Solicitar reserva"
   (nos cards de quarto, no botão flutuante e no formulário da seção
   "Solicitar reserva") agora:
   - abrem o WhatsApp com uma mensagem identificando o quarto escolhido,
     **quando** há um número de WhatsApp configurado; ou
   - mostram um aviso claro ("WhatsApp ainda não configurado") em vez de um
     link quebrado ou de um número inventado, quando não há.
5. **Contato revisado.** Telefone, WhatsApp e horário de atendimento agora
   mostram "a confirmar" quando a informação real ainda não existe, em vez de
   um placeholder com aparência de número verdadeiro. Instagram e endereço
   (já confirmados por você) continuam exibidos normalmente.
6. **Localização preservada e com fallback.** O endereço e o mapa (Google Maps
   sem necessidade de API paga) continuam como já estavam, agora alimentados a
   partir de `config/hotel.js`.
7. **Seção "Sobre" mantida como está**, já que o texto já estava sinalizado
   como institucional neutro e genérico (nenhuma história, ano de fundação ou
   serviço foi inventado nela).
8. **Robustez sem JavaScript.** O efeito de revelação suave das seções agora só
   é ativado depois que o site confirma que o JavaScript carregou — antes dessa
   correção, uma falha de rede ao carregar o script deixaria seções inteiras
   permanentemente invisíveis. Um aviso em texto (`<noscript>`) também foi
   adicionado na seção de quartos, para quem navega sem JavaScript.
9. **Ajuste de sobreposição mobile.** O aviso de "WhatsApp não configurado"
   subiu de posição para não ficar embaixo do botão flutuante de WhatsApp em
   telas pequenas.
10. **Testes realizados**: todos os links do menu (desktop e mobile), os
    botões de reserva, a validação do formulário (datas, hóspedes, telefone),
    o aviso de WhatsApp não configurado, a versão mobile (390px) e a versão
    desktop (1440px) foram verificados em navegador automatizado, sem erros de
    console relacionados ao próprio código do site.

### O que ainda depende de você (sem mudanças nesta revisão)
Veja a lista completa na seção 7 — em resumo: **fotos reais, telefone,
WhatsApp, preços (se forem divulgados) e os dados específicos de cada
quarto** (nome, capacidade, características, comodidades). Tudo isso está
centralizado em `config/hotel.js` e `config/rooms.js`, prontos para receber
essas informações sem precisar tocar no restante do código.
