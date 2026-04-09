import React, { useState, useEffect } from 'react';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { Col, Row, Divider, DatePicker, Select, Space, } from 'antd';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import loadinggg from '../../assets/img/loading-gif.gif';
import moment from "moment";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function HistoryPending() {
  const [users, setUsers] = useState([]);
  const [betpandingdata, setbetpandingdata] = useState([]);
  const [pagelength, setpagelength] = useState([]);
  const [loading21, setLoading21] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [dateRanges, setDateRange] = useState([]);
  const [comxMarket, setComxMarket] = useState([]);
  const [paginate, setpaginate] = useState(1);
  const [loadbuttonshow, setloadbuttonshow] = useState();
 
 
  const navigate = useNavigate();

  const handleReload = () => {
    window.scrollTo(0, 0);
    window.location.reload();
  };
 

  const [selectedValue, setSelectedValue] = useState('');

  var firstNumbers = [];

  const pendingbethistory = async (tablecode) => {
    const user_id = localStorage.getItem("userid");
    
    const pagevalue =localStorage.getItem("checkpagevalue");
    if(pagevalue == 1)
    {
      var abc = paginate;
    }
    else
    {
      var abc = 1;
    }

    const requestData = new FormData();
    requestData.append('app_id', process.env.REACT_APP_API_ID);
    requestData.append('user_id', user_id);
    requestData.append('paginate', abc);
    
    const config = {
      method: 'POST',
      url: `https://demo.khelomatka.com/webapi1/betHistoryMongo.php`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: requestData,
    };
    

    try {
      const response = await axios(config);
      if (response.data.success == "1") {
        localStorage.setItem("checkpagevalue", "1");
        const userData = response.data.data;
        console.warn(userData);
        setpaginate(response.data.pagination);
        setpagelength(response.data.totalRecord);
        var count = paginate * 10;
        setloadbuttonshow(count);
        let merged = firstNumbers.concat(userData);
        if(pagevalue == 1)
          {
            let mer = users.concat(userData);
            setUsers(mer);
          }
          else
          {
            let mer = userData;
            setUsers(mer);
          }
      }
      else {
        let mer = [];
        setUsers(mer);
      }
      
    }

    catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
      pendingbethistory();
      localStorage.setItem("checkpagevalue", "1");
  }, []);

  const shoot = () => {
    pendingbethistory(selectedValue);
  };


  const [activeButton, setActiveButton] = useState('oldbet');

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <>
      <section className="margin-bottom-88 margin-bottom-100" id='history'>
        <div className="container-fluid paddingall-5">
          <div className='historybet marketdetails'>
            <div className='padding_5'>
              <Divider orientation="center">Old Bet</Divider>
              <Row gutter={1} className='d-flex align-item-center justify-content-between'>
                {/* <Col span={10}>
                  <DatePicker onChange={handleDateRangeChange} className='form-control' />
                </Col> */}
                <Col className="gutter-row" span={10}>
                  <Space>
                    
                  </Space>
                </Col>

                <Col span={2} className='d-flex align-items-center justify-content-center'>
                  <div className="reloadhistory" onClick={handleReload}>
                    <i class="bi bi-arrow-clockwise"></i>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="bg-white p-2 round_radius">
            <div className="d-flex justify-content-between">
              <div className="width_btn_new">
          <Link
            to="/History"
            value="1"
            className={`btn refresh changeBG ${activeButton === 'pending' ? 'active' : ''}`}
            onClick={() => handleButtonClick('pending')}
          >
            Pending Bet
          </Link>
        </div>
        <div className="width_btn_new">
          <Link
            to="/History-declared"
            value="2"
            className={`refresh btn changeBG ${activeButton === 'declared' ? 'active' : ''}`}
            onClick={() => handleButtonClick('declared')}
          >
            Declared Bet
          </Link>
        </div>

        <div className="width_btn_new">
                <Link
                  to="/pending-bet"
                  value="3"
                  className={`refresh btn changeBG ${activeButton === 'oldbet' ? 'active' : ''}`}
                  onClick={() => handleButtonClick('oldbet')}
                >
                  Old Bets
                </Link>
              </div>
              
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <div className="table  table-history">
              <Table striped bordered hover className=''>
                <thead>
                  <tr>
                    <th>S.NO</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Number </th>
                    <th>Points </th>
                  </tr>
                </thead>
                <tbody className=''>
                  {loading21 ? (
                    <div className="loadernew21">
                      <img src={loadinggg} className="px-2 loaderfile" alt="Loading..." />
                    </div>
                  ) : (
                    <>
                      {users && users.length > 0 ? (
                        users.map((user, index) => {
                          const dateTime = new Date(user.date_time);
                          // const formattedDate = `${dateTime.getDate()}-${dateTime.getMonth() + 1}-${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;
                          return (
                            <tr key={index} className={`${user.is_result_declared === 0 ? "classcolor" : "classcolor1"}`}>
                              <td>{index + 1}</td>
                              <td>{user.date_time}</td>
                              <td>{user.market_name}</td>
                              <td>{user.game_type}{user.game_type === 2 ? '(Andar)' : user.game_type === 3 ? '(Bahar)' : ''}</td>
                              <td>{user.pred_num}</td>
                              <td>{user.tr_value}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="8">No data available or something went wrong.</td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </Table>
            </div>
            
            { pagelength >loadbuttonshow ? (
              <div className='d-flex justify-content-center loadmore'><button className='btn btn-primary w-50  mx-auto text-center' onClick={shoot} id="loadmore">Load More</button>
              </div>
            ) : (
              null
            )}
          </div>
        </div>
      </section >
      <ToastContainer />
    </>
  )
}
