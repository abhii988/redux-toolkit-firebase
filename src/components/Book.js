import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import {
  bookCollectionRef,
  deleteBook,
  getBook,
} from "../services/book.services";
import { useDispatch, useSelector } from "react-redux";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase-config";
import {
  fetchBooks,
  dataLoader,
  bookErrors,
  delBook,
  editBook,
  setLastDoc,
  snap,
  submit,
} from "../redux/bookSlice";
import { useNavigate } from "react-router-dom";
import {
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import CountBooks from "./CountBooks";

const Book = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const add = () => {
    navigate("/book/add");
  };
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  // const bookCollectionRef = collection(db, "books");
  const bookSnap = () => {
    onSnapshot(
      query(bookCollectionRef, orderBy("title", "asc"), limit(1)),
      (book) => {
        const newBook = book.docs.map((doc) => {
          dispatch(setLastDoc(book.docs[book.docs.length - 1]));
          return {
            id: doc.id,
            title: doc.data().title,
            status: doc.data().status,
            url: doc.data().url,
            author: doc.data().author,
          };
        });
        dispatch(snap(newBook));
      }
    );
  };

  useEffect(() => {
    bookSnap();
    // eslint-disable-next-line
  }, []);

  const data = useSelector((state) => state.totalBooks);
  const getBooks = () => {
    dispatch(dataLoader(true));
    dispatch(setLastDoc(""));
    setIsEmpty(true);
    dispatch(fetchBooks()).catch((err) => {
      dispatch(bookErrors(err.message));
    });
  };
  const handleEdit = (book) => {
    dispatch(editBook(book));
    navigate(`/book/edit/${book.id}`);
  };
  const deleteHandler = async (id) => {
    dispatch(delBook({ id: id }));
    const docSnap = await getBook(id);
    const desertRef = ref(storage, docSnap.data().url);
    deleteObject(desertRef);
    await deleteBook(id);
  };

  const fetchMore = async () => {
    setLoading(true);
    const nextData = await getDocs(
      query(
        bookCollectionRef,
        orderBy("title", "asc"),
        startAfter(data.lastDoc || 0),
        limit(1)
      )
    );
    const book = nextData.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    dispatch(setLastDoc(nextData.docs[nextData.docs.length - 1]));
    // console.log("book", book);
    // console.log("nextData", nextData);
    // console.log("nextData id", nextData.size);
    setLoading(false);
    if (nextData.size === 0) {
      setIsEmpty(true);
      console.log("no data found");
      return;
    }
    dispatch(submit(...book));
  };
  //Search Code
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const searchBooks = (searchValue) => {
    getBooks();
    setSearchInput(searchValue);
    if (searchValue !== "") {
      const filteredData = data.books.filter((book) => {
        return Object.values(book)
          .join("")
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilteredResults(filteredData);
    } else {
      console.log(filteredResults, "filteredResults");
      setFilteredResults([]);
      setFilteredResults(data.books);
    }
  };
  //Search
  return (
    <div className="bookContainer">
      <h1>Book Page</h1>
      <div className="mb-2">
        <Button variant="dark" className="btns" onClick={getBooks}>
          Refresh List &#9850;
        </Button>{" "}
        <Button variant="light" onClick={add} className="btns">
          Add Book &#10011;
        </Button>
      </div>
      <hr />
      <>
        <div className="control-group">
          <div className="form-control">
            <CountBooks
              count={
                filteredResults && searchInput === ""
                  ? data.books.length
                  : filteredResults.length
              }
            />
            <input
              icon="search"
              placeholder="Search..."
              onChange={(e) => searchBooks(e.target.value)}
              id="search"
            />
          </div>
        </div>
        <br />
        {data.errorMessage === null ? (
          <>
            {data.books.length > 0 ? (
              <>
                {data.isLoading ? (
                  <div className="loader" />
                ) : (
                  <>
                    <Table striped hover size="sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Book Title</th>
                          <th>Book Author</th>
                          <th>Image</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchInput.length > 0 ? (
                          filteredResults.map((book, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>
                                  <img
                                    src={book.url}
                                    alt="img.jpg"
                                    width="100"
                                    height="100"
                                    style={{ width: "100px", height: "100px" }}
                                  />
                                </td>
                                <td>{book.status}</td>
                                <td>
                                  <Button
                                    variant="secondary"
                                    className="edit action_btn"
                                    onClick={(e) => handleEdit(book)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="danger"
                                    className="delete action_btn"
                                    onClick={(e) => deleteHandler(book.id)}
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <>
                            {data.books.map((book, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{book.title}</td>
                                  <td>{book.author}</td>
                                  <td>
                                    <img
                                      src={book.url}
                                      alt="img.jpg"
                                      width="100"
                                      height="100"
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                      }}
                                    />
                                  </td>
                                  <td>{book.status}</td>
                                  <td>
                                    <Button
                                      variant="secondary"
                                      className="edit action_btn"
                                      onClick={(e) => handleEdit(book)}
                                      // style={{ backgroundColor: "#717981" }}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="danger"
                                      className="delete action_btn"
                                      onClick={(e) => deleteHandler(book.id)}
                                      // style={{ backgroundColor: "#DC3545" }}
                                    >
                                      Delete
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </>
                        )}
                      </tbody>
                      {/* <tbody>
                        {data.books.map((book, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{book.title}</td>
                              <td>{book.author}</td>
                              <td>
                                <img
                                  src={book.url}
                                  alt="img.jpg"
                                  width="100"
                                  height="100"
                                  style={{ width: "100px", height: "100px" }}
                                />
                              </td>
                              <td>{book.status}</td>
                              <td>
                                <Button
                                  variant="secondary"
                                  className="edit"
                                  onClick={(e) => handleEdit(book)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  className="delete"
                                  onClick={(e) => deleteHandler(book.id)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody> */}
                    </Table>
                    {isEmpty ? (
                      <h5
                        style={{
                          textAlign: "center",
                        }}
                      >
                        No more data to load.
                      </h5>
                    ) : (
                      <>
                        {loading ? (
                          <div className="loader_mini" />
                        ) : (
                          <div className="">
                            <Button
                              className="load-more"
                              // style={{
                              //   marginLeft: "auto",
                              //   display: "flex",
                              //   marginRight: "auto",
                              // }}
                              onClick={fetchMore}
                            >
                              More
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <h1 style={{ textAlign: "centre", display: "block" }}>no data</h1>
            )}
          </>
        ) : (
          <h1 style={{ textAlign: "centre", display: "block" }}>
            {data.errorMessage}
          </h1>
        )}
      </>
    </div>
  );
};

export default Book;
