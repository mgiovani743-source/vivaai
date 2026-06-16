import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, bot_field } = body;

    // Honeypot check: If the hidden field is filled out, it's likely a bot.
    if (bot_field) {
      // Return a fake success to trick the bot
      return NextResponse.json({ success: true, message: 'Fake success for bot' });
    }

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nome e e-mail são obrigatórios.' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Formato de e-mail inválido.' },
        { status: 400 }
      );
    }

    // Se Supabase não estiver configurado (desenvolvimento inicial sem env vars)
    // Retorna sucesso mockado para não travar a LP
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, mock: true });
    }

    const supabase = await createClient();

    // Insere no banco
    const { error } = await supabase.from('waitlist_leads').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      source: 'landing_v1',
    });

    if (error) {
      // 23505 é o código de erro Postgres para violação de unique constraint (e-mail duplicado)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'duplicate', message: 'Este e-mail já está na nossa lista! Fique de olho na sua caixa de entrada.' },
          { status: 409 } // Conflict
        );
      }

      console.error('Erro ao inserir lead na waitlist:', error);
      return NextResponse.json(
        { error: 'Erro ao processar sua solicitação. Tente novamente mais tarde.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erro na API /waitlist:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
