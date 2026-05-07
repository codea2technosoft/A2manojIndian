import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Row,Select, Spin, Table, Button, Modal,  Switch } from 'antd';
import TableBar from "components/TableBar";
import { useLocation, useNavigate, Link } from 'react-router-dom';
// import { parseQueryParams, stringifyQueryParams } from "utils/url";
import api from 'utils/api';
// import { deletePayoutsBeneficiaryAccounts } from 'requests/list';
// import { BaseSelect } from 'components/Elements';
import PageTitle from 'components/PageTitle';
import { Delete } from "react-iconly";
const { Option } = Select;

const BeneficiallyList = () => {
  const config = useSelector(state => state.config);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isMerchantEnabled, setIsMerchantEnabled] = useState(false);
  const [isSettlementEnabled, setIsSettlementEnabled] = useState(false);
  const [isServicesEnabled, setIsServicesEnabled] = useState(false);
  const [isPayoutEnabled, setIsPayoutEnabled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const columns = [
    // {
    //   title: 'ID',
    //   key: 'id',
    //   dataIndex: 'id'
    // },
    {
      title: 'Beneficiary Name',
      key: 'name',
      dataIndex: 'name'
    },

    {
      title: 'Account Number',
      key: 'account_number',
      dataIndex: 'account_number',
    },

    {
      title: 'IFSC Code',
      key: 'ifsc_code',
      dataIndex: 'ifsc_code',
    },

    {
      title: 'Bank Name',
      key: 'bank_name',
      dataIndex: 'bank_name'
    },

    ,
    {
      title: 'Status',
      render: (text, record) => (
          <div style={{color:'blue'}}>{record.status ? <div>{record.status}</div> : null}</div>
      )
  },
   

    {
      title: 'Verify',
      render: (record) => {
        if (record.status === 'pending') {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => handleVerify(record.id)}>Verify</Button>
              <Button type="link" size="small" onClick={() => onDelete(record.id)}>
                <Delete set="light" primaryColor="red" />
              </Button>
            </div>
          );
        } else {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ color: 'green' }}>Verified</div>
              <Button type="link" size="small" onClick={() => onDelete(record.id)}>
                <Delete set="light" primaryColor="red" />
              </Button>
            </div>
          );
        }
      },
    },
  ];



  const fetchManagerList = async (keyword = '', currentPage = 1) => {
    setIsTableLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    let status = urlParams.get('status');
    // alert(created_at_date_min);
    try {
      const response = await api.get('/beneficiary-data-manager', {
        params: { keyword, page: currentPage, status, },
      });

      const data = response.data;
      setRecords(data.records);
      setPage(data.page);
      setPerPage(data.per_page);
      setTotalCount(data.total_records);
    } catch (error) {
      console.error('Error fetching BeneficiaryList:', error);
    }
    setIsTableLoading(false);
  };

  useEffect(() => {
    const queryParams = parseQueryParams(location);
    fetchManagerList(queryParams.keyword || '', queryParams.page || 1, status);
  }, [location.search, status]);

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

    fetchManagerList(keyword);
  };


  const parseQueryParams = (location) => {
    const searchParams = new URLSearchParams(location.search);
    const queryParams = {};
    for (let [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }
    return queryParams;
  };


  const stringifyQueryParams = (queryParams) => {
    const searchParams = new URLSearchParams();
    for (let key in queryParams) {
      searchParams.set(key, queryParams[key]);
    }
    return searchParams.toString();
  };


  const handleVerify = async (id) => {
    try {
      const response = await api.get('beneficiary-data-success', { params: { id } });
      if (response.data.message === "success" && response.data.records) {
        const updatedData = data.map((item) => {
          if (item.id === id) {
            return { ...item, status: 'success', ...response.data.records };
          }
          return item;
        });
        setData(updatedData);
        console.log('Verification successful');
        fetchManagerList();
      } else {
        console.error('Verification failed');
      }
    } catch (error) {
      console.error('Error during verification:', error);
    }
  };

  const onDelete = (id) => {
    Modal.confirm({
      title: "Warning",
      content: "Are you sure to delete this record?",
      onOk: async () => {
        await api.post('/beneficiary-data-delete', { id });
        // refresh list
        navigate({
          pathname: location.pathname,
          search: stringifyQueryParams({}),
        });
      },
    });
  };


  const onChangePaymentStatus = (value) => {
		let query = parseQueryParams(location);
		// alert(value.target.value);
		if (value.target.value != ' ') {
			query = {
				...query,
				status: value.target.value
			};
		} else {
			delete query.status;
		}
		
		navigate({
			pathname: location.pathname,
			search: stringifyQueryParams(query),

		});
  }

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
  
  const titles = [{ title: 'Beneficially' }];



  return (
    <div className="wrap-orders">
      <PageTitle titles={titles} />
      <Row justify='space-between' className='mt-16'> 
        <TableBar showFilter={false} onSearch={onSearch} />
        {/* <BaseSelect className=' ml-24'
          options={config.pay_statuses}
          optionLabel='display'
          optionValue='value'
          defaultText='Status'
          selected=''
          style={{ width: 230 }}
          onChange={(value) => onChangePaymentStatus(value)}
        /> */}

        {/* <Select placeholder="Status" className=' ml-24'
          style={{ width: 180, marginRight: '1rem' }}
          value={status}
          onChange={(value) => setStatus(value)}
        > 
          <Option value="1">Success</Option>
          <Option value="2">Pending</Option>
        </Select> */}
        <select style={{ width: 230, marginLeft: 20 }} onChange={(value) => onChangePaymentStatus(value)} className='payout-select'>
          <option value=" ">Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
        </select>
        <Link to="/manager-setting-user-detail">
        <Button type="primary" size='large' style={{ width: 115, height: 48 }}><span style={{ marginRight: '7px', fontSize: '20px' }}>&larr;</span> Back</Button>
      </Link>
      </Row>
     
      <Spin spinning={isTableLoading}>
        <Table
          style={{ marginTop: '10px' }}
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
            x: true
          }}
        />
      </Spin>



    </div>
  );
};
export default BeneficiallyList;
