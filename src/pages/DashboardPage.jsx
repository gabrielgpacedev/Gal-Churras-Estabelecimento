import { metrics, pedidos, orderTotal, STATUS_LABEL } from '../data/mockData';

const brl = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');

export default function DashboardPage() {
  const recentes = pedidos.slice(0, 5);

  return (
    <div className="page">
      <section className="metric-grid">
        {metrics.map((m) => (
          <div key={m.label} className="metric-card">
            <span className="metric-label">{m.label}</span>
            <strong className="metric-value">{m.value}</strong>
            <span className={`metric-delta trend-${m.trend}`}>{m.delta}</span>
          </div>
        ))}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Pedidos recentes</h2>
          <a className="panel-link" href="#/pedidos">Ver todos</a>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Status</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {recentes.map((p) => (
                <tr key={p.id}>
                  <td className="cell-strong">#{p.id}</td>
                  <td>{p.cliente}</td>
                  <td>{p.itens.length}</td>
                  <td className="cell-gold">{brl(orderTotal(p))}</td>
                  <td><span className={`pill pill-${p.status}`}>{STATUS_LABEL[p.status]}</span></td>
                  <td className="cell-muted">{p.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
