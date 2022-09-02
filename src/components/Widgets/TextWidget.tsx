import React from "react";

interface Props {
  text: string;
}

export default class Text extends React.Component<Props> {
  render() {
    const text = this.props.text;
    return (
      <div className="bg-slate-100 text ml-2 mr-2  m-1 p-1 pl-3 pr-3">
        {text}
      </div>
    );
  }
}
