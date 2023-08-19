import { useState, useEffect } from "react";
import NewModalButton from "./NewModalButton";
import { FeedConfiguration } from "../utils/feed";
import socket from "../utils/socket";

function FeedTable() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [feeds, setState] = useState<Array<FeedConfiguration>>([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function updateFeeds(value: Array<FeedConfiguration>) {
      setState(value);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("allfeeds", updateFeeds);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("allfeeds", updateFeeds);
    };
  }, []);

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
            return (
              <tr key={feed.id} className="align-middle">
                <td key={"name_" + feed.id}>{feed.name}</td>
                <td key={"url_" + feed.id}>{feed.url}</td>
                <td key={"type_" + feed.id}>{feed.format}</td>
                <td key={"obs_" + feed.id}> {feed.observables.join(", ")}</td>
                <td>
                  <span>
                    <NewModalButton
                      modalType="Update"
                      modalTitle="Update"
                      feedId={feed.id}
                      feedName={feed.name}
                    />
                    <NewModalButton
                      modalType="Delete"
                      modalTitle="Delete"
                      feedId={feed.id}
                      feedName={feed.name}
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
