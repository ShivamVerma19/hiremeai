import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Mail,
  Code2,
  ExternalLink,
  Menu,
  X,
  FileText,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Lightbox from "../components/Lightbox";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const RESUME_URL =
  "https://drive.google.com/file/d/1IZU2ESNjpUdu8M4PuszjeId0kLR_EtaP/view?usp=sharing";

const EXPERIENCE = [
  {
    company: "VideoGate Technologies Pvt. Ltd.",
    role: "Software Developer",
    duration: "Dec 2025 – Present",
    location: "Hyderabad, India",
    bullets: [
      "Architected and shipped a complete advertisement pipeline across three microservices — DB schema design, REST APIs, and VAST 3.0/4.2 skipoffset generation for single and podded ad breaks.",
      "Integrated pre-, mid-, and post-roll ads for DRM-protected live streams using Google IMA SDK, VMAP, and ExoPlayer (Media3); built centralized ad gating and playback controls.",
      "Built a dual-tier PPV purchasing flow with Cashfree payment integration for Android live streams.",
      "Resolved critical production crashes; contributed to features shipped on Home Cinema Plus.",
    ],
  },
  {
    company: "Sagenest",
    role: "Software Developer Intern (Backend / AI)",
    duration: "Aug 2025 – Oct 2025",
    location: "Remote",
    bullets: [
      "Designed secure REST APIs using Spring Boot with JWT authentication and role-based access control.",
      "Built AI-powered roadmap generation and content summarization features using LLM APIs.",
      "Developed a LangGraph-based chatbot with FAISS vector search and session-aware conversations.",
    ],
  },
  {
    company: "BrainwaveLaw",
    role: "Software Development Intern (AI / Backend)",
    duration: "Jun 2024 – Dec 2024",
    location: "Remote",
    bullets: [
      "Built FastAPI backend services for AI-powered legal document retrieval.",
      "Developed retrieval and summarization pipelines using LangChain, FAISS, and LLMs.",
      "Implemented multi-turn conversational legal chatbots with contextual Q&A.",
    ],
  },
  {
    company: "One Card Solution Pvt. Ltd.",
    role: "Android Developer Intern",
    duration: "Jan 2024 – Feb 2024",
    location: "",
    bullets: ["Designed Android UI screens using XML layouts from Figma designs."],
  },
];

const SKILLS = {
  Languages: ["Java", "Python", "C++", "Kotlin"],
  Backend: ["Spring Boot", "FastAPI", "REST APIs", "JWT Auth", "Docker", "CI/CD"],
  "Generative AI": ["LangChain", "LangGraph", "FAISS", "OpenAI API", "Google Generative AI", "NLP"],
  Databases: ["MySQL", "Firebase Firestore", "Room Database"],
  Android: ["Jetpack Compose", "MVVM", "ExoPlayer (Media3)", "Google IMA SDK", "Retrofit", "Coroutines"],
  Tools: ["Git", "GitHub", "Postman", "Android Studio", "Figma"],
};

const CERTIFICATIONS = [
  { title: "C++ Foundation with Data Structures", issuer: "Coding Ninjas" },
  { title: "Android App Development Master Course", issuer: "Coding Blocks" },
];

const ESHOP_IMAGES = [
  { src: "/assets/eshop/pic1.png", alt: "E-Shop screenshot 1" },
  { src: "/assets/eshop/pic2.png", alt: "E-Shop screenshot 2" },
  { src: "/assets/eshop/pic3.png", alt: "E-Shop screenshot 3" },
];

