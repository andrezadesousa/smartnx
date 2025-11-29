"use client";

import { useEffect, useState } from "react";
import CharacterList from "./components/CharacterList";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "antd/dist/antd.css";

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
      <Header />
      <main className="main-content">
        <CharacterList />
      </main>
      <Footer />
    </div>
  );
}

export default App;
