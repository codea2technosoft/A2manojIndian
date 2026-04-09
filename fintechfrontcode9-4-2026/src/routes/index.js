import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, Outlet, useLocation } from 'react-router-dom';
// layouts
import AppLayout from 'layout/app';
import CheckoutLayout from 'layout/checkout';
// actions
import { getAuthUserAction as getAuthUser } from 'redux/actions/auth';
import { getConfigAction as getConfig } from 'redux/actions/config';
// components
import Loading from 'components/Loading';
import Signin from 'routes/auth/Signin';
import Response from 'routes/auth/Response';
import Signup from 'routes/auth/Signup';
import Profile from 'routes/profile/profile';
import ForgotPassword from 'routes/auth/ForgotPassword';
import ResetPassword from 'routes/auth/ResetPassword';
import UserVerification from 'routes/auth/UserVerification';
import UserSetToken from 'routes/auth/UserSetToken';
import Error404 from 'routes/error/Error404';
import Overview from 'routes/overview';
import Customer from 'routes/customers';
import Error401 from 'routes/error/Error401';
import OrderList from 'routes/order/OrderList';
import Transactions from 'routes/order/Transactions';
import AllTransactionList from 'routes/alltransaction/AllTransactionList';
import PendingTransactionList from 'routes/pendingtransaction/PendingTransactionList';
import Pricing from 'routes/pricing';
import Services from 'routes/service';
import PaymentAdvancedSettings from 'routes/payment/advanced-setting';
import OrderDetail from 'routes/order/OrderDetail';
import ServiceDetail from 'routes/service/ServiceDetail';
import ShipmentTracking from 'routes/shipment/ShipmentTracking';
import Checkout from 'routes/checkout';
import CheckoutResult from 'routes/checkout/CheckoutResult';
import SettlementList from 'routes/settlement/SettlementList';
import TransactionList from 'routes/transaction/TransactionList';
import TransfarList from 'routes/transfarpayout/TransfarList.js';
import TransfarbankList from 'routes/transfarbank/TransfarbankList.js';
import ChargebackList from 'routes/chargeback/ChargebackList';
import SmsList from './sms/SmsList';
import PaymentLink from './payment/link';
import PayinDashboard from './payment/dashboard/index.js';
import PaymentLinkss from './InternationalPayout/linkss';
import PayoutsBeneficiaryAccountList from './payouts/PayoutsBeneficiaryAccountList';
import FundTransfer from './payouts/FundTransfer';
import FundTransfer1 from './InternationalPayout/FundTransfer1';
// import PaymentLinkss from './InternationalPayout/PaymentLinkss';
import Report from './payouts/Report';
import Report1 from './InternationalPayout/Report1';
import PendingTransaction from './payouts/PendingTransaction';
import SuccessTransaction from './payouts/SuccessTransaction';
import FailedTransaction from './payouts/FailedTransaction';
import InstantTransfer from './payouts/InstantTransfer';
import InstantTransfer1 from './InternationalPayout/InstantTransfer1';
import BulkTransfer from './payouts/BulkTransfer';
import BulkTransfer1 from './InternationalPayout/BulkTransfer1';
import WalletTopup from './payouts/WalletTopup';
import WalletReport from './wallettopup/WalletReport';
import PayinReport from './payintransaction/PayinReport';
import PayinToPayout from './payintransaction/payinToPayout';
import ChangePassword from './profile/changepassword';
import OverviewPayout from './payouts/overviewPayout';
import OverviewPayout1 from './InternationalPayout/overviewPayout1';
import PartnerMerchantUserList from 'routes/partner_manager_list/PartnerMerchantUserList';
import Payoutrazorpay from 'routes/partner_manager_list/Payoutrazorpay';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const authUser = useSelector((state) => state.auth.authUser);

    if (authUser) {
        if (!authUser.status) return <Navigate to="/otp-verification" replace />;

        return children;
    }

    // store origin path to localstorage, redirect to it after login success
    localStorage.setItem('originPath', location.pathname);

    return <Navigate to="/signin" state={{ from: location }} replace />;
};

