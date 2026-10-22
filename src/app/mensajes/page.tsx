import React from 'react';
import { getAllThoughts, getSettings } from '@/lib/data';
import PensamientosCatalog from '@/components/thoughts/PensamientosCatalog';
import PageHeaderBanner from '@/components/common/PageHeaderBanner';

export const metadata = {
  title: 'Reflexiones Bíblicas | MICAPA',
  description: 'Reflexiones y mensajes bíblicos pastorales de la iglesia MICAPA en Comayagua.',
};

export const dynamic = 'force-dynamic';

export default function MensajesPage() {
  const thoughts = getAllThoughts();
  const settings = getSettings();

  const bgImage =
    settings.mensajes_hero_image ||
    'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="space-y-12">
      <PageHeaderBanner
        title="Reflexiones Bíblicas"
        subtitle="Reflexiones y meditaciones fundamentadas en la Palabra viva de Dios para fortalecer tu fe y guiar tus decisiones."
        bgImage={bgImage}
        alt="Reflexiones Bíblicas MICAPA"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <PensamientosCatalog initialThoughts={thoughts} />
      </div>
    </div>
  );
}
