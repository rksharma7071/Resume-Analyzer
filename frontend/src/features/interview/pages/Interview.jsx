import React, { useMemo, useState } from "react";
import {
  FiCode,
  FiMessageSquare,
  FiCompass,
  FiChevronDown,
  FiCheckCircle,
  FiCircle,
} from "react-icons/fi";
import "../interview.scss";
import { useInterview } from "../hook/useInterview";


const SECTIONS = [
  { id: "technical", label: "Technical Questions", Icon: FiCode },
  { id: "behavioral", label: "Behavioral Questions", Icon: FiMessageSquare },
  { id: "roadmap", label: "Road Map", Icon: FiCompass },
];

const TECHNICAL_QUESTIONS = [
  {
    question:
      "Explain the Node.js event loop and how it handles asynchronous I/O operations.",
    answer:
      "Node's event loop has six phases (timers, pending callbacks, idle/prepare, poll, check, close). I/O is offloaded to libuv's thread pool, and completed callbacks are queued back into the loop. This is how a single-threaded runtime handles thousands of concurrent connections without blocking.",
  },
  {
    question:
      "How do you optimize a MongoDB aggregation pipeline for high-volume data?",
    answer:
      "Push $match and $project as early as possible to reduce the working set, add compound indexes that match the $match + $sort stages, use $lookup only when necessary, and set allowDiskUse: false to catch inefficient stages. Also profile with explain('executionStats') to find COLLSCANs.",
  },
  {
    question:
      "Can you describe the Cache-Aside pattern and when you would use Redis in a Node.js application?",
    answer:
      "Cache-aside loads data on demand: check cache first, on miss query the DB and write the result to cache with a TTL. Use Redis for session storage, rate limiting, hot read paths (product listings), and pub/sub fan-out. Invalidate on write to avoid stale data.",
  },
  {
    question:
      "What are the challenges of migrating a monolithic application to a modular service-based architecture?",
    answer:
      "Data consistency across services (sagas vs 2PC), distributed transactions, service discovery, network latency, observability (tracing across services), and deployment coordination. Start with a modular monolith — extract services only when team size or scale forces it.",
  },
];

const BEHAVIORAL_QUESTIONS = [
  {
    question: "Tell me about a time you disagreed with a technical decision.",
    answer:
      "Use STAR: describe the context, what the proposed decision was, how you raised concerns with data (benchmarks, trade-offs), how the team resolved it, and what you learned. Emphasize you disagreed on the idea, not the person.",
  },
  {
    question: "Describe a situation where you had to meet a tight deadline.",
    answer:
      "Pick a real project. Explain how you scoped the MVP, communicated trade-offs with stakeholders, cut non-essential features, and delivered. Mention what you'd do differently next time.",
  },
  {
    question: "How do you handle feedback you disagree with?",
    answer:
      "Ask clarifying questions first, restate the feedback to confirm understanding, separate intent from delivery, then decide whether to act. If you disagree, explain your reasoning with evidence — don't just comply or dismiss.",
  },
  {
    question: "Tell me about a time you mentored a junior engineer.",
    answer:
      "Focus on outcomes: what the junior learned, how you structured the learning (pair programming, code reviews, small tasks), and how they grew. Mentoring is measured by their success, not your effort.",
  },
];

const ROADMAP = [
  {
    phase: "Week 1",
    title: "Fundamentals Refresh",
    status: "done",
    tasks: [
      "Revise Node.js event loop and async patterns",
      "Practice 5 MongoDB aggregation problems",
      "Skim Redis caching patterns (cache-aside, write-through)",
    ],
  },
  {
    phase: "Week 2",
    title: "System Design Basics",
    status: "in-progress",
    tasks: [
      "Read 'Designing Data-Intensive Applications' Ch. 1–4",
      "Practice 3 distributed systems case studies (chat, feed, cart)",
      "Diagram a service-based migration for a monolith",
    ],
  },
  {
    phase: "Week 3",
    title: "DevOps & Deployment",
    status: "pending",
    tasks: [
      "Build a CI/CD pipeline with GitHub Actions",
      "Dockerize a Node.js + Mongo app end-to-end",
      "Learn basic Kubernetes concepts (pods, services, ingress)",
    ],
  },
  {
    phase: "Week 4",
    title: "Mock Interviews & Polish",
    status: "pending",
    tasks: [
      "3 mock technical interviews with peers",
      "2 mock behavioral interviews (recorded)",
      "Final resume pass — quantify every bullet point",
    ],
  },
];

const MATCH_SCORE = 88;

const SKILL_GAPS = [
  { skill: "Message Queues (Kafka/RabbitMQ)", severity: "high" },
  { skill: "Advanced Docker & CI/CD Pipelines", severity: "medium" },
  { skill: "Distributed Systems Design", severity: "medium" },
  { skill: "Production-level Redis management", severity: "low" },
];

