import { useEffect, useState } from "react";
import referandearn from "../../assets/images/referandearn.png";
import whatsapp from "../../assets/images/whatsapp.png";
import Swal from "sweetalert2";

const ReferEarnPage = () => {
  // const baseUrl = window.location.origin;
  //const baseUrl = "https://realestate.a2logicgroup.com/";
  // const baseUrl = "https://realestate.a2logicgroup.com";
  // const baseUrl = "https://rajasthanirealestates.in";
const baseUrl = process.env.REACT_APP_MERCHANTREFER_API_URL;

  const [referralLink, setReferralLink] = useState("");
  const [userType, setUserType] = useState("");
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (res.ok) {
        const data = await res.json();

        if (data.message === "Invalid Token") {
          localStorage.setItem("isLoggedIn", "false");
          localStorage.removeItem("token");
          const isLoggedIn = localStorage.getItem("isLoggedIn");
          if (isLoggedIn !== "true") {
            window.location.href = "/login";
          }
        } else {
          const roles = data.data.user_type;
          const userMobile = data.data.mobile;

          setUserType(roles);
          setMobile(userMobile);

          // ✅ Generate referral link
          const generatedLink = `${baseUrl}/associate-register?parent_id=${userMobile}`;
          // alert(generatedLink);
          setReferralLink(generatedLink);
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // alert(generatedLink);

  // const copyReferralLink = () => {
  //   if (referralLink) {
  //     navigator.clipboard.writeText(referralLink).then(() => {
  //       alert("Referral URL copied!");
  //     });
  //   }
  // };

  // const copyReferralLink = () => {
  //   if (referralLink) {
  //     navigator.clipboard.writeText(referralLink).then(() => {
  //       Swal.fire({
  //         title: "REFER & EARN COPIED!",
  //         text: "Referral URL has been copied to clipboard.",
  //         icon: "success",
  //         confirmButtonText: "OK",
  //         position: "center", // 👈 Center me dikhane ke liye
  //         timer: 2000,
  //         showConfirmButton: true,
  //       });
  //     });
  //   }
  // };

  const copyReferralLink = () => {
    if (!referralLink) return;
    try {
      // Modern browser support
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(referralLink)
          .then(() => {
            Swal.fire({
              title: "REFER & EARN COPIED!",
              text: "Referral URL has been copied to clipboard.",
              icon: "success",
              confirmButtonText: "OK",
              position: "center",
              timer: 2000,
              showConfirmButton: true,
            });
          })
          .catch((err) => {
            console.error("Clipboard write failed, using fallback:", err);
            fallbackCopy(referralLink);
          });
      } else {
        // Fallback method
        fallbackCopy(referralLink);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      fallbackCopy(referralLink);
    }
  };
  // Fallback function
  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    Swal.fire({
      title: "REFER & EARN COPIED!",
      text: "Referral URL copied using fallback method.",
      icon: "success",
      confirmButtonText: "OK",
      position: "center",
      timer: 2000,
      showConfirmButton: true,
    });
  };

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Invite Friends & Earn</h3>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="imagereferandearn">
                <img src={referandearn} alt="refer and earn" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="referandearndetails">
                <h2>Refer and Earn</h2>
                <p className="subheading">
                  Invite your friends and earn rewards when they sign up!
                </p>
                <p>
                  Invite your friends and earn amazing rewards when they sign
                  up!
                </p>

                {/* <div className="referral-link-container">
                  <input
                    type="hidden"
                    id="referralLink"
                    value={referralLink}
                    readOnly
                    className="referral-input"
                    placeholder="Generating referral link..."
                  />
                  <button className="copy-button" onClick={copyReferralLink}>
                    Copy Link
                  </button>
                </div> */}

                {/* <div className="col-12 col-md-12">
                  <div className="share-box text-center">
                    <h4> Share Your Referral Link</h4>
                    <p>Share on</p>
                    <a
                      href={`https://api.whatsapp.com/send?text=Join%20me%20on%20this%20platform:%20${encodeURIComponent(
                        referralLink
                      )}`}
                      className="new_whatsapp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={whatsapp} alt="whatsapp-share" />
                    </a>
                  </div>
                </div> */}

                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="share-box text-center">
                      <h4>Share Your Referral Link</h4>
                      <p>Share on</p>
                      <button
                        className="copy-button"
                        onClick={copyReferralLink}
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="share-box text-center">
                      <h4>Share Your Referral Link</h4>
                      <p>Share on</p>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `Join me on this platform: ${referralLink}`
                        )}`}
                        className="new_whatsapp"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={whatsapp} alt="whatsapp-share" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>How It Works</h3>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="how-it-works">
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Share Your Link</h4>
                  <p>Share your unique referral link with friends</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>They Sign Up</h4>
                  <p>Your friends sign up using your link</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>You Both Earn</h4>
                  <p>You get rewards when they complete qualifying actions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferEarnPage;
