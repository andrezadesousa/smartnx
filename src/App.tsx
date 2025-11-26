import React from "react";
import { Layout } from "antd";
import CharacterList from "./components/CharacterList";
import "antd/dist/antd.css";

const { Header, Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ color: "#fff", fontSize: 20 }}>
        SWAPI - Personagens
      </Header>
      <Content style={{ padding: "24px" }}>
        <CharacterList />
      </Content>
    </Layout>
  );
}

export default App;
