import { Upload, Row, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { PlusIcon, PaperClipIcon, XIcon } from '@heroicons/react/outline';
// requests
import { uploadFile, removeFile } from 'requests/common';

const { Dragger } = Upload;
const { confirm } = Modal;

const UploadArea = (props) => {
    const { value, onChangeFiles, onRemove, ...restProps } = props;

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

    const onChange = async ({ fileList }) => {
        try {
            const formData = new FormData();
            fileList.forEach(file => {
                formData.append('file[]', file.originFileObj);
            });

            const response = await uploadFile(formData);
            onChangeFiles(response);
        } catch (err) {
            console.log(err);
        }
    }

    const reset = async () => {
        try {
            confirm({
                title: "When file is removed, you cannot revert it. Are you sure?",
                onOk: async () => {
                    setIsEmpty(false);
                    setFiles([]);

                    for (let i = 0; i < files.length; i++) {
                        const response = await removeFile(files[0].name);
                    }

                    onRemove();
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    if (!isEmpty) {
        return (
            <div className='upload-area--success'>
                {
                    files.map((file, index) => (
                        <Row align="middle" key={index}>
                            <PaperClipIcon width={28} height={28} />
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
            onChange={onChange}
        >
            <Row align='middle'>
                <PlusIcon width={28} height={28} />
                <div>Drop file here or Click to upload</div>
            </Row>
        </Dragger>
    )
}

export default UploadArea;