# GGPRICE — Explicação didática do código

Este guia mostra, seção por seção, **onde está cada parte do site** e como `index.html`, `style.css`, `data.js` e `script.js` trabalham juntos.

Os trechos abaixo foram extraídos automaticamente dos arquivos reais, então sempre correspondem ao código do projeto. Cada seção do código tem um comentário com um nome entre colchetes, como `[busca]`: use a busca do editor (Ctrl+F) por esse nome para achar a seção.

> Todos os preços, descontos e históricos são **dados fictícios**.

## Como os arquivos se encaixam

1. `data.js` cria as listas `LOJAS`, `CATEGORIAS` e `PRODUTOS` (dados fictícios).
2. `index.html` é a estrutura: a moldura das páginas, formulários e rodapé.
3. `script.js` lê os dados, monta os cards/tabelas/gráficos e reage a cliques.
4. `style.css` define a aparência e muda de cor pelo tema.

---

## 1. CABEÇALHO E MENU DE NAVEGAÇÃO

**1. Para que serve:** Mostra o logo, os links das páginas, os botões de acessibilidade (A− / A+) e o botão de tema. No celular, o menu vira um botão ☰ que abre e fecha.

**2. HTML (estrutura)**

```html
<!-- ============================================================ -->
<!-- 1. CABEÇALHO E MENU DE NAVEGAÇÃO [cabecalho]                  -->
<!-- Contém: logo, menu, acessibilidade (fonte e tema) e conta.    -->
<!-- ============================================================ -->
<a class="link-pular" href="#conteudo">Pular para o conteúdo</a>

<div class="aviso-demo" role="note">
  Versão demonstrativa: preços, descontos e históricos são <strong>fictícios</strong>.
</div>

<header class="cabecalho">
  <div class="container cabecalho__interno">

    <a href="#/home" class="logo" aria-label="GGPRICE, página inicial">
      <span class="logo__icone" aria-hidden="true">GG</span>
      <span class="logo__texto">PRICE</span>
    </a>

    <button type="button" id="botaoMenu" class="botao-menu" aria-expanded="false" aria-controls="menuPrincipal">
      <span aria-hidden="true">☰</span>
      <span class="sr-only">Abrir menu</span>
    </button>

    <nav id="menuPrincipal" class="menu" aria-label="Navegação principal">
      <ul class="menu__lista">
        <li><a href="#/home" data-pagina="home">Início</a></li>
        <li><a href="#/ofertas" data-pagina="ofertas">Ofertas</a></li>
        <li><a href="#/categorias" data-pagina="categorias">Categorias</a></li>
        <li><a href="#/favoritos" data-pagina="favoritos">Favoritos <span class="contador" id="contadorFavoritos" aria-label="0 favoritos">0</span></a></li>
        <li><a href="#/alertas" data-pagina="alertas">Alertas</a></li>
        <li><a href="#/contato" data-pagina="contato">Contato</a></li>
        <li><a href="#/login" id="linkConta" class="menu__conta" data-pagina="login">Entrar</a></li>
      </ul>
    </nav>

    <!-- Ferramentas de acessibilidade -->
    <div class="ferramentas" role="group" aria-label="Acessibilidade e tema">
      <button type="button" id="botaoFonteMenos" class="botao-ferramenta" aria-label="Diminuir tamanho da fonte">A−</button>
      <button type="button" id="botaoFonteMais" class="botao-ferramenta" aria-label="Aumentar tamanho da fonte">A+</button>
      <button type="button" id="botaoTema" class="botao-ferramenta" aria-pressed="false" aria-label="Ativar modo claro">
        <span id="iconeTema" aria-hidden="true">☀</span>
      </button>
    </div>

  </div>
</header>

<main id="conteudo" class="principal" tabindex="-1">

  <!-- ============================================================ -->
  <!-- 2. PÁGINA INICIAL (HOME)                                      -->
  <!-- ============================================================ -->
  <section id="pagina-home" class="pagina" hidden>
```

**3. CSS (aparência)**

```css
/* ============================================================ */
/* 3. CABEÇALHO [cabecalho]                                      */
/* ============================================================ */
.cabecalho {
  position: sticky; top: 0; z-index: 100;
  background: color-mix(in srgb, var(--fundo-2) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--borda);
}
.cabecalho__interno { display: flex; align-items: center; gap: 1rem; min-height: 68px; }

.logo { display: inline-flex; align-items: center; gap: 0.4rem; text-decoration: none; color: var(--texto); font-family: "Bahnschrift", "Segoe UI", sans-serif; font-weight: 800; font-size: 1.4rem; letter-spacing: 0.08em; }
.logo:hover { color: var(--texto); }
.logo__icone {
  display: grid; place-items: center; width: 38px; height: 38px; border-radius: 10px;
  background: linear-gradient(135deg, var(--acao), var(--azul)); color: #fff; font-size: 1rem;
  box-shadow: var(--brilho);
}
.logo__texto { color: var(--texto); }

.ferramentas { display: flex; gap: 0.35rem; margin-left: auto; }
.botao-ferramenta {
  min-width: 40px; min-height: 40px; border-radius: 10px; border: 1px solid var(--borda);
  background: var(--card); color: var(--texto); font: inherit; font-weight: 700; cursor: pointer;
}
.botao-ferramenta:hover:not(:disabled) { border-color: var(--roxo); }
.botao-ferramenta:disabled { opacity: 0.4; cursor: not-allowed; }

.contador {
  display: inline-grid; place-items: center; min-width: 1.4em; padding: 0 0.35em;
  border-radius: 999px; background: var(--acao); color: #fff; font-size: 0.75rem; font-weight: 700;
}
```

**4. JavaScript (funcionamento):** esta seção não tem trecho próprio neste arquivo.

**5. Como os arquivos trabalham juntos:** O HTML define os links (`href="#/ofertas"`). O CSS (seções 3 e 4) posiciona tudo e, em telas pequenas, esconde o menu até a classe `menu--aberto` existir. O JS (`alternarMenuMobile`, seção 2) adiciona/remove essa classe e atualiza `aria-expanded`. Para criar um novo item de menu, adicione um `<li>` no HTML e uma página no `PAGINAS` do JS.

---

## 2. BARRA DE PESQUISA

**1. Para que serve:** Permite digitar o nome de um produto e ir para a página de resultados. Também guarda a pesquisa no histórico.

**2. HTML (estrutura)**

```html
    <!-- ========================================================== -->
    <!-- 2.1 BARRA DE PESQUISA [busca]                               -->
    <!-- ========================================================== -->
    <div class="hero">
      <div class="container hero__interno">
        <p class="hero__selo">Comparador de preços gamer</p>
        <h1 class="hero__titulo">Encontre o <span class="destaque">menor preço</span> do universo gamer</h1>
        <p class="hero__texto">
          Pesquise consoles, placas de vídeo, periféricos e jogos e compare os valores
          entre KaBuM!, Amazon, Mercado Livre, Pichau e outras lojas.
        </p>

        <form class="busca" id="formPesquisaHome" data-pesquisa role="search" novalidate>
          <label for="searchInput" class="sr-only">Pesquisar produto</label>
          <input type="search" id="searchInput" placeholder="Pesquise seu produto... ex.: RTX 4060" list="sugestoesProdutos" autocomplete="off">
          <button type="submit" id="searchButton" class="botao botao--primario">Pesquisar</button>
        </form>
        <datalist id="sugestoesProdutos"></datalist>

        <div class="recentes" id="pesquisasRecentesHome" hidden>
          <span class="recentes__rotulo">Pesquisas recentes:</span>
          <ul class="recentes__lista" id="listaPesquisasRecentes"></ul>
        </div>
      </div>
    </div>

    <div class="container">
```

**3. CSS (aparência)**

```css
/* ============================================================ */
/* 5. BARRA DE PESQUISA [busca]                                  */
/* ============================================================ */
.hero {
  padding: 4rem 0 3rem;
  background:
    radial-gradient(circle at 15% 20%, rgba(168, 85, 247, 0.28), transparent 45%),
    radial-gradient(circle at 85% 10%, rgba(56, 189, 248, 0.2), transparent 40%),
    var(--fundo);
  border-bottom: 1px solid var(--borda);
}
.hero__interno { text-align: center; max-width: 820px; }
.hero__selo {
  display: inline-block; padding: 0.25rem 0.9rem; border: 1px solid var(--roxo); border-radius: 999px;
  color: var(--roxo); font-size: 0.85rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
}
.hero__titulo { font-size: clamp(2rem, 5vw, 3.4rem); margin: 1rem 0; }
.hero__texto { color: var(--texto-suave); font-size: 1.1rem; max-width: 640px; margin: 0 auto 1.5rem; }

.busca {
  display: flex; gap: 0.5rem; padding: 0.4rem; background: var(--card);
  border: 1px solid var(--borda); border-radius: 14px; box-shadow: var(--sombra);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.busca:focus-within { border-color: var(--roxo); box-shadow: var(--brilho); }
.busca input {
  flex: 1; min-width: 0; border: 0; background: transparent; color: var(--texto);
  font: inherit; font-size: 1.05rem; padding: 0.6rem 0.8rem;
}
.busca input:focus { outline: none; }  /* o foco aparece no contêiner (:focus-within) */
.busca--compacta { margin-bottom: 1rem; }

.recentes { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 1rem; }
.recentes__rotulo { color: var(--texto-suave); font-size: 0.9rem; }
.recentes__lista { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; }
.chip {
  display: inline-block; padding: 0.25rem 0.8rem; border-radius: 999px; background: var(--card);
  border: 1px solid var(--borda); color: var(--texto); text-decoration: none; font-size: 0.9rem;
}
.chip:hover { border-color: var(--azul); color: var(--azul); }

.filtros { display: flex; flex-wrap: wrap; gap: 1rem; margin: 1rem 0; }
.filtros__item { display: flex; flex-direction: column; gap: 0.25rem; min-width: 200px; }
.filtros label { font-size: 0.85rem; color: var(--texto-suave); font-weight: 600; }
```

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 3. PESQUISA DE PRODUTOS [busca]                               */
/* ============================================================ */

