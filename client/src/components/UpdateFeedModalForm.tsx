import FeedTestResults from "./FeedTestResults";
import { FeedConfiguration } from "../utils/feed";
import { useState, useEffect } from "react";
import { legalObservables, legalFormats } from "../utils/feed";

interface feedProps {
  feedId: string;
  feedName: string;
}

function UpdateFeedModalForm(props: feedProps) {
  const [feed, setState] = useState<FeedConfiguration>();

  useEffect(() => {
    fetch(`http://localhost:8123/api/getfeed?id=${props.feedId}`)
      .then((res) => res.json())
      .then((data) => {
        setState(data);
      });
  });

  return (
    <div className="row">
      <div className="col-md-6">
        <form>
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="form-control" id="FeedName">
              {feed.id}
            </input>
          </div>
          <br></br>
          <div className="form-group">
            <label>URL</label>
            <input type="url" className="form-control" id="FeedUrl"></input>
          </div>
          <br></br>
          <div className="form-group">
            <label>Key</label>
            <input type="text" className="form-control" id="FeedKey"></input>
          </div>
          <br></br>
          <div className="form-group">
            <label>Format</label>
            <select className="form-control" id="feedType">
              <option value="">Select a feed type...</option>
              {legalFormats.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Key</label>
            <input type="text" className="form-control" id="FeedKey"></input>
          </div>
          <div className="form-group">
            <label>Feed Observables</label>
            <select multiple className="form-control" id="feedObservables">
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
    </div>
  );
}

export default UpdateFeedModalForm;
