import { useState } from 'react';
import axios from 'axios';
import { Post } from '../types';
import VoiceRecorder from './VoiceRecorder';
import './CreatePost.css';

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
  organizationId?: number;
}

export default function CreatePost({ onPostCreated, organizationId }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<Array<{ url: string; type: string; name: string }>>([]);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && files.length === 0 && !showVoiceRecorder) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('content', content);
    
    // Append all files
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    if (organizationId) {
      formData.append('organizationId', organizationId.toString());
    }

    try {
      const response = await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onPostCreated(response.data);
      setContent('');
      setFiles([]);
      setFilePreviews([]);
    } catch (error: any) {
      console.error('Failed to create post:', error);
      alert(error.response?.data?.error || 'Ошибка при создании поста');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceRecordingComplete = async (audioBlob: Blob) => {
    if (!content.trim() && !audioBlob) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content || '🎤 Голосовое сообщение');
      
      const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
      formData.append('files', audioFile);
      
      if (organizationId) {
        formData.append('organizationId', organizationId.toString());
      }

      const response = await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onPostCreated(response.data);
      setContent('');
      setShowVoiceRecorder(false);
    } catch (error: any) {
      console.error('Failed to create post:', error);
      alert(error.response?.data?.error || 'Ошибка при создании поста');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Что у вас нового?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        {showVoiceRecorder && (
          <VoiceRecorder
            onRecordingComplete={handleVoiceRecordingComplete}
            onCancel={() => setShowVoiceRecorder(false)}
          />
        )}
        {filePreviews.length > 0 && (
          <div className="files-preview-container">
            {filePreviews.map((preview, index) => (
              <div key={index} className="file-preview-item">
                {preview.type.startsWith('image/') ? (
                  <img src={preview.url} alt={preview.name} className="file-preview-image" />
                ) : preview.type.startsWith('video/') ? (
                  <div className="file-preview-video">
                    <video src={preview.url} controls style={{ maxWidth: '300px', maxHeight: '300px' }} />
                  </div>
                ) : (
                  <div className="file-preview-name">
                    <span className="file-icon">📎</span>
                    <span className="file-name">{preview.name}</span>
                  </div>
                )}
                <button 
                  type="button" 
                  onClick={() => {
                    const newFiles = [...files];
                    const newPreviews = [...filePreviews];
                    // Revoke object URL if it's a video
                    if (preview.type.startsWith('video/') && preview.url) {
                      URL.revokeObjectURL(preview.url);
                    }
                    newFiles.splice(index, 1);
                    newPreviews.splice(index, 1);
                    setFiles(newFiles);
                    setFilePreviews(newPreviews);
                  }}
                  className="remove-file-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="create-post-actions">
          <label className="file-input-label">
            📎 Файлы
            <input
              type="file"
              multiple
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files || []);
                if (selectedFiles.length > 0) {
                  const newFiles = [...files, ...selectedFiles];
                  setFiles(newFiles);
                  
                  // Create previews for new files
                  const newPreviews = [...filePreviews];
                  selectedFiles.forEach((file) => {
                    if (file.type.startsWith('image/')) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        newPreviews.push({
                          url: reader.result as string,
                          type: file.type,
                          name: file.name
                        });
                        setFilePreviews([...newPreviews]);
                      };
                      reader.readAsDataURL(file);
                    } else if (file.type.startsWith('video/')) {
                      // For video files, create object URL for preview
                      const videoUrl = URL.createObjectURL(file);
                      newPreviews.push({
                        url: videoUrl,
                        type: file.type,
                        name: file.name
                      });
                      setFilePreviews([...newPreviews]);
                    } else {
                      newPreviews.push({
                        url: '',
                        type: file.type,
                        name: file.name
                      });
                      setFilePreviews([...newPreviews]);
                    }
                  });
                }
              }}
              style={{ display: 'none' }}
            />
          </label>
          <button
            type="button"
            onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
            className="voice-record-btn"
          >
            🎤 Голос
          </button>
          <button type="submit" disabled={loading || (!content.trim() && files.length === 0 && !showVoiceRecorder)}>
            {loading ? 'Публикация...' : 'Опубликовать'}
          </button>
        </div>
      </form>
    </div>
  );
}

