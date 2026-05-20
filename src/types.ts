/**
 * EduFinance - Gestão Escolar e Financeira
 * Definições de Tipos Globais do Sistema
 */

export interface Student {
  id: number;
  nome: string;
  email: string;
  matricula: string;
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE';
  data_nascimento: string;
  telefone: string;
  polo_id?: number | null;
  polo_nome?: string;
  course_id?: number | null;
  course_nome?: string;
  moodle_sync_status?: 'SINCRONIZADO' | 'PENDENTE' | 'ERRO';
  moodle_sync_date?: string | null;
}

export interface Class {
  id: number;
  nome: string;
  serie: string;
  turno: 'MATUTINO' | 'VESPERTINO' | 'NOTURNO';
}

export interface Grade {
  id: number;
  student_id: number;
  student_nome?: string;
  disciplina: string;
  nota: number;
  faltas: number;
}

export interface Transaction {
  id: number;
  student_id: number | null; // pode ser corporativo/despesa genérica
  student_nome?: string;
  tipo: 'RECEITA' | 'DESPESA';
  valor: number;
  descricao: string;
  data_vencimento: string;
  data_pagamento: string | null;
  status: 'PAGO' | 'PENDENTE' | 'ATRASADO';
  categoria?: string;
  fornecedor?: string;
  polo_id?: number;
}

export interface Lead {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  status: 'NOVO' | 'CONTACTADO' | 'NEGOCIACAO' | 'MATRICULADO' | 'PERDIDO';
  polo_id: number;
  course_id: number | null;
  origem: string;
  observacoes: string;
  data_cadastro: string;
}

export interface Polo {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  endereco: string;
  mec_codigo: string;
  status: 'ATIVO' | 'INATIVO';
  contato_telefone: string;
  asaas_token?: string;
  split_enabled?: boolean;
  split_porcentagem_repasse?: number;
  split_dia_vencimento?: number;
  cursos_moodle_apenas?: boolean;
}

export interface SystemUser {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  status: 'ATIVO' | 'SUSPENSO';
  data_cadastro: string;
  perm_alunos: 'LEITURA_ESCRITA' | 'APENAS_LEITURA' | 'SEM_ACESSO';
  perm_academico: 'LEITURA_ESCRITA' | 'APENAS_LEITURA' | 'SEM_ACESSO';
  perm_financeiro: 'LEITURA_ESCRITA' | 'APENAS_LEITURA' | 'SEM_ACESSO';
  perm_polos: 'LEITURA_ESCRITA' | 'APENAS_LEITURA' | 'SEM_ACESSO';
}

export interface DBConfigStatus {
  mode: 'MYSQL' | 'LOCAL';
  host?: string;
  database?: string;
  initialized: boolean;
  error?: string;
}

export interface Course {
  id: number;
  nome: string;
  carga_horaria: number;
  categoria: string;
  duracao_meses: number;
  preco_mensal: number;
  status: 'ATIVO' | 'INATIVO';
  moodle_course_id?: string | null;
}

export interface Ticket {
  id: number;
  student_id: number;
  student_nome?: string;
  assunto: string;
  categoria: 'FINANCEIRO' | 'ACADEMICO' | 'SECRETARIA' | 'TECNICO';
  descricao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
  status: 'ABERTO' | 'EM_ATENDIMENTO' | 'RESOLVIDO' | 'FECHADO';
  resposta_suporte?: string;
  data_abertura: string;
}

export interface MoodleSettings {
  url: string;
  token: string;
  auto_sync: boolean;
  connected: boolean;
}

