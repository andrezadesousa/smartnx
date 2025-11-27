import React, { useEffect, useState } from "react";
import CharacterList from "./components/CharacterList";
import "antd/dist/antd.css";
import Footer from "./components/Footer";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          background: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src="/loading.gif"
          alt="Loading"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  }

  return (
    <div className="custom-theme">
      <div className="app-container">
        <main style={{ padding: 16 }}>
          <CharacterList />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
