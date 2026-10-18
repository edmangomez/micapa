import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import RadioPlayerSection from '@/components/home/RadioPlayerSection';
import PastorThoughtSection from '@/components/home/PastorThoughtSection';
import WeeklyActivitiesSection from '@/components/home/WeeklyActivitiesSection';
import EventsSection from '@/components/home/EventsSection';
import OfficialChannelsSection from '@/components/home/OfficialChannelsSection';
import ContactMapSection from '@/components/home/ContactMapSection';
import {
  getSettings,
  getFeaturedThought,
  getRecentThoughts,
  getWeeklyActivities,
  getUpcomingEvents,
} from '@/lib/data';

// Forzar renderizado dinámico en servidor para reflejar cambios del panel
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const settings = getSettings();
  const featuredThought = getFeaturedThought();
  const recentThoughts = getRecentThoughts(6);
  const activities = getWeeklyActivities();
  const events = getUpcomingEvents(3);

  return (
    <div className="flex flex-col gap-0">
      {/* 1. Hero Principal */}
      <HeroSection settings={settings} activities={activities} />

      {/* 2. Sección Destacada Radio Mi Capa */}
      <RadioPlayerSection />

      {/* 3. Reflexiones Bíblicas */}
      <PastorThoughtSection featured={featuredThought} recent={recentThoughts} />

      {/* 4. Actividades Semanales */}
      <WeeklyActivitiesSection activities={activities} />

      {/* 5. Próximos Eventos */}
      <EventsSection events={events} />

      {/* 6. Canales Oficiales y Redes */}
      <OfficialChannelsSection settings={settings} />

      {/* 8. Contacto y Ubicación */}
      <ContactMapSection settings={settings} />
    </div>
  );
}
