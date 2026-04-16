import Appdetails from "../../assets/img/sidebaricon/appdetails.png";
import myplayhistory from "../../assets/img/sidebaricon/myplayhistory.png";
import Gameposting from "../../assets/img/sidebaricon/gameposting.png";
import bonusreport from "../../assets/img/sidebaricon/bonusreport.png";
import referandearn from "../../assets/img/sidebaricon/referandearn.png";
import resulthistory from "../../assets/img/sidebaricon/resulthistory.png";
import share from "../../assets/img/sidebaricon/share.png";
import termsandcondition from "../../assets/img/sidebaricon/termsandcondition.png";
import rateapp from "../../assets/img/sidebaricon/rateapp.png";
import logout from "../../assets/img/sidebaricon/logout.png";
import * as Icon from "react-bootstrap-icons";

const ref_code = localStorage.getItem("ref_code");
// const handleShare = () => {
//   if (navigator.share) {
//     navigator
//       .share({
//         title: "Check out this app!",
//         url: "https://matkawaale.com/",
//       })
//       .then(() => console.log("Shared successfully"))
//       .catch((error) => console.error("Error sharing:", error));
//   } else {
//     const unsupportedBrowserMessage = `
//       Sharing is not supported in this browser.
//       To share, please manually copy and paste the following link:
//       https://matkawaale.com/
//     `;
//     alert(unsupportedBrowserMessage);
//   }
// };

const handleShare = () => {
  // Construct the share URL with referral code
  const shareUrl = ref_code
    ? `https://matkawaale.com/?ref=${ref_code}`
    : "https://matkawaale.com/";

  if (navigator.share) {
    navigator
      .share({
        title: "Check out this app!",
        text: "Join me on Matka Waale and get exciting bonuses!",
        url: shareUrl,
      })
      .then(() => console.log("Shared successfully"))
      .catch((error) => console.error("Error sharing:", error));
  } else {
    const unsupportedBrowserMessage = `
      Sharing is not supported in this browser.
      To share, please manually copy and paste the following link:
      ${shareUrl}
    `;
    alert(unsupportedBrowserMessage);
  }
};


const referCondition = localStorage.getItem("ref_status");

// alert(referCondition);
const Sidebardata = [
  // {
  //   title: "Set MPIN",
  //   path: "/setmpin",
  //   icon: <img alt="game" src={referandearn} />,
  //   ownclass: "d-flex align-items-center link-page navlink-design",
  // },

  // {
  //   title: "App Details",
  //   path: "/Appdetails",
  //   icon: <img alt="game" src={Appdetails} />,
  //   ownclass: "d-flex align-items-center link-page navlink-design",
  // },

  {
    title: "My Play History",
    path: "/History",
    icon: <img alt="game" src={myplayhistory} />,
    ownclass: "d-flex align-items-center link-page navlink-design",
  },

  // {
  //   title: "Game Posting",
  //   path: "/Gameposting",
  //   icon: <img alt="game" src={Gameposting} />,
  //   ownclass: "d-flex align-items-center link-page navlink-design",
  // },

  // {
  //   title: "Bonus Report",
  //   path: "/Bonus-Report",
  //   // hinditext: "अपनी गेम का कमीशन देखने के लिए यहाँ दबाये।",
  //   icon: <img alt="game" src={bonusreport} />,
  //   ownclass: "d-flex align-items-center link-page navlink-design",
  // },

  // {
  //   title: "Reffer & Earn",
  //   path: "/Reffer-Report",
  //   // hinditext: "रेफ़र एंड अर्न।",
  //   icon: <img alt="game" src={referandearn} />,
  //   ownclass: "d-flex align-items-center link-page navlink-design",
  // },
  ...(referCondition == 1
    ? [
      {
        title: "Reffer & Earn",
        path: "/Reffer-Report",
        icon: <img alt="game" src={referandearn} />,
        ownclass:
          "d-flex align-items-center link-page navlink-design bgcolornewdesign",
      },
    ]
    : []),

  {
    title: "Result History",
    path: "/Resulthistory",
    // hinditext: "गेम के रिजल्ट देखने के लिए यहाँ दबाये।",
    icon: <img alt="game" src={resulthistory} />,
    ownclass: "d-flex align-items-center link-page navlink-design",
  },


  {
    title: "Terms And Condtion",
    path: "/Termsandcondition",
    icon: <img alt="game" src={termsandcondition} />,
    // hinditext: "नियम एवं शर्ते।",
    ownclass: "d-flex align-items-center link-page navlink-design",
  },

  {
    title: "Share",
    // hinditext: "जो भाई गली दिसावर प्ले करते है व्हाट्सअप पर शेयर करे।",
    onClick: handleShare,
    icon: <img alt="game" src={share} />,
    ownclass: "d-flex align-items-center link-page navlink-design",
  },

  // {
  //   title: "Rate Our App",
  //   // hinditext: "ह  मारी एप्लिकेशन को सुझाव देने के लिए दबाये।",
  //   path: "https://matkawaale.com/",
  //   icon: <img alt="game" src={rateapp} />,
  //   ownclass: "d-flex align-items-center link-page navlink-design",
  // },

  {
    title: "Logout",
    icon: <img alt="game" src={logout} />,
    ownclass: "d-flex align-items-center link-page navlink-design",
  },
];
export default Sidebardata;