const SECTION_META = {
  technical: {
    title: "Technical Questions",
    data: TECHNICAL_QUESTIONS,
    badge: (n) => `${n} questions`,
  },
  behavioral: {
    title: "Behavioral Questions",
    data: BEHAVIORAL_QUESTIONS,
    badge: (n) => `${n} questions`,
  },
  roadmap: {
    title: "Preparation Road Map",
    data: ROADMAP,
    badge: (n) => `${n} phases`,
  },
};

const Interview = () => {
  const { report } = useInterview();

  console.log("Report:", report);
  
  const [activeSection, setActiveSection] = useState("technical");
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (i) =>
    setOpenIndex((prev) => (prev === i ? null : i));

  const switchSection = (id) => {
    setActiveSection(id);
    setOpenIndex(null);
  };

  const meta = SECTION_META[activeSection];
  const list = meta.data;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - MATCH_SCORE / 100);

  const roadmapProgress = useMemo(() => {
    if (activeSection !== "roadmap") return null;
    const done = ROADMAP.filter((p) => p.status === "done").length;
    return { done, total: ROADMAP.length };
  }, [activeSection]);

  return (
    <div className="interview-dashboard">

      <aside className="dashboard-sidebar">
        <p className="sidebar-label">Sections</p>

        <nav className="sidebar-nav">
          {SECTIONS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className={`nav-item ${activeSection === id ? "is-active" : ""}`}
              onClick={() => switchSection(id)}
            >
              <span className="nav-icon">
                <Icon size={15} />
              </span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="main-header">
          <h2 className="main-title">{meta.title}</h2>
          <span className="count-badge">{meta.badge(list.length)}</span>
        </header>

        {(activeSection === "technical" || activeSection === "behavioral") && (
          <div className="question-list">
            {list.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <article
                  key={i}
                  className={`question-card ${isOpen ? "is-open" : ""}`}
                >
                  <button
                    type="button"
                    className="question-header"
                    onClick={() => toggleQuestion(i)}
                    aria-expanded={isOpen}
                  >
                    <span className="q-badge">Q{i + 1}</span>
                    <span className="q-text">{item.question}</span>
                    <FiChevronDown size={18} className="chevron" />
                  </button>

                  {isOpen && (
                    <div className="question-body">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {activeSection === "roadmap" && (
          <div className="roadmap">
            {roadmapProgress && (
              <div className="roadmap-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(roadmapProgress.done / roadmapProgress.total) * 100}%`,
                    }}
                  />
                </div>
                <span className="progress-label">
                  {roadmapProgress.done} of {roadmapProgress.total} phases complete
                </span>
              </div>
            )}

            <ol className="roadmap-list">
              {list.map((phase, i) => {
                const isOpen = openIndex === i;
                const isDone = phase.status === "done";
                const isInProgress = phase.status === "in-progress";

                return (
                  <li
                    key={i}
                    className={`roadmap-item status-${phase.status}`}
                  >
                    <div className="roadmap-marker">
                      {isDone ? (
                        <FiCheckCircle size={18} />
                      ) : (
                        <FiCircle size={18} />
                      )}
                    </div>

                    <div className="roadmap-content">
                      <button
                        type="button"
                        className="roadmap-header"
                        onClick={() => toggleQuestion(i)}
                        aria-expanded={isOpen}
                      >
                        <div className="roadmap-heading">
                          <span className="roadmap-phase">{phase.phase}</span>
                          <h3 className="roadmap-title">{phase.title}</h3>
                        </div>

                        <span className={`status-chip status-${phase.status}`}>
                          {isDone
                            ? "Done"
                            : isInProgress
                              ? "In Progress"
                              : "Pending"}
                        </span>

                        <FiChevronDown size={18} className="chevron" />
                      </button>

                      {isOpen && (
                        <ul className="roadmap-tasks">
                          {phase.tasks.map((task, j) => (
                            <li key={j} className="roadmap-task">
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
          </div>
        )}
      </main>

      <aside className="dashboard-aside">
        <section className="match-section">
          <p className="aside-label">Match Score</p>

          <div className="score-ring">
            <svg viewBox="0 0 120 120">
              <circle className="ring-bg" cx="60" cy="60" r={radius} />
              <circle
                className="ring-fg"
                cx="60"
                cy="60"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>

            <div className="score-value">
              <span className="score-num">{MATCH_SCORE}</span>
              <span className="score-pct">%</span>
            </div>
          </div>

          <p className="score-caption">Strong match for this role</p>
        </section>

        <section className="skill-gaps">
          <p className="aside-label">Skill Gaps</p>

          <ul className="gap-list">
            {SKILL_GAPS.map((g, i) => (
              <li key={i} className={`gap-item gap-${g.severity}`}>
                {g.skill}
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
};

export default Interview;