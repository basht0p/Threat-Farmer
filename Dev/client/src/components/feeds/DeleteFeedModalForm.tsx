import { FeedConfiguration } from "../../utils/feed";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import config from "../../../../config/config";

interface feedProps {
  feed: FeedConfiguration;
  onClose: Function;
}

function DeleteFeedModalForm(props: feedProps) {
  return (
    <>
      <div className="row">
        <p>Delete are you sure you want to delete this feed?</p>
        <br></br>
        <p>
          All data associated with this feed will be deleted from the database.
        </p>
      </div>
      <Modal.Footer>
        <Button
          className="btn btn-danger"
          onClick={() => {
            fetch(
              `http://${config.domainName}/api/deleteFeed?id=${props.feed.id}`
            ).then((res) => {
              props.onClose();
              return res;
            });
          }}
        >
          Delete
        </Button>
        <Button className="btn btn-secondary" onClick={() => props.onClose()}>
          Cancel
        </Button>
      </Modal.Footer>
    </>
  );
}

export default DeleteFeedModalForm;
