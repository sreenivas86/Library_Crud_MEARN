const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Student = require('../models/Student');

// Ensure upload directories exist
['uploads/images', 'uploads/videos', 'uploads/others'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'image') {
      cb(null, 'uploads/images/');
    } else if (file.fieldname === 'video') {
      cb(null, 'uploads/videos/');
    } else {
      cb(null, 'uploads/others/');
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

// File upload config
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    if (file.fieldname === 'video' && !file.mimetype.startsWith('video/')) {
      return cb(new Error('Only video files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Controller function
const addStudent = async (req, res) => {
  try {
    const { name, className } = req.body;
    const image = req.files?.image?.[0];
    const video = req.files?.video?.[0];

    if (!name || !className || !image || !video) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Save student data to DB
    const student = new Student({
      name,
      className,
      imagePath: image.path,
      videoPath: video.path
    });

    await student.save();

    return res.status(201).json({
      message: 'Student added successfully!',
      student
    });

  } catch (err) {
    console.error('Error in addStudent:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Multer middleware to be used in route
const studentUploadMiddleware = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

const findAllstu = async (req, res) => {
    try {
        const students = await Student.find(); // Await the database query
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: "Error fetching students", error: err.message });
    }
};
const findOneStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student", error: err.message });
  }
};

// ✅ Update student
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const { name, className } = req.body;
    const image = req.files?.image?.[0];
    const video = req.files?.video?.[0];

    if (name) student.name = name;
    if (className) student.className = className;
    if (image) student.imagePath = image.path;
    if (video) student.videoPath = video.path;

    await student.save();
    res.status(200).json({ message: 'Student updated successfully', student });

  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Optionally delete uploaded files
    if (student.imagePath && fs.existsSync(student.imagePath)) fs.unlinkSync(student.imagePath);
    if (student.videoPath && fs.existsSync(student.videoPath)) fs.unlinkSync(student.videoPath);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed", error: err.message });
  }
};




const findStudentsWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const sortFields = (req.query.sortBy || 'createdAt').split(',');
    const order = req.query.order === 'asc' ? 1 : -1;
    const sortObj = {};
    sortFields.forEach(field => sortObj[field] = order);

    const classNameFilter = req.query.className;
    const nameFilter = req.query.name;

    const query = {};
    if (classNameFilter) query.className = { $regex: classNameFilter, $options: 'i' };
    if (nameFilter) query.name = { $regex: nameFilter, $options: 'i' };

    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find(query).sort(sortObj).skip(skip).limit(limit),
      Student.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      students,
      currentPage: page,
      totalPages,
      totalStudents: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching students", error: err.message });
  }
};
const getClassList = async (req, res) => {
  try {
    const classes = await Student.distinct('className');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch class list' });
  }
};





module.exports = { addStudent, studentUploadMiddleware,findAllstu,findOneStudent,
  updateStudent,
  deleteStudent ,findStudentsWithPagination,getClassList};
