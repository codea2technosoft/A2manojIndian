import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../ChatHome.css';

const HomePage = ({ user, onChatStart }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = 'http://localhost:5000';

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/user-tickets/${user.user_id}`);
      if (response.data.success) {
        setTickets(response.data.tickets);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatStart = async (type) => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/api/create-ticket`, {
        user_id: user.user_id,
        mobile: user.mobile,
        type: type
      });
      
      if (response.data.success) {
        onChatStart(type, response.data.ticket.ticket_id);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Error starting chat');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueChat = (ticket) => {
    if (ticket.status === 'closed') {
      alert('This ticket is closed. Please start a new chat.');
      return;
    }
    onChatStart(ticket.type, ticket.ticket_id);
  };

  const getTypeDisplay = (type) => {
    const types = {
      withdraw: 'Withdrawal',
      deposit: 'Deposit',
      technical: 'Technical',
      // general: 'General'
    };
    return types[type] || type;
  };

  const getTypeIcon = (type) => {
    const icons = {
      withdraw: '💳',
      deposit: '💰',
      technical: '🔧',
      // general: '💬'
    };
    return icons[type] || '💬';
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      open: 'Open',
      closed: 'Closed',
      pending: 'Pending'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter tickets to show only open ones in active chats
  const openTickets = tickets.filter(ticket => ticket.status === 'open');

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Header Section */}
        <div className="home-header">
          <div className="welcome-section">
            <div className="welcome-icon">💬</div>
            <div className="welcome-text">
              <h1>Welcome back, {user.name}!</h1>
              <p>How can we help you today?</p>
            </div>
          </div>
          <div className="user-badge">
            <span className="user-initial">{user.name.charAt(0)}</span>
          </div>
        </div>

        {/* Support Options */}
        <div className="support-section">
          <h2>Choose Support Type</h2>
          <div className="support-grid">
            <div 
              className="support-card withdraw"
              onClick={() => handleChatStart('withdraw')}
            >
              <div className="card-icon">💳</div>
              <h3>Withdrawal Support</h3>
              <p>Get help with money withdrawals and transfers</p>
              <div className="card-footer">
                <span className="start-chat">Start Chat →</span>
              </div>
            </div>

            <div 
              className="support-card deposit"
              onClick={() => handleChatStart('deposit')}
            >
              <div className="card-icon">💰</div>
              <h3>Deposit Support</h3>
              <p>Assistance with deposits and payment issues</p>
              <div className="card-footer">
                <span className="start-chat">Start Chat →</span>
              </div>
            </div>

            <div 
              className="support-card technical"
              onClick={() => handleChatStart('technical')}
            >
              <div className="card-icon">🔧</div>
              <h3>Technical Support</h3>
              <p>Help with app issues and technical problems</p>
              <div className="card-footer">
                <span className="start-chat">Start Chat →</span>
              </div>
            </div>

            {/* <div 
              className="support-card general"
              onClick={() => handleChatStart('general')}
            >
              <div className="card-icon">💬</div>
              <h3>General Inquiry</h3>
              <p>Other questions and general support</p>
              <div className="card-footer">
                <span className="start-chat">Start Chat →</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Active Tickets Section - Show only open tickets */}
        {openTickets.length > 0 && (
          <div className="tickets-section">
            <div className="section-header">
              <h2>Your Active Chats</h2>
              <button onClick={loadTickets} className="refresh-btn" disabled={loading}>
                {loading ? '🔄' : '↻'}
              </button>
            </div>
            
            <div className="tickets-list">
              {openTickets.map(ticket => (
                <div 
                  key={ticket.ticket_id}
                  className="ticket-card"
                  onClick={() => handleContinueChat(ticket)}
                >
                  <div className="ticket-icon">
                    {getTypeIcon(ticket.type)}
                  </div>
                  
                  <div className="ticket-content">
                    <div className="ticket-header">
                      <h4>{getTypeDisplay(ticket.type)} Support</h4>
                      <span className={`status-badge ${ticket.status}`}>
                        {getStatusDisplay(ticket.status)}
                      </span>
                    </div>
                    
                    <div className="ticket-details">
                      <span className="ticket-id">#{ticket.ticket_id}</span>
                      <span className="ticket-date">
                        {formatDate(ticket.created_at)}
                      </span>
                    </div>
                    
                    <div className="ticket-footer">
                      <span className="continue-chat">
                        Continue Conversation →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Closed Tickets Section */}
        {tickets.filter(ticket => ticket.status === 'closed').length > 0 && (
          <div className="tickets-section">
            <div className="section-header">
              <h2>Closed Chats</h2>
              <span className="closed-count">
                {tickets.filter(ticket => ticket.status === 'closed').length} closed
              </span>
            </div>
            
            <div className="tickets-list closed-tickets">
              {tickets
                .filter(ticket => ticket.status === 'closed')
                .map(ticket => (
                  <div 
                    key={ticket.ticket_id}
                    className="ticket-card closed"
                    onClick={() => handleContinueChat(ticket)}
                  >
                    <div className="ticket-icon">
                      {getTypeIcon(ticket.type)}
                    </div>
                    
                    <div className="ticket-content">
                      <div className="ticket-header">
                        <h4>{getTypeDisplay(ticket.type)} Support</h4>
                        <span className={`status-badge ${ticket.status}`}>
                          {getStatusDisplay(ticket.status)}
                        </span>
                      </div>
                      
                      <div className="ticket-details">
                        <span className="ticket-id">#{ticket.ticket_id}</span>
                        <span className="ticket-date">
                          {formatDate(ticket.created_at)}
                        </span>
                      </div>
                      
                      <div className="ticket-footer">
                        <span className="continue-chat disabled">
                          Ticket Closed
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Please wait...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;