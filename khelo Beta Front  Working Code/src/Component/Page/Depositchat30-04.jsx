// import React, { useState, useEffect } from "react";
import React, { useState, useEffect, useRef } from 'react';
// import { Player } from 'video-react';
// import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import loading from '../../assets/img/loading-gif.gif';
import logo from "../../assets/img/logo.png";
import pdf from "../../assets/img/pdficon.png";
import mic from "../../assets/img/mic.png";
import { Link } from 'react-router-dom'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { render } from 'react-dom'
import VideoRecorder from 'react-video-recorder'
import $ from 'jquery';
import { Spinner } from "react-bootstrap";

// import { ReactMic } from "react-mic";
// import PDFViewer from 'pdf-viewer-reactjs';
// import ReactPlayer from 'react-player';

import { VoiceRecorder } from "react-voice-recorder-player";
export default function Gameposting() {
  const [isRecording, setIsRecording] = useState(false);
  const [users, setUsers] = useState([]);
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isInputFocuseddd, setIsInputFocuseddd] = useState(false);
  const [recordedData, setRecordedData] = useState(null);
  const [recordurl, setRecordeurl] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isButtonDisabled1, setIsButtonDisabled1] = useState(false);
  const [loadingbutton, setLoadingbutton] = useState(false);
  const [loadingbuttonaudio, setLoadingbuttonaudio] = useState(false);
  const isButtonLoading = useRef(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const intervalRef = useRef(null);
  const user_id = localStorage.getItem("userid");

  const handleClick = () => {
    const element = document.querySelector('#cloesbtn');
    element.classList.add('display_none');
  };

  const recorderControls = useAudioRecorder()
  const addAudioElement = (blob) => {
    setIsRecording(false);
    const url = (blob);
    console.warn(url)
    // setRecordeurl(url)
    // alert(url)
    const audio = document.createElement("audio");
    console.warn(audio)
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
    sendMessageRecording(url);
    // setMessage(audio);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  useEffect(() => {
    $('.sendmessage').hide();
    loaduser();
    // window.scrollToBottom(0, 0);
    const interval = setInterval(() => {
      loaduser();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const loaduser = async () => {
  
    try {
      setLoading(true);

      // Define the API endpoint URL
      let url = `${process.env.REACT_APP_API_URL_NODE}/chat-list`;

      // const formData = new FormData();
      // formData.append("user_id", user_id);
      // formData.append("department", 'deposit');

      const requestData = {
        user_id: user_id,
        department: 'deposit'
      };

      var config = {
        method: "POST",
        url: url,
        data: requestData,
      };

      // Make the HTTP POST request using Axios
      const response = await axios.post(url, requestData, config);
      console.warn(response.data.message.data)
      // Process the response and update the state
      const res = JSON.stringify(response.data.message.data);
      const objectRes = JSON.parse(res);
      setUsers(objectRes);
    } catch (error) {
      // Handle any errors that occur during the execution of the try block
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      // Set loading to false after the request completes (success or failure)
      setLoading(false);
    }
  };

  const onRecordStart = () => {
    setIsRecording(true);
  };

  const onRecordStop = (recordedBlob) => {
    setIsRecording(false);
    setRecordedData(recordedBlob.blob);
    console.log(recordedBlob);
  };
  const OnnumberChange = (e) => {
    $('.sendmessageMic').hide();
    $('.sendmessage').show();
    const mobilnumbers = e.target.value;
    setMessage(mobilnumbers);
    setIsInputFocused(mobilnumbers);

  };

  const onFileChange = (e) => {
    // Handle file selection (image, audio, video)

    $('.sendmessageMic').hide();
    $('.sendmessage').show();
    const file = e.target.files[0];
    setSelectedFile(file);
    setIsInputFocused(file);

  };

  const sendMessageRecording = (recordurl1) => {
    setIsButtonDisabled1(true);
    // alert('ppppp');
    if (isRecording) {
      console.log('Recorded Data:', recordedData);
    } else {
      // Handle sending a regular text message
      // ...
    }

    const user_id = localStorage.getItem("userid");
    // alert(recordurl);
    if (!recordurl1) {
      toast.error("Please enter a message or select a file before sending.");
      return;
    }

    try {
      setLoadingbuttonaudio(true);
      const formData = new FormData();
      formData.append("message", message);
      formData.append("user_id", user_id);
      formData.append("type", "user");
      formData.append("department", 'deposit');
      formData.append("sendertype", 'user');

      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      if (recordurl1) {
        console.warn(recordurl1)
        formData.append("file", recordurl1);
      }

      // const requestBody = {
      //   message: message,
      //   user_id: user_id,
      //   type: "user",
      //   department: 'deposit'
      // };
      
      // if (selectedFile) {
      //   requestBody.file = selectedFile;
      // }
      
      // if (recordurl1) {
      //   requestBody.file = recordurl1;
      // }
      

      // Define the API endpoint URL
      let url = `https://api.superfastking.co/chat-store-audio`;

      // Configure the request
      const config = {
        method: "POST",
        url: url,
        data: formData,
      };

      axios.post(url, formData, config).then(function (response) {
        // const res = JSON.stringify(response.data);
        console.warn(response);
        if (response.data.success == 1) {
          setMessage("");
          setSelectedFile("");
          setRecordeurl("")

          toast.success(response.data.message, {
            onClose: () => {
              setTimeout(() => {
                loaduser();
              }, 1000);
            },
          });
          // window.location.reload();
        } else {
          toast.error(response.data.message);
        }
      });
    } catch (error) {
      console.error("User Name Update:", error);
    }
    finally {
      setLoadingbuttonaudio(false);
    }
  };

  const handleClicksend = () => {
    if (!isButtonClicked) {
      setIsButtonClicked(true);
      sendMessage();

      // Clear previous interval
      clearInterval(intervalRef.current);

      // Set a new interval to reset isButtonClicked after 3 seconds
      intervalRef.current = setInterval(() => {
        clearInterval(intervalRef.current);
        setIsButtonClicked(false);
      }, 3000);
    }
  };


  const sendMessage = () => {
    setIsButtonDisabled(true);
    if (isRecording) {
      console.log('Recorded Data:', recordedData);
    } else {
      // Handle sending a regular text message
      // ...
    }

    const user_id = localStorage.getItem("userid");
    // alert(recordurl);
    if (message.trim() === "" && !selectedFile && !recordurl) {
      toast.error("Please enter a message or select a file before sending.");
      return;
    }
    if (!isButtonLoading.current) {
      isButtonLoading.current = true;

      setIsButtonDisabled(true);
      // setTimeout(() => {
      setIsButtonDisabled(false);
      isButtonLoading.current = false;
      // }, 1000);
    }
    try {
      setLoadingbutton(true);
      const formData = new FormData();
      formData.append("message", message);
      formData.append("user_id", user_id);
      formData.append("type", "user");
      formData.append("department", 'deposit');
      formData.append("sendertype", 'user');
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      if (recordurl) {
        console.warn(recordurl)
        formData.append("file", recordurl);
      }

      let url = `https://api.superfastking.co/chat-store`;

      // Configure the request
      const config = {
        method: "POST",
        url: url,
        data: formData,
      };

      axios.post(url, formData, config).then(function (response) {
        const res = JSON.stringify(response.data);
        if (response.data.success == 1) {
          console.warn(response.data.message);

          setMessage("");
          setSelectedFile("");
          setRecordeurl("");
          // setIsInputFocused(true);
          $('.sendmessageMic').show();
          $('.sendmessage').hide();
          toast.success(response.data.message, {
            onClose: () => {
              setTimeout(() => {
                loaduser();
              }, 1000);
            },
          });
          // window.location.reload();
        } else {
          toast.error(response.data.message);
        }
      });
    } catch (error) {
      console.error("User Name Update:", error);
    }
    finally {
      setLoadingbutton(false);
    }
  };


  // useEffect(() => {
  //   const interval = setInterval(() => {
  //   loaduser();
  // }, 5000);

  // }, []);




  return (
    <>
      {/* <VideoRecorder
    onRecordingComplete={(videoBlob) => {
      // Do something with the video...
      console.log('videoBlob', videoBlob)
    }}
  /> */}
      {isRecording ? (<><div className='bg-mic' id='cloesbtn'>
        <button className='btn btn-close-custum' onClick={handleClick}>X</button>

        <div
          className='voicechange'>
          {/* <img src={mic} className='mic' /> <VoiceRecorder onClick={handleStopRecording} /></div></div></>) : (<></>)} */}
          {/* <img src={mic} className='mic' />   */}
          {/* <AudioRecorder
            onRecordingComplete={(blob) => addAudioElement(blob)}
            recorderControls={recorderControls}
          /> */}
          {/* <button className='btn' onClick={recorderControls.stopRecording}><span className='block-red'></span></button> */}

        </div></div></>
      ) : (
        <></>
      )}
      <section className="chat mt-5" id="chat">
        <div className=" fixed-top">
          <div className="headerchat">
            <div className="d-flex justify-content-between align-items-center">
              <div className="headericonarrow">
                <Link className="arrowlink" to="/Home">
                  <i class="bi bi-arrow-left-short"></i>
                </Link>
              </div>
              <div className="chatname">
                <h2>Deposit Chat</h2>
              </div>
              <div className="logoheader">
                <img src={logo} className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4   px-2 lineadd">पैसे ऐड करने में अगर आपको समस्या है तो अपनी समस्या को टाइप करके भेजिए या वॉइस रिकॉर्ड करके भेजिए।</p>

        <div className="container">
          <div className="chatdesignuser1">
            <div className="chat-message-group writer-user">
              <div className="chat-messages">
                {users && users.map((value) => {
                  return (
                    <div key={value.id} className={`message ${value.type === 'user' ? '' : 'messageleft'}`}>
                      {value.chatType === 'text' ? (
                        <h5 className='text-dark' style={{ wordBreak: "break-word" }}>{value.message}</h5>
                      ) : value.chatType === 'document' ? (
                        <>
                          <a href={value.url} rel="noopener noreferrer" className='text-dark'>{value.imagename}
                            <img src={pdf} alt="User" style={{ width: "50px" }} />
                          </a>
                        </>
                      ) : value.chatType === 'video' ? (
                        <video controls width="100%" height="150px">
                          <source src={value.url} />
                        </video>
                      ) : value.chatType === 'audio' ? (
                        <audio controls className='audioclass'>
                          <source src={value.url} />
                        </audio>
                      ) : (
                        <img src={value.url} style={{ width: "80px" }} alt="User" />
                        
                      )}
                     <p className="datechat">
                      {new Date(value.datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p> 
                    </div>
                  );
                })}

              </div>
            </div>
          </div>

          <div className="d-flex chatdesign">

            <div className="inputchat">
              <input
                type="text"
                className="form-control"
                placeholder="Type Message"
                onChange={OnnumberChange}
                value={message + (selectedFile ? ` - ${selectedFile.name}` : recordurl ? recordurl : "")}
              />
            </div>


            <div className="buttonsend bg-info">
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <i
                  className="bi bi-paperclip"
                  style={{ transform: "rotate(60deg)", fontSize: "30px" }}
                ></i>
                <label htmlFor="multipleFileInput"></label>
                <input
                  type="file"
                  onChange={onFileChange}
                  id="multipleFileInput"
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <div className="buttonsend">
              <div className="buttonsend">
                <div className="sendmessage">
                  <i onClick={handleClicksend} disabled={isButtonClicked} className="bi bi-send message_send">{isButtonClicked && <Spinner />}</i>
                </div>
                <div className="sendmessageMic" style={{ marginTop: "-40%" }}>
                  <AudioRecorder
                    onRecordingComplete={(blob) => addAudioElement(blob)}
                    recorderControls={recorderControls}
                  />
                  <i onClick={recorderControls.stopRecording} disabled={loadingbuttonaudio || isButtonDisabled1} className="bi bi-send">{loadingbuttonaudio && <Spinner />}</i>
                </div>
                {/* {/ <i onClick={sendMessage} className="bi bi-send"></i> /} */}

              </div>
            </div>
          </div>
        </div>

      </section>
      <ToastContainer />
    </>
  );
}
