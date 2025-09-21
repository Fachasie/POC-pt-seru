// JobOrderDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3001/api/job-orders";

const JobOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobOrder, setJobOrder] = useState(null);

  useEffect(() => {
    const fetchJobOrder = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setJobOrder(response.data);
      } catch (error) {
        console.error("Error fetching job order:", error);
        // Jika data tidak ditemukan, arahkan kembali
        navigate("/job-orders");
      }
    };
    fetchJobOrder();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert("Data berhasil dihapus!");
        navigate("/job-orders");
      } catch (error) {
        console.error("Error deleting data:", error);
        alert("Gagal menghapus data.");
      }
    }
  };

  // --- FUNGSI BARU UNTUK FORMAT TANGGAL DAN WAKTU ---
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-"; // Cek jika tanggal tidak valid

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return "-"; // Fallback jika terjadi error
    }
  };

  if (!jobOrder) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
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
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-6 border-b pb-2">
              Detail Job Order #{jobOrder.id}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {/* Kolom Kiri */}
              <div>
                <p className="mb-2">
                  <strong className="block text-gray-500">Project Site:</strong>
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
                  <strong className="block text-gray-500">Tanggal Form:</strong>
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
                  {/* --- PERUBAHAN TAMPILAN TANGGAL MASUK --- */}
                  <strong className="block text-gray-500">
                    Tanggal Masuk:
                  </strong>
                  <span>{formatDate(jobOrder.tanggal_masuk)}</span>
                </p>
                <p className="mb-2">
                  {/* --- PERUBAHAN TAMPILAN TANGGAL KELUAR --- */}
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
      </div>
    </div>
  );
};

export default JobOrderDetail;
