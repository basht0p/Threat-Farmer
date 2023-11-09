import { useState, useEffect } from "react";
import NewModalButton from "../NewModalButton";
import { FeedConfiguration } from "../../utils/feed";
import { useSocket } from "../../contexts/SocketProvider";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { EmptySilo } from "../../utils/silo";

function FeedTable() {
  const [feeds, setState] = useState<Array<FeedConfiguration>>([]);
  const socket = useSocket();

  function toggleFeedStatus(id: string) {
    fetch(`http://localhost:8123/api/toggleFeed?id=${id}`, { method: "Get" })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    function updateFeeds(value: Array<FeedConfiguration>) {
      setState(value);
    }

    if (socket != null) {
      socket.on("UpdatedFeeds", updateFeeds);

      return () => {
        socket.off("UpdatedFeeds", updateFeeds);
      };
    }
  }, [feeds]);

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
                    <Button
                      className={
                        feed.state
                          ? "btn btn-secondary m-1 text-center"
                          : "btn btn-primary m-1 text-center"
                      }
                      name={feed.id}
                      onClick={() => toggleFeedStatus(feed.id)}
                    >
                      {feed.state ? <><Icon.PauseFill /> Stop </> : <><Icon.PlayFill /> Start </>}
                    </Button>
                    <NewModalButton
                      modalType="UpdateFeed"
                      modalTitle="Update"
                      feed={feed}
                      silo={EmptySilo}
                    />
                    <NewModalButton
                      modalType="DeleteFeed"
                      modalTitle="Delete"
                      feed={feed}
                      silo={EmptySilo}
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
