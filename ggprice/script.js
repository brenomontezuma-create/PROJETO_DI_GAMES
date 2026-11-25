"use strict";

/* ============================================================ */
/* GGPRICE — script.js                                           */
/* Depende do arquivo data.js (LOJAS, CATEGORIAS e PRODUTOS).    */
/* Tudo é salvo no navegador (localStorage): não há servidor.    */
/* ============================================================ */


/* ============================================================ */
/* 1. UTILIDADES GERAIS [utilidades]                             */
/* Funções pequenas usadas em todo o projeto.                    */
/* ============================================================ */

// Atalhos para selecionar elementos da página
const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
const $$ = (seletor, raiz = document) => Array.from(raiz.querySelectorAll(seletor));

// Nomes das "gavetas" usadas no localStorage
const CHAVES = {
  favoritos: "ggprice_favoritos",
  historico: "ggprice_historico",
  alertas: "ggprice_alertas",
  usuarios: "ggprice_usuarios",
  sessao: "ggprice_sessao",
  config: "ggprice_config",
  mensagens: "ggprice_mensagens"
};

// Lê um valor do localStorage (com proteção contra erros)
function lerArmazenamento(chave, valorPadrao) {
  try {
    const texto = localStorage.getItem(chave);
    return texto === null ? valorPadrao : JSON.parse(texto);
  } catch (erro) {
    return valorPadrao;
  }
}

// Grava um valor no localStorage
function salvarArmazenamento(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    mostrarAviso("Não foi possível salvar os dados neste navegador.", "erro");
  }
}

// Transforma 1899 em "R$ 1.899,00"
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Evita que texto digitado pelo usuário seja interpretado como HTML
function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Remove acentos e deixa minúsculo (pesquisa "memoria" acha "Memória")
function normalizarTexto(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function buscarProdutoPorId(id) { return PRODUTOS.find((p) => p.id === id); }
function buscarLoja(id) { return LOJAS.find((l) => l.id === id); }
function buscarCategoria(id) { return CATEGORIAS.find((c) => c.id === id); }

// Monta uma URL de rota: montarUrl("/resultados", {q: "ssd"}) -> "/resultados?q=ssd"
function montarUrl(caminho, parametros = {}) {
  const consulta = new URLSearchParams();
  Object.entries(parametros).forEach(([chave, valor]) => {
    if (valor) consulta.set(chave, valor);
  });
  const texto = consulta.toString();
  return texto ? `${caminho}?${texto}` : caminho;
}

// Mensagem temporária no canto da tela (também lida por leitores de tela)
function mostrarAviso(mensagem, tipo = "info") {
  const aviso = document.createElement("div");
  aviso.className = `aviso aviso--${tipo}`;
  aviso.textContent = mensagem;
  $("#avisos").appendChild(aviso);
  setTimeout(() => aviso.remove(), 4500);
}

// Preferências do usuário (tema, tamanho da fonte, ordenação padrão)
const CONFIG_PADRAO = { tema: "dark", fonte: 100, ordenacao: "menor-preco" };
function lerConfig() { return { ...CONFIG_PADRAO, ...lerArmazenamento(CHAVES.config, {}) }; }
function salvarConfig(parcial) { salvarArmazenamento(CHAVES.config, { ...lerConfig(), ...parcial }); }


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
    } else {
      link.removeAttribute("aria-current");
    }
  });

  fecharMenuMobile();
  executarRenderizador(rota);
  document.title = `${TITULOS[pagina]} — GGPRICE`;
  window.scrollTo(0, 0);
  $("#conteudo").focus({ preventScroll: true }); // leitores de tela percebem a troca de página
}