// Procura produtos cujo nome, marca, modelo ou categoria contenham TODAS as palavras digitadas
function buscarProdutos(termo, categoria = "") {
  const palavras = normalizarTexto(termo).split(/\s+/).filter(Boolean);
  return PRODUTOS.filter((produto) => {
    const nomeCategoria = buscarCategoria(produto.categoria).nome;
    const texto = normalizarTexto(`${produto.nome} ${produto.marca} ${produto.modelo} ${nomeCategoria}`);
    const combinaTexto = palavras.every((palavra) => texto.includes(palavra));
    const combinaCategoria = !categoria || produto.categoria === categoria;
    return combinaTexto && combinaCategoria;
  });
}

// Executado quando qualquer formulário de pesquisa é enviado
function tratarEnvioPesquisa(evento) {
  evento.preventDefault();
  const campo = $("input[type='search']", evento.currentTarget);
  const termo = campo.value.trim();

  if (!termo) {
    mostrarAviso("Digite o nome de um produto para pesquisar.", "erro");
    campo.focus();
    return;
  }
  salvarPesquisaNoHistorico(termo);
  navegar(montarUrl("/resultados", { q: termo }));
}

// Preenche a lista de sugestões do campo de pesquisa (<datalist>)
function preencherSugestoes() {
  $("#sugestoesProdutos").innerHTML = PRODUTOS.map((p) => `<option value="${escaparHtml(p.nome)}"></option>`).join("");
}
```

**5. Como os arquivos trabalham juntos:** O HTML cria o `<form>` com o campo `#searchInput` e o botão `#searchButton`. O CSS faz o campo parecer uma caixa única com brilho roxo ao receber foco (`:focus-within`). O JS (`tratarEnvioPesquisa`) impede o envio padrão do formulário, valida se há texto, salva no histórico e navega para `#/resultados?q=...`. A função `buscarProdutos` faz o filtro de verdade, ignorando acentos.

---

## 3. CARROSSEL DE PRODUTOS EM DESTAQUE

**1. Para que serve:** Mostra um produto em destaque por vez, com setas, bolinhas, pausa e rotação automática a cada 6 segundos.

**2. HTML (estrutura)**

```html
      <!-- ======================================================== -->
      <!-- 2.2 CARROSSEL DE PRODUTOS EM DESTAQUE [carrossel]         -->
      <!-- ======================================================== -->
      <section class="secao" aria-labelledby="tituloCarrossel">
        <h2 class="secao__titulo" id="tituloCarrossel">Produtos em destaque</h2>
        <div class="carrossel" id="carrossel" role="region" aria-roledescription="carrossel" aria-label="Produtos em destaque">
          <div class="carrossel__janela">
            <div class="carrossel__trilho" id="carrosselTrilho"></div>
          </div>
          <div class="carrossel__controles">
            <button type="button" class="botao botao--icone" id="carrosselAnterior" aria-label="Destaque anterior">‹</button>
            <div class="carrossel__pontos" id="carrosselPontos"></div>
            <button type="button" class="botao botao--icone" id="carrosselPausa" aria-label="Pausar rotação automática">❚❚</button>
            <button type="button" class="botao botao--icone" id="carrosselProximo" aria-label="Próximo destaque">›</button>
          </div>
        </div>
      </section>
```

**3. CSS (aparência)**

```css
/* ============================================================ */
/* 6. CARROSSEL [carrossel]                                      */
/* ============================================================ */
.carrossel { border: 1px solid var(--borda); border-radius: var(--raio); background: var(--card); overflow: hidden; }
.carrossel__janela { overflow: hidden; }
.carrossel__trilho { display: flex; transition: transform 0.55s ease; }
.carrossel__slide {
  flex: 0 0 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: center; padding: 1.5rem;
  background: radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.25), transparent 55%);
}
.carrossel__imagem { border-radius: 14px; overflow: hidden; border: 1px solid var(--borda); }
.carrossel__titulo { font-size: clamp(1.3rem, 2.6vw, 2rem); margin-top: 0.6rem; }
.carrossel__preco { font-size: 2rem; font-weight: 800; color: var(--verde); margin: 0.5rem 0 0; }
.carrossel__loja { color: var(--texto-suave); }
.carrossel__acoes { display: flex; gap: 0.6rem; flex-wrap: wrap; }
.carrossel__controles { display: flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 0.75rem; border-top: 1px solid var(--borda); }
.carrossel__pontos { display: flex; gap: 0.5rem; }
.carrossel__ponto {
  width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--roxo);
  background: transparent; cursor: pointer; padding: 0;
}
.carrossel__ponto[aria-current="true"] { background: var(--roxo); box-shadow: var(--brilho); }
```

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 14. CARROSSEL DE PRODUTOS [carrossel]                         */
/* Um slide por vez, com botões, bolinhas, setas do teclado e    */
/* botão de pausa (exigência de acessibilidade para animações).  */
/* ============================================================ */
const carrossel = { indice: 0, total: 0, temporizador: null, pausado: false };

function criarSlideCarrossel(produto, posicao, total) {
  const loja = buscarLoja(produto.precos[0].lojaId);
  const nome = escaparHtml(produto.nome);
  return `
    <article class="carrossel__slide" role="group" aria-roledescription="slide" aria-label="${posicao + 1} de ${total}">
      <div class="carrossel__imagem">
        <img src="${produto.imagem}" alt="Imagem ilustrativa de ${nome}" width="400" height="300">
      </div>
      <div>
        <span class="selo selo--destaque">DESTAQUE</span>
        <h3 class="carrossel__titulo">${nome}</h3>
        <p class="carrossel__preco">${formatarPreco(produto.menorPreco)}</p>
        <p class="carrossel__loja">Menor preço em ${loja.nome} · <span class="selo selo--desconto">-${produto.descontoPercentual}%</span></p>
        <div class="carrossel__acoes">
          <a class="botao botao--primario" href="#/produto/${produto.id}">Comparar preços</a>
          ${criarBotaoFavorito(produto, true)}
        </div>
      </div>
    </article>`;
}

function mostrarSlide(indice) {
  carrossel.indice = (indice + carrossel.total) % carrossel.total;
  $("#carrosselTrilho").style.transform = `translateX(-${carrossel.indice * 100}%)`;
  $$(".carrossel__slide").forEach((slide, i) => {
    const ativo = i === carrossel.indice;
    slide.setAttribute("aria-hidden", String(!ativo));
    slide.inert = !ativo; // slides escondidos não recebem foco do teclado
  });
  $$(".carrossel__ponto").forEach((ponto, i) => {
    if (i === carrossel.indice) ponto.setAttribute("aria-current", "true");
    else ponto.removeAttribute("aria-current");
  });
}

function iniciarRotacaoAutomatica() {
  pararRotacaoAutomatica();
  if (carrossel.pausado) return;
  carrossel.temporizador = setInterval(() => mostrarSlide(carrossel.indice + 1), 6000);
}
function pararRotacaoAutomatica() {
  clearInterval(carrossel.temporizador);
  carrossel.temporizador = null;
}

