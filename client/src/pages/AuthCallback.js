import { Component } from "react";

import "../scss/AuthCallback.scss";

export default class extends Component {
  state = {url: null}

  componentDidMount = async () => {
    try {
      var res = await fetch(
        `/api/home?code=${
          window.location.search.substring(1).split("code=")[1]
        }`
      );

      console.log(res, res.status);
      if (res.status === 200) {
        var json = await res.json();
        console.log("accessToken", json.accessToken);
        this.setState({url: `/?access_token=${json.accessToken}`});
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <div className="AuthCallback">
        {this.state.url ? (
          <a href={this.state.url}>{"Click here: " + this.state.url}</a>
        ) : (
          "Loading..."
        )}
      </div>
    );
  }
}
