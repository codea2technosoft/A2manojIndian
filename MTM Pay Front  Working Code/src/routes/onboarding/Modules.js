import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Typography, Switch, Button } from 'antd';
import {
    Wallet,
    Discovery,
    Notification,
    Chart,
    Plus
} from 'react-iconly';
// styles
import styleVariables from 'assets/styles/variables.scss';
// requests
import { getModules } from 'requests/module';

const { Title } = Typography;

const Modules = (props) => {
    const { modules, selectedModules, onUpdateSelectedModules, onNext } = props;
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        const ids = selectedModules.map(item => item.id);
        setSelectedIds(ids);
    }, [selectedModules]);

    const generateModuleIcon = (type) => {
        switch (Number(type)) {
            case 1: return <Wallet set='bulk' primaryColor={styleVariables.primaryColor} />;
            case 2: return <Discovery set='bulk' primaryColor={styleVariables.primaryColor} />;
            case 3: return <Notification set='bulk' primaryColor={styleVariables.primaryColor} />;
            case 4: return <Chart set='bulk' primaryColor={styleVariables.primaryColor} />;
            default: return <Plus set='bulk' primaryColor={styleVariables.primaryColor} />;
        }
    }

    const updateSelectedModules = (checked, module) => {
        const newSelectedModules = [...selectedModules];

        if (checked) {
            newSelectedModules.push(module);
        } else {
            const index = newSelectedModules.findIndex(item => item.id === module.id);
            newSelectedModules.splice(index, 1);
        }

        onUpdateSelectedModules(newSelectedModules);
    }

    return (
        <div>
            <p>Please choose modules which you want to onboard</p>

            <Row gutter={[16, 16]} className="mt-36">
                {
                    modules.map((module, index) => (
                        <Col key={index} xs={24} sm={24} md={12} lg={12}>
                            <Card>
                                <Row justify='space-between' align='top'>
                                    <div>
                                        {generateModuleIcon(module.type)}
                                        <Title level={5}>{module.name}</Title>
                                    </div>
                                    <Switch
                                        checked={selectedIds.includes(module.id)}
                                        onChange={(checked) => updateSelectedModules(checked, module)}
                                    />
                                </Row>
                                <p>{module.description}</p>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
            <Row justify="flex-start" className="mt-36">
                <Button size='large' type="primary" disabled={!selectedIds.length} onClick={onNext}>Onboarding</Button>
            </Row>
        </div>
    )
}

export default Modules;