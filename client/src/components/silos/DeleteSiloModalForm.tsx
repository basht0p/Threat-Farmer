import { SiloConfiguration } from "../../utils/silo";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface siloProps {
  silo: SiloConfiguration;
  onClose: Function;
}

function DeleteSiloModalForm(props: siloProps) {
  return (
    <>
      <div className="row">
        <p>Delete are you sure you want to delete this silo?</p>
        <br></br>
        <p>
          All member feeds will be removed from the silo, but not the feed itself or it's data.
        </p>
      </div>
      <Modal.Footer>
        <Button
          className="btn btn-danger"
          onClick={() => {
            fetch(
              `http://localhost:8123/api/deleteSilo?id=${props.silo.id}`
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

export default DeleteSiloModalForm;
