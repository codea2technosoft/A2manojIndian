import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
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
  const [loading21, setLoading21] = useState(false);
  const [dateRanges, setDateRange] = useState([]);
  const [comxMarket, setComxMarket] = useState([]);
  const [paginate, setpaginate] = useState(1);
  const [loadbuttonshow, setloadbuttonshow] = useState();
  const [ispaginate, setispaginate] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('1');
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

      loaduser(formattedDate, selectedValue);

    } else {
      console.error("Invalid 'dates' object");
    }
  };

  const [selectedValue, setSelectedValue] = useState('');


  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
    loaduser(dateRanges, event.target.value);
  };

  const shoot = (event) => {
    setispaginate(event.target.id);
    loaduser(dateRanges, selectedValue);
  };


  const loaduser = async (formattedDate, tablecode, loaduser) => {
    if (tablecode == undefined) {
      tablecode = 'all';
    }
    if (formattedDate === undefined) {
      var today = moment().format("DD-MM-YYYY")
      formattedDate = today;
    } else {
      formattedDate = moment(formattedDate, "MM/DD/YYYY").format("DD-MM-YYYY");
    }
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    setLoading21(true);
    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      dev_id: dev_id,
      flt_date: formattedDate,
      tbl_code: tablecode,
      paginate: paginate,
      ispaginate: 'loaduser',
    };

    const config = {
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL_NODE}bet-history`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestData,
    };

    try {

      const response = await axios(config);
      if (response.data.success === "1") {
        const userData = response.data.data;
        setUsers(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

    setLoading21(false);
  }

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

    loaduser();
    ComxMarket();

  }, []);
  // useEffect(() => {
  //   if (selectedMarket == '1') {
  //     pendingbethistory();
  //     ComxMarket();
  //   } else if (selectedMarket == '2') {
  //     loaduser();
  //     ComxMarket();
  //   }
  // }, [selectedMarket]);


  return (
    <>
      <section className="margin-bottom-88 margin-bottom-100" id='history'>
        <div className="container-fluid paddingall-5">
          <div className='historybet marketdetails'>
            <div className='padding_5'>
              <Divider orientation="center">History</Divider>
              <Row gutter={1} className='d-flex align-item-center justify-content-between'>
                <Col span={10}>
                  <DatePicker onChange={handleDateRangeChange} className='form-control' />
                </Col>
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
                  <Link to="/History" value="1" className='btn refresh changeBG'>Pending Bet</Link>
                </div>
                <div className='width_btn_new'>
                  <Link to="/History-declared" value="2" className="refresh btn bg-change-new">Declared Bet</Link>
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
                    {/* <th>Points </th> */}
                    <th>Earned</th>
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
                          const formattedDate = `${dateTime.getDate()}-${dateTime.getMonth() + 1}-${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;

                          // Define a conditional class based on the value of user.win_value
                          const rowClass = user.win_value > 0 ? "green-row" : "";

                          return (
                            <tr key={index} className={`${rowClass}`}>
                              <td>{index + 1}</td>
                              <td>{formattedDate}</td>
                              <td>{user.table_id}</td>
                              <td>{user.tr_value_type}</td>
                              <td>{user.tr_value}</td>
                              <td>{user.win_value}</td>
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
            {users && users.length >= loadbuttonshow ? (
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
