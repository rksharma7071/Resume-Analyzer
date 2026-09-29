import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { deleteInterviewReport, getAllInterviewReports, renameInterviewReport } from "../services/interview.api.js";
import { getErrorMessage } from "../../auth/services/api.js";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllInterviewReports()
      .then(setReports)
      .catch((err) => setError(getErrorMessage(err, "Could not load your reports.")))
      .finally(() => setLoading(false));
  }, []);

  const handleRename = async (report) => {
    const title = window.prompt("Report name", report.title)?.trim();
    if (!title || title === report.title) return;

    try {
      const updated = await renameInterviewReport(report._id, title);
      setReports((prev) => prev.map((r) => (r._id === report._id ? { ...r, title: updated.title } : r)));
    } catch (err) {
      setError(getErrorMessage(err, "Could not rename the report."));
    }
  };

  const handleDelete = async (report) => {
    if (!window.confirm(`Delete "${report.title}"? This can't be undone.`)) return;

    try {
      await deleteInterviewReport(report._id);
      setReports((prev) => prev.filter((r) => r._id !== report._id));
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete the report."));
    }
  };

  return (
    <section className="reports-section">
      <h2 className="reports-title">Your reports</h2>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="reports-empty">Loading your reports...</p>
      ) : reports.length === 0 ? (
        <p className="reports-empty">No reports yet. Fill in the form above to create your first one.</p>
      ) : (
        <ul className="report-list">
          {reports.map((report) => (
            <li key={report._id} className="report-item">
              <Link to={`/interview/${report._id}`} className="report-link">
                <span className="report-name">{report.title}</span>
                <span className="report-meta">
                  {report.matchScore ?? 0}% match, created {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </Link>
              <button type="button" className="icon-button" aria-label="Rename report" onClick={() => handleRename(report)}>
                <FiEdit2 size={16} />
              </button>
              <button
                type="button"
                className="icon-button is-danger"
                aria-label="Delete report"
                onClick={() => handleDelete(report)}
              >
                <FiTrash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ReportList;