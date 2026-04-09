import React, { useState, useEffect } from 'react';
import { Layout, Menu, Modal } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAction as logout } from 'redux/actions/auth';
// images
import { FaMoneyBillTransfer } from "react-icons/fa6";

import logo from 'assets/images/logo.png';
import logoIcon from 'assets/images/favicon.png';
import api from 'utils/api';
// icons
import { ArrowRight, Logout as LogoutIcon } from 'react-iconly';
import { HiMenuAlt2 } from 'react-icons/hi';
import pgWhite from '../../assets/images/payoutWhite/payment gateway  wh.png';
import payinpaymentgateway from '../../assets/images/payout/payinpaymentgateway.png';
import payoutIcon from '../../assets/images/payout/PAYOUTIC.png';
import payoutIconWh from '../../assets/images/payoutWhite/PAYOUTICWhite.png';
import AddBeneficary from '../../assets/images/payout/AddBeneficary.png';
import payoutoverviewicon from '../../assets/images/payout/payoutoverviewicon.png';
import fundtransfer from '../../assets/images/payout/fundtransfer.png';
import payoutreport from '../../assets/images/payout/payoutreport.png';
import setting from '../../assets/images/payout/setting.png';
import payoutusers from '../../assets/images/payout/payoutusers.png';
import overviewPayoutWhite from '../../assets/images/payoutWhite/overviewPayoutWhite.png';
import fundtransferWhite from '../../assets/images/payoutWhite/fundtransferWhite.png';
import AddBeneficaryWhite from '../../assets/images/payoutWhite/AddBeneficaryWhite.png';
import reportPayoutWhite from '../../assets/images/payoutWhite/reportPayoutWhite.png';
import settingpayoutWhite from '../../assets/images/payoutWhite/settingpayoutWhite.png';
import user_white from '../../assets/images/payoutWhite/user_white.png';
import money from '../../assets/images/payout/money.png';
import newLEDGER from 'assets/images/LEDGER.png';
import LEDGERWhite from 'assets/images/payoutWhite/LEDGERWhite.png';
const url = new URL(window.location.href);
const user_id = url.searchParams.get('user_id');
const { Sider } = Layout;
const { confirm } = Modal;

