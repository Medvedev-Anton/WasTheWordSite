import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Organization } from '../types';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { getMediaUrl } from '../config';

import './Organizations.css';
import AddressInput from '../components/AddressInput';

const ROOT_ORG_TYPES = ['Производственная', 'Коммерческая', 'Административная', 'Образовательная', 'Свободная'];

const ORG_TYPE_ICONS: Record<string, string> = {
  'Производственная': '🏭',
  'Коммерческая': '🏢',
  'Административная': '🏛️',
  'Образовательная': '🎓',
  'Свободная': '🌐',
  'Цех': '⚙️',
  'Отдел': '📋',
  'Мастерская': '🔧',
  'Магазин': '🛒',
  'Отряд': '👥',
  'Звено': '👤',
  'Факультет': '📚',
  'Кафедра': '🔬',
  'Сектор': '🔗',
};

interface OrganizationIcon {
  id: number;
  orgType: string;
  imageUrl: string;
}

export default function Organizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [inputMode, setInputMode] = useState("address");
  const [address, setAddress] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  const location = useLocation();
  useEffect(() => {
    if (location.state?.selectOrganizationFromMap) {
      const orgFromMap = location.state.selectOrganizationFromMap;
      handleSelectOrg(orgFromMap.id);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const onSelectAddress = (address: string, coordinate: [number, number]) => {
    setAddress(address);
    setLatitude(coordinate[0].toString());
    setLongitude(coordinate[1].toString());
  };

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get('/api/organizations');
      setOrganizations(response.data);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const avatar = formData.get('avatar') as File;
    const coverImage = formData.get('coverImage') as File;
    const orgType = formData.get('orgType') as string;
    const defaultCanPost = (e.currentTarget.querySelector('[name="defaultCanPost"]') as HTMLInputElement)?.checked;
    const defaultCanComment = (e.currentTarget.querySelector('[name="defaultCanComment"]') as HTMLInputElement)?.checked;
    const isPrivate = (e.currentTarget.querySelector('[name="isPrivate"]') as HTMLInputElement)?.checked;
    const organizationIconId = selectedIconId?.toString();

    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('orgType', orgType);
    data.append('defaultCanPost', defaultCanPost.toString());
    data.append('defaultCanComment', defaultCanComment.toString());
    data.append('isPrivate', isPrivate.toString());
    data.append('longitude', longitude);
    data.append('latitude', latitude);
    data.append('organizationIconId', organizationIconId ?? "");

    if (avatar && avatar.size > 0) {
      data.append('avatar', avatar);
    }
    if (coverImage && coverImage.size > 0) {
      data.append('coverImage', coverImage);
    }

    try {
      await axios.post('/api/organizations', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowCreateModal(false);
      fetchOrganizations();
    } catch (error) {
      console.error('Failed to create organization:', error);
      alert('Ошибка при создании организации');
    }
  };

  const handleSelectOrg = async (orgId: number) => {
    try {
      const response = await axios.get(`/api/organizations/${orgId}`);
      setSelectedOrg(response.data);
    } catch (error) {
      console.error('Failed to fetch organization:', error);
    }
  };

  const handleJoin = async (orgId: number) => {
    try {
      await axios.post(`/api/organizations/${orgId}/join`);
      handleSelectOrg(orgId);
      fetchOrganizations();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при вступлении');
    }
  };

  const handleLeave = async (orgId: number) => {
    try {
      await axios.post(`/api/organizations/${orgId}/leave`);
      handleSelectOrg(orgId);
      fetchOrganizations();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при выходе');
    }
  };

  const [selectedType, setSelectedType] = useState('Производственная');
  const [selectedIconId, setSelectedIconId] = useState<number | null>(null);
  const [organizationIcons, setOrganizationIcons] = useState<OrganizationIcon[]>([]);
  useEffect(() => {
    fetchIcons();
  }, []);

  const fetchIcons = async () => {
    try {
      const response = await axios.get('/api/organizations/icons');
      setOrganizationIcons(response.data.icons);
    } catch (error) {
      console.error('Failed to fetch icons:', error);
    }
  };
  const iconsByType = organizationIcons.reduce((acc, icon) => {
    if (!acc[icon.orgType]) {
      acc[icon.orgType] = [];
    }
    acc[icon.orgType].push(icon);
    return acc;
  }, {} as Record<string, OrganizationIcon[]>);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (selectedOrg) {
    return (
      <OrganizationDetail
        organization={selectedOrg}
        onBack={() => { setSelectedOrg(null); fetchOrganizations(); }}
        onUpdate={handleSelectOrg}
        currentUserId={user?.id || 0}
        onNavigateToOrg={handleSelectOrg}
      />
    );
  }

  return (
    <div className="organizations-page">
      <div className="organizations-header">
        <h2>Организации</h2>
        <button onClick={() => setShowCreateModal(true)} className="create-btn">
          + Создать организацию
        </button>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => { setShowCreateModal(false); setAddress(""); setLatitude(""); setLongitude(""); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Создать организацию</h3>
            <form onSubmit={handleCreateOrg}>
              <input type="text" name="name" placeholder="Название *" required />
              <textarea name="description" placeholder="Описание" rows={4} />

              <div className="org-locations">
                <div className="input-mode-toggle">
                  <button
                    type="button"
                    className={`mode-btn ${inputMode === 'address' ? 'active' : ''}`}
                    onClick={() => setInputMode('address')}
                  >
                    <span className="mode-icon">📍</span>
                    Поиск по адресу
                  </button>
                  <button
                    type="button"
                    className={`mode-btn ${inputMode === 'manual' ? 'active' : ''}`}
                    onClick={() => setInputMode('manual')}
                  >
                    <span className="mode-icon">✏️</span>
                    Ввести координаты
                  </button>
                </div>

                {inputMode === 'address' && (
                  <div className="address-mode">
                    <AddressInput
                      onSelectAddress={onSelectAddress}
                      placeholder="Введите адрес"
                      onTextChange={(text: string) => { setAddress(text); }}
                    />
                  </div>
                )}

                {inputMode === 'manual' && (
                  <div className="manual-mode">
                    <div className="coordinate-group">
                      <label className="coordinate-label">
                        <span>Долгота</span>
                        <input
                          type="number"
                          name="longitude"
                          required
                          min={-180}
                          max={180}
                          step={"any"}
                          placeholder="Пример: 37.617635"
                          value={longitude ?? ""}
                          onChange={(e) => setLongitude(e.target.value)}
                        />
                      </label>
                      <label className="coordinate-label">
                        <span>Широта</span>
                        <input
                          type="number"
                          name="latitude"
                          required
                          min={-90}
                          max={90}
                          step={"any"}
                          placeholder="Пример: 55.755814"
                          value={latitude ?? ""}
                          onChange={(e) => setLatitude(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="coordinate-hint">
                      💡 Координаты можно скопировать с <a href="https://yandex.ru/maps" target="_blank" rel="noopener noreferrer">Яндекс.Карт</a>
                    </div>
                  </div>
                )}
              </div>

              <label>
                Тип организации:
                <select name="orgType" className="org-type-select"
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setSelectedIconId(null);
                  }}
                >
                  {ROOT_ORG_TYPES.map(t => (
                    <option key={t} value={t}>{ORG_TYPE_ICONS[t]} {t}</option>
                  ))}
                </select>
              </label>

              {selectedType && iconsByType[selectedType]?.length > 0 && (
                <div className="org-icon-selector">
                  <h4>Выберите иконку для организации:</h4>
                  <div className="icon-grid">
                    {iconsByType[selectedType].map(icon => (
                      <div
                        key={icon.id}
                        className={`icon-option ${selectedIconId === icon.id ? 'selected' : ''}`}
                        onClick={() => setSelectedIconId(icon.id)}
                      >
                        <div className="icon-preview">
                          <img src={getMediaUrl(icon.imageUrl)} alt={selectedType} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedType && (!iconsByType[selectedType] || iconsByType[selectedType].length === 0) && (
                <div className="no-icons-warning">
                  <p>⚠️ Для типа "{selectedType}" пока нет иконок. Будет использована иконка по умолчанию.</p>
                </div>
              )}

              <label>
                Аватар:
                <input type="file" name="avatar" accept="image/*" />
              </label>
              {user?.role === 'admin' && (
                <label>
                  Обложка (только для администраторов сайта):
                  <input type="file" name="coverImage" accept="image/*" />
                </label>
              )}
              <div className="org-settings">
                <h4>Настройки по умолчанию для новых сотрудников:</h4>
                <label className="checkbox-label">
                  <input type="checkbox" name="defaultCanPost" defaultChecked />
                  <span>Все новые пользователи могут создавать посты</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="defaultCanComment" defaultChecked />
                  <span>Все новые пользователи могут писать комментарии</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="isPrivate" />
                  <span>Закрытая организация (только по приглашениям)</span>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>Отмена</button>
                <button type="submit">Создать</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="organizations-grid">
        {organizations.length === 0 ? (
          <div className="empty-state">Пока нет организаций</div>
        ) : (
          organizations.map(org => (
            <div key={org.id} className="organization-card" onClick={() => handleSelectOrg(org.id)}>
              <div
                className={`org-card-cover ${org.coverImage ? 'has-cover' : ''}`}
                style={org.coverImage ? { backgroundImage: `url(${getMediaUrl(org.coverImage)})` } : undefined}
              >
                {!org.coverImage && <span>Обложка организации</span>}
              </div>
              {org.avatar ? (
                <img src={getMediaUrl(org.avatar)} alt={org.name} className="org-avatar" />
              ) : (
                <div className="org-avatar-placeholder">{ORG_TYPE_ICONS[org.orgType || ''] || '🏢'}</div>
              )}
              <div className="org-card-type-badge">{org.orgType || 'Организация'}</div>
              <h3>{org.name}</h3>
              <p>{org.description || 'Нет описания'}</p>
              <div className="org-info">
                <span>👥 {org.membersCount} сотрудников</span>
                <span>👤 Руководитель: {org.adminUsername}</span>
                {org.isPrivate ? <span className="org-private-badge">🔒 Закрытая</span> : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function OrganizationDetail({
  organization,
  onBack,
  onUpdate,
  currentUserId,
  onNavigateToOrg,
}: {
  organization: Organization;
  onBack: () => void;
  onUpdate: (id: number) => void;
  currentUserId: number;
  onNavigateToOrg: (id: number) => void;
}) {
  const { user } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'members' | 'settings'>('posts');
  const [editingOrg, setEditingOrg] = useState(false);
  const [orgFormData, setOrgFormData] = useState({
    name: organization.name,
    description: organization.description || '',
    defaultCanPost: organization.defaultCanPost === 1,
    defaultCanComment: organization.defaultCanComment === 1,
    isPrivate: organization.isPrivate === 1,
    longitude: organization.longitude,
    latitude: organization.latitude
  });
  const [orgAvatarFile, setOrgAvatarFile] = useState<File | null>(null);
  const [orgCoverFile, setOrgCoverFile] = useState<File | null>(null);
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [showCreateSubOrg, setShowCreateSubOrg] = useState(false);
  const [subOrgName, setSubOrgName] = useState('');
  const [subOrgDesc, setSubOrgDesc] = useState('');
  const [subOrgCoverFile, setSubOrgCoverFile] = useState<File | null>(null);
  const [subOrgCreating, setSubOrgCreating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  const navigate = useNavigate();

  const ORG_HIERARCHY: Record<string, string> = {
    'Производственная': 'Цех',
    'Коммерческая': 'Магазин',
    'Административная': 'Отдел',
    'Образовательная': 'Факультет',
    'Свободная': 'Отряд',
    'Цех': 'Мастерская',
    'Отдел': 'Сектор',
    'Факультет': 'Кафедра',
    'Отряд': 'Звено',
  };

  const isMember = organization.members?.some(m => m.userId === currentUserId);
  const isAdmin = organization.adminId === currentUserId;
  const isGlobalAdmin = user?.role === 'admin';
  const canDeleteOrganization = isAdmin || isGlobalAdmin;
  const canAccessSettings = isAdmin || isGlobalAdmin;
  const isModerator = organization.members?.some(
    m => m.userId === currentUserId && (m.role === 'moderator' || m.role === 'admin')
  );
  const currentMember = organization.members?.find(m => m.userId === currentUserId);
  const canPost = isAdmin || (isMember && currentMember?.canPost === 1 && !currentMember?.isBlocked);
  const subOrgType = ORG_HIERARCHY[organization.orgType || ''] || null;

  // Correct Russian forms for sub-org type names
  const SUB_ORG_PLURAL: Record<string, string> = {
    'Цех': 'Цехи', 'Отдел': 'Отделы', 'Факультет': 'Факультеты',
    'Кафедра': 'Кафедры', 'Отряд': 'Отряды', 'Звено': 'Звенья',
    'Мастерская': 'Мастерские', 'Магазин': 'Магазины', 'Сектор': 'Сектора',
  };
  const SUB_ORG_GENITIVE: Record<string, string> = {
    'Цех': 'цехов', 'Отдел': 'отделов', 'Факультет': 'факультетов',
    'Кафедра': 'кафедр', 'Отряд': 'отрядов', 'Звено': 'звеньев',
    'Мастерская': 'мастерских', 'Магазин': 'магазинов', 'Сектор': 'секторов',
  };
  const SUB_ORG_GENITIVE_SINGLE: Record<string, string> = {
    'Цех': 'цех', 'Отдел': 'отдел', 'Факультет': 'факультет',
    'Кафедра': 'кафедру', 'Отряд': 'отряд', 'Звено': 'звено',
    'Мастерская': 'мастерскую', 'Магазин': 'магазин', 'Сектор': 'сектор',
  };

  const handleJoin = async () => {
    try {
      await axios.post(`/api/organizations/${organization.id}/join`);
      onUpdate(organization.id);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка');
    }
  };

  const handleLeave = async () => {
    try {
      await axios.post(`/api/organizations/${organization.id}/leave`);
      onUpdate(organization.id);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка');
    }
  };

  const handleDeleteOrg = async () => {
    try {
      await axios.delete(`/api/organizations/${organization.id}`);
      setShowDeleteModal(false);
      onBack();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении организации');
    }
  };

  const handleSaveOrg = async () => {
    try {
      const formData = new FormData();
      formData.append('name', orgFormData.name);
      formData.append('description', orgFormData.description);
      formData.append('defaultCanPost', orgFormData.defaultCanPost.toString());
      formData.append('defaultCanComment', orgFormData.defaultCanComment.toString());
      formData.append('isPrivate', orgFormData.isPrivate.toString());
      formData.append('longitude', (longitude ?? 0).toString());
      formData.append('latitude', (latitude ?? 0).toString());
      formData.append('organizationIconId', (selectedIconId ?? 1).toString());
      if (orgAvatarFile) {
        formData.append('avatar', orgAvatarFile);
      }
      if (orgCoverFile) {
        formData.append('coverImage', orgCoverFile);
      }

      await axios.put(`/api/organizations/${organization.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEditingOrg(false);
      onUpdate(organization.id);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при обновлении организации');
    }
  };

  const handleUpdateMemberPermissions = async (memberId: number, permissions: {
    canPost?: boolean;
    canComment?: boolean;
    isBlocked?: boolean;
  }) => {
    try {
      await axios.put(`/api/organizations/${organization.id}/members/${memberId}/permissions`, permissions);
      setEditingMember(null);
      onUpdate(organization.id);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при обновлении прав');
    }
  };

  const handleKickMember = async (memberId: number) => {
    if (!confirm('Выгнать пользователя из организации?')) return;
    try {
      await axios.delete(`/api/organizations/${organization.id}/members/${memberId}`);
      onUpdate(organization.id);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении участника');
    }
  };

  const handleInvite = async () => {
    if (!inviteUsername.trim()) return;
    setInviteError('');
    try {
      await axios.post(`/api/organizations/${organization.id}/invite`, { username: inviteUsername.trim() });
      setInviteUsername('');
      onUpdate(organization.id);
    } catch (error: any) {
      setInviteError(error.response?.data?.error || 'Ошибка при приглашении');
    }
  };

  const handleCreateSubOrg = async () => {
    if (!subOrgName.trim()) return;
    setSubOrgCreating(true);
    try {
      const data = new FormData();
      data.append('name', subOrgName.trim());
      data.append('description', subOrgDesc.trim());
      data.append('parentId', organization.id.toString());
      data.append('defaultCanPost', 'true');
      data.append('defaultCanComment', 'true');
      data.append('isPrivate', 'false');
      if (subOrgCoverFile) {
        data.append('coverImage', subOrgCoverFile);
      }

      await axios.post('/api/organizations', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowCreateSubOrg(false);
      setSubOrgName('');
      setSubOrgDesc('');
      setSubOrgCoverFile(null);
      onUpdate(organization.id);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при создании подорганизации');
    } finally {
      setSubOrgCreating(false);
    }
  };

  const [selectedIconId, setSelectedIconId] = useState(organization.organization_icon_id || 1);
  const [organizationIcons, setOrganizationIcons] = useState([]);
  const fetchIcons = async () => {
    try {
      const response = await axios.get('/api/organizations/icons');
      setOrganizationIcons(response.data.icons);
    } catch (error) {
      console.error('Failed to fetch icons:', error);
    }
  };

  const iconsByType = organizationIcons.reduce((acc, icon) => {
    if (!acc[icon.orgType]) {
      acc[icon.orgType] = [];
    }
    acc[icon.orgType].push(icon);
    return acc;
  }, {} as Record<string, OrganizationIcon[]>);

  useEffect(() => { fetchIcons(); }, []);

  const [inputMode, setInputMode] = useState("address");
  const [address, setAddress] = useState("");
  const [longitude, setLongitude] = useState(organization.longitude);
  const [latitude, setLatitude] = useState(organization.latitude);

  const onSelectAddress = (address: string, coordinate: [number, number]) => {
    setAddress(address);
    setLatitude(coordinate[0].toString());
    setLongitude(coordinate[1].toString());
  };

  const roleLabels: Record<string, string> = { admin: 'Руководитель', moderator: 'Модератор', member: 'Сотрудник' };
  const orgCoverPreview = orgCoverFile
    ? URL.createObjectURL(orgCoverFile)
    : (organization.coverImage ? getMediaUrl(organization.coverImage) : '');

  return (
    <div className="organization-detail">
      <button onClick={onBack} className="back-btn">← Назад</button>

      {/* Breadcrumb */}
      {organization.parentOrg && (
        <div className="org-breadcrumb">
          <span
            className="org-breadcrumb-link"
            onClick={() => onNavigateToOrg(organization.parentOrg!.id)}
          >
            {ORG_TYPE_ICONS[organization.parentOrg.orgType || ''] || '🏢'} {organization.parentOrg.name}
          </span>
          <span className="org-breadcrumb-sep">›</span>
          <span>{organization.name}</span>
        </div>
      )}

      <div
        className={`org-cover-hero ${organization.coverImage ? 'has-cover' : ''}`}
        style={organization.coverImage ? { backgroundImage: `url(${getMediaUrl(organization.coverImage)})` } : undefined}
      >
        {!organization.coverImage && <span>Добавьте обложку, чтобы выделить организацию</span>}
      </div>

      <div className="org-header">
        {editingOrg ? (
          <>
            <div className="org-edit-avatar">
              {(orgAvatarFile ? URL.createObjectURL(orgAvatarFile) : organization.avatar) && (
                <img
                  src={orgAvatarFile ? URL.createObjectURL(orgAvatarFile) : getMediaUrl(organization.avatar!)}
                  alt={organization.name}
                  className="org-header-avatar"
                />
              )}
              <label className="avatar-upload-label">
                📷 Изменить
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setOrgAvatarFile(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <div className="org-edit-form">
              <input
                type="text"
                value={orgFormData.name}
                onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
                placeholder="Название"
                className="org-edit-input"
              />
              <textarea
                value={orgFormData.description}
                onChange={(e) => setOrgFormData({ ...orgFormData, description: e.target.value })}
                placeholder="Описание"
                rows={3}
                className="org-edit-textarea"
              />

              <div className="org-cover-editor">
                <div
                  className={`org-card-cover ${orgCoverPreview ? 'has-cover' : ''}`}
                  style={orgCoverPreview ? { backgroundImage: `url(${orgCoverPreview})` } : undefined}
                >
                  {!orgCoverPreview && <span>Обложка организации</span>}
                </div>
                {isGlobalAdmin && (
                  <label className="avatar-upload-label">
                    🖼️ Изменить обложку
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setOrgCoverFile(e.target.files?.[0] || null)}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              <div className="org-locations">
                <div className="input-mode-toggle">
                  <button
                    type="button"
                    className={`mode-btn ${inputMode === 'address' ? 'active' : ''}`}
                    onClick={() => setInputMode('address')}
                  >
                    <span className="mode-icon">📍</span>
                    Поиск по адресу
                  </button>
                  <button
                    type="button"
                    className={`mode-btn ${inputMode === 'manual' ? 'active' : ''}`}
                    onClick={() => setInputMode('manual')}
                  >
                    <span className="mode-icon">✏️</span>
                    Ввести координаты
                  </button>
                </div>

                {inputMode === 'address' && (
                  <div className="address-mode">
                    <AddressInput
                      onSelectAddress={onSelectAddress}
                      placeholder="Введите адрес"
                      onTextChange={(text: string) => { setAddress(text); }}
                    />
                  </div>
                )}

                {inputMode === 'manual' && (
                  <div className="manual-mode">
                    <div className="coordinate-group">
                      <label className="coordinate-label">
                        <span>Долгота</span>
                        <input
                          type="number"
                          required
                          min={-180}
                          max={180}
                          step="any"
                          placeholder="Пример: 37.617635"
                          value={longitude ?? ""}
                          onChange={(e) => setLongitude(e.target.value)}
                        />
                      </label>
                      <label className="coordinate-label">
                        <span>Широта</span>
                        <input
                          type="number"
                          required
                          min={-90}
                          max={90}
                          step="any"
                          placeholder="Пример: 55.755814"
                          value={latitude ?? ""}
                          onChange={(e) => setLatitude(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="coordinate-hint">
                      💡 Координаты можно скопировать с <a href="https://yandex.ru/maps" target="_blank" rel="noopener noreferrer">Яндекс.Карт</a>
                    </div>
                  </div>
                )}
              </div>

              <div className="org-icon-section">
                <h4>Иконка организации</h4>
                <div className="org-icon-selector">
                  {organizationIcons.length === 0 ? (
                    <div className="no-icons-warning">⏳ Загрузка иконок...</div>
                  ) : (
                    <>
                      {iconsByType[organization.orgType || '']?.length > 0 && (
                        <div className="icon-category">
                          <div className="icon-category-title">
                            Иконки для типа "{organization.orgType || 'Организация'}"
                          </div>
                          <div className="icon-grid">
                            {iconsByType[organization.orgType || ''].map(icon => (
                              <div
                                key={icon.id}
                                className={`icon-option ${selectedIconId === icon.id ? 'selected' : ''}`}
                                onClick={() => setSelectedIconId(icon.id)}
                              >
                                <div className="icon-preview">
                                  <img src={getMediaUrl(icon.imageUrl)} alt={icon.orgType} />
                                </div>
                                {selectedIconId === icon.id && (
                                  <div className="icon-check">✓</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="icon-reset">
                        <button
                          type="button"
                          className={`icon-reset-btn ${selectedIconId === 1 ? 'active' : ''}`}
                          onClick={() => setSelectedIconId(1)}
                        >
                          🏢 Использовать иконку по умолчанию
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <input type="hidden" name="organizationIconId" value={selectedIconId ?? ""} />

              <div className="org-edit-actions">
                <button onClick={handleSaveOrg} className="save-org-btn">Сохранить</button>
                <button onClick={() => {
                  setEditingOrg(false);
                  setOrgFormData({
                    name: organization.name,
                    description: organization.description || '',
                    defaultCanPost: organization.defaultCanPost === 1,
                    defaultCanComment: organization.defaultCanComment === 1,
                    isPrivate: organization.isPrivate === 1,
                    longitude: organization.longitude,
                    latitude: organization.latitude
                  });
                  setSelectedIconId(organization.organization_icon_id || null);
                  setOrgAvatarFile(null);
                  setOrgCoverFile(null);
                  setLongitude(organization.longitude);
                  setLatitude(organization.latitude);
                }} className="cancel-org-btn">Отмена</button>
              </div>
            </div>
          </>
        ) : (
          <>
            {organization.avatar ? (
              <img src={getMediaUrl(organization.avatar)} alt={organization.name} className="org-header-avatar" />
            ) : (
              <div className="org-header-avatar-placeholder">{ORG_TYPE_ICONS[organization.orgType || ''] || '🏢'}</div>
            )}
            <div className="org-header-info">
              <div className="org-type-label">{organization.orgType || 'Организация'}</div>
              <h2>{organization.name}</h2>
              <p>{organization.description || 'Нет описания'}</p>
              <div className="org-stats">
                <span>👥 {organization.membersCount} сотрудников</span>
                <span>👤 Руководитель: {organization.adminUsername}</span>
                {organization.isPrivate ? <span className="org-private-badge">🔒 Закрытая</span> : <span className="org-public-badge">🌐 Открытая</span>}
              </div>
            </div>
            <div className="org-header-actions">
              {isAdmin && (
                <button onClick={() => setEditingOrg(true)} className="edit-org-btn">✏️ Редактировать</button>
              )}
              {!isMember && !organization.isPrivate && (
                <button onClick={handleJoin} className="join-btn">Вступить</button>
              )}
              {isMember && !isAdmin && (
                <button onClick={handleLeave} className="leave-btn">Покинуть</button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Sub-organizations section (visible inline, no tab) */}
      {subOrgType && (
        <div className="org-suborgs-inline">
          <div className="org-suborgs-inline-header">
            <h3>🏗️ {subOrgType && SUB_ORG_PLURAL[subOrgType] || subOrgType} ({organization.subOrganizations?.length || 0})</h3>
            {isMember && (
              showCreateSubOrg ? null : (
                <button onClick={() => setShowCreateSubOrg(true)} className="create-btn create-btn-sm">
                  + Создать {subOrgType && SUB_ORG_GENITIVE_SINGLE[subOrgType] || subOrgType}
                </button>
              )
            )}
          </div>
          {showCreateSubOrg && (
            <div className="suborg-create-form suborg-create-form-inline">
              <input
                type="text"
                placeholder={`Название *`}
                value={subOrgName}
                onChange={(e) => setSubOrgName(e.target.value)}
                className="org-edit-input"
              />
              <textarea
                placeholder="Описание"
                value={subOrgDesc}
                onChange={(e) => setSubOrgDesc(e.target.value)}
                rows={2}
                className="org-edit-textarea"
              />
              {isGlobalAdmin && (
                <label>
                  Обложка (только для администраторов сайта):
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSubOrgCoverFile(e.target.files?.[0] || null)}
                  />
                </label>
              )}
              <div className="org-edit-actions">
                <button onClick={handleCreateSubOrg} className="save-org-btn" disabled={subOrgCreating}>
                  {subOrgCreating ? 'Создание...' : 'Создать'}
                </button>
                <button onClick={() => {
                  setShowCreateSubOrg(false);
                  setSubOrgCoverFile(null);
                }} className="cancel-org-btn">Отмена</button>
              </div>
            </div>
          )}
          <div className="suborgs-grid">
            {organization.subOrganizations && organization.subOrganizations.length > 0 ? (
              organization.subOrganizations.map(sub => (
                <div key={sub.id} className="organization-card suborg-card" onClick={() => onNavigateToOrg(sub.id)}>
                  <div
                    className={`org-card-cover ${sub.coverImage ? 'has-cover' : ''}`}
                    style={sub.coverImage ? { backgroundImage: `url(${getMediaUrl(sub.coverImage)})` } : undefined}
                  >
                    {!sub.coverImage && <span>Обложка подразделения</span>}
                  </div>
                  {sub.avatar ? (
                    <img src={getMediaUrl(sub.avatar)} alt={sub.name} className="org-avatar" />
                  ) : (
                    <div className="org-avatar-placeholder">{ORG_TYPE_ICONS[sub.orgType || ''] || '🏗️'}</div>
                  )}
                  <div className="org-card-type-badge">{sub.orgType}</div>
                  <h3>{sub.name}</h3>
                  <p>{sub.description || 'Нет описания'}</p>
                  <div className="org-info">
                    <span>👥 {sub.membersCount} сотрудников</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">Пока нет {subOrgType && SUB_ORG_GENITIVE[subOrgType] || subOrgType?.toLowerCase()}</div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="org-tabs">
        <button
          className={`org-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >📝 Посты</button>
        {canAccessSettings && (
          <button
            className={`org-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >⚙️ Настройки</button>
        )}
      </div>

      <div className="org-content-with-sidebar">
        <div className="org-main-content">

          {/* Posts tab */}
          {activeTab === 'posts' && (
            <div className="org-posts-section">
              {canPost && (
                <div className="org-actions">
                  <button onClick={() => setShowCreatePost(!showCreatePost)} className="create-post-btn">
                    {showCreatePost ? 'Отмена' : '+ Создать пост'}
                  </button>
                </div>
              )}
              {!isMember && !isAdmin && (
                <div className="org-permission-note">
                  {organization.isPrivate
                    ? '🔒 Это закрытая организация. Вступить можно только по приглашению.'
                    : 'Вступите в организацию, чтобы создавать посты.'}
                </div>
              )}
              {showCreatePost && canPost && (
                <div className="org-create-post">
                  <CreatePost
                    organizationId={organization.id}
                    onPostCreated={() => {
                      setShowCreatePost(false);
                      onUpdate(organization.id);
                    }}
                  />
                </div>
              )}
              <div className="org-posts">
                {organization.posts && organization.posts.length > 0 ? (
                  organization.posts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onPostDeleted={() => onUpdate(organization.id)}
                      onPostUpdated={() => onUpdate(organization.id)}
                    />
                  ))
                ) : (
                  <div className="empty-state">Пока нет постов</div>
                )}
              </div>
            </div>
          )}

          {/* Settings tab (organization admin or global admin) */}
          {activeTab === 'settings' && canAccessSettings && (
            <div className="org-settings-section">
              <h3>Настройки организации</h3>

              {isAdmin && (
                <>
                  <div className="settings-card">
                    <h4>Права новых сотрудников по умолчанию</h4>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={orgFormData.defaultCanPost}
                        onChange={(e) => setOrgFormData({ ...orgFormData, defaultCanPost: e.target.checked })}
                      />
                      <span>Новые сотрудники могут создавать посты</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={orgFormData.defaultCanComment}
                        onChange={(e) => setOrgFormData({ ...orgFormData, defaultCanComment: e.target.checked })}
                      />
                      <span>Новые сотрудники могут комментировать</span>
                    </label>
                  </div>

                  <div className="settings-card">
                    <h4>Видимость</h4>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={orgFormData.isPrivate}
                        onChange={(e) => setOrgFormData({ ...orgFormData, isPrivate: e.target.checked })}
                      />
                      <span>🔒 Закрытая организация (только по приглашениям)</span>
                    </label>
                  </div>

                  <button
                    onClick={handleSaveOrg}
                    className="save-org-btn"
                    style={{ marginTop: '1rem' }}
                  >
                    💾 Сохранить настройки
                  </button>
                </>
              )}

              {!isAdmin && isGlobalAdmin && (
                <div className="settings-card">
                  <p className="danger-note">У вас есть права глобального админа. Для этой организации доступно удаление.</p>
                </div>
              )}

              {canDeleteOrganization && (
                <div className="settings-card settings-card-danger">
                  <h4>Опасная зона</h4>
                  <p className="danger-note">Удаление организации необратимо. Все посты и данные будут удалены.
                    {organization.subOrganizations && organization.subOrganizations.length > 0 && (
                      <> Вместе с ней будут удалены все дочерние подразделения.</>
                    )}
                  </p>
                  <button onClick={() => setShowDeleteModal(true)} className="delete-org-btn">
                    🗑️ Удалить организацию
                  </button>
                </div>
              )}
            </div>
          )}
        </div>{/* end org-main-content */}

        {/* Members sidebar */}
        <aside className="org-members-sidebar">
          <div className="org-members-sidebar-header">
            <span className="org-members-sidebar-title">Сотрудники</span>
            <span className="org-members-sidebar-count">{organization.membersCount}</span>
          </div>
          <div className="org-members-sidebar-avatars">
            {(organization.members || []).slice(0, 8).map(m => (
              <div
                key={m.userId}
                className="sidebar-member"
                onClick={() => { setSelectedMember(m); setShowMembersModal(true); }}
                title={m.firstName && m.lastName ? `${m.firstName} ${m.lastName}` : m.username}
              >
                {m.avatar
                  ? <img src={getMediaUrl(m.avatar)} alt={m.username} className="sidebar-member-avatar" />
                  : <div className="sidebar-member-avatar-placeholder">{(m.firstName || m.username)[0].toUpperCase()}</div>
                }
                <span className="sidebar-member-name">
                  {m.firstName ? m.firstName : m.username}
                </span>
              </div>
            ))}
          </div>
          {(organization.members?.length || 0) > 0 && (
            <button className="org-members-show-all-btn" onClick={() => { setSelectedMember(organization.members?.[0] || null); setShowMembersModal(true); }}>
              Показать всех →
            </button>
          )}
        </aside>
      </div>{/* end org-content-with-sidebar */}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Удалить организацию?</h3>
            <p>Вы уверены, что хотите удалить <strong>«{organization.name}»</strong>? Это действие нельзя отменить.</p>
            {organization.subOrganizations && organization.subOrganizations.length > 0 && (
              <div className="delete-suborgs-warning">
                <p>Вместе с ней будут удалены следующие дочерние подразделения:</p>
                <ul className="delete-suborgs-list">
                  {organization.subOrganizations.map(sub => (
                    <li key={sub.id}>
                      {ORG_TYPE_ICONS[sub.orgType || ''] || '🏗️'} {sub.name} <span className="suborg-type-hint">({sub.orgType})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>Отмена</button>
              <button onClick={handleDeleteOrg} className="delete-org-btn">🗑️ Да, удалить</button>
            </div>
          </div>
        </div>
      )}

      {/* Members modal */}
      {showMembersModal && (
        <div className="modal-overlay" onClick={() => setShowMembersModal(false)}>
          <div className="members-modal" onClick={(e) => e.stopPropagation()}>
            <div className="members-modal-header">
              <h3>👥 Сотрудники — {organization.name}</h3>
              {(isAdmin || isModerator) && (
                <div className="invite-row">
                  <input
                    type="text"
                    placeholder="Пригласить по логину"
                    value={inviteUsername}
                    onChange={(e) => setInviteUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                    className="invite-input"
                  />
                  <button onClick={handleInvite} className="invite-btn">Пригласить</button>
                </div>
              )}
              {inviteError && <div className="invite-error">{inviteError}</div>}
              <button className="modal-close-btn" onClick={() => setShowMembersModal(false)}>✕</button>
            </div>
            <div className="members-modal-body">
              {/* Left: list */}
              <div className="members-modal-list">
                {(organization.members || []).map(m => (
                  <div
                    key={m.userId}
                    className={`members-modal-list-item ${selectedMember?.userId === m.userId ? 'active' : ''} ${m.isBlocked ? 'member-blocked' : ''}`}
                    onClick={() => setSelectedMember(m)}
                  >
                    {m.avatar
                      ? <img src={getMediaUrl(m.avatar)} alt={m.username} className="members-modal-list-avatar" />
                      : <div className="members-modal-list-avatar-ph">{(m.firstName || m.username)[0].toUpperCase()}</div>
                    }
                    <div>
                      <div className="members-modal-list-name">
                        {m.firstName && m.lastName ? `${m.firstName} ${m.lastName}` : m.username}
                      </div>
                      <div className="members-modal-list-role">{roleLabels[m.role] || m.role}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: detail */}
              {selectedMember && (
                <div className="members-modal-detail">
                  {selectedMember.avatar
                    ? <img src={getMediaUrl(selectedMember.avatar)} alt={selectedMember.username} className="members-modal-detail-avatar" />
                    : <div className="members-modal-detail-avatar-ph">{(selectedMember.firstName || selectedMember.username)[0].toUpperCase()}</div>
                  }
                  <div className="members-modal-detail-name">
                    {selectedMember.firstName && selectedMember.lastName
                      ? `${selectedMember.firstName} ${selectedMember.lastName}`
                      : selectedMember.username}
                  </div>
                  <div className="members-modal-detail-role">{roleLabels[selectedMember.role] || selectedMember.role}</div>
                  {selectedMember.isBlocked && <div className="member-blocked-label">Заблокирован</div>}

                  <button
                    className="members-modal-profile-btn"
                    onClick={() => { setShowMembersModal(false); navigate(`/users/${selectedMember.userId}`); }}
                  >
                    👤 Открыть профиль
                  </button>

                  {(isAdmin || isModerator) && selectedMember.userId !== currentUserId && selectedMember.role !== 'admin' && (
                    <div className="members-modal-actions">
                      {isAdmin && selectedMember.role === 'member' && (
                        <button onClick={async () => {
                          try { await axios.post(`/api/organizations/${organization.id}/moderators`, { targetUserId: selectedMember.userId }); onUpdate(organization.id); setSelectedMember({ ...selectedMember, role: 'moderator' }); } catch { }
                        }} className="moderator-btn">👑 Назначить модератором</button>
                      )}
                      {isAdmin && selectedMember.role === 'moderator' && (
                        <button onClick={async () => {
                          try { await axios.delete(`/api/organizations/${organization.id}/moderators/${selectedMember.userId}`); onUpdate(organization.id); setSelectedMember({ ...selectedMember, role: 'member' }); } catch { }
                        }} className="remove-moderator-btn">↩ Снять с модераторов</button>
                      )}
                      <button onClick={async () => {
                        if (!confirm('Выгнать сотрудника?')) return;
                        try { await axios.delete(`/api/organizations/${organization.id}/members/${selectedMember.userId}`); onUpdate(organization.id); setSelectedMember(null); } catch { }
                      }} className="kick-btn">🚫 Выгнать</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


