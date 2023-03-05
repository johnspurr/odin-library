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

function addBookToLibrary(book, createElement) {
  myLibrary.push(book);

  renderLibrary();
}

function renderLibrary() {
  const addBook = document.querySelector(".add-book");
  let allBookNodes = [];
  for (const [index, book] of myLibrary.entries()) {
    const bookNode = createBookNode(book, index);
    allBookNodes.push(bookNode);
  }
  bookContainer.replaceChildren(...allBookNodes, addBook);
}

{/* <img src="images/close.svg" class="modal__close"> */}
function createBookNode(book, index) {
  const bookNode = document.createElement("div");
  bookNode.className = "book"

  bookNode.dataset.index = index ?? myLibrary.length;

  const closeNode = document.createElement("img");
  closeNode.className = "book__remove";
  closeNode.src = "images/close.svg";
  closeNode.addEventListener("click", event => {
    const book = event.target.parentElement;
    myLibrary.splice(book.dataset.index, 1);
    renderLibrary();
  })
  bookNode.appendChild(closeNode);

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
  addBookToLibrary(book, true);
  form.reset();
  document.querySelector(".modal-container").classList.toggle("hidden");
  lastFocus.focus();
})