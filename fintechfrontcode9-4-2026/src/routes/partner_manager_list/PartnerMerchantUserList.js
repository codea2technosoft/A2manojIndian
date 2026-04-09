import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Spin, Table, Card, Col, Row, InputNumber, Button } from "antd";
import { useLocation, useNavigate, Link } from "react-router-dom";
import _ from "lodash";
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

const PartnerMerchantUserList = () => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState();
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [characters, setCharacters] = useState(["a", "b", "c", "d", "e"]);

  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const config = useSelector((state) => state.config);

  const titles = [
    { path: location.pathname, title: "Partner Merchant User List" },
  ];

  const columns = [
    // {
    //     title: 'Email',
    //     key: 'email',
    //     dataIndex: 'email'
    // },

    {
      title: "Merchant Detail",
      render: (text, record) => (
        <div>
          <div>
            <a href={`mailto:${record.email}`}>{record.email}</a>
          </div>
          <div>
            <span> {record.simple_pass}</span>
          </div>
        </div>
      ),
    },

    
    {
      title: "Payout",
      key: "payout_permission_assign",
      dataIndex: "payout_permission_assign",
      render: (text, record) => {
        return (
          <Link to={`/payout-list?partnerid=${record.id}`}>
            <Button className="color1">Payout</Button>
          </Link>
        );
      },
    },

  ];
  
  const handleClick = (id) => {
    window.location.href = `/payin-list?partnerid=${id}`;
  };
  const handleClick1 = (id) => {
    window.location.href = `/payout-list?partnerid=${id}`;
  };
  const handleClick2 = (id) => {
    window.location.href = `/chargeback-lazdar-list?partnerid=${id}`;
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

  // const onUpdate = _.debounce(async (id) => {
  //     try {
  //         // setIsTableLoading(true);
  //         console.warn(id+'sdsdsd');
  //         await partnerpayoutpayinpermission(id);
  //     } catch (err) {
  //         console.log(err);
  //         } finally {
  //         // setIsTableLoading(false);
  //     }
  // }, 500);

  const onSearch = (keyword, char) => {
    let query = parseQueryParams(location);
    query = {
      ...query,
      page: 1,
      keyword: keyword,
    };

    // const filtered = characters.filter((c) => c.toLowerCase() === char.toLowerCase());
    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });
    // getRecords(filtered)
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
        <Row justify="space-between" align='middle'>
          <Col xs={24} md={12}>
          <Card className="small_card">
            <PageTitle titles={titles} />
          </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
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
            showTotal: (total) => `Total ${total} items`,
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

export default PartnerMerchantUserList;
