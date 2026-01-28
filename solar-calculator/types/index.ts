// Tipos para o formulário e cálculos
export interface FormData {
  // Etapa 1: Localização
  cep: string;        // Agora obrigatório e primeiro campo
  cidade: string;
  estado: string;

  // Etapa 2: Consumo
  consumoMedioMensal: number;

  // Etapa 3: Expansão
  pretendAumentar: boolean;
  equipamentosAdicionais?: EquipamentoAdicional[];
}

export interface EquipamentoAdicional {
  nome: string;
  potenciaWatts: number;
  quantidade: number;
  horasUsoDia: number;
}

export interface CalculationResult {
  potencia_kwp: number;
  quantidade_placas: number;
  placa_watts: number;
  inversor: string;
  custo_estimado: number;
  payback_anos: number;
  explicacao: string;
  consumo_total_kwh: number;
  irradiacao_media: number;
  producao_mensal_estimada?: number;
  producao_anual_estimada?: number;
  economia_mensal?: number;
  economia_25_anos?: number;
  co2_evitado_ano?: number;
  area_necessaria?: number;
}

export interface PDFData extends FormData {
  calculation: CalculationResult;
  dataGeracao: string;
}

// Tipos para o banco de dados (Supabase)
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'vendedor' | 'viewer';
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  cep: string;
  cidade: string;
  estado: string;
  consumo_medio_mensal: number;
  pretend_aumentar: boolean;
  equipamentos_adicionais?: EquipamentoAdicional[];
  calculation_result: CalculationResult;
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado';
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  user?: User;
}

export interface BudgetHistory {
  id: string;
  budget_id: string;
  user_id: string;
  action: 'criado' | 'editado' | 'enviado' | 'aprovado' | 'rejeitado';
  notes?: string;
  created_at: string;
}

// Tipos para formulários
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
