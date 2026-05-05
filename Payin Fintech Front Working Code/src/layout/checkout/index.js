import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Row, Modal, Button } from "antd";
import { Logout as LogoutIcon } from 'react-iconly';
// requests
import { logoutAction as logout } from 'redux/actions/auth';
// images
import logo from 'assets/images/logo.png';

const { Header, Content } = Layout;
const { confirm } = Modal;

const CheckoutLayout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const config = useSelector(state => state.config);

    const onLogout = () => {
        confirm({
            title: 'Are you sure you want to logout?',
            onOk: () => {
                dispatch(logout());
                navigate('/signin');
            }
        });
    }

    return (
        <Layout>
            <Header className='checkout-header'>
                <img src={logo} className="logo" />
                <Row>
                    {
                        config?.show_back_button && (
                            <Link to="/" className='mr-24'>
                                <Button type="primary">
                                    Back to dashboard
                                </Button>
                            </Link>
                        )
                    }
                    <Row className='link' align='middle' onClick={onLogout}>
                        <LogoutIcon set="light" />
                        <span className="ml-8"><b>Logout</b></span>
                    </Row>
                </Row>
            </Header>
            <Content>
                <div className="container">
                    {children}
                </div>
            </Content>
        </Layout>
    )
}

export default CheckoutLayout;