import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSocket } from "../../contexts/SocketProvider";
import { useEffect, useState } from "react";
import { FeedConfiguration } from "../../utils/feed";
import { SiloConfiguration } from "../../utils/silo";
import config from "../../../../config/config";

interface SiloFormInputs {
  name: string;
  api: string;
  members: String[];
  state: boolean;
  id: string;
}

interface UpdateSiloModalFormProps {
  silo: SiloConfiguration;
  onClose: () => void;
}

function UpdateSiloModalForm(props: UpdateSiloModalFormProps) {
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
      name: props.silo.name,
      members: props.silo.members,
      api: props.silo.api,
      state: props.silo.state,
      id: props.silo.id,
    },
  });

  // Fetch the feeds upon rendering this component
  useEffect(() => {
    fetch(`${config.uriProtocol}://${config.domainName}/ws/feeds`, {
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
    fetch(`${config.uriProtocol}://${config.domainName}/api/updateSilo`, {
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
                <option
                  key={feed.id}
                  value={feed.id}
                  selected={props.silo.members.includes(feed.id)}
                >
                  {feed.name}
                </option>
              ))}
            </select>
          </div>
          <br></br>
        </div>
      </div>
      <Modal.Footer>
        <Button type="submit" className="btn btn-success">
          Update
        </Button>
      </Modal.Footer>
    </form>
  );
}

export default UpdateSiloModalForm;
