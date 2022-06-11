import React from "react";

interface Props {
  text: string;
}

export default class Text extends React.Component<Props> {
  render() {
    const text = this.props.text;
    return <div className="text">{text}</div>;
  }
}
