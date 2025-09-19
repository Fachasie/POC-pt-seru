import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFileExcel, FaPrint } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const API_URL = "/api/job_order";

export default function TableList() {
  const [jobOrders, setJobOrders] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredJobOrders, setFilteredJobOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const itemsPerPage = 10;

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
    let processedData = [...jobOrders];

    // Sort by status filter
    if (statusFilter !== 'All') {
      processedData.sort((a, b) => {
        const aIsMatch = a.status === statusFilter;
        const bIsMatch = b.status === statusFilter;
        if (aIsMatch && !bIsMatch) return -1;
        if (!aIsMatch && bIsMatch) return 1;
        return 0;
      });
    }

    // Apply search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      processedData = processedData.filter((job) => {
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
    }

    setFilteredJobOrders(processedData);
    setCurrentPage(1);
  }, [jobOrders, searchQuery, statusFilter]);

  const handleFilterSelect = (status) => {
    setStatusFilter(status);
    // Blur the active element to close the dropdown
    if (document.activeElement) {
      document.activeElement.blur();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setJobOrders(jobOrders.filter((job) => job.id !== id));
        alert("Data berhasil dihapus!");
      } catch (error) {
        console.error("Error deleting data:", error);
        alert("Gagal menghapus data.");
      }
    }
  };
  const handleCreate = () => {
    navigate("/job-order/create");
  }
  const handleExport = () => {
    const dataToExport = selectedItems.length > 0
    ? filteredJobOrders.filter(job => selectedItems.includes(job.id))
    : filteredJobOrders;

    if (!dataToExport || dataToExport.length === 0) {
      alert("Tidak ada data untuk diexport");
      return;
    }

    const exportData = dataToExport.map((job) => ({
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

    const handleSelectAll = (e) => {
      if (e.target.checked) {
        const allIds = currentItems.map((item) => item.id);
        setSelectedItems(allIds);
      } else {
        setSelectedItems([]);
      }
    };

    const handleSelectItem = (id) => {
      setSelectedItems((prevSelected) => {
        if (prevSelected.includes(id)) {
          return prevSelected.filter((item) => item !== id);
        } else {
          return [...prevSelected, id];
        }
      });
    };

    const handleDeleteSelected = async () => {
      if (selectedItems.length === 0) {
        alert("Tidak ada item yang dipilih untuk dihapus.");
        return;
      }
      if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedItems.length} item yang dipilih?`)) {
        try {
          for (const id of selectedItems) {
            await axios.delete(`${API_URL}/${id}`);
          }
          setJobOrders(jobOrders.filter((job) => !selectedItems.includes(job.id)));
          setSelectedItems([]);
          alert("Data yang dipilih berhasil dihapus!");
        } catch (error) {
          console.error("Error deleting selected data:", error);
          alert("Gagal menghapus data yang dipilih.");
        }
      }
    };

    const handlePrint = () => {
        window.print();
    }


  return (
    <div className="p-4 bg-base-200 min-h-screen">
      <div className="no-print flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 w-full">
        <h2 className="text-2xl font-bold text-base-content mb-4 sm:mb-0">
          Job Order (Head Office)
        </h2>
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-end gap-2 items-center w-full sm:w-auto">
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-sm rounded-lg flex items-center gap-1">
                📊 Filter
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-[99]">
                <li><a onClick={() => handleFilterSelect('All')}>
                    <span className="w-4 inline-block">{statusFilter === 'All' ? '✓' : ''}</span>All
                </a></li>
                <li><a onClick={() => handleFilterSelect('On Progress')}>
                    <span className="w-4 inline-block">{statusFilter === 'On Progress' ? '✓' : ''}</span>On Progress
                </a></li>
                <li><a onClick={() => handleFilterSelect('Full Progress')}>
                    <span className="w-4 inline-block">{statusFilter === 'Full Progress' ? '✓' : ''}</span>Full Progress
                </a></li>
                </ul>
            </div>
            <input
                type="text"
                placeholder="Search..."
                className="input input-bordered w-full sm:w-auto text-sm rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex gap-2">
                {selectedItems.length > 0 && (
                    <button
                    className="btn btn-error btn-sm rounded-lg"
                    onClick={handleDeleteSelected}
                    >
                    Delete Selected
                    </button>
                )}
                <button
                className="btn btn-primary btn-sm rounded-lg"
                onClick={handleCreate}
                >
                Create
                </button>
                <button
                className="btn btn-outline btn-info btn-sm rounded-lg flex items-center gap-1"
                onClick={handlePrint}
                >
                <FaPrint />
                Print
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
        <table className="table w-full bg-base-100">
          <thead className="bg-base-300">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wide text-left no-print">
                <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                />
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Id
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Job Order
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                No Lambung
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Keterangan Equipment
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Jenis Pekerjaan
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Uraian Masalah
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Tanggal Masuk
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Tanggal Keluar
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Status Mutasi
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Status
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left no-print">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((jobOrder) => (
                <tr
                  className="hover"
                  key={jobOrder.id}
                >
                  <td className="p-3 text-sm no-print">
                    <input
                        type="checkbox"
                        checked={selectedItems.includes(jobOrder.id)}
                        onChange={() => handleSelectItem(jobOrder.id)}
                    />
                  </td>
                  <td className="p-3 text-sm">{jobOrder.id}</td>
                  <td className="p-3 text-sm">
                    {jobOrder.date_form}
                  </td>
                  <td className="p-3 text-sm">
                    {jobOrder.no_lambung}
                  </td>
                  <td className="p-3 text-sm">
                    {jobOrder.keterangan_equipment}
                  </td>
                  <td className="p-3 text-sm">
                    {jobOrder.jenis_pekerjaan}
                  </td>
                  <td className="p-3 text-sm">
                    {jobOrder.uraian_masalah}
                  </td>
                  <td className="p-3 text-sm">
                    {jobOrder.tanggal_masuk}
                  </td>
                  <td className="p-3 text-sm">
                    {jobOrder.tanggal_keluar}
                  </td>
                  <td className="p-3 text-sm">
                    {jobOrder.status_mutasi}
                  </td>
                  <td className="p-3 text-sm">
                    {jobOrder.status}
                  </td>
                  <td className="p-3 text-sm no-print">
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
                <td colSpan="12" className="p-4 text-center">
                  No job orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Simple Pagination Component */}
      {totalPages > 1 && (
        <div className="no-print flex justify-center mt-6 gap-2">
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