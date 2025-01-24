const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get the books using axios
public_users.get('/', async function (req, res) {
  try {
      const response = await axios.get('http://localhost:5000/books'); // Assuming the books endpoint is available
      res.json(response.data); // Directly send the parsed JSON data
  } catch (error) {
      res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
      const response = await axios.get(`http://localhost:5000/books`); // Assuming the book details endpoint is available
      const booksJS = Object.values(response.data);
      const bookByISBN = booksJS[isbn];
      res.json(bookByISBN); // Directly send the parsed JSON data
  } catch (error) {
      res.status(404).json({ message: "Book not found" });
  }
});


  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/books`);
    const booksJS = Object.values(response.data);
    const booksByAuthor = booksJS.filter(b => b.author === author);
    res.json(booksByAuthor);
  } catch (error) {
    res.status(404).json( {message:"Books by author not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/books`);
    const booksJS = Object.values(response.data);
    const bookByTitle = booksJS.filter(b => b.title === title);
    res.json(bookByTitle);
  } catch (error) {
    res.status(404).json( {message: "Book not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(book){
    res.json(book.reviews);
  }
  else{
    res.status(404).json( {message: "Book not found"});
  }
});

module.exports.general = public_users;
