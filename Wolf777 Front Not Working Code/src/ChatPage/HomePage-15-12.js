import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../ChatHome.css';

const HomePage = ({ user, onChatStart }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCloseTicketPopup, setShowCloseTicketPopup] = useState(false);
  const [ticketToClose, setTicketToClose] = useState(null);
  const [checkingTimeout, setCheckingTimeout] = useState(false);
  const [popupProcessing, setPopupProcessing] = useState(false);
  
  const baseUrl = 'https://cricketsocket.sindoor7.com';
  const popupShownRef = useRef(new Set());
  const isProcessingRef = useRef(false);

  // ✅ SINGLE PLACE TO CHANGE TIME PERIOD
  const INACTIVITY_THRESHOLD_MINUTES = 10; // मिनटों में
  const INACTIVITY_THRESHOLD_MS = INACTIVITY_THRESHOLD_MINUTES * 60 * 1000;
  const CHECK_INTERVAL_MS = Math.min(INACTIVITY_THRESHOLD_MS / 2, 10000);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkForInactiveTickets();
    }, CHECK_INTERVAL_MS);

    const initialTimeout = setTimeout(() => {
      checkForInactiveTickets();
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);


      
    };
  }, [tickets, CHECK_INTERVAL_MS]);

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

  const checkForInactiveTickets = () => {
    // ✅ PREVENT MULTIPLE SIMULTANEOUS CHECKS
    if (checkingTimeout || tickets.length === 0 || isProcessingRef.current) return;

    setCheckingTimeout(true);
    isProcessingRef.current = true;
    
    const now = new Date();

    // Find ALL open tickets regardless of how old they are
    const openTickets = tickets.filter(ticket => ticket.status === 'open');
    
    if (openTickets.length === 0) {
      setCheckingTimeout(false);
      isProcessingRef.current = false;
      return;
    }

    // Sort tickets by how old they are (oldest first)
    openTickets.sort((a, b) => {
      return new Date(a.updated_at) - new Date(b.updated_at);
    });

    // Check each open ticket
    for (const ticket of openTickets) {
      const lastUpdated = new Date(ticket.updated_at);
      const timeDiff = now - lastUpdated;
      
      if (timeDiff > INACTIVITY_THRESHOLD_MS) {
        // Check if we already showed popup for this ticket in current session
        if (popupShownRef.current.has(ticket.ticket_id)) {
          continue;
        }
        
        // Also check localStorage for persistent tracking
        const popupShownTime = localStorage.getItem(`popup_shown_${ticket.ticket_id}`);
        const currentTime = now.getTime();
        
        const POPUP_REPEAT_INTERVAL_MS = Math.max(INACTIVITY_THRESHOLD_MS, 5 * 60 * 1000);
        
        if (!popupShownTime || (currentTime - parseInt(popupShownTime)) > POPUP_REPEAT_INTERVAL_MS) {
          // ✅ PREVENT IF POPUP IS ALREADY SHOWING
          if (showCloseTicketPopup) {
            continue;
          }
          
          // Show popup and store tracking info
          popupShownRef.current.add(ticket.ticket_id);
          localStorage.setItem(`popup_shown_${ticket.ticket_id}`, currentTime.toString());
          
          console.log(`Showing popup for ticket ${ticket.ticket_id}`, {
            thresholdMinutes: INACTIVITY_THRESHOLD_MINUTES,
            lastUpdated: lastUpdated.toLocaleString(),
            timeDiffMinutes: Math.floor(timeDiff / 60000)
          });
          
          setTicketToClose(ticket);
          setShowCloseTicketPopup(true);
          break;
        }
      }
    }
    
    setCheckingTimeout(false);
    isProcessingRef.current = false;
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
    
    // Remove from popup tracking when user continues chat
    popupShownRef.current.delete(ticket.ticket_id);
    localStorage.removeItem(`popup_shown_${ticket.ticket_id}`);
    
    onChatStart(ticket.type, ticket.ticket_id);
  };

  const handleCloseTicket = async () => {
    if (!ticketToClose || popupProcessing) return;

    try {
      setPopupProcessing(true);
      setLoading(true);
      
      const response = await axios.put(`${baseUrl}/api/admin/tickets/${ticketToClose.ticket_id}/status`, {
        status: 'closed'
      });

      if (response.data.success) {
        // Update local state
        setTickets(prevTickets => 
          prevTickets.map(ticket => 
            ticket.ticket_id === ticketToClose.ticket_id 
              ? { ...ticket, status: 'closed', updated_at: new Date() }
              : ticket
          )
        );
        
        // Remove from tracking
        popupShownRef.current.delete(ticketToClose.ticket_id);
        localStorage.removeItem(`popup_shown_${ticketToClose.ticket_id}`);
        
        // ✅ IMMEDIATELY CLOSE POPUP AND RESET STATE
        setShowCloseTicketPopup(false);
        setTicketToClose(null);
        
        // Clear after a delay to prevent immediate recheck
        setTimeout(() => {
          setPopupProcessing(false);
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error closing ticket:', error);
      alert('Error closing ticket');
      setPopupProcessing(false);
      setLoading(false);
    }
  };

  const handleDontCloseTicket = () => {
    if (!ticketToClose || popupProcessing) return;
    
    setPopupProcessing(true);
    
    // Update the ticket's updated_at time to current time
    const updatedTicket = {
      ...ticketToClose,
      updated_at: new Date().toISOString()
    };

    // Update local state
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.ticket_id === ticketToClose.ticket_id 
          ? updatedTicket
          : ticket
      )
    );

    // Also update in backend to reset the timer
    updateTicketTimestamp(ticketToClose.ticket_id);

    // Remove from popup tracking
    popupShownRef.current.delete(ticketToClose.ticket_id);
    localStorage.removeItem(`popup_shown_${ticketToClose.ticket_id}`);

    // ✅ IMMEDIATELY CLOSE POPUP
    setShowCloseTicketPopup(false);
    setTicketToClose(null);
    
    // Reset processing state after a delay
    setTimeout(() => {
      setPopupProcessing(false);
    }, 1000);
  };

  const updateTicketTimestamp = async (ticketId) => {
    try {
      await axios.put(`${baseUrl}/api/admin/tickets/${ticketId}/update-timestamp`, {
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating ticket timestamp:', error);
    }
  };

  // ✅ IMPROVED POPUP CLOSE HANDLER
  const handlePopupClose = () => {
    if (popupProcessing) return;
    
    setShowCloseTicketPopup(false);
    
    // Mark ticket as processed but don't update timestamp
    if (ticketToClose) {
      popupShownRef.current.add(ticketToClose.ticket_id);
      localStorage.setItem(`popup_shown_${ticketToClose.ticket_id}`, Date.now().toString());
    }
    
    setTimeout(() => {
      setTicketToClose(null);
    }, 300);
  };

  const getTypeDisplay = (type) => {
    const types = {
      withdraw: 'Withdrawal',
      deposit: 'Deposit',
      technical: 'Technical',
    };
    return types[type] || type;
  };

  const getTypeIcon = (type) => {
    const icons = {
      withdraw: '💳',
      deposit: '💰',
      technical: '🔧',
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30);

      if (diffMins < 1) {
        return 'Just now';
      } else if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      } else if (diffWeeks < 4) {
        return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
      } else {
        return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
      }
    } catch (error) {
      console.error('Error formatting time:', error, dateString);
      return 'Recently';
    }
  };

  const getTimeDetails = (dateString) => {
    if (!dateString) return 'Invalid date';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMinutes = Math.floor(diffMs / 60000);
      
      return {
        minutes: diffMinutes,
        hours: Math.floor(diffMs / 3600000),
        days: Math.floor(diffMs / 86400000),
        isInactive: diffMinutes > INACTIVITY_THRESHOLD_MINUTES
      };
    } catch (error) {
      return { minutes: 0, hours: 0, days: 0, isInactive: false };
    }
  };

  // Filter tickets to show only open ones in active chats
  const openTickets = tickets.filter(ticket => ticket.status === 'open');

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Header Section with Threshold Info */}
        <div className="home-header">
          <div className="welcome-section">
            <div className="welcome-icon">💬</div>
            <div className="welcome-text">
              <h1>Welcome back, {user.name}!</h1>
              <p>How can we help you today?</p>
            </div>
          </div>
          <div className="header-right-section">
            <div className="threshold-badge">
              Auto-close: {INACTIVITY_THRESHOLD_MINUTES} min
            </div>
            <div className="user-badge">
              <span className="user-initial">{user.name.charAt(0)}</span>
            </div>
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
          </div>
        </div>

        {/* Active Tickets Section */}
        {openTickets.length > 0 && (
          <div className="tickets-section">
            <div className="section-header">
              <h2>Your Active Chats</h2>
              <div className="header-right">
                <span className="inactive-info">
                  {openTickets.length} open ticket{openTickets.length !== 1 ? 's' : ''}
                </span>
                <button onClick={loadTickets} className="refresh-btn" disabled={loading}>
                  {loading ? '🔄' : '↻'}
                </button>
              </div>
            </div>
            
            <div className="tickets-list">
              {openTickets.map(ticket => {
                const timeDetails = getTimeDetails(ticket.updated_at);
                const isOld = timeDetails.isInactive;
                
                return (
                  <div 
                    key={ticket.ticket_id}
                    className={`ticket-card ${isOld ? 'inactive' : ''}`}
                    onClick={() => handleContinueChat(ticket)}
                  >
                    <div className="ticket-icon">
                      {getTypeIcon(ticket.type)}
                    </div>
                    
                    <div className="ticket-content">
                      <div className="ticket-header">
                        <h4>{getTypeDisplay(ticket.type)} Support</h4>
                        <span className={`status-badge ${ticket.status} ${isOld ? 'inactive-badge' : ''}`}>
                          {getStatusDisplay(ticket.status)}
                          {isOld && ` (${timeDetails.minutes}m)`}
                        </span>
                      </div>
                      
                      <div className="ticket-details">
                        <span className="ticket-id">#{ticket.ticket_id}</span>
                        <span className={`ticket-date ${isOld ? 'inactive-date' : ''}`}>
                          Last updated: {formatTimeAgo(ticket.updated_at)}
                          {isOld && ` > ${INACTIVITY_THRESHOLD_MINUTES}m`}
                        </span>
                      </div>
                      
                      <div className="ticket-footer">
                        <span className="continue-chat">
                          Continue Conversation →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
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

        {/* Close Ticket Popup */}
        {showCloseTicketPopup && ticketToClose && (
          <div className="popup-overlay">
            <div className="close-ticket-popup">
              <div className="popup-header">
                <h3>Chat Close Ticket</h3>
                <div className="threshold-indicator">
                  (Auto-close after {INACTIVITY_THRESHOLD_MINUTES} min)
                </div>
                <button 
                  className="popup-close-btn"
                  onClick={handlePopupClose}
                  disabled={popupProcessing}
                >
                  ×
                </button>
              </div>
              
              <div className="popup-content">
                <div className="popup-icon">⏰</div>
                <h4 className="popup-question">Is your issue resolved now?</h4>
                
                <p className="popup-description">
                  Your chat for <strong>{getTypeDisplay(ticketToClose.type)} Support</strong> 
                  has been inactive for <strong>{formatTimeAgo(ticketToClose.updated_at).replace('ago', '')}</strong>.
                </p>
                
                <div className="popup-ticket-info">
                  <div className="info-row">
                    <span className="info-label">Ticket ID:</span>
                    <span className="info-value">#{ticketToClose.ticket_id}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Type:</span>
                    <span className="info-value">{getTypeDisplay(ticketToClose.type)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Last Activity:</span>
                    <span className="info-value">
                      {new Date(ticketToClose.updated_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Inactive for:</span>
                    <span className="info-value">
                      {getTimeDetails(ticketToClose.updated_at).minutes} minutes
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Threshold:</span>
                    <span className="info-value threshold-value">
                      {INACTIVITY_THRESHOLD_MINUTES} minutes
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="popup-buttons">
                <button 
                  className="btn-no"
                  onClick={handleDontCloseTicket}
                  disabled={popupProcessing}
                >
                  <span className="button-maintext">
                    {popupProcessing ? 'Processing...' : 'No'}
                  </span>
                  <span className="button-subtext">Continue Chat</span>
                </button>
                <button 
                  className="btn-yes"
                  onClick={handleCloseTicket}
                  disabled={popupProcessing}
                >
                  <span className="button-maintext">
                    {popupProcessing ? 'Processing...' : 'Yes'}
                  </span>
                  <span className="button-subtext">Close Ticket</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && !showCloseTicketPopup && (
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