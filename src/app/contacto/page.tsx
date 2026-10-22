import React from 'react';
import ContactMapSection from '@/components/home/ContactMapSection';
import { getSettings } from '@/lib/data';
import PageHeaderBanner from '@/components/common/PageHeaderBanner';

export const metadata = {
  title: 'Contacto y Ubicación | MICAPA',
  description: 'Comunícate con la iglesia cristiana MICAPA en Comayagua, Honduras. Peticiones de oración, consejería y horarios.',
};

export const dynamic = 'force-dynamic';

export default function ContactoPage() {
  const settings = getSettings();

  const bgImage =
    settings.contacto_hero_image ||
    'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="space-y-8">
      <PageHeaderBanner
        title="Contacto y Peticiones de Oración"
        subtitle="Escríbenos, llámanos o visítanos en Comayagua. Toda la congregación se une en oración por tus necesidades."
        bgImage={bgImage}
        alt="Contacto y Peticiones de Oración MICAPA"
      />

      <div className="pb-12">
        <ContactMapSection settings={settings} />
      </div>
    </div>
  );
}
