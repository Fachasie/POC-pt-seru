const pool = require('../config/db');

// GET all job orders
const getJobOrders = async (req, res) => {
  try {
    const allJobOrders = await pool.query(
        "SELECT * FROM job_order AS jo JOIN equipments AS eq ON jo.equipment_id = eq.id JOIN job_types AS jt ON jo.job_type_id = jt.id"
    );
    res.json(allJobOrders.rows);
  } catch (err) {
    console.error(err.message);
  }
};

// GET a single job order
const getJobOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobOrder = await pool.query("SELECT * FROM job_order WHERE id = $1", [id]);
    res.json(jobOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
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