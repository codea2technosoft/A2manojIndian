// import { useEffect, useState, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import PageTitle from 'components/PageTitle';
// import TableBar from 'components/TableBar';
// import { Card, Form, Row, Col, Input, Button, Modal, Divider, Select, Table, Switch, TextArea } from 'antd';
// import { generateRandomString } from 'utils/common';
// import { RefreshIcon } from '@heroicons/react/outline';
// import { ToastContainer, toast } from 'react-toastify';
// import { parseQueryParams, stringifyQueryParams } from 'utils/url';
// import 'react-toastify/dist/ReactToastify.css';
// import DatePicker from 'components/DatePicker';
// import dayjs from 'dayjs';
// import { createpaylink } from 'requests/order';
// import PaymentLinkTable1 from './paymentlink';
// import FileSearch from 'components/FileSearch';
// import Cookies from 'js-cookie';
// import axios from 'axios';

// const PaymentLinkss = () => {
//     const { RangePicker } = DatePicker;
//     const [loading, setLoading] = useState(false);
//     const [visibleModal, setVisibleModal] = useState(false);
//     const [checkoutUrl, setCheckoutUrl] = useState('');
//     const [qrImageUrl, setQrImageUrl] = useState('');
//     const [payLink, setPayLink] = useState(null);

//     const { TextArea } = Input;
//     const searchRef = useRef(null);
//     const [isShowFilter, setIsShowFilter] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const titles = [{ path: location.pathname, title: 'Payment Links' }];
//     const [formRef] = Form.useForm();
//     // const initialValues = {
//     //     order_number: generateRandomString(8),
//     //     billing_person_name: 'Test User',
//     //     email: 'testuser@test.com',
//     //     phone: '9999999999',
//     //     subtotal: 200,
//     //     tax: 0,
//     //     currency: 'INR',
//     //     return_url: 'https://api.yumype.com/thank-you.php',
//     // };

//     const isRendered = useRef(false);
//     const [currencyCode, setCurrencyCode] = useState('');
//   const [currencyCode1, setCurrencyCode1] = useState('EUR');

//     const [data1, setData] = useState([]);
//     const [cur001, setCur001] = useState([]);
//     const [show, setShow] = useState(false);
//     const [modalData, setModalData] = useState(null);
//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);
//   const [orderId, setOrderId] = useState(""); 
//   const [records, setRecords] = useState([]);
//   const [users, setUsers] = useState(null);
//   const [fullName, setFullName] = useState("");
//   const [clientId, setClientId] = useState("");
//   const [secretId, setSecretId] = useState("");
//   const [Currency, setCurrency] = useState("");
//   const [Amount, setAmount] = useState("");
//   const [ProductName, setProductName] = useState("");
//   const [Qty, setQty] = useState("");
//   const [UserId, setUserId] = useState("");
// //   const navigate = useNavigate();

//       useEffect(() => {
//         const fetchData = async () => {
//           try {
//             const segment = window.location.pathname.split("/");
//             const formData = new FormData();
//             formData.append("id", segment[1]);
      
//             const response = await axios.post(
//               `/paypal-get-users-info`,
//               formData,
//               {
//                 headers: {
//                   "Content-Type": "multipart/form-data",
//                 },
//               }
//             );
      
//             const {status, records, user } = response.data;

//             if (status !== true) {
//                 localStorage.clear();
//                 navigate('/errorPage');
    
//                 return;
//             }
    
//             const mappedRecordsInfo = {
//               orderId: records.orderid,
//               UserId: records.userid,
//               Currency: records.currency,
//               Amount: records.amount,
//               ProductName: records.product_name,
//               Qty: records.qty
//             };
//             setRecords(mappedRecordsInfo);
//             setOrderId(mappedRecordsInfo.orderId);
//             setUserId(mappedRecordsInfo.UserId);
//             setCurrency(mappedRecordsInfo.Currency);
//             setAmount(mappedRecordsInfo.Amount);
//             // alert(mappedRecordsInfo.Amount);
//             setProductName(mappedRecordsInfo.ProductName);
//             setQty(mappedRecordsInfo.Qty);
//             console.log("Order ID:", mappedRecordsInfo.orderId);

//             handleChangeCurrency(mappedRecordsInfo.Currency);

