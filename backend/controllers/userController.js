const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT * FROM users");
        res.json(allUsers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length === 0) {
            return res.status(401).json("Invalid credentials");
        }

        // Untuk saat ini, kita akan membandingkan password secara langsung.
        // Dalam aplikasi produksi, Anda HARUS menggunakan bcrypt untuk mem-hash dan membandingkan password.
        if (password !== user.rows[0].password) {
            return res.status(401).json("Invalid credentials");
        }

        // Buat token JWT
        const token = jwt.sign({ id: user.rows[0].id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    getUsers,
    login
};
