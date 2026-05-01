import { Row } from 'antd';
// images
import Image404 from 'assets/images/404.png';

const Error404 = () => {
    return (
        <Row align="middle" justify="center" className='error-container'>
            <img src={Image404} alt="404 Not found" className="error-image" />
        </Row>
    );
}

export default Error404;