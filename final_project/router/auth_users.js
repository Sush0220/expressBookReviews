const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userWithSameName = users.filter((user) => {
    return user.username === username;
  });
  if (userWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validatedUser = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (validatedUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = { accessToken, username };
    console.log(req.session);
    return res.status(200).json({ message: "User logged in successfully" });
  } else {
    return res.status(208).json({ message: "User already exists" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const username = req.session.authorization.username;
  const review = req.query.review;

  if (!review) {
    return res.status(400).send("Review cannot be empty");
  }
  if (!username) {
    return res.status(400).send("User not logged in");
  }
  let book = Object.values(books).find((book) => book.isbn === isbn);

  if (!book) {
    return res.status(404).send("Book not found");
  }

  if (!book.reviews[username]) {
    book.reviews[username] = review;
  } else {
    book.reviews[username] = review;
  }
  return res.send(200).json({ message: "Review added successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const username = req.session.username;

  // Check if username is stored in the session
  if (!username) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not logged in" });
  }

  // Find the book by ISBN
  let book = Object.values(books).find((book) => book.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has reviewed the book
  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
