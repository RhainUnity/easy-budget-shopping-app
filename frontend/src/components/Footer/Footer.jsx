// src/components/Footer/Footer.jsx
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Easy Budget Shopping App by Jeremy Schmidt
      </p>
    </footer>
  );
}

export default Footer;
