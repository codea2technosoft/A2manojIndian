import React, { useState, useEffect } from "react";
import { Progress } from "antd";
// style
import 'assets/styles/components/activation-card.scss';
// request
import { getProfileProgress } from "requests/auth";
import KycForm from "components/Forms/KycForm";

const UserActivationCard = ({className}) => {
    const [progress, setProgress] = useState(0);
    const [visibleForm, setVisibleForm] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const response = await getProfileProgress();
            setProgress(response.completed_percentage);
        }

        getData();
    }, []);

    const openActivationForm = () => {
        setVisibleForm(true);
    }

    return (
        <React.Fragment>
            <div className={`activation-card ${className}`} onClick={openActivationForm}>
                <div className="activation-card--title">Account activation</div>
                <Progress percent={progress} showInfo={false} strokeColor='#FFF' trailColor="#8c8c8c" />
                <div className="activation-card--subtitle">{progress}% Complete</div>
            </div>
            {/* <KycForm 
                defaultVisible={visibleForm}
                onOpen={() => setVisibleForm(true)}
                onClose={() => setVisibleForm(false)}
            /> */}
        </React.Fragment>
    )
}

export default UserActivationCard;