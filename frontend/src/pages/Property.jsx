import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Property() {
  const navigate = useNavigate();

  // --------------------------------------------------
  // PROPERTY FORM DATA
  // --------------------------------------------------
  const [formData, setFormData] = useState({
    property_type: "",
    ownership: "",
    property_name: "",
    address: "",
    city_village: "",
    district: "",
    state: "",
    pin_code: "",
    property_value: "",
    latitude: "",
    longitude: ""
  });

  // Baseline Image State
  const [baselineImage, setBaselineImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // UI STATE
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // HANDLE INPUT CHANGES
  // --------------------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  // --------------------------------------------------
  // HANDLE FILE SELECTION
  // --------------------------------------------------
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setBaselineImage(null);
      setImagePreview(null);
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setError("Please select a valid image format (JPG, PNG, or WEBP).");
      setBaselineImage(null);
      setImagePreview(null);
      return;
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      setError("Image size exceeds the 10 MB maximum limit.");
      setBaselineImage(null);
      setImagePreview(null);
      return;
    }

    setError("");
    setBaselineImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // --------------------------------------------------
  // SUBMIT PROPERTY VIA FORMDATA
  // --------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!baselineImage) {
        setError("Please upload a baseline property image before saving.");
        setLoading(false);
        return;
      }

      // Construct multipart/form-data payload
      const payload = new FormData();
      payload.append("property_type", formData.property_type);
      payload.append("ownership", formData.ownership);
      payload.append("property_name", formData.property_name);
      payload.append("address", formData.address);
      payload.append("city_village", formData.city_village);
      payload.append("district", formData.district);
      payload.append("state", formData.state);
      payload.append("pin_code", formData.pin_code);

      if (formData.property_value) {
        payload.append("property_value", formData.property_value);
      }
      if (formData.latitude) {
        payload.append("latitude", formData.latitude);
      }
      if (formData.longitude) {
        payload.append("longitude", formData.longitude);
      }

      payload.append("baseline_image", baselineImage);

      // Send to FastAPI without manually setting Content-Type (browser sets multipart boundary)
      const response = await fetch("http://127.0.0.1:8000/properties/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: payload
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to register property.");
      }

      setMessage("Property registered successfully with baseline image!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
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
          <p>PROPERTY REGISTRATION</p>
          <h1>Register Your Property</h1>
          <span>
            Add your property details and baseline pre-disaster photograph
            before submitting damage claims.
          </span>
        </div>

        <form className="property-form-card" onSubmit={handleSubmit}>
          <h2>Property Information</h2>
          <p className="form-description">
            Please provide accurate information and a pre-disaster photograph
            of the structure.
          </p>

          {/* Property Type */}
          <div className="property-form-group">
            <label htmlFor="property-type">Property Type *</label>
            <select
              id="property-type"
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              required
            >
              <option value="">Select property type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>

          {/* Ownership */}
          <div className="property-form-group">
            <label htmlFor="ownership">Ownership *</label>
            <select
              id="ownership"
              name="ownership"
              value={formData.ownership}
              onChange={handleChange}
              required
            >
              <option value="">Select ownership type</option>
              <option value="Property Owner">Property Owner</option>
              <option value="Tenant">Tenant</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Property Name */}
          <div className="property-form-group">
            <label htmlFor="property_name">Property / House Name *</label>
            <input
              id="property_name"
              type="text"
              name="property_name"
              value={formData.property_name}
              onChange={handleChange}
              placeholder="e.g. Sunrise Villa or House #12"
              required
            />
          </div>

          {/* Address */}
          <div className="property-form-group">
            <label htmlFor="address">Street Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Door number, street name, landmarks"
              rows={3}
              required
            />
          </div>

          {/* City / Village & District */}
          <div className="property-form-row">
            <div className="property-form-group">
              <label htmlFor="city_village">City / Village *</label>
              <input
                id="city_village"
                type="text"
                name="city_village"
                value={formData.city_village}
                onChange={handleChange}
                placeholder="City or Village"
                required
              />
            </div>
            <div className="property-form-group">
              <label htmlFor="district">District *</label>
              <input
                id="district"
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="District"
                required
              />
            </div>
          </div>

          {/* State & PIN Code */}
          <div className="property-form-row">
            <div className="property-form-group">
              <label htmlFor="state">State *</label>
              <input
                id="state"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </div>
            <div className="property-form-group">
              <label htmlFor="pin_code">PIN Code *</label>
              <input
                id="pin_code"
                type="text"
                name="pin_code"
                value={formData.pin_code}
                onChange={handleChange}
                placeholder="6-digit PIN code"
                required
              />
            </div>
          </div>

          {/* Property Value */}
          <div className="property-form-group">
            <label htmlFor="property_value">Estimated Property Value (₹)</label>
            <input
              id="property_value"
              type="number"
              name="property_value"
              value={formData.property_value}
              onChange={handleChange}
              placeholder="e.g. 2500000"
            />
          </div>

          {/* BASELINE IMAGE UPLOAD SECTION (PHASE 3) */}
          <div className="location-section" style={{ marginTop: "24px" }}>
            <h3>Baseline (Pre-Disaster) Photograph *</h3>
            <p>
              Upload a clear photograph of your property taken before any disaster.
              This acts as the baseline for AI damage comparison.
            </p>

            <div className="property-form-group" style={{ marginTop: "16px" }}>
              <input
                id="baseline_image"
                type="file"
                name="baseline_image"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                required
                style={{ padding: "10px", background: "#f8fafc", borderRadius: "8px", border: "1px dashed #087f8c", width: "100%" }}
              />
              <small style={{ color: "#64748b", display: "block", marginTop: "6px" }}>
                Accepted formats: JPG, JPEG, PNG, WEBP (Max 10 MB)
              </small>

              {imagePreview && (
                <div style={{ marginTop: "16px", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "10px", background: "#ffffff" }}>
                  <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "8px", color: "#0f172a" }}>
                    Selected Image Preview: {baselineImage?.name} ({(baselineImage?.size / 1024).toFixed(1)} KB)
                  </p>
                  <img
                    src={imagePreview}
                    alt="Baseline Property Preview"
                    style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "8px", objectFit: "cover", border: "1px solid #cbd5e1" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Location Section */}
          <div className="location-section" style={{ marginTop: "24px" }}>
            <h3>Property Coordinates (Optional)</h3>
            <p>
              Helps precisely locate satellite reference imagery for AI analysis.
            </p>
            <div className="property-form-row">
              <div className="property-form-group">
                <label htmlFor="latitude">Latitude</label>
                <input
                  id="latitude"
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="e.g. 11.7500"
                />
              </div>
              <div className="property-form-group">
                <label htmlFor="longitude">Longitude</label>
                <input
                  id="longitude"
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="e.g. 79.7600"
                />
              </div>
            </div>
          </div>

          {/* Feedback messages */}
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          {/* Actions */}
          <div className="property-form-actions">
            <Link to="/dashboard" className="cancel-btn">
              Cancel
            </Link>
            <button
              type="submit"
              className="save-property-btn"
              disabled={loading}
            >
              {loading ? "Uploading & Saving..." : "Save Property"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Property;