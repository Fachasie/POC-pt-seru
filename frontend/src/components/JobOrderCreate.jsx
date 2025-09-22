// JobOrderCreate.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

// Helper function untuk mendapatkan waktu lokal saat ini dalam format YYYY-MM-DDTHH:MM
const getCurrentDateTimeLocal = () => {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localISOTime = new Date(now - tzOffset).toISOString().slice(0, 16);
  return localISOTime;
};

const JobOrderCreate = () => {
  const navigate = useNavigate();
  const modalRef = useRef(null); // Modal untuk error tanggal
  const successModalRef = useRef(null); // Modal untuk sukses

  // State untuk menampung data dari API
  const [equipments, setEquipments] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  // State untuk form data dengan nilai default
  const [formData, setFormData] = useState({
    project_site: "",
    equipment_id: "",
    date_form: getCurrentDateTimeLocal(),
    hm: "",
    km: "",
    job_type_id: "",
    uraian_masalah: "",
    nama_operator: "",
    tanggal_masuk: getCurrentDateTimeLocal(),
    tanggal_keluar: "",
    status_mutasi: "no mutasi",
    status: "On Progress",
  });

  // State untuk keterangan equipment (hanya untuk tampilan)
  const [keteranganEquipment, setKeteranganEquipment] = useState("");

  // Fetch data untuk dropdown
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
      }
    };
    fetchData();
  }, []);

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
    setKeteranganEquipment(
      selectedEquipment ? selectedEquipment.keterangan_equipment : ""
    );
  };

  // Handler untuk submit form
  const handleCreate = async (e) => {
    e.preventDefault();

    // --- BLOK VALIDASI TANGGAL DIPERBARUI ---
    const { tanggal_masuk, tanggal_keluar } = formData;
    if (tanggal_keluar && new Date(tanggal_keluar) < new Date(tanggal_masuk)) {
      // Tampilkan modal, bukan alert
      modalRef.current.showModal(); 
      return; 
    }
    // --- AKHIR BLOK VALIDASI ---

    try {
      await axios.post(`${API_BASE_URL}/job-orders`, formData);
      // alert("Job Order berhasil dibuat!");
      successModalRef.current.showModal();
      setTimeout(() => {
        successModalRef.current.close();
        navigate(`/job-orders`);
      }, 1500);
    } catch (err) {
      console.error("Error creating job order:", err);
      alert("Gagal membuat Job Order. Periksa kembali isian Anda.");
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Modal Error Tanggal */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6 text-error mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-bold text-lg text-center">Validasi Gagal!</h3>
          <p className="py-4 text-center">
            Tanggal Keluar tidak boleh lebih awal dari Tanggal Masuk.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary mx-auto">Tutup</button>
            </form>
          </div>
        </div>
      </dialog>
      {/* Modal Sukses */}
      <dialog ref={successModalRef} className="modal">
        <div className="modal-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6 text-success mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="font-bold text-lg text-center">Berhasil!</h3>
          <p className="py-4 text-center">
            Job Order berhasil dibuat!
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary mx-auto" onClick={() => navigate(`/job-orders`)}>Tutup</button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Buat Job Order Baru</h3>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate(-1)}
          >
            &larr; Kembali
          </button>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <form onSubmit={handleCreate}>
            {/* ...isi form tidak berubah... */}
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
                  Simpan Job Order
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobOrderCreate;