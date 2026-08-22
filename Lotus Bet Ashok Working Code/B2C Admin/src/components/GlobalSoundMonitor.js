// import React, { useEffect, useRef } from "react";
// const GlobalSoundMonitor = () => {
//   const prevIds = useRef([]);
//   const isFirstRun = useRef(true);
//   const audioCtxRef = useRef(null);
//   const isSoundEnabled = useRef(false);
//   const enableSound = () => {
//     if (isSoundEnabled.current) return;
//     try {
//       const AudioContext = window.AudioContext || window.webkitAudioContext;
//       const ctx = new AudioContext();
     
//       if (ctx.state === "suspended") {
//         ctx.resume();
//       }
//       const osc = ctx.createOscillator();
//       const gain = ctx.createGain();
//       osc.connect(gain);
//       gain.connect(ctx.destination);
//       osc.frequency.value = 440;
//       osc.type = "sine";
//       gain.gain.setValueAtTime(0.01, ctx.currentTime);
//       osc.start(ctx.currentTime);
//       osc.stop(ctx.currentTime + 0.01);
 
//       audioCtxRef.current = ctx;
//       isSoundEnabled.current = true;
//       console.log("✅ Sound enabled successfully!");
//       if (Notification.permission === "granted") {
//         new Notification("🔊 Sound Enabled!", {
//           body: "You will now hear alerts for new deposits.",
//           icon: "🔔"
//         });
//       }
//       const btn = document.getElementById("enable-sound-btn");
//       if (btn) btn.remove();
 
//     } catch (error) {
//       console.log("❌ Error enabling sound:", error.message);
//     }
//   };
//   const playSound = () => {
//     console.log("🔔 New Deposit Detected!");
//     try {
//       if (navigator.vibrate) {
//         navigator.vibrate([200, 100, 200, 100, 400]);
//       }
//     } catch (e) {}
//     if (isSoundEnabled.current && audioCtxRef.current) {
//       try {
//         const ctx = audioCtxRef.current;
//         const osc1 = ctx.createOscillator();
//         const gain1 = ctx.createGain();
//         osc1.connect(gain1);
//         gain1.connect(ctx.destination);
//         osc1.frequency.value = 880;
//         osc1.type = "sine";
//         gain1.gain.setValueAtTime(0.3, ctx.currentTime);
//         gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
//         osc1.start(ctx.currentTime);
//         osc1.stop(ctx.currentTime + 0.3);
//         setTimeout(() => {
//           try {
//             const osc2 = ctx.createOscillator();
//             const gain2 = ctx.createGain();
//             osc2.connect(gain2);
//             gain2.connect(ctx.destination);
//             osc2.frequency.value = 1100;
//             osc2.type = "sine";
//             gain2.gain.setValueAtTime(0.3, ctx.currentTime);
//             gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
//             osc2.start(ctx.currentTime);
//             osc2.stop(ctx.currentTime + 0.2);
//           } catch (e) {}
//         }, 200);
//         setTimeout(() => {
//           try {
//             const osc3 = ctx.createOscillator();
//             const gain3 = ctx.createGain();
//             osc3.connect(gain3);
//             gain3.connect(ctx.destination);
//             osc3.frequency.value = 1320;
//             osc3.type = "sine";
//             gain3.gain.setValueAtTime(0.3, ctx.currentTime);
//             gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
//             osc3.start(ctx.currentTime);
//             osc3.stop(ctx.currentTime + 0.25);
//           } catch (e) {}
//         }, 400);
 
//         console.log("✅ Sound played!");
//       } catch (error) {
//         console.log("❌ Sound play error:", error.message);
//       }
//     } else {
//       console.log("⚠️ Sound not enabled yet. Click 'Enable Sound' button.");
//     }
//     try {
//       // if (Notification.permission === "granted") {
//       //   new Notification("💰 New Deposit Request!", {
//       //     body: "Check pending deposits",
//       //     icon: "🔔",
//       //     vibrate: [200, 100, 200],
//       //   });
//       // }
//     } catch (e) {}
//   };
//   const showEnableSoundButton = () => {
//     if (document.getElementById("enable-sound-btn")) return;
 
