import React, { useState } from 'react';
import './Login.scss';
import logo from '../assets/images/logo.png';
import imageplot from '../assets/images/loginimage.png';
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

function Custumerlogin() {
    const [password, setpassword] = useState(false);
    const togglepassword = () => {
        setpassword((prev) => !prev);

    }

    return (
        <div className='custumerlogin'>
            <div className="login_new_logo">
                <img src={logo} alt="logo" />
            </div>
            <div className="d-flex login_form align-items-stretch">
                <div className="login-wrapper">
                    <div className="form_design">
                        <div className="logo_login">
                            <img src={logo} alt="logo" />
                        </div>
                        <div className="headignall">
                            <h2>Welcome Back</h2>
                            <p>Let’s login to grab amazing deal</p>
                        </div>
                        <form className="login-form text-start">
                            <div className="form-group">
                                <label htmlFor="">Login Id</label>
                                <input type="text" autoComplete='off' placeholder="Login Id" defaultValue="Example123456" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Password</label>
                                <input
                                    type={password ? 'text' : 'password'}
                                    autoComplete='off' placeholder="Password" />
                                <div className="passwordhideshow">
                                    <button type='button' onClick={togglepassword}>
                                        {password ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
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
                                <a href="#">Forgot Password?</a>
                            </div>

                            <button className="login-btn" type="submit">Login</button>
                        </form>

                        <div className="signup-text">
                            Don’t have an account? <a href="#">Sign Up</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Custumerlogin
