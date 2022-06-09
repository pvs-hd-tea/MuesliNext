import React from "react";
import ReactDOM from "react-dom/client";
import Button from "./main/Widgets/ButtonWidget";
import Text from "./main/Widgets/TextWidget";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

interface State {
  myNumber: string;
}

class App extends React.Component<Props, State> {
  state = {
    myNumber: "hi",
  };
  increment = () => {
    this.setState((prevState) => ({
      myNumber: prevState.myNumber + " bla",
    }));
  };
  render() {
    return (
      <div>
        <Button onClick={this.increment} text="Click me" />
        <Text text={this.state.myNumber} />
      </div>
    );
  }
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
