const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentsControllers');
const { validateEquipment } = require('../middleware/validator');

// -- Rute untuk Mengelola Koleksi (tanpa ID) --
router.get('/', equipmentController.getEquipments);
router.post('/', validateEquipment, equipmentController.createEquipment);

// -- Rute untuk Mengelola Item Tunggal (dengan ID) --
router.get('/:id', equipmentController.getEquipmentById);
router.put('/:id', validateEquipment, equipmentController.updateEquipment);
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;