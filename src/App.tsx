import React from "react";
import { Layout } from "antd";
import CharacterList from "./components/CharacterList";
import "antd/dist/antd.css";
import "./styles/antd-overrides.css";

const { Header, Content } = Layout;

function App() {
  return (
    <div className="custom-theme app-container">
      <header style={{ padding: 16 }}>
        <h1 style={{ margin: 0 }}>SWAPI — Personagens</h1>
      </header>
      <main style={{ padding: 16 }}>
        <CharacterList />
      </main>
    </div>
  );
}

export default App;