//     const btn = document.createElement("button");
//     btn.id = "enable-sound-btn";
//     btn.innerHTML = "🔊 Click to Enable Sound Alert";
//     btn.style.cssText = `
//       position: fixed;
//       bottom: 20px;
//       left: 50%;
//       transform: translateX(-50%);
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       color: white;
//       border: none;
//       padding: 14px 28px;
//       border-radius: 50px;
//       font-size: 16px;
//       font-weight: bold;
//       z-index: 999999;
//       box-shadow: 0 8px 30px rgba(0,0,0,0.3);
//       cursor: pointer;
//       animation: pulse 1.5s ease-in-out infinite;
//       text-align: center;
//       max-width: 90%;
//     `;
//     const style = document.createElement("style");
//     style.textContent = `
//       @keyframes pulse {
//         0%, 100% { transform: translateX(-50%) scale(1); }
//         50% { transform: translateX(-50%) scale(1.05); }
//       }
//     `;
//     document.head.appendChild(style);
 
//     btn.onclick = () => {
//       enableSound();
//     };
 
//     document.body.appendChild(btn);
//   };
//   const checkDeposits = async () => {
//     try {
//       const token = localStorage.getItem("token");
 
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/all_deposit_request?page=1&limit=50&status=pending`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
 
//       const text = await response.text();
//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch (e) {
//         console.log("⚠️ Response is not JSON:", text.substring(0, 100));
//         return;
//       }
 
//       if (data?.success) {
//         const deposits = data.data || [];
//         const newIds = deposits.map((d) => d._id);
 
//         if (!isFirstRun.current) {
//           const currentIds = prevIds.current;
//           const addedIds = newIds.filter((id) => !currentIds.includes(id));
 
//           if (addedIds.length > 0) {
//             console.log("🔔 NEW DEPOSIT FOUND!", addedIds);
//             playSound();
//           }
//         } else {
//           isFirstRun.current = false;
//           console.log("🟢 Global Monitor Started:", newIds.length, "deposits");
//         }
 
//         prevIds.current = newIds;
//       }
//     } catch (error) {
//       console.error("❌ Global Monitor Error:", error);
//     }
//   };
//   useEffect(() => {
//     if ("Notification" in window && Notification.permission === "default") {
//       Notification.requestPermission();
//     }
//     checkDeposits();
//     const interval = setInterval(checkDeposits, 5000);
//     setTimeout(() => {
//       if (!isSoundEnabled.current) {
//         showEnableSoundButton();
//       }
//     }, 1000);
//     return () => {
//       clearInterval(interval);
//       const btn = document.getElementById("enable-sound-btn");
//       if (btn) btn.remove();
//     };
//   }, []);
 
//   return null;
// };
// export default GlobalSoundMonitor;


///lates code 18-08-2026////


// import React, { useEffect, useRef } from "react";
 
// const GlobalSoundMonitor = () => {
//   const prevIds = useRef([]);
//   const isFirstRun = useRef(true);
 
//   const audioCtxRef = useRef(null);
//   const isSoundEnabled = useRef(false);
 
//   // ==========================================
//   // ENABLE SOUND - on ANY first user interaction
//   // (click, keydown, touchstart anywhere on page)
//   // ==========================================
//   const enableSound = async () => {
//     try {
//       const AudioContext =
//         window.AudioContext || window.webkitAudioContext;
 
//       if (!AudioContext) {
//         console.log("❌ AudioContext not supported");
//         return;
//       }
 
//       let ctx = audioCtxRef.current;
 
//       if (!ctx) {
//         ctx = new AudioContext();
//         audioCtxRef.current = ctx;
//       }
 
//       if (ctx.state === "suspended") {
//         await ctx.resume();
//       }
 
//       // Test beep (confirms audio actually works)
//       const osc = ctx.createOscillator();
//       const gain = ctx.createGain();
 
//       osc.connect(gain);
//       gain.connect(ctx.destination);
 
//       osc.type = "sine";
//       osc.frequency.value = 800;
 
//       gain.gain.setValueAtTime(0.001, ctx.currentTime);
//       gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
//       gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
 
//       osc.start();
//       osc.stop(ctx.currentTime + 0.15);
 
//       isSoundEnabled.current = true;
//       localStorage.setItem("sound_enabled", "true");
 
//       console.log("✅ SOUND ENABLED (auto, via user interaction)");
//       console.log("Audio state:", ctx.state);
//     } catch (error) {
//       console.log("❌ Enable sound error:", error);
//     }
//   };
 
//   // ==========================================
//   // INITIALIZE AFTER REFRESH
//   // Still needs a "resume" nudge from an interaction,
//   // but we don't show any button — first click/keypress
//   // anywhere handles it silently.
//   // ==========================================
//   const initializeAudio = async () => {
//     try {
//       const savedSound = localStorage.getItem("sound_enabled");
 
//       if (savedSound !== "true") {
//         return;
//       }
 
//       const AudioContext =
//         window.AudioContext || window.webkitAudioContext;
 
//       if (!AudioContext) {
//         return;
//       }
 
//       const ctx = new AudioContext();
//       audioCtxRef.current = ctx;
 
//       console.log("🔊 Audio created after refresh");
//       console.log("🔊 Audio state:", ctx.state);
 
//       isSoundEnabled.current = true;
 
//       if (ctx.state === "suspended") {
//         try {
//           await ctx.resume();
//           console.log("🔊 Audio resumed:", ctx.state);
//         } catch (error) {
//           console.log("⚠️ Browser blocked resume (needs interaction):", error);
//         }
//       }
//     } catch (error) {
//       console.log("❌ initializeAudio error:", error);
//     }
//   };
 
//   // ==========================================
//   // PLAY SOUND
//   // ==========================================
//   const playSound = async () => {
//     console.log("🔔 New Deposit Detected!");
 
//     let ctx = audioCtxRef.current;
 
//     if (!ctx) {
//       console.log("⚠️ AudioContext missing, creating...");
//       const AudioContext =
//         window.AudioContext || window.webkitAudioContext;
//       if (!AudioContext) return;
//       ctx = new AudioContext();
//       audioCtxRef.current = ctx;
//     }
 
//     if (ctx.state === "suspended") {
//       try {
//         await ctx.resume();
//         console.log("🔊 Resumed audio:", ctx.state);
//       } catch (error) {
//         console.log("❌ Resume failed:", error);
//       }
//     }
 
//     console.log("🔊 FINAL AUDIO STATE:", ctx.state);
 
//     if (ctx.state !== "running") {
//       console.log("❌ AudioContext is not running (no interaction yet)");
//       return;
//     }
 
//     try {
//       const osc1 = ctx.createOscillator();
//       const gain1 = ctx.createGain();
 
//       osc1.connect(gain1);
//       gain1.connect(ctx.destination);
 
//       osc1.frequency.value = 880;
//       osc1.type = "sine";
 
//       gain1.gain.setValueAtTime(0.3, ctx.currentTime);
//       gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
 
//       osc1.start();
//       osc1.stop(ctx.currentTime + 0.3);
 
//       setTimeout(() => {
//         try {
//           const osc2 = ctx.createOscillator();
//           const gain2 = ctx.createGain();
 
//           osc2.connect(gain2);
//           gain2.connect(ctx.destination);
 
//           osc2.frequency.value = 1100;
//           osc2.type = "sine";
 
//           gain2.gain.setValueAtTime(0.3, ctx.currentTime);
//           gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
 
//           osc2.start();
//           osc2.stop(ctx.currentTime + 0.2);
//         } catch (e) {
//           console.log("Sound 2 error:", e);
//         }
//       }, 200);
 
//       setTimeout(() => {
//         try {
//           const osc3 = ctx.createOscillator();
//           const gain3 = ctx.createGain();
 
//           osc3.connect(gain3);
//           gain3.connect(ctx.destination);
 
//           osc3.frequency.value = 1320;
//           osc3.type = "sine";
 
//           gain3.gain.setValueAtTime(0.3, ctx.currentTime);
//           gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
 
//           osc3.start();
//           osc3.stop(ctx.currentTime + 0.25);
//         } catch (e) {
//           console.log("Sound 3 error:", e);
//         }
//       }, 400);
 
//       console.log("✅ SOUND PLAYED");
//     } catch (error) {
//       console.log("❌ Sound error:", error);
//     }
//   };
 
//   // ==========================================
//   // CHECK DEPOSITS
//   // ==========================================
//   const checkDeposits = async () => {
//     try {
//       const token = localStorage.getItem("token");
 
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/all_deposit_request?page=1&limit=50&status=pending`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
 
