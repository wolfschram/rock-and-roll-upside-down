"use client";

import { useState } from "react";

type Step = "login" | "set_password" | "github" | "agreement" | "complete";

export default function Portal() {
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [githubConnected, setGithubConnected] = useState(false);
  const [agreementSigned, setAgreementSigned] = useState(false);
  const [error, setError] = useState("");

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
    },
    card: {
      background: "#141414",
      border: "1px solid #222",
      padding: "40px",
      maxWidth: "480px",
      width: "100%",
    },
    title: {
      fontSize: "12px",
      textTransform: "uppercase" as const,
      letterSpacing: "4px",
      color: "#666",
      marginBottom: "8px",
    },
    heading: {
      fontSize: "20px",
      fontWeight: 700,
      color: "#e0e0e0",
      marginBottom: "24px",
    },
    label: {
      display: "block",
      fontSize: "11px",
      textTransform: "uppercase" as const,
      letterSpacing: "2px",
      color: "#666",
      marginBottom: "6px",
      marginTop: "16px",
    },
    input: {
      width: "100%",
      background: "#0a0a0a",
      border: "1px solid #333",
      color: "#e0e0e0",
      padding: "12px 16px",
      fontFamily: "inherit",
      fontSize: "14px",
      boxSizing: "border-box" as const,
    },
    button: {
      width: "100%",
      background: "#e0e0e0",
      color: "#0a0a0a",
      border: "none",
      padding: "14px",
      fontFamily: "inherit",
      fontSize: "13px",
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "2px",
      cursor: "pointer",
      marginTop: "24px",
    },
    githubButton: {
      width: "100%",
      background: "#24292e",
      color: "#fff",
      border: "1px solid #444",
      padding: "14px",
      fontFamily: "inherit",
      fontSize: "13px",
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "2px",
      cursor: "pointer",
      marginTop: "16px",
    },
    stepIndicator: {
      display: "flex",
      gap: "8px",
      marginBottom: "24px",
    },
    stepDot: (active: boolean, done: boolean) => ({
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: done ? "#4a4" : active ? "#c9a84c" : "#333",
    }),
    error: {
      color: "#d44",
      fontSize: "12px",
      marginTop: "8px",
    },
    agreement: {
      background: "#0a0a0a",
      border: "1px solid #222",
      padding: "20px",
      fontSize: "12px",
      lineHeight: "1.8",
      maxHeight: "300px",
      overflowY: "auto" as const,
      marginTop: "16px",
      color: "#999",
    },
    sub: {
      fontSize: "11px",
      color: "#666",
      marginTop: "8px",
    },
    success: {
      color: "#4a4",
      fontSize: "13px",
      marginTop: "8px",
    },
    connected: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: "#0a0a0a",
      border: "1px solid #333",
      padding: "12px 16px",
      marginTop: "16px",
      fontSize: "14px",
    },
  };

  const steps: Step[] = ["login", "set_password", "github", "agreement", "complete"];
  const stepIndex = steps.indexOf(step);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>Rock&Roll UpsideDown</div>

        {step !== "login" && step !== "complete" && (
          <div style={styles.stepIndicator}>
            {["Credentials", "GitHub", "Agreement"].map((s, i) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div style={styles.stepDot(stepIndex - 1 === i, stepIndex - 1 > i)} />
                <span
                  style={{
                    fontSize: "10px",
                    color: stepIndex - 1 >= i ? "#e0e0e0" : "#444",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Step 1: Login ──────────────────────────── */}
        {step === "login" && (
          <>
            <div style={styles.heading}>Sign In</div>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="wolf@archive-35.com"
            />
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // TODO: real auth — for now, any login goes to onboarding
                  setStep("set_password");
                }
              }}
            />
            {error && <div style={styles.error}>{error}</div>}
            <button
              style={styles.button}
              onClick={() => {
                if (!email) {
                  setError("Email required");
                  return;
                }
                setError("");
                setStep("set_password");
              }}
            >
              Sign In
            </button>
          </>
        )}

        {/* ── Step 2: Set credentials ────────────────── */}
        {step === "set_password" && (
          <>
            <div style={styles.heading}>Set Your Credentials</div>
            <p style={styles.sub}>First login — choose your platform username and password.</p>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="dave"
            />
            <label style={styles.label}>New Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="minimum 12 characters"
            />
            {error && <div style={styles.error}>{error}</div>}
            <button
              style={styles.button}
              onClick={() => {
                if (!username || username.length < 2) {
                  setError("Username required (min 2 characters)");
                  return;
                }
                if (!password || password.length < 12) {
                  setError("Password must be at least 12 characters");
                  return;
                }
                setError("");
                setStep("github");
              }}
            >
              Continue
            </button>
          </>
        )}

        {/* ── Step 3: Connect GitHub ─────────────────── */}
        {step === "github" && (
          <>
            <div style={styles.heading}>Connect GitHub</div>
            <p style={styles.sub}>
              Link your GitHub account. This provisions your access to the
              rock-and-roll-upside-down repository and enables branch
              protection, CODEOWNERS, and CI/CD for your branches.
            </p>

            {!githubConnected ? (
              <>
                <label style={styles.label}>GitHub Username</label>
                <input
                  style={styles.input}
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="your-github-username"
                />
                <p style={styles.sub}>
                  Enter your GitHub username. We will send you a collaborator
                  invite and configure CODEOWNERS with your account.
                </p>

                <button
                  style={styles.githubButton}
                  onClick={() => {
                    if (!githubUsername || githubUsername.length < 1) {
                      setError("GitHub username required");
                      return;
                    }
                    setError("");
                    // TODO: In production this triggers GitHub OAuth flow
                    // For now, accept the username and mark connected
                    setGithubConnected(true);
                  }}
                >
                  Connect @{githubUsername || "github"}
                </button>

                <p style={styles.sub}>
                  This will also be used for:<br />
                  — CODEOWNERS file (both co-owners required for main)<br />
                  — Branch protection rules<br />
                  — Commit signing verification
                </p>
              </>
            ) : (
              <>
                <div style={styles.connected}>
                  <span style={{ color: "#4a4", fontSize: "16px" }}>&#10003;</span>
                  <span>
                    Connected as <strong>@{githubUsername}</strong>
                  </span>
                </div>
                <p style={styles.success}>
                  GitHub account linked. Repository access will be provisioned
                  after you sign the co-ownership agreement.
                </p>
              </>
            )}

            {error && <div style={styles.error}>{error}</div>}

            {githubConnected && (
              <button style={styles.button} onClick={() => setStep("agreement")}>
                Continue to Agreement
              </button>
            )}
          </>
        )}

        {/* ── Step 4: Co-Ownership Agreement ─────────── */}
        {step === "agreement" && (
          <>
            <div style={styles.heading}>Co-Ownership Agreement</div>
            <p style={styles.sub}>
              Read the full agreement. Both co-owners must sign before either
              gets full platform access.
            </p>

            <div style={styles.agreement}>
              <strong>ROCK&ROLL UPSIDE DOWN — CO-OWNERSHIP AGREEMENT</strong>
              <br /><br />
              <strong>Version 1.0 — March 2026</strong>
              <br /><br />
              This agreement is between Wolf Schram ("Co-Owner A") and the
              undersigned ("Co-Owner B"), collectively "the Co-Owners."
              <br /><br />
              <strong>1. Ownership.</strong> All intellectual property created
              within the rock-and-roll-upside-down repository is owned 50/50 by
              both Co-Owners. This includes code, architecture, designs,
              documentation, and any derivative works.
              <br /><br />
              <strong>2. Decision Making.</strong> Major decisions — architecture
              changes, external partnerships, fundraising, spending — require
              agreement from both Co-Owners. Day-to-day development within
              personal feature branches does not require approval.
              <br /><br />
              <strong>3. Revenue.</strong> All revenue generated by the platform
              shall be split 50/50 after agreed operating costs.
              <br /><br />
              <strong>4. Contributions.</strong> All contributions to the develop
              or main branches become jointly owned automatically. Work in
              personal sandbox branches remains personal until merged.
              <br /><br />
              <strong>5. Protected Branches.</strong> The main branch requires
              approval from both Co-Owners for any merge. This is enforced via
              GitHub CODEOWNERS.
              <br /><br />
              <strong>6. Dissolution.</strong> Requires mutual agreement or
              California arbitration as a last resort. Neither Co-Owner may
              unilaterally dissolve the partnership.
              <br /><br />
              <strong>7. Third Parties.</strong> Any external partnership,
              investor agreement, or contractor engagement requires both
              signatures.
              <br /><br />
              By clicking "I agree as co-owner" below, you are digitally signing
              this agreement. Your signature is timestamped and IP-logged.
            </div>

            <button
              style={{
                ...styles.button,
                background: agreementSigned ? "#4a4" : "#c9a84c",
                color: "#0a0a0a",
              }}
              onClick={() => {
                setAgreementSigned(true);
                // TODO: POST to API — store signature with timestamp, IP, user-agent, agreement hash
                setTimeout(() => setStep("complete"), 500);
              }}
            >
              {agreementSigned ? "Signed ✓" : "I Agree as Co-Owner"}
            </button>
          </>
        )}

        {/* ── Step 5: Complete ───────────────────────── */}
        {step === "complete" && (
          <>
            <div style={styles.heading}>You're In.</div>
            <div style={{ fontSize: "13px", lineHeight: "2", color: "#999" }}>
              <div>
                <span style={{ color: "#4a4" }}>&#10003;</span> Username:{" "}
                <strong style={{ color: "#e0e0e0" }}>{username}</strong>
              </div>
              <div>
                <span style={{ color: "#4a4" }}>&#10003;</span> GitHub:{" "}
                <strong style={{ color: "#e0e0e0" }}>@{githubUsername}</strong>
              </div>
              <div>
                <span style={{ color: "#4a4" }}>&#10003;</span> Co-ownership
                agreement: <strong style={{ color: "#4a4" }}>Signed</strong>
              </div>
            </div>

            <div
              style={{
                background: "#0a0a0a",
                border: "1px solid #222",
                padding: "16px",
                marginTop: "24px",
                fontSize: "12px",
                lineHeight: "1.8",
                color: "#666",
              }}
            >
              <strong style={{ color: "#e0e0e0" }}>What happens next:</strong>
              <br />
              — Repository access provisioned for @{githubUsername}
              <br />
              — CODEOWNERS updated with your GitHub account
              <br />
              — Your sandbox branch <code>sandbox/dave</code> created
              <br />
              — Branch protection rules applied to main
              <br /><br />
              Welcome to Rock&Roll UpsideDown.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
