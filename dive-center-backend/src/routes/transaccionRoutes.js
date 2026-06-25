const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');

router.route('/')
  .post(transaccionController.crearTransaccion);

module.exports = router;
