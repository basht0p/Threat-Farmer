import React, { useState } from "react";
import NewModal from "./NewModal";
import * as Icon from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import { EmptyFeed, FeedConfiguration } from "../utils/feed";
import { EmptySilo, SiloConfiguration } from "../utils/silo";

interface NewModalButtonProps {
  modalType: "CreateFeed" | "UpdateFeed" | "DeleteFeed" | "CreateSilo" | "UpdateSilo" | "DeleteSilo";
  modalTitle: string;
  feed: FeedConfiguration;
  silo: SiloConfiguration;
}

function NewModalButton(props: NewModalButtonProps) {
  const [isModalVisible, setModalVisible] = useState(false);

  let ButtonIcon;
  let ButtonClass;

  switch (props.modalType) {
    case "CreateFeed":
      ButtonIcon = "Create";
      ButtonClass = "btn btn-primary m-1";
      break;
    case "UpdateFeed":
      ButtonIcon = <Icon.PencilFill />;
      ButtonClass = "btn btn-success m-1";
      break;
    case "DeleteFeed":
      ButtonIcon = <Icon.Trash />;
      ButtonClass = "btn btn-danger m-1";
      break;
    case "CreateSilo":
      ButtonIcon = "Create";
      ButtonClass = "btn btn-primary m-1";
      break;
    case "UpdateSilo":
      ButtonIcon = <Icon.PencilFill />;
      ButtonClass = "btn btn-success m-1";
      break;
    case "DeleteSilo":
      ButtonIcon = <Icon.Trash />;
      ButtonClass = "btn btn-danger m-1";
      break;
  }

  return (
    <>
      <Button className={ButtonClass} onClick={() => setModalVisible(true)}>
        {ButtonIcon}
      </Button>
      <NewModal
        modalType={props.modalType}
        feed={props.feed}
        silo={props.silo}
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

export default NewModalButton;
