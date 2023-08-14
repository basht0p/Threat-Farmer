import { useState, useEffect, JSXElementConstructor } from "react";
import { FeedConfiguration, legalObservables } from "../utils/feed";

function FeedTable() {
  const [feeds, setState] = useState<Array<FeedConfiguration>>([]);

  useEffect(() => {
    fetch("http://localhost:8123/api/allfeeds")
      .then((res) => res.json())
      .then((data) => {
        setState(data);
      });
  });

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">URL</th>
            <th scope="col">Format</th>
            <th scope="col">Observables</th>
          </tr>
        </thead>
        <tbody>
          {feeds.map((feed) => {
            return (
              <tr key={feed.id}>
                <td key={"name_" + feed.id}>{feed.name}</td>
                <td key={"url_" + feed.id}>{feed.url}</td>
                <td key={"type_" + feed.id}>{feed.format}</td>
                <td key={"obs_" + feed.id}>
                  <ul className="list-group list-group-flush">
                    {feed.observables.map((observable) => {
                      return <li className="list-group-item">{observable}</li>;
                    })}
                  </ul>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default FeedTable;
