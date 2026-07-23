"use client";

import Link from "next/link";

export default function RefundPage() {
  return (
    <div style={{ padding: "140px 24px 80px 24px", maxWidth: "800px", margin: "0 auto", color: "var(--ink)", lineHeight: "1.6" }}>
      <Link href="/" style={{ fontSize: "14px", color: "var(--slate)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "32px", fontWeight: 500 }}>
        ← Back to PitchDock Homepage
      </Link>

      <h1 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "8px", letterSpacing: "-0.5px" }}>Cancellation & Refund Policy</h1>
      <p style={{ color: "var(--slate)", fontSize: "14px", marginBottom: "40px" }}>Last Updated: July 20, 2026</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <section>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>1. Subscription Cancellations</h2>
          <p>
            You can cancel your paid subscription (Basic, Standard, or Premium) at any time. 
          </p>
          <ul style={{ paddingLeft: "20px", margin: "10px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>Cancellations can be made directly in the console settings under the Billing section.</li>
            <li>Upon cancellation, your plan will remain active until the end of your current paid billing period (monthly or annual).</li>
            <li>No further automated renewal charges will be processed after you initiate a cancellation.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>2. Refund Eligibility</h2>
          <p>
            We believe in high-quality software, which is why we offer a transparent refund process:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "10px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><strong>7-Day Window:</strong> You are eligible for a full refund within 7 days of your initial purchase or plan upgrade, provided that you have not initiated more than 5 recruiter email dispatches in the paid billing period.</li>
            <li><strong>Technical Failures:</strong> If you experience verified server delivery failures or configuration errors that prevent our queue worker from staving/sending your campaigns, and our support developers are unable to fix it within 3 business days, you are eligible for a full refund regardless of your dispatch quota.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>3. Ineligible Transactions</h2>
          <p>
            Refunds will not be processed in the following scenarios:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "10px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>You cancel your subscription after the 7-day initial window has expired.</li>
            <li>Your connected personal email account is suspended or blocked by your own email provider (e.g. Google Workspace or Outlook) due to sending spam or violating their individual daily delivery limits.</li>
            <li>You have already utilized a significant portion of your plan's monthly recruiter email dispatches.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>4. How to Request a Refund</h2>
          <p>
            To request a refund, please contact us by completing the form on our dedicated <Link href="/contact" style={{ color: "var(--signal-deep)", fontWeight: "500" }}>Contact Page</Link> or by sending an email directly to <strong>pitchdock.xyz@gmail.com</strong>. Please include your:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "10px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>Registered account email address.</li>
            <li>The date of the transaction.</li>
            <li>A brief explanation of the technical issue or the reason for your refund request.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>5. Processing Timelines</h2>
          <p>
            Once a refund is approved by our developer team, it is initiated immediately. The refunded amount will be credited back to your original payment method (Credit Card, Debit Card, UPI, or Net Banking) within <strong>5 to 7 business days</strong>, depending on the banking channels.
          </p>
        </section>
      </div>
    </div>
  );
}
