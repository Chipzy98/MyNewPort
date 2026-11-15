import { useState, useEffect, useRef } from "react";
import type { ReactNode, CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Code2,
  Download,
  ExternalLink,
  Figma,
  FileDown,
  Github,
  Globe,
  GraduationCap,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Palette,
  Phone,
  Send,
  Server,
  Smartphone,
  Sparkles,
  Trophy,
  Wrench,
  X,
} from "lucide-react";
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

type Project = (typeof projects)[0];

const NAV = ["Home", "About", "Skills", "Projects", "Contact"];
const GRAD = "linear-gradient(135deg,#6C63FF,#00E5FF)";
const HEAD = "'Space Grotesk',sans-serif";

// ── Responsive hook ─────────────────────────────────────────────
function useBreakpoint() {
  const get = () => (typeof window !== "undefined" ? window.innerWidth : 1280);
  const [w, setW] = useState(get);
  useEffect(() => {
    const onResize = () => setW(get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return { isMobile: w <= 768, isTablet: w <= 1024 };
}

// ── Custom cursor (desktop only) ────────────────────────────────
function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useBreakpoint();
  useEffect(() => {
    if (isMobile) return;
    const move = (e: MouseEvent) => {
      for (const el of [cursorRef.current, dotRef.current]) {
        if (el) {
          el.style.left = e.clientX + "px";
          el.style.top = e.clientY + "px";
        }
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isMobile]);

  if (isMobile) return null;
  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "1.5px solid rgba(108,99,255,0.9)",
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
          width: 6,
          height: 6,
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

// ── Reveal on scroll ───────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(24px)",
        transition: `opacity .7s ease ${delay}s, transform .7s cubic-bezier(.2,.7,.2,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
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
  children: ReactNode;
  dark?: boolean;
}) {
  const { isMobile } = useBreakpoint();
  return (
    <section
      id={id}
      style={{
        position: "relative",
        padding: isMobile ? "72px 20px" : "110px 48px",
        background: dark
          ? "linear-gradient(180deg,rgba(10,5,24,0.6),rgba(8,8,32,0.6))"
          : "transparent",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function SectionHeading({
  label,
  title,
  sub,
}: {
  label: string;
  title: ReactNode;
  sub?: string;
}) {
  const { isMobile } = useBreakpoint();
  return (
    <Reveal style={{ marginBottom: isMobile ? 32 : 48 }}>
      <span className="eyebrow">
        <Sparkles size={12} /> {label}
      </span>
      <h2
        style={{
          fontFamily: HEAD,
          fontSize: isMobile ? 30 : 44,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "#F8FAFC",
          marginTop: 16,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            fontSize: 15,
            color: "#94A3B8",
            marginTop: 12,
            maxWidth: 560,
            lineHeight: 1.7,
          }}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}

function Grad({ children }: { children: ReactNode }) {
  return <span className="text-grad">{children}</span>;
}

function IconBox({
  children,
  color = "#6C63FF",
  size = 44,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        background: `linear-gradient(135deg,${color}26,${color}0D)`,
        border: `1px solid ${color}40`,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="chip">{children}</span>;
}

const isDesign = (p: Project) =>
  p.category.includes("UI/UX") || p.category.includes("Mobile");

function ProjectIcon({ project, size }: { project: Project; size: number }) {
  if (project.category.includes("Mobile")) return <Smartphone size={size} />;
  if (isDesign(project)) return <Palette size={size} />;
  return <Code2 size={size} />;
}

const cleanAward = (a: string) => a.replace(/^[^A-Za-z0-9]+/, "");

// ── Project card ───────────────────────────────────────────────
function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  const c = project.color;
  return (
    <div
      className="glass lift project-card"
      onClick={onClick}
      style={{ borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Cover */}
      <div
        style={{
          position: "relative",
          height: 150,
          background: `radial-gradient(120% 140% at 0% 0%, ${c}55 0%, transparent 55%), radial-gradient(120% 140% at 100% 100%, ${c === "#6C63FF" ? "#00E5FF" : "#6C63FF"}33 0%, transparent 60%), #0B0D1E`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(180deg,#000 20%,transparent)",
            WebkitMaskImage: "linear-gradient(180deg,#000 20%,transparent)",
          }}
        />
        <div
          className="cover-icon"
          style={{
            position: "absolute",
            right: 22,
            bottom: -18,
            color: `${c}`,
            opacity: 0.35,
            transition: "transform .5s cubic-bezier(.2,.7,.2,1), opacity .4s",
          }}
        >
          <ProjectIcon project={project} size={120} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#fff",
              background: "rgba(5,8,22,0.55)",
              border: `1px solid ${c}66`,
              borderRadius: 999,
              padding: "5px 11px",
              backdropFilter: "blur(8px)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <ProjectIcon project={project} size={12} />
            {project.category}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "#CBD5E1",
              background: "rgba(5,8,22,0.55)",
              borderRadius: 999,
              padding: "5px 10px",
              backdropFilter: "blur(8px)",
            }}
          >
            {project.year}
          </span>
        </div>
        {project.award && (
          <span
            style={{
              position: "absolute",
              left: 16,
              bottom: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              color: "#FDE68A",
              background: "rgba(120,53,15,0.55)",
              border: "1px solid rgba(253,230,138,0.35)",
              borderRadius: 999,
              padding: "5px 11px",
              backdropFilter: "blur(8px)",
            }}
          >
            <Trophy size={12} /> {cleanAward(project.award)}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3
          style={{
            fontFamily: HEAD,
            fontSize: 19,
            fontWeight: 700,
            color: "#F8FAFC",
            letterSpacing: "-0.01em",
            marginBottom: 4,
          }}
        >
          {project.title}
        </h3>
        <p style={{ fontSize: 13, color: c, fontWeight: 500, marginBottom: 12 }}>
          {project.subtitle}
        </p>
        <p className="clamp-3" style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.7, marginBottom: 16 }}>
          {project.overview}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {project.tags.slice(0, 5).map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
          {project.tags.length > 5 && <Chip>+{project.tags.length - 5}</Chip>}
        </div>
        <div
          style={{
            marginTop: "auto",
            paddingTop: 14,
            borderTop: "1px solid rgba(148,163,184,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span className="card-cta" style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", display: "inline-flex", alignItems: "center", gap: 6 }}>
            View case study <ArrowUpRight size={15} className="cta-arrow" />
          </span>
          <span style={{ display: "flex", gap: 8, color: "#64748B" }}>
            {project.github && <Github size={16} />}
            {project.figma && <Figma size={16} />}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Project Detail Modal ───────────────────────────────────────
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const { isMobile } = useBreakpoint();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  const c = project.color;
  const panel: CSSProperties = {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(148,163,184,0.1)",
    borderRadius: 16,
    padding: isMobile ? 18 : 22,
  };
  const micro: CSSProperties = {
    fontSize: 11,
    color: "#64748B",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 10,
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? 12 : 24,
        animation: "fadeIn .25s ease",
      }}
      onClick={onClose}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(3,5,15,0.8)", backdropFilter: "blur(14px)" }} />
      <div
        className="glass"
        style={{
          position: "relative",
          maxWidth: 800,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: isMobile ? 18 : 26,
          animation: "popIn .35s cubic-bezier(.2,.7,.2,1)",
          background: "linear-gradient(rgba(10,12,28,0.96),rgba(10,12,28,0.96)) padding-box, linear-gradient(135deg,rgba(108,99,255,.55),rgba(0,229,255,.2) 50%,rgba(108,99,255,.1)) border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header band */}
        <div
          style={{
            position: "relative",
            padding: isMobile ? "22px 20px" : "34px 40px 28px",
            background: `radial-gradient(100% 160% at 0% 0%, ${c}40 0%, transparent 60%)`,
            borderBottom: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="icon-btn"
            style={{ position: "absolute", top: isMobile ? 14 : 22, right: isMobile ? 14 : 22 }}
          >
            <X size={18} />
          </button>
          <IconBox color={c} size={isMobile ? 48 : 56}>
            <ProjectIcon project={project} size={isMobile ? 22 : 26} />
          </IconBox>
          <div style={{ display: "flex", gap: 8, margin: "18px 0 12px", flexWrap: "wrap" }}>
            <span className="pill" style={{ color: c, borderColor: `${c}55`, background: `${c}1A` }}>
              {project.category}
            </span>
            <span className="pill">{project.year}</span>
            {project.award && (
              <span className="pill" style={{ color: "#FDE68A", borderColor: "rgba(253,230,138,0.35)", background: "rgba(120,53,15,0.35)" }}>
                <Trophy size={12} /> {cleanAward(project.award)}
              </span>
            )}
          </div>
          <h2
            style={{
              fontFamily: HEAD,
              fontSize: isMobile ? 26 : 36,
              fontWeight: 700,
              color: "#F8FAFC",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              paddingRight: 40,
            }}
          >
            {project.title}
          </h2>
          <p style={{ fontSize: 15, color: "#94A3B8", marginTop: 6 }}>{project.subtitle}</p>
        </div>

        <div style={{ padding: isMobile ? 20 : "28px 40px 36px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.7fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div style={panel}>
              <div style={micro}>Overview</div>
              <p style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.85 }}>{project.overview}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={panel}>
                <div style={micro}>My Role</div>
                <div style={{ fontSize: 14, color: "#F1F5F9", fontWeight: 600 }}>{project.role}</div>
              </div>
              <div style={panel}>
                <div style={micro}>Tools</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {project.tools.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ ...panel, marginBottom: 24 }}>
            <div style={micro}>Key Features</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
              {project.highlights.map((h, i) => (
                <div key={h} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      background: `${c}1F`,
                      border: `1px solid ${c}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      color: c,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <span style={{ fontSize: 14, color: "#CBD5E1" }}>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <Github size={16} /> View on GitHub <ExternalLink size={14} />
              </a>
            )}
            {project.figma && (
              <a href={project.figma} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <Figma size={16} /> View in Figma <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────
export default function App() {
  const { isMobile, isTablet } = useBreakpoint();
  const [activeNav, setActiveNav] = useState("Home");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy for nav highlight
  useEffect(() => {
    const ids = NAV.map((n) => n.toLowerCase());
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const name = NAV.find((n) => n.toLowerCase() === e.target.id);
            if (name) setActiveNav(name);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setActiveNav(id);
    setMobileMenuOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  const filters = ["All", "UI/UX Design", "Full Stack", "Mobile UI/UX"];
  const filtered =
    activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);
  const countFor = (f: string) =>
    f === "All" ? projects.length : projects.filter((p) => p.category === f).length;

  // ── Send Message Function ──
  const sendMessage = () => {
    const nameInput = document.querySelector('input[placeholder="Your Name"]') as HTMLInputElement;
    const emailInput = document.querySelector('input[placeholder="Your Email"]') as HTMLInputElement;
    const subjectInput = document.querySelector('input[placeholder="Subject"]') as HTMLInputElement;
    const messageInput = document.querySelector('textarea[placeholder="Your Message"]') as HTMLTextAreaElement;

    const name = nameInput?.value || "";
    const email = emailInput?.value || "";
    const subject = subjectInput?.value || "Portfolio Contact";
    const message = messageInput?.value || "";

    if (!name || !email || !message) {
      alert("Please fill in Name, Email, and Message fields.");
      return;
    }

    fetch("https://formsubmit.co/ajax/vimukthit19@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, email, subject, message }),
    })
      .then((response) => response.json())
      .then(() => {
        alert("✅ Message sent successfully! I'll get back to you soon.");
        if (nameInput) nameInput.value = "";
        if (emailInput) emailInput.value = "";
        if (subjectInput) subjectInput.value = "";
        if (messageInput) messageInput.value = "";
      })
      .catch(() => {
        alert("❌ Failed to send message. Please try again or email me directly at vimukthit19@gmail.com");
      });
  };

  const skillGroups = [
    { key: "design" as const, title: "Design", icon: <Palette size={20} />, color: "#A78BFA", blurb: "Research-led interfaces, wireframes and design systems." },
    { key: "frontend" as const, title: "Frontend", icon: <Code2 size={20} />, color: "#00E5FF", blurb: "Fast, responsive and accessible web apps." },
    { key: "backend" as const, title: "Backend", icon: <Server size={20} />, color: "#6C63FF", blurb: "APIs, data models and business logic." },
  ];

  const contacts: { icon: ReactNode; label: string; val: string; href: string; color: string }[] = [
    { icon: <Mail size={18} />, label: "Email", val: personalInfo.email, href: `mailto:${personalInfo.email}`, color: "#6C63FF" },
    { icon: <Phone size={18} />, label: "Phone", val: "+94 766 545 411", href: "tel:+94766545411", color: "#00E5FF" },
    { icon: <Globe size={18} />, label: "Website", val: personalInfo.website, href: "https://chipzy368r.netlify.app/", color: "#A78BFA" },
    { icon: <Github size={18} />, label: "GitHub", val: personalInfo.github, href: "https://github.com/Chipzy98", color: "#E2E8F0" },
    { icon: <Linkedin size={18} />, label: "LinkedIn", val: personalInfo.linkedin, href: "https://www.linkedin.com/in/tharaka-vimukthi/", color: "#38BDF8" },
    { icon: <FileDown size={18} />, label: "Resume", val: "Download CV (PDF)", href: personalInfo.cv, color: "#22D3EE" },
  ];

  const marquee = [...tools, ...tools];

  return (
    <div
      style={{
        fontFamily: HEAD,
        background: "#050816",
        color: "#F8FAFC",
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <Cursor />
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes ping { 0%{transform:scale(1);opacity:.8} 80%,100%{transform:scale(2.4);opacity:0} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn { from{opacity:0;transform:translateY(16px) scale(.98)} to{opacity:1;transform:none} }
        @keyframes blob { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.08)} 66%{transform:translate(-30px,20px) scale(.95)} }
        * { box-sizing:border-box; }
        html { -webkit-text-size-adjust:100%; }
        ::selection { background:rgba(108,99,255,.45); color:#fff; }
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#050816} ::-webkit-scrollbar-thumb{background:linear-gradient(#6C63FF,#00E5FF);border-radius:3px}
        @media (hover: hover) and (pointer: fine) {
          body { cursor:none !important; }
          a,button,.project-card { cursor:none !important; }
        }

        .text-grad { background:linear-gradient(110deg,#8B83FF 0%,#00E5FF 50%,#8B83FF 100%); background-size:200% auto; -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; animation:gradShift 6s ease infinite; }

        .glass {
          position:relative;
          border:1px solid transparent;
          background:
            linear-gradient(rgba(13,15,32,0.72),rgba(13,15,32,0.72)) padding-box,
            linear-gradient(140deg,rgba(108,99,255,.38),rgba(0,229,255,.10) 45%,rgba(108,99,255,.06) 100%) border-box;
          backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
        }
        .lift { transition: transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s, background .35s; }
        @media (hover: hover) {
          .lift:hover {
            transform: translateY(-5px);
            background:
              linear-gradient(rgba(15,17,38,0.8),rgba(15,17,38,0.8)) padding-box,
              linear-gradient(140deg,rgba(108,99,255,.85),rgba(0,229,255,.55) 50%,rgba(108,99,255,.25) 100%) border-box;
            box-shadow: 0 20px 50px -20px rgba(108,99,255,.55), 0 0 0 1px rgba(108,99,255,.08);
          }
          .project-card:hover .cover-icon { transform: translate(-6px,-10px) rotate(-6deg) scale(1.06); opacity:.6 !important; }
          .project-card:hover .cta-arrow { transform: translate(2px,-2px); }
          .project-card:hover .card-cta { color:#00E5FF !important; }
          .btn:hover { transform: translateY(-2px); }
          .btn-primary:hover { box-shadow: 0 14px 36px -10px rgba(108,99,255,.8); }
          .btn-ghost:hover { border-color: rgba(108,99,255,.7); background: rgba(108,99,255,.12); }
          .nav-link:hover { color:#F8FAFC !important; }
          .contact-row:hover .contact-arrow { opacity:1; transform: translate(0,0); }
          .icon-btn:hover { color:#fff; border-color: rgba(108,99,255,.7); }
          .filter-btn:hover { color:#F8FAFC; }
        }
        .cta-arrow { transition: transform .3s; }
        .clamp-3 { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }

        .eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:12px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:#A5B4FC; padding:7px 14px; border-radius:999px; background:rgba(108,99,255,.1); border:1px solid rgba(108,99,255,.25); }
        .chip { display:inline-flex; align-items:center; gap:6px; font-size:12px; color:#CBD5E1; background:rgba(148,163,184,.07); border:1px solid rgba(148,163,184,.14); border-radius:8px; padding:4px 10px; white-space:nowrap; }
        .pill { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; color:#CBD5E1; background:rgba(148,163,184,.08); border:1px solid rgba(148,163,184,.18); border-radius:999px; padding:5px 12px; }

        .btn { display:inline-flex; align-items:center; justify-content:center; gap:9px; font-family:inherit; font-size:14px; font-weight:600; border-radius:12px; padding:13px 24px; text-decoration:none; transition: transform .25s, box-shadow .25s, background .25s, border-color .25s; border:1px solid transparent; white-space:nowrap; }
        .btn-primary { color:#fff; background:linear-gradient(135deg,#6C63FF,#00C2E0); box-shadow: 0 10px 28px -10px rgba(108,99,255,.7); }
        .btn-ghost { color:#E2E8F0; background:rgba(255,255,255,.03); border-color:rgba(148,163,184,.22); backdrop-filter:blur(10px); }

        .icon-btn { width:38px; height:38px; display:flex; align-items:center; justify-content:center; border-radius:10px; color:#94A3B8; background:rgba(255,255,255,.04); border:1px solid rgba(148,163,184,.2); transition: all .2s; font-family:inherit; }

        .filter-btn { font-family:inherit; font-size:13px; font-weight:600; color:#94A3B8; background:transparent; border:none; border-radius:999px; padding:9px 16px; display:inline-flex; align-items:center; gap:8px; white-space:nowrap; transition: color .2s, background .2s; }
        .filter-btn.active { color:#fff; background:linear-gradient(135deg,#6C63FF,#00C2E0); box-shadow: 0 6px 18px -6px rgba(108,99,255,.7); }
        .filter-count { font-size:11px; padding:1px 7px; border-radius:999px; background:rgba(255,255,255,.12); }

        .field { display:block; width:100%; background:rgba(5,8,22,.7); border:1px solid rgba(148,163,184,.16); border-radius:12px; padding:13px 16px; color:#E2E8F0; font-size:16px; outline:none; font-family:inherit; transition:border-color .2s, box-shadow .2s; }
        .field:focus { border-color:#6C63FF; box-shadow:0 0 0 4px rgba(108,99,255,.15); }
        .field::placeholder { color:#64748B; }

        .contact-arrow { opacity:0; transform: translate(-4px,4px); transition: all .25s; color:#94A3B8; }

        .marquee-mask { -webkit-mask-image: linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent); mask-image: linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent); }
        .marquee-track { display:flex; gap:12px; width:max-content; animation: marquee 38s linear infinite; }
        .marquee-mask:hover .marquee-track { animation-play-state: paused; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; }
        }
      `}</style>

      {/* ambient background */}
      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: 620, height: 620, borderRadius: "50%", top: -220, right: -160, background: "radial-gradient(circle,rgba(108,99,255,0.18),transparent 65%)", animation: "blob 22s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", bottom: -200, left: -160, background: "radial-gradient(circle,rgba(0,229,255,0.10),transparent 65%)", animation: "blob 28s ease-in-out infinite reverse" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(108,99,255,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.045) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%,#000 30%,transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%,#000 30%,transparent 80%)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── NAV ── */}
        <nav
          style={{
            position: "fixed",
            top: isMobile ? 0 : scrolled ? 12 : 20,
            left: 0,
            right: 0,
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            padding: isMobile ? 0 : "0 24px",
            transition: "top .3s",
          }}
        >
          <div
            className={isMobile ? "" : "glass"}
            style={{
              width: "100%",
              maxWidth: isMobile ? "none" : 1120,
              height: isMobile ? 64 : 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: isMobile ? "0 20px" : "0 10px 0 22px",
              borderRadius: isMobile ? 0 : 18,
              background: isMobile ? "rgba(5,8,22,0.85)" : undefined,
              backdropFilter: isMobile ? "blur(20px)" : undefined,
              borderBottom: isMobile ? "1px solid rgba(108,99,255,0.12)" : undefined,
              boxShadow: !isMobile && scrolled ? "0 12px 40px -16px rgba(0,0,0,.7)" : undefined,
            }}
          >
            <span
              onClick={() => scrollTo("Home")}
              style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 10 }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  background: GRAD,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  color: "#fff",
                  boxShadow: "0 6px 18px -6px rgba(108,99,255,.8)",
                }}
              >
                T
              </span>
              <span>
                Tharaka<span style={{ color: "#00E5FF" }}>.</span>
              </span>
            </span>

            {!isMobile && (
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {NAV.map((l) => (
                  <span
                    key={l}
                    className="nav-link"
                    onClick={() => scrollTo(l)}
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: activeNav === l ? "#fff" : "#94A3B8",
                      background: activeNav === l ? "rgba(108,99,255,0.18)" : "transparent",
                      borderRadius: 10,
                      padding: "8px 14px",
                      transition: "all .2s",
                    }}
                  >
                    {l}
                  </span>
                ))}
                <button onClick={() => scrollTo("Contact")} className="btn btn-primary" style={{ padding: "10px 18px", marginLeft: 8, fontSize: 13 }}>
                  Hire Me <ArrowRight size={14} />
                </button>
              </div>
            )}

            {isMobile && (
              <button onClick={() => setMobileMenuOpen((o) => !o)} aria-label="Toggle menu" className="icon-btn">
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
          </div>
        </nav>

        {isMobile && mobileMenuOpen && (
          <div
            style={{
              position: "fixed",
              top: 64,
              left: 0,
              right: 0,
              zIndex: 99,
              background: "rgba(5,8,22,0.97)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(108,99,255,0.15)",
              display: "flex",
              flexDirection: "column",
              padding: "8px 20px 20px",
              animation: "fadeIn .2s ease",
            }}
          >
            {NAV.map((l) => (
              <span
                key={l}
                onClick={() => scrollTo(l)}
                style={{
                  padding: "14px 4px",
                  fontSize: 15,
                  fontWeight: 500,
                  color: activeNav === l ? "#00E5FF" : "#CBD5E1",
                  borderBottom: "1px solid rgba(108,99,255,0.08)",
                }}
              >
                {l}
              </span>
            ))}
            <button onClick={() => scrollTo("Contact")} className="btn btn-primary" style={{ marginTop: 16 }}>
              Hire Me <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* ── HERO ── */}
        <section
          id="home"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: isMobile ? "104px 20px 48px" : "140px 48px 56px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isTablet ? "column" : "row",
              alignItems: "center",
              gap: isMobile ? 32 : 64,
              width: "100%",
              maxWidth: 1120,
              margin: "0 auto",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "none" : "translateY(30px)",
              transition: "all 0.9s cubic-bezier(.2,.7,.2,1)",
            }}
          >
            <div
              style={{
                flex: 1,
                textAlign: isTablet ? "center" : "left",
                display: "flex",
                flexDirection: "column",
                alignItems: isTablet ? "center" : "flex-start",
              }}
            >
              <span
                className="pill"
                style={{ marginBottom: 26, background: "rgba(16,185,129,.08)", borderColor: "rgba(16,185,129,.3)", color: "#A7F3D0" }}
              >
                <span style={{ position: "relative", width: 8, height: 8 }}>
                  <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#34D399", animation: "ping 1.8s cubic-bezier(0,0,.2,1) infinite" }} />
                  <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#34D399" }} />
                </span>
                Available for freelance &amp; full-time roles
              </span>

              <h1
                style={{
                  fontSize: isMobile ? 46 : isTablet ? 64 : 76,
                  fontWeight: 700,
                  lineHeight: 0.98,
                  letterSpacing: "-0.045em",
                  color: "#F8FAFC",
                  marginBottom: 22,
                }}
              >
                Tharaka
                <br />
                <Grad>Bandara</Grad>
              </h1>

              <p
                style={{
                  fontSize: isMobile ? 16 : 19,
                  fontWeight: 500,
                  color: "#E2E8F0",
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                  justifyContent: isTablet ? "center" : "flex-start",
                }}
              >
                <Palette size={18} color="#A78BFA" /> UI/UX Designer
                <span style={{ color: "#334155" }}>/</span>
                <Code2 size={18} color="#00E5FF" /> Full-Stack Developer
              </p>
              <p
                style={{
                  fontSize: 15.5,
                  color: "#94A3B8",
                  lineHeight: 1.75,
                  maxWidth: 480,
                  marginBottom: 34,
                }}
              >
                I design intuitive interfaces in Figma and build them into fast,
                production-ready apps with React, Next.js and C#. Based in
                Colombo, Sri Lanka.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  justifyContent: isTablet ? "center" : "flex-start",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <button onClick={() => scrollTo("Projects")} className="btn btn-primary" style={{ flex: isMobile ? "1 1 100%" : "none" }}>
                  View Projects <ArrowRight size={16} />
                </button>
                <a href={personalInfo.cv} download="Tharaka_Bandara_Resume.pdf" className="btn btn-ghost" style={{ flex: isMobile ? "1 1 140px" : "none" }}>
                  <Download size={16} /> Download CV
                </a>
                <button onClick={() => scrollTo("Contact")} className="btn btn-ghost" style={{ flex: isMobile ? "1 1 140px" : "none" }}>
                  <Mail size={16} /> Get In Touch
                </button>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: isTablet ? "center" : "flex-start" }}>
                <a className="icon-btn" href="https://github.com/Chipzy98" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={17} /></a>
                <a className="icon-btn" href="https://www.linkedin.com/in/tharaka-vimukthi/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
                <a className="icon-btn" href={`mailto:${personalInfo.email}`} aria-label="Email"><Mail size={17} /></a>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                  gap: isMobile ? 10 : 14,
                  marginTop: 40,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                {personalInfo.stats.map((s) => (
                  <div key={s.label} className="glass" style={{ borderRadius: 16, padding: isMobile ? "14px 12px" : "16px 22px", minWidth: isMobile ? 0 : 118 }}>
                    <div className="text-grad" style={{ fontSize: isMobile ? 26 : 32, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em" }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 8, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
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
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: isMobile ? "scale(0.82)" : "none",
                margin: isMobile ? "-30px 0" : 0,
              }}
            >
              <Scene3D profileImg={profileImg} />
              {!isMobile &&
                [
                  { t: "Figma", icon: <Figma size={14} />, c: "#A78BFA", pos: { top: 24, left: -70 } },
                  { t: "React / Next.js", icon: <Code2 size={14} />, c: "#00E5FF", pos: { top: "44%", right: -110 } },
                  { t: "C# · .NET", icon: <Layers size={14} />, c: "#6C63FF", pos: { bottom: 34, left: -60 } },
                ].map((b, i) => (
                  <div
                    key={b.t}
                    className="glass"
                    style={{
                      position: "absolute",
                      zIndex: 3,
                      ...b.pos,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      borderRadius: 12,
                      padding: "9px 14px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#E2E8F0",
                      animation: `slideUp .6s ease ${0.4 + i * 0.15}s both, float ${5 + i}s ease-in-out ${i * 0.6}s infinite`,
                    }}
                  >
                    <span style={{ color: b.c, display: "flex" }}>{b.icon}</span>
                    {b.t}
                  </div>
                ))}
            </div>
          </div>

          {/* Tech marquee */}
          <div style={{ width: "100%", maxWidth: 1120, margin: isMobile ? "40px auto 0" : "64px auto 0" }}>
            <p style={{ textAlign: "center", fontSize: 12, color: "#64748B", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>
              Tools I use every day
            </p>
            <div className="marquee-mask" style={{ overflow: "hidden" }}>
              <div className="marquee-track">
                {marquee.map((t, i) => (
                  <span key={t.name + i} className="chip" style={{ fontSize: 13, padding: "8px 16px", borderRadius: 12, color: "#CBD5E1" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.category === "Design" ? "#A78BFA" : t.category === "Dev" ? "#00E5FF" : "#6C63FF" }} />
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ABOUT (bento) ── */}
        <Section id="about" dark>
          <SectionHeading label="About Me" title={<>Passionate about <Grad>design</Grad> &amp; <Grad>code</Grad></>} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)",
              gridAutoRows: "minmax(150px, auto)",
              gap: 16,
            }}
          >
            <Reveal style={{ gridColumn: isMobile ? "auto" : "span 2", gridRow: isTablet ? "auto" : "span 2" }}>
              <div className="glass lift" style={{ borderRadius: 22, padding: isMobile ? 24 : 32, height: "100%", display: "flex", flexDirection: "column" }}>
                <IconBox><Sparkles size={20} /></IconBox>
                <p style={{ color: "#CBD5E1", lineHeight: 1.85, fontSize: 15.5, marginTop: 22, marginBottom: 16 }}>
                  {personalInfo.bio}
                </p>
                <p style={{ color: "#94A3B8", lineHeight: 1.85, fontSize: 15 }}>
                  Currently working as a Computer Programmer at Central Engineering
                  Services, where I develop ERP systems with C# and React. I combine
                  design thinking with development skills to build products people
                  love.
                </p>
                <div style={{ marginTop: "auto", paddingTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="pill"><MapPin size={13} /> Colombo, Sri Lanka</span>
                  <span className="pill"><Briefcase size={13} /> Open to opportunities</span>
                </div>
              </div>
            </Reveal>

            {[
              { icon: <Briefcase size={20} />, color: "#00E5FF", k: "Currently", title: "Computer Programmer", sub: "Central Engineering Services · 2025–Present" },
              { icon: <Trophy size={20} />, color: "#FBBF24", k: "Award", title: "Best Software Solution", sub: "Industry Minds Competition, ICET · 2024" },
              { icon: <GraduationCap size={20} />, color: "#A78BFA", k: "Studying", title: "BEng (Hons) Software Engineering", sub: "London Metropolitan University – ESOFT · 2026" },
              { icon: <Layers size={20} />, color: "#6C63FF", k: "Portfolio", title: `${projects.length} Projects`, sub: `${projects.filter(isDesign).length} UI/UX designs · ${projects.filter((p) => !isDesign(p)).length} full-stack builds` },
            ].map((item, i) => (
              <Reveal key={item.title} delay={0.08 * (i + 1)}>
                <div className="glass lift" style={{ borderRadius: 22, padding: 22, height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <IconBox color={item.color}>{item.icon}</IconBox>
                    <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.k}</span>
                  </div>
                  <div style={{ marginTop: "auto" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", marginBottom: 4, lineHeight: 1.3 }}>{item.title}</div>
                    <div style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.5 }}>{item.sub}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ── SKILLS (bento) ── */}
        <Section id="skills">
          <SectionHeading label="Skills & Tools" title={<>What I <Grad>work with</Grad></>} sub="From research and wireframes to deployed, production code." />
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)", gap: 16 }}>
            {skillGroups.map((g, i) => (
              <Reveal key={g.key} delay={0.08 * i}>
                <div className="glass lift" style={{ borderRadius: 22, padding: 26, height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <IconBox color={g.color}>{g.icon}</IconBox>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>{g.title}</div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>{skills[g.key].length} core skills</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13.5, color: "#94A3B8", lineHeight: 1.65, marginBottom: 18 }}>{g.blurb}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {skills[g.key].map((s) => (
                      <span key={s.name} className="chip" style={{ fontSize: 13, padding: "6px 12px", borderColor: `${g.color}33`, background: `${g.color}10`, color: "#E2E8F0" }}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.24} style={{ gridColumn: isMobile ? "auto" : isTablet ? "span 2" : "span 3" }}>
              <div className="glass lift" style={{ borderRadius: 22, padding: 26 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                  <IconBox color="#22D3EE"><Wrench size={20} /></IconBox>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>Tools &amp; Technologies</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{tools.length} tools across design, development and delivery</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 18 }}>
                  {(["Design", "Dev", "Tools"] as const).map((cat) => (
                    <div key={cat}>
                      <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                        {cat === "Dev" ? "Development" : cat === "Tools" ? "Workflow" : "Design"}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {tools.filter((t) => t.category === cat).map((t) => (
                          <Chip key={t.name}>{t.name}</Chip>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ── EXPERIENCE ── */}
        <Section id="experience" dark>
          <SectionHeading label="Experience" title={<>Work <Grad>history</Grad></>} />
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {experience.map((exp, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <div className="glass lift" style={{ borderRadius: 22, padding: isMobile ? "22px 20px" : "28px 32px", display: "flex", gap: 20, flexDirection: isMobile ? "column" : "row" }}>
                  <IconBox color={exp.color} size={52}><Briefcase size={22} /></IconBox>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: isMobile ? 10 : 16,
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: isMobile ? 18 : 21, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.01em" }}>{exp.role}</h3>
                        <p style={{ fontSize: 14, color: exp.color, fontWeight: 600 }}>{exp.company}</p>
                      </div>
                      <span className="pill" style={{ color: exp.color, borderColor: `${exp.color}44`, background: `${exp.color}12` }}>{exp.period}</span>
                    </div>
                    <ul style={{ listStyle: "none", display: "grid", gap: 10, marginTop: 18, padding: 0 }}>
                      {exp.description.map((d, j) => (
                        <li key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: exp.color, marginTop: 8, flexShrink: 0, boxShadow: `0 0 10px ${exp.color}` }} />
                          <span style={{ fontSize: 14.5, color: "#94A3B8", lineHeight: 1.65 }}>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ── PROJECTS ── */}
        <Section id="projects">
          <SectionHeading
            label="Projects"
            title={<>Selected <Grad>work</Grad></>}
            sub={isMobile ? "Tap any project to explore the details." : "Click any project to explore the details."}
          />
          <Reveal style={{ marginBottom: 32 }}>
            <div
              className="glass"
              style={{
                display: "inline-flex",
                gap: 4,
                padding: 5,
                borderRadius: 999,
                maxWidth: "100%",
                overflowX: "auto",
              }}
            >
              {filters.map((f) => (
                <button key={f} onClick={() => setActiveFilter(f)} className={`filter-btn${activeFilter === f ? " active" : ""}`}>
                  {f}
                  <span className="filter-count">{countFor(f)}</span>
                </button>
              ))}
            </div>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
              gap: 18,
            }}
          >
            {filtered.map((p, i) => (
              <Reveal key={`${activeFilter}-${p.id}`} delay={0.05 * (i % 3)} style={{ height: "100%" }}>
                <ProjectCard project={p} onClick={() => setSelectedProject(p)} />
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ── EDUCATION ── */}
        <Section id="education" dark>
          <SectionHeading label="Education" title={<>Academic <Grad>background</Grad></>} />
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: isMobile ? 19 : 25,
                top: 10,
                bottom: 10,
                width: 2,
                background: "linear-gradient(180deg,#6C63FF,#00E5FF,transparent)",
                borderRadius: 1,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {education.map((ed, i) => (
                <Reveal key={i} delay={0.06 * i}>
                  <div style={{ display: "flex", gap: isMobile ? 14 : 20, alignItems: "flex-start" }}>
                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        width: isMobile ? 40 : 52,
                        height: isMobile ? 40 : 52,
                        borderRadius: 14,
                        background: "#0B0D1E",
                        border: `1px solid ${ed.color}55`,
                        color: ed.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: `0 0 20px -6px ${ed.color}`,
                      }}
                    >
                      <GraduationCap size={isMobile ? 18 : 22} />
                    </div>
                    <div className="glass lift" style={{ flex: 1, borderRadius: 18, padding: isMobile ? "16px 18px" : "20px 24px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: isMobile ? 8 : 16,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", marginBottom: 4 }}>{ed.degree}</div>
                          <div style={{ fontSize: 14, color: "#94A3B8" }}>{ed.school}</div>
                        </div>
                        <span className="pill" style={{ fontSize: 11.5 }}>{ed.period}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>

        {/* ── CONTACT ── */}
        <Section id="contact">
          <SectionHeading
            label="Contact"
            title={<>Let's work <Grad>together</Grad></>}
            sub="Open to freelance UI/UX design projects and full-time opportunities. Let's create something amazing together."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet ? "1fr" : "1fr 1.1fr",
              gap: isMobile ? 24 : 28,
              alignItems: "start",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
              {contacts.map((c, i) => (
                <Reveal key={c.label} delay={0.04 * i}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") || c.href.endsWith(".pdf") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="glass lift contact-row"
                    style={{ display: "flex", gap: 14, alignItems: "center", borderRadius: 16, padding: "16px 18px", textDecoration: "none", height: "100%" }}
                  >
                    <IconBox color={c.color} size={40}>{c.icon}</IconBox>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#64748B", marginBottom: 3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{c.label}</div>
                      <div style={{ fontSize: 13.5, color: "#E2E8F0", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.val}</div>
                    </div>
                    <ArrowUpRight size={16} className="contact-arrow" />
                  </a>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <div className="glass" style={{ borderRadius: 22, padding: isMobile ? 22 : 30 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                  <IconBox><Send size={18} /></IconBox>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F1F5F9" }}>Quick Message</h3>
                    <div style={{ fontSize: 12.5, color: "#64748B" }}>Goes straight to my inbox.</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <input placeholder="Your Name" className="field" />
                  <input placeholder="Your Email" className="field" />
                </div>
                <input placeholder="Subject" className="field" style={{ marginBottom: 12 }} />
                <textarea placeholder="Your Message" rows={5} className="field" style={{ resize: "vertical", marginBottom: 16 }} />
                <button onClick={sendMessage} className="btn btn-primary" style={{ width: "100%", padding: 15 }}>
                  Send Message <Send size={15} />
                </button>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* FOOTER */}
        <footer
          style={{
            padding: isMobile ? "24px 20px" : "28px 48px",
            borderTop: "1px solid rgba(108,99,255,0.12)",
            background: "rgba(5,8,22,0.6)",
          }}
        >
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 14 : 0,
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 18 }}>
              Tharaka<span style={{ color: "#00E5FF" }}>.</span>
            </span>
            <span style={{ fontSize: 12.5, color: "#64748B" }}>
              © {new Date().getFullYear()} Tharaka Vimukthi Bandara. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <a className="icon-btn" href="https://github.com/Chipzy98" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={16} /></a>
              <a className="icon-btn" href="https://www.linkedin.com/in/tharaka-vimukthi/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>
              <a className="icon-btn" href={`mailto:${personalInfo.email}`} aria-label="Email"><Mail size={16} /></a>
            </div>
          </div>
        </footer>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}