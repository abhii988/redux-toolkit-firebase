import React, { useEffect } from "react";
// import { onSnapshot } from "firebase/firestore";
import { Table, Button } from "react-bootstrap";
import {
  // bookCollectionRef,
  deleteBook,
  // getAllBooks,
  getBook,
} from "../services/book.services";
import { useDispatch, useSelector } from "react-redux";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase-config";
import {
  fetchBooks,
  dataLoader,
  errors,
  delBook,
  editBook,
  // snap,
} from "../redux/bookSlice";
import { useNavigate } from "react-router-dom";

const Book = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const add = () => {
    navigate("/book/add");
  };
  useEffect(() => {
    dispatch(errors(null));
    // onSnapshot(bookCollectionRef, (book) =>
    //   dispatch(snap(book.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
    // );
    dispatch(fetchBooks()).catch((err) => {
      dispatch(errors(err.message));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const data = useSelector((state) => state.totalBooks);
  const getBooks = () => {
    dispatch(dataLoader(true));
    dispatch(fetchBooks()).catch((err) => {
      dispatch(errors(err.message));
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
  return (
    <div>
      <h1>Book Page</h1>

      <hr />
      {/* <h2>This is the book page!</h2> */}
      <>
        <div className="mb-2">
          <Button variant="light" onClick={add} className="btns">
            Add Book &#10011;
          </Button>{" "}
          <Button variant="dark edit" onClick={getBooks}>
            Refresh List
          </Button>
        </div>
        {data.errorMessage === null ? (
          <>
            {data.books.length > 0 ? (
              <>
                {data.isLoading ? (
                  <div className="loader" />
                ) : (
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
                          <tr key={book.id}>
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
