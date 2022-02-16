import { Component } from "react";
import $ from "jquery";

import "../scss/Log.scss";

export default class extends Component {
  // Initialize state variable
  state = { input: "" };

  // Fetch message from server, Add to state
  componentDidMount() {
    this.get();
  }

  get = async () => {
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

  post = async () => {
    console.log("post");

    try {
      var res = await fetch(
        `/api/log/post?channel=root&content=${this.state.input}`
      );
      console.log(res);
      this.get();
    } catch (err) {
      console.error(err);
    }
  };

  clear = async () => {
    console.log("clear");

    try {
      var res = await fetch(`/api/log/clear?channel=root`);
      console.log(res);
      this.get();
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    console.log("state", this.state);

    return (
      <div className="Log">
        <input
          type="text"
          id="input"
          name="input"
          onChange={(event) =>
            this.setState({ [event.target.name]: event.target.value })
          }
          autoFocus
        />
        <button onClick={this.post}>Post</button>
        <button onClick={this.get}>Refresh</button>
        <button onClick={this.clear}>CLEAR MESSAGES</button>

        <ul className="Message">
          {!this.state.log ? (
            <span>Loading log...</span>
          ) : this.state.log.length < 1 ? (
            <span>No messages</span>
          ) : (
            this.state.log
              .sort((a, b) => {
                if (a.time > b.time) {
                  return -1;
                }
                if (a.time < b.time) {
                  return 1;
                }
                return 0;
              })
              .map((item, index) => {
                return (
                  <li key={index}>
                    {item.content} <span class="time">{new Date(item.time).toLocaleDateString()}</span>
                  </li>
                );
              })
          )}
        </ul>
      </div>
    );
  }
}
