/* ============================================================ */
/* DADOS DO GGPRICE                                              */
/* ------------------------------------------------------------ */
/* Lojas, categorias e produtos exibidos no site.                */
/* Fotos: salve em fotos/<id do produto>.jpg (ou .png / .webp).  */
/* ============================================================ */


/* ============================================================ */
/* 1. LOJAS                                                      */
/* Os links apontam para a página inicial de cada loja.          */
/* ============================================================ */
const LOJAS = [
  { id: "kabum",        nome: "KaBuM!",         url: "https://www.kabum.com.br" },
  { id: "amazon",       nome: "Amazon",         url: "https://www.amazon.com.br" },
  { id: "mercadolivre", nome: "Mercado Livre",  url: "https://www.mercadolivre.com.br" },
  { id: "pichau",       nome: "Pichau",         url: "https://www.pichau.com.br" },
  { id: "terabyte",     nome: "TerabyteShop",   url: "https://www.terabyteshop.com.br" },
  { id: "magalu",       nome: "Magazine Luiza", url: "https://www.magazineluiza.com.br" },
  { id: "gkinfostore",  nome: "GK Infostore",   url: "https://www.gkinfostore.com.br" }
];


/* ============================================================ */
/* 2. CATEGORIAS                                                 */
/* ============================================================ */
const CATEGORIAS = [
  { id: "consoles",        nome: "Consoles",              icone: "🕹️" },
  { id: "jogos",           nome: "Jogos",                 icone: "💿" },
  { id: "placas-de-video", nome: "Placas de vídeo",       icone: "🎛️" },
  { id: "processadores",   nome: "Processadores",         icone: "🧠" },
  { id: "memorias-ram",    nome: "Memórias RAM",          icone: "💾" },
  { id: "ssds",            nome: "SSDs e armazenamento",  icone: "💽" },
  { id: "monitores",       nome: "Monitores",             icone: "🖥️" },
  { id: "teclados",        nome: "Teclados",              icone: "⌨️" },
  { id: "mouses",          nome: "Mouses",                icone: "🖱️" },
  { id: "headsets",        nome: "Headsets",              icone: "🎧" },
  { id: "controles",       nome: "Controles",             icone: "🎮" },
  { id: "acessorios",      nome: "Acessórios gamer",      icone: "🪑" }
];


