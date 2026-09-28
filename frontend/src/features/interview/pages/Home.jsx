import { useState } from "react";
import "../home.scss";
import { useInterview } from "../hook/useInterview";
import { useNavigate } from "react-router";

const Home = () => {
  const { loading, generateReport } = useInterview();
  const [jobDescription, setJobDescription] = useState();
  const [selfDescription, setSelfDescription] = useState();
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({ jobDescription, selfDescription, resumeFile })
    navigate(`/interview/${data._id}`)
  }

  return (
    <div className="interview-page">
      <div className="interview-container">
        <header className="page-header">
          <h1 className="page-title">Interview Preparation</h1>
          <p className="page-subtitle">
            Paste the job description and upload your resume. Our AI will generate
            a tailored report with interview questions, skill gaps, and a
            preparation plan.
          </p>
        </header>

        <form noValidate>
          <div className="form-grid">
            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div>
                  <h2>Job Description</h2>
                  <p className="card-subtitle">Paste the full role description</p>
                </div>
              </div>

              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="jobDescription">Description</label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="e.g. We are looking for a MERN Stack Developer with 2+ years of experience building scalable web applications..."
                ></textarea>
                <div className="field-hint">
                  <span>Include responsibilities, required skills &amp; qualifications</span>
                  <span className="hint-right">0 chars</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h2>Your Details</h2>
                  <p className="card-subtitle">Resume and a short self description</p>
                </div>
              </div>

              <div className="field">
                <label>Resume (PDF)</label>

                <label className="file-drop">
                  <input type="file" accept=".pdf,application/pdf" ref={resumeInputRef} />

                  <svg className="drop-icon" width="26" height="26" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>

                  <p className="drop-title">Drop your PDF here or click to browse</p>
                  <p className="drop-hint">PDF only · Max 3.00 MB</p>
                </label>
              </div>

              {/* <div className="field" hidden>
                <label>Resume (PDF)</label>

                <label className="file-drop has-file">
                  <input type="file" accept=".pdf,application/pdf" />

                  <svg className="file-icon" width="22" height="22" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>

                  <div className="file-info">
                    <p className="file-name">retesh-kumar-sharma-resume.pdf</p>
                    <p className="file-size">248.4 KB</p>
                  </div>

                  <button type="button" className="file-remove" aria-label="Remove file">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </label>
              </div> */}

              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="selfDescription">Self Description</label>
                <textarea
                  id="selfDescription"
                  name="selfDescription"
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="Briefly describe your experience, strengths and career goals..."
                ></textarea>
                <div className="field-hint">
                  <span>Optional, but improves the report</span>
                  <span className="hint-right">0 chars</span>
                </div>
              </div>
            </div>

          </div>

          <p className="error-text" hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Please upload your resume.
          </p>

          <div className="form-actions">
            <button type="submit" className="button button-primary" onClick={handleGenerateReport}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Generate Report
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Home;