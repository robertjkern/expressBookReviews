const express = require('express');
let books = require("./booksdb.js"); // local books data
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });    
    }
  } else {
    return res.status(404).json({ message: "Unable to register user." });
  }
});

// Get the list of all books
public_users.get('/books', async (req, res) => {
  const getBooks = () => {
    return new Promise((resolve, reject) => {
      if (books) resolve(books);
      else reject("No books available");
    });
  };

  try {
    const allBooks = await getBooks();
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Get book details by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  const getBookByISBN = () => {
    return new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    });
  };

  try {
    const book = await getBookByISBN();
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  const getBooksByAuthor = () => {
    return new Promise((resolve, reject) => {
      const result = Object.values(books).filter(b => b.author.toLowerCase() === author.toLowerCase());
      if (result.length > 0) resolve(result);
      else reject("No books found for this author");
    });
  };

  try {
    const authorBooks = await getBooksByAuthor();
    res.status(200).json(authorBooks);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  const getBooksByTitle = () => {
    return new Promise((resolve, reject) => {
      const result = Object.values(books).filter(b => b.title.toLowerCase() === title.toLowerCase());
      if (result.length > 0) resolve(result);
      else reject("No books found with this title");
    });
  };

  try {
    const titleBooks = await getBooksByTitle();
    res.status(200).json(titleBooks);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Get all reviews for a book
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  const getBookReviews = () => {
    return new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn].reviews);
      else reject("Book not found");
    });
  };

  try {
    const reviews = await getBookReviews();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

module.exports.general = public_users;

