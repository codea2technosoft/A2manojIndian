import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import Playgame from "./Playgame";
import { Link } from "react-router-dom";
import playgamedata from "./Playgamedata";
import axios from "axios";

import { useNavigate } from "react-router-dom";

export default function Play() {
  const [users, setUsers] = useState([]);
  const [usersdata, setUsersdata] = useState([]);
  const [loading1, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReload = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    loaduser();
  }, []);

  const loaduser = async () => {
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    const token = localStorage.getItem("token");
    setLoading(true);

    let url = `${process.env.REACT_APP_API_URL_NODE}get-market-list`;

    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      dev_id: dev_id,
    };

    const config = {
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: requestData,
    };

    try {
      const response = await axios(config);
      const objectRes = response.data;

      if (objectRes.message && objectRes.message.data) {
        setUsers(objectRes.message.data);
      } else {
        console.error("Invalid API response format:", objectRes);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (id, name) => {
    window.location.href = `/Playgame?id=${id}&name=${name}`;
  };
  return (
    <>
      <section id="play" className="margin-bottom-88">
        <div className="playsection ">
          <Container>
            <div className="row" style={{ marginTop: "60px" }}>
              {users &&
                users.map((user) => (
                  <div className="col-md-12">
                    <div className="gamebg ">
                      <div className="d-flex justify-content-between gameplaybattle">
                        <p className="animate-charcter">{user.name} </p>

                        <div className="d-flex align-items-center linkgamesforplay">
                          {user.is_play == 1 ? (
                            <Button
                              onClick={() => {
                                handleClick(user.id, user.name);
                              }}
                              className="playgames"
                            >
                              Play Games
                            </Button>
                          ) : (
                            <Button className="timeout">Time Out</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Container>
        </div>
        {loading1 && (
          // <>
          // <div className="loader_roomcode">
          //   <img src={loader} alt="loader" />
          // </div>
          // </>
          <div className="spinner-wrapper">
            <div className="loadernew2"></div>
          </div>
        )}
      </section>
    </>
  );
}
