import { Heart, Code, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">
              <Sparkles size={16} />
              Star Wars Universe
            </h3>
            <p className="footer-description">
              Explore a galáxia de Star Wars e descubra informações detalhadas
              sobre seus personagens favoritos.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Recursos</h4>
            <ul className="footer-links">
              <li>
                <a href="#characters">Personagens</a>
              </li>
              <li>
                <a href="#about">Sobre o Projeto</a>
              </li>
              <li>
                <a href="#api">API SWAPI</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Informações</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="https://swapi.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SWAPI.dev
                </a>
              </li>
              <li>
                <a href="#privacy">Privacidade</a>
              </li>
              <li>
                <a href="#terms">Termos de Uso</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            Desenvolvido com <Heart size={14} className="footer-heart" /> e{" "}
            <Code size={14} /> • © 2025 Star Wars Universe
          </p>
          <p className="footer-attribution">
            Dados fornecidos por{" "}
            <a
              href="https://swapi.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              SWAPI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
