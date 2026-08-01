import AppLayout from "layout";
import React, { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, Outlet, useLocation } from "react-router-dom";
// actions
import { getAuthUserAction as getAuthUser } from "redux/actions/auth";
import { getConfigAction as getConfig } from "redux/actions/config";
// components
import Loading from "components/Loading";
import Login from "routes/auth/Login";
import Overview from "routes/overview";
import OverviewPayin from "routes/overviewPayin";
import Transaction from "routes/transaction";
import AccountPayoutReport from "routes/transaction/AccountPayoutReport";
import TransactionPayin from "routes/transactionPayin";
import PaypalTransaction from "routes/Paypal-Transacrion";
import IpWhitelist from "routes/ipWhitelist";
import Users from "routes/users/UserList";
import RoleList from "routes/role/RoleList";
import RoleDetail from "routes/role/RoleDetail";
import CountryList from "routes/country/CountryList";
import CountryDetail from "routes/country/CountryDetail";
import StateList from "routes/country/StateList";
import CurrencyList from "routes/currency/CurrencyList";
import PlatformList from "routes/platform/PlatformList";
import ModuleList from "routes/module/ModuleList";
import PlanList from "routes/plan/PlanList";
import ServiceList from "routes/service/ServiceList";
import ServiceDetail from "routes/service/ServiceDetail";
import PlatformCreateForm from "routes/platform/PlatformCreateForm";
import PlatformDetail from "routes/platform/PlatformDetail";
import ServiceCreateForm from "routes/service/ServiceCreateForm";
import BillingConfig from "routes/config/Billing";
import SubscriptionList from "routes/subscription/SubscriptionList";
import EventList from "routes/event/EventList";
import EmailTemplateList from "routes/config/emailTemplate/EmailTemplateList";
import EmailTemplateDetail from "routes/config/emailTemplate/EmailTemplateDetail";
import CustomerList from "routes/customer/CustomerList";
import CustomerDetail from "routes/customer/CustomerDetail";
import UserList from "routes/users/UserList";
import PartnerSettingUser from "routes/users/PartnerSettingUser";
import DashboardUserList from "routes/users/DashboardUserList";
import ManagerSettingUser from "routes/users/ManagerSettingUser";
import UserDetail from "routes/users/UserDetail";
import PartnerList from "routes/users/PartnerList";
import MerchantList from "routes/users/MerchantList";
import ManagerSetting from "routes/users/ManagerSetting";
import Dashboard from "routes/users/Dashboard";

import ResellerSetting from "routes/users/ResellerSetting";
import ResellerSettingUser from "routes/users/ResellerSettingUser";
import PayoutSetting from "routes/users/PayoutSetting";
import PayoutSettingUser from "routes/users/PayoutSettingUser";
import PayinSettingUser from "routes/users/PayinSettingUser";
import PaypalSettingUser from "routes/users/PaypalSettingUser";
import AdminData from "routes/admindata/AdminData";
import Report from "routes/getwayreport/Report";
import GetwayReport from "routes/getwayreport/GetwayReport";
import GetwayDetail from "routes/getwayreport/GetwayDetail";
import PaymentReport from "routes/getwayreport/PaymentReport";
import PaymentPayoutReport from "routes/getwaypayoutreport/PaymentPayoutReport";
import GetwaywishPayoutReport from "routes/getwaypayoutreport/GetwaywishPayoutReport";
import PayoutReport from "routes/getwaypayoutreport/PayoutReport";
import Payintopayout from "routes/payinto_payout/Payintopayout";
import Payintopayoutsingle from "routes/payinto_payout/Payintopayoutsingle";
// import RazorpayReport from 'routes/partner_manager_list/RazorpayReport';
import ChargebackLazdar from "routes/partner_manager_list/ChargebackLazdar";
import PartnerMerchantUserList from "routes/partner_manager_list/PartnerMerchantUserList";
import Payoutrazorpay from "routes/partner_manager_list/Payoutrazorpay";
import Payinrazorpay from "routes/partner_manager_list/Payinrazorpay";
import AppList from "routes/app/AppList";
import AppDetail from "routes/app/AppDetail";
import AppCreateForm from "routes/app/AppCreateForm";
import CommissionList from "routes/commission/CommissionList.js";
import CommissionListApproved from "routes/commission/CommissionListApproved.js";
import PartnerLists from "./user/PartnerLists";
import ManagerUserList from "./user/ManagerUserList";
import MerchantUserList from "./user/MerchantUserList";
import Manager from "routes/manager";
import BeneficiallyList from "routes/beneficially/BeneficiallyList.js";
import BeneficiallyData from "routes/beneficiallyList/BeneficiallyData.js";
import WalletVerifyData from "routes/walletverfifyList/WalletVerifyData.js";
import WalletPending from "routes/walletverfifyList/WalletPending.js";
import WalletFailed from "routes/walletverfifyList/WalletFailed.js";
import WalletSuccess from "routes/walletverfifyList/WalletSuccess.js";
import SettlementList from "routes/settlement/SettlementList";
import ChargebackList from "./chargeback/ChargebackList";

