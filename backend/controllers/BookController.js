const Book = require('../models/Book');

// Create a new book
const addBook = async (req, res) => {
  try {
    const { name, author, publication, year } = req.body;

    if (!name || !author || !publication || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const book = new Book({ name, author, publication, year });
    await book.save();

    res.status(201).json({ message: "Book created successfully", book });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update book by ID
const updateBook = async (req, res) => {
  try {
    const { name, author, publication, year } = req.body;

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { name, author, publication, year },
      { new: true, runValidators: true }
    );

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book updated successfully", book });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete book by ID
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getBooksWithPaginationAndSearch = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const search = req.query.name || '';
    const sortBy = req.query.sortBy || 'createdAt'; // default sort field
    const order = req.query.order === 'desc' ? -1 : 1;

    const query = {
      name: { $regex: search, $options: 'i' } // case-insensitive search by name
    };

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      Book.find(query)
        .sort({ [sortBy]: order }) // dynamic sorting
        .skip(skip)
        .limit(limit),
      Book.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      books,
      totalBooks: total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });

  } catch (err) {
    res.status(500).json({ message: 'Error fetching books', error: err.message });
  }
};


  



module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBooksWithPaginationAndSearch
};
