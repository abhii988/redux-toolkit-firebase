import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
const adminUser = [
  { email: "admin@admin.co", password: "admin123" },
  { email: "admin2@ad.co", password: "admin123" },
  { email: "gupta.abhishek988@gmail.com", password: "admin123" },
];

const Login = ({ auth, setAuth }) => {
  //Login Details
  const [details, setDetails] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const LoginInfo = (details) => {
    const userCheck = adminUser.find(
      (user) =>
        user.email === details.email && user.password === details.password
    );

    if (userCheck) {
      setAuth(true);
      setUser({ name: details.name, password: details.password });
    } else {
      setAuth(false);
      setError("Details do not match!");
    }
  };

  //Form Validation(Regex, onBlur, isTouched)
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const validName = details.name.trim() !== "";

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  let validEmail = details.email.trim() !== "";
  if (emailRegex.test(details.email)) {
    validEmail = true;
  } else {
    validEmail = false;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  let validPassword = details.password.trim() !== "";
  if (passwordRegex.test(details.password)) {
    validPassword = true;
  } else {
    validPassword = false;
  }

  const nameInputIsInvalid = !validName && nameTouched;
  const emailInputIsInvalid = !validEmail && emailTouched;
  const passwordInputIsInvalid = !validPassword && passwordTouched;

  const nameInputClass = !nameInputIsInvalid ? "" : "invalid";
  const emailInputClass = !emailInputIsInvalid ? "" : "invalid";
  const passwordInputClass = !passwordInputIsInvalid ? "" : "invalid";

  useEffect(() => {
    localStorage.setItem("username", details.name);
  }, [details.name]);

  const inputNameBlurHandler = (e) => {
    setNameTouched(true);
  };
  const inputEmailBlurHandler = (e) => {
    setEmailTouched(true);
  };
  const inputPasswordBlurHandler = (e) => {
    setPasswordTouched(true);
  };

  //Form Input change and submit handler
  const changeHandler = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    if (!validName || !validEmail || !validPassword) {
      // setError("Details do not match!");
      return error;
    }
    LoginInfo(details);
    // navigate(`/profile/${details.name}`);
    navigate("/");
  };

  return (
    <div>
      {user.email !== "" ? (
        navigate(`/profile/${details.name}`)
      ) : (
        <div className="wrapper fadeInDown">
          <div id="formContent">
            <div className="fadeIn first">
              <img
                src="https://thumbs.dreamstime.com/b/user-icon-trendy-flat-style-isolated-grey-background-user-symbol-user-icon-trendy-flat-style-isolated-grey-background-123663211.jpg"
                id="icon"
                alt="User Icon"
              />
              {error !== "" ? (
                <div className="error" style={{ color: "red" }}>
                  {error}
                </div>
              ) : (
                ""
              )}
            </div>
            <form onSubmit={handleSubmit}>
              <div className={nameInputClass}>
                <input
                  type="text"
                  id="name"
                  className="fadeIn first"
                  name="name"
                  placeholder="Name"
                  value={details.name}
                  onBlur={inputNameBlurHandler}
                  onChange={changeHandler}
                />
              </div>
              {nameInputIsInvalid && (
                <p className="error-text">Name cannot be empty</p>
              )}
              <div className={emailInputClass}>
                <input
                  type="text"
                  id="login"
                  className="fadeIn second"
                  name="email"
                  placeholder="Email"
                  value={details.email}
                  onBlur={inputEmailBlurHandler}
                  onChange={changeHandler}
                />
              </div>
              {emailInputIsInvalid && (
                <p className="error-text">Please enter a valid E-mail</p>
              )}
              <div className={passwordInputClass}>
                <input
                  type="password"
                  id="password"
                  className="fadeIn third"
                  name="password"
                  placeholder="Password"
                  value={details.password}
                  onBlur={inputPasswordBlurHandler}
                  onChange={changeHandler}
                />
              </div>
              {passwordInputIsInvalid && (
                <p className="error-text">Please enter a valid Password.</p>
              )}
              <input type="submit" className="fadeIn fourth" value="Login" />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Login;

// import React, { useState } from "react";
// import "./Login.css";

// const users = [
//   {
//     email: "aa",
//     password: "aa",
//   },
//   {
//     email: "admin2",
//     password: "012345678",
//   },
// ];

// const Login = () => {
//   const [auth, setAuth] = useState(false);
//   const [data, setData] = useState({ email: "", password: "" });
//   const changeHandler = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     checkUser();
//   };

//   const checkUser = () => {
//     const userCheck = users.find(
//       (user) => user.email === data.email && user.password === data.password
//     );
//     if (userCheck) {
//       setAuth(true);
//       console.log("Login successful");
//     } else {
//       setAuth(false);
//       console.log("Wrong password or email");
//     }
//     console.log("data", data);
//     console.log("auth", auth);
//   };

//   return (
//     <div className="wrapper fadeInDown">
//       <div id="formContent">
//         <div className="fadeIn first">
//           <img
//             src="https://thumbs.dreamstime.com/b/user-icon-trendy-flat-style-isolated-grey-background-user-symbol-user-icon-trendy-flat-style-isolated-grey-background-123663211.jpg"
//             id="icon"
//             alt="User Icon"
//           />
//         </div>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             id="login"
//             className="fadeIn second"
//             name="email"
//             placeholder="login"
//             value={data.email}
//             onChange={changeHandler}
//           />
//           <input
//             type="password"
//             id="password"
//             className="fadeIn third"
//             name="password"
//             placeholder="password"
//             value={data.password}
//             onChange={changeHandler}
//           />
//           <input type="submit" className="fadeIn fourth" value="Log In" />
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
