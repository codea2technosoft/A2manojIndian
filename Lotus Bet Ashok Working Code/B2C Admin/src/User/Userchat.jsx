import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import "./Chat.scss";
import { IoMdSend } from "react-icons/io";
import { BsFillSendFill } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { RiCheckDoubleFill } from "react-icons/ri";
import { AiFillAudio } from "react-icons/ai";
import { AiOutlineAudioMuted } from "react-icons/ai";
import Swal from "sweetalert2";
const UserChat = () => {
  const [message, setMessage] = useState("");
  const [UserTicketId, SetUserTicketId] = useState("");
  const [chat, setChat] = useState([]);
  const [chatdataList, setchatdataList] = useState([]);
  const [Binaryimage, Setimage] = useState("");
  const socketRef = useRef(null);
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const user_id = query.get("user_id");
  const theme = query.get("theme");
  const type = query.get("type");
  const [UserMsgLastDateTime, SetUserMsgLastDateTime] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupdesign, setPopupdesign] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!UserMsgLastDateTime) return;
    const interval = setInterval(() => {
      const now = moment();
      const originalTime = moment(UserMsgLastDateTime);
      const newTime = originalTime.clone().add(10, "minutes"); // +1 minute का नया समय
      if (now.isSameOrAfter(newTime)) {
        setShowPopup(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [UserMsgLastDateTime]);

  useEffect(() => {
    chatUser();
  }, [user_id]);
  const chatUser = async () => {
    try {
      const res = await fetch(
        `https://sara777adminapi.sindoor7.com/chat-list`,
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
      console.log("🧾 User Response:", result);
      setchatdataList(result.chatData);
      if (result.chatData.length === 0) {
        setMessage("first_time");
      } else {
        // alert(result.chat.user_last_msg_date_time);
        SetUserMsgLastDateTime(result.chat.user_last_msg_date_time);
        const firstTicketId = result.chatData[0]?.ticket_id;
        SetUserTicketId(firstTicketId);
      }
    } catch (error) {
      console.error("❌ Error fetching user:", error);
    }
  };
  // useEffect(() => {
  //   if (message === "first_time" && chatdataList.length === 0) {
  //     sendMessage();
  //   }
  // }, [message, chatdataList]);
  const [hasSent, setHasSent] = useState(false);

  useEffect(() => {
    if (!hasSent && message === "first_time" && chatdataList.length === 0) {
      sendMessage();
      setHasSent(true); // prevent future calls
    }
  }, [message, chatdataList, hasSent]);
  const sendMessage = (audioBlob) => {
    setsubmitbtnshow(false);
    console.warn("Triggered sendMessage", audioBlob);

    if (!socketRef.current) {
      const socket = io("https://sara777chatapi.sindoor7.com", {
        transports: ["websocket"],
        withCredentials: true,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("✅ Connected with socket ID:", socket.id);

        socket.emit("join", {
          userId: "user123",
          role: "user",
        });

        socket.on("receive_message", (data) => {
          // console.warn("📥 Message Received: ", data);
          // const filteredChats = data.formattedChatData.filter(
          //   (chat) => chat.user_id === user_id
          // );

          const filteredChats = data.formattedChatData
            .flatMap((item) => item.chatDataItems || []) // Flatten all chatDataItems arrays
            .filter((chat) => chat.user_id === user_id);
          // console.warn("dataaa", data.formattedChatData);
          setchatdataList(filteredChats);

          setchatdataList(filteredChats);
          // setchatdataList(data.chatData);
          setChat((prev) => [...prev, data]);
          const matchedItem = data.formattedChatData.find(
            (item) => item.user_id === user_id
          );

          if (matchedItem) {
            SetUserMsgLastDateTime(matchedItem.user_last_msg_date_time);
          }
          // SetUserMsgLastDateTime(data.chat.user_last_msg_date_time);
        });

        // Send message or image only after connection
        handleSend(socket, audioBlob);
      });

      socket.on("disconnect", () => {
        console.log("⚠️ Socket disconnected");
        socketRef.current = null;
      });
    } else {
      handleSend(socketRef.current, audioBlob);
    }
  };

  const handleSend = (socket, audioBlob) => {
    if (message?.trim()) {
      console.warn("📤 Sending Text Message:", message);

      socket.emit("send_message", {
        from: "user123",
        to: "admin123",
        message,
        user_id: user_id,
        type: type,
        action: "user",
        message_type: "text",
      });

      setChat((prev) => [...prev, { from: "You", message, action: "user" }]);
      setMessage("");
    } else if (Binaryimage) {
      compressImage(Binaryimage, 1, (compressedBlob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;

          socketRef.current.emit("send_message", {
            from: "user123",
            to: "admin123",
            user_id: user_id,
            message: "Image Uploaded",
            message_type: "image",
            image: arrayBuffer,
            filename: Binaryimage.name,
            type: type,
            action: "user",
          });

          setChat((prev) => [
            ...prev,
            { from: "You", message: "🖼 Image Sent", action: "user" },
          ]);
          Setimage(""); // Clear image state
          setPopupNewDesignImage(false);
          setPreviewUrl(null);
        };

        reader.readAsArrayBuffer(compressedBlob);
      });
    } else if (audioBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64AudioMessage = reader.result; // e.g., data:audio/webm;base64,...

        // Emit over socket
        socket.emit("send_message", {
          from: "user123",
          to: "admin123",
          message: base64AudioMessage,
          user_id: user_id,
          type: type,
          action: "user",
          message_type: "audio", // 🔥 different from text
        });

        // Add to chat UI
        setChat((prev) => [
          ...prev,
          {
            from: "You",
            message: base64AudioMessage,
            action: "user",
            message_type: "audio",
          },
        ]);
        setAudioblob(null);
      };
    } else {
      console.warn("⚠️ Empty message and no image selected");
    }
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
  };
  const compressImage = (file, maxSizeMB = 1, callback) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 1024; // Optional: Width limit
        const scaleSize = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Compress to JPEG with quality
        canvas.toBlob(
          (blob) => {
            callback(blob); // Return the compressed image
          },
          "image/jpeg",
          0.7 // Compression quality (0.0 - 1.0)
        );
      };
    };

    reader.readAsDataURL(file);
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const onEmojiClick = (emojiData) => {
    setsubmitbtnshow(true);
    setMessage((prevInput) => prevInput + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const [popupnewdesign, setpopupnewdesign] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [popupNewDesignImage, setPopupNewDesignImage] = useState(true);
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  const openCamera = () => {
    cameraRef.current.click(); // Triggers camera input
    setShowPopup(false);
  };

  const openGallery = () => {
    galleryRef.current.click(); // Triggers gallery input
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

  const handleOptionClick = (option) => {
    alert(`${option} clicked`);
    setpopupnewdesign(false);
  };

  const [submitbtnshow, setsubmitbtnshow] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [Audioblob, setAudioblob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
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
      // setTimeout(() => {
      sendMessage(audioBlob);
      // }, 2000);
      // ✅ अगर आप इसे store करना चाहते हैं server पर:
      // const formData = new FormData();
      // formData.append('audio', audioBlob, 'recording.webm');
      // axios.post('/upload', formData);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };
  const [isTyping, setIsTyping] = useState(false);
  const handleChange = (e) => {
    setMessage(e.target.value);
    var lentext = e.target.value.length;
    if (lentext > 0) {
      setsubmitbtnshow(true);
    } else if (lentext == 0) {
      setsubmitbtnshow(false);
    }
    // Auto-resize logic
    e.target.style.height = "auto"; // Reset height
    e.target.style.height = e.target.scrollHeight + "px"; // Set to scrollHeight
  };
  const textareaRef = useRef(null);

  useEffect(() => {
    // Swal.fire({
    //   title: "Success!",
    //   text: "Your data has been saved.",
    //   icon: "success",
    //   confirmButtonText: "OK",
    // });
    // setPopupdesign(true);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset height
      textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px"; // cap at 100px
    }
  }, [message]);
  const feedback = async (rate) => {
    try {
      const res = await fetch(
        `https://sara777adminapi.sindoor7.com/chat-ticket-close`,
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

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      setPopupdesign(true);
      // Optional: Handle the result if needed
      console.log("✅ Feedback submitted:", result);

      // chatUser(); // Make sure this is defined
      // navigator("/Chatclose"); // Ensure navigator is initialized using useNavigate
    } catch (error) {
      console.error("❌ Error submitting feedback:", error);
    }
  };
  // const chatRef = useRef(null);
  // useEffect(() => {
  //   const chatDiv = document.querySelector('.chatheightdesign');
  //   if (chatDiv) {
  //     chatDiv.scrollTop = chatDiv.scrollHeight;
  //   }
  //   }, [message]);

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatdataList]);
  const closepopupdesign = () => {
    window.location.href = "Chatclose";
    setPopupdesign(false);
  };
  return (
    <div className={`userchatdesign ${theme}`}>
      <div className="chat-container">
        {/* <div className="chat-header">
        <div className="profile-pic"></div>
        <div className="chat-info">
          <div className="chat-title">CHAT SUPPORT</div>
          <div className="chat-status">Online</div>
        </div>
        <div className="chat-actions">
          <button className="action-btn">⋮</button>
        </div>
      </div> */}
        <div className="">
          <div className="position-relative chatheightdesign" ref={chatRef}>
            {chatdataList.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.action === "user" ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      msg.action === "user"
                        ? theme === "lightmode"
                          ? "#282832"
                          : "#e0e0e0" // user bg
                        : theme === "darkmode"
                        ? "#fab029"
                        : "#fab029", // other bg

                    color:
                      msg.action === "user"
                        ? theme === "lightmode"
                          ? "#fff"
                          : "#000"
                        : theme === "darkmode"
                        ? "#000"
                        : "#000", // adjust if needed
                  }}
                  className="messagebgdesign"
                >
                  {/* <div
                  style={{
                    backgroundColor:
                      msg.action === "user"
                        ? theme === "lightmode"
                          ? "#282832"
                          : "#e0e0e0" // light mode user color
                        : theme === "darkmode"
                        ? "#fab029"
                        : "#ffd966", // light mode other color
                  }}
                  className="messagebgdesign"
                > */}
                  <div className="padding_5">
                    <span
                      className="usernamedesignall"
                      style={{
                        color:
                          msg.action === "user"
                            ? theme === "lightmode"
                              ? "#fff"
                              : "#000"
                            : theme === "darkmode"
                            ? "#000"
                            : "#000", // adjust if needed
                      }}
                    >
                      {msg.username}
                    </span>
                  </div>
                  {/* {msg.message_type === "text" && (
                  <div
                    className="user_chat_design_message"
                    style={{
                      Color: msg.action === "user" ? "#fff" : "#000",
                    }}
                  >
                    {msg.message}
                  </div>
                )} */}
                  {msg.message_type === "text" && (
                    <div className="padding_5">
                      <div
                        className="user_chat_design_message"
                        style={{
                          color:
                            msg.action === "user"
                              ? theme === "lightmode"
                                ? "#fff"
                                : "#000"
                              : theme === "darkmode"
                              ? "#000"
                              : "#000", // adjust if needed
                        }}
                      >
                        {msg.message}
                      </div>
                    </div>
                  )}
                  {msg.message_type === "audio" && (
                    <div className="padding_5">
                      <audio controls>
                        <source src={msg.url + msg.message} type="audio/mpeg" />
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
                        color:
                          msg.action === "user"
                            ? theme === "lightmode"
                              ? "#fff"
                              : "#000"
                            : theme === "darkmode"
                            ? "#000"
                            : "#000", // adjust if needed
                      }}
                    >
                      {(() => {
                        const dateTimeStr = msg.date_time; // "2025-06-25 10:12:05 AM"
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

                        // Convert hour to 12-hour format
                        let hourNum = parseInt(hour, 10);
                        const displayHour =
                          hourNum % 12 === 0 ? 12 : hourNum % 12;

                        return ` ${day} ${shortMonth} ${displayHour}:${minute} ${meridian}`;
                      })()}
                    </span>
                  </div>
                  {/* {msg.message} */}
                </div>
              </div>
            ))}
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
                  {/* {popupnewdesign && (
                <div className="attachmentpopupdesign">
                  <div className="attachment-popup">
                    <div onClick={openCamera}>📷 Camera</div>
                    <div onClick={openGallery}>🖼️ Gallery</div>
                  </div>
                </div>
              )} */}

                  <input
                    type="file"
                    accept="image/*"
                    name="camera"
                    capture="environment" // Opens rear camera
                    ref={cameraRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    name="gallery"
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

                    {/* <input
                  value={message}
                  onChange={handleChange}
                  // onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message"
                  className="inputmessage_design"
                /> */}
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
                        {/* <AiFillAudio className="mic-icon" /> */}
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
                <div className="imageall">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/emoji1.png`}
                    alt="emoji1"
                    onClick={() => feedback(1)}
                  />
                </div>
                <div className="imageall">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/emoji5.png`}
                    alt="emoji1"
                    onClick={() => feedback(2)}
                  />
                </div>
                <div className="imageall">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/emoji4.png`}
                    alt="emoji1"
                    onClick={() => feedback(3)}
                  />
                </div>
                <div className="imageall">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/emoji3.png`}
                    alt="emoji1"
                    onClick={() => feedback(4)}
                  />
                </div>
                <div className="imageall">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/emoji2.png`}
                    alt="emoji1"
                    onClick={() => feedback(5)}
                  />
                </div>
              </div>
              <div className="darkmodeimage">
                <div className="imageflex ">
                  <div className="imageall">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/dark_emoji1.png`}
                      alt="emoji1"
                      onClick={() => feedback(1)}
                    />
                  </div>
                  <div className="imageall">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/dark_emoji5.png`}
                      alt="emoji1"
                      onClick={() => feedback(2)}
                    />
                  </div>
                  <div className="imageall">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/dark_emoji4.png`}
                      alt="emoji1"
                      onClick={() => feedback(3)}
                    />
                  </div>
                  <div className="imageall">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/dark_emoji3.png`}
                      alt="emoji1"
                      onClick={() => feedback(4)}
                    />
                  </div>
                  <div className="imageall">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/dark_emoji2.png`}
                      alt="emoji1"
                      onClick={() => feedback(5)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {popupdesign && (
        <div className="confirmmessage">
          <div className="popupboxdesignall">
            <div className="sucessicon">
              <div className="checkimagenew">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/checkimage.png`}
                  alt="chjeckimage"
                />
              </div>
            </div>
            <div className="sucesstext">
              <h3>Thank you for submitting valuable feedback !</h3>
            </div>
            <div className="successbutton">
              <button className="buttonok" onClick={closepopupdesign}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserChat;
