import CreateFeedModalForm from "./feeds/CreateFeedModalForm";
import UpdateFeedModalForm from "./feeds/UpdateFeedModalForm";
import DeleteFeedModalForm from "./feeds/DeleteFeedModalForm";
import CreateSiloModalForm from "./silos/CreateSiloModalForm";
import DeleteSiloModalForm from "./silos/DeleteSiloModalForm";
import UpdateSiloModalForm from "./silos/UpdateSiloModalForm";
import Modal from "react-bootstrap/Modal";
import { EmptyFeed, FeedConfiguration } from "../utils/feed";
import { EmptySilo, SiloConfiguration } from "../utils/silo";

interface ModalProps {
  modalType: string;
  feed: FeedConfiguration;
  silo: SiloConfiguration;
  isVisible: boolean;
  onClose: () => void;
}

function NewModal(props: ModalProps) {
  let ModalTitle;
  let ModalBody;
  let ModalSize;

  switch (props.modalType) {
    case "CreateFeed":
      ModalTitle = "Create a new feed";
      ModalBody = <CreateFeedModalForm onClose={props.onClose} />;
      ModalSize = "modal modal-xl";
      break;
    case "UpdateFeed":
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
    case "DeleteFeed":
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
    case "CreateSilo":
      ModalTitle = "Create a new silo to aggregate feeds";
      ModalBody = <CreateSiloModalForm onClose={props.onClose} />;
      ModalSize = "modal";
      break;
    case "UpdateSilo":
      if (props.silo != undefined) {
        ModalTitle = `Update ${props.silo.name}`;
        ModalBody = (
          <UpdateSiloModalForm silo={props.silo} onClose={props.onClose} />
        );
        ModalSize = "modal";
        break;
      } else {
        console.log("no id for update button");
        break;
      }
    case "DeleteSilo":
      if (props.silo != undefined) {
        ModalTitle = `Delete ${props.silo.name}`;
        ModalBody = (
          <DeleteSiloModalForm silo={props.silo} onClose={props.onClose} />
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
