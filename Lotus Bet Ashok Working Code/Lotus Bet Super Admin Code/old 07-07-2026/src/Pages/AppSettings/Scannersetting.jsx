import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAllScanners,
  createScannersetting,
  updateScanner,
  deleteScanner,
  viewScanner,
  changeScannerStatus,
} from "../../Server/api";

const Scannersetting = () => {
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({ id: "", name: "", image: "", file: null });
  const [viewData, setViewData] = useState(null);

  /* ================= FETCH LIST ================= */
  const fetchList = async () => {
    const res = await getAllScanners();
    if (res.data.success) {
      const updatedList = res.data.data.map((item) => ({
        ...item,
        status: item.status === "1",
      }));
      setList(updatedList);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm((p) => ({
        ...p,
        file: files[0],
        image: files[0] ? URL.createObjectURL(files[0]) : p.image,
      }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  /* ================= ADD ================= */
  const handleAdd = () => {
    setForm({ id: "", name: "", image: "", file: null });
    setIsEdit(false);
    setModalOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = async (item) => {
    const res = await viewScanner(item._id);
    if (res.data.success) {
      const s = res.data.data;
      setForm({ id: s._id, name: s.name, image: s.image_url?.replace(/\\/g, "/") || s.image, file: null });
      setIsEdit(true);
      setModalOpen(true);
    }
  };

  /* ================= VIEW MODAL ================= */
  const handleView = async (id) => {
    const res = await viewScanner(id);
    if (res.data.success) {
      const data = { ...res.data.data, status: res.data.data.status === "1" };
      setViewData(data);
      setViewModal(true);
    }
  };

  /* ================= CHANGE STATUS (Toggle) ================= */
  const handleStatusChange = async (id) => {
    const res = await changeScannerStatus(id);
    if (res.data.success) {
      Swal.fire("Success", res.data.message, "success");

      // Only one scanner active
      setList((prevList) =>
        prevList.map((item) => ({
          ...item,
          status: item._id === id,
        }))
      );

      if (viewData) {
        setViewData((prev) => ({
          ...prev,
          status: prev._id === id,
        }));
      }
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const ok = await Swal.fire({ title: "Are you sure?", icon: "warning", showCancelButton: true });
    if (!ok.isConfirmed) return;

    const res = await deleteScanner(id);
    if (res.data.success) {
      Swal.fire("Deleted", "Scanner removed", "success");
      fetchList();
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name) return Swal.fire("Error", "Name required", "error");

    const fd = new FormData();
    fd.append("name", form.name);

    if (form.file) {
      fd.append("image", form.file);
    } else if (isEdit && form.image) {
      fd.append("existing_image", form.image);
    } else {
      return Swal.fire("Error", "Scanner image is required", "error");
    }

    const res = isEdit
      ? await updateScanner(form.id, fd)
      : await createScannersetting(fd);

    if (res.data.success) {
      Swal.fire("Success", "Saved", "success");
      setModalOpen(false);
      fetchList();
    } else {
      Swal.fire("Error", res.data.error || "Something went wrong", "error");
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-header bg-primary-yellow">
         <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-title  mb-0">Scanner Setting</h3>
        <button className="backbutton" onClick={handleAdd}>
          Add Scanner
        </button>
          </div>
      </div>

      <div className="card-body table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Image</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, i) => (
              <tr key={item._id}>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>
                  <img src={(item.image_url || item.image).replace(/\\/g, "/")} width="60" alt={item.name} />
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={item.status}
                      onChange={() => handleStatusChange(item._id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td className="actions">
                  <button className="actionbutton view" onClick={() => handleView(item._id)}>
                    View
                  </button>
                  <button className="actionbutton edit" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button className="actionbutton danger" onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {viewModal && viewData && (
        <div className="modal d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Scanner Details</h5>
                <button className="btn-close" onClick={() => setViewModal(false)} />
              </div>
              <div className="modal-body">
                <p><b>Name:</b> {viewData.name}</p>
                <p>
                  <b>Status:</b>{" "}
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={viewData.status}
                      onChange={() => handleStatusChange(viewData._id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </p>
                <p><b>Created:</b> {new Date(viewData.created_at).toLocaleString()}</p>
                <img src={(viewData.image_url || viewData.image).replace(/\\/g, "/")} width="120" alt={viewData.name} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={() => setViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="modal d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{isEdit ? "Edit" : "Add"} Scanner</h5>
                <button className="btn-close" onClick={() => setModalOpen(false)} />
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
                <input type="file" name="file" className="form-control" onChange={handleChange} />
                {form.image && <img src={form.image.replace(/\\/g, "/")} width="100" className="mt-2" alt="Preview" />}
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleSubmit}>Save</button>
                <button className="btn btn-danger" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scannersetting;
