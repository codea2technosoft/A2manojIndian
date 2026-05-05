import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Modal, Switch, Form, Input, Row, Col, Space, Select, DatePicker, message, Card } from 'antd';
import TableBar from 'components/TableBar';
import api from 'utils/api';
import dayjs from 'dayjs';
import PageTitle from 'components/PageTitle';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import TransfarPaymentbankList from './TransfarPaymentList ';
import { CiWallet } from 'react-icons/ci';
import { FaCheckCircle } from 'react-icons/fa';
import FileSearch from 'components/FileSearch';
// import blackLogoIcon from 'assets/images/step2pay.gif';
const { RangePicker } = DatePicker;

const TransfarbankList = () => {
    const [isAddBankVisible, setIsAddBankVisible] = useState(false);
    const [isTransferAmountVisible, setIsTransferAmountVisible] = useState(false);
    const [beneficiaryName, setBeneficiaryName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankList, setBankList] = useState([]);
    const [setBankNameListconst, setBankNameList] = useState([]);
    const [selectedBank, setSelectedBank] = useState('Please Select Bank');
    const [validationErrors, setValidationErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [amount, setAmount] = useState('');
    const [bankid, setBankid] = useState('');
    const [totalAmount, setTotelAmt] = useState(0);
    const [created_at_date_min, setcreated_at_date_min] = useState('');
    const [created_at_date_max, setcreated_at_date_max] = useState('');
    const [keyword, setkeyword] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const titles = [{ title: 'Transfer to Bank' }];
    const [isShowFilter, setIsShowFilter] = useState(false);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(3);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const columns = [
        {
            title: 'Account Number',
            key: 'account_number',
            dataIndex: 'account_number',
        },

        {
            title: 'Benefically Name',
            key: 'bank_name',
            dataIndex: 'name',
        },

        {
            title: 'IFSC',
            key: 'ifsc_code',
            dataIndex: 'ifsc_code',
        },

        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
        },
        {
            title: 'Created at',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (text, record) => {
                const date = new Date(text);
                const formattedDate = date.toLocaleDateString();
                const formattedTime = date.toLocaleTimeString();

                return (
                    <div>
                        <div>{formattedDate}</div>
                        <div>{formattedTime}</div>
                    </div>
                );
            },
        },
    ];
    const shoot = (a) => {
        document.getElementById('cchkstttu').style.display = 'none';
        document.getElementById('cchkstttu11').style.display = 'block';
        const response = api
            .post('/webhook/payment/payout/ChkOrderStatus', {
                orderid: a,
            })
            .then((response) => {
                document.getElementById('cchkstttu').style.display = 'block';
                document.getElementById('cchkstttu11').style.display = 'none';
                window.location.reload();
            });
    };

    const onSearch = (keyword) => {
        let query = parseQueryParams(location);
        query = {
            ...query,
            page: 1,
            keyword: keyword,
        };

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    };
    const showAddBankPopup = () => {
        setIsAddBankVisible(true);
    };

    const hideAddBankPopup = () => {
        setIsAddBankVisible(false);
    };

    const showTransferAmountPopup = () => {
        setIsTransferAmountVisible(true);
    };

    const hideTransferAmountPopup = () => {
        setIsTransferAmountVisible(false);
    };

    const onToggleFilter = () => {
        setIsShowFilter(!isShowFilter);
    };
    const handleTransferAmountSubmit = async () => {
        if (isLoading || isButtonDisabled) {
            return;
        }
        setIsLoading(true);
        setIsButtonDisabled(true);

        try {
            setIsLoading(true);
            setValidationErrors({});
            const errors = {};
            if (!amount) {
                errors.amount = 'amount is required';
            }

            if (!/^[+]?\d+(\.\d+)?$/.test(amount) || parseFloat(amount) <= 0) {
                message.success({
                    content: 'Invalid Transfer Amount ',
                    duration: 2,
                    className: 'custom-success-message succesful',
                });
                return;
            }

            if (!paymentMode) {
                errors.paymentMode = 'paymentMode required';
            }
        
            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
                setIsLoading(false);
                setIsButtonDisabled(false);
                return;
            }

            const response = await api.post('/Payment-transfer-payin-bank', {
                amount: amount,
                mode: paymentMode,
                bank_id: selectedBank,
                portal: 'payin',
            });

            console.warn('Add Bank API Response:', response.data.status);
            if (response.data.status == true) {
                message.success({
                    content: response.data.message,
                    duration: 2,
                    className: 'custom-success-message succesful',
                });
                
                setAmount('');
                setPaymentMode('');
                setSuccessMessage('Bank added successfully!');
                setTimeout(() => {
                    hideAddBankPopup();
                    message.success({
                        content: 'Transfer successful!',
                        duration: 2,
                        className: 'custom-success-message succesful',
                    });
                    window.location.reload();
                }, 3000);
            } else {
                setIsLoading(true);
                message.error({
                    content: response.data.message,
                    duration: 2,
                    className: 'custom-success-message succesful',
                });
               
                setAmount('');
                setPaymentMode('');
                
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error adding bank:', error);
            
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddBankSubmit = async () => {
        try {
            setValidationErrors({});
            const errors = {};
            if (!beneficiaryName) {
                errors.beneficiaryName = 'Beneficiary name is required';
            }
            if (!accountNumber) {
                errors.accountNumber = 'Account number is required';
            } else if (!/^\d+$/.test(accountNumber)) {
                errors.accountNumber = 'Account number must contain only numbers';
            }
            if (!ifscCode) {
                errors.ifscCode = 'IFSC code is required';
            }
            if (!bankName) {
                errors.bankName = 'Bank name is required';
            }

            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
                return;
            }

            if (
                beneficiaryName === null ||
                accountNumber === null ||
                ifscCode === null ||
                bankName === null ||
                beneficiaryName === undefined ||
                accountNumber === undefined ||
                ifscCode === undefined ||
                bankName === undefined
            ) {
                return;
            }

            const response = await api.post('/Payment-tranfer-bank-add', {
                name: beneficiaryName,
                account_number: accountNumber,
                ifsc_code: ifscCode,
                bank_name: bankName,
            });

            console.log('Add Bank API Response:', response);

            // Reset the state variables and show success message
            setBeneficiaryName('');
            setAccountNumber('');
            setIfscCode('');
            setBankName('');
            message.success({
                content: 'Add Bank Successfully',
                duration: 2,
                className: 'custom-success-message',
            });
            setTimeout(() => {
                hideAddBankPopup();
            }, 2000);
        } catch (error) {
            console.error('Error adding bank:', error);
            // Handle error (e.g., display error message)
        }
    };

    const handleBeneficiaryNameChange = (e) => {
        setBeneficiaryName(e.target.value);
    };
    const setSelectedBankset = (e) => {
        setSelectedBank(e);
    };

    const handleAccountNumberChange = (e) => {
        setAccountNumber(e.target.value);
    };

    const handleIfscCodeChange = (e) => {
        setIfscCode(e.target.value);
    };

    const handleBankNameChange = (e) => {
        setBankName(e.target.value);
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handlePaymentChange = (value) => {
        setPaymentMode(value);
    };

    const fetchManagerList = async (keyword, created_at_date_min, created_at_date_max, page, per_page) => {
        setIsTableLoading(true);
        try {
            console.warn(keyword + 'keyword');
            const response = await api.get(`/Payment-tranfer-bank-list`);
            const data = response.data;

            const filteredRecords = keyword
                ? data.data.filter(
                      (record) =>
                          record.bankName.toLowerCase().includes(keyword.toLowerCase()) ||
                          record.ifscCode.toLowerCase().includes(keyword.toLowerCase()) ||
                          record.accountNumber.toLowerCase().includes(keyword.toLowerCase()),
                  )
                : data.data;
            console.log(response.data);
            const totalAmount = response.data.transferToBankAmt;
            setTotelAmt(totalAmount);
            setRecords(data.data);
            setBankNameList(data.bank_detail_success);
            setPage(response.data.page);
            setPerPage(response.data.per_page);
            setTotalCount(response.data.total_records);
            console.warn(response.data.total_records);
        } catch (error) {
            console.error('Error fetching TransfarList:', error);
        }
        setIsTableLoading(false);
    };

    useEffect(() => {
        fetchManagerList();
    }, []);

    const onChangeTable = (pagination) => {
        setPage(pagination.current);
        setPerPage(pagination.pageSize);
        fetchManagerList(pagination.current, pagination.pageSize);
    };

    return (
        <div className="transfer bank">
            <div className="topbox-shadow">
                <Row gutter={[16, 8]} justify={{ md: 'center', lg: 'space-between' }}>
                    {/* <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                        <PageTitle titles={titles} className="mb-0" />
                    </Col> */}
                    <Col xs={24} sm={24} md={12} lg={7} xl={6}>
                        <Card className="round_card">
                            <div className="statistic-card--purple d-flex red-border totaltransfer">
                                {/* <h4>Total Transfer Bank</h4> */}
                                <div
                                    className="walletdesign"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <CiWallet className="titlewallet" />
                                    <span className="ml-8">{totalAmount}</span>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                        <Card className="round_card">
                            <TableBar
                                placeholderInput="Order ID/Customer details/tax invoice/item details"
                                onSearch={onSearch}
                                onFilter={onToggleFilter}
                                isActiveFilter={isShowFilter}
                                inputRef={searchRef}
                                showFilter={false}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={10} xl={8}>
                        <Card className="round_card">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                    <Button onClick={showAddBankPopup} className="ant-btn-primary">
                                        Add Bank
                                    </Button>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                    <Button onClick={showTransferAmountPopup} className="ant-btn-primary">
                                        Transfer Amount
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
            <Modal
                title="Add Bank"
                visible={isAddBankVisible}
                onCancel={hideAddBankPopup}
                footer={[
                    <Button key="close" onClick={hideAddBankPopup}>
                        Close
                    </Button>,
                    <Button key="add" type="primary" onClick={handleAddBankSubmit}>
                        Add Bank
                    </Button>,
                ]}
            >
                <div>
                    <label>Beneficiary Name:</label>
                    <input type="text" value={beneficiaryName} onChange={handleBeneficiaryNameChange} />
                    {validationErrors.beneficiaryName && (
                        <p style={{ color: 'red' }}>{validationErrors.beneficiaryName}</p>
                    )}

                    <label>Account Number:</label>
                    <input type="number" value={accountNumber} onChange={handleAccountNumberChange} />
                    {validationErrors.accountNumber && <p style={{ color: 'red' }}>{validationErrors.accountNumber}</p>}

                    <label>Account IFSC Code:</label>
                    <input type="text" value={ifscCode} onChange={handleIfscCodeChange} />
                    {validationErrors.ifscCode && <p style={{ color: 'red' }}>{validationErrors.ifscCode}</p>}

                    <label>Bank Name:</label>
                    <input type="text" value={bankName} onChange={handleBankNameChange} />
                    {validationErrors.bankName && <p style={{ color: 'red' }}>{validationErrors.bankName}</p>}
                </div>
            </Modal>
            <Modal
                title="Transfer Amount"
                visible={isTransferAmountVisible}
                onCancel={hideTransferAmountPopup}
                footer={[
                    <Button key="close" onClick={hideTransferAmountPopup}>
                        Close
                    </Button>,
                    <Button
                        key="transfer"
                        type="primary"
                        onClick={handleTransferAmountSubmit}
                        loading={isLoading}
                        disabled={isButtonDisabled}
                    >
                        {' '}
                        Transfer{' '}
                    </Button>,
                ]}
            >
                <Form>
                    <Form.Item>
                        <label>Bank Account:</label>
                        <Select
                            placeholder="Please Select Bank"
                            value={selectedBank}
                            onChange={(value) => setSelectedBankset(value)}
                            style={{ width: '100%' }}
                        >
                            {setBankNameListconst.map((bankss) => (
                                <Select.Option key={bankss.bank} value={bankss.id}>
                                    {bankss.name}({bankss.bank_name})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <label>Payment Mode:</label>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Please Select Payment Mode"
                            value={paymentMode}
                            onChange={handlePaymentChange}
                        >
                            <Select.Option value="">Please Select Payment Mode</Select.Option>
                            <Select.Option value="NEFT">NEFT</Select.Option>
                            <Select.Option value="IMPS">IMPS</Select.Option>
                            <Select.Option value="RTGS">RTGS</Select.Option>
                        </Select>
                        {validationErrors.paymentMode && (
                            <div style={{ color: 'red' }}>{validationErrors.paymentMode}</div>
                        )}
                    </Form.Item>

                    <Form.Item>
                        <label>Amount:</label>
                        <Input
                            placeholder="Enter your Amount"
                            style={{ width: '100%' }}
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                        />
                        {validationErrors.amount && <div style={{ color: 'red' }}>{validationErrors.amount}</div>}
                    </Form.Item>
                </Form>
            </Modal>

            {/* <div>
                <TransfarPaymentbankList />
            </div> */}

            <Table
                loading={isTableLoading}
                dataSource={records}
                columns={columns}
                onChange={onChangeTable}
                rowKey={'id'}
                pagination={{
                    pageSize: perPage,
                    total: totalCount,
                    current: page,
                }}
                scroll={{
                    x: true,
                }}
            />
        </div>
    );
};
export default TransfarbankList;
