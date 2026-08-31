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

export default function History() {
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
  const handleDateRangeChange = (dates) => {
    setpaginate('1');
    if (dates && dates.$L && dates.$d) {
      const formattedDate = new Intl.DateTimeFormat(dates.$L, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }).format(dates.$d);
      setDateRange(formattedDate);
      pendingbethistory(formattedDate);
    
    } else {
      console.error("Invalid 'dates' object");
    }
  };

  const [selectedValue, setSelectedValue] = useState('');

  var firstNumbers = [];

  const pendingbethistory = async (tablecode) => {
    const user_id = localStorage.getItem("userid");
    if (tablecode === undefined || !tablecode) {
      tablecode = 'all';
    }
    // if (formattedDate === undefined) {
    //   var today = moment().format("DD-MM-YYYY")
    //   formattedDate = today;
    // } else {
    //   formattedDate = moment(formattedDate, "MM/DD/YYYY").format("DD-MM-YYYY");
    // }
    const pagevalue =localStorage.getItem("checkpahe");
    if(pagevalue == 1)
    {
      var abc = paginate;
    }
    else
    {
      var abc = 1;
    }
    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      // date: formattedDate,
      tbl_code: tablecode,
      page: abc,
      //  page: page,
      // ispaginate: 'pendingbethistory',
    };
   
    const config = {
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL_NODE}pending-bet-history`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestData,
    };
    try {
      const response = await axios(config);
      if (response.data.data.success === "1") {
        localStorage.setItem("checkpahe", "1");
        const userData = response.data.data.data;
        setpaginate(response.data.data.pagination);
        setpagelength(response.data.totalRecords);
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


  const deleteCombination = async (id) => {
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      bet_id: id,
    };

    const config = {
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL_NODE}bat-delete`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestData,
    };

    try {
      const response = await axios(config);
      setLoading2(false);
      if (response.data.success) {
        const userConfirmed = window.confirm('Are you sure you want to remove this Bet?');
        if (userConfirmed) {
          localStorage.setItem("checkpahe", "2");
          pendingbethistory();
          if(response.data.success == 0){
            alert(response.data.message);
          }else{
            alert(response.data.message);
          }
        } else {
          alert('Market bet removal canceled.');
        }
      }
    } catch (error) {
      setLoading2(false);
      console.error('Error deleting market:', error);
      toast.error('Failed to delete Market!');
    }
  };


  const [activeButton, setActiveButton] = useState('pending');

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const ComxMarket = async () => {
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    const url = `${process.env.REACT_APP_API_URL_NODE}get-market-list`;

    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      dev_id: dev_id
    };

    const config = {
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: requestData
    };

    try {
      const response = await axios(config);
      const objectRes = response.data.message.data;
      if (objectRes && Array.isArray(objectRes)) {
        setComxMarket(objectRes);
      } else {
        console.error('Invalid data structure:', objectRes);
      }
    } catch (error) {
      console.error('Error during HTTP request:', error.message);
      if (error.response) {
        console.error('Server responded with non-2xx status:', error.response.status, error.response.data);
      }
    }
  }

  useEffect(() => {
      pendingbethistory();
      ComxMarket();
      // const pagelocal = localStorage.setItem("1");
      localStorage.setItem("checkpahe", "1");
  }, []);


  const handleSelectChange = (event) => {
    const selectedMarket = event.target.value;
    setSelectedValue(selectedMarket);
    localStorage.setItem("checkpahe", "2");
    pendingbethistory(selectedMarket);
  };

  const shoot = () => {
    pendingbethistory(selectedValue);
  };


  return (
    <>
      <section className="margin-bottom-88 margin-bottom-100" id='history'>
        <div className="container-fluid paddingall-5">
          <div className='historybet marketdetails'>
            <div className='padding_5'>
              <Divider orientation="center">History</Divider>
              <Row gutter={1} className='d-flex align-item-center justify-content-between'>
                {/* <Col span={10}>
                  <DatePicker onChange={handleDateRangeChange} className='form-control' />
                </Col> */}
                <Col className="gutter-row" span={10}>
                  <Space>
                    <select value={selectedValue} onChange={handleSelectChange} className='select_market form-control'>
                      <option value="all" className='font-size-5'>Select On Market</option>
                      {comxMarket.map((item, index) => (
                        <option key={index.id} value={item.id}>
                          {item.id}
                        </option>
                      ))}
                    </select>
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
          <p style={{fontSize:"10px", textAlign:"center", marginTop:"10px", width:"84%", border:"1px solid", color:"red", padding:"5px", marginLeft:"20px"}}>जिन गेम का रिजल्ट नही आया वो PENDING BET में दिखेंगी।</p>
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
          <p style={{fontSize:"10px", textAlign:"center", marginTop:"10px", width:"84%", border:"1px solid", color:"red", marginLeft:"20px", padding:"5px"}}>जिन गेम का रिजल्ट आ गया है वो DECLARED BET में दिखेंगी।</p>
        </div>

        {/* <div className="width_btn_new">
                <Link
                  to="/pending-bet"
                  value="3"
                  className={`refresh btn changeBG ${activeButton === 'oldbet' ? 'active' : ''}`}
                  onClick={() => handleButtonClick('oldbet')}
                >
                  Old Bets
                </Link>
        </div> */}
              
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
                    <th>Action</th>
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
                              <td>{user.datetime}</td>
                              <td>{user.marketname}</td>
                              <td>{user.bettype}{user.game_type === 2 ? '(Andar)' : user.game_type === 3 ? '(Bahar)' : ''}</td>
                              <td>{user.pred_num}</td>
                              <td>{user.tr_value}</td>
                              {user.is_deleted === 1 ? (
                                <td className='text-danger trash d-flex justify-content-center align-items-center ' onClick={() => deleteCombination(user.id)}>
                                <i className="bi bi-trash3"></i>
                                </td>
                              ) : (
                                <td></td>
                              )}
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
