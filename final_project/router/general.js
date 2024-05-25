const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }
  if (isValid(username)) {
    return res.status(400).send("Username already exists");
  }
  const newUser = {
    username: username,
    password: password,
  };
  const userId = Object.keys(users).length + 1;
  users[userId] = newUser;

  res.status(200).send("User registered successfully");
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = parseInt(req.params.isbn);
  let bookFound = null;

  for (let key in books) {
    if (books[key].isbn === isbn) {
      bookFound = books[key];
      break;
    }
  }
  if (bookFound) {
    res.send(bookFound);
  } else {
    res.status(404).send("Book not found");
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];

  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push(books[key]);
    }
  }

  if (booksByAuthor.length > 0) {
    res.send(booksByAuthor);
  } else {
    res.status(404).send("No books found by this author");
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];

  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push(books[key]);
    }
  }

  if (booksByTitle.length > 0) {
    res.send(booksByTitle);
  } else {
    res.status(404).send("No books found by this title");
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = parseInt(req.params.isbn);
  let bookFound = null;

  for (let key in books) {
    if (books[key].isbn === isbn) {
      bookFound = books[key];
      break;
    }
  }
  if (bookFound) {
    res.send(bookFound.reviews);
  } else {
    res.status(404).send("Book not found");
  }
});

module.exports.general = public_users;
