import { Component } from "react";

import "../scss/Contact.scss";

import Message from "../js/Message";

class Contact extends Component {
  render() {
    // Contact page
    return (
      <div className="Contact">
        <h1>Contact Page</h1>

        {/* Display server message */}
        <Message />
      </div>
    );
  }
}

export default Contact;
