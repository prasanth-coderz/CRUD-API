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

// Pagination function
exports.paginateBooks = async (req, res) => {
  try {
    const { page, limit, search, filters, sort } = req.body;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const aggregationPipeline = [];

    const matchQuery = {};
    if (search) {
      const fieldsToSearch = ["title", "author", "genre"];
      matchQuery.$or = fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
    }

    let message = "";
    if (!search) {
      message = "All records are displayed because the search field is empty.";
    }

    if (filters) {
      Object.keys(filters).forEach((field) => {
        if (filters[field] !== "") {
          matchQuery[field] = { $regex: filters[field], $options: "i" };
        }
      });
    }
    if (Object.keys(matchQuery).length > 0) {
      aggregationPipeline.push({ $match: matchQuery });
    }

    // SORTING FUNCTIONALITY
    if (sort && sort.order) {
      const sortOptions = {};
      const sortField = sort.field ? sort.field : "title"; // Default sort field "title"
      sortOptions[sortField] = sort.order === "asc" ? 1 : -1;
      aggregationPipeline.push({ $sort: sortOptions });
    }

    aggregationPipeline.push({ $skip: skip });
    aggregationPipeline.push({ $limit: limitNumber });

    const books = await Book.aggregate(aggregationPipeline);

    let totalCount = 0;
    let warningMessage = "";

    if (books.length === 0 && search) {
      warningMessage = "No records found matching the search term.";
    } else {
      totalCount = await Book.aggregate([
        { $match: matchQuery },
        { $count: "count" },
      ]);
    }
    const totalRecords = totalCount.length > 0 ? totalCount[0].count : 0;
    const RemainingPages = Math.max(totalRecords - pageNumber, 0);

    res.json({
      totalCount: totalRecords,
      currentPage: warningMessage ? 0 : pageNumber,
      totalPages: Math.ceil(totalRecords / limitNumber),
      ...(message !== "" && { message }),
      RemainingPages,
      books,
      ...(warningMessage !== "" && { warningMessage }),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error on retrieving books", error: error.message });
  }
};
