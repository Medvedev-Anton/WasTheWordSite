// components/RepostCard.tsx
import { useState } from 'react';
import axios from 'axios';
import { getMediaUrl } from '../config';
import './RepostCard.css';

interface RepostCardProps {
    post: {
        id: number;
        image?: string;
        likesCount: number;
        commentsCount: number;
        repostsCount: number;
        isLiked: boolean;
        authorUsername?: string;
        authorFirstName?: string;
        authorLastName?: string;
        organizationName?: string;
        organizationAvatar?: string;
    };
    onLike?: (postId: number, isLiked: boolean) => void;
    onRepost?: (postId: number) => void;
    showRepostIcon: boolean;
}

export default function RepostCard({ post, onLike, onRepost, showRepostIcon }: RepostCardProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const [repostsCount, setRepostsCount] = useState(post.repostsCount);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await axios.post(`/api/posts/${post.id}/like`);
            const newIsLiked = !isLiked;
            setIsLiked(newIsLiked);
            setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
            if (onLike) onLike(post.id, newIsLiked);
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    const handleRepost = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Сделать репост этого поста?')) return;
        try {
            await axios.post('/api/posts', { repostOfId: post.id });
            setRepostsCount(prev => prev + 1);
            if (onRepost) onRepost(post.id);
            alert('Пост успешно репостнут!');
        } catch (error) {
            console.error('Failed to repost:', error);
            alert('Ошибка при репосте');
        }
    };

    const handleClick = () => {
        window.location.href = `/post/${post.id}`;
    };

    const authorName = post.organizationName
        ? post.organizationName
        : post.authorFirstName && post.authorLastName
            ? `${post.authorFirstName} ${post.authorLastName}`
            : post.authorUsername || 'Unknown';

    return (
        <div className="repost-card" onClick={handleClick}>
            {post.image ? (
                <img src={getMediaUrl(post.image)} alt={authorName} className="repost-card-image" />
            ) : (
                <div className="repost-card-placeholder">
                    <span>📄</span>
                </div>
            )}

            <div className="repost-card-overlay">
                <div className="repost-card-source">{authorName}</div>
                <div className="repost-card-actions">
                    <button
                        className={`repost-card-btn like-btn ${isLiked ? 'active' : ''}`}
                        onClick={handleLike}
                    >
                        ❤️ {likesCount}
                    </button>
                    {
                        showRepostIcon ?
                            <button className="repost-card-btn repost-btn" onClick={handleRepost}>
                                🔄 {repostsCount}
                            </button>
                            :
                            ""
                    }
                </div>
            </div>
        </div>
    );
}