// Menu do celular
function alternarMenuMobile() {
  const botao = $("#botaoMenu");
  const aberto = $("#menuPrincipal").classList.toggle("menu--aberto");
  botao.setAttribute("aria-expanded", String(aberto));
}
function fecharMenuMobile() {
  $("#menuPrincipal").classList.remove("menu--aberto");
  $("#botaoMenu").setAttribute("aria-expanded", "false");
}


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
        <img src="${produto.imagem}" alt="Imagem ilustrativa de ${nome}" width="400" height="300" loading="lazy">
      </div>
      <div class="resultado__conteudo">
        <h2 class="resultado__titulo"><a href="#/produto/${produto.id}">${nome}</a></h2>
        <p class="card__marca">${produto.marca} · Modelo ${produto.modelo} · ${buscarCategoria(produto.categoria).nome}</p>
        <ul class="lista-specs">${produto.specs.map((s) => `<li>${escaparHtml(s)}</li>`).join("")}</ul>
        ${criarTabelaComparacao(produto)}
        <p class="diferenca" style="margin-top:.75rem">
          Diferença entre a loja mais cara e a mais barata: <strong>${formatarPreco(economia)}</strong>.
        </p>
        <div class="card__acoes" style="max-width:380px">
          <a class="botao botao--primario" href="#/produto/${produto.id}">Ver página do produto</a>
          ${criarBotaoFavorito(produto, false)}
        </div>
      </div>
    </article>`;
}


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
       </div>`;
}


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

  definirErro(campoProduto, produto ? "" : "Escolha um produto.");
  if (produto) {
    if (Number.isNaN(preco) || preco <= 0) {
      definirErro(campoPreco, "Informe um preço desejado maior que zero.");
    } else if (preco >= produto.menorPreco) {
      definirErro(campoPreco, `O preço desejado deve ser menor que o preço atual (${formatarPreco(produto.menorPreco)}).`);
    }
  }
  if (formulario.querySelector('[aria-invalid="true"]')) { focarPrimeiroErro(formulario); return; }

  const alertas = lerAlertas();
  alertas.push({ id: "a" + Date.now(), produtoId: produto.id, precoDesejado: preco, criadoEm: new Date().toISOString() });
  salvarArmazenamento(CHAVES.alertas, alertas);
  campoPreco.value = "";
  mostrarAviso(`Alerta criado! Você seria avisado quando ${produto.nome} chegar a ${formatarPreco(preco)}.`, "sucesso");
  renderizarAlertas(lerRota());
}

// Demonstração: finge que o preço caiu até o valor desejado
function simularQuedaDePreco(idAlerta) {
  const alertas = lerAlertas();
  const alerta = alertas.find((a) => a.id === idAlerta);
  if (!alerta) return;
  alerta.precoSimulado = alerta.precoDesejado;
  salvarArmazenamento(CHAVES.alertas, alertas);
  const produto = buscarProdutoPorId(alerta.produtoId);
  mostrarAviso(`🔔 (simulação) ${produto.nome} chegou a ${formatarPreco(alerta.precoDesejado)}!`, "sucesso");
  atualizarPaginaAtual();
}

function removerAlerta(idAlerta) {
  salvarArmazenamento(CHAVES.alertas, lerAlertas().filter((a) => a.id !== idAlerta));
  mostrarAviso("Alerta removido.");
  atualizarPaginaAtual();
}


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

  const campoEmail = $("#entrarEmail"), campoSenha = $("#entrarSenha");
  const email = campoEmail.value.trim().toLowerCase();

  if (!emailValido(email)) definirErro(campoEmail, "Informe um e-mail válido.");
  definirErro(campoSenha, campoSenha.value ? "" : "Informe sua senha.");
  if (formulario.querySelector('[aria-invalid="true"]')) { focarPrimeiroErro(formulario); return; }

  const usuario = lerUsuarios().find((u) => u.email === email && u.senhaHash === gerarHashDemonstrativo(campoSenha.value));
  if (!usuario) {
    definirErro(campoSenha, "E-mail ou senha incorretos.");
    campoSenha.focus();
    return;
  }
  salvarArmazenamento(CHAVES.sessao, { nome: usuario.nome, email: usuario.email });
  formulario.reset();
  atualizarMenuConta();
  mostrarAviso(`Olá, ${usuario.nome}!`, "sucesso");
  navegar("/perfil");
}

function recuperarSenha(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  limparErros(formulario);
  const campo = $("#recEmail");
  if (!emailValido(campo.value.trim())) { definirErro(campo, "Informe um e-mail válido."); campo.focus(); return; }
  mostrarAviso("Demonstração: nenhum e-mail é enviado de verdade. Em um site real, você receberia um link de redefinição.", "sucesso");
  formulario.reset();
}

function sairDaConta() {
  localStorage.removeItem(CHAVES.sessao);
  atualizarMenuConta();
  mostrarAviso("Você saiu da conta.");
  navegar("/home");
}

