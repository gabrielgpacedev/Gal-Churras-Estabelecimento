import { useState } from 'react';
import { pedidos as initialPedidos, orderTotal, STATUS_LABEL, STATUS_FLOW } from '../data/mockData';
import OrderDialog from '../components/OrderDialog';

const brl = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialPedidos);
  const [busca, setBusca] = useState('');
  const [filtroPag, setFiltroPag] = useState('Todos'); // 'Todos' | 'Pago' | 'Pendente'
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  // Busca por id, nome do cliente ou item do pedido (ignora acento/maiúsculas),
  // combinada com o filtro de pagamento.
  const normaliza = (s) =>
    s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const termo = normaliza(busca.trim());
  const filtrando = termo !== '' || filtroPag !== 'Todos';
  const pedidosFiltrados = orders.filter((o) => {
    if (filtroPag !== 'Todos' && o.pagamento !== filtroPag) return false;
    if (!termo) return true;
    return (
      o.id.includes(termo) ||
      normaliza(o.cliente).includes(termo) ||
      o.itens.some((it) => normaliza(it.nome).includes(termo))
    );
  });

  const updateStatus = (id, status) => {
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // ── Drag & drop (HTML5 nativo) ─────────────────
  const handleDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };
  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverCol(null);
  };
  const handleDrop = (e, colKey) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggingId;
    if (id) updateStatus(id, colKey);
    setDraggingId(null);
    setDragOverCol(null);
  };

  return (
    <div className="page">
      <div className="orders-toolbar">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nº, cliente ou item…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {busca && (
            <button type="button" className="search-clear" aria-label="Limpar busca" onClick={() => setBusca('')}>
              ✕
            </button>
          )}
        </div>

        <div className="chips-row">
          {['Todos', 'Pago', 'Pendente'].map((opcao) => (
            <button
              key={opcao}
              type="button"
              className={'chip' + (filtroPag === opcao ? ' active' : '')}
              onClick={() => setFiltroPag(opcao)}
            >
              {opcao}
            </button>
          ))}
        </div>

        {filtrando && (
          <span className="search-count">
            {pedidosFiltrados.length} {pedidosFiltrados.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
          </span>
        )}
      </div>

      <div className="kanban-board">
        {STATUS_FLOW.map((colKey) => {
          const cards = pedidosFiltrados.filter((o) => o.status === colKey);
          return (
            <section
              key={colKey}
              className={
                'kanban-col col-' + colKey + (dragOverCol === colKey ? ' drag-over' : '')
              }
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverCol !== colKey) setDragOverCol(colKey);
              }}
              onDragLeave={(e) => {
                // só limpa quando o ponteiro realmente sai da coluna
                if (!e.currentTarget.contains(e.relatedTarget)) setDragOverCol(null);
              }}
              onDrop={(e) => handleDrop(e, colKey)}
            >
              <header className="kanban-col-head">
                <span className="kanban-col-title">{STATUS_LABEL[colKey]}</span>
                <span className="kanban-count">{cards.length}</span>
              </header>

              <div className="kanban-col-body">
                {cards.map((o) => (
                  <article
                    key={o.id}
                    className={'order-card' + (draggingId === o.id ? ' dragging' : '')}
                    draggable
                    onDragStart={(e) => handleDragStart(e, o.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setSelectedId(o.id)}
                  >
                    <div className="order-card-top">
                      <span className="order-id">#{o.id}</span>
                      <span className="order-hora">{o.hora}</span>
                    </div>
                    <h3 className="order-cliente">{o.cliente}</h3>
                    <div className="order-card-foot">
                      <span className="order-itens">
                        {o.itens.length} {o.itens.length === 1 ? 'item' : 'itens'}
                      </span>
                      <span className="order-total">{brl(orderTotal(o))}</span>
                    </div>
                    <span className={'pay ' + (o.pagamento === 'Pago' ? 'pay-ok' : 'pay-pending')}>
                      {o.pagamento}
                    </span>
                  </article>
                ))}

                {cards.length === 0 && (
                  <div className="kanban-empty">Solte um pedido aqui</div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <OrderDialog
        order={selected}
        onClose={() => setSelectedId(null)}
        onAdvance={updateStatus}
      />
    </div>
  );
}
