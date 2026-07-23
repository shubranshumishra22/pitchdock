"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to sign up");
      }

      if (data.requires_verification) {
        setIsRegistered(true);
      } else {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("authUser", JSON.stringify(data.user));
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to register user. Email might already be taken.");
    } finally {
      setLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="landing-root landing-page-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "116px 20px 40px" }}>
          <div style={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(24, 24, 27, 0.08)",
            borderRadius: "16px",
            padding: "36px",
            boxShadow: "0 4px 20px rgba(24, 24, 27, 0.02)",
            textAlign: "center"
          }}>
            <img 
              src="/finalLogo.png" 
              alt="PitchDock Logo" 
              style={{ display: "block", margin: "0 auto 16px", width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }} 
            />
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "24px auto 16px"
            }}>
              <svg style={{ width: "24px", height: "24px", color: "#10B981" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            
            <h1 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
              Check your inbox
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "12px" }}>
              We have sent a verification link to <strong style={{ color: "var(--text-primary)" }}>{email}</strong>. Please click the link to activate your PitchDock account.
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", fontStyle: "italic", marginBottom: "24px" }}>
              (If you can't find it, please check your spam or junk folder.)
            </p>
            
            <Link href="/login" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-root landing-page-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Main card container */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "116px 20px 40px" }}>
        <div style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(24, 24, 27, 0.08)",
          borderRadius: "16px",
          padding: "36px",
          boxShadow: "0 4px 20px rgba(24, 24, 27, 0.02)"
        }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <img 
              src="/finalLogo.png" 
              alt="PitchDock Logo" 
              style={{ display: "block", margin: "0 auto 16px", width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }} 
            />
            <h1 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
              Get started free
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              Create an account and launch your personal AI outreach machine.
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: "rgba(185, 28, 28, 0.05)",
              border: "1px solid rgba(185, 28, 28, 0.15)",
              color: "var(--accent-red)",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "13.5px",
              marginBottom: "24px",
              lineHeight: "1.4"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="btn-toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text-secondary)"
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "14px",
                fontWeight: 600,
                marginTop: "10px",
                justifyContent: "center",
                display: "flex",
                alignItems: "center"
              }}
            >
              {loading ? "Creating account..." : "Sign up for console"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "28px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--accent-primary)", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
