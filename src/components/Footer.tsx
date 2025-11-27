export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        padding: "20px 0",
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "0.9rem",
        marginTop: "40px",
      }}
    >
      <p style={{ opacity: 0.7 }}>
        © {new Date().getFullYear()} — Todos os direitos reservados.
      </p>
    </footer>
  );
}
