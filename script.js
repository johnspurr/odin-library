const bookContainer = document.querySelector(".book-container");

let myLibrary = [];
let lastFocus = document.activeElement;

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  static fromFormData(formData) {
    let title = formData.get("title");
    let author = formData.get("author");
    let pages = Number(formData.get("pages"));
    let read = formData.has("read");

    return new this(title, author, pages, read);
  }

  toggleRead() {
    this.read = !this.read;
  }
}

function addBookToLibrary(book) {
  const bookNode = createBookNode(book);
  bookContainer.insertBefore(bookNode, bookContainer.lastElementChild);
  myLibrary.push(book);
}

function createBookNode(book) {
  const bookNode = document.createElement("div");
  bookNode.className = "book"

  bookNode.dataset.index = myLibrary.length;

  bookNode.dataset.title = book.title;
  const titleNode = createDivWithClassAndText("book__title", book.title);
  bookNode.appendChild(titleNode);
  
  bookNode.dataset.author = book.author;
  const authorNode = createDivWithClassAndText("book__author", book.author)
  bookNode.appendChild(authorNode);

  bookNode.dataset.pages = book.pages;
  const pagesNode = createDivWithClassAndText("book__pages", `${book.pages} pages`)
  bookNode.appendChild(pagesNode);

  bookNode.dataset.read = book.read;
  const readNode = createDivWithClassAndText("book__read", "");
  if (book.read) {
    readNode.classList.toggle("read");
  }
  readNode.addEventListener("click", event => {
    readNode.classList.toggle("read");
    const book = event.target.parentElement;
    myLibrary[book.dataset.index].toggleRead();
  })
  bookNode.appendChild(readNode);

  return bookNode;
}

function createDivWithClassAndText(className, textContent) {
  const div = document.createElement("div");
  div.className = className;
  const text = document.createTextNode(textContent);
  div.appendChild(text);
  return div;
}

document.querySelector(".add-book").addEventListener("click", event => {
  lastFocus = document.activeElement;
  document.querySelector(".modal-container").classList.toggle("hidden");
  document.querySelector("#book-form__title").focus();
})

document.querySelector(".modal").addEventListener("click", event => {
  event.stopPropagation();
})

document.querySelector(".modal-container").addEventListener("click", event => {
  document.querySelector(".modal-container").classList.toggle("hidden");
  lastFocus.focus();
})

document.querySelector(".modal__close").addEventListener("click", event => {
  const form = document.querySelector("#book-form");
  form.reset();
  document.querySelector(".modal-container").classList.toggle("hidden");
  lastFocus.focus();
})

document.querySelector("#book-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const book = Book.fromFormData(formData);
  addBookToLibrary(book);
  form.reset();
  document.querySelector(".modal-container").classList.toggle("hidden");
  lastFocus.focus();
})