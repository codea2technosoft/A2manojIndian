import React, { useState, useEffect, useRef } from "react";
import { Container, Button } from "react-bootstrap";
import { FaDownload, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import PageTitle from '../../Include/Pagetitle';

const API_URL = process.env.REACT_APP_API_URL;
const upload_rre_plans_pdf = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/websiteDocumentUpload/`;

// PdfViewer Component (Unchanged)
const PdfViewer = ({ pdfUrl }) => {
    const [pdfDocument, setPdfDocument] = useState(null);
    const [scale, setScale] = useState(1.2);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const canvasRefs = useRef([]);

    useEffect(() => {
        const loadPdfJs = () => {
            return new Promise((resolve, reject) => {
                if (window.pdfjsLib) {
                    resolve();
                    return;
                }
                const script = document.createElement("script");
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
                script.onload = () => {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
                    resolve();
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        const loadPdf = async () => {
            try {
                setLoading(true);
                await loadPdfJs();
                const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                setPdfDocument(pdf);
                setLoading(false);
            } catch (err) {
                console.error("Error loading PDF:", err);
                setError("Failed to load PDF document. Please try again later.");
                setLoading(false);
            }
        };

        loadPdf();
    }, [pdfUrl]);

    useEffect(() => {
        if (pdfDocument) {
            renderAllPages();
        }
    }, [pdfDocument, scale]);

    const renderAllPages = async () => {
        if (!pdfDocument) return;

        canvasRefs.current = []; // Reset references
        const container = document.getElementById(`pdf-all-pages-${pdfUrl}`);
        if (!container) return;

        container.innerHTML = ""; // Clear previous canvases

        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            const page = await pdfDocument.getPage(pageNum);
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.display = "block";
            canvas.style.margin = "10px auto";

            container.appendChild(canvas);
            canvasRefs.current.push(canvas);

            const context = canvas.getContext("2d");
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };

            await page.render(renderContext).promise;
        }
    };

    const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading PDF...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="pdf-viewer-container">
            <div className="d-flex justify-content-center mb-2">
                <button className="btn btn-outline-secondary btn-sm me-1" onClick={zoomOut}>-</button>
                <span className="mx-2">Zoom: {Math.round(scale * 100)}%</span>
                <button className="btn btn-outline-secondary btn-sm ms-1" onClick={zoomIn}>+</button>
            </div>
            <div id={`pdf-all-pages-${pdfUrl}`}></div>
        </div>
    );
};


const PreviousPapers = () => {
    const [baseurl, setBaseurl] = useState("");
    const [previousList, setPreviousList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [downloadpdf, setdownloadpdf] = useState();

    const itemsPerPage = 8;

    useEffect(() => {
        fetchPreviousPapers();
    }, []);

    const fetchPreviousPapers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/site-setting`);
            const responseData = res.data.data || res.data;
            setdownloadpdf(responseData.upload_rre_plans_pdf);
            console.warn(responseData.upload_rre_plans_pdf);
            if (responseData.upload_rre_plans_pdf) {
                setPreviousList([
                    {
                        id: 1,
                        title: "Shubh Bhoomi Real Estate Rules Book Details",
                        pdf: responseData.upload_rre_plans_pdf,
                        created_at: responseData.created_at || new Date().toISOString(),
                    },
                ]);
                setTotalItems(1);
            } else if (Array.isArray(responseData)) {
                setPreviousList(responseData);
                setTotalItems(responseData.length);
            } else if (responseData.papers && Array.isArray(responseData.papers)) {
                setPreviousList(responseData.papers);
                setTotalItems(responseData.papers.length);
            } else {
                const pdfKeys = Object.keys(responseData).filter((key) =>
                    key.toLowerCase().includes("pdf") || key.toLowerCase().includes("paper")
                );

                if (pdfKeys.length > 0) {
                    const papers = pdfKeys.map((key, index) => ({
                        id: index + 1,
                        title: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
                        pdf: responseData[key],
                        created_at: responseData.created_at || new Date().toISOString(),
                    }));
                    setPreviousList(papers);
                    setTotalItems(papers.length);
                } else {
                    setPreviousList([]);
                    setTotalItems(0);
                }
            }

            setBaseurl(process.env.REACT_APP_IMAGE_API_URL);
            setError(null);
        } catch (error) {
            console.error("Error fetching previous papers:", error);
            setError("Failed to load previous papers. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Automatically select the first PDF when previousList is updated
    useEffect(() => {
        if (previousList.length > 0 && baseurl) {
            setSelectedPdf(`${baseurl}/uploads/websiteDocumentUpload/${previousList[0].pdf}`);
        }
    }, [previousList, baseurl]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPapers = previousList.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <section className="course paper">
 <div className="d-none d-md-block">
                    <div class="row">
                        <div class="col-12 text-center">
                            <h5 class="sub_heading ">Documents</h5>
                            <h3 class="main_headin-2 "> Download Shubh Bhoomi Real Estate Plan Details</h3>
                            <p class="text-muted">Here you can find all the latest plan documents and guidelines.</p>
                        </div>
                    </div>
                    </div>
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <div className="card-title"><strong>Shubh Bhoomi Real Estate Plan Details</strong></div>
                            <div >
                                <a
                                    href={`${baseurl}/uploads/websiteDocumentUpload/${downloadpdf}`}
                                    download
                                    target="_blank"
                                    className="downlaodbutton"
                                    style={{ minWidth: "150px" }}
                                >
                                    <FaDownload className="me-1 text-white" /> Download PDF
                                </a>
                            </div>
                        </div>




                        <div className="card-body">

                            {previousList.length > 0 ? (
                                previousList.map((paper, index) => (
                                    <div key={paper.id || index} className="mb-2">
                                        <div className="pdf-viewer-section text-center">
                                            <PdfViewer pdfUrl={`${baseurl}/uploads/websiteDocumentUpload/${paper.pdf}`} />

                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center">
                                    <p>No previous papers available.</p>
                                </div>
                            )}
                        </div>




                        {/* <div className="card-body">
                        {currentPapers.length > 0 ? (
                            currentPapers.map((paper, index) => (
                                <div className="col-lg-3 col-md-4 mb-4" key={paper.id || index}>
                                    <div className="course_card blog_card">
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center">
                                <p>No previous papers available.</p>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-4">
                                <nav>
                                    <ul className="pagination">
                                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                                <FaChevronLeft /> Previous
                                            </button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <li
                                                key={page}
                                                className={`page-item ${currentPage === page ? "active" : ""}`}
                                            >
                                                <button className="page-link" onClick={() => handlePageChange(page)}>
                                                    {page}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                                Next <FaChevronRight />
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                        {selectedPdf && (
                            <>
                               
                                <div className="pdf-viewer-section mt-4 text-center">
                                    <PdfViewer pdfUrl={selectedPdf} />
                                    <a
                                        href={selectedPdf}
                                        download
                                        target="_blank"
                                        className="btn btn-primary mt-3"
                                        style={{ minWidth: "150px" }}
                                    >
                                        <FaDownload className="me-1" /> Download PDF
                                    </a>
                                </div>
                            </>
                        )}


                    </div> */}


                    </div>

        </section>
    );
};

export default PreviousPapers;