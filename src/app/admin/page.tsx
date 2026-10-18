'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Quote,
  Calendar,
  Sparkles,
  Radio,
  ExternalLink,
  Plus,
  ArrowRight,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Users,
  Loader2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Reflexiones Bíblicas',
      count: stats?.thoughts ?? 0,
      icon: Quote,
      color: 'bg-amber-50 text-amber-600',
      href: '/admin/pensamientos',
      btnText: 'Gestionar reflexiones',
    },
    {
      title: 'Actividades de la Semana',
      count: stats?.activities ?? 0,
      icon: Calendar,
      color: 'bg-emerald-50 text-emerald-600',
      href: '/admin/actividades',
      btnText: 'Configurar horarios',
    },
    {
      title: 'Eventos Especiales',
      count: stats?.events ?? 0,
      icon: Sparkles,
      color: 'bg-blue-50 text-blue-600',
      href: '/admin/eventos',
      btnText: 'Publicar eventos',
    },
    {
      title: 'Equipo y Usuarios',
      count: stats?.users ?? 0,
      icon: Users,
      color: 'bg-rose-50 text-rose-600',
      href: '/admin/usuarios',
      btnText: 'Gestionar accesos',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Saludo y Resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Panel de Control Pastoral
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            MICAPA (Ministerio el Camino de la Palabra) • Comayagua, Honduras
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/pensamientos?nuevo=true"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all shadow-soft"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Reflexión</span>
          </Link>
          <Link
            href="/admin/eventos?nuevo=true"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-white text-xs font-bold transition-all shadow-highlight"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Evento</span>
          </Link>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-slate-800">{card.count}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-700 leading-snug">{card.title}</h3>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-100">
                <Link
                  href={card.href}
                  className="text-xs font-bold text-brand-blue hover:text-brand-blue-hover flex items-center justify-between"
                >
                  <span>{card.btnText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tarjeta de Radio Mi Capa y Configuración General */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-brand-gold" />
              <h2 className="text-base font-bold text-slate-800">Emisora Radio Mi Capa</h2>
            </div>
            <a
              href="https://radio.micapa.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-brand-blue flex items-center gap-1 hover:underline"
            >
              <span>Abrir radio.micapa.net</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            La transmisión en vivo está activa las 24 horas a través de Icecast en{' '}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 text-xs">
              https://hoststream.micapa.net/listen/radiomicapa/radio.mp3
            </code>
            . Las canciones y el estado se sincronizan automáticamente con AzuraCast.
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Frecuencia digital:</span>
              <span className="font-bold text-slate-800">Online 192 kbps MP3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Plataforma conectada:</span>
              <span className="font-bold text-emerald-600">Enlazada a AzuraCast en vivo</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-slate-800">Sede Comayagua</h2>
            <Link
              href="/admin/configuracion"
              className="text-xs font-bold text-brand-blue hover:underline"
            >
              Editar datos
            </Link>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
              <span>Bo. El INVA Calle 2 NO, Comayagua, Honduras</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span>+504 2772-0872</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span>micapacomayagua@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
