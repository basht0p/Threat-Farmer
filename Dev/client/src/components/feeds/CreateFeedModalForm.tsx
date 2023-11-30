import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { legalObservables, legalFormats } from "../../utils/feed";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import config from "../../../../config/config";

interface FeedFormInputs {
  name: string;
  url: string;
  key: string;
  format: string;
  observables: string[];
  frequency: string;
  purge: boolean;
  headers: boolean;
  comments: boolean;
  state: boolean;
}

interface CreateFeedModalFormProps {
  onClose: () => void;
}

function CreateFeedModalForm(props: CreateFeedModalFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FeedFormInputs>({
    defaultValues: {
      observables: [],
      state: true,
    },
  });

  const onSubmit: SubmitHandler<FeedFormInputs> = (data) => {
    fetch(`https://${config.domainName}/api/createFeed`, {
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
    setValue("observables", selectedOptions, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-md-12">
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
            <label>URL</label>
            <input
              {...register("url", { required: true })}
              type="url"
              className="form-control"
            />
          </div>
          <br></br>
          <div className="form-group">
            <label>Key</label>
            <input
              {...register("key", { required: true })}
              type="text"
              className="form-control"
            />
          </div>
          <br></br>
          <div className="form-group">
            <label>Format</label>
            <select
              {...register("format", { required: true })}
              className="form-control"
            >
              <option value="">Select a feed format...</option>
              {legalFormats.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
          <br></br>
          <div className="form-group">
            <label>Feed Observables</label>
            <Controller
              name="observables"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <select
                  {...field}
                  multiple
                  className="form-control"
                  onChange={handleMultiSelectChange}
                >
                  {legalObservables.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              )}
            />
          </div>
          <br></br>
          <div className="form-check">
            <input
              {...register("headers")}
              type="checkbox"
              className="form-check-input"
              id="headersCheckbox"
            />
            <label className="form-check-label" htmlFor="headersCheckbox">
              Has Headers
            </label>
          </div>
          <div className="form-check">
            <input
              {...register("comments")}
              type="checkbox"
              className="form-check-input"
              id="commentsCheckbox"
            />
            <label className="form-check-label" htmlFor="commentsCheckbox">
              Has Comments
            </label>
          </div>
          <br></br>
          <div className="form-group">
            <label>Update Frequency</label>
            <select
              {...register("frequency", { required: true })}
              className="form-control"
            >
              <option value="">Select an update frequency...</option>
              <option value="1">15 minutes</option>
              <option value="2">30 minutes</option>
              <option value="3">1 hour</option>
              <option value="4">4 hours</option>
              <option value="5">12 hours</option>
              <option value="6">1 day</option>
            </select>
          </div>
          <br></br>
          <div className="form-check feedParams">
            <input
              {...register("purge")}
              className="form-check-input"
              type="checkbox"
              name="purge"
            />
            <label className="form-check-label"> Purge on update </label>
          </div>
        </div>
      </div>
      <br></br>
      <Modal.Footer>
        <Button type="submit" className="btn btn-primary">
          Create
        </Button>
      </Modal.Footer>
    </form>
  );
}

export default CreateFeedModalForm;
