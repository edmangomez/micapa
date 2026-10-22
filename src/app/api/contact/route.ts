import { NextResponse } from 'next/server';
import { createContactMessage } from '@/lib/data';
import db from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { sendContactEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, type, message } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'El nombre es obligatorio.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'El mensaje o petición de oración es obligatorio.' },
        { status: 400 }
      );
    }

    // 1. Guardar siempre en la base de datos local
    const id = createContactMessage({
      name,
      email,
      phone,
      type,
      message,
    });

    // 2. Disparar envío de correo (notificación + acuse de recibo)
    let emailStatus: {
      adminSent: boolean;
      userSent: boolean;
      error?: string;
      reason?: string;
    } = { adminSent: false, userSent: false, reason: 'unprocessed' };
    try {
      emailStatus = await sendContactEmail({
        id,
        name: name.trim(),
        email: email?.trim(),
        phone: phone?.trim(),
        type: type?.trim(),
        message: message.trim(),
      });
    } catch (mailError) {
      console.error('Error no crítico al despachar correo electrónico:', mailError);
    }

    return NextResponse.json(
      {
        success: true,
        messageId: id,
        emailSent: emailStatus.adminSent,
        message: 'Tu mensaje ha sido recibido con éxito. Estaremos orando por ti.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error procesando formulario de contacto:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar el mensaje. Por favor intenta de nuevo.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const messages = db
      .prepare('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100')
      .all();

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
