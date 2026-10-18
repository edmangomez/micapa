'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { PastorThought, ThoughtAuthor, ThoughtCategory } from '@/lib/types';
import {
  Plus,
  Edit2,
  Trash2,
  Quote,
  Loader2,
  X,
  Check,
  Upload,
  Calendar,
  Search,
  User,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Tag,
  Layers,
  ArrowRight,
} from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

function PensamientosAdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Pestañas activas: 'pensamientos' | 'autores' | 'categorias'
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'pensamientos' | 'autores' | 'categorias'>('pensamientos');

  useEffect(() => {
    if (tabParam === 'autores' || tabParam === 'categorias' || tabParam === 'pensamientos') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const switchTab = (tab: 'pensamientos' | 'autores' | 'categorias') => {
    setActiveTab(tab);
    router.replace(`/admin/pensamientos?tab=${tab}`, { scroll: false });
  };

  // Datos principales
  const [thoughts, setThoughts] = useState<PastorThought[]>([]);
  const [authors, setAuthors] = useState<ThoughtAuthor[]>([]);
  const [categories, setCategories] = useState<ThoughtCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de búsqueda, filtro y paginación para pensamientos
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modales de Confirmación para eliminar
  const [deleteThoughtId, setDeleteThoughtId] = useState<number | null>(null);
  const [deleteAuthorId, setDeleteAuthorId] = useState<number | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Modal para Crear / Editar Pensamiento
  const [thoughtModalOpen, setThoughtModalOpen] = useState(false);
  const [editingThought, setEditingThought] = useState<PastorThought | null>(null);
  const [savingThought, setSavingThought] = useState(false);
  const [thoughtTitle, setThoughtTitle] = useState('');
  const [thoughtContent, setThoughtContent] = useState('');
  const [selectedAuthorName, setSelectedAuthorName] = useState('');
  const [customAuthorName, setCustomAuthorName] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [pastorPhoto, setPastorPhoto] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Modal para Crear / Editar Autor
  const [authorModalOpen, setAuthorModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<ThoughtAuthor | null>(null);
  const [savingAuthor, setSavingAuthor] = useState(false);
  const [authorNameInput, setAuthorNameInput] = useState('');
  const [authorRoleInput, setAuthorRoleInput] = useState('');
  const [authorPhotoInput, setAuthorPhotoInput] = useState('');

  // Modal para Crear / Editar Categoría
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ThoughtCategory | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [categoryDescInput, setCategoryDescInput] = useState('');

  // Cargar datos del servidor
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [resThoughts, resAuthors, resCategories] = await Promise.all([
        fetch('/api/thoughts'),
        fetch('/api/thoughts/authors'),
        fetch('/api/thoughts/categories'),
      ]);

      if (resThoughts.ok) setThoughts(await resThoughts.json());
      if (resAuthors.ok) setAuthors(await resAuthors.json());
      if (resCategories.ok) setCategories(await resCategories.json());
    } catch (err) {
      console.error('Error cargando datos de pensamientos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Control tecla Escape para modales
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (thoughtModalOpen && !savingThought) setThoughtModalOpen(false);
        if (authorModalOpen && !savingAuthor) setAuthorModalOpen(false);
        if (categoryModalOpen && !savingCategory) setCategoryModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [thoughtModalOpen, authorModalOpen, categoryModalOpen, savingThought, savingAuthor, savingCategory]);

  // Subida de imagen
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, target: 'thought' | 'author') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        if (target === 'thought') setPastorPhoto(data.url);
        if (target === 'author') setAuthorPhotoInput(data.url);
      }
    } catch (err) {
      console.error('Error subiendo imagen:', err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // ==========================================
  // GESTIÓN DE PENSAMIENTOS
  // ==========================================
  const openCreateThoughtModal = () => {
    setEditingThought(null);
    setThoughtTitle('');
    setThoughtContent('');
    const defaultAuthor = authors[0]?.name || 'Pastor Principal MICAPA';
    setSelectedAuthorName(defaultAuthor);
    setCustomAuthorName('');
    const foundAuth = authors.find((a) => a.name === defaultAuthor);
    setPastorPhoto(foundAuth?.photo_url || '/images/logo.png');

    const defaultCategory = categories[0]?.name || 'Vida Cristiana';
    setSelectedCategoryName(defaultCategory);
    setCustomCategoryName('');

    setIsFeatured(false);
    setThoughtModalOpen(true);
  };

  const openEditThoughtModal = (item: PastorThought) => {
    setEditingThought(item);
    setThoughtTitle(item.title);
    setThoughtContent(item.content);

    const matchAuthor = authors.some((a) => a.name === item.author);
    if (matchAuthor) {
      setSelectedAuthorName(item.author);
      setCustomAuthorName('');
    } else {
      setSelectedAuthorName('Otro');
      setCustomAuthorName(item.author);
    }

    const matchCategory = categories.some((c) => c.name === item.category);
    if (matchCategory) {
      setSelectedCategoryName(item.category);
      setCustomCategoryName('');
    } else {
      setSelectedCategoryName('Otra');
      setCustomCategoryName(item.category);
    }

    setIsFeatured(item.is_featured === 1);
    setPastorPhoto(item.pastor_photo || '/images/logo.png');
    setThoughtModalOpen(true);
  };

  const handleSaveThought = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingThought(true);

    const finalAuthor =
      selectedAuthorName === 'Otro' ? customAuthorName.trim() || 'Pastor Principal MICAPA' : selectedAuthorName;
    const finalCategory =
      selectedCategoryName === 'Otra' ? customCategoryName.trim() || 'Reflexión' : selectedCategoryName;

    try {
      const payload = {
        title: thoughtTitle,
        content: thoughtContent,
        author: finalAuthor,
        category: finalCategory,
        pastor_photo: pastorPhoto || null,
        is_featured: isFeatured,
      };

      if (editingThought) {
        await fetch(`/api/thoughts/${editingThought.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/thoughts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setThoughtModalOpen(false);
      loadAllData();
    } catch (err) {
      console.error('Error guardando reflexión:', err);
    } finally {
      setSavingThought(false);
    }
  };

  const confirmDeleteThought = async () => {
    if (!deleteThoughtId) return;
    try {
      setDeleting(true);
      await fetch(`/api/thoughts/${deleteThoughtId}`, { method: 'DELETE' });
      setDeleteThoughtId(null);
      loadAllData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  // Filtrado y paginación de pensamientos
  const filteredThoughts = useMemo(() => {
    return thoughts.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategory === 'Todas' || t.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [thoughts, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredThoughts.length / pageSize) || 1;
  const paginatedThoughts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredThoughts.slice(start, start + pageSize);
  }, [filteredThoughts, currentPage, pageSize]);

  // ==========================================
  // GESTIÓN DE AUTORES
  // ==========================================
  const openCreateAuthorModal = () => {
    setEditingAuthor(null);
    setAuthorNameInput('');
    setAuthorRoleInput('');
    setAuthorPhotoInput('/images/logo.png');
    setAuthorModalOpen(true);
  };

  const openEditAuthorModal = (auth: ThoughtAuthor) => {
    setEditingAuthor(auth);
    setAuthorNameInput(auth.name);
    setAuthorRoleInput(auth.role || '');
    setAuthorPhotoInput(auth.photo_url || '/images/logo.png');
    setAuthorModalOpen(true);
  };

  const handleSaveAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorNameInput.trim()) return;

    try {
      setSavingAuthor(true);
      const payload = {
        id: editingAuthor?.id,
        name: authorNameInput.trim(),
        role: authorRoleInput.trim() || null,
        photo_url: authorPhotoInput || '/images/logo.png',
      };

      if (editingAuthor) {
        await fetch('/api/thoughts/authors', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/thoughts/authors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setAuthorModalOpen(false);
      loadAllData();
    } catch (err) {
      console.error('Error guardando autor:', err);
    } finally {
      setSavingAuthor(false);
    }
  };

  const confirmDeleteAuthor = async () => {
    if (!deleteAuthorId) return;
    try {
      setDeleting(true);
      await fetch(`/api/thoughts/authors?id=${deleteAuthorId}`, { method: 'DELETE' });
      setDeleteAuthorId(null);
      loadAllData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // GESTIÓN DE CATEGORÍAS
  // ==========================================
  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setCategoryNameInput('');
    setCategoryDescInput('');
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: ThoughtCategory) => {
    setEditingCategory(cat);
    setCategoryNameInput(cat.name);
    setCategoryDescInput(cat.description || '');
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) return;

    try {
      setSavingCategory(true);
      const payload = {
        id: editingCategory?.id,
        name: categoryNameInput.trim(),
        description: categoryDescInput.trim() || null,
      };

      if (editingCategory) {
        await fetch('/api/thoughts/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/thoughts/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setCategoryModalOpen(false);
      loadAllData();
    } catch (err) {
      console.error('Error guardando categoría:', err);
    } finally {
      setSavingCategory(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    try {
      setDeleting(true);
      await fetch(`/api/thoughts/categories?id=${deleteCategoryId}`, { method: 'DELETE' });
      setDeleteCategoryId(null);
      loadAllData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera Principal con Pestañas / Submenú */}
      <div className="pb-6 border-b border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reflexiones Bíblicas</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Gestiona reflexiones bíblicas, lista de autores y categorías de publicación para el sitio oficial.
            </p>
          </div>

          {/* Botón de acción según pestaña activa */}
          {activeTab === 'pensamientos' && (
            <button
              onClick={openCreateThoughtModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all shadow-soft"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Publicación</span>
            </button>
          )}

          {activeTab === 'autores' && (
            <button
              onClick={openCreateAuthorModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all shadow-soft"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Nuevo Autor</span>
            </button>
          )}

          {activeTab === 'categorias' && (
            <button
              onClick={openCreateCategoryModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all shadow-soft"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Nueva Categoría</span>
            </button>
          )}
        </div>

        {/* Submenú Navegable por Pestañas */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 overflow-x-auto">
          <button
            onClick={() => switchTab('pensamientos')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'pensamientos'
                ? 'bg-brand-blue text-white shadow-soft'
                : 'bg-white border border-gray-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Reflexiones Publicadas</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'pensamientos' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {thoughts.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('autores')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'autores'
                ? 'bg-brand-blue text-white shadow-soft'
                : 'bg-white border border-gray-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Lista de Autores</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'autores' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {authors.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('categorias')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'categorias'
                ? 'bg-brand-blue text-white shadow-soft'
                : 'bg-white border border-gray-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Lista de Categorías</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'categorias' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {categories.length}
            </span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center">
          <Loader2 className="w-8 h-8 text-brand-blue animate-spin mx-auto" />
          <p className="text-xs text-slate-400 mt-2">Cargando catálogo...</p>
        </div>
      ) : (
        <>
          {/* ========================================================= */}
          {/* VISTA 1: REFLEXIONES / PENSAMIENTOS                       */}
          {/* ========================================================= */}
          {activeTab === 'pensamientos' && (
            <div className="space-y-6">
              {/* Barra de Búsqueda y Filtro de Categoría */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Buscar por título, contenido o autor..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-500 font-medium shrink-0">Categoría:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full md:w-auto px-3 py-2 rounded-xl border border-gray-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="Todas">Todas las categorías</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid de Pensamientos */}
              {paginatedThoughts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
                  <Quote className="w-10 h-10 text-brand-blue mx-auto opacity-40" />
                  <h3 className="text-base font-bold text-slate-800">No se encontraron reflexiones</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {searchQuery || selectedCategory !== 'Todas'
                      ? 'No hay publicaciones que coincidan con los filtros aplicados.'
                      : 'Comienza creando la primera reflexión bíblica para la congregación.'}
                  </p>
                  {(searchQuery || selectedCategory !== 'Todas') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('Todas');
                        setCurrentPage(1);
                      }}
                      className="text-xs text-brand-blue font-bold hover:underline pt-2 block mx-auto"
                    >
                      Restablecer filtros
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedThoughts.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-card transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                            {item.category}
                          </span>
                          {item.is_featured === 1 && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-blue bg-brand-blue-light px-2.5 py-0.5 rounded-full">
                              <Bookmark className="w-3 h-3 fill-current" />
                              <span>Destacado</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-800 mb-2 leading-snug">{item.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4 italic">
                          &ldquo;{item.content}&rdquo;
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-slate-100 border border-gray-200 shrink-0">
                            <Image
                              src={item.pastor_photo || '/images/logo.png'}
                              alt={item.author}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <span className="truncate max-w-[120px] font-semibold text-slate-700">{item.author}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditThoughtModal(item)}
                            className="p-1.5 text-slate-500 hover:text-brand-blue hover:bg-slate-50 rounded-lg transition-colors"
                            title="Editar publicación"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteThoughtId(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar publicación"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-slate-500">
                    Mostrando {(currentPage - 1) * pageSize + 1} -{' '}
                    {Math.min(currentPage * pageSize, filteredThoughts.length)} de {filteredThoughts.length} reflexiones
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold px-3 py-1">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* VISTA 2: LISTA DE AUTORES                                 */}
          {/* ========================================================= */}
          {activeTab === 'autores' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                <User className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed">
                  Los autores registrados aquí aparecerán automáticamente en el <strong>combobox desplegable</strong> al
                  crear o editar cualquier reflexión bíblica. Si modificas el nombre de un autor, sus publicaciones se
                  sincronizarán automáticamente.
                </p>
              </div>

              {authors.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
                  <User className="w-10 h-10 text-brand-blue mx-auto opacity-40" />
                  <h3 className="text-base font-bold text-slate-800">No hay autores registrados</h3>
                  <button
                    onClick={openCreateAuthorModal}
                    className="text-xs font-bold text-brand-blue hover:underline"
                  >
                    + Agregar el primer autor
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {authors.map((auth) => (
                    <div
                      key={auth.id}
                      className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-card transition-all"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-brand-blue/30 shrink-0">
                          <Image
                            src={auth.photo_url || '/images/logo.png'}
                            alt={auth.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-800 truncate">{auth.name}</h3>
                          <p className="text-xs text-slate-500 truncate">{auth.role || 'Ministerio Pastoral'}</p>
                          <span className="inline-block mt-1 text-[10px] font-semibold text-brand-blue bg-brand-blue-light px-2 py-0.5 rounded-full">
                            {auth.thought_count || 0} {auth.thought_count === 1 ? 'reflexión' : 'reflexiones'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          onClick={() => openEditAuthorModal(auth)}
                          className="p-2 text-slate-500 hover:text-brand-blue hover:bg-slate-50 rounded-lg transition-colors"
                          title="Editar autor"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteAuthorId(auth.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar autor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* VISTA 3: LISTA DE CATEGORÍAS                              */}
          {/* ========================================================= */}
          {activeTab === 'categorias' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <Tag className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed">
                  Las categorías registradas aquí se cargan en el <strong>combobox desplegable</strong> del formulario de
                  reflexiones y en los filtros de búsqueda tanto del panel como de la página pública.
                </p>
              </div>

              {categories.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
                  <Tag className="w-10 h-10 text-brand-blue mx-auto opacity-40" />
                  <h3 className="text-base font-bold text-slate-800">No hay categorías registradas</h3>
                  <button
                    onClick={openCreateCategoryModal}
                    className="text-xs font-bold text-brand-blue hover:underline"
                  >
                    + Agregar la primera categoría
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-card transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold tracking-wide">
                            {cat.name}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {cat.thought_count || 0} {cat.thought_count === 1 ? 'publicación' : 'publicaciones'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                          {cat.description || 'Sin descripción detallada.'}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-1 mt-4">
                        <button
                          onClick={() => openEditCategoryModal(cat)}
                          className="p-1.5 text-slate-500 hover:text-brand-blue hover:bg-slate-50 rounded-lg transition-colors"
                          title="Editar categoría"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCategoryId(cat.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar categoría"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: PUBLICAR / EDITAR PENSAMIENTO                     */}
      {/* ========================================================= */}
      {thoughtModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {editingThought ? 'Editar Reflexión' : 'Publicar Nueva Reflexión'}
              </h2>
              <button
                onClick={() => setThoughtModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveThought} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título *</label>
                <input
                  type="text"
                  required
                  value={thoughtTitle}
                  onChange={(e) => setThoughtTitle(e.target.value)}
                  placeholder="Ej: Caminando por Fe en Tiempos de Incertidumbre"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contenido de la reflexión o cita *
                </label>
                <textarea
                  required
                  rows={5}
                  value={thoughtContent}
                  onChange={(e) => setThoughtContent(e.target.value)}
                  placeholder="Escribe el mensaje o pasaje bíblico para edificar a la congregación..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              {/* Combo Box de Autor y Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* COMBOBOX DE AUTOR */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Autor *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setThoughtModalOpen(false);
                        switchTab('autores');
                      }}
                      className="text-[11px] font-bold text-brand-blue hover:underline"
                    >
                      + Gestionar
                    </button>
                  </div>
                  <select
                    value={selectedAuthorName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedAuthorName(val);
                      if (val !== 'Otro') {
                        const matched = authors.find((a) => a.name === val);
                        if (matched && matched.photo_url) {
                          setPastorPhoto(matched.photo_url);
                        }
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="" disabled>
                      Selecciona un autor...
                    </option>
                    {authors.map((auth) => (
                      <option key={auth.id} value={auth.name}>
                        {auth.name} {auth.role ? `(${auth.role})` : ''}
                      </option>
                    ))}
                    <option value="Otro">+ Ingresar otro autor manual...</option>
                  </select>

                  {selectedAuthorName === 'Otro' && (
                    <input
                      type="text"
                      required
                      value={customAuthorName}
                      onChange={(e) => setCustomAuthorName(e.target.value)}
                      placeholder="Escribe el nombre del autor..."
                      className="w-full mt-2 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  )}
                </div>

                {/* COMBOBOX DE CATEGORÍA */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Categoría *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setThoughtModalOpen(false);
                        switchTab('categorias');
                      }}
                      className="text-[11px] font-bold text-brand-blue hover:underline"
                    >
                      + Gestionar
                    </button>
                  </div>
                  <select
                    value={selectedCategoryName}
                    onChange={(e) => setSelectedCategoryName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="" disabled>
                      Selecciona una categoría...
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    <option value="Otra">+ Ingresar otra categoría manual...</option>
                  </select>

                  {selectedCategoryName === 'Otra' && (
                    <input
                      type="text"
                      required
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      placeholder="Escribe la categoría..."
                      className="w-full mt-2 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  )}
                </div>
              </div>

              {/* Fotografía del Autor con Previsualización */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">Fotografía del Autor (Opcional)</label>

                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-brand-blue shrink-0 flex items-center justify-center shadow-sm">
                    {pastorPhoto ? (
                      <Image src={pastorPhoto} alt="Foto autor" fill unoptimized className="object-cover" />
                    ) : (
                      <User className="w-7 h-7 text-brand-blue" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadImage(e, 'thought')}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setPastorPhoto('/images/logo.png')}
                        className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-brand-blue hover:bg-blue-50"
                      >
                        Usar Logo MICAPA
                      </button>
                    </div>
                    {uploadingPhoto && <p className="text-[11px] text-brand-blue font-medium">Subiendo foto...</p>}
                  </div>
                </div>
              </div>

              {/* Destacar en inicio */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredThoughtToggle"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-blue focus:ring-brand-blue"
                />
                <label htmlFor="featuredThoughtToggle" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Destacar esta reflexión en la página de inicio
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setThoughtModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingThought}
                  className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all shadow-soft flex items-center gap-2 disabled:opacity-50"
                >
                  {savingThought ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingThought ? 'Guardar Cambios' : 'Publicar Reflexión'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CREAR / EDITAR AUTOR                             */}
      {/* ========================================================= */}
      {authorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-gray-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {editingAuthor ? 'Editar Autor' : 'Nuevo Autor'}
              </h2>
              <button
                onClick={() => setAuthorModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAuthor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo del Autor *</label>
                <input
                  type="text"
                  required
                  value={authorNameInput}
                  onChange={(e) => setAuthorNameInput(e.target.value)}
                  placeholder="Ej: Pastor Principal MICAPA"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo o Ministerio</label>
                <input
                  type="text"
                  value={authorRoleInput}
                  onChange={(e) => setAuthorRoleInput(e.target.value)}
                  placeholder="Ej: Pastor Principal, Líder de Jóvenes, etc."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              {/* Fotografía de Autor */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">Fotografía o Logo del Autor</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-brand-blue shrink-0 flex items-center justify-center">
                    {authorPhotoInput ? (
                      <Image src={authorPhotoInput} alt="Foto autor" fill unoptimized className="object-cover" />
                    ) : (
                      <User className="w-7 h-7 text-brand-blue" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadImage(e, 'author')}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setAuthorPhotoInput('/images/logo.png')}
                        className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-brand-blue hover:bg-blue-50"
                      >
                        Usar Logo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAuthorModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingAuthor}
                  className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all shadow-soft flex items-center gap-2 disabled:opacity-50"
                >
                  {savingAuthor ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingAuthor ? 'Guardar Cambios' : 'Crear Autor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CREAR / EDITAR CATEGORÍA                         */}
      {/* ========================================================= */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-gray-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de la Categoría *</label>
                <input
                  type="text"
                  required
                  value={categoryNameInput}
                  onChange={(e) => setCategoryNameInput(e.target.value)}
                  placeholder="Ej: Fe y Discipulado"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción (Opcional)</label>
                <textarea
                  rows={3}
                  value={categoryDescInput}
                  onChange={(e) => setCategoryDescInput(e.target.value)}
                  placeholder="Breve propósito de esta categoría..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all shadow-soft flex items-center gap-2 disabled:opacity-50"
                >
                  {savingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modales de Confirmación de Borrado */}
      <ConfirmModal
        isOpen={deleteThoughtId !== null}
        title="¿Eliminar esta reflexión?"
        description="Esta publicación se eliminará definitivamente del catálogo y de la portada oficial."
        loading={deleting}
        onConfirm={confirmDeleteThought}
        onClose={() => setDeleteThoughtId(null)}
      />

      <ConfirmModal
        isOpen={deleteAuthorId !== null}
        title="¿Eliminar este autor?"
        description="El autor se removerá de la lista desplegable. Las reflexiones que ya tengan este autor conservarán su nombre como texto histórico."
        loading={deleting}
        onConfirm={confirmDeleteAuthor}
        onClose={() => setDeleteAuthorId(null)}
      />

      <ConfirmModal
        isOpen={deleteCategoryId !== null}
        title="¿Eliminar esta categoría?"
        description="La categoría se removerá de la lista desplegable y de los filtros de búsqueda."
        loading={deleting}
        onConfirm={confirmDeleteCategory}
        onClose={() => setDeleteCategoryId(null)}
      />
    </div>
  );
}

export default function AdminPensamientosPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center">
          <Loader2 className="w-8 h-8 text-brand-blue animate-spin mx-auto" />
        </div>
      }
    >
      <PensamientosAdminContent />
    </Suspense>
  );
}
