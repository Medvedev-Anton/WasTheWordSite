import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Post } from '../types';
import { getMediaUrl } from '../config';
import './Admin.css';

interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalOrganizations: number;
  bannedUsers: number;
  adminUsers: number;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'stats'>('stats');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const response = await axios.get('/api/admin/users');
        setUsers(response.data);
      } else if (activeTab === 'posts') {
        const response = await axios.get('/api/admin/posts');
        setPosts(response.data);
      } else {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      if (error.response?.status === 403) {
        alert('Доступ запрещен. Требуются права администратора.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: number, isBanned: boolean) => {
    if (!confirm(`Вы уверены, что хотите ${isBanned ? 'заблокировать' : 'разблокировать'} этого пользователя?`)) {
      return;
    }

    try {
      await axios.post(`/api/admin/users/${userId}/ban`, { isBanned: !isBanned });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при изменении статуса пользователя');
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот пост?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/posts/${postId}`);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении поста');
    }
  };

  const handleMakeAdmin = async (userId: number) => {
    if (!confirm('Вы уверены, что хотите сделать этого пользователя администратором?')) {
      return;
    }

    try {
      await axios.post(`/api/admin/users/${userId}/make-admin`);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка');
    }
  };

  const handleRemoveAdmin = async (userId: number) => {
    if (!confirm('Вы уверены, что хотите убрать права администратора у этого пользователя?')) {
      return;
    }

    try {
      await axios.post(`/api/admin/users/${userId}/remove-admin`);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка');
    }
  };

  if (loading && !stats) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Панель администратора</h1>
      
      <div className="admin-tabs">
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Статистика
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Пользователи
        </button>
        <button
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => setActiveTab('posts')}
        >
          Посты
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'stats' && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Всего пользователей</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Всего постов</h3>
              <p className="stat-number">{stats.totalPosts}</p>
            </div>
            <div className="stat-card">
              <h3>Всего комментариев</h3>
              <p className="stat-number">{stats.totalComments}</p>
            </div>
            <div className="stat-card">
              <h3>Организаций</h3>
              <p className="stat-number">{stats.totalOrganizations}</p>
            </div>
            <div className="stat-card warning">
              <h3>Заблокированных</h3>
              <p className="stat-number">{stats.bannedUsers}</p>
            </div>
            <div className="stat-card admin">
              <h3>Администраторов</h3>
              <p className="stat-number">{stats.adminUsers}</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя пользователя</th>
                  <th>Email</th>
                  <th>Имя</th>
                  <th>Роль</th>
                  <th>Постов</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className={user.isBanned ? 'banned' : ''}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '-'}</td>
                    <td>
                      <span className={`role-badge ${user.role === 'admin' ? 'admin' : 'user'}`}>
                        {user.role === 'admin' ? 'Админ' : 'Пользователь'}
                      </span>
                    </td>
                    <td>{user.postsCount || 0}</td>
                    <td>
                      {user.isBanned ? (
                        <span className="status-banned">Заблокирован</span>
                      ) : (
                        <span className="status-active">Активен</span>
                      )}
                    </td>
                    <td className="actions">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleMakeAdmin(user.id)}
                          className="btn-make-admin"
                        >
                          Сделать админом
                        </button>
                      )}
                      {user.role === 'admin' && user.id !== parseInt(localStorage.getItem('userId') || '0') && (
                        <button
                          onClick={() => handleRemoveAdmin(user.id)}
                          className="btn-remove-admin"
                        >
                          Убрать админа
                        </button>
                      )}
                      <button
                        onClick={() => handleBanUser(user.id, !!user.isBanned)}
                        className={user.isBanned ? 'btn-unban' : 'btn-ban'}
                      >
                        {user.isBanned ? 'Разблокировать' : 'Заблокировать'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="posts-list">
            {posts.map(post => (
              <div key={post.id} className="admin-post-card">
                <div className="post-header">
                  <div className="post-author-info">
                    {post.authorAvatar && (
                      <img src={getMediaUrl(post.authorAvatar)} alt={post.authorUsername} className="post-avatar" />
                    )}
                    <div>
                      <div className="author-name">
                        {post.authorFirstName && post.authorLastName
                          ? `${post.authorFirstName} ${post.authorLastName}`
                          : post.authorUsername}
                      </div>
                      {post.organizationName && (
                        <div className="org-name">от {post.organizationName}</div>
                      )}
                      <div className="post-date">{new Date(post.createdAt).toLocaleString('ru-RU')}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="btn-delete"
                  >
                    Удалить
                  </button>
                </div>
                <div className="post-content">
                  <p>{post.content}</p>
                  {post.image && (
                    <img src={getMediaUrl(post.image)} alt="Post" className="post-image" />
                  )}
                </div>
                <div className="post-stats">
                  <span>❤️ {post.likesCount || 0}</span>
                  <span>💬 {post.commentsCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}








