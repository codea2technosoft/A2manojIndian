import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Modal, Typography, Form, Input, Row, Col } from 'antd';
import BaseSelect from 'components/Elements/BaseSelect';
import { DEFAULT_QUERY } from 'constants/common';

// requests
import { getAdminMerchantlist } from 'requests/user';
import _ from 'lodash';

const { Title } = Typography;

const UserAssignForm = (props) => {
    const { visible, onClose, onSubmit } = props;

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState(DEFAULT_QUERY);

    const [formRef] = Form.useForm();

    useEffect(() => {
        if (visible) {
            const fetchUsers = async () => {
                try {
                    const data = await getAdminMerchantlist(query);
                    console.warn(data);
                    if (query.page === 1) setUsers(data.records);
                    else setUsers([...users, ...data.records]);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchUsers();
        }
    }, [visible, query]);

    const onSubmitData = () => {
        formRef.validateFields().then(async (data) => {
            try {
                setLoading(true);
                await onSubmit(data);
                // close modal
                onCancel();
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        });
    };

    const onCancel = () => {
        // clear form
        formRef.resetFields();
        setUsers([]);
        setQuery(DEFAULT_QUERY);

        onClose();
    };

    const onScrollEnd = () => {
        setQuery((preState) => {
            return { ...preState, page: preState.page + 1 };
        });
    };

    const onSearchUser = _.debounce((keyword) => {
        setQuery({ ...DEFAULT_QUERY, keyword: keyword });
    }, 1000);

    return (
        <Modal
            visible={visible}
            closable={false}
            onCancel={onCancel}
            onOk={onSubmitData}
            okButtonProps={{
                loading: loading,
            }}
            okText="Submit"
            width={700}
        >
            <Title level={4}>Assign users</Title>
            <Form layout="vertical" form={formRef} autoComplete='new-password' key={Date.now}>
                <Form.Item name="parent_id" label="Parent" rules={[{ required: true }]}>
                    <BaseSelect
                        options={users}
                        fetching
                        optionValue="id"
                        optionLabel="full_name"
                        additionalLabel='email'
                        defaultText='Select one'
                        showSearch
                        onSearch={onSearchUser}
                        onScrollEnd={onScrollEnd}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

UserAssignForm.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default UserAssignForm;
