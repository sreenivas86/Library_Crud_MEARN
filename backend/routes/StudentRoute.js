const express = require('express');
const router = express.Router();
const { addStudent, studentUploadMiddleware, findAllstu, findOneStudent, updateStudent, deleteStudent, findStudentsWithPagination, getClassList } = require('../controllers/studentContoller');

router.post('/add', studentUploadMiddleware, addStudent);
router.get('/all',findAllstu)
router.get('/students/:id', findOneStudent);
router.put('/students/:id', studentUploadMiddleware, updateStudent);
router.delete('/students/:id', deleteStudent)
router.get('/students',findStudentsWithPagination)
router.get('/classes',getClassList)

module.exports = router;