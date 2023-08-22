import React, { useState } from "react";
import NewModal from "./NewModal";
import * as Icon from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import { FeedConfiguration } from "../utils/feed";

interface NewModalButtonProps {
  modalType: "Create" | "Update" | "Delete";
  modalTitle: string;
  feed: FeedConfiguration;
}

function NewModalButton(props: NewModalButtonProps) {
  const [isModalVisible, setModalVisible] = useState(false);

  let ButtonIcon;
  let ButtonClass;

  switch (props.modalType) {
    case "Create":
      ButtonIcon = "Create";
      ButtonClass = "btn btn-primary m-1";
      break;
    case "Update":
      ButtonIcon = <Icon.PencilFill />;
      ButtonClass = "btn btn-success m-1";
      break;
    case "Delete":
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
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

export default NewModalButton;
