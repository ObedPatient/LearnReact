import { useState } from "react";
import Alert from "./components/Alert";
import { Button } from "./components/Button";

function App() {
  const [alerVisible, setAlerVisibility] = useState(false);
  return (
    <>
      <div>
        {alerVisible && (
          <Alert onClose={() => setAlerVisibility(false)}>Hello world</Alert>
        )}
      </div>

      <div>
        <Button color="secondary" onClick={() => setAlerVisibility(true)}>
          My button
        </Button>
      </div>
    </>
  );
}
export default App;
