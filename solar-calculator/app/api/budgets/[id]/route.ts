import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Buscar orçamento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { data: budget, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    if (!budget) {
      return NextResponse.json({ error: 'Orçamento não encontrado' }, { status: 404 });
    }

    return NextResponse.json(budget);
  } catch (error: any) {
    console.error('Erro ao buscar orçamento:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar orçamento' },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar orçamento
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();

    const { data: budget, error } = await supabase
      .from('budgets')
      .update(body)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(budget);
  } catch (error: any) {
    console.error('Erro ao atualizar orçamento:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar orçamento' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar orçamento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao deletar orçamento:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao deletar orçamento' },
      { status: 500 }
    );
  }
}
