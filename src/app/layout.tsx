import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AudioPlayerProvider } from '@/components/AudioPlayerContext';
import MainLayout from '@/components/MainLayout';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://micapa.net'),
  title: 'MICAPA | Ministerio el Camino de la Palabra - Comayagua, Honduras',
  description:
    'Sitio web oficial de la iglesia cristiana MICAPA (Ministerio el Camino de la Palabra) y Radio Mi Capa en Comayagua, Honduras. Horarios de cultos, mensajes pastorales, radio en vivo y transmisiones.',
  keywords: [
    'MICAPA',
    'Ministerio el Camino de la Palabra',
    'Radio Mi Capa',
    'Iglesia Comayagua',
    'Iglesia Cristiana Honduras',
    'Radio cristiana en vivo',
    'Predicaciones cristianas',
  ],
  authors: [{ name: 'MICAPA' }],
  openGraph: {
    title: 'MICAPA | Ministerio el Camino de la Palabra',
    description: 'Comunidad de fe, esperanza y adoración en Comayagua, Honduras. Escucha Radio Mi Capa 24/7.',
    url: 'https://micapa.net',
    siteName: 'MICAPA',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 800,
        alt: 'Logo Oficial MICAPA',
      },
    ],
    locale: 'es_HN',
    type: 'website',
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

import { getWeeklyActivities } from '@/lib/data';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const activities = getWeeklyActivities();

  return (
    <html lang="es" className={poppins.variable}>
      <body className="antialiased font-sans bg-brand-cream text-brand-dark min-h-screen">
        <AudioPlayerProvider>
          <MainLayout activities={activities}>{children}</MainLayout>
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
