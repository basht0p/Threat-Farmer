import CreateFeedModalForm from "./feeds/CreateFeedModalForm";
import UpdateFeedModalForm from "./feeds/UpdateFeedModalForm";
import DeleteFeedModalForm from "./feeds/DeleteFeedModalForm";
import Modal from "react-bootstrap/Modal";
import { FeedConfiguration } from "../utils/feed";

interface ModalProps {
  modalType: string;
  feed: FeedConfiguration;
  isVisible: boolean;
  onClose: () => void;
}

function NewModal(props: ModalProps) {
  let ModalTitle;
  let ModalBody;
  let ModalSize;

  switch (props.modalType) {
    case "Create":
      ModalTitle = "Create a new feed";
      ModalBody = <CreateFeedModalForm onClose={props.onClose} />;
      ModalSize = "modal modal-xl";
      break;
    case "Update":
      if (props.feed != undefined) {
        ModalTitle = `Update ${props.feed.name}`;
        ModalBody = (
          <UpdateFeedModalForm feed={props.feed} onClose={props.onClose} />
        );
        ModalSize = "modal modal-xl";
        break;
      } else {
        console.log("no id for update button");
        break;
      }
    case "Delete":
      if (props.feed != undefined) {
        ModalTitle = `Delete ${props.feed.name}`;
        ModalBody = (
          <DeleteFeedModalForm feed={props.feed} onClose={props.onClose} />
        );
        ModalSize = "modal modal-md";
        break;
      } else {
        console.log("no id for delete button");
        break;
      }
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
