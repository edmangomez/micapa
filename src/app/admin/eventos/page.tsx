'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ChurchEvent } from '@/lib/types';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Loader2,
  X,
  Check,
  Upload,
  Archive,
  ArchiveRestore,
  CheckCircle2,
  Search,
  Sparkles,
  Layers,
} from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminEventosPage() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChurchEvent | null>(null);
  const [saving, setSaving] = useState(false);

  // Status and search filter states
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusChangingId, setStatusChangingId] = useState<number | null>(null);

  // Custom Delete Modal states
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('6:00 PM');
  const [location, setLocation] = useState('Santuario Principal MICAPA');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getTodayHonduras = () => {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Tegucigalpa' }).format(new Date());
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/events?status=all');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) {
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, saving]);

  // Contadores por estado
  const counts = useMemo(() => {
    return {
      all: events.length,
      published: events.filter((e) => e.status === 'published').length,
      draft: events.filter((e) => e.status === 'draft').length,
      archived: events.filter((e) => e.status === 'archived').length,
    };
  }, [events]);

  // Eventos filtrados por pestaña y búsqueda
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (activeTab !== 'all' && e.status !== activeTab) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (e.title || '').toLowerCase().includes(q);
        const matchLocation = (e.location || '').toLowerCase().includes(q);
        const matchDesc = (e.description || '').toLowerCase().includes(q);
        if (!matchTitle && !matchLocation && !matchDesc) return false;
      }
      return true;
    });
  }, [events, activeTab, searchQuery]);

  const handleQuickStatusChange = async (
    event: ChurchEvent,
    newStatus: 'published' | 'draft' | 'archived'
  ) => {
    try {
      setStatusChangingId(event.id);
      const payload = {
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
        image_url: event.image_url,
        registration_url: event.registration_url,
        status: newStatus,
        is_featured: event.is_featured === 1,
      };

      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await loadEvents();
      }
    } catch (err) {
      console.error('Error changing status:', err);
    } finally {
      setStatusChangingId(null);
    }
  };

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    const today = getTodayHonduras();
    if (newDate && newDate < today && status === 'published') {
      setStatus('archived');
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setDate(getTodayHonduras());
    setTime('6:00 PM');
    setLocation('Santuario Principal MICAPA');
    setDescription('');
    setImageUrl('');
    setStatus(activeTab === 'draft' ? 'draft' : 'published');
    setIsFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (item: ChurchEvent) => {
    setEditingItem(item);
    setTitle(item.title);
    setDate(item.date);
    setTime(item.time);
    setLocation(item.location);
    setDescription(item.description);
    setImageUrl(item.image_url || '');
    setStatus(item.status);
    setIsFeatured(item.is_featured === 1);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      }
    } catch (err) {
      console.error('Error subiendo afiche', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const today = getTodayHonduras();
      const effectiveStatus = date < today && status === 'published' ? 'archived' : status;

      const payload = {
        title,
        date,
        time,
        location,
        description,
        image_url: imageUrl,
        status: effectiveStatus,
        is_featured: isFeatured,
      };

      if (editingItem) {
        await fetch(`/api/events/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      loadEvents();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setDeleting(true);
      await fetch(`/api/events/${deleteTargetId}`, { method: 'DELETE' });
      setDeleteTargetId(null);
      loadEvents();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Eventos y Convocatorias</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Anuncia conferencias, congresos y actividades especiales de la congregación.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-white text-xs font-bold transition-all shadow-highlight"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar Evento</span>
        </button>
      </div>

      {/* Submenú de Estados y Filtro de Búsqueda */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-gray-200 shadow-xs">
        {/* Pestañas de estado */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'all'
                ? 'bg-brand-blue text-white shadow-soft'
                : 'bg-white border border-gray-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Todos</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('published')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'published'
                ? 'bg-emerald-700 text-white shadow-soft'
                : 'bg-white border border-gray-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Publicados</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'published' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {counts.published}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('draft')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'draft'
                ? 'bg-amber-700 text-white shadow-soft'
                : 'bg-white border border-gray-200 text-slate-600 hover:bg-amber-50 hover:text-amber-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Borradores</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'draft' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
              }`}
            >
              {counts.draft}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('archived')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'archived'
                ? 'bg-slate-800 text-white shadow-soft'
                : 'bg-white border border-gray-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archivados</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'archived' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {counts.archived}
            </span>
          </button>
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título o lugar..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-gold bg-slate-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tarjetas de Eventos */}
      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 text-brand-gold animate-spin mx-auto" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-gray-200 shadow-sm max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            {activeTab === 'archived' ? (
              <Archive className="w-6 h-6" />
            ) : activeTab === 'draft' ? (
              <Calendar className="w-6 h-6" />
            ) : (
              <Layers className="w-6 h-6" />
            )}
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchQuery
              ? 'No se encontraron eventos'
              : activeTab === 'archived'
              ? 'No hay eventos archivados'
              : activeTab === 'draft'
              ? 'No tienes borradores guardados'
              : activeTab === 'published'
              ? 'No hay eventos publicados'
              : 'No hay eventos registrados'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {searchQuery
              ? `No encontramos coincidencias para "${searchQuery}". Intenta con otro término.`
              : activeTab === 'archived'
              ? 'Los eventos cuya fecha de realización pase se archivarán aquí automáticamente, o puedes archivar manualmente los que concluyan.'
              : activeTab === 'draft'
              ? 'Usa borradores para redactar y afinar detalles antes de publicar el evento ante la congregación.'
              : activeTab === 'published'
              ? 'No hay eventos visibles en la cartelera pública. Haz clic en "+ Publicar Evento" para agendar el próximo.'
              : 'Empieza agendando conferencias, cultos especiales o congresos.'}
          </p>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors mt-2"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar búsqueda</span>
            </button>
          ) : (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-white text-xs font-bold transition-all shadow-xs mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Crear Evento</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const isArchived = event.status === 'archived';
            const isDraft = event.status === 'draft';
            const isPublished = event.status === 'published';
            const isChanging = statusChangingId === event.id;

            return (
              <div
                key={event.id}
                className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                  isArchived
                    ? 'bg-slate-50/80 border-slate-200 text-slate-600'
                    : isDraft
                    ? 'bg-amber-50/20 border-amber-200/80 shadow-xs'
                    : 'bg-white border-gray-200 shadow-sm hover:shadow-card hover:border-emerald-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      {isPublished && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold tracking-wide flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Publicado
                        </span>
                      )}
                      {isDraft && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold tracking-wide flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Borrador
                        </span>
                      )}
                      {isArchived && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 border border-slate-300 text-[11px] font-bold tracking-wide flex items-center gap-1.5">
                          <Archive className="w-3 h-3 text-slate-500" />
                          Archivado
                        </span>
                      )}
                      {event.is_featured === 1 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                          ★ Destacado
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full shrink-0">
                      {event.date} • {event.time}
                    </span>
                  </div>

                  <h3
                    className={`text-base font-bold mb-2 ${
                      isArchived ? 'text-slate-700' : 'text-slate-800'
                    }`}
                  >
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1 min-w-0 max-w-[130px] sm:max-w-[150px]">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{event.location}</span>
                  </div>

                  {/* Acciones Rápidas y de Edición */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Botón rápido de cambio de estado */}
                    {isPublished && (
                      <button
                        disabled={isChanging}
                        onClick={() => handleQuickStatusChange(event, 'archived')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-gray-200 transition-colors"
                        title="Archivar este evento"
                      >
                        {isChanging ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Archive className="w-3 h-3" />
                        )}
                        <span>Archivar</span>
                      </button>
                    )}

                    {isDraft && (
                      <button
                        disabled={isChanging}
                        onClick={() => handleQuickStatusChange(event, 'published')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                        title="Publicar en cartelera"
                      >
                        {isChanging ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        )}
                        <span>Publicar</span>
                      </button>
                    )}

                    {isArchived && (
                      <button
                        disabled={isChanging}
                        onClick={() => handleQuickStatusChange(event, 'published')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-brand-blue hover:bg-blue-50 border border-blue-200 transition-colors"
                        title="Reactivar a Publicado"
                      >
                        {isChanging ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <ArchiveRestore className="w-3 h-3" />
                        )}
                        <span>Reactivar</span>
                      </button>
                    )}

                    <button
                      onClick={() => openEditModal(event)}
                      className="p-1.5 text-slate-600 hover:text-brand-blue hover:bg-slate-50 rounded-lg transition-colors"
                      title="Editar evento"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(event.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar evento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {editingItem ? 'Editar Evento' : 'Publicar Nuevo Evento'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Evento *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Gran Conferencia de Familias 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                  {date && date < getTodayHonduras() && (
                    <p className="text-[11px] text-amber-700 mt-1 font-medium">
                      ⚠️ Esta fecha ya pasó.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hora *</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Ej: 6:00 PM"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lugar o Sede</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej: Santuario Principal MICAPA"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción del Evento *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre expositores, dinámicas o programa..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Afiche o Imagen Promocional (Opcional)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-gold-light file:text-brand-gold-hover hover:file:bg-amber-100 cursor-pointer"
                  />
                  {uploading && <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />}
                  {imageUrl && <span className="text-xs text-emerald-600 font-bold">✓ Cargada</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estado</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  >
                    <option value="published">Publicado</option>
                    <option value="draft">Borrador</option>
                    <option value="archived">Finalizado / Archivado</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    ⏰ <strong>Auto-archivado automático:</strong> Al llegar la fecha prevista, al día siguiente el evento pasa automáticamente a <em>Finalizado / Archivado</em> sin intervención manual.
                  </p>
                  {date && date < getTodayHonduras() && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-1.5 font-medium">
                      ℹ️ La fecha seleccionada ({date}) ya pasó. El evento se guardará como <strong>Finalizado / Archivado</strong>.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featuredEventToggle"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-gold focus:ring-brand-gold"
                  />
                  <label htmlFor="featuredEventToggle" className="text-xs font-medium text-slate-700">
                    Destacar en la página de inicio
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-white text-xs font-bold transition-all shadow-highlight flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingItem ? 'Guardar Cambios' : 'Publicar Evento'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="¿Eliminar este evento?"
        description="Esta convocatoria o actividad se eliminará del calendario de eventos oficiales."
        confirmText="Sí, Eliminar"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
