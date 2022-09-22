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

const Book = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const add = () => {
    navigate("/book/add");
  };
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  // const bookCollectionRef = collection(db, "books");
  useEffect(() => {
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
    // eslint-disable-next-line
  }, []);

  const data = useSelector((state) => state.totalBooks);
  const getBooks = () => {
    dispatch(dataLoader(true));
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
        startAfter(data.lastDoc),
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

  return (
    <div>
      <h1>Book Page</h1>
      <div className="mb-2">
        <Button variant="light" onClick={add} className="btns">
          Add Book &#10011;
        </Button>{" "}
        <Button variant="dark edit" onClick={getBooks}>
          Refresh List
        </Button>
      </div>
      <hr />
      <>
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
                      </tbody>
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
                              style={{
                                marginLeft: "auto",
                                display: "flex",
                                marginRight: "auto",
                              }}
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
