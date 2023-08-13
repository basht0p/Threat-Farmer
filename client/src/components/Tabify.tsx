import { useState } from "react";
import FeedTable from "./FeedTable";
import NewModal from "./NewModal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

function Tabify() {
  const [key, setKey] = useState<any | null>("Feeds");

  return (
    <Tabs
      id="main-tabs"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-4"
    >
      <Tab eventKey="Feeds" title="Feeds">
        <NewModal Type="Create" ModalTitle="Create a new threat feed" />
        <FeedTable />
      </Tab>
      <Tab eventKey="Silos" title="Silos">
        Tab content for Silos
      </Tab>
    </Tabs>
  );
}

export default Tabify;
