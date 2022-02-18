import { Component } from "react";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";

import "../scss/Log.scss";

export default class extends Component {
  state = { channel: "root", input: "", log: null, loading: 0 };
  socket = null;

  // Fetch message from server, Add to state
  componentDidMount() {
    // Initial get log
    this.get();

    // Setup socket
    this.socket = io.connect("/chat"); // Namespace chat (Does not change...for now)
    this.socket.emit("join", "root"); // Request join room of channel
    // Server connection
    this.socket = this.socket.on("connect", function () {
      console.log("! Server connect");
    });
    this.socket.on("disconnect", function () {
      console.warn("! Server disconnect");
    });

    // Refresh from server
    const self = this; // Access 'this' in callback
    this.socket.on("refresh", function (data) {
      self.setState({ log: data.log });
      self.setState({ loading: Math.max(0, self.state.loading - 1) });
    });

    // Refresh from client every 30 seconds
    setInterval(this.get, 30000);
  }

  // Get logs
  get = async (channel) => {
    if (!channel || channel.constructor !== String) {
      channel = this.state.channel;
    }
    console.log("get", channel);
    this.setState({ loading: this.state.loading + 1 });

    try {
      var res = await fetch(`/api/log/get?channel=${channel}`);
      var json = await res.json();
      this.setState({
        log: json,
      });
      this.setState({ loading: Math.max(0, this.state.loading - 1) });
      console.log("get end");
    } catch (err) {
      console.error(err);
      this.setState({ loading: Math.max(0, this.state.loading - 1) });
    }
  };

  // Post message
  post = async () => {
    console.log("post", this.state.channel);
    this.setState({ loading: this.state.loading + 1 });

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

  // Clear all messages (Testing)
  clear = async () => {
    console.log("clear");

    // Cutting edge security :)
    if (prompt("What is the password?", "Hint: It's not 1234") !== "1234") {
      alert("Incorrect!");
      return;
    }

    try {
      var res = await fetch(`/api/log/clear?channel=${this.state.channel}`);
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
        <h2>
          Channel <code>{this.state.channel}</code>
        </h2>

        {/* Message content */}
        <input
          type="text"
          id="input"
          name="input"
          onChange={(event) =>
            this.setState({ [event.target.name]: event.target.value })
          }
          autoFocus
        />

        {/* Channel */}
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

        {/* Refresh */}
        <button onClick={this.get} disabled={this.state.loading}>
          <span className={this.state.loading ? "spin" : ""}>
            <FontAwesomeIcon icon={faRedo} />
          </span>
        </button>
        {/* Clear messages */}
        <button onClick={this.clear}>CLEAR MESSAGES</button>

        {/* Log */}
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
