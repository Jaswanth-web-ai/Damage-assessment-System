import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Claim() {
  const navigate = useNavigate();

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const [propertyId, setPropertyId] = useState("");
  const [disasterType, setDisasterType] = useState("");
  const [disasterDate, setDisasterDate] = useState("");
  const [damageDescription, setDamageDescription] = useState("");

  // Multiple Damaged Images
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // LOAD APPLICANT'S REGISTERED PROPERTIES
  // --------------------------------------------------
  useEffect(() => {
    const fetchProperties = async () => {
      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/properties/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProperties(data.properties || []);
          if (data.properties && data.properties.length > 0) {
            setPropertyId(String(data.properties[0].id));
          }
        } else {
          setError("Failed to fetch registered properties.");
        }
      } catch (err) {
        console.error("Fetch properties error:", err);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, [navigate]);

  // --------------------------------------------------
  // IMAGE SELECTION & PREVIEWS
  // --------------------------------------------------
  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const validFiles = [];

    for (const file of selectedFiles) {
      if (!validTypes.includes(file.type.toLowerCase())) {
        setError(`File "${file.name}" is not a valid JPG, PNG, or WEBP image.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the 10 MB limit.`);
        return;
      }
      validFiles.push(file);
    }

    setError("");
    const updatedImages = [...images, ...validFiles];
    setImages(updatedImages);

    // Generate previews
    const newPreviews = validFiles.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      url: URL.createObjectURL(file)
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // --------------------------------------------------
  // SUBMIT CLAIM VIA FORMDATA
  // --------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!propertyId) {
      setError("Please select a registered property.");
      return;
    }

    if (!disasterType) {
      setError("Please select the disaster type.");
      return;
    }

    if (!disasterDate) {
      setError("Please select the disaster date.");
      return;
    }

    if (images.length === 0) {
      setError("Please upload at least one post-disaster photograph of the damage.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("property_id", propertyId);
      formData.append("disaster_type", disasterType);
      formData.append("disaster_date", disasterDate);
      if (damageDescription) {
        formData.append("damage_description", damageDescription);
      }

      // Append all multiple damaged images
      for (const file of images) {
        formData.append("damaged_images", file);
      }

      const response = await fetch("http://127.0.0.1:8000/claims/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
          // No Content-Type header so browser boundary is set automatically
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to submit disaster claim.");
      }

      setSuccess("Disaster claim submitted successfully with damage images!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-page">
      {/* Header */}
      <header className="property-header">
        <Link to="/dashboard" className="property-logo">
          🌊 DisasterAid
        </Link>
        <Link to="/dashboard" className="back-dashboard">
          ← Dashboard
        </Link>
      </header>

      {/* Main Container */}
      <main className="property-container">
        <div className="property-heading">
          <p>DISASTER DAMAGE CLAIM</p>
          <h1>Submit Disaster Damage Claim</h1>
          <span>
            Provide details of the disaster event and upload clear photographs
            of structural damage for AI-assisted damage assessment.
          </span>
        </div>

        <form className="property-form-card" onSubmit={handleSubmit}>
          <h2>Claim Details</h2>
          <p className="form-description">
            Select your affected registered property and describe the damage observed.
          </p>

          {/* Select Property */}
          <div className="property-form-group">
            <label htmlFor="property-select">Affected Property *</label>
            {loadingProperties ? (
              <p style={{ color: "#64748b" }}>Loading your registered properties...</p>
            ) : properties.length === 0 ? (
              <div style={{ padding: "14px", background: "#fef3c7", borderRadius: "8px", border: "1px solid #fde68a" }}>
                <p style={{ color: "#92400e", fontWeight: 600, marginBottom: "8px" }}>
                  No registered property found.
                </p>
                <Link to="/property" className="primary-btn" style={{ fontSize: "14px", padding: "6px 14px" }}>
                  + Register Property First
                </Link>
              </div>
            ) : (
              <select
                id="property-select"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                required
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.property_name} ({p.property_type}) - {p.city_village}, {p.district}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Disaster Type & Date */}
          <div className="property-form-row">
            <div className="property-form-group">
              <label htmlFor="disaster-type">Disaster Type *</label>
              <select
                id="disaster-type"
                value={disasterType}
                onChange={(e) => setDisasterType(e.target.value)}
                required
              >
                <option value="">Select disaster type</option>
                <option value="Flood">Flood</option>
                <option value="Cyclone">Cyclone / Hurricane</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Tsunami">Tsunami</option>
                <option value="Landslide">Landslide</option>
              </select>
            </div>

            <div className="property-form-group">
              <label htmlFor="disaster-date">Date of Disaster *</label>
              <input
                id="disaster-date"
                type="date"
                value={disasterDate}
                onChange={(e) => setDisasterDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          {/* Damage Description */}
          <div className="property-form-group">
            <label htmlFor="damage-description">Damage Description</label>
            <textarea
              id="damage-description"
              value={damageDescription}
              onChange={(e) => setDamageDescription(e.target.value)}
              placeholder="Describe the extent of visible structural damage, submerged floors, damaged walls, or roof destruction..."
              rows={4}
            />
          </div>

          {/* Damaged Images Upload (Multiple) */}
          <div className="location-section" style={{ marginTop: "24px" }}>
            <h3>Post-Disaster Damaged Photographs *</h3>
            <p>
              Upload multiple photographs showing the extent of damage from different angles.
              These will be compared against the baseline property record and verified reference imagery.
            </p>

            <div className="property-form-group" style={{ marginTop: "16px" }}>
              <input
                id="damaged_images"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                style={{ padding: "10px", background: "#f8fafc", borderRadius: "8px", border: "1px dashed #087f8c", width: "100%" }}
              />
              <small style={{ color: "#64748b", display: "block", marginTop: "6px" }}>
                Accepted formats: JPG, PNG, WEBP (Max 10 MB per image). You can select multiple images.
              </small>

              {/* Previews Grid */}
              {previews.length > 0 && (
                <div style={{ marginTop: "18px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px" }}>
                  {previews.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "#fff",
                        padding: "8px"
                      }}
                    >
                      <img
                        src={item.url}
                        alt={`Damaged preview ${idx + 1}`}
                        style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px" }}
                      />
                      <div style={{ marginTop: "6px", fontSize: "12px", color: "#334155" }}>
                        <p style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.name}
                        </p>
                        <p style={{ color: "#64748b" }}>{item.size}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        style={{
                          marginTop: "6px",
                          width: "100%",
                          padding: "4px",
                          fontSize: "12px",
                          background: "#fee2e2",
                          color: "#b91c1c",
                          border: "1px solid #fca5a5",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Feedback messages */}
          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}

          {/* Form Actions */}
          <div className="property-form-actions">
            <Link to="/dashboard" className="cancel-btn">
              Cancel
            </Link>
            <button
              type="submit"
              className="save-property-btn"
              disabled={loading || properties.length === 0}
            >
              {loading ? "Submitting Claim & Uploading Images..." : "Submit Disaster Claim"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Claim;