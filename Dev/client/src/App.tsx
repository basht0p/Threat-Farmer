import PageHeader from "./components/PageHeader";
import Tabify from "./components/Tabify";
import { SocketProvider } from "./contexts/SocketProvider";

function App() {
  return (
    <SocketProvider>
      <div className="container">
        <PageHeader />
        <Tabify />
      </div>
    </SocketProvider>
  );
}

export default App;
