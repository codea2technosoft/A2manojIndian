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

const Chatclose = () => {
  const [message, setMessage] = useState("");
  const [UserTicketId, SetUserTicketId] = useState("");
  const [chat, setChat] = useState([]);
  const [chatdataList, setchatdataList] = useState([]);
  const [Binaryimage, Setimage] = useState("");
  const socketRef = useRef(null);
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const user_id = query.get("user_id");
  const type = query.get("type");
  const [UserMsgLastDateTime, SetUserMsgLastDateTime] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [input, setInput] = useState("");

  
  return (
   <div>hello</div>
  );
};
export default Chatclose;
