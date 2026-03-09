import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Isiteki - Finanzas Personales",
  description: "Registra tus gastos e ingresos de forma rápida y sencilla",
  
  // Configuración de íconos para PWA
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/isiteki-logo.png", sizes: "192x192", type: "image/png" },
      { url: "/isiteki-logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/isiteki-logo.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // Configuración para iOS (iPhone/iPad)
  appleWebApp: {
    capable: true,
    title: "Isiteki",
    statusBarStyle: "black-translucent",
  },

  // Manifest
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  // Theme color para la barra de navegación
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#cfd73f" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],

  // Viewport para PWA
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${manrope.variable} antialiased font-manrope`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