// Troca "Entrar" por "Olá, Nome" no menu
function atualizarMenuConta() {
  const sessao = lerSessao();
  const link = $("#linkConta");
  link.textContent = sessao ? `Olá, ${sessao.nome.split(" ")[0]}` : "Entrar";
  link.setAttribute("href", sessao ? "#/perfil" : "#/login");
}

// Alterna entre as abas Entrar / Cadastrar / Recuperar
function mostrarAba(nome) {
  ["entrar", "cadastrar", "recuperar"].forEach((aba) => { $(`#painel-${aba}`).hidden = aba !== nome; });
  ["entrar", "cadastrar"].forEach((aba) => {
    const botao = $(`#aba-${aba}`);
    botao.setAttribute("aria-selected", String(aba === nome));
    botao.tabIndex = aba === nome ? 0 : -1;
  });
}

function renderizarLogin(rota) {
  mostrarAba(rota.consulta.get("aba") || "entrar");
}

function renderizarPerfil() {
  const sessao = lerSessao();
  const alvo = $("#conteudoPerfil");

  if (!sessao) {
    alvo.innerHTML = `
      <div class="vazio" style="margin-top:2rem">
        <h1 class="pagina__titulo" style="margin-top:0">Meu perfil</h1>
        <p>Entre na sua conta para ver seu perfil.</p>
        <a class="botao botao--primario" href="#/login">Entrar ou cadastrar</a>
      </div>`;
    return;
  }

  const usuario = lerUsuarios().find((u) => u.email === sessao.email);
  const desde = usuario ? new Date(usuario.criadoEm).toLocaleDateString("pt-BR") : "—";
  const config = lerConfig();
  const favoritos = lerFavoritos().map(buscarProdutoPorId).filter(Boolean);
  const historico = lerHistorico();

  alvo.innerHTML = `
    <div class="perfil__cabecalho">
      <div class="perfil__avatar" aria-hidden="true">${escaparHtml(sessao.nome.charAt(0).toUpperCase())}</div>
      <div>
        <h1 class="pagina__titulo" style="margin:0">${escaparHtml(sessao.nome)}</h1>
        <p class="secao__texto" style="margin:0">${escaparHtml(sessao.email)} · Membro desde ${desde}</p>
      </div>
      <button type="button" class="botao" data-sair style="margin-left:auto">Sair da conta</button>
    </div>

    <section class="bloco" aria-labelledby="tPerfFav">
      <h2 id="tPerfFav">Produtos favoritos</h2>
      ${favoritos.length ? `<div class="grade">${criarGradeProdutos(favoritos)}</div>` : '<div class="vazio"><p>Nenhum favorito ainda.</p></div>'}
    </section>

    <section class="bloco" aria-labelledby="tPerfAlertas">
      <h2 id="tPerfAlertas">Alertas de preço cadastrados</h2>
      ${criarListaAlertas(lerAlertas(), true)}
    </section>

    <section class="bloco" aria-labelledby="tPerfHist">
      <h2 id="tPerfHist">Histórico de pesquisas</h2>
      ${historico.length
        ? `<ul class="recentes__lista" style="justify-content:flex-start">${criarChipsHistorico()}</ul>
           <p><button type="button" class="botao-link" data-limpar-historico>Limpar histórico</button></p>`
        : '<div class="vazio"><p>Você ainda não pesquisou nada.</p></div>'}
    </section>

    <section class="bloco" aria-labelledby="tPerfPref">
      <h2 id="tPerfPref">Preferências</h2>
      <div class="preferencias cartao">
        <div class="campo">
          <label for="prefTema">Tema</label>
          <select id="prefTema" data-preferencia="tema">
            <option value="dark" ${config.tema === "dark" ? "selected" : ""}>Escuro</option>
            <option value="light" ${config.tema === "light" ? "selected" : ""}>Claro</option>
          </select>
        </div>
        <div class="campo">
          <label for="prefFonte">Tamanho da fonte</label>
          <select id="prefFonte" data-preferencia="fonte">
            ${TAMANHOS_FONTE.map((t) => `<option value="${t}" ${config.fonte === t ? "selected" : ""}>${t}%</option>`).join("")}
          </select>
        </div>
        <div class="campo">
          <label for="prefOrdenacao">Ordenação padrão dos resultados</label>
          <select id="prefOrdenacao" data-preferencia="ordenacao">
            <option value="menor-preco" ${config.ordenacao === "menor-preco" ? "selected" : ""}>Menor preço</option>
            <option value="maior-economia" ${config.ordenacao === "maior-economia" ? "selected" : ""}>Maior economia entre lojas</option>
            <option value="nome" ${config.ordenacao === "nome" ? "selected" : ""}>Nome (A–Z)</option>
          </select>
        </div>
      </div>
    </section>`;
}

