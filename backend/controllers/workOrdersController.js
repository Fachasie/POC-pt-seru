const pool = require('../config/db');

const getWorkOrders = async (req, res) => {
    try {
        // Query ini sudah benar, tetapi lebih baik memberikan alias untuk jo.id agar tidak bentrok dengan wo.id
        const allWorkOrders = await pool.query("SELECT wo.id, wo.analisa, wo.solusi, wo.mekanik, wo.mulai_kerja, wo.estimasi_kerja, jo.id AS job_order_id, eq.keterangan_equipment FROM work_order AS wo JOIN job_order AS jo ON wo.jo_id = jo.id JOIN equipments AS eq ON jo.equipment_id = eq.id")
        res.json(allWorkOrders.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

const getWorkOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        // PERBAIKAN: Gunakan 'wo.id' untuk spesifik menunjuk ID dari tabel work_order
        const workOrder = await pool.query("SELECT wo.id, wo.analisa, wo.solusi, wo.mekanik, wo.mulai_kerja, wo.estimasi_kerja, jo.id AS job_order_id, eq.keterangan_equipment FROM work_order AS wo JOIN job_order AS jo ON wo.jo_id = jo.id JOIN equipments AS eq ON jo.equipment_id = eq.id WHERE wo.id = $1", [id]);
        res.json(workOrder.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

const createWorkOrder = async (req, res) => {
    try {
        const { analisa, solusi, mekanik, mulai_kerja, estimasi_kerja, jo_id } = req.body;
        // PERBAIKAN: Jumlah kolom (6) dan VALUES placeholder ($1-$6) harus sama
        const newWorkOrder = await pool.query("INSERT INTO work_order (analisa, solusi, mekanik, mulai_kerja, estimasi_kerja, jo_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [analisa, solusi, mekanik, mulai_kerja, estimasi_kerja, jo_id]);
        res.json(newWorkOrder.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

const updateWorkOrder = async (req, res) => {
    try {
        const { id } = req.params;
        // PERBAIKAN 1: Tambahkan 'solusi' yang hilang dari req.body
        const { analisa, solusi, mekanik, mulai_kerja, estimasi_kerja, jo_id } = req.body;
        // PERBAIKAN 2: Sesuaikan variabel di dalam array agar cocok dengan placeholder $1, $2, dst.
        await pool.query("UPDATE work_order SET analisa = $1, solusi = $2, mekanik = $3, mulai_kerja = $4, estimasi_kerja = $5, jo_id = $6 WHERE id = $7", [analisa, solusi, mekanik, mulai_kerja, estimasi_kerja, jo_id, id]);
        res.json("Work Order was updated!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

const deleteWorkOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM work_order WHERE id = $1", [id]);
        res.json("Work Order was deleted!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    getWorkOrders,
    getWorkOrderById,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder
};
