import FeedTestResults from "./FeedTestResults";
import { useState } from "react";
import { legalObservables, legalFormats } from "../../utils/feed";
import { Button } from "react-bootstrap";

function CreateFeedModalForm(onClose: any) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [format, setFormat] = useState("");
  const [observables, setObservables] = useState([]);
  const [comments, setComments] = useState(false);
  const [headers, setHeaders] = useState(false);
  const [frequency, setFrequency] = useState(false);
  const [map, setMap] = useState([]);
  const [purge, setPurge] = useState(false);

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
                id="FeedName"
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <br></br>
            <div className="form-group">
              <label>URL</label>
              <input
                type="url"
                className="form-control"
                id="FeedUrl"
                onChange={(e) => setUrl(e.target.value)}
              ></input>
            </div>
            <br></br>
            <div className="form-group">
              <label>Key</label>
              <input
                type="text"
                className="form-control"
                id="FeedKey"
                onChange={(e) => setKey(e.target.value)}
              ></input>
            </div>
            <br></br>
            <div className="form-group">
              <label>Format</label>
              <select
                className="form-control"
                id="feedType"
                onChange={(e) => setFormat(e.target.value)}
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
                id="feedObservables"
                onChange={(e) => setObservables([])}
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
                  id="includesComments"
                ></input>
                <label className="form-check-label"> Has Comments </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="includesHeaders"
                ></input>
                <label className="form-check-label"> Has Headers </label>
              </div>
            </div>
            <br></br>
            <div className="form-group">
              <label>Update Frequency</label>
              <select className="form-control" id="updateFrequency">
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
                value=""
                id="purgeOnUpdate"
              ></input>
              <label className="form-check-label"> Purge on update </label>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <FeedTestResults />
        </div>
        <div className="container">
          <Button
            className="btn btn-primary"
            onClick={() => {
              fetch(`http://localhost:8123/api/deleteFeed`, {
                method: "POST",
              }).then((res) => {
                console.log(res);
                return res;
              });
              onClose();
            }}
          >
            Create
          </Button>
        </div>
      </div>
    </>
  );
}

export default CreateFeedModalForm;
