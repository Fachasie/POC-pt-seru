const pool = require('../config/db');

// GET all job types
const getJobTypes = async (req, res) => {
  try {
    const allJobTypes = await pool.query('SELECT * FROM job_types');
    res.json(allJobTypes.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getJobTypes,
};