function alternarPausaCarrossel() {
  carrossel.pausado = !carrossel.pausado;
  const botao = $("#carrosselPausa");
... (o restante desta seção continua no arquivo)
```

**5. Como os arquivos trabalham juntos:** O HTML só tem a moldura (`#carrosselTrilho`, botões e pontos). O JS cria os slides a partir dos produtos com `destaque: true` e move o trilho com `translateX(-N%)`. O CSS deixa cada slide com 100% de largura e anima a troca com `transition`. A pausa existe por acessibilidade (WCAG 2.2.2).

---

## 4. CARDS DE PRODUTOS E CATEGORIAS

**1. Para que serve:** Os cards são o bloco mais repetido do site: imagem, nome, preço, loja mais barata e botões.

**2. HTML (estrutura)**

```html
      <!-- ======================================================== -->
      <!-- 2.3 CATEGORIAS [categorias]                               -->
      <!-- ======================================================== -->
      <section class="secao" aria-labelledby="tituloCategoriasHome">
        <h2 class="secao__titulo" id="tituloCategoriasHome">Categorias</h2>
        <div class="grade-categorias" id="gradeCategoriasHome"></div>
      </section>
```

**3. CSS (aparência)**

```css
/* ============================================================ */
/* 7. CARDS DE PRODUTOS E CATEGORIAS [cards]                     */
/* ============================================================ */
.card {
  display: flex; flex-direction: column; background: var(--card); border: 1px solid var(--borda);
  border-radius: var(--raio); overflow: hidden; box-shadow: var(--sombra);
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
}
.card:hover { transform: translateY(-5px); border-color: var(--roxo); box-shadow: var(--sombra), var(--brilho); }
.card__imagem { position: relative; }
.card__imagem .selo { position: absolute; top: 0.6rem; left: 0.6rem; }
.card__corpo { display: flex; flex-direction: column; gap: 0.15rem; padding: 1rem; flex: 1; }
.card__categoria { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--azul); font-weight: 700; margin: 0; }
.card__titulo { font-size: 1.02rem; margin: 0.2rem 0; }
.card__titulo a { color: var(--texto); text-decoration: none; }
.card__titulo a:hover { color: var(--roxo); }
.card__marca { color: var(--texto-suave); font-size: 0.88rem; margin: 0; }
.card__precos { display: flex; align-items: baseline; gap: 0.6rem; flex-wrap: wrap; margin: 0.6rem 0 0; }
.preco-antigo { color: var(--texto-suave); text-decoration: line-through; font-size: 0.9rem; }
.preco-atual { color: var(--verde); font-size: 1.45rem; font-weight: 800; }
.card__loja { font-size: 0.85rem; color: var(--texto-suave); margin: 0 0 0.75rem; }
.card__acoes { display: flex; gap: 0.5rem; margin-top: auto; }
.card__acoes .botao--primario { flex: 1; }

.botao-favorito[aria-pressed="true"] { color: var(--roxo); border-color: var(--roxo); box-shadow: var(--brilho); }

.grade-categorias { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 1rem; }
.card-categoria {
  display: flex; flex-direction: column; align-items: center; gap: 0.3rem; padding: 1.2rem 0.8rem;
  background: var(--card); border: 1px solid var(--borda); border-radius: var(--raio);
  color: var(--texto); text-decoration: none; font-weight: 700; text-align: center;
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
}
.card-categoria:hover, .card-categoria[aria-current="true"] { transform: translateY(-4px); border-color: var(--azul); box-shadow: 0 0 16px rgba(56, 189, 248, 0.3); color: var(--texto); }
.card-categoria__icone { font-size: 2rem; }
.card-categoria__quantidade { font-weight: 400; font-size: 0.8rem; color: var(--texto-suave); }

.bloco-categoria { margin-top: 2.5rem; }
```

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 5. CARDS DE PRODUTO [cards]                                   */
/* Gera o HTML de um card (usado em quase todas as páginas).     */
/* ============================================================ */
function criarCardProduto(produto) {
  const loja = buscarLoja(produto.precos[0].lojaId);
  const categoria = buscarCategoria(produto.categoria);
  const nome = escaparHtml(produto.nome);

  return `
    <article class="card">
      <div class="card__imagem">
        <img src="${produto.imagem}" alt="Imagem ilustrativa de ${nome}" width="400" height="300" loading="lazy">
        <span class="selo selo--desconto">-${produto.descontoPercentual}%</span>
      </div>
      <div class="card__corpo">
        <p class="card__categoria">${categoria.nome}</p>
        <h3 class="card__titulo"><a href="#/produto/${produto.id}">${nome}</a></h3>
        <p class="card__marca">${produto.marca} · ${produto.modelo}</p>
        <p class="card__precos">
          <span class="preco-antigo"><span class="sr-only">Preço anterior (fictício): </span>${formatarPreco(produto.precoAnterior)}</span>
          <span class="preco-atual"><span class="sr-only">Menor preço: </span>${formatarPreco(produto.menorPreco)}</span>
        </p>
        <p class="card__loja">Menor preço em <strong>${loja.nome}</strong></p>
        <div class="card__acoes">
          <a class="botao botao--primario" href="#/produto/${produto.id}">Comparar preços</a>
          ${criarBotaoFavorito(produto, false)}
        </div>
      </div>
    </article>`;
}

function criarGradeProdutos(lista) {
  return lista.map(criarCardProduto).join("");
}

function criarCardCategoria(categoria, atual = false) {
  const quantidade = PRODUTOS.filter((p) => p.categoria === categoria.id).length;
  return `
    <a class="card-categoria" href="#/categorias?cat=${categoria.id}" ${atual ? 'aria-current="true"' : ""}>
      <span class="card-categoria__icone" aria-hidden="true">${categoria.icone}</span>
      <span>${categoria.nome}</span>
      <span class="card-categoria__quantidade">${quantidade} produtos</span>
    </a>`;
}
```

**5. Como os arquivos trabalham juntos:** O JS (`criarCardProduto`) devolve um texto HTML para cada produto; as páginas só chamam essa função. O CSS (`.card`, `.card:hover`) dá o visual e o brilho ao passar o mouse. Mudou o card? Altere em um único lugar e todas as páginas mudam.

---

## 5. COMPARAÇÃO DE PREÇOS

**1. Para que serve:** É a principal função do site: uma tabela com o preço de cada loja, a diferença para o menor preço e um link para a oferta.

**2. HTML (estrutura)**

```html
  <!-- ============================================================ -->
  <!-- 3. PÁGINA DE RESULTADOS E COMPARAÇÃO DE PREÇOS [comparacao]   -->
  <!-- ============================================================ -->
  <section id="pagina-resultados" class="pagina" hidden>
    <div class="container">
      <h1 class="pagina__titulo">Comparar preços</h1>

      <form class="busca busca--compacta" id="formPesquisaResultados" data-pesquisa role="search" novalidate>
        <label for="campoPesquisaResultados" class="sr-only">Pesquisar produto</label>
        <input type="search" id="campoPesquisaResultados" placeholder="Pesquise seu produto..." list="sugestoesProdutos" autocomplete="off">
        <button type="submit" class="botao botao--primario">Pesquisar</button>
      </form>

      <div class="filtros">
        <div class="filtros__item">
          <label for="filtroCategoriaResultados">Categoria</label>
          <select id="filtroCategoriaResultados"></select>
        </div>
        <div class="filtros__item">
          <label for="ordemResultados">Ordenar por</label>
          <select id="ordemResultados">
            <option value="menor-preco">Menor preço</option>
            <option value="maior-preco">Maior preço</option>
            <option value="maior-economia">Maior economia entre lojas</option>
            <option value="nome">Nome (A–Z)</option>
          </select>
        </div>
      </div>

      <p class="resumo" id="resumoResultados" role="status" aria-live="polite"></p>
      <div class="lista-resultados" id="listaResultados"></div>
    </div>
  </section>
```

**3. CSS (aparência)**

```css
/* ============================================================ */
/* 8. COMPARAÇÃO DE PREÇOS E PÁGINA DO PRODUTO [comparacao]      */
/* ============================================================ */
.lista-resultados { display: flex; flex-direction: column; gap: 1.5rem; }
.resultado {
  display: grid; grid-template-columns: 220px 1fr; gap: 1.25rem; padding: 1.25rem;
  background: var(--card); border: 1px solid var(--borda); border-radius: var(--raio); box-shadow: var(--sombra);
}
.resultado__imagem { border-radius: 12px; overflow: hidden; border: 1px solid var(--borda); align-self: start; }
.resultado__conteudo { min-width: 0; }
.resultado__titulo { font-size: 1.25rem; }
.resultado__titulo a { color: var(--texto); text-decoration: none; }
.resultado__titulo a:hover { color: var(--roxo); }
.lista-specs { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.6rem 0 1rem; }
.lista-specs li { background: var(--card-2); border: 1px solid var(--borda); border-radius: 8px; padding: 0.15rem 0.6rem; font-size: 0.85rem; color: var(--texto-suave); }

.tabela-rolagem { overflow-x: auto; border: 1px solid var(--borda); border-radius: 12px; }
.tabela-precos { width: 100%; border-collapse: collapse; min-width: 520px; }
.tabela-precos th, .tabela-precos td { padding: 0.7rem 0.9rem; text-align: left; border-bottom: 1px solid var(--borda); }
.tabela-precos thead th { background: var(--card-2); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--texto-suave); }
.tabela-precos tbody tr:last-child td { border-bottom: 0; }
.tabela-precos .num { text-align: right; white-space: nowrap; }
.tabela-precos .loja { font-weight: 700; }
.linha-menor { background: rgba(74, 222, 128, 0.12); box-shadow: inset 4px 0 0 var(--verde); }
.linha-menor .preco-tabela { color: var(--verde); font-size: 1.15rem; font-weight: 800; }
.diferenca { color: var(--texto-suave); font-size: 0.9rem; }

/* Página individual */
.migalhas { margin: 1.25rem 0; font-size: 0.9rem; color: var(--texto-suave); }
.produto__topo { display: grid; grid-template-columns: minmax(260px, 460px) 1fr; gap: 2rem; align-items: start; }
.produto__imagem { border: 1px solid var(--borda); border-radius: var(--raio); overflow: hidden; box-shadow: var(--sombra), var(--brilho); }
.produto__info h1 { font-size: clamp(1.5rem, 3vw, 2.2rem); }
.destaque-preco { margin: 1rem 0; padding: 1rem 1.25rem; border: 1px solid var(--verde); border-radius: 14px; background: rgba(74, 222, 128, 0.08); }
.destaque-preco__rotulo { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--texto-suave); margin: 0; }
.destaque-preco__valor { font-size: 2.4rem; font-weight: 800; color: var(--verde); margin: 0; line-height: 1.1; }
.produto__botoes { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.dados-produto { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; margin: 0 0 1rem; }
.dados-produto div { background: var(--card); border: 1px solid var(--borda); border-radius: 10px; padding: 0.6rem 0.9rem; }
.dados-produto dt { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--texto-suave); }
.dados-produto dd { margin: 0; font-weight: 700; }
.lista-caracteristicas { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.6rem; }
.lista-caracteristicas li { background: var(--card); border: 1px solid var(--borda); border-radius: 10px; padding: 0.6rem 0.9rem; }
.lista-caracteristicas li::before { content: "▸ "; color: var(--roxo); }
.bloco { margin-top: 2.5rem; }
.bloco > h2 { font-size: 1.5rem; }
```

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 7. COMPARAÇÃO DE PREÇOS [comparacao]                          */
/* ============================================================ */

// Tabela com uma linha por loja. A menor oferta recebe o selo "MENOR PREÇO".
function criarTabelaComparacao(produto) {
  const menor = identificarMenorOferta(produto);
  const ofertasOrdenadas = [...produto.precos].sort((a, b) => a.preco - b.preco);
  const nome = escaparHtml(produto.nome);

  const linhas = ofertasOrdenadas.map((oferta) => {
    const loja = buscarLoja(oferta.lojaId);
    const ehMenor = oferta.lojaId === menor.lojaId;
    const diferenca = calcularDiferenca(oferta.preco, menor.preco);
    const textoDiferenca = ehMenor
      ? "—"
      : `+ ${formatarPreco(diferenca.valor)} (+${diferenca.percentual.toFixed(1).replace(".", ",")}%)`;

    return `
      <tr class="${ehMenor ? "linha-menor" : ""}">
        <td class="loja">${loja.nome} ${ehMenor ? '<span class="selo selo--menor">MENOR PREÇO</span>' : ""}</td>
        <td class="num preco-tabela">${formatarPreco(oferta.preco)}</td>
        <td class="num diferenca">${textoDiferenca}</td>
        <td class="num">
          <a class="botao ${ehMenor ? "botao--primario" : ""}" href="${loja.url}" target="_blank" rel="noopener noreferrer">
            Ver oferta<span class="sr-only"> de ${nome} na ${loja.nome} (abre em nova aba)</span>
          </a>
        </td>
      </tr>`;
  }).join("");

  return `
    <div class="tabela-rolagem">
      <table class="tabela-precos">
        <caption class="sr-only">Preços fictícios de ${nome} em cada loja, do menor para o maior</caption>
        <thead>
          <tr>
            <th scope="col">Loja</th>
            <th scope="col" class="num">Preço</th>
            <th scope="col" class="num">Diferença</th>
            <th scope="col" class="num"><span class="sr-only">Link da oferta</span></th>
          </tr>
        </thead>
        <tbody>${linhas}</tbody>
      </table>
    </div>`;
}

// Item da página de resultados: imagem + informações + tabela de comparação
function criarResultadoComparacao(produto) {
  const nome = escaparHtml(produto.nome);
  const economia = produto.economiaMaxima;
  return `
    <article class="resultado">
      <div class="resultado__imagem">
... (o restante desta seção continua no arquivo)
```

**5. Como os arquivos trabalham juntos:** O JS (`criarTabelaComparacao`) ordena as ofertas, descobre a menor (`identificarMenorOferta`), calcula a diferença e marca a linha com a classe `linha-menor` e o selo `MENOR PREÇO`. O CSS pinta essa linha de verde. A página de resultados (HTML seção 3) apenas oferece o espaço `#listaResultados` onde o JS coloca tudo.

