import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      {/* Logo */}
      <Link to="/" className="logo">
        🌊 DisasterAid
      </Link>

      {/* Navigation Links */}
      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <a href="/#how-it-works">
          How It Works
        </a>

        <a href="/#features">
          Features
        </a>

        <a href="/#about">
          About
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "6px" }}>
          <Link to="/login" className="login-btn" title="Citizen & Applicant Login">
            Login
          </Link>

          <Link to="/register" className="register-btn">
            Register
          </Link>

          <Link
            to="/admin/login"
            className="officer-btn"
            title="Official Disaster Assessment & Verification Officer Access"
          >
            <span>🛡️</span> Officer Portal
          </Link>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;