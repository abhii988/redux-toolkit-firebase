import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import RouteSwitch from "./components/RouteSwitch";
import "bootstrap/dist/css/bootstrap.min.css";
// import { fetchData } from "./redux/actions";
// import { fetchData } from "./redux/itemSlice";
import { errors, fetchData } from "./redux/itemSlice";
import { fetchBooks } from "./redux/bookSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(errors(null));
    dispatch(fetchData());
    dispatch(fetchBooks()).catch((err) => {
      dispatch(errors(err.message));
    });
    // dispatch(fetchData()).catch((err) => {
    //   setError(err.message);
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div className="app">{<RouteSwitch></RouteSwitch>}</div>;
}

export default App;
