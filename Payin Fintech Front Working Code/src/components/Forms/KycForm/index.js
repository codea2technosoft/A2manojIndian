import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Col, Modal, Row, Typography, Form, Button, Menu, Spin } from "antd";
import FormKycBankAccount from "./FormKycBankAccount";
import FormKycBusinessDetail from "./FormKycBusinessDetail";
import FormKycBusinessOverview from "./FormKycBusinessOverview";
import FormKycContact from "./FormKycContact";
import FormKycDocumentVerification from "./FormKycDocumentVerification";
import FormKycSubmission from './FormKycSubmission';
import KycWelcome from './KycWelcome';
import KycNotice from './KycNotice';
import KycSuccessNotice from './KycSuccessNotice';
import { CheckIcon } from '@heroicons/react/outline';
import { toast } from 'react-toast';
import regex from 'utils/regex';
import _ from 'lodash';
// requests
import { searchGstin, getCinInfo } from 'requests/common';
import { getCountries, getStates } from 'requests/country';
import { getIpInfo } from "requests/common";
import { getKyc, createKyc, updateKyc } from 'requests/kyc';
import { updateAuthUserAction as updateAuthUser } from 'redux/actions/auth';
// css
import 'assets/styles/components/kyc-form.scss';

const { Title } = Typography;

