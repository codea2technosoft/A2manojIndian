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

  // ✅ UNLOCK AUDIO ON USER INTERACTION (Fix for Chrome)
  useEffect(() => {
    const unlockAudio = () => {
      console.log('🔓 User interacted, unlocking audio...');
      setUserInteracted(true);
      
      if (audioRef.current) {
        // Load and try to play to unlock
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
      
      // Remove listeners after first interaction
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };

    // Listen for ANY user interaction
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    // ✅ Also try to unlock on component mount
    setTimeout(() => {
      if (!userInteracted && audioRef.current) {
        audioRef.current.load();
      }
    }, 1000);

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, []);

  // ✅ Listen for new deposits
  useEffect(() => {
    const handleNewDeposit = (event) => {
      const deposit = event.detail;
      const eventId = deposit._eventId || deposit.transaction_id || deposit._id || Date.now();
      
      if (processedEvents.current.has(eventId)) {
        console.log('⚠️ Duplicate skipped:', eventId);
        return;
      }
      
      const now = Date.now();
      if (now - lastNotificationTime.current < 3000) {
        console.log('⚠️ Debounced');
        return;
      }
      
      processedEvents.current.add(eventId);
      lastNotificationTime.current = now;
      
      console.log('🔔 New deposit:', deposit);
      
      // ✅ ALWAYS play sound (will work after user interaction)
      playSound();
      
      // Browser Notification
      if (Notification.permission === 'granted') {
        try {
          const notification = new Notification('💰 New Deposit Request!', {
            body: `Amount: ₹${deposit.amount}\nUser: ${deposit.user_name || deposit.user_id}`,
            icon: '/favicon.ico',
            tag: `deposit_${eventId}`,
            requireInteraction: false,
            silent: true,
          });

          const timeoutId = setTimeout(() => {
            notification.close();
          }, 5000);

          notificationTimeouts.current[eventId] = timeoutId;

          notification.addEventListener('close', () => {
            if (notificationTimeouts.current[eventId]) {
              clearTimeout(notificationTimeouts.current[eventId]);
              delete notificationTimeouts.current[eventId];
            }
          });
        } catch (error) {
          console.error('Notification error:', error);
        }
      }

      setTimeout(() => {
        processedEvents.current.delete(eventId);
      }, 10000);
    };

    window.addEventListener('newDeposit', handleNewDeposit);

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('newDeposit', handleNewDeposit);
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

  // ✅ Play sound - ALWAYS tries to play
  const playSound = () => {
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }

    if (isPlaying.current) {
      console.log('⚠️ Sound already playing');
      return;
    }

    // ✅ If no user interaction, still try to play (Chrome may block)
    if (!userInteracted) {
      console.log('⏳ No user interaction yet, but trying to play...');
    }

    try {
      // Method 1: Use audio element
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
              // ✅ Try fallback immediately
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

  // ✅ Web Audio API beep (ALWAYS works, no user interaction needed!)
  const playWebAudioBeep = () => {
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }

    try {
      console.log('🔊 Playing Web Audio beep (always works!)...');
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume if suspended (Chrome)
      if (audioContext.state === 'suspended') {
        console.log('🔄 Resuming AudioContext...');
        audioContext.resume();
      }
      
      // Play two beeps
      const playBeep = (frequency, duration, delay) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };
      
      playBeep(880, 0.3, 0);
      playBeep(1100, 0.3, 200);
      
      isPlaying.current = true;
      setTimeout(() => {
        isPlaying.current = false;
      }, 1000);
      
    } catch (error) {
      console.error('Web Audio error:', error);
      isPlaying.current = false;
    }
  };

  // ✅ FORCE unlock on component mount (for immediate play)
  useEffect(() => {
    // Try to unlock audio after 2 seconds
    const timer = setTimeout(() => {
      if (!userInteracted && audioRef.current) {
        audioRef.current.load();
        audioRef.current.play()
          .then(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setUserInteracted(true);
            console.log('✅ Auto-unlocked audio');
          })
          .catch(() => {});
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <audio ref={audioRef} preload="auto" style={{ display: 'none' }}>
        <source src="/sounds/notification.mp3" type="audio/mpeg" />
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>

      {/* ✅ Audio unlock instruction */}
      {!userInteracted && (
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
      )}

      <button
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
      </button>

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