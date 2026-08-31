import axios from 'axios';
const fetchwalletamount = async (setWalletAmount) => {
  
    try {
      const user_id = localStorage.getItem("userid");
      const dev_id = localStorage.getItem("dev_id");
      // const formData = new FormData();
      // formData.append('app_id', process.env.REACT_APP_API_ID);
      // formData.append('user_id', user_id);
      // formData.append('dev_id', dev_id);
      const url = (`${process.env.REACT_APP_API_URL_NODE}user-credit`);
  
      const requestData = {
        app_id: process.env.REACT_APP_API_ID,
        user_id: user_id,
        dev_id: dev_id,
      };
      const response = await axios.post(url, requestData);
  

      setWalletAmount(response.data.credit);
      // alert(response.data.credit);
    } catch (error) {
      console.error('Error fetching wallet amount:', error);
     
    
    }
  }
export { fetchwalletamount};