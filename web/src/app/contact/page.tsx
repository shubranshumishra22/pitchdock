"use client";

import { useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://www.pitchdock.xyz";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Query");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/api/support-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });
      if (res.ok) {
        setSuccess("Your support inquiry was successfully sent. The PitchDock team will email you back shortly!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to deliver support inquiry.");
      }
    } catch (err) {
      setError("Unable to connect to the mail server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "140px 24px 80px 24px", maxWidth: "900px", margin: "0 auto", color: "var(--ink)", lineHeight: "1.6" }}>
      <Link href="/" style={{ fontSize: "14px", color: "var(--slate)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "32px", fontWeight: 500 }}>
        ← Back to PitchDock Homepage
      </Link>

      <h1 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "8px", letterSpacing: "-0.5px" }}>Contact Us</h1>
      <p style={{ color: "var(--slate)", fontSize: "14.5px", marginBottom: "40px" }}>Get in touch with the PitchDock developers for queries, technical setup, or refund requests.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "48px", marginTop: "20px" }}>
        
        {/* Left Column: Coordinates */}
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>Support Coordinates</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", color: "var(--slate)", margin: "0 0 6px 0" }}>📧 Support Email</h3>
              <p style={{ margin: 0, fontSize: "15px", fontWeight: "500" }}>
                <a href="mailto:pitchdock.xyz@gmail.com" style={{ color: "var(--signal-deep)", textDecoration: "none" }}>
                  pitchdock.xyz@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", color: "var(--slate)", margin: "0 0 6px 0" }}>⚡ Average Response Time</h3>
              <p style={{ margin: 0, fontSize: "15px" }}>Under 2 Hours (24/7 Developer coverage)</p>
            </div>

            <div>
              <h3 style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", color: "var(--slate)", margin: "0 0 6px 0" }}>📍 Operational Address</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "var(--slate)", lineHeight: "1.5" }}>
                PitchDock Technologies LLC<br />
                Vasant Kunj Phase II,<br />
                New Delhi, 110070,<br />
                India
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div style={{ background: "var(--paper-raised)", padding: "28px", borderRadius: "16px", border: "1px solid var(--line)" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>Send a Message</h2>
          
          {success && (
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid var(--signal-deep)", color: "var(--signal-deep)", padding: "14px", borderRadius: "8px", fontSize: "13.5px", marginBottom: "16px" }}>
              ✓ {success}
            </div>
          )}

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "14px", borderRadius: "8px", fontSize: "13.5px", marginBottom: "16px" }}>
              ✕ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "var(--slate)", marginBottom: "4px" }}>Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Your name" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "8px", background: "#ffffff", fontSize: "13.5px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "var(--slate)", marginBottom: "4px" }}>Email</label>
                <input 
                  type="email" 
                  required 
                  placeholder="Your email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "8px", background: "#ffffff", fontSize: "13.5px", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "var(--slate)", marginBottom: "4px" }}>Topic</label>
              <select 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "8px", background: "#ffffff", fontSize: "13.5px", boxSizing: "border-box" }}
              >
                <option value="General Query">General Question</option>
                <option value="Refund Request">Refund Request</option>
                <option value="Technical Support">Technical / SMTP Help</option>
                <option value="Feature Suggestion">Feature Request</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "var(--slate)", marginBottom: "4px" }}>Message</label>
              <textarea 
                required 
                rows={4} 
                placeholder="How can we help you?" 
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "8px", background: "#ffffff", fontSize: "13.5px", resize: "none", boxSizing: "border-box" }}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting} 
              style={{ width: "100%", padding: "12px", background: "#18181b", color: "#ffffff", borderRadius: "8px", border: "none", fontWeight: "600", cursor: "pointer", fontSize: "13.5px" }}
            >
              {isSubmitting ? "Sending..." : "Submit Inquiry"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
