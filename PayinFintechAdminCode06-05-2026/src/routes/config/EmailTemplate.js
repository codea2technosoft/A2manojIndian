import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import EmailEditor from 'react-email-editor';
import PageTitle from 'components/PageTitle';
import Loading from 'components/Loading';

const EmailTemplate = () => {
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    const titles = [
        { path: '/config', title: 'Config' },
        { path: location.pathname, title: 'Email Templates' },
    ];

    const emailEditorRef = useRef(null);

    const exportHtml = () => {
        emailEditorRef.current.editor.exportHtml((data) => {
            const { design, html } = data;
            console.log('exportHtml', html);
        });
    };

    const onLoad = () => {
        // editor instance is created
        // you can load your template here;
        // const templateJson = {};
        // emailEditorRef.current.editor.loadDesign(templateJson);
    }

    const onReady = () => {
        // editor is ready
        console.log('onReady');
    };

    return (
        <div>
            <PageTitle titles={titles} />
            <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
        </div>
    )
}

export default EmailTemplate;