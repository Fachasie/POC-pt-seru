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

  // State untuk Modal dan Form Tambah
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkOrder, setNewWorkOrder] = useState({
    analisa: "",
    solusi: "",
    mekanik: "",
    mulai_kerja: "",
    estimasi_kerja: "",
  });

  // BARU: State untuk Modal dan Form Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentWorkOrder, setCurrentWorkOrder] = useState(null);

  // State untuk Notifikasi
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  // Fungsi untuk mengambil data Work Order
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

  // Handler untuk input form Tambah
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkOrder((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // BARU: Handler untuk input form Edit
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentWorkOrder((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validasi tanggal
  const validateDates = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    return new Date(startDate) < new Date(endDate);
  };

  // Handler untuk submit form Tambah
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !newWorkOrder.analisa ||
      !newWorkOrder.mekanik ||
      !newWorkOrder.mulai_kerja
    ) {
      setNotificationMessage(
        "Mohon isi Analisa, Mekanik, dan Tanggal Mulai Kerja."
      );
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    if (
      newWorkOrder.estimasi_kerja &&
      !validateDates(newWorkOrder.mulai_kerja, newWorkOrder.estimasi_kerja)
    ) {
      setNotificationMessage(
        "Estimasi selesai tidak boleh lebih awal dari waktu mulai kerja."
      );
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    try {
      const dataToSubmit = {
        ...newWorkOrder,
        job_order_id: parseInt(id), // pastikan nama field sesuai dengan backend
      };
      await axios.post(WORK_ORDER_API_URL, dataToSubmit);
      setNotificationMessage("Work Order berhasil ditambahkan!");
      setNotificationType("success");
      setShowNotification(true);
      setIsModalOpen(false);
      setNewWorkOrder({
        analisa: "",
        solusi: "",
        mekanik: "",
        mulai_kerja: "",
        estimasi_kerja: "",
      }); // Reset form
      fetchWorkOrders();
    } catch (error) {
      console.error("Error submitting work order:", error);
      setNotificationMessage("Gagal menambahkan Work Order.");
      setNotificationType("error");
      setShowNotification(true);
    }
  };

  // BARU: Handler untuk submit form Update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (
      !currentWorkOrder.analisa ||
      !currentWorkOrder.mekanik ||
      !currentWorkOrder.mulai_kerja
    ) {
      setNotificationMessage(
        "Mohon isi Analisa, Mekanik, dan Tanggal Mulai Kerja."
      );
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    if (
      currentWorkOrder.estimasi_kerja &&
      !validateDates(
        currentWorkOrder.mulai_kerja,
        currentWorkOrder.estimasi_kerja
      )
    ) {
      setNotificationMessage(
        "Estimasi selesai tidak boleh lebih awal dari waktu mulai kerja."
      );
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    try {
      await axios.put(
        `${WORK_ORDER_API_URL}/${currentWorkOrder.id}`,
        currentWorkOrder
      );
      setNotificationMessage("Work Order berhasil diperbarui!");
      setNotificationType("success");
      setShowNotification(true);
      setIsEditModalOpen(false);
      fetchWorkOrders();
    } catch (error) {
      console.error("Error updating work order:", error);
      setNotificationMessage("Gagal memperbarui Work Order.");
      setNotificationType("error");
      setShowNotification(true);
    }
  };

  // Handler untuk hapus Job Order
  const handleDelete = async () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus Job Order ini beserta semua Work Order terkait?"
      )
    ) {
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
    }
  };

  // BARU: Handler untuk hapus Work Order
  const handleDeleteWorkOrder = async (workOrderId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus Work Order ini?")) {
      try {
        await axios.delete(`${WORK_ORDER_API_URL}/${workOrderId}`);
        setNotificationMessage("Work Order berhasil dihapus!");
        setNotificationType("success");
        setShowNotification(true);
        fetchWorkOrders(); // Muat ulang data
      } catch (error) {
        console.error("Error deleting work order:", error);
        setNotificationMessage("Gagal menghapus Work Order.");
        setNotificationType("error");
        setShowNotification(true);
      }
    }
  };

  // BARU: Handler untuk klik tombol edit
  const handleEditClick = (workOrder) => {
    setCurrentWorkOrder({
      ...workOrder,
      mulai_kerja: formatDateForInput(workOrder.mulai_kerja),
      estimasi_kerja: formatDateForInput(workOrder.estimasi_kerja),
    });
    setIsEditModalOpen(true);
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

  // BARU: Fungsi format tanggal untuk input datetime-local
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      // Format: YYYY-MM-DDTHH:mm
      return date.toISOString().slice(0, 16);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return "";
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
      {/* Notification Modal */}
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
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  + Tambah Work Order
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Analisa Kerusakan</th>
                      <th>Solusi</th>
                      <th>Mekanik</th>
                      <th>Mulai Kerja</th>
                      <th>Estimasi Selesai</th>
                      {/* BARU: Header kolom aksi */}
                      <th className="text-center">Aksi</th>
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
                          {/* BARU: Sel dengan tombol aksi */}
                          <td>
                            <div className="flex gap-2 justify-center">
                              <button
                                className="btn btn-info btn-xs"
                                onClick={() => handleEditClick(wo)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-error btn-xs"
                                onClick={() => handleDeleteWorkOrder(wo.id)}
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        {/* BARU: ColSpan disesuaikan menjadi 7 */}
                        <td colSpan="7" className="text-center">
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

      {/* Work Order Form Modal (Tambah) */}
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

      {/* BARU: Work Order Form Modal (Edit) */}
      {isEditModalOpen && currentWorkOrder && (
        <div className="modal modal-open z-40">
          <div className="modal-box relative">
            <h3 className="font-bold text-lg">
              Edit Work Order #{currentWorkOrder.id}
            </h3>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsEditModalOpen(false)}
            >
              ✕
            </button>
            <form onSubmit={handleUpdateSubmit} className="py-4 space-y-4">
              {/* Input Analisa */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Analisa Kerusakan</span>
                </label>
                <textarea
                  name="analisa"
                  value={currentWorkOrder.analisa}
                  onChange={handleEditInputChange}
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
                  value={currentWorkOrder.solusi}
                  onChange={handleEditInputChange}
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
                  value={currentWorkOrder.mekanik}
                  onChange={handleEditInputChange}
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
                  value={currentWorkOrder.mulai_kerja}
                  onChange={handleEditInputChange}
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
                  value={currentWorkOrder.estimasi_kerja}
                  onChange={handleEditInputChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Perbarui
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