function salvarPreferencia(campo) {
  const tipo = campo.dataset.preferencia;
  if (tipo === "tema") aplicarTema(campo.value);
  if (tipo === "fonte") aplicarTamanhoFonte(parseFloat(campo.value));
  if (tipo === "ordenacao") salvarConfig({ ordenacao: campo.value });
  mostrarAviso("Preferência salva.", "sucesso");
}


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
  botao.textContent = carrossel.pausado ? "▶" : "❚❚";
  botao.setAttribute("aria-label", carrossel.pausado ? "Retomar rotação automática" : "Pausar rotação automática");
  carrossel.pausado ? pararRotacaoAutomatica() : iniciarRotacaoAutomatica();
}

function iniciarCarrossel() {
  const destaques = PRODUTOS.filter((p) => p.destaque);
  carrossel.total = destaques.length;
  $("#carrosselTrilho").innerHTML = destaques.map((p, i) => criarSlideCarrossel(p, i, destaques.length)).join("");
  $("#carrosselPontos").innerHTML = destaques
    .map((_, i) => `<button type="button" class="carrossel__ponto" data-slide="${i}" aria-label="Ir para o destaque ${i + 1}"></button>`)
    .join("");

  $("#carrosselAnterior").addEventListener("click", () => { mostrarSlide(carrossel.indice - 1); iniciarRotacaoAutomatica(); });
  $("#carrosselProximo").addEventListener("click", () => { mostrarSlide(carrossel.indice + 1); iniciarRotacaoAutomatica(); });
  $("#carrosselPausa").addEventListener("click", alternarPausaCarrossel);
  $("#carrosselPontos").addEventListener("click", (e) => {
    const ponto = e.target.closest("[data-slide]");
    if (ponto) { mostrarSlide(Number(ponto.dataset.slide)); iniciarRotacaoAutomatica(); }
  });

  // Pausa enquanto o mouse está em cima ou o foco está dentro do carrossel
  const area = $("#carrossel");
  area.addEventListener("mouseenter", pararRotacaoAutomatica);
  area.addEventListener("mouseleave", iniciarRotacaoAutomatica);
  area.addEventListener("focusin", pararRotacaoAutomatica);
  area.addEventListener("focusout", iniciarRotacaoAutomatica);
  area.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") mostrarSlide(carrossel.indice - 1);
    if (e.key === "ArrowRight") mostrarSlide(carrossel.indice + 1);
  });

  // Quem prefere menos animação começa com o carrossel pausado
  carrossel.pausado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (carrossel.pausado) {
    $("#carrosselPausa").textContent = "▶";
    $("#carrosselPausa").setAttribute("aria-label", "Retomar rotação automática");
  }
  mostrarSlide(0);
  iniciarRotacaoAutomatica();
}


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
  const posY = (valor) => margem.topo + ((maximo - valor) / (maximo - minimo)) * alturaUtil;

  const caminho = pontos.map((p, i) => `${i ? "L" : "M"}${posX(i).toFixed(1)} ${posY(p.valor).toFixed(1)}`).join(" ");
  const fundoY = margem.topo + alturaUtil;
  const area = `${caminho} L${posX(pontos.length - 1).toFixed(1)} ${fundoY} L${posX(0).toFixed(1)} ${fundoY} Z`;

  let grade = "";
  for (let k = 0; k < 4; k++) {
    const valor = maximo - (k * (maximo - minimo)) / 3;
    const y = posY(valor).toFixed(1);
    grade += `<line class="grafico__grade" x1="${margem.esq}" x2="${largura - margem.dir}" y1="${y}" y2="${y}"/>` +
             `<text class="grafico__texto" x="${margem.esq - 8}" y="${Number(y) + 4}" text-anchor="end">${formatarPreco(valor)}</text>`;
  }

  const menor = Math.min(...valores), maior = Math.max(...valores);
  const media = valores.reduce((soma, v) => soma + v, 0) / valores.length;
  const variacao = ((valores[valores.length - 1] - valores[0]) / valores[0]) * 100;
  const descricao = `Gráfico de linha do histórico de preços (dados fictícios). Menor valor ${formatarPreco(menor)}, maior valor ${formatarPreco(maior)}.`;

  container.innerHTML = `
    <svg class="grafico__svg" viewBox="0 0 ${largura} ${altura}" role="img" aria-label="${descricao}">
      <defs>
        <linearGradient id="gradienteGrafico" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="var(--roxo)" stop-opacity="0.35"/>
          <stop offset="1" stop-color="var(--roxo)" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${grade}
      <path class="grafico__area" d="${area}"/>
      <path class="grafico__linha" d="${caminho}"/>
      <text class="grafico__texto" x="${margem.esq}" y="${altura - 8}">${formatarDataCurta(pontos[0].data)}</text>
      <text class="grafico__texto" x="${largura - margem.dir}" y="${altura - 8}" text-anchor="end">${formatarDataCurta(pontos[pontos.length - 1].data)}</text>
      <g class="grafico__interativo" style="visibility:hidden">
        <line class="grafico__guia" id="graficoGuia" y1="${margem.topo}" y2="${fundoY}"/>
        <circle class="grafico__ponto" id="graficoPonto" r="5"/>
        <g id="graficoDica">
          <rect class="grafico__dica-fundo" id="graficoDicaFundo" height="24" rx="6"/>
          <text class="grafico__dica-texto" id="graficoDicaTexto" x="8" y="16"></text>
        </g>
      </g>
    </svg>
    <dl class="grafico__resumo">
      <div><dt>Menor preço no período</dt><dd>${formatarPreco(menor)}</dd></div>
      <div><dt>Maior preço no período</dt><dd>${formatarPreco(maior)}</dd></div>
      <div><dt>Preço médio</dt><dd>${formatarPreco(media)}</dd></div>
      <div><dt>Variação no período</dt><dd>${variacao >= 0 ? "+" : ""}${variacao.toFixed(1).replace(".", ",")}%</dd></div>
    </dl>
    <p class="grafico__nota">Histórico <strong>demonstrativo</strong>: dados fictícios gerados pelo site. Passe o mouse (ou toque) no gráfico para ver os valores.</p>`;

  // Interação: mostra o valor do ponto mais próximo do mouse/dedo
  const svg = $(".grafico__svg", container);
  const camada = $(".grafico__interativo", svg);
  const mostrarPonto = (evento) => {
    const caixa = svg.getBoundingClientRect();
    const x = ((evento.clientX - caixa.left) / caixa.width) * largura;
    let i = Math.round(((x - margem.esq) / larguraUtil) * (pontos.length - 1));
    i = Math.min(Math.max(i, 0), pontos.length - 1);

    const cx = posX(i), cy = posY(pontos[i].valor);
    $("#graficoGuia", svg).setAttribute("x1", cx);
    $("#graficoGuia", svg).setAttribute("x2", cx);
    $("#graficoPonto", svg).setAttribute("cx", cx);
    $("#graficoPonto", svg).setAttribute("cy", cy);

    const texto = $("#graficoDicaTexto", svg);
    texto.textContent = `${formatarDataCurta(pontos[i].data)} · ${formatarPreco(pontos[i].valor)}`;
    const larguraDica = texto.getComputedTextLength() + 16;
    $("#graficoDicaFundo", svg).setAttribute("width", larguraDica);
    const dicaX = Math.min(Math.max(cx - larguraDica / 2, margem.esq), largura - margem.dir - larguraDica);
    $("#graficoDica", svg).setAttribute("transform", `translate(${dicaX} 2)`);
    camada.style.visibility = "visible";
  };
  svg.addEventListener("pointermove", mostrarPonto);
  svg.addEventListener("pointerdown", mostrarPonto);
  svg.addEventListener("pointerleave", () => { camada.style.visibility = "hidden"; });
}

