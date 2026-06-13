import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Chat, Message, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import VoiceRecorder from '../components/VoiceRecorder';
import AudioPlayer from '../components/AudioPlayer';
import ReactPlayer from 'react-player';
import { getMediaUrl } from '../config';
import './Chat.css';
import Linkify from 'linkify-react';
import { useLongPress } from '../components/UseLongPress';

export default function ChatPage() {
  const linkifyOptions = {
    target: '_blank',
    rel: 'noopener noreferrer',
    className: 'custom-link-class',
  };

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
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [chatOrgNameAndType, setChatOrgNameAndType] = useState<string>('');
  const [showMessageContextMobile, setShowMessageContextMobile] = useState<boolean>(false);
  const [checkedMessageIds, setCheckedMessageIds] = useState<number[]>([]);
  const [currentContextMessageId, setCurrentContextMessageId] = useState<number | null>();
  const [showForwardMessageModal, setShowForwardMessageModal] = useState<boolean>(false);
  const [openedForwardMessageAuthor, setOpenedForwardMessageAuthor] = useState<string>();
  const [openedForwardMessageText, setOpenedForwardMessageText] = useState<string>();

  // Стейты ответа на сообщение
  const [responseMessageText, setResponseMessageText] = useState<string | null>();
  const [responseMessageAuthor, setResponseMessageAuthor] = useState<string | null>();
  const [isMessageResponse, setIsMessageResponse] = useState<boolean>(false);

  // Стейт пересылки сообщения
  const [isMessageForward, setIsMessageForward] = useState<boolean>(false);
  const [isMessageForwardStart, setIsMessageForwardStart] = useState<boolean>(false);
  
  const [messageMenuState, setMessageMenuState] = useState({
    isVisible: false,
    x: 0,
    y: 0,
  });

  const messageLongPressCallback = (e: any) => {
    const messageEl = e.currentTarget.closest('[data-message-id]') 
      ?? e.currentTarget;
    const messageId = Number(messageEl.getAttribute('data-message-id'));
    
    if (!messageId) return;
    
    setShowMessageContextMobile(true);
    // setCheckedMessageIds(prev => 
    //   prev.includes(messageId) ? prev : [...prev, messageId]
    // );
    setCheckedMessageIds([messageId]);
  };

  // Клик на кнопку ответа на сообщение
  const handleResponseMessageClick = () => {
    const message = getMessageById(checkedMessageIds[0]);

    if (message === null) {
      return;
    }

    closeMessageMenu();
    setIsMessageResponse(true);

    const messageText = message.content;
    const messageAuthor = message.username

    setResponseMessageText(messageText);
    setResponseMessageAuthor(messageAuthor);
  }

  // Клик на кнопку отмена ответа на сообщение
  const handleResponseCancelClick = () => {
    setIsMessageResponse(false);
    setIsMessageForward(false);
    setResponseMessageText(null);
    setResponseMessageAuthor(null);
  }

  // Клик на кнопку пересылки сообщения
  const handleForwardMessageClick = () => {
    const message = getMessageById(checkedMessageIds[0]);

    if (message === null) {
      return;
    }

    closeMessageMenu();
    setIsMessageForward(true);
    setIsMessageForwardStart(true);
    setSelectedChat(null);
    setShowSidebarOnMobile(true);

    const messageText = message.content;
    const messageAuthor = message.username

    setResponseMessageText(messageText);
    setResponseMessageAuthor(messageAuthor);
  }

  // Возвращает данные сообщения по id
  const getMessageById = (messageId: number) => {
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].id == messageId) {
        return messages[i];
      }
    }

    return null;
  }

  // Открытие модального окна пересланного сообщения
  const handleForwardMessageDataClick = (e: any) => {
    const author = e.currentTarget.getAttribute('data-message-author');
    const text = e.currentTarget.getAttribute('data-message-text');

    setOpenedForwardMessageAuthor(author);
    setOpenedForwardMessageText(text);

    setShowForwardMessageModal(true);
  }

  const messageLongPressHandlers = useLongPress(messageLongPressCallback, 500);

  const lastMsgIdRef = useRef<number | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const readMessagesRef = useRef<Set<number>>(new Set());

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
      fetchOrgAdmin(selectedChat);

      if (selectedChat.type === 'group') {
        fetchChatOrgData(selectedChat.id);
      }

      if (isMessageForwardStart) {
        setIsMessageForwardStart(false);
      }

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

  useEffect(() => {
    readMessagesRef.current.clear();
    
    if (!isMessageForward) {
      setCheckedMessageIds([]);
    }

    setShowMessageContextMobile(false);

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = Number(entry.target.getAttribute('data-message-id'));
            
            if (messageId && !readMessagesRef.current.has(messageId)) {
              readMessagesRef.current.add(messageId);
              markMessageAsRead(messageId);
              observer.current?.unobserve(entry.target);
            }
          }
        });
      },
      {
        root: messagesContainerRef.current,
        threshold: 0.1,
      }
    );

    const existingMessages = messagesContainerRef.current?.querySelectorAll('[data-message-id]');
    
    existingMessages?.forEach((node) => {
      const messageId = Number(node.getAttribute('data-message-id'));
      const isReaded = node.getAttribute('data-is-readed');
      const isOwn = node.getAttribute('data-is-own');
      
      const isReadedBool = isReaded === '1' || isReaded === 'true';
      const isOwnBool = isOwn === 'true';
      
      if (!isReadedBool && !isOwnBool && !readMessagesRef.current.has(messageId)) {
        observer.current?.observe(node);
      }
    });

    return () => {
      observer.current?.disconnect();
    };
  }, [selectedChat]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (messageMenuState.isVisible) {
        closeMessageMenu();
      }
    };

    if (messageMenuState.isVisible) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [messageMenuState.isVisible]);

  useEffect(() => {
    if (currentContextMessageId !== null && currentContextMessageId !== undefined) {
      setCheckedMessageIds([currentContextMessageId]);
    }
    
  }, [currentContextMessageId]);

  // Склонение слова "участник"
  function declensionMemberWord(count: number) {
    const n = Math.abs(Math.floor(Number(count)));
    
    const lastDigit = n % 10;
    const lastTwoDigits = n % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return count + ' участников';
    }
    
    if (lastDigit === 1) {
      return count + ' участник';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
      return count + ' участника';
    }
    
    return count + ' участников';
  }

  const handleContextMessageMenu = (e: any) => {
    e.preventDefault();

    setCurrentContextMessageId(e.currentTarget.getAttribute('data-message-id'));
    
    setMessageMenuState({
      isVisible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const closeMessageMenu = () => {
    setMessageMenuState({ ...messageMenuState, isVisible: false });
    setShowMessageContextMobile(false);
    setCurrentContextMessageId(null);
  };

  const scrollToMessage = (messageId: number, offset = 20) => {
    const container = messagesContainerRef.current;
    const el = container?.querySelector(`[data-message-id="${messageId}"]`);
    if (!container || !el) return;

    setShouldAutoScroll(false);

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    container.scrollTo({
      top: elRect.top - containerRect.top + container.scrollTop - offset,
      behavior: 'smooth',
    });

    el.classList.add('message-highlight');
    setTimeout(() => el.classList.remove('message-highlight'), 1500);
  };

  const markMessageAsRead = async (messageId: number) => {
    try {
      await axios.post(`/api/messages/${messageId}/read`, {
        chatId: selectedChat?.id
      }); 
      console.log(messageId);
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isReaded: 1 } : msg
      ));
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      readMessagesRef.current.delete(messageId);
    }
  };

  const messageRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (node && observer.current) {
      const messageId = Number(node.getAttribute('data-message-id'));
      const isReaded = node.getAttribute('data-is-readed');
      const isOwn = node.getAttribute('data-is-own');
      
      const isReadedBool = isReaded === '1' || isReaded === 'true';
      const isOwnBool = isOwn === 'true';
      
      if (!isReadedBool && !isOwnBool && !readMessagesRef.current.has(messageId)) {
        observer.current.observe(node);
      }
    }
  }, []);

  const fetchOrgAdmin = async (chat: Chat) => {
    const result = await axios.get(`/api/organizations/${chat.organizationId}/admin`);

    if (result.data.adminId == user?.id) {
      setIsUserAdmin(true);
    }
    else {
      setIsUserAdmin(false);
    }
  }

  const fetchChatOrgData = async (chatId: number) => {
    const result = await axios.get(`/api/chats/${chatId}/org`);
    const org = result.data.org;
    const orgName = org.name;
    const orgType = org.orgType;
    setChatOrgNameAndType(`${orgName} - ${orgType}`);
  }

  const fetchDeleteChat = async () => {
    const result = await axios.delete(`/api/chats/${selectedChat?.id}`);

    if (result.data.message == 'Success') {
      fetchChats();
      setSelectedChat(null);
    }
  }

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
          const prevLast = prev[prev.length - 1];
          const newLast = response.data[response.data.length - 1];
          if (newLast !== undefined && prevLast.id === newLast.id && prevLast.isReaded === newLast.isReaded) {
            return prev; // Ничего не изменилось — пропускаем ре-рендер
          }
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

      let response;

      if (isMessageResponse && checkedMessageIds.length > 0) {
        formData.append('responseMessageText', responseMessageText || '');
        formData.append('responseMessageAuthor', responseMessageAuthor || '');
        formData.append('responseMessageId', checkedMessageIds[0].toString() || '');

        response = await axios.post('/api/messages/response', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        handleResponseCancelClick();
      }
      else if (isMessageForward && checkedMessageIds.length > 0) {
        formData.append('responseMessageText', responseMessageText || '');
        formData.append('responseMessageAuthor', responseMessageAuthor || '');
        formData.append('responseMessageId', checkedMessageIds[0].toString() || '');

        response = await axios.post('/api/messages/forward', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        handleResponseCancelClick();
      }
      else {
        response = await axios.post('/api/messages', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
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

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('Удалить это сообщение?')) return;
    try {
      const response = await axios.delete(`/api/messages/${messageId}`);
      setMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении сообщения');
    }
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.avatar) return getMediaUrl(chat.avatar);
    if (chat.type === 'personal' && chat.otherParticipant?.avatar) return getMediaUrl(chat.otherParticipant.avatar);
    return null;
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
                onClick={() => { 
                  chat.countNotReaded = 0;
                  setSelectedChat(chat); 
                  setShowSidebarOnMobile(false); 
                }}
              >
                <div className="chat-item-avatar">
                  {getChatAvatar(chat) ? (
                    <img src={getChatAvatar(chat)!} alt={getChatName(chat)} className="chat-item-avatar-img" />
                  ) : (
                    <div className="chat-item-avatar-placeholder">
                      {chat.type === 'group' ? '👥' : '👤'}
                    </div>
                  )}
                </div>
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
                <div className="chat-right-block">
                  {chat.countNotReaded !== 0 && (
                    <div className="chat-count-not-readed">
                      {chat.countNotReaded}
                    </div>
                  )}

                  {chat.lastMessageTime && (
                    <div className="chat-item-time">
                      {new Date(chat.lastMessageTime).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>                
              </div>
            ))
          )}
        </div>
      </div>

      <div className={`chat-main ${showSidebarOnMobile ? 'mobile-hidden' : ''} ${isMessageForwardStart ? 'forward' : ''}`}>
        {selectedChat ? (
          <>
            {
              showMessageContextMobile
              ?
              <div className="chat-header">
                <div className="close-message-context-wrapper">
                  <div 
                    className="close-message-context-icon"
                    onClick={e => {
                      setShowMessageContextMobile(false);
                      setCheckedMessageIds([]);
                    }}
                  >
                  </div>
                  <span className="count-checked-messages">
                    1 сообщение
                  </span>
                </div>                
              </div>
              :
              <div className="chat-header">
                <div className="chat-header-left">
                  <div className="chat-header-avatar-wrapper">
                    <img src={getChatAvatar(selectedChat)!} alt="chat-avatar" />
                  </div>
                </div>
                <div className="chat-header-right">
                    <div className="chat-header-top">
                    <button className="chat-back-btn" onClick={() => setShowSidebarOnMobile(true)}>←</button>

                    <h3>{getChatName(selectedChat)}</h3>
                    {selectedChat.type === 'group' && (
                      <span className="chat-type">
                        {chatOrgNameAndType}
                      </span>
                    )}
                    {
                      isUserAdmin && (
                        <span
                          className="delete-chat"
                          onClick={fetchDeleteChat}
                        >
                          Удалить чат
                        </span>
                      )
                    }
                  </div>
                  <div className="chat-header-bottom">
                    {declensionMemberWord(selectedChat.countParticipants)}
                  </div>
                </div>
                
              </div>
            }
            

              {messageMenuState.isVisible && (
              <div
                className="message-menu-wrapper"
                style={{
                  top: messageMenuState.y,
                  left: messageMenuState.x,
                }}
              >
                <ul className="message-menu-list">
                  <li 
                    onClick={e => {                     
                      handleResponseMessageClick();
                    }
                  }
                  >
                    Ответить
                  </li>
                  <li 
                    onClick={e => {
                      handleForwardMessageClick();
                    }}
                  >
                    Переслать
                  </li>
                </ul>
              </div>
            )}

            <div 
              className={`messages-container`} 
              ref={messagesContainerRef} 
              onScroll={handleScroll}
            >
              {messages.map(message => {
                const isOwn = message.userId === user?.id;
                const isChecked = checkedMessageIds.includes(message.id);
                return (
                  <div 
                    {...messageLongPressHandlers}
                    key={message.id} 
                    data-message-id={message.id}
                    className={`message ${isOwn ? 'own' : ''} ${message.isDeleted ? 'deleted' : ''}`}
                    onContextMenu={handleContextMessageMenu}
                  >
                    {
                      showMessageContextMobile && (
                        <div className="message-checked-wrapper">
                          <div className={`message-checked-border ${isChecked ? 'checked' : ''}`}>

                          </div>
                        </div>
                      )
                    }
                    <div className="message-avatar-wrapper">
                      {
                        getMediaUrl(message.avatar)
                          ? <img src={getMediaUrl(message.avatar)} alt={message.username} className="message-avatar" />
                          : <div className="message-avatar message-avatar-placeholder">
                              {(message.firstName || message.username || '?')[0].toUpperCase()}
                            </div>
                      }
                      <div className="message-rang-wrapper">
                        <img src={message.rangImageUrl || ''} alt="rang" />
                      </div>
                    </div>
                    
                    <div 
                      className="message-content"
                      data-is-readed={message.isReaded}
                      data-is-own={String(isOwn)}
                      data-message-id={message.id}
                      ref={messageRefCallback} 
                    >
                      {!isOwn && (
                        <div className="message-author">
                          {message.firstName && message.lastName
                            ? `${message.firstName} ${message.lastName}`
                            : message.username}
                        </div>
                      )}
                      {message.isDeleted ? (
                        <div className="message-deleted-placeholder">
                          🚫 Сообщение удалено{message.deletedAt ? ` ${new Date(message.deletedAt).toLocaleDateString('ru-RU')}` : ''}
                        </div>
                      ) : (
                        <>
                          {message.isResponse != 0 && (
                            <div 
                              className="message-response-content"
                              onClick={e => {
                                scrollToMessage(parseInt(message.responseFromMessageId || ''));
                              }}
                            >
                              <div className="message-response-author">
                                {message.responseFromMessageAuthor}
                              </div>
                              <div className="message-response-text">
                                <span>
                                  {message.responseFromMessageText}
                                </span>
                              </div>
                            </div>
                          )}

                          {message.isForward != 0 && (
                            <div 
                              className="message-forward-content"
                              data-message-author={message.responseFromMessageAuthor}
                              data-message-text={message.responseFromMessageText}
                              onClick={handleForwardMessageDataClick}
                            >
                              <div className="message-forward-author">
                                {message.responseFromMessageAuthor}
                              </div>
                              <div className="message-forward-text">
                                <span>
                                  {message.responseFromMessageText}
                                </span>
                              </div>
                            </div>
                          )}

                          {message.content && 
                          <div className="message-text">
                            <Linkify options={linkifyOptions}>
                              {message.content}
                            </Linkify>
                          </div>}
                          {message.fileUrl && (
                            <div className="message-file">
                              {message.fileDeleted ? (
                                <div className="message-file-deleted">
                                  🗑️ Файл «{message.fileName || 'файл'}» был удалён{message.fileDeletedAt ? ` ${new Date(message.fileDeletedAt).toLocaleDateString('ru-RU')}` : ''}
                                </div>
                              ) : message.fileType?.startsWith('image/') || message.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
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
                        </>
                      )}
                      <div className="message-bottom">
                        <div className="message-time">
                          {new Date(message.createdAt).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>

                        {
                          message.isReaded == 1 && isOwn && (
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="24" 
                              height="24" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="2 12 6 16 16 6" />
                              <polyline points="8 12 12 16 22 6" />
                            </svg>
                          )
                        }
                        
                      </div>                      
                      {isOwn && !message.isDeleted && (
                        <button
                          className="message-delete-btn"
                          title="Удалить сообщение"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            
            {
              (isMessageResponse || isMessageForward) && !showMessageContextMobile && (
                <div className="message-response-data-wrapper">
                  <div className="message-response-data-content">
                    <p className="message-response-data-author">
                      {responseMessageAuthor}
                    </p>
                    <p className="message-response-data-text">
                      {responseMessageText}
                    </p>
                  </div>
                  <div 
                    className="message-response-data-close"
                    onClick={e => handleResponseCancelClick()}
                  >

                  </div>
                </div>
              )
            }

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

              {
                showMessageContextMobile
                ?
                <div className="message-input-wrapper">
                  <div className="message-menu-content-buttons">
                    <button
                      onClick={handleResponseMessageClick}
                    >
                      Ответить
                    </button>

                    <button
                      onClick={handleForwardMessageClick}
                    >
                      Переслать
                    </button>
                  </div>                  
                </div>
                :
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
              }
              
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Выберите чат или создайте новый</p>
          </div>
        )}

        {showForwardMessageModal && (
          <div className="forward-message-modal-overlay" onClick={() => setShowForwardMessageModal(false)}>
            <div className="forward-message-modal" onClick={(e) => e.stopPropagation()}>
                <div className="forward-message-modal-content">
                  <div className="forward-message-modal-auhtor">
                    {openedForwardMessageAuthor}
                  </div>
                  <div className="forward-message-modal-text">
                    {openedForwardMessageText}
                  </div>
                </div>
            </div>
          </div>
        )}
      </div>

      {showNewChatModal && (
        <div className="modal-overlay" onClick={() => setShowNewChatModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Создать личный чат</h3>
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
          </div>
        </div>
      )}
    </div>
  );
}

