import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "One Blank Page — Cartão Digital Profissional",
    template: "%s | One Blank Page",
  },
  description:
    "Crie seu cartão de carreira digital profissional. Centralize contatos, portfólio, certificações e redes sociais em um único link verificável. Ideal para médicos, peritos e profissionais de saúde.",
  keywords: [
    "cartão digital",
    "perfil profissional",
    "médico",
    "perito",
    "CRM",
    "QR Code",
    "NFC",
    "link-in-bio",
    "One Blank Page",
    "Editora Viva",
  ],
  authors: [{ name: "Editora Viva", url: "https://editoraviva.art.br" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "One Blank Page",
    title: "One Blank Page — Cartão Digital Profissional",
    description:
      "Centralize sua identidade profissional médica em um único link verificável.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
