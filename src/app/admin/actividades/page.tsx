'use client';

import React, { useEffect, useState } from 'react';
import { WeeklyActivity } from '@/lib/types';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, Loader2, X, Check } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminActividadesPage() {
  const [activities, setActivities] = useState<WeeklyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WeeklyActivity | null>(null);
  const [saving, setSaving] = useState(false);

  // Custom Delete Modal states
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form states
  const [dayOfWeek, setDayOfWeek] = useState(7);
  const [dayName, setDayName] = useState('Domingo');
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('9:00 AM');
  const [endTime, setEndTime] = useState('11:30 AM');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Santuario Principal MICAPA');
  const [isActive, setIsActive] = useState(true);

  const daysMapping = [
    { num: 1, name: 'Lunes' },
    { num: 2, name: 'Martes' },
    { num: 3, name: 'Miércoles' },
    { num: 4, name: 'Jueves' },
    { num: 5, name: 'Viernes' },
    { num: 6, name: 'Sábado' },
    { num: 7, name: 'Domingo' },
  ];

  const loadActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/activities');
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setDayOfWeek(7);
    setDayName('Domingo');
    setTitle('');
    setStartTime('9:00 AM');
    setEndTime('11:30 AM');
    setDescription('');
    setLocation('Santuario Principal MICAPA');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (item: WeeklyActivity) => {
    setEditingItem(item);
    setDayOfWeek(item.day_of_week);
    setDayName(item.day_name);
    setTitle(item.title);
    setStartTime(item.start_time);
    setEndTime(item.end_time || '');
    setDescription(item.description || '');
    setLocation(item.location || 'Santuario Principal MICAPA');
    setIsActive(item.is_active === 1);
    setModalOpen(true);
  };

  const handleDayChange = (num: number) => {
    setDayOfWeek(num);
    const found = daysMapping.find((d) => d.num === num);
    if (found) setDayName(found.name);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        id: editingItem?.id,
        day_of_week: dayOfWeek,
        day_name: dayName,
        title,
        start_time: startTime,
        end_time: endTime,
        description,
        location,
        is_active: isActive,
      };

      if (editingItem) {
        await fetch('/api/activities', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      loadActivities();
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
      await fetch(`/api/activities?id=${deleteTargetId}`, { method: 'DELETE' });
      setDeleteTargetId(null);
      loadActivities();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Actividades Semanales</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configura los cultos y reuniones de lunes a domingo sin tocar código.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold transition-all shadow-soft"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Actividad</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-green-light text-brand-green text-[11px] font-bold uppercase tracking-wider">
                    {a.day_name}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    {a.start_time} {a.end_time ? `- ${a.end_time}` : ''}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800 mb-2">{a.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                  {a.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate max-w-[180px]">{a.location}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(a)}
                    className="p-1.5 text-slate-600 hover:text-brand-blue hover:bg-slate-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(a.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {editingItem ? 'Editar Actividad' : 'Nueva Actividad Semanal'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Día de la Semana *
                  </label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => handleDayChange(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                  >
                    {daysMapping.map((d) => (
                      <option key={d.num} value={d.num}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre del Servicio o Culto *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Culto de Oración e Intercesión"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hora de Inicio *
                  </label>
                  <input
                    type="text"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="Ej: 6:30 PM"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hora de Finalización (Opcional)
                  </label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="Ej: 8:00 PM"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ubicación o Salón
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej: Santuario Principal MICAPA"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción breve
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe el propósito de la reunión..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-green focus:ring-brand-green"
                />
                <label htmlFor="activeToggle" className="text-xs font-medium text-slate-700">
                  Actividad visible en la web
                </label>
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
                  className="px-6 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold transition-all shadow-soft flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingItem ? 'Guardar Cambios' : 'Añadir Actividad'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="¿Eliminar esta actividad?"
        description="Esta acción eliminará permanentemente la reunión de la agenda de la iglesia. No se puede deshacer."
        confirmText="Sí, Eliminar"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
