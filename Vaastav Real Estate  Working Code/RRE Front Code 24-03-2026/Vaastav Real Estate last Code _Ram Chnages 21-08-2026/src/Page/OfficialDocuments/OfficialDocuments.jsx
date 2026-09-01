import React, { useEffect, useState } from 'react';
import PageTitle from '../../Include/Pagetitle';
import { FaDownload, FaChevronDown, FaChevronUp, FaFileArchive } from "react-icons/fa";
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import DownloadRRPlans from "../DownloadRRPlans/DownloadRRPlans";
import Partnermarkettingrule from "../Partnermarkettingrules";
import Bookingform from "../Bookingform";
import RulesBook from "../RulesBook";

const imagePathname = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/websiteDocumentUpload/`;

function OfficialDocuments() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [downloadingAll, setDownloadingAll] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/realstate-website-document-list?page=1&limit=10&name=`
            );

            if (response.data && response.data.data) {
                setDocuments(response.data.data);
                // Set first item as active by default if documents exist
                if (response.data.data.length > 0) {
                    setActiveIndex(0);
                }
            }
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // const handleDownload = (fileUrl, fileName) => {
    //     // Create a temporary anchor element to trigger download
    //     const link = document.createElement('a');
    //     link.href = fileUrl;
    //     link.download = fileName;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };

    const downloadAllAsZip = async () => {
        setDownloadingAll(true);
        try {
            const zip = new JSZip();
            const downloadPromises = [];

            // Collect all files from all documents
            documents.forEach((document) => {
                if (document.image) {
                    const imageFiles = document.image.split(',');
                    imageFiles.forEach((imageFile) => {
                        const fileUrl = imagePathname + imageFile;
                        const promise = fetch(fileUrl)
                            .then(response => response.blob())
                            .then(blob => {
                                zip.file(imageFile, blob);
                            });
                        downloadPromises.push(promise);
                    });
                }
            });

            // Wait for all files to be fetched
            await Promise.all(downloadPromises);

            // Generate the zip file
            const content = await zip.generateAsync({ type: 'blob' });

            // Download the zip file
            saveAs(content, 'all-documents.zip');
        } catch (error) {
            console.error('Error creating zip file:', error);
            alert('Failed to download all documents. Please try again.');
        } finally {
            setDownloadingAll(false);
        }
    };

    const toSentenceCase = (str) => {
        if (!str) return "";
        const cleaned = str.trim().toLowerCase();
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    };

    // Check if there are any documents with images to show the download all button
    const hasDocumentsWithImages = documents.some(doc => doc.image && doc.image.length > 0);
    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url, {
                method: "GET",
            });
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename || "download";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl); // memory cleanup
        } catch (error) {
            console.error("Download failed:", error);
        }
    };
    const [tabs, setTabs] = useState(1);
    const handletab = (index) => {
        setTabs(index);

    }
    return (
        <div className='margin_all_bottom pb-70'>
            <PageTitle />
            <div className="container">
                <div className="margin_all_section">
                    <div className="pt-70 pb-70">
                        <div className="desktop-tabs">
                            <div className='d-flex tab_button_design  '>
                                <button className={`tab btn btn_tab_dseign ${tabs === 1 ? "active" : ''}`} onClick={() => handletab(1)}>Download Official Documents</button>
                                <button className={`tab btn btn_tab_dseign ${tabs === 2 ? "active" : ''}`} onClick={() => handletab(2)}>Download VRE Plans</button>
                                <button className={`tab btn btn_tab_dseign ${tabs === 3 ? "active" : ''}`} onClick={() => handletab(3)}>Marketting Partners Rules</button>
                                <button className={`tab btn btn_tab_dseign ${tabs === 4 ? "active" : ''}`} onClick={() => handletab(4)}>Booking Form</button>
                                <button className={`tab btn btn_tab_dseign ${tabs === 5 ? "active" : ''}`} onClick={() => handletab(5)}>Rules Book</button>
                            </div>
                        </div>
                        <div className="mobile-tabs">
                            <select value={tabs} className='form-select mb-2' onChange={(e) => handletab(Number(e.target.value))}>
                                <option value={1}>Download Official Documents</option>
                                <option value={2}>Download VRE Plans</option>
                                <option value={3}>Marketting Partners Rules</option>
                                <option value={4}>Booking Form</option>
                                <option value={5}>Rules Book</option>
                            </select>
                        </div>
                        <div className="tab_content_design">
                            {tabs === 1 && (
                                <>
                                    <div className="d-none d-md-block">
                                        <div class="row">
                                            <div class="col-12 text-center">
                                                <h5 class="sub_heading ">Documents</h5>
                                                <h3 class="main_headin-2 ">Download Official Documents</h3>
                                                <p class="">You Can Download Official Document</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center">
                                        <div className="col-md-12">
                                            <div className="card">
                                                <div className="card-header">
                                                    <div className="d-flex justify-content-end align-items-center">
                                                        {hasDocumentsWithImages && (
                                                            <button
                                                                className="downlaodbutton"
                                                                onClick={downloadAllAsZip}
                                                                disabled={downloadingAll}
                                                            >
                                                                {downloadingAll ? (
                                                                    <>
                                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                        Preparing Download...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FaFileArchive className="me-2" />
                                                                        Download All as ZIP
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    {loading ? (
                                                        <div className="text-center">
                                                            <div className="spinner-border text-primary" role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </div>
                                                            <p className="mt-2">Loading documents...</p>
                                                        </div>
                                                    ) : documents.length === 0 ? (
                                                        <div className="text-center">
                                                            <p>No documents available.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="accordion" id="documentsAccordion">
                                                            {documents.map((item, index) => {
                                                                // Handle multiple images (comma-separated)
                                                                const imageFiles = item.image ? item.image.split(',') : [];

                                                                return (
                                                                    <div className="accordion-item" key={item.id || index}>
                                                                        <h2 className="accordion-header">
                                                                            <button
                                                                                className={`accordion-button ${activeIndex === index ? '' : 'collapsed'}`}
                                                                                type="button"
                                                                                onClick={() => toggleAccordion(index)}
                                                                                aria-expanded={activeIndex === index}
                                                                            >
                                                                                {/* <span className="me-2">
                                                            {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                                                        </span> */}
                                                                                {toSentenceCase(item.name)}
                                                                            </button>
                                                                        </h2>
                                                                        <div className={`accordion-collapse collapse ${activeIndex === index ? 'show' : ''}`}>
                                                                            <div className="accordion-body">
                                                                                {imageFiles.length === 0 ? (
                                                                                    <p className="text-center">No documents available for this category.</p>
                                                                                ) : (
                                                                                    <div className="row">
                                                                                        {imageFiles.map((image, imgIndex) => {
                                                                                            const imageUrl = imagePathname + image;
                                                                                            const isPdf = image.toLowerCase().endsWith('.pdf');

                                                                                            return (
                                                                                                <div className="col-md-4" key={imgIndex}>
                                                                                                    <div className="alldocumentall text-center">
                                                                                                        <div className="position-relative">
                                                                                                            {isPdf ? (
                                                                                                                <div className="pdf-preview mb-3">
                                                                                                                    <div className="pdf-icon display-1 text-danger">PDF</div>
                                                                                                                    <p className="small text-truncate">{image}</p>
                                                                                                                </div>
                                                                                                            ) : (
                                                                                                                <div className='doucmentimage_all'>
                                                                                                                    <img
                                                                                                                        src={imageUrl}
                                                                                                                        alt={`${item.name} document`}
                                                                                                                        className="img-fluid mb-3 document-image"

                                                                                                                        onError={(e) => {
                                                                                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjNmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                                                                                                                        }}
                                                                                                                    />
                                                                                                                </div>
                                                                                                            )}
                                                                                                            <div className="buttonalldownload">
                                                                                                                {/* <a 
                                                                                        download
                                                                                        target='_blank'
                                                                                        className="downlaodbutton"
                                                                                        onClick={() => handleDownload(imageUrl, image)}
                                                                                    >
                                                                                        <FaDownload className="me-1" />
                                                                                        Download
                                                                                    </a> */}
                                                                                                                <a
                                                                                                                    className="downlaodbutton downloadbuttonimage"
                                                                                                                    onClick={() => handleDownload(imageUrl, image)}
                                                                                                                >
                                                                                                                    <FaDownload className="me-1" />
                                                                                                                    Download
                                                                                                                </a>

                                                                                                            </div>
                                                                                                        </div>

                                                                                                    </div>

                                                                                                </div>
                                                                                            );
                                                                                        })}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>



                                        </div>
                                    </div>
                                </>
                            )}
                            {tabs === 2 && (
                                <DownloadRRPlans />
                            )}
                            {tabs === 3 && (
                                <Partnermarkettingrule />
                            )}
                            {tabs === 4 && (
                                <Bookingform />
                            )}
                            {tabs === 5 && (
                                <RulesBook />
                            )}

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default OfficialDocuments;