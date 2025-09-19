import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import ServiceWorker from './ServiceWorkerRegister';
import type { Viewport } from 'next/types';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Portfolio photo",
  description: "Site de photographie avec Supabase et Cloudinary",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "nextjs13", "pwa", "next-pwa"],
  authors: [{ name: "Pierre Merlaud" }],
  icons: [
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    { rel: "icon", url: "/icon_192_192_tripluch.png" },
  ],
};

export const viewport: Viewport = {
  themeColor: "#0ab9feff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} bg-white font-sans text-black dark:bg-black dark:text-white`}
      >
        <Header />
        <main className="min-h-screen px-6 py-10">{children}</main>
        <Footer />
      </body>
      <ServiceWorker />
    </html>
  );
}
