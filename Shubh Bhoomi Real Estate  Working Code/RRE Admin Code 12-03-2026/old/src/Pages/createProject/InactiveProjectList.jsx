import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEye, FaEdit } from "react-icons/fa";
import { HiOutlineChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Modal, Button, Form, Table, Pagination, Row, Col, Card } from "react-bootstrap";
import { Tooltip } from 'bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { RiDeleteBin3Fill } from "react-icons/ri";
import { Dropdown } from 'react-bootstrap';
import { BsThreeDots } from "react-icons/bs";
import { debounce } from 'lodash';
import { MdAirplanemodeInactive, MdAirplanemodeActive, MdOutlineUpcoming, MdUpcoming } from "react-icons/md";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
const API_URL = process.env.REACT_APP_API_URL;
const imageAPIURL = process.env.REACT_APP_Image_URL;

function InactiveProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedimagePath, setSelectedimagePath] = useState(null);
  const [viewModalImages, setViewModalImages] = useState([]);
  const searchTimeoutRef = useRef(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);

  const [editFormData, setEditFormData] = useState({
    name: "",
    project_size: "",
    status: "",
    project_status: "",
    project_id: "",
    newImages: [],
    images: [],
    newPDFs: [],
    pdfs: [],
    singleImageFile: null,
    current_single_image_url: null,
    imageprojectmap: null,
    imageprojectmap_image_url: null,
    rera_registration_no: "",
    location: "",
    project_type: "",
    description: "",
    legality: "",
    businessVolume: "",
    city: "",
    state: "",
    landmark: "",
    youtube_links: "",
    propertyChainPapers: [],
    availableAmenities: [],
    keyTransports: [],
    amenities: [],
  });

  const newMultiImageInputRef = useRef(null);
  const newSingleImageInputRef = useRef(null);
  const newMapImageInputRef = useRef(null);
  const newMultiPDFInputRef = useRef(null);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });
  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => {
      return new Tooltip(tooltipTriggerEl);
    });
  }, [projects]);


  useEffect(() => {
    const fetchStates = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;
        const response = await fetch(`${API_URL}/state-list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch states.");
        }
        const data = await response.json();
        setStates(data.data || []);
      } catch (err) {
        console.error("Fetch states error:", err);
      }
    };

    const fetchAmenities = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;
        const response = await fetch(`${API_URL}/amenities-list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch amenities.");
        }
        const data = await response.json();
        setAmenitiesList(data.data || []);
      } catch (err) {
        console.error("Fetch amenities error:", err);
      }
    };

    fetchStates();
    fetchAmenities();
  }, []);


  useEffect(() => {
    const fetchCities = async () => {
      if (editFormData.state) {
        try {
          const token = getAuthToken();
          if (!token) return;
          const response = await fetch(`${API_URL}/city-list`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ state_id: editFormData.state }),
          });
          if (!response.ok) {
            throw new Error("Failed to fetch cities.");
          }
          const data = await response.json();
          setCities(data.data || []);
        } catch (err) {
          console.error("Fetch cities error:", err);
        }
      } else {
        setCities([]);
        setEditFormData((prevData) => ({ ...prevData, city: "" }));
      }
    };

    fetchCities();
  }, [editFormData.state]);

  const showCustomMessageModal = (title, text, type, confirmAction = null) => {
    setMessageModalContent({ title, text, type, confirmAction });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({ title: "", text: "", type: "", confirmAction: null });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchProjects = async (page = 1, name = "") => {
    // setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        return;
      }

      const response = await fetch(
        `${API_URL}/project-list-inactive?page=${page}&limit=10&name=${name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          showCustomMessageModal("Authorization Error", "Unauthorized: Please log in again.", "error");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch projects.");
      }

      const data = await response.json();
      setProjects(data.data || []);
      setSelectedimagePath(data.imagePath);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || page);
    } catch (err) {
      console.error("Fetch projects error:", err);
      // if (!showMessageModal) {
      //   showCustomMessageModal("Error", err.message || "An unexpected error occurred while fetching projects.", "error");
      // }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage, searchName);
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [currentPage]);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const debouncedSearch = debounce((value) => {
    setCurrentPage(1);
  }, 500);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchName(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchProjects(1, value);
    }, 500);
  };

  const handleViewProject = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        return;
      }

      const response = await fetch(`${API_URL}/project-view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: projectId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch project details.");
      }

      const data = await response.json();
      const projectData = data.data;
      setSelectedProject(projectData);
      const imagesArray = projectData.images ? JSON.parse(projectData.images) : [];
      const parsedPropertyChainPapers = projectData.property_chain_papers ? JSON.parse(projectData.property_chain_papers) : [];
      setSelectedProject({ ...projectData, property_chain_papers: parsedPropertyChainPapers });
      setViewModalImages(imagesArray);
      setShowViewModal(true);
    } catch (err) {
      console.error("View project error:", err);

    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error"
        );
        return;
      }

      const response = await fetch(`${API_URL}/project-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: projectId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch project for editing.");
      }
      const data = await response.json();
      const projectData = data.data;


      const parsedAmenities = projectData.aminities
        ? JSON.parse(projectData.aminities).map((a) => String(a.id))
        : [];
      const parsedKeyTransports = projectData.key_transport
        ? JSON.parse(projectData.key_transport)
        : [];


      const imagesArrayRaw = projectData.images ? JSON.parse(projectData.images) : [];

      const imagesArray = imagesArrayRaw.filter(file =>
        /\.(jpe?g|png|gif|bmp|webp)$/i.test(file.image)
      );

      const pdfsArray = imagesArrayRaw.filter(file =>
        /\.pdf$/i.test(file.image)
      ).map(file => ({
        ...file,
        pdf: file.image,
        thumbnail: "assets/pdf-thumbnail.png",
      }));


      const parsedPropertyChainPapers = projectData.property_chain_papers ? JSON.parse(projectData.property_chain_papers) : [];

      setEditFormData({
        name: projectData.name || "",
        project_size: projectData.total_township_area || "",
        status: projectData.status || "inactive",
        project_status: projectData.project_status || "ongoing",
        project_id: projectData.id || "",
        newImages: [],
        images: imagesArray,
        pdfs: pdfsArray,
        singleImageFile: null,
        imageprojectmap: null,
        current_single_image_url: projectData.thumbnail || null,
        imageprojectmap_image_url: projectData.map_pdf || null,
        rera_registration_no: projectData.project_rera_no || "",
        location: projectData.location || "",
        project_type: projectData.project_type || "",
        description: projectData.description || "",
        legality: projectData.approve_authority || "",
        businessVolume: projectData.bussiness_volume || "",
        city: projectData.city || "",
        state: projectData.state || "",
        landmark: projectData.land_mark || "",
        youtube_links: projectData.youtube_links || "",
        // propertyChainPapers: [],
        propertyChainPapers: parsedPropertyChainPapers,
        amenities: parsedAmenities,
        keyTransports: parsedKeyTransports,
      });

      setShowEditModal(true);
    } catch (err) {
      console.error("Edit project error:", err);
      showCustomMessageModal(
        "Error",
        err.message || "An unexpected error occurred while fetching project for editing.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleNewMultiImageChange = (e) => {
    const files = Array.from(e.target.files);
    setEditFormData((prevData) => ({
      ...prevData,
      newImages: files,
    }));
  };

  const handleNewMultiPDFChange = (e) => {
    const files = Array.from(e.target.files);
    setEditFormData((prevData) => ({
      ...prevData,
      newPDFs: [...(prevData.newPDFs || []), ...files],
    }));
  };


  const removeNewMultiPDF = (indexToRemove) => {
    setEditFormData((prevData) => {
      const updatedNewPDFs = prevData.newPDFs.filter((_, index) => index !== indexToRemove);
      if (newMultiPDFInputRef.current && updatedNewPDFs.length === 0) {
        newMultiPDFInputRef.current.value = "";
      }
      return { ...prevData, newPDFs: updatedNewPDFs };
    });
  };


  const handleNewSingleImageChange = (e) => {
    const file = e.target.files[0];
    setEditFormData((prevData) => ({
      ...prevData,
      singleImageFile: file,
    }));
  };

  const handleNewMapImageChange = (e) => {
    const file = e.target.files[0];
    setEditFormData((prevData) => ({
      ...prevData,
      imageprojectmap: file,
    }));
  };


  const removeNewMultiImage = (indexToRemove) => {
    setEditFormData(prevData => {
      const updatedNewImages = prevData.newImages.filter((_, index) => index !== indexToRemove);
      if (newMultiImageInputRef.current && updatedNewImages.length === 0) {
        newMultiImageInputRef.current.value = "";
      }
      return { ...prevData, newImages: updatedNewImages };
    });
  };


  const handleDeleteExistingMultiImage = async (imageId) => {
    showCustomMessageModal(
      "Confirm Image Deletion",
      "Are you sure you want to delete this image? This action cannot be undone.",
      "warning",
      async () => {
        setLoading(true);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
            return;
          }

          const response = await fetch(`${API_URL}/project-image-delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: imageId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete image.");
          }
          showCustomMessageModal("Success", "Project image deleted successfully!", "success");
          setEditFormData(prevData => ({
            ...prevData,
            images: prevData.images.filter(img => img.id !== imageId)
          }));
          fetchProjects(currentPage, searchName);
        } catch (err) {
          console.error("Delete image error:", err);
          // showCustomMessageModal("Error", err.message || "An unexpected error occurred while deleting image.", "error");
        } finally {
          setLoading(false);
        }
      }
    );
  };


  const handleDeleteExistingPDF = async (pdfId) => {
    showCustomMessageModal(
      "Confirm PDF Deletion",
      "Are you sure you want to delete this PDF? This action cannot be undone.",
      "warning",
      async () => {
        setLoading(true);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal("Authentication Error", "Token not found", "error");
            return;
          }

          const response = await fetch(`${API_URL}/project-image-delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: pdfId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete PDF.");
          }

          showCustomMessageModal("Success", "PDF deleted successfully!", "success");


          setEditFormData((prevData) => ({
            ...prevData,
            pdfs: prevData.pdfs.filter((pdf) => pdf.id !== pdfId),
          }));

          fetchProjects(currentPage, searchName);
        } catch (err) {
          console.error("Delete PDF error:", err);
          showCustomMessageModal("Error", err.message || "Something went wrong.", "error");
        } finally {
          setLoading(false);
        }
      }
    );
  };


  const handleDeleteExistingSingleImage = async (projectId) => {
    showCustomMessageModal(
      "Confirm Image Deletion",
      "Are you sure you want to delete the main project image? This action cannot be undone.",
      "warning",
      async () => {
        setLoading(true);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
            return;
          }

          setEditFormData(prevData => ({ ...prevData, current_single_image_url: null, singleImageFile: null }));
          if (newSingleImageInputRef.current) {
            newSingleImageInputRef.current.value = "";
          }
          showCustomMessageModal("Success", "Main project image cleared successfully! Save to apply changes.", "success");
        } catch (err) {
          console.error("Delete single image error:", err);
          showCustomMessageModal("Error", err.message || "An unexpected error occurred while deleting the main project image.", "error");
        } finally {
          setLoading(false);
        }
      }
    );
  };


  const handleDeleteExistingMapImage = async (projectId) => {
    showCustomMessageModal(
      "Confirm Image Deletion",
      "Are you sure you want to delete the main project image? This action cannot be undone.",
      "warning",
      async () => {
        setLoading(true);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
            return;
          }

          setEditFormData(prevData => ({ ...prevData, imageprojectmap_image_url: null, imageprojectmap: null }));
          if (newMapImageInputRef.current) {
            newMapImageInputRef.current.value = "";
          }
          showCustomMessageModal("Success", "Main project image cleared successfully! Save to apply changes.", "success");
        } catch (err) {
          console.error("Delete single image error:", err);
          showCustomMessageModal("Error", err.message || "An unexpected error occurred while deleting the main project image.", "error");
        } finally {
          setLoading(false);
        }
      }
    );
  };


  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData();
    setEditFormData((prevData) => ({
      ...prevData,
      description: data,
    }));
  };

  const handleAmenitiesChange = (e) => {
    const { options } = e.target;
    const selectedAmenities = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedAmenities.push(options[i].value);
      }
    }
    setEditFormData((prevData) => ({
      ...prevData,
      amenities: selectedAmenities,
    }));
  };

  const handleKeyTransportChange = (index, field, value) => {
    setEditFormData((prevData) => {
      const updatedKeyTransports = [...prevData.keyTransports];
      updatedKeyTransports[index] = {
        ...updatedKeyTransports[index],
        [field]: value,
      };
      return { ...prevData, keyTransports: updatedKeyTransports };
    });
  };

  const addKeyTransport = () => {
    setEditFormData((prevData) => ({
      ...prevData,
      keyTransports: [...prevData.keyTransports, { name: "", distance: "" }],
    }));
  };

  const removeKeyTransport = (indexToRemove) => {
    setEditFormData((prevData) => ({
      ...prevData,
      keyTransports: prevData.keyTransports.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  // const handleUpdateProject = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const token = getAuthToken();
  //     if (!token) {
  //       showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
  //       return;
  //     }
  //     const formData = new FormData();
  //     formData.append("project_id", editFormData.project_id);
  //     formData.append("total_township_area", editFormData.project_size);
  //     formData.append("project_rera_no", editFormData.rera_registration_no);
  //     formData.append("location", editFormData.location);
  //     formData.append("bussiness_volume", editFormData.businessVolume);
  //     formData.append("description", editFormData.description);
  //     formData.append("approve_authority", editFormData.legality);
  //     formData.append("state", editFormData.state);
  //     formData.append("city", editFormData.city);
  //     formData.append("land_mark", editFormData.landmark);
  //     const amenitiesArrayOfObjects = editFormData.amenities.map(id => ({ id: String(id) }));
  //     formData.append("aminities", JSON.stringify(amenitiesArrayOfObjects));
  //     formData.append("key_transport", JSON.stringify(editFormData.keyTransports));
  //     formData.append("status", editFormData.status);
  //     if (editFormData.singleImageFile) {
  //       formData.append("thumbnail", editFormData.singleImageFile);
  //     }

  //     if (editFormData.imageprojectmap) {
  //       formData.append("map_pdf", editFormData.imageprojectmap);
  //     }

  //     formData.append("project_status", editFormData.project_status);

  //     editFormData.propertyChainPapers.forEach((file) => {
  //       formData.append("property_chain_papers[]", file);
  //     });

  //     editFormData.images.forEach((imageFile) => {
  //       formData.append("image[]", imageFile);
  //     });

  //     const response = await fetch(`${API_URL}/project-update`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Failed to update project.");
  //     }

  //     showCustomMessageModal("Success", "Project updated successfully!", "success");
  //     setShowEditModal(false);
  //     fetchProjects(currentPage, searchName);
  //   } catch (err) {
  //     console.error("Update project error:", err);
  //     showCustomMessageModal("Error", err.message || "An unexpected error occurred while updating project.", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        return;
      }

      const formData = new FormData();
      formData.append("project_id", editFormData.project_id);
      formData.append("total_township_area", editFormData.project_size);
      formData.append("project_rera_no", editFormData.rera_registration_no);
      formData.append("location", editFormData.location);
      formData.append("bussiness_volume", editFormData.businessVolume);
      formData.append("description", editFormData.description);
      formData.append("approve_authority", editFormData.legality);
      formData.append("state", editFormData.state);
      formData.append("city", editFormData.city);
      formData.append("land_mark", editFormData.landmark);
      formData.append("youtube_links", editFormData.youtube_links);
      formData.append("project_status", editFormData.project_status);
      formData.append("status", editFormData.status);


      if (editFormData.singleImageFile) {
        formData.append("thumbnail", editFormData.singleImageFile);
      }


      if (editFormData.imageprojectmap) {
        formData.append("map_pdf", editFormData.imageprojectmap);
      }


      const amenitiesArrayOfObjects = editFormData.amenities.map(id => ({ id: String(id) }));
      formData.append("aminities", JSON.stringify(amenitiesArrayOfObjects));


      formData.append("key_transport", JSON.stringify(editFormData.keyTransports));


      if (editFormData.newPDFs && Array.isArray(editFormData.newPDFs)) {
        editFormData.newPDFs.forEach((file) => {
          formData.append("property_chain_papers[]", file);
        });
      }


      if (editFormData.newImages && Array.isArray(editFormData.newImages)) {
        editFormData.newImages.forEach((imageFile) => {
          formData.append("image[]", imageFile);
        });
      }

      const response = await fetch(`${API_URL}/project-update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project.");
      }

      const result = await response.json();

      if (result.success == '1') {
        showCustomMessageModal("Success", "Project updated successfully!", "success");
        setShowEditModal(false);
        fetchProjects(currentPage, searchName);
      }

    } catch (err) {
      console.error("Update project error:", err);
      showCustomMessageModal("Error", err.message || "An unexpected error occurred while updating project.", "error");
    } finally {
      setLoading(false);
    }
  };




  const handleStatusUpdate = async (projectId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    showCustomMessageModal(
      "Confirm Status Change",
      `Do you want to change the Project Status to ${newStatus}?`,
      "warning",
      async () => {
        setLoading(true);
        setError(null);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
            return;
          }

          const response = await fetch(`${API_URL}/project-status-update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status: newStatus,
              project_id: projectId,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update project status.");
          }

          showCustomMessageModal("Success", "Project status updated successfully!", "success");
          fetchProjects(currentPage, searchName);
        } catch (err) {
          console.error("Status update error:", err);
          showCustomMessageModal("Error", err.message || "An unexpected error occurred while updating project status.", "error");
        } finally {
          setLoading(false);
        }
      }
    );
  };


  const handleProjectStatusUpdate = async (projectId, currentProjectStatus) => {
    const newProjectStatus = currentProjectStatus === "ongoing" ? "complete" : "ongoing";
    showCustomMessageModal(
      "Confirm Project Status Change",
      `Do you want to change the Project Status to ${newProjectStatus}?`,
      "warning",
      async () => {
        setLoading(true);
        setError(null);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
            return;
          }

          const response = await fetch(`${API_URL}/project-project-status-update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status: newProjectStatus,
              project_id: projectId,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update project status.");
          }

          showCustomMessageModal("Success", "Project Status updated successfully!", "success");
          fetchProjects(currentPage, searchName);
        } catch (err) {
          console.error("Project Status update error:", err);
          showCustomMessageModal("Error", err.message || "An unexpected error occurred while updating project status.", "error");
        } finally {
          setLoading(false);
        }
      }
    );
  };


  const handleDeleteProject = async (projectId) => {
    showCustomMessageModal(
      "Confirm Deletion",
      "Are you sure you want to delete this project? This action cannot be undone.",
      "warning",
      async () => {
        setLoading(true);
        setError(null);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
            return;
          }

          const response = await fetch(`${API_URL}/project-delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: projectId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete project.");
          }

          showCustomMessageModal("Success", "Project deleted successfully!", "success");
          fetchProjects(currentPage, searchName);
        } catch (err) {
          console.error("Delete project error:", err);
          showCustomMessageModal("Error", err.message || "An unexpected error occurred while deleting project.", "error");
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedProject(null);
    setViewModalImages([]);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedProject(null);
    setEditFormData({
      name: "",
      total_township_area: "",
      status: "",
      project_status: "",
      project_id: "",
      newImages: [],
      images: [],
      singleImageFile: null,
      current_single_image_url: null,
      imageprojectmap: null,
      imageprojectmap_image_url: null,
      rera_registration_no: "",
      location: "",
      project_type: "",
      description: "",
      legality: "",
      businessVolume: "",
      city: "",
      state: "",
      landmark: "",
      propertyChainPapers: [],
      availableAmenities: [],
      keyTransports: [],
      amenities: [],
    });
    if (newMultiImageInputRef.current) {
      newMultiImageInputRef.current.value = "";
    }
    if (newSingleImageInputRef.current) {
      newSingleImageInputRef.current.value = "";
    }
    if (newMapImageInputRef.current) {
      newMapImageInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center m-5" role="alert">
        {error}
        <button className="btn btn-primary ms-3" onClick={() => fetchProjects()}>
          Retry
        </button>
      </div>
    );
  }



  const parsedImages = typeof viewModalImages === "string"
    ? JSON.parse(viewModalImages)
    : viewModalImages || [];

  const imageFiles = parsedImages.filter((file) =>
    /\.(jpg|jpeg|png|gif)$/i.test(file)
  );

  const pdfFiles = parsedImages.filter((file) =>
    /\.pdf$/i.test(file)
  );



  return (
    <div className="card mt-2">
      <div className="card-header">
        <div className="d-flex align-items-center justify-content-between">
          <div className="titlepage">
            <h3>Hide Projects</h3>
          </div>
          <div className="d-flex gap-2">
            <div className="d-none d-md-block">

              <div className="form-group" id="searchName">
                <input
                  type="text"
                  placeholder="Search by project name"
                  value={searchName}
                  onChange={handleSearchChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="createnewadmin">
              <Link to="/create-project" className="btn btn-success d-inline-flex align-items-center">
                <FaPlus className="me-1" /> Project
              </Link>
            </div>
            <div className="d-block d-md-none">
              <div className="d-flex gap-2">

                <button
                  className={`filter-toggle-btn ${isFilterActive ? "active" : ""}`}
                  onClick={handleToggle}
                >
                  {isFilterActive ? (
                    <>
                      <MdFilterAltOff />
                    </>
                  ) : (
                    <>
                      <MdFilterAlt />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        {isFilterActive && (
          <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
            <div className="form-group w-100" id="searchName">
              <input
                type="text"
                placeholder="Search by project name"
                value={searchName}
                onChange={handleSearchChange}
                className="form-control"
              />
            </div>
          </div>
        )}
        <div className="table-responsive">
          <Table bordered className="shadow-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th>S.N</th>
                <th>Name</th>
                <th>Total Townships(Sq. Yard)</th>
                <th>Location</th>
                <th>Business Volume(%)</th>
                <th>Approved Authority</th>
                <th>Date</th>
                <th>Status</th>
                <th>Project Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>

              {projects?.length > 0 ? (
                [...projects].reverse().map((project, i) => {
                  const imageUrls = project.images ? JSON.parse(project.images) : [];
                  const mainImageUrl = project.image;

                  return (
                    <tr key={project.id}>
                      <td>{i + 1}</td>
                      <td>{project.name}</td>
                      <td>{project.total_township_area}</td>
                      <td>
                         <div className="table-cell-remark">
                        {project.location}
                        </div>
                        </td>

                      <td>{project.bussiness_volume}</td>
                      <td>
                         <div className="table-cell-remark">
                        {project.approve_authority}</div>
                        </td>
                      <td>{project.date}</td>
                      <td>
                        <span
                          className={`badge ${project.status === "active" ? "bg-success" : "bg-danger"
                            }`}
                        >
                          {project.status === "active" ? "Show" : "Hide"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${project.project_status === "ongoing" ? "bg-info" : "bg-primary"
                            }`}
                        >
                          {project.project_status}
                        </span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn light btn-action dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <BsThreeDots size={20} />
                          </button>

                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li className="dropdown-item">
                              <button
                                className="btn view_btn btn-sm me-1"
                                onClick={() => handleViewProject(project.id)}
                                title="View Project Details"
                              >
                                <FaEye /> View
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn edit_btn btn-sm me-1"
                                onClick={() => handleEditProject(project.id)}
                                title="Edit Project"
                              >
                                <FaEdit /> Edit
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <Button
                                variant={project.status === "active" ? "danger" : "success"}
                                size="sm"
                                className="me-1"
                                onClick={() => handleStatusUpdate(project.id, project.status)}
                                title={project.status === "active" ? "Deactivate Project" : "Activate Project"}
                              >


                                {project.status === "active" ? <MdAirplanemodeInactive /> : <MdAirplanemodeActive />}
                                {project.status === "active" ? "Deactivate" : "Activate"}
                              </Button>
                            </li>
                            <li className="dropdown-item">
                              <Button
                                variant={project.project_status === "ongoing" ? "bg-success" : "bg-info"}
                                size="sm"
                                className="me-1"
                                onClick={() => handleProjectStatusUpdate(project.id, project.project_status)}
                                title={project.project_status === "ongoing" ? "Mark as Completed" : "Mark as ongoing"}
                              >
                                {project.project_status === "ongoing" ? <MdUpcoming /> : <MdOutlineUpcoming />}
                                {project.project_status === "ongoing" ? "Mark Completed" : "Mark ongoing"}
                              </Button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn delete_btn btn-sm"
                                onClick={() => handleDeleteProject(project.id)}
                                title="Delete Project"
                              >
                                <RiDeleteBin3Fill /> Delete
                              </button>
                            </li>
                          </ul>
                        </div>


                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="d-flex justify-content-end">
          <nav>
            <ul className="pagination">
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous"
                >
                  <HiOutlineChevronLeft />
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li key={index + 1} className="page-item">
                  <button
                    className={`page-link ${index + 1 === currentPage ? "active" : ""}`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next"
                >
                  <HiChevronRight />
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <Modal show={showViewModal} onHide={handleCloseViewModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Project Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProject && (
              <Row>
                <Col md={7}>
                  {/* <p><strong>ID:</strong> {selectedProject.id}</p> */}
                  <div className="table-responsive">
                    <table className="table">
                      <tr>
                        <th>Name</th>
                        <td>{selectedProject.name}</td>
                      </tr>
                      <tr>
                        <th>Total Townships(Sq. Yard)</th>
                        <td>{selectedProject.total_township_area}</td>
                      </tr>
                      <tr>
                        <th>Project RERA Number</th>
                        <td>{selectedProject.project_rera_no}</td>
                      </tr>
                      <tr>
                        <th>Bussiness Volume</th>
                        <td>{selectedProject.bussiness_volume}</td>
                      </tr>

                      <tr>
                        <th>Approve Authority</th>
                        <td>{selectedProject.approve_authority}</td>
                      </tr>
                      <tr>
                        <th>Location</th>
                        <td>{selectedProject.location}</td>
                      </tr>
                      <tr>
                        <th>State</th>
                        <td>{selectedProject.state_name}</td>
                      </tr>

                      <tr>
                        <th>City</th>
                        <td>{selectedProject.city_name}</td>
                      </tr>

                      <tr>
                        <th>LandMark</th>
                        <td>{selectedProject.land_mark}</td>
                      </tr>
                      <tr>
                        <th>Key Transport</th>
                        <td>
                          {selectedProject.key_transport ? (
                            JSON.parse(selectedProject.key_transport).map((item, index) => (
                              <div key={index}>
                                {item.name} - {item.distance}
                              </div>
                            ))
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>Aminities</th>
                        <td>
                          {selectedProject.aminities ? (
                            JSON.parse(selectedProject.aminities).map((item, index) => (
                              <div key={index}>
                                {item.name}
                              </div>
                            ))
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <span
                            className={`badge ${selectedProject.status === "active" ? "bg-success" : "bg-danger"
                              }`}
                          >
                            {selectedProject.status === "active" ? "Show" : selectedProject.status === "inactive" ? "Hide" : selectedProject.status}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <th>Project Status</th>
                        <td><span
                          className={`badge  text-white  ${selectedProject.project_status === "ongoing" ? "bg-info" : "bg-primary"
                            }`}
                        >
                          {selectedProject.project_status}
                        </span></td>
                      </tr>


                    </table>
                  </div>

                </Col>
                <Col md={5}>
                  {selectedProject.thumbnail && (
                    <div className="mb-3">
                      <strong>Thumbnail Image:</strong>
                      <br />
                      <img
                        src={`${imageAPIURL}/project/${selectedProject.thumbnail}`}
                        alt={`${selectedProject.name} Main`}
                        className="img-fluid rounded mt-2"
                        style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "cover" }}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x150/cccccc/000000?text=No+Main+Image"; }}
                      />
                    </div>
                  )}
                  {!selectedProject.thumbnail && (
                    <div className="mb-3">
                      <strong>Thumbnail Image:</strong>
                      <br />
                      <span>No Thumbnail image available.</span>
                    </div>
                  )}

                  {selectedProject.map_pdf && (
                    <div className="mb-3">
                      <strong>Map PDF:</strong>
                      <br />
                      <a
                        href={`${selectedimagePath}${selectedProject.map_pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-inline-block mt-2"
                      >
                        <div style={{ width: "200px", height: "150px", background: "#f0f0f0", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <i className="fas fa-file-pdf fa-3x text-danger"></i>
                        </div>
                        <span className="d-block mt-1 text-center">View PDF</span>
                      </a>
                    </div>
                  )}
                  {!selectedProject.map_pdf && (
                    <div className="mb-3">
                      <strong>Map PDF:</strong>
                      <br />
                      <span>No Map PDF available.</span>
                    </div>
                  )}



                  <div className="mb-3">
                    <strong>Gallery Images:</strong>
                    <br />
                    {imageFiles.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {imageFiles.map((imgName, idx) => (
                          <img
                            key={idx}
                            src={`${imageAPIURL}/project/${imgName}`}
                            alt={`Gallery ${idx + 1}`}
                            className="img-fluid rounded mt-2"
                            style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/100x50/cccccc/333333?text=No+Image";
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <span>No gallery images available.</span>
                    )}
                  </div>

                  {/* Property Chain Paper */}
                  <div className="mb-3">
                    <strong>Property Chain Paper:</strong>
                    <br />
                    {pdfFiles.length > 0 ? (
                      <ul className="ps-3">
                        {pdfFiles.map((pdfName, idx) => (
                          <li key={idx}>
                            <a
                              href={`${selectedimagePath}${pdfName}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View PDF {idx + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>No PDF documents available.</span>
                    )}
                  </div>

                </Col>
                <Col xs={12}>
                  <hr />
                  <p><strong>Description:</strong></p>
                  <div dangerouslySetInnerHTML={{ __html: selectedProject.description }} />
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseViewModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Project Modal */}
        <Modal show={showEditModal} onHide={handleCloseEditModal} centered size="lg" className="formselectnewdesign">
          <Modal.Header closeButton>
            <Modal.Title>Edit Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateProject}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="editProjectName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                      required
                    />
                  </Form.Group>
                </Col>


                <Col md={6}>
                  <Form.Group className="mb-3" controlId="editTotalTownshipArea">
                    <Form.Label>Total Township Area</Form.Label>
                    <Form.Control
                      type="text"
                      name="project_size"
                      value={editFormData.project_size}
                      onChange={handleEditFormChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="editReraRegistrationNo">
                    <Form.Label>Project RERA Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="rera_registration_no"
                      value={editFormData.rera_registration_no}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="editLocation">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditFormChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="editBusinessVolume">
                    <Form.Label>Business Volume</Form.Label>
                    <Form.Control
                      type="text"
                      name="businessVolume"
                      value={editFormData.businessVolume}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="editState">
                    <Form.Label>State</Form.Label>
                    <Form.Select
                      name="state"
                      value={editFormData.state}
                      onChange={handleEditFormChange}
                      required
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="editCity">
                    <Form.Label>City</Form.Label>
                    <Form.Select
                      name="city"
                      value={editFormData.city}
                      onChange={handleEditFormChange}
                      required
                      disabled={!editFormData.state || cities.length === 0}
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="editLandmark">
                    <Form.Label>Landmark</Form.Label>
                    <Form.Control
                      type="text"
                      name="landmark"
                      value={editFormData.landmark}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="editAmenities">
                    <Form.Label>Amenities</Form.Label>
                    <Form.Control
                      as="select"
                      multiple
                      name="amenities"
                      value={editFormData.amenities}
                      onChange={handleAmenitiesChange}
                      style={{ minHeight: "150px" }}
                    >
                      {amenitiesList.map((amenity) => (
                        <option key={amenity.id} value={amenity.id}>
                          {amenity.name}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Text className="text-muted">
                      Hold Ctrl (Windows) or Command (Mac) to select multiple amenities.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Key Transports</Form.Label>
                    {editFormData.keyTransports.map((kt, index) => (
                      <Row key={index} className="mb-2 align-items-center">
                        <Col md={5}>
                          <Form.Control
                            type="text"
                            placeholder="Transport Name (e.g., Bank, Mall)"
                            value={kt.name}
                            onChange={(e) =>
                              handleKeyTransportChange(index, "name", e.target.value)
                            }
                            required
                          />
                        </Col>
                        <Col md={5}>
                          <Form.Control
                            type="text"
                            placeholder="Distance (e.g., 2KM, 190M)"
                            value={kt.distance}
                            onChange={(e) =>
                              handleKeyTransportChange(index, "distance", e.target.value)
                            }
                            required
                          />
                        </Col>
                        <Col md={2}>
                          <Button
                            variant="danger"
                            onClick={() => removeKeyTransport(index)}
                            size="sm"
                          >
                            <RiDeleteBin3Fill />
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Button variant="outline-primary" onClick={addKeyTransport} size="sm">
                      Add Key Transport
                    </Button>
                  </Form.Group>
                </Col>
              </Row>


              <Form.Group className="mb-3" controlId="editLegality">
                <Form.Label>Approval Authority</Form.Label>
                <Form.Control
                  type="text"
                  name="legality"
                  value={editFormData.legality}
                  onChange={handleEditFormChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="editDescription">
                <Form.Label>Description</Form.Label>
                {/* <CKEditor
                  editor={ClassicEditor}
                  data={editFormData.description}
                  onChange={handleDescriptionChange}
                  config={{
                    toolbar: [
                      'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                      'undo', 'redo'
                    ],
                    licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTQ0MzgzOTksImp0aSI6Ijk4MGNlZTU4LTA0ZTUtNDVkMi1iZmI4LWZmZTNjNjMwNjA4MCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjVmZjc5NDUxIn0.0ckOvFDI8r8h1g0YVW4Vlx4PmiF2bYkIaAqdSYuM_8RC8Wl3cO4jIfkMAd57z6Fo_6JPmlmDfLjafu4EnnByzQ',
                  }}
                /> */}
                <Form.Control
                  as="textarea"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Thumbnail Image</Form.Label>
                {editFormData.current_single_image_url && (
                  <div className="mb-2 d-flex align-items-center">
                    <img
                      src={`${imageAPIURL}/project/${editFormData.current_single_image_url}`}
                      alt="Current Thumbnail"
                      className="img-thumbnail me-2"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        handleDeleteExistingSingleImage(editFormData.project_id)
                      }
                    >
                      Delete Current
                    </Button>
                  </div>
                )}
                <Form.Control
                  type="file"
                  name="singleImageFile"
                  onChange={handleNewSingleImageChange}
                  ref={newSingleImageInputRef}
                />
                <Form.Text className="text-muted">
                  Upload a new image to replace the existing thumbnail.
                </Form.Text>
              </Form.Group>

              {/* Project Map Image */}
              <Form.Group className="mb-3">
                <Form.Label>Map PDF</Form.Label>
                {editFormData.imageprojectmap_image_url && (
                  <div className="mb-2 d-flex align-items-center">
                    <img
                      src={`${imageAPIURL}/project/${editFormData.imageprojectmap_image_url}`}
                      alt="Current Map"
                      className="img-thumbnail me-2"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteExistingMapImage(editFormData.project_id)}
                    >
                      Delete Current
                    </Button>
                  </div>
                )}
                <Form.Control
                  type="file"
                  name="imageprojectmap"
                  onChange={handleNewMapImageChange}
                  ref={newMapImageInputRef}
                />
                <Form.Text className="text-muted">
                  Upload a new image to replace the existing project map.
                </Form.Text>
              </Form.Group>

              {/* Multiple Project Images */}
              <Form.Group className="mb-3">
                <Form.Label>Project Images</Form.Label>
                {editFormData.images.length > 0 ? (
                  <Row className="mb-2">
                    {editFormData.images.map((image, index) => (
                      <Col xs={4} sm={3} md={2} key={image.id} className="position-relative">
                        <img
                          src={`${imageAPIURL}/project/${image.image}`}
                          alt={`Project Image ${index + 1}`}
                          className="img-thumbnail mb-2"
                          style={{ width: "100%", height: "80px", objectFit: "cover" }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0 m-1"
                          onClick={() => handleDeleteExistingMultiImage(image.id)}
                          data-bs-toggle="tooltip"
                          title="Delete Image"
                        >
                          <RiDeleteBin3Fill />
                        </Button>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p>No existing multi-images.</p>
                )}
                <Form.Label>Project Images (New)</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  name="newImages"
                  onChange={handleNewMultiImageChange}
                  ref={newMultiImageInputRef}
                />
                <Form.Text className="text-muted">
                  Select multiple new images to add to the project.
                </Form.Text>
                {editFormData.newImages.length > 0 && (
                  <div className="mt-2">
                    <h6>New Images to Upload:</h6>
                    <ul className="list-unstyled d-flex flex-wrap">
                      {editFormData.newImages.map((file, index) => (
                        <li key={index} className="me-2 mb-2 d-flex align-items-center">
                          <span>{file.name}</span>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => removeNewMultiImage(index)}
                          >
                            X
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Project PDFs</Form.Label>

                {/* Show existing PDFs */}
                {editFormData.pdfs && editFormData.pdfs.length > 0 ? (
                  <ul className="list-unstyled">
                    {editFormData.pdfs.map((pdf, index) => (
                      <li key={pdf.id} className="d-flex align-items-center justify-content-between mb-2">
                        <a
                          href={`${selectedimagePath}/${pdf.pdf}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {pdf.pdf}
                        </a>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteExistingPDF(pdf.id)}
                          title="Delete PDF"
                        >
                          <RiDeleteBin3Fill />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No existing PDFs.</p>
                )}

                {/* Upload new PDFs */}
                <Form.Label>Project PDFs (New)</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  name="newPDFs"
                  accept="application/pdf"
                  onChange={handleNewMultiPDFChange}
                  ref={newMultiPDFInputRef}
                />
                <Form.Text className="text-muted">Select multiple new PDFs to add to the project.</Form.Text>

                {/* Show new PDFs to upload */}
                {editFormData.newPDFs && editFormData.newPDFs.length > 0 && (
                  <div className="mt-2">
                    <h6>New PDFs to Upload:</h6>
                    <ul className="list-unstyled">
                      {editFormData.newPDFs.map((file, index) => (
                        <li key={index} className="d-flex align-items-center justify-content-between mb-2">
                          <span>{file.name}</span>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeNewMultiPDF(index)}
                          >
                            X
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Form.Group>


              <Form.Group className="mb-3" controlId="editStatus">
                <Form.Label>Project Status</Form.Label>
                <Form.Select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  required
                >
                  <option value="active">Show</option>
                  <option value="inactive">Hide</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="editProjectStatus">
                <Form.Label>Project Status</Form.Label>
                <Form.Select
                  name="project_status"
                  value={editFormData.project_status}
                  onChange={handleEditFormChange}
                  required
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="complete">Complete</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="editYoutube">
                <Form.Label>Youtube Link</Form.Label>
                <Form.Control
                  type="text"
                  name="youtube_links"
                  value={editFormData.youtube_links}
                  onChange={handleEditFormChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                {loading ? "Updating..." : "Update Project"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>


        {showMessageModal && (
          <div className="modal d-block" tabIndex="1" style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
          }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className={`modal-content border-0 ${messageModalContent.type === 'success' ? '' : messageModalContent.type === 'error' ? '' : ''}`}>
                <div className="modal-header d-flex justify-content-between align-items-center">
                  <h5 className={`modal-title ${messageModalContent.type === 'success' ? 'text-white' : messageModalContent.type === 'error' ? 'text-white' : 'text-white'}`}>
                    {messageModalContent.title}
                  </h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeCustomMessageModal}></button>
                </div>
                <div className="modal-body text-secondary">
                  <p>{messageModalContent.text}</p>
                </div>
                <div className="modal-footer justify-content-center">
                  {messageModalContent.confirmAction ? (
                    <>

                      <Button
                        className="buttondesign confimbutton"

                        variant={messageModalContent.type === 'btn-primary-custum' ? 'btn-primary-custum' : 'info'}
                        onClick={() => {
                          messageModalContent.confirmAction();
                          closeCustomMessageModal();
                        }}
                      >
                        Confirm
                      </Button>
                      <button
                        className="buttondesign cancelbutton"
                        onClick={closeCustomMessageModal}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <Button
                      className="buttondesign okbutton"
                      variant={messageModalContent.type === 'btn-primary-custum' ? 'btn-primary-custum' : messageModalContent.type === 'error' ? 'danger' : 'success'}
                      onClick={closeCustomMessageModal}
                    >
                      OK
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default InactiveProjectList;
