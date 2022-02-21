import { Component } from "react";

import "../scss/Error404.scss";

export default class extends Component {
  render() {
    // 404 page
    return (
      <div className="Error404">
        <h1>404 - Page not found</h1>
      </div>
    );
  }
}