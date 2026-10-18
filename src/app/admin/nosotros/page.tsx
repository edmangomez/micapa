'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  Shield,
  Heart,
  BookOpen,
  Users,
  Sparkles,
  Anchor,
  Flame,
  Cross,
  Plus,
  Trash2,
  Save,
  Check,
  ExternalLink,
  Loader2,
  Layers,
  ArrowUp,
  ArrowDown,
  Info,
} from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';
import { AboutValue } from '@/lib/types';

const AVAILABLE_ICONS = [
  { id: 'BookOpen', label: 'Biblia / Palabra', icon: BookOpen },
  { id: 'Heart', label: 'Amor / Familia', icon: Heart },
  { id: 'Users', label: 'Comunidad / Hermanos', icon: Users },
  { id: 'Compass', label: 'Brújula / Misión / Alcance', icon: Compass },
  { id: 'Shield', label: 'Escudo / Fe / Protección', icon: Shield },
  { id: 'Sparkles', label: 'Gracia / Avivamiento', icon: Sparkles },
  { id: 'Anchor', label: 'Ancla / Esperanza', icon: Anchor },
  { id: 'Flame', label: 'Fuego / Espíritu Santo', icon: Flame },
];

export default function AdminNosotrosPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'mision-vision' | 'valores' | 'hero' | 'cta'>('mision-vision');

  // Modal para eliminar valor
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [valueToDelete, setValueToDelete] = useState<string | null>(null);

  // Estados del formulario
  const [heroBadge, setHeroBadge] = useState('Nuestra Identidad');
  const [heroTitle, setHeroTitle] = useState('Quiénes Somos en MICAPA');
  const [heroSubtitle, setHeroSubtitle] = useState('Ministerio el Camino de la Palabra: una familia de fe plantada en Comayagua para proclamar la verdad que liberta y transforma.');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1920&q=80');

  const [missionTitle, setMissionTitle] = useState('Nuestra Misión');
  const [missionText, setMissionText] = useState('Guiar a personas de toda edad hacia una relación viva y salvadora con Jesucristo a través del ministerio de la Palabra, discipulando a cada creyente para vivir en santidad, servir con amor y reflejar la gloria de Dios en su hogar y comunidad.');

  const [visionTitle, setVisionTitle] = useState('Nuestra Visión');
  const [visionText, setVisionText] = useState('Ser una congregación referente de avivamiento espiritual y transformación social en Comayagua y Honduras, expandiendo el Reino de Dios a través de vidas restauradas, familias sólidas y ministerios multiplicadores de impacto global.');

  const [valuesTitle, setValuesTitle] = useState('Nuestros Valores Fundamentales');
  const [valuesSubtitle, setValuesSubtitle] = useState('Los pilares que sostienen cada ministerio y actividad en MICAPA.');
  const [values, setValues] = useState<AboutValue[]>([]);

  const [ctaTitle, setCtaTitle] = useState('¡Nos encantaría conocerte!');
  const [ctaSubtitle, setCtaSubtitle] = useState('Acompáñanos en nuestro Culto General o en cualquiera de nuestras reuniones de la semana en Comayagua.');

  // Cargar configuración existente
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.about_hero_badge) setHeroBadge(data.about_hero_badge);
          if (data.about_hero_title) setHeroTitle(data.about_hero_title);
          if (data.about_hero_subtitle) setHeroSubtitle(data.about_hero_subtitle);
          if (data.about_hero_image) setHeroImage(data.about_hero_image);

          if (data.about_mission_title) setMissionTitle(data.about_mission_title);
          if (data.about_mission_text) setMissionText(data.about_mission_text);

          if (data.about_vision_title) setVisionTitle(data.about_vision_title);
          if (data.about_vision_text) setVisionText(data.about_vision_text);

          if (data.about_values_title) setValuesTitle(data.about_values_title);
          if (data.about_values_subtitle) setValuesSubtitle(data.about_values_subtitle);

          if (data.about_values_json) {
            try {
              const parsed = JSON.parse(data.about_values_json);
              if (Array.isArray(parsed)) {
                setValues(parsed);
              }
            } catch (e) {
              console.error('Error parsing values JSON', e);
            }
          }

          if (data.about_cta_title) setCtaTitle(data.about_cta_title);
          if (data.about_cta_subtitle) setCtaSubtitle(data.about_cta_subtitle);
        }
      } catch (err) {
        console.error('Error loading about settings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Agregar nuevo valor
  const handleAddValue = () => {
    const newVal: AboutValue = {
      id: Date.now().toString(),
      title: 'Nuevo Valor',
      desc: 'Describe el principio o convicción bíblica que guía a la congregación.',
      icon: 'BookOpen',
    };
    setValues([...values, newVal]);
  };

  // Modificar valor
  const handleUpdateValue = (id: string, field: keyof AboutValue, val: string) => {
    setValues(values.map((v) => (v.id === id ? { ...v, [field]: val } : v)));
  };

  // Confirmar eliminación de valor
  const handleConfirmDelete = () => {
    if (valueToDelete) {
      setValues(values.filter((v) => v.id !== valueToDelete));
      setValueToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  // Mover valor arriba / abajo
  const handleMoveValue = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= values.length) return;
    const reordered = [...values];
    const temp = reordered[index];
    reordered[index] = reordered[newIdx];
    reordered[newIdx] = temp;
    setValues(reordered);
  };

  // Guardar todo
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const payload = {
        about_hero_badge: heroBadge,
        about_hero_title: heroTitle,
        about_hero_subtitle: heroSubtitle,
        about_hero_image: heroImage,
        about_mission_title: missionTitle,
        about_mission_text: missionText,
        about_vision_title: visionTitle,
        about_vision_text: visionText,
        about_values_title: valuesTitle,
        about_values_subtitle: valuesSubtitle,
        about_values_json: JSON.stringify(values),
        about_cta_title: ctaTitle,
        about_cta_subtitle: ctaSubtitle,
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        alert('Error al guardar los cambios de Nosotros.');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al intentar guardar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <p className="text-xs text-brand-muted font-medium">Cargando información de Nosotros...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-brand-blue mb-1">
            <Compass className="w-5 h-5 text-brand-gold" />
            <span className="text-xs font-bold uppercase tracking-wider">Identidad Institucional</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Administración de "Nosotros / Quiénes Somos"
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Edita de forma dinámica la misión, visión, valores fundamentales, encabezado y llamados a la acción de la iglesia.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/nosotros"
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 text-xs font-bold shadow-sm transition-colors"
          >
            <span>Ver Página Pública</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-soft transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">
            ¡Los cambios en la sección "Nosotros" se guardaron con éxito! Ya están disponibles en la web pública.
          </p>
        </div>
      )}

      {/* Tabs de Navegación */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('mision-vision')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'mision-vision'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4 text-brand-gold" />
          <span>Misión y Visión</span>
        </button>

        <button
          onClick={() => setActiveTab('valores')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'valores'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-brand-blue" />
          <span>Valores Fundamentales ({values.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'hero'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4 text-purple-600" />
          <span>Cabecera e Identidad</span>
        </button>

        <button
          onClick={() => setActiveTab('cta')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'cta'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4 text-emerald-600" />
          <span>Llamado a la Acción</span>
        </button>
      </div>

      {/* Contenido de Tab: Misión y Visión */}
      {activeTab === 'mision-vision' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tarjeta Edición Misión */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-brand-blue">
                <div className="w-10 h-10 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Nuestra Misión</h3>
                  <span className="text-xs text-slate-500">Propósito activo y razón de ser de la iglesia</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Título de la Misión
                </label>
                <input
                  type="text"
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Declaración de Misión
                </label>
                <textarea
                  rows={6}
                  value={missionText}
                  onChange={(e) => setMissionText(e.target.value)}
                  placeholder="Escribe la misión institucional..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue leading-relaxed"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {missionText.length} caracteres
                </span>
              </div>
            </div>

            {/* Tarjeta Edición Visión */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-brand-gold-hover">
                <div className="w-10 h-10 rounded-2xl bg-brand-gold-light text-brand-gold-hover flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Nuestra Visión</h3>
                  <span className="text-xs text-slate-500">Hacia dónde Dios guía el futuro del ministerio</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Título de la Visión
                </label>
                <input
                  type="text"
                  value={visionTitle}
                  onChange={(e) => setVisionTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Declaración de Visión
                </label>
                <textarea
                  rows={6}
                  value={visionText}
                  onChange={(e) => setVisionText(e.target.value)}
                  placeholder="Escribe la visión institucional..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue leading-relaxed"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {visionText.length} caracteres
                </span>
              </div>
            </div>
          </div>

          {/* Vista previa en tiempo real */}
          <div className="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-blue" />
                <span>Previsualización en la Web Pública</span>
              </span>
              <span className="text-xs text-slate-400">Reflejo exacto de las tarjetas públicas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-8 border border-brand-border/60 shadow-card">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mb-6">
                  <Compass className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark mb-3">{missionTitle || 'Nuestra Misión'}</h2>
                <p className="text-brand-muted text-sm sm:text-base leading-relaxed break-words">
                  {missionText || 'Sin texto de misión...'}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-brand-border/60 shadow-card">
                <div className="w-12 h-12 rounded-2xl bg-brand-gold-light text-brand-gold-hover flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark mb-3">{visionTitle || 'Nuestra Visión'}</h2>
                <p className="text-brand-muted text-sm sm:text-base leading-relaxed break-words">
                  {visionText || 'Sin texto de visión...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de Tab: Valores Fundamentales */}
      {activeTab === 'valores' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Encabezado de la sección de valores */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Encabezado de la Sección de Valores</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Título de la Sección
                </label>
                <input
                  type="text"
                  value={valuesTitle}
                  onChange={(e) => setValuesTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subtítulo Explicativo
                </label>
                <input
                  type="text"
                  value={valuesSubtitle}
                  onChange={(e) => setValuesSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>
          </div>

          {/* Listado dinámico de valores */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tarjetas de Valores</h3>
                <p className="text-xs text-slate-500">Puedes editar, cambiar el icono o añadir nuevos valores.</p>
              </div>

              <button
                type="button"
                onClick={handleAddValue}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-white text-xs font-bold shadow-soft transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Valor</span>
              </button>
            </div>

            {values.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300 p-8">
                <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No hay valores registrados.</p>
                <button
                  onClick={handleAddValue}
                  className="mt-3 text-xs font-bold text-brand-blue hover:underline"
                >
                  Agregar primer valor
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {values.map((v, idx) => {
                  const currentIconObj = AVAILABLE_ICONS.find((i) => i.id === v.icon) || AVAILABLE_ICONS[0];
                  const IconComp = currentIconObj.icon;

                  return (
                    <div
                      key={v.id}
                      className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:border-brand-blue/40 transition-colors space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                              Valor #{idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">{v.title}</h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleMoveValue(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-30"
                            title="Mover arriba"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveValue(idx, 'down')}
                            disabled={idx === values.length - 1}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-30"
                            title="Mover abajo"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setValueToDelete(v.id);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-600 transition-colors"
                            title="Eliminar este valor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        <div className="sm:col-span-8">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Título del Valor *
                          </label>
                          <input
                            type="text"
                            value={v.title}
                            onChange={(e) => handleUpdateValue(v.id, 'title', e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Icono Simbólico
                          </label>
                          <select
                            value={v.icon}
                            onChange={(e) => handleUpdateValue(v.id, 'icon', e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
                          >
                            {AVAILABLE_ICONS.map((ico) => (
                              <option key={ico.id} value={ico.id}>
                                {ico.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-12">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Descripción / Fundamento Bíblico *
                          </label>
                          <textarea
                            rows={3}
                            value={v.desc}
                            onChange={(e) => handleUpdateValue(v.id, 'desc', e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contenido de Tab: Hero e Identidad */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-slate-900">Cabecera de la Página Quiénes Somos</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Personaliza el texto de bienvenida y la imagen superior que ven los visitantes al entrar a /nosotros.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Insignia Superior (Badge)
              </label>
              <input
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                placeholder="Ej: Nuestra Identidad"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Título Principal
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Ej: Quiénes Somos en MICAPA"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subtítulo o Resumen Inspirador
              </label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Escribe la frase descriptiva..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                URL de Imagen de Fondo
              </label>
              <input
                type="url"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Puedes ingresar una URL de imagen o utilizar fotos locales como <code>/images/hero-bg.jpg</code>.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de Tab: Llamado a la Acción */}
      {activeTab === 'cta' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-slate-900">Bloque de Invitación al Final de la Página</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Personaliza el mensaje que invita a los visitantes a participar en los cultos y actividades.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Título del Bloque
              </label>
              <input
                type="text"
                value={ctaTitle}
                onChange={(e) => setCtaTitle(e.target.value)}
                placeholder="Ej: ¡Nos encantaría conocerte!"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mensaje de Invitación
              </label>
              <textarea
                rows={3}
                value={ctaSubtitle}
                onChange={(e) => setCtaSubtitle(e.target.value)}
                placeholder="Ej: Acompáñanos en nuestro Culto General..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Barra flotante inferior de guardado */}
      <div className="sticky bottom-6 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-gray-200 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-brand-blue" />
          <span>Los cambios realizados se aplicarán inmediatamente en la página pública de Quiénes Somos.</span>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-bold shadow-soft transition-all active:scale-95 disabled:opacity-50 flex-shrink-0"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar Todo</span>
            </>
          )}
        </button>
      </div>

      {/* Modal de confirmación para eliminar valor */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="¿Eliminar este valor fundamental?"
        description="Esta acción removerá esta tarjeta de la lista. Podrás guardar los cambios o cancelar."
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setValueToDelete(null);
        }}
      />
    </div>
  );
}
