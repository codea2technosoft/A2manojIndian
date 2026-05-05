import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEye, FaEdit } from "react-icons/fa";
import { HiOutlineChevronLeft, HiChevronRight } from "react-icons/hi2";
import {
  Modal,
  Button,
  Form,
  Table,
  Pagination,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { Tooltip } from "bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { Dropdown } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { debounce } from "lodash";
import {
  MdAirplanemodeInactive,
  MdAirplanemodeActive,
  MdOutlineUpcoming,
  MdUpcoming,
} from "react-icons/md";
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
  const [categories, setCategories] = useState([]);

  const [editFormData, setEditFormData] = useState({
    name: "",
    project_size: "",
    status: "",
    project_status: "",
    project_id: "",
    category_id: "",
    // category_name: "",
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

  // Safe Parse Function
  const safeParse = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'object') return value;
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn("Failed to parse:", value);
      return [];
    }
  };

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    );
    tooltipTriggerList.map((tooltipTriggerEl) => {
      return new Tooltip(tooltipTriggerEl);
    });
  }, [projects]);

  const fetchProjectCategories = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/created-project-category-lists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories.");
      }

      const data = await response.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

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
    fetchProjectCategories();
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
    setMessageModalContent({
      title: "",
      text: "",
      type: "",
      confirmAction: null,
    });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchProjects = async (page = 1, name = "") => {
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error",
        );
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
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          showCustomMessageModal(
            "Authorization Error",
            "Unauthorized: Please log in again.",
            "error",
          );
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
      showCustomMessageModal(
        "Authentication Error",
        "Authentication token not found. Please log in.",
        "error",
      );
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
    
    // ✅ Projects list se city, state, category find karo
    const matchedProject = projects.find(p => p.id === projectId);
    
    const safeParse = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      if (typeof value === 'object') return value;
      try {
        return JSON.parse(value);
      } catch (e) {
        return [];
      }
    };

    const imagesArray = safeParse(projectData.images);
    const parsedPropertyChainPapers = safeParse(projectData.property_chain_papers);

    setSelectedProject({
      ...projectData,
      // ✅ Correct way - pehle matchedProject se lo, nahi toh projectData se
      city_name: matchedProject?.city_name || projectData.city_name || "N/A",
      state_name: matchedProject?.state_name || projectData.state_name || "N/A",
      project_category_name: matchedProject?.project_category_name || projectData.project_category_name || "N/A",
      property_chain_papers: parsedPropertyChainPapers,
    });
    setViewModalImages(imagesArray);
    setShowViewModal(true);
  } catch (err) {
    console.error("View project error:", err);
    showCustomMessageModal(
      "Error",
      err.message || "Failed to fetch project details.",
      "error",
    );
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
          "error",
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
        throw new Error(
          errorData.message || "Failed to fetch project for editing.",
        );
      }
      const data = await response.json();
      const projectData = data.data;

      // Find category name if not provided
      let categoryName = projectData.category_name || "";
      if (!categoryName && projectData.category_id && categories.length > 0) {
        const foundCategory = categories.find(cat => String(cat.id) === String(projectData.category_id));
        categoryName = foundCategory ? foundCategory.category_name : "";
      }

      const parsedAmenities = projectData.aminities
        ? safeParse(projectData.aminities).map((a) => String(a.id))
        : [];
      const parsedKeyTransports = safeParse(projectData.key_transport);

      const imagesArrayRaw = safeParse(projectData.images);

      const imagesArray = imagesArrayRaw.filter((file) =>
        /\.(jpe?g|png|gif|bmp|webp)$/i.test(file.image || file),
      );

      const pdfsArray = imagesArrayRaw
        .filter((file) => /\.pdf$/i.test(file.image || file))
        .map((file) => ({
          ...file,
          pdf: file.image || file,
          thumbnail: "assets/pdf-thumbnail.png",
        }));

      const parsedPropertyChainPapers = safeParse(projectData.property_chain_papers);

      setEditFormData({
        name: projectData.name || "",
        project_size: projectData.total_township_area || "",
        status: projectData.status || "inactive",
        project_status: projectData.project_status || "ongoing",
        project_id: projectData.id || "",
        category_id: projectData.category_id || "",
        // category_name: categoryName,
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
        propertyChainPapers: parsedPropertyChainPapers,
        amenities: parsedAmenities,
        keyTransports: parsedKeyTransports,
      });

      setShowEditModal(true);
    } catch (err) {
      console.error("Edit project error:", err);
      showCustomMessageModal(
        "Error",
        err.message ||
        "An unexpected error occurred while fetching project for editing.",
        "error",
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
      const updatedNewPDFs = prevData.newPDFs.filter(
        (_, index) => index !== indexToRemove,
      );
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
    setEditFormData((prevData) => {
      const updatedNewImages = prevData.newImages.filter(
        (_, index) => index !== indexToRemove,
      );
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
            showCustomMessageModal(
              "Authentication Error",
              "Authentication token not found. Please log in.",
              "error",
            );
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
          showCustomMessageModal(
            "Success",
            "Project image deleted successfully!",
            "success",
          );
          setEditFormData((prevData) => ({
            ...prevData,
            images: prevData.images.filter((img) => img.id !== imageId),
          }));
          fetchProjects(currentPage, searchName);
        } catch (err) {
          console.error("Delete image error:", err);
        } finally {
          setLoading(false);
        }
      },
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
            showCustomMessageModal(
              "Authentication Error",
              "Token not found",
              "error",
            );
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

          showCustomMessageModal(
            "Success",
            "PDF deleted successfully!",
            "success",
          );

          setEditFormData((prevData) => ({
            ...prevData,
            pdfs: prevData.pdfs.filter((pdf) => pdf.id !== pdfId),
          }));

          fetchProjects(currentPage, searchName);
        } catch (err) {
          console.error("Delete PDF error:", err);
          showCustomMessageModal(
            "Error",
            err.message || "Something went wrong.",
            "error",
          );
        } finally {
          setLoading(false);
        }
      },
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
            showCustomMessageModal(
              "Authentication Error",
              "Authentication token not found. Please log in.",
              "error",
            );
            return;
          }

          setEditFormData((prevData) => ({
            ...prevData,
            current_single_image_url: null,
            singleImageFile: null,
          }));
          if (newSingleImageInputRef.current) {
            newSingleImageInputRef.current.value = "";
          }
          showCustomMessageModal(
            "Success",
            "Main project image cleared successfully! Save to apply changes.",
            "success",
          );
        } catch (err) {
          console.error("Delete single image error:", err);
          showCustomMessageModal(
            "Error",
            err.message ||
            "An unexpected error occurred while deleting the main project image.",
            "error",
          );
        } finally {
          setLoading(false);
        }
      },
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
            showCustomMessageModal(
              "Authentication Error",
              "Authentication token not found. Please log in.",
              "error",
            );
            return;
          }

          setEditFormData((prevData) => ({
            ...prevData,
            imageprojectmap_image_url: null,
            imageprojectmap: null,
          }));
          if (newMapImageInputRef.current) {
            newMapImageInputRef.current.value = "";
          }
          showCustomMessageModal(
            "Success",
            "Main project image cleared successfully! Save to apply changes.",
            "success",
          );
        } catch (err) {
          console.error("Delete single image error:", err);
          showCustomMessageModal(
            "Error",
            err.message ||
            "An unexpected error occurred while deleting the main project image.",
            "error",
          );
        } finally {
          setLoading(false);
        }
      },
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
        (_, index) => index !== indexToRemove,
      ),
    }));
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error",
        );
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
      formData.append("category_id", editFormData.category_id);
      // formData.append("category_name", editFormData.category_name);

      if (editFormData.singleImageFile) {
        formData.append("thumbnail", editFormData.singleImageFile);
      }

      if (editFormData.imageprojectmap) {
        formData.append("map_pdf", editFormData.imageprojectmap);
      }

      const amenitiesArrayOfObjects = editFormData.amenities.map((id) => ({
        id: String(id),
      }));
      formData.append("aminities", JSON.stringify(amenitiesArrayOfObjects));

      formData.append(
        "key_transport",
        JSON.stringify(editFormData.keyTransports),
      );

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

      if (result.success == "1") {
        showCustomMessageModal(
          "Success",
          "Project updated successfully!",
          "success",
        );
        setShowEditModal(false);
        fetchProjects(currentPage, searchName);
      }
    } catch (err) {
      console.error("Update project error:", err);
      showCustomMessageModal(
        "Error",
        err.message || "An unexpected error occurred while updating project.",
        "error",
      );
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
            showCustomMessageModal(
              "Authentication Error",
              "Authentication token not found. Please log in.",
              "error",
            );
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
            throw new Error(
              errorData.message || "Failed to update project status.",
            );
          }

          showCustomMessageModal(
            "Success",
            "Project status updated successfully!",
            "success",
          );
          fetchProjects(currentPage, searchName);
        } catch (err) {
          console.error("Status update error:", err);
          showCustomMessageModal(
            "Error",
            err.message ||
            "An unexpected error occurred while updating project status.",
            "error",
          );
        } finally {
          setLoading(false);
        }
      },
    );
  };

  const handleProjectStatusUpdate = async (projectId, currentProjectStatus) => {
    const newProjectStatus =
      currentProjectStatus === "ongoing" ? "complete" : "ongoing";
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
            showCustomMessageModal(
              "Authentication Error",
              "Authentication token not found. Please log in.",
              "error",
            );
            return;
          }

          const response = await fetch(
            `${API_URL}/project-project-status-update`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                status: newProjectStatus,
                project_id: projectId,
              }),
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to update project status.",
            );
          }

          showCustomMessageModal(
            "Success",
            "Project Status updated successfully!",
            "success",
          );
          fetchProjects(currentPage, searchName);
        } catch (err) {
          console.error("Project Status update error:", err);
          showCustomMessageModal(
            "Error",
            err.message ||
            "An unexpected error occurred while updating project status.",
            "error",
          );
        } finally {
          setLoading(false);
        }
      },
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
            showCustomMessageModal(
              "Authentication Error",
              "Authentication token not found. Please log in.",
              "error",
            );
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

          showCustomMessageModal(
            "Success",
            "Project deleted successfully!",
            "success",
          );
          fetchProjects(currentPage, searchName);
        } catch (err) {
          console.error("Delete project error:", err);
          showCustomMessageModal(
            "Error",
            err.message ||
            "An unexpected error occurred while deleting project.",
            "error",
          );
        } finally {
          setLoading(false);
        }
      },
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
      category_id: "",
      // category_name: "",
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
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
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
        <button
          className="btn btn-primary ms-3"
          onClick={() => fetchProjects()}
        >
          Retry
        </button>
      </div>
    );
  }

  const parsedImages =
    typeof viewModalImages === "string"
      ? JSON.parse(viewModalImages)
      : viewModalImages || [];

  const imageFiles = parsedImages.filter((file) =>
    /\.(jpg|jpeg|png|gif)$/i.test(file),
  );

  const pdfFiles = parsedImages.filter((file) => /\.pdf$/i.test(file));

  return (
    <div className="card mt-2">
      <div className="card-header">
        <div className="d-flex align-items-center justify-content-between">
          <div className="titlepage">
            <h3>Hide Projects</h3>
          </div>
          <div className="d-flex gap-2 align-items-center">
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
              <Link
                to="/create-project"
                className="btn btn-success d-inline-flex align-items-center"
              >
                <FaPlus className="me-1" /> Create Project
              </Link>
            </div>
            <div className="d-block d-md-none">
              <div className="d-flex gap-2">
                <button
                  className={`filter-toggle-btn ${isFilterActive ? "active" : ""}`}
                  onClick={handleToggle}
                >
                  {isFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
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
                <th>Project Name</th>
                <th>Category Name</th>
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
                projects.map((project, i) => {
                  const globalIndex = (currentPage - 1) * 10 + i + 1;
                  return (
                    <tr key={project.id}>
                      <td>{globalIndex}</td>
                      <td>
                        {project.name
                          ? project.name.charAt(0).toUpperCase() +
                          project.name.slice(1).toLowerCase()
                          : ""}
                      </td>
                      <td>{project.project_category_name || "NA"}</td>
                      <td>{project.total_township_area}</td>
                      <td>
                        <div className="table-cell-remark">
                          {project.location
                            ? project.location.charAt(0).toUpperCase() +
                            project.location.slice(1).toLowerCase()
                            : ""}
                        </div>
                      </td>
                      <td>{project.bussiness_volume}</td>
                      <td>
                        <div className="table-cell-remark">
                          {project.approve_authority
                            ? project.approve_authority
                              .charAt(0)
                              .toUpperCase() +
                            project.approve_authority.slice(1).toLowerCase()
                            : ""}
                        </div>
                      </td>
                      <td>{project.date}</td>
                      <td>
                        <span
                          className={`badge ${project.status === "active" ? "bg-success" : "bg-danger"}`}
                        >
                          {project.status === "active" ? "Show" : "Hide"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${project.project_status === "ongoing" ? "bg-info" : "bg-primary"}`}
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
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                          >
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
                                variant={project.project_status === "ongoing" ? "outline-primary" : "outline-info"}
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
                  <td colSpan="11" className="text-center">
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
                >
                  <HiChevronRight />
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* View Modal */}
      <Modal
                 show={showViewModal}
                 onHide={handleCloseViewModal}
                 centered
                 size="xl"
               >
                 <Modal.Header closeButton>
                   <Modal.Title>Project Details</Modal.Title>
                 </Modal.Header>
                 <Modal.Body
                   style={{
                     overflowX: "hidden",
                     padding: "20px",
                     maxHeight: "80vh",
                     overflowY: "auto",
                   }}
                 >
                   {selectedProject && (
                     <div style={{ width: "100%" }}>
                       {/* Project Name & Status Header */}
                       <div
                         style={{
                           display: "flex",
                           justifyContent: "space-between",
                           alignItems: "start",
                           flexWrap: "wrap",
                           marginBottom: "20px",
                           paddingBottom: "15px",
                           borderBottom: "2px solid #e9ecef",
                         }}
                       >
                         <div>
                           <h4 style={{ margin: "0 0 8px 0", color: "#0d6efd" }}>
                             {selectedProject.name
                               ? selectedProject.name.charAt(0).toUpperCase() +
                               selectedProject.name.slice(1).toLowerCase()
                               : ""}
                           </h4>
                           <span
                             style={{
                               background: "#0dcaf0",
                               color: "#fff",
                               padding: "5px 12px",
                               borderRadius: "20px",
                               fontSize: "13px",
                               fontWeight: "500",
                               display: "inline-block",
                             }}
                           >
                             {selectedProject.project_category_name
                               ? selectedProject.project_category_name.charAt(0).toUpperCase() +
                               selectedProject.project_category_name.slice(1).toLowerCase()
                               : "NA"}
                           </span>
                         </div>
                         <div style={{ display: "flex", gap: "10px" }}>
                           <span
                             style={{
                               background: selectedProject.status === "active" ? "#198754" : "#dc3545",
                               color: "#fff",
                               padding: "5px 12px",
                               borderRadius: "20px",
                               fontSize: "13px",
                               fontWeight: "500",
                             }}
                           >
                             {selectedProject.status === "active" ? "Show" : "Hide"}
                           </span>
                           <span
                             style={{
                               background: selectedProject.project_status === "ongoing" ? "#0dcaf0" : "#0d6efd",
                               color: "#fff",
                               padding: "5px 12px",
                               borderRadius: "20px",
                               fontSize: "13px",
                               fontWeight: "500",
                             }}
                           >
                             {selectedProject.project_status}
                           </span>
                         </div>
                       </div>
       
                       <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                         {/* Left Column - Table Details */}
                         <div style={{ flex: "7", minWidth: "280px" }}>
                           <div style={{ width: "100%", overflowX: "visible" }}>
                             <table style={{ width: "100%", borderCollapse: "collapse" }}>
                               <tbody>
                                 <tr>
                                   <th
                                     style={{
                                       width: "35%",
                                       backgroundColor: "#f8f9fa",
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                       textAlign: "left",
                                     }}
                                   >
                                     Project Name
                                   </th>
                                   <td
                                     style={{
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                     }}
                                   >
                                     {selectedProject.name
                                       ? selectedProject.name.charAt(0).toUpperCase() +
                                       selectedProject.name.slice(1).toLowerCase()
                                       : ""}
                                   </td>
                                 </tr>
                                 <tr>
                                   <th
                                     style={{
                                       backgroundColor: "#f8f9fa",
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                       textAlign: "left",
                                     }}
                                   >
                                     Category Name
                                   </th>
                                   <td
                                     style={{
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                     }}
                                   >
                                     {selectedProject.project_category_name
                                       ? selectedProject.project_category_name
                                         .charAt(0)
                                         .toUpperCase() +
                                       selectedProject.project_category_name
                                         .slice(1)
                                         .toLowerCase()
                                       : "NA"}
                                   </td>
                                 </tr>
                                 <tr>
                                   <th
                                     style={{
                                       backgroundColor: "#f8f9fa",
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                       textAlign: "left",
                                     }}
                                   >
                                     Total Townships(Sq. Yard)
                                   </th>
                                   <td
                                     style={{
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                     }}
                                   >
                                     {selectedProject.total_township_area}
                                   </td>
                                 </tr>
                                 <tr>
                                   <th
                                     style={{
                                       backgroundColor: "#f8f9fa",
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                       textAlign: "left",
                                     }}
                                   >
                                     Project RERA Number
                                   </th>
                                   <td
                                     style={{
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                     }}
                                   >
                                     {selectedProject.project_rera_no}
                                   </td>
                                 </tr>
                                 <tr>
                                   <th
                                     style={{
                                       backgroundColor: "#f8f9fa",
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                       textAlign: "left",
                                     }}
                                   >
                                     Business Volume
                                   </th>
                                   <td
                                     style={{
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                     }}
                                   >
                                     {selectedProject.bussiness_volume}
                                   </td>
                                 </tr>
                                 <tr>
                                   <th
                                     style={{
                                       backgroundColor: "#f8f9fa",
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                       textAlign: "left",
                                     }}
                                   >
                                     Approve Authority
                                   </th>
                                   <td
                                     style={{
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                     }}
                                   >
                                     {selectedProject.approve_authority
                                       ? selectedProject.approve_authority
                                         .charAt(0)
                                         .toUpperCase() +
                                       selectedProject.approve_authority
                                         .slice(1)
                                         .toLowerCase()
                                       : ""}
                                   </td>
                                 </tr>
                                 <tr>
                                   <th
                                     style={{
                                       backgroundColor: "#f8f9fa",
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                       textAlign: "left",
                                     }}
                                   >
                                     Location
                                   </th>
                                   <td
                                     style={{
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                     }}
                                   >
                                     {selectedProject.location
                                       ? selectedProject.location.charAt(0).toUpperCase() +
                                       selectedProject.location.slice(1).toLowerCase()
                                       : ""}
                                   </td>
                                 </tr>
                                 <tr>
                                   <th style={{ backgroundColor: "#f8f9fa" }}>State</th>
                                   <td>
                                     {selectedProject.state_name
                                       ? selectedProject.state_name.charAt(0).toUpperCase() + selectedProject.state_name.slice(1).toLowerCase()
                                       : "N/A"}
                                   </td>
                                 </tr>
       
                                 {/* City */}
                                 <tr>
                                   <th style={{ backgroundColor: "#f8f9fa" }}>City</th>
                                   <td>
                                     {selectedProject.city_name
                                       ? selectedProject.city_name.charAt(0).toUpperCase() + selectedProject.city_name.slice(1).toLowerCase()
                                       : "N/A"}
                                   </td>
                                 </tr>
       
                                 {/* Category Name */}
                                 
                                 <tr>
                                   <th
                                     style={{
                                       backgroundColor: "#f8f9fa",
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                       textAlign: "left",
                                     }}
                                   >
                                     LandMark
                                   </th>
                                   <td
                                     style={{
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                     }}
                                   >
                                     {selectedProject.land_mark
                                       ? selectedProject.land_mark
                                         .charAt(0)
                                         .toUpperCase() +
                                       selectedProject.land_mark.slice(1).toLowerCase()
                                       : ""}
                                   </td>
                                 </tr>
                                 <tr>
                                   <th
                                     style={{
                                       backgroundColor: "#f8f9fa",
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                       textAlign: "left",
                                     }}
                                   >
                                     Key Transport
                                   </th>
                                   <td
                                     style={{
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                     }}
                                   >
                                     {selectedProject.key_transport
                                       ? (() => {
                                         try {
                                           return JSON.parse(
                                             selectedProject.key_transport
                                           ).map((item, index) => (
                                             <div key={index}>
                                               {item.name} - {item.distance}
                                             </div>
                                           ));
                                         } catch (e) {
                                           return "N/A";
                                         }
                                       })()
                                       : "N/A"}
                                   </td>
                                 </tr>
                                 <tr>
                                   <th
                                     style={{
                                       backgroundColor: "#f8f9fa",
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                       textAlign: "left",
                                     }}
                                   >
                                     Amenities
                                   </th>
                                   <td
                                     style={{
                                       padding: "10px",
                                       border: "1px solid #dee2e6",
                                     }}
                                   >
                                     {selectedProject.aminities
                                       ? (() => {
                                         try {
                                           return JSON.parse(
                                             selectedProject.aminities
                                           ).map((item, index) => (
                                             <div key={index}>
                                               <span
                                                 style={{
                                                   display: "inline-block",
                                                   background: "#e7f1ff",
                                                   color: "#0d6efd",
                                                   padding: "3px 10px",
                                                   margin: "3px",
                                                   borderRadius: "15px",
                                                   fontSize: "12px",
                                                 }}
                                               >
                                                 {item.name}
                                               </span>
                                             </div>
                                           ));
                                         } catch (e) {
                                           return "N/A";
                                         }
                                       })()
                                       : "N/A"}
                                   </td>
                                 </tr>
                               </tbody>
                             </table>
                           </div>
                         </div>
       
                         {/* Right Column - Images */}
                         <div style={{ flex: "5", minWidth: "250px" }}>
                           {/* Thumbnail */}
                           {selectedProject.thumbnail && (
                             <div style={{ marginBottom: "20px" }}>
                               <strong style={{ fontSize: "14px" }}>Thumbnail Image:</strong>
                               <br />
                               <img
                                 src={`${imageAPIURL}/project/${selectedProject.thumbnail}`}
                                 alt="Thumbnail"
                                 style={{
                                   width: "100%",
                                   maxWidth: "250px",
                                   height: "150px",
                                   objectFit: "cover",
                                   borderRadius: "8px",
                                   border: "1px solid #dee2e6",
                                   marginTop: "8px",
                                 }}
                                 onError={(e) => {
                                   e.target.onerror = null;
                                   e.target.src =
                                     "https://placehold.co/250x150/cccccc/000000?text=No+Image";
                                 }}
                               />
                             </div>
                           )}
       
                           {/* Map PDF */}
                           {/* Map PDF */}
                           {/* Map PDF - Inline Preview */}
                           {selectedProject.map_pdf && (
                             <div className="mb-3">
                               <strong>Map PDF:</strong>
                               <br />
                               <div
                                 style={{
                                   width: "100%",
                                   height: "500px",
                                   background: "#f5f5f5",
                                   borderRadius: "8px",
                                   border: "1px solid #dee2e6",
                                   marginTop: "8px",
                                   overflow: "hidden",
                                 }}
                               >
                                 <iframe
                                   src={`${imageAPIURL}/project/${selectedProject.map_pdf}`}
                                   style={{
                                     width: "100%",
                                     height: "100%",
                                     border: "none",
                                   }}
                                   title="Map PDF Preview"
                                 />
                               </div>
                               <div className="text-center mt-2">
                                 <a
                                   href={`${imageAPIURL}/project/${selectedProject.map_pdf}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="btn btn-sm btn-primary"
                                   style={{ textDecoration: "none" }}
                                 >
                                   <i className="fas fa-download"></i> Download PDF
                                 </a>
                               </div>
                             </div>
                           )}
       
                           {/* Gallery Images */}
                           <div style={{ marginBottom: "20px" }}>
                             <strong style={{ fontSize: "14px" }}>Gallery Images:</strong>
                             <br />
                             <div
                               style={{
                                 display: "grid",
                                 gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                                 gap: "8px",
                                 marginTop: "8px",
                               }}
                             >
                               {imageFiles.length > 0 ? (
                                 imageFiles.map((imgName, idx) => (
                                   <img
                                     key={idx}
                                     src={`${imageAPIURL}/project/${imgName}`}
                                     alt={`Gallery ${idx + 1}`}
                                     style={{
                                       width: "100%",
                                       height: "70px",
                                       objectFit: "cover",
                                       borderRadius: "6px",
                                       cursor: "pointer",
                                       border: "1px solid #dee2e6",
                                     }}
                                     onClick={() =>
                                       window.open(`${imageAPIURL}/project/${imgName}`, "_blank")
                                     }
                                     onError={(e) => {
                                       e.target.onerror = null;
                                       e.target.src =
                                         "https://placehold.co/80x70/cccccc/333333?text=No+Image";
                                     }}
                                   />
                                 ))
                               ) : (
                                 <span>No gallery images available.</span>
                               )}
                             </div>
                           </div>
       
                           {/* Property Chain Papers */}
                           <div style={{ marginBottom: "20px" }}>
                             <strong style={{ fontSize: "14px" }}>Property Chain Paper:</strong>
                             <br />
                             {pdfFiles.length > 0 ? (
                               <ul
                                 style={{
                                   marginTop: "8px",
                                   paddingLeft: "20px",
                                 }}
                               >
                                 {pdfFiles.map((pdfName, idx) => (
                                   <li key={idx} style={{ marginBottom: "5px" }}>
                                     <a
                                       href={`${imageAPIURL}/project/${pdfName}`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       style={{ color: "#0d6efd", textDecoration: "none" }}
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
                         </div>
                       </div>
       
                       {/* Description Section */}
                       <div style={{ marginTop: "20px" }}>
                         <hr />
                         <strong style={{ fontSize: "14px" }}>Description:</strong>
                         <div
                           style={{
                             background: "#f8f9fa",
                             padding: "15px",
                             borderRadius: "8px",
                             fontSize: "14px",
                             lineHeight: "1.6",
                             marginTop: "8px",
                           }}
                           dangerouslySetInnerHTML={{
                             __html: selectedProject.description,
                           }}
                         />
                       </div>
                     </div>
                   )}
                 </Modal.Body>
                 <Modal.Footer>
                   <Button variant="danger" onClick={handleCloseViewModal}>
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
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} disabled />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category_id"
                      value={editFormData.category_id}
                      onChange={(e) => {
                        const selectedCategoryId = e.target.value;
                        const selectedCategory = categories.find(cat => String(cat.id) === selectedCategoryId);
                        setEditFormData((prev) => ({
                          ...prev,
                          category_id: selectedCategoryId,
                          category_name: selectedCategory ? selectedCategory.category_name : "",
                        }));
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Total Township Area</Form.Label>
                    <Form.Control type="text" name="project_size" value={editFormData.project_size} onChange={handleEditFormChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Project RERA Number</Form.Label>
                    <Form.Control type="text" name="rera_registration_no" value={editFormData.rera_registration_no} onChange={handleEditFormChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" name="location" value={editFormData.location} onChange={handleEditFormChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Business Volume</Form.Label>
                    <Form.Control type="text" name="businessVolume" value={editFormData.businessVolume} onChange={handleEditFormChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Select name="state" value={editFormData.state} onChange={handleEditFormChange} required>
                      <option value="">Select State</option>
                      {states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Select name="city" value={editFormData.city} onChange={handleEditFormChange} required disabled={!editFormData.state}>
                      <option value="">Select City</option>
                      {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Landmark</Form.Label>
                    <Form.Control type="text" name="landmark" value={editFormData.landmark} onChange={handleEditFormChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Approval Authority</Form.Label>
                    <Form.Control type="text" name="legality" value={editFormData.legality} onChange={handleEditFormChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Amenities</Form.Label>
                    <Form.Control as="select" multiple name="amenities" value={editFormData.amenities} onChange={handleAmenitiesChange} style={{ minHeight: "150px" }}>
                      {amenitiesList.map((amenity) => <option key={amenity.id} value={amenity.id}>{amenity.name}</option>)}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Key Transports</Form.Label>
                    {editFormData.keyTransports.map((kt, index) => (
                      <Row key={index} className="mb-2">
                        <Col md={5}><Form.Control type="text" placeholder="Name" value={kt.name} onChange={(e) => handleKeyTransportChange(index, "name", e.target.value)} /></Col>
                        <Col md={5}><Form.Control type="text" placeholder="Distance" value={kt.distance} onChange={(e) => handleKeyTransportChange(index, "distance", e.target.value)} /></Col>
                        <Col md={2}><Button variant="danger" size="sm" onClick={() => removeKeyTransport(index)}><RiDeleteBin3Fill /></Button></Col>
                      </Row>
                    ))}
                    <Button variant="outline-primary" size="sm" onClick={addKeyTransport}>Add Transport</Button>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows="4" name="description" value={editFormData.description} onChange={handleEditFormChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Thumbnail Image</Form.Label>
                {editFormData.current_single_image_url && (
                  <div className="mb-2">
                    <img src={`${imageAPIURL}/project/${editFormData.current_single_image_url}`} alt="Thumbnail" style={{ width: "100px" }} />
                    <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDeleteExistingSingleImage(editFormData.project_id)}>Remove</Button>
                  </div>
                )}
                <Form.Control type="file" onChange={handleNewSingleImageChange} ref={newSingleImageInputRef} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Map PDF</Form.Label>
                {editFormData.imageprojectmap_image_url && (
                  <div className="mb-2">
                    <Button variant="danger" size="sm" onClick={() => handleDeleteExistingMapImage(editFormData.project_id)}>Remove Current Map</Button>
                  </div>
                )}
                <Form.Control type="file" onChange={handleNewMapImageChange} ref={newMapImageInputRef} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Project Images</Form.Label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {editFormData.images.map(img => (
                    <div key={img.id} className="position-relative">
                      <img src={`${imageAPIURL}/project/${img.image}`} alt="Project" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                      <Button variant="danger" size="sm" className="position-absolute top-0 end-0" onClick={() => handleDeleteExistingMultiImage(img.id)}>X</Button>
                    </div>
                  ))}
                </div>
                <Form.Control type="file" multiple onChange={handleNewMultiImageChange} ref={newMultiImageInputRef} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Project PDFs</Form.Label>
                {editFormData.pdfs.map(pdf => (
                  <div key={pdf.id} className="d-flex justify-content-between mb-1">
                    <a href={`${selectedimagePath}/${pdf.pdf}`} target="_blank" rel="noopener noreferrer">{pdf.pdf}</a>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteExistingPDF(pdf.id)}><RiDeleteBin3Fill /></Button>
                  </div>
                ))}
                <Form.Control type="file" multiple accept="application/pdf" onChange={handleNewMultiPDFChange} ref={newMultiPDFInputRef} />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={editFormData.status} onChange={handleEditFormChange}>
                      <option value="active">Show</option>
                      <option value="inactive">Hide</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Project Status</Form.Label>
                    <Form.Select name="project_status" value={editFormData.project_status} onChange={handleEditFormChange}>
                      <option value="ongoing">Ongoing</option>
                      <option value="complete">Complete</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>YouTube Link</Form.Label>
                <Form.Control type="text" name="youtube_links" value={editFormData.youtube_links} onChange={handleEditFormChange} />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                {loading ? "Updating..." : "Update Project"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Message Modal */}
        {showMessageModal && (
          <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>{messageModalContent.title}</h5>
                  <button className="btn-close" onClick={closeCustomMessageModal}></button>
                </div>
                <div className="modal-body">
                  <p>{messageModalContent.text}</p>
                </div>
                <div className="modal-footer justify-content-center">
                  {messageModalContent.confirmAction ? (
                    <>
                      <Button variant="info" onClick={() => { messageModalContent.confirmAction(); closeCustomMessageModal(); }}>Confirm</Button>
                      <Button variant="secondary" onClick={closeCustomMessageModal}>Cancel</Button>
                    </>
                  ) : (
                    <Button variant={messageModalContent.type === 'error' ? 'danger' : 'success'} onClick={closeCustomMessageModal}>OK</Button>
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