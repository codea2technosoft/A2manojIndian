import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import { Dropdown, Typography, Layout, Button, Modal, Row, Col, Space } from 'antd';

import { DownOutlined, UserOutlined, IdcardOutlined } from '@ant-design/icons';
// requests
import { logoutAction as logout } from 'redux/actions/auth';
import api from 'utils/api';

const { Header } = Layout;
const { confirm } = Modal;


const AppHeader = () => {
    const { Title } = Typography;
    const [TotalAmts, TotalAmt_show] = useState('');
    const [TotaltransactionAmts, TotalAmttransaction_show] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [permissionBank, setPermissionBank] = useState(false);
    const [permissionPayout, setPermissionPayout] = useState(false);

    const onLogout = () => {
        confirm({
            title: 'Are you sure you want to logout?',
            onOk: () => {
                dispatch(logout());
                navigate('/signin');
            },
        });
    };

    useEffect(() => {
        fetchUserAmount();
    }, []);

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

    const [isAddBankVisible, setIsAddBankVisible] = useState(false);
    const [isTransferAmountVisible, setIsTransferAmountVisible] = useState(false);

    const fetchUserAmount = async () => {
        try {
            const response = await api.get('/get-user');
            const TotalAmt = response.data.data.payin_amount_settlement;
            const TotalAmttransaction = response.data.chargebackAmount;
            const payoutTransferBank = response.data.data.payout_transfer_bank;
            const payoutTransferPayout = response.data.data.payout_transfer_payout;
            // TotalAmt_show(TotalAmt);
            TotalAmt_show(TotalAmt.toFixed(2));

            TotalAmttransaction_show(TotalAmttransaction);
            setPermissionBank(payoutTransferBank === 'yes');
            setPermissionPayout(payoutTransferPayout === 'yes');
        } catch (error) {
            console.error('Error fetching user amount:', error);
        }
    };
    const handleMenuClick = (e) => {
        console.log('click', e);
    };

    const handleMenuClickprofile = (e) => {
        if (e.key === '2') {
            navigate('/profile');
        } else {
            console.log('click', e);
        }
    };

    const handleMenuClickchangepassword = (e) => {
        if (e.key === '1') {
            navigate('/change-password');
        } else {
            console.log('click', e);
        }
    };


    const items = [
      
        {
            label: 'Profile',
            key: '2',
            className:'headerDrop',
            icon: <UserOutlined />,
            onClick: handleMenuClickprofile,
        },

        {   
            label: 'Change Password',
            className:'headerDrop',
            key: '1',
            onClick: handleMenuClickchangepassword,
            
        },
       
        // {
        //     label: 'Logout',
        //     key: '3',
        //     icon: <LogoutIcon set="light" />,
        //     danger: true,
        //     onClick: onLogout,
        // },
    ];


    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    return (
        <Header className="app-header">
            <Row justify={'space-between'} align={'middle'}>
                <Col xs={12} md={12}>
                    <Title level={2} className='mb-0'>Dashboard</Title>
                     {/* <img src={wallet} alt='wallet' className='wallet'/> */}
                </Col>
                <Col xs={12} md={12}>
                    <div className='logout_right'>
                    <Dropdown menu={menuProps}>
                        <Button className="user">
                            <Space>
                                <UserOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                    </div>
                </Col>
            </Row>
        </Header>
    );
};

export default AppHeader;
