import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../AdminChat1.scss';
import notificationSound from '../../services/notification.mp3';
import EmojiPicker from 'emoji-picker-react';

const AdminPanel = ({ admin, onLogout }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const voiceInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const menuRefs = useRef({});
  const baseUrl = 'https://chat.wolff777.co';

  // Track processed message IDs to prevent duplicates
  const processedMessageIds = useRef(new Set());

  // Quick emojis for quick access (fallback)
  const quickEmojis = ['😊', '😂', '🥰', '😍', '😎', '👍', '❤️', '🔥', '🎉', '🙏'];

  useEffect(() => {
    notificationRef.current = new Audio(notificationSound);
    notificationRef.current.volume = 0.7;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target)) {
        setShowAttachmentMenu(false);
      }
      
      // Close message menus when clicking outside
      Object.values(menuRefs.current).forEach(ref => {
        if (ref && !ref.contains(event.target)) {
          setActiveMenu(null);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const playNotificationSound = () => {
    if (notificationRef.current) {
      notificationRef.current.currentTime = 0;
      notificationRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    loadTickets();
    connectWebSocket();
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const websocket = new WebSocket('https://chat.wolff777.co');
    
    websocket.onopen = () => {
      setIsConnected(true);
      setWs(websocket);
      websocket.send(JSON.stringify({
        type: 'register_admin',
        data: { admin_id: 'ADMIN_001', username: 'admin' }
      }));
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_message' && data.message) {
          // ✅ FIX: Prevent duplicate messages
          if (processedMessageIds.current.has(data.message.id)) {
            console.log('⚠️ Duplicate message skipped:', data.message.id);
            return;
          }
          
          processedMessageIds.current.add(data.message.id);
          
          if (data.message.message_type === 'user') {
            playNotificationSound();
          }
          
          if (selectedTicket && data.message.ticket_id === selectedTicket.ticket_id) {
            setMessages(prev => {
              // ✅ Double check for duplicates in state
              if (prev.some(msg => msg.id === data.message.id)) {
                return prev;
              }
              return [...prev, data.message];
            });
          } else {
            setTickets(prev => prev.map(ticket => 
              ticket.ticket_id === data.message.ticket_id 
                ? { 
                    ...ticket, 
                    unread_count: (ticket.unread_count || 0) + 1,
                    // ✅ Update message count correctly
                    user_message_count: (ticket.user_message_count || 0) + 
                      (data.message.message_type === 'user' ? 1 : 0)
                  }
                : ticket
            ));
          }
        }
        else if (data.type === 'tickets_list') {
          // ✅ FIX: Process tickets with correct message counts and user details
          const processedTickets = data.tickets.map(ticket => ({
            ...ticket,
            unread_count: 0,
            user_message_count: calculateUserMessageCount(ticket),
            user_details: ticket.user_details || null
          }));
          setTickets(processedTickets);
        }
        else if (data.type === 'message_delivered') {
          // ✅ Handle message delivery confirmation
          setMessages(prev => prev.map(msg => 
            msg.id === data.message.id 
              ? { ...data.message, isPending: false }
              : msg
          ));
        }
        else if (data.type === 'message_updated' && data.message) {
          setMessages(prev => prev.map(msg => 
            msg.id === data.message.id ? data.message : msg
          ));
        } 
        else if (data.type === 'message_deleted' && data.message_id) {
          setMessages(prev => prev.filter(msg => msg.id !== data.message_id));
          processedMessageIds.current.delete(data.message_id);
        }
        else if (data.type === 'ticket_created') {
          // Handle new ticket creation
          loadTickets();
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    websocket.onclose = () => {
      setIsConnected(false);
      setTimeout(connectWebSocket, 3000);
    };

    setWs(websocket);
  };

  // ✅ FIX: Calculate only user messages (not admin/support messages)
  const calculateUserMessageCount = (ticket) => {
    if (!ticket.messages || !Array.isArray(ticket.messages)) {
      return 0;
    }
    
    return ticket.messages.filter(msg => 
      msg.message_type === 'user' || msg.message_type === 'system'
    ).length;
  };

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/admin/tickets`);
      if (response.data.success) {
        // ✅ FIX: Calculate message count only for user messages
        const ticketsWithCorrectCount = response.data.tickets.map(ticket => ({
          ...ticket,
          unread_count: 0,
          user_message_count: calculateUserMessageCount(ticket),
          user_details: ticket.user_details || null
        }));
        setTickets(ticketsWithCorrectCount);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTicketMessages = async (ticket) => {
    try {
      const response = await axios.get(`${baseUrl}/api/messages/${ticket.ticket_id}`);
      if (response.data.success) {
        // ✅ FIX: Clear processed IDs when loading new ticket
        processedMessageIds.current.clear();
        
        response.data.messages.forEach(msg => {
          processedMessageIds.current.add(msg.id);
        });
        
        setMessages(response.data.messages);
        setSelectedTicket(ticket);
        setEditingMessage(null);
        setActiveMenu(null);
        
        // ✅ FIX: Reset unread count for this ticket
        setTickets(prev => prev.map(t => 
          t.ticket_id === ticket.ticket_id 
            ? { ...t, unread_count: 0 }
            : t
        ));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // ✅ EDIT MESSAGE FUNCTION
  const editMessage = async (messageId, newContent) => {
    if (!ws || !isConnected || !selectedTicket) return;

    try {
      // Update locally first for instant feedback
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent, isEdited: true }
          : msg
      ));

      // Send edit request via WebSocket
      ws.send(JSON.stringify({
        type: 'edit_message',
        data: {
          message_id: messageId,
          new_content: newContent,
          ticket_id: selectedTicket.ticket_id
        }
      }));

      setEditingMessage(null);
      setActiveMenu(null);
    } catch (error) {
      console.error('Error editing message:', error);
      alert('Error editing message');
    }
  };

  // ✅ DELETE MESSAGE FUNCTION
  const deleteMessage = async (messageId) => {
    if (!ws || !isConnected || !selectedTicket) return;

    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      // Remove locally first for instant feedback
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      processedMessageIds.current.delete(messageId);

      // Send delete request via WebSocket
      ws.send(JSON.stringify({
        type: 'delete_message',
        data: {
          message_id: messageId,
          ticket_id: selectedTicket.ticket_id
        }
      }));

      setActiveMenu(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };

  // ✅ START EDITING MESSAGE
  const startEdit = (message) => {
    if (message.message_type === 'support' && message.file_type === 'text') {
      setEditingMessage(message);
      setNewMessage(message.content);
      setActiveMenu(null);
    }
  };

  // ✅ CANCEL EDITING
  const cancelEdit = () => {
    setEditingMessage(null);
    setNewMessage('');
  };

  // ✅ TOGGLE MESSAGE MENU
  const toggleMenu = (messageId) => {
    setActiveMenu(activeMenu === messageId ? null : messageId);
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedFile) || !ws || !isConnected || !selectedTicket) return;

    if (editingMessage) {
      // If editing existing message
      await editMessage(editingMessage.id, newMessage.trim());
      setNewMessage('');
    } else {
      // If sending new message
      if (selectedFile) {
        await sendFileMessage();
      } else {
        await sendTextMessage();
      }
    }
  };

  const sendTextMessage = async () => {
    const messageId = `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const messageData = {
      message_id: messageId,
      ticket_id: selectedTicket.ticket_id,
      user_id: 'ADMIN_001',
      mobile: 'admin',
      message: newMessage.trim(),
      message_type: 'support',
      file_type: 'text',
      timestamp: new Date()
    };

    const tempMessage = {
      id: messageId,
      ticket_id: selectedTicket.ticket_id,
      user_id: 'ADMIN_001',
      user_name: 'You',
      content: newMessage.trim(),
      message_type: 'support',
      file_type: 'text',
      timestamp: new Date().toISOString(),
      isPending: true
    };

    // ✅ FIX: Add to processed IDs immediately
    processedMessageIds.current.add(messageId);
    
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setShowEmojiPicker(false);

    try {
      ws.send(JSON.stringify({
        type: 'send_message',
        data: messageData
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      processedMessageIds.current.delete(messageId);
    }
  };

  const sendFileMessage = async () => {
    if (!selectedFile || !ws || !isConnected || !selectedTicket) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('ticket_id', selectedTicket.ticket_id);
    formData.append('user_id', 'ADMIN_001');

    try {
      setUploading(true);
      const response = await axios.post(`${baseUrl}/api/upload`, formData);

      if (response.data.success) {
        const messageId = `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const messageData = {
          message_id: messageId,
          ticket_id: selectedTicket.ticket_id,
          user_id: 'ADMIN_001',
          mobile: 'admin',
          message: newMessage.trim() || `${baseUrl}${response.data.fileUrl}`,
          message_type: 'support',
          file_type: fileType,
          file_url: response.data.fileUrl,
          file_name: selectedFile.name,
          timestamp: new Date()
        };

        const tempMessage = {
          id: messageId,
          ticket_id: selectedTicket.ticket_id,
          user_id: 'ADMIN_001',
          user_name: 'You',
          content: newMessage.trim() || `${baseUrl}${response.data.fileUrl}`,
          message_type: 'support',
          file_type: fileType,
          file_url: `${baseUrl}${response.data.fileUrl}`,
          file_name: selectedFile.name,
          timestamp: new Date().toISOString(),
          isPending: true
        };

        // ✅ FIX: Add to processed IDs immediately
        processedMessageIds.current.add(messageId);
        
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

  // ✅ DYNAMIC EMOJI PICKER FUNCTION
  const onEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // ✅ Quick emoji function (fallback)
  const addQuickEmoji = (emoji) => {
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

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const updateTicketStatus = async (newStatus) => {
    if (!selectedTicket) return;
    
    try {
      const response = await axios.put(`${baseUrl}/api/admin/tickets/${selectedTicket.ticket_id}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        setTickets(prev => prev.map(ticket => 
          ticket.ticket_id === selectedTicket.ticket_id 
            ? { ...ticket, status: newStatus }
            : ticket
        ));
        setSelectedTicket(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.mobile.includes(searchTerm) ||
      (ticket.user_details && (
        (ticket.user_details.Name && ticket.user_details.Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.user_details.username && ticket.user_details.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.user_details.user_id && ticket.user_details.user_id.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // ✅ FIXED: Calculate stats with correct message count
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    totalUserMessages: tickets.reduce((sum, ticket) => sum + (ticket.user_message_count || 0), 0)
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { class: 'status-open', text: 'Open' },
      closed: { class: 'status-closed', text: 'Closed' }
    };
    
    const config = statusConfig[status] || statusConfig.open;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  // ✅ Get type badge with icon
  const getTypeBadge = (type) => {
    const typeConfig = {
      withdraw: { class: 'type-withdraw', text: 'Withdraw', icon: '💳' },
      deposit: { class: 'type-deposit', text: 'Deposit', icon: '💰' },
      technical: { class: 'type-technical', text: 'Technical', icon: '🔧' }
    };
    
    const config = typeConfig[type] || typeConfig.technical;
    return <span className={`type-badge ${config.class}`}>{config.icon} {config.text}</span>;
  };

  // ✅ Get type icon for ticket list
  const getTypeIcon = (type) => {
    const typeIcons = {
      withdraw: '💳',
      deposit: '💰',
      technical: '🔧'
    };
    return typeIcons[type] || '🔧';
  };

  // ✅ FIXED: Get correct message count for display
  const getMessageCount = (ticket) => {
    return ticket.user_message_count || 0;
  };

  // ✅ Get user display name
  const getUserDisplayName = (ticket) => {
    if (ticket.user_details) {
      return ticket.user_details.Name || ticket.user_details.username || `User ${ticket.mobile}`;
    }
    return `User ${ticket.mobile}`;
  };

  // ✅ Get user mobile number for display
  const getUserMobile = (ticket) => {
    if (ticket.user_details && ticket.user_details.mobile) {
      return ticket.user_details.mobile.toString();
    }
    return ticket.mobile;
  };

  const renderMessageContent = (msg) => {
    switch (msg.file_type) {
      case 'image':
        return (
          <div className="media-content">
            <img 
              src={msg.file_url || msg.content} 
              alt="Shared" 
              className="message-image"
              onClick={() => setSelectedImage(msg.file_url || msg.content)}
            />
            {msg.content && msg.file_type === 'text' && (
              <div className="text-message">{msg.content}</div>
            )}
          </div>
        );
      
      case 'voice':
        return (
          <div className="media-content">
            <audio controls className="audio-player">
              <source src={msg.file_url || msg.content} type="audio/mpeg" />
              Your browser does not support audio element.
            </audio>
          </div>
        );
      
      case 'file':
        return (
          <div className="media-content">
            <div className="file-message">
              <div className="file-icon">📄</div>
              <div className="file-info">
                <div className="file-name">{msg.file_name || 'Document'}</div>
                <a href={msg.file_url || msg.content} download className="download-link">
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
          </div>
        );
    }
  };

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

  const renderSendButton = () => {
    const hasContent = newMessage.trim() || selectedFile;
    
    if (hasContent) {
      return (
        <button 
          onClick={handleSend}
          className="send-button"
          disabled={!isConnected || selectedTicket.status === 'closed' || uploading}
        >
          {uploading ? (
            <div className="upload-spinner-small"></div>
          ) : editingMessage ? (
            '✓' // Save icon for editing
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
          onClick={isRecording ? stopRecording : startRecording}
          className="voice-button"
          disabled={!isConnected || selectedTicket.status === 'closed'}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>
      );
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="admin-panel">
      {/* Sidebar - Tickets List */}
      <div className="tickets-sidebar">
        <div className="sidebar-header">
          <div className="admin-info">
            <h2>Admin Panel</h2>
            <div className="admin-name">Welcome, {admin?.username || 'Admin'}</div>
          </div>
          <div className="header-actions">
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              <div className="status-dot"></div>
              {isConnected ? 'Online' : 'Offline'}
            </div>
            <button onClick={loadTickets} className="refresh-btn" disabled={loading}>
              {loading ? '🔄' : '↻'}
            </button>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="status-filters">
            <button 
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'open' ? 'active' : ''}`}
              onClick={() => setStatusFilter('open')}
            >
              Open
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'closed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('closed')}
            >
              Closed
            </button>
          </div>
        </div>

        {/* Tickets List */}
        <div className="tickets-list">
          {loading ? (
            <div className="loading-state">Loading tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="empty-state">No tickets found</div>
          ) : (
            filteredTickets.map(ticket => (
              <div 
                key={ticket.ticket_id}
                className={`ticket-item ${selectedTicket?.ticket_id === ticket.ticket_id ? 'active' : ''}`}
                onClick={() => loadTicketMessages(ticket)}
              >
                <div className="ticket-header">
                  <span className="ticket-id">#{ticket.ticket_id}</span>
                  {getStatusBadge(ticket.status)}
                </div>
                
                {/* ✅ UPDATED: Show user mobile number instead of user ID */}
                <div className="user-info-section">
                  <div className="user-mobile">📱 {getUserMobile(ticket)}</div>
                  {ticket.user_details && (
                    <div className="user-details">
                      <span className="user-name">
                        👤 {getUserDisplayName(ticket)}
                      </span>
                      {/* ✅ CHANGED: Show mobile number instead of user ID */}
                      <span className="user-mobile-display">Mobile: {getUserMobile(ticket)}</span>
                    </div>
                  )}
                  
                  {/* ✅ ADDED: Show ticket type with icon */}
                  <div className="ticket-type">
                    <span className={`type-badge type-${ticket.type || 'technical'}`}>
                      {getTypeIcon(ticket.type)} {ticket.type ? ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1) : 'Technical'}
                    </span>
                  </div>
                </div>
                
                {ticket.last_message && (
                  <div className="last-message">{ticket.last_message}</div>
                )}
                
                {/* ✅ FIXED: Show correct message count */}
                <div className="ticket-footer">
                  <div className="message-count">
                    📨 {getMessageCount(ticket)} messages
                  </div>
                  {ticket.unread_count > 0 && (
                    <div className="unread-badge">{ticket.unread_count}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ STATS - BOTTOM SECTION */}
        <div className="sidebar-stats">
          <div className="stat-item">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.open}</div>
            <div className="stat-label">Open</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.closed}</div>
            <div className="stat-label">Closed</div>
          </div>
        </div>
      </div>

      {/* Main Content - Chat */}
      <div className="chat-container">
        {selectedTicket ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="user-avatar">👤</div>
                <div className="user-details">
                  <div className="user-name">
                    {getUserDisplayName(selectedTicket)}
                  </div>
                  <div className="user-meta">
                    {/* ✅ CHANGED: Show mobile number instead of user ID */}
                    {/* <span className="user-mobile">📱 {getUserMobile(selectedTicket)}</span> */}
                    {/* <span className="user-type">Type: {selectedTicket.type || 'Technical'}</span> */}
                    {/* <span className="user-status">Online</span> */}
                  </div>
                </div>
              </div>
              <div className="chat-actions">
                {getStatusBadge(selectedTicket.status)}
                {getTypeBadge(selectedTicket.type)}
                {selectedTicket.status === 'open' ? (
                  <button 
                    className="close-ticket-btn"
                    onClick={() => updateTicketStatus('closed')}
                  >
                    Close Ticket
                  </button>
                ) : (
                  <button 
                    className="reopen-ticket-btn"
                    onClick={() => updateTicketStatus('open')}
                  >
                    Reopen Ticket
                  </button>
                )}
                <button onClick={onLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="empty-chat">
                  <div className="empty-icon">💬</div>
                  <p>No messages yet</p>
                  <span>Start a conversation</span>
                </div>
              ) : (
                <div className="messages-list">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`message ${msg.message_type === 'support' ? 'sent' : 'received'}`}
                    >
                      <div className="message-bubble">
                        <div className="message-content">
                          {renderMessageContent(msg)}
                        </div>
                        <div className="message-time">
                          {formatTime(msg.timestamp)}
                          {msg.message_type === 'support' && (
                            <span className="message-status">
                              {msg.isPending ? '🕐' : '✓✓'}
                              {msg.isEdited && <span className="edited-indicator"> • edited</span>}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ✅ MESSAGE ACTIONS MENU FOR SUPPORT MESSAGES */}
                      {msg.message_type === 'support' && !msg.isPending && (
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
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* ✅ EDIT INDICATOR */}
            {editingMessage && (
              <div className="edit-indicator">
                <span>Editing message</span>
                <button className="cancel-edit-btn" onClick={cancelEdit}>✕</button>
              </div>
            )}

            {/* ✅ FILE PREVIEW SECTION */}
            {selectedFile && renderFilePreview()}

            {/* ✅ WHATSAPP STYLE INPUT CONTAINER */}
            <div className="input-container">
              {/* ✅ DYNAMIC EMOJI PICKER */}
              {showEmojiPicker && (
                <div className="emoji-picker-container" ref={emojiPickerRef}>
                  <div className="emoji-picker-header">
                    <span>Emojis</span>
                    <button 
                      className="close-emoji-btn"
                      onClick={() => setShowEmojiPicker(false)}
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Dynamic Emoji Picker */}
                  <div className="dynamic-emoji-picker">
                    <EmojiPicker 
                      onEmojiClick={onEmojiClick}
                      height={350}
                      width="100%"
                      searchDisabled={false}
                      skinTonesDisabled={true}
                      previewConfig={{
                        showPreview: false
                      }}
                    />
                  </div>
                  
                  {/* Quick Emojis Row */}
                  <div className="quick-emojis-section">
                    <div className="quick-emojis-label">Quick Access</div>
                    <div className="quick-emojis-grid">
                      {quickEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          className="quick-emoji-btn"
                          onClick={() => addQuickEmoji(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {showAttachmentMenu && (
                <div className="attachment-menu-dropdown" ref={attachmentMenuRef}>
                  <div className="attachment-option" onClick={() => imageInputRef.current?.click()}>
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

                <input
                  type="file"
                  ref={imageInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e, 'image')}
                  accept="image/*"
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
                    placeholder={
                      editingMessage 
                        ? "Edit your message..." 
                        : selectedFile 
                          ? "Add a caption (optional)..." 
                          : "Type a message"
                    }
                    className="message-input"
                    disabled={!isConnected || selectedTicket.status === 'closed'}
                  />
                  
                  {renderSendButton()}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-ticket-selected">
            <div className="welcome-icon">💬</div>
            <h3>Welcome to Admin Panel</h3>
            <p>Select a ticket from the sidebar to start chatting</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
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

export default AdminPanel;