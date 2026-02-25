import { useState, useEffect } from 'react';
import axios from 'axios';
import { Organization } from '../types';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import './Organizations.css';

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
    const defaultCanPost = (formData.get('defaultCanPost') as string) === 'on';
    const defaultCanComment = (formData.get('defaultCanComment') as string) === 'on';
    const isPrivate = (formData.get('isPrivate') as string) === 'on';

    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
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
        onBack={() => setSelectedOrg(null)}
        onUpdate={handleSelectOrg}
        currentUserId={user?.id || 0}
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
                  <span>Эта группа доступна только по приглашениям</span>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Отмена
                </button>
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
              {org.avatar && (
                <img src={`http://localhost:3001${org.avatar}`} alt={org.name} className="org-avatar" />
              )}
              <h3>{org.name}</h3>
              <p>{org.description || 'Нет описания'}</p>
              <div className="org-info">
                <span>👥 {org.membersCount} участников</span>
                <span>👤 Админ: {org.adminUsername}</span>
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
}: {
  organization: Organization;
  onBack: () => void;
  onUpdate: (id: number) => void;
  currentUserId: number;
}) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [editingOrg, setEditingOrg] = useState(false);
  const [orgFormData, setOrgFormData] = useState({
    name: organization.name,
    description: organization.description || '',
  });
  const [orgAvatarFile, setOrgAvatarFile] = useState<File | null>(null);
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const isMember = organization.members?.some(m => m.userId === currentUserId);
  const isAdmin = organization.adminId === currentUserId;
  const isModerator = organization.members?.some(
    m => m.userId === currentUserId && (m.role === 'moderator' || m.role === 'admin')
  );

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

  const handleSaveOrg = async () => {
    try {
      const formData = new FormData();
      formData.append('name', orgFormData.name);
      formData.append('description', orgFormData.description);
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

  return (
    <div className="organization-detail">
      <button onClick={onBack} className="back-btn">← Назад</button>
      <div className="org-header">
        {editingOrg ? (
          <>
            <div className="org-edit-avatar">
              {organization.avatar && !orgAvatarFile && (
                <img src={`http://localhost:3001${organization.avatar}`} alt={organization.name} className="org-header-avatar" />
              )}
              {orgAvatarFile && (
                <img src={URL.createObjectURL(orgAvatarFile)} alt="Preview" className="org-header-avatar" />
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
                rows={4}
                className="org-edit-textarea"
              />
              <div className="org-edit-actions">
                <button onClick={handleSaveOrg} className="save-org-btn">Сохранить</button>
                <button onClick={() => {
                  setEditingOrg(false);
                  setOrgFormData({ name: organization.name, description: organization.description || '' });
                  setOrgAvatarFile(null);
                }} className="cancel-org-btn">Отмена</button>
              </div>
            </div>
          </>
        ) : (
          <>
            {organization.avatar && (
              <img src={`http://localhost:3001${organization.avatar}`} alt={organization.name} className="org-header-avatar" />
            )}
            <div>
              <h2>{organization.name}</h2>
              <p>{organization.description || 'Нет описания'}</p>
              <div className="org-stats">
                <span>👥 {organization.membersCount} участников</span>
                <span>👤 Админ: {organization.adminUsername}</span>
              </div>
            </div>
            {isAdmin && (
              <button onClick={() => setEditingOrg(true)} className="edit-org-btn">✏️ Редактировать</button>
            )}
            {!isMember && (
              <button onClick={handleJoin} className="join-btn">Вступить</button>
            )}
            {isMember && !isAdmin && (
              <button onClick={handleLeave} className="leave-btn">Покинуть</button>
            )}
          </>
        )}
      </div>

      {(isMember || isAdmin || isModerator) && (
        <div className="org-actions">
          <button onClick={() => setShowCreatePost(!showCreatePost)} className="create-post-btn">
            {showCreatePost ? 'Отмена' : '+ Создать пост'}
          </button>
        </div>
      )}

      {showCreatePost && (
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
        <h3>Посты организации</h3>
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

      {isAdmin && (
        <div className="org-members">
          <h3>Участники</h3>
          {organization.members?.map(member => (
            <div key={member.id} className="member-item">
              <img
                src={member.avatar ? `http://localhost:3001${member.avatar}` : undefined}
                alt={member.username}
                className="member-avatar"
              />
              <div>
                <div className="member-name">
                  {member.firstName && member.lastName
                    ? `${member.firstName} ${member.lastName}`
                    : member.username}
                </div>
                <div className="member-role">{member.role}</div>
              </div>
              {isAdmin && member.role === 'member' && (
                <button
                  onClick={async () => {
                    try {
                      await axios.post(`/api/organizations/${organization.id}/moderators`, {
                        targetUserId: member.userId,
                      });
                      onUpdate(organization.id);
                    } catch (error) {
                      console.error('Failed to add moderator:', error);
                    }
                  }}
                  className="moderator-btn"
                >
                  Сделать модератором
                </button>
              )}
              {isAdmin && member.role === 'moderator' && (
                <button
                  onClick={async () => {
                    try {
                      await axios.delete(`/api/organizations/${organization.id}/moderators/${member.userId}`);
                      onUpdate(organization.id);
                    } catch (error) {
                      console.error('Failed to remove moderator:', error);
                    }
                  }}
                  className="remove-moderator-btn"
                >
                  Убрать модератора
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

