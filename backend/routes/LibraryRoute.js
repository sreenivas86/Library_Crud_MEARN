const express = require('express');
const router = express.Router();
const {
  addLibraryRecord,
  getAllLibraryRecords,
  getLibraryRecordById,
  updateLibraryRecord,
  deleteLibraryRecord,
  getLibraryRecords
} = require('../controllers/LibraryController');

router.post('/library', addLibraryRecord);
router.get('/library', getAllLibraryRecords);
router.get('/library/:id', getLibraryRecordById);
router.put('/library/:id', updateLibraryRecord);
router.delete('/library/:id', deleteLibraryRecord);
router.get('/librari', getLibraryRecords);

module.exports = router;
