const express = require("express");
const router = express.Router();
const book_controller = require("../controllers/book_controller");


//routes
router.get('/display', book_controller.getAllBooks);
router.get('/unique/:id', book_controller.getBookByID);
router.post('/add', book_controller.createBook);
router.put('/update/:id', book_controller.updateBook);
router.delete('/delete/:id', book_controller.deleteBook);
router.post("/pagination", book_controller.paginateBooks);

module.exports= router;