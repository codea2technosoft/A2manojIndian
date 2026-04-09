import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Typography, Collapse } from 'antd';
// request
import { getUsers } from 'requests/user';
import { BaseSelect } from 'components/Elements';

const { Title } = Typography;

const ApiDocs = (props) => {
    const { data, onUpdateData } = props;

    const [usingSingleAccount, setUsingSingleAccount] = useState(false);
    const [subUserOptions, setSubUserOptions] = useState([]);

    const config = useSelector((state) => state.config);

    useEffect(() => {
        getAllUsers();
    }, []);

    const { Panel } = Collapse;
    const getAllUsers = async () => {
        const response = await getUsers({ is_paginate: 0 });
        const options = response.records.map((item) => ({
            label: item.full_name,
            value: item.id,
        }));
        setSubUserOptions(options);
    };
    const text = [
        <>
            <span>
                URL ={' '}
                <a href="https://api.payinfintech.com/api-login-merchant" target="blank">
                    https://api.payinfintech.com/api-login-merchant
                </a>
            </span>
            <p>Method = post</p>
            <table className="api_table">
                <tr>
                    <th>Parameter Key</th>
                    <th>Description</th>
                    <th>Mandatory/Not Mandatory</th>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>example@gmail.com</td>
                    <td>Mandatory</td>
                </tr>
                <tr>
                    <td>Password</td>
                    <td>password@123 </td>
                    <td>Mandatory</td>
                </tr>
            </table>

            <h4 className="mt-16">1.1 Response Status Code:</h4>
            <table className="api_table">
                <tr>
                    <th>Status Code</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>400</td>
                    <td>Validation Error</td>
                </tr>
                <tr>
                    <td>500</td>
                    <td>Invalid Details</td>
                </tr>
                <tr>
                    <td>200</td>
                    <td>Login Successfully</td>
                </tr>
            </table>
        </>,
    ];

    const text2 = [
        <>
            <span>
                URL ={' '}
                <a href="https://api.payinfintech.com/partner/payout" target="blank">
                    https://api.payinfintech.com/partner/payout
                </a>
            </span>
            <p>Method = post</p>
            <p>The bearer token passes in authorization and the bearer token takes authentication API</p>
            <h4>2.1 Request Body Parameters:</h4>
            <table className="api_table">
                <tr>
                    <th>Parameter Key</th>
                    <th>Description</th>
                    <th>Mandatory/Not Mandatory</th>
                </tr>
                <tr>
                    <td>Amount</td>
                    <td>Amount (Must be numeric value) </td>
                    <td>Mandatory</td>
                </tr>
                <tr>
                    <td>AccountNumber</td>
                    <td>Account Number (Must be numeric value)</td>
                    <td>Mandatory</td>
                </tr>
                {/* <tr>
                    <td>BenificalName</td>
                    <td>Benifical Name (Must be String value)</td>
                    <td>Mandatory</td>
                </tr> */}
                <tr>
                    <td>Bank</td>
                    <td>Bank Name</td>
                    <td>Mandatory</td>
                </tr>
                <tr>
                    <td>IFSC</td>
                    <td>IFSC Code</td>
                    <td>Mandatory</td>
                </tr>
                <tr>
                    <td>Mode</td>
                    <td>IMPS/NEFT</td>
                    <td>Mandatory</td>
                </tr>
                <tr>
                    <td>OrderId</td>
                    <td>Maximum Length: 16</td>
                    <td>Mandatory</td>
                </tr>
                <tr>
                    <td>Mobile</td>
                    <td>Must be numeric value</td>
                    <td>Mandatory</td>
                </tr>
            </table>

            <h4 className="mt-16">2.2 Response Status Code:</h4>
            <table className="api_table">
                <tr>
                    <th>Status Code</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>101</td>
                    <td>Validation</td>
                </tr>
                <tr>
                    <td>102</td>
                    <td>Authenticate</td>
                </tr>
                <tr>
                    <td>103</td>
                    <td>Insufficient Balance</td>
                </tr>
                <tr>
                    <td>104</td>
                    <td>Withdraw Limit Issue</td>
                </tr>
                <tr>
                    <td>105</td>
                    <td>Service Inactive</td>
                </tr>
                <tr>
                    <td>106</td>
                    <td>Success</td>
                </tr>
                <tr>
                    <td>107</td>
                    <td>Initiated</td>
                </tr>
                <tr>
                    <td>108</td>
                    <td>Pending</td>
                </tr>
                <tr>
                    <td>109</td>
                    <td>In Progress</td>
                </tr>
                <tr>
                    <td>110</td>
                    <td>Failed</td>
                </tr>
                <tr>
                    <td>111</td>
                    <td>Request Time Limit</td>
                </tr>
            </table>
        </>,
    ];

    const text3 = [
        <>
            <span>
                URL ={' '}
                <a href="https://api.payinfintech.com/webhook/payout/checkstatus" target="blank">
                    https://api.payinfintech.com/webhook/payout/checkstatus
                </a>
            </span>
            <p>Method = post</p>
            <p>Parameter = orderid // orderid pass in formdata and orderid given in payout order create return</p>
            <table className="api_table">
                <tr>
                    <th>Parameter</th>
                    <th>Description</th>
                    <th>Mandatory/Not Mandatory</th>
                </tr>
                <tr>
                    <td>OrderId</td>
                    <td>OrderId is given to create an order response</td>
                    <td>Mandatory</td>
                </tr>
            </table>

            <h4 className="mt-16">3.1 Transaction Status Response Code:</h4>
            <table className="api_table">
                <tr>
                    <th>Status Code</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>101</td>
                    <td>Success</td>
                </tr>
                <tr>
                    <td>102</td>
                    <td>In Progress</td>
                </tr>
                <tr>
                    <td>103</td>
                    <td>Failed</td>
                </tr>
                <tr>
                    <td>104</td>
                    <td>Bank Server Down</td>
                </tr>
                <tr>
                    <td>105</td>
                    <td>Pending</td>
                </tr>
                <tr>
                    <td>106</td>
                    <td>OrderId does not Exist</td>
                </tr>
                <tr>
                    <td>107</td>
                    <td>Validation</td>
                </tr>
            </table>
        </>,
    ];

    const text4 = [
        <>
            <span>
                URL ={' '}
                <a href="https://api.payinfintech.com/merchant-login" target="blank">
                    https://api.payinfintech.com/merchant-login
                </a>
            </span>
            <p>Method = post</p>
            <table className="api_table">
                <tr>
                    <th>Parameter Key</th>
                    <th>Description</th>
                    <th>Mandatory/Not Mandatory</th>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>test@gmail.com</td>
                    <td>Mandatory</td>
                </tr>
                <tr>
                    <td>Password</td>
                    <td>123456</td>
                    <td>Mandatory</td>
                </tr>
            </table>

            <h4 className="mt-16">1.1 Response Status Code:</h4>
            <table className="api_table">
                <tr>
                    <th>Status Code</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>400</td>
                    <td>Validation Error</td>
                </tr>
                <tr>
                    <td>500</td>
                    <td>Invalid Details</td>
                </tr>
                <tr>
                    <td>200</td>
                    <td>Login Successfully</td>
                </tr>
            </table>
        </>,
    ];

    const text5 = [
        <>
            <span>
                URL ={' '}
                <a href="https://api.payinfintech.com/do-payment" target="blank">
                    https://api.payinfintech.com/do-payment
                </a>
            </span>
            <p>Method = post</p>
            <p>The bearer token passes in authorization and the bearer token takes authentication API</p>
            <h4>2.1 Request Body Parameters:</h4>
            <table className="api_table">
                <tr>
                    <th>Parameter Key</th>
                    <th>Description</th>
                    <th>Mandatory/Not Mandatory</th>
                </tr>
                <tr>
                    <td>Amount</td>
                    <td>Amount (Must be numeric value) </td>
                    <td>Mandatory</td>
                </tr>

                <tr>
                    <td>Name</td>
                    <td>Name (Must be String)</td>
                    <td>Mandatory</td>
                </tr>

                <tr>
                    <td>Mobile</td>
                    <td>Must be numeric value</td>
                    <td>Mandatory</td>
                </tr>

                <tr>
                    <td>OrderId</td>
                    <td>Maximum Length: 16</td>
                    <td>Mandatory</td>
                </tr>
            </table>

            <h4 className="mt-16">2.2 Response Status Code:</h4>
            <table className="api_table">
                <tr>
                    <th>Status Code</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>101</td>
                    <td>Validation</td>
                </tr>
                <tr>
                    <td>102</td>
                    <td>Authenticate</td>
                </tr>
                <tr>
                    <td>103</td>
                    <td>Insufficient Balance</td>
                </tr>
                <tr>
                    <td>104</td>
                    <td>Withdraw Limit Issue</td>
                </tr>
                <tr>
                    <td>105</td>
                    <td>Service Inactive</td>
                </tr>
                <tr>
                    <td>106</td>
                    <td>Success</td>
                </tr>
                <tr>
                    <td>107</td>
                    <td>Initiated</td>
                </tr>
                <tr>
                    <td>108</td>
                    <td>Pending</td>
                </tr>

                 <tr>
                    <td>109</td>
                    <td>In Progress</td>
                </tr>

                 <tr>
                    <td>110</td>
                    <td>Failed</td>
                </tr>

                 <tr>
                    <td>111</td>
                    <td>Request Time Limit</td>
                </tr>

                 
            </table>
        </>,
    ];

    const text6 = [
        <>
            <span>
                URL ={' '}
                <a href="https://api.payinfintech.com/webhook/payment/ChkOrderStatus/d32432fddfdf4fdrt3" target="blank">
                    https://api.payinfintech.com/webhook/payment/ChkOrderStatus
                </a>
            </span>
            <p>Method = post</p>
            <p>Parameter = orderid // orderid pass in url and orderid given in payin order create return</p>
             <table className="api_table">
                <tr>
                    <th>Parameter</th>
                    <th>Description</th>
                    <th>Mandatory/Not Mandatory</th>
                </tr>
                <tr>
                    <td>OrderId</td>
                    <td>OrderId is given to create an order response</td>
                    <td>Mandatory</td>
                </tr>
            </table> 

            <h4 className="mt-16">3.1 Transaction Status Response Code :</h4>
            <table className="api_table">
                <tr>
                    <th>Status Code</th>
                    <th>Message</th>
                </tr>
                <tr>
                    <td>101</td>
                    <td>Please Login</td>
                </tr>
                <tr>
                    <td>102</td>
                    <td>Validation Error</td>
                </tr>
                <tr>
                    <td>103</td>
                    <td>Order Id Already Exist!</td>
                </tr>
                <tr>
                    <td>104</td>
                    <td>please Whitelist Your Server IP!</td>
                </tr>

                 <tr>
                    <td>105</td>
                    <td>Service Deactive</td>
                </tr>

                 <tr>
                    <td>106</td>
                    <td>Success</td>
                </tr>
            </table>
        </>,
    ];

    return (
        <>
            <div>
                <Card>
                    <Row gutter={[16, 8]} align={'middle'}>
                        <Col xs={24} md={24}>
                            <Title level={5}>Developer / API Document Paypout</Title>
                        </Col>
                        <Col xs={24} md={24}>
                            <Collapse accordion className="api_docs">
                                <Panel header="1. Authentication API" key="1">
                                    {text}
                                </Panel>
                                <Panel header="2. Transfer of Amount/Funds API" key="2">
                                    {text2}
                                </Panel>
                                <Panel header="3. Transaction Status Enquiry API" key="3">
                                    {text3}
                                </Panel>
                            </Collapse>
                        </Col>
                    </Row>
                </Card>
            </div>

            <div>
                <Card>
                    <Row gutter={[16, 8]} align={'middle'}>
                        <Col xs={24} md={24}>
                            <Title level={5}>Developer / API Document Payin</Title>
                        </Col>
                        <Col xs={24} md={24}>
                            <Collapse accordion className="api_docs">
                                <Panel header="1. Authentication API" key="4">
                                    {text4}
                                </Panel>
                                <Panel header="2. Transfer of Amount/Funds API" key="5">
                                    {text5}
                                </Panel>
                                <Panel header="3. Transaction Status Enquiry API" key="6">
                                    {text6}
                                </Panel>
                            </Collapse>
                        </Col>
                    </Row>
                </Card>
            </div>
        </>
    );
};

export default ApiDocs;
