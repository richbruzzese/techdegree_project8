# Library Book Manager
 
## Description
This app uses Express, Sequelize and Pug to manage a list of Library Books

User can Add, Edit, and Delete existing books.
User can search for all books across the Database

## Built using
* Javascript
* Express
* Sequelize
* Pug

## Installation
* Download project files
* Navigate to sql_library_manager directory
* Run npm install to acquire dependencies
* Use npm start to view in local environment

### App Functionality
* Main index lists all books in database
* Newly created books added to top of list
* Books must contain an Author and Title to be submit
    * Submissions without required content will render an error to allow user to fix
    * Error will render on creation of new book or updating an existing book
* Searching for books returns partial string matches
* Deleting a book permanantely removes the file from the database

