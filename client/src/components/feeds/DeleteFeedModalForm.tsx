import Button from "react-bootstrap/Button";
import { FeedConfiguration } from "../../utils/feed";

interface feedProps {
  feed: FeedConfiguration;
  onClose: Function;
}

function DeleteFeedModalForm(props: feedProps) {
  return (
    <div className="row">
      <h5>Are you sure you want to delete {props.feed.name}?</h5>
      <br></br>
      <Button
        className="btn btn-danger"
        onClick={() => {
          fetch(
            `http://localhost:8123/api/deleteFeed?id=${props.feed.id}`
          ).then((res) => {
            console.log(res);
            return res;
          });
          props.onClose();
        }}
      >
        Delete
      </Button>
    </div>
  );
}

export default DeleteFeedModalForm;