// Desenha o gráfico da página do produto para o período escolhido
function mostrarGraficoDoProduto(produto, dias) {
  const pontos = gerarHistoricoPreco(produto).slice(-dias);
  desenharGrafico($("#areaGrafico"), pontos);
  $$("[data-periodo]").forEach((botao) => {
    botao.setAttribute("aria-pressed", String(Number(botao.dataset.periodo) === dias));
  });
}


/* ============================================================ */
/* 17. RENDERIZAÇÃO DAS PÁGINAS [paginas]                        */
/* Cada função abaixo "desenha" o conteúdo de uma página.        */
/* ============================================================ */

function renderizarHome() {
  renderizarPesquisasRecentes();
  atualizarBotoesFavorito();
}

// Home: as vitrines são fixas, então são montadas uma única vez
function montarVitrinesDaHome() {
  $("#gradeCategoriasHome").innerHTML = CATEGORIAS.map((c) => criarCardCategoria(c)).join("");
  $("#gradePopulares").innerHTML = criarGradeProdutos(PRODUTOS.filter((p) => p.popular).slice(0, 8));
  $("#gradeMelhoresOfertas").innerHTML = criarGradeProdutos(ordenarProdutos(PRODUTOS, "maior-economia").slice(0, 4));
  $("#gradeMaioresDescontos").innerHTML = criarGradeProdutos(ordenarProdutos(PRODUTOS, "maior-desconto").slice(0, 4));
  $("#gradeLancamentos").innerHTML = criarGradeProdutos(PRODUTOS.filter((p) => p.lancamento));
}

