interface feedProps {
  feedId: string;
  feedName: string;
}

function DeleteFeedModalForm(props: feedProps) {
  return (
    <div className="row">
      <h5>Are you sure you want to delete {props.feedName}?</h5>
    </div>
  );
}

export default DeleteFeedModalForm;