//             setFormData(prevFormData => ({
//                 ...prevFormData,
//                 amount: mappedRecordsInfo.Amount,
//             }));
//             setFormData(prevFormData => ({
//                 ...prevFormData,
//                 product_name: mappedRecordsInfo.ProductName,
//             }));
//             setFormData(prevFormData => ({
//                 ...prevFormData,
//                 quantity: mappedRecordsInfo.Qty,
//             }));
            
            
//             const mappedUserInfo = {
//               fullName: user.full_name,
//               clientId: user.paypal_client_id,
//               secretId: user.paypal_secret_id,
//             };
//             setUsers(mappedUserInfo);
//             setFullName(mappedUserInfo.fullName);
//             setClientId(mappedUserInfo.clientId);
//             setSecretId(mappedUserInfo.secretId);
//           //   console.warn("FullNAme:", mappedUserInfo.fullName);
//           const script = document.createElement('script');
//           script.src = `https://www.paypal.com/sdk/js?client-id=${mappedUserInfo.clientId}`;
//           script.setAttribute('data-partner-attribution-id', 'MTMPaymentServicesPvtLtd_SI');
//           script.async = true;
//           document.body.appendChild(script);


//           script.src = `https://www.paypal.com/sdk/js?client-id=${mappedUserInfo.clientId}&currency=${mappedRecordsInfo.Currency}`;
//           script.setAttribute('data-partner-attribution-id', 'MTMPaymentServicesPvtLtd_SI');
//           script.async = true;
//           document.body.appendChild(script);
//           } catch (error) {
//             console.error("Error fetching data:", error);
//           }
//         };
      
//         fetchData(); // Call fetchData function when the component mounts
//       }, [navigate]); 

//       const Submit = async (paypal_id) => {
//         console.warn(paypal_id);
//         try {
//             const url = `https://pnode.mtmpay.in/order-checkstatus`;
//             const payload = {
//                 orderid: paypal_id
//             };
//             const response = await axios.post(url, payload);
//             setModalData(response.data);
//             console.warn("response",response.data);
//         } catch (error) {
//             console.error("Error fetching events:", error);
//         }
//     };
    
    
//     const [formData, setFormData] = useState({
//         amount: '',
//         product_name: '',
//         quantity: ''
//     });

//     const handleChangeAmount = (e) => {
//         const { id, value ,name} = e.target;

//         // alert(value);
//         // setFormData(prevFormData => ({
//         //     ...prevFormData,
//         //     [id]: value
//         // }));
     
//     };

//     const handleChangeCurrency = (event) => {
//       setCurrencyCode(event);
//         // alert(event);
//         var inputBox = document.getElementById('cur01');
    
//         // Set the value of the input box
//       inputBox.value = event; // Replace 'Your desired value' with the value you want to set
//          const newCurrencyCode = event;
//         setCurrencyCode1(newCurrencyCode);
//       setCur001(event);
      

//     };
  
//      useEffect(() => {
//         // Create script element for PayPal SDK
//         // const script = document.createElement('script');
//         // script.src = `https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=${currencyCode1}`;
//         // script.async = true;

//         // // Load script and add to the document body
//         // document.body.appendChild(script);

//         // // Clean up function to remove the script when component unmounts or currency code changes
//         // return () => {
//         //     document.body.removeChild(script);
//         // };
//     }, [currencyCode1]); // useEffect will re-run whenever currencyCode changes


//     const [eorderData, SetorderData] = useState("");
//   useEffect(() => {
      
    
//         // alert(currencyCode)
//         const renderPayPalButtons = () => {
            
//             const orderData = {
//                 currency_code: currencyCode,
//                 amount: formData.amount,
//                 product_name: formData.product_name,
//                 quantity: formData.quantity,
//                 full_name: fullName,
//                 userid: UserId,
//             };
//             // alert(Amount);
//             if (currencyCode === "" || Amount === "" ||formData.product_name==="" || formData.quantity==="") {
               
//                   return;
            
//               }
//             localStorage.setItem("currency_code" , currencyCode);
//             localStorage.setItem("amount" , formData.amount);
//             localStorage.setItem("product_name" , formData.product_name)
//             localStorage.setItem("quantity" , formData.quantity)
//             localStorage.setItem("full_name" , fullName)
//             localStorage.setItem("userid" , UserId)
//             // SetorderData(orderData);

                
//                 if (isRendered.current) return;
                
