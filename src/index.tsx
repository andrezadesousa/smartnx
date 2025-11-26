import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ConfigProvider } from "antd";
import "antd/dist/antd.css";
import "./styles/theme.css";
import "./styles/antd-overrides.css";

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
