import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../App.css";

function Home() {
  return (
    <div className="app">

      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">

          <p className="hero-tag">
            AI-POWERED DISASTER ASSESSMENT
          </p>

          <h1>
            Assess Damage.
            <br />
            Estimate Loss.
            <br />
            <span>Recover Faster.</span>
          </h1>

          <p className="hero-description">
            DisasterAid uses artificial intelligence to analyze
            disaster-damaged properties, estimate losses, and
            assist with transparent compensation assessment.
          </p>

          <div className="hero-buttons">

            {/* Submit Claim */}
            <Link
              to="/login"
              className="primary-btn"
            >
              Submit a Claim
            </Link>

            {/* Learn More */}
            <a
              href="#how-it-works"
              className="secondary-btn"
            >
              Learn More
            </a>

          </div>
        </div>

        {/* Hero Card */}
        <div className="hero-card">

          <div className="damage-icon">
            🏠
          </div>

          <h3>
            AI Damage Assessment
          </h3>

          <p>
            Upload an image of your damaged property and let
            our AI-assisted system analyze the damage.
          </p>

          <div className="assessment-status">
            <span>●</span>
            AI Analysis Ready
          </div>

        </div>
      </section>


      {/* How It Works Section */}
      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-heading">

          <p>
            HOW IT WORKS
          </p>

          <h2>
            From Disaster to Recovery
          </h2>

          <span>
            A simple process designed to make damage assessment
            faster and more transparent.
          </span>

        </div>


        <div className="steps">

          {/* Step 1 */}
          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              📷
            </div>

            <h3>
              Upload Image
            </h3>

            <p>
              Upload clear images of your damaged property
              after a disaster.
            </p>

          </div>


          {/* Step 2 */}
          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              🤖
            </div>

            <h3>
              AI Analysis
            </h3>

            <p>
              AI compares your image with verified disaster
              images and assesses the damage.
            </p>

          </div>


          {/* Step 3 */}
          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              📊
            </div>

            <h3>
              Loss Estimation
            </h3>

            <p>
              The system estimates the physical damage and
              potential financial loss.
            </p>

          </div>


          {/* Step 4 */}
          <div className="step-card">

            <div className="step-number">
              04
            </div>

            <div className="step-icon">
              💰
            </div>

            <h3>
              Compensation
            </h3>

            <p>
              A recommended compensation amount is generated
              for authorized officer review.
            </p>

          </div>

        </div>

      </section>


      {/* Features Section */}
      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <p>
            WHY DISASTERAID
          </p>

          <h2>
            Technology for Faster Recovery
          </h2>

        </div>


        <div className="features">

          {/* Feature 1 */}
          <div className="feature-card">

            <span>🤖</span>

            <h3>
              AI-Assisted Assessment
            </h3>

            <p>
              Computer vision helps identify and evaluate
              visible disaster damage.
            </p>

          </div>


          {/* Feature 2 */}
          <div className="feature-card">

            <span>🔍</span>

            <h3>
              Verified Image Comparison
            </h3>

            <p>
              Compare submitted images with a verified
              after-disaster image dataset.
            </p>

          </div>


          {/* Feature 3 */}
          <div className="feature-card">

            <span>📍</span>

            <h3>
              Location Based Analysis
            </h3>

            <p>
              Property location and type can improve the
              relevance of reference images.
            </p>

          </div>


          {/* Feature 4 */}
          <div className="feature-card">

            <span>🛡️</span>

            <h3>
              Human Verification
            </h3>

            <p>
              AI recommendations are reviewed by authorized
              officers before final approval.
            </p>

          </div>

        </div>

      </section>


      {/* About Section */}
      <section
        className="about-section"
        id="about"
      >

        <div>

          <p className="section-label">
            ABOUT DISASTERAID
          </p>

          <h2>
            Helping communities recover
            <br />
            after disasters.
          </h2>

        </div>


        <p>
          DisasterAid is an AI-assisted platform designed
          to simplify disaster damage assessment and
          compensation workflows. It connects applicants,
          AI-based analysis, verified disaster evidence,
          and authorized officers in one platform.
        </p>

      </section>


      {/* Footer */}
      <footer className="footer">

        <div>

          <strong>
            🌊 DisasterAid
          </strong>

          <p>
            AI-assisted disaster damage assessment platform.
          </p>

        </div>


        <div>

          <p>
            © 2026 DisasterAid
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;