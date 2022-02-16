import { Component } from "react";

import "../scss/Message.scss"

class Message extends Component {
  // Initialize state variable
  state = {};

  // Fetch message from server, Add to state
  componentDidMount() {
    fetch("/api/test")
      .then(res => res.json())
      .then(json => this.setState(json));
  }

  render() {
    // Display server message
    return (
      <p className="Message">
        <strong>Server Message:</strong>{" "}
        {this.state.message || "Loading message..."}
      </p>
    );
  }
}

export default Message;
