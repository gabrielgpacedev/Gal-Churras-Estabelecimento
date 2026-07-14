import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const nav = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    to: '/pedidos',
    label: 'Pedidos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2l1.5 3h9L18 2" />
        <path d="M4 5h16l-1.5 15.5a1 1 0 01-1 .9H6.5a1 1 0 01-1-.9L4 5z" />
        <path d="M9 11h6" />
      </svg>
    ),
  },
  {
    to: '/kits',
    label: 'Kits',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    ),
  },
  {
    to: '/produtos',
    label: 'Produtos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <span className="logo-gal">GAL</span>
          <span className="logo-churras">CHURRAS</span>
        </div>
        <span className="brand-tag">PAINEL</span>
      </div>

      <nav className="sidebar-nav">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-shop">
          <div className="shop-avatar">{(user?.shop ?? 'B').charAt(0)}</div>
          <div className="shop-meta">
            <strong>{user?.shop ?? 'Boi Nobre'}</strong>
            <span>Açougue</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