const AppRoutes = () => {
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        async function getData() {
            try {
                await dispatch(getConfig());
                await dispatch(getAuthUser());
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        getData();
    }, []);

    if (loading) return <Loading />;

    return (
        <Routes>
            {/* Error pages */}
            <Route path="*" element={<Error404 />} />
            <Route exact path="/401" element={<Error401 />} />
            <Route exact path="/404" element={<Error404 />} />
            {/* Registration pages */}
            <Route exact path="/signin" element={<Signin />} />
            <Route exact path="/response" element={<Response />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/reset-password" element={<ResetPassword />} />
            <Route exact path="/setToken" element={<UserSetToken />} />
            <Route exact path="/otp-verification" element={<UserVerification />} />
            <Route exact path="/shipment/tracking" element={<ShipmentTracking />} />
            <Route
                element={
                    <ProtectedRoute>
                        <CheckoutLayout>
                            <Outlet />
                        </CheckoutLayout>
                    </ProtectedRoute>
                }
            >
                <Route exact path="/pricing" element={<Pricing />} />
                <Route exact path="/checkout" element={<Checkout />} />
                <Route exact path="/checkout/result" element={<CheckoutResult />} />
            </Route>
            {/* Dashboard */}
            <Route
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Outlet />
                        </AppLayout>
                    </ProtectedRoute>
                }
            >
                <Route exact path="/" element={<Navigate to="/payouts/overviewPayout" />} />
                <Route exact path="/" element={<Navigate to="/InternationalPayout/overviewPayout1" />} />
                <Route exact path="/overview" element={<Overview />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/change-password" element={<ChangePassword />} />
                <Route exact path="/transactions" element={<Transactions />} />
                <Route exact path="/transaction" element={<OrderList />} />
                <Route exact path="/all-transaction" element={<AllTransactionList />} />
                <Route exact path="/pending-transaction" element={<PendingTransactionList />} />
                <Route exact path="/orders/:id" element={<OrderDetail />} />
                <Route exact path="/services" element={<Services />} />
                <Route exact path="/services/:id" element={<ServiceDetail />} />
                <Route exact path="/settings" element={<PaymentAdvancedSettings />} />
                <Route exact path="/payin-dashboard" element={<PayinDashboard />} />
                <Route exact path="/payment-links" element={<PaymentLink />} />
                <Route exact path="/payment-linkss" element={<PaymentLinkss />} />
                <Route path="/settlements" element={<SettlementList />} />
                <Route exact path="/charge-back" element={<ChargebackList />} />
                <Route path="/transfarpayout" element={<TransfarList />} />
                <Route path="/transfarbank" element={<TransfarbankList />} />
                <Route path="/transactions" element={<TransactionList />} />
                <Route path="/sms" element={<SmsList />} />

                <Route exact path="/payouts/overviewPayout" element={<OverviewPayout />} />
                <Route path="/InternationalPayout/overviewPayout1" element={<OverviewPayout1 />} />
                <Route path="/payouts/beneficiaries" element={<PayoutsBeneficiaryAccountList />} />
                <Route path="/payouts/FundTransfer" element={<FundTransfer />} />
                <Route path="/InternationalPayout/FundTransfer1" element={<FundTransfer1 />} />
                <Route path="/InternationalPayout/PaymentLinkss" element={<PaymentLinkss />} />
                <Route path="/payouts/Report" element={<Report />} />
                <Route path="/InternationalPayout/Report1" element={<Report1 />} />
                <Route path="/payouts/PendingTransaction" element={<PendingTransaction />} />
                <Route path="/payouts/SuccessTransaction" element={<SuccessTransaction />} />
                <Route path="/payouts/FailedTransaction" element={<FailedTransaction />} />
                <Route path="/payouts/InstantTransfer" element={<InstantTransfer />} />
                <Route path="/InternationalPayout/InstantTransfer1" element={<InstantTransfer1 />} />
                <Route path="/payouts/BulkTransfer" element={<BulkTransfer />} />
                <Route path="/InternationalPayout/BulkTransfer1" element={<BulkTransfer1 />} />
                <Route path="/wallet-top-up" element={<WalletReport />} />
                <Route path="/pay-in-to-payout" element={<PayinToPayout/>} />
                <Route path="/transcation" element={<PayinReport />} />
                <Route path="/merchantUser-lists" element={<PartnerMerchantUserList />} />
                <Route path="/payout-list" element={<Payoutrazorpay />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
