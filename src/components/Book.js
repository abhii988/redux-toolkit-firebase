import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import {
  bookCollectionRef,
  deleteBook,
  getAllBooks,
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
      query(bookCollectionRef, orderBy("title", "asc"), limit(4)),
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
    // document.body.style.overflow = "hidden";
    bookSnap();
    // return () => (document.body.style.overflow = "auto");
    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

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
    setLoading(false);
    if (nextData.size === 0) {
      setIsEmpty(true);
      return;
    }
    dispatch(submit(...book));
  };
  //Scroll Code
  // const [last, setLast] = useState(0);
  const [allBooks, setAllBooks] = useState("");
  // const allBook = async () => {
  //   const response = await onSnapshot(bookCollectionRef, (book) => {
  //     const newBook = book.docs.map((doc) => {
  //       dispatch(setLastDoc(book.docs[book.docs.length - 1]));
  //       return {
  //         id: doc.id,
  //         title: doc.data().title,
  //         status: doc.data().status,
  //         url: doc.data().url,
  //         author: doc.data().author,
  //       };
  //     });
  //     setAllBooks([...newBook]);
  //   });
  //   return response;
  // };
  const allBook = async () => {
    const response = await getAllBooks().then((responseData) => {
      return responseData?.docs?.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        author: doc.data().author,
        status: doc.data().status,
        url: doc.data().url,
      }));
    });
    setAllBooks(response);
  };
  const handleScroll = (event) => {
    allBook();
    // console.log("scrolled");
    // console.log("scrollTop: ", event.currentTarget.scrollTop);
    // console.log("offsetHeight: ", event.currentTarget.offsetHeight);
    // console.log("scrollHeight", event.currentTarget.scrollHeight);
    // setLast(
    //   event.currentTarget.scrollHeight -
    //     (event.currentTarget.clientHeight +
    //       Math.ceil(event.currentTarget.scrollTop))
    // );
    // setTotal(event.currentTarget.offsetHeight + event.currentTarget.scrollTop);
    const total =
      event.currentTarget.offsetHeight + event.currentTarget.scrollTop;
    if (allBooks.length !== data.books.length && !loading) {
      // if (!loading || !isEmpty) {
      // if (last < 1) {
      if (Math.ceil(total) >= event.currentTarget.scrollHeight) {
        // console.log("allBooks.length", allBooks.length);
        //     console.log("data.books.length", data.books.length);
        fetchMore();
        // setLast(0);
        // return;
      } else {
        return;
      }
    } else {
      return;
    }
  };
  //Scroll
  const goToTop = (e) => {
    document.getElementById("books").scrollTop = 0;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
    <div>
      <div className="bookContainer" id="books" onScroll={handleScroll}>
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
                    // <div className="loader">Loading...</div>
                    <>
                      <Table striped hover size="sm" className="scroll">
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
                                      // style={{ size: "10px" }}
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
                        // <h5 style={{ textAlign: "center" }}>
                        //   No more data to load.
                        // </h5>
                        <div />
                      ) : (
                        <>
                          {loading ? (
                            // <div className="loader_mini">Loading...</div>
                            <div className="loader_mini" />
                          ) : (
                            <div />
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <h1 style={{ textAlign: "centre", display: "block" }}>
                  no data
                </h1>
              )}
            </>
          ) : (
            <h1 style={{ textAlign: "centre", display: "block" }}>
              {data.errorMessage}
            </h1>
          )}
        </>
      </div>
      {data.books.length > 0 ? (
        <div id="bottom">
          <br />
          <br />
          <p>No more data to load.</p>
          Click <Button onClick={goToTop}>Here</Button> to go to top.
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default Book;
