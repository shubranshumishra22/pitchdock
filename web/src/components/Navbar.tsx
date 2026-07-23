"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="landing-root">
      <nav className="nav">
        <div className="wrap">
          <Link href="/" className="brand" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img 
              src="/finalLogo.png" 
              alt="PitchDock Logo" 
              style={{ height: "42px", width: "42px", objectFit: "cover", borderRadius: "50%" }} 
            />
            Pitch<span>Dock</span>
          </Link>
          <div className="nav-links">
            <Link href="/#features">Features</Link>
            <Link href="/#pricing">Pricing</Link>
            <Link href="/privacy" style={{ fontSize: "13px", opacity: 0.7 }}>Privacy</Link>
            {pathname !== "/login" && pathname !== "/signup" && (
              <Link href="/login" style={{ fontWeight: 600 }}>Sign in</Link>
            )}
          </div>
          
          {pathname === "/login" || pathname === "/signup" ? (
            <Link 
              href={pathname === "/login" ? "/signup" : "/login"} 
              className="btn btn-ghost" 
              style={{ fontSize: "13px", padding: "8px 16px" }}
            >
              {pathname === "/login" ? "Sign up" : "Sign in"}
            </Link>
          ) : (
            <Link href="/dashboard" className="btn btn-primary">
              Launch console
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

