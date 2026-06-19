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

const ORG_TYPES: string[] = ['Производственная', 'Коммерческая', 'Административная', 'Образовательная', 'Правительственная', 'Банковская', 'Волонтёрская', 'Спортивная', 'Свободная'];

const ORG_TO_ICON: Record<string, string> = {
  'Производственная': '🏭',
  'Коммерческая': '🏢',
  'Административная': '🏛️',
  'Образовательная': '🎓',
  'Правительственная': '🏛️',
  'Банковская': '🏦',
  'Волонтёрская': '🤝',
  'Спортивная': '🏆',
  'Свободная': '🌐',
  'Цех': '⚙️',
  'Отдел': '📋',
  'Мастерская': '🔧',
  'Магазин': '🛒',
  'Департамент': '🏛️',
  'Управление': '📑',
  'Филиал': '🏦',
  'Отделение': '💳',
  'Отряд': '👥',
  'Звено': '👤',
  'Факультет': '📚',
  'Кафедра': '🔬',
  'Сектор': '🔗',
  'Группа': '👫',
  'Раздел': '📌',
};

const ALL_ORGS_TYPES = [
  'Производственная', 
  'Коммерческая', 
  'Административная', 
  'Образовательная',
  'Правительственная', 
  'Банковская', 
  'Волонтёрская', 
  'Спортивная', 
  'Свободная',
  'Цех',
  'Отдел',
  'Мастерская',
  'Магазин',
  'Департамент',
  'Управление',
  'Филиал',
  'Отделение',
  'Отряд',
  'Звено',
  'Факультет',
  'Кафедра',
  'Сектор',
  'Группа',
  'Раздел'
];

