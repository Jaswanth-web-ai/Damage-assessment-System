# DisasterAid: AI-Assisted Disaster Damage Assessment & Compensation Support Platform

DisasterAid is an integrated, full-stack web application and AI decision-support platform designed to streamline disaster damage assessment and provisional compensation workflows for residential and commercial properties affected by natural catastrophes (floods, cyclones, earthquakes, tsunamis).

---

## 1. System Architecture & High-Level Workflow

```mermaid
flowchart TD
    A[Citizen / Applicant Registration & Login] --> B[Property Registration + Baseline Photo Upload]
    B --> C[Post-Disaster Claim Submission + Multiple Damaged Photos]
    C --> D[Pillow & FastAPI Image Validation & Secure Storage]
    D --> E[Verified Reference Dataset Matching - xBD Benchmark]
    E --> F[AI Vision Engine: Feature Embeddings & Cosine Similarity]
    F --> G[Multi-Temporal Change Detection & 4-Tier Damage Severity Classification]
    G --> H[Deterministic Policy Compensation Engine - Policy 2026.1]
    H --> I[Admin Review Portal: Human Officer Verification & Audit Log]
    I --> J[Approved Relief Disbursal & Applicant Status Tracking]
```

---

## 2. Technology Stack

- **Frontend:** React 19, Vite 8, JavaScript (ES2024), Vanilla CSS (responsive, accessible), React Router 7
- **Backend:** Python 3.13, FastAPI 0.141, Uvicorn, RESTful API
- **Database:** PostgreSQL 17, SQLAlchemy 2.0 ORM, psycopg2-binary
- **Authentication:** OAuth2 Password Bearer, JWT tokens (HS256), Argon2 password hashing via `pwdlib`
- **Image Processing & Vision AI:** Pillow 13.0, NumPy, SciPy, PyTorch 2.14, Torchvision
- **Reference Dataset:** xBD/xView2 synthetic multi-temporal satellite pairs with building footprints and 4-tier ground truth annotations

---

## 3. Database Schema Entities

1. `users`: Applicant and administrator credentials, Argon2 password hash, role (`applicant` | `admin`), timestamps.
2. `properties`: Property type, ownership, street address, village, district, state, PIN, declared value, coordinates, and `pre_disaster_image` path.
3. `claims`: Property ID, disaster type, disaster date, damage description, status (`submitted`, `under_review`, `approved`, `rejected`, `evidence_requested`), created timestamp.
4. `claim_images`: Multiple post-disaster photographs per claim with width, height, and file sizes.
5. `reference_locations`: Geographical disaster zones (e.g. Cuddalore, Nagapattinam, Chennai, Kerala).
6. `reference_images`: 40 verified benchmark image pairs, ground truth labels (`no_damage`, `minor_damage`, `major_damage`, `destroyed`), building count, and precomputed 128-D visual feature vectors.
7. `claim_assessments`: Model version, quantitative damage score, confidence, severity category, visual similarity score to reference evidence, and uncertainty indicators.
8. `compensation_recommendations`: Declared property value, gross estimated loss, deductible, coverage cap, provisional recommended compensation, and calculation breakdown.
9. `claim_decisions`: Immutable audit trail recording reviewer ID, decision, reason, approved amount, status before/after, and timestamp.

---

## 4. Setup & Installation (Windows)

### Prerequisites
- Python 3.11+ (Python 3.13 installed)
- Node.js 18+ and npm
- PostgreSQL running locally on port 5432

### Step 1: Database Setup
1. Open PostgreSQL (pgAdmin or psql) and create the database:
   ```sql
   CREATE DATABASE disasteraid;
   ```

2. Configure `backend/.env` with your PostgreSQL password:
   ```env
   DATABASE_URL=postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/disasteraid
   JWT_SECRET_KEY=disasteraid_super_secret_key_change_this_later
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
   MAX_UPLOAD_SIZE_MB=10
   ```

### Step 2: Backend Setup
Open a Windows PowerShell terminal in `backend/`:
```powershell
cd D:\DisasterAid\backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Seed the reference dataset (40 verified benchmark pairs)
python -m app.services.reference_importer

# Seed the initial official Review Officer account
python -m app.services.seed_admin
```

### Step 3: Frontend Setup
Open a second PowerShell terminal in `frontend/`:
```powershell
cd D:\DisasterAid\frontend

# Install node dependencies
npm install

# Build check
npm run build
```

---

## 5. Running the Application

### Start Backend Development Server
```powershell
cd D:\DisasterAid\backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive Swagger API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- API Health Status: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

### Start Frontend Application
```powershell
cd D:\DisasterAid\frontend
npm run dev
```
- Open browser at: [http://localhost:5173](http://localhost:5173)

---

## 6. Default User Accounts

| Role | Email | Password | Purpose |
|---|---|---|---|
| **Admin Officer** | `admin@disasteraid.gov` | `AdminOfficial2026!` | Access `/admin` portal, review visual evidence, inspect AI damage metrics, record official decisions. |
| **Applicant** | Self-register via `/register` | User chosen | Register baseline properties, submit claims with multiple photographs, view status and provisional relief estimates. |

---

## 7. Automated Test Suite

Run the complete 15-test automated test suite covering all phases:
```powershell
cd D:\DisasterAid\backend
.\venv\Scripts\python.exe -m pytest tests\ -v
```

### Verified Test Cases:
1. `test_master_end_to_end_journey`: Full 14-step workflow from applicant onboarding to official admin decision.
2. `test_phase3_baseline_upload`: Baseline image validation (PIL dimensions, size limit, corrupted/empty file rejection, disk storage, database matching).
3. `test_phase4_claims`: Multiple damaged image upload, claim directory creation, cross-user property access denial (403), nonexistent property rejection (404).
4. `test_phase5_reference_dataset_filtering`: Verified reference dataset querying by disaster type and location.
5. `test_phase6_7_8_ai_assessment_and_compensation`: AI vision embeddings, cosine similarity, structural change detection, 4-tier damage classification, deterministic policy loss estimation, provisional compensation breakdown.
6. `test_phase9_admin_role_enforcement`: Applicant blocked from admin endpoints (403), admin review bundle retrieval, and immutable decision audit logging.

---

## 8. Security & Data Protection Principles

1. **Server-Side Authorization**: Roles (`applicant`, `admin`) are strictly verified on the backend. Public registration cannot provision administrative privileges.
2. **Strict Property Isolation**: Users can only submit claims and access properties registered under their authenticated user ID.
3. **Protected Image Access**: Files in `uploads/` are served through a protected endpoint (`/files/...`) that verifies JWT credentials and ensures users cannot access other citizens' private photographs.
4. **Deterministic Policy Math**: Compensation is calculated using explicit statutory policy formulas (separating physical damage from financial relief) and is strictly labeled as **provisional** pending official officer review. Automatic payouts are prohibited.
