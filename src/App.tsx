import { useState, useEffect, useRef } from "react";
import {
  personalInfo,
  skills,
  tools,
  experience,
  education,
  projects,
} from "./data/portfolio";

import profileImg from "./assets/Proimg1.jpeg";
import Scene3D from "./Scene3D";

// ── Custom cursor ──────────────────────────────────────────────
function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "2px solid #6C63FF",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%,-50%)",
          transition: "left 0.15s ease,top 0.15s ease",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#00E5FF",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%,-50%)",
          transition: "left 0.05s,top 0.05s",
        }}
      />
    </>
  );
}

// ── Wave text ──────────────────────────────────────────────────
function WaveText({
  text,
  delay = 0,
  gradient = false,
}: {
  text: string;
  delay?: number;
  gradient?: boolean;
}) {
  return (
    <span
      style={
        gradient
          ? {
              background: "linear-gradient(135deg,#6C63FF,#00E5FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }
          : {}
      }
    >
      {text.split("").map((c, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            animation: `letterWave 2.5s ease infinite`,
            animationDelay: `${delay + i * 0.07}s`,
          }}
        >
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </span>
  );
}

// ── Skill bar ──────────────────────────────────────────────────
function SkillBar({
  name,
  level,
  color,
}: {
  name: string;
  level: number;
  color: string;
}) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setTimeout(() => setW(level), 200);
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [level]);
  return (
    <div ref={ref} style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: "#E2E8F0" }}>
          {name}
        </span>
        <span style={{ fontSize: 12, color: "#94A3B8" }}>{level}%</span>
      </div>
      <div
        style={{
          height: 3,
          background: "#1E293B",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${w}%`,
            background: color,
            borderRadius: 2,
            transition: "width 1.2s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────────
function Section({
  id,
  children,
  dark = false,
}: {
  id: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      style={{
        padding: "100px 48px",
        background: dark
          ? "linear-gradient(160deg,#0A0518,#080820)"
          : "transparent",
        borderTop: dark ? "1px solid rgba(108,99,255,0.1)" : undefined,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.15em",
          color: "#6C63FF",
          fontWeight: 600,
          textTransform: "uppercase",
          display: "block",
          marginBottom: 8,
        }}
      >
        {label}
      </span>
      <div
        style={{
          width: 48,
          height: 2,
          background: "linear-gradient(90deg,#6C63FF,#00E5FF)",
          borderRadius: 1,
        }}
      />
    </div>
  );
}

// ── Project card ───────────────────────────────────────────────
function ProjectCard({
  project,
  onClick,
}: {
  project: (typeof projects)[0];
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${project.color}08` : "rgba(17,24,39,0.6)",
        border: `1px solid ${hovered ? project.color + "44" : "rgba(108,99,255,0.1)"}`,
        borderRadius: 16,
        padding: 28,
        cursor: "pointer",
        transition: "all 0.3s",
        transform: hovered ? "translateY(-6px)" : "none",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `${project.color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          {project.category.includes("UI/UX") ||
          project.category.includes("Mobile")
            ? "🎨"
            : "💻"}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span style={{ fontSize: 11, color: "#64748B" }}>{project.year}</span>
          <span
            style={{
              fontSize: 11,
              background: `${project.color}20`,
              border: `1px solid ${project.color}44`,
              color: project.color,
              borderRadius: 6,
              padding: "3px 8px",
              fontWeight: 600,
            }}
          >
            {project.category}
          </span>
        </div>
      </div>
      <h3
        style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: 18,
          fontWeight: 700,
          color: "#F1F5F9",
          marginBottom: 8,
        }}
      >
        {project.title}
      </h3>
      <p
        style={{
          fontSize: 13,
          color: "#64748B",
          marginBottom: 16,
          lineHeight: 1.6,
        }}
      >
        {project.subtitle}
      </p>
      <p
        style={{
          fontSize: 12,
          color: "#94A3B8",
          lineHeight: 1.7,
          marginBottom: 14,
        }}
      >
        {project.overview}
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: project.award ? 12 : 0,
        }}
      >
        {project.tags.map((t) => (
          <span
            key={t}
            style={{
              background: "#1E293B",
              border: "1px solid #334155",
              borderRadius: 6,
              padding: "3px 10px",
              fontSize: 11,
              color: "#94A3B8",
            }}
          >
            {t}
          </span>
        ))}
      </div>
      {project.award && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(108,99,255,0.15)",
            border: "1px solid rgba(108,99,255,0.3)",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 12,
            color: "#A78BFA",
            fontWeight: 600,
          }}
        >
          {project.award}
        </div>
      )}
      {hovered && (
        <div
          style={{
            marginTop: 14,
            fontSize: 13,
            color: project.color,
            fontWeight: 600,
          }}
        >
          View Details →
        </div>
      )}
    </div>
  );
}

// ── Project Detail Modal ───────────────────────────────────────
function ProjectModal({
  project,
  onClose,
}: {
  project: (typeof projects)[0];
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(5,8,22,0.85)",
          backdropFilter: "blur(12px)",
        }}
      />
      <div
        style={{
          position: "relative",
          maxWidth: 760,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          background: `linear-gradient(135deg,#0D0D1A,#111827)`,
          border: `1px solid ${project.color}33`,
          borderRadius: 24,
          padding: 40,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "none",
            border: "1px solid #334155",
            color: "#94A3B8",
            borderRadius: 8,
            padding: "6px 14px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
          }}
        >
          ✕ Close
        </button>
        <div style={{ fontSize: 48, marginBottom: 16 }}>
          {project.category.includes("UI/UX") ||
          project.category.includes("Mobile")
            ? "🎨"
            : "💻"}
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <span
            style={{
              fontSize: 12,
              background: `${project.color}20`,
              border: `1px solid ${project.color}44`,
              color: project.color,
              borderRadius: 6,
              padding: "4px 10px",
              fontWeight: 600,
            }}
          >
            {project.category}
          </span>
          <span
            style={{
              fontSize: 12,
              background: "#1E293B",
              border: "1px solid #334155",
              color: "#94A3B8",
              borderRadius: 6,
              padding: "4px 10px",
            }}
          >
            {project.year}
          </span>
        </div>
        <h2
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: "#F1F5F9",
            marginBottom: 8,
          }}
        >
          {project.title}
        </h2>
        <p style={{ fontSize: 15, color: "#94A3B8", marginBottom: 24 }}>
          {project.subtitle}
        </p>
        {project.award && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(108,99,255,0.15)",
              border: "1px solid rgba(108,99,255,0.3)",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 14,
              color: "#A78BFA",
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            {project.award}
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 24,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid #1E293B",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <h3
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "#F1F5F9",
                marginBottom: 12,
              }}
            >
              Project Overview
            </h3>
            <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.85 }}>
              {project.overview}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid #1E293B",
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#475569",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                My Role
              </div>
              <div style={{ fontSize: 14, color: "#E2E8F0", fontWeight: 500 }}>
                {project.role}
              </div>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid #1E293B",
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#475569",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Tools Used
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {project.tools.map((t) => (
                  <span
                    key={t}
                    style={{
                      background: "#1E293B",
                      border: "1px solid #334155",
                      borderRadius: 20,
                      padding: "4px 12px",
                      fontSize: 11,
                      color: "#94A3B8",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid #1E293B",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <h3
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "#F1F5F9",
              marginBottom: 16,
            }}
          >
            Key Features
          </h3>
          {project.highlights.map((h, i) => (
            <div
              key={h}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 0",
                borderBottom: "1px solid #1E293B",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: `${project.color}20`,
                  border: `1px solid ${project.color}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: project.color,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <span style={{ fontSize: 14, color: "#CBD5E1" }}>{h}</span>
            </div>
          ))}
        </div>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: `linear-gradient(135deg,${project.color},${project.color === "#6C63FF" ? "#00E5FF" : "#6C63FF"})`,
              color: "#fff",
              borderRadius: 10,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            🐱 View on GitHub
          </a>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState("Home");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);
  const [activeSkillTab, setActiveSkillTab] = useState<
    "design" | "frontend" | "backend"
  >("design");
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  const scrollTo = (id: string) => {
    setActiveNav(id);
    document
      .getElementById(id.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const skillColors = {
    design: "linear-gradient(90deg,#6C63FF,#A78BFA)",
    frontend: "linear-gradient(90deg,#00E5FF,#6C63FF)",
    backend: "linear-gradient(90deg,#A78BFA,#00E5FF)",
  };

  // ── Send Message Function ──
  const sendMessage = () => {
    const nameInput = document.querySelector('input[placeholder="Your Name"]') as HTMLInputElement;
    const emailInput = document.querySelector('input[placeholder="Your Email"]') as HTMLInputElement;
    const subjectInput = document.querySelector('input[placeholder="Subject"]') as HTMLInputElement;
    const messageInput = document.querySelector('textarea[placeholder="Your Message"]') as HTMLTextAreaElement;

    const name = nameInput?.value || '';
    const email = emailInput?.value || '';
    const subject = subjectInput?.value || 'Portfolio Contact';
    const message = messageInput?.value || '';

    // Validate required fields
    if (!name || !email || !message) {
      alert('Please fill in Name, Email, and Message fields.');
      return;
    }

    // Send via FormSubmit.co
    fetch('https://formsubmit.co/ajax/vimukthit19@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        subject: subject,
        message: message
      })
    })
    .then(response => response.json())
    .then(() => {
      alert('✅ Message sent successfully! I\'ll get back to you soon.');
      // Clear form
      if (nameInput) nameInput.value = '';
      if (emailInput) emailInput.value = '';
      if (subjectInput) subjectInput.value = '';
      if (messageInput) messageInput.value = '';
    })
    .catch(() => {
      alert('❌ Failed to send message. Please try again or email me directly at vimukthit19@gmail.com');
    });
  };

  return (
    <div
      style={{
        fontFamily: "'Space Grotesk',sans-serif",
        background: "linear-gradient(160deg,#050816 0%,#0B0620 100%)",
        color: "#F8FAFC",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Cursor />
      <style>{`
        @keyframes letterWave { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(108,99,255,0.4)} 50%{box-shadow:0 0 0 14px transparent} }
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        body { cursor:none !important; }
        a,button { cursor:none !important; }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#050816} ::-webkit-scrollbar-thumb{background:linear-gradient(#6C63FF,#00E5FF);border-radius:2px}
      `}</style>

      {/* ── NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(5,8,22,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(108,99,255,0.1)",
          height: 68,
          display: "flex",
          alignItems: "center",
          padding: "0 48px",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: "#6C63FF" }}>T</span>haraka
          <span style={{ color: "#00E5FF" }}>.</span>
        </span>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Home", "About", "Skills", "Projects", "Contact"].map((l) => (
            <span
              key={l}
              onClick={() => scrollTo(l)}
              style={{
                cursor: "none",
                fontSize: 14,
                fontWeight: 500,
                color: activeNav === l ? "#00E5FF" : "#94A3B8",
                transition: "color 0.2s",
                letterSpacing: "0.02em",
              }}
            >
              {l}
            </span>
          ))}
          <button
            onClick={() => scrollTo("Contact")}
            style={{
              background: "linear-gradient(135deg,#6C63FF,#00E5FF)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "9px 22px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "none",
              fontFamily: "inherit",
            }}
          >
            Hire Me
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        id="home"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "120px 48px 80px",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(160deg,#050816 0%,#0B0620 100%)",
        }}
      >
        {/* grid bg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(108,99,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.05) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
          }}
        />
        {/* glow orbs */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(108,99,255,0.15) 0%,transparent 70%)",
            top: -200,
            right: -100,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(0,229,255,0.08) 0%,transparent 70%)",
            bottom: 100,
            left: "5%",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 80,
            width: "100%",
            maxWidth: 1100,
            margin: "0 auto",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "none" : "translateY(30px)",
            transition: "all 0.9s cubic-bezier(.4,0,.2,1)",
          }}
        >
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontSize: 20,
                letterSpacing: "0.18em",
                color: "#6C63FF",
                fontWeight: 700,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}
            >
              UI/UX Designer & Frontend Developer
            </span>
            <h1
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 58,
                fontWeight: 700,
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                color: "#F1F5F9",
                marginBottom: 24,
              }}
            >
              <WaveText text="Tharaka" delay={0} />
              <br />
              {/* <WaveText text="Vimukthi" delay={0.56} gradient /><br /> */}
              <WaveText text="Bandara" delay={1.12} />
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "#64748B",
                lineHeight: 1.78,
                maxWidth: 440,
                marginBottom: 36,
              }}
            >
              Crafting intuitive digital experiences through thoughtful UI/UX
              design and clean frontend code. Based in Colombo, Sri Lanka.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button
                onClick={() => scrollTo("Projects")}
                style={{
                  background: "linear-gradient(135deg,#6C63FF,#00E5FF)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 30px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "none",
                  fontFamily: "inherit",
                  boxShadow: "0 8px 24px rgba(108,99,255,0.35)",
                }}
              >
                View Projects
              </button>
              <button
                onClick={() => scrollTo("Contact")}
                style={{
                  background: "transparent",
                  color: "#6C63FF",
                  border: "1px solid rgba(108,99,255,0.4)",
                  borderRadius: 12,
                  padding: "14px 30px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "none",
                  fontFamily: "inherit",
                }}
              >
                Get In Touch
              </button>
            </div>
            <div
              style={{
                display: "flex",
                gap: 24,
                marginTop: 52,
                flexWrap: "wrap",
              }}
            >
              {personalInfo.stats.map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "rgba(17,24,39,0.6)",
                    border: "1px solid rgba(108,99,255,0.1)",
                    borderRadius: 12,
                    padding: "18px 24px",
                    backdropFilter: "blur(10px)",
                    minWidth: 90,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: 32,
                      fontWeight: 700,
                      background: "linear-gradient(135deg,#6C63FF,#00E5FF)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#475569",
                      marginTop: 6,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Scene side */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Scene3D profileImg={profileImg} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                width: 200,
              }}
            >
              {[
                ["Figma", "#6C63FF"],
                ["Adobe XD", "#00E5FF"],
                ["React / Next.js", "#6C63FF"],
              ].map(([t, c], i) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "rgba(17,24,39,0.7)",
                    border: "1px solid rgba(108,99,255,0.1)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    backdropFilter: "blur(10px)",
                    animation: "slideUp 0.5s ease forwards",
                    animationDelay: `${0.3 + i * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: c,
                      boxShadow: `0 0 10px ${c}`,
                    }}
                  />
                  <span
                    style={{ fontSize: 13, color: "#CBD5E1", fontWeight: 500 }}
                  >
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <Section id="about" dark>
        <SectionLabel label="About Me" />
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 52 }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#F1F5F9",
                marginBottom: 24,
                lineHeight: 1.15,
              }}
            >
              Passionate about{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#6C63FF,#00E5FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                design
              </span>{" "}
              &{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#00E5FF,#6C63FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                code
              </span>
            </h2>
            <p
              style={{
                color: "#64748B",
                lineHeight: 1.85,
                fontSize: 15,
                marginBottom: 20,
              }}
            >
              {personalInfo.bio}
            </p>
            <p style={{ color: "#64748B", lineHeight: 1.85, fontSize: 15 }}>
              Currently working as a Computer Programmer at Central Engineering
              Services, where I develop ERP systems with C# and React. I combine
              design thinking with development skills to build products people
              love.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                icon: "🎓",
                title: "BEng (Hons) Software Engineering",
                sub: "ESOFT University, Colombo – 2026",
              },
              {
                icon: "📜",
                title: "Higher Diploma in Software Engineering",
                sub: "NIBM, Kandy – 2022",
              },
              {
                icon: "💼",
                title: "Computer Programmer",
                sub: "Central Engineering Services – 2025–Present",
              },
              {
                icon: "🏆",
                title: "Best Software Solution Award",
                sub: "Industry Minds Competition, ICET – 2024",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(17,24,39,0.5)",
                  border: "1px solid rgba(108,99,255,0.1)",
                  borderRadius: 14,
                  padding: "16px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#E2E8F0",
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#475569" }}>
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SKILLS ── */}
      <Section id="skills">
        <SectionLabel label="Skills & Tools" />
        <h2
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: "#F1F5F9",
            marginBottom: 40,
          }}
        >
          What I Work With
        </h2>
        <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
          {(["design", "frontend", "backend"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSkillTab(tab)}
              style={{
                background:
                  activeSkillTab === tab
                    ? "linear-gradient(135deg,#6C63FF,#00E5FF)"
                    : "transparent",
                color: activeSkillTab === tab ? "#fff" : "#64748B",
                border: `1px solid ${activeSkillTab === tab ? "transparent" : "rgba(108,99,255,0.2)"}`,
                borderRadius: 8,
                padding: "9px 20px",
                fontSize: 13,
                cursor: "none",
                fontFamily: "inherit",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginBottom: 60,
          }}
        >
          {skills[activeSkillTab].map((s) => (
            <SkillBar
              key={s.name}
              name={s.name}
              level={s.level}
              color={skillColors[activeSkillTab]}
            />
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(108,99,255,0.1)",
            paddingTop: 48,
          }}
        >
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.12em",
              color: "#475569",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Tools & Technologies
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {tools.map((t) => (
              <div
                key={t.name}
                style={{
                  background: "rgba(17,24,39,0.6)",
                  border: "1px solid rgba(108,99,255,0.1)",
                  borderRadius: 10,
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  backdropFilter: "blur(8px)",
                }}
              >
                <span style={{ fontSize: 14 }}>{t.icon}</span>
                <span
                  style={{ fontSize: 12, color: "#CBD5E1", fontWeight: 500 }}
                >
                  {t.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── EXPERIENCE ── */}
      <Section id="experience" dark>
        <SectionLabel label="Experience" />
        <h2
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: "#F1F5F9",
            marginBottom: 40,
          }}
        >
          Work History
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {experience.map((exp, i) => (
            <div
              key={i}
              style={{
                background: "rgba(17,24,39,0.5)",
                border: `1px solid ${exp.color}22`,
                borderRadius: 16,
                padding: "28px 32px",
                backdropFilter: "blur(10px)",
                borderLeft: `3px solid ${exp.color}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#F1F5F9",
                      marginBottom: 4,
                    }}
                  >
                    {exp.role}
                  </h3>
                  <p
                    style={{ fontSize: 14, color: exp.color, fontWeight: 600 }}
                  >
                    {exp.company}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    background: `${exp.color}15`,
                    border: `1px solid ${exp.color}33`,
                    color: exp.color,
                    borderRadius: 8,
                    padding: "5px 12px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {exp.period}
                </span>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 16,
                }}
              >
                {exp.description.map((d, j) => (
                  <li
                    key={j}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{ color: exp.color, marginTop: 3, flexShrink: 0 }}
                    >
                      →
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: "#94A3B8",
                        lineHeight: 1.6,
                      }}
                    >
                      {d}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── PROJECTS ── */}
      <Section id="projects">
        <SectionLabel label="Projects" />
        <h2
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: "#F1F5F9",
            marginBottom: 8,
          }}
        >
          Selected Work
        </h2>
        <p style={{ fontSize: 15, color: "#64748B", marginBottom: 36 }}>
          Click any project to explore details
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 36,
          }}
        >
          {["All", "UI/UX Design", "Full Stack", "Mobile UI/UX"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                background:
                  activeFilter === f
                    ? "linear-gradient(135deg,#6C63FF,#00E5FF)"
                    : "transparent",
                color: activeFilter === f ? "#fff" : "#64748B",
                border: `1px solid ${activeFilter === f ? "transparent" : "rgba(108,99,255,0.2)"}`,
                borderRadius: 8,
                padding: "8px 18px",
                fontSize: 13,
                cursor: "none",
                fontFamily: "inherit",
                fontWeight: 500,
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onClick={() => setSelectedProject(p)}
            />
          ))}
        </div>
      </Section>

      {/* ── EDUCATION ── */}
      <Section id="education" dark>
        <SectionLabel label="Education" />
        <h2
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: "#F1F5F9",
            marginBottom: 40,
          }}
        >
          Academic Background
        </h2>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 0,
              bottom: 0,
              width: 2,
              background: "linear-gradient(180deg,#6C63FF,#00E5FF)",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              paddingLeft: 52,
            }}
          >
            {education.map((ed, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: -42,
                    top: 8,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: ed.color,
                    boxShadow: `0 0 12px ${ed.color}`,
                    border: "2px solid #050816",
                  }}
                />
                <div
                  style={{
                    background: "rgba(17,24,39,0.5)",
                    border: `1px solid ${ed.color}22`,
                    borderRadius: 14,
                    padding: "20px 24px",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: ed.color,
                          marginBottom: 6,
                        }}
                      >
                        {ed.degree}
                      </div>
                      <div style={{ fontSize: 14, color: "#94A3B8" }}>
                        {ed.icon} {ed.school}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#475569",
                        whiteSpace: "nowrap",
                        marginLeft: 16,
                      }}
                    >
                      {ed.period}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CONTACT ── */}
      <Section id="contact">
        <SectionLabel label="Contact" />
        <h2
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: "#F1F5F9",
            marginBottom: 8,
          }}
        >
          Let's Work Together
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "#64748B",
            marginBottom: 48,
            maxWidth: 500,
          }}
        >
          Open to freelance UI/UX design projects and full-time opportunities.
          Let's create something amazing together.
        </p>
        <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            {[
              [
                "📧",
                "Email",
                personalInfo.email,
                `vimukthit19@gmail.com`,
              ],
              ["📱", "Phone", "+94 766 545 411", "tel:+94766545411"],
              [
                "🌐",
                "Website",
                personalInfo.website,
                `https://chipzy368r.netlify.app/`,
              ],
              [
                "🐱",
                "GitHub",
                personalInfo.github,
                `https://github.com/Chipzy98`,
              ],
            ].map(([icon, label, val, href]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  background: "rgba(17,24,39,0.5)",
                  border: "1px solid rgba(108,99,255,0.1)",
                  borderRadius: 12,
                  padding: "16px 20px",
                  marginBottom: 14,
                  backdropFilter: "blur(10px)",
                }}
              >
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#475569",
                      marginBottom: 2,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {label}
                  </div>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 14,
                      color: "#6C63FF",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    {val}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              flex: 1,
              background: "rgba(17,24,39,0.5)",
              border: "1px solid rgba(108,99,255,0.1)",
              borderRadius: 16,
              padding: 32,
              backdropFilter: "blur(10px)",
            }}
          >
            <h3
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#F1F5F9",
                marginBottom: 24,
              }}
            >
              Quick Message
            </h3>
            {["Your Name", "Your Email", "Subject"].map((ph) => (
              <input
                key={ph}
                placeholder={ph}
                style={{
                  display: "block",
                  width: "100%",
                  background: "rgba(5,8,22,0.8)",
                  border: "1px solid rgba(108,99,255,0.15)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  color: "#E2E8F0",
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "inherit",
                  marginBottom: 14,
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(108,99,255,0.15)")
                }
              />
            ))}
            <textarea
              placeholder="Your Message"
              rows={4}
              style={{
                display: "block",
                width: "100%",
                background: "rgba(5,8,22,0.8)",
                border: "1px solid rgba(108,99,255,0.15)",
                borderRadius: 10,
                padding: "12px 16px",
                color: "#E2E8F0",
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
                resize: "vertical",
                marginBottom: 16,
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(108,99,255,0.15)")
              }
            />
            <button
              onClick={sendMessage}
              style={{
                width: "100%",
                background: "linear-gradient(135deg,#6C63FF,#00E5FF)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "14px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "none",
                fontFamily: "inherit",
                boxShadow: "0 8px 24px rgba(108,99,255,0.35)",
              }}
            >
              Send Message
            </button>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "24px 48px",
          borderTop: "1px solid rgba(108,99,255,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(5,8,22,0.5)",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          <span style={{ color: "#6C63FF" }}>T</span>haraka
          <span style={{ color: "#00E5FF" }}>.</span>
        </span>
        <span style={{ fontSize: 12, color: "#475569" }}>
          © 2025 Tharaka Vimukthi Bandara. All rights reserved.
        </span>
      </footer>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}