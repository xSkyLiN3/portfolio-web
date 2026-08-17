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

export const metadata: Metadata = {
  metadataBase: new URL("https://nightstrike.cloud"),
  title: {
    default: "Cristóbal Vergara — Portafolio",
    template: "%s · Cristóbal Vergara",
  },
  description:
    "Estudiante de Ingeniería en Informática con proyectos propios de software y una dirección clara hacia AI/ML Engineering.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "/",
    siteName: "Cristóbal Vergara",
    title: "Cristóbal Vergara — Software, datos y camino hacia AI/ML",
    description:
      "Estudiante de Ingeniería en Informática con proyectos propios en Python, TypeScript y PostgreSQL.",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "Cristóbal Vergara — Software, Datos y AI/ML",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cristóbal Vergara — Software, datos y camino hacia AI/ML",
    description:
      "Estudiante de Ingeniería en Informática con proyectos propios en Python, TypeScript y PostgreSQL.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
