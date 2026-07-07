import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getMediaUrl } from '../config';
import SkinModal from '../components/SkinModal';
import RepostCard from '../components/RepostCard';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import Resources from '../components/Resources';

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
    gender: '' as '' | 'M' | 'F'
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  const [showSkinModal, setShowSkinModal] = useState<boolean>(false);
  const [organizations, setOrganizations] = useState<[]>([]);
  const [skins, setSkins] = useState<[]>([]);
  const [imageHero, setImageHero] = useState(null);

  const navigate = useNavigate();

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
        gender: response.data.gender || 'M'
      });

      const responseSkins = await axios.get(`/api/heroes`);
      const skins = responseSkins.data.heroes;
      const filterSkins = skins ? skins.filter(skin => { return skin.gender === response.data.gender; }) : [];
      setSkins(filterSkins|| []);
      const responseOrganizations = await axios.get(`/api/users/${currentUser.id}/organizations`);
      setOrganizations(responseOrganizations.data.organizations);

      // if (!response.data.hero) {
      //   if (response.data.gender === 'M') {
      //     setImageHero('/image/hero/default_male_hero.png');
      //   }
      //   else {
      //     setImageHero('/image/hero/default_female_hero.png');
      //   }
      // }

      const defaultHeroImage = response.data.gender === 'M' 
      ? '/image/hero/default_male_hero.png'
      : '/image/hero/default_female_hero.png';
    
      setImageHero(response.data.hero?.imagePath || defaultHeroImage);
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
        gender: formData.gender
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

  const handleRepostLike = (postId: number, isLiked: boolean) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser;

      const updatedPosts = prevUser.posts?.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: isLiked,
            likesCount: isLiked ? (post.likesCount || 0) + 1 : (post.likesCount || 0) - 1
          };
        }
        return post;
      }) || [];

      return {
        ...prevUser,
        posts: updatedPosts
      };
    });
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

  const skillGradients = [
    'linear-gradient(90deg, #6c6c6c, var(--color-accent))',
    'linear-gradient(90deg, var(--color-accent-dark), var(--color-accent-hover))',
    'linear-gradient(90deg, #858585, var(--color-light-2))',
    'linear-gradient(90deg, var(--color-accent), var(--color-light-1))',
    'linear-gradient(90deg, #7e7e7e, #b9b9b9)',
    'linear-gradient(90deg, #686868, #a98b8b)',
  ];

  function hashStringToGradient(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }

    return skillGradients[hash % skillGradients.length];
  }

  const rating = 0;

  const skills = [
    { name: 'Человечность', value: 100 },
  ];

  return (
    <div className="cyber-profile">

      <div className="particles-container">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`v-${i}`} className="particle"></div>
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`h-${i}`} className="particle-h"></div>
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`t-${i}`} className="particle-twinkle"></div>
        ))}
      </div>

      <div className="top-stats">
        <div className="stat-item">
          <span className="stat-icon">🪙</span>
          <span className="stat-value">{parseFloat(user.balance / 100).toFixed(2)}</span>
          <span className="stat-label">BFB Coin</span>
        </div>

        {/* <div className="profile-info">
          <h1>{fullName}</h1>
        </div> */}
        <div className="stat-item">
          <span className="stat-icon">⚡</span>
          <span className="stat-value">{user.energy}</span>
          <span className="stat-label">Энергия</span>
        </div>
      </div>

      <div className="profile-grid">

        <div className="left-panel">

          <div className="cyber-card rating-card">
            <h3>Рейтинг</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${rating}%` }}></div>
            </div>
            <span className="rating-value">{rating}/100</span>
          </div>

          <div className="avatar-section">
            <div className="avatar-ring">
              <div className="avatar">
                {user.avatar ? (
                  <img src={avatarPreview ?? getMediaUrl(user.avatar)} alt={fullName} />
                ) : (
                  <div className="avatar-placeholder">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <h1 className="profile-username">{user.username}</h1>
          </div>

          <div className="cyber-card rank-card">
            <h3>Ранг</h3>
            <div className="rank-name">{user.rang?.name ?? ''}</div>
            {user.rang ?
              <img src={user.rang.thumbnailUrl} alt="Rank" className="rank-image" />
              : ''
            }
          </div>

          <div className="cyber-card organizations-card">
            <h3>Организации</h3>
            <div className="org-list">
              {
                organizations.map(organization =>
                  <div className="org-item" key={organization.id} onClick={() => {
                    navigate(`/organizations`, {
                      state: {
                        selectOrganizationFromMap: organization
                      }
                    });

                  }}>
                    <div className="org-icon"></div>
                    <span>{organization.name || ""}</span>
                  </div>
                )
              }
            </div>
          </div>

          <div className="cyber-card info-card">
            <h3>Основная информация</h3>
            {!editing ? (
              <div className="info-grid">
                {/* {user.firstName && (
                  <div className="info-item">
                    <span className="info-label">Имя:</span>
                    <span className="info-value">{user.firstName}</span>
                  </div>
                )}

                {user.lastName && (
                  <div className="info-item">
                    <span className="info-label">Фамилия:</span>
                    <span className="info-value">{user.lastName}</span>
                  </div>
                )} */}
                {user.gender && (
                  <div className="info-item">
                    <span className="info-label">Пол:</span>
                    <span className="info-value">
                      {user.gender === 'M' ? 'Мужской' : user.gender === 'F' ? 'Женский' : 'Не указан'}
                    </span>
                  </div>
                )}
                {user.age && (
                  <div className="info-item">
                    <span className="info-label">Возраст:</span>
                    <span className="info-value">{user.age} лет</span>
                  </div>
                )}
                {user.work && (
                  <div className="info-item">
                    <span className="info-label">Работа:</span>
                    <span className="info-value">{user.work}</span>
                  </div>
                )}
                {user.about && (
                  <div className="info-item full-width">
                    <span className="info-label">О себе:</span>
                    <p className="info-text">{user.about}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="edit-form">
                <div className="form-row-edit">
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
                  Пол
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as '' | 'M' | 'F' })}
                  >
                    <option value="M">Мужской</option>
                    <option value="F">Женский</option>
                  </select>
                </label>
                <label>
                  Возраст
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </label>
                <label>
                  Работа
                  <input
                    type="text"
                    value={formData.work}
                    onChange={(e) => setFormData({ ...formData, work: e.target.value })}
                  />
                </label>
                <label>
                  О себе
                  <textarea
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    rows={3}
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
            )}
          </div>
        </div>

        <div className="center-panel">
          <div className="character-display">
            <div className="character-glow"></div>
            {user.heroId ? (
              <img src={user?.hero?.imagePath ?? imageHero} alt="Character" className="character-image" />
            ) : (
              <img src={imageHero ?? '/image/hero/default_male_hero.png'} alt="Character" className="character-image" />
            )}
          </div>

          {!editing ? (
            <button className="cyber-button" onClick={() => setEditing(true)}>
              <span>Редактировать профиль</span>
            </button>
          ) : (
            <div className="edit-actions-cyber">
              <button className="cyber-button save-btn" onClick={handleSave}>
                <span>Сохранить</span>
              </button>
              <button
                className="cyber-button cancel-btn"
                onClick={() => {
                  setEditing(false);
                  fetchProfile();

                  if (avatarPreview) {
                    URL.revokeObjectURL(avatarPreview);
                  }

                  setAvatarPreview(null);
                  setAvatarFile(null);
                }}
              >Отмена
              </button>
            </div>
          )}

          {editing && (
            <div className="file-upload-section-profile">
              <label className="cyber-button upload-btn">
                <span>📷 Загрузить аватар</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setAvatarFile(e.target.files?.[0] || null);

                    if (avatarPreview) {
                      URL.revokeObjectURL(avatarPreview);
                    }

                    if (e.target.files?.[0]) {
                      const previewUrl = URL.createObjectURL(e.target.files[0]);
                      setAvatarPreview(previewUrl);
                    }
                  }}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          )}
        </div>

        <div className="right-panel">
          <div className="cyber-card skills-card">
            <h3>Навыки</h3>

            {skills.map((skill, index) => (
              <div className="skill-item" key={index}>
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-value">{skill.value}</span>
                </div>
                <div className="progress-bar skill-bar">
                  <div
                    className="progress-fill skill-fill"
                    style={{
                      width: `${skill.value}%`,
                      background: hashStringToGradient(skill.name),
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="cyber-card skins-card">
            <h3>Сменить характер</h3>
            <button className="cyber-button skin-button-select"
              onClick={() => { setShowSkinModal(true); }}
            >
              <span>Выбрать персонажа</span>
            </button>
          </div>
        </div>
      </div>

      {user.resources.length !== 0 && (
        <div className="cyber-card reposts-card">
          <h3>Ресурсы</h3>
          <div className="users-resources-wrapper">
            <Resources 
              resources={user.resources}
            />
          </div>
        </div>
      )}

      {
        showSkinModal ?
          <SkinModal skins={skins} onClose={() => { setShowSkinModal(false); }} onSelect={(skin) => {
            try {
              axios.patch(`/api/users/${currentUser?.id}/heroes`, {
                heroId: skin.id ?? null
              });
              setShowSkinModal(false);
              fetchProfile();
            }
            catch (error) {
              console.error('Failed to change hero:', error);
              alert('Ошибка при смене персонажа');
            }
          }} />
          :
          ""
      }
    </div>
  );
}