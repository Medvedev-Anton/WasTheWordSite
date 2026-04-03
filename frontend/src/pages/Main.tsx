import { useState, useEffect } from 'react';
import axios from 'axios';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import './Main.css';

export default function Main() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts/feed');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDeleted = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="main-page">
      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="empty-state">Пока нет постов. Будьте первым!</div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onPostDeleted={handlePostDeleted}
              onPostUpdated={fetchPosts}
            />
          ))
        )}
      </div>
    </div>
  );
}









