import { Component } from "react";
// import React from "react";
import { io } from "socket.io-client";

import "../scss/Log.scss";

export default class extends Component {
  state = { channel: "root", input: "", log: null };
  socket = null;

  componentDidMount() {
    this.get();

    this.socket = io.connect("/chat");
    this.socket.emit("join", "root");
    this.socket = this.socket.on("connect", function () {
      console.log("! Server connect");
    });

    this.socket.on("disconnect", function () {
      console.warn("! Server disconnect");
    });

    this.socket.on("test", function (data) {
      console.warn("!!! TEST SOCKET SENT", data);
    });

    const self = this; // Access 'this' in callback
    this.socket.on("refresh", function (data) {
      self.setState({ log: data.log });
    });
  }

  get = async (channel) => {
    console.log("get", channel || this.state.channel);

    try {
      var res = await fetch(`/api/log/get?channel=${channel || this.state.channel}`);
      var json = await res.json();
      this.setState({
        log: json,
      });
    } catch (err) {
      console.error(err);
    }
  };

  post = async () => {
    console.log("post", this.state.channel);

    try {
      var res = await fetch(
        `/api/log/post?channel=${this.state.channel}&content=${this.state.content}`
      );
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  clear = async () => {
    console.log("clear");

    try {
      var res = await fetch(`/api/log/clear?channel=${this.state.content}`);
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
        <h2>Channel <code>{this.state.channel}</code></h2>

        <input
          type="text"
          name="content"
          onChange={(event) =>
            this.setState({ [event.target.name]: event.target.value })
          }
          autoFocus
          onKeyDown={(event) => (event.key === "Enter" ? this.post() : null)}
          placeholder="Message Content"
        />

        <input
          type="text"
          name="channel"
          onInput={(event) => {
            if (event.target.value === this.state.channel) {
              return;
            }

            if (event.target.value) {
              this.setState({ [event.target.name]: event.target.value });
              this.socket.emit("join", event.target.value);
              this.get(event.target.value);
            }
          }}
          placeholder="Channel"
          defaultValue={this.state.channel}
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
