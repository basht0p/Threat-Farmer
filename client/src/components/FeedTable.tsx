import { useState, useEffect, JSXElementConstructor } from "react";
import { Feed, legalObservables } from "../utils/feed";

function FeedTable() {
  const [feeds, setState] = useState<any[]>([]);
  const allFeeds: Array<any> = [];

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
                <td key={"type_" + feed.id}>{feed.type}</td>
                <td key={"obs_" + feed.id}>{feed.observables}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ul className="list-group">
        {legalObservables.map((i) => (
          <li
            className="list-group-item"
            key={i}
            onClick={() => console.log("clicked", i)}
          >
            {i}
          </li>
        ))}
      </ul>
    </>
  );
}

export default FeedTable;
