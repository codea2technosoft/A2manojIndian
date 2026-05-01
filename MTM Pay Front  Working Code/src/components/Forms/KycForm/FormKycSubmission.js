import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Typography, Row } from "antd";

const { Title } = Typography;

const FormKycSubmission = (props) => {
    const { defaultAgreed, onSubmit, onBack } = props;

    const [agree, setAgree] = useState(false);

    useEffect(() => {
        setAgree(defaultAgreed);
    }, [defaultAgreed])

    return (
        <React.Fragment>
            <Title level={3}>Submission</Title>
            <Form.Item name="is_agreed_policy" valuePropName="checked">
                <Checkbox onChange={(e) => setAgree(e.target.checked)}>
                    I have read and understood the <a href="#">Terms & Conditions</a>, <a href="#">Merchant Agreement</a> and the <a href="#">Privacy Policy</a>.
                    By submitting the form, I agree to abide by the rules at all times.
                </Checkbox>
            </Form.Item>

            <div className="mt-36">
                Please review the form before submitting. For any changes after submission, you can write to support.
                After you submit the form, we will onboard you with our partners.
            </div>
            <Row className="submission-buttons" justify="end">
                <Button type="default" size="large" className="mr-16" onClick={onBack}>Back</Button>
                <Button type="primary" htmlType="submit" size="large" disabled={!agree} onClick={onSubmit}>Submit and Onboard</Button>
            </Row>

        </React.Fragment>
    )
}

export default FormKycSubmission;