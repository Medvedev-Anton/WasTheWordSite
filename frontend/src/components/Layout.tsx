import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo" onClick={closeSidebar}>
            <h1>WasTheWord</h1>
          </Link>
          <nav className="nav">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Главное
            </Link>
            <Link to="/map" className={location.pathname === '/map' ? 'active' : ''}>
              Карта
            </Link>
            <Link to="/organizations" className={location.pathname === '/organizations' ? 'active' : ''}>
              Организации
            </Link>
            <Link to="/users" className={location.pathname === '/users' ? 'active' : ''}>
              Сотрудники
            </Link>
            <Link to="/chat" className={location.pathname === '/chat' ? 'active' : ''}>
              Чат
            </Link>
            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
              Профиль
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                Админ
              </Link>
            )}
          </nav>
          <div className="user-menu">
            <span className="username">{user?.username}</span>
            <button onClick={logout} className="logout-btn">Выход</button>
          </div>
          <button className="hamburger-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Меню">
            ☰
          </button>
        </div>
      </header>

      {/* Mobile slide-in sidebar (outside header to avoid stacking context issues) */}
      <aside className={`mobile-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="mobile-sidebar-top">
          <span className="mobile-sidebar-title">WasTheWord</span>
          <button className="mobile-sidebar-close" onClick={closeSidebar}>✕</button>
        </div>
        <nav className="mobile-sidebar-nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeSidebar}>
            🏠 Главное
          </Link>
          <Link to="/map" className={location.pathname === '/map' ? 'active' : ''} onClick={closeSidebar}>
            🗺️ Карта
          </Link>
          <Link to="/organizations" className={location.pathname === '/organizations' ? 'active' : ''} onClick={closeSidebar}>
            🏢 Организации
          </Link>
          <Link to="/users" className={location.pathname === '/users' ? 'active' : ''} onClick={closeSidebar}>
            👥 Сотрудники
          </Link>
          <Link to="/chat" className={location.pathname === '/chat' ? 'active' : ''} onClick={closeSidebar}>
            💬 Чат
          </Link>
          <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''} onClick={closeSidebar}>
            👤 Профиль
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''} onClick={closeSidebar}>
              ⚙️ Админ
            </Link>
          )}
        </nav>
        <div className="mobile-sidebar-footer">
          <span className="mobile-sidebar-username">{user?.username}</span>
          <button onClick={() => { logout(); closeSidebar(); }} className="mobile-sidebar-logout">
            Выход
          </button>
        </div>
      </aside>
      <div className={`nav-overlay${sidebarOpen ? ' open' : ''}`} onClick={closeSidebar} />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

