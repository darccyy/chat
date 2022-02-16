import { Component } from "react";
import { Outlet, Link } from "react-router-dom";

import "../scss/Layout.scss";

class Layout extends Component {
  render() {
    // Basic layout for all pages
    return (
      <>
        {/* Header text */}
        <header>
          <Link to="/" title="Home Page">
            <h1>React Express Test</h1>
          </Link>

          <Link to="/contact">Contact</Link>

          <Link to="/this/a/random/link">404 Page</Link>
        </header>

        {/* This is where the rest of the page goes - In index.js */}
        <Outlet />
      </>
    );
  }
}

export default Layout;
