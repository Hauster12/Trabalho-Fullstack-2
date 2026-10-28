const express = require('express');
const router = express.Router();
const {
  getImoveis,
  getImovelById,
  createImovel,
  updateImovel,
  toggleDestaque,
  deleteImovel
} = require('../controllers/imovelController');

router.get('/', getImoveis);
router.get('/:id', getImovelById);
router.post('/', createImovel);
router.put('/:id', updateImovel);
router.patch('/:id/destaque', toggleDestaque);
router.delete('/:id', deleteImovel);

module.exports = router;
