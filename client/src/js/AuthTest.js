import { Component } from "react";

import "../scss/AuthTest.scss";

export default class extends Component {
  state = { data: null };

  componentDidMount = async () => {
    try {
      const token = window.location.search
        .substring(1)
        .split("access_token=")[1];
      console.log(token);
      this.setState({ token });

      var res = await fetch("https://api.github.com/user", {
        headers: {
          // Include the token in the Authorization header
          Authorization: "token " + token,
        },
      });

      // Parse the response as JSON
      var json = await res.json();
      this.setState({ json });

      // Once we get the response (which has many fields)
      // Documented here: https://developer.github.com/v3/users/#get-the-authenticated-user
      // Write "Welcome <user name>" to the documents body
      document.body.appendChild(nameNode);
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <div className="AuthTest">
        <a href="https://github.com/login/oauth/authorize?client_id=ad9b5577e89e3e1ba247">
          Login with GitHub
        </a>

        <p>
          {!this.state.json
            ? "Loading..."
            : "Welcome, " + (this.state.json.name || "UNKNOWN")}
        </p>
        <p>
          {!this.state.json
            ? "Loading..."
            : JSON.stringify(this.state.json, null, 2)}
        </p>
      </div>
    );
  }
}
