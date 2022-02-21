import "../scss/Home.scss";

import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../js/LoginButton";
import LogoutButton from "../js/LogoutButton";
import User from "../js/User";
import Log from "../js/Log";

export default function Home() {
  const { isAuthenticated } = useAuth0();

  // Home page
  return (
    <div className="Home">
      {!isAuthenticated ? (
        <div>
          <p style={{ fontSize: "1.5rem" }}>Please Login.</p>
          <LoginButton />
        </div>
      ) : (
        <div>
          <LogoutButton />
          <User />
        </div>
      )}

      <hr />

      <h1>Log</h1>

      {/* Logs */}
      <Log />
    </div>
  );
}
