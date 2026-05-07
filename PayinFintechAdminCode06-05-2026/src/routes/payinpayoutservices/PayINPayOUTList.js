import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Spin,
  Table,
  Row,
  Button,
  Card,
  Col,
  Modal,
  Input,
  notification,
} from "antd";
import { useLocation, useNavigate, Link } from "react-router-dom";
import _ from "lodash";
import api from "utils/api";
import PageTitle from "components/PageTitle";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
// import { BaseSelect } from 'components/Elements';
// request
import {
  getManager,
  partnerpayoutpayinpermission,
  partnerpayoutpayoutpermission,
  updatePartnerPayinPayout,
} from "requests/user";

const PayINPayOUTList = () => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState();
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE,
  );
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAddAmountModalVisible, setIsAddAmountModalVisible] = useState(false);
  const [isAddAmountModalVisible1, setIsAddAmountModalVisible1] =
    useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [recordId, setRecordId] = useState("");
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const config = useSelector((state) => state.config);

  const titles = [{ title: "Payout" }];

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
            <span>
              <strong>Password : </strong> {record.simple_pass}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Available Amount PayIn",
      key: "payin_amount_settlement",
      dataIndex: "payin_amount_settlement",
    },
    {
      title: "Available Amount Payout",
      key: "payout_amount_settlement",
      dataIndex: "payout_amount_settlement",
    },

    {
      title: "Assign Gateway",
      render: (record) => (
        <Link to={`/gateway/${record.id}`}>
          <Button className="gradiant_btn">Gateway</Button>
        </Link>
      ),
    },
    {
      title: "Manual Settlement",
      render: (
        _,
        record, // Add underscore (_) for first parameter
      ) => (
        <Link to={`/ManualSettlementsList/${record.id}`}>
          <Button className="gradiant_btn">Manual Settlement</Button>
        </Link>
      ),
    },

    {
      title: "Payout Charge",
      render: (record) => (
        <Link to={`/payout-charge/${record.id}/users`}>
          <Button className="gradiant_btn">Payout Charge</Button>
        </Link>
      ),
    },

    //    {
    //   title: "Payin Charge",
    //   render: (record) => (
    //     <Link to={`/payin-commission-charge/${record.id}/users`}>
    //       <Button className="gradiant_btn">Payin Charge</Button>
    //     </Link>
    //   ),
    // },

    {
      title: "PayIn Charge",
      render: (record) => (
        <Link to={`/payin-charge/${record.id}/users`}>
          <Button className="gradiant_btn">PayIn Charge</Button>
        </Link>
      ),
    },

    {
      title: "IP White List",
      render: (record) => (
        <Link to={`/ipWhitelist/${record.id}`}>
          <Button className="gradiant_btn">IP White List</Button>
        </Link>
      ),
    },

    {
      title: "Beneficially",
      render: (record) => (
        <Link to={`/beneficiallyList/${record.id}`}>
          <Button className="gradiant_btn">Beneficially</Button>
        </Link>
      ),
    },

    {
      title: "Add Amount",
      render: (record) => (
        <Button
          className="gradiant_btn"
          onClick={() => handleAddAmountClick(record.id)}
        >
          Add Amount
        </Button>
      ),
    },

    {
      title: "Wallet Top Up",
      render: (record) => (
        <Link to={`/WalletVerifyList/${record.id}`}>
          <Button className="gradiant_btn">Verify Topup</Button>
        </Link>
      ),
    },

    {
      title: "Freeze Amount",
      render: (record) => (
        <Button
          className="gradiant_btn"
          onClick={() =>
            handleFreezeClick(record.id, record.freezeAmountPayout)
          }
        >
          Freeze Amount
        </Button>
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

  const handleAddAmountClick = (record) => {
    setIsAddAmountModalVisible(true);
    setRecordId(record);
  };

  const handleAmountChange = (e) => {
    const amount = e.target.value;
    setAmountToAdd(amount);
    setValidationErrors({});
  };

  const handleFreezeClick = (record, freezeAmountPayout) => {
    setIsAddAmountModalVisible1(true);
    setRecordId(record);
    setAmountToAdd(freezeAmountPayout);
  };

  const handleFreezeChange = (e) => {
    const amount = e.target.value;
    setAmountToAdd(amount);
    setValidationErrors({});
  };

  const handleAddAmountSubmit = async () => {
    if (isLoading || isButtonDisabled) {
      return;
    }

    setIsLoading(true);
    setIsButtonDisabled(true);

    try {
      const errors = {};

      if (!amountToAdd) {
        errors.amountToAdd = "Amount is required";
        setValidationErrors(errors);
        return;
      }

      const response = await api.post(
        "/admin/partner/payment-add-manual-admin",
        {
          amount: amountToAdd,
          userid: recordId,
        },
      );

      console.warn(response.data.status);

      if (response.data.status == true) {
        notification.success({
          message: "Success",
          description: "Amount added successfully.",
        });
      }
      setIsAddAmountModalVisible(false);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  };

  const handlefreezeSubmit = async () => {
    if (isLoading || isButtonDisabled) {
      return;
    }
    setIsLoading(true);
    setIsButtonDisabled(true);

    try {
      const errors = {};

      if (!amountToAdd) {
        errors.amountToAdd = "Amount is required";
        setValidationErrors(errors);
        return;
      }

      const response = await api.post("/admin/partner/freez-amount-update", {
        freezeAmountPayout: amountToAdd,
        userid: recordId,
      });

      console.warn(response.data.status);

      if (response.data.status == true) {
        notification.success({
          message: "Success",
          description: "Freeze Amount added successfully.",
        });
      }
      setIsAddAmountModalVisible1(false);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <div>
      <div className="overviewBorder">
        <Row justify="space-between" align="middle">
          <Col xs={24} md={12}>
            <Card className="small_card">
              <PageTitle titles={titles} />
            </Card>
          </Col>
          <Col xs={24} md={10} lg={6}>
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
      <Modal
        title="Add Amount"
        visible={isAddAmountModalVisible}
        onCancel={() => setIsAddAmountModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsAddAmountModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleAddAmountSubmit}
            disabled={isButtonDisabled}
          >
            Submit
          </Button>,
        ]}
      >
        <Input
          type="number"
          placeholder="Enter Amount"
          value={amountToAdd}
          onChange={handleAmountChange}
        />
        {validationErrors.amountToAdd && (
          <div style={{ color: "red" }}>{validationErrors.amountToAdd}</div>
        )}
      </Modal>

      <Modal
        title="Add Freeze Amount"
        visible={isAddAmountModalVisible1}
        onCancel={() => setIsAddAmountModalVisible1(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsAddAmountModalVisible1(false)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handlefreezeSubmit}
            disabled={isButtonDisabled}
          >
            Submit
          </Button>,
        ]}
      >
        <Input
          type="number"
          placeholder="Enter Amount"
          value={amountToAdd}
          onChange={handleFreezeChange}
        />
        {validationErrors.amountToAdd && (
          <div style={{ color: "red" }}>{validationErrors.amountToAdd}</div>
        )}
      </Modal>
    </div>
  );
};

export default PayINPayOUTList;
