import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAllSliders, createSlider, updateSlider, deleteSlider } from "../../Server/api";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";

const Slider = () => {
  const [settings, setSettings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [form, setForm] = useState({
    id: "",
    image: "",
    file: null,
    title: "",
    description: "",
    status: "1",
    order: 0
  });

  const sliderLists = async () => {
    try {
      const res = await getAllSliders();

      if (res.data.success) {
        setSettings(res.data.data || []);
      } else {
        Swal.fire("Error", "Failed to fetch sliders.", "error");
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
    }
  };

  useEffect(() => {
    sliderLists();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setForm((prev) => ({
        ...prev,
        file: files[0],
        image: files[0] ? URL.createObjectURL(files[0]) : prev.image // Preview for new file
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddClick = () => {
    setForm({
      id: "",
      image: "",
      file: null,
      title: "",
      description: "",
      status: "1",
      order: 0
    });
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleEditClick = (item) => {
    setForm({
      id: item._id,
      image: item.image || "",   // String
      file: null,
      title: item.title || "",
      description: item.description || "",
      status: item.status || "1",
      order: item.order || 0
    });
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      const res = await deleteSlider(id);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Slider Deleted Successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
        sliderLists();
      } else {
        Swal.fire("Error", "Failed to delete slider", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const handleSubmit = async () => {
    // Validation for new slider
    if (!isEditMode && !form.file) {
      Swal.fire("Error", "Slider image is required!", "error");
      return;
    }

    const formData = new FormData();
    if (isEditMode) {
      formData.append("id", form.id);
    }
    if (form.file instanceof File) {
      formData.append("image", form.file);
    }


    formData.append("id", form.id);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("order", form.order);
    formData.append("status", form.status);

    try {
      let res = isEditMode
        ? await updateSlider(formData)
        : await createSlider(formData);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: isEditMode ? "Updated!" : "Added!",
          text: isEditMode
            ? "Slider Updated Successfully!"
            : "Slider Added Successfully!",
          timer: 1500,
          showConfirmButton: false,
        });

        setModalOpen(false);
        sliderLists();
      } else {
        Swal.fire("Error", res.data.error || "Operation failed!", "error");
      }
    } catch (error) {
      console.error("Error submitting slider:", error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-color-black">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="card-title text-white mb-0">Slider Setting</h3>
          <button className="backbutton" onClick={handleAddClick}>
            Add Slider
          </button>
        </div>
      </div>

      <div className="card-body p-0 pt-2">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Order</th>
                <th>Slider Image</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {settings.length > 0 ? (
                settings.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}.</td>
                    <td>{item.title || "-"}</td>
                    <td>{item.description || "-"}</td>
                    <td>
                      <span className={`badge ${item.status === "1" ? "activebadge" : "inactivebadge"}`}>
                        {item.status === "1" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{item.order}</td>
                    <td>
                      <img
                        src={item.image}
                        alt="slider"
                        style={{
                          width: 150,
                          height: 100,
                          objectFit: "contain",
                        }}
                      />

                    </td>
                    <td className="">
                      <div className="actions">

                        <button
                          className="actionbutton edit"
                          onClick={() => handleEditClick(item)}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className="actionbutton delete"
                          onClick={() => handleDeleteClick(item._id)}
                        >
                          <RiDeleteBin3Fill />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No sliders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="modal d-block" style={{ background: "#00000080" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditMode ? "Edit Slider" : "Add Slider"}
                  </h5>
                  <button className="btn-close" onClick={() => setModalOpen(false)}></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={form.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      value={form.description}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-control"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Order</label>
                    <input
                      type="number"
                      name="order"
                      className="form-control"
                      value={form.order}
                      onChange={handleChange}
                    />
                  </div>

                  <label className="form-label">Image (JPG PNG)</label>
                  <input
                    type="file"
                    name="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleChange}
                    key={modalOpen ? "file-input" : "reset"}
                  />

                  {/* Show preview for new file */}
                  {form.file && form.file instanceof File && (
                    <img
                      src={URL.createObjectURL(form.file)}
                      style={{ width: 80, height: 60 }}
                      alt="Preview"
                    />
                  )}

                  {/* Show current image in edit mode */}
                  {isEditMode && form.image && !form.file && (
                    <img
                      src={form.image}
                      style={{ width: 80, height: 60 }}
                      alt="Current"
                    />
                  )}


                </div>

                <div className="modal-footer">

                  <button className="importbutton" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button className="submitbutton" onClick={handleSubmit}>
                    {isEditMode ? "Update" : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Slider;