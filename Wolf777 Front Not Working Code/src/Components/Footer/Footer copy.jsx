import { useRef, useState, useEffect } from 'react';
import './Footer.scss';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from '../context/SidebarContext';
import { Modal } from "react-bootstrap";
import Login from "../Pages/Login";   // 🔥 your login component
import { ImTrophy } from 'react-icons/im';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(1);
  const itemRefs = useRef([]);

  const { openSidebar } = useSidebar();

  const token = localStorage.getItem("accessToken");

  // 🔥 MODAL STATE
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openLogin = () => setShowLoginModal(true);
  const closeLogin = () => setShowLoginModal(false);

  const menuItems = [
    {
      id: 1,
      name: 'Home',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10L12 3l9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" /><path d="M9 21V12h6v9" /></svg>,
      link: '/Home'
    },
    {
      id: 2,
      name: 'In-Play',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /><path d="M9 2h6" /></svg>,
      link: '/inplay'
    },
    {
      id: 3,
      name: 'Sports',
      icon: <ImTrophy />,
      link: '#',
      onClick: openSidebar,
      className: 'sports-nav'
    },

 

    // 🔥 Multi Market → if token missing, open modal
    {
      id: 4,
      name: 'Multi M..',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2l-4 4 6 6-2 2-6-6-4 4" /><path d="M2 22l6-6" /></svg>,
      link: token ? '/multiMarket' : null,
      onClick: !token ? openLogin : null
    },

    // 🔥 Account → if token missing, open modal
    {
      id: 5,
      name: 'Account',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M6 20c0-3 3-6 6-6s6 3 6 6" /></svg>,
      link: token ? '/accountPage' : null,
      onClick: !token ? openLogin : null
    }
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.link === currentPath);
    if (currentItem) setActiveItem(currentItem.id);
  }, [location.pathname]);

  const handleItemClick = (itemId, index, item, e) => {
    setActiveItem(itemId);

    if (item.onClick) {
      e.preventDefault();   // ❗ stop redirect
      item.onClick(e);
      return;
    }

    if (itemId === 1) {
      localStorage.setItem("isHomeClicked", "true");
      window.dispatchEvent(new Event("bet-updated"));
    }
  };

  return (
    <>
      <footer className="footer">
        <div className="cricketbettingalldesign">
          <section className="mobile-menu d-mobile">
            <ul>
              {menuItems.map((item, index) => (
                <li
                  key={item.id}
                  ref={el => itemRefs.current[index] = el}
                  className={`${item.className || ''} ${activeItem === item.id ? 'active' : ''}`}
                >
                  <Link
                    to={item.link || '#'}
                    onClick={(e) => handleItemClick(item.id, index, item, e)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </footer>

      {/* 🔥 LOGIN MODAL */}
      <Modal show={showLoginModal} onHide={closeLogin} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Login</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Login closeModal={closeLogin} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Footer;
