import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Form, Typography, Upload } from "antd";
import { BaseSelect } from 'components/Elements';
import UploadArea from 'components/UploadArea';
import { generateBusinessPanLabel, generateBusinessProofLabel } from 'utils/common';
// request
import { uploadFile, removeFile } from 'requests/common';

const { Title } = Typography;

const FormKycDocumentVerification = (props) => {
    const { formRef } = props;

    const [selectedSignatureProof, setSelectedSignatureProof] = useState('Aadhar Card');

    const config = useSelector(state => state.config);

    const businessType = formRef.getFieldValue('business_type');

    const onChangeSignatureProof = (value, option) => {
        setSelectedSignatureProof(option.children);
    }

    const validateFile = (file) => {
        let isValid = false;

        const fileSize = file.size / (1024 * 1024);

        if (['image/jpeg', 'image/png'].includes(file.type) && fileSize <= 4) isValid = true;
        if (file.type === 'application/pdf' && fileSize <= 2) isValid = true;

        return isValid ? isValid : Upload.LIST_IGNORE;
    }

    const onUploadFile = async (name, fileList) => {
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('file[]', file.originFileObj);
        });

        const response = await uploadFile(formData);

        formRef.setFieldsValue({ [name]: response.path[0] });
    }

    const onRemoveFile = async (name) => {
        const path = formRef.getFieldValue(name);

        const response = await removeFile(path);
        formRef.setFieldsValue({ [name]: null });
    }


    return (
        <React.Fragment>
            <Title level={3}>Documents Verification</Title>
            <div className='mb-24'>You can upload JPG/PNG of max size 4MB or PDF of max size 2 MB</div>
            <Form.Item name="authorized_signature_address_proof" label="Authorized Signatory's Address Proof" rules={[{ required: true }]}>
                <BaseSelect
                    options={config.signature_proof_type}
                    optionLabel='display'
                    optionValue='value'
                    onSelect={onChangeSignatureProof}
                />
            </Form.Item>
            <Form.Item name="id_card_front_image" label={`${selectedSignatureProof} Front`} rules={[{ required: true }]}>
                <UploadArea
                    accept=".pdf,.jpg,.jpeg,.png"
                    beforeUpload={validateFile}
                    onChange={({ fileList }) => onUploadFile('id_card_front_image', fileList)}
                    onRemove={() => onRemoveFile('id_card_front_image')}
                />
            </Form.Item>
            <Form.Item name="id_card_back_image" label={`${selectedSignatureProof} Back`} rules={[{ required: true }]}>
                <UploadArea
                    accept=".pdf,.jpg,.jpeg,.png"
                    beforeUpload={validateFile}
                    onChange={({ fileList }) => onUploadFile('id_card_back_image', fileList)}
                    onRemove={() => onRemoveFile('id_card_back_image')}
                />
            </Form.Item>
            <Form.Item
                name="business_registration_proof"
                label={generateBusinessProofLabel(businessType)}
                rules={[{ required: businessType !== '9' }]}
                extra="Upload the scan of Certificate of Incorporation"
            >
                <UploadArea
                    accept=".pdf,.jpg,.jpeg,.png"
                    beforeUpload={validateFile}
                    onChange={({ fileList }) => onUploadFile('business_registration_proof', fileList)}
                    onRemove={() => onRemoveFile('business_registration_proof')}
                />
            </Form.Item>
            <Form.Item
                name="company_pan"
                label={generateBusinessPanLabel(businessType)}
                rules={[{ required: !['1', '9'].includes(businessType) }]}
                extra="PAN details should be of the mentioned business only."
            >
                <UploadArea
                    accept=".pdf,.jpg,.jpeg,.png"
                    beforeUpload={validateFile}
                    onChange={({ fileList }) => onUploadFile('company_pan', fileList)}
                    onRemove={() => onRemoveFile('company_pan')}
                />
            </Form.Item>
            <Form.Item name="other_document" label="Other document" rules={[{ required: ['6', '7', '8'].includes(businessType) }]}>
                <UploadArea
                    accept=".pdf,.jpg,.jpeg,.png"
                    beforeUpload={validateFile}
                    onChange={({ fileList }) => onUploadFile('other_document', fileList)}
                    onRemove={() => onRemoveFile('other_document')}
                />
            </Form.Item>
        </React.Fragment>
    )
}

export default FormKycDocumentVerification;