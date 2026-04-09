import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarData from "../Sidebar/SidebarData";
// import profile from '../../assets/img/profile.jpg';
import { Button } from "react-bootstrap";
import facebook from "../../assets/img/facebook.png";
import instragram from "../../assets/img/instragram.png";
export default function Sidebar({ open }) {
  const [userData, setUserData] = useState(null);
  const [Notification, setNotification] = useState("");
  const notificationcounts = localStorage.getItem("Gameposting");
  useEffect(() => {
    // const apiUrl = `${process.env.REACT_APP_API_URL}/get_user_profile.php`;
    // const formData = new FormData();
    // formData.append("app_id", "com.babaji.galigame");
    // formData.append("user_id", "TMJADBZVFK");

    const apiUrl = `https://chat.matkawaale.com/api/users/user-profile`;
    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      device_id: devid,
    };

    // fetch(apiUrl, {
    //   method: "POST",
    //   body: formData
    // })

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "1") {
          setUserData(data);
        } else {
          console.error("API Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    loaduser();
    // alert('ppp');
  }, []);
  const loaduser = async () => {
    // setLoading(true);
    const user_id = localStorage.getItem("userid");
    // alert('ppppp');
    try {
      setLoading(true);
      const requestData = {
        // app_id: process.env.REACT_APP_API_ID,
        user_id: user_id,
      };
      const config = {
        method: "POST",
        url: `${process.env.REACT_APP_API_URL_NODE}get-group-message`,
        headers: {
          "Content-Type": "application/json",
        },
        data: requestData,
      };
      // axios.post(url, formData, config)
      //   .then(function (response) {

      //     const res = JSON.stringify(response.data.data);

      //     const objectRes = JSON.parse(res);
      //     setUsers(objectRes);
      //     alert(objectRes)
      //     const noteFiCation = objectRes.totalcount - notificationcounts;
      //     setNotification(noteFiCation);

      //   })
      const response = await axios(config);
      const res = JSON.stringify(response.data.message.data);
      const objectRes = JSON.parse(res);
      // alert(objectRes.length);
      const noteFiCation = objectRes.totalcount - notificationcounts; // const noteFiCation = Math.max(response.data.message.totalcount - Gameposting, 0);
      setNotificationGameposting(noteFiCation);
      console.warn(noteFiCation);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    notification();
    setTimeout(() => {}, 2000);
  }, []);

  const handleReload = () => {
    notification();
    window.scrollTo(0, 0);
  };
  return (
    <>
      {/* <Link to="/Notification" onClick={handleReload}> <div  class="message" > <i class="bi bi-bell-fill text-white"></i>gfgffgggg{Notification}</div></Link> */}

      <div className={open ? "sidebar is-toggle" : "sidebar"}>
        {userData && (
          <div className="profileimage">
            <Button className="closebtn">&times;</Button>

            {/* <div className="d-flex align-items-center justify-content-between">
           <div className="profilephoto">
              <img src={profile}/>     
           </div>
           <div className="profiledetails">
            <>
              <h3>{userData.name}</h3>
              <h4><strong>ID : </strong>{userData.mob}</h4>
              <h3><strong>Points</strong>0.00</h3>
              </>
           </div>
         </div> */}
          </div>
        )}

        <ul className="menulist">
          {SidebarData.map((val) => (
            <li>
              <Link
                to={val.path}
                className="d-flex align-items-center link-page sidebar_link_design"
              >
                {val.icon}
                {val.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
