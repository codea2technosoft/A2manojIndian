import { Row, Button } from 'antd';
import { Link } from 'react-router-dom';
// images
import Image401 from 'assets/images/401.png';

const Error401 = () => {
    return (
        <Row align="middle" justify="center" className='error-container'>
            <img src={Image401} alt="401 Unauthorized" className="error-image" />
            <Link to='/signin' className='mt-32'>
                <Button type='primary' size='large'>Go to Signin page</Button>
            </Link>
        </Row>
    );
}

export default Error401;