const menu = [
    {
        title: 'PG - Payin',
        key: 'payin',
        icon: [
            <img
                src={payinpaymentgateway}
                alt="Overview"
                width={24}
                height={24}
                className="normalWhite ant-menu-item-icon"
            />,
            <img src={pgWhite} alt="Overview" width={24} height={24} className="activeWhite ant-menu-item-icon" />,
        ],
        children: [
            {
                title: 'Dashboard',
                icon: [
                    <img
                        src={payoutoverviewicon}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="normalWhite ant-menu-item-icon"
                    />,
                    <img
                        src={overviewPayoutWhite}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="activeWhite ant-menu-item-icon"
                    />,
                ],
                key: 'payindashboard',
                path: '/payin-dashboard',
            },
            {
                title: 'Payment Link',
                icon: [
                    <img
                        src={fundtransfer}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="normalWhite ant-menu-item-icon"
                    />,
                    <img
                        src={fundtransferWhite}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="activeWhite ant-menu-item-icon"
                    />,
                ],
                key: 'payinlink',
                path: '/payment-links',
            },

            {
                title: 'Transaction',
                icon: [
                    <img
                        src={AddBeneficary}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="normalWhite ant-menu-item-icon"
                    />,
                    <img
                        src={AddBeneficaryWhite}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="activeWhite ant-menu-item-icon"
                    />,
                ],
                key: 'Transaction',
                path: '/transcation',
            },



            {
                title: 'Pay In To Payout',
                icon: [
                    <img
                        src={AddBeneficary}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="normalWhite ant-menu-item-icon"
                    />,
                    <img
                        src={AddBeneficaryWhite}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="activeWhite ant-menu-item-icon"
                    />,
                ],
                key: 'Pay In To Payout',
                path: '/pay-in-to-payout',
            },


               

        ],
    },

    {
        title: 'Payout',
        key: 'all_permission',
        icon: [
            <img src={payoutIcon} alt="Overview" width={24} height={24} className="normalWhite ant-menu-item-icon" />,
            <img src={payoutIconWh} alt="Overview" width={24} height={24} className="activeWhite ant-menu-item-icon" />,
        ],
        children: [
            {
                title: 'Dashboard',
                icon: [
                    <img
                        src={payoutoverviewicon}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="normalWhite ant-menu-item-icon"
                    />,
                    <img
                        src={overviewPayoutWhite}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="activeWhite ant-menu-item-icon"
                    />,
                ],
                key: 'payoutOverview',
                path: '/payouts/overviewPayout',
            },

            {
                title: 'Add Beneficiary',
                icon: [
                    <img
                        src={AddBeneficary}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="normalWhite ant-menu-item-icon"
                    />,
                    <img
                        src={AddBeneficaryWhite}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="activeWhite ant-menu-item-icon"
                    />,
                ],
                key: 'PayoutAddBeneficiary',
                path: '/payouts/beneficiaries',
            },
            {
                title: 'Fund Transfer',
                key: 'payoutFund',
                icon: [
                    <img
                        src={fundtransfer}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="normalWhite ant-menu-item-icon"
                    />,
                    <img
                        src={fundtransferWhite}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="activeWhite ant-menu-item-icon"
                    />,
                ],
                path: '/payouts/FundTransfer',
            },

            {
                title: 'Wallet Top Up',
                key: 'walletTopUpPayout',
                icon: [
                    <img
                        src={payoutusers}
                        alt="Settlement"
                        width={24}
                        height={24}
                        className="normalWhite ant-menu-item-icon"
                    />,
                    <img
                        src={user_white}
                        alt="Settlement"
                        width={24}
                        height={24}
                        className="activeWhite ant-menu-item-icon"
                    />,
                ],
                path: '/wallet-top-up',
            },

            {
                title: 'Report',
                key: 'payoutReport',
                icon: [
                    <img
                        src={payoutreport}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="normalWhite ant-menu-item-icon"
                    />,
                    <img
                        src={reportPayoutWhite}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="activeWhite ant-menu-item-icon"
                    />,
                ],
                path: '/payouts/Report',
            },

            // {
            //     title: 'Ledger',
            //     key: 'ledgerpayout',
            //     icon: [
            //         <img
            //             src={newLEDGER}
            //             alt="Ledger"
            //             width={24}
            //             height={24}
            //             className="normalWhite ant-menu-item-icon"
            //         />,
            //         <img
            //             src={LEDGERWhite}
            //             alt="Ledger"
            //             width={24}
            //             height={24}
            //             className="activeWhite ant-menu-item-icon"
            //         />,
            //     ],
            //     path: '/payout-list',
            // },
        ],
    },
    {
        title: 'PG - International',
        key: 'international_all_permission',
        icon: [
            <img src={payoutIcon} alt="Overview" width={24} height={24} className="normalWhite ant-menu-item-icon" />,
            <img src={payoutIconWh} alt="Overview" width={24} height={24} className="activeWhite ant-menu-item-icon" />,
        ],
        children: [
            {
                title: 'Dashboard',
                icon: [
                    <img
                        src={payoutoverviewicon}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="normalWhite ant-menu-item-icon"
                    />,
                    <img
                        src={overviewPayoutWhite}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="activeWhite ant-menu-item-icon"
                    />,
                ],
                key: 'payoutOverview1',
                path: '/InternationalPayout/overviewPayout1',
            },

            {
                title: 'Transaction',
                key: 'int_payoutFund',
                icon: [
                    <img
                        src={fundtransfer}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="normalWhite ant-menu-item-icon"
                    />,
                    <img
                        src={fundtransferWhite}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="activeWhite ant-menu-item-icon"
                    />,
                ],
                path: '/InternationalPayout/FundTransfer1',
            },
            {
                title: 'Payment Link',
                key: 'int_payinlinkss',
                icon: [
                    <img
                        src={payoutoverviewicon}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="normalWhite ant-menu-item-icon"
                    />,
                    <img
                        src={overviewPayoutWhite}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="activeWhite ant-menu-item-icon"
                    />,
                ],
                path: '/payment-linkss',
            },

            {
                title: 'Report',
                key: 'int_payoutReport',
                icon: [
                    <img
                        src={payoutreport}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="normalWhite ant-menu-item-icon"
                    />,
                    <img
                        src={reportPayoutWhite}
                        alt="Overview"
                        width={24}
                        height={24}
                        className="activeWhite ant-menu-item-icon"
                    />,
                ],
                path: '/InternationalPayout/Report1',
            },
        ],
    },

    {
        title: 'Settings',
        key: 'settings',
        icon: [
            <img src={setting} alt="Overview" width={24} height={24} className="normalWhite ant-menu-item-icon" />,
            <img
                src={settingpayoutWhite}
                alt="Overview"
                width={24}
                height={24}
                className="activeWhite ant-menu-item-icon"
            />,
        ],
        path: '/settings',
    },



 



   

    {
        title: 'Logout',
        key: 'Logout',
        icon: <LogoutIcon set="light" width={24} height={24} />,
    },
];

