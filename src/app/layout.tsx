import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/*export const metadata: Metadata = {
  title: { default: "Promociones SV", template: "%s | Promociones SV" },
  description: "El sitio 100% salvadoreño para estar al tanto de las mejores promociones",
};*/

type Props = { params: Promise<{ id: string}> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const promo = "Promoción X";

  return {
    title: promo,
    description: "La mejor promoción",
  }
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
