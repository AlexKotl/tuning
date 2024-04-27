import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tuning Geek | Fingerstyle library",
  description: "Find any guitar tab by defined tuning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="container mx-auto">
        <main>
          <h1>Tuning Geek</h1>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-10">{children}</div>
          </div>
        </main>
      </body>
    </html>
  );
}
