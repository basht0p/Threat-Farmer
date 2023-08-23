import FeedTestResults from "./FeedTestResults";
import { useState } from "react";
import { legalObservables, legalFormats, EmptyFeed } from "../../utils/feed";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function CreateFeedModalForm(props: any) {
  const [feed, setState] = useState(EmptyFeed);

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setState((prevFeed) => ({ ...prevFeed, observables: selectedOptions }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    let inputValue: string | boolean;

    if (type === "checkbox") {
      inputValue = (e.target as HTMLInputElement).checked;
    } else {
      inputValue = value;
    }
    setState((prevState) => ({ ...prevState, [name]: inputValue }));
  };

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <form>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                onChange={handleChange}
              ></input>
            </div>
            <br></br>
            <div className="form-group">
              <label>URL</label>
              <input
                type="url"
                className="form-control"
                name="url"
                onChange={handleChange}
              ></input>
            </div>
            <br></br>
            <div className="form-group">
              <label>Key</label>
              <input
                type="text"
                className="form-control"
                name="key"
                onChange={handleChange}
              ></input>
            </div>
            <br></br>
            <div className="form-group">
              <label>Format</label>
              <select
                className="form-control"
                name="format"
                onChange={handleChange}
              >
                <option value="">Select a feed format...</option>
                {legalFormats.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <br></br>
            <div className="form-group">
              <label>Feed Observables</label>
              <select
                multiple
                className="form-control"
                name="observables"
                onChange={handleMultiSelectChange}
              >
                {legalObservables.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <br></br>
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="true"
                  name="comments"
                  onChange={handleChange}
                ></input>
                <label className="form-check-label"> Has Comments </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="headers"
                  onChange={handleChange}
                ></input>
                <label className="form-check-label"> Has Headers </label>
              </div>
            </div>
            <br></br>
            <div className="form-group">
              <label>Update Frequency</label>
              <select
                className="form-control"
                name="frequency"
                onChange={handleChange}
              >
                <option value="">Select a update frequency...</option>
                <option value="1">15 minutes</option>
                <option value="2">30 minutes</option>
                <option value="3">1 hour</option>
                <option value="4">4 hours</option>
                <option value="5">12 hour</option>
                <option value="6">1 day</option>
              </select>
            </div>
            <br></br>
            <div className="form-check feedParams">
              <input
                className="form-check-input"
                type="checkbox"
                name="purge"
                onChange={handleChange}
              ></input>
              <label className="form-check-label"> Purge on update </label>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <FeedTestResults />
        </div>
      </div>
      <br></br>
      <Modal.Footer>
        <Button
          className="btn btn-primary"
          onClick={() => {
            fetch(`http://localhost:8123/api/createFeed`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(feed),
            }).then((res) => {
              props.onClose();
              return res;
            });
          }}
        >
          Create
        </Button>
      </Modal.Footer>
    </>
  );
}

export default CreateFeedModalForm;
