import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Card, Modal, Form, Upload, DatePicker, Table} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from 'utils/api';
import Papa from 'papaparse';
import walletIcon from 'assets/images/Wallet 1.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { getBanklist, payoutPayouttransferList, exportOrders } from 'requests/order';

const { RangePicker } = DatePicker;

function PayinTopup() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isTransferLoading, setIsTransferLoading] = useState(false);
    const [form] = Form.useForm();
    const [dates, setDates] = useState([dayjs(), dayjs()]);
    const [filter, setFilter] = useState(null);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const onSetDatesByDatePicker = (dates) => {
        setDates(dates);
    };


    const showModalBulk = () => {
        setIsBulkModalOpen(true);
    };

    const handleBulkOk = () => {
        setIsModalOpen(false);
    };

    const handleOk = () => {
        setIsBulkModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleBulkCancel = () => {
        setIsBulkModalOpen(false);
    };

    const handleFileUpload = (file) => {
        console.warn('Uploading file:', file);
        form.setFieldsValue({ csv_file: { file } });

        return false;
    };

    const handleTransfer = async () => {
        try {
            setIsTransferLoading(true);
            const values = await form.validateFields();
            const { csv_file } = values;
    
            if (!csv_file || !csv_file.file) {
                form.setFields([
                    {
                        name: 'csv_file',
                        errors: ['Please upload a file'],
                    },
                ]);
    
                return;
            }

            if (csv_file && csv_file.file) {
                
                const formData = new FormData();
                formData.append('csv_file', csv_file.file);

                const response = await api.post('/Payment-transfer-payout-bank-bulk', formData);

                if (response.data.status === 'true') {
                    Modal.success({
                        title: 'Payment Transfer Successful',
                        content: `${response.data.message}`,
                        onOk: () => {
                            setIsModalOpen(false);
                        },
                    });
                } else {
                    Modal.error({
                        title: 'Payment Transfer Failed',
                        content: `Payment transfer failed: ${response.data.message}`,
                        onOk: () => {
                            setIsModalOpen(false);
                        },
                    });
                }
            } else {
                console.error('csv_file or csv_file.file is undefined');
            }
        } catch (errorInfo) {
            console.error('Error in handleTransfer:', errorInfo);
        } finally {
            setIsTransferLoading(false);
        }
    };

    const location = useLocation();
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [isShowFilter, setIsShowFilter] = useState(false);


    useEffect(() => {
        const query = parseQueryParams(location);
        setFilter(query);
        getRecords();
    }, [location]);


    const getRecords = async (query) => {
        try {
            setIsTableLoading(true);
            const response = await payoutPayouttransferList(query);
            setRecords(response.data);
            setPage(response.page);
            setPerPage(response.per_page);
            setTotalCount(response.total_records);
        } catch (err) {
            console.log(err);
        } finally {
            setIsTableLoading(false);
        }
    };


    let color = {
        pending: "#ffa940",
        success: "green",
        faild: "red",
        inprocess: "#ffa940",
        reversed: "blue",
        6: "blue",
        7: "red",
        8: "green",
      };
    

    const columns = [
        {
            title: 'Created At',
            key: 'accountnumber',
            render: (text, record) => (
                <div>
                    <div>{record.id}<br/></div>
                    <div>{new Date(record.created_at).toLocaleDateString()}</div>
                    <div>{new Date(record.created_at).toLocaleTimeString()}</div>
                    <div>{record.transaction ? record.transaction.data.utr : null}</div>
    
                </div>
            )
        },
        // {
        //     title: 'Bank Details',
        //     key: 'bankDetails',
        //     render: (text, record) => (
        //         <div>
        //         Account: {record.accountnumber}
        //         <br></br>
        //         Bank: {record.bankname}
        //         <br></br>
        //         IFSC: {record.Ifsc}
        //         <br></br>
        //         Mode: {record.mode}
    
        //         </div>
        //     )
           
        // },
        {
            title: 'Transaction Details',
            key: 'transactionDetails',
            render: (text, record) => (
                <div>Order ID: {record.orderid}<br></br>Txn ID: {record.tid}</div>
            )
    
        },
        {
            title: 'Amount',
            key: 'amount',
            render: (text, record) => (
                <div>
                Total: {record.amount}
                <br></br>
                Settled Amt: {record.subtotal}
                <br></br>
                Fees Amt: {record.fees}
                <br></br>
                GST Amt: {record.gst}
    
                </div>
            )
           
            
        },
        {
            title: 'Status',
            key: 'Status',
            render: (text, record) => (
                <div style={{ color: color[record.status] }}>
                {record.status === 'pending' ? 'initiated' : record.status.toUpperCase()}
                {record.status === 'pending' || record.status === 'inprocess' ? (
                  <div>
                    <p
                      id={`cchkstttu_${record.orderid}`}
                      onClick={() => chhkstatus(record.orderid)}
                      style={{
                        padding: '5px 10px',
                        cursor: 'pointer',
                        backgroundColor: '#0dcaf0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                      }}>
                      Check Status
                    </p>
                    <img
                      id={`cchkstttu11_${record.orderid}`}
                      // src={dancingloader}
                      style={{
                        display: 'none',
                        height: '10px',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        WebkitTransform: 'scale(1.9)',
                        transform: 'scale(1.9)',
                        width: '100%',
                      }}
                    />
                  </div>
                ) : (
                  <p></p>
                )}
              </div>
            )
            
            
        },
    ];





    const chhkstatus = async (orderId) => {
        alert(orderId);
        const statusElement = document.getElementById(`cchkstttu_${orderId}`);
        const loaderElement = document.getElementById(`cchkstttu11_${orderId}`);
    
        if (statusElement && loaderElement) {
          statusElement.style.display = 'none';
          loaderElement.style.display = 'block';
    
          try {
            const response = await api.post(
              process.env.REACT_APP_API_URL +
                'webhook/payment/payout/ChkOrderStatus',
              {
                orderid: orderId,
              },
              
            );
    
            statusElement.style.display = 'block';
            loaderElement.style.display = 'none';
            
          } catch (error) {
            console.error('Error fetching data:', error);
            statusElement.style.display = 'block';
            loaderElement.style.display = 'none';
          }
        }
      };





    return (
        <div className="wrap-orders">
            <Row gutter={[8, 8]} align="middle" justify={{ md: 'center', lg: 'space-between' }}>
           

                <Col xs={24} md={8} lg={6} xl={5}>
                    <Card className="round_card">
                        <Button type="primary" size="large" onClick={showModalBulk}>
                            Upload Top Up
                        </Button>
                    </Card>
                </Col>
            </Row>

            <Table columns={columns} dataSource={records} className="mt-16" />

            <Modal
                open={isBulkModalOpen}
                onOk={handleBulkOk}
                onCancel={handleBulkCancel}
                title="Transfer Amount"
                footer={[
                    <Button key="close" onClick={handleBulkCancel}>
                        Close
                    </Button>,
                    <Button key="transfer" type="primary" onClick={handleTransfer} disabled={isTransferLoading}>
                        Upload
                    </Button>,
                ]}
            >
                <Form form={form}>
                    <Form.Item>
                        <Row align={'middle'}>
                            <label>Download "Bulk Transfer" Demo excel file</label>
                            <Button type="primary" className="ml-8">
                                Click here
                            </Button>
                        </Row>
                    </Form.Item>
                    <Form.Item className="mb-0" name="csv_file">
                        <label>Upload File:</label>
                        <Upload beforeUpload={handleFileUpload}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default PayinTopup;
