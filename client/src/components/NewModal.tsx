import CreateFeedModalForm from "./feeds/CreateFeedModalForm";
import UpdateFeedModalForm from "./feeds/UpdateFeedModalForm";
import DeleteFeedModalForm from "./feeds/DeleteFeedModalForm";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface ModalProps {
  Type: string;
  feedId?: string;
  feedName?: string;
  isVisible: boolean;
  onClose: () => void;
}

function NewModal(props: ModalProps) {
  let ModalTitle;
  let ModalBody;
  let ModalSize;
  let ModalFunction;

  switch (props.Type) {
    case "Create":
      ModalTitle = "Create a new feed";
      ModalBody = <CreateFeedModalForm onClose={props.onClose} />;
      ModalSize = "modal modal-xl";
      break;
    case "Update":
      ModalTitle = `Update ${props.feedName}`;
      ModalBody = (
        <UpdateFeedModalForm
          feedId={props.feedId || "noid"}
          feedName={props.feedName || "noname"}
        />
      );
      ModalSize = "modal modal-xl";
      break;
    case "Delete":
      ModalTitle = `Delete ${props.feedName}`;
      ModalBody = (
        <DeleteFeedModalForm
          feedId={props.feedId || "noid"}
          feedName={props.feedName || "noname"}
          onClose={props.onClose}
        />
      );
      ModalSize = "modal modal-md";
      break;
    default:
      return "Invalid Modal Type";
  }

  return (
    <>
      <Modal
        show={props.isVisible}
        onHide={props.onClose}
        className={ModalSize}
      >
        <Modal.Header closeButton>
          <Modal.Title>{ModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{ModalBody}</Modal.Body>
      </Modal>
    </>
  );
}

export default NewModal;
