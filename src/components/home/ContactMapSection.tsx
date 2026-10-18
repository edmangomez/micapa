'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageCircle, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

export default function ContactMapSection({ settings }: { settings: SiteSettings }) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Petición de Oración',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al enviar el mensaje');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', type: 'Petición de Oración', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 7000);
    } catch (err: any) {
      setErrorMessage(err.message || 'No se pudo enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Lado izquierdo: Información y Dirección oficial */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue-light text-brand-blue-dark text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Sede de la Iglesia</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
              Visítanos y Comunícate
            </h2>

            <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
              Nuestras puertas están abiertas para ti y tu familia. Nos encontramos en el corazón de Comayagua, listos para recibirte con el amor de Cristo.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-cream border border-brand-border/60">
                <div className="w-10 h-10 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-dark">Dirección Oficial en Comayagua</h4>
                  <p className="text-xs sm:text-sm text-brand-muted mt-0.5 leading-relaxed">
                    {settings.church_address ||
                      'F957+3XR, Calle 2 NO, Bo. El INVA, Comayagua, Honduras'}
                  </p>
                  <p className="text-[11px] font-mono text-brand-blue font-semibold mt-1">
                    Plus Code Google Maps: F957+3XR
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-cream border border-brand-border/60">
                <div className="w-10 h-10 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-dark">Teléfono de Oficina</h4>
                  <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
                    {settings.church_phone || '+504 2772-0872'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-cream border border-brand-border/60">
                <div className="w-10 h-10 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-dark">Correo Electrónico</h4>
                  <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
                    {settings.church_email || 'micapacomayagua@gmail.com'}
                  </p>
                </div>
              </div>
            </div>


          </div>

          {/* Lado derecho: Formulario de Contacto / Peticiones de Oración */}
          <div className="lg:col-span-7 bg-brand-cream rounded-3xl p-6 sm:p-10 border border-brand-border/60 shadow-sm">
            <h3 className="text-2xl font-bold text-brand-dark mb-2">Envíanos un Mensaje</h3>
            <p className="text-xs sm:text-sm text-brand-muted mb-6">
              ¿Deseas solicitar oración, conocer más sobre los grupos de discipulado o ponerte en contacto con el pastor?
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800 space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold">¡Mensaje Enviado con Éxito!</h4>
                <p className="text-xs text-emerald-700">
                  Gracias por comunicarte con MICAPA. Hemos recibido tu mensaje y estaremos en oración por tu vida.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1">Nombre completo *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre y apellido"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1">Teléfono o WhatsApp</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+504..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1">Correo electrónico</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1">Tipo de mensaje</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <option>Petición de Oración</option>
                      <option>Información de Cultos</option>
                      <option>Consejería Pastoral</option>
                      <option>Otro Asunto</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">Mensaje o motivo de oración *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Escribe tu petición o mensaje aquí..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 rounded-full bg-brand-blue hover:bg-brand-blue-hover disabled:opacity-60 text-white font-bold text-sm transition-all shadow-soft flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enviando mensaje...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Mensaje a MICAPA</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Mapa con la ubicación exacta de El Camino de la palabra en Google Maps */}
        {(() => {
          const exactAddress = settings.church_address || 'F957+3XR, Calle 2 NO, Bo. El INVA, Comayagua, Honduras';
          // Coordenadas oficiales de la ficha Google Maps de "El Camino de la palabra"
          const lat = 14.4577267;
          const lng = -87.6350963;
          const mapEmbedUrl = settings.google_maps_embed_url && settings.google_maps_embed_url.startsWith('http')
            ? settings.google_maps_embed_url
            : `https://maps.google.com/maps?q=${lat},${lng}&hl=es&z=17&output=embed`;
          const googleMapsPlaceUrl = `https://www.google.com/maps/place/El+Camino+de+la+palabra/@${lat},${lng},17z/data=!3m1!4b1!4m6!3m5!1s0x8f6585f5b28d408b:0x4f4abd454796826a!8m2!3d${lat}!4d${lng}!16s%2Fg%2F11b6d_p8w1`;
          const wazeUrl = `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`;

          return (
            <div className="mt-16 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-brand-cream border border-brand-border/60">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-brand-dark flex items-center gap-2">
                      <span>El Camino de la palabra</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Ficha en Google Maps
                      </span>
                    </h3>
                    <p className="text-xs text-brand-muted leading-relaxed mt-0.5">
                      {exactAddress}
                    </p>
                    <p className="text-[11px] font-mono text-brand-blue font-bold mt-1">
                      Plus Code: F957+3XR • Comayagua, Honduras
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
                  <a
                    href={googleMapsPlaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-soft transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Abrir en Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-soft transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Ruta en Waze</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-brand-border/60 shadow-sm aspect-[21/9] max-h-96 w-full relative">
                <iframe
                  title={`Ubicación de El Camino de la palabra - ${exactAddress}`}
                  src={mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
