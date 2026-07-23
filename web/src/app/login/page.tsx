"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              Welcome back
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              Sign in to manage your automated cold outreach campaigns.
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
              {loading ? "Signing in..." : "Sign in to console"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "28px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <Link href="/signup" style={{ color: "var(--accent-primary)", fontWeight: 600, textDecoration: "none" }}>
              Sign up free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
