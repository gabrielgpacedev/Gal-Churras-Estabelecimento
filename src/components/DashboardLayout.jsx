import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const TITLES = {
  '/': 'Dashboard',
  '/pedidos': 'Pedidos',
  '/kits': 'Kits',
  '/kits/novo': 'Novo kit',
  '/produtos': 'Produtos',
  '/produtos/novo': 'Novo produto',
};

export default function DashboardLayout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      <Sidebar />

      <div className="admin-main">
        <header className="topbar">
          <h1 className="topbar-title">{TITLES[pathname] ?? 'Painel'}</h1>

          <div className="topbar-actions">
            <button className="topbar-icon" aria-label="Notificações">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="topbar-dot" />
            </button>
            <div className="topbar-user">
              <div className="topbar-avatar">{(user?.name ?? 'A').charAt(0)}</div>
              <span>{user?.name ?? 'Admin'}</span>
            </div>
            <button className="btn-ghost" onClick={handleLogout}>Sair</button>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
