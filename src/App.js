import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import RouteSwitch from "./components/RouteSwitch";
import "bootstrap/dist/css/bootstrap.min.css";
// import { fetchData } from "./redux/actions";
// import { fetchData } from "./redux/itemSlice";
import { fetchData } from "./redux/itemSlice";
import { errors, snap } from "./redux/bookSlice";
import { onSnapshot } from "firebase/firestore";
import { bookCollectionRef } from "./services/book.services";

function App() {
  const dispatch = useDispatch();
  onSnapshot(bookCollectionRef, (book) => {
    const newBook = book.docs.map((doc) => {
      return {
        id: doc.id,
        title: doc.data().title,
        status: doc.data().status,
        url: doc.data().url,
        author: doc.data().author,
      };
    });
    dispatch(snap(newBook)).catch((err) => {
      dispatch(errors(err.message));
    });
  });
  useEffect(() => {
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