function renderizarResultados(rota) {
  const termo = (rota.consulta.get("q") || "").trim();
  const categoria = rota.consulta.get("cat") || "";
  const ordem = rota.consulta.get("ordem") || lerConfig().ordenacao;

  $("#campoPesquisaResultados").value = termo;
  preencherSelectCategorias($("#filtroCategoriaResultados"), categoria);
  $("#ordemResultados").value = ordem;

  const lista = ordenarProdutos(buscarProdutos(termo, categoria), ordem);
  $("#resumoResultados").textContent = termo
    ? `${lista.length} ${lista.length === 1 ? "produto encontrado" : "produtos encontrados"} para "${termo}".`
    : `${lista.length} produtos listados.`;

  if (lista.length) {
    $("#listaResultados").innerHTML = lista.map(criarResultadoComparacao).join("");
  } else {
    $("#listaResultados").innerHTML = `
      <div class="vazio">
        <p>Nenhum produto encontrado. Tente outro nome, marca ou modelo.</p>
      </div>
      <h2 class="secao__titulo">Produtos populares</h2>
      <div class="grade">${criarGradeProdutos(PRODUTOS.filter((p) => p.popular).slice(0, 4))}</div>`;
  }
}

function renderizarCategorias(rota) {
  const escolhida = rota.consulta.get("cat") || "";
  $("#gradeCategorias").innerHTML = CATEGORIAS.map((c) => criarCardCategoria(c, c.id === escolhida)).join("");

  const categoriasExibidas = escolhida ? CATEGORIAS.filter((c) => c.id === escolhida) : CATEGORIAS;
  $("#conteudoCategorias").innerHTML =
    (escolhida ? `<p style="margin-top:1.5rem"><a href="#/categorias">← Ver todas as categorias</a></p>` : "") +
    categoriasExibidas.map((categoria) => `
      <section class="bloco-categoria" aria-labelledby="cat-${categoria.id}">
        <h2 class="secao__titulo" id="cat-${categoria.id}">${categoria.icone} ${categoria.nome}</h2>
        <div class="grade">${criarGradeProdutos(PRODUTOS.filter((p) => p.categoria === categoria.id))}</div>
      </section>`).join("");
}

