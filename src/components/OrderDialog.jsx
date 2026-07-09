import { useEffect } from 'react';
import { orderTotal, STATUS_LABEL, STATUS_FLOW } from '../data/mockData';

const brl = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');

export default function OrderDialog({ order, onClose, onAdvance }) {
  // Fecha com Esc e trava o scroll do fundo enquanto o dialog está aberto.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!order) return null;

  const total = orderTotal(order);
  const proximo = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="dialog-head">
          <div>
            <span className="dialog-eyebrow">PEDIDO</span>
            <h2 id="dialog-title" className="dialog-title">#{order.id}</h2>
          </div>
          <div className="dialog-head-right">
            <span className={`pill pill-${order.status}`}>{STATUS_LABEL[order.status]}</span>
            <button className="dialog-close" onClick={onClose} aria-label="Fechar">✕</button>
          </div>
        </header>

        <div className="dialog-body">
          <div className="dialog-info-grid">
            <div className="dialog-info">
              <span className="dialog-info-label">Cliente</span>
              <strong>{order.cliente}</strong>
              <span className="dialog-info-sub">{order.telefone}</span>
            </div>
            <div className="dialog-info">
              <span className="dialog-info-label">Horário do pedido</span>
              <strong>{order.hora}</strong>
              <span className="dialog-info-sub">Hoje</span>
            </div>
            <div className="dialog-info dialog-info-full">
              <span className="dialog-info-label">Endereço de entrega</span>
              <strong>{order.endereco}</strong>
            </div>
            <div className="dialog-info">
              <span className="dialog-info-label">Pagamento</span>
              <strong>{order.pagamentoMetodo}</strong>
              <span className={'dialog-info-sub ' + (order.pagamento === 'Pago' ? 'pay-ok' : 'pay-pending')}>
                {order.pagamento}
              </span>
            </div>
          </div>

          <div className="dialog-section">
            <span className="dialog-info-label">Itens</span>
            <ul className="dialog-items">
              {order.itens.map((it, i) => (
                <li key={i}>
                  <span className="dialog-item-qtd">{it.qtd}×</span>
                  <span className="dialog-item-name">{it.nome}</span>
                  <span className="dialog-item-price">{brl(it.qtd * it.preco)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="dialog-total">
            <span>Total</span>
            <strong>{brl(total)}</strong>
          </div>
        </div>

        <footer className="dialog-foot">
          <button className="btn-ghost" onClick={onClose}>Fechar</button>
          {proximo && (
            <button
              className="btn-primary btn-inline"
              onClick={() => onAdvance(order.id, proximo)}
            >
              Avançar para “{STATUS_LABEL[proximo]}”
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
