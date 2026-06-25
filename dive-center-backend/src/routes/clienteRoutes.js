const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.route('/')
  .get(clienteController.obtenerClientes)
  .post(clienteController.crearCliente);

router.route('/:id')
  .get(clienteController.obtenerClientePorId)
  .put(clienteController.actualizarCliente)
  .delete(clienteController.eliminarCliente);

module.exports = router;
