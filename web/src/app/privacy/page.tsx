"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div style={{ padding: "140px 24px 80px 24px", maxWidth: "800px", margin: "0 auto", color: "var(--ink)", lineHeight: "1.6" }}>
      <Link href="/" style={{ fontSize: "14px", color: "var(--slate)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "32px", fontWeight: 500 }}>
        ← Back to PitchDock Homepage
      </Link>

      <h1 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "8px", letterSpacing: "-0.5px" }}>Privacy Policy</h1>
      <p style={{ color: "var(--slate)", fontSize: "14px", marginBottom: "40px" }}>Last Updated: July 20, 2026</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <section>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when creating an account, setting up your profile, or contacting us. This includes:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "10px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><strong>Account Data:</strong> Name, email address, password hash, and sign-up dates.</li>
            <li><strong>Outreach Profile:</strong> Professional details, work history achievements, educational credentials, target titles, and resume PDF files.</li>
            <li><strong>Outreach Configurations:</strong> Custom SMTP credentials (host, port, sender email, app passwords) to route dispatches directly through your mailbox.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>2. How We Use Your Information</h2>
          <p>
            We use the collected information for the following purposes:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "10px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>To personalize and write custom cold email drafts using our AI models based on your background and the targeted recruiter.</li>
            <li>To deliver the emails through your configured SMTP mail server safely.</li>
            <li>To manage and track subscription usage quotas and billing transaction receipts.</li>
            <li>To answer your support tickets, refund requests, or feedback inputs.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>3. Data Sharing and Third-Party API Integrations</h2>
          <p>
            We do not sell, trade, or rent your personal profile information to third parties. We share information with service providers strictly necessary to run the platform:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "10px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><strong>AI Models:</strong> Recruiter titles and candidate profile achievements are processed via secured Large Language Model (LLM) APIs to generate drafts.</li>
            <li><strong>Payment Gateways:</strong> Transaction tokens are processed securely by our PCI-DSS compliant checkout systems.</li>
          </ul>
        </section>

        <section style={{ background: "rgba(37, 99, 235, 0.04)", borderLeft: "4px solid #2563eb", padding: "16px 20px", borderRadius: "0 8px 8px 0" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "#1e40af" }}>Google User Data & Limited Use Disclosure</h2>
          <p style={{ fontSize: "14px", marginBottom: "8px" }}>
            PitchDock uses Google OAuth to allow users to send cold email outreach dispatches directly via Google API (Gmail). We only access your Google account to send emails explicitly requested by you and to identify your connected email address.
          </p>
          <p style={{ fontSize: "14px", fontWeight: "500" }}>
            PitchDock's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>Google API Services User Data Policy</a>, including the Limited Use requirements.
          </p>
        </section>


        <section>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>4. Data Security</h2>
          <p>
            We implement high-standard security controls to guard your account data, credentials, and uploaded resumes. Your custom SMTP passwords are secure. However, please note that no electronic transmission over the Internet can be guaranteed 100% secure.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>5. Cookies and Analytics</h2>
          <p>
            We use secure browser storage tokens (localStorage) to verify active login sessions and authenticate API requests. We may use privacy-centric session indicators to monitor system workloads and optimize delivery worker staggers.
          </p>
        </section>

        <section style={{ borderTop: "1px solid var(--line)", paddingTop: "24px", marginTop: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>Privacy Inquiries</h3>
          <p>
            If you have questions about this Privacy Policy or wish to request deletion of your account and credentials, please email us at <strong>pitchdock.xyz@gmail.com</strong> or submit an inquiry using our <Link href="/contact" style={{ color: "var(--signal-deep)", fontWeight: "500" }}>Contact Page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
