'use client';

import React, { useEffect, useState } from 'react';
import { AdminAccount } from '@/lib/types';
import { Plus, Edit2, Trash2, Users, Shield, ShieldCheck, Mail, Lock, User, Loader2, X, Check, AlertCircle } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminAccount | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Custom Delete Modal states
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'editor'>('editor');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('editor');
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (item: AdminAccount) => {
    setEditingItem(item);
    setName(item.name);
    setEmail(item.email);
    setPassword(''); // Opcional al editar
    setRole(item.role);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSaving(true);

    try {
      const payload: any = {
        name,
        email,
        role,
      };

      if (password) {
        payload.password = password;
      }

      if (editingItem) {
        payload.id = editingItem.id;
        const res = await fetch('/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error actualizando usuario');
      } else {
        if (!password || password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error creando usuario');
      }

      setModalOpen(false);
      loadUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar usuario');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/users?id=${deleteTargetId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'No se pudo eliminar el usuario');
        return;
      }
      setDeleteTargetId(null);
      loadUsers();
    } catch (err: any) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Administra el equipo pastoral y colaboradores autorizados para gestionar la plataforma.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all shadow-soft"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Usuario</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 text-brand-blue animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      u.role === 'admin'
                        ? 'bg-brand-blue-light text-brand-blue'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {u.role === 'admin' ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Administrador</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-3.5 h-3.5" />
                        <span>Editor</span>
                      </>
                    )}
                  </span>
                  <span className="text-xs text-slate-400">ID #{u.id}</span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-brand-cream border border-brand-border/60 text-brand-blue flex items-center justify-center font-bold text-base">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-slate-800 truncate">{u.name}</h3>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{u.email}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-slate-400">
                <span>Registrado: {new Date(u.created_at).toLocaleDateString('es-HN')}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(u)}
                    className="p-1.5 text-slate-600 hover:text-brand-blue hover:bg-slate-50 rounded-lg transition-colors"
                    title="Editar usuario"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(u.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar usuario"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear / Editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-gray-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {editingItem ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Pastor Juan Pérez"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@micapa.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {editingItem ? 'Nueva Contraseña (dejar en blanco para conservar)' : 'Contraseña de Acceso *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required={!editingItem}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rol de Usuario</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="admin">Administrador (Control total y gestión de usuarios)</option>
                  <option value="editor">Editor (Gestión de contenidos, eventos y actividades)</option>
                </select>
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
                  className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all shadow-soft flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingItem ? 'Guardar Cambios' : 'Crear Usuario'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="¿Eliminar este usuario?"
        description="El usuario perderá el acceso inmediato al panel de administración. Esta acción no se puede deshacer."
        confirmText="Sí, Eliminar"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
