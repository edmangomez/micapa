import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import { PastorThought } from '@/lib/types';
import { Quote, Calendar, User, ArrowLeft, Share2, MessageCircle } from 'lucide-react';
import { FacebookIcon } from '@/components/Icons';

import ShareButtons from '@/components/ShareButtons';

export const dynamic = 'force-dynamic';

export default async function DetalleMensajePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thought = db.prepare(`
    SELECT p.*, COALESCE(p.pastor_photo, a.photo_url, '/images/logo.png') as pastor_photo, a.role as author_role
    FROM pastor_thoughts p
    LEFT JOIN thought_authors a ON p.author = a.name
    WHERE p.id = ?
  `).get(id) as PastorThought | undefined;

  if (!thought) {
    notFound();
  }

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Link
        href="/mensajes"
        className="inline-flex items-center gap-2 text-xs font-bold text-brand-blue hover:text-brand-blue-hover"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a todas las reflexiones</span>
      </Link>

      <article className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-border/60 shadow-card space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <span className="px-3.5 py-1 rounded-full bg-brand-gold-light text-brand-gold-hover text-xs font-bold uppercase tracking-wider">
            {thought.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(thought.created_at).toLocaleDateString('es-HN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark leading-tight break-words">
          {thought.title}
        </h1>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-brand-cream border border-brand-border/40">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-blue-light text-brand-blue font-bold flex items-center justify-center text-lg border-2 border-brand-blue/20 flex-shrink-0">
            <Image
              src={thought.pastor_photo || '/images/logo.png'}
              alt={thought.author}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-brand-dark break-words">{thought.author}</h3>
            <p className="text-xs text-brand-muted truncate">MICAPA - Comayagua, Honduras</p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none text-brand-charcoal leading-relaxed whitespace-pre-line text-base sm:text-lg break-words">
          {thought.content}
        </div>

        {/* Compartir reflexión */}
        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-brand-gold" />
            <span>Compartir esta reflexión:</span>
          </span>

          <ShareButtons title={thought.title} summary={thought.excerpt || thought.content} />
        </div>
      </article>
    </div>
  );
}
