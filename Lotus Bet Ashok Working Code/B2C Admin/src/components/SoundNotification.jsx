// src/components/SoundNotification.jsx
import React, { useRef, useEffect, useState } from 'react';

const SoundNotification = () => {
  const audioRef = useRef(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const processedEvents = useRef(new Set());
  const isPlaying = useRef(false);
  const lastNotificationTime = useRef(0);
  const notificationTimeouts = useRef({});
  const playTimeoutRef = useRef(null);

  // ✅ Unlock audio on user interaction
  useEffect(() => {
    const unlockAudio = () => {
      console.log('🔓 User interacted, unlocking audio...');
      setUserInteracted(true);
      
      if (audioRef.current) {
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
              console.log('✅ Audio unlocked successfully!');
            })
            .catch(() => {
              console.log('⏳ Audio will unlock on next play');
            });
        }
      }
      
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, []);

  // ✅ Show notification helper
  const showNotification = (type, amount, userName, status = 'pending') => {
    if (Notification.permission === 'granted') {
      try {
        const notification = new Notification(`💰 New ${type} Request!`, {
          body: `Amount: ₹${amount}\nUser: ${userName || 'Unknown'}\nStatus: ${status}`,
          icon: '/favicon.ico',
          requireInteraction: false,
          silent: true,
        });

        setTimeout(() => {
          notification.close();
        }, 5000);
      } catch (error) {
        console.error('Notification error:', error);
      }
    }
  };

  // ✅ Handle events
  useEffect(() => {
    // Handle new deposit
    const handleNewDeposit = (event) => {
      const deposit = event.detail;
      const eventId = deposit._eventId || deposit.transaction_id || deposit._id || Date.now();
      
      if (processedEvents.current.has(eventId)) return;
      
      const now = Date.now();
      if (now - lastNotificationTime.current < 3000) return;
      
      processedEvents.current.add(eventId);
      lastNotificationTime.current = now;
      
      console.log('🔔 New deposit:', deposit);
      playSound();
      showNotification('Deposit', deposit.amount, deposit.user_name);
      
      setTimeout(() => {
        processedEvents.current.delete(eventId);
      }, 10000);
    };

    // ✅ Handle new withdrawal
    const handleNewWithdrawal = (event) => {
      const withdrawal = event.detail;
      const eventId = withdrawal._eventId || withdrawal.transaction_id || withdrawal._id || Date.now();
      
      if (processedEvents.current.has(eventId)) return;
      
      const now = Date.now();
      if (now - lastNotificationTime.current < 3000) return;
      
      processedEvents.current.add(eventId);
      lastNotificationTime.current = now;
      
      console.log('🔔 New withdrawal:', withdrawal);
      playSound();
      showNotification('Withdrawal', withdrawal.amount, withdrawal.user_name, withdrawal.status);
      
      setTimeout(() => {
        processedEvents.current.delete(eventId);
      }, 10000);
    };

    // ✅ Handle withdrawal status update
    const handleWithdrawalStatusUpdate = (event) => {
      const withdrawal = event.detail;
      const eventId = withdrawal._eventId || withdrawal.transaction_id || withdrawal._id || Date.now();
      
      if (processedEvents.current.has(eventId)) return;
      
      const now = Date.now();
      if (now - lastNotificationTime.current < 3000) return;
      
      processedEvents.current.add(eventId);
      lastNotificationTime.current = now;
      
      console.log('📊 Withdrawal status update:', withdrawal);
      
      // Play sound for status updates
      if (withdrawal.status === 'success' || withdrawal.status === 'approved') {
        playSound();
        showNotification('Withdrawal Approved ✅', withdrawal.amount, withdrawal.user_name, withdrawal.status);
      } else if (withdrawal.status === 'rejected' || withdrawal.status === 'failed') {
        console.log('❌ Withdrawal rejected');
        // Optional: play different sound for rejection
      }
      
      setTimeout(() => {
        processedEvents.current.delete(eventId);
      }, 10000);
    };

    window.addEventListener('newDeposit', handleNewDeposit);
    window.addEventListener('newWithdrawal', handleNewWithdrawal);
    window.addEventListener('withdrawalStatusUpdate', handleWithdrawalStatusUpdate);

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('newDeposit', handleNewDeposit);
      window.removeEventListener('newWithdrawal', handleNewWithdrawal);
      window.removeEventListener('withdrawalStatusUpdate', handleWithdrawalStatusUpdate);
      processedEvents.current.clear();
      Object.values(notificationTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
      notificationTimeouts.current = {};
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, []);

  // ✅ Play sound function
  const playSound = () => {
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }

    if (isPlaying.current) {
      console.log('⚠️ Sound already playing');
      return;
    }

    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 1.0;
        
        const promise = audioRef.current.play();
        
        if (promise !== undefined) {
          promise
            .then(() => {
              console.log('✅ Sound played! 🔔');
              isPlaying.current = true;
              playTimeoutRef.current = setTimeout(() => {
                isPlaying.current = false;
                playTimeoutRef.current = null;
              }, 1500);
            })
            .catch((err) => {
              console.log('❌ Audio element failed:', err.message);
              isPlaying.current = false;
              playWithNewAudio();
            });
        }
      } else {
        playWithNewAudio();
      }
    } catch (error) {
      console.error('Sound error:', error);
      isPlaying.current = false;
      playWithNewAudio();
    }
  };

  // ✅ Fallback: Create new Audio
  const playWithNewAudio = () => {
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }

    if (isPlaying.current) {
      isPlaying.current = false;
    }

    try {
      console.log('🔄 Playing with new Audio...');
      isPlaying.current = true;

      const audio = new Audio();
      audio.volume = 1.0;
      
      const soundPaths = [
        '/sounds/notification.mp3',
        '/notification.mp3'
      ];
      
      let pathIndex = 0;
      
      const tryPath = () => {
        if (pathIndex >= soundPaths.length) {
          console.log('❌ All paths failed, using Web Audio');
          isPlaying.current = false;
          playWebAudioBeep();
          return;
        }
        
        audio.src = soundPaths[pathIndex];
        audio.load();
        
        audio.play()
          .then(() => {
            console.log('✅ Sound played via new Audio! 🔔');
            playTimeoutRef.current = setTimeout(() => {
              isPlaying.current = false;
              playTimeoutRef.current = null;
            }, 1500);
          })
          .catch((err) => {
            console.log(`❌ Path failed:`, soundPaths[pathIndex]);
            pathIndex++;
            tryPath();
          });
      };
      
      tryPath();

    } catch (error) {
      console.error('New Audio error:', error);
      isPlaying.current = false;
      playWebAudioBeep();
    }
  };

  // ✅ Web Audio API beep (always works)
  const playWebAudioBeep = () => {
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }

    try {
      console.log('🔊 Playing Web Audio beep...');
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
    } catch (error) {
      console.error('Web Audio error:', error);
    }
  };

  return (
    <>
      <audio ref={audioRef} preload="auto" style={{ display: 'none' }}>
        <source src="/sounds/notification.mp3" type="audio/mpeg" />
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>

      {/* {!userInteracted && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            padding: '8px 16px',
            background: '#f59e0b',
            color: 'white',
            borderRadius: '8px',
            fontSize: '12px',
            zIndex: 9999,
            animation: 'pulse 2s infinite'
          }}
        >
          👆 Click anywhere to enable sound
        </div>
      )} */}

      {/* <button
        onClick={() => {
          console.log('🔔 Testing sound...');
          setUserInteracted(true);
          playSound();
        }}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          padding: '12px 24px',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
        }}
      >
        🔊 Test Sound
      </button> */}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
};

export default SoundNotification;