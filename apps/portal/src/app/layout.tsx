import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RRUD Portal — Rock&Roll UpsideDown",
  description: "Authentication portal for Rock&Roll UpsideDown",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace",
          background: "#0a0a0a",
          color: "#e0e0e0",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
