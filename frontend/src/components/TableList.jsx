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
    <div className="p-4 bg-gray-100 min-h-screen">
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
      <div className="shadow-lg rounded-lg bg-white">
        {/* Grid Header - Hidden on mobile, shown on sm and above */}
        <div className="hidden sm:grid sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2 mb-2 bg-gray-200 p-3 rounded-t-lg font-semibold text-sm">
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-1">ID</div>
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-1">Job Order</div>
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-1">No Lambung</div>
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-1">Equipment</div>
          <div className="hidden md:block md:col-span-1 lg:col-span-1">Jenis Pekerjaan</div>
          <div className="hidden md:block md:col-span-1 lg:col-span-2">Uraian Masalah</div>
          <div className="hidden lg:block lg:col-span-1">Tgl Masuk</div>
          <div className="hidden lg:block lg:col-span-1">Tgl Keluar</div>
          <div className="hidden md:block md:col-span-1 lg:col-span-1">Status</div>
          <div className="hidden sm:block sm:col-span-1 md:col-span-1 lg:col-span-2">Action</div>
        </div>

        {/* Grid Content */}
        <div className="bg-white rounded-b-lg shadow-lg">
          {currentItems.length > 0 ? (
            currentItems.map((jobOrder, index) => (
              <div 
                key={jobOrder.id}
                className={`
                  grid gap-2 p-3 items-center min-w-0
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} 
                  hover:bg-gray-100 transition-colors duration-200
                  border-b border-gray-200
                  grid-cols-2 
                  sm:grid-cols-4 
                  md:grid-cols-8 
                  lg:grid-cols-12
                `}
              >
                {/* Mobile view - stacked layout */}
                <div className="sm:col-span-1 md:col-span-1 lg:col-span-1 col-span-2 sm:col-span-1">
                  <span className="sm:hidden font-semibold text-gray-600 text-xs">ID: </span>
                  <span className="text-sm text-gray-700">{jobOrder.id}</span>
                </div>
                
                <div className="sm:col-span-1 md:col-span-1 lg:col-span-1 col-span-2 sm:col-span-1">
                  <span className="sm:hidden font-semibold text-gray-600 text-xs">Job Order: </span>
                  <span className="text-sm text-gray-700">{formatDate(jobOrder.date_form)}</span>
                </div>
                
                <div className="sm:col-span-1 md:col-span-1 lg:col-span-1 col-span-2 sm:col-span-1">
                  <span className="sm:hidden font-semibold text-gray-600 text-xs">No Lambung: </span>
                  <span className="text-sm text-gray-700">{jobOrder.no_lambung}</span>
                </div>
                
                <div className="sm:col-span-1 md:col-span-1 lg:col-span-1 col-span-2 sm:col-span-1 min-w-0">
                  <span className="sm:hidden font-semibold text-gray-600 text-xs">Equipment: </span>
                  <span className="text-sm text-gray-700 block truncate overflow-hidden">{jobOrder.keterangan_equipment}</span>
                </div>
                
                <div className="hidden md:block md:col-span-1 lg:col-span-1 min-w-0">
                  <span className="text-sm text-gray-700 block truncate overflow-hidden">{jobOrder.jenis_pekerjaan}</span>
                </div>
                
                <div className="hidden md:block md:col-span-1 lg:col-span-2 min-w-0">
                  <span className="text-sm text-gray-700 block truncate overflow-hidden">{jobOrder.uraian_masalah}</span>
                </div>
                
                <div className="hidden lg:block lg:col-span-1">
                  <span className="text-sm text-gray-700">{formatDate(jobOrder.tanggal_masuk)}</span>
                </div>
                
                <div className="hidden lg:block lg:col-span-1">
                  <span className="text-sm text-gray-700">{formatDate(jobOrder.tanggal_keluar)}</span>
                </div>
                
                <div className="col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-1 min-w-0">
                  <span className="sm:hidden font-semibold text-gray-600 text-xs">Status: </span>
                  <span className={`
                    text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap
                    ${jobOrder.status === 'Complete' ? 'bg-green-100 text-green-800' : 
                      jobOrder.status === 'On Progress' ? 'bg-yellow-100 text-yellow-800' : 
                      jobOrder.status === 'Full Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {jobOrder.status}
                  </span>
                </div>
                
                <div className="col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-2 flex gap-2 mt-2 sm:mt-0 items-center justify-end min-w-0">
                   <button
                    className="btn btn-warning btn-xs sm:btn-sm rounded-lg flex-1 sm:flex-initial whitespace-nowrap"
                     onClick={() => navigate(`/job-order/${jobOrder.id}`)}
                   >
                     Detail
                   </button>
                   <button
                    className="btn btn-accent btn-xs sm:btn-sm rounded-lg flex-1 sm:flex-initial whitespace-nowrap"
                     onClick={() => handleDelete(jobOrder.id)}
                   >
                     Delete
                   </button>
                 </div>
               </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No job orders found.
            </div>
          )}
        </div>
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
