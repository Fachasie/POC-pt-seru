// JobOrderDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3001/job_order";

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

  // PERUBAHAN 1: Memperbaiki fungsi handleDelete
  const handleDelete = async () => {
    // Gunakan 'id' dari useParams yang sudah ada di scope komponen
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert("Data berhasil dihapus!");
        // PERUBAHAN 2: Arahkan pengguna kembali ke halaman daftar setelah berhasil hapus
        navigate("/job-orders"); // atau navigate("/") sesuai route Anda
      } catch (error) {
        console.error("Error deleting data:", error);
        alert("Gagal menghapus data.");
      }
    }
  };

  if (!jobOrder) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          &larr; Kembali
        </button>
        <div className="flex gap-2 items-center">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/job-order/update/${jobOrder.id}`)}
          >
            Edit
          </button>
          {/* PERUBAHAN 3: Memperbarui cara memanggil handleDelete */}
          <button className="btn btn-accent" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="text-2xl font-bold mb-4">Detail Job Order</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ... sisa kode JSX Anda tidak berubah ... */}
            <div>
              <p>
                <strong>ID: </strong>
                {jobOrder.id}
              </p>
              <p>
                <strong>Project Site: </strong>
                {jobOrder.project_site}
              </p>
              <p>
                <strong>No Lambung: </strong>
                {jobOrder.no_lambung}
              </p>
              <p>
                <strong>Date Form: </strong>
                {jobOrder.date_form}
              </p>
              <p>
                <strong>Keterangan Equipment: </strong>
                {jobOrder.keterangan_equipment}
              </p>
              <p>
                <strong>HM: </strong>
                {jobOrder.hm}
              </p>
              <p>
                <strong>KM: </strong>
                {jobOrder.km}
              </p>
            </div>
            <div>
              <p>
                <strong>Jenis Pekerjaan: </strong>
                {jobOrder.jenis_pekerjaan}
              </p>
              <p>
                <strong>Uraian Masalah: </strong>
                {jobOrder.uraian_masalah}
              </p>
              <p>
                <strong>Nama Operator: </strong>
                {jobOrder.nama_operator}
              </p>
              <p>
                <strong>Tanggal Masuk: </strong>
                {jobOrder.tanggal_masuk}
              </p>
              <p>
                <strong>Tanggal Keluar: </strong>
                {jobOrder.tanggal_keluar}
              </p>
              <p>
                <strong>Status Mutasi: </strong>
                {jobOrder.status_mutasi}
              </p>
              <p>
                <strong>Status: </strong>
                {jobOrder.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOrderDetail;
