import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>WasTheWord</h1>
          </Link>
          <nav className="nav">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Главное
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
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

