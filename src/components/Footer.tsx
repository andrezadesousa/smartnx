import React from "react";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <p className="footer-text">
        © {new Date().getFullYear()} — Todos os direitos reservados.
      </p>
    </footer>
  );
}
