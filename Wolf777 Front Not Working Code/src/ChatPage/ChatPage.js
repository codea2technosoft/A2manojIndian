import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../Chat.css';

const ChatPage = ({ user, chatType, ticketId, onBackToHome }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const menuRefs = useRef({});
  const emojiPickerRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const processedMessageIds = useRef(new Set());
  const pendingMessages = useRef(new Map());
  const baseUrl = 'https://chat.wolff777.co';
    const user_mobile = localStorage.getItem('user_mobile');

  // Common emojis for quick access
  const quickEmojis = ['😊', '😂', '🥰', '😍', '😎', '👍', '❤️', '🔥', '🎉', '🙏'];

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(menuRefs.current).forEach(ref => {
        if (ref && !ref.contains(event.target)) {
          setActiveMenu(null);
        }
      });

      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target)) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load messages and connect WebSocket
  useEffect(() => {
    if (ticketId) {
      loadMessages();
      connectWebSocket();
    }

    return () => {
      if (ws) {
        ws.close();
      }
      processedMessageIds.current.clear();
      pendingMessages.current.clear();
    };
  }, [ticketId]);

  const connectWebSocket = () => {
    // const websocket = new WebSocket('ws://localhost:5000');
    const websocket = new WebSocket('https://chat.wolff777.co');
  
    
    websocket.onopen = () => {
      console.log('✅ WebSocket Connected');
      setIsConnected(true);
      setWs(websocket);
      
      websocket.send(JSON.stringify({
        type: 'register_user',
        data: { 
          user_id: user.user_id, 
          ticket_id: ticketId,
          name: user.name,
          mobile: user_mobile
        }
      }));
      console.log(`✅ User registered for ticket: ${ticketId}`);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 User received:', data.type, data.message?.id);
        
        // ✅ STRICT DUPLICATE PREVENTION
        if (data.message && processedMessageIds.current.has(data.message.id)) {
          console.log('🔄 Message already processed, skipping:', data.message.id);
          return;
        }

        if (data.type === 'message_delivered' && data.message) {
          processedMessageIds.current.add(data.message.id);
          pendingMessages.current.delete(data.message.id);
          
          setMessages(prev => {
            const filtered = prev.filter(msg => 
              msg.id !== data.message.id && !msg.isPending
            );
            return [...filtered, { ...data.message, isPending: false }];
          });
          
          console.log('✅ Message delivered:', data.message.id);
        } 
        else if (data.type === 'new_message' && data.message) {
          processedMessageIds.current.add(data.message.id);
          
          setMessages(prev => {
            const exists = prev.some(msg => msg.id === data.message.id);
            if (!exists) {
              return [...prev, data.message];
            }
            return prev;
          });
        }
        else if (data.type === 'message_updated' && data.message) {
          setMessages(prev => prev.map(msg => 
            msg.id === data.message.id ? data.message : msg
          ));
        } 
        else if (data.type === 'message_deleted' && data.message_id) {
          setMessages(prev => prev.filter(msg => msg.id !== data.message_id));
          processedMessageIds.current.delete(data.message_id);
          pendingMessages.current.delete(data.message_id);
        }
        else if (data.type === 'message_error') {
          console.error('❌ Message sending failed:', data.message_id);
          pendingMessages.current.delete(data.message_id);
          setMessages(prev => prev.filter(msg => msg.id !== data.message_id));
          alert('Failed to send message. Please try again.');
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    websocket.onclose = () => {
      console.log('❌ WebSocket Disconnected');
      setIsConnected(false);
      setTimeout(() => {
        if (ticketId) {
          connectWebSocket();
        }
      }, 3000);
    };

    websocket.onerror = (error) => {
      console.error('💥 WebSocket error:', error);
      setIsConnected(false);
    };

    setWs(websocket);
  };

  // ✅ Auto-remove pending status after timeout
  useEffect(() => {
    const checkPendingMessages = () => {
      const now = Date.now();
      let hasUpdates = false;
      
      pendingMessages.current.forEach((timestamp, messageId) => {
        if (now - timestamp > 10000) {
          console.log('🕒 Auto-removing pending status for:', messageId);
          setMessages(prev => prev.map(msg => 
            msg.id === messageId ? { ...msg, isPending: false } : msg
          ));
          pendingMessages.current.delete(messageId);
          hasUpdates = true;
        }
      });
      
      if (hasUpdates) {
        console.log('🔄 Auto-updated pending messages');
      }
    };

    const interval = setInterval(checkPendingMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/messages/${ticketId}`);
      if (response.data.success) {
        processedMessageIds.current.clear();
        pendingMessages.current.clear();
        
        response.data.messages.forEach(msg => {
          processedMessageIds.current.add(msg.id);
        });
        
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SINGLE SEND FUNCTION FOR BOTH TEXT AND FILES
  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedFile) || !ws || !isConnected) return;

    if (selectedFile) {
      await sendFileMessage();
    } else {
      await sendTextMessage();
    }
  };

  const sendTextMessage = async () => {
    const messageId = `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const messageData = {
      message_id: messageId,
      ticket_id: ticketId,
      user_id: user.user_id,
      mobile: user_mobile,
      message: newMessage.trim(),
      message_type: 'user',
      file_type: 'text',
      timestamp: new Date()
    };

    const tempMessage = {
      id: messageId,
      ticket_id: ticketId,
      user_id: user.user_id,
      user_name: 'You',
      content: newMessage.trim(),
      message_type: 'user',
      file_type: 'text',
      timestamp: new Date().toISOString(),
      isPending: true
    };

    processedMessageIds.current.add(messageId);
    pendingMessages.current.set(messageId, Date.now());
    
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setShowEmojiPicker(false);

    try {
      console.log('📤 Sending message:', messageId);
      ws.send(JSON.stringify({
        type: 'send_message',
        data: messageData
      }));
    } catch (error) {
      console.error('❌ Error sending message:', error);
      processedMessageIds.current.delete(messageId);
      pendingMessages.current.delete(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      alert('Error sending message. Please try again.');
    }
  };

  const sendFileMessage = async () => {
    if (!selectedFile || !ws || !isConnected) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('ticket_id', ticketId);
    formData.append('user_id', user.user_id);

    try {
      setUploading(true);
      const response = await axios.post(`${baseUrl}/api/upload`, formData);

      if (response.data.success) {
        const messageId = `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const messageData = {
          message_id: messageId,
          ticket_id: ticketId,
          user_id: user.user_id,
          mobile: user_mobile,
          message: newMessage.trim() || `${baseUrl}${response.data.fileUrl}`,
          message_type: 'user',
          file_type: fileType,
          file_url: response.data.fileUrl,
          file_name: selectedFile.name,
          timestamp: new Date()
        };

        const tempMessage = {
          id: messageId,
          ticket_id: ticketId,
          user_id: user.user_id,
          user_name: 'You',
          content: newMessage.trim() || `${baseUrl}${response.data.fileUrl}`,
          message_type: 'user',
          file_type: fileType,
          file_url: `${baseUrl}${response.data.fileUrl}`,
          file_name: selectedFile.name,
          timestamp: new Date().toISOString(),
          isPending: true
        };

        processedMessageIds.current.add(messageId);
        pendingMessages.current.set(messageId, Date.now());
        
        setMessages(prev => [...prev, tempMessage]);

        ws.send(JSON.stringify({
          type: 'send_message',
          data: messageData
        }));

        cancelFileSelection();
        setNewMessage('');
      }
    } catch (error) {
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size too large. Maximum size is 10MB.');
        return;
      }
      
      setSelectedFile(file);
      setFileType(type);
      
      if (type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
      
      setShowAttachmentMenu(false);
    }
    e.target.value = '';
  };

  const cancelFileSelection = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowAttachmentMenu(false);
  };

  const toggleAttachmentMenu = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
    setShowEmojiPicker(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `voice_${Date.now()}.wav`, { type: 'audio/wav' });
        handleFileUpload(audioFile, 'voice');
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      alert('Error accessing microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleFileUpload = async (file, fileType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ticket_id', ticketId);
    formData.append('user_id', user.user_id);

    try {
      setUploading(true);
      const response = await axios.post(`${baseUrl}/api/upload`, formData);

      if (response.data.success) {
        await sendFileMessage();
      }
    } catch (error) {
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const editMessage = async (messageId, newContent) => {
    if (!ws || !isConnected) return;

    try {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent, isEdited: true }
          : msg
      ));

      ws.send(JSON.stringify({
        type: 'edit_message',
        data: {
          message_id: messageId,
          new_content: newContent,
          ticket_id: ticketId
        }
      }));

      setEditingMessage(null);
      setActiveMenu(null);
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!ws || !isConnected) return;

    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      processedMessageIds.current.delete(messageId);
      pendingMessages.current.delete(messageId);

      ws.send(JSON.stringify({
        type: 'delete_message',
        data: {
          message_id: messageId,
          ticket_id: ticketId
        }
      }));

      setActiveMenu(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };

  const startEdit = (message) => {
    if (message.message_type === 'user' && message.file_type === 'text') {
      setEditingMessage(message);
      setNewMessage(message.content);
      setActiveMenu(null);
    }
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setNewMessage('');
  };

  const toggleMenu = (messageId) => {
    setActiveMenu(activeMenu === messageId ? null : messageId);
  };

  // ✅ Determine which button to show
  const renderSendButton = () => {
    const hasContent = newMessage.trim() || selectedFile;
    
    if (hasContent) {
      return (
        <button 
          onClick={handleSend}
          className="send-button"
          disabled={!isConnected || uploading}
        >
          {uploading ? (
            <div className="upload-spinner-small"></div>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          )}
        </button>
      );
    } else {
      return (
       <button 
  onClick={recording ? stopRecording : startRecording}
  className="voice-button"
  disabled={!isConnected}
>
  {recording ? (
    '⏹️'
  ) : (
    <svg 
      viewBox="0 0 24 24" 
      width="24" 
      height="24" 
      fill="currentColor"
    >
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
    </svg>
  )}
</button>

      );
    }
  };

  // Render file preview
  const renderFilePreview = () => {
    if (!selectedFile) return null;

    return (
      <div className="file-preview">
        <div className="preview-header">
          <span className="preview-title">
            {fileType === 'image' ? 'Image Preview' : 'Document Preview'}
          </span>
          <button className="cancel-preview-btn" onClick={cancelFileSelection}>
            ×
          </button>
        </div>
        
        <div className="preview-content">
          {fileType === 'image' ? (
            <img src={filePreview} alt="Preview" className="image-preview" />
          ) : (
            <div className="document-preview">
              <div className="doc-icon">📄</div>
              <div className="doc-info">
                <div className="doc-name">{selectedFile.name}</div>
                <div className="doc-size">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="preview-note">
          <span>Click the send button to share this file</span>
        </div>
      </div>
    );
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const groupMessagesByDate = () => {
    const grouped = {};
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return grouped;
  };

 const renderMessageContent = (msg) => {
  const mediaUrl = msg.file_url || msg.content;

  switch (msg.file_type) {
    case 'image':
      return (
        <div className="media-content">
          <div className="image-wrapper">
            <img 
              src={mediaUrl} 
              alt="Shared" 
              className="message-image"
              onClick={() => setSelectedImage(mediaUrl)}
            />
            <div className="image-overlay" onClick={() => setSelectedImage(mediaUrl)}>
              <span className="zoom-icon">🔍</span>
            </div>
          </div>
          {msg.content && msg.file_type === 'text' && (
            <div className="text-message">{msg.content}</div>
          )}
        </div>
      );
    
    case 'voice':
      return (
        <div className="media-content">
          <div className="voice-wrapper">
            <audio controls className="audio-player" src={mediaUrl}>
              Your browser does not support audio element.
            </audio>
          </div>
        </div>
      );
    
    case 'file':
      return (
        <div className="media-content">
          <div className="file-wrapper">
            <div className="file-icon">📄</div>
            <div className="file-info">
              <span className="file-name">{msg.file_name || 'Document'}</span>
              <a href={mediaUrl} download className="download-btn">
                Download
              </a>
            </div>
          </div>
          {msg.content && msg.file_type === 'text' && (
            <div className="text-message">{msg.content}</div>
          )}
        </div>
      );
    
    default:
      return (
        <div className="text-content">
          <p className="text-message">{msg.content}</p>
          {msg.isEdited && <span className="edited-badge">edited</span>}
        </div>
      );
  }
};

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="chat-page">
      {/* Header - Admin Panel Style */}
      <div className="chat-header">
        <div className="header-left">
          <button onClick={onBackToHome} className="back-btn">
            <span className="back-icon">←</span>
            Back
          </button>
          <div className="chat-info">
            <h2 className="chat-title">Support Chat</h2>
            <div className="chat-subtitle">We're here to help you</div>
          </div>
        </div>
        
        <div className="header-actions">
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <div className="status-dot"></div>
            {isConnected ? 'Online' : 'Offline'}
          </div>
          <button onClick={loadMessages} className="refresh-btn" disabled={loading}>
            {loading ? '🔄' : '↻'}
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>No messages yet</h3>
            <p>Start the conversation by sending a message</p>
          </div>
        ) : (
          <div className="messages-list">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date} className="date-group">
                <div className="date-divider">
                  <span className="date-text">{date}</span>
                </div>
               {dateMessages.map((msg) => (
  <div 
    key={msg.id} 
    className={`message ${msg.message_type} ${msg.file_type} ${msg.isPending ? 'pending' : ''}`}
  >
    <div className="message-content">
      <div className="message-header">
        <span className="sender-name">{msg.user_name}</span>
        <span className="message-time">{formatTime(msg.timestamp)}</span>
      </div>
      <div className="message-body">
        {renderMessageContent(msg)}
        {/* ⏳ Sending... status removed from here */}
      </div>
    </div>

    {/* Three Dots Menu for User Messages */}
    {msg.message_type === 'user' && !msg.isPending && (
      <div className="message-actions">
        <button 
          className="dots-menu-btn"
          onClick={() => toggleMenu(msg.id)}
        >
          ⋮
        </button>
        
        {activeMenu === msg.id && (
          <div 
            className="message-menu"
            ref={el => menuRefs.current[msg.id] = el}
          >
            {msg.file_type === 'text' && (
              <button 
                className="menu-item edit-item"
                onClick={() => startEdit(msg)}
              >
                <span className="menu-icon">✏️</span>
                Edit
              </button>
            )}
            
            <button 
              className="menu-item delete-item"
              onClick={() => deleteMessage(msg.id)}
            >
              <span className="menu-icon">🗑️</span>
              Delete
            </button>
          </div>
        )}
      </div>
    )}
  </div>
))}
              </div>
            ))}
            <div ref={messagesEndRef} className="scroll-anchor" />
          </div>
        )}
      </div>

      {/* ✅ FILE PREVIEW SECTION */}
      {selectedFile && renderFilePreview()}

      {/* ✅ WHATSAPP STYLE INPUT CONTAINER */}
      <div className="input-container">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="emoji-picker" ref={emojiPickerRef}>
            <div className="emoji-picker-header">
              <span>Quick Emojis</span>
              <button 
                className="close-emoji-btn"
                onClick={() => setShowEmojiPicker(false)}
              >
                ×
              </button>
            </div>
            <div className="emoji-grid">
              {quickEmojis.map((emoji, index) => (
                <button
                  key={index}
                  className="emoji-btn"
                  onClick={() => addEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Attachment Menu */}
        {showAttachmentMenu && (
          <div className="attachment-menu-dropdown" ref={attachmentMenuRef}>
            <div className="attachment-option" onClick={() => cameraInputRef.current?.click()}>
              <div className="attachment-icon camera">📷</div>
              <div className="attachment-text">Camera & Gallery</div>
            </div>
            <div className="attachment-option" onClick={() => fileInputRef.current?.click()}>
              <div className="attachment-icon document">📄</div>
              <div className="attachment-text">Document</div>
            </div>
          </div>
        )}

        <div className="input-wrapper">
          {editingMessage && (
            <div className="edit-indicator">
              <span>Editing message</span>
              <button className="cancel-edit-btn" onClick={cancelEdit}>✕</button>
            </div>
          )}
          
          <div className="input-actions">
            <button 
              className="input-action-btn emoji-btn"
              onClick={toggleEmojiPicker}
              title="Emoji"
            >
              <span className="emoji-icon">😊</span>
            </button>

            <button 
              className="input-action-btn attachment-btn"
              onClick={toggleAttachmentMenu}
              title="Attachment"
            >
              <span className="attachment-icon">📎</span>
            </button>

            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={cameraInputRef}
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e, 'image')}
              accept="image/*"
              capture="camera"
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e, 'file')}
              accept="*/*"
            />

            <div className="text-input-wrapper">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedFile ? "Add a caption (optional)..." : "Type your message..."}
                className="message-input"
                disabled={!isConnected || uploading}
              />
              
              {/* ✅ SINGLE SEND/VOICE BUTTON */}
              {renderSendButton()}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Indicator */}
      {uploading && (
        <div className="upload-indicator">
          <div className="upload-spinner"></div>
          Uploading...
        </div>
      )}

      {/* Image Zoom Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedImage(null)}>×</button>
            <img src={selectedImage} alt="Zoomed" className="zoomed-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;