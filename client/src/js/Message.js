import { Component } from "react";

import "../scss/Message.scss";

class Message extends Component {
  // Initialize state variable
  state = {};

  // Fetch message from server, Add to state
  componentDidMount() {
    this.getLog();
  }

  getLog = async () => {
    console.log("get");

    try {
      var res = await fetch("/api/log/get?channel=root");
      var json = await res.json();
      this.setState({
        log: json,
      });
    } catch (err) {
      console.error(err);
    }
  };

  postLog = async () => {
    console.log("post");

    try {
      var res = await fetch(
        `/api/log/post?channel=root&content=Test${Date.now()}`
      );
      console.log(res);
      this.getLog();
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    console.log(this.state);
    // Display server message
    return (
      <>
        <button onClick={this.postLog}>Send</button>

        <ul className="Message">
          {!this.state.log ? (
            <li>Loading log...</li>
          ) : (
            this.state.log.map((item, index) => {
              return <li key={index}>{item.content}</li>;
            })
          )}
        </ul>
      </>
    );
  }
}

export default Message;