const AppSidebar = (props) => {
    const { isCollapsed, toggleCollapse } = props;
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [openKeys, setOpenKeys] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [bankList, setBankList] = useState([]);
    const [permissionbank, setPermissionBank] = useState(null);
    const [permissionpayout, setPermissionPayout] = useState(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    const dispatch = useDispatch();

    const onLogout = () => {
        confirm({
            title: 'Are you sure you want to logout?',
            onOk: () => {
                dispatch(logout());
                navigate('/signin');
            },
        });
    };

    const handleMenuClick = (item) => {
        if (item.key === 'Logout') {
            onLogout();
        } else {
            console.log('click', item);
        }
    };
    const menuProps = {
        menu,
        onClick: handleMenuClick,
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        fetchBankList();
        fetchBankAdmin();
    }, []);
    const fetchBankList = async (keyword) => {
        try {
            const response = await api.get('/get-user');
            const data = response.data;
            const permission = data.data.payout_permission;
            const payoutTransferBank = data.data.payout_transfer_bank;
            const payoutTransferPayout = data.data.payout_transfer_payout;
            setBankList(data.data.payout_permission);
            setPermissionBank(payoutTransferBank);
            setPermissionPayout(payoutTransferPayout);
        } catch (error) {
            console.error('Error fetching bank list:', error);
        }
    };
    const [showInternationalAll, setShowInternationalAll] = useState(false);
    const [showPayoutFund, setShowPayoutFund] = useState(false);
    const [showPayoutReport, setShowPayoutReport] = useState(false);
    const [showPaymentLink, setShowPaymentLink] = useState(false);

    const [allPayin, setAllPayin] = useState(false);
    const [dashboardpermission, setdashboardpermission] = useState(false);
    const [paymentLink, setpaymentLink] = useState(false);
    const [transaction, settransaction] = useState(false);

    const [payoutDashboard, setpayoutDashboard] = useState(false);
    const [payoutAddBenifically, setpayoutAddBenifically] = useState(false);
    const [payoutfund_transfer, setpayoutfund_transfer] = useState(false);
    const [payoutWallettopup, setpayoutWallettopup] = useState(false);
    const [payoutLedger, setpayoutLedger] = useState(false);
    const [PayoutReport, setPayoutReport] = useState(false);
    const [PayoutBulkTransafer, setPayoutBulkTransafer] = useState(false);
    const [payoutinstantTransafer, setpayoutinstantTransafer] = useState(false);

    const fetchBankAdmin = async () => {
        try {
            const response = await api.get('/partner-Permission-Data');
            const objpsyout = response.data.PermissionDataPaypal;
            setShowInternationalAll(objpsyout.all_permission === 'true');
            setShowPayoutFund(objpsyout.paypal_transafer === 'true');
            setShowPayoutReport(objpsyout.reports === 'true');
            setShowPaymentLink(objpsyout.payment_link === 'true');

            const payin = response.data.PermissionData;
            setAllPayin(payin.all_permission === 'true');
            setdashboardpermission(payin.dashboard === 'true');
            setpaymentLink(payin.payment_link === 'true');
            settransaction(payin.transaction === 'true');

            const payout = response.data.PermissionDataPayout;
            setpayoutDashboard(payout.dashboard === 'true');
            setpayoutAddBenifically(payout.add_benificially === 'true');
            setpayoutfund_transfer(payout.fund_transfer === 'true');
            setpayoutWallettopup(payout.wallet_topup === 'true');
            setpayoutLedger(payout.ledger === 'true');
            setPayoutReport(payout.reports === 'true');
            setPayoutBulkTransafer(payout.bulk_transfer === 'true');
            setpayoutinstantTransafer(payout.instant_transfer === 'true');
        } catch (error) {
            console.error('Error fetching bank list:', error);
        }
    };
    useEffect(() => {
        let childIndex = -1;
        const selectedMenuItem = menu.find((item) => {
            if (item.children) {
                let tmp = item.children.findIndex((child) => location.pathname.startsWith(child.path));

                if (tmp >= 0) {
                    childIndex = tmp;
                    return true;
                }
                return false;
            } else {
                return location.pathname.startsWith(item.path);
            }
        });

        if (selectedMenuItem) {
            if (selectedMenuItem.children) {
                setSelectedKeys([selectedMenuItem.key, selectedMenuItem.children[childIndex].key]);
                if (isCollapsed) setOpenKeys([]);
                else setOpenKeys([selectedMenuItem.key]);
            } else {
                setSelectedKeys([selectedMenuItem.key]);
            }
        }
    }, [location.pathname]);

    useEffect(() => {
        if (isCollapsed) setOpenKeys([]);
    }, [isCollapsed]);

    const onToggleSubMenu = (key) => {
        if (openKeys.includes(key)) {
            setOpenKeys([]);
        } else {
            setOpenKeys([key]);
        }
    };

    const onClick = (e) => {
        console.log('click ', e);
    };

    return (
        <Sider className={`app-sidebar`} theme="dark" collapsed={isCollapsed}>
            {isCollapsed ? (
                <img src={logoIcon} className="logo-collapsed mt-8 ml-8" />
            ) : (
                <img src={logo} className="logo" />
            )}

            <Menu
                mode="inline"
                className={`sidebar-menu`}
                theme="dark"
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onClick={handleMenuClick}
            >
                <Menu.Item
                    key={'collapse'}
                    icon={
                        isCollapsed ? (
                            <ArrowRight set="light" width={24} height={24} />
                        ) : (
                            <HiMenuAlt2 set="light" width={24} height={24} className="humburger" />
                        )
                    }
                    onClick={toggleCollapse}
                    className="menu-item--collapse toggle"
                >
                    {isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
                </Menu.Item>

                {menu.map((item) => {
                    if (item.key === 'international_all_permission' && !showInternationalAll) {
                        return null;
                    }

                    if (item.children && item.children.length) {
                        const filteredChildren = item.children.filter((child) => {
                            // alert(child.key);
                            // if (child.key === 'int_payoutFund') {
                            //     return showPayoutFund;
                            // }
                            // if (child.key === 'int_payoutReport') {
                            //     return showPayoutReport;
                            // }
                            // if (child.key === 'int_payinlinkss') {
                            //     return showPaymentLink;
                            // }

                            //payin permission
                            if (child.key == 'payindashboard') {
                                if (dashboardpermission) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            if (child.key == 'payinlink') {
                                if (paymentLink) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            if (child.key == 'Transaction') {
                                if (transaction) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            //payout Permission
                            if (child.key == 'payoutOverview') {
                                if (payoutDashboard) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            if (child.key == 'PayoutAddBeneficiary') {
                                if (payoutAddBenifically) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            if (child.key == 'payoutFund') {
                                if (payoutfund_transfer) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            if (child.key == 'walletTopUpPayout') {
                                if (payoutWallettopup) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            if (child.key == 'payoutReport') {
                                if (PayoutReport) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            if (child.key == 'ledgerpayout') {
                                if (payoutLedger) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            return true;
                        });

                        if (filteredChildren.length === 0) {
                            return null;
                        }

                        return (
                            <Menu.SubMenu
                                key={item.key}
                                icon={item.icon}
                                title={item.title}
                                theme='dark'
                                onTitleClick={() => onToggleSubMenu(item.key)}
                            >
                                {filteredChildren.map((child) => {
                                    return (
                                        <Menu.Item
                                        theme='dark'
                                            key={child.key}
                                            icon={child.icon}
                                            onClick={() => navigate(child.path)}
                                        >
                                            {child.title}
                                        </Menu.Item>
                                    );
                                })}
                            </Menu.SubMenu>
                        );
                    }

                    return (
                        <Menu.Item key={item.key} icon={item.icon} onClick={() => navigate(item.path)}>
                            {item.title}
                        </Menu.Item>
                    );
                })}
            </Menu>
        </Sider>
    );
};

export default AppSidebar;
