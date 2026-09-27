# Hotel Portal do Corrente — Site (Demonstração Comercial)

Site institucional para o **Hotel Portal do Corrente**, em Santa Maria da Vitória (BA).
Este projeto é uma **demonstração comercial**, feita para ser apresentada ao hotel antes
da contratação/publicação oficial. Onde uma informação real não estava confirmada, foi
usado um placeholder claramente identificado — nada foi inventado.

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
│   ├── whatsapp.js            # Função reutilizável para montar links do WhatsApp
│   └── main.js                 # Navbar, scroll reveal, lightbox, validação do formulário
├── config/
│   └── hotel.js                 # ÚNICO arquivo com telefone, WhatsApp, Instagram, endereço
└── assets/
    ├── favicon.svg
    └── images/                    # Imagens — atualmente placeholders SVG de demonstração
        ├── hero-hotel.svg
        ├── fachada.svg
        ├── quarto-01.svg / 02 / 03
        ├── cafe-da-manha.svg
        ├── area-externa.svg
        ├── recepcao.svg
        └── galeria-01.svg … galeria-06.svg
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

Todas as informações editáveis (telefone, WhatsApp, Instagram, endereço, links do
Google Maps) estão centralizadas em **`config/hotel.js`**. Não há esses dados
espalhados em outros arquivos.

### 4.1 Onde alterar o telefone
Editar `PHONE_DISPLAY` e `PHONE_E164` em `config/hotel.js`.

### 4.2 Onde alterar o WhatsApp
Editar `WHATSAPP_NUMBER` em `config/hotel.js` com o número real, apenas dígitos e
com código do país (ex.: `"5577999999999"`). Depois, mudar `WHATSAPP_CONFIGURED`
para `true` — **enquanto estiver `false`, o formulário de reserva avisa o visitante
que o número ainda não foi configurado, em vez de abrir um link inválido.**

### 4.3 Onde trocar as fotos
Substituir os arquivos dentro de `assets/images/` mantendo exatamente os mesmos
nomes (ex.: substituir `assets/images/quarto-01.svg` por um `quarto-01.jpg` real —
nesse caso, também atualizar a extensão referenciada em `index.html`, já que os
placeholders atuais são `.svg` e fotos reais normalmente serão `.jpg/.webp`).
Os nomes de arquivo foram escolhidos para deixar essa substituição óbvia:
`hero-hotel`, `fachada`, `quarto-01/02/03`, `cafe-da-manha`, `area-externa`,
`recepcao`, `galeria-01` a `galeria-06`.

### 4.4 Onde alterar os quartos
As seções de cada quarto estão em `index.html`, dentro de `<section id="acomodacoes">`.
Cada quarto é um bloco `<article class="room">` independente — copie, cole e edite
para adicionar mais tipos de quarto, ou remova os que não existirem.

### 4.5 Onde alterar informações do hotel (texto institucional)
O texto da seção "O Hotel" está em `index.html`, dentro de `<section id="o-hotel">`.
Está marcado como demonstração e deve ser revisado com a administração do hotel.

### 4.6 Onde alterar o endereço e o mapa
Editar `ADDRESS_*`, `GOOGLE_MAPS_URL` e `GOOGLE_MAPS_EMBED_URL` em `config/hotel.js`,
e o bloco `<address>` + `src` do `<iframe>` em `index.html` (seção "Localização").

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
  seção institucional, acomodações, comodidades, galeria com lightbox,
  formulário de reserva, localização, contato e footer.
- O formulário de reserva valida nome, datas (check-out após check-in, sem
  datas passadas), número de hóspedes e telefone (quando informado), e monta
  uma mensagem para abrir no WhatsApp — **sem armazenar nenhum dado**.
- Botão flutuante de WhatsApp e botões "Solicitar reserva" nos quartos, que
  pré-selecionam o tipo de quarto no formulário.
- SEO básico (title, description, Open Graph, canonical, robots, sitemap,
  dados estruturados Schema.org do tipo `Hotel` com apenas informações reais).
- Acessibilidade básica: HTML semântico, navegação por teclado, foco visível,
  `aria-label`/`aria-live` onde apropriado, suporte a `prefers-reduced-motion`.
- Política de privacidade descrevendo, de forma real, que o site não armazena
  dados dos visitantes.

## 7. O que depende de informação ou autorização do hotel

Estes pontos estão marcados no próprio site com placeholders (`[CONFIRMAR...]`)
e **precisam ser preenchidos antes da publicação**:

- Número de telefone e WhatsApp oficiais (`config/hotel.js`).
- Fotos reais da fachada, quartos, café da manhã, área externa, recepção e
  galeria (atualmente todas são ilustrações de demonstração, geradas
  internamente — nenhuma foto de terceiros foi utilizada).
- Nomes, descrições, capacidade e comodidades reais de cada tipo de quarto.
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
      mas fica em um único lugar, fácil de auditar e atualizar).
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
- Formulário de contato adicional (fora do fluxo de reserva), se fizer
  sentido para o hotel.

---

### Nota sobre este projeto

Este é um site de **demonstração**, criado para mostrar como o site oficial do
Hotel Portal do Corrente poderia funcionar. Nenhuma informação sobre preços,
disponibilidade, nomes de quartos ou avaliações foi inventada — tudo que não
estava confirmado foi deixado como placeholder, pronto para ser preenchido
pela equipe do hotel.
