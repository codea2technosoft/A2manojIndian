import { Upload, Row, Button } from 'antd';
import { useEffect, useState } from 'react';
import {
    PaperPlus,
    Paper
} from 'react-iconly';
import { XIcon } from '@heroicons/react/outline';

const { Dragger } = Upload;

const UploadArea = (props) => {
    const { value, onRemove, ...restProps } = props;

    const [isEmpty, setIsEmpty] = useState(true);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (!value) {
            setIsEmpty(false);
            setFiles([]);
            return;
        }
        // value type is file list
        if (typeof value === 'object') {
            if (value.fileList && value.fileList.length) {
                const newFiles = value.fileList.map(file => {
                    return {
                        name: file.name,
                        url: null
                    }
                });
                setFiles(newFiles);
            }
        } else if (typeof value === 'string') { // default value (file path)
            setFiles([
                {
                    name: value.split('/').pop(),
                    url: value
                }
            ]);
        }
    }, [value]);

    useEffect(() => {
        setIsEmpty(!files.length);
    }, [files]);

    const reset = () => {
        setIsEmpty(false);
        setFiles([]);
        onRemove();
    }

    if (!isEmpty) {
        return (
            <div className='upload-area--success'>
                {
                    files.map((file, index) => (
                        <Row align="middle" key={index}>
                            <Paper set="bold" size={28} />
                            {
                                file.url ? <a href={file.url}>{file.name}</a> : <div>{file.name}</div>
                            }
                        </Row>
                    ))
                }
                <XIcon className='link' width={28} height={28} onClick={reset} />
            </div>
        )
    }

    return (
        <Dragger
            {...restProps}
        >
            <Row align='middle'>
                <PaperPlus set="bold" size={28} />
                <div>Drop file here or Click to upload</div>
            </Row>
        </Dragger>
    )
}

export default UploadArea;