import PayINPayOUTList from "routes/payinpayoutservices/PayINPayOUTList";
import ManualSettlementsData from "routes/ManualSettlementsList/ManualSettlementsData.js";
import PayINPayOUTPermission from "routes/roleandpermission/PayINPayOUTPermission";
import PayINList from "routes/payinpayoutservices/PayINList.js";
import PayoutList from "routes/payinpayoutservices/PayoutList.js";
import MerchantLimit from "routes/payinpayoutservices/MerchantLimit.js";
import MerchantLimitPayin from "routes/payinpayoutservices/MerchantLimitPayin.js";
import GatewayDetail from "routes/gateway/GatewayDetail";
import Gateway from "routes/gateway";
import IpWhitelistPayout from "./ipWhitelistPayout";
import OrderList from "routes/order/OrderList";
import OrderDetail from "routes/order/OrderDetail";
import TransactionAccountPayoutReporttList from "routes/payout/TransactionAccountPayoutReporttList";
import TransactionAccountPayoutReportDetails from "routes/payout/TransactionAccountPayoutReportDetails";
import TransactionPayoutList from "routes/payout/TransactionPayoutList";
import TransactionPaypalList from "routes/Paypal-Transacrion/TransactionPaypalList";
import FreezeAmount from "./freezeAmount";
import UserListLogs from "routes/users/UserListLogs";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const authUser = useSelector((state) => state.auth.authUser);

  if (authUser) return children;

  return <Navigate to="/login" state={{ from: location }} replace />;
};

