import React, { useState, useEffect, useRef } from 'react';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import logo from "../../assets/img/logo.png";
import pdf from "../../assets/img/pdficon.png";
import { Link } from 'react-router-dom'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import $ from 'jquery';
import { Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

export default function Chatusapp() {
  const [isRecording, setIsRecording] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [recordedData, setRecordedData] = useState(null);
  const [recordurl, setRecordeurl] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isButtonDisabled1, setIsButtonDisabled1] = useState(false);
  const [loadingbutton, setLoadingbutton] = useState(false);
  const [loadingbuttonaudio, setLoadingbuttonaudio] = useState(false);
  const isButtonLoading = useRef(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const intervalRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const url = new URL(window.location.href);
  var userId = url.searchParams.get('userid');



  const handleClick = () => {
    const element = document.querySelector('#cloesbtn');
    element.classList.add('display_none');
  };

  const recorderControls = useAudioRecorder()

  const addAudioElement = (blob) => {
    setIsRecording(false);
    const url = (blob);
    console.warn(url)
    const audio = document.createElement("audio");
    console.warn(audio)
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
    sendMessageRecording(url);

  };

  useEffect(() => {
    $('.sendmessage').hide();
    loaduser();
    const interval = setInterval(() => {
      loaduser();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loaduser = async () => {
    try {
      setLoading(true);
      let url = `${process.env.REACT_APP_API_URL_NODE}/chat-list`;
      const requestData = {
        user_id: userId,
        department: 'deposit'
      };

      var config = {
        method: "POST",
        url: url,
        data: requestData,
      };
      const response = await axios.post(url, requestData, config);
      console.warn(response.data.message.data)
      const res = JSON.stringify(response.data.message.data);
      const objectRes = JSON.parse(res);
      setUsers(objectRes);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false);
    }
  };

  const OnnumberChange = (e) => {
    $('.sendmessageMic').hide();
    $('.sendmessage').show();
    const mobilnumbers = e.target.value;
    setMessage(mobilnumbers);
    setIsInputFocused(mobilnumbers);

  };

  const onFileChange = (e) => {
    $('.sendmessageMic').hide();
    $('.sendmessage').show();
    const file = e.target.files[0];
    setSelectedFile(file);
    setIsInputFocused(file);

  };

  const sendMessageRecording = (recordurl1) => {
    setIsButtonDisabled1(true);

    if (isRecording) {
      console.log('Recorded Data:', recordedData);
    } else {
      // Handle sending a regular text message
      // ...
    }

    // const user_id = localStorage.getItem("userid");
    if (!recordurl1) {
      toast.error("Please enter a message or select a file before sending.");
      return;
    }

    try {
      setLoadingbuttonaudio(true);
      const formData = new FormData();
      formData.append("message", message);
      formData.append("user_id", userId);
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


      let url = `https://chat.matkawaale.com/chat-store-audio`;
      const config = {
        method: "POST",
        url: url,
        data: formData,
      };

      axios.post(url, formData, config).then(function (response) {

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
      clearInterval(intervalRef.current);
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

    // const user_id = localStorage.getItem("userid");
    if (message.trim() === "" && !selectedFile && !recordurl) {
      toast.error("Please enter a message or select a file before sending.");
      return;
    }
    if (!isButtonLoading.current) {
      isButtonLoading.current = true;

      setIsButtonDisabled(true);
      setIsButtonDisabled(false);
      isButtonLoading.current = false;
    }
    try {
      setLoadingbutton(true);
      const formData = new FormData();
      formData.append("message", message);
      formData.append("user_id", userId);
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

      let url = `https://chat.matkawaale.com/chat-store`;
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
          $('.sendmessageMic').show();
          $('.sendmessage').hide();
          toast.success(response.data.message, {
            onClose: () => {
              setTimeout(() => {
                loaduser();
              }, 1000);
            },
          });
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


  return (
    <>

      {isRecording ? (<><div className='bg-mic' id='cloesbtn'>
        <button className='btn btn-close-custum' onClick={handleClick}>X</button>
      </div></>
      ) : (
        <></>
      )}
      <section className="chat mt-5" id="chat">
        <div className=" fixed-top">
          <div className="headerchat">
            <div className="d-flex justify-content-between align-items-center">
              <div className="headericonarrow">
                {/* <Link className="arrowlink" to="/Home">
                  <i class="bi bi-arrow-left-short"></i>
                </Link> */}
              </div>
              <div className="chatname">
                <h2>Chat Us</h2>
              </div>
              <div className="logoheader">
                <img src={logo} className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4   px-2 lineadd">अगर आपको समस्या है तो अपनी समस्या को टाइप करके भेजिए या वॉइस रिकॉर्ड करके भेजिए।</p>

        <div className="container-fluid">
          <div className="chatdesignuser1">
            <div className="chat-message-group writer-user">
              <div className="chat-messages">
                {users && users.map((value) => {
                  return (
                    <div className={`message_container ${value.type === 'user' ? '' : 'messageadmin'}`}>
                      <div>
                        <div key={value.id} className={`message ${value.type === 'user' ? '' : 'messageleft'}`}>
                          {value.chatType === 'text' ? (
                            <p className='text-white' style={{ wordBreak: "break-word" }}>{value.message}</p>
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
                            <img src={value.url} style={{ width: "290px" }} alt="User" />

                          )}
                        </div>
                        <p className="datechat">
                          {new Date(value.datetime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>

          <div className="d-flex chatdesign">
            <div className="inputchat">
              <textarea
                style={{ height: '30px' }}
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
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}
