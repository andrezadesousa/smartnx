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
      <div className="loading-screen" role="status" aria-live="polite">
        <img src="/loading.gif" alt="Loading" className="loading-image" />
      </div>
    );
  }

  return (
    <div className="custom-theme">
      <div className="app-container">
        <main className="main-content">
          <CharacterList />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
