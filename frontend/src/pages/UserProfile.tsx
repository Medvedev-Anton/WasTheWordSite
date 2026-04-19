import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import { getMediaUrl } from '../config';
import './Profile.css';

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (!user) return;
    setStartingChat(true);
    try {
      const response = await axios.post('/api/chats/personal', { targetUserId: user.id });
      navigate(`/chat?chatId=${response.data.id}`);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при создании чата');
    } finally {
      setStartingChat(false);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!user) return <div className="error">Пользователь не найден</div>;

  // Redirect to own profile if viewing self
  if (currentUser && user.id === currentUser.id) {
    navigate('/profile');
    return null;
  }

  const fullName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.username;

  const canMessage = user.allowMessagesFrom === 'everyone';

  return (
    <div className="profile-page">
      <button onClick={() => navigate(-1)} className="cancel-btn" style={{ alignSelf: 'flex-start' }}>
        ← Назад
      </button>

      <div className="profile-header">
        <div className="profile-avatar-section">
          {user.avatar ? (
            <img src={getMediaUrl(user.avatar)} alt={fullName} className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{fullName}</h1>
          {
            user.rang ? 
            (
              <div className="rang-image-wrapper">
                <img src={user.rang.thumbnailUrl} />
                <p>{user.rang.name}</p>
              </div>
            )
            : ''
          }
          <p className="username">@{user.username}</p>
          {canMessage ? (
            <button
              onClick={handleStartChat}
              disabled={startingChat}
              className="start-chat-btn"
            >
              💬 {startingChat ? 'Открываю...' : 'Написать сообщение'}
            </button>
          ) : (
            <div className="no-messages-note">
              {user.allowMessagesFrom === 'nobody'
                ? '🔒 Пользователь отключил сообщения'
                : '🔒 Пользователь принимает сообщения только от друзей'}
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Основная информация</h2>
          <div className="profile-details">
            {user.age && <div><strong>Возраст:</strong> {user.age}</div>}
            {user.work && <div><strong>Работа:</strong> {user.work}</div>}
            {user.about && (
              <div className="about-section">
                <strong>О себе:</strong>
                <p>{user.about}</p>
              </div>
            )}
            {!user.age && !user.work && !user.about && (
              <div className="empty-state">Пользователь не заполнил информацию</div>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h2>Стена</h2>
          {user.posts && user.posts.length > 0 ? (
            <div className="profile-posts">
              {user.posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostDeleted={() => fetchUser()}
                  onPostUpdated={() => fetchUser()}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">На стене пока нет постов</div>
          )}
        </div>

        {user.photos && user.photos.length > 0 && (
          <div className="profile-section">
            <h2>Фотографии</h2>
            <div className="photos-grid">
              {user.photos.map(photo => (
                <div key={photo.id} className="photo-item">
                  <img src={getMediaUrl(photo.photoUrl)} alt="Photo" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