//       const text = await response.text();
//       let data;
 
//       try {
//         data = JSON.parse(text);
//       } catch (e) {
//         console.log("⚠️ Response is not JSON:", text.substring(0, 100));
//         return;
//       }
 
//       if (data?.success) {
//         const deposits = data.data || [];
//         const newIds = deposits.map((d) => d._id);
 
//         if (!isFirstRun.current) {
//           const currentIds = prevIds.current;
//           const addedIds = newIds.filter((id) => !currentIds.includes(id));
 
//           if (addedIds.length > 0) {
//             console.log("🔔 NEW DEPOSIT FOUND!", addedIds);
//             playSound();
//           }
//         } else {
//           isFirstRun.current = false;
//           console.log("🟢 Global Monitor Started:", newIds.length, "deposits");
//         }
 
//         prevIds.current = newIds;
//       }
//     } catch (error) {
//       console.error("❌ Global Monitor Error:", error);
//     }
//   };
 
//   // ==========================================
//   // USE EFFECT
//   // ==========================================
//   useEffect(() => {
//     if ("Notification" in window && Notification.permission === "default") {
//       Notification.requestPermission();
//     }
 
//     const soundEnabled = localStorage.getItem("sound_enabled");
 
//     if (soundEnabled === "true") {
//       console.log("🔊 Saved sound permission found");
//       initializeAudio();
//     }
 
