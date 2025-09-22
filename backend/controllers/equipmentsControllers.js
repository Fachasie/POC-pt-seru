const pool = require("../config/db");


// Get All Equipments

const getEquipments = async (req, res) => {
    try {
        const allEquipments = await pool.query("SELECT * FROM equipments");
        res.json(allEquipments.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error Gagal Mendapatkan Data");
    }
};

// Get Equipment By Id

const getEquipmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const Equipments = await pool.query("SELECT * FROM equipments WHERE id = $1", [id]);
        res.json(Equipments.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error Gagal Mendapatkan Data");
    }
};

// Create New Equipment

const createEquipment = async (req, res) => {
    try {
        const {no_lambung, keterangan_equipment } = req.body;
        const newEquipments = await pool.query(`INSERT INTO equipments (no_lambung, keterangan_equipment) VALUES ($1, $2) RETURNING *`, [no_lambung, keterangan_equipment]);
        res.json(newEquipments.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Gagal Menambahkan Data");
    }
};

// Update Equipment

const updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const {no_lambung, keterangan_equipment } = req.body;
        await pool.query(`UPDATE equipments SET no_lambung = $1, keterangan_equipment = $2 where id = $3`, [no_lambung, keterangan_equipment, id]);
        res.json("Equipment was updated!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Gagal Mengupdate Data");
    }
};

const deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM equipments WHERE id = $1", [id]);
        res.json("Equipment was deleted!")
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Gagal Menghapus Data");
    }
}

module.exports = {
    getEquipments,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
}