import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { tuning: string } }): Promise<Metadata> {
  const tuning = params.tuning === "standard" 
    ? "Standard Tuning" 
    : params.tuning.replace(/sharp/, "#").split("-").join(" ");

  return {
    title: `Fingerstyle Top 🔝 | ${tuning}`,
    description: "Find any guitar tab by defined tuning",
  };
}

export default function TuningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 