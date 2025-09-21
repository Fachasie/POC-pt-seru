import { useState, useEffect, useMemo } from "react";
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
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedJobOrders, setSelectedJobOrders] = useState([]);
  const [isBulkDeleteConfirm, setIsBulkDeleteConfirm] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "descending",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setJobOrders(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    let data = [...jobOrders];

    if (statusFilter !== "All") {
      data = data.filter(
        (job) => String(job.status).toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      data = data.filter((job) => {
        return (
          String(job.id).includes(lowercasedQuery) ||
          String(job.date_form).toLowerCase().includes(lowercasedQuery) ||
          String(job.no_lambung).toLowerCase().includes(lowercasedQuery) ||
          String(job.keterangan_equipment)
            .toLowerCase()
            .includes(lowercasedQuery) ||
          String(job.jenis_pekerjaan).toLowerCase().includes(lowercasedQuery) ||
          String(job.uraian_masalah).toLowerCase().includes(lowercasedQuery) ||
          String(job.status).toLowerCase().includes(lowercasedQuery)
        );
      });
    }

    setFilteredJobOrders(data);
    setSelectedJobOrders([]);
    setCurrentPage(1);
  }, [jobOrders, searchQuery, statusFilter]);

  const sortedItems = useMemo(() => {
    let sortableItems = [...filteredJobOrders];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (valA < valB) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredJobOrders, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const showNotification = (message, isConfirm = false, id = null) => {
    setModalMessage(message);
    setIsConfirmModal(isConfirm);
    setConfirmId(id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setIsBulkDeleteConfirm(false);
    showNotification("Apakah Anda yakin ingin menghapus data ini?", true, id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${confirmId}`);
      const updatedJobOrders = jobOrders.filter((job) => job.id !== confirmId);
      setJobOrders(updatedJobOrders);
      showNotification("Data berhasil dihapus!", false);
    } catch (error) {
      console.error("Error deleting data:", error);
      showNotification("Gagal menghapus data.", false);
    } finally {
      closeModal();
    }
  };

  const handleBulkDelete = () => {
    if (selectedJobOrders.length === 0) {
      showNotification("Tidak ada data yang dipilih untuk dihapus.", false);
      return;
    }
    setIsBulkDeleteConfirm(true);
    showNotification(
      `Apakah Anda yakin ingin menghapus ${selectedJobOrders.length} data yang dipilih?`,
      true
    );
  };

  const confirmBulkDelete = async () => {
    try {
      const deletePromises = selectedJobOrders.map((id) =>
        axios.delete(`${API_URL}/${id}`)
      );
      await Promise.all(deletePromises);

      const updatedJobOrders = jobOrders.filter(
        (job) => !selectedJobOrders.includes(job.id)
      );
      setJobOrders(updatedJobOrders);
      showNotification(
        `${selectedJobOrders.length} data berhasil dihapus!`,
        false
      );
    } catch (error) {
      console.error("Error deleting multiple data:", error);
      showNotification("Gagal menghapus beberapa data.", false);
    } finally {
      closeModal();
    }
  };

  const handleConfirmAction = () => {
    if (isBulkDeleteConfirm) {
      confirmBulkDelete();
    } else {
      confirmDelete();
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = sortedItems.map((job) => job.id);
      setSelectedJobOrders(allIds);
    } else {
      setSelectedJobOrders([]);
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedJobOrders((prev) => [...prev, id]);
    } else {
      setSelectedJobOrders((prev) => prev.filter((jobId) => jobId !== id));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
    setIsConfirmModal(false);
    setConfirmId(null);
    setIsBulkDeleteConfirm(false);
  };

  const handleCreate = () => {
    navigate("/job-order/create");
  };

  const handleExport = () => {
    if (!sortedItems || sortedItems.length === 0) {
      alert("Tidak ada data untuk diexport");
      return;
    }

    const exportData = sortedItems.map((job) => ({
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ▲" : " ▼";
    }
    return null;
  };

  // --- START: FUNGSI BARU UNTUK FORMAT TANGGAL ---
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
    } catch (e) {
      return "-";
    }
  };
  // --- END: FUNGSI BARU UNTUK FORMAT TANGGAL ---

  return (
    <div className="p-4 bg-gray-200 min-h-screen">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <p className="text-gray-800 text-lg mb-4 text-center">
              {modalMessage}
            </p>
            <div className="flex justify-center gap-4">
              {isConfirmModal && (
                <button
                  className="btn btn-error btn-sm rounded-lg"
                  onClick={handleConfirmAction}
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          Job Order (Head Office)
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto pr-2">
          {selectedJobOrders.length > 0 && (
            <button
              className="btn btn-error btn-sm rounded-lg"
              onClick={handleBulkDelete}
            >
              Delete Selected
            </button>
          )}
          <select
            className="select select-bordered w-full sm:max-w-xs text-sm rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="On Progress">On Progress</option>
            <option value="Full progress">Full Progress</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="input input-bordered w-full sm:max-w-xs text-sm rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              className="btn btn-primary btn-sm rounded-lg"
              onClick={handleCreate}
            >
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
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  onChange={handleSelectAll}
                  checked={
                    sortedItems.length > 0 &&
                    selectedJobOrders.length === sortedItems.length
                  }
                />
              </th>
              <th
                className="p-3 text-sm font-semibold tracking-wide text-left cursor-pointer"
                onClick={() => requestSort("id")}
              >
                Id{getSortIndicator("id")}
              </th>
              <th
                className="p-3 text-sm font-semibold tracking-wide text-left cursor-pointer"
                onClick={() => requestSort("date_form")}
              >
                Job Order{getSortIndicator("date_form")}
              </th>
              <th
                className="p-3 text-sm font-semibold tracking-wide text-left cursor-pointer"
                onClick={() => requestSort("no_lambung")}
              >
                No Lambung{getSortIndicator("no_lambung")}
              </th>
              <th
                className="p-3 text-sm font-semibold tracking-wide text-left cursor-pointer"
                onClick={() => requestSort("keterangan_equipment")}
              >
                Keterangan Equipment{getSortIndicator("keterangan_equipment")}
              </th>
              <th
                className="p-3 text-sm font-semibold tracking-wide text-left cursor-pointer"
                onClick={() => requestSort("jenis_pekerjaan")}
              >
                Jenis Pekerjaan{getSortIndicator("jenis_pekerjaan")}
              </th>
              <th
                className="p-3 text-sm font-semibold tracking-wide text-left cursor-pointer"
                onClick={() => requestSort("uraian_masalah")}
              >
                Uraian Masalah{getSortIndicator("uraian_masalah")}
              </th>
              <th
                className="p-3 text-sm font-semibold tracking-wide text-left cursor-pointer"
                onClick={() => requestSort("tanggal_masuk")}
              >
                Tanggal Masuk{getSortIndicator("tanggal_masuk")}
              </th>
              <th
                className="p-3 text-sm font-semibold tracking-wide text-left cursor-pointer"
                onClick={() => requestSort("tanggal_keluar")}
              >
                Tanggal Keluar{getSortIndicator("tanggal_keluar")}
              </th>
              <th
                className="p-3 text-sm font-semibold tracking-wide text-left cursor-pointer"
                onClick={() => requestSort("status_mutasi")}
              >
                Status Mutasi{getSortIndicator("status_mutasi")}
              </th>
              <th
                className="p-3 text-sm font-semibold tracking-wide text-left cursor-pointer"
                onClick={() => requestSort("status")}
              >
                Status{getSortIndicator("status")}
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((jobOrder, index) => (
                <tr
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-colors duration-200`}
                  key={jobOrder.id}
                >
                  <td className="p-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedJobOrders.includes(jobOrder.id)}
                      onChange={(e) => handleSelectOne(e, jobOrder.id)}
                    />
                  </td>
                  <td className="p-3 text-sm text-gray-700">{jobOrder.id}</td>
                  <td className="p-3 text-sm text-gray-700">
                    {formatDate(jobOrder.date_form)}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {jobOrder.no_lambung}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {jobOrder.keterangan_equipment}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {jobOrder.jenis_pekerjaan}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {jobOrder.uraian_masalah}
                  </td>
                  {/* --- START: PERUBAHAN TAMPILAN TANGGAL --- */}
                  <td className="p-3 text-sm text-gray-700">
                    {formatDate(jobOrder.tanggal_masuk)}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {formatDate(jobOrder.tanggal_keluar)}
                  </td>
                  {/* --- END: PERUBAHAN TAMPILAN TANGGAL --- */}
                  <td className="p-3 text-sm text-gray-700">
                    {jobOrder.status_mutasi}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {jobOrder.status}
                  </td>
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
                <td colSpan="12" className="p-4 text-center text-gray-500">
                  No job orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            className={`btn btn-sm rounded-lg ${
              currentPage === 1 ? "btn-disabled" : "btn-ghost"
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`btn btn-sm rounded-lg ${
                currentPage === index + 1 ? "btn-active" : "btn-ghost"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`btn btn-sm rounded-lg ${
              currentPage === totalPages ? "btn-disabled" : "btn-ghost"
            }`}
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
