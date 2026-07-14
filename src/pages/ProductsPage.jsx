import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { produtos as produtosMock } from '../data/mockData';

const brl = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');

export default function ProductsPage() {
  const navigate = useNavigate();
  const [lista, setLista] = useState(produtosMock);

  const toggleAtivo = (id) => {
    setLista((atual) => atual.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p)));
  };

  return (
    <div className="page">
      <div className="page-actions">
        <button className="btn-primary btn-inline" onClick={() => navigate('/produtos/novo')}>
          + Novo produto
        </button>
      </div>

      <section className="panel">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Ativo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="product-thumb">{p.imagem}</div>
                  </td>
                  <td className="cell-strong">{p.nome}</td>
                  <td>{p.categoria}</td>
                  <td className="cell-gold">{brl(p.preco)}</td>
                  <td className={p.estoque === 0 ? 'cell-danger' : ''}>{p.estoque} un</td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={p.ativo}
                      aria-label={p.ativo ? 'Desativar produto' : 'Ativar produto'}
                      className={'switch' + (p.ativo ? ' on' : '')}
                      onClick={() => toggleAtivo(p.id)}
                    >
                      <span className="switch-knob" />
                    </button>
                  </td>
                  <td><button className="btn-ghost btn-sm">Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
