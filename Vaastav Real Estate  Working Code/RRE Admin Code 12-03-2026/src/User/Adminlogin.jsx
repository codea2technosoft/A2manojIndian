import React, { useState } from 'react';
import './Login.scss';
import logo from '../assets/images/logo.png';
import imageplot from '../assets/images/loginimage.jpg';
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
function Adminlogin() {
    const [passwordshow, setpasswordshow] = useState(false);


    const togglepasswordshow = () => {
        setpasswordshow((prev) => !prev);
    }
    return (
        <div className="adminlogin">
            <div className="d-flex login_form align-items-center">
                <div className="quotes">
                    <h2>Welcome to Vaastav Real Estate</h2>
                    <p>Log in to access exclusive property listings, manage your account, and connect with trusted agents across Rajasthan.</p>

                </div>
                <div className='imagelogin'>
                    {/* <img src={imageplot} alt="imageplot" /> */}
                </div>
                <div className="login-wrapper">
                    <div className="form_design">
                        <div className="logo_login">
                            <img src={logo} alt="logo" />
                        </div>
                        <h2>Welcome Back</h2>
                        <p>Let’s login to grab amazing deal</p>
                        <form className="login-form text-start">
                            <div className="form-group">
                                <label htmlFor="">Login Id</label>
                                <input type="text" autoComplete='off' placeholder="Login Id" defaultValue="Example123456" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Password</label>
                                <input
                                    type={passwordshow ? 'text' : 'password'}
                                    autoComplete='off' placeholder="Password" />
                                <div className="passwordhideshow">
                                    <button type='button' onClick={togglepasswordshow}>
                                        {passwordshow ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="d-flex align-items-end">
                                <div className="form-group mb-0">
                                    <label htmlFor="">Captcha</label>
                                    <input type="text" autoComplete='off' placeholder="captcha" defaultValue="1234656" />
                                </div>
                                <div className="imagecaptcha">
                                    24500
                                </div>
                            </div>

                            <div className="form-options">
                                <label><input type="checkbox" /> Remember me</label>
                                {/* <a href="#">Forgot Password?</a> */}
                            </div>

                            <button className="login-btn" type="submit">Login</button>
                        </form>

                        {/* <div className="signup-text">
                            Don’t have an account? <a href="#">Sign Up</a>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Adminlogin
