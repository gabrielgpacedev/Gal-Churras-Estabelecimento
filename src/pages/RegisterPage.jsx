import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Plano fixo exibido na etapa 6 (mensalidade da plataforma).
const PLANO = {
  nome: 'Plano Parceiro Gal Churras',
  preco: 'R$ 99,90',
  ciclo: '/mês',
  beneficios: [
    'Pedidos ilimitados em tempo real',
    'Gestão de kits, estoque e faturamento',
    'Sem taxa de adesão · cancele quando quiser',
  ],
};

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

const ESTADO_INICIAL = {
  email: '',
  nome: '',
  telefone: '',
  cep: '',
  uf: '',
  cidade: '',
  bairro: '',
  endereco: '',
  numero: '',
  complemento: '',
  cnpj: '',
  repNome: '',
  repCpf: '',
  senha: '',
  confirmarSenha: '',
};

// ── Máscaras simples (apenas formatação visual) ──────────────
const soDigitos = (v) => v.replace(/\D/g, '');

const mascaraTelefone = (v) => {
  const d = soDigitos(v).slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, (_, a, b, c) => (c ? `(${a}) ${b}-${c}` : b ? `(${a}) ${b}` : a ? `(${a}` : ''));
  }
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, a, b, c) => (c ? `(${a}) ${b}-${c}` : `(${a}) ${b}`));
};

const mascaraCep = (v) => soDigitos(v).slice(0, 8).replace(/(\d{5})(\d{0,3})/, (_, a, b) => (b ? `${a}-${b}` : a));

const mascaraCnpj = (v) =>
  soDigitos(v).slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');

const mascaraCpf = (v) =>
  soDigitos(v).slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const MASCARAS = {
  telefone: mascaraTelefone,
  cep: mascaraCep,
  cnpj: mascaraCnpj,
  repCpf: mascaraCpf,
  numero: (v) => soDigitos(v).slice(0, 6),
};

// Ícones reutilizados nos inputs
const Icon = ({ path }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {path}
  </svg>
);
const ICON = {
  mail: <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z M22 6l-10 7L2 6" />,
  shop: <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />,
  phone: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />,
  pin: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 13a3 3 0 100-6 3 3 0 000 6z" />,
  doc: <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M9 13h6 M9 17h6" />,
  user: <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z" />,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>,
};

