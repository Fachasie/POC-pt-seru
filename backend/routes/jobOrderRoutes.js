const express = require('express');
const router = express.Router();
const jobOrderController = require('../controllers/jobOrdersControllers');
const { validateJobOrder } = require('../middleware/validator');

// -- Rute untuk Mengelola Koleksi (tanpa ID) --
router.get('/', jobOrderController.getJobOrders);
router.post('/', validateJobOrder, jobOrderController.createJobOrder);

// -- Rute untuk Mengelola Item Tunggal (dengan ID) --
router.get('/:id', jobOrderController.getJobOrderById);
router.put('/:id', validateJobOrder, jobOrderController.updateJobOrder);
router.delete('/:id', jobOrderController.deleteJobOrder);

module.exports = router;