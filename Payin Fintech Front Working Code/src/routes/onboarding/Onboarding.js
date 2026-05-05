import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, Switch, Button } from 'antd';
import PageTitle from 'components/PageTitle';
import Modules from './Modules';
import Services from './Services';
import Result from './Result';
// styles
import styleVariables from 'assets/styles/variables.scss';
// requests
import { getModules } from 'requests/module';

const { Title } = Typography;

const Onboarding = () => {
    const titles = [{ path: '/integration/onboarding', title: 'Onboarding' }];

    const [view, setView] = useState('modules');
    const [modules, setModules] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = await getModules();
            
            setModules(response.records);
            setSelectedModules(response.records);
        }

        getData();
    }, []);

    const renderView = (view) => {
        switch (view) {
            case 'modules': return (
                <Modules 
                    modules={modules}
                    selectedModules={selectedModules}
                    onUpdateSelectedModules={setSelectedModules} 
                    onNext={() => setView('services')}
                />
            );
            case 'services': return (
                <Services 
                    modules={selectedModules}
                    onNext={() => setView('results')}
                />
            );
            case 'results': return <Result />;
            default: return <div></div>;
        }
    }

    return (
        <div>
            <PageTitle titles={titles} />
            {renderView(view)}
        </div>
    )
}

export default Onboarding;