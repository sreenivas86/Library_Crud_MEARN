const Library = require('../models/Library');


const addLibraryRecord = async (req, res) => {
  try {
    const { studentName, bookName, startDate, endDate } = req.body;

    if (!studentName || !bookName || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }

    const record = new Library({ studentName, bookName, startDate, endDate });
    await record.save();

    res.status(201).json({ message: "Library record added successfully", record });
  } catch (error) {
    console.error("Error creating library record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getAllLibraryRecords = async (req, res) => {
  try {
    const records = await Library.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching library records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getLibraryRecordById = async (req, res) => {
  try {
    const record = await Library.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(record);
  } catch (error) {
    console.error("Error fetching record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateLibraryRecord = async (req, res) => {
  try {
    const { studentName, bookName, startDate, endDate } = req.body;

    if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }

    const record = await Library.findByIdAndUpdate(
      req.params.id,
      { studentName, bookName, startDate, endDate },
      { new: true, runValidators: true }
    );

    if (!record) return res.status(404).json({ message: "Record not found" });

    res.status(200).json({ message: "Library record updated", record });
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deleteLibraryRecord = async (req, res) => {
  try {
    const record = await Library.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Library record deleted" });
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




const getLibraryRecords = async (req, res) => {
  try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    
    const studentSearch = req.query.studentName || '';
    const bookSearch = req.query.bookName || '';

    const query = {
      studentName: { $regex: studentSearch, $options: 'i' },
      bookName: { $regex: bookSearch, $options: 'i' }
    };

    
    const sortBy = req.query.sortBy || 'createdAt'; // default sort
    const order = req.query.order === 'desc' ? -1 : 1;
    const sort = { [sortBy]: order };

    
    const [records, total] = await Promise.all([
      Library.find(query).sort(sort).skip(skip).limit(limit),
      Library.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      records,
      currentPage: page,
      totalPages,
      totalDocs: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });

  } catch (err) {
    res.status(500).json({ message: 'Error fetching records', error: err.message });
  }
};




module.exports = {
  addLibraryRecord,
  getAllLibraryRecords,
  getLibraryRecordById,
  updateLibraryRecord,
  deleteLibraryRecord,
  getLibraryRecords 
};
