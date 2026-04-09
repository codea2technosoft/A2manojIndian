import React from 'react'
import { Link } from "react-router-dom"; 
export default function NotFound() {
  return (
    <div>
       <div className="notfound-container">
      <img
        src="/images/404.png" // place your 404 image inside public/images folder
        alt="Page Not Found"
        className="notfound-img"
      />
      <h2>Oops! Page Not Found</h2>
      <p>The page you are looking for doesn’t exist or has been moved.</p>
      <Link to="/" className="btn-home">
        Go Back Home
      </Link>
    </div>
    </div>
  )
}
