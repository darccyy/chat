import { Component } from "react";

import "../scss/Home.scss";

import AuthTest from "../js/AuthTest";
import Log from "../js/Log";

class Home extends Component {
  render() {
    // Home page
    return (
      <div className="Home">
        <h1>Log</h1>

        {/* Auth Test */}
        <AuthTest />

        {/* Logs */}
        <Log />
      </div>
    );
  }
}

export default Home;
