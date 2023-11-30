import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSocket } from "../../contexts/SocketProvider";
import { useEffect, useState, useRef } from "react";
import { FeedConfiguration } from "../../utils/feed";
import config from "../../../../config/config";

interface SiloFormInputs {
  name: string;
  api: string;
  members: Array<string>;
  state: boolean;
}

interface CreateSiloModalFormProps {
  onClose: () => void;
}

function CreateSiloModalForm(props: CreateSiloModalFormProps) {
  const [feeds, setFeedState] = useState<Array<FeedConfiguration>>([]);

  const socket = useSocket();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SiloFormInputs>({
    defaultValues: {
      members: [],
      state: false,
    },
  });

  // Fetch the feeds upon rendering this component
  useEffect(() => {
    fetch(`https://${config.domainName}/ws/feeds`, {
      method: "GET",
    });
  }, []);

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

  const onSubmit: SubmitHandler<SiloFormInputs> = (data) => {
    fetch(`https://${config.domainName}/api/createSilo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => {
      props.onClose();
      return res;
    });
  };

  const handleMultiSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setValue("members", selectedOptions);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-lg-12">
          <div className="form-group">
            <label>Name</label>
            <input
              {...register("name", { required: true })}
              type="text"
              className="form-control"
            />
          </div>
          <br></br>
          <div className="form-group">
            <label>API URL</label>
            <input
              {...register("api", { required: true })}
              type="text"
              className="form-control"
            />
            <p>{`${window.location.href}lookup/{API URL}`}</p>
          </div>
          <br></br>
          <div className="form-group">
            <label>Member Feeds</label>
            <select
              multiple
              className="form-control"
              {...register("members")} // Use register directly
              onChange={handleMultiSelectChange} // Update state on change
              required
            >
              {feeds.map((feed) => (
                <option key={feed.id} value={feed.id}>
                  {feed.name}
                </option>
              ))}
            </select>
          </div>
          <br></br>
        </div>
      </div>
      <Modal.Footer>
        <Button type="submit" className="btn btn-primary">
          Create
        </Button>
      </Modal.Footer>
    </form>
  );
}

export default CreateSiloModalForm;
