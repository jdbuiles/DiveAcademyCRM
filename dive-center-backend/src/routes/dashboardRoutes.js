const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
// Aplicar restricción estricta de Administrador a todas las rutas de este archivo
router.use(verificarRol(['Administrador']));
router.get('/', dashboardController.obtenerDashboardGlobal);

module.exports = router;