---

## 6. IDENTIFICAÇÃO DO MENOR PREÇO

**1. Para que serve:** Descobre automaticamente qual loja tem o menor valor e quanto as outras custam a mais.

**2. HTML (estrutura):** esta seção não tem trecho próprio neste arquivo.

**3. CSS (aparência):** esta seção não tem trecho próprio neste arquivo.

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 6. IDENTIFICAÇÃO DO MENOR PREÇO [menorpreco]                  */
/* ============================================================ */

// Percorre as ofertas e devolve a de menor valor
function identificarMenorOferta(produto) {
  return produto.precos.reduce((menor, oferta) => (oferta.preco < menor.preco ? oferta : menor));
}

// Quanto uma oferta custa a mais que a menor (em R$ e em %)
function calcularDiferenca(preco, menorPreco) {
  const valor = preco - menorPreco;
  return { valor, percentual: menorPreco > 0 ? (valor / menorPreco) * 100 : 0 };
}
```

**5. Como os arquivos trabalham juntos:** Funções puras do JS, sem HTML nem CSS próprios. A tabela de comparação, os cards e a página do produto usam esses resultados para destacar a melhor oferta.

---

## 7. FILTROS E ORDENAÇÃO

**1. Para que serve:** Filtra por categoria e ordena por menor preço, maior preço, maior desconto, maior economia ou nome.

**2. HTML (estrutura):** esta seção não tem trecho próprio neste arquivo.

**3. CSS (aparência):** esta seção não tem trecho próprio neste arquivo.

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 4. FILTROS E ORDENAÇÃO [filtros]                              */
/* ============================================================ */

// Devolve uma NOVA lista ordenada pelo critério escolhido
function ordenarProdutos(lista, ordem) {
  const criterios = {
    "menor-preco": (a, b) => a.menorPreco - b.menorPreco,
    "maior-preco": (a, b) => b.menorPreco - a.menorPreco,
    "maior-desconto": (a, b) => b.descontoPercentual - a.descontoPercentual,
    "maior-economia": (a, b) => b.economiaMaxima - a.economiaMaxima,
    "nome": (a, b) => a.nome.localeCompare(b.nome, "pt-BR")
  };
  return [...lista].sort(criterios[ordem] || criterios["menor-preco"]);
}

// Coloca as categorias dentro de um <select>
function preencherSelectCategorias(select, selecionada = "") {
  select.innerHTML =
    `<option value="">Todas as categorias</option>` +
    CATEGORIAS.map((c) => `<option value="${c.id}">${c.nome}</option>`).join("");
  select.value = selecionada;
}

function aplicarFiltrosResultados() {
  const termo = lerRota().consulta.get("q") || "";
  navegar(montarUrl("/resultados", {
    q: termo,
    cat: $("#filtroCategoriaResultados").value,
    ordem: $("#ordemResultados").value
  }));
}

function aplicarFiltrosOfertas() {
  navegar(montarUrl("/ofertas", {
    cat: $("#filtroCategoriaOfertas").value,
    ordem: $("#ordemOfertas").value
  }));
}
```

**5. Como os arquivos trabalham juntos:** Os `<select>` ficam no HTML (seções 3 e 6). Quando mudam, o JS (`aplicarFiltrosResultados`) monta uma nova URL com os filtros e a página é redesenhada. `ordenarProdutos` usa um objeto de critérios, então adicionar uma nova ordenação é só incluir uma linha.

---

## 8. FAVORITOS

**1. Para que serve:** Permite salvar produtos e vê-los na página Favoritos e no Perfil. Continuam salvos após atualizar a página.

**2. HTML (estrutura)**

```html
  <!-- ============================================================ -->
  <!-- 7. PÁGINA DE FAVORITOS [favoritos]                            -->
  <!-- ============================================================ -->
  <section id="pagina-favoritos" class="pagina" hidden>
    <div class="container">
      <h1 class="pagina__titulo">Meus favoritos</h1>
      <p class="secao__texto">Seus favoritos ficam salvos neste navegador (localStorage), mesmo após atualizar a página.</p>
      <div class="grade" id="gradeFavoritos"></div>
    </div>
  </section>
```

**3. CSS (aparência)**

```css
/* ============================================================ */
/* 7. CARDS DE PRODUTOS E CATEGORIAS [cards]                     */
/* ============================================================ */
.card {
  display: flex; flex-direction: column; background: var(--card); border: 1px solid var(--borda);
  border-radius: var(--raio); overflow: hidden; box-shadow: var(--sombra);
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
}
.card:hover { transform: translateY(-5px); border-color: var(--roxo); box-shadow: var(--sombra), var(--brilho); }
.card__imagem { position: relative; }
.card__imagem .selo { position: absolute; top: 0.6rem; left: 0.6rem; }
.card__corpo { display: flex; flex-direction: column; gap: 0.15rem; padding: 1rem; flex: 1; }
.card__categoria { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--azul); font-weight: 700; margin: 0; }
.card__titulo { font-size: 1.02rem; margin: 0.2rem 0; }
.card__titulo a { color: var(--texto); text-decoration: none; }
.card__titulo a:hover { color: var(--roxo); }
.card__marca { color: var(--texto-suave); font-size: 0.88rem; margin: 0; }
.card__precos { display: flex; align-items: baseline; gap: 0.6rem; flex-wrap: wrap; margin: 0.6rem 0 0; }
.preco-antigo { color: var(--texto-suave); text-decoration: line-through; font-size: 0.9rem; }
.preco-atual { color: var(--verde); font-size: 1.45rem; font-weight: 800; }
.card__loja { font-size: 0.85rem; color: var(--texto-suave); margin: 0 0 0.75rem; }
.card__acoes { display: flex; gap: 0.5rem; margin-top: auto; }
.card__acoes .botao--primario { flex: 1; }

.botao-favorito[aria-pressed="true"] { color: var(--roxo); border-color: var(--roxo); box-shadow: var(--brilho); }

.grade-categorias { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 1rem; }
.card-categoria {
  display: flex; flex-direction: column; align-items: center; gap: 0.3rem; padding: 1.2rem 0.8rem;
  background: var(--card); border: 1px solid var(--borda); border-radius: var(--raio);
  color: var(--texto); text-decoration: none; font-weight: 700; text-align: center;
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
}
.card-categoria:hover, .card-categoria[aria-current="true"] { transform: translateY(-4px); border-color: var(--azul); box-shadow: 0 0 16px rgba(56, 189, 248, 0.3); color: var(--texto); }
.card-categoria__icone { font-size: 2rem; }
.card-categoria__quantidade { font-weight: 400; font-size: 0.8rem; color: var(--texto-suave); }

.bloco-categoria { margin-top: 2.5rem; }
```

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 8. SISTEMA DE FAVORITOS [favoritos]                           */
/* Salva só os IDs dos produtos favoritos no localStorage.       */
/* ============================================================ */
function lerFavoritos() { return lerArmazenamento(CHAVES.favoritos, []); }
function ehFavorito(id) { return lerFavoritos().includes(id); }

function criarBotaoFavorito(produto, comTexto) {
  const ativo = ehFavorito(produto.id);
  return `
    <button type="button" class="botao ${comTexto ? "" : "botao--icone"} botao-favorito" data-favorito="${produto.id}"
            aria-pressed="${ativo}" aria-label="Favoritar ${escaparHtml(produto.nome)}">
      <span class="botao-favorito__icone" aria-hidden="true">${ativo ? "♥" : "♡"}</span>
      ${comTexto ? `<span class="botao-favorito__texto">${ativo ? "Favoritado" : "Favoritar"}</span>` : ""}
    </button>`;
}

function alternarFavorito(id) {
  const favoritos = lerFavoritos();
  const produto = buscarProdutoPorId(id);
  if (favoritos.includes(id)) {
    salvarArmazenamento(CHAVES.favoritos, favoritos.filter((f) => f !== id));
    mostrarAviso(`Removido dos favoritos: ${produto.nome}`);
  } else {
    salvarArmazenamento(CHAVES.favoritos, [...favoritos, id]);
    mostrarAviso(`Adicionado aos favoritos: ${produto.nome}`, "sucesso");
  }
  atualizarBotoesFavorito();
  const pagina = lerRota().pagina;
  if (pagina === "favoritos" || pagina === "perfil") atualizarPaginaAtual();
}

// Atualiza o ícone/estado de TODOS os botões de favorito e o contador do menu
function atualizarBotoesFavorito() {
  $$("[data-favorito]").forEach((botao) => {
    const ativo = ehFavorito(botao.dataset.favorito);
    botao.setAttribute("aria-pressed", String(ativo));
    const icone = $(".botao-favorito__icone", botao);
    const texto = $(".botao-favorito__texto", botao);
    if (icone) icone.textContent = ativo ? "♥" : "♡";
    if (texto) texto.textContent = ativo ? "Favoritado" : "Favoritar";
  });
  const total = lerFavoritos().length;
  const contador = $("#contadorFavoritos");
  contador.textContent = total;
  contador.setAttribute("aria-label", `${total} ${total === 1 ? "favorito" : "favoritos"}`);
}

