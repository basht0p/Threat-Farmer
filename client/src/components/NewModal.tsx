import { useState } from "react";
import CreateFeedModalForm from "./CreateFeedModalForm";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface ModalProps {
  Type: string;
  ModalTitle: string;
}

function NewModal(Props: ModalProps) {
  const [show, setShow] = useState(false);

  const HandleClose = () => setShow(false);
  const HandleShow = () => setShow(true);

  let ModalBody;

  switch (Props.Type) {
    case "Create":
      ModalBody = <CreateFeedModalForm />;
      break;
    default:
      return "Invalid Modal Type";
  }

  return (
    <>
      <Button variant="primary" onClick={HandleShow}>
        {Props.Type}
      </Button>

      <Modal show={show} onHide={HandleClose} className="modal modal-xl">
        <Modal.Header closeButton>
          <Modal.Title>{Props.ModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{ModalBody}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={HandleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={HandleClose}>
            {Props.Type}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NewModal;
