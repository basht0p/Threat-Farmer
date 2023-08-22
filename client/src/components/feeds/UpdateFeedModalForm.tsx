import FeedTestResults from "./FeedTestResults";
import { FeedConfiguration } from "../../utils/feed";
import { useState, useEffect } from "react";
import { legalObservables, legalFormats } from "../../utils/feed";
import { useSocket } from "../../contexts/SocketProvider";

interface feedProps {
  feedId: string;
  feedName: string;
}

function UpdateFeedModalForm(props: feedProps) {
  const [feed, setState] = useState<FeedConfiguration>({
    id: "",
    name: "",
    url: "",
    observables: [],
    key: "",
    format: "",
    state: false,
    comments: false,
    headers: false,
    purge: false,
    map: [],
    frequency: "",
  });

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

  useEffect(() => {
    const socket = useSocket();

    function populateFeedForm(value: FeedConfiguration) {
      setState(value);
    }

    if (socket != null) {
      socket.on("allfeeds", populateFeedForm);

      return () => {
        socket.off("", populateFeedForm);
      };
    }
    fetch(`http://localhost:8123/api/getfeed?id=${props.feedId}`)
      .then((res) => {
        return res.json();
      })
      .then((data: FeedConfiguration) => {
        if (data != undefined) {
          setState(data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }, [props.feedId]);

  if (feed != undefined) {
    return (
      <div className="row">
        <div className="col-md-6">
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
        <div className="col-md-6">
          <FeedTestResults />
        </div>
      </div>
    );
  }
}

export default UpdateFeedModalForm;
