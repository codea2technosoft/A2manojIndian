import bonus from "../../assets/img/bonus.png";
import connection from "../../assets/img/connection.png";
import dl_history from "../../assets/img/dl_history.png";
import dl_swords from "../../assets/img/dl_swords.png";
import dlexit from "../../assets/img/dlexit.png";
import game from "../../assets/img/game.png";
import rate from "../../assets/img/rate.png";
import * as Icon from "react-bootstrap-icons";

import axios from 'axios';

const checkLoginRefferDate = async () => {
  const data = {
    app_id: "com.babaji.galigame",
    user_id: "uzDATFLWpX",
    dev_id: "rtrtrt",
  };

  try {
    const response = await axios.post('https://api.khelomatka.com/api/users/check-login-reffer-date', data);
    console.log(response.data);
  } catch (error) {
    console.error("Error checking login:", error);
  }
};

const handleShare = () => {

  if (navigator.share) {
    navigator
      .share({
        title: "Check out this app!",
        url: "https://matkawaale.com/",
      })
      .then(() => console.log("Shared successfully"))
      .catch((error) => console.error("Error sharing:", error));
  } else {
    const unsupportedBrowserMessage = `
      Sharing is not supported in this browser.
      To share, please manually copy and paste the following link:
      https://matkawaale.com/
    `;
    alert(unsupportedBrowserMessage);
  }
};

const Sidebardata = [
  {
    title: "App Details",
    path: "/Appdetails",
    icon: <Icon.Phone />,
    ownclass: "d-flex align-items-center link-page navlink-design",
  },

  {
    title: "My Play History",
    path: "/History",
    hinditext: "अपनी खेली हुई गेम देखने के लिए यहाँ दबाये।",
    icon: <img alt="game" src={dl_swords} />,
    ownclass: "d-flex align-items-center link-page navlink-design",
  },

  {
    title: "Game Posting",
    path: "/Gameposting",
    hinditext: "गेम की गैसिंग देखने के लिए यहां दबाए।",
    icon: <img alt="game" src={game} />,
    ownclass:
      "d-flex align-items-center link-page navlink-design background-green-class",
  },
  {
    title: "Bonus Report",
    path: "/Bonus-Report",
    hinditext: "अपनी गेम का कमीशन देखने के लिए यहाँ दबाये।",
    icon: <img alt="game" src={bonus} />,
    ownclass: "d-flex align-items-center link-page navlink-design",
  },
  {
    title: "Reffer",
    path: "/Reffer-Report",
    hinditext: "रेफर ।",
    icon: <img alt="game" src={bonus} />,
    ownclass: "d-flex align-items-center link-page navlink-design",
  },
  {
    title: "Result History",
    path: "/Resulthistory",
    hinditext: "गेम के रिजल्ट देखने के लिए यहाँ दबाये।",
    icon: <img alt="game" src={dl_history} />,
    ownclass: "d-flex align-items-center link-page navlink-design",
  },
  {
    title: "Terms And Condtion",
    path: "/Termsandcondition",
    icon: <img alt="game" src={connection} />,
    hinditext: "नियम एवं शर्ते।",
    ownclass: "d-flex align-items-center link-page navlink-design",
  },
  //   {
  //     title:"Whatsapp Group Join ",
  //     path:"https://api.whatsapp.com/send?phone=6367529290 ",
  //     hinditext:"गेम की गैसिंग देखने के लिए यहां दबाए।",
  //     icon:<Icon.Whatsapp/>,
  //     ownclass:"d-flex align-items-center link-page navlink-design",
  // },
  {
    title: "Share",
    hinditext: "जो भाई गली दिसावर प्ले करते है व्हाट्सअप पर शेयर करे।",
    onClick: handleShare,
    icon: <Icon.Share />,
    ownclass:
      "d-flex align-items-center link-page navlink-design background-green-class",
  },

  {
    title: "Rate Our App",
    hinditext: "हमारी एप्लिकेशन को सुझाव देने के लिए दबाये।",
    path: "#",
    icon: <img alt="game" src={rate} />,
    ownclass: "d-flex align-items-center link-page navlink-design",
  },

  //   {
  //     title:"Help",
  //     path:"tel:+6367529290",
  //     hinditext:"गेम की गैसिंग देखने के लिए यहां दबाए।",
  //     icon:<Icon.Phone/>,
  //     ownclass:"d-flex align-items-center link-page navlink-design",
  // },

  {
    title: "Logout",
    // path:"/Login",

    icon: <img alt="game" src={dlexit} />,
    ownclass: "d-flex align-items-center link-page navlink-design",
  },
];
export default Sidebardata;