//     // ==========================================
//     // AUTO-ENABLE: listen for the FIRST interaction
//     // anywhere on the page (no visible button needed).
//     // Browsers require a user gesture to unlock audio,
//     // so this is the closest thing to "automatic" —
//     // whatever the user does first (click a link, type,
//     // tap the screen) silently unlocks sound.
//     // ==========================================
//     const handleFirstInteraction = () => {
//       enableSound();
//       window.removeEventListener("click", handleFirstInteraction);
//       window.removeEventListener("keydown", handleFirstInteraction);
//       window.removeEventListener("touchstart", handleFirstInteraction);
//     };
 
//     if (localStorage.getItem("sound_enabled") !== "true") {
//       window.addEventListener("click", handleFirstInteraction, { once: true });
//       window.addEventListener("keydown", handleFirstInteraction, { once: true });
//       window.addEventListener("touchstart", handleFirstInteraction, { once: true });
//     }
 
//     checkDeposits();
 
//     const interval = setInterval(checkDeposits, 5000);
 
//     return () => {
//       clearInterval(interval);
//       window.removeEventListener("click", handleFirstInteraction);
//       window.removeEventListener("keydown", handleFirstInteraction);
//       window.removeEventListener("touchstart", handleFirstInteraction);
//     };
//   }, []);
 
//   return null;
// };
 
// export default GlobalSoundMonitor;



/////high volume
import React, { useEffect, useRef } from "react";

