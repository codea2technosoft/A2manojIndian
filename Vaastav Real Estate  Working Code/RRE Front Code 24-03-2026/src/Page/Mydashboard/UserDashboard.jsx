import { useState, useEffect } from 'react'
import Leftsidebar from "./Leftsidebar";
import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from "../../Include/Header";
import Footer from "../../Include/Footer";
import { CgMenuRightAlt } from "react-icons/cg";

function UserDashboard() {
  const location = useLocation();
  const profileImage = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/profile/`;

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const showHeaderFooter = location.pathname === "/my-dashboard";

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.status === "1") {
          setProfile(data.data);
        } else {
          setError(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const [sidebarnew,setSidebar] = useState(true);

  const togglesidebarmenu = () =>{
    setSidebar(prev => !prev);
  }

useEffect(()=>{
  const handleResize = () =>{
    const iswidthsidebar = window.innerWidth<=991;
    setSidebar(!iswidthsidebar);
  };
  handleResize();

  window.addEventListener('resize',handleResize);
  return () => window.removeEventListener('resize',handleResize);

},[])
  return (
    <>
      {showHeaderFooter && <Header />}
      
      <div className="userdashboard">
        <div className="image_username">
          <div className="container">

            <h1>{profile?.username}</h1>
            <ul>
              <li>Home</li>
              <li>/</li>
              <li>My Account</li>
            </ul>
          </div>
        </div>
          <div className="userdashboard_design">
              <div className='subadminmenu'> 
                back
              </div>
              <div className='togglebuttondesign' onClick={togglesidebarmenu}>
                <CgMenuRightAlt/>
              </div>
          </div>
        <div className="mydashboard">
          <div className="container">

            <div className="row">

              {sidebarnew &&(
                <div className="col-md-3">
                <Leftsidebar />
              </div>
              )}
              <div className="col-md-9">
                <div className="content-area">
                  <Outlet />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {showHeaderFooter && <Footer />}
    </>
  );
}

export default UserDashboard;