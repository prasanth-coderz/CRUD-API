const Book = require("../models/book");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.getAllBooks();
    res.json(books);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting books", error: error.message });
    console.log(error);
  }
};

exports.getBookByID = async (req, res) => {
  try {
    const bookId = req.params.id; // Extract the book ID from the URL path

    if (!bookId) {
      throw new Error("Book ID is required");
    }

    const book = await Book.getBookByID(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ book });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
};

exports.createBook = async (req, res) => {
  try {
    const book = await Book.createBook(req.body);
    res.status(201).json(book);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating book", error: error.message });
    console.log(error);
  }
};

exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id; // Extract the book ID from the query string
    const newData = req.body; // Get the new data from the request body

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const updatedBook = await Book.updateBook(bookId, newData); // Update the book

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book Updated", updatedBook }); // Respond with the updated book
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating book", error: error.message });
    console.log(error);
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id; // Extract the book ID from the query string

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const deletedBook = await Book.deleteBook(bookId); // Delete the book

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted" }); // Respond with success message
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
    console.log(error);
  }
};

