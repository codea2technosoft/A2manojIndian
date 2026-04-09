import React, { useState, useEffect, useRef } from "react";
import { Container, Button } from "react-bootstrap";
import { FaDownload, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const rre_rules_book = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/websiteDocumentUpload/`;

// PdfViewer Component (Unchanged)
const PdfViewer = ({ pdfUrl }) => {
  const [pdfDocument, setPdfDocument] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

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
        setPageCount(pdf.numPages);
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
    if (pdfDocument && canvasRef.current) {
      renderPage();
    }
  }, [pdfDocument, currentPage, scale]);

  const renderTaskRef = useRef(null);

const renderPage = async () => {
  try {
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    const page = await pdfDocument.getPage(currentPage);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const viewport = page.getViewport({ scale });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    renderTaskRef.current = page.render(renderContext);
    await renderTaskRef.current.promise;

    renderTaskRef.current = null; // Clear after render completes
  } catch (err) {
    if (err?.name === "RenderingCancelledException") {
      console.log("Previous render cancelled.");
    } else {
      console.error("Error rendering page:", err);
      setError("Error displaying page. Please try again.");
    }
  }
};


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

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
    <div className="pdf-viewer-container" style={{ marginTop: "20px" }}>
      <div className="d-flex justify-content-between align-items-center p-3 bg-light flex-wrap">
        <div className="d-flex align-items-center mb-2">
          <button
            className="btn btn-outline-primary btn-sm me-2"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            <FaChevronLeft /> Previous
          </button>
          <span className="mx-2">
            Page {currentPage} of {pageCount}
          </span>
          <button
            className="btn btn-outline-primary btn-sm ms-2"
            onClick={() => handlePageChange(Math.min(pageCount, currentPage + 1))}
            disabled={currentPage >= pageCount}
          >
            Next <FaChevronRight />
          </button>
        </div>
        <div className="d-flex align-items-center mb-2">
          <button className="btn btn-outline-secondary btn-sm me-1" onClick={zoomOut}>
            -
          </button>
          <span className="mx-2">Zoom: {Math.round(scale * 100)}%</span>
          <button className="btn btn-outline-secondary btn-sm ms-1" onClick={zoomIn}>
            +
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-center p-2">
        <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }}></canvas>
      </div>

       <div className="d-flex justify-content-between align-items-center p-3 bg-light flex-wrap">
        <div className="d-flex align-items-center mb-2">
          <button
            className="btn btn-outline-primary btn-sm me-2"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            <FaChevronLeft /> Previous
          </button>
          <span className="mx-2">
            Page {currentPage} of {pageCount}
          </span>
          <button
            className="btn btn-outline-primary btn-sm ms-2"
            onClick={() => handlePageChange(Math.min(pageCount, currentPage + 1))}
            disabled={currentPage >= pageCount}
          >
            Next <FaChevronRight />
          </button>
        </div>
        <div className="d-flex align-items-center mb-2">
          <button className="btn btn-outline-secondary btn-sm me-1" onClick={zoomOut}>
            -
          </button>
          <span className="mx-2">Zoom: {Math.round(scale * 100)}%</span>
          <button className="btn btn-outline-secondary btn-sm ms-1" onClick={zoomIn}>
            +
          </button>
        </div>
      </div>
      
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

  const itemsPerPage = 8;

  useEffect(() => {
    fetchPreviousPapers();
  }, []);

  const fetchPreviousPapers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/site-setting`);
      const responseData = res.data.data || res.data;

      if (responseData.rre_rules_book) {
        setPreviousList([
          {
            id: 1,
            title: "Vaastav Real Estate Rules Book Details",
            pdf: responseData.rre_rules_book,
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
    <section className="course paper padding_15">
      <Container>
        <div className="card">
          <div className="card-header">
            <div className="titlepage">
              <h3>RRE Rule Book</h3>
              </div>
          </div>

          
          <div className="card-body">
              {currentPapers.length > 0 ? (
                currentPapers.map((paper, index) => (
                  <div className="col-lg-3 col-md-4 mb-4" key={paper.id || index}>
                    <div className="course_card blog_card">
                      {/* <div className="blog_card_img_block" style={{ minHeight: "150px" }}>
                        <img
                          src={`${baseurl}/Uploads/websiteDocumentUpload/${paper.pdf}`}
                          alt={paper.title}
                          style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                          onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                        />
                        <p className="date">
                          {paper.created_at
                            ? new Date(paper.created_at).toLocaleDateString("en-GB")
                            : ""}
                        </p>
                      </div> */}
                      {/* <div className="blog_card_text_block">
                        <h5 className="mb-2">
                          <a
                            className="blog_title"
                            href={`${baseurl}/Uploads/websiteDocumentUpload/${paper.pdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {paper.title}
                          </a>
                        </h5>
                        <div className="d-flex justify-content-between align-items-center">
                          <a
                            href={`${baseurl}/Uploads/websiteDocumentUpload/${paper.pdf}`}
                            download
                            className="educate_link_btn"
                          >
                            <FaDownload /> Download
                          </a>
                        </div>
                      </div> */}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p>No previous papers available.</p>
                </div>
              )}
            
            {/* Pagination Controls */}
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

            {/* PDF Viewer Section */}
            {selectedPdf && (
              <div className="pdf-viewer-section">
                <PdfViewer pdfUrl={selectedPdf} />
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PreviousPapers;