const KycForm = (props) => {
    const { defaultVisible, onOpen, onClose } = props;

    const [type, setType] = useState('welcome');
    const [step, setStep] = useState(0);
    const [stepItems, setStepItems] = useState([
        { name: 'Contact information', key: 0 },
        { name: 'Business overview', key: 1 },
        { name: 'Business details', key: 2 },
    ]);
    const [completeSteps, setCompleteSteps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [data, setData] = useState({});
    const [countries, setCountries] = useState([]);
    const [defaultCountry, setDefaultCountry] = useState({});
    const [states, setStates] = useState([]);

    const user = useSelector(state => state.auth.authUser);

    const dispatch = useDispatch();

    const [formRef] = Form.useForm();

    useEffect(() => {
        const getData = async () => {
            try {
                const kycResponse = await getKyc();
                const initialData = {
                    ...kycResponse.kyc_information,
                    ...user,
                    is_same_operational_address: false,
                };
                if (initialData.has_gstin === null || initialData.has_gstin === undefined) initialData.has_gstin = '1';
                if (initialData.authorized_signature_address_proof === null || initialData.authorized_signature_address_proof === undefined) initialData.authorized_signature_address_proof = '1';
                if (initialData.address === initialData.operational_address && initialData.pincode === initialData.operational_pincode
                    && initialData.city === initialData.operational_city && initialData.state_id === initialData.operational_state_id) {
                    initialData.is_same_operational_address = true;
                }
                if (!initialData.accept_payment) initialData.accept_payment = '0';

                const defaultCompleteSteps = determineCompletedSteps(initialData);
                const uncompletedSteps = _.difference([0, 1, 2, 3, 4, 5], defaultCompleteSteps);

                setCompleteSteps(defaultCompleteSteps);
                if (uncompletedSteps.length) setStep(Math.min(...uncompletedSteps));
                else setStep(0);
                if (defaultCompleteSteps.length < 6) onOpen();

                const countryResponse = await getCountries({ is_paginate: 0 }); // get all countries
                setCountries(countryResponse.records);
                if (user.country_id) {
                    const userCountry = countryResponse.records.find(item => item.id === user.country_id);
                    if (userCountry) setDefaultCountry(userCountry);
                    // get states
                    const stateResponse = await getStates(user.country_id, { is_paginate: 0 });
                    setStates(stateResponse.records);
                } else {
                    const ipResponse = await getIpInfo();

                    if (ipResponse.data && ipResponse.data.country) {
                        setDefaultCountry(ipResponse.data.country);
                        initialData.country_id = ipResponse.data.country.id;
                    }
                }

                setData(initialData);
                
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        getData();
    }, []);

    useEffect(() => {
        if (step === 2) {
            setStepItems([
                { name: 'Contact information', key: 0 },
                { name: 'Business overview', key: 1 },
                { name: 'Business details', key: 2 },
            ]);
        } else if (step >= 3 && step <= 5) {
            if (stepItems.length < 6) {
                setStepItems([
                    ...stepItems,
                    { name: 'Bank account', key: 3 },
                    { name: 'Document Verification', key: 4 },
                    { name: 'Submit form', key: 5 },
                ]);
            }
        } else if (step === 6) {
            setType('success');
        }
    }, [step]);

    const onChangeCountry = async (country) => {
        setDefaultCountry(country);
        formRef.setFieldsValue({
            country_id: country.id
        });
        // get states
        const stateResponse = await getStates(country.id, { is_paginate: 0 });
        setStates(stateResponse.records);
    }

    const determineCompletedSteps = (data) => {
        const steps = [];

        if (data.full_name && data.country_id && data.mobile && data.email) {
            steps.push(0);
        }
        if (data.business_type && data.business_category && data.business_description && data.accept_payment) {
            if ((Number(data.accept_payment) === 1 && data.website_url) || Number(data.accept_payment) === 0) {
                steps.push(1);
            }
        }
        if (data.business_pan && data.business_name && data.cin && data.authorised_signatory_pan && data.pan_owner_name
            && data.address && data.pincode && data.city && data.state_id && data.operational_address && data.operational_pincode
            && data.operational_city && data.operational_state_id) {
            steps.push(2);
        }
        if (data.beneficiary_name && data.branch_ifsc_code && data.bank_account_number) {
            steps.push(3);
        }
        if (data.authorized_signature_address_proof && data.id_card_front_image && data.id_card_back_image && data.business_registration_proof && data.company_pan) {
            steps.push(4);
        }
        if (data.is_agreed_policy) {
            steps.push(5);
        }

        return steps;
    }

    const onSearchGstin = async (value) => {
        try {
            const gstinValue = String(value).toUpperCase();

            formRef.setFieldsValue({
                gstin: gstinValue
            });
            if (regex.gstin.test(gstinValue)) {
                const response = await searchGstin(gstinValue);

                const selectedState = states.find(state => state.name.toLowerCase() === response.principal_address.state.toLowerCase());

                formRef.setFieldsValue({
                    business_pan: gstinValue.substring(2, 12),
                    business_name: response.business_name,
                    billing_label: response.business_name,
                    address: [response.principal_address.door_number, response.principal_address.building, response.principal_address.street, response.principal_address.location].join(', '),
                    city: response.principal_address.city,
                    pincode: response.principal_address.pincode,
                    state_id: selectedState ? selectedState.id : null,
                    beneficiary_name: response.business_name,
                });

                if (data.is_same_operational_address) {
                    formRef.setFieldsValue({
                        operational_address: [response.principal_address.door_number, response.principal_address.building, response.principal_address.street, response.principal_address.location].join(', '),
                        operational_city: response.principal_address.city,
                        operational_pincode: response.principal_address.pincode,
                        operational_state_id: selectedState ? selectedState.id : null,
                    });
                }

                onLookupCin(response.business_name);
            } else {
                formRef.setFields([
                    {
                        name: 'gstin',
                        errors: ['Invalid GSTIN number']
                    }
                ]);
            }
        } catch (err) {
            formRef.setFields([
                {
                    name: 'gstin',
                    errors: ['Invalid GSTIN number']
                }
            ]);
        }
    }

    const onLookupCin = async (companyName) => {
        const response = await getCinInfo({ company_name: companyName });
        if (response.data.success && response.data.companyList && response.data.companyList.length) {
            formRef.setFieldsValue({
                cin: response.data.companyList[0].companyID
            });
        }
    }

    const renderFormStep = (step) => {
        switch (step) {
            case 0: return (
                <FormKycContact
                    countries={countries}
                    defaultCountry={defaultCountry}
                    onChangeCountry={onChangeCountry}
                    disablePhoneInput={!!user.mobile_verified_at && !!user.country_id}
                />
            );
            case 1: return <FormKycBusinessOverview formRef={formRef} defaultAcceptPayment={data.accept_payment} />;
            case 2: return (
                <FormKycBusinessDetail
                    defaultHasGstin={data.has_gstin}
                    defaultSameOperationalAddress={data.is_same_operational_address}
                    states={states}
                    visibleCin={['3', '4'].includes(data.business_type)} // CIN field should show only if business type is private limited company or public limited company
                    isIndividualPan={data.business_type === '10'} // individual
                    onValidateGstin={onSearchGstin}
                    onLookupCin={onLookupCin}
                />
            );
            case 3: return <FormKycBankAccount />;
            case 4: return <FormKycDocumentVerification formRef={formRef} />;
            case 5: return <FormKycSubmission defaultAgreed={!!data.is_agreed_policy} onBack={onBack} onSubmit={onSubmit} />
            default: return null;
        }
    }

    const onBack = () => {
        setStep(step - 1);
    }

    const onSubmit = () => {
        formRef.validateFields().then(async formData => {
            try {
                setLoadingSubmit(true);

                const newData = { ...data, ...formData };
                if (newData.is_same_operational_address) {
                    newData.operational_address = newData.address;
                    newData.operational_pincode = newData.pincode;
                    newData.operational_city = newData.city;
                    newData.operational_state_id = newData.state_id;
                }

                setData(newData);
                // add step to completed steps
                if (!completeSteps.includes(step)) {
                    setCompleteSteps([...completeSteps, step]);
                }

                if (step === 0) {
                    await dispatch(updateAuthUser(formData));
                } else if (step === 1) {
                    if (!formData.business_subcategory) formData.business_subcategory = '';
                    await createKyc(formData);
                } else {
                    if (step === 2) {
                        // saving to formData
                        formData.operational_address = newData.address;
                        formData.operational_pincode = newData.pincode;
                        formData.operational_city = newData.city;
                        formData.operational_state_id = newData.state_id;
                        // remove unused fields
                        delete formData.has_gstin;
                        delete formData.is_same_operational_address;
                    }
                    await updateKyc(formData, step - 1);
                }

                // go to next form step
                if (step === 2) setType('notice');
                if (step === 5) setType('success');
                setStep(step + 1);
            } catch (err) {
                if (err.response) toast.error(err.response.data.message);
                else toast.error('An error occurs. Please try again.');
            } finally {
                setLoadingSubmit(false);
            }

        });
    }

    const renderForm = () => {
        return (
            <React.Fragment>
                {
                    !loading ? (
                        <Row>
                            <Col xs={24} sm={24} md={8} lg={8} className="kyc-form--sidebar">
                                <div className='mr-24'>
                                    <Title level={3}>KYC Form</Title>
                                    <p>Complete and submit the form to accept payments.</p>
                                </div>
                                <Menu selectedKeys={[String(step)]}>
                                    {
                                        stepItems.map((item) => {
                                            const isCompleted = completeSteps.includes(item.key);

                                            return (
                                                <Menu.Item key={item.key}>
                                                    <div className={`kyc-form--sidebar-item-content ${isCompleted ? "kyc-form--sidebar-item-completed" : ""}`}>
                                                        <span className="kyc-form--sidebar-check">{isCompleted ? <CheckIcon width={24} height={24} /> : null}</span>
                                                        {item.name}
                                                    </div>
                                                </Menu.Item>
                                            )
                                        })
                                    }
                                </Menu>
                            </Col>
                            <Col xs={24} sm={24} md={16} lg={16} className="kyc-form--content">
                                <Spin spinning={loadingSubmit}>
                                    <Form
                                        layout="vertical"
                                        autoComplete="off"
                                        form={formRef}
                                        initialValues={data}
                                    >
                                        {renderFormStep(step)}
                                    </Form>
                                </Spin>
                                {
                                    step < 5 ? (
                                        <Row justify="end" align="middle" className="mt-16">
                                            <div>
                                                {
                                                    step > 0 && <Button className='mr-16' type="default" onClick={onBack}>Back</Button>
                                                }
                                                <Button type="primary" onClick={onSubmit}>Save & Next</Button>
                                            </div>
                                        </Row>
                                    ) : null
                                }
                            </Col>
                        </Row>
                    ) : (
                        <Row className='mt-32 mb-32' justify='center'>
                            <Spin size='large' />
                        </Row>
                    )
                }
            </React.Fragment>
        )
    }

    const renderContent = () => {
        switch (type) {
            case 'welcome': return <KycWelcome onContinue={() => setType('form')} onClose={onClose} />;
            case 'form': return renderForm();
            case 'notice': return <KycNotice onContinue={() => setType('form')} />;
            case 'success': return <KycSuccessNotice onClose={onClose} />;
            default: return null;
        }
    }

    return (
        <Modal
            visible={defaultVisible}
            closable={type === 'form'}
            footer={null}
            width={['welcome', 'form'].includes(type) ? 1000 : 520}
            className="kyc-form"
            onCancel={onClose}
        >
            {
                renderContent()
            }
        </Modal>
    )
}

KycForm.propTypes = {
	onOpen: PropTypes.func,
	onClose: PropTypes.func,
};
KycForm.defaultProps = {
    onOpen: () => {},
    onClose: () => {},
};

export default KycForm;