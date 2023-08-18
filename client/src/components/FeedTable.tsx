import { useState, useEffect } from "react";
import NewModalButton from "./NewModalButton";
import { FeedConfiguration, FeedFormat } from "../utils/feed";

function FeedTable() {
  const [feeds, setState] = useState<Array<FeedFormat>>([]);

  useEffect(() => {
    fetch("http://localhost:8123/api/allfeeds")
      .then((res) => res.json())
      .then((data) => {
        setState(data);
      });
  }, []);

  console.log(JSON.stringify(feeds, null, 2));

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">URL</th>
            <th scope="col">Format</th>
            <th scope="col">Observables</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {feeds.map((feed) => {
            var result: FeedConfiguration = {
              id: `${feed._id}`,
              name: `${feed.name}`,
              url: `${feed.url}`,
              format: `${feed.format}`,
              observables: feed.observables,
              key: `${feed.key}`,
              state: feed.state,
              comments: feed.comments,
              headers: feed.headers,
              purge: feed.purge,
              frequency: `${feed.frequency}`,
              map: feed.map,
            };
            console.log(` this is id ${result.id}`);
            return (
              <tr key={result.id} className="align-middle">
                <td key={"name_" + result.id}>{feed.name}</td>
                <td key={"url_" + result.id}>{feed.url}</td>
                <td key={"type_" + result.id}>{feed.format}</td>
                <td key={"obs_" + result.id}> {feed.observables.join(", ")}</td>
                <td>
                  <span>
                    <NewModalButton
                      modalType="Update"
                      modalTitle="Update"
                      feedId={result.id}
                      feedName={result.name}
                    />
                    <NewModalButton
                      modalType="Delete"
                      modalTitle="Delete"
                      feedId={result.id}
                      feedName={result.name}
                    />
                  </span>
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
