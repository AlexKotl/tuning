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
          <div className="navbar bg-base-100">
            <a className="btn btn-ghost text-lg">Tuning Geek</a>
          </div>

          
          {children}
        </main>
      </body>
    </html>
  );
}
