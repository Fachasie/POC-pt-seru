// JobOrderCreate.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

const JobOrderCreate = () => {
  const navigate = useNavigate();
  
  // State untuk menampung data dari API
  const [equipments, setEquipments] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  // State untuk form data
  const [formData, setFormData] = useState({
    project_site: "",
    equipment_id: "", // Menggunakan ID
    keterangan_equipment: "", // Akan diisi otomatis
    date_form: "",
    hm: "",
    km: "",
    job_type_id: "", // Menggunakan ID
    uraian_masalah: "",
    nama_operator: "",
    tanggal_masuk: "",
    tanggal_keluar: "",
    status_mutasi: "",
    status: "",
  });

  // 1. Fetch data untuk dropdown saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipmentsRes, jobTypesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/equipments`),
          axios.get(`${API_BASE_URL}/job-types`),
        ]);
        setEquipments(equipmentsRes.data);
        setJobTypes(jobTypesRes.data);
      } catch (error) {
        console.error("Gagal mengambil data untuk form:", error);
        alert("Gagal memuat data master. Pastikan server backend berjalan.");
      }
    };
    fetchData();
  }, []);

  // 2. Handler untuk input biasa
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 3. Handler khusus untuk dropdown equipment
  const handleEquipmentChange = (e) => {
    const selectedEquipmentId = e.target.value;
    const selectedEquipment = equipments.find(
      (eq) => eq.id === parseInt(selectedEquipmentId)
    );

    setFormData({
      ...formData,
      equipment_id: selectedEquipmentId,
      keterangan_equipment: selectedEquipment ? selectedEquipment.keterangan_equipment : "",
    });
  };

  // 4. Handler untuk submit form
  const handleCreate = async (e) => {
    e.preventDefault();
    // Hapus field yang tidak perlu dikirim
    const dataToSubmit = { ...formData };
    delete dataToSubmit.keterangan_equipment; 

    try {
      await axios.post(`${API_BASE_URL}/job-orders`, dataToSubmit);
      alert("Job Order berhasil dibuat!");
      navigate(`/job-orders`);
    } catch (err) {
      console.error("Error creating job order:", err);
      alert("Gagal membuat Job Order. Periksa kembali isian Anda.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          &larr; Kembali
        </button>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <form onSubmit={handleCreate}>
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Buat Job Order Baru</h3>
              <div className="flex gap-2 items-center">
                <button type="submit" className="btn btn-secondary">
                  Simpan
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kolom Kiri */}
              <div>
                <label className="form-control w-full">
                  <div className="label"><span className="label-text">Project Site</span></div>
                  <input type="text" name="project_site" value={formData.project_site} onChange={handleInputChange} className="input input-bordered w-full" required />
                </label>

                {/* Dropdown No Lambung */}
                <label className="form-control w-full">
                  <div className="label"><span className="label-text">No Lambung</span></div>
                  <select name="equipment_id" value={formData.equipment_id} onChange={handleEquipmentChange} className="select select-bordered w-full" required>
                    <option value="" disabled>Pilih No Lambung</option>
                    {equipments.map((eq) => (
                      <option key={eq.id} value={eq.id}>{eq.no_lambung}</option>
                    ))}
                  </select>
                </label>

                {/* Keterangan Equipment (Read-only) */}
                <label className="form-control w-full">
                  <div className="label"><span className="label-text">Keterangan Equipment</span></div>
                  <input type="text" name="keterangan_equipment" value={formData.keterangan_equipment} className="input input-bordered w-full" readOnly />
                </label>

                <label className="form-control w-full">
                  <div className="label"><span className="label-text">Date Form</span></div>
                  <input type="date" name="date_form" value={formData.date_form} onChange={handleInputChange} className="input input-bordered w-full" required />
                </label>

                <label className="form-control w-full">
                  <div className="label"><span className="label-text">HM</span></div>
                  <input type="number" name="hm" value={formData.hm} onChange={handleInputChange} className="input input-bordered w-full" required />
                </label>

                <label className="form-control w-full">
                  <div className="label"><span className="label-text">KM</span></div>
                  <input type="number" name="km" value={formData.km} onChange={handleInputChange} className="input input-bordered w-full" required />
                </label>
              </div>

              {/* Kolom Kanan */}
              <div>
                {/* Dropdown Jenis Pekerjaan */}
                <label className="form-control w-full">
                  <div className="label"><span className="label-text">Jenis Pekerjaan</span></div>
                  <select name="job_type_id" value={formData.job_type_id} onChange={handleInputChange} className="select select-bordered w-full" required>
                    <option value="" disabled>Pilih Jenis Pekerjaan</option>
                    {jobTypes.map((jt) => (
                      <option key={jt.id} value={jt.id}>{jt.jenis_pekerjaan}</option>
                    ))}
                  </select>
                </label>

                <label className="form-control w-full">
                  <div className="label"><span className="label-text">Uraian Masalah</span></div>
                  <textarea name="uraian_masalah" value={formData.uraian_masalah} onChange={handleInputChange} className="textarea textarea-bordered h-24 w-full" required></textarea>
                </label>

                <label className="form-control w-full">
                  <div className="label"><span className="label-text">Nama Operator</span></div>
                  <input type="text" name="nama_operator" value={formData.nama_operator} onChange={handleInputChange} className="input input-bordered w-full" required />
                </label>

                <label className="form-control w-full">
                  <div className="label"><span className="label-text">Tanggal Masuk</span></div>
                  <input type="date" name="tanggal_masuk" value={formData.tanggal_masuk} onChange={handleInputChange} className="input input-bordered w-full" required />
                </label>

                <label className="form-control w-full">
                  <div className="label"><span className="label-text">Tanggal Keluar</span></div>
                  <input type="date" name="tanggal_keluar" value={formData.tanggal_keluar} onChange={handleInputChange} className="input input-bordered w-full" required />
                </label>

                <label className="form-control w-full">
                  <div className="label"><span className="label-text">Status Mutasi</span></div>
                  <input type="text" name="status_mutasi" value={formData.status_mutasi} onChange={handleInputChange} className="input input-bordered w-full" required />
                </label>

                <label className="form-control w-full">
                  <div className="label"><span className="label-text">Status</span></div>
                  <input type="text" name="status" value={formData.status} onChange={handleInputChange} className="input input-bordered w-full" required />
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobOrderCreate;
