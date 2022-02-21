import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

// Pages
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Error404 from "./pages/Error404";

export default function App() {
  // Router
  return (
    <Auth0Provider
      domain="chap.au.auth0.com"
      clientId="GEsPM1bpvXMv10SQkaCO29sJgxsplgFi"
      redirectUri={window.location.origin}
    >
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Layout />}>
            {/* Home page */}
            <Route index element={<Home />} />

            {/* 404 page */}
            <Route path="*" element={<Error404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
