import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fingerstyle Top 🔝 Fingerstyle library and advanced guitar tuner",
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
          <div className="navbar bg-base-100">
            <div className="flex-1">
              <Link href="/tuning/standard" className="btn btn-ghost text-lg">
                🔝 Fingerstyle Top
              </Link>
            </div>
            <div className="flex-none">
              <Link href="/favorites" className="btn btn-ghost">
                ★ Favorites
              </Link>
            </div>
          </div>
          
          {children}
        </main>
      </body>
    </html>
  );
}
