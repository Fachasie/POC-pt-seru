import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NotificationModal from "./NotificationModal";

const JOB_ORDER_API_URL = "http://localhost:3001/api/job-orders";
const WORK_ORDER_API_URL = "http://localhost:3001/api/work-orders";

const JobOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State untuk data
  const [jobOrder, setJobOrder] = useState(null);
  const [workOrders, setWorkOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Modal dan Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [newWorkOrder, setNewWorkOrder] = useState({
    analisa: "",
    solusi: "",
    mekanik: "",
    mulai_kerja: "",
    estimasi_kerja: "",
  });

  // Fungsi untuk mengambil data Work Order (dibuat terpisah agar bisa dipanggil ulang)
  const fetchWorkOrders = async () => {
    try {
      const response = await axios.get(WORK_ORDER_API_URL);
      const filtered = response.data.filter(
        (wo) => wo.job_order_id === parseInt(id)
      );
      setWorkOrders(filtered);
    } catch (error) {
      console.error("Error fetching work orders:", error);
    }
  };

  useEffect(() => {
    const fetchJobOrder = async () => {
      try {
        const response = await axios.get(`${JOB_ORDER_API_URL}/${id}`);
        setJobOrder(response.data);
      } catch (error) {
        console.error("Error fetching job order:", error);
        navigate("/job-orders");
      }
    };

    const loadAllData = async () => {
      setIsLoading(true);
      await fetchJobOrder();
      await fetchWorkOrders();
      setIsLoading(false);
    };

    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  // Handler untuk input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkOrder((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validasi tanggal
  const validateDates = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    return new Date(startDate) < new Date(endDate);
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !newWorkOrder.analisa ||
      !newWorkOrder.mekanik ||
      !newWorkOrder.mulai_kerja
    ) {
      setNotificationMessage("Mohon isi Analisa, Mekanik, dan Tanggal Mulai Kerja.");
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    // Validasi tanggal estimasi selesai jika diisi
    if (newWorkOrder.estimasi_kerja && !validateDates(newWorkOrder.mulai_kerja, newWorkOrder.estimasi_kerja)) {
      setNotificationMessage("Estimasi selesai tidak boleh lebih awal dari waktu mulai kerja.");
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    try {
      const dataToSubmit = {
        ...newWorkOrder,
        jo_id: parseInt(id)
      };
      await axios.post(WORK_ORDER_API_URL, dataToSubmit);
      setNotificationMessage("Work Order berhasil ditambahkan!");
      setNotificationType("success");
      setShowNotification(true);
      setIsModalOpen(false);
      fetchWorkOrders();
    } catch (error) {
      console.error("Error submitting work order:", error);
      setNotificationMessage("Gagal menambahkan Work Order.");
      setNotificationType("error");
      setShowNotification(true);
    }
  };

  const handleDelete = async () => {
    setNotificationMessage("Apakah Anda yakin ingin menghapus data ini?");
    setNotificationType("warning");
    setShowNotification(true);
    
    try {
      await axios.delete(`${JOB_ORDER_API_URL}/${id}`);
      setNotificationMessage("Data berhasil dihapus!");
      setNotificationType("success");
      setShowNotification(true);
      setTimeout(() => {
        navigate("/job-orders");
      }, 1500);
    } catch (error) {
      console.error("Error deleting data:", error);
      setNotificationMessage("Gagal menghapus data.");
      setNotificationType("error");
      setShowNotification(true);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return "-";
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!jobOrder) {
    return <div className="p-4 text-center">Gagal memuat data Job Order.</div>;
  }

  return (
    <>
      {/* Notification Modal - di taro lebih atas daripada work order modal */}
      <div className="relative z-50">
        <NotificationModal
          isOpen={showNotification}
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      </div>

      <div className="p-4 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Tombol Navigasi */}
          <div className="flex justify-between items-center mb-4">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate(-1)}
            >
              &larr; Kembali
            </button>
            <div className="flex gap-2 items-center">
              <button
                className="btn btn-warning btn-sm"
                onClick={() => navigate(`/job-order/update/${jobOrder.id}`)}
              >
                Edit
              </button>
              <button className="btn btn-error btn-sm" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>

          {/* Detail Job Order Card */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h3 className="text-2xl font-bold mb-6 border-b pb-2">
                Detail Job Order #{jobOrder.id}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {/* Kolom Kiri */}
                <div>
                  <p className="mb-2">
                    <strong className="block text-gray-500">
                      Project Site:
                    </strong>
                    <span>{jobOrder.project_site || "-"}</span>
                  </p>
                  <p className="mb-2">
                    <strong className="block text-gray-500">No Lambung:</strong>
                    <span>{jobOrder.no_lambung || "-"}</span>
                  </p>
                  <p className="mb-2">
                    <strong className="block text-gray-500">
                      Keterangan Equipment:
                    </strong>
                    <span>{jobOrder.keterangan_equipment || "-"}</span>
                  </p>
                  <p className="mb-2">
                    <strong className="block text-gray-500">
                      Tanggal Form:
                    </strong>
                    <span>{formatDate(jobOrder.date_form) || "-"}</span>
                  </p>
                  <p className="mb-2">
                    <strong className="block text-gray-500">HM:</strong>
                    <span>{jobOrder.hm || "-"}</span>
                  </p>
                  <p className="mb-2">
                    <strong className="block text-gray-500">KM:</strong>
                    <span>{jobOrder.km || "-"}</span>
                  </p>
                  <p className="mb-2">
                    <strong className="block text-gray-500">
                      Nama Operator:
                    </strong>
                    <span>{jobOrder.nama_operator || "-"}</span>
                  </p>
                </div>
                {/* Kolom Kanan */}
                <div>
                  <p className="mb-2">
                    <strong className="block text-gray-500">
                      Jenis Pekerjaan:
                    </strong>
                    <span>{jobOrder.jenis_pekerjaan || "-"}</span>
                  </p>
                  <p className="mb-2">
                    <strong className="block text-gray-500">
                      Uraian Masalah:
                    </strong>
                    <span className="whitespace-pre-wrap">
                      {jobOrder.uraian_masalah || "-"}
                    </span>
                  </p>
                  <p className="mb-2">
                    <strong className="block text-gray-500">
                      Tanggal Masuk:
                    </strong>
                    <span>{formatDate(jobOrder.tanggal_masuk)}</span>
                  </p>
                  <p className="mb-2">
                    <strong className="block text-gray-500">
                      Tanggal Keluar:
                    </strong>
                    <span>{formatDate(jobOrder.tanggal_keluar)}</span>
                  </p>
                  <p className="mb-2">
                    <strong className="block text-gray-500">
                      Status Mutasi:
                    </strong>
                    <span>{jobOrder.status_mutasi || "-"}</span>
                  </p>
                  <p className="mb-2">
                    <strong className="block text-gray-500">Status:</strong>
                    <span className="font-semibold">
                      {jobOrder.status || "-"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kartu Tabel Work Order */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-xl font-bold">Daftar Work Order Terkait</h3>
                {/* Tombol untuk membuka modal */}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  + Tambah Work Order
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  {/* isi tabel */}
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Analisa Kerusakan</th>
                      <th>Solusi</th>
                      <th>Mekanik</th>
                      <th>Mulai Kerja</th>
                      <th>Estimasi Selesai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workOrders.length > 0 ? (
                      workOrders.map((wo, index) => (
                        <tr key={wo.id}>
                          <th>{index + 1}</th>
                          <td>{wo.analisa || "-"}</td>
                          <td>{wo.solusi || "-"}</td>
                          <td>{wo.mekanik || "-"}</td>
                          <td>{formatDate(wo.mulai_kerja)}</td>
                          <td>{formatDate(wo.estimasi_kerja)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          Belum ada data Work Order untuk Job Order ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Work Order Form Modal */}
      {isModalOpen && (
        <div className="modal modal-open z-40">
          <div className="modal-box relative">
            <h3 className="font-bold text-lg">Tambah Work Order Baru</h3>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <form onSubmit={handleSubmit} className="py-4 space-y-4">
              {/* Input Analisa */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Analisa Kerusakan</span>
                </label>
                <textarea
                  name="analisa"
                  value={newWorkOrder.analisa}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-24"
                  placeholder="Jelaskan analisa kerusakan..."
                  required
                ></textarea>
              </div>

              {/* Input Solusi */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Solusi</span>
                </label>
                <textarea
                  name="solusi"
                  value={newWorkOrder.solusi}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-24"
                  placeholder="Jelaskan solusi perbaikan..."
                ></textarea>
              </div>

              {/* Input Mekanik */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nama Mekanik</span>
                </label>
                <input
                  type="text"
                  name="mekanik"
                  value={newWorkOrder.mekanik}
                  onChange={handleInputChange}
                  placeholder="Contoh: Budi"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Input Mulai Kerja */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Waktu Mulai Kerja</span>
                </label>
                <input
                  type="datetime-local"
                  name="mulai_kerja"
                  value={newWorkOrder.mulai_kerja}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Input Estimasi Kerja */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Estimasi Selesai</span>
                </label>
                <input
                  type="datetime-local"
                  name="estimasi_kerja"
                  value={newWorkOrder.estimasi_kerja}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default JobOrderDetail;
