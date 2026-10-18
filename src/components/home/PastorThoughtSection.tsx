'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PastorThought } from '@/lib/types';
import { Quote, Share2, Check, ArrowRight, Heart, Calendar, User, Filter } from 'lucide-react';

export default function PastorThoughtSection({
  featured,
  recent,
}: {
  featured: PastorThought | null;
  recent: PastorThought[];
}) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const allThoughts = useMemo(() => {
    const list: PastorThought[] = [];
    if (featured) list.push(featured);
    recent.forEach((r) => {
      if (!list.some((item) => item.id === r.id)) {
        list.push(r);
      }
    });
    return list;
  }, [featured, recent]);

  // Extraer categorías dinámicas
  const categories = useMemo(() => {
    const set = new Set<string>();
    allThoughts.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ['Todas', ...Array.from(set)];
  }, [allThoughts]);

  // Filtrar según categoría seleccionada
  const filteredThoughts = useMemo(() => {
    if (selectedCategory === 'Todas') return allThoughts;
    return allThoughts.filter(
      (t) => t.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [allThoughts, selectedCategory]);

  if (allThoughts.length === 0) return null;

  const mainThought = filteredThoughts[0] || allThoughts[0];
  const otherThoughts = filteredThoughts.filter((t) => t.id !== mainThought?.id).slice(0, 2);

  const handleShare = (thought: PastorThought) => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/mensajes/${thought.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(thought.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <section className="py-20 bg-brand-cream-surface border-y border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de sección */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue-light text-brand-blue-dark text-xs font-semibold uppercase tracking-wider mb-2">
              <Quote className="w-3.5 h-3.5" />
              <span>Inspiración Pastoral</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
              Reflexiones Bíblicas
            </h2>
            <p className="text-brand-muted text-sm sm:text-base mt-2 max-w-xl">
              Palabras de aliento, fe y guía espiritual fundamentadas en las Sagradas Escrituras para tu caminar diario.
            </p>
          </div>

          <Link
            href="/mensajes"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-brand-blue-hover transition-colors group"
          >
            <span>Ver todas las reflexiones</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Filtro por Categorías en Portada */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-gray-200/60">
            <span className="text-xs font-bold text-brand-muted mr-1 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Filtrar por Tema:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-brand-blue text-white shadow-soft scale-105'
                    : 'bg-white text-brand-charcoal hover:bg-gray-100 border border-brand-border/60'
                }`}
              >
                {cat === 'Todas' ? 'Todas las Categorías' : cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Pensamiento Principal Destacado */}
          {mainThought && (
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-brand-border/60 shadow-card relative overflow-hidden">
              <div className="absolute top-6 right-6 text-brand-gold/20">
                <Quote className="w-24 h-24 rotate-180" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="px-3 py-1 rounded-full bg-brand-gold-light text-brand-gold-hover text-xs font-bold uppercase tracking-wider">
                    {mainThought.category}
                  </span>
                  <span className="text-xs text-brand-muted flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                    {new Date(mainThought.created_at).toLocaleDateString('es-HN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-brand-dark leading-snug break-words">
                  {mainThought.title}
                </h3>

                <p className="text-brand-charcoal text-base sm:text-lg leading-relaxed font-normal italic break-words">
                  "{mainThought.content}"
                </p>

                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-blue-light text-brand-blue font-bold flex items-center justify-center text-lg border-2 border-brand-blue/20 flex-shrink-0">
                      <Image
                        src={mainThought.pastor_photo || '/images/logo.png'}
                        alt={mainThought.author}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-brand-dark truncate">{mainThought.author}</h4>
                      <p className="text-xs text-brand-muted truncate">MICAPA - Comayagua, Honduras</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleShare(mainThought)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-cream hover:bg-gray-100 text-brand-dark text-xs font-semibold border border-brand-border/60 transition-colors"
                      title="Copiar enlace"
                    >
                      {copiedId === mainThought.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5 text-brand-muted" />
                          <span>Compartir</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/mensajes/${mainThought.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-soft transition-colors"
                    >
                      <span>Leer reflexión</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pensamientos Secundarios */}
          <div className="lg:col-span-5 space-y-6">
            {otherThoughts.map((thought) => (
              <div
                key={thought.id}
                className="bg-white rounded-3xl p-6 border border-brand-border/60 shadow-sm hover:shadow-card transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-brand-blue uppercase tracking-wider bg-brand-blue-light px-2.5 py-0.5 rounded-full">
                    {thought.category}
                  </span>
                  <span className="text-xs text-brand-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-brand-gold" />
                    {new Date(thought.created_at).toLocaleDateString('es-HN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-brand-dark mb-2 leading-tight break-words">
                  <Link href={`/mensajes/${thought.id}`} className="hover:text-brand-blue transition-colors">
                    {thought.title}
                  </Link>
                </h4>

                <p className="text-xs sm:text-sm text-brand-muted line-clamp-3 leading-relaxed mb-4 break-words">
                  {thought.excerpt || thought.content}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold text-[10px] flex-shrink-0 border border-brand-blue/20">
                      <Image
                        src={thought.pastor_photo || '/images/logo.png'}
                        alt={thought.author}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <span className="text-brand-charcoal font-medium truncate">
                      {thought.author}
                    </span>
                  </div>

                  <Link
                    href={`/mensajes/${thought.id}`}
                    className="font-bold text-brand-blue hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Leer</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-r from-brand-blue to-sky-600 rounded-3xl p-6 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
              <div>
                <h4 className="font-bold text-base">¿Tienes una petición de oración?</h4>
                <p className="text-xs text-white/80 mt-0.5">Nuestro equipo pastoral y la iglesia están orando por ti.</p>
              </div>
              <Link
                href="/contacto"
                className="px-5 py-2.5 rounded-full bg-white text-brand-blue font-bold text-xs hover:bg-gray-100 transition-colors flex-shrink-0 shadow-sm"
              >
                Escríbenos hoy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
