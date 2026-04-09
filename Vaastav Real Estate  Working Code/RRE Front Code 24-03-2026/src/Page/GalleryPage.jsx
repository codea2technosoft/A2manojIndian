import React, { useState, useEffect } from "react";
import PageTitle from "../Include/Pagetitle";
import { FaPlus, FaSearchPlus } from "react-icons/fa";
const imageGallery = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/gallery/`;

const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const itemsPerPage = 15;

  useEffect(() => {
    const fetchGalleryPhotos = async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/gallery-list?page=${currentPage}&limit=${itemsPerPage}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPhotos(data.data || []);
        setImagePath(data.imagePath);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(page);
      } catch (err) {
        console.error("Error fetching gallery photos:", err);
        setError("Failed to load gallery images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryPhotos();
  }, [currentPage, itemsPerPage]);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setCurrentImageIndex(null);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="gallerypage pb-70">
      <PageTitle />

      <section className="margin_all_section ">
        <div className="container">
          {loading && <div className="text-center">Loading gallery...</div>}
          {error && <div className="text-center text-danger">{error}</div>}
          {!loading && !error && photos.length === 0 && (
            <div className="text-center">No gallery images available.</div>
          )}

          {!loading && !error && photos.length > 0 && (
            <div className="gallery-grid">
              {photos.map((photo, index) => (
                <div
                  key={photo.image + index}
                  className="gallery-item"
                  onClick={() => openLightbox(index)}
                >
                  <div className="gallery_overlay"></div>
                  <FaSearchPlus />
                  <img
                    src={`${imageGallery}${photo.image}`}
                    alt={photo.alt || "Gallery image"}
                    className="gallery-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/100x50/cccccc/333333?text=No+Image";
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="pagination-controls justify-content-center d-flex">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>

              <span className="page-indicator">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}

          {currentImageIndex !== null && photos.length > 0 && (
            <div className="lightbox" onClick={closeLightbox}>
              <div
                className="lightbox-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-btn" onClick={closeLightbox}>
                  &times;
                </button>
                <button className="nav-btn prev-btn" onClick={goToPrevious}>
                  &#10094;
                </button>
                <img
                  src={`${imageGallery}${photos[currentImageIndex].image}`}
                  alt={photos[currentImageIndex].alt || "Gallery image"}
                  className="lightbox-image"
                />
                <button className="nav-btn next-btn" onClick={goToNext}>
                  &#10095;
                </button>
                <div className="image-counter">
                  {currentImageIndex + 1} / {photos.length}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
