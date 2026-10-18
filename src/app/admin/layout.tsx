'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Quote,
  Calendar,
  Sparkles,
  Video,
  Settings,
  Users,
  LogOut,
  Globe,
  Loader2,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // No verificar auth si está en la pantalla de login
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        setAdminUser(data.user);
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
          <p className="text-xs text-brand-muted font-medium">Verificando acceso administrativo...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    {
      name: 'Reflexiones',
      href: '/admin/pensamientos',
      icon: Quote,
      subItems: [
        { name: 'Reflexiones Bíblicas', href: '/admin/pensamientos?tab=pensamientos' },
        { name: 'Autores', href: '/admin/pensamientos?tab=autores' },
        { name: 'Categorías', href: '/admin/pensamientos?tab=categorias' },
      ],
    },
    { name: 'Actividades', href: '/admin/actividades', icon: Calendar },
    { name: 'Eventos', href: '/admin/eventos', icon: Sparkles },
    { name: 'Nosotros', href: '/admin/nosotros', icon: Compass },
    { name: 'Usuarios', href: '/admin/usuarios', icon: Users },
    { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      {/* Barra superior móvil */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="font-bold text-sm text-brand-blue">MICAPA Admin</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="relative w-10 h-10">
              <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-blue leading-tight">MICAPA</h2>
              <span className="text-[10px] text-brand-muted font-medium uppercase tracking-wider block">
                Panel Pastoral
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isParentActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              const hasSub = item.subItems && item.subItems.length > 0;

              return (
                <div key={item.name} className="space-y-1">
                  <Link
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                      isParentActive
                        ? 'bg-brand-blue text-white shadow-soft'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                  </Link>

                  {hasSub && isParentActive && (
                    <div className="pl-7 pr-2 py-1 space-y-1 border-l-2 border-brand-blue/30 ml-4 my-1">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setMobileSidebarOpen(false)}
                          className="block px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-brand-blue hover:bg-brand-blue-light/50 transition-colors"
                        >
                          • {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-6 border-t border-gray-100 space-y-3">
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px]">Conectado como:</span>
            <span className="font-bold text-slate-700 truncate block">{adminUser?.name || 'Administrador'}</span>
            <span className="text-slate-400 text-[10px] truncate block">{adminUser?.email}</span>
          </div>

          <div className="flex flex-col gap-1.5 pt-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <Globe className="w-3.5 h-3.5 text-brand-blue" />
              <span>Ver Sitio Web</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 text-left w-full transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