export default function Admin() {


  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'stats' | 'organization-images' | 'organizations' | 'heroes' | 'finance' | 'chats'>('stats');
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
  const [rangs, setRangs] = useState<[]>([]);
  const [showStateHeroesModal, setShowStateHeroesModal] = useState(false);
  const [imageStateHero, setImageStateHero] = useState<File | null>(null);

  // Covers state
  const [organizationCovers, setOrganizationCovers] = useState<OrganizationCover[]>([]);
  const [newCoverFiles, setNewCoverFiles] = useState<File[]>([]);
  const [newCoverPreviews, setNewCoverPreviews] = useState<string[]>([]);
  const [newCoverType, setNewCoverType] = useState<string>('');
  const [imagesSubTab, setImagesSubTab] = useState<'icons' | 'covers'>('icons');

  // Длительность жизни сообщения
  const [messageLiveDuring, setMessageLiveDuring] = useState<number>(30);

  // Значения начальный балансов
  const [initialUserBalance, setInitialUserBalance] = useState<number>(0);
  const [initialOrgBalance, setInitialOrgBalance] = useState<number>(0);

  // Значение баланса правительства
  const [goverBalance, setGoverBalance] = useState<number>(0);

  // Значение суммы прибавки к балансу правительства
  const [addingGoverBalance, setAddingGoverBalance] = useState<number>(0);

  const [selectedRangId, setSelectedRangId] = useState<number | null>(null);
  const [isDefault, setIsDefault] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [selectedHero, setSelectedHero] = useState<any | null>(null);
  const [heroes, setHeroes] = useState<any[]>([]);
  const [showCreateHeroModal, setShowCreateHeroModal] = useState(false);
  const [newHeroName, setNewHeroName] = useState('');
  const [newHeroImage, setNewHeroImage] = useState<File | null>(null);
  const [newHeroPreview, setNewHeroPreview] = useState<string | null>(null);
  const [showDefaultImageModal, setShowDefaultImageModal] = useState(false);
  const [defaultImageFile, setDefaultImageFile] = useState<File | null>(null);
  const [defaultImagePreview, setDefaultImagePreview] = useState<string | null>(null);
  const [showEditStateModal, setShowEditStateModal] = useState(false);
  const [editingState, setEditingState] = useState<any>(null);
  const [editStateRangId, setEditStateRangId] = useState<number | null>(null);
  const [editStateImageFile, setEditStateImageFile] = useState<File | null>(null);
  const [editStateImagePreview, setEditStateImagePreview] = useState<string | null>(null);
  const [newHeroGender, setNewHeroGender] = useState<'M' | 'F' | ''>('');

  const handleDeleteHeroState = async (heroStateId: number) => {
    if (!confirm('Вы уверены, что хотите удалить это состояние?')) return;

    try {
      await axios.delete(`/api/admin/heroes/states/${heroStateId}`);
      alert('✅ Состояние удалено');

      if (selectedHero) {
        const updatedStates = selectedHero.states.filter((s: any) => s.id !== heroStateId);
        setSelectedHero({ ...selectedHero, states: updatedStates });
      }

      setHeroes(prev =>
        prev.map(hero =>
          hero.id === selectedHero?.id
            ? { ...hero, states: hero.states.filter((s: any) => s.id !== heroStateId) }
            : hero
        )
      );
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(error.response?.data?.error || 'Ошибка при удалении');
    }
  };

  const handleDeleteHero = async (heroId: number, heroName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить героя "${heroName}"? Все его состояния также будут удалены.`)) return;

    try {
      await axios.delete(`/api/admin/heroes/${heroId}`);
      alert('✅ Герой удалён');

      const updatedHeroes = heroes.filter(h => h.id !== heroId);
      setHeroes(updatedHeroes);

      if (selectedHero?.id === heroId) {
        setSelectedHero(updatedHeroes[0] || null);
      }

      fetchData();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(error.response?.data?.error || 'Ошибка при удалении героя');
    }
  };

  const handleEditState = (state: any) => {
    setEditingState(state);
    setEditStateRangId(state.minRangId);
    setEditStateImagePreview(state.imagePath);
    setShowEditStateModal(true);
  };

  const handleUpdateState = async () => {
    if (!editingState || !editStateRangId) {
      alert('Заполните все поля');
      return;
    }

    const formData = new FormData();
    formData.append('minRangId', String(editStateRangId));
    if (editStateImageFile) {
      formData.append('image', editStateImageFile);
    }

    try {
      await axios.put(`/api/admin/heroes/states/${editingState.id}`, formData);
      alert('✅ Состояние обновлено');
      setShowEditStateModal(false);
      setEditingState(null);
      setEditStateRangId(null);
      setEditStateImageFile(null);
      setEditStateImagePreview(null);
      fetchData();
    } catch (error: any) {
      console.error('Update error:', error);
      alert(error.response?.data?.error || 'Ошибка при обновлении');
    }
  };

  const handleSaveDefaultImage = async () => {
    if (!defaultImageFile || !selectedHero) return;

    const formData = new FormData();
    formData.append('defaultImage', defaultImageFile);
    formData.append('name', selectedHero.name);

    try {
      await axios.put(`/api/admin/heroes/${selectedHero.id}`, formData);
      setShowDefaultImageModal(false);
      setDefaultImageFile(null);
      setDefaultImagePreview(null);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при обновлении');
    }
  };

  const handleCreateHero = async () => {
    if (!newHeroName.trim()) {
      alert('Введите имя героя');
      return;
    }

    const formData = new FormData();
    formData.append('name', newHeroName.trim());
    formData.append('gender', newHeroGender);
    if (newHeroImage) formData.append('defaultImage', newHeroImage);

    try {
      await axios.post('/api/admin/heroes', formData);
      alert('✅ Герой успешно создан');
      setShowCreateHeroModal(false);
      setNewHeroName('');
      setNewHeroImage(null);
      setNewHeroPreview(null);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при создании героя');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageStateHero(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveState = async () => {
    if (!selectedRangId || !imageStateHero) {
      alert('Заполните все поля');
      return;
    }

    const formData = new FormData();
    formData.append('rangId', String(selectedRangId));
    formData.append('image', imageStateHero);
    formData.append('isDefault', String(isDefault));

    try {
      await axios.post(`/api/admin/heroes/${selectedHero.id}/states`, formData);
      alert('Состояние добавлено');
      setShowStateHeroesModal(false);
      setSelectedRangId(null);
      setImageStateHero(null);
      setImagePreview(null);
      setIsDefault(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save state:', error);
      alert('Ошибка при сохранении');
    }
  };

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

      else if (activeTab === 'finance') {
          const responseUser = await axios.get('/api/admin/initial-balances/user');
          setInitialUserBalance(parseInt(responseUser.data.balance) / 100);

          const responseOrg = await axios.get('/api/admin/initial-balances/org');
          setInitialOrgBalance(parseInt(responseOrg.data.balance) / 100);

          const responseGoverBalance = await axios.get('/api/organizations/governement/balance');
          setGoverBalance(parseInt(responseGoverBalance.data.balance) / 100);
      }

      else if (activeTab === 'heroes') {
        const [rangsResult, heroesResult] = await Promise.all([
          axios.get('/api/rangs'),
          axios.get('/api/admin/heroes'),
        ]);

        if (heroesResult.data.heroes && 0 < heroesResult.data.heroes.length) {
          setSelectedHero(heroesResult.data.heroes[0]);
        }

        setRangs(rangsResult.data.rangs.items || []);
        setHeroes(heroesResult.data.heroes);

      }

      else if (activeTab === 'chats') {
        const response = await axios.get('/api/messages/live-during');
        setMessageLiveDuring(response.data.liveDuringDays);
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

  const handleGovernmentOrgAccess = async (userId: number, enabled: boolean) => {
    try {
      await axios.post(`/api/admin/users/${userId}/government-org-access`, {
        canCreateGovernmentOrganizations: enabled,
      });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при обновлении доступа');
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

  const requestInitialUserBalanceUpdate = async (e: any) => {
    let newBalance = e.target.value;

    if (newBalance == '') {
      newBalance = 0;
      setInitialUserBalance(0);
    }

    axios.post('/api/admin/initial-balances/user', {
      newBalance: newBalance * 100
    });
  }

  const handleInitialUserBalanceChange = (e: any) => {
    const newBalance = e.target.value;

    setInitialUserBalance(newBalance);
  }

  const requestInitialOrgBalanceUpdate = async (e: any) => {
    let newBalance = e.target.value;

    if (newBalance == '') {
      newBalance = 0;
      setInitialOrgBalance(0);
    }

    axios.post('/api/admin/initial-balances/org', {
      newBalance: newBalance * 100
    });
  }

  const handleInitialOrgBalanceChange = (e: any) => {
    const newBalance = e.target.value;

    setInitialOrgBalance(newBalance);
  }

  const handleChangeAddingGoverBalance = (e: any) => {
    const adding = e.target.value;
    setAddingGoverBalance(adding);
  }

  const handleFetchAddingGoverBalance = async (e: any) => {
    const adding = e.target.value * 100;

    axios.post('/api/organizations/governement/balance/adding', {
      adding: adding
    });

    const responseGoverBalance = await axios.get('/api/organizations/governement/balance');
    setGoverBalance(parseInt(responseGoverBalance.data.balance) / 100);

    setAddingGoverBalance(0);
  }

  const handleChangeNewMessageLiveDuring = (e: any) => {
    const newValue = e.target.value;
    setMessageLiveDuring(newValue);
  }

  const handleFetchNewMessageLiveDuring = async (e: any) => {
    const newDuring = e.target.value;

    axios.post('/api/messages/live-during', {
      newDuring: newDuring
    });
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

        <button
          className={activeTab === 'finance' ? 'active' : ''}
          onClick={() => setActiveTab('finance')}
        >
          Финансы
        </button>

        <button
          className={activeTab === 'heroes' ? 'active' : ''}
          onClick={() => setActiveTab('heroes')}
        >
          Герои
        </button>

        <button
          className={activeTab === 'chats' ? 'active' : ''}
          onClick={() => setActiveTab('chats')}
        >
          Чаты
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
                  <th>Создание правительственных организаций</th>
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
                      <label className="checkbox-label" style={{ justifyContent: 'center' }}>
                        <input
                          type="checkbox"
                          checked={user.canCreateGovernmentOrganizations === 1}
                          onChange={(e) => handleGovernmentOrgAccess(user.id, e.target.checked)}
                        />
                        <span>Разрешено</span>
                      </label>
                    </td>
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
                  <p style={{ color: '#B0B0B0', marginTop: 4 }}>Обложки по типам — показываются по умолчанию. Общие пресеты — организации могут выбрать сами.</p>
                </div>

                {/* Type-based default covers */}
                <div className="org-types-container">
                  {ALL_ORGS_TYPES.map(type => {
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
                <div className="org-type-group" style={{ marginTop: '1.5rem' }}>
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
                          {ALL_ORGS_TYPES.map(type => <option key={type} value={type}>{ORG_TO_ICON[type]} {type}</option>)}
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
                      <button className="btn-secondary" onClick={() => { setNewCoverFiles([]); setNewCoverPreviews([]); setNewCoverType(''); const el = document.getElementById('create-cover-file') as HTMLInputElement; if (el) el.value = ''; }}>Очистить</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <IconEditModal isOpen={!!editingIcon} icon={editingIcon} onClose={() => setEditingIcon(null)} onSave={handleUpdateIcon} />
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="initial-balances-params">
            <h2>Начальные балансы</h2>

            <div className="intial-balance-wrapper">
              <label 
                htmlFor="initial-balance-label"
                className="initial-balance-label"
              >
                Пользователя: 
              </label>
              <input 
                type="number" 
                step="any"
                name="initial-user-balance"
                value={initialUserBalance}
                onChange={handleInitialUserBalanceChange}
                onBlur={requestInitialUserBalanceUpdate}
              />
            </div>

            <div className="intial-balance-wrapper">
              <label 
                htmlFor="initial-balance-label"
                className="initial-balance-label"
              >
                Организация: 
              </label>
              <input 
                type="number" 
                step="any"
                name="initial-user-balance"
                value={initialOrgBalance}
                onChange={handleInitialOrgBalanceChange}
                onBlur={requestInitialOrgBalanceUpdate}
              />
            </div>

            <h2 style={{marginTop: '30px'}}>Правительство</h2>
            <div className="adding-to-gover-balance-wrapper">
              <div className="intial-balance-wrapper">
                <label 
                  htmlFor="initial-balance-label"
                  className="initial-balance-label"
                >
                  Текущий баланс: 
                </label>
                <input 
                  type="number" 
                  step="any"
                  name="initial-user-balance"
                  value={goverBalance}
                  readOnly
                />
              </div>

              <div className="intial-balance-wrapper">
                <label 
                  htmlFor="initial-balance-label"
                  className="initial-balance-label"
                >
                  Начислить: 
                </label>
                <input 
                  type="number" 
                  step="any"
                  name="initial-user-balance"
                  value={addingGoverBalance}
                  onChange={handleChangeAddingGoverBalance}
                  onBlur={handleFetchAddingGoverBalance}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'heroes' && (
          <div className="heroes-simple">
            <div className="heroes-actions">
              <button className="btn-add-hero" onClick={() => setShowCreateHeroModal(true)}>+ Добавить героя</button>
            </div>

            <div className="heroes-two-columns">
              <div className="heroes-list-col">
                <div className="heroes-items">

                  {
                    heroes.map(hero =>
                      <div
                        className={"hero-item-simple " + (selectedHero?.id === hero.id ? "active" : "")}
                        key={hero.id}
                        onClick={() => setSelectedHero(hero)}
                      >
                        <div className="hero-name-simple">{hero.name}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                            {hero.gender === 'M' ? '♂ Мужской' : hero.gender === 'F' ? '♀ Женский' : '⚬ Не указан'}
                          </div>
                        </div>
                        <button
                          className="hero-delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteHero(hero.id, hero.name);
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    )
                  }
                </div>
              </div>

              <div className="hero-editor-col">
                <div className="editor-header">
                  <h2>Редактор: {selectedHero?.name ?? ""}</h2>
                </div>

                <div className="editor-section">
                  <h3>⭐ Изображение по умолчанию</h3>
                  <div className="default-image-row">
                    <div className="default-preview">
                      <img
                        src={selectedHero?.defaultImagePath}
                        alt="Default"
                      />
                    </div>
                    <div className="default-actions">
                      <button
                        className="btn-upload-default"
                        onClick={() => setShowDefaultImageModal(true)}
                      >
                        📁 Загрузить
                      </button>
                    </div>
                  </div>
                </div>

                <div className="editor-section">
                  <div className="section-title">
                    <h3>🎨 Состояния по рангам</h3>
                    <button className="btn-add-state-simple" onClick={() => { setShowStateHeroesModal(true); }}>+ Добавить</button>
                  </div>

                  <div className="states-list">
                    {
                      selectedHero?.states && 0 < selectedHero?.states.length ?
                        selectedHero.states.map(state =>
                          <div className="state-row" key={state.id}>
                            <div className="state-rank">{rangs.find(rang => { return rang.id == state.minRangId; }).name}</div>
                            <div className="state-image-preview">
                              <img src={state.imagePath} alt="Rank1" />
                            </div>
                            <div className="state-actions">
                              <button
                                className="btn-edit-state"
                                onClick={() => handleEditState(state)}
                              >
                                ✏️
                              </button>
                              <button
                                className="btn-delete-state"
                                onClick={() => {
                                  handleDeleteHeroState(state.id);
                                }}
                              >🗑️</button>
                            </div>
                          </div>
                        )
                        : ""
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="initial-balances-params">
            <h2>Чаты</h2>

            <div className="intial-balance-wrapper">
              <label 
                htmlFor="initial-balance-label"
                className="initial-balance-label"
              >
                Срок жизни сообщения, дни: 
              </label>
              <input 
                type="number" 
                step="any"
                name="initial-user-balance"
                value={messageLiveDuring}
                onChange={handleChangeNewMessageLiveDuring}
                onBlur={handleFetchNewMessageLiveDuring}
              />
            </div>
          </div>
        )}

        {showStateHeroesModal && (
          <div className="modal-simple">
            <div className="modal-simple-content">
              <h3>Добавить состояние</h3>

              <div className="modal-field">
                <label>Ранг</label>
                <select
                  name='rangId'
                  value={selectedRangId || ''}
                  onChange={(e) => setSelectedRangId(Number(e.target.value))}
                >
                  <option value="">Выберите ранг</option>
                  {rangs.map(rang => (
                    <option value={rang.id} key={rang.id}>{rang.name}</option>
                  ))}
                </select>
              </div>

              <div className="modal-field">
                <label>Изображение</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-preview-mini">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="modal-buttons">
                <button className="btn-save" onClick={handleSaveState}>Сохранить</button>
                <button className="btn-cancel" onClick={() => {
                  setShowStateHeroesModal(false);
                  setSelectedRangId(null);
                  setImageStateHero(null);
                  setImagePreview(null);
                  setIsDefault(false);
                }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {showCreateHeroModal && (
          <div className="rzz-admin-hero-modal-overlay" onClick={() => setShowCreateHeroModal(false)}>
            <div className="rzz-admin-hero-modal" onClick={e => e.stopPropagation()}>
              <div className="rzz-admin-hero-modal-header">
                <h3>➕ Создать нового героя</h3>
                <button className="rzz-admin-hero-modal-close" onClick={() => setShowCreateHeroModal(false)}>✕</button>
              </div>

              <div className="rzz-admin-hero-modal-body">
                <div className="rzz-admin-hero-form-group">
                  <label>Имя героя <span className="rzz-admin-hero-required">*</span></label>
                  <input
                    type="text"
                    className="rzz-admin-hero-input"
                    placeholder="Например: LINTIAL, OMEGA, VOID"
                    value={newHeroName}
                    onChange={e => setNewHeroName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="rzz-admin-hero-form-group">
                  <label>Изображение по умолчанию</label>
                  <div className="rzz-admin-hero-file-area">
                    <input
                      type="file"
                      id="rzz-hero-default-image"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewHeroImage(file);
                          setNewHeroPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="rzz-admin-hero-btn-upload"
                      onClick={() => document.getElementById('rzz-hero-default-image')?.click()}
                    >
                      📁 Выбрать файл
                    </button>
                    <span className="rzz-admin-hero-file-hint">PNG, JPG до 10MB</span>
                  </div>
                  {newHeroPreview && (
                    <div className="rzz-admin-hero-preview">
                      <img src={newHeroPreview} alt="Preview" />
                      <button
                        className="rzz-admin-hero-preview-remove"
                        onClick={() => {
                          setNewHeroImage(null);
                          setNewHeroPreview(null);
                          const input = document.getElementById('rzz-hero-default-image') as HTMLInputElement;
                          if (input) input.value = '';
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="rzz-admin-hero-form-group">
                  <label>Пол героя <span className="rzz-admin-hero-required">*</span></label>
                  <select
                    className="rzz-admin-hero-input"
                    value={newHeroGender}
                    onChange={(e) => setNewHeroGender(e.target.value)}
                  >
                    <option value={''}>Не указано</option>
                    <option value={'M'}>Мужской</option>
                    <option value={'F'}>Женский</option>
                  </select>
                </div>
              </div>

              <div className="rzz-admin-hero-modal-footer">
                <button
                  className="rzz-admin-hero-btn-cancel"
                  onClick={() => {
                    setShowCreateHeroModal(false);
                    setNewHeroName('');
                    setNewHeroGender('');
                    setNewHeroImage(null);
                    setNewHeroPreview(null);
                  }}
                >
                  Отмена
                </button>
                <button
                  className="rzz-admin-hero-btn-create"
                  onClick={handleCreateHero}
                  disabled={!newHeroName.trim()}
                >
                  Создать героя
                </button>
              </div>
            </div>
          </div>
        )}

        {showDefaultImageModal && (
          <div className="rzz-admin-hero-modal-overlay" onClick={() => setShowDefaultImageModal(false)}>
            <div className="rzz-admin-hero-modal" style={{ maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
              <div className="rzz-admin-hero-modal-header">
                <h3>🖼️ Изменить изображение по умолчанию</h3>
                <button className="rzz-admin-hero-modal-close" onClick={() => setShowDefaultImageModal(false)}>✕</button>
              </div>

              <div className="rzz-admin-hero-modal-body">
                <div className="rzz-admin-hero-form-group">
                  <label>Текущее изображение</label>
                  <div className="rzz-admin-hero-current-image">
                    <img
                      src={selectedHero?.defaultImagePath ? getMediaUrl(selectedHero.defaultImagePath) : '/placeholder.png'}
                      alt="Current"
                      className='rzz-admin-hero-preview-default-image'
                    />
                  </div>
                </div>

                <div className="rzz-admin-hero-form-group">
                  <label>Новое изображение</label>
                  <div className="rzz-admin-hero-file-area">
                    <input
                      type="file"
                      id="hero-default-update"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDefaultImageFile(file);
                          setDefaultImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="rzz-admin-hero-btn-upload"
                      onClick={() => document.getElementById('hero-default-update')?.click()}
                    >
                      📁 Выбрать файл
                    </button>
                  </div>
                  {defaultImagePreview && (
                    <div className="rzz-admin-hero-preview">
                      <img src={defaultImagePreview} alt="Preview" />
                      <button
                        className="rzz-admin-hero-preview-remove"
                        onClick={() => {
                          setDefaultImageFile(null);
                          setDefaultImagePreview(null);
                          const input = document.getElementById('hero-default-update') as HTMLInputElement;
                          if (input) input.value = '';
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="rzz-admin-hero-modal-footer">
                <button className="rzz-admin-hero-btn-cancel" onClick={() => setShowDefaultImageModal(false)}>
                  Отмена
                </button>
                <button
                  className="rzz-admin-hero-btn-create"
                  onClick={handleSaveDefaultImage}
                  disabled={!defaultImageFile}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditStateModal && editingState && (
          <div className="rzz-admin-hero-modal-overlay" onClick={() => setShowEditStateModal(false)}>
            <div className="rzz-admin-hero-modal" style={{ maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
              <div className="rzz-admin-hero-modal-header">
                <h3>✏️ Редактировать состояние</h3>
                <button className="rzz-admin-hero-modal-close" onClick={() => setShowEditStateModal(false)}>✕</button>
              </div>

              <div className="rzz-admin-hero-modal-body">
                <div className="rzz-admin-hero-form-group">
                  <label>Ранг</label>
                  <select
                    className="rzz-admin-hero-input"
                    value={editStateRangId || ''}
                    onChange={(e) => setEditStateRangId(Number(e.target.value))}
                  >
                    <option value="">Выберите ранг</option>
                    {rangs.map(rang => (
                      <option key={rang.id} value={rang.id}>{rang.name}</option>
                    ))}
                  </select>
                </div>

                <div className="rzz-admin-hero-form-group">
                  <label>Текущее изображение</label>
                  <div className="rzz-admin-hero-current-image-state">
                    <img src={editStateImagePreview || '/placeholder.png'} alt="Current" />
                  </div>
                </div>

                <div className="rzz-admin-hero-form-group">
                  <label>Новое изображение (опционально)</label>
                  <div className="rzz-admin-hero-file-area">
                    <input
                      type="file"
                      id="state-image-update"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setEditStateImageFile(file);
                          setEditStateImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="rzz-admin-hero-btn-upload"
                      onClick={() => document.getElementById('state-image-update')?.click()}
                    >
                      📁 Выбрать файл
                    </button>
                  </div>
                  {editStateImageFile && (
                    <div className="rzz-admin-hero-preview">
                      <img src={editStateImagePreview} alt="Preview" />
                      <button
                        className="rzz-admin-hero-preview-remove"
                        onClick={() => {
                          setEditStateImageFile(null);
                          setEditStateImagePreview(null);
                          const input = document.getElementById('state-image-update') as HTMLInputElement;
                          if (input) input.value = '';
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="rzz-admin-hero-modal-footer">
                <button className="rzz-admin-hero-btn-cancel" onClick={() => setShowEditStateModal(false)}>
                  Отмена
                </button>
                <button className="rzz-admin-hero-btn-create" onClick={handleUpdateState}>
                  Сохранить изменения
                </button>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}