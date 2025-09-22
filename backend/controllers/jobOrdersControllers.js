const pool = require('../config/db');

// GET all job orders
const getJobOrders = async (req, res) => {
  try {
    const allJobOrders = await pool.query(
      'SELECT jo.id, jo.project_site, jo.date_form, jo.hm, jo.km, jo.uraian_masalah, jo.nama_operator, jo.tanggal_masuk, jo.tanggal_keluar, jo.status_mutasi, jo.status, eq.no_lambung, eq.keterangan_equipment, jt.jenis_pekerjaan FROM job_order AS jo JOIN equipments AS eq ON jo.equipment_id = eq.id JOIN job_types AS jt ON jo.job_type_id = jt.id'
    );
    res.json(allJobOrders.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error Gagal Mendapatkan Data');
  }
};

// GET a single job order
const getJobOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobOrder = await pool.query(
      `
      SELECT
        jo.id, jo.project_site, jo.date_form, jo.hm, jo.km, jo.uraian_masalah, jo.nama_operator, jo.tanggal_masuk, jo.tanggal_keluar, jo.status_mutasi, jo.status, eq.no_lambung, eq.keterangan_equipment, jt.jenis_pekerjaan FROM job_order AS jo JOIN equipments AS eq ON jo.equipment_id = eq.id JOIN job_types AS jt ON jo.job_type_id = jt.id
        WHERE jo.id = $1`,
      [id]
    );

    if (jobOrder.rows.length === 0) {
      return res.status(404).json('Data tidak ditemukan');
    }
    res.json(jobOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error Gagal Mendapatkan Data');
  }
};

// CREATE a new job order
const createJobOrder = async (req, res) => {
  try {
    const { project_site, date_form, hm, km, uraian_masalah, nama_operator, tanggal_masuk, tanggal_keluar, status_mutasi, status, equipment_id, job_type_id } = req.body;

    const newJobOrder = await pool.query(
      `INSERT INTO job_order (project_site, date_form, hm, km, uraian_masalah, nama_operator,
        tanggal_masuk, tanggal_keluar, status_mutasi, status, equipment_id, job_type_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [project_site, date_form, hm, km, uraian_masalah, nama_operator, tanggal_masuk, tanggal_keluar, status_mutasi, status, equipment_id, job_type_id]
    );
    res.json(newJobOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Gagal Menambahkan Data');
  }
};

// UPDATE a job order
const updateJobOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { project_site, equipment_id, date_form, hm, km, job_type_id, uraian_masalah, nama_operator, tanggal_masuk, tanggal_keluar, status_mutasi, status } = req.body;

    // Validasi dasar untuk memastikan ID foreign key ada
    if (!equipment_id || !job_type_id) {
      return res.status(400).json({ message: 'Equipment ID dan Job Type ID harus diisi.' });
    }

    const result = await pool.query(
      `UPDATE job_order SET
        project_site = $1,
        equipment_id = $2,
        date_form = $3,
        hm = $4,
        km = $5,
        job_type_id = $6,
        uraian_masalah = $7,
        nama_operator = $8,
        tanggal_masuk = $9,
        tanggal_keluar = $10,
        status_mutasi = $11,
        status = $12
      WHERE id = $13 RETURNING *`,
      [project_site, equipment_id, date_form, hm, km, job_type_id, uraian_masalah, nama_operator, tanggal_masuk, tanggal_keluar, status_mutasi, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: `Job order dengan ID ${id} tidak ditemukan.` });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in updateJobOrder:', err.message);
    res.status(500).send('Server Error: Gagal memperbarui data.');
  }
};

// DELETE a job order
const deleteJobOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM job_order WHERE id = $1', [id]);
    res.json('Job order was deleted!');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getJobOrders,
  getJobOrderById,
  createJobOrder,
  updateJobOrder,
  deleteJobOrder,
};
