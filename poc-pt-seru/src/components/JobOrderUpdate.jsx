// JobOrderUpdate.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3001/job_order";

const JobOrderUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobOrder = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job order:", err);
        setError("Gagal memuat data job order.");
        setLoading(false);
      }
    };
    fetchJobOrder();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${id}`, formData);
      alert("Job Order berhasil diperbarui!");
      navigate(`/job-orders`); // Redirect back to the list
    } catch (err) {
      console.error("Error updating job order:", err);
      alert("Gagal memperbarui Job Order.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          &larr; Kembali
        </button>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <form onSubmit={handleUpdate}>
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Edit Job Order</h3>
              <div className="flex gap-2 items-center">
                <button type="submit" className="btn btn-secondary">
                  Update
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Project Site</span>
                  </div>
                  <input
                    type="text"
                    name="project_site"
                    value={formData.project_site}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">No Lambung</span>
                  </div>
                  <input
                    type="text"
                    name="no_lambung"
                    value={formData.no_lambung}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Date Form</span>
                  </div>
                  <input
                    type="date"
                    name="date_form"
                    value={formData.date_form}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Keterangan Equipment</span>
                  </div>
                  <input
                    type="text"
                    name="keterangan_equipment"
                    value={formData.keterangan_equipment}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">HM</span>
                  </div>
                  <input
                    type="text"
                    name="hm"
                    value={formData.hm}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">KM</span>
                  </div>
                  <input
                    type="text"
                    name="km"
                    value={formData.km}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </label>
              </div>
              <div>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Jenis Pekerjaan</span>
                  </div>
                  <input
                    type="text"
                    name="jenis_pekerjaan"
                    value={formData.jenis_pekerjaan}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Uraian Masalah</span>
                  </div>
                  <textarea
                    name="uraian_masalah"
                    value={formData.uraian_masalah}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-24 w-full"
                  ></textarea>
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Nama Operator</span>
                  </div>
                  <input
                    type="text"
                    name="nama_operator"
                    value={formData.nama_operator}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Tanggal Masuk</span>
                  </div>
                  <input
                    type="date"
                    name="tanggal_masuk"
                    value={formData.tanggal_masuk}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Tanggal Keluar</span>
                  </div>
                  <input
                    type="date"
                    name="tanggal_keluar"
                    value={formData.tanggal_keluar}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Status Mutasi</span>
                  </div>
                  <input
                    type="text"
                    name="status_mutasi"
                    value={formData.status_mutasi}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Status</span>
                  </div>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobOrderUpdate;
