import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import './Profile.css';

export default function Profile() {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    work: '',
    about: '',
    allowMessagesFrom: 'everyone' as 'everyone' | 'friends' | 'nobody',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    if (!currentUser) return;

    try {
      const response = await axios.get(`/api/users/${currentUser.id}`);
      setUser(response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        age: response.data.age || '',
        work: response.data.work || '',
        about: response.data.about || '',
        allowMessagesFrom: response.data.allowMessagesFrom || 'everyone',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;

    try {
      await axios.put(`/api/users/${currentUser.id}`, {
        firstName: formData.firstName || null,
        lastName: formData.lastName || null,
        age: formData.age ? parseInt(formData.age) : null,
        work: formData.work || null,
        about: formData.about || null,
        allowMessagesFrom: formData.allowMessagesFrom,
      });

      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', avatarFile);
        await axios.post(`/api/users/${currentUser.id}/avatar`, avatarFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Ошибка при обновлении профиля');
    }
  };

  const handleUploadPhoto = async () => {
    if (!currentUser || !photoFile) return;

    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      await axios.post(`/api/users/${currentUser.id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPhotoFile(null);
      fetchProfile();
    } catch (error) {
      console.error('Failed to upload photo:', error);
      alert('Ошибка при загрузке фото');
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!currentUser) return;

    if (!confirm('Удалить это фото?')) return;

    try {
      await axios.delete(`/api/users/${currentUser.id}/photos/${photoId}`);
      fetchProfile();
    } catch (error) {
      console.error('Failed to delete photo:', error);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!user) {
    return <div className="error">Пользователь не найден</div>;
  }

  const fullName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.username;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-section">
          {user.avatar ? (
            <img src={`http://localhost:3001${user.avatar}`} alt={fullName} className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
          {editing && (
            <label className="avatar-upload-btn">
              📷 Изменить
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>
        <div className="profile-info">
          <h1>{fullName}</h1>
          <p className="username">@{user.username}</p>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="edit-btn">
              Редактировать профиль
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">
                Сохранить
              </button>
              <button onClick={() => {
                setEditing(false);
                fetchProfile();
              }} className="cancel-btn">
                Отмена
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Основная информация</h2>
          {editing ? (
            <div className="profile-form">
              <div className="form-row">
                <label>
                  Имя
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </label>
                <label>
                  Фамилия
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </label>
              </div>
              <label>
                Возраст
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  min="1"
                  max="150"
                />
              </label>
              <label>
                Работа
                <input
                  type="text"
                  value={formData.work}
                  onChange={(e) => setFormData({ ...formData, work: e.target.value })}
                  placeholder="Место работы"
                />
              </label>
              <label>
                О себе
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={4}
                  placeholder="Расскажите о себе"
                />
              </label>
              <label>
                Кто может писать вам сообщения
                <select
                  value={formData.allowMessagesFrom}
                  onChange={(e) => setFormData({ ...formData, allowMessagesFrom: e.target.value as 'everyone' | 'friends' | 'nobody' })}
                >
                  <option value="everyone">Все</option>
                  <option value="friends">Только друзья</option>
                  <option value="nobody">Никто</option>
                </select>
              </label>
            </div>
          ) : (
            <div className="profile-details">
              {user.age && <div><strong>Возраст:</strong> {user.age}</div>}
              {user.work && <div><strong>Работа:</strong> {user.work}</div>}
              {user.about && (
                <div className="about-section">
                  <strong>О себе:</strong>
                  <p>{user.about}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="profile-section">
          <h2>Стена</h2>
          {user.posts && user.posts.length > 0 ? (
            <div className="profile-posts">
              {user.posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostDeleted={() => fetchProfile()}
                  onPostUpdated={() => fetchProfile()}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">На стене пока нет постов</div>
          )}
        </div>

        <div className="profile-section">
          <div className="photos-header">
            <h2>Фотографии</h2>
            {editing && (
              <label className="photo-upload-btn">
                + Добавить фото
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
          {photoFile && (
            <div className="photo-preview">
              <span>Выбрано: {photoFile.name}</span>
              <button onClick={handleUploadPhoto} className="upload-btn">
                Загрузить
              </button>
            </div>
          )}
          {user.photos && user.photos.length > 0 ? (
            <div className="photos-grid">
              {user.photos.map(photo => (
                <div key={photo.id} className="photo-item">
                  <img src={`http://localhost:3001${photo.photoUrl}`} alt="Photo" />
                  {editing && (
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="delete-photo-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Нет фотографий</div>
          )}
        </div>
      </div>
    </div>
  );
}

