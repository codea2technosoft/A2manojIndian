import React from 'react';
import { Typography } from 'antd';

// import blackLogoIcon from 'assets/images/processing2.gif';
const { Title } = Typography;
const Loading = (props) => {
    return (
        <div className="loader">
            <div className="loader-logoo">
                {/* <img src={blackLogoIcon} /> */}
                <div class="Load-container">
                    <div class="ring"></div>
                    <div class="ring"></div>
                    <div class="ring"></div>
                    <div class="middle">Loading</div>
                </div>
            </div>
            {/* <Title level={4} className="mt-16">
                Loading...
            </Title> */}
        </div>
    );
};

export default Loading;
