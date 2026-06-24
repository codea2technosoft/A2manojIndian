import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Tabs, Form, Upload, Modal, Button, Card, Input } from 'antd';
import { UploadOutlined, BankOutlined } from '@ant-design/icons';
import api from 'utils/api';
import 'assets/styles/orders.scss';
import WalletPendingTransaction from './WalletPendingTransaction';
import WalletSuccessTransaction from './WalletSuccessTransaction';
import WalletFailedTransaction from './WalletFailedTransaction';


function WalletReport() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [isTransferLoading, setIsTransferLoading] = useState(false);
    const [form] = Form.useForm();

    const onChange = (key) => {
        console.log(key);
    };

    const showModalBulk = () => {
        setIsBulkModalOpen(true);
    };

    const showBankModal = () => {
        setIsBankModalOpen(true);
    };
const PayNow = () => {
    window.location.href = "https://dashboard.checkmykyc.com/api/mtmpay-gateway";
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

    const handleBankCancel = () => {
        setIsBankModalOpen(false);
    };

    const handleFileUpload = (file) => {
        console.warn('Uploading file:', file);
        form.setFieldsValue({ topup_file: { file } });

        return false;
    };

    const handleTransfer = async () => {
        try {
            setIsTransferLoading(true);
            const values = await form.validateFields();
            console.log(values);
            const { Bank_Name, mode, rrn_number, amount, topup_file } = values;

            if (!Bank_Name) {
                form.setFields([
                    {
                        name: 'Bank_Name',
                        errors: ['Bank Name is Req...'],
                    },
                ]);
            }

            if (!mode) {
                form.setFields([
                    {
                        name: 'mode',
                        errors: ['mode is Req...'],
                    },
                ]);
            }

            if (!rrn_number) {
                form.setFields([
                    {
                        name: 'rrn_number',
                        errors: ['rrn_number is Req...'],
                    },
                ]);
            }

            if (!amount) {
                form.setFields([
                    {
                        name: 'amount',
                        errors: ['amount is Req...'],
                    },
                ]);
            }

            if (!topup_file || !topup_file.file) {
                form.setFields([
                    {
                        name: 'topup_file',
                        errors: ['Please upload a image'],
                    },
                ]);

                return;
            }
            if (topup_file && topup_file.file) {

                const formData = new FormData();
                formData.append('Bank_Name', Bank_Name);
                formData.append('mode', mode);
                formData.append('rrn_number', rrn_number);
                formData.append('amount', amount);
                formData.append('topup_file', topup_file.file);
                const response = await api.post('/topup-store-dashbooard', formData);
                console.log(response);
                if (response.data.status == true) {
                    Modal.success({
                        title: 'Topup',
                        content: `${response.data.message}`,
                    });
                    setIsBulkModalOpen(false);
                    setTimeout(() => {
                    Modal.destroyAll();
                    window.location.reload();
                  }, 2000);

                } else {
                    Modal.error({
                        title: 'Topup',
                        content: `Payment transfer failed: ${response.data.message}`,
                    });
                    setIsBulkModalOpen(false);
                    setTimeout(() => {
                    Modal.destroyAll();
                    window.location.reload();
                  }, 2000);
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


    const items = [
        {
            key: '1',
            label: 'Pending',
            children: (
                <>
                    <WalletPendingTransaction />
                </>
            ),
        },
        {
            key: '2',
            label: 'Failed',
            children: (
                <>
                    <WalletFailedTransaction />
                </>
            ),
        },
        {
            key: '3',
            label: 'Success',
            children: (
                <>
                    <WalletSuccessTransaction />
                </>
            ),
        },
    ];
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 20,
        },
    };
    return (
        <div className="wrap-orders">
            <Row gutter={[16, 16]}>

                <Col xs={24} md={8} lg={6} xl={5}>
                    <Card className="round_card">
                        <Button type="primary" size="large" onClick={showModalBulk} style={{ width: '100%' }}>
                            Request Topup 
                        </Button> 
                    </Card>
                </Col>

                {/* <Col xs={24} md={8} lg={6} xl={5}>
                    <Card className="round_card">
                        <Button type="primary" size="large" onClick={showBankModal} icon={<BankOutlined />} style={{ width: '100%' }}>
                            Bank Details 
                        </Button> 
                    </Card>
                </Col> */}


                <Col xs={24} md={8} lg={6} xl={5}>
                    <Card className="round_card">
                        <Button type="primary" size="large" onClick={PayNow} style={{ width: '100%' }}>
                          Pay Now
                        </Button> 
                    </Card>
                </Col>

                <Col xs={24}>
                    <Tabs
                        defaultActiveKey="1"
                        items={items}
                        onChange={onChange}
                        indicatorSize={(origin) => origin - 16}
                    />
                </Col>
            </Row>

            {/* Bank Details Modal */}
            <Modal
                open={isBankModalOpen}
                onCancel={handleBankCancel}
                title="Bank Account Details"
                footer={[
                    <Button key="close" onClick={handleBankCancel} type="primary">
                        Close
                    </Button>,
                ]}
                width={500}
            >
                <div style={{ padding: '20px 0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '12px 8px', fontWeight: 'bold', width: '40%' }}>Bank Name :</td>
                                <td style={{ padding: '12px 8px' }}>FEDERAL BANK</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>Account Name :</td>
                                <td style={{ padding: '12px 8px' }}>MTM PAYMENT SERVICES PRIVATE LIMITED</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>Account Number :</td>
                                <td style={{ padding: '12px 8px' }}>14450200010024</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>IFSC Code :</td>
                                <td style={{ padding: '12px 8px' }}>FDRL0001445</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    {/* Copy button for easy copying */}
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Button 
                            onClick={() => {
                                const bankDetails = `Bank Name: FEDERAL BANK\nAccount Name: MTM PAYMENT SERVICES PRIVATE LIMITED\nAccount Number: 14450200010024\nIFSC Code: FDRL0001445`;
                                navigator.clipboard.writeText(bankDetails);
                                Modal.success({
                                    content: 'Bank details copied to clipboard!',
                                    duration: 2
                                });
                            }}
                        >
                            Copy Details
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Topup Request Modal */}
            <Modal
                open={isBulkModalOpen}
                onOk={handleBulkOk}
                onCancel={handleBulkCancel}
                title="Add Topup Amount"
                footer={[
                    <Button key="close" onClick={handleBulkCancel}>
                        Close
                    </Button>,
                    <Button key="transfer" type="primary" onClick={handleTransfer} disabled={isTransferLoading}>
                        Submit
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={[16,16]}>
                    <Col g={12} md={12} sm={24} xs={24}>
                    <Form.Item name="Bank_Name" label="Bank Name"  rules={[{ required: true, message: 'Bank Name is required' }]}>
                        <Input />
                    </Form.Item>
                    </Col>

                    <Col g={12} md={12} sm={24} xs={24}>
                    <Form.Item name="mode" label="Payment Method"  rules={[{ required: true, message: 'Payment Method is required' }]}>
                        <Input />
                    </Form.Item>
                    </Col>

                    <Col g={12} md={12} sm={24} xs={24}>
                    <Form.Item name="rrn_number" label="TRN/RRN Number"  rules={[{ required: true, message: 'TRN/RRN Number is required' }]}>
                        <Input />
                    </Form.Item>
                    </Col>
                    
                    <Col g={12} md={12} sm={24} xs={24}>
                    <Form.Item name="amount" label="Amount"  rules={[{ required: true, message: 'Amount is required' }]}>
                        <Input type="number" />
                    </Form.Item>
                    </Col>
                    </Row>
                    <Form.Item className="mb-0 inputfile_custum"  label="Upload Receipt" name="topup_file" rules={[{ required: true, }]}>
                        <Upload beforeUpload={handleFileUpload} className='uploadfile'>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default WalletReport;