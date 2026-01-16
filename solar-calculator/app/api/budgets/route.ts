import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Budget } from '@/types';

// GET - Listar orçamentos do usuário
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { data: budgets, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(budgets);
  } catch (error: any) {
    console.error('Erro ao buscar orçamentos:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar orçamentos' },
      { status: 500 }
    );
  }
}

// POST - Criar novo orçamento
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      client_name,
      client_email,
      client_phone,
      cep,
      cidade,
      estado,
      consumo_medio_mensal,
      pretend_aumentar,
      equipamentos_adicionais,
      calculation_result,
      status = 'rascunho',
      notes,
    } = body;

    // Validações
    if (!client_name || !cep || !cidade || !estado || !consumo_medio_mensal || !calculation_result) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    const { data: budget, error } = await supabase
      .from('budgets')
      .insert({
        user_id: user.id,
        client_name,
        client_email,
        client_phone,
        cep,
        cidade,
        estado,
        consumo_medio_mensal,
        pretend_aumentar: pretend_aumentar || false,
        equipamentos_adicionais: equipamentos_adicionais || [],
        calculation_result,
        status,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(budget, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar orçamento:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao criar orçamento' },
      { status: 500 }
    );
  }
}
