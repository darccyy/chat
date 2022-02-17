import { Component } from "react";
// import React from "react";
import { io } from "socket.io-client";

import "../scss/Log.scss";

export default class extends Component {
  state = { input: "", log: null };

  componentDidMount() {
    this.get();

    var socket = io.connect("/chat");
    socket.on("connect", function () {
      console.log("! Server connect");
    });

    socket.on("disconnect", function () {
      console.warn("! Server disconnect");
    });

    socket.on("test", function (data) {
      console.warn("!!! TEST SOCKET SENT", data);
    });

    const self = this; // Access 'this' in callback
    socket.on("refresh", function (data) {
      self.setState({log: data.log});
    });
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
          onKeyDown={(event) => (event.key === "Enter" ? this.post() : null)}
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
                    {item.content}{" "}
                    <span className="time">
                      {new Date(item.time).toLocaleDateString()}
                    </span>
                  </li>
                );
              })
          )}
        </ul>
      </div>
    );
  }
}
