import { Toaster } from "react-hot-toast";
import Home from "./component/Home";

const App = () => {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "0.8rem",
          },
        }}
      />
      <Home />
    </>
  );
};

export default App;
