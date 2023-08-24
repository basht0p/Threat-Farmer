import { useState } from "react";
import FeedTable from "./feeds/FeedTable";
import NewModalButton from "./NewModalButton";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FeedConfiguration, EmptyFeed } from "../utils/feed";

function Tabify() {
  const [key, setKey] = useState<any | null>("Feeds");
  let emptyFeed: FeedConfiguration = EmptyFeed;

  return (
    <Tabs
      id="main-tabs"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-4"
    >
      <Tab eventKey="Feeds" title="Feeds">
        <NewModalButton
          modalType="Create"
          modalTitle="Create a new threat feed"
          feed={emptyFeed}
        />
        <FeedTable />
      </Tab>
      <Tab eventKey="Silos" title="Silos">
        Tab content for Silos
      </Tab>
    </Tabs>
  );
}

export default Tabify;
