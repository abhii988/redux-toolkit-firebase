import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { inputChange, submit, clearForm } from "../redux/itemSlice";
import { useNavigate } from "react-router-dom";
import { store } from "../redux/store";
import { Button } from "react-bootstrap";

const AddItem = () => {
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
    dispatch(clearForm());
    navigate("/shop");
  };
  //Form Validation
  const [fnameTouched, setFnameTouched] = useState(false);
  const [lnameTouched, setLnameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [imageTouched, setImageTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [dobTouched, setDobTouched] = useState(false);
  const [cityTouched, setCityTouched] = useState(false);
  const [countryTouched, setCountryTouched] = useState(false);

  const validFname = data.fname.trim() !== "";
  const validLname = data.lname.trim() !== "";
  let validEmail = data.email.trim() !== "";
  let validPhone = data.phone.trim() !== "";
  let validImage = data.image.trim() !== "";
  const validUsername = data.username.trim() !== "";
  let validPassword = data.password.trim() !== "";
  let validDob = data.dob.trim() !== "";
  const validCity = data.city.trim() !== "";
  const validCountry = data.country.trim() !== "";

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
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (passwordRegex.test(data.password)) {
    validPassword = true;
  } else {
    validPassword = false;
  }
  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dobRegex.test(data.dob)) {
    validDob = true;
  } else {
    validDob = false;
  }
  const fNameInputIsInvalid = !validFname && fnameTouched;
  const lNameInputIsInvalid = !validLname && lnameTouched;
  const emailInputIsInvalid = !validEmail && emailTouched;
  const phoneInputIsInvalid = !validPhone && phoneTouched;
  const imageInputIsInvalid = !validImage && imageTouched;
  const usernameInputIsInvalid = !validUsername && usernameTouched;
  const passwordInputIsInvalid = !validPassword && passwordTouched;
  const dobInputIsInvalid = !validDob && dobTouched;
  const cityInputIsInvalid = !validCity && cityTouched;
  const countryInputIsInvalid = !validCountry && countryTouched;

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
  const usernameInputClass = !usernameInputIsInvalid
    ? "form-control"
    : "form-control invalid";
  const passwordInputClass = !passwordInputIsInvalid
    ? "form-control"
    : "form-control invalid";
  const dobInputClass = !dobInputIsInvalid
    ? "form-control"
    : "form-control invalid";
  const cityInputClass = !cityInputIsInvalid
    ? "form-control"
    : "form-control invalid";
  const countryInputClass = !countryInputIsInvalid
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
  const inputUsernameBlurHandler = (e) => {
    setUsernameTouched(true);
  };
  const inputPasswordBlurHandler = (e) => {
    setPasswordTouched(true);
  };
  const inputDobBlurHandler = (e) => {
    setDobTouched(true);
  };
  const inputCityBlurHandler = (e) => {
    setCityTouched(true);
  };
  const inputCountryBlurHandler = (e) => {
    setCountryTouched(true);
  };
  //Form Validation

  const onSubmit = (e) => {
    e.preventDefault();
    setFnameTouched(true);
    setLnameTouched(true);
    setEmailTouched(true);
    setPhoneTouched(true);
    setImageTouched(true);
    setUsernameTouched(true);
    setPasswordTouched(true);
    setDobTouched(true);
    setCityTouched(true);
    setCountryTouched(true);
    if (
      !validFname ||
      !validLname ||
      !validEmail ||
      !validPhone ||
      !validImage ||
      !validUsername ||
      !validPassword ||
      !validDob ||
      !validCity ||
      !validCountry
    ) {
      return;
    }
    var date = Math.random(Date.now());
    store.dispatch(
      submit({
        id: date.toString(),
        dob: data.dob,
        username: data.username,
        password: data.password,
        fname: data.fname,
        lname: data.lname,
        email: data.email,
        phone: data.phone,
        city: data.city,
        country: data.country,
        image: data.image,
      })
    );
    store.dispatch(clearForm());
    setFnameTouched(false);
    setLnameTouched(false);
    setEmailTouched(false);
    setPhoneTouched(false);
    setImageTouched(false);
    setUsernameTouched(false);
    setPasswordTouched(false);
    setDobTouched(false);
    setCityTouched(false);
    setCountryTouched(false);
    navigate("/shop");
  };

  return (
    <>
      <h1>Add User</h1>
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
            <p className="error-text">
              Please enter a valid 10 digits Phone number!
            </p>
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
            <p className="error-text">
              Please enter a valid E-mail (example@email.com)!
            </p>
          )}
          <div className={dobInputClass}>
            <label htmlFor="name">User's Birth Date: </label>
            <input
              type="text"
              placeholder="Date of Birth..."
              name="dob"
              value={data.dob}
              onBlur={inputDobBlurHandler}
              onChange={handleChange}
            />
          </div>
          {dobInputIsInvalid && (
            <p className="error-text">
              Please enter a valid Date of Birth (YYYY-MM-DD)!
            </p>
          )}
          <div className={usernameInputClass}>
            <label htmlFor="name">User's Username: </label>
            <input
              type="text"
              placeholder="Username..."
              name="username"
              value={data.username}
              onBlur={inputUsernameBlurHandler}
              onChange={handleChange}
            />
          </div>
          {usernameInputIsInvalid && (
            <p className="error-text">Username cannot be empty!</p>
          )}
          <div className={passwordInputClass}>
            <label htmlFor="name">User's Password: </label>
            <input
              type="text"
              placeholder="Password..."
              name="password"
              value={data.password}
              onBlur={inputPasswordBlurHandler}
              onChange={handleChange}
            />
          </div>
          {passwordInputIsInvalid && (
            <p className="error-text">
              Please enter a valid Password (must contain at least 8 digits and
              a number)!
            </p>
          )}
          <div className={imageInputClass}>
            <label htmlFor="name">User's Photo Link:</label>
            <input
              type="text"
              placeholder="Photo Link..."
              name="image"
              value={data.image}
              onBlur={inputImageBlurHandler}
              onChange={handleChange}
            />
          </div>
          {imageInputIsInvalid && (
            <p className="error-text">
              Please enter a valid Image URL (must be proper https URL)!
            </p>
          )}
          <div className={cityInputClass}>
            <label htmlFor="name">User's City/State:</label>
            <input
              type="text"
              placeholder="Current City..."
              name="city"
              value={data.city}
              onBlur={inputCityBlurHandler}
              onChange={handleChange}
            />
          </div>
          {cityInputIsInvalid && (
            <p className="error-text">City cannot be empty!</p>
          )}
          <div className={countryInputClass}>
            <label htmlFor="name">User's Country: </label>
            <input
              type="text"
              placeholder="Current Country..."
              name="country"
              value={data.country}
              onBlur={inputCountryBlurHandler}
              onChange={handleChange}
            />
          </div>
          {countryInputIsInvalid && (
            <p className="error-text">Country cannot be empty!</p>
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

export default AddItem;
