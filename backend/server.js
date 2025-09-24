const express = require('express');
const app = express();
const cors = require('cors');
const jobOrderRoutes = require('./routes/jobOrderRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const jobTypeRoutes = require('./routes/jobTypeRoutes')

// Middleware
app.use(express.json()); 
app.use(cors({
  origin: '*', // Izinkan permintaan dari semua origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Izinkan semua metode HTTP
}));

// Semua rute di jobOrderRoutes akan memiliki endpoint /api/job-orders
app.use("/api/job-orders", jobOrderRoutes);

// Semua rute di equipmentRoutes akan memiliki endpoint /api/equipments
app.use("/api/equipments", equipmentRoutes);

// Semua rute di equipmentRoutes akan memiliki endpoint /api/job-types
app.use("/api/job-types", jobTypeRoutes);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server berjalan pada ${PORT}`);
});