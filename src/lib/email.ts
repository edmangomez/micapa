import nodemailer from 'nodemailer';
import { getSettings } from './data';
import { SiteSettings } from './types';

export interface ContactEmailPayload {
  name: string;
  email?: string;
  phone?: string;
  type?: string;
  message: string;
  id?: number;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
  isConfigured: boolean;
}

/**
 * Obtiene la configuración SMTP priorizando variables de entorno (.env/.env.local)
 * y con fallback en la tabla settings de SQLite para fácil administración.
 */
export function getSmtpConfig(): SmtpConfig {
  let dbSettings: SiteSettings = {};
  try {
    dbSettings = getSettings() || {};
  } catch {
    dbSettings = {};
  }

  const host = process.env.SMTP_HOST || dbSettings.smtp_host || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || dbSettings.smtp_port || '465', 10);
  const secureEnv = process.env.SMTP_SECURE || dbSettings.smtp_secure;
  const secure = secureEnv !== undefined ? secureEnv === 'true' || secureEnv === '1' : port === 465;
  const user = process.env.SMTP_USER || dbSettings.smtp_user || '';
  const pass = process.env.SMTP_PASS || dbSettings.smtp_pass || '';
  const from = process.env.SMTP_FROM || dbSettings.smtp_from || (user ? `"MICAPA - El Camino de la Palabra" <${user}>` : '"MICAPA" <micapacomayagua@gmail.com>');
  const to = process.env.CONTACT_EMAIL_TO || dbSettings.smtp_to || dbSettings.church_email || 'micapacomayagua@gmail.com';

  const isConfigured = Boolean(user && pass);

  return {
    host,
    port,
    secure,
    user,
    pass,
    from,
    to,
    isConfigured,
  };
}

/**
 * Crea un transportador nodemailer reusable
 */
export function createMailTransporter() {
  const config = getSmtpConfig();
  if (!config.isConfigured) {
    return null;
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    // Compatibilidad TLS
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production' && config.host !== 'smtp.gmail.com' ? true : false,
    },
  });
}

/**
 * Genera la plantilla HTML para el correo de notificación recibido por la iglesia
 */
