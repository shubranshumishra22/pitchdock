"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";



const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://www.pitchdock.xyz";

interface Feedback {
  id: number;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function LandingPage() {
  const router = useRouter();
  const [selectedHighlight, setSelectedHighlight] = useState<"fullstack" | "aws" | "api">("fullstack");
  const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({});
  const [isAnnual, setIsAnnual] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  // Feedback states
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitSuccess, setFeedbackSubmitSuccess] = useState(false);
  const [feedbackHoverRating, setFeedbackHoverRating] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Support Form states
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportSubject, setSupportSubject] = useState("General Query");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSubmitSuccess, setSupportSubmitSuccess] = useState("");
  const [supportError, setSupportError] = useState("");
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/feedback`);
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data.feedbacks || []);
        }
      } catch (e) {
        console.error("Error loading feedbacks:", e);
      }
    };
    fetchFeedbacks();
  }, []);

  // Commented out to allow authenticated users to browse the landing/home page
  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   if (token) {
  //     router.push("/dashboard");
  //   }
  // }, [router]);

  useEffect(() => {
    const fullText = getEmailBodyText();
    setDisplayedText("");
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      if (currentIdx < fullText.length) {
        setDisplayedText(fullText.substring(0, currentIdx + 1));
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 4);
    
    return () => clearInterval(interval);
  }, [selectedHighlight]);

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName.trim() || !feedbackComment.trim()) return;
    setIsSubmittingFeedback(true);
    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: feedbackName,
          rating: feedbackRating,
          comment: feedbackComment
        })
      });
      if (res.ok) {
        setFeedbackSubmitSuccess(true);
        setFeedbackName("");
        setFeedbackComment("");
        setFeedbackRating(5);
        
        // Refresh list
        const freshRes = await fetch(`${API_BASE}/api/feedback`);
        if (freshRes.ok) {
          const data = await freshRes.json();
          setFeedbacks(data.feedbacks || []);
        }
        setTimeout(() => setFeedbackSubmitSuccess(false), 5000);
      } else {
        alert("Failed to submit feedback.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting feedback.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName.trim() || !supportEmail.trim() || !supportMessage.trim()) return;
    setIsSubmittingSupport(true);
    setSupportError("");
    setSupportSubmitSuccess("");
    try {
      const res = await fetch(`${API_BASE}/api/support-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: supportName,
          email: supportEmail,
          subject: supportSubject,
          message: supportMessage
        })
      });
      if (res.ok) {
        setSupportSubmitSuccess("Your inquiry was sent to the PitchDock developers. You will receive a response at your email address shortly!");
        setSupportName("");
        setSupportEmail("");
        setSupportMessage("");
      } else {
        const data = await res.json();
        setSupportError(data.detail || "Failed to submit support request.");
      }
    } catch (err) {
      setSupportError("Unable to connect to the mail server. Please try again later.");
    } finally {
      setIsSubmittingSupport(false);
    }
  };

  // Mock Recruiter Details
  const recruiter = {
    name: "Sarah Jenkins",
    title: "Lead Technical Recruiter",
    company: "Apple Inc.",
    email: "s.jenkins@apple.com",
    role: "Senior Software Engineer",
  };

  // Interactive Demo Email Contents matching user's html mockup exactly
  const getSubjectText = () => {
    switch (selectedHighlight) {
      case "fullstack":
        return `Exploring Senior Software Engineer opportunities at Apple Inc.`;
      case "aws":
        return `AWS Cloud Architect application - Apple Inc. Recruiting`;
      case "api":
        return `Discussion: Scaling APIs and Microservices at Apple Inc.`;
    }
  };

  const getEmailBodyText = () => {
    switch (selectedHighlight) {
      case "fullstack":
        return `Hi Sarah,\n\nI know recruiters read hundreds of these, so I'll keep it short. I'm a software engineer with 5+ years of experience, and I'd like to talk about the Senior Software Engineer role at Apple Inc.\n\nTwo things that might be relevant to your team:\n— Built React frontends and Node.js services running for 1.2M monthly active users\n— Cut deploy time by 64% after moving CI/CD to a container-based pipeline\n\nRésumé is attached. Happy to send more detail on any of it.`;
      case "aws":
        return `Hi Sarah,\n\nI know recruiters read hundreds of these, so I'll keep it short. I'm a software engineer with 5+ years of experience, and I'd like to talk about the Senior Software Engineer role at Apple Inc.\n\nTwo things that might be relevant to your team:\n— Deployed cloud infrastructure migration for 14 legacy web applications to AWS\n— Optimized AWS resource provisioning using Terraform, saving over $85,000 in yearly infrastructure fees\n\nRésumé is attached. Happy to send more detail on any of it.`;
      case "api":
        return `Hi Sarah,\n\nI know recruiters read hundreds of these, so I'll keep it short. I'm a software engineer with 5+ years of experience, and I'd like to talk about the Senior Software Engineer role at Apple Inc.\n\nTwo things that might be relevant to your team:\n— Optimized backend database queries, increasing API throughput from 2,000 to 12,500 requests per second\n— Designed a Redis-based distributed caching layer that slashed average server latencies by 42%\n\nRésumé is attached. Happy to send more detail on any of it.`;
    }
  };

  // Token highlighter function using classes defined in the CSS
  const renderPersonalizedEmailBody = (text: string) => {
    const regex = /(Apple Inc\.|Sarah|5\+ years|1\.2M monthly active users|64%|14|AWS|Terraform|\$85,000|2,000|12,500|42%|Redis)/g;
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (/^(Apple Inc\.|Sarah|AWS|Terraform|Redis)$/.test(part)) {
        return <span key={i} className="tok-var">{part}</span>;
      } else if (/^(5\+ years|1\.2M monthly active users|64%|14|\$85,000|2,000|12,500|42%)$/.test(part)) {
        return <span key={i} className="tok-num">{part}</span>;
      }
      return part;
    });
  };

  // JSON-LD Schema
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PitchDock",
    "url": "https://pitchdock.xyz",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "Job Hunting, Recruiting & Productivity",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "INR",
      "priceValidUntil": "2027-12-31"
    },
    "description": "Automate personalized recruiter cold outreach using SQLite, SMTP, and AI. Personalize resumes and pitches per recruiter target to land interviews.",
    "featureList": "AI draft personalization, direct SMTP mailing, interactive recruiter queue dashboard, resume PDF attachments, company category targeting",
    "screenshot": "https://pitchdock.xyz/og-image.jpg"
  };

  return (
    <div className="landing-root landing-page-wrapper">
      <Navbar />
      
      {/* Inject JSON-LD Schema */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />



      {/* Hero Section */}
      <section className="hero">
        <div className="wrap">
          <div className="eyebrow mono">
            <span className="dot"></span> PitchDock — AI recruiter outreach &amp; cold email automator
          </div>
          <h1>PitchDock helps you skip the ATS<br />and <span className="gradient-text">land in the recruiter&apos;s inbox</span>.</h1>
          <p className="hero-sub">
            PitchDock writes a personalized email for every recruiter you target, attaches your résumé, and sends on a safe schedule — so you spend your time interviewing, not following up.
          </p>
          <div className="hero-ctas">
            <Link href="/dashboard?plan=free" className="btn btn-signal">
              Start for free
            </Link>
            <a href="#telegram" className="btn btn-ghost">
              📱 Telegram Mobile Agent
            </a>
            <a href="#sandbox" className="btn btn-ghost" style={{ border: "none", color: "var(--slate)" }}>
              See sample email ↓
            </a>
          </div>
          <div className="trust-row">
            <span><span className="trust-stars">4.9/5</span> from 300+ engineers</span>
            <div className="chip-row">
              <span className="chip">GOOGLE</span>
              <span className="chip">AMAZON</span>
              <span className="chip">APPLE</span>
              <span className="chip">META</span>
              <span className="chip">NETFLIX</span>
            </div>
          </div>
        </div>
      </section>



      {/* Interactive Sandbox Section */}
      <section id="sandbox">
        <div className="wrap">
          <div className="section-head">
            <h2>Watch it write the email.</h2>
            <p>Pick a highlight and see how PitchDock rewrites the pitch for Sarah, a technical recruiter at Apple — before it ever leaves your outbox.</p>
          </div>

          <div className="compose-wrap">
            <div className="compose">
              {/* Sidebar */}
              <div className="compose-side">
                <div className="side-label">Recruiter target</div>
                <div className="recruiter-name">{recruiter.name}</div>
                <div className="recruiter-role">{recruiter.title} · {recruiter.company}</div>
                
                <div className="side-label">Message focus</div>
                <div className="signal-list">
                  <div 
                    className={`signal-item ${selectedHighlight === "fullstack" ? "active" : ""}`}
                    onClick={() => setSelectedHighlight("fullstack")}
                  >
                    <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16v16H4z" />
                      <path d="M4 9h16" />
                      <path d="M9 4v16" />
                    </svg>
                    Full-Stack Development
                  </div>
                  <div 
                    className={`signal-item ${selectedHighlight === "aws" ? "active" : ""}`}
                    onClick={() => setSelectedHighlight("aws")}
                  >
                    <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                    </svg>
                    AWS Cloud &amp; CI/CD
                  </div>
                  <div 
                    className={`signal-item ${selectedHighlight === "api" ? "active" : ""}`}
                    onClick={() => setSelectedHighlight("api")}
                  >
                    <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 17l6-6-6-6" />
                      <path d="M12 19h8" />
                    </svg>
                    Backend &amp; High-Throughput APIs
                  </div>
                </div>
              </div>

              {/* Main Panel */}
              <div className="compose-main">
                <div className="compose-tabs">
                  <div className="traffic">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="tab active">compose.eml</div>
                  <div className="tab">resume.pdf</div>
                </div>
                <div className="compose-body">
                  <div className="compose-meta">
                    <div className="row">
                      <span className="k">To</span>
                      <span className="v">{recruiter.email}</span>
                    </div>
                    <div className="row">
                      <span className="k">Subject</span>
                      <span className="v">
                        Exploring Senior Software Engineer opportunities at <span className="tok-var">{recruiter.company}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {renderPersonalizedEmailBody(displayedText)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Telegram Mobile Agent Showcase (Included for All Tiers) */}
      <section id="telegram" className="telegram-section">
        <div className="wrap">
          <div className="telegram-grid">
            {/* Left Column: Interactive Chat Mockup */}
            <div className="telegram-chat-card">
              <div className="telegram-chat-header">
                <div className="telegram-bot-avatar">⚡</div>
                <div>
                  <div className="telegram-bot-name">PitchDock Agent</div>
                  <div className="telegram-bot-status">● online · AI Outreach Copilot</div>
                </div>
                <span className="premium-tag" style={{ background: "rgba(139, 92, 246, 0.2)", color: "#a78bfa" }}>FREE &amp; ALL PLANS</span>
              </div>
              <div className="telegram-chat-messages">
                <div className="telegram-msg user">
                  <div className="bubble">/link 849201</div>
                  <span className="time">14:02</span>
                </div>
                <div className="telegram-msg bot">
                  <div className="bubble">
                    <strong>✓ PitchDock Account Linked</strong><br />
                    Connected account: <code>shubranshumishra22@gmail.com</code><br /><br />
                    You can now type commands like <code>status</code> or <code>send 5 emails</code>.
                  </div>
                  <span className="time">14:02</span>
                </div>
                <div className="telegram-msg user">
                  <div className="bubble">status</div>
                  <span className="time">14:05</span>
                </div>
                <div className="telegram-msg bot">
                  <div className="bubble">
                    <strong>📊 Live Campaign Status</strong><br />
                    • Quota: 18 / 50 sent today<br />
                    • Queue: 32 pending recruiter contacts<br />
                    • Channel: Google Gmail API (Connected)
                  </div>
                  <span className="time">14:05</span>
                </div>
                <div className="telegram-msg user">
                  <div className="bubble">send 5 emails</div>
                  <span className="time">14:06</span>
                </div>
                <div className="telegram-msg bot">
                  <div className="bubble">
                    <strong>🚀 Outreach Dispatched</strong><br />
                    Successfully sent 5 personalized emails with resume attached to Apple, Google, and Meta recruiters!
                  </div>
                  <span className="time">14:06</span>
                </div>
              </div>
            </div>

            {/* Right Column: Copy & Benefits */}
            <div className="telegram-info">
              <span className="feature-tag highlight">📱 INCLUDED IN ALL PLANS</span>
              <h2>Control your entire job outreach directly from Telegram.</h2>
              <p className="subtext">
                Never lose momentum in your job search. PitchDock&apos;s Telegram Mobile Agent is included for all users across all subscription tiers (including Free Starter). Your personal AI outreach manager lives right in your pocket. Pair your account with a single click and execute campaigns anywhere.
              </p>
              <div className="telegram-features-list">
                <div className="t-feat">
                  <span className="t-icon">💬</span>
                  <div>
                    <strong>Natural Language Chat</strong>
                    <p>Ask your AI agent for real-time campaign updates, remaining daily quotas, or pending recruiter drafts.</p>
                  </div>
                </div>
                <div className="t-feat">
                  <span className="t-icon">⚡</span>
                  <div>
                    <strong>On-the-go Email Triggering</strong>
                    <p>Type <code>send 5 emails</code> or <code>launch campaign</code> while away from your computer to start sending dispatches.</p>
                  </div>
                </div>
                <div className="t-feat">
                  <span className="t-icon">🔒</span>
                  <div>
                    <strong>Secure 1-Click Linking</strong>
                    <p>Generate a temporary 1-time token from your PitchDock dashboard to pair your Telegram chat safely.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="wrap">
          <div className="section-head">
            <h2>A full suite of smart features.</h2>
            <p>The automated engine underneath every send — matching, writing, attaching, pacing, and mobile control so nothing looks like a bulk blast.</p>
          </div>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-ic">
                <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                  <path d="M4 20V10M12 20V4M20 20v-7" />
                </svg>
              </div>
              <span className="feature-tag">01 · MATCHING</span>
              <h3>Company category matcher</h3>
              <p>Every recruiter&apos;s company is sorted — MNC product, IT services, staffing agency — so your message matches what that recruiter actually screens for.</p>
            </div>
            <div className="feature-card">
              <div className="feature-ic">
                <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                  <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5L15 9M9 15l-2.5 2.5" />
                </svg>
              </div>
              <span className="feature-tag">02 · WRITING</span>
              <h3>AI-powered personalization</h3>
              <p>Your strongest accomplishments are rewritten for the recruiter&apos;s company and role, automatically, for every single send.</p>
            </div>
            <div className="feature-card">
              <div className="feature-ic">
                <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                  <path d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3.5 3.5 0 015 5l-9.2 9.19a1.5 1.5 0 01-2.12-2.12l8.49-8.48" />
                </svg>
              </div>
              <span className="feature-tag">03 · ATTACHING</span>
              <h3>Direct résumé attachments</h3>
              <p>Your CV goes out as a real attachment on every message — not a link recruiters have to click and trust.</p>
            </div>
            <div className="feature-card">
              <div className="feature-ic">
                <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                  <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
                </svg>
              </div>
              <span className="feature-tag">04 · PACING</span>
              <h3>Deliverability &amp; stagger queue</h3>
              <p>A built-in delay guard spaces out sends across each batch, so your domain never reads as a bulk mailer to spam filters.</p>
            </div>
            <div className="feature-card highlighted-telegram-card">
              <div className="feature-ic" style={{ background: "rgba(139, 92, 246, 0.12)", color: "#8b5cf6" }}>
                📱
              </div>
              <span className="feature-tag" style={{ color: "#8b5cf6" }}>05 · MOBILE AGENT</span>
              <h3>Telegram Remote Control</h3>
              <p>Check campaign status, remaining daily limits, and trigger email dispatches from your phone via our official Telegram bot.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Comparison Section */}
      <section id="compare" className="compare">
        <div className="wrap">
          <div className="section-head">
            <h2>Why engineers choose PitchDock.</h2>
            <p>Set next to the two alternatives most job seekers default to.</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Capability</th>
                <th className="col-us">PitchDock</th>
                <th>Manual pitching</th>
                <th>Bulk mailers</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="row-cap">Personalized per-recruiter accomplishments</td>
                <td className="col-us"><span className="ok">✓ AI-powered, automatic</span></td>
                <td>✓ Manual, slow</td>
                <td className="no">✕ Single template only</td>
              </tr>
              <tr>
                <td className="row-cap">Résumé PDFs &amp; documents</td>
                <td className="col-us"><span className="ok">✓ Attached automatically</span></td>
                <td>✓ Supported</td>
                <td className="no">✕ Links only, often blocked</td>
              </tr>
              <tr>
                <td className="row-cap">Send-pacing &amp; stagger safety</td>
                <td className="col-us"><span className="ok">✓ Delay guard on every batch</span></td>
                <td>— not applicable</td>
                <td className="no">✕ Bulk blasts, spam risk</td>
              </tr>
              <tr>
                <td className="row-cap">Category-specific recruiter targeting</td>
                <td className="col-us"><span className="ok">✓ IT services / MNC filter</span></td>
                <td>✓ Manual lookup</td>
                <td className="no">✕ Static list filter only</td>
              </tr>
              <tr>
                <td className="row-cap">Cached résumé rewrites per company</td>
                <td className="col-us"><span className="ok">✓ 15 / month included</span></td>
                <td className="no">— not applicable</td>
                <td className="no">— not applicable</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <div className="wrap">
          <div className="section-head center">
            <h2>Fair, transparent pricing.</h2>
            <p>Flexible plans built around how many recruiters you're reaching this month.</p>
            
            <div className="pricing-toggle-wrap">
              <span className={`toggle-label ${!isAnnual ? "active" : ""}`}>Monthly billing</span>
              <button 
                className={`pricing-toggle ${isAnnual ? "active" : ""}`} 
                onClick={() => setIsAnnual(!isAnnual)}
                aria-label="Toggle annual billing"
              >
                <span className="pricing-toggle-handle"></span>
              </button>
              <span className={`toggle-label ${isAnnual ? "active" : ""}`}>
                Annual billing <span className="discount-tag">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="pricing-grid">
            <div className="price-card">
              <div className="tier">Free starter</div>
              <div className="amount">₹0<sup>/mo</sup></div>
              <div className="per">{isAnnual ? "billed annually" : "billed monthly"}</div>
              <div className="desc">Try AI-tailored email drafts and see how the personalizer works, at a small volume.</div>
              <Link href="/dashboard?plan=free" className="btn btn-ghost" style={{ marginBottom: "20px" }}>
                Start free
              </Link>
              <ul className="tier-features-list">
                <li className="offered">✓ AI tailored cold drafts (first 5)</li>
                <li className="offered">✓ Daily send limit: 5 emails/day</li>
                <li className="offered">✓ Target company category filter</li>
                <li className="offered" style={{ color: "#8b5cf6", fontWeight: 600 }}>📱 Telegram Mobile Agent</li>
                <li className="not-offered">✗ Custom SMTP server config</li>
                <li className="not-offered">✗ Company specific HR search</li>
                <li className="not-offered">✗ Resume achievements rewrite</li>
              </ul>
            </div>
            <div className="price-card">
              <div className="tier">Basic AI</div>
              <div className="amount">{isAnnual ? "₹239" : "₹299"}<sup>/mo</sup></div>
              <div className="per">{isAnnual ? "billed annually" : "billed monthly"}</div>
              <div className="desc">For job hunters starting a real, automated outreach campaign.</div>
              <Link href="/dashboard?plan=basic" className="btn btn-ghost" style={{ marginBottom: "20px" }}>
                Choose Basic
              </Link>
              <ul className="tier-features-list">
                <li className="offered">✓ AI tailored cold drafts (first 20)</li>
                <li className="offered">✓ Daily send limit: 20 emails/day</li>
                <li className="offered">✓ Target company category filter</li>
                <li className="offered">✓ Custom SMTP server config</li>
                <li className="offered" style={{ color: "#8b5cf6", fontWeight: 600 }}>📱 Telegram Mobile Agent</li>
                <li className="not-offered">✗ Company specific HR search</li>
                <li className="not-offered">✗ Resume achievements rewrite</li>
              </ul>
            </div>
            <div className="price-card">
              <div className="tier">Standard Pro</div>
              <div className="amount">{isAnnual ? "₹399" : "₹499"}<sup>/mo</sup></div>
              <div className="per">{isAnnual ? "billed annually" : "billed monthly"}</div>
              <div className="desc">For scaling candidate outreach across more companies and categories.</div>
              <Link href="/dashboard?plan=standard" className="btn btn-ghost" style={{ marginBottom: "20px" }}>
                Choose Standard
              </Link>
              <ul className="tier-features-list">
                <li className="offered">✓ AI tailored cold drafts (first 50)</li>
                <li className="offered">✓ Daily send limit: 50 emails/day</li>
                <li className="offered">✓ Target company category filter</li>
                <li className="offered">✓ Custom SMTP server config</li>
                <li className="offered">✓ Company HR search (up to 5 HRs)</li>
                <li className="offered" style={{ color: "#8b5cf6", fontWeight: 600 }}>📱 Telegram Mobile Agent</li>
                <li className="not-offered">✗ Resume achievements rewrite</li>
              </ul>
            </div>
            <div className="price-card featured">
              <span className="badge-pop mono">MOST POPULAR</span>
              <div className="tier">Premium Master</div>
              <div className="amount">{isAnnual ? "₹799" : "₹999"}<sup>/mo</sup></div>
              <div className="per">{isAnnual ? "billed annually" : "billed monthly"}</div>
              <div className="desc">For serious searches that need fully automated, highest-volume outreach.</div>
              <Link href="/dashboard?plan=premium" className="btn btn-signal" style={{ marginBottom: "20px" }}>
                Choose Premium
              </Link>
              <ul className="tier-features-list">
                <li className="offered">✓ AI tailored cold drafts (first 50)</li>
                <li className="offered">✓ Daily send limit: 50 emails/day</li>
                <li className="offered">✓ Target company category filter</li>
                <li className="offered">✓ Custom SMTP server config</li>
                <li className="offered">✓ Company HR search (up to 10 HRs)</li>
                <li className="offered">✓ Dynamic JD-based Resume rewrite</li>
                <li className="offered" style={{ color: "#8b5cf6", fontWeight: 600 }}>📱 Telegram Mobile Agent</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section (preserved from original codebase) */}
      <section id="faqs" className="faq-section">
        <div className="faq-wrap">
          <div className="section-head center">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about PitchDock.</p>
          </div>

          <div className="faq-list">
            {[
              {
                q: "How does the AI personalize each email?",
                a: "Our background worker analyzes the accomplishments and role highlights configured in your candidate profile, matching them against the company profile and title of the target recruiter to generate a highly tailored, custom introduction."
              },
              {
                q: "Can I send attachments on the Free plan?",
                a: "Yes! Based on developer feedback, we support direct resume PDF attachments across all plans including the Free Starter tier, allowing you to attach your accomplishments directly."
              },
              {
                q: "What is the sending stagger delay?",
                a: "To protect your email account from being flagged by email providers (like Gmail) as a spam source, the system processes drafts in a delivery queue with safety spacing between dispatches."
              },
              {
                q: "How does the Premium resume customize cache work?",
                a: "On the Premium plan, you can customize your resume achievements per company. We store and cache the rewritten accomplishments per targeted company, ensuring it returns instantly if you apply again without consuming token limits."
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className={`faq-card ${faqOpen[idx] ? "open" : ""}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="faq-header">
                  <h4 className="faq-question">{faq.q}</h4>
                  <span className={`faq-icon ${faqOpen[idx] ? "open" : ""}`}>+</span>
                </div>
                {faqOpen[idx] && (
                  <p className="faq-answer">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials & Feedback Section */}
      <section id="feedback" className="feedback-section" style={{ background: "var(--paper-raised)" }}>
         <div className="wrap">
            <div className="section-head center">
               <h2>User Feedback & Reviews</h2>
               <p>Real experiences from candidate outreach campaigns on PitchDock.</p>
            </div>

            <div className="feedback-grid-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", marginTop: "30px" }}>
               {/* Left Column: List Feedbacks */}
               <div className="feedback-display-panel">
                  <h3 style={{ fontSize: "18px", marginBottom: "16px", fontWeight: "600" }}>Latest Member Ratings</h3>
                  <div className="reviews-scroller" style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "350px", overflowY: "auto", paddingRight: "10px" }}>
                     {feedbacks.length === 0 ? (
                        <p style={{ color: "var(--slate)" }}>Loading active user ratings...</p>
                     ) : (
                        feedbacks.map((fb) => (
                           <div key={fb.id} className="review-bubble" style={{ background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                 <strong>{fb.name}</strong>
                                 <span style={{ color: "#f59e0b" }}>{"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}</span>
                              </div>
                              <p style={{ fontSize: "14px", color: "var(--slate)", margin: 0, fontStyle: "italic" }}>"{fb.comment}"</p>
                           </div>
                        ))
                     )}
                  </div>
               </div>

               {/* Right Column: Feedback Form */}
               <div className="feedback-form-panel" style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid var(--line)", boxSizing: "border-box" }}>
                  <h3 style={{ fontSize: "18px", marginBottom: "8px", fontWeight: "600" }}>Share Your Experience</h3>
                  <p style={{ fontSize: "13px", color: "var(--slate)", marginBottom: "20px" }}>Your rating and comments help us improve PitchDock outreach models.</p>
                  
                  {feedbackSubmitSuccess && (
                     <div className="success-banner-alert" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid var(--signal-deep)", color: "var(--signal-deep)", padding: "12px", borderRadius: "8px", fontSize: "13.5px", marginBottom: "16px", textAlign: "center" }}>
                        ✓ Thank you! Your feedback has been saved and displayed dynamically.
                     </div>
                  )}

                  <form onSubmit={handleFeedbackSubmit}>
                     <div className="input-group-row" style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "var(--slate)", marginBottom: "6px" }}>Your Name</label>
                        <input 
                           type="text" 
                           required 
                           placeholder="e.g. Anand" 
                           value={feedbackName} 
                           onChange={e => setFeedbackName(e.target.value)}
                           style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
                        />
                     </div>

                     <div className="input-group-row" style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "var(--slate)", marginBottom: "6px" }}>Rating</label>
                        <div style={{ display: "flex", gap: "6px" }}>
                           {[1, 2, 3, 4, 5].map((stars) => (
                              <button
                                 key={stars}
                                 type="button"
                                 onClick={() => setFeedbackRating(stars)}
                                 onMouseEnter={() => setFeedbackHoverRating(stars)}
                                 onMouseLeave={() => setFeedbackHoverRating(0)}
                                 style={{ background: "none", border: "none", fontSize: "24px", color: (feedbackHoverRating || feedbackRating) >= stars ? "#f59e0b" : "#d1d5db", cursor: "pointer", padding: 0 }}
                              >
                                 ★
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="input-group-row" style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "var(--slate)", marginBottom: "6px" }}>Comments</label>
                        <textarea 
                           required 
                           rows={3}
                           placeholder="How did PitchDock help you? Tell us about your outreach or queries..." 
                           value={feedbackComment} 
                           onChange={e => setFeedbackComment(e.target.value)}
                           style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "8px", fontSize: "14px", resize: "none", boxSizing: "border-box" }}
                        />
                     </div>

                     <button type="submit" disabled={isSubmittingFeedback} className="btn btn-signal" style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
                        {isSubmittingFeedback ? "Saving..." : "Submit Review"}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </section>

      {/* Support / Refund Query Section */}
      <section id="support" className="support-section">
         <div className="wrap">
            <div className="support-card-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "48px", background: "var(--paper-raised)", padding: "40px", borderRadius: "20px", border: "1px solid var(--line)", boxSizing: "border-box" }}>
               <div>
                  <h2 style={{ fontSize: "28px", lineHeight: "1.2", marginBottom: "12px", fontWeight: "600" }}>Have questions or need a refund?</h2>
                  <p style={{ color: "var(--slate)", fontSize: "15px", lineHeight: "1.6" }}>
                     Our developers are active 24/7 to resolve configuration issues, update database targets, or process billing/refund inquiries. Fill out this form and we'll reply directly to your inbox.
                  </p>
                  <div style={{ marginTop: "24px" }}>
                     <p style={{ margin: "6px 0", fontSize: "13.5px", color: "var(--slate)" }}>
                        📧 Support Desk: <strong>pitchdock.xyz@gmail.com</strong>
                     </p>
                     <p style={{ margin: "6px 0", fontSize: "13.5px", color: "var(--slate)" }}>
                        ⚡ Average Response Time: <strong>&lt; 2 hours</strong>
                     </p>
                  </div>
               </div>

               <div>
                  {supportSubmitSuccess && (
                     <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid var(--signal-deep)", color: "var(--signal-deep)", padding: "16px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px" }}>
                        {supportSubmitSuccess}
                     </div>
                  )}

                  {supportError && (
                     <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "16px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px" }}>
                        {supportError}
                     </div>
                  )}

                  <form onSubmit={handleSupportSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                           <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "var(--slate)", marginBottom: "4px" }}>Name</label>
                           <input 
                              type="text" 
                              required 
                              placeholder="Your name" 
                              value={supportName}
                              onChange={e => setSupportName(e.target.value)}
                              style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "8px", background: "#ffffff", fontSize: "13.5px", boxSizing: "border-box" }}
                           />
                        </div>
                        <div>
                           <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "var(--slate)", marginBottom: "4px" }}>Email</label>
                           <input 
                              type="email" 
                              required 
                              placeholder="Your email" 
                              value={supportEmail}
                              onChange={e => setSupportEmail(e.target.value)}
                              style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "8px", background: "#ffffff", fontSize: "13.5px", boxSizing: "border-box" }}
                           />
                        </div>
                     </div>

                     <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "var(--slate)", marginBottom: "4px" }}>Inquiry Type</label>
                        <select 
                           value={supportSubject}
                           onChange={e => setSupportSubject(e.target.value)}
                           style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "8px", background: "#ffffff", fontSize: "13.5px", boxSizing: "border-box" }}
                        >
                           <option value="General Query">General Question</option>
                           <option value="Refund Request">Refund Request</option>
                           <option value="Technical Support">Technical / SMTP Configuration Help</option>
                           <option value="Feature Suggestion">Feature Request</option>
                        </select>
                     </div>

                     <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "var(--slate)", marginBottom: "4px" }}>Message</label>
                        <textarea 
                           required 
                           rows={4} 
                           placeholder="Provide details about your query or refund request..." 
                           value={supportMessage}
                           onChange={e => setSupportMessage(e.target.value)}
                           style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "8px", background: "#ffffff", fontSize: "13.5px", resize: "none", boxSizing: "border-box" }}
                        />
                     </div>

                     <button 
                        type="submit" 
                        disabled={isSubmittingSupport} 
                        className="btn btn-primary" 
                        style={{ width: "100%", justifyContent: "center", padding: "12px", background: "#18181b", color: "#ffffff", cursor: "pointer", boxSizing: "border-box" }}
                     >
                        {isSubmittingSupport ? "Sending email..." : "Send Support Request"}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </section>

      {/* Security, Compliance & Google API Verification Notice */}
      <section className="about-section" id="purpose">
        <div className="wrap">
          <div className="section-head center">
            <h2>Security &amp; Data Trust</h2>
            <p>Built with enterprise security standards and strict Google API Services User Data Policy compliance.</p>
          </div>
          <div className="about-grid">
            <div className="about-card">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(37, 99, 235, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#2563eb" }}>🎯</div>
                <h3 style={{ margin: 0 }}>Application Purpose &amp; Overview</h3>
              </div>
              <p>
                <strong>PitchDock</strong> is an AI-powered recruiter outreach engine designed to help job seekers connect directly with technical recruiters and hiring managers. PitchDock drafts personalized cold email pitches based on candidate achievements and routes them safely to recruiters to bypass automated Applicant Tracking System (ATS) filters.
              </p>
            </div>

            <div className="about-card">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#10b981" }}>🛡️</div>
                <h3 style={{ margin: 0 }}>Google API Integration &amp; Scope Notice</h3>
              </div>

              <p>
                PitchDock integrates with Google OAuth to allow candidates to authenticate their Gmail mailbox and send outreach emails directly via Google&apos;s official Gmail API (<code>https://www.googleapis.com/auth/gmail.send</code>).
              </p>
              <ul style={{ marginTop: "14px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13.5px", color: "var(--slate)" }}>
                <li><strong>Purpose of Scope:</strong> The <code>gmail.send</code> scope is used exclusively to send outreach emails authorized by the user.</li>
                <li><strong>Zero Inbox Access:</strong> PitchDock does <em>not</em> read, store, index, or delete your Gmail inbox messages, contacts, or personal emails.</li>
                <li><strong>Compliance:</strong> PitchDock adheres strictly to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>Google API Services User Data Policy</a>.</li>
              </ul>
              <div style={{ marginTop: "18px", display: "flex", gap: "20px", fontSize: "13.5px" }}>
                <Link href="/privacy" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "underline" }}>
                  Privacy Policy →
                </Link>
                <Link href="/terms" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "underline" }}>
                  Terms of Service →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="wrap">
          <div className="foot-tag">PitchDock — reach the recruiter, not the filter.</div>
          <div className="foot-links" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href="#features">Features</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
            <Link href="/refund">Refund Policy</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
