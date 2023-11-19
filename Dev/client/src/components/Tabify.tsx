import { useState } from "react";
import FeedTable from "./feeds/FeedTable";
import NewModalButton from "./NewModalButton";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FeedConfiguration, EmptyFeed } from "../utils/feed";
import { EmptySilo } from "../utils/silo";
import SiloTable from "./silos/SiloTable";

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
          modalType="CreateFeed"
          modalTitle="Create a new threat feed"
          feed={EmptyFeed}
          silo={EmptySilo}
        />
        <FeedTable />
      </Tab>
      <Tab eventKey="Silos" title="Silos">
        <NewModalButton
          modalType="CreateSilo"
          modalTitle="Create a new silo to aggregate feeds"
          feed={EmptyFeed}
          silo={EmptySilo}
        />
        <SiloTable />
      </Tab>
    </Tabs>
  );
}

export default Tabify;
