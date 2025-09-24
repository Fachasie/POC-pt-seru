import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NotificationModal from "./NotificationModal"; // added import

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

  // State untuk modal notification
  const [modal, setModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
  });

  // Helper function untuk menampilkan modal
  const showModal = (type, title, message, onConfirm = null) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
    });
  };

  // Helper function untuk menutup modal
  const closeModal = () => {
    setModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
    // Execute onConfirm callback if exists
    if (modal.onConfirm) {
      // call after closing
      modal.onConfirm();
    }
  };

  // Fetch data master (equipments & job types) saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [equipmentsRes, jobTypesRes, jobOrderRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/equipments`),
          axios.get(`${API_BASE_URL}/job-types`),
          axios.get(`${API_BASE_URL}/job-orders/${id}`),
        ]);

        const allEquipments = equipmentsRes.data;
        const allJobTypes = jobTypesRes.data;
        const jobOrderData = jobOrderRes.data;

        // ======================= SOLUSI UNTUK EQUIPMENT =======================
        const noLambungFromJobOrder = jobOrderData.no_lambung;
        const matchingEquipment = allEquipments.find(
          (eq) => eq.no_lambung === noLambungFromJobOrder
        );
        const targetEquipmentId = matchingEquipment ? matchingEquipment.id : "";
        // ======================================================================

        // ==================== SOLUSI UNTUK JENIS PEKERJAAN ====================
        const jenisPekerjaanFromJobOrder = jobOrderData.jenis_pekerjaan;
        const matchingJobType = allJobTypes.find(
          (jt) => jt.jenis_pekerjaan === jenisPekerjaanFromJobOrder
        );
        const targetJobTypeId = matchingJobType ? matchingJobType.id : "";
        // ======================================================================

        // Set state master data
        setEquipments(allEquipments);
        setJobTypes(allJobTypes);

        // Set state form dengan ID yang sudah kita temukan
        setFormData({
          ...jobOrderData,
          equipment_id: String(targetEquipmentId), // Gunakan ID Equipment yang ditemukan
          job_type_id: String(targetJobTypeId), // Gunakan ID Jenis Pekerjaan yang ditemukan

          date_form: formatDateForInput(jobOrderData.date_form),
          tanggal_masuk: formatDateForInput(jobOrderData.tanggal_masuk),
          tanggal_keluar: formatDateForInput(jobOrderData.tanggal_keluar),
        });

        setKeteranganEquipment(jobOrderData.keterangan_equipment || "");
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        showModal(
          "error",
          "Gagal Memuat Data",
          "Gagal memuat data untuk halaman edit. Mengarahkan kembali...",
          () => navigate("/job-orders")
        );
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
    const selectedEquipment =
      selectedEquipmentId !== ""
        ? equipments.find((eq) => eq.id === parseInt(selectedEquipmentId, 10))
        : null;

    setFormData({
      ...formData,
      equipment_id: selectedEquipmentId,
    });

    // Update state keterangan equipment secara terpisah
    setKeteranganEquipment(
      selectedEquipment ? selectedEquipment.keterangan_equipment : ""
    );
  };

  // Helper: validasi tanggal (tanggal_keluar harus >= tanggal_masuk jika diisi)
  const validateDates = ({ tanggal_masuk, tanggal_keluar }) => {
    if (!tanggal_masuk) return { ok: true };
    if (!tanggal_keluar) return { ok: true };
    const masuk = new Date(tanggal_masuk);
    const keluar = new Date(tanggal_keluar);
    if (isNaN(masuk.getTime()) || isNaN(keluar.getTime())) {
      return { ok: false, message: "Format tanggal tidak valid." };
    }
    if (keluar.getTime() < masuk.getTime()) {
      return {
        ok: false,
        message: "Tanggal Keluar tidak bisa sebelum Tanggal Masuk.",
      };
    }
    return { ok: true };
  };

  // Handler untuk submit form update
  const handleUpdate = async (e) => {
    e.preventDefault();

    // validasi tanggal sebelum membangun payload / kirim
    const validation = validateDates({
      tanggal_masuk: formData.tanggal_masuk,
      tanggal_keluar: formData.tanggal_keluar,
    });
    if (!validation.ok) {
      showModal(
        "error",
        "Validasi Gagal",
        `Gagal memperbarui Job Order. ${validation.message}`
      );
      return;
    }

    try {
      // Bangun payload yang bersih dan konversi tipe sesuai ekspektasi backend
      const payload = {
        project_site: formData.project_site,
        equipment_id:
          formData.equipment_id !== "" ? parseInt(formData.equipment_id, 10) : null,
        date_form: formData.date_form
          ? new Date(formData.date_form).toISOString()
          : null,
        hm: formData.hm !== "" ? Number(formData.hm) : null,
        km: formData.km !== "" ? Number(formData.km) : null,
        job_type_id:
          formData.job_type_id !== "" ? parseInt(formData.job_type_id, 10) : null,
        uraian_masalah: formData.uraian_masalah,
        nama_operator: formData.nama_operator,
        tanggal_masuk: formData.tanggal_masuk
          ? new Date(formData.tanggal_masuk).toISOString()
          : null,
        tanggal_keluar: formData.tanggal_keluar
          ? new Date(formData.tanggal_keluar).toISOString()
          : null,
        status_mutasi: formData.status_mutasi,
        status: formData.status,
      };

      await axios.put(`${API_BASE_URL}/job-orders/${id}`, payload);
      showModal(
        "success",
        "Berhasil!",
        "Job Order berhasil diperbarui!",
        () => navigate(`/job-orders`)
      );
    } catch (err) {
      console.error("Error updating job order:", err);
      const serverMsg =
        err?.response?.data || err?.response?.statusText || err.message;
      showModal(
        "error",
        "Gagal Memperbarui Job Order",
        `Gagal memperbarui Job Order. ${serverMsg}`
      );
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
      {/* Notification Modal */}
      <NotificationModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
      />
    </div>
  );
};

export default JobOrderUpdate;
