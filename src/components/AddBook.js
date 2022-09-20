import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { inputChange, submit, clearForm, dataLoader } from "../redux/bookSlice";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup } from "react-bootstrap";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-config";
import { addBooks } from "../services/book.services";
const AddBook = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [stat, setStat] = useState("Available");
  const [flag, setFlag] = useState(true);
  const data = useSelector((state) => state.totalBooks);
  const [imageUpload, setImageUpload] = useState("");
  // const [imgUrl, setImgUrl] = useState("");
  const clearImage = useRef();

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
    setImageUpload(null);
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
  const validImage = imageUpload !== null;

  const titleIsInvalid = !validTitle && titleTouched;
  const authorIsInvalid = !validAuthor && authorTouched;
  const imageIsInvalid = !validImage;

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
  //Form Validation
  const onSubmit = async (e) => {
    e.preventDefault();
    setTitleTouched(true);
    setAuthorTouched(true);
    if (!validAuthor || !validTitle) {
      return;
    }
    if (imageUpload === "") {
      setImageUpload(null);
      return;
    }

    const imageRef = ref(
      storage,
      `images/${Math.random(Date.now()) + imageUpload.name}`
    );
    await uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        // setImgUrl(url);
        var date = Math.random(Date.now());
        const newBook = {
          title: data.title,
          status: stat,
          url: url,
          author: data.author,
        };
        addBooks(newBook);
        dispatch(submit({ id: date.toString(), ...newBook }));
      });
    });

    clear();
    dispatch(dataLoader(true));
    setTitleTouched(false);
    setAuthorTouched(false);
    navigate("/book");
  };

  return (
    <>
      <h1>Add Book</h1>
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
                onChange={handleChange}
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
          </div>
          {imageIsInvalid && (
            <p className="error-text">Please choose an image to upload!</p>
          )}
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

export default AddBook;
