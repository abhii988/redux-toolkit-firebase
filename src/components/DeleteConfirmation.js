import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteConfirmation = ({ show, handleClose, handleDelete, toDelete }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the User "{toDelete.fname}"?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          className="btns"
          onClick={handleClose}
          style={{ width: "15%" }}
        >
          Close
        </Button>
        <Button variant="danger" onClick={() => handleDelete(toDelete.id)}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmation;
