import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { inputChange, update, clearForm } from "../redux/itemSlice";
import { useParams, useNavigate } from "react-router-dom";
import { store } from "../redux/store";
import { Button } from "react-bootstrap";

const EditItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.totalItems);
  const handleChange = (e) => {
    dispatch(inputChange({ name: e.target.name, value: e.target.value }));
  };
  const clear = () => {
    store.dispatch(clearForm());
  };
  const back = () => {
    store.dispatch(clearForm());
    navigate("/shop");
  };
  const params = useParams();

  //Form Validation
  const [fnameTouched, setFnameTouched] = useState(false);
  const [lnameTouched, setLnameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [imageTouched, setImageTouched] = useState(false);

  const validFname = data.fname.trim() !== "";
  const validLname = data.lname.trim() !== "";
  let validEmail = data.email.trim() !== "";
  let validPhone = data.phone.trim() !== "";
  let validImage = data.image.trim() !== "";

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (emailRegex.test(data.email)) {
    validEmail = true;
  } else {
    validEmail = false;
  }

  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  if (phoneRegex.test(data.phone)) {
    validPhone = true;
  } else {
    validPhone = false;
  }
  const imageUrlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
  if (imageUrlRegex.test(data.image)) {
    validImage = true;
  } else {
    validImage = false;
  }

  const fNameInputIsInvalid = !validFname && fnameTouched;
  const lNameInputIsInvalid = !validLname && lnameTouched;
  const emailInputIsInvalid = !validEmail && emailTouched;
  const phoneInputIsInvalid = !validPhone && phoneTouched;
  const imageInputIsInvalid = !validImage && imageTouched;

  const fNameInputClass = !fNameInputIsInvalid
    ? "form-control"
    : "form-control invalid";
  const lNameInputClass = !lNameInputIsInvalid
    ? "form-control"
    : "form-control invalid";
  const imageInputClass = !imageInputIsInvalid
    ? "form-control"
    : "form-control invalid";
  const emailInputClass = !emailInputIsInvalid
    ? "form-control"
    : "form-control invalid";
  const phoneInputClass = !phoneInputIsInvalid
    ? "form-control"
    : "form-control invalid";

  const inputFnameBlurHandler = (e) => {
    setFnameTouched(true);
  };
  const inputLnameBlurHandler = (e) => {
    setLnameTouched(true);
  };
  const inputEmailBlurHandler = (e) => {
    setEmailTouched(true);
  };
  const inputPhoneBlurHandler = (e) => {
    setPhoneTouched(true);
  };
  const inputImageBlurHandler = (e) => {
    setImageTouched(true);
  };
  //Form Validation

  const onSubmit = (e) => {
    e.preventDefault();
    setFnameTouched(true);
    setLnameTouched(true);
    setEmailTouched(true);
    setPhoneTouched(true);
    setImageTouched(true);
    if (
      !validFname ||
      !validLname ||
      !validEmail ||
      !validPhone ||
      !validImage
    ) {
      return;
    }
    store.dispatch(
      update({
        id: params.id,
        fname: data.fname,
        lname: data.lname,
        phone: data.phone,
        email: data.email,
        image: data.image,
      })
    );
    store.dispatch(clearForm());
    setFnameTouched(false);
    setLnameTouched(false);
    setEmailTouched(false);
    setPhoneTouched(false);
    setImageTouched(false);
    navigate("/shop");
  };

  return (
    <>
      <h1>Edit User</h1>
      <div>
        <Button variant="light" className="btns" onClick={back}>
          Go Back &#11013;
        </Button>
      </div>
      <hr />
      <form onSubmit={onSubmit}>
        <div className="control-group">
          <div className={fNameInputClass}>
            <label htmlFor="name">User's First Name:</label>
            <input
              type="text"
              placeholder="First Name..."
              name="fname"
              value={data.fname}
              onBlur={inputFnameBlurHandler}
              onChange={handleChange}
            />
          </div>
          {fNameInputIsInvalid && (
            <p className="error-text">First Name cannot be empty!</p>
          )}
          <div className={lNameInputClass}>
            <label htmlFor="name">User's Last Name:</label>
            <input
              type="text"
              placeholder="Last Name..."
              name="lname"
              value={data.lname}
              onBlur={inputLnameBlurHandler}
              onChange={handleChange}
            />
          </div>
          {lNameInputIsInvalid && (
            <p className="error-text">Last Name cannot be empty!</p>
          )}
          <div className={phoneInputClass}>
            <label htmlFor="name">User's Phone No.:</label>
            <input
              type="text"
              placeholder="Phone Number..."
              name="phone"
              value={data.phone}
              onBlur={inputPhoneBlurHandler}
              onChange={handleChange}
            />
          </div>
          {phoneInputIsInvalid && (
            <p className="error-text">Please enter a valid Phone number!</p>
          )}
          <div className={emailInputClass}>
            <label htmlFor="name">User's E-mail Ad.:</label>
            <input
              type="text"
              placeholder="E-mail Address..."
              name="email"
              value={data.email}
              onBlur={inputEmailBlurHandler}
              onChange={handleChange}
            />
          </div>
          {emailInputIsInvalid && (
            <p className="error-text">Please enter a valid E-mail!</p>
          )}
          <div className={imageInputClass}>
            <label htmlFor="name">User's Photo Link:</label>
            <input
              type="text"
              placeholder="Image Link..."
              name="image"
              value={data.image}
              onBlur={inputImageBlurHandler}
              onChange={handleChange}
            />
          </div>
          {imageInputIsInvalid && (
            <p className="error-text">Please enter a valid Image URL!</p>
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

export default EditItem;
