import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const API_URL = "http://localhost:3001/api/job-orders";

export default function TableList() {
  const [jobOrders, setJobOrders] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobOrders, setFilteredJobOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setJobOrders(response.data);
      setFilteredJobOrders(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    // This effect handles filtering based on the search query.
    if (jobOrders.length > 0) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filteredData = jobOrders.filter((job) => {
        // Search across multiple relevant fields for a match.
        // These fields are returned from the JOIN query in the backend.
        return (
          String(job.id).includes(lowercasedQuery) ||
          String(job.date_form).toLowerCase().includes(lowercasedQuery) ||
          String(job.no_lambung).toLowerCase().includes(lowercasedQuery) ||
          String(job.keterangan_equipment).toLowerCase().includes(lowercasedQuery) ||
          String(job.jenis_pekerjaan).toLowerCase().includes(lowercasedQuery) ||
          String(job.uraian_masalah).toLowerCase().includes(lowercasedQuery) ||
          String(job.status).toLowerCase().includes(lowercasedQuery)
        );
      });
      setFilteredJobOrders(filteredData);
      setCurrentPage(1); // Reset to the first page when a new search is performed.
    }
  }, [jobOrders, searchQuery]);

  // Fungsi untuk menampilkan notifikasi atau konfirmasi
  const showNotification = (message, isConfirm = false, id = null) => {
    setModalMessage(message);
    setIsConfirmModal(isConfirm);
    setConfirmId(id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    showNotification("Apakah Anda yakin ingin menghapus data ini?", true, id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${confirmId}`);
      setJobOrders(jobOrders.filter((job) => job.id !== confirmId));
      setFilteredJobOrders(filteredJobOrders.filter((job) => job.id !== confirmId));
      showNotification("Data berhasil dihapus!", false);
    } catch (error) {
      console.error("Error deleting data:", error);
      showNotification("Gagal menghapus data.", false);
    } finally {
      closeModal();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
    setIsConfirmModal(false);
    setConfirmId(null);
  };

  const handleCreate = () => {
    navigate("/job-order/create");
  }
  const handleExport = () => {
    if (!filteredJobOrders || filteredJobOrders.length === 0) {
      alert("Tidak ada data untuk diexport");
      return;
    }

    const exportData = filteredJobOrders.map((job) => ({
      ID: job.id,
      "Tanggal Form": job.date_form,
      "No Lambung": job.no_lambung,
      "Keterangan Equipment": job.keterangan_equipment,
      "Jenis Pekerjaan": job.jenis_pekerjaan,
      "Uraian Masalah": job.uraian_masalah,
      "Tanggal Masuk": job.tanggal_masuk,
      "Tanggal Keluar": job.tanggal_keluar,
      "Status Mutasi": job.status_mutasi,
      Status: job.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Job Orders");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, "job_orders.xlsx");
  };

  // Pagination state
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredJobOrders.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    const totalPages = Math.ceil(filteredJobOrders.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };


  return (
    <div className="p-4 bg-gray-100 min-h-screen">
    {/* Modal for Alerts and Confirmations */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <p className="text-gray-800 text-lg mb-4 text-center">{modalMessage}</p>
            <div className="flex justify-center gap-4">
              {isConfirmModal && (
                <button
                  className="btn btn-error btn-sm rounded-lg"
                  onClick={confirmDelete}
                >
                  Ya, Hapus
                </button>
              )}
              <button
                className="btn btn-outline btn-sm rounded-lg"
                onClick={closeModal}
              >
                {isConfirmModal ? "Batal" : "Tutup"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Job Order (Head Office)</h2>
        <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search..."
            className="input input-bordered w-full sm:max-w-xs text-sm rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm rounded-lg" onClick={handleCreate}>
              Create
            </button>
            <button
              className="btn btn-outline btn-success btn-sm rounded-lg flex items-center gap-1"
              onClick={handleExport}
            >
              <FaFileExcel />
              Export
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Id</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Job Order</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">No Lambung</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Keterangan Equipment</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Jenis Pekerjaan</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Uraian Masalah</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Tanggal Masuk</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Tanggal Keluar</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Status Mutasi</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Status</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((jobOrder, index) => (
                <tr className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors duration-200`} key={jobOrder.id}>
                  <td className="p-3 text-sm text-gray-700">{jobOrder.id}</td>
                  <td className="p-3 text-sm text-gray-700">{jobOrder.date_form}</td>
                  <td className="p-3 text-sm text-gray-700">{jobOrder.no_lambung}</td>
                  <td className="p-3 text-sm text-gray-700">{jobOrder.keterangan_equipment}</td>
                  <td className="p-3 text-sm text-gray-700">{jobOrder.jenis_pekerjaan}</td>
                  <td className="p-3 text-sm text-gray-700">{jobOrder.uraian_masalah}</td>
                  <td className="p-3 text-sm text-gray-700">{jobOrder.tanggal_masuk}</td>
                  <td className="p-3 text-sm text-gray-700">{jobOrder.tanggal_keluar}</td>
                  <td className="p-3 text-sm text-gray-700">{jobOrder.status_mutasi}</td>
                  <td className="p-3 text-sm text-gray-700">{jobOrder.status}</td>
                  <td className="p-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <button
                        className="btn btn-warning btn-sm rounded-lg"
                        onClick={() => navigate(`/job-order/${jobOrder.id}`)}
                      >
                        Detail
                      </button>
                      <button
                        className="btn btn-accent btn-sm rounded-lg"
                        onClick={() => handleDelete(jobOrder.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="p-4 text-center text-gray-500">
                  No job orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Simple Pagination Component */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            className={`btn btn-sm rounded-lg ${currentPage === 1 ? 'btn-disabled' : 'btn-ghost'}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`btn btn-sm rounded-lg ${currentPage === index + 1 ? 'btn-active' : 'btn-ghost'}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`btn btn-sm rounded-lg ${currentPage === totalPages ? 'btn-disabled' : 'btn-ghost'}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}