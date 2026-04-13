import React, { useState,useEffect} from 'react';
import Swal from 'sweetalert2';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
    useEffect(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn === 'true') {
        navigate('/dashboard');
      }else{
           navigate('/login');
      }
    }, [navigate]);
  }