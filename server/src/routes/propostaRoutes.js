const express = require('express');
const router = express.Router();
const {
  createProposta,
  getPropostasByCliente,
  getAllPropostas,
  respondProposta,
  deleteProposta
} = require('../controllers/propostaController');

router.post('/', createProposta);
router.get('/cliente/:clienteId', getPropostasByCliente);
router.get('/admin/all', getAllPropostas);
router.put('/admin/respond/:id', respondProposta);
router.delete('/admin/:id', deleteProposta);

module.exports = router;
