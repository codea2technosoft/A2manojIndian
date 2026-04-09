import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Include/Layout";
import Home from "./Page/Index";
import Contact from "./Page/Contact";
import GalleryPage from "./Page/GalleryPage";
import Aboutus from "./Page/Aboutus";
import Ongoinproject from "./Page/Ongoinproject";
import Completeproject from "./Page/Completeproject";
import Ourservice from "./Page/Ourservice";
import Projectdetils from "./Page/Projectdetils";
import Login from "./Login/Login";
import Custumerlogin from "./Login/Custumerlogin";
import Profile from "./Page/Profile/Profile";
import ChangePassword from "./Page/Profile/ChangePassword";
import Mybooking from "./Page/Profile/Mybooking";
import CompleteKyc from "./Page/Profile/CompleteKyc";
import Paymentreport from "./Page/Profile/Paymentreport";
import Blogdetails from "./Page/Blogdetails";
import Partnermarkettingrule from "./Page/Partnermarkettingrules";
import Bookingform from "./Page/Bookingform";
import DownloadMultipleDocuments from "./Page/OfficialDocuments/OfficialDocuments";
import DownloadRRPlans from "./Page/DownloadRRPlans/DownloadRRPlans";
import AssociateRegisterForm from "./Commonpage/AssociateRegisterForm";
import UserDashboard from "./Page/Mydashboard/UserDashboard";
import "aos/dist/aos.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/custumerlogin" element={<Custumerlogin />} />
          <Route
            path="/associate-register"
            element={<AssociateRegisterForm />}
          />
          <Route path="/" element={<Layout />}>
          <Route
            path="/download-official-documents"
            element={<DownloadMultipleDocuments />}
          />

           <Route
            path="/download-shubh-bhoomi-plans"
            element={<DownloadRRPlans />}
          />


            <Route index element={<Home />} />
            <Route path="contact-us" element={<Contact />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="ourservice" element={<Ourservice />} />
            <Route path="projectdetils/:id" element={<Projectdetils />} />{" "}
            {/* ✅ Fixed here */}
            <Route path="ongoinproject" element={<Ongoinproject />} />
            <Route path="completeproject" element={<Completeproject />} />
            {/* <Route path="blog-details" element={<Blogdetails />} /> */}
            {/* <Route path="blog-details/:id" element={<Blogdetails />} /> */}
            <Route path="blog-details/:slug" element={<Blogdetails />} />
            <Route path="marketingpartmner_rule" element={<Partnermarkettingrule />} />
            <Route path="booking_form" element={<Bookingform />} />

            <Route path="aboutus" element={<Aboutus />} />
            {/* Nested Dashboard Routes */}
            <Route path="my-dashboard" element={<UserDashboard />}>
              <Route path="profile" element={<Profile />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="complete-kyc" element={<CompleteKyc />} />
              <Route path="mybooking" element={<Mybooking />} />
              <Route path="paymentreport" element={<Paymentreport />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
