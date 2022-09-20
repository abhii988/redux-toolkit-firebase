import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";

const ItemDetail = () => {
  const navigate = useNavigate();
  const data = useSelector((state) => state.totalItems.items);
  const params = useParams();
  const back = () => {
    navigate("/shop");
  };
  const found = data.find((element) => {
    return element.id === params.id;
  });
  return (
    <div>
      <h1>Details of the items are:</h1>
      <br />
      <div>
        <Button variant="light" className="btns" onClick={back}>
          Go Back &#11013;
        </Button>
      </div>
      <hr />
      <h2>User Id: {found.id}</h2>
      <h2>
        Name: {found.fname} {found.lname}
      </h2>
      <h2> DOB: {found.dob} </h2>
      <h2> Username: {found.username} </h2>
      <h2> password: {found.password} </h2>
      <h2> email: {found.email} </h2>
      <h2> phone: {found.phone} </h2>
      <h2>
        Address: {found.city}, {found.country}
      </h2>
      <h2>Image: </h2>
      <img src={found.image} alt="img" />
    </div>
  );
};

export default ItemDetail;