function buildAdminNotificationHtml(data: ContactEmailPayload, config: SmtpConfig): string {
  const dateStr = new Date().toLocaleString('es-HN', {
    timeZone: 'America/Tegucigalpa',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const phoneDisplay = data.phone?.trim() || 'No proporcionado';
  const phoneClean = data.phone ? data.phone.replace(/[^0-9+]/g, '') : '';
  const waUrl = phoneClean ? `https://wa.me/${phoneClean.replace('+', '')}` : null;
  const emailDisplay = data.email?.trim() || 'No proporcionado';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Mensaje de Contacto - MICAPA</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #07172c; padding: 28px 24px; text-align: center; border-bottom: 3px solid #d4af37; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #94a3b8; }
    .badge-bar { background: #f1f5f9; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; }
    .badge { display: inline-block; background: #d4af37; color: #07172c; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 12px; border-radius: 9999px; }
    .date { font-size: 12px; color: #64748b; }
    .content { padding: 28px 24px; }
    .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 12px; }
    .data-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; }
    .data-row { display: flex; padding: 8px 0; border-bottom: 1px solid #edf2f7; font-size: 14px; }
    .data-row:last-child { border-bottom: none; }
    .data-label { width: 140px; font-weight: 600; color: #475569; flex-shrink: 0; }
    .data-val { color: #0f172a; word-break: break-word; }
    .message-box { background: #ffffff; border-left: 4px solid #0f3d68; border-radius: 4px; padding: 18px 20px; background-color: #f0f7ff; margin-top: 8px; font-size: 15px; line-height: 1.6; color: #1e3a5f; white-space: pre-wrap; }
    .btn-action { display: inline-block; background: #0f3d68; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 13px; padding: 10px 20px; border-radius: 8px; margin-right: 10px; margin-top: 8px; }
    .btn-wa { background: #25d366; }
    .footer { background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MICAPA • Ministerio el Camino de la Palabra</h1>
      <p>Nuevo mensaje recibido desde la página web oficial (Comayagua, Honduras)</p>
    </div>

    <div class="badge-bar">
      <span class="badge">${data.type || 'Petición de Oración'}</span>
      <span class="date">${dateStr}</span>
    </div>

    <div class="content">
      <div class="section-title">Datos del Remitente</div>
      <div class="data-card">
        <div class="data-row">
          <div class="data-label">Nombre completo:</div>
          <div class="data-val"><strong>${data.name}</strong></div>
        </div>
        <div class="data-row">
          <div class="data-label">Teléfono / WhatsApp:</div>
          <div class="data-val">
            ${data.phone ? `<a href="tel:${phoneClean}" style="color: #0f3d68; text-decoration: none; font-weight: 600;">${phoneDisplay}</a>` : phoneDisplay}
          </div>
        </div>
        <div class="data-row">
          <div class="data-label">Correo electrónico:</div>
          <div class="data-val">
            ${data.email ? `<a href="mailto:${data.email}" style="color: #0f3d68; text-decoration: none; font-weight: 600;">${emailDisplay}</a>` : emailDisplay}
          </div>
        </div>
        <div class="data-row">
          <div class="data-label">Tipo de mensaje:</div>
          <div class="data-val">${data.type || 'Petición de Oración'}</div>
        </div>
      </div>

      <div class="section-title">Mensaje / Motivo de Oración</div>
      <div class="message-box">${data.message}</div>

      <div style="margin-top: 24px;">
        ${data.email ? `<a href="mailto:${data.email}?subject=Respuesta a tu mensaje en MICAPA" class="btn-action">Responder por Correo</a>` : ''}
        ${waUrl ? `<a href="${waUrl}" target="_blank" class="btn-action btn-wa">Abrir WhatsApp</a>` : ''}
      </div>
    </div>

    <div class="footer">
      Mensaje enviado automáticamente desde el formulario web de MICAPA (micapa.net).<br>
      Puedes gestionar todos los mensajes también desde el panel administrativo en <a href="https://micapa.net/admin" style="color: #64748b;">micapa.net/admin</a>.
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Genera la plantilla HTML para el correo de confirmación enviado a quien escribe
 */
function buildUserConfirmationHtml(data: ContactEmailPayload, config: SmtpConfig): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hemos recibido tu mensaje - MICAPA</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #07172c; padding: 32px 24px; text-align: center; border-bottom: 3px solid #d4af37; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #cbd5e1; }
    .content { padding: 32px 24px; }
    .salute { font-size: 18px; font-weight: 700; color: #07172c; margin-bottom: 12px; }
    .body-p { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 16px; }
    .bible-verse { background: #fdfaf0; border-left: 4px solid #d4af37; border-radius: 6px; padding: 16px 20px; margin: 24px 0; font-style: italic; color: #78350f; font-size: 13px; line-height: 1.6; }
    .verse-ref { font-weight: 700; font-style: normal; display: block; margin-top: 6px; color: #92400e; }
    .info-box { background: #f1f5f9; border-radius: 12px; padding: 20px; margin-top: 24px; font-size: 13px; color: #334155; }
    .info-title { font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    .btn-radio { display: inline-block; background: #d4af37; color: #07172c !important; text-decoration: none; font-weight: 700; font-size: 13px; padding: 10px 20px; border-radius: 8px; margin-top: 16px; }
    .footer { background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MICAPA</h1>
      <p>Ministerio el Camino de la Palabra • Comayagua, Honduras</p>
    </div>

    <div class="content">
      <div class="salute">¡Hola, ${data.name}!</div>
      <p class="body-p">
        Te confirmamos que hemos recibido con éxito tu mensaje y motivo de oración en el <strong>Ministerio el Camino de la Palabra (MICAPA)</strong>.
      </p>
      <p class="body-p">
        Nuestro equipo pastoral y ministerio de intercesión estará levantando tu petición delante de la presencia de Dios. Si solicitaste ser contactado o información sobre nuestros grupos de discipulado, nos comunicaremos contigo a la mayor brevedad.
      </p>

      <div class="bible-verse">
        "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús."
        <span class="verse-ref">— Filipenses 4:6-7</span>
      </div>

      <div class="info-box">
        <div class="info-title">Nuestras Puertas Están Abiertas en Comayagua</div>
        <div><strong>Dirección:</strong> Bo. El INVA, Calle 2 NO, Comayagua, Honduras</div>
        <div><strong>Culto General:</strong> Domingos 9:00 AM</div>
        <div><strong>Oración y Discipulado:</strong> Miércoles y Viernes 6:30 PM</div>
        <div><strong>Radio Online 24/7:</strong> Transmitiendo palabra y alabanza continua</div>
        <div style="text-align: center;">
          <a href="https://micapa.net" class="btn-radio">Visitar Portal MICAPA</a>
        </div>
      </div>
    </div>

    <div class="footer">
      Ministerio el Camino de la Palabra • Tel: +504 2772-0872 • micapacomayagua@gmail.com<br>
      Comayagua, Honduras
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Envía el correo de notificación y el acuse de recibo opcional
 */
export async function sendContactEmail(payload: ContactEmailPayload): Promise<{
  success: boolean;
  adminSent: boolean;
  userSent: boolean;
  error?: string;
  reason?: string;
}> {
  const config = getSmtpConfig();

  if (!config.isConfigured) {
    console.warn('[MICAPA Email] Configuración SMTP incompleta (falta SMTP_USER o SMTP_PASS). El mensaje se guardó en la base de datos pero no se envió correo.');
    return {
      success: false,
      adminSent: false,
      userSent: false,
      reason: 'smtp_unconfigured',
    };
  }

  const transporter = createMailTransporter();
  if (!transporter) {
    return {
      success: false,
      adminSent: false,
      userSent: false,
      reason: 'transporter_failed',
    };
  }

  let adminSent = false;
  let userSent = false;
  let errorMessage: string | undefined;

  // 1. Enviar notificación al correo institucional de la iglesia
  try {
    const adminSubject = `[MICAPA Web] ${payload.type || 'Nuevo Mensaje'}: ${payload.name}`;
    const adminHtml = buildAdminNotificationHtml(payload, config);

    await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: payload.email?.trim() || undefined,
      subject: adminSubject,
      text: `Nuevo mensaje de ${payload.name} (${payload.type || 'Petición'}):\n\nTel: ${payload.phone || 'N/A'}\nEmail: ${payload.email || 'N/A'}\n\nMensaje:\n${payload.message}`,
      html: adminHtml,
    });

    adminSent = true;
    console.log(`[MICAPA Email] Notificación de contacto enviada exitosamente a ${config.to}`);
  } catch (err: any) {
    console.error('[MICAPA Email] Error enviando correo a administración:', err);
    errorMessage = err.message || 'Error en envío a administración';
  }

  // 2. Enviar acuse de recibo al usuario si dejó correo electrónico válido
  if (payload.email && payload.email.includes('@')) {
    try {
      const userSubject = `Hemos recibido tu mensaje - MICAPA Comayagua`;
      const userHtml = buildUserConfirmationHtml(payload, config);

      await transporter.sendMail({
        from: config.from,
        to: payload.email.trim(),
        subject: userSubject,
        text: `Hola ${payload.name},\n\nHemos recibido con éxito tu mensaje en MICAPA. Estaremos orando por ti.\n\nMinisterio el Camino de la Palabra\nComayagua, Honduras`,
        html: userHtml,
      });

      userSent = true;
      console.log(`[MICAPA Email] Acuse de recibo enviado a ${payload.email}`);
    } catch (err: any) {
      console.error('[MICAPA Email] Error enviando acuse de recibo al usuario:', err);
      // No bloqueamos el éxito general si solo falló el acuse
    }
  }

  return {
    success: adminSent,
    adminSent,
    userSent,
    error: errorMessage,
  };
}

/**
 * Función para probar la conexión y enviar un correo de prueba desde el panel
 */
export async function sendTestEmail(testRecipient?: string): Promise<{ success: boolean; message: string }> {
  const config = getSmtpConfig();
  if (!config.isConfigured) {
    return {
      success: false,
      message: 'Faltan credenciales SMTP. Configura el usuario (correo) y la contraseña de aplicación.',
    };
  }

  const transporter = createMailTransporter();
  if (!transporter) {
    return { success: false, message: 'No se pudo inicializar el transportador SMTP.' };
  }

  const targetEmail = testRecipient?.trim() || config.to;

  try {
    await transporter.verify();
    await transporter.sendMail({
      from: config.from,
      to: targetEmail,
      subject: '[MICAPA] Verificación de Envío de Correo Exitosa',
      html: `
        <div style="font-family: sans-serif; padding: 24px; max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #07172c; margin-top: 0;">¡Conexión SMTP Exitosa!</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.5;">
            Este es un correo de prueba enviado desde la plataforma web oficial de <strong>MICAPA (Ministerio el Camino de la Palabra)</strong> en Comayagua.
          </p>
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; padding: 12px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;">
            El servicio de correos del formulario de contacto está 100% operativo y listo para recibir peticiones y mensajes.
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 16px;">
            Servidor: ${config.host} | Puerto: ${config.port} | Remitente: ${config.user}
          </p>
        </div>
      `,
    });

    return {
      success: true,
      message: `Correo de prueba enviado con éxito a ${targetEmail}.`,
    };
  } catch (err: any) {
    console.error('[MICAPA Email Test Error]:', err);
    return {
      success: false,
      message: `Error al conectar con el servidor SMTP: ${err.message || 'Verifica el usuario y contraseña de aplicación'}`,
    };
  }
}
