import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  FeedConfiguration,
  legalObservables,
  legalFormats,
} from "../../utils/feed";
import config from "../../../../config/config";

interface UpdateFeedModalFormProps {
  feed: FeedConfiguration;
  onClose: () => void;
}

function UpdateFeedModalForm(props: UpdateFeedModalFormProps) {
  const [feed, setState] = useState(props.feed);

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

  if (feed != null) {
    return (
      <>
        <div className="row">
          <div className="col-md-12">
            <form>
              {/* Feed Name Field */}
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={feed.name}
                  onChange={handleChange}
                />
              </div>
              <br></br>

              {/* Feed URL Field */}
              <div className="form-group">
                <label>URL</label>
                <input
                  type="url"
                  className="form-control"
                  name="url"
                  value={feed.url}
                  onChange={handleChange}
                />
              </div>
              <br></br>

              {/* Feed Key Field */}
              <div className="form-group">
                <label>Key</label>
                <input
                  type="text"
                  className="form-control"
                  name="key"
                  value={feed.key}
                  onChange={handleChange}
                />
              </div>
              <br></br>

              {/* Feed Format Field */}
              <div className="form-group">
                <label>Format</label>
                <select
                  className="form-control"
                  name="format"
                  value={feed.format}
                  onChange={handleChange}
                >
                  <option value="">Select a feed type...</option>
                  {legalFormats.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
              <br></br>

              {/* Feed Observables Field */}
              <div className="form-group">
                <label>Feed Observables</label>
                <select
                  multiple
                  className="form-control"
                  name="observables"
                  value={feed.observables}
                  onChange={handleMultiSelectChange}
                >
                  {legalObservables.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <br></br>

              <div className="form-group">
                {/* Feed Includes Comments */}
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={feed.comments}
                    name="comments"
                    onChange={handleChange}
                  ></input>
                  <label className="form-check-label"> Has Comments </label>
                </div>

                {/* Feed Includes Headers */}
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={feed.headers}
                    name="headers"
                    onChange={handleChange}
                  ></input>
                  <label className="form-check-label"> Has Headers </label>
                </div>
              </div>
              <br></br>

              {/* Feed Update Frequency */}
              <div className="form-group">
                <label>Update Frequency</label>
                <select
                  className="form-control"
                  name="frequency"
                  value={feed.frequency}
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

              {/* Feed Purge on Update */}
              <div className="form-check feedParams">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={feed.purge}
                  name="purge"
                  onChange={handleChange}
                ></input>
                <label className="form-check-label"> Purge on update </label>
              </div>
            </form>
          </div>
        </div>
        <br></br>
        <Modal.Footer>
          <Button
            className="btn btn-success"
            onClick={() => {
              fetch(`${config.uriProtocol}://${config.domainName}/api/updateFeed`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feed),
              }).then((res) => {
                props.onClose();
                return res;
              });
            }}
          >
            Update
          </Button>
        </Modal.Footer>
      </>
    );
  } else {
    return null;
  }
}

export default UpdateFeedModalForm;
