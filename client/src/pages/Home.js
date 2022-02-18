import { Component } from "react";

import "../scss/Home.scss";

import Log from "../js/Log";

class Home extends Component {
  render() {
    // Home page
    return (
      <div className="Home">
        <h1>Log</h1>

        {/* Logs */}
        <Log />
      </div>
    );
  }
}

export default Home;
