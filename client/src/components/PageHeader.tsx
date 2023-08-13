function PageHeader() {
  const FunnyMessages: Array<string> = [
    "Sow some feeds so you can plow through logs",
    "From seedlings of suspicion to fully-grown findings!",
    "Moo-ve over hackers, we're herding threats now!",
    "Fertilize your defenses, stifle the offenses.",
    "Turnip the security, beet down the threats!",
    "Don't let threats grow wild, cultivate security!",
  ];

  const GetRandomFunnyMessage = () => {
    return FunnyMessages[Math.floor(Math.random() * FunnyMessages.length)];
  };

  return (
    <>
      <div className="container">
        <div className="page-header text-center" id="page-header">
          <br></br>
          <h1>
            <strong>Threat Farmer</strong>
          </h1>
          <h6>{GetRandomFunnyMessage()}</h6>
        </div>
      </div>
    </>
  );
}

export default PageHeader;
