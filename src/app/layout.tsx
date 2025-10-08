import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Canvas",
  description: "Intelligent canvas drawing application with export functionality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.concisecss.com/concise.min.css" />
      </head>
      <body className="bg-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
