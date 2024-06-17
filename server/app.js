const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 5000;

// dummy books data
let books = [
  {
    id: 1,
    author: "Unknown",
    country: "Sumer and Akkadian Empire",
    imageLink:
      "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=2858&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    language: "Akkadian",
    link: "https://en.wikipedia.org/wiki/Epic_of_Gilgamesh\n",
    pages: 160,
    title: "The Epic Of Gilgamesh",
    year: -1700,
  },
  {
    id: 2,
    author: "Chinua Achebe",
    country: "Nigeria",
    imageLink:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    language: "English",
    link: "https://en.wikipedia.org/wiki/Things_Fall_Apart\n",
    pages: 209,
    title: "Things Fall Apart",
    year: 1958,
  },
  {
    id: 3,
    author: "Hans Christian Andersen",
    country: "Denmark",
    imageLink:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    language: "Danish",
    link: "https://en.wikipedia.org/wiki/Fairy_Tales_Told_for_Children._First_Collection.\n",
    pages: 784,
    title: "Fairy tales",
    year: 1836,
  },
  {
    id: 4,
    author: "Dante Alighieri",
    country: "Italy",
    imageLink:
      "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    language: "Italian",
    link: "https://en.wikipedia.org/wiki/Divine_Comedy\n",
    pages: 928,
    title: "The Divine Comedy",
    year: 1315,
  },
  {
    id: 5,
    author: "Unknown",
    country: "Achaemenid Empire",
    imageLink:
      "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=2785&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    language: "Hebrew",
    link: "https://en.wikipedia.org/wiki/Book_of_Job\n",
    pages: 176,
    title: "The Book Of Job",
    year: -600,
  },
  {
    id: 6,
    author: "Unknown",
    country: "India/Iran/Iraq/Egypt/Tajikistan",
    imageLink:
      "https://images.unsplash.com/photo-1562232573-0305012a8818?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    language: "Arabic",
    link: "https://en.wikipedia.org/wiki/One_Thousand_and_One_Nights\n",
    pages: 288,
    title: "One Thousand and One Nights",
    year: 1200,
  },
  {
    id: 7,
    author: "Unknown",
    country: "Iceland",
    imageLink:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    language: "Old Norse",
    link: "https://en.wikipedia.org/wiki/Nj%C3%A1ls_saga\n",
    pages: 384,
    title: "Nj\u00e1l's Saga",
    year: 1350,
  },
  {
    id: 8,
    author: "Jane Austen",
    country: "United Kingdom",
    imageLink:
      "https://images.unsplash.com/photo-1467951591042-f388365db261?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    language: "English",
    link: "https://en.wikipedia.org/wiki/Pride_and_Prejudice\n",
    pages: 226,
    title: "Pride and Prejudice",
    year: 1813,
  },
  {
    id: 9,
    author: "Honor\u00e9 de Balzac",
    country: "France",
    imageLink:
      "https://images.unsplash.com/photo-1554672053-c4205442a9fb?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    language: "French",
    link: "https://en.wikipedia.org/wiki/Le_P%C3%A8re_Goriot\n",
    pages: 443,
    title: "Le P\u00e8re Goriot",
    year: 1835,
  },
  {
    id: 10,
    author: "Samuel Beckett",
    country: "Republic of Ireland",
    imageLink:
      "https://images.unsplash.com/photo-1599893242842-1b723407f8c9?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    language: "French, English",
    link: "https://en.wikipedia.org/wiki/Molloy_(novel)\n",
    pages: 256,
    title: "Molloy, Malone Dies, The Unnamable, the trilogy",
    year: 1952,
  },
];

// Middleware setup
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// get all books with search parameter
app.get("/books", (req, res) => {
  const { search } = req.query;

  if (search) {
    const filteredBooks = books.filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    );

    if (filteredBooks.length > 0) {
      res.json(filteredBooks);
    } else {
      res.status(404).json({ error: "No books found" });
    }
  } else {
    res.json(books);
  }
});

// get particular book details
app.get("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const book = books.find((b) => b.id === parseInt(bookId));
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

// create a new book
app.post("/books", upload.single("imageLink"), (req, res) => {
  const { title, author } = req.body;
  const imageLink = req.file ? `/uploads/${req.file.filename}` : "";
  const newBook = { id: books.length + 1, title, author, imageLink };

  books.unshift(newBook);
  res.status(201).json({ message: "Book created successfully", book: newBook });
});

// edit book
app.put("/books/:id", upload.single("imageLink"), (req, res) => {
  const { title, author } = req.body;
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex !== -1) {
    const updatedBook = { ...books[bookIndex], title, author };

    const existingImageLink = books[bookIndex].imageLink;

    if (req.file) {
      updatedBook.imageLink = `/uploads/${req.file.filename}`;
    }

    books[bookIndex] = updatedBook;

    if (
      req.file &&
      existingImageLink &&
      existingImageLink !== "/uploads/default-book-image.jpg"
    ) {
      const filePath = path.join(__dirname, existingImageLink.slice(1));
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log(`Deleted existing image file: ${filePath}`);
        }
      });
    }

    res
      .status(200)
      .json({ message: "Book updated successfully", book: updatedBook });
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

// delete book
app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const bookIndex = books.findIndex((b) => b.id == bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    res.json({ message: "Book deleted" });
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

// server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
