const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Book title is required"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
  },
  genre: {
    type: String,
  },
});

const Book = mongoose.model("Book", bookSchema);

Book.getAllBooks = async () => {
  {
    try {
      return await Book.find();
      console.log(books);
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

Book.createBook = async (BookData) => {
  try {
    return await Book.create(BookData);
    res.status(201).json({ message: "Book created...", book: newBook });
  } catch (err) {
    throw new Error(err.message);
  }
};

Book.getBookByID = async (bookId) => {
  try {
    return await Book.findById(bookId);
  } catch (err) {
    throw new Error(err.message);
  }
};

  Book.updateBook = async (bookId, newData) => {
    try {
      return await Book.findByIdAndUpdate(bookId, newData);
    } catch (err) {
      throw new Error(err.message);
    }
  };

Book.deleteBook = async (bookId) => {
  try {
    return await Book.findByIdAndDelete(bookId);
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = Book;
