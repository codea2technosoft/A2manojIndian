import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const extractQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    userid: params.get('userid'),
    dev_id: params.get('dev_id'),
    tokenl: params.get('tokenl'),
    token: params.get('token'),
  };
};

const Loginapp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { userid, dev_id, tokenl, token } = extractQueryParams();
    
    if (userid && dev_id && tokenl && token) {
      localStorage.setItem('userid', userid);
      localStorage.setItem('dev_id', dev_id);
      localStorage.setItem('tokenl', tokenl);
      localStorage.setItem('token', token);
      navigate('/Home');
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome to the App</h1>
    </div>
  );
};

export default Loginapp;
