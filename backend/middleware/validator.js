const validateJobOrder = (req, res, next) => {
  const {
    project_site, date_form, hm, km, uraian_masalah, nama_operator,
    tanggal_masuk, tanggal_keluar, status_mutasi, status, equipment_id, job_type_id
  } = req.body;

  // Cek apakah ada field yang kosong atau tidak ada
  if (!project_site || !date_form || !hm || !km || !uraian_masalah || !nama_operator ||
      !tanggal_masuk || !tanggal_keluar || !status_mutasi || !status || !equipment_id || !job_type_id) {
    return res.status(400).json({ error: "Semua field harus diisi." });
  }

  // Jika semua valid, lanjutkan ke controller
  next();
};

module.exports = {
  validateJobOrder,
};