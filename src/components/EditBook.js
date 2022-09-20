import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  inputChange,
  clearForm,
  changeBook,
  dataLoader,
} from "../redux/bookSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Button, ButtonGroup } from "react-bootstrap";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase-config";
import { getBook, updateBook } from "../services/book.services";
const EditBook = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [stat, setStat] = useState("Available");
  const [flag, setFlag] = useState(true);
  const data = useSelector((state) => state.totalBooks);
  const [imageUpload, setImageUpload] = useState("");
  // const [imgUrl, setImgUrl] = useState("");
  const clearImage = useRef();
  const params = useParams();

  const handleChange = (e) => {
    dispatch(inputChange({ name: "status", value: stat }));
    dispatch(inputChange({ name: e.target.name, value: e.target.value }));
  };
  const imageHandler = (e) => {
    setImageUpload(e.target.files[0]);
  };
  const reset = () => {
    clearImage.current.value = "";
  };
  const clear = () => {
    reset();
    setImageUpload("");
    dispatch(clearForm());
  };
  const back = () => {
    dispatch(clearForm());
    navigate("/book");
  };

  //Form Validation
  const [authorTouched, setAuthorTouched] = useState(false);
  const [titleTouched, setTitleTouched] = useState(false);

  const validTitle = data.title.trim() !== "";
  const validAuthor = data.author.trim() !== "";

  const titleIsInvalid = !validTitle && titleTouched;
  const authorIsInvalid = !validAuthor && authorTouched;

  const titleInputClass = !titleIsInvalid
    ? "form-control"
    : "form-control invalid";
  const authorInputClass = !authorIsInvalid
    ? "form-control"
    : "form-control invalid";
  const titleBlurHandler = (e) => {
    setTitleTouched(true);
  };
  const authorBlurHandler = (e) => {
    setAuthorTouched(true);
  };
  // console.log("non-edited book data", data);
  // console.log(stat);

  //Form Validation
  const onSubmit = async (e) => {
    e.preventDefault();
    setTitleTouched(true);
    setAuthorTouched(true);
    if (!validAuthor || !validTitle) {
      return;
    }
    if (imageUpload !== "") {
      const imageRef = ref(
        storage,
        `images/${Math.random(Date.now()) + imageUpload.name}`
      );
      const docSnap = await getBook(params.id);
      const desertRef = ref(storage, docSnap.data().url);
      deleteObject(desertRef);
      await uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          const newBook = {
            title: data.title,
            status: stat,
            url: url,
            author: data.author,
          };
          updateBook(params.id, newBook);
          // console.log("If image is changed");
          // console.log("params.id:", params.id);
          // console.log("data.title:", data.title);
          // console.log("stat:", data.status);
          // console.log("url:", url);
          // console.log("data.author:", data.author);
          dispatch(
            changeBook({
              id: params.id,
              ...newBook,
            })
          );
        });
      });
    } else {
      const newBook = {
        title: data.title,
        status: stat,
        url: data.url,
        author: data.author,
      };
      updateBook(params.id, newBook);
      // console.log("If image is not changed");
      // console.log("params.id:", params.id);
      // console.log("data.title:", data.title);
      // console.log("stat:", data.status);
      // console.log("url:", data.url);
      // console.log("data.author:", data.author);
      dispatch(
        changeBook({
          id: params.id,
          ...newBook,
        })
      );
    }
    clear();
    dispatch(dataLoader(true));
    setTitleTouched(false);
    setAuthorTouched(false);
    navigate("/book");
  };

  return (
    <>
      <h1>Edit Book</h1>
      <div>
        <Button variant="light" className="btns" onClick={back}>
          Go Back &#11013;
        </Button>
      </div>
      <hr />
      <form onSubmit={onSubmit}>
        <div className="control-group">
          <div className={titleInputClass}>
            <label htmlFor="name">Book Title:</label>
            <input
              type="text"
              placeholder="Book Name..."
              name="title"
              value={data.title}
              onBlur={titleBlurHandler}
              onChange={handleChange}
            />
          </div>
          {titleIsInvalid && (
            <p className="error-text">Title cannot be empty!</p>
          )}
          <div className={authorInputClass}>
            <label htmlFor="name">Book Author:</label>
            <input
              type="text"
              placeholder="First Name..."
              name="author"
              value={data.author}
              onBlur={authorBlurHandler}
              onChange={handleChange}
            />
          </div>
          {authorIsInvalid && (
            <p className="error-text">Author cannot be empty!</p>
          )}
          <div className="form-control">
            <label htmlFor="name">Book Availability:</label>

            <ButtonGroup aria-label="Basic example" onChange={handleChange}>
              <Button
                disabled={flag}
                variant="success"
                name="status"
                value={data.status}
                onClick={(e) => {
                  setStat("Available");
                  setFlag(true);
                }}
              >
                Available
              </Button>
              <Button
                variant="danger"
                disabled={!flag}
                name="status"
                value={data.status}
                onChange={handleChange}
                onClick={(e) => {
                  setStat("Not Available");
                  setFlag(false);
                }}
              >
                Not Available
              </Button>
            </ButtonGroup>

            {/* <Form.Group controlId="formFile" className="mb-3">
              <Form.Control
                type="file"
                size="sm"
                onChange={imageHandler}
                ref={clearImage}
              />
            </Form.Group> */}
          </div>
          <div className="form-control">
            <label>Upload Image of the Book:</label>
            <input
              type="file"
              id="myfile"
              name="myfile"
              onChange={imageHandler}
              ref={clearImage}
            />
            <p className="error-text">
              Choose a new image to update or existing image will be kept.
            </p>
          </div>

          <div>
            <Button
              className="btns"
              variant="outline-light"
              type="submit"
              style={{ fontSize: "18px" }}
            >
              Submit
            </Button>{" "}
            <Button
              className="btns"
              variant="outline-light"
              type="reset"
              value="Reset"
              onClick={clear}
              style={{ fontSize: "18px" }}
            >
              Clear Form
            </Button>
          </div>
        </div>
      </form>
      <hr />
    </>
  );
};

export default EditBook;
