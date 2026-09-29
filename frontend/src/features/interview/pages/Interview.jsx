import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { FiArrowLeft, FiChevronDown, FiCode, FiCompass, FiMessageSquare } from "react-icons/fi";
import "../interview.scss";
import { getInterviewReportById } from "../services/interview.api.js";
import { getErrorMessage } from "../../auth/services/api.js";

const SECTIONS = [
  { id: "technicalQuestions", label: "Technical questions", Icon: FiCode },
  { id: "behavioralQuestions", label: "Behavioral questions", Icon: FiMessageSquare },
  { id: "preparationPlan", label: "Preparation plan", Icon: FiCompass },
];

const RING_RADIUS = 52;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const scoreCaption = (score) => {
  if (score >= 75) return "Strong match for this role";
  if (score >= 50) return "Good match with a few gaps";
  return "Several gaps to close for this role";
};

const Interview = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    getInterviewReportById(id)
      .then(setReport)
      .catch((err) => setError(getErrorMessage(err, "Could not load this report.")));
  }, [id]);

  if (error) {
    return (
      <div className="interview-status">
        <p>{error}</p>
        <Link to="/">Back to your reports</Link>
      </div>
    );
  }

  if (!report) return <div className="interview-status"><p>Loading report...</p></div>;

  const section = SECTIONS.find((s) => s.id === activeSection);
  const items = report[activeSection] ?? [];
  const isPlan = activeSection === "preparationPlan";
  const score = report.matchScore ?? 0;

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);
  const switchSection = (sectionId) => {
    setActiveSection(sectionId);
    setOpenIndex(null);
  };

  return (
    <div className="interview-dashboard">
      <aside className="dashboard-sidebar">
        <Link to="/" className="nav-item back-link">
          <span className="nav-icon"><FiArrowLeft size={15} /></span>
          <span>All reports</span>
        </Link>

        <p className="report-heading">{report.title}</p>

        <nav className="sidebar-nav">
          {SECTIONS.map(({ id: sectionId, label, Icon }) => (
            <button
              key={sectionId}
              type="button"
              className={`nav-item ${activeSection === sectionId ? "is-active" : ""}`}
              onClick={() => switchSection(sectionId)}
            >
              <span className="nav-icon"><Icon size={15} /></span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="main-header">
          <h2 className="main-title">{section.label}</h2>
          <span className="count-badge">
            {items.length} {isPlan ? "days" : "questions"}
          </span>
        </header>

        {items.length === 0 && <p className="empty-text">Nothing in this section.</p>}

        {!isPlan && (
          <div className="question-list">
            {items.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <article key={i} className={`question-card ${isOpen ? "is-open" : ""}`}>
                  <button type="button" className="question-header" onClick={() => toggle(i)} aria-expanded={isOpen}>
                    <span className="q-badge">Q{i + 1}</span>
                    <span className="q-text">{item.question}</span>
                    <FiChevronDown size={18} className="chevron" />
                  </button>

                  {isOpen && (
                    <div className="question-body">
                      <p className="q-label">Why they ask</p>
                      <p>{item.intention}</p>
                      <p className="q-label">How to answer</p>
                      <p>{item.answer}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {isPlan && (
          <ol className="roadmap-list roadmap">
            {items.map((day, i) => {
              const isOpen = openIndex === i;
              return (
                <li key={i} className="roadmap-item">
                  <div className="roadmap-node">
                    <span className="node-circle">{i + 1}</span>
                    {i < items.length - 1 && <span className="node-line" />}
                  </div>

                  <div className={`roadmap-card ${isOpen ? "is-open" : ""}`}>
                    <button type="button" className="roadmap-header" onClick={() => toggle(i)} aria-expanded={isOpen}>
                      <div className="roadmap-heading">
                        <span className="roadmap-phase">Day {i + 1}</span>
                        <h3 className="roadmap-title">{day.focus}</h3>
                        <p className="roadmap-task-count">{day.tasks.length} tasks</p>
                      </div>
                      <FiChevronDown size={18} className="chevron" />
                    </button>

                    {isOpen && (
                      <ul className="roadmap-tasks">
                        {day.tasks.map((task, j) => (
                          <li key={j} className="roadmap-task">
                            <span className="task-dot" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </main>

      <aside className="dashboard-aside">
        <section className="match-section">
          <p className="aside-label">Match score</p>

          <div className="score-ring">
            <svg viewBox="0 0 120 120">
              <circle className="ring-bg" cx="60" cy="60" r={RING_RADIUS} />
              <circle
                className="ring-fg"
                cx="60"
                cy="60"
                r={RING_RADIUS}
                strokeDasharray={RING_LENGTH}
                strokeDashoffset={RING_LENGTH * (1 - score / 100)}
              />
            </svg>
            <div className="score-value">
              <span className="score-num">{score}</span>
              <span className="score-pct">%</span>
            </div>
          </div>

          <p className="score-caption">{scoreCaption(score)}</p>
        </section>

        <section className="skill-gaps">
          <p className="aside-label">Skill gaps</p>

          {report.skillGaps.length === 0 ? (
            <p className="empty-text">No major gaps found.</p>
          ) : (
            <ul className="gap-list">
              {report.skillGaps.map((gap, i) => (
                <li key={i} className={`gap-item gap-${gap.severity}`}>
                  <span>{gap.skill}</span>
                  <span className="gap-severity">{gap.severity}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
};

export default Interview;