function renderizarFavoritos() {
  const produtos = lerFavoritos().map(buscarProdutoPorId).filter(Boolean);
  $("#gradeFavoritos").innerHTML = produtos.length
    ? criarGradeProdutos(produtos)
    : `<div class="vazio" style="grid-column:1/-1">
         <p>Você ainda não favoritou nenhum produto.</p>
         <a class="botao botao--primario" href="#/categorias">Explorar produtos</a>
... (o restante desta seção continua no arquivo)
```

**5. Como os arquivos trabalham juntos:** O botão (♡/♥) é criado pelo JS (`criarBotaoFavorito`). Um único ouvinte de cliques no `document` reconhece o atributo `data-favorito` e chama `alternarFavorito`, que grava os IDs no `localStorage`. O CSS destaca o botão quando `aria-pressed="true"`.

---

## 9. HISTÓRICO DE PESQUISAS

**1. Para que serve:** Guarda as últimas 10 pesquisas e mostra como atalhos na Home e no Perfil.

**2. HTML (estrutura):** esta seção não tem trecho próprio neste arquivo.

**3. CSS (aparência):** esta seção não tem trecho próprio neste arquivo.

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 9. HISTÓRICO DE PESQUISAS [historico]                         */
/* ============================================================ */
function lerHistorico() { return lerArmazenamento(CHAVES.historico, []); }

// Guarda as 10 últimas pesquisas, sem repetir
function salvarPesquisaNoHistorico(termo) {
  const historico = lerHistorico().filter((t) => normalizarTexto(t) !== normalizarTexto(termo));
  historico.unshift(termo);
  salvarArmazenamento(CHAVES.historico, historico.slice(0, 10));
}

function limparHistorico() {
  salvarArmazenamento(CHAVES.historico, []);
  mostrarAviso("Histórico de pesquisas apagado.");
  atualizarPaginaAtual();
}

function criarChipsHistorico() {
  return lerHistorico().map((termo) =>
    `<li><a class="chip" href="#/resultados?q=${encodeURIComponent(termo)}">${escaparHtml(termo)}</a></li>`
  ).join("");
}

function renderizarPesquisasRecentes() {
  const historico = lerHistorico();
  $("#pesquisasRecentesHome").hidden = historico.length === 0;
  $("#listaPesquisasRecentes").innerHTML = criarChipsHistorico();
}
```

**5. Como os arquivos trabalham juntos:** Todo o controle está no JS (`salvarPesquisaNoHistorico`, `limparHistorico`). Os atalhos usam a classe `.chip` do CSS.

---

## 10. ALERTAS DE PREÇO (DEMONSTRATIVO)

**1. Para que serve:** O usuário escolhe um produto e um preço desejado. Como não há servidor, a notificação é simulada.

**2. HTML (estrutura)**

```html
  <!-- ============================================================ -->
  <!-- 8. PÁGINA DE ALERTAS DE PREÇO [alertas]                       -->
  <!-- ============================================================ -->
  <section id="pagina-alertas" class="pagina" hidden>
    <div class="container">
      <h1 class="pagina__titulo">Alertas de preço</h1>
      <p class="aviso-caixa">
        <strong>Demonstração local:</strong> não existe servidor de notificações nem envio de e-mails.
        Os alertas ficam salvos neste navegador e você pode simular uma queda de preço para ver o aviso funcionando.
      </p>

      <div class="duas-colunas">
        <form class="formulario cartao" id="formAlerta" novalidate>
          <h2 class="cartao__titulo">Criar alerta</h2>

          <div class="campo">
            <label for="alertaProduto">Produto</label>
            <select id="alertaProduto" required aria-describedby="erro-alertaProduto"></select>
            <p class="campo__erro" id="erro-alertaProduto"></p>
          </div>

          <p class="alerta__atual">Preço atual (menor encontrado): <strong id="alertaPrecoAtual">—</strong></p>

          <div class="campo">
            <label for="alertaPreco">Preço desejado (R$)</label>
            <input type="number" id="alertaPreco" min="0.01" step="0.01" inputmode="decimal" placeholder="Ex.: 1599.00" required aria-describedby="erro-alertaPreco">
            <p class="campo__erro" id="erro-alertaPreco"></p>
          </div>

          <button type="submit" class="botao botao--primario">Criar alerta</button>
        </form>

        <div>
          <h2 class="cartao__titulo">Meus alertas</h2>
          <div id="listaAlertas"></div>
        </div>
      </div>
    </div>
  </section>
```

**3. CSS (aparência)**

```css
/* ============================================================ */
/* 10. FORMULÁRIOS [formularios]                                 */
/* ============================================================ */
.formulario { display: flex; flex-direction: column; gap: 1rem; }
.formulario--largo { max-width: 680px; }
.campo { display: flex; flex-direction: column; gap: 0.3rem; }
.campo label { font-weight: 600; font-size: 0.92rem; }

input[type="text"], input[type="email"], input[type="password"], input[type="number"], select, textarea {
  width: 100%; min-height: 44px; padding: 0.55rem 0.8rem; border-radius: 10px;
  border: 1px solid var(--borda); background: var(--fundo-2); color: var(--texto); font: inherit;
}
textarea { resize: vertical; }
input:focus-visible, select:focus-visible, textarea:focus-visible { border-color: var(--azul); }
[aria-invalid="true"] { border-color: var(--vermelho) !important; }

.campo__erro { min-height: 1.2em; margin: 0; color: var(--vermelho); font-size: 0.88rem; font-weight: 600; }
.sucesso { color: var(--verde); font-weight: 700; margin: 0; }

.cartao { background: var(--card); border: 1px solid var(--borda); border-radius: var(--raio); padding: 1.5rem; box-shadow: var(--sombra); }
.cartao__titulo { font-size: 1.25rem; }
.duas-colunas { display: grid; grid-template-columns: minmax(280px, 400px) 1fr; gap: 1.5rem; align-items: start; margin-top: 1.25rem; }

/* Alertas */
.alerta__atual { margin: 0; color: var(--texto-suave); }
.alerta-item { background: var(--card); border: 1px solid var(--borda); border-radius: 14px; padding: 1rem 1.25rem; margin-bottom: 1rem; }
.alerta-item--atingido { border-color: var(--verde); box-shadow: 0 0 14px rgba(74, 222, 128, 0.25); }
.alerta-item h3 { font-size: 1.05rem; }
.alerta-item__dados { display: flex; flex-wrap: wrap; gap: 0.4rem 1.5rem; margin: 0.4rem 0 0.8rem; color: var(--texto-suave); font-size: 0.92rem; }
.alerta-item__acoes { display: flex; flex-wrap: wrap; gap: 0.5rem; }
```

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 10. ALERTAS DE PREÇO (DEMONSTRATIVO) [alertas]                */
/* Sem servidor: os alertas ficam no localStorage e a            */
/* "notificação" é uma mensagem exibida na própria página.       */
/* ============================================================ */
function lerAlertas() { return lerArmazenamento(CHAVES.alertas, []); }

// Descobre se o preço desejado já foi atingido
function calcularStatusAlerta(alerta) {
  const produto = buscarProdutoPorId(alerta.produtoId);
  const precoAtual = Math.min(produto.menorPreco, alerta.precoSimulado ?? Infinity);
  return { produto, precoAtual, atingido: precoAtual <= alerta.precoDesejado };
}

function criarListaAlertas(alertas, comAcoes) {
  if (!alertas.length) {
    return `<div class="vazio"><p>Nenhum alerta cadastrado.</p>${comAcoes ? "" : '<a class="botao" href="#/alertas">Criar alerta</a>'}</div>`;
  }
  return alertas.map((alerta) => {
    const status = calcularStatusAlerta(alerta);
    const nome = escaparHtml(status.produto.nome);
    return `
      <article class="alerta-item ${status.atingido ? "alerta-item--atingido" : ""}">
        <h3><a href="#/produto/${status.produto.id}">${nome}</a></h3>
        <div class="alerta-item__dados">
          <span>Preço atual: <strong>${formatarPreco(status.precoAtual)}</strong></span>
          <span>Preço desejado: <strong>${formatarPreco(alerta.precoDesejado)}</strong></span>
          <span>${status.atingido
            ? '<span class="selo selo--ok">PREÇO ATINGIDO</span>'
            : '<span class="selo selo--info">Monitorando</span>'}</span>
        </div>
        ${comAcoes ? `
          <div class="alerta-item__acoes">
            ${status.atingido ? "" : `<button type="button" class="botao" data-simular-alerta="${alerta.id}">Simular queda de preço</button>`}
            <button type="button" class="botao botao--perigo" data-remover-alerta="${alerta.id}">Remover alerta</button>
          </div>` : ""}
      </article>`;
  }).join("");
}

function atualizarPrecoAtualDoFormulario() {
  const produto = buscarProdutoPorId($("#alertaProduto").value);
  $("#alertaPrecoAtual").textContent = produto ? formatarPreco(produto.menorPreco) : "—";
}

function criarAlerta(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  limparErros(formulario);

  const campoProduto = $("#alertaProduto");
  const campoPreco = $("#alertaPreco");
  const produto = buscarProdutoPorId(campoProduto.value);
  const preco = parseFloat(campoPreco.value);

... (o restante desta seção continua no arquivo)
```

**5. Como os arquivos trabalham juntos:** O formulário está no HTML (seção 8). O JS valida (`criarAlerta`), salva no `localStorage` e a lista mostra se o alvo foi atingido (`calcularStatusAlerta`). O botão "Simular queda de preço" demonstra o aviso funcionando.

---

## 11. LOGIN, CADASTRO E PERFIL

**1. Para que serve:** Telas de entrar, cadastrar e recuperar senha, mais a área pessoal. É apenas uma demonstração local, não é segura.

**2. HTML (estrutura)**

```html
  <!-- ============================================================ -->
  <!-- 9. LOGIN E CADASTRO [login]                                   -->
  <!-- ============================================================ -->
  <section id="pagina-login" class="pagina" hidden>
    <div class="container">
      <div class="login cartao">
        <h1 class="pagina__titulo pagina__titulo--centro">Acesse sua conta</h1>
        <p class="aviso-caixa">
          <strong>Demonstração:</strong> a conta é salva apenas neste navegador e <strong>não é um sistema seguro</strong>.
          Não use senhas reais.
        </p>

        <div class="abas" role="tablist" aria-label="Acesso à conta">
          <button type="button" role="tab" id="aba-entrar" class="aba" data-aba="entrar" aria-selected="true" aria-controls="painel-entrar">Entrar</button>
          <button type="button" role="tab" id="aba-cadastrar" class="aba" data-aba="cadastrar" aria-selected="false" aria-controls="painel-cadastrar" tabindex="-1">Cadastrar</button>
        </div>

        <!-- Painel: Entrar -->
        <div id="painel-entrar" role="tabpanel" aria-labelledby="aba-entrar">
          <form class="formulario" id="formEntrar" novalidate>
            <div class="campo">
              <label for="entrarEmail">E-mail</label>
              <input type="email" id="entrarEmail" autocomplete="email" required aria-describedby="erro-entrarEmail">
              <p class="campo__erro" id="erro-entrarEmail"></p>
            </div>
            <div class="campo">
              <label for="entrarSenha">Senha</label>
              <input type="password" id="entrarSenha" autocomplete="current-password" required aria-describedby="erro-entrarSenha">
              <p class="campo__erro" id="erro-entrarSenha"></p>
            </div>
            <button type="submit" class="botao botao--primario botao--cheio">Entrar</button>
            <button type="button" class="botao-link" data-aba="recuperar">Esqueci minha senha</button>
          </form>
        </div>

        <!-- Painel: Cadastrar -->
        <div id="painel-cadastrar" role="tabpanel" aria-labelledby="aba-cadastrar" hidden>
          <form class="formulario" id="formCadastro" novalidate>
            <div class="campo">
              <label for="cadNome">Nome</label>
              <input type="text" id="cadNome" autocomplete="name" required aria-describedby="erro-cadNome">
              <p class="campo__erro" id="erro-cadNome"></p>
            </div>
            <div class="campo">
              <label for="cadEmail">E-mail</label>
              <input type="email" id="cadEmail" autocomplete="email" required aria-describedby="erro-cadEmail">
              <p class="campo__erro" id="erro-cadEmail"></p>
            </div>
            <div class="campo">
              <label for="cadSenha">Senha (mínimo de 8 caracteres)</label>
              <input type="password" id="cadSenha" autocomplete="new-password" required aria-describedby="erro-cadSenha">
              <p class="campo__erro" id="erro-cadSenha"></p>
            </div>
            <div class="campo">
              <label for="cadConfirma">Confirmação de senha</label>
... (o restante desta seção continua no arquivo)
```

**3. CSS (aparência)**

```css
/* ============================================================ */
/* 11. LOGIN, CADASTRO E PERFIL [login]                          */
/* ============================================================ */
.login { max-width: 480px; margin: 2rem auto 0; }
.abas { display: flex; gap: 0.4rem; margin: 1rem 0; border-bottom: 1px solid var(--borda); }
.aba {
  flex: 1; padding: 0.7rem; background: none; border: 0; border-bottom: 3px solid transparent;
  color: var(--texto-suave); font: inherit; font-weight: 700; cursor: pointer;
}
.aba[aria-selected="true"] { color: var(--roxo); border-bottom-color: var(--roxo); }

.perfil__cabecalho { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; margin: 2rem 0 1rem; }
.perfil__avatar {
  width: 72px; height: 72px; border-radius: 50%; display: grid; place-items: center;
  background: linear-gradient(135deg, var(--acao), var(--azul)); color: #fff; font-size: 1.8rem; font-weight: 800; box-shadow: var(--brilho);
}
.perfil__grade { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
.preferencias { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
```

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 11. LOGIN E CADASTRO DEMONSTRATIVOS [login]                   */
/* ATENÇÃO: isto NÃO é um sistema seguro. Os dados ficam no      */
/* navegador e o "hash" abaixo é apenas ilustrativo.             */
/* Em um site real, a autenticação é feita por um servidor.      */
/* ============================================================ */
function lerUsuarios() { return lerArmazenamento(CHAVES.usuarios, []); }
function lerSessao() { return lerArmazenamento(CHAVES.sessao, null); }

// Transforma a senha em um código (NÃO é criptografia segura)
function gerarHashDemonstrativo(texto) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

function emailValido(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email); }

