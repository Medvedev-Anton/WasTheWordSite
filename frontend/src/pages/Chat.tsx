import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chat, Message, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import VoiceRecorder from '../components/VoiceRecorder';
import AudioPlayer from '../components/AudioPlayer';
import ReactPlayer from 'react-player';
import { getMediaUrl } from '../config';
import './Chat.css';

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [chatType, setChatType] = useState<'personal' | 'group'>('personal');
  const [targetUserId, setTargetUserId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupParticipants, setGroupParticipants] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(true);
  const lastMsgIdRef = useRef<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchChats();
    if (showNewChatModal) {
      fetchUsers();
    }
  }, [showNewChatModal]);

  useEffect(() => {
    if (selectedChat) {
      setShouldAutoScroll(true);
      fetchMessages(selectedChat.id);
      const interval = setInterval(() => {
        fetchMessages(selectedChat.id);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    const lastId = lastMsg?.id ?? null;
    const isNewMsg = lastId !== null && lastId !== lastMsgIdRef.current;
    lastMsgIdRef.current = lastId;
    if (shouldAutoScroll && isNewMsg && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Check if user is at bottom of messages container
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px threshold
      setShouldAutoScroll(isAtBottom);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get('/api/chats');
      setChats(response.data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };


  const fetchMessages = async (chatId: number) => {
    try {
      const response = await axios.get(`/api/messages/chat/${chatId}`);
      setMessages(prev => {
        if (prev.length > 0) {
          const prevLastId = prev[prev.length - 1]?.id;
          const newLastId = response.data[response.data.length - 1]?.id;
          if (prevLastId === newLastId) return prev; // no change – skip re-render
        }
        return response.data;
      });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !selectedFile) || !selectedChat) return;

    try {
      const formData = new FormData();
      formData.append('chatId', selectedChat.id.toString());
      formData.append('content', messageText);
      if (selectedFile) {
        // Preserve original filename with proper encoding
        formData.append('file', selectedFile, selectedFile.name);
      }

      const response = await axios.post('/api/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessages([...messages, response.data]);
      setMessageText('');
      setSelectedFile(null);
      setFilePreview(null);
      setShouldAutoScroll(true);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Ошибка при отправке сообщения');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 50MB');
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return '📄';
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('word') || fileType.includes('doc')) return '📘';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📗';
    if (fileType.includes('text')) return '📄';
    return '📎';
  };

  const handleVoiceRecordingComplete = async (audioBlob: Blob) => {
    if (!selectedChat) return;

    try {
      const formData = new FormData();
      formData.append('chatId', selectedChat.id.toString());
      formData.append('content', '🎤 Голосовое сообщение');
      
      // Convert blob to file
      const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
      formData.append('file', audioFile);

      const response = await axios.post('/api/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessages([...messages, response.data]);
      setShowVoiceRecorder(false);
    } catch (error) {
      console.error('Failed to send voice message:', error);
      alert('Ошибка при отправке голосового сообщения');
    }
  };

  const handleCreatePersonalChat = async (userId?: number) => {
    const userIdToUse = userId || parseInt(targetUserId);
    if (!userIdToUse) {
      alert('Выберите пользователя');
      return;
    }

    try {
      const response = await axios.post('/api/chats/personal', {
        targetUserId: userIdToUse,
      });
      setSelectedChat(response.data);
      setShowNewChatModal(false);
      setTargetUserId('');
      setSearchQuery('');
      fetchChats();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при создании чата');
    }
  };

  const handleCreateGroupChat = async () => {
    if (!groupName || groupParticipants.length === 0) {
      alert('Заполните название и выберите участников');
      return;
    }

    try {
      const response = await axios.post('/api/chats/group', {
        name: groupName,
        participantIds: groupParticipants.map(id => parseInt(id)),
      });
      setSelectedChat(response.data);
      setShowNewChatModal(false);
      setGroupName('');
      setGroupParticipants([]);
      fetchChats();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при создании чата');
    }
  };

  const getChatName = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.name || 'Групповой чат';
    }
    if (chat.otherParticipant) {
      const name = chat.otherParticipant.firstName && chat.otherParticipant.lastName
        ? `${chat.otherParticipant.firstName} ${chat.otherParticipant.lastName}`
        : chat.otherParticipant.username;
      return name;
    }
    return 'Личный чат';
  };

  return (
    <div className="chat-page">
      <div className={`chat-sidebar ${!showSidebarOnMobile ? 'mobile-hidden' : ''}`}>
        <div className="chat-sidebar-header">
          <h2>Чаты</h2>
          <button onClick={() => setShowNewChatModal(true)} className="new-chat-btn">
            +
          </button>
        </div>
        <div className="chats-list">
          {chats.length === 0 ? (
            <div className="empty-state">Нет чатов</div>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                onClick={() => { setSelectedChat(chat); setShowSidebarOnMobile(false); }}
              >
                <div className="chat-item-info">
                  <div className="chat-item-header">
                    <div className="chat-item-name">{getChatName(chat)}</div>
                    <span className={`chat-type-badge ${chat.type === 'group' ? 'group' : 'personal'}`}>
                      {chat.type === 'group' ? '👥 Группа' : '👤 Личный'}
                    </span>
                  </div>
                  {chat.lastMessage && (
                    <div className="chat-item-preview">{chat.lastMessage}</div>
                  )}
                </div>
                {chat.lastMessageTime && (
                  <div className="chat-item-time">
                    {new Date(chat.lastMessageTime).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className={`chat-main ${showSidebarOnMobile ? 'mobile-hidden' : ''}`}>
        {selectedChat ? (
          <>
            <div className="chat-header">
              <button className="chat-back-btn" onClick={() => setShowSidebarOnMobile(true)}>←</button>
              <h3>{getChatName(selectedChat)}</h3>
              {selectedChat.type === 'group' && (
                <span className="chat-type">Групповой чат</span>
              )}
            </div>
            <div className="messages-container" ref={messagesContainerRef} onScroll={handleScroll}>
              {messages.map(message => {
                const isOwn = message.userId === user?.id;
                return (
                  <div key={message.id} className={`message ${isOwn ? 'own' : ''}`}>
                    {!isOwn && (
                      <img
                        src={getMediaUrl(message.avatar)}
                        alt={message.username}
                        className="message-avatar"
                      />
                    )}
                    <div className="message-content">
                      {!isOwn && (
                        <div className="message-author">
                          {message.firstName && message.lastName
                            ? `${message.firstName} ${message.lastName}`
                            : message.username}
                        </div>
                      )}
                      {message.content && <div className="message-text">{message.content}</div>}
                      {message.fileUrl && (
                        <div className="message-file">
                          {message.fileType?.startsWith('image/') || message.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img 
                              src={getMediaUrl(message.fileUrl)} 
                              alt={message.fileName || 'Image'}
                              className="message-file-image"
                              onClick={() => {
                                const url = getMediaUrl(message.fileUrl);
                                if (url) window.open(url, '_blank');
                              }}
                            />
                          ) : message.fileType?.startsWith('video/') || message.fileUrl.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i) ? (
                            <div className="message-video">
                              <ReactPlayer
                                url={getMediaUrl(message.fileUrl) || ''}
                                controls
                                width="100%"
                                height="auto"
                                style={{ maxHeight: '400px' }}
                                config={{
                                  file: {
                                    attributes: {
                                      controlsList: 'nodownload'
                                    }
                                  }
                                }}
                              />
                            </div>
                          ) : message.fileType?.startsWith('audio/') || message.fileUrl.match(/\.(webm|mp3|wav|ogg|m4a)$/i) ? (
                            <AudioPlayer 
                              src={getMediaUrl(message.fileUrl) || ''}
                              fileName={message.fileName}
                            />
                          ) : (
                            <a 
                              href={getMediaUrl(message.fileUrl)} 
                              download={message.fileName}
                              className="message-file-link"
                            >
                              <span className="file-icon">{getFileIcon(message.fileType)}</span>
                              <span className="file-name">{message.fileName || 'Файл'}</span>
                            </a>
                          )}
                        </div>
                      )}
                      <div className="message-time">
                        {new Date(message.createdAt).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="message-input-container">
              {showVoiceRecorder && (
                <VoiceRecorder
                  onRecordingComplete={handleVoiceRecordingComplete}
                  onCancel={() => setShowVoiceRecorder(false)}
                />
              )}
              {selectedFile && (
                <div className="file-preview-container">
                  {filePreview ? (
                    <div className="file-preview-image">
                      <img src={filePreview} alt="Preview" />
                      <button onClick={() => { setSelectedFile(null); setFilePreview(null); }} className="remove-file-btn">×</button>
                    </div>
                  ) : (
                    <div className="file-preview-name">
                      <span>{getFileIcon(selectedFile.type)} {selectedFile.name}</span>
                      <button onClick={() => { setSelectedFile(null); setFilePreview(null); }} className="remove-file-btn">×</button>
                    </div>
                  )}
                </div>
              )}
              <div className="message-input-wrapper">
                <label className="file-attach-btn" title="Прикрепить файл">
                  📎
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </label>
                <input
                  type="text"
                  placeholder="Написать сообщение..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  className="message-input"
                />
                {messageText.trim() || selectedFile ? (
                  <button onClick={handleSendMessage} className="send-btn">
                    ➤
                  </button>
                ) : (
                  <button
                    onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
                    className={`voice-record-btn${showVoiceRecorder ? ' active' : ''}`}
                    title="Голосовое сообщение"
                  >
                    🎤
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Выберите чат или создайте новый</p>
          </div>
        )}
      </div>

      {showNewChatModal && (
        <div className="modal-overlay" onClick={() => setShowNewChatModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Создать чат</h3>
            <div className="chat-type-selector">
              <button
                className={chatType === 'personal' ? 'active' : ''}
                onClick={() => setChatType('personal')}
              >
                Личный
              </button>
              <button
                className={chatType === 'group' ? 'active' : ''}
                onClick={() => setChatType('group')}
              >
                Групповой
              </button>
            </div>
            {chatType === 'personal' ? (
              <div className="modal-form">
                <input
                  type="text"
                  placeholder="Поиск пользователей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="user-search-input"
                />
                <div className="users-list">
                  {users
                    .filter(u => {
                      const query = searchQuery.toLowerCase();
                      const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
                      return u.username.toLowerCase().includes(query) || 
                             name.includes(query) ||
                             (u.email && u.email.toLowerCase().includes(query));
                    })
                    .map(userItem => (
                      <div 
                        key={userItem.id} 
                        className="user-item"
                        onClick={() => handleCreatePersonalChat(userItem.id)}
                      >
                        {userItem.avatar && (
                          <img src={getMediaUrl(userItem.avatar)} alt={userItem.username} className="user-item-avatar" />
                        )}
                        <div className="user-item-info">
                          <div className="user-item-name">
                            {userItem.firstName && userItem.lastName
                              ? `${userItem.firstName} ${userItem.lastName}`
                              : userItem.username}
                          </div>
                          <div className="user-item-username">@{userItem.username}</div>
                        </div>
                        {userItem.allowMessagesFrom === 'nobody' && (
                          <span className="no-messages-badge">Не принимает сообщения</span>
                        )}
                      </div>
                    ))}
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowNewChatModal(false)}>
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="modal-form">
                <input
                  type="text"
                  placeholder="Название группы"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Поиск пользователей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="user-search-input"
                />
                <div className="users-list">
                  {users
                    .filter(u => {
                      const query = searchQuery.toLowerCase();
                      const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
                      return u.username.toLowerCase().includes(query) || 
                             name.includes(query) ||
                             (u.email && u.email.toLowerCase().includes(query));
                    })
                    .map(userItem => {
                      const isSelected = groupParticipants.includes(userItem.id.toString());
                      return (
                        <div 
                          key={userItem.id} 
                          className={`user-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            if (isSelected) {
                              setGroupParticipants(groupParticipants.filter(id => id !== userItem.id.toString()));
                            } else {
                              setGroupParticipants([...groupParticipants, userItem.id.toString()]);
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                          />
                          {userItem.avatar && (
                            <img src={getMediaUrl(userItem.avatar)} alt={userItem.username} className="user-item-avatar" />
                          )}
                          <div className="user-item-info">
                            <div className="user-item-name">
                              {userItem.firstName && userItem.lastName
                                ? `${userItem.firstName} ${userItem.lastName}`
                                : userItem.username}
                            </div>
                            <div className="user-item-username">@{userItem.username}</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowNewChatModal(false)}>
                    Отмена
                  </button>
                  <button onClick={handleCreateGroupChat} disabled={!groupName || groupParticipants.length === 0}>
                    Создать
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

