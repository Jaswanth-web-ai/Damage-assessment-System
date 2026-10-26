import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFillDemoAdmin = () => {
    setFormData({
      email: "jaswanth@gmail.com",
      password: "JaswanthOfficer2026!",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/users/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend returns 403 if an applicant tries to log in, or 401 if invalid credentials
        setError(
          data.detail ||
            "Authentication failed. Please verify your officer credentials."
        );
        return;
      }

      // Success: Save into dedicated ADMIN token namespaces to prevent clobbering citizen sessions
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("admin_access_token", data.access_token);
      storage.setItem("admin_user", JSON.stringify(data.user));

      setSuccessMsg("Officer credentials verified. Redirecting to Command Center...");

      setTimeout(() => {
        navigate("/admin");
      }, 700);
    } catch (err) {
      console.error("Admin login error:", err);
      setError(
        "Unable to connect to the DisasterAid Security Service. Please ensure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        backgroundImage:
          "radial-gradient(circle at 15% 20%, rgba(30, 58, 138, 0.45) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(15, 23, 42, 0.8) 0%, transparent 40%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px 16px",
        fontFamily: "'Inter', sans-serif",
        color: "#f8fafc",
      }}
    >
      {/* Top Banner Notice */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          marginBottom: "18px",
          backgroundColor: "rgba(30, 41, 59, 0.7)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          borderRadius: "10px",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "13px",
          color: "#cbd5e1",
        }}
      >
        <span>
          <strong style={{ color: "#38bdf8" }}>Official Agency Portal</strong> • Restricted
          Access
        </span>
        <Link
          to="/login"
          style={{
            color: "#60a5fa",
            textDecoration: "underline",
            fontWeight: "500",
            fontSize: "12px",
          }}
        >
          Citizen Login →
        </Link>
      </div>

      {/* Main Login Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#1e293b",
          borderRadius: "16px",
          padding: "36px 32px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
          border: "1px solid #334155",
        }}
      >
        {/* Header with Badge */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              backgroundColor: "rgba(14, 165, 233, 0.15)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              fontSize: "26px",
              marginBottom: "14px",
            }}
          >
            🛡️
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#ffffff",
              margin: "0 0 6px 0",
              letterSpacing: "-0.02em",
            }}
          >
            Officer Verification Command
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            Official access for Disaster Assessment Officers, Verification Authorities & Administrators.
          </p>
        </div>

        {/* Demo Fast-fill Pill */}
        <div
          style={{
            marginBottom: "20px",
            padding: "10px 12px",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            border: "1px dashed rgba(129, 140, 248, 0.5)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#c7d2fe",
          }}
        >
          <span>Officer: <strong>jaswanth@gmail.com</strong></span>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            style={{
              backgroundColor: "#087f8c",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "11px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Auto Fill
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#fca5a5",
              padding: "12px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "20px",
              lineHeight: "1.4",
            }}
          >
            <strong>⚠️ Access Denied:</strong> {error}
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              border: "1px solid rgba(34, 197, 94, 0.4)",
              color: "#86efac",
              padding: "12px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "20px",
            }}
          >
            ✓ {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#cbd5e1",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Officer ID / Agency Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="e.g. jaswanth@gmail.com"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "8px",
                border: "1px solid #475569",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                fontSize: "14px",
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#38bdf8")}
              onBlur={(e) => (e.target.style.borderColor = "#475569")}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#cbd5e1",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Authorization Security Key
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "8px",
                border: "1px solid #475569",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                fontSize: "14px",
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#38bdf8")}
              onBlur={(e) => (e.target.style.borderColor = "#475569")}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              fontSize: "13px",
              color: "#94a3b8",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              Keep officer session active
            </label>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              256-bit Encrypted
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "7px",
              border: "none",
              backgroundColor: loading ? "#066d78" : "#087f8c",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? "Authenticating Officer..." : "Sign In to Officer Portal →"}
          </button>
        </form>

        {/* Security Notice Footer */}
        <div
          style={{
            marginTop: "26px",
            paddingTop: "20px",
            borderTop: "1px solid #334155",
            textAlign: "center",
            fontSize: "12px",
            color: "#64748b",
            lineHeight: "1.6",
          }}
        >
          <p style={{ margin: "0 0 6px 0" }}>
            This system is for authorized disaster response personnel only. All access
            attempts, verification decisions, and audits are permanently logged.
          </p>
          <div style={{ marginTop: "12px" }}>
            <Link
              to="/login"
              style={{
                color: "#38bdf8",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              ← Return to Citizen & Applicant Login
            </Link>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "24px", fontSize: "12px", color: "#475569" }}>
        © 2026 DisasterAid Assessment System • National Disaster Management Framework
      </div>
    </div>
  );
}

export default AdminLogin;
