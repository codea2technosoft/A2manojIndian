import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import moment from "moment";
import "../../User/Chatdashboard.scss";
import { IoMdSend } from "react-icons/io";
import { BsFillSendFill } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { RiCheckDoubleFill } from "react-icons/ri";
import { AiFillAudio } from "react-icons/ai";
import { AiOutlineAudioMuted } from "react-icons/ai";

const UserChat = () => {
  const [message, setMessage] = useState("");
  const [UserTicketId, SetUserTicketId] = useState("");
  const [chattype, Setchattype] = useState("");
  const [chat, setChat] = useState([]);
  const [chatdataList, setchatdataList] = useState([]);
  const [Binaryimage, Setimage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const user_id = query.get("user_id");
  const type = query.get("type");
  const [UserMsgLastDateTime, SetUserMsgLastDateTime] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [input, setInput] = useState("");

  // Initialize socket connection
  useEffect(() => {
    const initializeSocket = () => {
      if (!socketRef.current) {
        const socket = io("https://chatapi.maya456.com", {
          transports: ["websocket"],
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("✅ Connected with socket ID:", socket.id);
          setIsConnected(true);

          socket.emit("headernotifiactionSocket", {
            userId: user_id,
            role: "user",
          });
        });

        socket.on("receive_message", (data) => {
          console.log("📥 Message Received:", data);
          const filteredChats =
            data.formattedChatData
              ?.flatMap((item) => item.chatDataItems || [])
              ?.filter((chat) => chat.user_id === user_id) || [];
          setchatdataList(filteredChats);
          setChat((prev) => [...prev, data]);
        });

        socket.on("disconnect", () => {
          console.log("⚠️ Socket disconnected");
          setIsConnected(false);
          socketRef.current = null;
        });

        socket.on("connect_error", (err) => {
          console.error("Connection error:", err);
          setIsConnected(false);
        });
      }
    };

    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user_id]);

  // Timer for popup
  useEffect(() => {
    if (!UserMsgLastDateTime) return;

    const interval = setInterval(() => {
      const now = moment();
      const originalTime = moment(UserMsgLastDateTime);
      const newTime = originalTime.clone().add(10, "minutes");

      if (now.isSameOrAfter(newTime)) {
        setShowPopup(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [UserMsgLastDateTime]);

  // Mark message as seen
  const seenMessage = async (firstTicketId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/seen-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ticket_id: firstTicketId }),
      });
      await res.json();
    } catch (err) {
      console.error("Error in seenMessage:", err);
    }
  };

  // Fetch chat history
  useEffect(() => {
    chatUser();
  }, [user_id]);

  const chatUser = async () => {
    try {
      const res = await fetch(
        `https://adminapi.maya456.com/chat-list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user_id,
          }),
        }
      );
      const result = await res.json();
      setchatdataList(result.chatData);

      if (result.chatData.length > 0) {
        SetUserMsgLastDateTime(result.chat.user_last_msg_date_time);
        const firstTicketId = result.chatData[0]?.ticket_id;
        const type = result.chatData[0]?.type;
        SetUserTicketId(firstTicketId);
        Setchattype(type);
        seenMessage(firstTicketId);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Send message function
  const sendMessage = (audioBlob) => {
    setsubmitbtnshow(false);

    if (!socketRef.current || !isConnected) {
      console.error("Socket not connected");
      return;
    }

    if (message?.trim()) {
      socketRef.current.emit("send_message", {
        from: user_id,
        to: "admin",
        message,
        user_id: user_id,
        type: chattype,
        action: "admin",
        message_type: "text",
      });

      setMessage("");
    } else if (Binaryimage) {
      compressImage(Binaryimage, 1, (compressedBlob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;

          socketRef.current.emit("send_message", {
            from: user_id,
            to: "admin",
            user_id: user_id,
            message: "Image Uploaded",
            message_type: "image",
            image: arrayBuffer,
            filename: Binaryimage.name,
            type: chattype,
            action: "admin",
          });

          Setimage("");
          setPopupNewDesignImage(false);
          setPreviewUrl(null);
        };
        reader.readAsArrayBuffer(compressedBlob);
      });
    } else if (audioBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64AudioMessage = reader.result;

        socketRef.current.emit("send_message", {
          from: user_id,
          to: "admin",
          message: base64AudioMessage,
          user_id: user_id,
          type: chattype,
          action: "admin",
          message_type: "audio",
        });

        setAudioblob(null);
      };
    }

    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
  };

  // Image compression
  const compressImage = (file, maxSizeMB = 1, callback) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const MAX_WIDTH = 1024;
        const scaleSize = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => callback(blob), "image/jpeg", 0.7);
      };
    };
    reader.readAsDataURL(file);
  };

  // Emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const onEmojiClick = (emojiData) => {
    setsubmitbtnshow(true);
    setMessage((prevInput) => prevInput + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Image attachment handling
  const [popupnewdesign, setpopupnewdesign] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [popupNewDesignImage, setPopupNewDesignImage] = useState(true);
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  const openCamera = () => {
    cameraRef.current.click();
    setShowPopup(false);
  };

  const openGallery = () => {
    galleryRef.current.click();
    setShowPopup(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      Setimage(file);
      setPopupNewDesignImage(false);
      setPreviewUrl(URL.createObjectURL(file));
      setpopupnewdesign(false);
    }
  };

  const handleAttachmentClick = () => {
    setpopupnewdesign(!popupnewdesign);
  };

  // Audio recording
  const [submitbtnshow, setsubmitbtnshow] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [Audioblob, setAudioblob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setAudioblob(audioBlob);
        sendMessage(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current?.stop();
      setRecording(false);
    }
  };

  // Text input handling
  const handleChange = (e) => {
    setMessage(e.target.value);
    setsubmitbtnshow(e.target.value.length > 0);
  };

  // Feedback submission
  const feedback = async (rate) => {
    try {
      const res = await fetch(
        `https://adminapi.maya456.com/chat-ticket-close`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user_id,
            rating: rate,
            ticket_id: UserTicketId,
          }),
        }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      await res.json();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  // Auto-scroll chat
  const chatRef = useRef(null);
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatdataList]);

  // Navigation
  const navigate = useNavigate();
  const backbutton = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="mt-2">
      <div className="d-flex mb-3 justify-content-end bg-yellow">
        <Link onClick={backbutton} className="btn btn-success btn-sm px-3 py-1">
          Back
        </Link>
      </div>
      <div className="chat-container">
        <div className="chatnewdesign">
          <div className="backbutton"></div>
          <div className="position-relative chatheightdesign" ref={chatRef}>
            <div className="container">
              {chatdataList?.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.action === "admin" ? "flex-end" : "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor:
                        msg.action === "admin" ? "#282832" : "#fab029",
                    }}
                    className="messagebgdesign"
                  >
                    <div className="padding_5">
                      <span
                        className="usernamedesignall"
                        style={{
                          color: msg.action === "admin" ? "#fff" : "#000",
                        }}
                      >
                        {msg.action}
                      </span>
                    </div>
                    {msg.message_type === "text" && (
                      <div className="padding_5">
                        <div
                          className="user_chat_design_message"
                          style={{
                            color: msg.action === "admin" ? "#fff" : "#000",
                          }}
                        >
                          {msg.message}
                        </div>
                      </div>
                    )}
                    {msg.message_type === "audio" && (
                      <div className="padding_5">
                        <audio controls>
                          <source
                            src={msg.url + msg.message}
                            type="audio/mpeg"
                          />
                        </audio>
                      </div>
                    )}
                    {msg.message_type === "image" && (
                      <div className="designnewimage">
                        <img src={msg.url + msg.image} alt="Sent image" />
                      </div>
                    )}
                    <div className="padding_5">
                      <span
                        className="timerzone"
                        style={{
                          color: msg.action === "admin" ? "#fff" : "#000",
                        }}
                      >
                        {(() => {
                          const dateTimeStr = msg.date_time;
                          const [datePart, timePart, meridian] =
                            dateTimeStr.split(" ");
                          const [year, month, day] = datePart.split("-");
                          const [hour, minute] = timePart.split(":");

                          const shortMonths = [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                          ];
                          const monthIndex = parseInt(month, 10) - 1;
                          const shortMonth = shortMonths[monthIndex];

                          let hourNum = parseInt(hour, 10);
                          const displayHour =
                            hourNum % 12 === 0 ? 12 : hourNum % 12;

                          return ` ${day} ${shortMonth} ${displayHour}:${minute} ${meridian}`;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!popupNewDesignImage && previewUrl ? (
            <div className="imagesenddesign previewurl">
              <div className="imagepopupdesign">
                <img src={previewUrl} alt="Preview" />
              </div>
              <div className="sendbuttondesignnew">
                <button onClick={sendMessage}>
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/sendbutton.png`}
                    alt=""
                  />
                </button>
              </div>
              <div className="thumbnailsimage">
                <img src={previewUrl} alt="Preview" />
              </div>
            </div>
          ) : (
            <>
              {popupnewdesign && (
                <div className="attachmentpopupdesign">
                  <div className="attachment-popup">
                    <button
                      className="close-button"
                      onClick={() => setpopupnewdesign(false)}
                    >
                      ×
                    </button>
                    <div
                      onClick={openGallery}
                      className="text-center popupchoose"
                    >
                      <div className="imageicondesigmallgallery">
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/camera.png`}
                          alt=""
                        />
                      </div>
                      <p>Gallery</p>
                    </div>
                    <div
                      onClick={openCamera}
                      className="text-center popupchoose"
                    >
                      <div className="imageicondesigmallgallery">
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/galleryimage.png`}
                          alt=""
                        />
                      </div>
                      <p>Camera</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="fotoerchatdd">
                <div className="chat-footer">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={cameraRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={galleryRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  {showEmojiPicker && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "60px",
                        zIndex: 10,
                      }}
                    >
                      <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                  )}

                  <div className="width_inputdesign">
                    <button
                      className="footer-btn button_designemoji"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <MdOutlineEmojiEmotions />
                    </button>

                    <textarea
                      value={message}
                      onChange={handleChange}
                      placeholder="Type your message"
                      className="inputmessage_design"
                      rows={1}
                    />
                    <button
                      className="footer-btn button_design_attachment"
                      onClick={handleAttachmentClick}
                    >
                      <ImAttachment />
                    </button>
                  </div>
                  <div className="button_send_designm">
                    {submitbtnshow ? (
                      <button onClick={sendMessage} className="send-btn">
                        {input.trim() ? <BsFillSendFill /> : <IoMdSend />}
                      </button>
                    ) : !recording ? (
                      <button className="mic-button" onClick={startRecording}>
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/mic_permission.png`}
                          alt="mic_permission"
                        />
                      </button>
                    ) : (
                      <button
                        className="mic-button recording"
                        onClick={stopRecording}
                      >
                        <AiOutlineAudioMuted className="mic-icon" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {showPopup && (
          <div className="popupupalert">
            <div className="popup-box text-center">
              <p>How well was I able to solve your problem ?</p>
              <div className="imageflex">
                {[1, 2, 3, 4, 5].map((rate) => (
                  <div key={rate} className="imageall">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/emoji${
                        6 - rate
                      }.png`}
                      alt={`emoji${rate}`}
                      onClick={() => feedback(rate)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserChat;
