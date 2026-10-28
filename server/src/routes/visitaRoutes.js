const express = require('express');
const router = express.Router();
const {
  listVisitas,
  createVisita,
  updateVisita,
  deleteVisita
} = require('../controllers/visitaController');

router.get('/', listVisitas);
router.post('/', createVisita);
router.put('/:id', updateVisita);
router.delete('/:id', deleteVisita);

module.exports = router;
