import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Pagination from './Pagination';
import { FaFileExcel } from 'react-icons/fa';

const API_URL = 'http://localhost:3001/job_order';

export default function TableList({ handleOpen }) {
  const [jobOrders, setJobOrders] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null); // State untuk data baris yang dipilih
  const navigate = useNavigate();

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

  const handleDetailClick = (jobOrderData) => {
    setSelectedRow(jobOrderData);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Job Order (Head Office)</h2>
        <div className="flex gap-2 items-center">
          <button className="btn btn-primary">Create</button>
          <button className="btn btn-outline btn-success">Export<FaFileExcel /></button>
        </div>
      </div>
      <div className="overflow-x-auto mt-10">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Id</th>
              <th>Job Order</th>
              <th>No Lambung</th>
              <th>Keterangan Equipment</th>
              <th>Jenis Pekerjaan</th>
              <th>Uraian Masalah</th>
              <th>Tanggal Masuk</th>
              <th>Tanggal Keluar</th>
              <th>Status Mutasi</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobOrders.map((jobOrder) => (
              <tr className="hover" key={jobOrder.id}>
                <th>{jobOrder.id}</th>
                <td>{jobOrder.date_form}</td>
                <td>{jobOrder.no_lambung}</td>
                <td>{jobOrder.keterangan_equipment}</td>
                <td>{jobOrder.jenis_pekerjaan}</td>
                <td>{jobOrder.uraian_masalah}</td>
                <td>{jobOrder.tanggal_masuk}</td>
                <td>{jobOrder.tanggal_keluar}</td>
                <td>{jobOrder.status_mutasi}</td>
                <td>{jobOrder.status}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-warning"
                      onClick={() => navigate(`/job-order/${jobOrder.id}`)}
                    >
                      Detail
                    </button>
                    <button className="btn btn-secondary">Update</button>
                    <button className="btn btn-accent">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6">
        <Pagination />
      </div>
    </>
  );
}