function cadastrarUsuario(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  limparErros(formulario);

  const campoNome = $("#cadNome"), campoEmail = $("#cadEmail"), campoSenha = $("#cadSenha"), campoConfirma = $("#cadConfirma");
  const nome = campoNome.value.trim();
  const email = campoEmail.value.trim().toLowerCase();

  definirErro(campoNome, nome.length >= 2 ? "" : "Informe seu nome (mínimo de 2 letras).");
  if (!emailValido(email)) definirErro(campoEmail, "Informe um e-mail válido, como nome@exemplo.com.");
  else if (lerUsuarios().some((u) => u.email === email)) definirErro(campoEmail, "Este e-mail já está cadastrado.");
  definirErro(campoSenha, campoSenha.value.length >= 8 ? "" : "A senha deve ter no mínimo 8 caracteres.");
  definirErro(campoConfirma, campoConfirma.value === campoSenha.value && campoConfirma.value ? "" : "As senhas não coincidem.");

  if (formulario.querySelector('[aria-invalid="true"]')) { focarPrimeiroErro(formulario); return; }

  const usuarios = lerUsuarios();
  usuarios.push({ nome, email, senhaHash: gerarHashDemonstrativo(campoSenha.value), criadoEm: new Date().toISOString() });
  salvarArmazenamento(CHAVES.usuarios, usuarios);
  salvarArmazenamento(CHAVES.sessao, { nome, email });
  formulario.reset();
  atualizarMenuConta();
  mostrarAviso(`Conta criada! Bem-vindo(a), ${nome}.`, "sucesso");
  navegar("/perfil");
}

