// src/components/SoundNotification.jsx
import React, { useRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SoundNotification = () => {
  const audioRef = useRef(null);
  const [audioLoaded, setAudioLoaded] = useState(false);

  useEffect(() => {
    // Listen for custom 'newDeposit' event
    const handleNewDeposit = (event) => {
      const deposit = event.detail;
      console.log('🔔 Sound triggered for deposit:', deposit);
      
      // Play sound
      playSound();
      
      toast.success(
        <div>
          <strong>💰 New Deposit Request!</strong>
          <div>User: {deposit.user_name || deposit.user_id}</div>
          <div>Amount: ₹{deposit.amount}</div>
          <div>Status: {deposit.status}</div>
        </div>,
        {
          position: 'top-right',
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification('💰 New Deposit Request!', {
          body: `Amount: ₹${deposit.amount}\nUser: ${deposit.user_name || deposit.user_id}`,
          icon: '/favicon.ico',
        });
      }
    };

    window.addEventListener('newDeposit', handleNewDeposit);

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    return () => {
      window.removeEventListener('newDeposit', handleNewDeposit);
    };
  }, []);

  const playSound = () => {
    try {
      if (audioRef.current) {
        // Reset audio to start
        audioRef.current.currentTime = 0;
        
        // Play with promise handling
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('🔊 Sound played successfully');
            })
            .catch((error) => {
              console.log('🔇 Audio play failed:', error);
              // Try alternative method
              playSoundAlternative();
            });
        }
      } else {
        console.log('❌ Audio element not found');
        playSoundAlternative();
      }
    } catch (error) {
      console.error('Sound error:', error);
      playSoundAlternative();
    }
  };

  // Alternative method using new Audio()
  const playSoundAlternative = () => {
    try {
      console.log('🔄 Trying alternative sound method...');
      
      // Try with online URL
      const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
      audio.volume = 1.0;
      audio.play()
        .then(() => console.log('🔊 Alternative sound played'))
        .catch(err => console.log('❌ Alternative sound failed:', err));
    } catch (error) {
      console.error('Alternative sound error:', error);
    }
  };

  // Handle audio load
  const handleAudioLoaded = () => {
    console.log('✅ Audio loaded successfully');
    setAudioLoaded(true);
  };

  const handleAudioError = (e) => {
    console.log('❌ Audio load error:', e);
    // Try online source as fallback
    if (audioRef.current) {
      audioRef.current.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3';
      audioRef.current.load();
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        preload="auto"
        onLoadedData={handleAudioLoaded}
        onError={handleAudioError}
      >
        {/* Local file */}
        <source src="/sounds/notification.mp3" type="audio/mpeg" />
        {/* Fallback online */}
        <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" type="audio/mpeg" />
      </audio>
      
      {/* Test button - for debugging */}
      <button 
        onClick={playSound} 
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          padding: '10px 20px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          zIndex: 9999
        }}
      >
        🔔 Test Sound
      </button>
    </>
  );
};

export default SoundNotification;