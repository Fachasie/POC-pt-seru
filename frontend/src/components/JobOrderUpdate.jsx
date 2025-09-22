import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

// Helper function untuk format tanggal ke YYYY-MM-DDTHH:MM
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date - tzOffset).toISOString().slice(0, 16);
  return localISOTime;
};

const JobOrderUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Mengambil ID dari URL

  // State untuk menampung data dari API
  const [equipments, setEquipments] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  // State untuk form data, diinisialisasi kosong
  const [formData, setFormData] = useState({
    project_site: "",
    equipment_id: "",
    date_form: "",
    hm: "",
    km: "",
    job_type_id: "",
    uraian_masalah: "",
    nama_operator: "",
    tanggal_masuk: "",
    tanggal_keluar: "",
    status_mutasi: "no mutasi",
    status: "On Progress",
  });

  // State untuk keterangan equipment (hanya untuk tampilan)
  const [keteranganEquipment, setKeteranganEquipment] = useState("");

  // Fetch data master (equipments & job types) saat komponen dimuat
useEffect(() => {
  const fetchData = async () => {
    // Jangan jalankan jika tidak ada ID
    if (!id) return;

    try {
      // Jalankan semua request API secara bersamaan
      const [equipmentsRes, jobTypesRes, jobOrderRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/equipments`),
        axios.get(`${API_BASE_URL}/job-types`),
        axios.get(`${API_BASE_URL}/job-orders/${id}`),
      ]);

      // 1. Set state untuk master data (dropdown options)
      setEquipments(equipmentsRes.data);
      setJobTypes(jobTypesRes.data);

      // 2. Ambil data job order yang spesifik
     const jobOrderData = jobOrderRes.data;

     // 3. Set state untuk form, PASTIKAN ID MENJADI STRING
     setFormData({
       ...jobOrderData,
       // ---- PERUBAHAN DI SINI ----
       equipment_id: String(jobOrderData.equipment_id), // Paksa jadi String
       job_type_id: String(jobOrderData.job_type_id), // Paksa jadi String
       // --------------------------
       date_form: formatDateForInput(jobOrderData.date_form),
       tanggal_masuk: formatDateForInput(jobOrderData.tanggal_masuk),
       tanggal_keluar: formatDateForInput(jobOrderData.tanggal_keluar),
     });

     // 4. Set keterangan equipment untuk ditampilkan
     setKeteranganEquipment(jobOrderData.keterangan_equipment || "");

      // 4. Set keterangan equipment untuk ditampilkan
      setKeteranganEquipment(jobOrderData.keterangan_equipment || "");
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      alert("Gagal memuat data untuk halaman edit. Mengarahkan kembali...");
      navigate("/job-orders");
    }
  };

  fetchData();
}, [id, navigate]);

  // Handler untuk input biasa
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handler khusus untuk dropdown equipment
  const handleEquipmentChange = (e) => {
    const selectedEquipmentId = e.target.value;
    const selectedEquipment = equipments.find(
      (eq) => eq.id === parseInt(selectedEquipmentId)
    );

    setFormData({
      ...formData,
      equipment_id: selectedEquipmentId,
    });

    // Update state keterangan equipment secara terpisah
    setKeteranganEquipment(
      selectedEquipment ? selectedEquipment.keterangan_equipment : ""
    );
  };

  // Handler untuk submit form update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/job-orders/${id}`, formData);
      alert("Job Order berhasil diperbarui!");
      navigate(`/job-orders`);
    } catch (err) {
      console.error("Error updating job order:", err);
      alert("Gagal memperbarui Job Order. Periksa kembali isian Anda.");
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Edit Job Order #{id}</h3>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate(-1)}
          >
            &larr; Kembali
          </button>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <form onSubmit={handleUpdate}>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kolom Kiri */}
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
                      required
                    />
                  </label>

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">No Lambung</span>
                    </div>
                    <select
                      name="equipment_id"
                      value={formData.equipment_id}
                      onChange={handleEquipmentChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="" disabled>
                        Pilih No Lambung
                      </option>
                      {equipments.map((eq) => (
                        <option key={eq.id} value={eq.id}>
                          {eq.no_lambung}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Keterangan Equipment</span>
                    </div>
                    <input
                      type="text"
                      name="keterangan_equipment"
                      value={keteranganEquipment}
                      className="input input-bordered w-full bg-gray-100"
                      readOnly
                    />
                  </label>

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Date Form</span>
                    </div>
                    <input
                      type="datetime-local"
                      name="date_form"
                      value={formData.date_form}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">HM</span>
                    </div>
                    <input
                      type="number"
                      step="any"
                      name="hm"
                      value={formData.hm}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">KM</span>
                    </div>
                    <input
                      type="number"
                      step="any"
                      name="km"
                      value={formData.km}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>
                </div>

                {/* Kolom Kanan */}
                <div>
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Jenis Pekerjaan</span>
                    </div>
                    <select
                      name="job_type_id"
                      value={formData.job_type_id}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="" disabled>
                        Pilih Jenis Pekerjaan
                      </option>
                      {jobTypes.map((jt) => (
                        <option key={jt.id} value={jt.id}>
                          {jt.jenis_pekerjaan}
                        </option>
                      ))}
                    </select>
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
                      required
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
                      required
                    />
                  </label>

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Tanggal Masuk</span>
                    </div>
                    <input
                      type="datetime-local"
                      name="tanggal_masuk"
                      value={formData.tanggal_masuk}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </label>

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Tanggal Keluar</span>
                    </div>
                    <input
                      type="datetime-local"
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
                    <select
                      name="status_mutasi"
                      value={formData.status_mutasi}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="no mutasi">no mutasi</option>
                      <option value="ada mutasi">ada mutasi</option>
                    </select>
                  </label>

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Status</span>
                    </div>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="On Progress">On Progress</option>
                      <option value="Full Progress">Full Progress</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="card-actions justify-end mt-6">
                <button type="submit" className="btn btn-primary">
                  Update Job Order
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobOrderUpdate;
