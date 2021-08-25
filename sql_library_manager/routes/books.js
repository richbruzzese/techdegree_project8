var express = require('express');
var router = express.Router();
const Book = require('../models').Book
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// asyncHandler to manage all asynch functions in routing
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

//Router for /Books to handle view of book list and pagination
router.get('/', asyncHandler(async(req, res)=>{
  const page = parseInt(req.query.page)
  !page || page <=0 ? res.redirect('?page=1') : null
  const limit = 10
  const {count, rows} = await Book.findAndCountAll({
    order: [['createdAt', 'DESC']],
    limit,
    offset: (page -1) *limit
  })
  const pageCount = Math.ceil(count / limit)
  page > pageCount ?
  res.redirect(`?page=${pageCount}`) : null
  let links = 1
  res.render('index', {books: rows, pageCount, links})
}))

//Router to handle search function and update pages based on results
router.get('/search', asyncHandler(async(req,res) =>{
  const search = req.query.search.toLowerCase()
  const page = parseInt(req.query.page)
  !page || page <=0 ? res.redirect(`search?search=${search}&page=1`) : null
  const limit = 10
  const {count, rows} = await Book.findAndCountAll({
    where:{
      [Op.or]:[
        {
          title:{[Op.like]: `%${search}%`}
        },
        {
          author:{[Op.like]: `%${search}%`}
        },
        {
          genre:{[Op.like]: `%${search}%`}
        },
        {
          year:{[Op.like]: `%${search}%`}
        },
      ]
    },
    order: [['createdAt', 'DESC']],
    limit,
    offset: (page -1) *limit
  })
  if(count > 0){
    let links = 1
    const pageCount = Math.ceil(count / limit)
    page > pageCount ?
    res.redirect(`?search=${search}&page=${pageCount}`) : null
    res.render('index', {books: rows, pageCount, links, search})
  }else{
    res.render('book-not-found', {search})
  }
}))

/* Route to generate the book creation form*/
router.get('/new', (req, res) => {
  res.render("new-book", { book: {}, error: false, title: "New Book Entry" });
});

/* POST route when submitting a new book. */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/");
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error
    }  
  }
}));

/* Gets selected book and redirects to update form */
router.get('/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
    res.render("update-book", { book, title: "Edit Book", error: false});      
}))

// /* Handles the POST action to update the item. */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/"); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct Book gets updated
      res.render("new-book", { book, errors: error.errors, title: "Edit Book" })
    } else {
      throw error;
    }
  }
}));

// /* Route renders book deletion confirmation page */
router.get('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("delete-book", { book, title: "Delete Book" });
  } else {
    res.sendStatus(404);
  }
}));

// /* POST action to handle removal from the database. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
