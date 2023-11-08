import { useState, useEffect } from "react";
import NewModalButton from "../NewModalButton";
import { SiloConfiguration } from "../../utils/silo";
import { useSocket } from "../../contexts/SocketProvider";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

function SiloTable() {
  const [silos, setState] = useState<Array<SiloConfiguration>>([]);
  const socket = useSocket();

  function toggleSiloStatus(id: string) {
    fetch(`http://localhost:8123/api/toggleSilo?id=${id}`, { method: "Get" })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    function updateSilos(value: Array<SiloConfiguration>) {
      setState(value);
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
            <th scope="col">URL</th>
            <th scope="col">Format</th>
            <th scope="col">Observables</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {silos.map((silo) => {
            return (
              <tr key={silo.id} className="align-middle">
                <td key={"name_" + silo.id}>{silo.name}</td>
                <td key={"url_" + silo.id}>{silo.url}</td>
                <td key={"type_" + silo.id}>{silo.format}</td>
                <td key={"obs_" + silo.id}> {silo.observables.join(", ")}</td>
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
                      {silo.state ? <><Icon.PauseFill /> Stop </> : <><Icon.PlayFill /> Start </>}
                    </Button>
                    <NewModalButton
                      modalType="Update"
                      modalTitle="Update"
                      silo={silo}
                    />
                    <NewModalButton
                      modalType="Delete"
                      modalTitle="Delete"
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