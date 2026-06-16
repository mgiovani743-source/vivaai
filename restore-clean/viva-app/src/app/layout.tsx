import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Viva AI — Sua IA de Evolução Pessoal",
  description: "Prepare sua melhor versão para cada momento da sua vida. Plataforma de evolução pessoal feminina com inteligência artificial.",
  keywords: ["evolução feminina", "IA pessoal", "moda", "beleza", "autoconhecimento", "coaching"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
