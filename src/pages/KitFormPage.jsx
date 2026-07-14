import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { produtos } from '../data/mockData';
import { addKit } from '../data/kitsStore';

const brl = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');

export default function KitFormPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [ativo, setAtivo] = useState(true);
  // Mapa produtoId -> quantidade dos produtos escolhidos para o kit.
  const [selecionados, setSelecionados] = useState({});
  const [errors, setErrors] = useState({});

  const toggleProduto = (id) => {
    setSelecionados((prev) => {
      const proximo = { ...prev };
      if (proximo[id]) delete proximo[id];
      else proximo[id] = 1;
      return proximo;
    });
    if (errors.produtos) setErrors((e) => ({ ...e, produtos: undefined }));
  };

  const setQtd = (id, qtd) => {
    const n = Math.max(1, Math.min(99, Number(qtd) || 1));
    setSelecionados((prev) => ({ ...prev, [id]: n }));
  };

  const itensSelecionados = useMemo(
    () =>
      Object.entries(selecionados).map(([id, qtd]) => {
        const produto = produtos.find((p) => p.id === id);
        return { ...produto, qtd };
      }),
    [selecionados],
  );

  // Soma dos produtos escolhidos — sugestão de preço para o gerente.
  const subtotal = useMemo(
    () => itensSelecionados.reduce((soma, it) => soma + it.preco * it.qtd, 0),
    [itensSelecionados],
  );

  const validate = () => {
    const next = {};
    if (!nome.trim()) next.nome = 'Informe o nome do kit.';
    const precoNum = Number(String(preco).replace(',', '.'));
    if (!preco || Number.isNaN(precoNum) || precoNum <= 0) next.preco = 'Informe um preço válido.';
    if (Object.keys(selecionados).length === 0) next.produtos = 'Escolha ao menos um produto para o kit.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addKit({
      nome: nome.trim(),
      preco: Number(String(preco).replace(',', '.')),
      ativo,
      itens: Object.entries(selecionados).map(([produtoId, qtd]) => ({ produtoId, qtd })),
    });
    navigate('/kits');
  };

  return (
    <div className="page">
      <div className="form-breadcrumb">
        <button className="btn-ghost btn-sm" onClick={() => navigate('/kits')}>← Voltar</button>
        <span className="crumb-muted">Kits / <strong>Novo kit</strong></span>
      </div>

      <form className="form-layout" onSubmit={handleSubmit} noValidate>
        {/* Coluna principal — produtos do kit */}
        <div className="form-col-main">
          <section className="panel form-panel">
            <h2 className="form-panel-title">Produtos do kit</h2>
            {errors.produtos && <span className="field-hint error">{errors.produtos}</span>}

            <ul className="kit-picker">
              {produtos.map((p) => {
                const marcado = Boolean(selecionados[p.id]);
                return (
                  <li key={p.id} className={'kit-picker-row' + (marcado ? ' is-on' : '')}>
                    <label className="kit-picker-check">
                      <input
                        type="checkbox"
                        checked={marcado}
                        onChange={() => toggleProduto(p.id)}
                      />
                      <span className="kit-picker-name">{p.nome}</span>
                      <span className="kit-picker-cat">{p.categoria}</span>
                    </label>
                    <span className="kit-picker-price">{brl(p.preco)}</span>
                    <div className="kit-picker-qtd">
                      {marcado ? (
                        <>
                          <button
                            type="button"
                            className="qtd-btn"
                            aria-label="Diminuir"
                            onClick={() => setQtd(p.id, selecionados[p.id] - 1)}
                          >−</button>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={selecionados[p.id]}
                            onChange={(e) => setQtd(p.id, e.target.value)}
                          />
                          <button
                            type="button"
                            className="qtd-btn"
                            aria-label="Aumentar"
                            onClick={() => setQtd(p.id, selecionados[p.id] + 1)}
                          >+</button>
                        </>
                      ) : (
                        <span className="kit-picker-muted">—</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Coluna lateral — dados do kit */}
        <div className="form-col-side">
          <section className="panel form-panel">
            <h2 className="form-panel-title">Informações do kit</h2>

            <div className="field-group">
              <label className="field-label" htmlFor="kit-nome">NOME</label>
              <div className={'field-input' + (errors.nome ? ' field-error' : '')}>
                <input
                  id="kit-nome"
                  type="text"
                  placeholder="Ex.: Kit Picanha Premium"
                  value={nome}
                  onChange={(e) => { setNome(e.target.value); if (errors.nome) setErrors((x) => ({ ...x, nome: undefined })); }}
                />
              </div>
              {errors.nome && <span className="field-hint error">{errors.nome}</span>}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="kit-preco">PREÇO (R$)</label>
              <div className={'field-input' + (errors.preco ? ' field-error' : '')}>
                <span className="field-prefix">R$</span>
                <input
                  id="kit-preco"
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={preco}
                  onChange={(e) => { setPreco(e.target.value); if (errors.preco) setErrors((x) => ({ ...x, preco: undefined })); }}
                />
              </div>
              {errors.preco && <span className="field-hint error">{errors.preco}</span>}
              <span className="field-hint">
                {itensSelecionados.length > 0
                  ? `Soma dos produtos: ${brl(subtotal)}`
                  : 'Escolha os produtos ao lado.'}
              </span>
            </div>
          </section>

          <section className="panel form-panel">
            <h2 className="form-panel-title">Disponibilidade</h2>
            <label className="toggle-row">
              <span>
                <strong>Kit ativo</strong>
                <small>Fica visível para os clientes no app.</small>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={ativo}
                className={'switch' + (ativo ? ' on' : '')}
                onClick={() => setAtivo((v) => !v)}
              >
                <span className="switch-knob" />
              </button>
            </label>
          </section>
        </div>

        {/* Ações */}
        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={() => navigate('/kits')}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary btn-inline">
            Salvar kit
          </button>
        </div>
      </form>
    </div>
  );
}
