import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadKits, comProdutos } from '../data/kitsStore';

const brl = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');

export default function KitsPage() {
  const navigate = useNavigate();
  // Lê os kits do store (recarrega ao montar, então um kit novo já aparece).
  const [kits] = useState(() => comProdutos(loadKits()));
  // Todos os kits começam expandidos para mostrar os produtos-filhos.
  const [abertos, setAbertos] = useState(() => new Set(kits.map((k) => k.id)));

  const alternar = (id) => {
    setAbertos((prev) => {
      const proximo = new Set(prev);
      if (proximo.has(id)) proximo.delete(id);
      else proximo.add(id);
      return proximo;
    });
  };

  return (
    <div className="page">
      <div className="page-actions">
        <button className="btn-primary btn-inline" onClick={() => navigate('/kits/novo')}>
          + Novo kit
        </button>
      </div>

      <section className="panel">
        <ul className="kit-tree">
          {kits.map((kit) => {
            const aberto = abertos.has(kit.id);
            return (
              <li key={kit.id} className="kit-node">
                <button
                  type="button"
                  className="kit-parent"
                  aria-expanded={aberto}
                  onClick={() => alternar(kit.id)}
                >
                  <span className={'kit-caret' + (aberto ? ' is-open' : '')}>▾</span>
                  <span className="kit-name">{kit.nome}</span>
                  <span className="kit-count">{kit.produtos.length} produtos</span>
                  <span className="kit-price">{brl(kit.preco)}</span>
                  <span className={'pill ' + (kit.ativo ? 'pill-entregue' : 'pill-off')}>
                    {kit.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </button>

                {aberto && (
                  <ul className="kit-children">
                    {kit.produtos.map((produto) => (
                      <li key={produto.id} className="kit-child">
                        <span className="kit-child-branch" aria-hidden="true" />
                        <span className="kit-child-name">{produto.nome}</span>
                        <span className="kit-child-qtd">{produto.qtd}x</span>
                        <span className="kit-child-cat">{produto.categoria}</span>
                        <span className="kit-child-price">{brl(produto.preco)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