/* ============================================================ */
/* 3. PRODUTOS BASE                                              */
/* preco     = menor preço do produto                            */
/* desconto  = % de desconto sobre o "preço anterior"            */
/* precos    = (opcional) preços fixos por loja                  */
/* ============================================================ */
const PRODUTOS_BASE = [
  // ---- Consoles ----
  { id: "ps5-slim-digital", nome: "Console PlayStation 5 Slim Edição Digital 1TB", marca: "Sony", modelo: "CFI-2000", categoria: "consoles", preco: 3399.00, desconto: 9, popular: true, destaque: true,
    specs: ["SSD de 1TB", "Sem leitor de disco", "Saída 4K até 120 fps", "Controle DualSense incluso"] },
  { id: "xbox-series-s", nome: "Console Xbox Series S 512GB", marca: "Microsoft", modelo: "Series S", categoria: "consoles", preco: 2299.00, desconto: 11, popular: true,
    specs: ["SSD de 512GB", "Jogos em 1440p", "Até 120 fps", "Compacto e silencioso"] },
  { id: "switch-oled", nome: "Console Nintendo Switch OLED 64GB", marca: "Nintendo", modelo: "HEG-001", categoria: "consoles", preco: 2399.00, desconto: 7,
    specs: ["Tela OLED de 7 polegadas", "64GB de armazenamento", "Modo portátil e TV", "Base com porta LAN"] },

  // ---- Jogos ----
  { id: "god-of-war-ragnarok", nome: "God of War Ragnarök - PS5", marca: "Sony", modelo: "Mídia física", categoria: "jogos", preco: 199.90, desconto: 18, popular: true,
    specs: ["Plataforma PlayStation 5", "Ação e aventura", "Legendado em português", "Mídia física"] },
  { id: "elden-ring-ps5", nome: "Elden Ring - PS5", marca: "Bandai Namco", modelo: "Mídia física", categoria: "jogos", preco: 169.90, desconto: 22,
    specs: ["Plataforma PlayStation 5", "RPG de ação", "Mundo aberto", "Mídia física"] },
  { id: "last-of-us-2", nome: "The Last of Us Part II Remastered - PS5", marca: "Sony", modelo: "Mídia física", categoria: "jogos", preco: 149.90, desconto: 15,
    specs: ["Plataforma PlayStation 5", "Ação e sobrevivência", "Modo sem retorno", "Mídia física"] },

  // ---- Placas de vídeo ----
  { id: "rtx-4060", nome: "Placa de Vídeo NVIDIA GeForce RTX 4060 8GB GDDR6", marca: "NVIDIA", modelo: "RTX 4060", categoria: "placas-de-video", preco: 1899.00, desconto: 14, popular: true, destaque: true,
    specs: ["8GB GDDR6", "DLSS 3 e Ray Tracing", "Barramento 128 bits", "Consumo aproximado de 115W"] },
  { id: "rx-7600", nome: "Placa de Vídeo AMD Radeon RX 7600 8GB", marca: "AMD", modelo: "RX 7600", categoria: "placas-de-video", preco: 1549.00, desconto: 12,
    specs: ["8GB GDDR6", "Arquitetura RDNA 3", "Ótima para 1080p", "FSR 3 compatível"] },
  { id: "rtx-4070-super", nome: "Placa de Vídeo NVIDIA GeForce RTX 4070 SUPER 12GB", marca: "NVIDIA", modelo: "RTX 4070 SUPER", categoria: "placas-de-video", preco: 4299.00, desconto: 8, lancamento: true,
    specs: ["12GB GDDR6X", "DLSS 3", "Ideal para 1440p", "Barramento 192 bits"] },

  // ---- Processadores ----
  { id: "ryzen-5-5600", nome: "Processador AMD Ryzen 5 5600 3.5GHz (4.4GHz Turbo) AM4", marca: "AMD", modelo: "Ryzen 5 5600", categoria: "processadores", preco: 749.00, desconto: 16, popular: true,
    specs: ["6 núcleos e 12 threads", "Soquete AM4", "Cooler incluso", "Cache de 35MB"] },
  { id: "ryzen-7-7800x3d", nome: "Processador AMD Ryzen 7 7800X3D 4.2GHz AM5", marca: "AMD", modelo: "Ryzen 7 7800X3D", categoria: "processadores", preco: 2399.00, desconto: 10, destaque: true,
    specs: ["8 núcleos e 16 threads", "Soquete AM5", "Tecnologia 3D V-Cache", "Sem cooler incluso"] },
  { id: "i5-12400f", nome: "Processador Intel Core i5-12400F 2.5GHz LGA1700", marca: "Intel", modelo: "Core i5-12400F", categoria: "processadores", preco: 679.00, desconto: 13,
    specs: ["6 núcleos e 12 threads", "Soquete LGA1700", "Cooler incluso", "Sem vídeo integrado"] },

  // ---- Memórias RAM ----
  { id: "kingston-fury-16-ddr4", nome: "Memória RAM Kingston Fury Beast 16GB 3200MHz DDR4", marca: "Kingston", modelo: "KF432C16BB/16", categoria: "memorias-ram", preco: 229.00, desconto: 19, popular: true,
    specs: ["16GB (1x16GB)", "DDR4 3200MHz", "Latência CL16", "Perfil XMP"] },
  { id: "corsair-vengeance-32-ddr5", nome: "Memória RAM Corsair Vengeance 32GB (2x16GB) 6000MHz DDR5", marca: "Corsair", modelo: "CMK32GX5M2B6000C30", categoria: "memorias-ram", preco: 699.00, desconto: 12, lancamento: true,
    specs: ["32GB (2x16GB)", "DDR5 6000MHz", "Latência CL30", "Perfil EXPO/XMP"] },

  // ---- SSDs ----
  { id: "kingston-nv2-1tb", nome: "SSD Kingston NV2 1TB M.2 NVMe", marca: "Kingston", modelo: "SNV2S/1000G", categoria: "ssds", preco: 389.00, desconto: 20, popular: true,
    specs: ["1TB", "NVMe PCIe 4.0", "Leitura até 3.500 MB/s", "Formato M.2 2280"] },
  { id: "wd-black-sn850x-1tb", nome: "SSD WD Black SN850X 1TB M.2 NVMe", marca: "Western Digital", modelo: "WDS100T2X0E", categoria: "ssds", preco: 749.00, desconto: 11,
    specs: ["1TB", "NVMe PCIe 4.0", "Leitura até 7.300 MB/s", "Voltado para jogos"] },

  // ---- Monitores ----
  { id: "lg-ultragear-27", nome: "Monitor Gamer LG UltraGear 27'' Full HD 165Hz IPS", marca: "LG", modelo: "27GS60F", categoria: "monitores", preco: 1199.00, desconto: 17, popular: true,
    specs: ["27 polegadas", "Full HD (1920x1080)", "165Hz e 1ms", "Painel IPS"] },
  { id: "samsung-odyssey-g5", nome: "Monitor Gamer Samsung Odyssey G5 27'' QHD 144Hz Curvo", marca: "Samsung", modelo: "LS27CG552", categoria: "monitores", preco: 1499.00, desconto: 9, lancamento: true,
    specs: ["27 polegadas", "QHD (2560x1440)", "144Hz e 1ms", "Tela curva 1000R"] },
  { id: "aoc-hero-24", nome: "Monitor Gamer AOC Hero 24'' Full HD 144Hz", marca: "AOC", modelo: "24G2", categoria: "monitores", preco: 749.00, desconto: 14,
    specs: ["24 polegadas", "Full HD", "144Hz e 1ms", "FreeSync"] },

  // ---- Teclados ----
  { id: "redragon-kumara", nome: "Teclado Mecânico Gamer Redragon Kumara K552 RGB", marca: "Redragon", modelo: "K552", categoria: "teclados", preco: 189.90, desconto: 21, popular: true,
    specs: ["Formato TKL (sem numérico)", "Switch Outemu Blue", "Iluminação RGB", "ABNT2"] },
  { id: "logitech-g413-se", nome: "Teclado Mecânico Logitech G413 SE", marca: "Logitech", modelo: "G413 SE", categoria: "teclados", preco: 299.00, desconto: 10,
    specs: ["Switch tátil", "Estrutura em alumínio", "Iluminação branca", "ABNT2"] },
  { id: "hyperx-alloy-origins-60", nome: "Teclado Mecânico HyperX Alloy Origins 60", marca: "HyperX", modelo: "Alloy Origins 60", categoria: "teclados", preco: 449.00, desconto: 12, lancamento: true,
    specs: ["Formato 60%", "Switch HyperX Red", "RGB personalizável", "Cabo USB-C"] },

  // ---- Mouses ----
  { id: "logitech-g203", nome: "Mouse Gamer Logitech G203 Lightsync RGB 8.000 DPI", marca: "Logitech", modelo: "G203", categoria: "mouses", preco: 99.90, desconto: 25, popular: true,
    specs: ["8.000 DPI", "6 botões", "RGB Lightsync", "Com fio"] },
  { id: "razer-deathadder-essential", nome: "Mouse Gamer Razer DeathAdder Essential 6.400 DPI", marca: "Razer", modelo: "DeathAdder Essential", categoria: "mouses", preco: 119.90, desconto: 20,
    specs: ["6.400 DPI", "5 botões", "Sensor óptico", "Com fio"] },
  { id: "logitech-g502-hero", nome: "Mouse Gamer Logitech G502 HERO 25.600 DPI", marca: "Logitech", modelo: "G502 HERO", categoria: "mouses", preco: 219.00, desconto: 16,
    specs: ["25.600 DPI", "11 botões programáveis", "Pesos ajustáveis", "Com fio"] },

  // ---- Headsets ----
  { id: "razer-blackshark-v2x", nome: "Headset Gamer Razer BlackShark V2 X", marca: "Razer", modelo: "BlackShark V2 X", categoria: "headsets", preco: 299.00, desconto: 18, popular: true,
    specs: ["Drivers de 50mm", "Som surround 7.1", "Microfone cardioide", "Conexão P2"] },
  { id: "logitech-g435", nome: "Headset Gamer Sem Fio Logitech G435 Lightspeed", marca: "Logitech", modelo: "G435", categoria: "headsets", preco: 279.00, desconto: 13, lancamento: true,
    specs: ["Sem fio Lightspeed e Bluetooth", "Peso de 165g", "Microfones embutidos", "Bateria de até 18h"] },

  // ---- Controles ----
  { id: "dualsense-ps5", nome: "Controle Sony DualSense PS5 Branco", marca: "Sony", modelo: "CFI-ZCT1W", categoria: "controles", desconto: 12, popular: true, destaque: true,
    precos: { kabum: 349.90, amazon: 379.90, mercadolivre: 399.00, pichau: 419.90 },
    specs: ["Conexão sem fio Bluetooth", "Gatilhos adaptativos", "Feedback háptico", "Bateria recarregável via USB-C"] },
  { id: "xbox-controller-carbon", nome: "Controle Sem Fio Xbox Carbon Black", marca: "Microsoft", modelo: "Series X|S", categoria: "controles", preco: 399.00, desconto: 10,
    specs: ["Bluetooth e USB-C", "Compatível com PC e Xbox", "Botão de compartilhar", "Usa 2 pilhas AA"] },
  { id: "8bitdo-ultimate", nome: "Controle 8BitDo Ultimate 2.4G com Base de Carregamento", marca: "8BitDo", modelo: "Ultimate 2.4G", categoria: "controles", preco: 449.00, desconto: 8,
    specs: ["Sem fio 2.4GHz", "Compatível com PC", "Base de carregamento", "Analógicos Hall Effect"] },

  // ---- Acessórios ----
  { id: "cadeira-thunderx3", nome: "Cadeira Gamer ThunderX3 EC3 Preta", marca: "ThunderX3", modelo: "EC3", categoria: "acessorios", preco: 1099.00, desconto: 15, popular: true,
    specs: ["Reclinável até 180°", "Suporta até 150kg", "Apoio de braço 2D", "Revestimento em couro sintético"] },
  { id: "razer-gigantus-xxl", nome: "Mousepad Gamer Razer Gigantus V2 XXL", marca: "Razer", modelo: "Gigantus V2 XXL", categoria: "acessorios", preco: 189.00, desconto: 18,
    specs: ["Tamanho 940x410mm", "Base antiderrapante", "Superfície de tecido", "Espessura de 4mm"] },
  { id: "logitech-c920", nome: "Webcam Logitech C920s Full HD 1080p", marca: "Logitech", modelo: "C920s", categoria: "acessorios", preco: 349.00, desconto: 12,
    specs: ["Full HD 1080p", "30 fps", "Microfone estéreo", "Protetor de privacidade"] }
];


