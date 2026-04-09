
import React, { useState,useEffect } from "react";
import loginimg from '../images/global-gameSheetSplash.png';
import axios from "axios";
// import history from './history';
import logo from '../images/kkhelchampian.png';
import { useNavigate } from "react-router-dom";
import { Outlet, Link, Await, } from "react-router-dom";
import $ from "jquery";
import Swal from 'sweetalert2';
import loader from '../images/dancingloader.gif'
import withReactContent from 'sweetalert2-react-content';
import Rightsidebar from '../routes/Rightsidebar';
import './new.css';

// import Newdashbord from "./Newdashbord";
//  import  Term from "../routes/Term"

// const jwt = require('jsonwebtoken');

// let user;

// Otp Api 

const Login = () => {

    const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(true); 
  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    });
  
    return () => {
      window.removeEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        setDeferredPrompt(event);
      });
    };
  }, []);
  
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
  
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
          setShowInstallButton(false); // Hide the install button after installation
        } else {
          console.log('User dismissed the A2HS prompt');
        }
  
        setDeferredPrompt(null);
      });
    }
  };  


    sessionStorage.setItem("token", "");
    sessionStorage.setItem("userid", "");
    
  
    
    const [user, setUserts] = useState({
        mobile: "",
    });

    const [motp, setMotp] = useState(
        {
            mobile:"9782950745",
            otp:"1234"
        }
    )
    // const token =  user.generateAuthToken();
    const [otpsand, setOtpsend] = useState(null);
    const [isShown, setIsShown] = useState(false);

    const [mobile, mobilenumber] = useState();
    const [otpnumbers, otpnumber] = useState();


    // const { mobile } = user;
    function onInputChange(e) {
        // alert(e.target.value);
        mobilenumber(e.target.value);
        // setUserts({ ...user, [e.target.name]: e.target.value });
    };
    function onInputChangeotp(e){
        otpnumber(e.target.value);
    };
    useEffect(
        () => {
            getData();
        }, []
      );
      const [ipset, setIP] = useState();
    const getData = async()=>{
        const res = await axios.get('https://geolocation-db.com/json/')
        // alert(res.data.IPv4);
        setIP(res.data.IPv4);
        localStorage.setItem('ipaddress',res.data.IPv4);
    }
    const onSubmit = async (e) => {
        e.preventDefault(); 
     
          
        let res = axios.post("https://api.khelomatka.com/api/users/send-otp", {
            method: "POST",
            mobile:mobile
          }).then((response) => {
            if(response.data.status){
               setIsShown(true)
           }else{
            setIsShown(false);
           }
            // const phoneno = /^\d{10}$/;
            //     if ((mobile.mobile.match(phoneno))) {
                   
        
            //     }
            //     else {
            //         setIsShown(false);
        
            //     }
          });
        //   setIsShown(true)
    }
    // =====Login Api=====

    const navigate = useNavigate();
    const loginverfiy = async (e) => {
        e.preventDefault();
        const queryParameters = new URLSearchParams(window.location.search);
        const type = queryParameters.get("reffercode");
        if(type){
            var reffercode = type;
        }else{
            var reffercode = '';
        }
        // alert(ipset);
        let res = axios.post("https://api.khelomatka.com/api/users/user-register", {
            method: "POST",
            mobile:mobile,
            otp:otpnumbers,
            reffercodeGiven:reffercode,
            ipaddress:ipset,
          }).then((response) => {
           if(response.data.status == 1){
                    const MySwal = withReactContent(Swal)
                    MySwal.fire({
                      title: <strong>Login Successfully</strong>,
                      icon: 'success',
                      timer: 1500
                    }).then((result) => {                       
                        localStorage.setItem('token_store_vplay', response.data.token);
                        localStorage.setItem('userid',response.data.userid);
                        window.location.href = '/dashbord';
                    })
                }else{
                    const MySwal = withReactContent(Swal)
                    MySwal.fire({
                      title: <strong>Invalid OTP!</strong>,
                      icon: 'error',
                      timer: 1500
                    }).then((result) => {
                    
                    })
                }
          });
    }





    useEffect(() => {
        const spinnerWrapper = document.querySelector('.spinner-wrapper');
    
        if (spinnerWrapper) {
          setTimeout(() => {
            spinnerWrapper.style.display = 'none';
            
          }, 2000);
        }
      }, []);
    
    return (
        <>

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

<div>
<div>
</div>





             
            <div className="leftContainer">
            <div className="headerContainer">
                    <Link to='/Newdashbord'>
                        <picture className="ml-2 navLogo d-flex">
                            <img src={logo} alt="logo" style={{ height: '55px', width: '70px' }} />
                        </picture>
                    </Link>
                    <div className="menu-items">
                        <Link type="button" className="login-btn" to="/login">LOGIN</Link>
                    </div>
                    <span className="mx-5" />
                </div>  
                {/ <div className="main-area"> /}
                <div style={{ overflowY: 'hidden' }} >
                    <div className="splash-overlay" />
                    <div className="splash-screen">
                        <figure><img width="100%" src={loginimg} alt="" /></figure>
                    </div>
                    <form method="post" id="user_login" onSubmit={onSubmit}>
                        <input type="hidden" name="_token" defaultValue="C7QRdqspHb1mwSzxeM2NJd9raXKwU7i4EfmBBHZ6" /> <input type="hidden" name="reffercode" id="reffercode" defaultValue />
                        <div className="position-absolute w-100 center-xy mx-auto" style={{ top: '30%', zIndex: 4 }}>
                            <div className="d-flex text-white font-15 mb-4">Sign in or Sign up</div>
                            <div className="bg-white px-4 cxy flex-column pt-4" id="incheight" style={{ width: '85%', borderRadius: '5px' }}>
                                <div id="sign_up_success" />
                                <div className="input-group" style={{ transition: 'top 0.5s ease 0s' }}>
                                    <div className="input-group-prepend">
                                        <div className="input-group-text" style={{ width: '80px' }}>+91</div>
                                    </div>

                                    <input className="form-control" required pattern="[0-9]{10}" name="mobile" id="mobile" type="tel" placeholder="Mobile number" value={mobile} style={{ transition: 'all 3s ease-out 0s' }} onChange={onInputChange} />

                                    <div className="invalid-feedback">Enter a valid mobile number</div>
                                </div>
                                {/ <span classname="btn btn-info" id="sendotp" style={{marginLeft: '74%'}}>Send Otp</span> /}
                                <br />
                                {isShown ? (

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

<div>
<div>
</div>
                                  

                                    <div className="input-group pt-2 otp mb-3" style={{ transition: 'left 0.5s ease 0s' }}>
                                        <div className="input-group-prepend">
                                            <div className="input-group-text" style={{ width: '80px' }}>OTP</div>
                                        </div>
                                        <input className="form-control" name="otp" id="otp" type="tel" onChange={onInputChangeotp} placeholder="Enter OTP" autoComplete="off" />
                                        <div className="invalid-feedback">Enter a correct OTP</div>
                                    </div>
                                    </div>

                                ) : null}

                            
                            

                            {isShown ? <button type="button" onClick={loginverfiy} className="bg-green refer-button cxy mt-4 otp_login submit_data" id="submit_data" name="submit_data" style={{ width: '85%' }}>Login</button> : <button type="submit" className="bg-green refer-button cxy mt-4 send-otp" id="send_ottp" style={{ width: '85%' }}>Send OTP</button>}

                        </div>
                        </div>
                    </form>
                    <div className="login-footer">By proceeding, you agree to our 
                    <Link  to="/Term">Terms of Use ,</Link>
                    <Link  to="/Privacy">Privacy Policy</Link>


                     {/ <a href="term-condition">Privacy Policy</a>  /}
                     and that you are 18 years or older. You are not playing from Assam, Odisha, Nagaland, Sikkim, Meghalaya, Andhra Pradesh, or Telangana.</div>
                    {/ </div> /}
                </div>
            </div>
            <Rightsidebar/>
            <Outlet />

            {showInstallButton &&    <button style={{background:'red'}} className="btn btn-ronded text-light" onClick={handleInstallClick}>Install Web Application</button>}
            </div>
        </>
       
      
    );
}
export default Login;


