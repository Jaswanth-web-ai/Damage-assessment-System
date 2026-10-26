import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Selected claim for viewing assessment modal
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [runningAssessmentId, setRunningAssessmentId] = useState(null);

  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Fetch user's registered properties
      const propRes = await fetch("http://127.0.0.1:8000/properties/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (propRes.ok) {
        const propData = await propRes.json();
        setProperties(propData.properties || []);
      }

      // 2. Fetch user's submitted claims
      const claimRes = await fetch("http://127.0.0.1:8000/claims/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (claimRes.ok) {
        const claimData = await claimRes.json();
        setClaims(claimData.claims || []);
      }
    } catch (err) {
      setError("Failed to load dashboard data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleRunAssessment = async (claimId) => {
    setRunningAssessmentId(claimId);
    try {
      const res = await fetch(`http://127.0.0.1:8000/assessments/run/${claimId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert("AI Assessment and Compensation Recommendation generated successfully!");
        fetchDashboardData();
      } else {
        alert(data.detail || "Failed to execute assessment.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setRunningAssessmentId(null);
    }
  };

  // Real KPI statistics computed from actual records
  const totalClaimsCount = claims.length;
  const underReviewCount = claims.filter(
    (c) => c.status === "under_review" || c.status === "submitted"
  ).length;
  const approvedCount = claims.filter((c) => c.status === "approved").length;
  const totalRelief = claims.reduce((acc, c) => {
    if (c.status === "approved" && c.recommendation) {
      return acc + (c.recommendation.recommended_compensation || 0);
    }
    return acc;
  }, 0);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-logo">
          🌊 DisasterAid
        </Link>

        {/* User Identity */}
        <div className="user-info">
          <div className="user-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <strong>{user.name || "Applicant"}</strong>
            <span>{user.role === "admin" ? "Official Reviewer" : "Citizen Account"}</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link active">
            <span>📊</span> Dashboard
          </Link>
          <Link to="/property" className="sidebar-link">
            <span>🏠</span> Register Property
          </Link>
          <Link to="/claim" className="sidebar-link">
            <span>➕</span> New Claim
          </Link>
          {user.role === "admin" && (
            <Link
              to="/admin"
              className="sidebar-link"
              style={{ background: "#fee2e2", color: "#b91c1c", fontWeight: 700 }}
            >
              <span>🛡️</span> Admin Review Portal
            </Link>
          )}
        </nav>

        {/* Logout */}
        <div className="sidebar-bottom">
          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-link logout-link"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="dashboard-main">
        {/* Admin Quick Banner */}
        {user.role === "admin" && (
          <div
            style={{
              padding: "14px 20px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "10px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong style={{ color: "#1d4ed8" }}>🛡️ Administrator Access Detected</strong>
              <p style={{ fontSize: "13px", color: "#1e40af", margin: 0 }}>
                You have official claims verification privileges. Visit the Admin Portal to review evidence and decide claims.
              </p>
            </div>
            <Link
              to="/admin"
              style={{
                padding: "8px 16px",
                background: "#1d4ed8",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              Open Admin Portal →
            </Link>
          </div>
        )}

        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">APPLICANT DASHBOARD</p>
            <h1>Welcome, {user.name || "Applicant"} 👋</h1>
            <p>Track your registered properties and monitor disaster relief claim progress.</p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/property" className="secondary-btn" style={{ padding: "10px 18px", borderRadius: "8px" }}>
              + Add Property
            </Link>
            <Link to="/claim" className="dashboard-claim-btn">
              + Submit Claim
            </Link>
          </div>
        </header>

        {/* Real KPI Statistics */}
        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">🏠</div>
            <div>
              <span>Properties</span>
              <strong>{properties.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div>
              <span>Total Claims</span>
              <strong>{totalClaimsCount}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div>
              <span>Pending Review</span>
              <strong>{underReviewCount}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div>
              <span>Approved Claims</span>
              <strong style={{ color: "#16a34a" }}>{approvedCount}</strong>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <section className="dashboard-grid">
          {/* Recent Claims Section */}
          <div className="dashboard-card claims-card">
            <div className="card-heading">
              <div>
                <h2>Your Disaster Claims ({claims.length})</h2>
                <p>Real-time status of your damage assessments and compensation claims.</p>
              </div>
            </div>

            {loading ? (
              <p style={{ color: "#64748b", padding: "20px 0" }}>Loading claims...</p>
            ) : claims.length === 0 ? (
              <div style={{ padding: "30px 20px", textAlign: "center", color: "#64748b" }}>
                <p style={{ fontSize: "16px", marginBottom: "12px" }}>No disaster claims submitted yet.</p>
                <Link to="/claim" className="primary-btn" style={{ padding: "8px 16px", fontSize: "14px" }}>
                  File a Disaster Claim
                </Link>
              </div>
            ) : (
              claims.map((claim) => (
                <div key={claim.id} className="claim-row" style={{ alignItems: "center" }}>
                  <div className="claim-info">
                    <div className="claim-icon">🌊</div>
                    <div>
                      <strong>
                        {claim.disaster_type} - {claim.property_name}
                      </strong>
                      <span style={{ display: "block", fontSize: "12px", color: "#64748b" }}>
                        Claim #{claim.id} | Date: {claim.disaster_date} | {claim.image_count} Damage Photos
                      </span>
                    </div>
                  </div>

                  <span className={`status ${claim.status}`} style={{ textTransform: "capitalize" }}>
                    {claim.status.replace("_", " ")}
                  </span>

                  <div>
                    {claim.recommendation ? (
                      <strong style={{ color: "#0f172a", display: "block" }}>
                        ₹{claim.recommendation.recommended_compensation?.toLocaleString("en-IN")}
                        <span style={{ display: "block", fontSize: "11px", color: "#16a34a", fontWeight: 600 }}>
                          (Provisional Relief)
                        </span>
                      </strong>
                    ) : (
                      <button
                        onClick={() => handleRunAssessment(claim.id)}
                        disabled={runningAssessmentId === claim.id}
                        style={{
                          padding: "6px 12px",
                          background: "#087f8c",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {runningAssessmentId === claim.id ? "Analyzing..." : "⚡ Run AI Assessment"}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedClaim(claim)}
                    style={{
                      background: "transparent",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: 600,
                      color: "#334155",
                    }}
                  >
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Registered Properties Section */}
          <div className="dashboard-card properties-card">
            <div className="card-heading">
              <div>
                <h2>Your Properties ({properties.length})</h2>
                <p>Properties with registered baseline imagery.</p>
              </div>
              <Link to="/property" style={{ color: "#087f8c", textDecoration: "none", fontWeight: 700, fontSize: "13px" }}>
                + Add Property
              </Link>
            </div>

            {loading ? (
              <p style={{ color: "#64748b", padding: "20px 0" }}>Loading properties...</p>
            ) : properties.length === 0 ? (
              <div style={{ padding: "24px 10px", textAlign: "center", color: "#64748b" }}>
                <p style={{ marginBottom: "10px" }}>No registered properties found.</p>
                <Link to="/property" className="secondary-btn" style={{ fontSize: "13px", padding: "6px 12px" }}>
                  Register Baseline Property
                </Link>
              </div>
            ) : (
              properties.map((prop) => (
                <div
                  key={prop.id}
                  style={{
                    display: "flex",
                    gap: "14px",
                    padding: "14px 0",
                    borderBottom: "1px solid #f1f5f9",
                    alignItems: "center",
                  }}
                >
                  {prop.pre_disaster_image ? (
                    <img
                      src={`http://127.0.0.1:8000/files/${prop.pre_disaster_image}?token=${token}`}
                      alt={prop.property_name}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        background: "#e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      🏠
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <strong style={{ display: "block", color: "#0f172a" }}>{prop.property_name}</strong>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      {prop.property_type} ({prop.ownership}) - {prop.city_village}, {prop.district}
                    </span>
                    {prop.property_value && (
                      <span style={{ display: "block", fontSize: "12px", color: "#087f8c", fontWeight: 600 }}>
                        Declared Value: ₹{Number(prop.property_value).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* APPLICANT CLAIM DETAIL MODAL */}
        {selectedClaim && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15, 23, 42, 0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "750px",
                maxHeight: "85vh",
                overflowY: "auto",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "20px", color: "#0f172a" }}>
                  Claim #{selectedClaim.id} - {selectedClaim.property_name}
                </h2>
                <button
                  onClick={() => setSelectedClaim(null)}
                  style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: "16px", padding: "12px", background: "#f8fafc", borderRadius: "8px" }}>
                <p><strong>Disaster:</strong> {selectedClaim.disaster_type} on {selectedClaim.disaster_date}</p>
                <p><strong>Status:</strong> <span className={`status ${selectedClaim.status}`}>{selectedClaim.status}</span></p>
                {selectedClaim.damage_description && (
                  <p style={{ marginTop: "6px" }}><strong>Description:</strong> {selectedClaim.damage_description}</p>
                )}
              </div>

              {/* Assessment Summary if available */}
              {selectedClaim.assessment ? (
                <div style={{ marginBottom: "16px", padding: "14px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                  <h3 style={{ fontSize: "15px", color: "#166534", marginBottom: "8px" }}>🤖 AI Assessment Findings</h3>
                  <p><strong>Damage Severity:</strong> {selectedClaim.assessment.severity_category?.replace("_", " ").toUpperCase()}</p>
                  <p><strong>Confidence:</strong> {(selectedClaim.assessment.confidence_score * 100).toFixed(1)}%</p>
                  <p><strong>Estimated Physical Damage Ratio:</strong> {(selectedClaim.assessment.damage_score * 100).toFixed(1)}%</p>
                </div>
              ) : (
                <div style={{ marginBottom: "16px", padding: "14px", background: "#fef3c7", borderRadius: "8px" }}>
                  <p style={{ color: "#92400e" }}>AI Assessment has not yet been executed for this claim.</p>
                  <button
                    onClick={() => {
                      handleRunAssessment(selectedClaim.id);
                      setSelectedClaim(null);
                    }}
                    style={{ marginTop: "8px", padding: "6px 14px", background: "#087f8c", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  >
                    Run Assessment Now
                  </button>
                </div>
              )}

              {/* Compensation Summary */}
              {selectedClaim.recommendation && (
                <div style={{ marginBottom: "16px", padding: "14px", background: "#eff6ff", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
                  <h3 style={{ fontSize: "15px", color: "#1e40af", marginBottom: "8px" }}>💰 Recommended Provisional Compensation</h3>
                  <strong style={{ fontSize: "20px", color: "#1d4ed8" }}>
                    ₹{selectedClaim.recommendation.recommended_compensation?.toLocaleString("en-IN")}
                  </strong>
                  <p style={{ fontSize: "12px", color: "#1e40af", marginTop: "4px" }}>
                    (Provisional estimate subject to official review officer confirmation).
                  </p>
                </div>
              )}

              {/* Photographs */}
              <h3 style={{ fontSize: "15px", color: "#0f172a", marginBottom: "8px" }}>Submitted Photographs</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
                {selectedClaim.images?.map((img, idx) => (
                  <img
                    key={img.id || idx}
                    src={`http://127.0.0.1:8000/files/${img.image_path}?token=${token}`}
                    alt={`Damaged View ${idx + 1}`}
                    style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;