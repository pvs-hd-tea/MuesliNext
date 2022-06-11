import React from "react";
import ReactDOM from "react-dom/client";
import Button from "./components/Widgets/ButtonWidget";
import Page from "./components/Page";
import Text from "./components/Widgets/TextWidget";

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
      <Page title="Demo Page">
        <div>
          <Button onClick={this.increment} text="Click me" />
          <Text text={this.state.myNumber} />
        </div>
      </Page>
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
