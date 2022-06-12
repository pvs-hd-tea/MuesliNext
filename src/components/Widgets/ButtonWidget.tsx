import React from "react";

interface Props {
  text: string;
  onClick: () => void;
}

export default class Button extends React.Component<Props> {
  render() {
    const text = this.props.text;
    const onClick = this.props.onClick;

    return (
      <button
        className="text-white bg-green-500 shadow- ml-3 p-1 pl-3 pr-3 rounded-lg"
        onClick={onClick}
      >
        {text}
      </button>
    );
  }
}
