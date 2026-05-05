import PropTypes from 'prop-types';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import React from 'react';

const { Title } = Typography;

const PageTitle = (props) => {
    const { titles } = props;

    return (
        <Title level={1} className='page-title'>
            {
                titles.map((item, index) => {
                    if (index === titles.length - 1) {
                        return (
                            // <span key={index}>{title}</span>
                            <Link key={index} to={item.path} className='active'>{item.title}</Link>
                        )
                    } else {
                        return (
                            <React.Fragment key={index}>
                                <Link to={item.path} className='inactive'>{item.title}</Link>
                                <span className='inactive'> - </span>
                            </React.Fragment>
                            // <span key={index} className='inactive'>{item.title} - </span>
                        )
                    }
                })
            }
        </Title>
    )
}

PageTitle.propTypes = {
    titles: PropTypes.array,
}

export default PageTitle;