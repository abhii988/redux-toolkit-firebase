import React from "react";
import { Button } from "react-bootstrap";

const Profile = ({ Logout }) => {
  // const { user } = useParams();
  return (
    <div>
      <div className="welcome">
        <h2>
          Welcome,&nbsp;
          <span> {localStorage.getItem("username")}</span>
        </h2>
        <Button variant="outline- light" onClick={Logout} className="btns">
          LOGOUT
        </Button>
        <hr />
      </div>
    </div>
  );
};

export default Profile;
