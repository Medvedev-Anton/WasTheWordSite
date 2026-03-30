import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Post, Organization } from '../types';
import { getMediaUrl } from '../config';
import './Admin.css';
import IconEditModal from '../components/IconEditModal';

interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalOrganizations: number;
  bannedUsers: number;
  adminUsers: number;
}

interface OrganizationIcon {
  id: number;
  orgType: string;
  imageUrl: string;
}

interface OrganizationCover {
  id: number;
  imageUrl: string;
  orgType: string | null;
}

const ORG_TYPES: string[] = ['Производственная', 'Коммерческая', 'Административная', 'Образовательная', 'Волонтёрская', 'Спортивная', 'Свободная'];
const ORG_TO_ICON: Record<string, string> = {
  'Производственная': ' 🏭',
  'Коммерческая': '🏢',
  'Административная': '🏕️',
  'Образовательная': '🎓',
  'Волонтёрская': '🤝',
  'Спортивная': '🏆',
  'Свободная': '🌐',
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'stats' | 'organization-images' | 'organizations'>('stats');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizationIcons, setOrganizationIcons] = useState<OrganizationIcon[]>([]);
  const [editingIcon, setEditingIcon] = useState<OrganizationIcon | null>(null);
  const [newIconType, setNewIconType] = useState('');
  const [newIconFiles, setNewIconFiles] = useState<File[]>([]);
  const [newIconPreview, setNewIconPreview] = useState<string | null>(null);

  // Covers state
  const [organizationCovers, setOrganizationCovers] = useState<OrganizationCover[]>([]);
  const [newCoverFiles, setNewCoverFiles] = useState<File[]>([]);
  const [newCoverPreviews, setNewCoverPreviews] = useState<string[]>([]);
  const [newCoverType, setNewCoverType] = useState<string>('');
  const [imagesSubTab, setImagesSubTab] = useState<'icons' | 'covers'>('icons');

  const handleNewIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewIconFiles(files);
      // Preview first file only
      const reader = new FileReader();
      reader.onloadend = () => setNewIconPreview(reader.result as string);
      reader.readAsDataURL(files[0]);
    }
  };

  const handleCreateIcon = async () => {
    if (!newIconType || newIconFiles.length === 0) return;

    const formData = new FormData();
    formData.append('orgType', newIconType);
    newIconFiles.forEach(f => formData.append('images', f));

    try {
      await axios.post('/api/admin/icons', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      handleClearNewIcon();
      fetchData();
      alert(`Иконка(-и) успешно загружены: ${newIconFiles.length} шт.`);
    } catch (error: any) {
      console.error('Failed to create icon:', error);
      alert(error.response?.data?.error || 'Ошибка при создании иконки');
    }
  };

  const handleClearNewIcon = () => {
    setNewIconType('');
    setNewIconFiles([]);
    setNewIconPreview(null);
    const fileInput = document.getElementById('create-image-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleUpdateIcon = async (iconId: number, file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    await axios.put(`/api/admin/icons/${iconId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    fetchData();
  };

  const handleDeleteIcon = async (iconId: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту иконку?')) return;

    try {
      await axios.delete(`/api/admin/icons/${iconId}`);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении');
    }
  };

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
      }
      else if (activeTab === 'organizations') {
        const response = await axios.get('/api/organizations');
        setOrganizations(response.data);
      }
      else if (activeTab === 'organization-images') {
        const [iconsRes, coversRes] = await Promise.all([
          axios.get('/api/admin/icons'),
          axios.get('/api/admin/covers'),
        ]);
        setOrganizationIcons(iconsRes.data.icons);
        setOrganizationCovers(coversRes.data.covers);
      }
      else {
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

  const handleDeleteOrganization = async (orgId: number, orgName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить организацию "${orgName}"?`)) {
      return;
    }

    try {
      await axios.delete(`/api/organizations/${orgId}`);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении организации');
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

  const handleNewCoverFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewCoverFiles(files);
      const previews: string[] = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) setNewCoverPreviews([...previews]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleCreateCovers = async () => {
    if (newCoverFiles.length === 0) return;
    const formData = new FormData();
    newCoverFiles.forEach(f => formData.append('images', f));
    if (newCoverType) formData.append('orgType', newCoverType);
    try {
      await axios.post('/api/admin/covers', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setNewCoverFiles([]);
      setNewCoverPreviews([]);
      setNewCoverType('');
      const fileInput = document.getElementById('create-cover-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchData();
      alert(`Обложки загружены: ${newCoverFiles.length} шт.`);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при загрузке обложек');
    }
  };

  const handleDeleteCover = async (coverId: number) => {
    if (!confirm('Удалить эту обложку?')) return;
    try {
      await axios.delete(`/api/admin/covers/${coverId}`);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении');
    }
  };

  if (loading && !stats) {
    return <div className="loading">Загрузка...</div>;
  }

  const defaultIcon = organizationIcons.find((organization) => { return organization.orgType == 'DEFAULT'; });
  const iconsByType = organizationIcons.reduce((acc, icon) => {
    if (!acc[icon.orgType]) {
      acc[icon.orgType] = [];
    }
    acc[icon.orgType].push(icon);
    return acc;
  }, {} as Record<string, OrganizationIcon[]>);

  const coversByType = organizationCovers.reduce((acc, cover) => {
    const key = cover.orgType || '__generic__';
    if (!acc[key]) acc[key] = [];
    acc[key].push(cover);
    return acc;
  }, {} as Record<string, OrganizationCover[]>);

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
        <button
          className={activeTab === 'organizations' ? 'active' : ''}
          onClick={() => setActiveTab('organizations')}
        >
          Организации
        </button>
        <button
          className={activeTab === 'organization-images' ? 'active' : ''}
          onClick={() => setActiveTab('organization-images')}
        >
          Картинки
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

        {activeTab === 'organizations' && (
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Тип</th>
                  <th>Уровень</th>
                  <th>Руководитель</th>
                  <th>Сотрудников</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {organizations.flatMap(org => ([
                  { ...org, _isSubOrg: false, _indent: 0 },
                  ...(org.subOrganizations || []).map(sub => ({
                    ...sub,
                    _isSubOrg: true,
                    _indent: 1,
                    adminUsername: sub.adminUsername || org.adminUsername,
                  }))
                ])).map((org: any) => (
                  <tr key={`${org.id}-${org._isSubOrg ? 'sub' : 'root'}`}>
                    <td>{org.id}</td>
                    <td>
                      <span style={{ paddingLeft: `${org._indent * 16}px` }}>
                        {org._isSubOrg ? '└ ' : ''}{org.name}
                      </span>
                    </td>
                    <td>{org.orgType || 'Организация'}</td>
                    <td>{org._isSubOrg ? 'Подорганизация' : 'Организация'}</td>
                    <td>{org.adminUsername || '-'}</td>
                    <td>{org.membersCount || 0}</td>
                    <td className="actions">
                      <button
                        onClick={() => handleDeleteOrganization(org.id, org.name)}
                        className="btn-delete"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'organization-images' && (
          <div>
            <div className="admin-subtabs">
              <button className={imagesSubTab === 'icons' ? 'active' : ''} onClick={() => setImagesSubTab('icons')}>🎭 Иконки</button>
              <button className={imagesSubTab === 'covers' ? 'active' : ''} onClick={() => setImagesSubTab('covers')}>🖼️ Обложки</button>
            </div>

            {imagesSubTab === 'icons' && (
            <div className="admin-images-section">
              <div className="section-header">
                <h2>Изображения типов организаций</h2>
              </div>
              <div className="default-image-section">
                <h3>⭐ Изображение по умолчанию</h3>
                <div className="default-image-card">
                  <div className="image-preview default">
                    <img src={defaultIcon?.imageUrl ? getMediaUrl(defaultIcon.imageUrl) : "/image/organizations/default.jpg"} alt="По умолчанию" />
                  </div>
                  <div className="image-actions">
                    <button className="btn-edit" onClick={() => setEditingIcon(defaultIcon ?? null)}>✏️ Заменить</button>
                  </div>
                </div>
              </div>
              <div className="org-types-container">
                {ORG_TYPES.map((type: string) => {
                  const typeIcons = iconsByType[type] || [];
                  return (
                    <div className="org-type-group" key={type}>
                      <div className="org-type-header"><h3>{ORG_TO_ICON[type]} {type}</h3></div>
                      <div className="images-grid">
                        {typeIcons.map(icon => (
                          <div key={icon.id} className="image-card">
                            <div className="image-preview"><img src={getMediaUrl(icon.imageUrl)} alt={type} /></div>
                            <div className="image-actions">
                              <button className="btn-edit" onClick={() => setEditingIcon(icon)}>✏️</button>
                              <button className="btn-delete" onClick={() => handleDeleteIcon(icon.id)}>🗑️</button>
                            </div>
                          </div>
                        ))}
                        {typeIcons.length === 0 && <div className="empty-icons">Нет изображений</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="upload-section">
                <h3>📤 Загрузить новые иконки</h3>
                <div className="upload-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="create-org-type">Тип организации:</label>
                      <select id="create-org-type" className="org-type-select" value={newIconType} onChange={(e) => setNewIconType(e.target.value)}>
                        <option value="">Выберите тип</option>
                        {ORG_TYPES.map(type => <option key={type} value={type}>{ORG_TO_ICON[type]} {type}</option>)}
                      </select>
                    </div>
                  </div>
                  {newIconPreview && (
                    <div className="preview-section">
                      <h4>Предпросмотр ({newIconFiles.length} файл):</h4>
                      <div className="icon-preview-container"><img src={newIconPreview} alt="Preview" className="icon-preview-img" /></div>
                    </div>
                  )}
                  <div className="form-group">
                    <label htmlFor="create-image-file">Изображения (можно несколько):</label>
                    <div className="file-input-wrapper">
                      <input type="file" id="create-image-file" accept="image/*" multiple className="file-input-hidden" onChange={handleNewIconFileChange} />
                      <button className="btn-upload" type="button" onClick={() => document.getElementById('create-image-file')?.click()}>📁 Выбрать файлы</button>
                      <span className="file-name">{newIconFiles.length > 0 ? `${newIconFiles.length} файл(ов) выбрано` : 'Файлы не выбраны'}</span>
                    </div>
                    <small className="input-hint">Рекомендуемый размер: 400x300px, формат: JPG, PNG, макс. 10MB на файл</small>
                  </div>
                  <div className="upload-actions">
                    <button className="btn-primary" onClick={handleCreateIcon} disabled={!newIconType || newIconFiles.length === 0}>
                      Загрузить {newIconFiles.length > 1 ? `(${newIconFiles.length} шт.)` : ''}
                    </button>
                    <button className="btn-secondary" onClick={handleClearNewIcon}>Очистить</button>
                  </div>
                </div>
              </div>
            </div>
            )}

            {imagesSubTab === 'covers' && (
            <div className="admin-images-section">
              <div className="section-header">
                <h2>🖼️ Обложки организаций</h2>
                <p style={{color:'#64748b', marginTop: 4}}>Обложки по типам — показываются по умолчанию. Общие пресеты — организации могут выбрать сами.</p>
              </div>

              {/* Type-based default covers */}
              <div className="org-types-container">
                {ORG_TYPES.map(type => {
                  const typeCovers = coversByType[type] || [];
                  return (
                    <div className="org-type-group" key={type}>
                      <div className="org-type-header"><h3>{ORG_TO_ICON[type]} {type}</h3></div>
                      <div className="images-grid">
                        {typeCovers.map(cover => (
                          <div key={cover.id} className="image-card cover-card">
                            <div className="image-preview cover-preview"><img src={getMediaUrl(cover.imageUrl)} alt={type} /></div>
                            <div className="image-actions">
                              <button className="btn-delete" onClick={() => handleDeleteCover(cover.id)}>🗑️</button>
                            </div>
                          </div>
                        ))}
                        {typeCovers.length === 0 && <div className="empty-icons">Нет обложки</div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Generic preset covers */}
              <div className="org-type-group" style={{marginTop: '1.5rem'}}>
                <div className="org-type-header"><h3>🖼️ Общие пресеты (без типа)</h3></div>
                <div className="images-grid">
                  {(coversByType['__generic__'] || []).map(cover => (
                    <div key={cover.id} className="image-card cover-card">
                      <div className="image-preview cover-preview"><img src={getMediaUrl(cover.imageUrl)} alt="cover" /></div>
                      <div className="image-actions">
                        <button className="btn-delete" onClick={() => handleDeleteCover(cover.id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
                  {!(coversByType['__generic__']?.length) && <div className="empty-icons">Нет общих пресетов</div>}
                </div>
              </div>

              <div className="upload-section">
                <h3>📤 Загрузить обложку</h3>
                <div className="upload-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="cover-org-type">Тип организации (если обложка по умолчанию):</label>
                      <select id="cover-org-type" className="org-type-select" value={newCoverType} onChange={(e) => setNewCoverType(e.target.value)}>
                        <option value="">Общий пресет (без типа)</option>
                        {ORG_TYPES.map(type => <option key={type} value={type}>{ORG_TO_ICON[type]} {type}</option>)}
                      </select>
                    </div>
                  </div>
                  {newCoverPreviews.length > 0 && (
                    <div className="preview-section">
                      <h4>Предпросмотр ({newCoverFiles.length} файл):</h4>
                      <div className="images-grid preview-grid">
                        {newCoverPreviews.map((src, i) => (
                          <div key={i} className="image-card">
                            <div className="image-preview cover-preview"><img src={src} alt={`preview-${i}`} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="form-group">
                    <label htmlFor="create-cover-file">Обложки (можно несколько):</label>
                    <div className="file-input-wrapper">
                      <input type="file" id="create-cover-file" accept="image/*" multiple className="file-input-hidden" onChange={handleNewCoverFilesChange} />
                      <button className="btn-upload" type="button" onClick={() => document.getElementById('create-cover-file')?.click()}>📁 Выбрать файлы</button>
                      <span className="file-name">{newCoverFiles.length > 0 ? `${newCoverFiles.length} файл(ов) выбрано` : 'Файлы не выбраны'}</span>
                    </div>
                    <small className="input-hint">Рекомендуемый размер: 1280×400px, формат: JPG, PNG, макс. 10MB</small>
                  </div>
                  <div className="upload-actions">
                    <button className="btn-primary" onClick={handleCreateCovers} disabled={newCoverFiles.length === 0}>
                      Загрузить {newCoverType ? `(тип: ${newCoverType})` : '(общий пресет)'} {newCoverFiles.length > 1 ? `— ${newCoverFiles.length} шт.` : ''}
                    </button>
                    <button className="btn-secondary" onClick={() => { setNewCoverFiles([]); setNewCoverPreviews([]); setNewCoverType(''); const el = document.getElementById('create-cover-file') as HTMLInputElement; if(el) el.value=''; }}>Очистить</button>
                  </div>
                </div>
              </div>
            </div>
            )}

            <IconEditModal isOpen={!!editingIcon} icon={editingIcon} onClose={() => setEditingIcon(null)} onSave={handleUpdateIcon} />
          </div>
        )}
      </div>
    </div>
  );
}