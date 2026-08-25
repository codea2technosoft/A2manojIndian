// src/Layout/index.jsx or src/Layout.jsx
import React from 'react';
import SoundNotification from '../components/SoundNotification';
import { useWebSocket } from '../hooks/useWebSocket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
  const { isConnected } = useWebSocket();

  return (
    <div className="layout">
      {/* Global Sound Notification */}
      <SoundNotification />
      
      {/* Toast Container */}
      <ToastContainer />
      
      {/* Connection Status */}
      <div className="ws-status">
        {isConnected ? '🟢' : '🔴'}
      </div>
      
      {/* Your existing layout */}
      <header>
        {/* Header content */}
      </header>
      
      <main>
        {children}
      </main>
      
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default Layout;