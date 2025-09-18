const express = require('express');
const app = express();
const pool = require('./config/db');
const cors = require('cors');
const { validateJobOrder } = require('./middleware/validator');
const jobOrderController = require('./controllers/jobOrdersControllers');

// Middleware
app.use(express.json());
app.use(cors());

// Routes
// Get ALL
app.get('/api/job-orders', jobOrderController.getJobOrders);

// Get By Id
app.get('/api/job-orders/:id', jobOrderController.getJobOrderById);

// Post Create
app.post('/api/job-orders', validateJobOrder, jobOrderController.createJobOrder);

// Update
app.put('/api/job-orders/:id', validateJobOrder, jobOrderController.updateJobOrder);

// Delete
app.delete('/api/job-orders/:id', jobOrderController.deleteJobOrder);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server berjalan pada ${PORT}`);
});
