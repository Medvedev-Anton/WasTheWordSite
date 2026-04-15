import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getMediaUrl } from '../config';
import './Users.css';
import { Rang } from '../types';

interface UserItem {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  rang?: Rang;
}

export default function Users() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/users').then(r => setUsers(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    return !q || u.username.toLowerCase().includes(q) || fullName.includes(q);
  });

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Сотрудники</h2>
        <div className="users-search">
          <input
            type="text"
            placeholder="🔍 Поиск по имени или логину..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="users-search-input"
          />
        </div>
      </div>

      <div className="users-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">Никого не найдено</div>
        ) : (
          filtered.map(u => (
            <div key={u.id} className="user-card" onClick={() => navigate(`/users/${u.id}`)}>
              {u.avatar ? (
                <img src={getMediaUrl(u.avatar)} alt={u.username} className="user-card-avatar" />
              ) : (
                <div className="user-card-avatar-placeholder">
                  {(u.firstName || u.username)[0].toUpperCase()}
                </div>
              )}
              <div className="user-card-name">
                {u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.username}
              </div>
              <div className="user-card-username">@{u.username}</div>
              {
                u.rang ?
                (
                  <div>
                    <img src={u.rang.thumbnailUrl} alt={u.username} />
                  </div>
                )
                : ''
              }
            </div>
          ))
        )}
      </div>
    </div>
  );
}
