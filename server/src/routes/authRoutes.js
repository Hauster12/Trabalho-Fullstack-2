const express = require('express');
const router = express.Router();
const {
  sendVerificationCode,
  registerCliente,
  loginCliente,
  getClienteByUuid,
  loginAdmin
} = require('../controllers/authController');

router.post('/cliente/send-code', sendVerificationCode);
router.post('/cliente/register', registerCliente);
router.post('/cliente/login', loginCliente);
router.get('/cliente/me/:uuid', getClienteByUuid);
router.post('/admin/login', loginAdmin);

module.exports = router;
