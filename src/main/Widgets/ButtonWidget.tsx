import React from "react"

interface Props {
    text: string
    onClick: () => void
}
  
export default class Button extends React.Component<Props> {

    render() {
        const text = this.props.text
        const onClick = this.props.onClick

  	    return (
        <button onClick={onClick}>{text}</button>
    );
  }
}