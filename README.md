# GalChurras — Estabelecimento

Painel **web** do estabelecimento (açougue) GalChurras. Layout **desktop / horizontal**
(sidebar + topbar), construído com React 19 + Vite 8, seguindo o design system "brasa"
descrito em `GalChurras/DOCUMENTACAO.md`.

## Stack

- React 19 + React Router DOM 7 (BrowserRouter)
- Vite 8
- CSS puro com design tokens (`src/index.css`)
- Estado de autenticação via Context API (`AuthContext`) + rota protegida

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Estrutura

```
src/
├── main.jsx
├── App.jsx                 # rotas (login pública + área protegida)
├── index.css               # design system (layout desktop) + estilos
├── components/             # Sidebar, DashboardLayout, ProtectedRoute
├── context/                # AuthContext
├── data/                   # mockData.js (pedidos, produtos, métricas)
└── pages/                  # Login, Dashboard, Orders (Pedidos), Products (Kits & Produtos)
```

## Acesso de demonstração

Usuário `123` / senha `123` (mock, sem backend). Integrar com a API (JWT) posteriormente.
