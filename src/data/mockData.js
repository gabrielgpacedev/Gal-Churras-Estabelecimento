// Dados mockados do painel do estabelecimento — substituir por chamadas à API futuramente.

export const metrics = [
  { label: 'Pedidos hoje', value: '32', delta: '+12%', trend: 'up' },
  { label: 'Faturamento hoje', value: 'R$ 4.280,00', delta: '+8%', trend: 'up' },
  { label: 'Ticket médio', value: 'R$ 133,75', delta: '-3%', trend: 'down' },
  { label: 'Em preparo', value: '5', delta: 'agora', trend: 'flat' },
];

export const pedidos = [
  {
    id: '1042',
    cliente: 'Marina Alves',
    telefone: '(11) 98888-1234',
    endereco: 'Rua das Palmeiras, 320 — Apto 52 • Jardim Paulista',
    pagamento: 'Pago',
    pagamentoMetodo: 'Cartão de crédito',
    status: 'novo',
    hora: '19:42',
    itens: [
      { nome: 'Kit Picanha Premium', qtd: 1, preco: 189.9 },
      { nome: 'Carvão 5kg', qtd: 2, preco: 24.9 },
    ],
  },
  {
    id: '1041',
    cliente: 'Rafael Souza',
    telefone: '(11) 97777-5566',
    endereco: 'Alameda dos Ipês, 88 • Vila Nova',
    pagamento: 'Pago',
    pagamentoMetodo: 'Pix',
    status: 'preparo',
    hora: '19:35',
    itens: [
      { nome: 'Kit Costela Fogo de Chão', qtd: 1, preco: 129.0 },
    ],
  },
  {
    id: '1040',
    cliente: 'Beatriz Lima',
    telefone: '(11) 96666-7788',
    endereco: 'Rua do Sol, 15 • Centro',
    pagamento: 'Pago',
    pagamentoMetodo: 'Cartão de crédito',
    status: 'preparo',
    hora: '19:10',
    itens: [
      { nome: 'Kit Espeto Misto', qtd: 2, preco: 98.0 },
      { nome: 'Pão de Alho (3un)', qtd: 1, preco: 18.5 },
    ],
  },
  {
    id: '1039',
    cliente: 'Carlos Mendes',
    telefone: '(11) 95555-9900',
    endereco: 'Av. das Nações, 740 • Moema',
    pagamento: 'Pendente',
    pagamentoMetodo: 'Dinheiro',
    status: 'novo',
    hora: '19:02',
    itens: [
      { nome: 'Kit Espeto Misto', qtd: 1, preco: 98.0 },
    ],
  },
  {
    id: '1038',
    cliente: 'Ana Paula',
    telefone: '(11) 94444-3322',
    endereco: 'Rua Harmonia, 210 • Pinheiros',
    pagamento: 'Pago',
    pagamentoMetodo: 'Pix',
    status: 'rota',
    hora: '18:48',
    itens: [
      { nome: 'Kit Picanha Premium', qtd: 1, preco: 189.9 },
      { nome: 'Pão de Alho (3un)', qtd: 1, preco: 18.5 },
    ],
  },
  {
    id: '1037',
    cliente: 'João Vitor',
    telefone: '(11) 93333-1100',
    endereco: 'Rua Itaim, 55 • Itaim Bibi',
    pagamento: 'Pago',
    pagamentoMetodo: 'Cartão de crédito',
    status: 'entregue',
    hora: '18:20',
    itens: [
      { nome: 'Carvão 5kg', qtd: 1, preco: 24.9 },
      { nome: 'Pão de Alho (3un)', qtd: 1, preco: 18.5 },
    ],
  },
  {
    id: '1036',
    cliente: 'Pedro Nunes',
    telefone: '(11) 92222-4455',
    endereco: 'Av. Brasil, 1200 • Centro',
    pagamento: 'Pago',
    pagamentoMetodo: 'Pix',
    status: 'novo',
    hora: '20:01',
    itens: [
      { nome: 'Kit Picanha Premium', qtd: 2, preco: 189.9 },
    ],
  },
  {
    id: '1034',
    cliente: 'Lúcia Fernandes',
    telefone: '(11) 91111-2233',
    endereco: 'Rua das Acácias, 90 • Vila Mariana',
    pagamento: 'Pago',
    pagamentoMetodo: 'Cartão de crédito',
    status: 'rota',
    hora: '18:30',
    itens: [
      { nome: 'Kit Espeto Misto', qtd: 1, preco: 98.0 },
      { nome: 'Carvão 5kg', qtd: 1, preco: 24.9 },
    ],
  },
];

// Total do pedido calculado a partir dos itens (evita divergência com o backend).
export const orderTotal = (pedido) =>
  pedido.itens.reduce((soma, it) => soma + it.qtd * it.preco, 0);

// `imagem` guarda um emoji como miniatura mock; no futuro vira a URL da foto.
export const produtos = [
  { id: 'P1', nome: 'Picanha', categoria: 'Carnes', preco: 89.9, estoque: 30, ativo: true, imagem: '🥩' },
  { id: 'P2', nome: 'Costela bovina', categoria: 'Carnes', preco: 49.9, estoque: 25, ativo: true, imagem: '🍖' },
  { id: 'P3', nome: 'Linguiça toscana', categoria: 'Carnes', preco: 24.9, estoque: 40, ativo: true, imagem: '🌭' },
  { id: 'P4', nome: 'Espeto de frango', categoria: 'Carnes', preco: 19.9, estoque: 35, ativo: true, imagem: '🍢' },
  { id: 'P5', nome: 'Pão de alho (3un)', categoria: 'Acompanhamento', preco: 18.5, estoque: 0, ativo: false, imagem: '🧄' },
  { id: 'P6', nome: 'Carvão 5kg', categoria: 'Acessório', preco: 24.9, estoque: 60, ativo: true, imagem: '🔥' },
];

// Kits cadastrados e os produtos que os compõem (árvore kit → produtos).
// `itens` referencia produtos por id para exibir os filhos na tela de Kits.
export const kits = [
  {
    id: 'K1',
    nome: 'Kit Picanha Premium',
    preco: 189.9,
    ativo: true,
    itens: [
      { produtoId: 'P1', qtd: 1 },
      { produtoId: 'P3', qtd: 2 },
      { produtoId: 'P5', qtd: 1 },
      { produtoId: 'P6', qtd: 1 },
    ],
  },
  {
    id: 'K2',
    nome: 'Kit Costela Fogo de Chão',
    preco: 129.0,
    ativo: true,
    itens: [
      { produtoId: 'P2', qtd: 1 },
      { produtoId: 'P5', qtd: 1 },
      { produtoId: 'P6', qtd: 1 },
    ],
  },
  {
    id: 'K3',
    nome: 'Kit Espeto Misto',
    preco: 98.0,
    ativo: true,
    itens: [
      { produtoId: 'P4', qtd: 4 },
      { produtoId: 'P3', qtd: 2 },
      { produtoId: 'P5', qtd: 1 },
    ],
  },
];

export const STATUS_LABEL = {
  novo: 'Novo',
  preparo: 'Em preparo',
  rota: 'Em rota',
  entregue: 'Entregue',
};

// Ordem do fluxo do pedido (usada nas colunas do Kanban e no avanço de status).
export const STATUS_FLOW = ['novo', 'preparo', 'rota', 'entregue'];
