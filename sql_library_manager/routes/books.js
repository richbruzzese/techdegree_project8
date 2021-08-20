var express = require('express');
var router = express.Router();
const Book = require('../models').Book
// const Sequelize = require ('..models').Sequelize

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}
/* GET Books listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({order: [["createdAt", "DESC"]]})
  res.render("index", { books, title: "Library" });
}));

/* GET new book form */
router.get('/new', (req, res) => {
  res.render("new-book", { book: {}, error: false, title: "New Book Entry" });
});

/* POST create Book. */
// router.post('/', asyncHandler(async (req, res) => {
//   let book;
//   try {
//     book = await Book.create(req.body);
//     res.redirect("/Books/" + book.id);
//   } catch (error) {
//     if(error.name === "SequelizeValidationError") { // checking the error
//       book = await Book.build(req.body);
//       res.render("books/new-book", { book, errors: error.errors, title: "New Book" })
//     } else {
//       throw error
//     }  
//   }
// }));

/* Edit Book form. */
// router.get('/:id/edit', asyncHandler(async(req, res) => {
//   const book = await Book.findByPk(req.params.id);
//   if(book) {
//     res.render("books/edit", { book, title: "Edit Book" });      
//   } else {
//     res.sendStatus(404);
//   };
// }));

/* GET individual Book. */
// router.get('/:id', asyncHandler(async (req, res) => {
//   const book = await Book.findByPk(req.params.id);
//   if(book) {
//     res.render("books/show", { book, title: book.title });  
//   } else {
//     res.sendStatus(404);
//   }; 
// }));

// /* Update an Book. */
// router.post('/:id/edit', asyncHandler(async (req, res) => {
//   let book;
//   try {
//     book = await Book.findByPk(req.params.id);
//     if(book) {
//       await Book.update(req.body);
//       res.redirect("/books/" + book.id); 
//     } else {
//       res.sendStatus(404);
//     }
//   } catch (error) {
//     if(error.name === "SequelizeValidationError") {
//       book = await Book.build(req.body);
//       book.id = req.params.id; // make sure correct Book gets updated
//       res.render("books/edit", { book, errors: error.errors, title: "Edit Book" })
//     } else {
//       throw error;
//     }
//   }
// }));

// /* Delete Book form. */
// router.get('/:id/delete', asyncHandler(async (req, res) => {
//   const book = await Book.findByPk(req.params.id);
//   if(book) {
//     res.render("Books/delete", { book, title: "Delete Book" });
//   } else {
//     res.sendStatus(404);
//   }
// }));

// /* Delete individual Book. */
// router.post('/:id/delete', asyncHandler(async (req ,res) => {
//   const book = await Book.findByPk(req.params.id);
//   if(book) {
//     await Book.destroy();
//     res.redirect("/books");
//   } else {
//     res.sendStatus(404);
//   }
// }));

module.exports = router;