//                 window.paypal.Buttons({
//                     createOrder: async (data, actions) => {
//                       const currency_code =  localStorage.getItem("currency_code")
//                       const Amounts =  localStorage.getItem("amount")
//                       const product_name =  localStorage.getItem("product_name")
//                       const quantity =  localStorage.getItem("quantity")
//                       const full_name =  localStorage.getItem("full_name")
//                       const userid =  localStorage.getItem("userid")
//                       const orderData = {
//                         currency_code: currency_code,
//                         amount: Amounts,
//                         product_name: product_name,
//                         quantity: quantity,
//                         full_name: full_name,
//                         userid: userid
//                     };
//                         console.warn("formData", orderData)
//                         // alert(orderData)
//                     try {
//                         const response = await axios.post('https://pnode.mtmpay.in/api/orders',orderData);
//                         return response.data.id; // Return the order ID
//                     } catch (error) {
//                         console.error('Create Order Error:', error);
//                         throw new Error('Failed to create order');
//                     }
//                 },
//                 onApprove: async (data, actions) => {
//                     try {
//                         const response = await axios.post(`https://pnode.mtmpay.in/api/orders/${data.orderID}/capture/${UserId}/${fullName}`);
//                         console.warn('Capture result', response.data);
//                         alert('Payment successful!');
//                     } catch (error) {
//                         console.error('Capture Order Error:', error);
//                         alert('Payment failed!');
//                     }
//                 }
//             }).render('#paypal-buttons-container');

//             isRendered.current = true;
//         };

//         // console.warn("formData", formData);
        
//         if (window.paypal) {
//             renderPayPalButtons();
//             // alert(renderPayPalButtons());
//         } else {
//             window.addEventListener('load', renderPayPalButtons);
//         }

//         return () => {
//             window.removeEventListener('load', renderPayPalButtons);
//         };
//     }, [formData, currencyCode]);
//     const isFormValid = () => {
//         return formData.amount && formData.product_name && formData.quantity && currencyCode;
//     };

//     const onToggleFilter = () => {
//         setIsShowFilter(!isShowFilter);
//     };

//     const onOpenCheckoutUrl = () => {
//         window.open(checkoutUrl, '_blank');
//     };

//     const onSearch = (keyword) => {
//         let query = parseQueryParams(location);
//         query = {
//             ...query,
//             page: 1,
//             keyword: keyword,
//         };

//         navigate({
//             pathname: location.pathname,
//             search: stringifyQueryParams(query),
//         });
//     };

//     const onSetDatesByDatePicker = (dates) => {
//         setMode('custom');
//         setDates(dates);
//     };
//     const [dates, setDates] = useState([dayjs(), dayjs()]);
//     const [mode, setMode] = useState('today');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isModal2Open, setIsModal2Open] = useState(false);

//     const generateLink = async () => {
//         try {
//             setLoading(true);
//             const token = Cookies.get('sob_token');
//             const headers = {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             };

//             const response = await axios.post(
//                 'https://api.mtmpay.in/merchant-Paypal-payment-link',
//                 {}, // You can pass any data you want to send in the body here
//                 { headers }, // Correct placement of headers
//             );
//             const paymentLink = response.data?.records;
//             formRef.setFieldsValue({ email: paymentLink });
//         } catch (error) {
//             console.error('Error generating payment link:', error);
//         } finally {
//             setLoading(false);
//         }
//     };
//     const showModal = () => {
//         setIsModalOpen(true);
//     };

//     const handleOk = () => {
//         setIsModalOpen(false);
//     };

//     const handleCancel = () => {
//         setIsModalOpen(false);
//     };

//     const handleCancelWithReset = () => {
//         formRef.resetFields();
//         handleCancel();
//     };

//     const showModal2 = () => {
//         setIsModal2Open(true);
//     };

//     const handleOk2 = () => {
//         setIsModal2Open(false);
//     };

//     const handleCancel2 = () => {
//         setIsModal2Open(false);
//     };

//     return (
//         <div className="Links">
//             <ToastContainer />
//             {/* <Card className="mt-16 topbox-shadow"> */}
//             <Row gutter={[8, 8]} justify={'space-between'} className="bgred">
//                 {/* <Col xs={24} sm={24} md={24} lg={12}>
//                         <PageTitle titles={titles} />
//                     </Col>
//                     <Col xs={24} sm={24} md={24} lg={10} xl={6} span={6}>
//                         <TableBar placeholderInput="Transaction Detail" showFilter={false} />
//                     </Col> */}

