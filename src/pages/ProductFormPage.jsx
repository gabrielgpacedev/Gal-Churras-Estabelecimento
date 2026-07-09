import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Espelha o enum CategoriaProduto do backend (ver DOCUMENTACAO.md).
const CATEGORIAS = ['Kit', 'Carne', 'Acompanhamento', 'Bebida', 'Acessório'];

const EMPTY = {
  nome: '',
  categoria: '',
  preco: '',
  estoque: '',
  descricao: '',
  ativo: true,
};

export default function ProductFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.nome.trim()) next.nome = 'Informe o nome do produto.';
    if (!form.categoria) next.categoria = 'Selecione uma categoria.';
    const preco = Number(String(form.preco).replace(',', '.'));
    if (!form.preco || Number.isNaN(preco) || preco <= 0) next.preco = 'Informe um preço válido.';
    const estoque = Number(form.estoque);
    if (form.estoque === '' || !Number.isInteger(estoque) || estoque < 0) {
      next.estoque = 'Estoque deve ser um número inteiro (0 ou mais).';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Mock: sem backend ainda — no futuro, POST /produtos com o payload abaixo.
    const payload = {
      nome: form.nome.trim(),
      categoria: form.categoria,
      preco: Number(String(form.preco).replace(',', '.')),
      estoque: Number(form.estoque),
      descricao: form.descricao.trim(),
      ativo: form.ativo,
    };
    console.log('Novo produto:', payload);
    navigate('/produtos');
  };

  return (
    <div className="page">
      <div className="form-breadcrumb">
        <button className="btn-ghost btn-sm" onClick={() => navigate('/produtos')}>← Voltar</button>
        <span className="crumb-muted">Kits &amp; Produtos / <strong>Novo produto</strong></span>
      </div>

      <form className="form-layout" onSubmit={handleSubmit} noValidate>
        {/* Coluna principal */}
        <div className="form-col-main">
          <section className="panel form-panel">
            <h2 className="form-panel-title">Informações do produto</h2>

            <div className="field-group">
              <label className="field-label" htmlFor="nome">NOME</label>
              <div className={'field-input' + (errors.nome ? ' field-error' : '')}>
                <input
                  id="nome"
                  type="text"
                  placeholder="Ex.: Kit Picanha Premium"
                  value={form.nome}
                  onChange={(e) => setField('nome', e.target.value)}
                />
              </div>
              {errors.nome && <span className="field-hint error">{errors.nome}</span>}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="descricao">DESCRIÇÃO</label>
              <textarea
                id="descricao"
                className="field-textarea"
                rows={4}
                placeholder="Descreva o que acompanha o produto, peso, serve quantas pessoas…"
                value={form.descricao}
                onChange={(e) => setField('descricao', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="field-group">
                <label className="field-label" htmlFor="categoria">CATEGORIA</label>
                <div className={'field-input' + (errors.categoria ? ' field-error' : '')}>
                  <select
                    id="categoria"
                    className="field-select"
                    value={form.categoria}
                    onChange={(e) => setField('categoria', e.target.value)}
                  >
                    <option value="">Selecione…</option>
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {errors.categoria && <span className="field-hint error">{errors.categoria}</span>}
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="preco">PREÇO (R$)</label>
                <div className={'field-input' + (errors.preco ? ' field-error' : '')}>
                  <span className="field-prefix">R$</span>
                  <input
                    id="preco"
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={form.preco}
                    onChange={(e) => setField('preco', e.target.value)}
                  />
                </div>
                {errors.preco && <span className="field-hint error">{errors.preco}</span>}
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="estoque">ESTOQUE</label>
                <div className={'field-input' + (errors.estoque ? ' field-error' : '')}>
                  <input
                    id="estoque"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={form.estoque}
                    onChange={(e) => setField('estoque', e.target.value)}
                  />
                  <span className="field-suffix">un</span>
                </div>
                {errors.estoque && <span className="field-hint error">{errors.estoque}</span>}
              </div>
            </div>
          </section>
        </div>

        {/* Coluna lateral */}
        <div className="form-col-side">
          <section className="panel form-panel">
            <h2 className="form-panel-title">Imagem</h2>
            <div className="image-dropzone">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span>Arraste uma imagem ou clique para enviar</span>
              <small>PNG ou JPG, até 2 MB</small>
            </div>
          </section>

          <section className="panel form-panel">
            <h2 className="form-panel-title">Disponibilidade</h2>
            <label className="toggle-row">
              <span>
                <strong>Produto ativo</strong>
                <small>Fica visível para os clientes no app.</small>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={form.ativo}
                className={'switch' + (form.ativo ? ' on' : '')}
                onClick={() => setField('ativo', !form.ativo)}
              >
                <span className="switch-knob" />
              </button>
            </label>
          </section>
        </div>

        {/* Ações */}
        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={() => navigate('/produtos')}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary btn-inline">
            Salvar produto
          </button>
        </div>
      </form>
    </div>
  );
}
