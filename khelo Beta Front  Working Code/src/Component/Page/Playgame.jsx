import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap'
import Jodi from './Jodi'
import Manual from './Manual'
import Harruf from './Harruf'
import Crossing from './Crossing'
import Copypaste from './Copypaste'
import { Tabs } from 'antd';
import axios from "axios";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Col, Row, Form, Input } from 'antd';
import { toast } from 'react-toastify';

const url = new URL(window.location.href);
const gameid = url.searchParams.get('id');
const urll = new URL(window.location.href);
const name = urll.searchParams.get('name');
// alert(name)

export default function Playgame() {
  const [users, setUsers] = useState({
    betpoint_change_time: 3600,
    remaining_time_in_seconds: 3600,
  });

  useEffect(() => {
    // alert('pppp');
    const timer = setInterval(() => {
      if (users.betpoint_change_time > 0) {
        setUsers(prevState => ({
          ...prevState,
          betpoint_change_time: prevState.betpoint_change_time - 1,
        }));
      }
    }, 1000);


    return () => {
      clearInterval(timer);
    };
  }, [users.betpoint_change_time]);
  useEffect(() => {
    const timer = setInterval(() => {
      if (users.remaining_time_in_seconds > 0) {
        setUsers(prevState => ({
          ...prevState,
          remaining_time_in_seconds: prevState.remaining_time_in_seconds - 1,
        }));
      }
    }, 1000);


    return () => {
      clearInterval(timer);
    };
  }, [users.remaining_time_in_seconds]);

  useEffect(() => {
    loaduser();

  }, [])

  const loaduser = async () => {
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    let url = `${process.env.REACT_APP_API_URL_NODE}get-numtable-list`;
    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      dev_id: dev_id,
      market_id: gameid,
    };

    var config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const res = data ? JSON.stringify(data) : null;
      const objectRes = res ? JSON.parse(res) : null;
      setUsers(objectRes);
      console.warn(objectRes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: '1',
      label: 'Jodi',
      children: <Jodi />,
    },
    {
      key: '2',
      label: 'Manual',
      children: <Manual />,
    },
    {
      key: '3',
      label: 'Harraf',
      children: <Harruf />,
    },
    {
      key: '4',
      label: 'Crossing',
      children: <Crossing />,
    },
    {
      key: '5',
      label: 'Copy Paste',
      children: <Copypaste />,
    },
  ];

  const formatTime = (users) => {
    const hrs = Math.floor(users.betpoint_change_time / 3600);
    const mins = Math.floor((users.betpoint_change_time % 3600) / 60);
    const secs = users.betpoint_change_time % 60;
    const formattedHrs = hrs.toString().padStart(2, '0');
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');

    return `${formattedHrs} : ${formattedMins} : ${formattedSecs}`;
  }
  const formatTime1 = (users) => {
    const hrs = Math.floor(users.remaining_time_in_seconds / 3600);
    const mins = Math.floor((users.remaining_time_in_seconds % 3600) / 60);
    const secs = users.remaining_time_in_seconds % 60;
    const formattedHrs = hrs.toString().padStart(2, '0');
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');

    return `${formattedHrs} : ${formattedMins} : ${formattedSecs}`;
  };
  const formatTime2 = (users) => {
    const hrs = Math.floor(users.remaining_time_in_seconds / 3600);
    const mins = Math.floor((users.remaining_time_in_seconds % 3600) / 60);
    const secs = users.remaining_time_in_seconds % 60;
    const formattedHrs = hrs.toString().padStart(2, '0');
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');

    return `${formattedHrs} : ${formattedMins} : ${formattedSecs}`;
  };




  return (
    <>
      <section>
        <div class="headerchat">
          <div class="d-flex  align-items-center">
            <div class="headericonarrow">
              <a class="arrowlink" href="/Play">
                <i class="bi bi-arrow-left-short"></i>
              </a>
            </div>
            <div class="headerplaygames">
              <div className="homecontainer d-flex justify-content-between align-items-center">

                <h6 className='d-flex justify-content-between px-4'><span className='ml-10px'> {name} </span>
                </h6>
                <div className="countdown">
                  {/* <p>Time Left</p> */}
                  <p>गेम का लास्ट टाइम</p>
                  <div className="timer">
                    {formatTime1(users)} | {users.remaining_time_in_seconds > 0 ? <span>Active</span> : <span>Inactive</span>}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <section id="playgame" className="margin-bottom-88 mt-0 mb-5 fixed">
        <Container fluid className="p-0">


          <div className="homecontainer">
            <>
              {users.betpoint_change_time > 0 ?
                // <h6>Maximum bet Will Change after timer : {formatTime(users)}
                <h6>मोटी जोड़ी का लास्ट टाइम : {formatTime(users)}
                </h6>
                :
                //  <h6 style={{opacity:"0"}}></h6>
                <h6>मोटी जोड़ी का लास्ट टाइम : {users.gap_time}
                </h6>
              }
            </>
            {users.remaining_time_in_seconds > 0 ?
              <div className="tabsjodi">
                <Tabs
                  style={{ padding: 0, Margin: "0 0 0 26px" }}
                  defaultActiveKey="1"
                  items={items}
                  onChange={onChange}
                  indicatorSize={(origin) => origin - 16}
                />
              </div>
              :
              <div className="tabsjodi">

              </div>
            }
          </div>
        </Container>

      </section>

    </>
  )
}