//                 <Col xs={24} sm={24} md={14} lg={9} xl={7}>
//                     <Card className="wallet_box">
//                         <RangePicker
//                             value={dates}
//                             onCalendarChange={(newDates) => onSetDatesByDatePicker(newDates)}
//                             style={{ height: '45px' }}
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={24} md={10} lg={6} xl={6}>
//                     <Card className="wallet_box">
//                         <TableBar
//                             type="text"
//                             placeholder="Search"
//                             onSearch={onSearch}
//                             onFilter={onToggleFilter}
//                             isActiveFilter={isShowFilter}
//                             inputRef={searchRef}
//                             showFilter={false}
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={24} md={24} lg={9} xl={6}>
//                     <Card className="wallet_box">
//                         <Button onClick={showModal} className="ant-btn-primary create-pay-link">
//                             Quick Payment Link
//                         </Button>
//                     </Card>
//                 </Col>
//             </Row>
//             {/* </Card> */}
//             <Modal
//       title="Quick Payment Link"
//       open={isModalOpen}
//       onCancel={handleCancelWithReset}
//       footer={false}
//     >
//       <Form layout="vertical" form={formRef}>
//         <Form.Item>
//         <select id="currencyDropdown" className='form-select' name='currencyCode' disabled value={currencyCode} onChange={handleChangeCurrency}>
  
//   <option value="AUD">Australian Dollar (AUD)</option>
//   <option value="BRL">Brazilian Real 2 (BRL)</option>
//   <option value="CAD">Canadian Dollar (CAD)</option>
//   <option value="CNY">Chinese Renmenbi 4 (CNY)</option>
//   <option value="CZK">Czech Koruna (CZK)</option>
//   <option value="DKK">Danish Krone (DKK)</option>
//   <option value="EUR">Euro (EUR)</option>
//   <option value="HKD">Hong Kong Dollar (HKD)</option>
//   <option value="HUF">Hungarian Forint 1 (HUF)</option>
//   <option value="ILS">Israeli New Shekel (ILS)</option>
//   <option value="JPY">Japanese Yen 1 (JPY)</option>
//   <option value="MYR">Malaysian Ringgit 3 (MYR)</option>
//   <option value="MXN">Mexican Peso (MXN)</option>
//   <option value="TWD">New Taiwan Dollar 1 (TWD)</option>
//   <option value="NZD">New Zealand Dollar (NZD)</option>
//   <option value="NOK">Norwegian Krone (NOK)</option>
//   <option value="PHP">Philippine Peso (PHP)</option>
//   <option value="PLN">Polish Złoty (PLN)</option>
//   <option value="GBP">Pound Sterling (GBP)</option>
//   <option value="SGD">Singapore Dollar (SGD)</option>
//   <option value="SEK">Swedish Krona (SEK)</option>
//   <option value="CHF">Swiss Franc (CHF)</option>
//   <option value="THB">Thai Baht (THB)</option>
//   <option value="USD">United States Dollar (USD)</option>
// </select>
//         </Form.Item>

//         <Form.Item
//           name="amount"
//           label="Amount"
//           rules={[{ required: true, message: "Please input Amount" }]}
//         >
//           <Input placeholder="Enter Amount" disabled value={formData.amount} />
//         </Form.Item>

//         <Form.Item
//           name="product_name"
//           label="Product Name"
//           rules={[{ required: true, message: "Please Enter Product Name" }]}
//         >
//           <Input placeholder="Enter Product Name" disabled value={formData.product_name} />
//         </Form.Item>

//         <Form.Item
//           name="quantity"
//           label="Quantity"
//           rules={[{ required: true, message: "Please Enter Quantity" }]}
//         >
//           <Input
//             placeholder="Enter Quantity"
//             disabled
//             value={formData.quantity}
//             onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
//           />
//         </Form.Item>

//         <Row justify="start">
//           <div>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading}
//               onClick={generateLink}
//               disabled={!isFormValid}
//             >
//               Generate Link
//             </Button>
//           </div>
//         </Row>

//         <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
//           <Col xs={24} sm={24} md={24} lg={24}>
//             <Form.Item name="email">
//               <Input placeholder="Enter Email" />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* PayPal Buttons Div */}
//         <div className="d-flex justify-content-center">
//           <div
//             id="paypal-buttons-container"
//             className="col-md-7 form_details d-flex justify-content-center"
//             disabled={!isFormValid} 
//           >
    
//           </div>
//         </div>
//       </Form>
//     </Modal>

//             <div>
//                 <PaymentLinkTable1 />
//             </div>

//             <Modal open={visibleModal} title="Checkout" footer={null} closable onCancel={() => setVisibleModal(false)}>
//                 <Row justify="center">
//                     <Button type="primary" onClick={onOpenCheckoutUrl}>
//                         Open checkout URL
//                     </Button>
//                 </Row>
//                 <Divider>or</Divider>
//                 <Row justify="center">
//                     <img width={200} src={qrImageUrl} alt="QR" />
//                 </Row>
//             </Modal>
//         </div>
//     );
// };

// export default PaymentLinkss;
