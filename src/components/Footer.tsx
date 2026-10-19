'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Radio, Heart, ArrowUp, Calendar } from 'lucide-react';
import { FacebookIcon, YouTubeIcon, InstagramIcon } from '@/components/Icons';
import { WeeklyActivity } from '@/lib/types';

export default function Footer({ initialActivities = [] }: { initialActivities?: WeeklyActivity[] }) {
  const [activities, setActivities] = useState<WeeklyActivity[]>(initialActivities);

  useEffect(() => {
    fetch('/api/activities')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setActivities(data);
        }
      })
      .catch((err) => console.error('Error fetching activities for footer:', err));
  }, []);

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12">
          {/* Columna 1: Identidad y Misión */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-white/10 p-1.5 rounded-2xl">
                <Image
                  src="/images/logo.png"
                  alt="MICAPA Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">MICAPA</h3>
                <p className="text-xs text-brand-gold font-medium">
                  Ministerio el Camino de la Palabra
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Una iglesia cristiana en Comayagua dedicada a predicar el evangelio de Jesucristo, edificar familias sólidas y guiar a cada persona por el camino de la vida.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/micapacomayagua"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-brand-blue flex items-center justify-center text-white transition-colors"
                title="Facebook Oficial"
                aria-label="Facebook Oficial de MICAPA"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/micapacomayagua"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-pink-600 flex items-center justify-center text-white transition-colors"
                title="Instagram Oficial"
                aria-label="Instagram Oficial de MICAPA"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@radiomicapa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                title="YouTube"
                aria-label="Canal de YouTube de Radio Mi Capa"
              >
                <YouTubeIcon className="w-5 h-5" />
              </a>
              <a
                href="https://radio.micapa.net"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-brand-gold flex items-center justify-center text-white transition-colors"
                title="Radio Mi Capa • La Radio del Camino: Conectándote Con El Cielo"
                aria-label="Radio Mi Capa en vivo"
              >
                <Radio className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-base font-semibold text-brand-gold mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-white transition-colors">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/mensajes" className="hover:text-white transition-colors">
                  Reflexiones Bíblicas
                </Link>
              </li>
              <li>
                <Link href="/actividades" className="hover:text-white transition-colors">
                  Actividades Semanales
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="hover:text-white transition-colors">
                  Próximos Eventos
                </Link>
              </li>
              <li>
                <Link href="/radio" className="hover:text-white transition-colors">
                  Radio en Vivo
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contacto y Oración
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Horarios de Servicios */}
          <div>
            <h4 className="text-base font-semibold text-brand-gold mb-4">
              Horarios de reuniones
            </h4>
            <ul className="space-y-3.5">
              {activities.length > 0 ? (
                activities.slice(0, 6).map((act) => (
                  <li key={act.id} className="pb-2.5">
                    <div className="flex items-center justify-between text-sm gap-2">
                      <span className="font-semibold text-white">
                        {act.day_name}
                      </span>
                      <span className="text-amber-400 font-semibold text-xs whitespace-nowrap shrink-0">
                        {act.start_time}
                        {act.end_time ? ` - ${act.end_time}` : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1 leading-snug">
                      {act.title}
                    </p>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">Cargando horarios oficiales...</li>
              )}
            </ul>
            <div className="pt-2">
              <Link
                href="/actividades"
                className="inline-flex items-center gap-1.5 text-sm text-brand-blue-light hover:text-white font-semibold transition-colors group"
              >
                <span>Ver todas las actividades</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>

          {/* Columna 4: Contacto Oficial */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-brand-gold mb-4">
              Contacto y sede
            </h4>
            <div className="flex items-start gap-3 text-sm text-gray-300">
              <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-medium block">El Camino de la palabra</span>
                <span className="text-gray-300 text-sm block mt-0.5">Calle 2 NO, Bo. El INVA, Comayagua, Honduras</span>
                <span className="text-brand-gold text-sm block mt-0.5 font-medium">Plus Code: F957+3XR</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span>+504 2772-0872</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span>micapacomayagua@gmail.com</span>
            </div>
            <div className="pt-2">
              <a
                href="https://radio.micapa.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue-hover px-4 py-2 rounded-full transition-colors"
              >
                <Radio className="w-4 h-4" />
                <span>Web Oficial de Radio: radio.micapa.net</span>
              </a>
            </div>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} MICAPA - Ministerio el Camino de la Palabra. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-gray-200 transition-colors">
              Panel Administrativo
            </Link>
            <span>•</span>
            <span>Comayagua, Honduras</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
