import React, { useEffect, useRef, useState } from "react";
import {
  Spin,
  Table,
  Button,
  Tag,
  Row,
  Col,
  Card,
  RangePicker,
  Tabs,
  Modal,
  Form,
  Input,
} from "antd";
import { useLocation, useNavigate, Link, NavLink } from "react-router-dom";
import PageTitle from "components/PageTitle";
import DatePicker from "components/DatePicker";
import dayjs from "dayjs";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
// request

const Transaction = () => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [visibleForm, setVisibleForm] = useState(false);
  const [dates, setDates] = useState([dayjs(), dayjs()]);
  const [mode, setMode] = useState("today");
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const titles = [{ path: location.pathname, title: "Withdrawals" }];
  const onSetDatesByDatePicker = (dates) => {
    setMode("custom");
    setDates(dates);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
  };

  const columns = [
    {
      title: "Customer Details",
      dataIndex: "name",
    },
    {
      title: "ID",
      dataIndex: "age",
    },
    {
      title: "Transfer Amount",
      dataIndex: "address",
    },
    // {
    //   title: "Amount Transfer Portal",
    //   dataIndex: "portal",
    // },
    // {
    //   title: "Amount Transfer Bank",
    //   dataIndex: "bank",
    // },
    {
      title: "Created At",
      dataIndex: "date",
    },
  ];

  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "5011",
      // portal: "payin",
      // bank: "payout",
      date: "16/01/2024",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "46111",
      // portal: "payin",
      // bank: "payout",
      date: "16/01/2024",
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "400",
      // portal: "payin",
      // bank: "payout",
      date: "16/01/2024",
    },
    {
      key: "4",
      name: "Joe Black",
      age: 32,
      address: "54500",
      // portal: "payin",
      // bank: "payout",
      date: "16/01/2024",
    },
  ];

  // useEffect(() => {
  //     const query = parseQueryParams(location);
  //     getRecords(query);
  // }, [location]);

  // const getRecords = async (query) => {
  //     try {
  //         setIsTableLoading(true);
  //         const response = await getPayouts(query);

  //         setRecords(response.records);
  //         setPage(response.page);
  //         setPerPage(response.per_page);
  //         setTotalCount(response.total_records);
  //     } catch (err) {
  //         console.log(err);
  //     } finally {
  //         setIsTableLoading(false);
  //     }
  // };

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

  const onChange = (key) => {
    console.log(key);
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

  const renderStatus = (text) => {
    switch (text) {
      case "queued":
        return <Tag color="volcano">{text}</Tag>;
      case "pending":
        return <Tag color="gold">{text}</Tag>;
      case "rejected":
        return <Tag color="red">{text}</Tag>;
      case "processing":
        return <Tag color="blue">{text}</Tag>;
      case "processed":
        return <Tag color="green">{text}</Tag>;
      case "cancelled":
        return <Tag color="red">{text}</Tag>;
      case "reversed":
        return <Tag color="purple">{text}</Tag>;
      default:
        return null;
    }
  };

  // const onCreate = async (data) => {
  //     try {
  //         setIsTableLoading(true);
  //         await createPayouts(data);

  //         // refresh
  //         onRefresh()
  //     } catch (err) {
  //         console.log(err);
  //     } finally {
  //         setIsTableLoading(false);
  //     }
  // }

  const items = [
    {
      key: "1",
      label: "PayIN",
      children: (
        <>
          <Row gutter={[16, 16]} align={"middle"} justify={"space-between"}>
            <Col xs={24} sm={24} md={8} lg={8} xl={7}>
              <Card className="small_card">
                <TableBar
                  onSearch={onSearch}
                  showFilter={false}
                  placeholderInput="Search..."
                  inputRef={searchRef}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={4}>
              <Card className="small_card">
                <Button type="primary" size="large" onClick={showModal}>
                  Add New
                </Button>
              </Card>
            </Col>
          </Row>
          <Spin spinning={isTableLoading}>
            <Table
              style={{ marginTop: "10px" }}
              dataSource={data}
              columns={columns}
              onChange={onChangeTable}
              rowKey={"id"}
              pagination={{
                pageSize: perPage,
                total: totalCount,
                current: page,
              }}
            />
          </Spin>
        </>
      ),
    },
    {
      key: "2",
      label: "Payout",
      children: (
        <>
          <Row gutter={[16, 16]} align={"middle"} justify={"space-between"}>
            <Col xs={24} sm={24} md={8} lg={8} xl={7}>
              <Card className="small_card">
                <TableBar
                  onSearch={onSearch}
                  showFilter={false}
                  placeholderInput="Search..."
                  inputRef={searchRef}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={4}>
              <Card className="small_card">
                <Button type="primary" size="large" onClick={showModal2}>
                  Add New
                </Button>
              </Card>
            </Col>
          </Row>
          <Spin spinning={isTableLoading}>
            <Table
              style={{ marginTop: "10px" }}
              dataSource={data}
              columns={columns}
              onChange={onChangeTable}
              rowKey={"id"}
              pagination={{
                pageSize: perPage,
                total: totalCount,
                current: page,
              }}
            />
          </Spin>
        </>
      ),
    },
  ];

  return (
    <div>
      {/* <PageTitle titles={titles} /> */}
      <div>
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
          indicatorSize={(origin) => origin - 16}
        />
      </div>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} title="PayIN Whitelist">
        <Form layout="vertical">
          <Input placeholder="Enter IP for PayIn Whitelist" />
        </Form>
      </Modal>

      <Modal
        title="Payout Whitelist"
        open={isModalOpen2}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Input placeholder="Enter IP for Payout Whitelist" />
        </Form>
      </Modal>
      {/* <Row gutter={[16, 16]} align={"middle"} justify={"space-between"}>
        <Col xs={24} sm={24} md={8} lg={8} xl={7}>
          <Card className="small_card">
            <TableBar
              onSearch={onSearch}
              showFilter={false}
              placeholderInput="Search..."
              inputRef={searchRef}
              children={
                <div>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setVisibleForm(true)}
                  >
                    Create new payouts
                  </Button>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={7}>
          <Card className="small_card">
            <RangePicker
              value={dates}
              onCalendarChange={(newDates) => onSetDatesByDatePicker(newDates)}
            />
          </Card>
        </Col>
      </Row> */}
    </div>
  );
};

export default Transaction;
