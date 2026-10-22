import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { sendTestEmail, getSmtpConfig } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { recipient } = body;

    const result = await sendTestEmail(recipient);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al ejecutar prueba de envío' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const config = getSmtpConfig();
    return NextResponse.json({
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.user,
      from: config.from,
      to: config.to,
      isConfigured: config.isConfigured,
      hasPassword: Boolean(config.pass),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
