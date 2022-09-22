import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import RouteSwitch from "./components/RouteSwitch";
import "bootstrap/dist/css/bootstrap.min.css";
import { errors, fetchData } from "./redux/itemSlice";
import { bookErrors } from "./redux/bookSlice";
// import { bookErrors, setLastDoc, snap } from "./redux/bookSlice";
// import { limit, onSnapshot, orderBy, query } from "firebase/firestore";
// import { bookCollectionRef } from "./services/book.services";

function App() {
  const dispatch = useDispatch();
  // onSnapshot(
  //   query(bookCollectionRef, orderBy("title", "asc"), limit(1)),
  //   (book) => {
  //     setLastDoc(book.docs[book.docs.length - 1]);
  //     const newBook = book.docs.map((doc) => {
  //       return {
  //         id: doc.id,
  //         title: doc.data().title,
  //         status: doc.data().status,
  //         url: doc.data().url,
  //         author: doc.data().author,
  //       };
  //     });
  //     dispatch(snap(newBook));
  //   }
  // );
  useEffect(() => {
    dispatch(bookErrors(null));
    dispatch(errors(null));
    dispatch(fetchData());
    // dispatch(fetchData()).catch((err) => {
    //   setError(err.message);
    // });
    // eslint-disable-next-line
  }, []);
  return <div className="app">{<RouteSwitch></RouteSwitch>}</div>;
}

export default App;
