import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  // deleteBook,
  getAllBooks,
  // getBook,
  // addBooks,
  // updateBook,
} from "../services/book.services";

export const fetchBooks = createAsyncThunk("book/fetchData", async () => {
  const response = await getAllBooks().then((responseData) => {
    return responseData?.docs?.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      author: doc.data().author,
      status: doc.data().status,
      url: doc.data().url,
    }));
  });
  return response;
});

const bookSlice = createSlice({
  name: "totalBooks",
  initialState: {
    id: "",
    title: "",
    author: "",
    status: "",
    url: "",
    books: [],
    isEdit: false,
    isLoading: false,
    errorMessage: "",
  },
  reducers: {
    inputChange: (state, action) => {
      state[action.payload.name] = action.payload.value;
      // state.data.status = action.payload.status;
    },
    snap: (state, action) => {
      // console.log(action.payload, "payload");
      state.books = [...action.payload];
      state.isLoading = false;
    },
    submit: (state, action) => {
      state.books = [...state.books, action.payload];
      // const newBook = { ...action.payload };
      // addBooks(newBook);
    },
    editBook: (state, action) => {
      state.isEdit = true;
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.author = action.payload.author;
      state.status = action.payload.status;
      state.url = action.payload.url;
    },
    changeBook: (state, action) => {
      state.books = state.books.map((book) =>
        book.id === action.payload.id
          ? {
              ...book,
              title: action.payload.title,
              author: action.payload.author,
              status: action.payload.status,
              url: action.payload.url,
            }
          : book
      );
      // updateBook(action.payload.id, action.payload);
    },
    delBook: (state, action) => {
      state.books = state.books.filter((book) => book.id !== action.payload.id);
    },
    clearForm: (state) => {
      state.id = "";
      state.title = "";
      state.author = "";
      state.status = "";
      state.url = "";
    },
    dataLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    errors: (state, action) => {
      state.errorMessage = action.payload;
    },
  },

  extraReducers: {
    [fetchBooks.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchBooks.fulfilled]: (state, action) => {
      state.isLoading = false;
      // console.log(action.payload, "payload");
      state.books = [...action.payload];
      // state.books = action.payload.concat(state.books);
    },
    [fetchBooks.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  inputChange,
  snap,
  submit,
  editBook,
  changeBook,
  delBook,
  dataLoader,
  errors,
  clearForm,
} = bookSlice.actions;
export default bookSlice.reducer;
