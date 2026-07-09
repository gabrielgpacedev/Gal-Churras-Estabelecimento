import { useNavigate } from 'react-router-dom';
import { produtos } from '../data/mockData';

const brl = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');

export default function ProductsPage() {
  const navigate = useNavigate();

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
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.id}>
                  <td className="cell-strong">{p.nome}</td>
                  <td>{p.categoria}</td>
                  <td className="cell-gold">{brl(p.preco)}</td>
                  <td className={p.estoque === 0 ? 'cell-danger' : ''}>{p.estoque} un</td>
                  <td>
                    <span className={'pill ' + (p.ativo ? 'pill-entregue' : 'pill-off')}>
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
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
