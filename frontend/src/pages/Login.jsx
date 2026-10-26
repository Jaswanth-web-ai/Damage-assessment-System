import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Login() {

  const navigate = useNavigate();

  // Store login form values
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Remember me
  const [rememberMe, setRememberMe] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Error message
  const [error, setError] = useState("");


  // Handle input changes
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };


  // Handle login
  const handleSubmit = async (e) => {

    e.preventDefault();

    // Clear previous error
    setError("");

    try {

      setLoading(true);


      // Send login request to FastAPI
      const response = await fetch(
        "http://127.0.0.1:8000/users/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        }
      );


      const data = await response.json();


      // Backend returned an error
      if (!response.ok) {

        setError(
          data.detail || "Invalid email or password."
        );

        return;
      }


      // Login successful
      console.log("Login successful:", data);


      // Store JWT token based on role to maintain strict session isolation
      const storage = rememberMe ? localStorage : sessionStorage;

      if (data.user?.role === "admin") {
        storage.setItem("admin_access_token", data.access_token);
        storage.setItem("admin_user", JSON.stringify(data.user));
        navigate("/admin");
      } else {
        storage.setItem("access_token", data.access_token);
        storage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      }


    } catch (error) {

      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please make sure the FastAPI backend is running."
      );

    } finally {

      setLoading(false);

    }

  };


  return (
    <div className="auth-page">


      {/* Left Side */}

      <div className="auth-info">

        <Link to="/" className="auth-logo">
          🌊 DisasterAid
        </Link>

        <div className="auth-info-content">

          <p className="auth-label">
            DISASTERAID PLATFORM
          </p>

          <h1>
            Welcome back.
          </h1>

          <p>
            Sign in to manage your disaster claims,
            track assessments, and view compensation
            updates.
          </p>

        </div>

      </div>



      {/* Right Side */}

      <div className="auth-form-container">

        <div className="auth-form">

          <div style={{ display: "inline-block", background: "#e0f2fe", color: "#0369a1", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase" }}>
            Citizen & Applicant Portal
          </div>
          <h2>
            Sign in to your account
          </h2>

          <p className="auth-subtitle">
            Enter your details to track claims and compensation.
          </p>

          {/* Officer Portal Redirect Callout */}
          <div
            style={{
              backgroundColor: "#1e1b4b",
              color: "#e0e7ff",
              padding: "8px 12px",
              borderRadius: "6px",
              marginBottom: "15px",
              fontSize: "12.5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #4338ca",
            }}
          >
            <span>
              🛡️ <strong>Disaster Assessment Officer?</strong>
            </span>
            <Link
              to="/admin/login"
              style={{
                color: "#a5b4fc",
                fontWeight: "600",
                textDecoration: "underline",
                fontSize: "12px",
              }}
            >
              Access Officer Portal →
            </Link>
          </div>



          {/* Error Message */}

          {error && (

            <div
              style={{
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px"
              }}
            >
              {error}
            </div>

          )}



          <form onSubmit={handleSubmit}>


            {/* Email */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>



            {/* Password */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>



            {/* Remember / Forgot */}

            <div className="form-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                Remember me

              </label>

              <a href="#">
                Forgot password?
              </a>

            </div>



            {/* Login Button */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Signing In..."
                : "Login"
              }

            </button>


          </form>



          {/* Register */}

          <p className="auth-register">

            Don't have an account?

            <Link to="/register">
              Create an account
            </Link>

          </p>



          {/* Back Home */}

          <Link
            to="/"
            className="back-home"
          >
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;