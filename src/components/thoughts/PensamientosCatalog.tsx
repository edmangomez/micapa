'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PastorThought } from '@/lib/types';
import {
  Quote,
  Calendar,
  User,
  ArrowRight,
  Search,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  Share2,
} from 'lucide-react';

export default function PensamientosCatalog({
  initialThoughts,
}: {
  initialThoughts: PastorThought[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Extraer categorías únicas disponibles
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialThoughts.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ['Todas', ...Array.from(set)];
  }, [initialThoughts]);

  // Filtrado reactivo
  const filtered = useMemo(() => {
    return initialThoughts.filter((t) => {
      const matchSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'Todas' ||
        t.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [initialThoughts, searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  return (
    <div className="space-y-8">
      {/* Controles de Búsqueda y Categorías */}
      <div className="bg-white rounded-3xl p-6 border border-brand-border/80 space-y-5">
        {/* Barra de Búsqueda */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por tema, cita bíblica, palabra clave o autor..."
            className="w-full pl-12 pr-10 py-3 rounded-full border border-brand-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-brand-cream/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Píldoras de Categorías */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-brand-blue text-white'
                  : 'bg-brand-cream text-brand-charcoal hover:bg-gray-100'
              }`}
            >
              {cat === 'Todas' ? 'Todas las Categorías' : cat}
            </button>
          ))}
        </div>

        {/* Resumen de resultados */}
        <div className="text-center text-xs text-brand-muted pt-1">
          <span>
            Mostrando <strong>{filtered.length}</strong> {filtered.length === 1 ? 'reflexión' : 'reflexiones'}
            {selectedCategory !== 'Todas' && ` en la categoría "${selectedCategory}"`}
            {searchQuery && ` que coinciden con "${searchQuery}"`}
          </span>
        </div>
      </div>

      {/* Grid de pensamientos */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-brand-border/60 max-w-xl mx-auto p-8 space-y-3">
          <Quote className="w-10 h-10 text-brand-gold mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-brand-dark">No se encontraron reflexiones</h3>
          <p className="text-xs text-brand-muted">
            Intenta con otro término de búsqueda o selecciona otra categoría.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Todas');
              setCurrentPage(1);
            }}
            className="text-xs text-brand-blue font-bold hover:underline pt-2 block mx-auto"
          >
            Ver todas las reflexiones
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginated.map((thought) => (
              <article
                key={thought.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border/80 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-brand-gold-light text-brand-gold-hover text-xs font-semibold">
                      {thought.category}
                    </span>
                    <span className="text-xs text-brand-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-brand-gold" />
                      {new Date(thought.created_at).toLocaleDateString('es-HN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-brand-dark mb-3 leading-snug break-words">
                    <Link
                      href={`/mensajes/${thought.id}`}
                      className="hover:text-brand-blue transition-colors line-clamp-2"
                    >
                      {thought.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-brand-muted line-clamp-4 leading-relaxed mb-6 italic break-words">
                    "{thought.content}"
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold text-xs flex-shrink-0 border border-brand-blue/20">
                      <Image
                        src={thought.pastor_photo || '/images/logo.png'}
                        alt={thought.author}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-semibold text-brand-charcoal truncate">
                      {thought.author}
                    </span>
                  </div>

                  <Link
                    href={`/mensajes/${thought.id}`}
                    className="text-xs font-bold text-brand-blue hover:text-brand-blue-hover flex items-center gap-1 group shrink-0"
                  >
                    <span>Leer completo</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-3xl p-5 border border-brand-border/80">
              <span className="text-xs text-brand-muted font-medium">
                Página <strong className="text-brand-dark">{currentPage}</strong> de{' '}
                <strong className="text-brand-dark">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-brand-dark hover:bg-brand-cream disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-brand-dark hover:bg-brand-cream disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
