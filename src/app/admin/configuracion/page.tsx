'use client';

import React, { useEffect, useState } from 'react';
import { SiteSettings } from '@/lib/types';
import { Settings, Save, CheckCircle2, Loader2, Radio, Globe, Phone, Mail, MapPin, Send, Key, AlertCircle, Info, Image as ImageIcon } from 'lucide-react';

export default function AdminConfiguracionPage() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleChange = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/contact/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: settings.smtp_to || settings.church_email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTestResult({
          success: false,
          message: data.error || 'Ocurrió un error al probar el envío de correo.',
        });
      } else {
        setTestResult({
          success: true,
          message: data.message || '¡Correo de prueba enviado con éxito!',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Error de conexión al probar el correo.',
      });
    } finally {
      setTestingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configuración Institucional</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Actualiza los datos de la iglesia, redes sociales, transmisión en vivo y radio online.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>¡Configuración guardada exitosamente! Los cambios ya son visibles en todo el sitio web.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Sección: Identidad del Sitio y Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-blue" />
            <span>Textos de Portada e Identidad</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Oficial de la Iglesia</label>
            <input
              type="text"
              value={settings.site_name || ''}
              onChange={(e) => handleChange('site_name', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Título Principal del Hero</label>
            <input
              type="text"
              value={settings.hero_title || ''}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Frase Resaltada en Dorado del Hero</label>
            <input
              type="text"
              placeholder="Amamos caminar en su presencia"
              value={settings.hero_highlight || ''}
              onChange={(e) => handleChange('hero_highlight', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subtítulo o Frase Institucional</label>
            <textarea
              rows={3}
              value={settings.hero_subtitle || ''}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>

        {/* Sección: Banners y Portadas de Secciones */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-brand-gold" />
              <span>Imágenes de Fondo en Encabezados (Banners)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Personaliza las fotografías de fondo con estilo congregacional que aparecen en cada sección pública.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fondo Sección Reflexiones Bíblicas (/mensajes)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... o /images/..."
                value={settings.mensajes_hero_image || ''}
                onChange={(e) => handleChange('mensajes_hero_image', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fondo Sección Actividades Semanales (/actividades)
              </label>
              <input
                type="text"
                placeholder="/images/culto-general.jpg o URL"
                value={settings.actividades_hero_image || ''}
                onChange={(e) => handleChange('actividades_hero_image', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fondo Sección Próximos Eventos (/eventos)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... o /images/..."
                value={settings.eventos_hero_image || ''}
                onChange={(e) => handleChange('eventos_hero_image', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fondo Sección Contacto y Oración (/contacto)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... o /images/..."
                value={settings.contacto_hero_image || ''}
                onChange={(e) => handleChange('contacto_hero_image', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Sección: Datos de Contacto y Sede */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-gold" />
            <span>Contacto y Ubicación en Comayagua</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección Física Completa</label>
            <input
              type="text"
              value={settings.church_address || ''}
              onChange={(e) => handleChange('church_address', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              URL / Enlace de Inserción de Google Maps (Opcional)
            </label>
            <input
              type="text"
              placeholder="https://maps.google.com/maps?... o dejar vacío para usar la dirección física"
              value={settings.google_maps_embed_url || ''}
              onChange={(e) => handleChange('google_maps_embed_url', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Si se deja vacío, el sistema genera automáticamente el mapa exacto usando la dirección física arriba configurada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono Principal</label>
              <input
                type="text"
                value={settings.church_phone || ''}
                onChange={(e) => handleChange('church_phone', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Directo</label>
              <input
                type="text"
                value={settings.church_whatsapp || ''}
                onChange={(e) => handleChange('church_whatsapp', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={settings.church_email || ''}
                onChange={(e) => handleChange('church_email', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Sección: Servicio de Envío de Correo (SMTP / Gmail) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-blue" />
                <span>Servicio de Envío de Correos Electrónicos (SMTP)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Permite que el formulario de contacto web despache los correos de oración y peticiones directamente a la bandeja pastoral.
              </p>
            </div>

            <button
              type="button"
              onClick={handleTestEmail}
              disabled={testingEmail}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-blue/30 bg-brand-blue/5 hover:bg-brand-blue/10 text-brand-blue text-xs font-bold transition-all disabled:opacity-50"
            >
              {testingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Probar Envío de Correo</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 animate-fadeIn ${
                testResult.success
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">{testResult.message}</div>
            </div>
          )}

          {/* Guía rápida para Gmail / Google */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>¿Cómo configurar el envío con Gmail (ej: micapacomayagua@gmail.com)?</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-amber-900/90 pl-1 leading-relaxed">
              <li>Inicia sesión en tu cuenta de Google (<a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-amber-950">Seguridad de Google</a>).</li>
              <li>Asegúrate de tener activa la <strong>Verificación en 2 pasos</strong>.</li>
              <li>En la barra de búsqueda de tu cuenta de Google escribe <strong>"Contraseñas de aplicaciones"</strong> y crea una para "MICAPA Web".</li>
              <li>Copia el código generado de 16 letras (sin espacios) y pégalo abajo en <strong>Contraseña de Aplicación</strong>.</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Servidor SMTP (Host)
              </label>
              <input
                type="text"
                placeholder="smtp.gmail.com"
                value={settings.smtp_host || ''}
                onChange={(e) => handleChange('smtp_host', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Por defecto: smtp.gmail.com</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Puerto SMTP
              </label>
              <input
                type="text"
                placeholder="465 (SSL) o 587 (TLS)"
                value={settings.smtp_port || ''}
                onChange={(e) => handleChange('smtp_port', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Recomendado para Gmail: 465</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Remitente (Usuario SMTP)
              </label>
              <input
                type="email"
                placeholder="micapacomayagua@gmail.com"
                value={settings.smtp_user || ''}
                onChange={(e) => handleChange('smtp_user', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña de Aplicación Google (16 caracteres)
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={settings.smtp_pass || ''}
                onChange={(e) => handleChange('smtp_pass', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Destino de Notificaciones
              </label>
              <input
                type="email"
                placeholder="micapacomayagua@gmail.com"
                value={settings.smtp_to || ''}
                onChange={(e) => handleChange('smtp_to', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Donde llegarán las peticiones enviadas</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre del Remitente (Opcional)
              </label>
              <input
                type="text"
                placeholder="MICAPA - El Camino de la Palabra"
                value={settings.smtp_from || ''}
                onChange={(e) => handleChange('smtp_from', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Sección: Emisora Radio Mi Capa y Transmisión */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600" />
            <span>Radio Mi Capa y Transmisión en Vivo</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">URL de Streaming MP3 (Icecast)</label>
              <input
                type="url"
                value={settings.radio_stream_url || ''}
                onChange={(e) => handleChange('radio_stream_url', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Portal Web de la Radio</label>
              <input
                type="url"
                value={settings.radio_website_url || ''}
                onChange={(e) => handleChange('radio_website_url', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="liveActiveToggle"
                checked={settings.live_stream_active === 'true'}
                onChange={(e) => handleChange('live_stream_active', e.target.checked ? 'true' : 'false')}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
              />
              <label htmlFor="liveActiveToggle" className="text-xs font-bold text-slate-800">
                Activar Banner de Transmisión de Video en Vivo en Portada
              </label>
            </div>

            {settings.live_stream_active === 'true' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL del Video en Vivo (YouTube Live o Facebook Live)
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/live/..."
                  value={settings.live_stream_url || ''}
                  onChange={(e) => handleChange('live_stream_url', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Sección: Redes Sociales */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Canales y Redes Sociales</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Página de Facebook</label>
              <input
                type="url"
                placeholder="https://facebook.com/..."
                value={settings.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram Oficial</label>
              <input
                type="url"
                placeholder="https://instagram.com/..."
                value={settings.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Canal de YouTube</label>
              <input
                type="url"
                placeholder="https://youtube.com/..."
                value={settings.youtube_url || ''}
                onChange={(e) => handleChange('youtube_url', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">TikTok Oficial</label>
              <input
                type="url"
                placeholder="https://tiktok.com/@..."
                value={settings.tiktok_url || ''}
                onChange={(e) => handleChange('tiktok_url', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">X (Twitter)</label>
              <input
                type="url"
                placeholder="https://x.com/..."
                value={settings.twitter_url || ''}
                onChange={(e) => handleChange('twitter_url', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-full bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-bold transition-all shadow-soft flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Guardar Toda la Configuración</span>
          </button>
        </div>
      </form>
    </div>
  );
}