function renderizarProduto(rota) {
  const produto = buscarProdutoPorId(rota.parametro);
  const alvo = $("#conteudoProduto");

  if (!produto) {
    alvo.innerHTML = `
      <div class="vazio" style="margin-top:2rem">
        <h1>Produto não encontrado</h1>
        <p>O endereço pode estar incorreto.</p>
        <a class="botao botao--primario" href="#/home">Voltar ao início</a>
      </div>`;
    return;
  }

  const categoria = buscarCategoria(produto.categoria);
  const menor = identificarMenorOferta(produto);
  const lojaMenor = buscarLoja(menor.lojaId);
  const nome = escaparHtml(produto.nome);
  const similares = PRODUTOS.filter((p) => p.categoria === produto.categoria && p.id !== produto.id).slice(0, 4);

  alvo.innerHTML = `
    <nav class="migalhas" aria-label="Você está aqui">
      <a href="#/home">Início</a> / <a href="#/categorias?cat=${categoria.id}">${categoria.nome}</a> / <span aria-current="page">${nome}</span>
    </nav>

    <div class="produto__topo">
      <div class="produto__imagem">
        <img src="${produto.imagem}" alt="Imagem ilustrativa de ${nome}" width="400" height="300">
      </div>
      <div class="produto__info">
        <p class="card__categoria">${categoria.nome}</p>
        <h1>${nome}</h1>
        <p class="card__marca">${produto.marca} · Modelo ${produto.modelo}</p>
        <p>${nome} é um produto da marca ${produto.marca} (modelo ${produto.modelo}) na categoria ${categoria.nome}.
           Compare abaixo os preços em ${produto.precos.length} lojas e acompanhe o histórico de preços.</p>

        <div class="destaque-preco">
          <p class="destaque-preco__rotulo">Menor preço encontrado (dado fictício)</p>
          <p class="destaque-preco__valor">${formatarPreco(menor.preco)}</p>
          <p style="margin:0">Na <strong>${lojaMenor.nome}</strong> ·
             <span class="selo selo--desconto">-${produto.descontoPercentual}%</span> sobre ${formatarPreco(produto.precoAnterior)} (preço anterior fictício)</p>
        </div>

        <div class="produto__botoes">
          ${criarBotaoFavorito(produto, true)}
          <a class="botao" href="#/alertas?produto=${produto.id}">🔔 Criar alerta de preço</a>
          <a class="botao botao--primario" href="${lojaMenor.url}" target="_blank" rel="noopener noreferrer">
            Ir para a ${lojaMenor.nome}<span class="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
      </div>
    </div>

    <section class="bloco" aria-labelledby="tCarac">
      <h2 id="tCarac">Características técnicas</h2>
      <dl class="dados-produto">
        <div><dt>Marca</dt><dd>${produto.marca}</dd></div>
        <div><dt>Modelo</dt><dd>${produto.modelo}</dd></div>
        <div><dt>Categoria</dt><dd>${categoria.nome}</dd></div>
      </dl>
      <ul class="lista-caracteristicas">${produto.specs.map((s) => `<li>${escaparHtml(s)}</li>`).join("")}</ul>
    </section>

    <section class="bloco" aria-labelledby="tComparacao">
      <h2 id="tComparacao">Comparação de preços</h2>
      ${criarTabelaComparacao(produto)}
    </section>

    <section class="bloco" aria-labelledby="tHistorico">
      <h2 id="tHistorico">Histórico de preços</h2>
      <div class="grafico">
        <div class="periodos" role="group" aria-label="Período do gráfico">
          ${PERIODOS_GRAFICO.map((p) => `<button type="button" class="botao" data-periodo="${p.dias}" aria-pressed="false">${p.rotulo}</button>`).join("")}
        </div>
        <div id="areaGrafico"></div>
      </div>
    </section>

    <section class="bloco" aria-labelledby="tSimilares">
      <h2 id="tSimilares">Produtos semelhantes</h2>
      <div class="grade">${criarGradeProdutos(similares)}</div>
    </section>`;

  alvo.dataset.produto = produto.id;
  mostrarGraficoDoProduto(produto, 30);
}

function renderizarOfertas(rota) {
  const categoria = rota.consulta.get("cat") || "";
  const ordem = rota.consulta.get("ordem") || "maior-desconto";

  preencherSelectCategorias($("#filtroCategoriaOfertas"), categoria);
  $("#ordemOfertas").value = ordem;

  const lista = ordenarProdutos(PRODUTOS.filter((p) => !categoria || p.categoria === categoria), ordem);
  $("#resumoOfertas").textContent = `${lista.length} ${lista.length === 1 ? "oferta" : "ofertas"} (dados demonstrativos).`;
  $("#gradeOfertas").innerHTML = criarGradeProdutos(lista);
}

function renderizarAlertas(rota) {
  const seletor = $("#alertaProduto");
  const preSelecionado = rota.consulta.get("produto") || seletor.value;
  seletor.innerHTML =
    `<option value="">Selecione um produto...</option>` +
    PRODUTOS.map((p) => `<option value="${p.id}">${escaparHtml(p.nome)}</option>`).join("");
  if (preSelecionado && buscarProdutoPorId(preSelecionado)) seletor.value = preSelecionado;

  atualizarPrecoAtualDoFormulario();
  $("#listaAlertas").innerHTML = criarListaAlertas(lerAlertas(), true);
}

