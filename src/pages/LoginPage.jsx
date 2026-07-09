import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Credenciais de demonstração (sem backend ainda)
const DEMO_USER = '123';
const DEMO_PASS = '123';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (email.trim() === DEMO_USER && password === DEMO_PASS) {
      setError('');
      login({ name: 'Gerente', email: email.trim(), shop: 'Boi Nobre', role: 'estabelecimento' });
      navigate('/');
      return;
    }

    setError('Usuário ou senha inválidos. Tente novamente.');
  };

  const fillDemo = () => {
    setError('');
    setEmail(DEMO_USER);
    setPassword(DEMO_PASS);
  };

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
          <h2>Gerencie seu açougue <em>na brasa</em>.</h2>
          <p>Acompanhe pedidos em tempo real, controle seus kits e produtos e acompanhe o faturamento — tudo em um só lugar.</p>
        </div>
        <ul className="login-aside-list">
          <li>🔥 Pedidos em tempo real</li>
          <li>📦 Gestão de kits e estoque</li>
          <li>📊 Faturamento e métricas</li>
        </ul>
      </aside>

      {/* Formulário (lado direito) */}
      <main className="login-panel">
        <div className="login-box">
          <span className="login-eyebrow">PAINEL DO ESTABELECIMENTO</span>
          <h1 className="login-heading">Acesse sua conta</h1>
          <p className="login-sub">Entre com as credenciais do seu estabelecimento.</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="field-group">
              <label className="field-label">E-MAIL</label>
              <div className="field-input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                <input
                  type="text"
                  inputMode="email"
                  autoComplete="username"
                  placeholder="contato@acougue.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">SENHA</label>
              <div className="field-input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                />
              </div>
              <button type="button" className="forgot-link">Esqueci minha senha</button>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn-primary login-btn">Entrar no painel</button>
            <button type="button" className="login-btn-secondary" onClick={() => navigate('/register')}>
              Criar conta
            </button>
          </form>

          <p className="demo-hint">
            Acesso de demonstração:{' '}
            <button type="button" className="demo-btn" onClick={fillDemo}><strong>123</strong></button>{' '}
            / <button type="button" className="demo-btn" onClick={fillDemo}><strong>123</strong></button>
          </p>
        </div>
      </main>
    </div>
  );
}
