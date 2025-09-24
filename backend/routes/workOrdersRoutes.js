const express = require('express');
const router = express.Router();
const workOrderController = require('../controllers/workOrdersController');

// -- Rute untuk Mengelola Koleksi (tanpa ID) --
router.get('/', workOrderController.getWorkOrders);
router.post('/', workOrderController.createWorkOrder);

// -- Rute untuk Mengelola Item Tunggal (dengan ID) --
router.get('/:id', workOrderController.getWorkOrderById);
router.put('/:id', workOrderController.updateWorkOrder);
router.delete('/:id', workOrderController.deleteWorkOrder);

module.exports = router;