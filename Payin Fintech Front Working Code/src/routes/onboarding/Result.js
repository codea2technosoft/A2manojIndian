import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';

const OnboardingResult = () => {
    const navigate = useNavigate();

    const goToPricingPage = () => {
        navigate('/pricing');
    }

    return (
        <div>
            <Result
                status="success"
                title="All services are onboarded!"
                subTitle="You already onboarded with our services. Next step is choose suitable plan for your business."
                extra={[
                    <Button type="primary" onClick={goToPricingPage}>
                        Go to Pricing
                    </Button>
                ]}
            />
        </div>
    )
}

export default OnboardingResult;