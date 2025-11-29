import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <Sparkles size={28} className="header-icon" />
          <h1 className="header-title">Star Wars Universe</h1>
        </div>
        <nav className="header-nav">
          <a href="#characters" className="nav-link active">
            Personagens
          </a>
        </nav>
      </div>
    </header>
  );
}
