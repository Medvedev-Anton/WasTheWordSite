import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Post, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import AudioPlayer from './AudioPlayer';
import ReactPlayer from 'react-player';
import { getMediaUrl } from '../config';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  onPostDeleted: (postId: number) => void;
  onPostUpdated: () => void;
}

export default function PostCard({ post, onPostDeleted, onPostUpdated }: PostCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(post.isLiked === 1);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const handleLike = async () => {
    try {
      await axios.post(`/api/posts/${post.id}/like`);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const loadComments = async () => {
    try {
      const response = await axios.get(`/api/posts/${post.id}`);
      if (response.data.comments) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(`/api/posts/${post.id}/comments`, {
        content: commentText,
      });
      setComments([...comments, response.data]);
      setCommentText('');
      onPostUpdated();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleRepost = async () => {
    if (!confirm('Сделать репост этого поста?')) return;

    try {
      const response = await axios.post('/api/posts', {
        repostOfId: post.id,
      });
      onPostUpdated();
      alert('Пост успешно репостнут!');
    } catch (error) {
      console.error('Failed to repost:', error);
      alert('Ошибка при репосте');
    }
  };

  const openImageModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleDelete = async () => {
    if (!confirm('Удалить этот пост?')) return;

    try {
      await axios.delete(`/api/posts/${post.id}`);
      onPostDeleted(post.id);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const authorName = post.authorFirstName && post.authorLastName
    ? `${post.authorFirstName} ${post.authorLastName}`
    : post.authorUsername || 'Неизвестный';

  const displayName = post.organizationName || authorName;
  const displayAvatar = post.organizationAvatar || post.authorAvatar;

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          {displayAvatar && (
            <img src={getMediaUrl(displayAvatar)} alt={displayName} className="avatar" />
          )}
          <div>
            <div
              className={post.organizationName ? 'author-name' : 'author-name author-name-link'}
              onClick={() => !post.organizationName && post.authorId && navigate(`/users/${post.authorId}`)}
            >{displayName}</div>

            <div className="post-date">{new Date(post.createdAt).toLocaleString('ru-RU')}</div>
          </div>
        </div>
        {user?.id === post.authorId && (
          <button onClick={handleDelete} className="delete-btn">×</button>
        )}
      </div>
      <div className="post-content">
        {post.content && <p>{post.content}</p>}
        {post.repostOfId && (
          <div className="reposted-post">
            <div className="repost-header">
              🔄 Репост от {post.repostedAuthorFirstName && post.repostedAuthorLastName
                ? `${post.repostedAuthorFirstName} ${post.repostedAuthorLastName}`
                : post.repostedAuthorUsername}
            </div>
            <div className="reposted-content">
              {post.repostedContent && <p>{post.repostedContent}</p>}
              {post.repostedImage && (
                <img 
                  src={getMediaUrl(post.repostedImage)} 
                  alt="Reposted" 
                  className="post-image"
                  onClick={() => openImageModal(getMediaUrl(post.repostedImage) || '')}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </div>
          </div>
        )}
        {/* Display files from post_files table */}
        {post.files && post.files.length > 0 && (
          <div className="post-files">
            {post.files.map((file) => (
              <div key={file.id} className="post-file">
                {file.fileType?.startsWith('image/') || file.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img 
                    src={getMediaUrl(file.fileUrl)} 
                    alt={file.fileName || 'Post'} 
                    className="post-image"
                    onClick={() => openImageModal(getMediaUrl(file.fileUrl) || '')}
                    style={{ cursor: 'pointer' }}
                  />
                ) : file.fileType?.startsWith('video/') || file.fileUrl.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i) ? (
                  <div className="post-video">
                    <ReactPlayer
                      url={getMediaUrl(file.fileUrl) || ''}
                      controls
                      width="100%"
                      height="auto"
                      style={{ maxHeight: '500px' }}
                      config={{
                        file: {
                          attributes: {
                            controlsList: 'nodownload'
                          }
                        }
                      }}
                    />
                  </div>
                ) : file.fileType?.startsWith('audio/') || file.fileUrl.match(/\.(webm|mp3|wav|ogg|m4a)$/i) ? (
                  <AudioPlayer 
                    src={getMediaUrl(file.fileUrl) || ''}
                    fileName={file.fileName || file.fileUrl.split('/').pop() || 'Audio'}
                  />
                ) : (
                  <a 
                    href={getMediaUrl(file.fileUrl)} 
                    download={file.fileName || file.fileUrl.split('/').pop()}
                    className="post-file-link"
                  >
                    <span className="file-icon">📎</span>
                    <span className="file-name">{file.fileName || file.fileUrl.split('/').pop() || 'Файл'}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Backward compatibility: display old image field if no files */}
        {(!post.files || post.files.length === 0) && post.image && (
          <div className="post-file">
            {post.image.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img 
                src={getMediaUrl(post.image)} 
                alt="Post" 
                className="post-image"
                onClick={() => openImageModal(getMediaUrl(post.image) || '')}
                style={{ cursor: 'pointer' }}
              />
            ) : post.image.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i) ? (
              <div className="post-video">
                <ReactPlayer
                  url={getMediaUrl(post.image) || ''}
                  controls
                  width="100%"
                  height="auto"
                  style={{ maxHeight: '500px' }}
                  config={{
                    file: {
                      attributes: {
                        controlsList: 'nodownload'
                      }
                    }
                  }}
                />
              </div>
            ) : post.image.match(/\.(webm|mp3|wav|ogg|m4a)$/i) ? (
              <AudioPlayer 
                src={getMediaUrl(post.image) || ''}
                fileName={post.image.split('/').pop() || 'Audio'}
              />
            ) : (
              <a 
                href={getMediaUrl(post.image)} 
                download={post.image.split('/').pop()}
                className="post-file-link"
              >
                <span className="file-icon">📎</span>
                <span className="file-name">{post.image.split('/').pop() || 'Файл'}</span>
              </a>
            )}
          </div>
        )}
      </div>
      <div className="post-actions">
        <button onClick={handleLike} className={`like-btn ${isLiked ? 'liked' : ''}`}>
          ❤️ {likesCount}
        </button>
        <button 
          onClick={() => {
            if (!showComments && comments.length === 0) {
              loadComments();
            }
            setShowComments(!showComments);
          }} 
          className="comment-btn"
        >
          💬 {post.commentsCount || comments.length}
        </button>
        <button onClick={handleRepost} className="repost-btn">
          🔄 {post.repostsCount || 0}
        </button>
      </div>
      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <img
                  src={getMediaUrl(comment.avatar)}
                  alt={comment.username}
                  className="comment-avatar"
                />
                <div className="comment-content">
                  <div
                    className="comment-author author-name-link"
                    onClick={() => navigate(`/users/${comment.userId}`)}
                  >
                    {comment.firstName && comment.lastName
                      ? `${comment.firstName} ${comment.lastName}`
                      : comment.username}
                  </div>
                  <div className="comment-text">{comment.content}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="comment-input">
            <input
              type="text"
              placeholder="Написать комментарий..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            />
            <button onClick={handleComment}>Отправить</button>
          </div>
        </div>
      )}
      {imageModalOpen && modalImage && (
        <div className="image-modal-overlay" onClick={() => setImageModalOpen(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={() => setImageModalOpen(false)}>×</button>
            <img src={modalImage} alt="Full size" className="image-modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}

