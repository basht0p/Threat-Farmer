import { useState, useEffect } from "react";
import NewModalButton from "../NewModalButton";
import { SiloConfiguration } from "../../utils/silo";
import { FeedConfiguration } from "../../utils/feed";
import { useSocket } from "../../contexts/SocketProvider";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { EmptyFeed } from "../../utils/feed";
import config from "../../../../config/config";

function SiloTable() {
  const [silos, setSiloState] = useState<Array<SiloConfiguration>>([]);
  const [feeds, setFeedState] = useState<Array<FeedConfiguration>>([]);
  const socket = useSocket();

  function toggleSiloStatus(id: string) {
    fetch(`${config.uriProtocol}://${config.domainName}/api/toggleSilo?id=${id}`, {
      method: "GET",
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    function updateFeeds(value: Array<FeedConfiguration>) {
      setFeedState(value);
    }

    if (socket != null) {
      socket.on("UpdatedFeeds", updateFeeds);

      return () => {
        socket.off("UpdatedFeeds", updateFeeds);
      };
    }
  }, [feeds]);

  useEffect(() => {
    function updateSilos(value: Array<SiloConfiguration>) {
      setSiloState(value);
    }

    if (socket != null) {
      socket.on("UpdatedSilos", updateSilos);

      return () => {
        socket.off("UpdatedSilos", updateSilos);
      };
    }
  }, [silos]);

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">API</th>
            <th scope="col">Members</th>
            <th scope="col">Observables</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {silos.map((silo) => {
            let observables: Set<string> = new Set();
            return (
              <tr key={silo.id} className="align-middle">
                <td key={"name_" + silo.id}>{silo.name}</td>
                <td
                  key={"api_" + silo.id}
                >{`${window.location.href}lookup/${silo.api}/<Search Term>`}</td>
                <td key={"mbrs_" + silo.id}>
                  {silo.members.map((memberId) => {
                    let feed = feeds.find((obj) => obj.id === memberId);
                    feed?.observables.map((obs) => {
                      observables.add(obs);
                    });

                    return (
                      <>
                        {feed?.name}
                        <br></br>
                      </>
                    );
                  })}
                </td>
                <td key={"obs_" + silo.id}>
                  {Array.from(observables).join(", ")}
                </td>
                <td>
                  <span>
                    <Button
                      className={
                        silo.state
                          ? "btn btn-secondary m-1 text-center"
                          : "btn btn-primary m-1 text-center"
                      }
                      name={silo.id}
                      onClick={() => toggleSiloStatus(silo.id)}
                    >
                      {silo.state ? (
                        <>
                          <Icon.PauseFill /> Stop{" "}
                        </>
                      ) : (
                        <>
                          <Icon.PlayFill /> Start{" "}
                        </>
                      )}
                    </Button>
                    <NewModalButton
                      modalType="UpdateSilo"
                      modalTitle="Update"
                      feed={EmptyFeed}
                      silo={silo}
                    />
                    <NewModalButton
                      modalType="DeleteSilo"
                      modalTitle="Delete"
                      feed={EmptyFeed}
                      silo={silo}
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

export default SiloTable;