/* ============================================================ */
/* 4. FUNÇÕES AUXILIARES PARA GERAR OS DADOS                     */
/* ============================================================ */

/* Gerador de números pseudoaleatórios com "semente".
   Mesma semente = mesmos números. Assim os valores
   não mudam toda vez que a página é recarregada. */
function criarGeradorAleatorio(semente) {
  let estado = semente >>> 0;
  return function () {
    estado = (estado + 0x6D2B79F5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Transforma um texto em um número (usado como semente). */
function textoParaNumero(texto) {
  let numero = 0;
  for (let i = 0; i < texto.length; i++) {
    numero = (numero * 31 + texto.charCodeAt(i)) >>> 0;
  }
  return numero;
}

/* Imagem reserva (SVG), usada enquanto o produto não tiver
   uma foto na pasta fotos/. Assim não há imagens quebradas. */
function gerarImagemProduto(produto) {
  const categoria = CATEGORIAS.find((c) => c.id === produto.categoria);
  const matiz = (textoParaNumero(produto.id) % 60) + 250; // tons de azul/roxo
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="hsl(${matiz},70%,24%)"/>` +
    `<stop offset="1" stop-color="hsl(${matiz - 40},80%,8%)"/></linearGradient></defs>` +
    `<rect width="400" height="300" fill="url(#g)"/>` +
    `<circle cx="200" cy="130" r="82" fill="none" stroke="hsl(${matiz},90%,65%)" stroke-opacity=".55" stroke-width="2"/>` +
    `<text x="200" y="162" font-size="84" text-anchor="middle">${categoria.icone}</text>` +
    `<text x="200" y="258" font-size="22" fill="#e9d5ff" text-anchor="middle" ` +
    `font-family="Arial,sans-serif" font-weight="bold" letter-spacing="3">${produto.marca.toUpperCase()}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}


/* ============================================================ */
/* 5. MONTAGEM DOS PRODUTOS FINAIS                               */
/* Para cada produto base, cria os preços por loja,              */
/* o preço anterior e o percentual de desconto.                  */
/* ============================================================ */
function montarProduto(base, indice) {
  const aleatorio = criarGeradorAleatorio(indice * 7919 + 13);
  let precos;

  if (base.precos) {
    // Produto com preços fixos definidos manualmente
    precos = Object.entries(base.precos).map(([lojaId, preco]) => ({ lojaId, preco }));
  } else {
    // Embaralha as lojas e usa de 4 a 6 delas
    const lojas = [...LOJAS];
    for (let i = lojas.length - 1; i > 0; i--) {
      const j = Math.floor(aleatorio() * (i + 1));
      [lojas[i], lojas[j]] = [lojas[j], lojas[i]];
    }
    const quantidade = 4 + Math.floor(aleatorio() * 3);
    precos = lojas.slice(0, quantidade).map((loja, posicao) => {
      if (posicao === 0) return { lojaId: loja.id, preco: base.preco };
      const valor = base.preco * (1 + posicao * 0.025 + aleatorio() * 0.03);
      return { lojaId: loja.id, preco: Math.round(valor) - 0.1 };
    });
  }

  precos.sort((a, b) => a.preco - b.preco);

  const menorPreco = precos[0].preco;
  const maiorPreco = precos[precos.length - 1].preco;
  const precoAnterior = Math.round(menorPreco / (1 - base.desconto / 100)) - 0.1;
  const descontoPercentual = Math.round((1 - menorPreco / precoAnterior) * 100);

  return {
    ...base,
    precos,
    menorPreco,
    maiorPreco,
    economiaMaxima: maiorPreco - menorPreco,
    precoAnterior,
    descontoPercentual,
    imagem: base.foto || `fotos/${base.id}.jpg`
  };
}

const PRODUTOS = PRODUTOS_BASE.map(montarProduto);


/* ============================================================ */
/* 6. FOTOS DOS PRODUTOS                                         */
/* Tenta .jpg, depois .png e .webp. Se não houver foto,          */
/* mostra a imagem reserva.                                      */
/* ============================================================ */
document.addEventListener("error", (evento) => {
  const img = evento.target;
  if (!(img instanceof HTMLImageElement)) return;
  const endereco = img.getAttribute("src");
  const produto = PRODUTOS.find((p) =>
    endereco === p.imagem || endereco === `fotos/${p.id}.png` || endereco === `fotos/${p.id}.webp`);
  if (!produto) return;

  if (endereco.endsWith(".webp")) img.src = gerarImagemProduto(produto);
  else if (endereco === `fotos/${produto.id}.png`) img.src = `fotos/${produto.id}.webp`;
  else img.src = `fotos/${produto.id}.png`;
}, true); // "true": o evento de erro de imagem só é capturado nesta fase