function renderizarRodape() {
  $("#rodapeCategorias").innerHTML = CATEGORIAS.slice(0, 6)
    .map((c) => `<li><a href="#/categorias?cat=${c.id}">${c.nome}</a></li>`).join("");
  $("#rodapeLojas").innerHTML = LOJAS.map((l) => `<li>${l.nome}</li>`).join("");
  $("#anoAtual").textContent = new Date().getFullYear();
}


/* ============================================================ */
/* 18. EVENTOS GLOBAIS E INICIALIZAÇÃO [inicializacao]           */
/* Aqui ligamos cada botão/formulário à sua função.              */
/* ============================================================ */
function registrarEventos() {
  // Menu e acessibilidade
  $("#botaoMenu").addEventListener("click", alternarMenuMobile);
  $("#botaoTema").addEventListener("click", alternarTema);
  $("#botaoFonteMenos").addEventListener("click", () => mudarTamanhoFonte(-1));
  $("#botaoFonteMais").addEventListener("click", () => mudarTamanhoFonte(1));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharMenuMobile(); });

  // Pesquisa (todos os formulários com o atributo data-pesquisa)
  $$("form[data-pesquisa]").forEach((f) => f.addEventListener("submit", tratarEnvioPesquisa));

  // Filtros
  $("#filtroCategoriaResultados").addEventListener("change", aplicarFiltrosResultados);
  $("#ordemResultados").addEventListener("change", aplicarFiltrosResultados);
  $("#filtroCategoriaOfertas").addEventListener("change", aplicarFiltrosOfertas);
  $("#ordemOfertas").addEventListener("change", aplicarFiltrosOfertas);

  // Formulários
  $("#formAlerta").addEventListener("submit", criarAlerta);
  $("#alertaProduto").addEventListener("change", atualizarPrecoAtualDoFormulario);
  $("#formEntrar").addEventListener("submit", entrarNaConta);
  $("#formCadastro").addEventListener("submit", cadastrarUsuario);
  $("#formRecuperar").addEventListener("submit", recuperarSenha);
  $("#formContato").addEventListener("submit", enviarContato);

  // Cliques em elementos criados dinamicamente (delegação de eventos):
  // um único "ouvinte" no document reconhece botões pelo atributo data-*.
  document.addEventListener("click", (e) => {
    const favorito = e.target.closest("[data-favorito]");
    if (favorito) return alternarFavorito(favorito.dataset.favorito);

    const periodo = e.target.closest("[data-periodo]");
    if (periodo) return mostrarGraficoDoProduto(buscarProdutoPorId($("#conteudoProduto").dataset.produto), Number(periodo.dataset.periodo));

    const simular = e.target.closest("[data-simular-alerta]");
    if (simular) return simularQuedaDePreco(simular.dataset.simularAlerta);

    const remover = e.target.closest("[data-remover-alerta]");
    if (remover) return removerAlerta(remover.dataset.removerAlerta);

    if (e.target.closest("[data-limpar-historico]")) return limparHistorico();
    if (e.target.closest("[data-sair]")) return sairDaConta();

    const aba = e.target.closest("[data-aba]");
    if (aba) return mostrarAba(aba.dataset.aba);
  });

  // Setas esquerda/direita trocam entre as abas Entrar e Cadastrar
  $(".abas").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const destino = e.target.dataset.aba === "entrar" ? "cadastrar" : "entrar";
    mostrarAba(destino);
    $(`#aba-${destino}`).focus();
  });

  document.addEventListener("change", (e) => {
    const preferencia = e.target.closest("[data-preferencia]");
    if (preferencia) salvarPreferencia(preferencia);
  });

  window.addEventListener("hashchange", renderizarRota);
}

function inicializar() {
  const config = lerConfig();
  aplicarTema(config.tema);
  aplicarTamanhoFonte(TAMANHOS_FONTE.includes(config.fonte) ? config.fonte : 100);

  preencherSugestoes();
  montarVitrinesDaHome();
  iniciarCarrossel();
  renderizarRodape();
  atualizarMenuConta();
  atualizarBotoesFavorito();
  registrarEventos();
  renderizarRota();
}

document.addEventListener("DOMContentLoaded", inicializar);