function entrarNaConta(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  limparErros(formulario);
... (o restante desta seção continua no arquivo)
```

**5. Como os arquivos trabalham juntos:** O HTML tem três painéis (abas). O JS valida os campos, grava o usuário no `localStorage` e guarda a sessão. A senha passa por um código simples (`gerarHashDemonstrativo`) que NÃO é criptografia segura. Em um site real isso é feito por um servidor.

---

## 12. GRÁFICO DE HISTÓRICO DE PREÇOS

**1. Para que serve:** Mostra a evolução do preço em 7 dias, 30 dias, 3 meses ou 6 meses. Os dados são fictícios.

**2. HTML (estrutura):** esta seção não tem trecho próprio neste arquivo.

**3. CSS (aparência)**

```css
/* ============================================================ */
/* 9. GRÁFICOS DE HISTÓRICO DE PREÇOS [graficos]                 */
/* ============================================================ */
.grafico { background: var(--card); border: 1px solid var(--borda); border-radius: var(--raio); padding: 1.25rem; }
.periodos { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
.grafico__svg { width: 100%; height: auto; display: block; touch-action: pan-y; }
.grafico__grade { stroke: var(--borda); stroke-width: 1; }
.grafico__linha { fill: none; stroke: var(--azul); stroke-width: 2.5; stroke-linejoin: round; stroke-linecap: round; }
.grafico__area { fill: url(#gradienteGrafico); }
.grafico__texto { fill: var(--texto-suave); font-size: 11px; font-family: inherit; }
.grafico__guia { stroke: var(--roxo); stroke-width: 1; stroke-dasharray: 4 3; }
.grafico__ponto { fill: var(--roxo); stroke: var(--fundo); stroke-width: 2; }
.grafico__dica-fundo { fill: var(--card-2); stroke: var(--roxo); }
.grafico__dica-texto { fill: var(--texto); font-size: 12px; font-weight: 700; }
.grafico__resumo { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; margin-top: 1rem; }
.grafico__resumo div { background: var(--card-2); border-radius: 10px; padding: 0.6rem 0.9rem; }
.grafico__resumo dt { font-size: 0.78rem; text-transform: uppercase; color: var(--texto-suave); letter-spacing: 0.06em; }
.grafico__resumo dd { margin: 0; font-weight: 800; }
.grafico__nota { font-size: 0.85rem; color: var(--texto-suave); margin: 0.75rem 0 0; }
```

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 16. GRÁFICO DE HISTÓRICO DE PREÇOS [graficos]                 */
/* O gráfico é um SVG desenhado pelo próprio JavaScript, sem     */
/* bibliotecas. Os dados são FICTÍCIOS (gerados por semente).    */
/* ============================================================ */
const PERIODOS_GRAFICO = [
  { dias: 7, rotulo: "Últimos 7 dias" },
  { dias: 30, rotulo: "Últimos 30 dias" },
  { dias: 90, rotulo: "Últimos 3 meses" },
  { dias: 180, rotulo: "Últimos 6 meses" }
];
const cacheHistorico = {};

// Cria 180 dias de preços fictícios que terminam no preço atual
function gerarHistoricoPreco(produto) {
  if (cacheHistorico[produto.id]) return cacheHistorico[produto.id];

  const aleatorio = criarGeradorAleatorio(textoParaNumero(produto.id));
  const valores = [];
  let preco = produto.menorPreco;
  for (let dia = 0; dia < 180; dia++) {
    valores.push(Math.round(preco * 100) / 100);
    const variacao = (aleatorio() - 0.48) * 0.035;
    preco = Math.min(Math.max(preco * (1 + variacao), produto.menorPreco * 0.97), produto.precoAnterior * 1.05);
  }
  valores.reverse(); // índice 0 = mais antigo; último = hoje

  const hoje = new Date();
  cacheHistorico[produto.id] = valores.map((valor, i) => {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() - (179 - i));
    return { data, valor };
  });
  return cacheHistorico[produto.id];
}

function formatarDataCurta(data) {
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

// Desenha o gráfico dentro de um elemento e liga a interação (passar o mouse/dedo)
function desenharGrafico(container, pontos) {
  const largura = 640, altura = 260;
  const margem = { esq: 82, dir: 16, topo: 16, base: 30 };
  const larguraUtil = largura - margem.esq - margem.dir;
  const alturaUtil = altura - margem.topo - margem.base;

  const valores = pontos.map((p) => p.valor);
  let minimo = Math.min(...valores), maximo = Math.max(...valores);
  if (maximo - minimo < 1) { minimo -= 1; maximo += 1; }
  const folga = (maximo - minimo) * 0.08;
  minimo -= folga; maximo += folga;

  // Converte índice/valor em coordenadas X/Y do SVG
  const posX = (i) => margem.esq + (i * larguraUtil) / (pontos.length - 1);
... (o restante desta seção continua no arquivo)
```

**5. Como os arquivos trabalham juntos:** O JS gera 180 dias de preços com um gerador pseudoaleatório (`gerarHistoricoPreco`, que usa o gerador de `data.js`) e desenha um SVG na mão (`desenharGrafico`). O CSS dá cor às linhas pelas classes `grafico__*`, então o gráfico respeita o tema claro/escuro.

---

## 13. MODO CLARO E ESCURO

**1. Para que serve:** Alterna entre dois temas e lembra a escolha.

**2. HTML (estrutura):** esta seção não tem trecho próprio neste arquivo.

**3. CSS (aparência)**

```css
/* ============================================================ */
/* 13. MODO CLARO [temas]                                        */
/* Sobrescreve as variáveis quando <html data-theme="light">.    */
/* ============================================================ */
:root[data-theme="light"] {
  --fundo: #f6f5fb;
  --fundo-2: #ffffff;
  --card: #ffffff;
  --card-2: #efeafb;
  --borda: #d6cfee;
  --texto: #15121f;
  --texto-suave: #4a4666;
  --roxo: #6d28d9;
  --acao: #6d28d9;
  --acao-hover: #5b21b6;
  --azul: #0369a1;
  --link: #5b21b6;
  --verde: #15803d;
  --verde-fundo: #15803d;
  --verde-texto: #ffffff;
  --vermelho: #b91c1c;
  --foco: #0369a1;
  --sombra: 0 8px 22px rgba(60, 40, 120, 0.12);
  --brilho: 0 0 14px rgba(109, 40, 217, 0.25);
}
:root[data-theme="light"] .hero {
  background:
    radial-gradient(circle at 15% 20%, rgba(124, 58, 237, 0.16), transparent 45%),
    radial-gradient(circle at 85% 10%, rgba(3, 105, 161, 0.12), transparent 40%),
    var(--fundo);
}
:root[data-theme="light"] .linha-menor { background: rgba(21, 128, 61, 0.1); }
:root[data-theme="light"] .destaque-preco { background: rgba(21, 128, 61, 0.07); }
```

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 12. ALTERNÂNCIA DE TEMAS (CLARO/ESCURO) [temas]               */
/* O tema é um atributo no <html>: data-theme="dark" ou "light". */
/* O CSS troca as cores a partir dele (veja style.css, seção 13).*/
/* ============================================================ */
function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema);
  salvarConfig({ tema });
  const botao = $("#botaoTema");
  const claro = tema === "light";
  botao.setAttribute("aria-pressed", String(claro));
  botao.setAttribute("aria-label", claro ? "Ativar modo escuro" : "Ativar modo claro");
  $("#iconeTema").textContent = claro ? "☾" : "☀";
}

function alternarTema() {
  aplicarTema(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
}
```

**5. Como os arquivos trabalham juntos:** O JS troca o atributo `data-theme` do `<html>`. O CSS tem as cores como variáveis (seção 2) e a seção 13 redefine essas variáveis para o tema claro. Para mudar a cor do site, basta editar as variáveis.

---

## 14. ACESSIBILIDADE (TAMANHO DA FONTE)

**1. Para que serve:** Aumenta e diminui o tamanho do texto do site inteiro.

**2. HTML (estrutura):** esta seção não tem trecho próprio neste arquivo.

**3. CSS (aparência):** esta seção não tem trecho próprio neste arquivo.

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 13. ACESSIBILIDADE (TAMANHO DA FONTE) [acessibilidade]       */
/* Todo o CSS usa "rem", então mudar o tamanho da fonte do       */
/* <html> aumenta/diminui o site inteiro proporcionalmente.      */
/* ============================================================ */
const TAMANHOS_FONTE = [87.5, 100, 112.5, 125, 150];

function aplicarTamanhoFonte(porcentagem) {
  document.documentElement.style.fontSize = porcentagem + "%";
  salvarConfig({ fonte: porcentagem });
  const indice = TAMANHOS_FONTE.indexOf(porcentagem);
  $("#botaoFonteMenos").disabled = indice <= 0;
  $("#botaoFonteMais").disabled = indice >= TAMANHOS_FONTE.length - 1;
}

function mudarTamanhoFonte(passo) {
  const atual = TAMANHOS_FONTE.indexOf(lerConfig().fonte);
  const novoIndice = Math.min(Math.max((atual === -1 ? 1 : atual) + passo, 0), TAMANHOS_FONTE.length - 1);
  aplicarTamanhoFonte(TAMANHOS_FONTE[novoIndice]);
  mostrarAviso(`Tamanho da fonte: ${TAMANHOS_FONTE[novoIndice]}%`);
}
```

**5. Como os arquivos trabalham juntos:** O JS altera o `font-size` do `<html>` (87,5% a 150%). Como o CSS usa `rem`, tudo muda proporcionalmente. Outros recursos: link "Pular para o conteúdo", foco visível, rótulos nos campos, `aria-live` nos avisos e erros, `alt` nas imagens.

---

## 15. FORMULÁRIOS E CONTATO

**1. Para que serve:** Validação com mensagens de erro acessíveis e o formulário de contato.

**2. HTML (estrutura)**

```html
  <!-- ============================================================ -->
  <!-- 11. FORMULÁRIO DE CONTATO [formularios]                       -->
  <!-- ============================================================ -->
  <section id="pagina-contato" class="pagina" hidden>
    <div class="container">
      <h1 class="pagina__titulo">Contato</h1>
      <p class="secao__texto">Dúvidas, sugestões ou parcerias? Envie sua mensagem. (Demonstração: a mensagem é salva apenas neste navegador.)</p>

      <form class="formulario cartao formulario--largo" id="formContato" novalidate>
        <div class="campo">
          <label for="contatoNome">Nome</label>
          <input type="text" id="contatoNome" autocomplete="name" required aria-describedby="erro-contatoNome">
          <p class="campo__erro" id="erro-contatoNome"></p>
        </div>
        <div class="campo">
          <label for="contatoEmail">E-mail</label>
          <input type="email" id="contatoEmail" autocomplete="email" required aria-describedby="erro-contatoEmail">
          <p class="campo__erro" id="erro-contatoEmail"></p>
        </div>
        <div class="campo">
          <label for="contatoAssunto">Assunto</label>
          <select id="contatoAssunto" required aria-describedby="erro-contatoAssunto">
            <option value="">Selecione...</option>
            <option>Dúvida</option>
            <option>Sugestão</option>
            <option>Problema no site</option>
            <option>Parceria com lojas</option>
          </select>
          <p class="campo__erro" id="erro-contatoAssunto"></p>
        </div>
        <div class="campo">
          <label for="contatoMensagem">Mensagem</label>
          <textarea id="contatoMensagem" rows="5" required aria-describedby="erro-contatoMensagem"></textarea>
          <p class="campo__erro" id="erro-contatoMensagem"></p>
        </div>
        <button type="submit" class="botao botao--primario">Enviar mensagem</button>
        <p class="sucesso" id="contatoSucesso" role="status" hidden></p>
      </form>
    </div>
  </section>

</main>
```

**3. CSS (aparência)**

```css
/* ============================================================ */
/* 10. FORMULÁRIOS [formularios]                                 */
/* ============================================================ */
.formulario { display: flex; flex-direction: column; gap: 1rem; }
.formulario--largo { max-width: 680px; }
.campo { display: flex; flex-direction: column; gap: 0.3rem; }
.campo label { font-weight: 600; font-size: 0.92rem; }

input[type="text"], input[type="email"], input[type="password"], input[type="number"], select, textarea {
  width: 100%; min-height: 44px; padding: 0.55rem 0.8rem; border-radius: 10px;
  border: 1px solid var(--borda); background: var(--fundo-2); color: var(--texto); font: inherit;
}
textarea { resize: vertical; }
input:focus-visible, select:focus-visible, textarea:focus-visible { border-color: var(--azul); }
[aria-invalid="true"] { border-color: var(--vermelho) !important; }

.campo__erro { min-height: 1.2em; margin: 0; color: var(--vermelho); font-size: 0.88rem; font-weight: 600; }
.sucesso { color: var(--verde); font-weight: 700; margin: 0; }

.cartao { background: var(--card); border: 1px solid var(--borda); border-radius: var(--raio); padding: 1.5rem; box-shadow: var(--sombra); }
.cartao__titulo { font-size: 1.25rem; }
.duas-colunas { display: grid; grid-template-columns: minmax(280px, 400px) 1fr; gap: 1.5rem; align-items: start; margin-top: 1.25rem; }

/* Alertas */
.alerta__atual { margin: 0; color: var(--texto-suave); }
.alerta-item { background: var(--card); border: 1px solid var(--borda); border-radius: 14px; padding: 1rem 1.25rem; margin-bottom: 1rem; }
.alerta-item--atingido { border-color: var(--verde); box-shadow: 0 0 14px rgba(74, 222, 128, 0.25); }
.alerta-item h3 { font-size: 1.05rem; }
.alerta-item__dados { display: flex; flex-wrap: wrap; gap: 0.4rem 1.5rem; margin: 0.4rem 0 0.8rem; color: var(--texto-suave); font-size: 0.92rem; }
.alerta-item__acoes { display: flex; flex-wrap: wrap; gap: 0.5rem; }
```

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 15. FORMULÁRIOS: VALIDAÇÃO E CONTATO [formularios]            */
/* Cada campo tem um <p class="campo__erro" id="erro-ID">.       */
/* Ele é ligado ao campo por aria-describedby, então leitores    */
/* de tela leem a mensagem de erro junto com o campo.            */
/* ============================================================ */

// Mostra (ou limpa) a mensagem de erro de um campo. Devolve true se não há erro.
function definirErro(campo, mensagem) {
  const elementoErro = document.getElementById("erro-" + campo.id);
  campo.setAttribute("aria-invalid", mensagem ? "true" : "false");
  if (elementoErro) elementoErro.textContent = mensagem || "";
  return !mensagem;
}

function limparErros(formulario) {
  $$("input, select, textarea", formulario).forEach((campo) => definirErro(campo, ""));
}

function focarPrimeiroErro(formulario) {
  const campo = $('[aria-invalid="true"]', formulario);
  if (campo) campo.focus();
}

function enviarContato(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  limparErros(formulario);
  $("#contatoSucesso").hidden = true;

  const nome = $("#contatoNome"), email = $("#contatoEmail"), assunto = $("#contatoAssunto"), mensagem = $("#contatoMensagem");
  definirErro(nome, nome.value.trim().length >= 2 ? "" : "Informe seu nome.");
  definirErro(email, emailValido(email.value.trim()) ? "" : "Informe um e-mail válido.");
  definirErro(assunto, assunto.value ? "" : "Escolha um assunto.");
  definirErro(mensagem, mensagem.value.trim().length >= 10 ? "" : "A mensagem deve ter pelo menos 10 caracteres.");

  if (formulario.querySelector('[aria-invalid="true"]')) { focarPrimeiroErro(formulario); return; }

  const mensagens = lerArmazenamento(CHAVES.mensagens, []);
  mensagens.push({ nome: nome.value.trim(), email: email.value.trim(), assunto: assunto.value, mensagem: mensagem.value.trim(), data: new Date().toISOString() });
  salvarArmazenamento(CHAVES.mensagens, mensagens);

  formulario.reset();
  const sucesso = $("#contatoSucesso");
  sucesso.textContent = "Mensagem enviada! (Demonstração: ela foi salva apenas neste navegador.)";
  sucesso.hidden = false;
}
```

**5. Como os arquivos trabalham juntos:** Cada campo tem um parágrafo de erro ligado por `aria-describedby`. `definirErro` escreve a mensagem e marca `aria-invalid`, e o CSS deixa a borda vermelha. A mensagem do contato fica salva apenas no navegador.

---

## 16. RODAPÉ

**1. Para que serve:** Links de navegação, categorias, lojas comparadas e avisos legais.

**2. HTML (estrutura)**

```html
<!-- ============================================================ -->
<!-- 12. RODAPÉ [rodape]                                           -->
<!-- ============================================================ -->
<footer class="rodape">
  <div class="container">
    <div class="rodape__grade">
      <div>
        <a href="#/home" class="logo" aria-label="GGPRICE, página inicial">
          <span class="logo__icone" aria-hidden="true">GG</span>
          <span class="logo__texto">PRICE</span>
        </a>
        <p class="rodape__texto">Plataforma de comparação de preços do universo gamer e tecnológico.</p>
      </div>
      <nav aria-label="Rodapé: navegação">
        <h2 class="rodape__titulo">Navegação</h2>
        <ul>
          <li><a href="#/home">Início</a></li>
          <li><a href="#/ofertas">Ofertas</a></li>
          <li><a href="#/categorias">Categorias</a></li>
          <li><a href="#/favoritos">Favoritos</a></li>
          <li><a href="#/alertas">Alertas de preço</a></li>
          <li><a href="#/contato">Contato</a></li>
        </ul>
      </nav>
      <nav aria-label="Rodapé: categorias">
        <h2 class="rodape__titulo">Categorias</h2>
        <ul id="rodapeCategorias"></ul>
      </nav>
      <div>
        <h2 class="rodape__titulo">Lojas comparadas</h2>
        <ul id="rodapeLojas" class="rodape__lojas"></ul>
      </div>
    </div>
    <p class="rodape__aviso">
      Projeto demonstrativo. Todos os preços, descontos e históricos são fictícios e não representam ofertas reais.
      O GGPRICE não possui vínculo com as lojas citadas.
    </p>
    <p class="rodape__copy">© <span id="anoAtual"></span> GGPRICE. Todos os direitos reservados.</p>
  </div>
</footer>
```

**3. CSS (aparência)**

```css
/* ============================================================ */
/* 12. RODAPÉ [rodape]                                           */
/* ============================================================ */
.rodape { margin-top: 3rem; background: var(--fundo-2); border-top: 1px solid var(--borda); padding: 2.5rem 0 1.5rem; }
.rodape__grade { display: grid; grid-template-columns: 1.3fr 1fr 1fr 1fr; gap: 2rem; }
.rodape__titulo { font-size: 1rem; color: var(--roxo); }
.rodape li { margin-bottom: 0.35rem; }
.rodape a { text-decoration: none; }
.rodape a:hover { text-decoration: underline; }
.rodape__texto, .rodape__lojas li { color: var(--texto-suave); font-size: 0.92rem; }
.rodape__aviso { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--borda); font-size: 0.85rem; color: var(--texto-suave); }
.rodape__copy { font-size: 0.85rem; color: var(--texto-suave); margin: 0; }

/* Avisos temporários (toasts) */
.avisos { position: fixed; right: 1rem; bottom: 1rem; z-index: 300; display: flex; flex-direction: column; gap: 0.5rem; max-width: min(380px, calc(100% - 2rem)); }
.aviso {
  padding: 0.75rem 1rem; border-radius: 12px; background: var(--card-2); color: var(--texto);
  border: 1px solid var(--borda); border-left: 4px solid var(--azul); box-shadow: var(--sombra);
  animation: entrada 0.3s ease both;
}
.aviso--sucesso { border-left-color: var(--verde); }
.aviso--erro { border-left-color: var(--vermelho); }
```

**4. JavaScript (funcionamento):** esta seção não tem trecho próprio neste arquivo.

**5. Como os arquivos trabalham juntos:** O HTML define a estrutura; o JS (`renderizarRodape`) preenche categorias, lojas e o ano; o CSS organiza em colunas que viram uma coluna só no celular.

---

## 17. RESPONSIVIDADE

**1. Para que serve:** Adapta menu, cards, tabelas e gráfico para tablets e celulares.

**2. HTML (estrutura):** esta seção não tem trecho próprio neste arquivo.

**3. CSS (aparência)**

```css
/* ============================================================ */
/* 14. RESPONSIVIDADE [responsividade]                           */
/* Tablets (até 900px) e celulares (até 600px).                  */
/* ============================================================ */
@media (max-width: 900px) {
  .botao-menu { display: inline-grid; place-items: center; }
  .ferramentas { margin-left: 0; }

  /* O menu vira uma lista que abre/fecha abaixo do cabeçalho */
  .menu {
    position: absolute; left: 0; right: 0; top: 100%;
    background: var(--fundo-2); border-bottom: 1px solid var(--borda); padding: 0.75rem 1rem;
    display: none;
  }
  .menu--aberto { display: block; }
  .menu__lista { flex-direction: column; align-items: stretch; }
  .menu a { width: 100%; }

  .carrossel__slide { grid-template-columns: 1fr; }
  .resultado { grid-template-columns: 1fr; }
  .resultado__imagem { max-width: 320px; }
  .produto__topo { grid-template-columns: 1fr; }
  .duas-colunas { grid-template-columns: 1fr; }
  .rodape__grade { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 600px) {
  .hero { padding: 2.5rem 0 2rem; }
  .busca { flex-direction: column; }
  .grade { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
  .cabecalho__interno { gap: 0.5rem; flex-wrap: wrap; padding-block: 0.5rem; }
  .rodape__grade { grid-template-columns: 1fr; }
  .carrossel__slide { padding: 1rem; }
  .card__acoes { flex-wrap: wrap; }
}

/* Respeita quem pede menos animação no sistema operacional */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
```

**4. JavaScript (funcionamento):** esta seção não tem trecho próprio neste arquivo.

**5. Como os arquivos trabalham juntos:** Só CSS: `@media (max-width: 900px)` e `600px`. A tabela de preços tem rolagem horizontal própria e o gráfico (SVG com `viewBox`) escala sozinho.

---

## 18. VARIÁVEIS DE CORES E ROTEADOR (NAVEGAÇÃO)

**1. Para que serve:** As variáveis de cor controlam a identidade visual. O roteador troca de página sem recarregar o site.

**2. HTML (estrutura):** esta seção não tem trecho próprio neste arquivo.

**3. CSS (aparência)**

```css
/* ============================================================ */
/* 2. VARIÁVEIS DE CORES [variaveis]                             */
/* Tema ESCURO (padrão). Para mudar a identidade visual do site, */
/* altere os valores abaixo.                                     */
/* ============================================================ */
:root {
  --fundo: #0b0b12;
  --fundo-2: #12121c;
  --card: #161625;
  --card-2: #1e1e33;
  --borda: #2d2d4a;
  --texto: #f4f4fb;
  --texto-suave: #b8b8d0;
  --roxo: #b57bff;          /* roxo neon: identidade principal */
  --acao: #7c3aed;          /* fundo dos botões principais */
  --acao-hover: #6d28d9;
  --azul: #38bdf8;          /* azul elétrico: destaque e interação */
  --link: #c4b5fd;
  --verde: #4ade80;         /* economia e menor preço */
  --verde-fundo: #4ade80;
  --verde-texto: #052e16;
  --vermelho: #ff8a8a;
  --foco: #38bdf8;
  --sombra: 0 10px 28px rgba(0, 0, 0, 0.45);
  --brilho: 0 0 18px rgba(168, 85, 247, 0.4);
  --raio: 16px;
}
```

**4. JavaScript (funcionamento)**

```javascript
/* ============================================================ */
/* 2. ROTEADOR (NAVEGAÇÃO ENTRE PÁGINAS) [roteador]              */
/* O site é uma "página única": cada <section class="pagina">    */
/* é mostrada ou escondida conforme o endereço (#/rota).         */
/* ============================================================ */
const PAGINAS = ["home", "resultados", "categorias", "produto", "ofertas", "favoritos", "alertas", "login", "perfil", "contato"];

const TITULOS = {
  home: "Comparador de preços gamer", resultados: "Comparar preços", categorias: "Categorias",
  produto: "Produto", ofertas: "Ofertas", favoritos: "Favoritos", alertas: "Alertas de preço",
  login: "Entrar ou cadastrar", perfil: "Meu perfil", contato: "Contato"
};

// Lê o endereço atual. Ex.: "#/resultados?q=ssd" -> { pagina: "resultados", consulta: {q: "ssd"} }
function lerRota() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [caminho, textoConsulta = ""] = hash.split("?");
  const [pagina, ...resto] = caminho.split("/");
  return { pagina: pagina || "home", parametro: resto.join("/"), consulta: new URLSearchParams(textoConsulta) };
}

// Vai para outra rota. Se já estamos nela, apenas redesenha.
function navegar(destino) {
  if (location.hash === "#" + destino) {
    renderizarRota();
  } else {
    location.hash = destino;
  }
}

// Chama a função que desenha cada página
function executarRenderizador(rota) {
  const renderizadores = {
    home: renderizarHome, resultados: renderizarResultados, categorias: renderizarCategorias,
    produto: renderizarProduto, ofertas: renderizarOfertas, favoritos: renderizarFavoritos,
    alertas: renderizarAlertas, login: renderizarLogin, perfil: renderizarPerfil, contato: () => {}
  };
  const pagina = PAGINAS.includes(rota.pagina) ? rota.pagina : "home";
  renderizadores[pagina](rota);
}

// Redesenha a página atual sem rolar a tela (usado após favoritar, etc.)
function atualizarPaginaAtual() {
  executarRenderizador(lerRota());
}

// Mostra a página correta quando o endereço muda
function renderizarRota() {
  const rota = lerRota();
  const pagina = PAGINAS.includes(rota.pagina) ? rota.pagina : "home";

  $$(".pagina").forEach((secao) => { secao.hidden = secao.id !== "pagina-" + pagina; });
  $$("[data-pagina]").forEach((link) => {
    if (link.dataset.pagina === pagina || (pagina === "perfil" && link.dataset.pagina === "login")) {
      link.setAttribute("aria-current", "page");
... (o restante desta seção continua no arquivo)
```

**5. Como os arquivos trabalham juntos:** Cada página é uma `<section class="pagina">`. Quando o endereço (`#/ofertas`) muda, `renderizarRota` mostra só a página correspondente e chama a função que a desenha.

---
