import React from "react";
import { Button } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

const Nav = ({ Logout }) => {
  // const user = localStorage.getItem("username");
  const navStyle = {
    color: "whitesmoke",
    textDecoration: "none",
  };
  return (
    <>
      <nav>
        <NavLink activeclassname="active" style={navStyle} to="/">
          <h3>Logo</h3>
        </NavLink>
        <ul className="nav-links">
          <NavLink activeclassname="active" style={navStyle} to="/book">
            <li>Books</li>
          </NavLink>
          <NavLink activeclassname="active" style={navStyle} to="/shop">
            <li>Users</li>
          </NavLink>
          <NavLink activeclassname="active" style={navStyle} to={`/dashboard`}>
            <li>Dashboard</li>
          </NavLink>
          <NavLink activeclassname="active" style={navStyle} to={`/profile`}>
            <li>Profile</li>
          </NavLink>
          <li>
            <Button variant="outline-light" value="LOGOUT" onClick={Logout}>
              Logout
            </Button>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Nav;
