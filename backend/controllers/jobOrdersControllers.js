const pool = require('../config/db');

// GET all job orders
const getJobOrders = async (req, res) => {
  try {
    const query = `
     SELECT 
        jo.id AS job_order_id,
        jo.project_site,
        jo.date_form,
        jo.hm,
        jo.km,
        jo.uraian_masalah,
        jo.nama_operator,
        jo.tanggal_masuk,
        jo.tanggal_keluar,
        jo.status_mutasi,
        jo.status,
        jo.equipment_id,
        jo.job_type_id,
        eq.no_lambung AS equipments_no_lambung,
        eq.keterangan_equipment,
        jt.id AS job_type_id,
        jt.jenis_pekerjaan
      FROM job_order AS jo
      JOIN equipments AS eq ON jo.equipment_id = eq.id
      JOIN job_types AS jt ON jo.job_type_id = jt.id
    `;
    
    const allJobOrders = await pool.query(query);
    
    console.log(allJobOrders.rows); // Untuk debugging, menampilkan hasil query
    res.json(allJobOrders.rows);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); // Menambahkan respons error ke client
  }
};

// GET a single job order
const getJobOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobOrder = await pool.query(
      `SELECT 
        jo.id AS job_order_id,
        jo.project_site,
        jo.date_form,
        jo.hm,
        jo.km,
        jo.uraian_masalah,
        jo.nama_operator,
        jo.tanggal_masuk,
        jo.tanggal_keluar,
        jo.status_mutasi,
        jo.status,
        eq.id AS equipment_id,
        eq.no_lambung,
        eq.keterangan_equipment,
        jt.id AS job_type_id,
        jt.jenis_pekerjaan
      FROM job_order AS jo
      JOIN equipments AS eq ON jo.equipment_id = eq.id
      JOIN job_types AS jt ON jo.job_type_id = jt.id
      WHERE jo.id = $1`,
      [id]
    );

    if (jobOrder.rows.length === 0) {
      return res.status(404).json({ message: "Job order not found" });
    }

    res.json(jobOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};


// CREATE a new job order
const createJobOrder = async (req, res) => {
  try {
    const {
      project_site, date_form, hm, km, uraian_masalah, nama_operator,
      tanggal_masuk, tanggal_keluar, status_mutasi, status, equipment_id, job_type_id
    } = req.body;
    
    const newJobOrder = await pool.query(
      `INSERT INTO job_order (project_site, date_form, hm, km, uraian_masalah, nama_operator,
        tanggal_masuk, tanggal_keluar, status_mutasi, status, equipment_id, job_type_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [project_site, date_form, hm, km, uraian_masalah, nama_operator,
       tanggal_masuk, tanggal_keluar, status_mutasi, status, equipment_id, job_type_id]
    );
    res.json(newJobOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
};

// UPDATE a job order
const updateJobOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      project_site, date_form, hm, km, uraian_masalah, nama_operator,
      tanggal_masuk, tanggal_keluar, status_mutasi, status, equipment_id, job_type_id
    } = req.body;
    
    await pool.query(
      `UPDATE job_order SET
        project_site = $1, date_form = $2, hm = $3, km = $4, uraian_masalah = $5,
        nama_operator = $6, tanggal_masuk = $7, tanggal_keluar = $8, status_mutasi = $9,
        status = $10, equipment_id = $11, job_type_id = $12
      WHERE id = $13`,
      [project_site, date_form, hm, km, uraian_masalah, nama_operator,
       tanggal_masuk, tanggal_keluar, status_mutasi, status, equipment_id, job_type_id, id]
    );
    res.json("Job order was updated!");
  } catch (err) {
    console.error(err.message);
  }
};

// DELETE a job order
const deleteJobOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM job_order WHERE id = $1", [id]);
    res.json("Job order was deleted!");
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  getJobOrders,
  getJobOrderById,
  createJobOrder,
  updateJobOrder,
  deleteJobOrder,
};