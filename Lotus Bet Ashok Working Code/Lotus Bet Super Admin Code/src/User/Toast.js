import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-success',
          textColor: 'text-white',
          icon: '✓'
        };
      case 'error':
        return {
          bgColor: 'bg-danger',
          textColor: 'text-white',
          icon: '✕'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning',
          textColor: 'text-dark',
          icon: '⚠'
        };
      default:
        return {
          bgColor: 'bg-info',
          textColor: 'text-white',
          icon: 'ℹ'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className={`toast show ${styles.bgColor} ${styles.textColor} border-0`} 
         style={{
           position: 'fixed',
           top: '20px',
           right: '20px',
           zIndex: 9999,
           minWidth: '300px'
         }}>
      <div className="toast-header border-0">
        <strong className="me-auto">
          <span className="me-2">{styles.icon}</span>
          {type === 'success' ? 'Success' : 
           type === 'error' ? 'Error' : 'Info'}
        </strong>
        <button 
          type="button" 
          className="btn-close btn-close-white" 
          onClick={onClose}
        ></button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

export default Toast;