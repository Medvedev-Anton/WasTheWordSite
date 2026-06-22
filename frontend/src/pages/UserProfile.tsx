import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import RepostCard from '../components/RepostCard';
import { getMediaUrl } from '../config';
import './Profile.css';

export default function UserProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [startingChat, setStartingChat] = useState(false);
    const [organizations, setOrganizations] = useState<[]>([]);
    const [skins, setSkins] = useState<[]>([]);
    const [imageHero, setImageHero] = useState(null);

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`/api/users/${id}`);
            setUser(response.data);
            const responseHeroes = await axios.get(`/api/heroes`);
            setSkins(responseHeroes.data.heroes);
            const responseOrganizations = await axios.get(`/api/users/${id}/organizations`);
            setOrganizations(responseOrganizations.data.organizations);

            if (!response?.data?.hero) {
                if (response.data.gender === 'M') {
                    setImageHero('/image/hero/default_male_hero.png');
                }
                else {
                    setImageHero('/image/hero/default_female_hero.png');
                }
            }
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

    if (loading) return <div className="loading">Загрузка...</div>;
    if (!user) return <div className="error">Пользователь не найден</div>;

    if (currentUser && user.id === currentUser.id) {
        navigate('/profile');
        return null;
    }

    const fullName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.username;

    const canMessage = user.allowMessagesFrom === 'everyone';

    const rating = 0;
    const money = 0;
    const energy = 0;

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

    const skills = [
        { name: 'Человечность', value: 100 },
    ];

    return (
        <div className="cyber-profile">

            <button
                className="back-button-user-profile"
                onClick={() => navigate(-1)}
            >
                ← Назад
            </button>

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
                    <span className="stat-value">{(user.balance / 100).toFixed(2)} BFB</span>
                    <span className="stat-label">Деньги</span>
                </div>
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
                                    <img src={user.avatar ?? getMediaUrl(user.avatar)} alt={fullName} />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {fullName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                        <h1 className="profile-username">{user.username}</h1>

                        {canMessage ? (
                            <button
                                onClick={handleStartChat}
                                disabled={startingChat}
                                className="cyber-button message-btn"
                            >
                                <span>💬 {startingChat ? 'Открываю...' : 'Написать сообщение'}</span>
                            </button>
                        ) : (
                            <div className="no-messages-note">
                                {user.allowMessagesFrom === 'nobody'
                                    ? '🔒 Пользователь отключил сообщения'
                                    : '🔒 Пользователь принимает сообщения только от друзей'}
                            </div>
                        )}
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

                        <div className="info-grid">
                            {user.firstName && (
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
                            )}
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

                    </div>
                </div>

                <div className="center-panel">
                    <div className="character-display">
                        <div className="character-glow"></div>
                        {user?.heroId ? (
                            <img src={user?.hero.imagePath ?? imageHero} alt="Character" className="character-image" />
                        ) : (
                            <img src={imageHero} alt="Character" className="character-image" />
                        )}
                    </div>
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
                        <h3>{user?.hero?.name ?? 'Default'}</h3>
                    </div>
                </div>
            </div>

            <div className="cyber-card reposts-card">
                <h3>РЕПОСТЫ</h3>
                <div className="reposts-grid">
                    {user.posts && user.posts.length > 0 ? (
                        user.posts.map((post) => (
                            <RepostCard
                                key={post.id}
                                post={post}
                                onLike={handleRepostLike}
                                onRepost={() => { }}
                            />
                        ))
                    ) : (
                        <div className="empty-reposts">
                            <span>📭</span>
                            <p>Нет репостов</p>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
