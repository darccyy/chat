import { Component } from "react";

import "../scss/Home.scss";

import Message from "../js/Message";

class Home extends Component {
  render() {
    // Home page
    return (
      <div className="Home">
        <h1>Home Page</h1>

        {/* Display server message */}
        <Message />
      </div>
    );
  }
}

export default Home;
