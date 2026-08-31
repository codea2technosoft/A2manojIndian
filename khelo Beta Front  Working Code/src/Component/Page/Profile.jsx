import React, { useState, useEffect } from 'react'
import { Container, Button } from 'react-bootstrap'
import userprofile from '../../assets/img/logo.png'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from "axios";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Col, Row, Form, Input } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export default function Profile() {
  const [useName, useNameUpdate] = useState('');
  const [email, setemail] = useState('');
  const [dateOfBt, dateOfBtUpdate] = useState('');
  const [names, setNeme] = useState('');
  const [dobss, setdob] = useState('');
  const [getemail, setgetemail] = useState('');
  const user_id = localStorage.getItem("userid");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const devid = localStorage.getItem("dev_id");

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setNeme(newValue);
  };

  const handleInputChangedob = (e) => {
    const newValue1 = e.target.value;
    setdob(newValue1);
  };

  const OnInputChangeemail = (e) => {
    const newName = e.target.value;
    setgetemail(newName);
  };


  const [userData, setUserData] = useState(null);
  const [userdob, setUserdob] = useState(null);
  const onFinish = (values) => {

  };
  const onFinishFailed = (errorInfo) => {
    // console.log('Failed:', errorInfo);
  };

  const loaduser1 = async () => {
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    let url = `${process.env.REACT_APP_API_URL_NODE}user-profile`;

    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      dev_id: dev_id,
    };

    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      // console.log(data);

      const namee = data.name;
      const dobs = data.dob;
      const emails = data.email;

      setdob(dobs);
      setgetemail(emails);
      setNeme(namee);

      const objectRes = data;
      setUserData(objectRes.name);
      setUsers(objectRes);
      setUserdob(objectRes.dob);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };



  const isValidEmail = (email) => {
    // Regular expression for validating email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const [loading, setLoading] = useState(false);

  const updateUsername = async () => {
    try {
      const requestBody = {
        FullName: names,
        dob: dobss,
        email: getemail,
        // app_id: process.env.REACT_APP_API_ID,
        user_id: user_id,
      };

      const userDOB = new Date(dateOfBt);
      const today = new Date();
      const age = today.getFullYear() - userDOB.getFullYear();

      if (age < 18) {
        const minimumBirthYear = today.getFullYear() - 18;
        toast.error(`You must be 18 or older. Please use a birth year before ${minimumBirthYear}.`);
        return;
      }

      if (!isValidEmail(getemail)) {
        toast.error('Please provide a valid email address.');
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_API_URL_NODE}user-profile-update`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.message === 'Updated success') {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Username updated successfully.',
          timer: 2000,
        }).then(() => {
          navigate('/Home');
        });
      } else {
        toast.error('Failed to update. Please try again later.');
      }
    } catch (error) {
      console.error('User Name Update:', error);
      console.error('Response from server:', error.response);
      toast.error('An error occurred while updating username. Please try again later.');
    }
  };

  useEffect(() => {
    const user_id = localStorage.getItem("userid");
    if (user_id == null) {
      navigate('/');
    };
    if (devid == null) {
      navigate('/');
    }
    // loaduser();
    loaduser1();
  }, [])

  return (
    <>
      <section id="profile" /*className='margin-bottom-88'*/>
        <Container fluid className="p-0">
          <div className="profilepage">

            <div className="profile">
              <img src={userprofile} className='img-fluid' />
            </div>

          </div>
          <div className="profiledetails">
            <div className="cardstyle">
              <div className="d-flex justify-content-between mb-2 balancebonus">
                <div className="mt-2">
                  <Button type="button" className="btnbal W-50">Balance : {users.credit}</Button>
                </div>
                <div className="  mt-2">
                  <Button type="button" className="btnbal W-50">Bonus : {users && users.total_bonus}</Button>
                </div>
              </div>
              <Form
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                style={{
                  maxWidth: 600,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Row>
                  <Col span={24} xl={24} md={24}>
                    <Form.Item

                      name="username" prefix={<UserOutlined className="site-form-item-icon" />}
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Number!',
                        },
                      ]}
                    >
                      <div>
                        <Input className="username px-2"
                          name="name"
                          placeholder="Name"
                          value={useName || names}
                          defaultValue={userData}
                          onChange={handleInputChange}
                        />


                      </div>
                    </Form.Item>
                  </Col>
                  <Col span={24} xl={24} md={24}>
                    <Form.Item

                      name="username" prefix={<UserOutlined className="site-form-item-icon" />}
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Date of Birth!',
                        },
                      ]}
                    >
                      <div>
                        <Input className="username px-2"
                          name="dob"
                          placeholder="DOB"
                          // type="date"
                          id="birthday"
                          value={dateOfBt || dobss}
                          // defaultValue={userdob}
                          onChange={handleInputChangedob} />
                      </div>
                    </Form.Item>
                  </Col>
                  <Col span={24} xl={24} md={24}>
                    <Form.Item

                      name="username" prefix={<UserOutlined className="site-form-item-icon" />}
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Email!',
                        },
                      ]}
                    >
                      <div>
                        <Input className="username px-2"
                          name="email"
                          type='email'
                          placeholder="Email"
                          value={email || getemail}
                          // defaultValue={getemail}
                          onChange={OnInputChangeemail}

                        />

                      </div>
                    </Form.Item>
                  </Col>

                  <Col span={24} xl={24} md={24}>
                    <Form.Item
                      wrapperCol={{

                        span: 16,
                      }}
                    >
                      <div className="submitbtn">
                        <Button type="button" className="submitbtn" onClick={updateUsername}>Submit</Button>
                        <h1>{ }</h1>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <ToastContainer />
            </div>
          </div>
        </Container>
      </section>
      {loading && (

        <div className="spinner-wrapper">

          <div className="spinner">
            <div>
              <div className="mesh-loader">
                <div className="set-one">
                  <div className="circle"></div>
                  <div className="circle"></div>
                </div>

                <div className="set-two">
                  <div className="circle"></div>
                  <div className="circle"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