const AppRoutes = () => {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        await dispatch(getAuthUser());
        await dispatch(getConfig());
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
      <Route exact path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout>
              <Outlet />
            </AppLayout>
          </ProtectedRoute>
        }
      >
        <Route exact path="/" element={<Overview />} />
        <Route exact path="/Overview" element={<Overview />} />
        <Route exact path="/overviewpayin" element={<OverviewPayin />} />
        <Route exact path="/transaction" element={<Transaction />} />
        <Route exact path="/account-payout-report" element={<AccountPayoutReport />} />
        <Route exact path="/transactionspayin" element={<TransactionPayin />} />
        <Route path="/users-logs/:userId" element={<UserListLogs />} />
        <Route
          exact
          path="/Paypal-Transaction"
          element={<PaypalTransaction />}
        />
        <Route exact path="/ipWhitelist/:id" element={<IpWhitelist />} />
        <Route
          exact
          path="/ipWhitelistpayout/:id"
          element={<IpWhitelistPayout />}
        />
        <Route exact path="/user" element={<Navigate to="/users" />} />
        <Route exact path="/users" element={<UserList />} />
        <Route exact path="/users/:id" element={<UserDetail />} />
        <Route path="/partners/:id/users" element={<UserList />} />
        <Route path="/dashboard-users-detail" element={<DashboardUserList />} />
        <Route
          path="/manager-setting-user-detail"
          element={<ManagerSettingUser />}
        />
        <Route
          path="/reseller-setting-user-detail"
          element={<ResellerSettingUser />}
        />
        <Route
          path="/payout-setting-user-detail/:id"
          element={<PayoutSettingUser />}
        />
        <Route
          path="/payin-setting-user-detail/:id"
          element={<PayinSettingUser />}
        />
        <Route
          path="/paypal-setting-user-detail/:id"
          element={<PaypalSettingUser />}
        />
        <Route exact path="/roles" element={<RoleList />} />
        <Route exact path="/roles/:id" element={<RoleDetail />} />
        <Route exact path="/countries" element={<CountryList />} />
        <Route exact path="/countries/:id" element={<CountryDetail />} />
        <Route exact path="/countries/:id/states" element={<StateList />} />
        <Route exact path="/currencies" element={<CurrencyList />} />
        <Route exact path="/platforms" element={<PlatformList />} />
        <Route exact path="/platforms/:id" element={<PlatformDetail />} />
        <Route
          exact
          path="/platforms/create"
          element={<PlatformCreateForm />}
        />
        <Route exact path="/modules" element={<ModuleList />} />
        <Route exact path="/plans" element={<PlanList />} />
        <Route exact path="/admin-data" element={<AdminData />} />
        <Route exact path="/report" element={<Report />} />
        <Route exact path="/getway-report" element={<GetwayReport />} />
        <Route exact path="/getway-detail" element={<GetwayDetail />} />
        <Route exact path="/payment-report" element={<PaymentReport />} />
        <Route
          exact
          path="/payment-payout-report"
          element={<PaymentPayoutReport />}
        />
        <Route
          exact
          path="/payoutuserwise-report"
          element={<GetwaywishPayoutReport />}
        />
        <Route
          exact
          path="/Payinto-payout-report"
          element={<Payintopayout />}
        />
        <Route
          exact
          path="/Payinto-payout-single-report"
          element={<Payintopayoutsingle />}
        />
        <Route exact path="/payout-report" element={<PayoutReport />} />
        <Route exact path="/services" element={<ServiceList />} />
        <Route exact path="/services/:id" element={<ServiceDetail />} />
        <Route exact path="/services/create" element={<ServiceCreateForm />} />
        <Route exact path="/customers" element={<CustomerList />} />
        <Route exact path="/customers/:id" element={<CustomerDetail />} />
        <Route exact path="/subscriptions" element={<SubscriptionList />} />
        <Route exact path="/notification-events" element={<EventList />} />
        <Route exact path="/config/billing" element={<BillingConfig />} />
        <Route
          exact
          path="/config/email-templates"
          element={<EmailTemplateList />}
        />
        <Route
          exact
          path="/config/email-templates/:id"
          element={<EmailTemplateDetail />}
        />
        <Route exact path="/apps" element={<AppList />} />
        <Route exact path="/apps/:id" element={<AppDetail />} />
        <Route exact path="/apps/create" element={<AppCreateForm />} />
        <Route path="/live-data" element={<CommissionList />} />
        <Route
          path="/live-data-approved"
          element={<CommissionListApproved />}
        />
        <Route path="/partners-list" element={<PartnerList />} />
        <Route
          path="/partner-setting-user/:id"
          element={<PartnerSettingUser />}
        />
        <Route path="/merchant-detail" element={<MerchantList />} />
        {/* <Route path="/dashboard-detail" element={<Dashboard />} /> */}

        <Route path="/manager-setting" element={<ManagerSetting />} />
        <Route path="/reseller-setting" element={<ResellerSetting />} />
        <Route path="/payout-setting" element={<PayoutSetting />} />
        <Route
          path="/manager-setting-partners-lists"
          element={<PartnerLists />}
        />
        <Route
          path="manager-setting-partners-lists/:id/manager-setting-user"
          element={<ManagerUserList />}
        />
        <Route path="/manager-setting-detail" element={<MerchantUserList />} />
        <Route exact path="/partner-payout-setting" element={<Manager />} />
        <Route path="/beneficially" element={<BeneficiallyList />} />
        <Route path="/beneficiallyList/:id" element={<BeneficiallyData />} />
        <Route path="/WalletVerifyList/:id" element={<WalletVerifyData />} />
        <Route path="/manual-settlements" element={<SettlementList />} />
        <Route path="/chargeback-transactions" element={<ChargebackList />} />
        {/* <Route path='/payin-razorpay-transactions' element={<RazorpayReport />} /> */}
        <Route path="/chargeback-lazdar-list" element={<ChargebackLazdar />} />
        <Route path="/payout-list" element={<Payoutrazorpay />} />
        <Route path="/payin-list" element={<Payinrazorpay />} />
        <Route path="/payin-payout" element={<PayINPayOUTList />} />
        <Route
          path="/ManualSettlementsList/:id"
          element={<ManualSettlementsData />}
        />

        <Route path="/payin-charge/:id/users" element={<PayINList />} />
        <Route path="/payout-charge/:id/users" element={<PayoutList />} />
        <Route exact path="/gateway/:id" element={<Gateway />} />
        <Route exact path="/gateway/:id/:userid" element={<GatewayDetail />} />
        <Route exact path="/payin-transaction" element={<OrderList />} />
        <Route exact path="/orders/:id" element={<OrderDetail />} />
        <Route
          exact
          path="/account-payout-transaction-report"
          element={<TransactionAccountPayoutReporttList />}
        />

        <Route
          exact
          path="/payout-transaction"
          element={<TransactionPayoutList />}
        />


        <Route
          exact
          path="/paypal-transaction"
          element={<TransactionPaypalList />}
        />
        <Route
          path="/payin-payout-permission"
          element={<PayINPayOUTPermission />}
        />
        <Route path="/wallet-pending" element={<WalletPending />} />
        <Route path="/wallet-failed" element={<WalletFailed />} />
        <Route path="/wallet-success" element={<WalletSuccess />} />
        <Route path="/set-merchant-limit/:id" element={<MerchantLimit />} />
        <Route
          path="/set-merchant-limit-payin/:id"
          element={<MerchantLimitPayin />}
        />
        <Route path="/freeze-amount/:id" element={<FreezeAmount />} />
        <Route
          path="/transaction-account-payout-report-details/:accountnumber/:userId"
          element={<TransactionAccountPayoutReportDetails />}
        />


        <Route
          path="/partner-merchantUser-list"
          element={<PartnerMerchantUserList />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
