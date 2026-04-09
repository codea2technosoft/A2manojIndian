// context/SidebarContext.js
import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsMobileOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsMobileOpen(false);
  };

  const openSidebar = () => {
    setIsMobileOpen(true);
  };

  return (
    <SidebarContext.Provider value={{
      isMobileOpen,
      toggleSidebar,
      closeSidebar,
      openSidebar
    }}>
      {children}
    </SidebarContext.Provider>
  );
};