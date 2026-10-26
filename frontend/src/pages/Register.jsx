import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Register() {

  const navigate = useNavigate();

  // Store form values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  // Store terms checkbox
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Success / error message
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // Handle input changes
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };


  // Handle registration
  const handleSubmit = async (e) => {

    e.preventDefault();

    // Clear previous messages
    setMessage("");
    setError("");


    // Check password
    if (formData.password !== formData.confirmPassword) {

      setError("Passwords do not match.");

      return;
    }


    // Check terms
    if (!termsAccepted) {

      setError(
        "Please agree to the DisasterAid terms and conditions."
      );

      return;
    }


    try {

      setLoading(true);


      // Send registration request to FastAPI
      const response = await fetch(
        "http://127.0.0.1:8000/users/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
          })
        }
      );


      const data = await response.json();


      // Backend error
      if (!response.ok) {

        setError(
          data.detail || "Registration failed. Please try again."
        );

        return;
      }


      // Registration successful
      setMessage(
        "Account created successfully! Redirecting to login..."
      );


      // Redirect to login after 1.5 seconds
      setTimeout(() => {

        navigate("/login");

      }, 1500);


    } catch (error) {

      console.error("Registration error:", error);

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
            JOIN DISASTERAID
          </p>


          <h1>
            Start your recovery journey.
          </h1>


          <p>
            Create your account to register your property,
            submit disaster claims, track assessments, and
            view compensation updates.
          </p>

        </div>

      </div>



      {/* Right Side */}

      <div className="auth-form-container">

        <div className="auth-form">


          <h2>
            Create your account
          </h2>


          <p className="auth-subtitle">
            Register as a disaster claim applicant.
          </p>



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



          {/* Success Message */}

          {message && (

            <div
              style={{
                backgroundColor: "#dcfce7",
                color: "#166534",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px"
              }}
            >
              {message}
            </div>

          )}



          <form onSubmit={handleSubmit}>


            {/* Full Name */}

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>



            {/* Email */}

            <div className="form-group">

              <label htmlFor="register-email">
                Email Address
              </label>

              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>



            {/* Phone */}

            <div className="form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>



            {/* Password */}

            <div className="form-group">

              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                minLength="8"
                required
              />

            </div>



            {/* Confirm Password */}

            <div className="form-group">

              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength="8"
                required
              />

            </div>



            {/* Terms */}

            <label className="terms-checkbox">

              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) =>
                  setTermsAccepted(e.target.checked)
                }
              />

              <span>
                I agree to the DisasterAid terms and conditions.
              </span>

            </label>



            {/* Register Button */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"
              }

            </button>


          </form>



          {/* Login Link */}

          <p className="auth-register">

            Already have an account?

            <Link to="/login">
              Login
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

export default Register;