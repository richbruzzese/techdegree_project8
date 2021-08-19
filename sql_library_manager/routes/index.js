var express = require('express');
var router = express.Router();
const Book = require('../models').Book

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

/* GET home page. */
router.get('/', asyncHandler( async (req, res, next) => {
  const books = await Book.findAll()
  console.log({books:books})
  res.json({books})
  // res.render('index', { title: 'Express' });
} ));

module.exports = router;