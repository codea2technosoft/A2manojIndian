import { useState } from 'react';
import { Row, Checkbox, Card } from 'antd';

const CollapsibleCheckbox = (props) => {
    const { value, label, extraLabel, children, onClick } = props;

    const [isShowExtra, setIsShowExtra] = useState(false);

    const toggleShowExtra = () => {
        setIsShowExtra(!isShowExtra);
    }

    return (
        <div className="mb-16">
            <Row justify="space-between" align="middle" className="mb-8">
                <Checkbox value={value} onClick={onClick}>{label}</Checkbox>
                <div>
                    <small className="link" onClick={toggleShowExtra}>{isShowExtra ? 'Collapse' : extraLabel}</small>
                </div>
            </Row>
            {
                isShowExtra ? (
                    <Card>
                        {children}
                    </Card>
                ) : null
            }

        </div>
    )
}

export default CollapsibleCheckbox;