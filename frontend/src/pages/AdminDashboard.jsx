import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Selected Claim for Detail Review
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Decision Form State
  const [decision, setDecision] = useState("approved");
  const [decisionReason, setDecisionReason] = useState("");
  const [approvedAmount, setApprovedAmount] = useState("");
  const [submittingDecision, setSubmittingDecision] = useState(false);
  const [decisionSuccess, setDecisionSuccess] = useState("");
  const [decisionError, setDecisionError] = useState("");

  const token =
    localStorage.getItem("admin_access_token") ||
    sessionStorage.getItem("admin_access_token") ||
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  const storedUser = JSON.parse(
    localStorage.getItem("admin_user") ||
    sessionStorage.getItem("admin_user") ||
    localStorage.getItem("user") ||
    sessionStorage.getItem("user") ||
    "{}"
  );

  // Verify Admin Role on Mount - Strictly guard against non-admins
  useEffect(() => {
    if (!token || storedUser.role !== "admin") {
      navigate("/admin/login", { replace: true });
      return;
    }
    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch stats
      const statsRes = await fetch("http://127.0.0.1:8000/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch claims
      const claimsRes = await fetch("http://127.0.0.1:8000/admin/claims", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (claimsRes.ok) {
        const claimsData = await claimsRes.json();
        setClaims(claimsData.claims || []);
      } else {
        setError("Failed to fetch claims list.");
      }
    } catch (err) {
      setError(err.message || "Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const openClaimReview = async (claimId) => {
    setLoadingDetail(true);
    setDecisionSuccess("");
    setDecisionError("");
    setDecisionReason("");
    setApprovedAmount("");

    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/claims/${claimId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedClaim(data.claim);
        // Pre-fill approved amount if recommendation exists
        if (data.claim.recommendation) {
          setApprovedAmount(data.claim.recommendation.recommended_compensation);
        }
      } else {
        alert("Failed to load claim review details.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleRunAssessment = async (claimId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/assessments/run/${claimId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("AI Assessment and Compensation Recommendation generated successfully!");
        openClaimReview(claimId);
        fetchAdminData();
      } else {
        const errData = await res.json();
        alert(errData.detail || "Failed to execute AI assessment.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!decisionReason || decisionReason.trim().length < 5) {
      setDecisionError("Please provide a substantive review reason (min 5 characters).");
      return;
    }

    setSubmittingDecision(true);
    setDecisionSuccess("");
    setDecisionError("");

    try {
      const payload = {
        decision: decision,
        decision_reason: decisionReason,
        approved_amount: decision === "approved" ? Number(approvedAmount) : 0.0,
      };

      const res = await fetch(
        `http://127.0.0.1:8000/admin/claims/${selectedClaim.id}/decision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setDecisionSuccess(`Claim #${selectedClaim.id} marked as ${decision.toUpperCase()}.`);
        openClaimReview(selectedClaim.id);
        fetchAdminData();
      } else {
        setDecisionError(data.detail || "Failed to submit decision.");
      }
    } catch (err) {
      setDecisionError(err.message || "Error submitting decision.");
    } finally {
      setSubmittingDecision(false);
    }
  };

  const filteredClaims = claims.filter((c) => {
    if (filterStatus === "all") return true;
    return c.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-logo">
          🌊 DisasterAid
        </Link>

        <div className="user-info">
          <div className="user-avatar" style={{ background: "#0284c7" }}>
            🛡️
          </div>
          <div>
            <strong>{storedUser.name || "Verification Officer"}</strong>
            <span style={{ color: "#38bdf8", fontWeight: 700, fontSize: "11px" }}>
              {storedUser.email || "admin@disasteraid.gov"}
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin" className="sidebar-link active">
            <span>🛡️</span> Claims Review
          </Link>
          <a href="#stats-overview" className="sidebar-link">
            <span>📊</span> KPI Metrics
          </a>
          <Link to="/" className="sidebar-link">
            <span>🌐</span> Public Portal
          </Link>
          <Link
            to="/login"
            className="sidebar-link"
            style={{ fontSize: "12px", opacity: 0.8 }}
            title="Switch to Applicant Login"
          >
            <span>👤</span> Citizen Portal →
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("admin_access_token");
              localStorage.removeItem("admin_user");
              sessionStorage.removeItem("admin_access_token");
              sessionStorage.removeItem("admin_user");
              navigate("/admin/login");
            }}
            className="sidebar-link logout-link"
          >
            <span>🚪</span> Officer Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">OFFICIAL CLAIMS VERIFICATION CENTER</p>
            <h1>Disaster Claims Review Portal</h1>
            <p>
              Inspect baseline & damaged photographs, review AI damage assessments,
              verify policy compensation breakdowns, and record authorized decisions.
            </p>
          </div>
          <button
            onClick={fetchAdminData}
            className="secondary-btn"
            style={{ padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }}
          >
            🔄 Refresh Records
          </button>
        </header>

        {/* Admin KPI Stats */}
        {stats && (
          <section className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div>
                <span>Total Claims</span>
                <strong>{stats.total_claims}</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div>
                <span>Under Review</span>
                <strong style={{ color: "#d97706" }}>{stats.under_review}</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div>
                <span>Approved</span>
                <strong style={{ color: "#16a34a" }}>{stats.approved}</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❌</div>
              <div>
                <span>Rejected</span>
                <strong style={{ color: "#dc2626" }}>{stats.rejected}</strong>
              </div>
            </div>
          </section>
        )}

        {/* Filter Controls */}
        <div style={{ display: "flex", gap: "12px", margin: "24px 0 16px", flexWrap: "wrap" }}>
          {["all", "submitted", "under_review", "approved", "rejected", "evidence_requested"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid #cbd5e1",
                background: filterStatus === st ? "#087f8c" : "#ffffff",
                color: filterStatus === st ? "#ffffff" : "#334155",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {st.replace("_", " ")} ({claims.filter((c) => st === "all" || c.status.toLowerCase() === st).length})
            </button>
          ))}
        </div>

        {/* Claims Table */}
        <section className="dashboard-card" style={{ padding: "20px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "16px", color: "#0f172a" }}>
            Disaster Claims for Verification ({filteredClaims.length})
          </h2>

          {loading ? (
            <p style={{ color: "#64748b" }}>Loading claims...</p>
          ) : filteredClaims.length === 0 ? (
            <p style={{ color: "#64748b", padding: "20px 0" }}>No claims found under this filter.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#475569" }}>
                    <th style={{ padding: "12px 8px" }}>Claim ID</th>
                    <th style={{ padding: "12px 8px" }}>Applicant</th>
                    <th style={{ padding: "12px 8px" }}>Property</th>
                    <th style={{ padding: "12px 8px" }}>Disaster</th>
                    <th style={{ padding: "12px 8px" }}>AI Severity</th>
                    <th style={{ padding: "12px 8px" }}>Recommendation</th>
                    <th style={{ padding: "12px 8px" }}>Status</th>
                    <th style={{ padding: "12px 8px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaims.map((c) => (
                    <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 8px", fontWeight: 700 }}>#{c.id}</td>
                      <td style={{ padding: "12px 8px" }}>
                        <strong>{c.applicant?.name}</strong>
                        <br />
                        <span style={{ fontSize: "12px", color: "#64748b" }}>{c.applicant?.email}</span>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        {c.property?.property_name}
                        <br />
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          {c.property?.district}, {c.property?.state}
                        </span>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <span style={{ fontWeight: 600 }}>{c.disaster_type}</span>
                        <br />
                        <span style={{ fontSize: "12px", color: "#64748b" }}>{c.disaster_date}</span>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        {c.assessment ? (
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 700,
                              background:
                                c.assessment.severity_category === "destroyed"
                                  ? "#fee2e2"
                                  : c.assessment.severity_category === "major_damage"
                                  ? "#ffedd5"
                                  : c.assessment.severity_category === "minor_damage"
                                  ? "#fef9c3"
                                  : "#dcfce7",
                              color:
                                c.assessment.severity_category === "destroyed"
                                  ? "#b91c1c"
                                  : c.assessment.severity_category === "major_damage"
                                  ? "#c2410c"
                                  : c.assessment.severity_category === "minor_damage"
                                  ? "#854d0e"
                                  : "#15803d",
                            }}
                          >
                            {c.assessment.severity_category.replace("_", " ").toUpperCase()}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: "12px" }}>Not run yet</span>
                        )}
                      </td>
                      <td style={{ padding: "12px 8px", fontWeight: 700 }}>
                        {c.recommendation
                          ? `₹${c.recommendation.recommended_compensation.toLocaleString("en-IN")}`
                          : "—"}
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <span className={`status ${c.status}`} style={{ textTransform: "capitalize" }}>
                          {c.status.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <button
                          onClick={() => openClaimReview(c.id)}
                          style={{
                            padding: "6px 14px",
                            background: "#087f8c",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          Review & Decide →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* MODAL / DRAWER FOR DETAILED REVIEW */}
        {selectedClaim && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15, 23, 42, 0.65)",
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
                maxWidth: "1000px",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "28px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 700 }}>CLAIM VERIFICATION FILE</span>
                  <h2 style={{ fontSize: "22px", color: "#0f172a", marginTop: "4px" }}>
                    Claim #{selectedClaim.id} - {selectedClaim.property?.property_name}
                  </h2>
                  <p style={{ color: "#475569", fontSize: "14px" }}>
                    Applicant: {selectedClaim.applicant?.name} ({selectedClaim.applicant?.email}) | Disaster: {selectedClaim.disaster_type} ({selectedClaim.disaster_date})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedClaim(null)}
                  style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "18px" }}
                >
                  ✕
                </button>
              </div>

              {/* SECTION 1: VISUAL EVIDENCE COMPARISON */}
              <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "16px", color: "#0f172a", marginBottom: "12px" }}>
                  📷 Photographic Evidence (Baseline vs Post-Disaster)
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                  {/* Baseline Image */}
                  <div style={{ background: "#fff", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                    <p style={{ fontWeight: 700, fontSize: "13px", color: "#087f8c", marginBottom: "6px" }}>
                      Registered Pre-Disaster Baseline:
                    </p>
                    {selectedClaim.property?.pre_disaster_image ? (
                      <img
                        src={`http://127.0.0.1:8000/files/${selectedClaim.property.pre_disaster_image}?token=${token}`}
                        alt="Baseline Property"
                        style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "6px" }}
                      />
                    ) : (
                      <p style={{ color: "#94a3b8" }}>No baseline image available</p>
                    )}
                  </div>

                  {/* Damaged Images */}
                  {selectedClaim.images?.map((img, idx) => (
                    <div key={img.id} style={{ background: "#fff", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                      <p style={{ fontWeight: 700, fontSize: "13px", color: "#b91c1c", marginBottom: "6px" }}>
                        Post-Disaster View #{idx + 1}:
                      </p>
                      <img
                        src={`http://127.0.0.1:8000/files/${img.image_path}?token=${token}`}
                        alt={`Damaged View ${idx + 1}`}
                        style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "6px" }}
                      />
                      <small style={{ color: "#64748b" }}>Dimensions: {img.dimensions}</small>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: AI DAMAGE ASSESSMENT */}
              <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "16px", color: "#0f172a" }}>🤖 AI Assessment Engine Analysis</h3>
                  <button
                    onClick={() => handleRunAssessment(selectedClaim.id)}
                    style={{
                      padding: "6px 14px",
                      background: "#087f8c",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                    title="Run or re-evaluate AI damage assessment with updated model engine"
                  >
                    ⚡ {selectedClaim.assessment ? "Re-evaluate AI Assessment" : "Run Assessment Now"}
                  </button>
                </div>

                {selectedClaim.assessment ? (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "14px" }}>
                      <div style={{ background: "#fff", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>Assessed Severity</span>
                        <strong
                          style={{
                            display: "block",
                            fontSize: "16px",
                            color:
                              selectedClaim.assessment.severity_category === "no_damage"
                                ? "#16a34a"
                                : selectedClaim.assessment.severity_category === "minor_damage"
                                ? "#d97706"
                                : "#dc2626",
                            textTransform: "capitalize",
                          }}
                        >
                          {selectedClaim.assessment.severity_category === "no_damage"
                            ? "✓ No Damage (Intact)"
                            : selectedClaim.assessment.severity_category.replace("_", " ")}
                        </strong>
                      </div>
                      <div style={{ background: "#fff", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>Physical Damage Score</span>
                        <strong
                          style={{
                            display: "block",
                            fontSize: "16px",
                            color:
                              selectedClaim.assessment.damage_score === 0
                                ? "#16a34a"
                                : selectedClaim.assessment.damage_score < 0.3
                                ? "#d97706"
                                : "#dc2626",
                          }}
                        >
                          {(selectedClaim.assessment.damage_score * 100).toFixed(1)}%
                        </strong>
                      </div>
                      <div style={{ background: "#fff", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>Model Confidence</span>
                        <strong style={{ display: "block", fontSize: "16px", color: "#0f172a" }}>
                          {(selectedClaim.assessment.confidence_score * 100).toFixed(1)}%
                        </strong>
                      </div>
                      <div style={{ background: "#fff", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>Reference Similarity</span>
                        <strong style={{ display: "block", fontSize: "16px", color: "#0f172a" }}>
                          {(selectedClaim.assessment.visual_similarity_score * 100).toFixed(1)}%
                        </strong>
                      </div>
                    </div>

                    {selectedClaim.assessment.uncertainty_flag && (
                      <div style={{ padding: "10px", background: "#fef3c7", borderRadius: "6px", border: "1px solid #fde68a", marginBottom: "12px" }}>
                        <strong style={{ color: "#92400e", fontSize: "13px" }}>⚠️ Uncertainty Indicator:</strong>
                        <span style={{ color: "#92400e", fontSize: "13px", marginLeft: "6px" }}>
                          {selectedClaim.assessment.uncertainty_reason}
                        </span>
                      </div>
                    )}

                    <p style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>
                      Notice: {selectedClaim.assessment.limitations_notes}
                    </p>
                  </div>
                ) : (
                  <p style={{ color: "#64748b" }}>No AI assessment has been executed yet. Click "Run Assessment Now" above.</p>
                )}
              </div>

              {/* SECTION 3: EXPLAINABLE COMPENSATION RECOMMENDATION */}
              {selectedClaim.recommendation && (
                <div style={{ background: "#f0fdf4", padding: "18px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #bbf7d0" }}>
                  <h3 style={{ fontSize: "16px", color: "#166534", marginBottom: "12px" }}>
                    💰 Policy Compensation Breakdown ({selectedClaim.recommendation.policy_name})
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "#15803d" }}>Declared Property Value:</span>
                      <strong style={{ display: "block", fontSize: "16px", color: "#14532d" }}>
                        ₹{selectedClaim.recommendation.property_declared_value?.toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#15803d" }}>Gross Estimated Loss:</span>
                      <strong style={{ display: "block", fontSize: "16px", color: "#14532d" }}>
                        ₹{selectedClaim.recommendation.estimated_loss?.toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#15803d" }}>Statutory Deductible:</span>
                      <strong style={{ display: "block", fontSize: "16px", color: "#14532d" }}>
                        - ₹{selectedClaim.recommendation.deductible?.toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#15803d" }}>Recommended Provisional Relief:</span>
                      <strong style={{ display: "block", fontSize: "18px", color: "#16a34a" }}>
                        ₹{selectedClaim.recommendation.recommended_compensation?.toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>
                  <small style={{ color: "#15803d" }}>
                    {selectedClaim.recommendation.breakdown?.officer_review_notice}
                  </small>
                </div>
              )}

              {/* SECTION 4: OFFICIAL DECISION FORM */}
              <div style={{ background: "#ffffff", padding: "20px", borderRadius: "10px", border: "2px solid #087f8c", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "17px", color: "#0f172a", marginBottom: "12px" }}>
                  ⚖️ Record Official Verification Decision
                </h3>
                <form onSubmit={handleDecisionSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                        Official Decision *
                      </label>
                      <select
                        value={decision}
                        onChange={(e) => setDecision(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                      >
                        <option value="approved">Approve Claim</option>
                        <option value="rejected">Reject Claim</option>
                        <option value="evidence_requested">Request Additional Evidence</option>
                      </select>
                    </div>

                    {decision === "approved" && (
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                          Approved Compensation Amount (₹) *
                        </label>
                        <input
                          type="number"
                          value={approvedAmount}
                          onChange={(e) => setApprovedAmount(e.target.value)}
                          required
                          style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Decision Rationale / Assessment Findings *
                    </label>
                    <textarea
                      value={decisionReason}
                      onChange={(e) => setDecisionReason(e.target.value)}
                      rows={3}
                      placeholder="Document justification, verified photos review, policy clause applied, or required evidence details..."
                      required
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                    />
                  </div>

                  {decisionSuccess && <p className="success-message" style={{ marginBottom: "10px" }}>{decisionSuccess}</p>}
                  {decisionError && <p className="error-message" style={{ marginBottom: "10px" }}>{decisionError}</p>}

                  <button
                    type="submit"
                    disabled={submittingDecision}
                    style={{
                      padding: "10px 24px",
                      background: decision === "approved" ? "#16a34a" : decision === "rejected" ? "#dc2626" : "#d97706",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    {submittingDecision ? "Recording Decision..." : `Submit Decision (${decision.toUpperCase()})`}
                  </button>
                </form>
              </div>

              {/* SECTION 5: AUDIT TRAIL */}
              {selectedClaim.decisions_audit_history?.length > 0 && (
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <h4 style={{ fontSize: "14px", color: "#334155", marginBottom: "10px" }}>📜 Auditable Status & Review Log</h4>
                  {selectedClaim.decisions_audit_history.map((log) => (
                    <div key={log.id} style={{ borderBottom: "1px solid #e2e8f0", padding: "8px 0", fontSize: "13px" }}>
                      <span style={{ fontWeight: 700, textTransform: "uppercase", color: log.decision === "approved" ? "#16a34a" : "#dc2626" }}>
                        {log.decision}
                      </span>{" "}
                      by <strong>{log.reviewer_name}</strong> on {new Date(log.decided_at).toLocaleString()}:
                      <p style={{ color: "#475569", marginTop: "4px" }}>"{log.decision_reason}"</p>
                      {log.approved_amount > 0 && (
                        <span style={{ color: "#16a34a", fontWeight: 600 }}>Amount: ₹{log.approved_amount.toLocaleString("en-IN")}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
