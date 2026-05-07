import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Spin,
  Table,
  Space,
  Switch,
  Row,
  InputNumber,
  Button,
  Card,
  Col,
} from "antd";
import { useLocation, useNavigate, Link } from "react-router-dom";
import _ from "lodash";
import PageTitle from "components/PageTitle";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from "utils/url";

import {
  getManager,
  partnerpayoutpayinpermission,
  partnerPaypalpermission,
  partnerpayoutpayoutpermission,
  updatePartnerPayinPayout,
  paymentmode,
} from "requests/user";

const PayINPayOUTPermission = () => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState();

  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);

  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const config = useSelector((state) => state.config);

  const titles = [{ title: "PayIN Payout" }];

  const columns = [
    {
      title: "Merchant Detail",
      render: (text, record) => (
        <div>
          <div>
            <span>
              <strong>Name : </strong> {record.full_name}
            </span>
          </div>
          <div>
            <span>
              <strong>Client Name : </strong> {record.client_name}
            </span>
          </div>
          <div>
            <strong>Email : </strong>
            <a href={`mailto:${record.email}`}>{record.email}</a>
          </div>
          <div>
            <strong>Password : </strong>
            <span> {record.simple_pass}</span>
          </div>
          {/* <div>
            <span> {record.user_temp && record.user_temp.otp}</span>
          </div> */}
        </div>
      ),
    },

    // {
    //   title: "Payin",
    //   key: "payin_permission_assign",
    //   dataIndex: "payin_permission_assign",
    //   render: (text, record) => {
    //     return (
    //       <>
    //         <Switch
    //           defaultChecked={
    //             record.partnerpayin_permission_assign == 0 ? false : true
    //           }
    //           checkedChildren={
    //             record.partnerpayin_permission_assign == 1
    //               ? "Active"
    //               : "Inactive"
    //           }
    //           unCheckedChildren={
    //             record.partnerpayin_permission_assign == 0
    //               ? "Inactive"
    //               : "Active"
    //           }
    //           onClick={() =>
    //             payin_change_status(
    //               record.partnerid,
    //               record.partnerpayin_permission_assign
    //             )
    //           }
    //         />
    //       </>
    //     );
    //   },
    // },

    {
      title: "Payout Mode",
      key: "payment_mode",
      dataIndex: "payment_mode",
      render: (text, record) => {
        console.warn("Rendering Switch - payment_mode:", record.payment_mode);
        return (
          <Switch
            defaultChecked={record.payment_mode === "live"}
            checkedChildren="live"
            unCheckedChildren="test"
            onClick={() => payment_modepayout(record.id, record.payment_mode)}
          />
        );
      },
    },

    {
      title: "Payout",
      key: "payout_permission_assign",
      dataIndex: "payout_permission_assign",
      render: (text, record) => {
        return (
          <Switch
            defaultChecked={record.payout_permission_assign == 0 ? false : true}
            checkedChildren={
              record.payout_permission_assign == 1 ? "Active" : "Inactive"
            }
            unCheckedChildren={
              record.payout_permission_assign == 0 ? "Inactive" : "Active"
            }
            onClick={() =>
              payout_change_status(record.id, record.payout_permission_assign)
            }
          />
        );
      },
    },

    // {
    //   title: "PayIN Permisson",
    //   render: (record) => (
    //     <Link to={`/partner-setting-user/${record.id}`}>
    //       <Button>Manage</Button>
    //     </Link>
    //   ),
    // },

    {
      title: "Payout Permisson",
      render: (record) => (
        <Link to={`/payout-setting-user-detail/${record.id}`}>
          <Button>Manage </Button>
        </Link>
      ),
    },
    {
      title: "Payin",
      key: "payin_permission_assign",
      dataIndex: "payin_permission_assign",
      render: (text, record) => {
        return (
          <Switch
            defaultChecked={record.payin_permission_assign == 0 ? false : true}
            checkedChildren={
              record.payin_permission_assign == 1 ? "Active" : "Inactive"
            }
            unCheckedChildren={
              record.payin_permission_assign == 0 ? "Inactive" : "Active"
            }
            onClick={() =>
              payin_change_status(record.id, record.payin_permission_assign)
            }
          />
        );
      },
    },
    {
      title: "Payin Permisson",
      render: (record) => (
        <Link to={`/payin-setting-user-detail/${record.id}`}>
          <Button>Manage </Button>
        </Link>
      ),
    },
    {
      title: "Paypal",
      key: "paypal_permission_assign",
      dataIndex: "paypal_permission_assign",
      render: (text, record) => {
        return (
          <Switch
            defaultChecked={record.paypal_permission_assign == 0 ? false : true}
            checkedChildren={
              record.paypal_permission_assign == 1 ? "Active" : "Inactive"
            }
            unCheckedChildren={
              record.paypal_permission_assign == 0 ? "Inactive" : "Active"
            }
            onClick={() =>
              paypal_change_status(record.id, record.paypal_permission_assign)
            }
          />
        );
      },
    },

    {
      title: "Paypal Permisson",
      render: (record) => (
        <Link to={`/paypal-setting-user-detail/${record.id}`}>
          <Button>Manage</Button>
        </Link>
      ),
    },
  ];
  const handleClick = (id) => {
    window.location.href = `/partner-setting-user?partnerid=${id}`;
  };
  useEffect(() => {
    const query = parseQueryParams(location);
    getRecords(query);
  }, [location]);

  const getRecords = async (query) => {
    try {
      setIsTableLoading(true);
      const response = await getManager(query);
      // console.warn(response.per_page);
      setRecords(response.records);
      setPage(response.page);
      setPerPage(response.per_page);
      setTotalCount(response.total_record);
    } catch (err) {
      console.log(err);
    } finally {
      setIsTableLoading(false);
    }
  };

  const payin_change_status = async (id, data) => {
    if (data == 1) {
      var key = 0;
    } else {
      var key = 1;
    }
    id = {
      userid: id,
      payin_permission_assign: key,
    };
    await partnerpayoutpayinpermission(id);
    getRecords();
  };

  const payout_change_status = async (id, data) => {
    // alert(data);
    if (data == 1) {
      var key = 0;
    } else {
      var key = 1;
    }
    id = {
      userid: id,
      payout_permission_assign: key,
    };
    await partnerpayoutpayoutpermission(id);
    getRecords();
  };

  const paypal_change_status = async (id, data) => {
    if (data == 1) {
      var key = 0;
    } else {
      var key = 1;
    }
    id = {
      userid: id,
      paypal_permission_assign: key,
    };
    await partnerPaypalpermission(id);
    getRecords();
  };

  const payment_modepayout = async (id, currentMode) => {
    console.log("Current Mode:", currentMode);
    const newMode = currentMode === "live" ? "test" : "live";
    const payload = {
      userid: id,
      payment_mode: newMode,
    };
    // alert(currentMode);
    await paymentmode(payload);
    getRecords();
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

  const onRefresh = () => {
    let query = parseQueryParams(location);
    query = {
      page: 1,
      keyword: "",
    };

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });

    if (searchRef.current?.input.value) {
      searchRef.current.handleReset();
    }
  };

  const onChangeTable = (pagination) => {
    console.log(pagination);

    let query = parseQueryParams(location);
    query = {
      ...query,
      page: pagination.current,
      per_page: pagination.pageSize,
    };

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });
  };

  // const onUpdate1 = _.debounce(async (id, data) => {
  //     try {
  //         // setIsTableLoading(true);
  //         await updatePartner(id, data);
  //     } catch (err) {
  //         console.log(err);
  //     } finally {
  //         // setIsTableLoading(false);
  //     }
  // }, 500);

  const handleChange = _.debounce(async (id) => {
    try {
      setIsTableLoading(true);
      await updatePartnerPayinPayout(id.target.value);
    } catch (err) {
      console.log(err);
    } finally {
      setIsTableLoading(false);
    }
  }, 500);

  return (
    <div>
      <div className="overviewBorder">
        <Row justify="space-between" align="middle">
          <Col xs={24} md={12} lg={12}>
            <Card className="small_card">
              <PageTitle titles={titles} />
            </Card>
          </Col>
          <Col xs={24} md={8} lg={6}>
            <Card className="small_card">
              <TableBar
                onSearch={onSearch}
                showFilter={false}
                placeholderInput="Search..."
                inputRef={searchRef}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <Spin spinning={isTableLoading}>
        <Table
          className="mt-8"
          dataSource={records}
          columns={columns}
          onChange={onChangeTable}
          rowKey={"id"}
          pagination={{
            pageSize: perPage,
            total: totalCount,
            current: page,
          }}
          scroll={{
            x: true,
          }}
        />
      </Spin>
    </div>
  );
};

export default PayINPayOUTPermission;
