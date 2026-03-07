import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Organization } from '../types';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { getMediaUrl } from '../config';
import './Organizations.css';

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

export default function Organizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrganizations();
  }, []);

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
    const orgType = formData.get('orgType') as string;
    const defaultCanPost = (e.currentTarget.querySelector('[name="defaultCanPost"]') as HTMLInputElement)?.checked;
    const defaultCanComment = (e.currentTarget.querySelector('[name="defaultCanComment"]') as HTMLInputElement)?.checked;
    const isPrivate = (e.currentTarget.querySelector('[name="isPrivate"]') as HTMLInputElement)?.checked;

    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('orgType', orgType);
    data.append('defaultCanPost', defaultCanPost.toString());
    data.append('defaultCanComment', defaultCanComment.toString());
    data.append('isPrivate', isPrivate.toString());
    if (avatar && avatar.size > 0) {
      data.append('avatar', avatar);
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
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Создать организацию</h3>
            <form onSubmit={handleCreateOrg}>
              <input type="text" name="name" placeholder="Название *" required />
              <textarea name="description" placeholder="Описание" rows={4} />
              <label>
                Тип организации:
                <select name="orgType" className="org-type-select">
                  {ROOT_ORG_TYPES.map(t => (
                    <option key={t} value={t}>{ORG_TYPE_ICONS[t]} {t}</option>
                  ))}
                </select>
              </label>
              <label>
                Аватар:
                <input type="file" name="avatar" accept="image/*" />
              </label>
              <div className="org-settings">
                <h4>Настройки по умолчанию для новых участников:</h4>
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
              {org.avatar ? (
                <img src={getMediaUrl(org.avatar)} alt={org.name} className="org-avatar" />
              ) : (
                <div className="org-avatar-placeholder">{ORG_TYPE_ICONS[org.orgType || ''] || '🏢'}</div>
              )}
              <div className="org-card-type-badge">{org.orgType || 'Организация'}</div>
              <h3>{org.name}</h3>
              <p>{org.description || 'Нет описания'}</p>
              <div className="org-info">
                <span>👥 {org.membersCount} участников</span>
                <span>👤 Админ: {org.adminUsername}</span>
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
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'members' | 'settings'>('posts');
  const [editingOrg, setEditingOrg] = useState(false);
  const [orgFormData, setOrgFormData] = useState({
    name: organization.name,
    description: organization.description || '',
    defaultCanPost: organization.defaultCanPost === 1,
    defaultCanComment: organization.defaultCanComment === 1,
    isPrivate: organization.isPrivate === 1,
  });
  const [orgAvatarFile, setOrgAvatarFile] = useState<File | null>(null);
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [showCreateSubOrg, setShowCreateSubOrg] = useState(false);
  const [subOrgName, setSubOrgName] = useState('');
  const [subOrgDesc, setSubOrgDesc] = useState('');
  const [subOrgCreating, setSubOrgCreating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      if (orgAvatarFile) {
        formData.append('avatar', orgAvatarFile);
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

      await axios.post('/api/organizations', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowCreateSubOrg(false);
      setSubOrgName('');
      setSubOrgDesc('');
      onUpdate(organization.id);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при создании подорганизации');
    } finally {
      setSubOrgCreating(false);
    }
  };

  const roleLabels: Record<string, string> = { admin: 'Администратор', moderator: 'Модератор', member: 'Участник' };

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
                  });
                  setOrgAvatarFile(null);
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
                <span>👥 {organization.membersCount} участников</span>
                <span>👤 Админ: {organization.adminUsername}</span>
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
              <div className="org-edit-actions">
                <button onClick={handleCreateSubOrg} className="save-org-btn" disabled={subOrgCreating}>
                  {subOrgCreating ? 'Создание...' : 'Создать'}
                </button>
                <button onClick={() => setShowCreateSubOrg(false)} className="cancel-org-btn">Отмена</button>
              </div>
            </div>
          )}
          <div className="suborgs-grid">
            {organization.subOrganizations && organization.subOrganizations.length > 0 ? (
              organization.subOrganizations.map(sub => (
                <div key={sub.id} className="organization-card suborg-card" onClick={() => onNavigateToOrg(sub.id)}>
                  {sub.avatar ? (
                    <img src={getMediaUrl(sub.avatar)} alt={sub.name} className="org-avatar" />
                  ) : (
                    <div className="org-avatar-placeholder">{ORG_TYPE_ICONS[sub.orgType || ''] || '🏗️'}</div>
                  )}
                  <div className="org-card-type-badge">{sub.orgType}</div>
                  <h3>{sub.name}</h3>
                  <p>{sub.description || 'Нет описания'}</p>
                  <div className="org-info">
                    <span>👥 {sub.membersCount} участников</span>
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
        <button
          className={`org-tab ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >👥 Участники ({organization.membersCount})</button>
        {isAdmin && (
          <button
            className={`org-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >⚙️ Настройки</button>
        )}
      </div>

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

      {/* Members tab */}
      {activeTab === 'members' && (
        <div className="org-members-section">
          {(isAdmin || isModerator) && (
            <div className="invite-section">
              <h4>Пригласить участника</h4>
              <div className="invite-row">
                <input
                  type="text"
                  placeholder="Имя пользователя"
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                  className="invite-input"
                />
                <button onClick={handleInvite} className="invite-btn">Пригласить</button>
              </div>
              {inviteError && <div className="invite-error">{inviteError}</div>}
            </div>
          )}

          <div className="org-members-list">
            {organization.members && organization.members.length > 0 ? (
              organization.members.map(member => (
                <div key={member.id} className={`member-item ${member.isBlocked ? 'member-blocked' : ''}`}>
                  <img
                    src={getMediaUrl(member.avatar)}
                    alt={member.username}
                    className="member-avatar"
                  />
                  <div className="member-info">
                    <div
                      className="member-name member-name-link"
                      onClick={() => navigate(`/users/${member.userId}`)}
                    >
                      {member.firstName && member.lastName
                        ? `${member.firstName} ${member.lastName}`
                        : member.username}
                    </div>
                    <div className="member-role">{roleLabels[member.role] || member.role}</div>
                    {member.isBlocked ? <div className="member-blocked-label">Заблокирован</div> : null}
                    {!member.canPost && !member.isBlocked ? <div className="member-noperm-label">Без права постить</div> : null}
                  </div>
                  {(isAdmin || isModerator) && member.userId !== currentUserId && member.role !== 'admin' && (
                    <div className="member-actions">
                      {isAdmin && member.role === 'member' && (
                        <button
                          onClick={async () => {
                            try {
                              await axios.post(`/api/organizations/${organization.id}/moderators`, { targetUserId: member.userId });
                              onUpdate(organization.id);
                            } catch { }
                          }}
                          className="moderator-btn"
                        >👑 Модератор</button>
                      )}
                      {isAdmin && member.role === 'moderator' && (
                        <button
                          onClick={async () => {
                            try {
                              await axios.delete(`/api/organizations/${organization.id}/moderators/${member.userId}`);
                              onUpdate(organization.id);
                            } catch { }
                          }}
                          className="remove-moderator-btn"
                        >↩ Снять</button>
                      )}
                      <button
                        onClick={() => setEditingMember(editingMember === member.userId ? null : member.userId)}
                        className="permissions-btn"
                      >🛡 Права</button>
                      <button
                        onClick={() => handleKickMember(member.userId)}
                        className="kick-btn"
                      >🚫 Выгнать</button>
                    </div>
                  )}
                  {editingMember === member.userId && (
                    <div className="member-permissions-edit">
                      <label>
                        <input
                          type="checkbox"
                          defaultChecked={!!member.canPost}
                          onChange={(e) => handleUpdateMemberPermissions(member.userId, { canPost: e.target.checked })}
                        />
                        Может создавать посты
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          defaultChecked={!!member.canComment}
                          onChange={(e) => handleUpdateMemberPermissions(member.userId, { canComment: e.target.checked })}
                        />
                        Может комментировать
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          defaultChecked={!!member.isBlocked}
                          onChange={(e) => handleUpdateMemberPermissions(member.userId, { isBlocked: e.target.checked })}
                        />
                        Заблокирован
                      </label>
                      <button onClick={() => setEditingMember(null)} className="close-permissions-btn">Закрыть</button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">Нет участников</div>
            )}
          </div>
        </div>
      )}

      {/* Settings tab (admin only) */}
      {activeTab === 'settings' && isAdmin && (
        <div className="org-settings-section">
          <h3>Настройки организации</h3>

          <div className="settings-card">
            <h4>Права новых участников по умолчанию</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={orgFormData.defaultCanPost}
                onChange={(e) => setOrgFormData({ ...orgFormData, defaultCanPost: e.target.checked })}
              />
              <span>Новые участники могут создавать посты</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={orgFormData.defaultCanComment}
                onChange={(e) => setOrgFormData({ ...orgFormData, defaultCanComment: e.target.checked })}
              />
              <span>Новые участники могут комментировать</span>
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
        </div>
      )}

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
    </div>
  );
}