export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  function scrollTo(href: string) {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur border-b border-raised">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-serif text-lg"
          >
            Shivam Verma
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-lo hover:text-hi transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => navigate("/chat")}
              className="bg-gold hover:bg-goldSoft text-ink text-sm font-medium px-4 py-2 rounded-full transition-colors"
            >
              Chat with my AI
            </button>
          </nav>

          <button className="md:hidden text-hi" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t border-raised pt-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-left text-sm text-lo hover:text-hi"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => navigate("/chat")}
              className="bg-gold text-ink text-sm font-medium px-4 py-2 rounded-full w-fit"
            >
              Chat with my AI
            </button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-lo text-sm mb-4">
            Android Developer • Kotlin • Jetpack Compose • AI Integrations
          </p>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] mb-6">
            Building Android apps
            <br />
            that ship — with AI
            <br />
            woven in.
          </h1>
          <p className="text-lo text-lg max-w-md mb-8">
            1.5+ years shipping production OTT and AI-powered applications —
            Kotlin, Jetpack Compose, ExoPlayer, and LLM-backed features across
            the stack.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <button
              onClick={() => navigate("/chat")}
              className="bg-gold hover:bg-goldSoft text-ink font-medium px-6 py-3 rounded-full transition-colors"
            >
              Chat with my AI
            </button>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/15 hover:border-white/30 text-hi font-medium px-6 py-3 rounded-full transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View Resume
            </a>
          </div>
          <div className="flex gap-8 text-sm">
            <div>
              <p className="font-serif text-2xl text-hi">1.5+</p>
              <p className="text-lo">Years experience</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-hi">4</p>
              <p className="text-lo">Companies</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-hi">2+</p>
              <p className="text-lo">Shipped products</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <img
            src="/assets/profile.jpeg"
            alt="Shivam Verma"
            className="w-64 h-64 md:w-80 md:h-80 rounded-3xl object-cover border border-raised"
          />
        </div>
      </section>

      {/* About */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-20 border-t border-raised">
        <h2 className="font-serif text-3xl mb-6">About Me</h2>
        <p className="text-lo text-lg max-w-2xl leading-relaxed">
          Android Developer with 1.5+ years of hands-on experience building and
          deploying scalable, user-friendly mobile applications. Specialized in
          Kotlin, Jetpack Compose, ExoPlayer (Media3), and Google IMA SDK, with
          additional backend exposure in Spring Boot, FastAPI, and LLM
          integrations. I care about owning features end-to-end — from the
          database schema to the screen a user actually taps.
        </p>
      </section>

      {/* Experience */}
      <section id="experience" className="max-w-6xl mx-auto px-6 py-20 border-t border-raised">
        <h2 className="font-serif text-3xl mb-10">Experience</h2>
        <div className="space-y-10">
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-10">
              <div>
                <p className="text-sm text-lo">{exp.duration}</p>
                {exp.location && <p className="text-xs text-lo/70">{exp.location}</p>}
              </div>
              <div>
                <h3 className="font-serif text-xl text-hi mb-1">{exp.role}</h3>
                <p className="text-gold text-sm mb-3">{exp.company}</p>
                <ul className="space-y-2">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-lo text-sm leading-relaxed flex gap-2">
                      <span className="text-gold shrink-0">—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="max-w-6xl mx-auto px-6 py-20 border-t border-raised">
        <h2 className="font-serif text-3xl mb-10">Featured Projects</h2>

        <div className="space-y-16">
          {/* Yournal — logo + demo video */}
          <div>
            <div className="flex items-center gap-4 mb-5">
              <img
                src="/assets/yournal/pic.jpeg"
                alt="Yournal logo"
                className="w-16 h-16 rounded-2xl border border-raised object-cover"
              />
              <h3 className="font-serif text-2xl">Yournal</h3>
            </div>
            <video
              src="/assets/yournal/demo.mp4"
              controls
              className="w-full rounded-2xl border border-raised mb-5 max-h-96"
            />
            <p className="text-lo mb-4 max-w-2xl">
              Offline journaling and task management app built with Jetpack
              Compose and Room Database, following MVVM architecture.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Kotlin", "Jetpack Compose", "Room", "MVVM"].map((t) => (
                <span key={t} className="text-xs bg-raised text-lo px-3 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
            <a
              href="https://github.com/ShivamVerma19/Yournal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold hover:text-goldSoft text-sm"
            >
              <FaGithub className="w-4 h-4" /> View on GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* E-Shop — logo + name, screenshots (click to enlarge) */}
          <div>
            <div className="flex items-center gap-4 mb-5">
              <img
                src="/assets/eshop/pic4.png"
                alt="E-Shop logo"
                className="w-16 h-16 rounded-2xl border border-raised object-cover"
              />
              <h3 className="font-serif text-2xl">E-Shop</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-3 mb-5">
              {ESHOP_IMAGES.map((img) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  onClick={() => setLightbox(img)}
                  className="rounded-2xl border border-raised w-full h-48 object-cover object-top cursor-zoom-in hover:opacity-90 transition-opacity"
                />
              ))}
            </div>
            <p className="text-lo mb-4 max-w-2xl">
              E-commerce Android application with Firebase Authentication,
              Razorpay integration, and Room-based offline storage.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Kotlin", "Firebase", "Razorpay", "Coroutines", "Room"].map((t) => (
                <span key={t} className="text-xs bg-raised text-lo px-3 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
            <a
              href="https://github.com/ShivamVerma19/E-commerce-App"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold hover:text-goldSoft text-sm"
            >
              <FaGithub className="w-4 h-4" /> View on GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Company work — link cards, no screenshots needed */}
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.toqqer.app.limpopo&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-raised hover:bg-raised/70 border border-white/5 rounded-2xl p-6 transition-colors"
            >
              <p className="text-xs text-lo mb-2">VideoGate Technologies</p>
              <h4 className="font-serif text-xl mb-2">Home Cinema Plus</h4>
              <p className="text-sm text-lo mb-4">
                OTT app with DRM live-stream ad integration and PPV purchasing —
                shipped to the Play Store.
              </p>
              <span className="inline-flex items-center gap-2 text-gold text-sm">
                View on Play Store <ExternalLink className="w-3 h-3" />
              </span>
            </a>

            <a
              href="https://www.sagenest.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-raised hover:bg-raised/70 border border-white/5 rounded-2xl p-6 transition-colors"
            >
              <p className="text-xs text-lo mb-2">Sagenest</p>
              <h4 className="font-serif text-xl mb-2">Sagenest AI Platform</h4>
              <p className="text-sm text-lo mb-4">
                AI-powered French learning platform — contributed backend APIs
                and LLM-based features.
              </p>
              <span className="inline-flex items-center gap-2 text-gold text-sm">
                Visit Website <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="max-w-6xl mx-auto px-6 py-20 border-t border-raised">
        <h2 className="font-serif text-3xl mb-10">Skills & Tools</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(SKILLS).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-gold text-sm font-medium mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span key={skill} className="text-sm bg-raised text-hi px-3 py-1.5 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-raised">
        <h2 className="font-serif text-3xl mb-10">Certifications</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {CERTIFICATIONS.map((cert, i) => (
            <div key={i} className="bg-raised border border-white/5 rounded-2xl p-6 flex items-start gap-3">
              <Code2 className="w-5 h-5 text-gold shrink-0 mt-1" />
              <div>
                <h4 className="text-hi font-medium mb-1">{cert.title}</h4>
                <p className="text-sm text-lo">{cert.issuer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chat CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-raised text-center">
        <h2 className="font-serif text-3xl mb-4">Skip the small talk.</h2>
        <p className="text-lo text-lg max-w-xl mx-auto mb-8">
          Ask my AI anything you'd ask in an interview — my experience,
          projects, strengths, or notice period. Trained on my actual resume.
        </p>
        <button
          onClick={() => navigate("/chat")}
          className="bg-gold hover:bg-goldSoft text-ink font-medium px-8 py-3 rounded-full transition-colors"
        >
          Start the Chat
        </button>
      </section>

      {/* Contact */}
      <footer id="contact" className="max-w-6xl mx-auto px-6 py-20 border-t border-raised">
        <h2 className="font-serif text-3xl mb-6">Get in Touch</h2>
        <p className="text-lo mb-8 max-w-md">
          Open to Android and full-stack roles. Reach out directly or download
          my resume below.
        </p>
        <div className="flex flex-wrap gap-4 mb-10">
          <a
            href="mailto:shivamverma19401940@gmail.com"
            className="flex items-center gap-2 bg-raised hover:bg-raised/70 px-4 py-2.5 rounded-full text-sm transition-colors"
          >
            <Mail className="w-4 h-4" /> Email
          </a>
          <a
            href="https://www.linkedin.com/in/shivam-verma-6b80b6211"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-raised hover:bg-raised/70 px-4 py-2.5 rounded-full text-sm transition-colors"
          >
            <FaLinkedin className="w-4 h-4" /> LinkedIn
          </a>
          <a
            href="https://github.com/ShivamVerma19"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-raised hover:bg-raised/70 px-4 py-2.5 rounded-full text-sm transition-colors"
          >
            <FaGithub className="w-4 h-4" /> GitHub
          </a>
          <a
            href="https://leetcode.com/u/Shivam_40/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-raised hover:bg-raised/70 px-4 py-2.5 rounded-full text-sm transition-colors"
          >
            <Code2 className="w-4 h-4" /> LeetCode
          </a>
          <a
            href="https://www.naukri.com/code360/profile/b591284f-39db-4188-8d7f-144b438178d2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-raised hover:bg-raised/70 px-4 py-2.5 rounded-full text-sm transition-colors"
          >
            <Code2 className="w-4 h-4" /> Code360
          </a>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gold hover:bg-goldSoft text-ink px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            <FileText className="w-4 h-4" /> Resume
          </a>
        </div>
        <p className="text-xs text-lo/60">
          © {new Date().getFullYear()} Shivam Verma. Built with React, FastAPI, and Groq.
        </p>
      </footer>

      {/* Image lightbox */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}