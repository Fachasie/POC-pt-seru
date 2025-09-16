import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = 'http://localhost:3001/job_order'

export default function TableList({ handleOpen }) {
    const [jobOrders, setJobOrders] = useState([]);

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

    return (
        <>
            <div className="overflow-x-auto mt-10">
            <table className="table">
                {/* head */}
                <thead>
                <tr >
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
                <tbody >
                {/* row 1 */}
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
                    <div class="flex items-center gap-2">
                        <button class="btn btn-warning">Detail</button>
                        <button class="btn btn-secondary">Update</button>
                        <button class="btn btn-accent">Delete</button>
                    </div>
                    </td>
                </tr>
                ))}
                </tbody>
            </table>
            </div>
        </>
    )
}