// Definição das 7 etapas (6 partes do formulário + etapa final de senha)
const ETAPAS = [
  { titulo: 'E-mail', descricao: 'Como você acessa o painel.' },
  { titulo: 'Estabelecimento', descricao: 'Nome e telefone de contato.' },
  { titulo: 'Endereço', descricao: 'Onde o açougue funciona.' },
  { titulo: 'CNPJ', descricao: 'Documento do estabelecimento.' },
  { titulo: 'Representante', descricao: 'Responsável legal pela conta.' },
  { titulo: 'Plano', descricao: 'Confira seu plano de parceria.' },
  { titulo: 'Senha', descricao: 'Crie sua senha de acesso.' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [error, setError] = useState('');
  const [cepStatus, setCepStatus] = useState(''); // '' | 'buscando' | 'ok' | 'nao-encontrado'

  const set = (campo) => (e) => {
    const bruto = e.target.value;
    const valor = MASCARAS[campo] ? MASCARAS[campo](bruto) : bruto;
    setForm((f) => ({ ...f, [campo]: valor }));
    if (error) setError('');
  };

  // Preenche cidade/bairro/rua/UF a partir do CEP (ViaCEP) ao completar 8 dígitos.
  const handleCep = (e) => {
    const cep = mascaraCep(e.target.value);
    setForm((f) => ({ ...f, cep }));
    if (error) setError('');

    const digitos = soDigitos(cep);
    if (digitos.length !== 8) {
      setCepStatus('');
      return;
    }

    setCepStatus('buscando');
    fetch(`https://viacep.com.br/ws/${digitos}/json/`)
      .then((r) => r.json())
      .then((data) => {
        if (data.erro) {
          setCepStatus('nao-encontrado');
          return;
        }
        setCepStatus('ok');
        setForm((f) => ({
          ...f,
          uf: data.uf || f.uf,
          cidade: data.localidade || f.cidade,
          bairro: data.bairro || f.bairro,
          endereco: data.logradouro || f.endereco,
        }));
      })
      .catch(() => setCepStatus('nao-encontrado'));
  };

  // Valida os campos da etapa atual. Retorna mensagem de erro ou '' se ok.
  const validarEtapa = (i) => {
    const f = form;
    switch (i) {
      case 0:
        if (!f.email.trim()) return 'Informe o e-mail do estabelecimento.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return 'Digite um e-mail válido.';
        return '';
      case 1:
        if (!f.nome.trim()) return 'Informe o nome do estabelecimento.';
        if (soDigitos(f.telefone).length < 10) return 'Informe um telefone válido com DDD.';
        return '';
      case 2:
        if (soDigitos(f.cep).length !== 8) return 'Informe um CEP válido (8 dígitos).';
        if (!f.uf) return 'Selecione o estado.';
        if (!f.cidade.trim()) return 'Informe a cidade.';
        if (!f.bairro.trim()) return 'Informe o bairro.';
        if (!f.endereco.trim()) return 'Informe o endereço (rua/avenida).';
        if (!String(f.numero).trim()) return 'Informe o número.';
        return '';
      case 3:
        if (soDigitos(f.cnpj).length !== 14) return 'Informe um CNPJ válido (14 dígitos).';
        return '';
      case 4:
        if (!f.repNome.trim()) return 'Informe o nome do representante.';
        if (soDigitos(f.repCpf).length !== 11) return 'Informe um CPF válido (11 dígitos).';
        return '';
      case 5:
        return ''; // etapa apenas informativa (plano)
      case 6:
        if (f.senha.length < 4) return 'A senha deve ter pelo menos 4 caracteres.';
        if (f.senha !== f.confirmarSenha) return 'As senhas não coincidem.';
        return '';
      default:
        return '';
    }
  };

  const avancar = () => {
    const msg = validarEtapa(step);
    if (msg) { setError(msg); return; }
    setError('');
    setStep((s) => Math.min(s + 1, ETAPAS.length - 1));
  };

  const voltar = () => {
    setError('');
    if (step === 0) { navigate('/login'); return; }
    setStep((s) => Math.max(s - 1, 0));
  };

  const finalizar = (e) => {
    e.preventDefault();
    // Valida todas as etapas antes de concluir.
    for (let i = 0; i < ETAPAS.length; i += 1) {
      const msg = validarEtapa(i);
      if (msg) { setStep(i); setError(msg); return; }
    }
    setError('');
    // Painel ainda em modo mock: entra localmente. (O backend expõe
    // POST /estabelecimentos/registro para persistir estes mesmos dados.)
    login({
      name: form.repNome.trim() || 'Gerente',
      email: form.email.trim(),
      shop: form.nome.trim(),
      role: 'estabelecimento',
    });
    navigate('/');
  };

  const ultima = step === ETAPAS.length - 1;
  const progresso = useMemo(() => Math.round(((step + 1) / ETAPAS.length) * 100), [step]);

  return (
    <div className="login-page">
      {/* Painel institucional (lado esquerdo) */}
      <aside className="login-aside">
        <div className="login-aside-brand">
          <div className="brand-logo">
            <span className="logo-gal">GAL</span>
            <span className="logo-churras">CHURRAS</span>
          </div>
        </div>
        <div className="login-aside-copy">
          <h2>Comece a vender <em>na GALCHURRAS</em>.</h2>
          <p>Crie a conta do seu estabelecimento e gerencie pedidos, kits e faturamento em um só lugar.</p>
        </div>
        <ol className="wizard-steps">
          {ETAPAS.map((etapa, i) => (
            <li
              key={etapa.titulo}
              className={`wizard-step ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}
            >
              <span className="wizard-step-num">{i < step ? '✓' : i + 1}</span>
              <span className="wizard-step-label">{etapa.titulo}</span>
            </li>
          ))}
        </ol>
      </aside>

      {/* Formulário (lado direito) */}
      <main className="login-panel">
        <div className="login-box">
          <span className="login-eyebrow">PAINEL DO ESTABELECIMENTO</span>
          <h1 className="login-heading">Criar conta</h1>
          <p className="login-sub">
            Etapa {step + 1} de {ETAPAS.length} · {ETAPAS[step].descricao}
          </p>

          <div className="wizard-progress" aria-hidden="true">
            <div className="wizard-progress-bar" style={{ width: `${progresso}%` }} />
          </div>

          <form onSubmit={ultima ? finalizar : (e) => { e.preventDefault(); avancar(); }} className="login-form">
            {/* ── Parte 1: E-mail ── */}
            {step === 0 && (
              <div className="field-group">
                <label className="field-label">E-MAIL</label>
                <div className="field-input">
                  <Icon path={ICON.mail} />
                  <input
                    type="text" inputMode="email" autoComplete="email" autoFocus
                    placeholder="contato@acougue.com"
                    value={form.email} onChange={set('email')}
                  />
                </div>
              </div>
            )}

            {/* ── Parte 2: Nome + Telefone ── */}
            {step === 1 && (
              <>
                <div className="field-group">
                  <label className="field-label">NOME DO ESTABELECIMENTO</label>
                  <div className="field-input">
                    <Icon path={ICON.shop} />
                    <input
                      type="text" autoComplete="organization" autoFocus
                      placeholder="Açougue Boi Nobre"
                      value={form.nome} onChange={set('nome')}
                    />
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">TELEFONE</label>
                  <div className="field-input">
                    <Icon path={ICON.phone} />
                    <input
                      type="text" inputMode="tel" autoComplete="tel"
                      placeholder="(11) 91234-5678"
                      value={form.telefone} onChange={set('telefone')}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── Parte 3: Endereço ── */}
            {step === 2 && (
              <>
                <div className="form-row">
                  <div className="field-group">
                    <label className="field-label">CEP</label>
                    <div className="field-input">
                      <Icon path={ICON.pin} />
                      <input
                        type="text" inputMode="numeric" autoFocus
                        placeholder="01000-000"
                        value={form.cep} onChange={handleCep}
                      />
                    </div>
                    {cepStatus === 'buscando' && <span className="field-hint">Buscando endereço…</span>}
                    {cepStatus === 'ok' && <span className="field-hint field-hint-ok">Endereço preenchido pelo CEP.</span>}
                    {cepStatus === 'nao-encontrado' && <span className="field-hint field-hint-err">CEP não encontrado — preencha manualmente.</span>}
                  </div>
                  <div className="field-group">
                    <label className="field-label">ESTADO</label>
                    <div className="field-input">
                      <select className="field-select" value={form.uf} onChange={set('uf')}>
                        <option value="">UF</option>
                        {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">CIDADE</label>
                  <div className="field-input">
                    <input type="text" placeholder="São Paulo" value={form.cidade} onChange={set('cidade')} />
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">BAIRRO</label>
                  <div className="field-input">
                    <input type="text" placeholder="Centro" value={form.bairro} onChange={set('bairro')} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="field-group" style={{ flex: 3 }}>
                    <label className="field-label">ENDEREÇO</label>
                    <div className="field-input">
                      <input type="text" placeholder="Rua do Churrasco" value={form.endereco} onChange={set('endereco')} />
                    </div>
                  </div>
                  <div className="field-group" style={{ flex: 1 }}>
                    <label className="field-label">NÚMERO</label>
                    <div className="field-input">
                      <input type="text" inputMode="numeric" placeholder="100" value={form.numero} onChange={set('numero')} />
                    </div>
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">COMPLEMENTO <span className="field-opt">(opcional)</span></label>
                  <div className="field-input">
                    <input type="text" placeholder="Loja 2, esquina..." value={form.complemento} onChange={set('complemento')} />
                  </div>
                </div>
              </>
            )}

            {/* ── Parte 4: CNPJ ── */}
            {step === 3 && (
              <div className="field-group">
                <label className="field-label">CNPJ</label>
                <div className="field-input">
                  <Icon path={ICON.doc} />
                  <input
                    type="text" inputMode="numeric" autoFocus
                    placeholder="00.000.000/0000-00"
                    value={form.cnpj} onChange={set('cnpj')}
                  />
                </div>
              </div>
            )}

            {/* ── Parte 5: Representante ── */}
            {step === 4 && (
              <>
                <div className="field-group">
                  <label className="field-label">NOME DO REPRESENTANTE</label>
                  <div className="field-input">
                    <Icon path={ICON.user} />
                    <input
                      type="text" autoComplete="name" autoFocus
                      placeholder="João da Silva"
                      value={form.repNome} onChange={set('repNome')}
                    />
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">CPF</label>
                  <div className="field-input">
                    <Icon path={ICON.doc} />
                    <input
                      type="text" inputMode="numeric"
                      placeholder="000.000.000-00"
                      value={form.repCpf} onChange={set('repCpf')}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── Parte 6: Plano de pagamento ── */}
            {step === 5 && (
              <div className="plano-card">
                <div className="plano-head">
                  <span className="plano-badge">PLANO</span>
                  <h3 className="plano-nome">{PLANO.nome}</h3>
                </div>
                <div className="plano-preco">
                  <strong>{PLANO.preco}</strong><span>{PLANO.ciclo}</span>
                </div>
                <ul className="plano-lista">
                  {PLANO.beneficios.map((b) => (
                    <li key={b}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="plano-obs">A cobrança começa após o primeiro mês de uso.</p>
              </div>
            )}

            {/* ── Etapa final: Senha ── */}
            {step === 6 && (
              <>
                <div className="field-group">
                  <label className="field-label">SENHA</label>
                  <div className="field-input">
                    <Icon path={ICON.lock} />
                    <input
                      type="password" autoComplete="new-password" autoFocus
                      placeholder="••••••••"
                      value={form.senha} onChange={set('senha')}
                    />
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">CONFIRMAR SENHA</label>
                  <div className="field-input">
                    <Icon path={ICON.lock} />
                    <input
                      type="password" autoComplete="new-password"
                      placeholder="••••••••"
                      value={form.confirmarSenha} onChange={set('confirmarSenha')}
                    />
                  </div>
                </div>
              </>
            )}

            {error && <p className="login-error">{error}</p>}

            <div className="wizard-nav">
              <button type="button" className="login-btn-secondary btn-inline" onClick={voltar}>
                {step === 0 ? 'Já tenho conta' : 'Voltar'}
              </button>
              <button type="submit" className="btn-primary btn-inline">
                {ultima ? 'Criar conta' : 'Continuar'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