const GlobalSoundMonitor = () => {
  const prevIds = useRef([]);
  const isFirstRun = useRef(true);

  const audioCtxRef = useRef(null);
  const isSoundEnabled = useRef(false);

  // ==========================================
  // ENABLE SOUND - on ANY first user interaction
  // ==========================================
  const enableSound = async () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        console.log("❌ AudioContext not supported");
        return;
      }

      let ctx = audioCtxRef.current;

      if (!ctx) {
        ctx = new AudioContext();
        audioCtxRef.current = ctx;
      }

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // Test beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.value = 800;

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);

      isSoundEnabled.current = true;
      localStorage.setItem("sound_enabled", "true");

      console.log("✅ SOUND ENABLED");
    } catch (error) {
      console.log("❌ Enable sound error:", error);
    }
  };

  // ==========================================
  // INITIALIZE AFTER REFRESH
  // ==========================================
  const initializeAudio = async () => {
    try {
      const savedSound = localStorage.getItem("sound_enabled");

      if (savedSound !== "true") {
        return;
      }

      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        return;
      }

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      console.log("🔊 Audio created after refresh");
      console.log("🔊 Audio state:", ctx.state);

      isSoundEnabled.current = true;

      if (ctx.state === "suspended") {
        try {
          await ctx.resume();
          console.log("🔊 Audio resumed:", ctx.state);
        } catch (error) {
          console.log("⚠️ Browser blocked resume (needs interaction):", error);
        }
      }
    } catch (error) {
      console.log("❌ initializeAudio error:", error);
    }
  };

  // ==========================================
  // 🎵 PLAY SOUND — 6 SECONDS FULL VOLUME
  // ==========================================
  const playSound = async () => {
    console.log("🔔 New Deposit Detected! Playing 6 sec sound...");

    let ctx = audioCtxRef.current;

    if (!ctx) {
      console.log("⚠️ AudioContext missing, creating...");
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      ctx = new AudioContext();
      audioCtxRef.current = ctx;
    }

    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
        console.log("🔊 Resumed audio:", ctx.state);
      } catch (error) {
        console.log("❌ Resume failed:", error);
      }
    }

    if (ctx.state !== "running") {
      console.log("❌ AudioContext is not running (no interaction yet)");
      return;
    }

    try {
      // 🔥 6 SECOND CONTINUOUS BEEP — FULL VOLUME (1.0)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.value = 880; // A4 note

      // 🔥 FULL VOLUME: 1.0
      gain.gain.setValueAtTime(1.0, ctx.currentTime);
      
      // 🔥 SLOW FADE OUT at the end (so it doesn't click)
      gain.gain.setValueAtTime(1.0, ctx.currentTime + 5.8);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 6.0);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 6.0); // ✅ 6 SECONDS

      console.log("✅ 6 SECOND SOUND PLAYED (FULL VOLUME)");
    } catch (error) {
      console.log("❌ Sound error:", error);
    }
  };

  // ==========================================
  // CHECK DEPOSITS
  // ==========================================
  const checkDeposits = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/all_deposit_request?page=1&limit=50&status=pending`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("⚠️ Response is not JSON:", text.substring(0, 100));
        return;
      }

      if (data?.success) {
        const deposits = data.data || [];
        const newIds = deposits.map((d) => d._id);

        if (!isFirstRun.current) {
          const currentIds = prevIds.current;
          const addedIds = newIds.filter((id) => !currentIds.includes(id));

          if (addedIds.length > 0) {
            console.log("🔔 NEW DEPOSIT FOUND!", addedIds);
            playSound();
          }
        } else {
          isFirstRun.current = false;
          console.log("🟢 Global Monitor Started:", newIds.length, "deposits");
        }

        prevIds.current = newIds;
      }
    } catch (error) {
      console.error("❌ Global Monitor Error:", error);
    }
  };

  // ==========================================
  // USE EFFECT
  // ==========================================
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const soundEnabled = localStorage.getItem("sound_enabled");

    if (soundEnabled === "true") {
      console.log("🔊 Saved sound permission found");
      initializeAudio();
    }

    const handleFirstInteraction = () => {
      enableSound();
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    if (localStorage.getItem("sound_enabled") !== "true") {
      window.addEventListener("click", handleFirstInteraction, { once: true });
      window.addEventListener("keydown", handleFirstInteraction, { once: true });
      window.addEventListener("touchstart", handleFirstInteraction, { once: true });
    }

    checkDeposits();

    const interval = setInterval(checkDeposits, 5000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  return null;
};

export default GlobalSoundMonitor;