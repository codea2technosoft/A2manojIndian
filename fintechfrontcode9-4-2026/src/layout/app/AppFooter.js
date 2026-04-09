import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layout, Row, Col } from 'antd';
import logo from '../../assets/images/favicon.png';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
const { Footer } = Layout;

const AppFooter = () => {
    return (
        <Footer className="app-Footer">
            <Row gutter={[16][16]} justify={'space-between'} align={'middle'}>
                <Col xs={24} md={8}>
                    <div className="footer_link">
                        <img src={logo} alt="wallet" className="wallet" />
                        <NavLink className="ml-8" to={'https://payinfintech.com'}>
                            https://payinfintech.com
                        </NavLink>
                    </div>
                </Col>
                <Col xs={24} md={8}>
                    <div className="footer_link">
                        <MailOutlined />
                        <NavLink className="ml-8" to={'mailto:sales@payinfintech.com'}>
                            Sales@payinfintech.com
                        </NavLink>
                    </div>
                </Col>
                {/* <Col xs={24} md={8}>
                    <div className="footer_link">
                        <PhoneOutlined rotate={90} />
                        <NavLink className="ml-8" to={'tel:91-7339983554'}>
                            91-7339983554
                        </NavLink>
                    </div>
                </Col> */}
            </Row>
        </Footer>
    );
};

export default AppFooter;
