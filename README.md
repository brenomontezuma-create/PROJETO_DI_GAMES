# GGPRICE — Comparador de preços gamer

## Objetivo
Permitir que o usuário pesquise produtos do universo gamer e tecnológico e compare os preços entre lojas virtuais, identificando onde está o menor valor. Projeto feito para estudo, com código organizado e comentado.

## Descrição
O GGPRICE é um site de comparação de preços com visual futurista (fundo escuro, roxo neon, azul elétrico e verde para economia), modo claro/escuro, acessibilidade e layout responsivo.

> **Todos os preços, descontos, históricos e disponibilidade em lojas são dados FICTÍCIOS.** Não existe integração real com nenhuma loja.

## Tecnologias
- HTML5 semântico
- CSS3 (variáveis, grid, flexbox, media queries)
- JavaScript puro (sem bibliotecas nem frameworks)
- `localStorage` do navegador para favoritos, alertas, histórico, contas e preferências

## Estrutura das pastas
```
ggprice/
├── index.html      Estrutura das páginas (HTML)
├── style.css       Aparência, temas e responsividade
├── data.js         Dados fictícios: lojas, categorias e produtos
├── script.js       Funcionalidades (pesquisa, favoritos, alertas, gráficos...)
├── README.md       Esta documentação
└── EXPLICACAO.md   Guia didático, seção por seção
```

## Funcionalidades
- Pesquisa de produtos (ignora acentos) com sugestões e histórico
- Comparação de preços entre lojas, com selo **MENOR PREÇO** e diferença entre lojas
- Filtros por categoria e ordenação (menor/maior preço, desconto, economia, nome)
- Página de categorias, de ofertas e do produto
- Gráfico de histórico de preços (7 dias, 30 dias, 3 e 6 meses) — dados demonstrativos
- Favoritos salvos no navegador
- Alertas de preço com simulação de queda
- Login, cadastro e recuperação de senha demonstrativos, e perfil
- Carrossel de destaques (com pausa)
- Formulário de contato
- Modo claro/escuro e ajuste do tamanho da fonte
- Acessibilidade: link para pular conteúdo, foco visível, rótulos e erros associados aos campos, `alt` nas imagens, `aria-live`, respeito a `prefers-reduced-motion`

## Como executar
1. Baixe a pasta com os 4 arquivos (`index.html`, `style.css`, `data.js`, `script.js`) juntos.
2. Abra o `index.html` no navegador (duplo clique). Não precisa de servidor nem instalação.
3. Opcional: para testar como um site de verdade, rode `python -m http.server` na pasta e acesse `http://localhost:8000`.

## Principais arquivos
- **index.html**: cada "página" é uma `<section class="pagina">`. O JavaScript mostra uma por vez conforme o endereço (`#/ofertas`, `#/produto/rtx-4060`...).
- **style.css**: 14 seções numeradas; as cores ficam em variáveis (seção 2) e o tema claro as redefine (seção 13).
- **data.js**: onde ficam os produtos. Para adicionar um produto, copie uma linha de `PRODUTOS_BASE` e altere os dados.
- **script.js**: 18 seções numeradas, uma por finalidade. Procure pelo nome entre colchetes, como `[favoritos]`.
- **EXPLICACAO.md**: mostra o HTML, CSS e JS de cada seção e como se conectam.

## Limitações da versão demonstrativa
- Preços, descontos, históricos e lojas por produto são fictícios.
- Os links "Ver oferta" levam apenas à página inicial de cada loja, não ao produto.
- As imagens são ilustrações geradas no código, não fotos reais.
- Não há servidor: contas, alertas e favoritos ficam só no navegador e se perdem se os dados do site forem limpos.
- O login **não é seguro** (senha com código simples, sem servidor). Não use senhas reais.
- Alertas não enviam e-mail nem notificação; a queda de preço é simulada.
- Formulário de contato não envia a mensagem a ninguém.

## Melhorias futuras
- Integrar APIs ou programas de afiliados de lojas para preços reais
- Backend com autenticação segura, banco de dados e envio de e-mails/push para alertas
- Histórico de preços real, coletado periodicamente
- Páginas e URLs separadas por rota, com SEO
- Comparação lado a lado de produtos e filtros por marca/faixa de preço
- Testes automatizados e internacionalização
