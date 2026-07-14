// Store de kits em localStorage — enquanto o painel é mock, mantém os kits
// criados no "+ Novo kit" visíveis na árvore mesmo após navegar/recarregar.
// Quando integrarmos, trocar por GET/POST /kits.

import { kits as seedKits, produtos } from './mockData';

const STORAGE_KEY = 'galchurras-estabelecimento-kits';

export function loadKits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* localStorage indisponível — cai no seed abaixo */
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedKits));
  return seedKits;
}

export function addKit(kit) {
  const atual = loadKits();
  const novo = { ...kit, id: kit.id || `K${Date.now()}` };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...atual, novo]));
  return novo;
}

// Resolve os produtos-filhos de cada kit (junta a composição com o cadastro).
export function comProdutos(lista) {
  return lista.map((kit) => ({
    ...kit,
    produtos: kit.itens
      .map((item) => {
        const produto = produtos.find((p) => p.id === item.produtoId);
        return produto ? { ...produto, qtd: item.qtd } : null;
      })
      .filter(Boolean),
  }));
}
