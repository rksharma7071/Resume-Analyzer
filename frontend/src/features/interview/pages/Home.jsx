import { useState } from "react";
import { useNavigate } from "react-router";
import { FiAlertCircle, FiFileText, FiLogOut, FiSend, FiUser } from "react-icons/fi";
import "../home.scss";
import "../../../styles/button.scss";
import { useAuth } from "../../auth/hooks/useAuth.jsx";
import ResumeDrop from "../components/ResumeDrop.jsx";
import ReportList from "../components/ReportList.jsx";
import { getErrorMessage } from "../../auth/services/api.js";
import { generateInterviewReport } from "../services/interview.api.js";

const MIN_JOB_DESCRIPTION = 20;

const Home = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (jobDescription.trim().length < MIN_JOB_DESCRIPTION) {
      return setError(`Add a job description of at least ${MIN_JOB_DESCRIPTION} characters.`);
    }
    if (!resumeFile) return setError("Upload your resume to continue.");

    setError("");
    setSubmitting(true);

    try {
      const report = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
      navigate(`/interview/${report._id}`);
    } catch (err) {
      setError(getErrorMessage(err, "Could not generate the report. Try again."));
      setSubmitting(false);
    }
  };

  return (
    <div className="interview-page">
      <div className="interview-container">
        <div className="home-topbar">
          <span className="user-greeting">Signed in as {user.name}</span>
          <button type="button" className="button button-secondary" onClick={handleLogout}>
            <FiLogOut size={16} /> Log out
          </button>
        </div>

        <header className="page-header">
          <h1 className="page-title">Interview preparation</h1>
          <p className="page-subtitle">
            Paste the job description and upload your resume. You'll get interview questions with sample
            answers, the skills you're missing, and a day-by-day plan to prepare.
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="card">
              <div className="card-header">
                <div className="card-icon"><FiFileText size={20} /></div>
                <div>
                  <h2>Job description</h2>
                  <p className="card-subtitle">Paste the full role description</p>
                </div>
              </div>

              <div className="field field-grow">
                <label htmlFor="jobDescription">Description</label>
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="e.g. We are looking for a MERN Stack Developer with 2+ years of experience..."
                />
                <div className="field-hint">
                  <span>Include responsibilities, required skills and qualifications</span>
                  <span className="hint-right">{jobDescription.length} chars</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon"><FiUser size={20} /></div>
                <div>
                  <h2>Your details</h2>
                  <p className="card-subtitle">Resume and a short self description</p>
                </div>
              </div>

              <div className="field">
                <label>Resume (PDF)</label>
                <ResumeDrop file={resumeFile} onChange={setResumeFile} onError={setError} />
              </div>

              <div className="field field-grow">
                <label htmlFor="selfDescription">Self description</label>
                <textarea
                  id="selfDescription"
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="Briefly describe your experience, strengths and career goals..."
                />
                <div className="field-hint">
                  <span>Optional, but makes the report more specific</span>
                  <span className="hint-right">{selfDescription.length} chars</span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <p className="error-text" role="alert">
              <FiAlertCircle size={16} /> {error}
            </p>
          )}

          <div className="form-actions">
            {submitting && <span className="submit-hint">This usually takes under a minute.</span>}
            <button type="submit" className="button button-primary" disabled={submitting}>
              <FiSend size={16} />
              {submitting ? "Generating report..." : "Generate report"}
            </button>
          </div>
        </form>

        <ReportList />
      </div>
    </div>
  );
};

export default Home;