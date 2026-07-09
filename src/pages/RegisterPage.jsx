import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [shop, setShop] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    if (!shop.trim() || !email.trim() || !password) {
      setError('Preencha todos os campos para criar sua conta.');
      return;
    }
    if (password.length < 3) {
      setError('A senha deve ter pelo menos 3 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }

    // Sem backend ainda: cria a conta localmente e entra no painel.
    setError('');
    login({ name: 'Gerente', email: email.trim(), shop: shop.trim(), role: 'estabelecimento' });
    navigate('/');
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
          <h2>Comece a vender <em>na brasa</em>.</h2>
          <p>Crie a conta do seu estabelecimento e gerencie pedidos, kits e faturamento em um só lugar.</p>
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
          <h1 className="login-heading">Criar conta</h1>
          <p className="login-sub">Cadastre seu estabelecimento para acessar o painel.</p>

          <form onSubmit={handleRegister} className="login-form">
            <div className="field-group">
              <label className="field-label">ESTABELECIMENTO</label>
              <div className="field-input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
                </svg>
                <input
                  type="text"
                  autoComplete="organization"
                  placeholder="Nome do açougue"
                  value={shop}
                  onChange={(e) => { setShop(e.target.value); if (error) setError(''); }}
                />
              </div>
            </div>

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
                  autoComplete="email"
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
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">CONFIRMAR SENHA</label>
              <div className="field-input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); if (error) setError(''); }}
                />
              </div>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn-primary login-btn">Criar conta</button>
            <button type="button" className="login-btn-secondary" onClick={() => navigate('/login')}>
              Já tenho conta
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
