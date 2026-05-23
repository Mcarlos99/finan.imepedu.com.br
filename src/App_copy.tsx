import LoginPage from "./LoginPage";
import StudentLoginPage from "./StudentLoginPage";
import StudentPortal from "./StudentPortal";
import React, { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  Search, 
  Trash2, 
  BookOpen, 
  Settings, 
  Send, 
  Sparkles, 
  Copy, 
  Database, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Layers, 
  ArrowUpRight, 
  Server, 
  HelpCircle,
  Check,
  FileText,
  Menu,
  X,
  ShieldCheck,
  MapPin,
  Building2,
  Lock,
  Key,
  Award,
  IdCard,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Student, Class, Grade, Transaction, DBConfigStatus, Polo, SystemUser, Lead } from "./types";




export default function App() {

  // Sessão do usuário
  const [sessionToken, setSessionToken] = useState<string | null>(() => localStorage.getItem("session_token"));
  const [sessionRole, setSessionRole] = useState<"superadmin" | "polo" | null>(() => localStorage.getItem("session_role") as any);
  const [sessionEmail, setSessionEmail] = useState<string>(() => localStorage.getItem("session_email") || "");
  const [sessionNome, setSessionNome] = useState<string>(() => localStorage.getItem("session_nome") || "");
  const [sessionPoloId, setSessionPoloId] = useState<number | null>(() => { const v = localStorage.getItem("session_polo_id"); return v ? Number(v) : null; });
  const [sessionPoloNome, setSessionPoloNome] = useState<string | null>(() => localStorage.getItem("session_polo_nome") || null);

  useEffect(() => {
    if (sessionRole === "polo" && sessionPoloId) {
      setSelectedPoloContext(String(sessionPoloId));
    }
  }, [sessionRole, sessionPoloId]);



  // Estados Globais
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [polos, setPolos] = useState<Polo[]>([]);
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [moodleConfig, setMoodleConfig] = useState<any>({ url: "https://moodle.magalhaes-edu.com.br", token: "", auto_sync: true, connected: false });
  const [selectedPortalStudentId, setSelectedPortalStudentId] = useState<number | null>(null);
  
  // const estudantes 
  const [studentToken, setStudentToken] = useState<string | null>(() => localStorage.getItem("student_token"));
  const [studentId, setStudentId] = useState<number | null>(() => { const v = localStorage.getItem("student_id"); return v ? Number(v) : null; });
  const [studentNome, setStudentNome] = useState<string>(() => localStorage.getItem("student_nome") || "");
  const [studentEmail, setStudentEmail] = useState<string>(() => localStorage.getItem("student_email") || "");
  const [authScreen, setAuthScreen] = useState<"aluno" | "admin">("aluno");
    
    
  // const ASAAS
  const [showCobrancaModal, setShowCobrancaModal] = useState(false);
  const [cobrancaStudentId, setCobrancaStudentId] = useState<number | null>(null);
  const [cobrancaStudentNome, setCobrancaStudentNome] = useState("");
  const [cobrancaValor, setCobrancaValor] = useState("");
  const [cobrancaParcelas, setCobrancaParcelas] = useState("1");
  const [cobrancaDescricao, setCobrancaDescricao] = useState("");
  const [cobrancaVencimento, setCobrancaVencimento] = useState("");
  const [cobrancaLoading, setCobrancaLoading] = useState(false);
  const [cobrancaResult, setCobrancaResult] = useState<any | null>(null);
  const [cobrancaDesconto, setCobrancaDesconto] = useState("0");




  // Estados Customizados - CRM Leads, Isolamento por Polo e Fluxo de Caixa
  const [leads, setLeads] = useState<Lead[]>([]);
  // NOVO TIPO — suporta categorias e cursos na mesma lista
  const [moodleCourses, setMoodleCourses] = useState<{
    type: "category" | "course";
    id: number;
  // campos de categoria
    name?: string;
    parent?: number;
    depth?: number;
    coursecount?: number;
  // campos de curso
    fullname?: string;
    shortname?: string;
    categoryid?: number;
    categoryname?: string;
    visible?: number;
  }[]>([]);
  const [loadingMoodleCourses, setLoadingMoodleCourses] = useState(false);
  const [selectedPoloContext, setSelectedPoloContext] = useState<string>("MATRIZ"); // MATRIZ ou polo_id (string)
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [searchLead, setSearchLead] = useState("");
  const [newLead, setNewLead] = useState({
    nome: "", email: "", telefone: "", status: "NOVO" as any, polo_id: "", course_id: "", origem: "", observacoes: ""
  });
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [cashFlowCategoryFilter, setCashFlowCategoryFilter] = useState<string>("ALL");
  const [cashFlowSupplierFilter, setCashFlowSupplierFilter] = useState<string>("");
  
  const [dbStatus, setDbStatus] = useState<DBConfigStatus>({ mode: "LOCAL", initialized: false });
  const [activeTab, setActiveTab ] = useState<string>('dashboard');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estados dos Filtros / Buscas
  const [searchStudent, setSearchStudent] = useState("");
  const [searchTx, setSearchTx] = useState("");
  const [searchPolo, setSearchPolo] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchCourse, setSearchCourse] = useState("");
  const [searchTicket, setSearchTicket] = useState("");

  // Estados dos Formulários / Popups de Adição
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [showPoloModal, setShowPoloModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  // Estados de Imagens / Documentos da Secretaria Virtual
  const [activeStudentDoc, setActiveStudentDoc] = useState<{ type: 'diploma' | 'declaracao' | 'carteirinha', student: Student } | null>(null);

  // Estados de Edição
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [editingPolo, setEditingPolo] = useState<Polo | null>(null);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);

  // Dados dos Formulários
  const [newStudent, setNewStudent] = useState({
    nome: "", email: "", status: "ATIVO" as any,
    data_nascimento: "", telefone: "", polo_id: "", course_id: "", cpf: "",
  });

  // Estado para edição de aluno
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);


  const [newClass, setNewClass] = useState({
    nome: "", serie: "", turno: "MATUTINO" as any
  });
  const [newGrade, setNewGrade] = useState({
    student_id: "", disciplina: "Matemática", nota: "", faltas: "0"
  });
  const [newTx, setNewTx] = useState({
    student_id: "", tipo: "RECEITA" as any, valor: "", descricao: "", data_vencimento: "", status: "PENDENTE" as any, categoria: "", fornecedor: "", polo_id: ""
  });

const [newPolo, setNewPolo] = useState({
  nome: "",
  cidade: "",
  estado: "SP",
  endereco: "",
  mec_codigo: "",
  status: "ATIVO" as any,
  contato_telefone: "",
  asaas_token: "",
  split_enabled: true,
  split_porcentagem_repasse: 20,
  split_dia_vencimento: 25,
  cursos_moodle_apenas: true,
  polo_email: "",      // ← NOVO
  polo_senha: "",      // ← NOVO
});

const [poloSplits, setPoloSplits] = useState<{
  id?: number; polo_id?: number; nome: string; wallet_id: string; percentual: number;
}[]>([]);
const [loadingPoloSplits, setLoadingPoloSplits] = useState(false);
const [newSplit, setNewSplit] = useState({ nome: "", wallet_id: "", percentual: "" });


  const [selectedSplitMonth, setSelectedSplitMonth] = useState("2026-05");
  const [asaasSimulationResult, setAsaasSimulationResult] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    nome: "", email: "", cargo: "Coordenador", status: "ATIVO" as any,
    perm_alunos: "APENAS_LEITURA" as any,
    perm_academico: "SEM_ACESSO" as any,
    perm_financeiro: "SEM_ACESSO" as any,
    perm_polos: "SEM_ACESSO" as any
  });
  const [newCourse, setNewCourse] = useState({
    nome: "", carga_horaria: "120", categoria: "Extensão", duracao_meses: "3", preco_mensal: "150", status: "ATIVO" as any, moodle_course_id: ""
  });
  const [newTicket, setNewTicket] = useState({
    student_id: "", assunto: "", categoria: "SECRETARIA" as any, descricao: "", prioridade: "MEDIA" as any
  });

  // Estados do Chat com IA (Gemini)
  const [aiMessage, setAiMessage] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLog, setAiLog] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: "Olá Diretor! Eu sou o FinanAI. Posso ajudar na análise financeira escolar, simular cobranças, rascunhar mensagens ou criar relatórios pedagógicos focados em desempenho. O que deseja analisar hoje?" }
  ]);

  // Alerta de feedback temporário
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const triggerFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Carregar Dados
  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Chamar endpoints concorrentemente
      const [resStatus, resStds, resCls, resGrds, resTxs, resPolos, resUsers, resCourses, resTickets, resMoodle, resLeads] = await Promise.all([
        fetch("/api/db-status").then(r => r.json()),
        fetch("/api/students").then(r => r.json()),
        fetch("/api/classes").then(r => r.json()),
        fetch("/api/grades").then(r => r.json()),
        fetch("/api/transactions").then(r => r.json()),
        fetch("/api/polos").then(r => r.json()).catch(() => []),
        fetch("/api/users").then(r => r.json()).catch(() => []),
        fetch("/api/courses").then(r => r.json()).catch(() => []),
        fetch("/api/tickets").then(r => r.json()).catch(() => []),
        fetch("/api/moodle/config").then(r => r.json()).catch(() => ({})),
        fetch("/api/leads").then(r => r.json()).catch(() => [])
      ]);

      setDbStatus(resStatus);
      setStudents(resStds);
      setClasses(resCls);
      setGrades(resGrds);
      setTransactions(resTxs);
      setPolos(resPolos);
      setUsers(resUsers);
      setCourses(resCourses || []);
      setTickets(resTickets || []);
      setMoodleConfig(resMoodle || { url: "https://moodle.magalhaes-edu.com.br", token: "", auto_sync: true, connected: false });
      setLeads(resLeads || []);
    } catch (e: any) {
      console.error("Falha ao obter dados do servidor:", e);
      triggerFeedback('error', "Erro de conexão com a API do servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  loadAllData();
  loadMoodleCourses();
  }, []);

  const loadMoodleCourses = async () => {
  try {
    setLoadingMoodleCourses(true);
    const res = await fetch("/api/moodle/courses");
    const data = await res.json();
    if (Array.isArray(data)) {
      setMoodleCourses(data.filter((c: any) => c.visible === 1));
    }
  } catch (e) {
    console.error("Erro ao buscar cursos do Moodle:", e);
  } finally {
    setLoadingMoodleCourses(false);
  }
  };

  // validação de CPF no frontend
  const validarCPFLocal = (cpf: string): boolean => {
  const c = cpf.replace(/\D/g, "");
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(c[i]) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev >= 10) rev = 0;
  if (rev !== parseInt(c[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(c[i]) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev >= 10) rev = 0;
  return rev === parseInt(c[10]);
};


  //gerenciar splits

const loadPoloSplits = async (poloId: number) => {
  try {
    setLoadingPoloSplits(true);
    const res = await fetch(`/api/polos/${poloId}/splits`, {
      headers: { "x-session-token": sessionToken || "" },
    });
    const data = await res.json();
    setPoloSplits(Array.isArray(data) ? data : []);
  } catch { setPoloSplits([]); }
  finally { setLoadingPoloSplits(false); }
};
 
const handleAddSplit = async (poloId: number) => {
  if (!newSplit.nome || !newSplit.wallet_id || !newSplit.percentual) {
    triggerFeedback("error", "Preencha nome, Wallet ID e percentual."); return;
  }
  try {
    const res = await fetch(`/api/polos/${poloId}/splits`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-session-token": sessionToken || "" },
      body: JSON.stringify({ nome: newSplit.nome, wallet_id: newSplit.wallet_id, percentual: Number(newSplit.percentual) }),
    });
    if (res.ok) {
      triggerFeedback("success", "Split adicionado!");
      setNewSplit({ nome: "", wallet_id: "", percentual: "" });
      loadPoloSplits(poloId);
    } else {
      const err = await res.json();
      triggerFeedback("error", err.error || "Erro ao adicionar split.");
    }
  } catch { triggerFeedback("error", "Erro de rede."); }
};
 
const handleDeleteSplit = async (splitId: number, poloId: number) => {
  try {
    const res = await fetch(`/api/polos/splits/${splitId}`, {
      method: "DELETE",
      headers: { "x-session-token": sessionToken || "" },
    });
    if (res.ok) { triggerFeedback("success", "Split removido!"); loadPoloSplits(poloId); }
    else { triggerFeedback("error", "Erro ao remover split."); }
  } catch { triggerFeedback("error", "Erro de rede."); }
};




  // SUBMISSÃO DE FORMULÁRIOS

const handleEditStudent = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingStudent) return;
  try {
    const res = await fetch(`/api/students/${editingStudent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-session-token": sessionToken || "" },
      body: JSON.stringify({
        nome: editingStudent.nome,
        email: editingStudent.email,
        telefone: editingStudent.telefone,
        data_nascimento: editingStudent.data_nascimento || null,
        cpf: editingStudent.cpf,
        polo_id: editingStudent.polo_id || null,
        course_id: editingStudent.course_id || null,
        status: editingStudent.status,
      }),
    });
    if (res.ok) {
      triggerFeedback("success", "Aluno atualizado com sucesso!");
      setShowEditStudentModal(false);
      setEditingStudent(null);
      loadAllData();
    } else {
      const err = await res.json();
      triggerFeedback("error", err.error || "Erro ao atualizar aluno.");
    }
  } catch { triggerFeedback("error", "Erro de rede."); }
};
 
const handleChangeStudentStatus = async (id: number, status: string) => {
  try {
    const res = await fetch(`/api/students/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-session-token": sessionToken || "" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      triggerFeedback("success", `Status alterado para ${status}!`);
      loadAllData();
    } else {
      triggerFeedback("error", "Erro ao alterar status.");
    }
  } catch { triggerFeedback("error", "Erro de rede."); }
};



const handleCreateStudent = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newStudent.nome || !newStudent.email || !newStudent.cpf) {
    triggerFeedback("error", "Por favor, preencha os campos obrigatórios.");
    return;
  }
  if (!validarCPFLocal(newStudent.cpf)) {
    triggerFeedback("error", "CPF inválido. Verifique e tente novamente.");
    return;
  }
 
  // Se for polo logado, usar o polo da sessão automaticamente
  const poloIdFinal = !isSuperAdmin && sessionPoloId
    ? sessionPoloId
    : newStudent.polo_id ? Number(newStudent.polo_id) : null;
 
  const isCategorySelection = newStudent.course_id?.startsWith("cat_");
  const courseIdForDB = isCategorySelection || !newStudent.course_id
    ? null : Number(newStudent.course_id);
 
  try {
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-session-token": sessionToken || "" },
      body: JSON.stringify({
        nome: newStudent.nome,
        email: newStudent.email,
        status: "ATIVO",
        data_nascimento: newStudent.data_nascimento || null,
        telefone: newStudent.telefone,
        polo_id: poloIdFinal,
        course_id: courseIdForDB,
        cpf: newStudent.cpf,
          course_nome_hint: (() => {
    const val = newStudent.course_id;
    if (!val) return undefined;
    if (val.startsWith("cat_")) {
      const catId = Number(val.replace("cat_", ""));
      const cat = moodleCourses.find(i => i.type === "category" && i.id === catId);
      return (cat as any)?.name || undefined;
    } else {
      const course = moodleCourses.find(i => i.type === "course" && i.id === Number(val));
      return (course as any)?.fullname || undefined;
    }
  })(),
      }),
    });
 
    if (res.ok) {
      const createdStudent = await res.json();
      triggerFeedback("success", `Aluno cadastrado! Matrícula: ${createdStudent.matricula}`);
      setShowStudentModal(false);
 
      const selectedCourseId = newStudent.course_id;
      const studentNomeParaCobranca = newStudent.nome;
 
      setNewStudent({ nome: "", email: "", status: "ATIVO", data_nascimento: "", telefone: "", polo_id: "", course_id: "", cpf: "" });
      loadAllData();
 
      if (selectedCourseId && createdStudent.id) {
        await handleEnrollInMoodle(createdStudent.id, selectedCourseId);
      }
 
      // Abrir modal de cobrança
      
      setCobrancaDescricao(`Matrícula — ${createdStudent.course_nome || "Curso"}`);

      setCobrancaStudentId(createdStudent.id);
      setCobrancaStudentNome(studentNomeParaCobranca);
      
      
      
      setCobrancaVencimento(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
      setCobrancaValor("");
      setCobrancaParcelas("1");
      setCobrancaDesconto("0");
      setCobrancaResult(null);
      setShowCobrancaModal(true);
    } else {
      const err = await res.json();
      triggerFeedback("error", err.error || "Falha ao registrar aluno.");
    }
  } catch {
    triggerFeedback("error", "Erro de rede ao enviar.");
  }
};
  
  
  const handleLogout = async () => {
  if (sessionToken) {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "x-session-token": sessionToken },
    }).catch(() => {});
  }
  localStorage.clear();
  setSessionToken(null);
  setSessionRole(null);
  setSessionEmail("");
  setSessionNome("");
  setSessionPoloId(null);
  setSessionPoloNome(null);
};

const handleStudentLogout = () => {
  localStorage.removeItem("student_token");
  localStorage.removeItem("student_id");
  localStorage.removeItem("student_nome");
  localStorage.removeItem("student_email");
  setStudentToken(null);
  setStudentId(null);
  setStudentNome("");
  setStudentEmail("");
  setAuthScreen("aluno"); // ← voltar para tela do aluno
};
 
// Helper — adiciona token em todos os fetches
const authFetch = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "x-session-token": sessionToken || "",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
  });
};
 
// Abas visíveis por perfil
const isSuperAdmin = sessionRole === "superadmin";
const visibleTabs = isSuperAdmin
  ? undefined // todas
  : ["dashboard", "alunos", "crm-leads", "cadastro-cursos", "academico", "financeiro", "secretaria-virtual", "gerenciamento-tickets", "portal-aluno"];
 
  
  

  // --- GESTÃO E EVENTOS DE LEADS (CRM) ---

  const handleCreateOrUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.nome) {
      triggerFeedback('error', "O nome do Lead é obrigatório.");
      return;
    }
    try {
      const payload = {
        ...newLead,
        polo_id: newLead.polo_id ? Number(newLead.polo_id) : 1,
        course_id: newLead.course_id ? Number(newLead.course_id) : null
      };

      const url = editingLead ? `/api/leads/${editingLead.id}` : "/api/leads";
      const method = editingLead ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        triggerFeedback('success', editingLead ? "Lead atualizado com sucesso!" : "Lead cadastrado com sucesso!");
        setShowLeadModal(false);
        setEditingLead(null);
        setNewLead({
          nome: "", email: "", telefone: "", status: "NOVO", polo_id: "", course_id: "", origem: "", observacoes: ""
        });
        loadAllData();
      } else {
        const err = await res.json();
        triggerFeedback('error', err.error || "Falha ao registrar lead.");
      }
    } catch {
      triggerFeedback('error', "Erro de rede ao salvar lead.");
    }
  };

  const handleUpdateLeadStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        triggerFeedback('success', `Status do Lead alterado para ${newStatus}!`);
        loadAllData();
      } else {
        triggerFeedback('error', "Falha ao atualizar status do lead.");
      }
    } catch {
      triggerFeedback('error', "Erro de rede.");
    }
  };

  const handleDeleteLead = async (id: number) => {
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerFeedback('success', "Lead excluído com sucesso!");
        loadAllData();
      } else {
        triggerFeedback('error', "Falha ao excluir lead.");
      }
    } catch {
      triggerFeedback('error', "Erro de rede.");
    }
  };

  const handleConvertToStudent = async (lead: Lead) => {
    try {
      const generatedMatricula = "MAT" + new Date().getFullYear() + String(Math.floor(10000 + Math.random() * 90000));
      const resStd = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: lead.nome,
          email: lead.email || `${lead.nome.toLowerCase().replace(/\s+/g, '')}@escola.com.br`,
          matricula: generatedMatricula,
          status: "ATIVO",
          data_nascimento: "2000-01-01",
          telefone: lead.telefone || "",
          polo_id: lead.polo_id,
          course_id: lead.course_id
        })
      });

      if (!resStd.ok) {
        const err = await resStd.json();
        triggerFeedback('error', err.error || "Falha ao matricular aluno.");
        return;
      }

      await fetch(`/api/leads/${lead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "MATRICULADO" })
      });

      triggerFeedback('success', `Sucesso! Lead convertido para Aluno sob matrícula ${generatedMatricula}.`);
      loadAllData();
    } catch {
      triggerFeedback('error', "Erro de rede na conversão.");
    }
  };

  // --- SUBMISSÃO DE CURSOS (CADASTRO COOP) ---
  const handleCreateOrUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.nome) {
      triggerFeedback('error', "O nome do curso é obrigatório.");
      return;
    }
    try {
      const isEdit = !!editingCourse;
      const url = isEdit ? `/api/courses/${editingCourse.id}` : "/api/courses";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCourse,
          carga_horaria: Number(newCourse.carga_horaria || 0),
          duracao_meses: Number(newCourse.duracao_meses || 1),
          preco_mensal: Number(newCourse.preco_mensal || 0)
        })
      });

      if (res.ok) {
        triggerFeedback('success', isEdit ? "Curso atualizado com sucesso!" : "Curso cadastrado com sucesso!");
        setShowCourseModal(false);
        setEditingCourse(null);
        setNewCourse({ nome: "", carga_horaria: "120", categoria: "Extensão", duracao_meses: "3", preco_mensal: "150", status: "ATIVO", moodle_course_id: "" });
        loadAllData();
      } else {
        const err = await res.json();
        triggerFeedback('error', err.error || "Erro ao salvar curso.");
      }
    } catch (err) {
      triggerFeedback('error', "Erro de conexão ao salvar curso.");
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este curso?")) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerFeedback('success', "Curso excluído com sucesso!");
        loadAllData();
      } else {
        const err = await res.json();
        triggerFeedback('error', err.error || "Não foi possível excluir.");
      }
    } catch (err) {
      triggerFeedback('error', "Erro de conexão ao remover curso.");
    }
  };

  // --- SUBMISSÃO DE TICKETS (SUPORTE HELP-DESK DE ACORDO COM INTENÇÃO) ---
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.student_id || !newTicket.assunto || !newTicket.descricao) {
      triggerFeedback('error', "Preencha todos os campos obrigatórios.");
      return;
    }
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTicket,
          student_id: Number(newTicket.student_id)
        })
      });
      if (res.ok) {
        triggerFeedback('success', "Ticket aberto com sucesso! A secretaria já foi notificada.");
        setShowTicketModal(false);
        setNewTicket({ student_id: selectedPortalStudentId ? String(selectedPortalStudentId) : "", assunto: "", categoria: "SECRETARIA", descricao: "", prioridade: "MEDIA" });
        loadAllData();
      } else {
        const err = await res.json();
        triggerFeedback('error', err.error || "Erro ao criar ticket.");
      }
    } catch (err) {
      triggerFeedback('error', "Erro de rede ao abrir ticket.");
    }
  };

  const handleReplyTicket = async (id: number, resposta: string, status: string = "RESOLVIDO") => {
    if (!resposta.trim()) {
      triggerFeedback('error', "Preencha a resposta para enviar.");
      return;
    }
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resposta_suporte: resposta, status })
      });
      if (res.ok) {
        triggerFeedback('success', "Atendimento de ticket registrado!");
        loadAllData();
      } else {
        const err = await res.json();
        triggerFeedback('error', err.error || "Erro ao responder ticket.");
      }
    } catch (err) {
      triggerFeedback('error', "Erro de conexão de rede.");
    }
  };

const handleGerarCobranca = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!cobrancaStudentId || !cobrancaValor || !cobrancaParcelas) {
    triggerFeedback("error", "Preencha todos os campos da cobrança.");
    return;
  }
  setCobrancaLoading(true);
  setCobrancaResult(null);
  try {
    const res = await fetch("/api/asaas/gerar-cobranca", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-session-token": sessionToken || "" },
      body: JSON.stringify({
        student_id: cobrancaStudentId,
        valor_total: Number(cobrancaValor),
        num_parcelas: Number(cobrancaParcelas),
        descricao: cobrancaDescricao || "Mensalidade",
        vencimento_primeira: cobrancaVencimento || undefined,
        desconto_fixo: Number(cobrancaDesconto) > 0 ? Number(cobrancaDesconto) : undefined,
    }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setCobrancaResult(data);
      loadAllData();
    } else {
      triggerFeedback("error", data.error || "Erro ao gerar cobrança.");
    }
  } catch {
    triggerFeedback("error", "Erro de rede ao gerar cobrança.");
  } finally {
    setCobrancaLoading(false);
  }
};



const handleEnrollInMoodle = async (studentId: number, courseIdOrCatId: string | number) => {
  const value = String(courseIdOrCatId);
 
  if (value.startsWith("cat_")) {
    // Matricular em TODOS os cursos da categoria
    const catId = Number(value.replace("cat_", ""));
    const catCourses = moodleCourses.filter(
      (i) => i.type === "course" && i.categoryid === catId
    );
 
    if (catCourses.length === 0) {
      triggerFeedback("error", "Nenhum curso encontrado nesta categoria.");
      return;
    }
 
    triggerFeedback("success", `Matriculando em ${catCourses.length} cursos da categoria...`);
 
    let successCount = 0;
    let errorCount = 0;
 
    for (const course of catCourses) {
      try {
        const res = await fetch("/api/moodle/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: studentId,
            moodle_course_id: course.id,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          successCount++;
        } else {
          errorCount++;
          console.warn(`Erro ao matricular em ${course.fullname}:`, data.error);
        }
      } catch (e) {
        errorCount++;
        console.error(`Erro de rede ao matricular em ${course.fullname}:`, e);
      }
    }
 
    if (successCount > 0 && errorCount === 0) {
      triggerFeedback("success", `✅ Matriculado em todos os ${successCount} cursos da categoria!`);
    } else if (successCount > 0) {
      triggerFeedback("success", `✅ ${successCount} cursos OK, ${errorCount} com erro. Verifique os logs.`);
    } else {
      triggerFeedback("error", `Falha ao matricular nos cursos da categoria.`);
    }
 
    loadAllData();
 
  } else {
    // Matricular em curso individual (comportamento original)
    try {
      const res = await fetch("/api/moodle/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          moodle_course_id: Number(value),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerFeedback("success", `✅ ${data.message}`);
        loadAllData();
      } else {
        triggerFeedback("error", data.error || "Erro ao matricular no AVA.");
      }
    } catch (e) {
      triggerFeedback("error", "Erro de rede ao matricular no Moodle.");
    }
  }
};

  // --- CONFIG GESTÃO NO MOODLE ---
  const handleSaveMoodleConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/moodle/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...moodleConfig,
          connected: true
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setMoodleConfig(updated);
        triggerFeedback('success', "Configurações do Moodle API integradas!");
        loadAllData();
      } else {
        triggerFeedback('error', "Falha ao gravar configurações do Moodle.");
      }
    } catch (err) {
      triggerFeedback('error', "Erro de rede com o Moodle API.");
    }
  };

  // --- DISPARAR SINCRONIA DO MOODLE VIA API ---
const handleMoodleSync = async (studentId: number) => {
  const student = students.find((s) => s.id === studentId);
  if (!student) {
    triggerFeedback("error", "Aluno não encontrado.");
    return;
  }
  if (!student.course_id) {
    triggerFeedback(
      "error",
      "Aluno sem curso vinculado. Edite o aluno e selecione um curso ou categoria do AVA."
    );
    return;
  }
  triggerFeedback("success", "Iniciando sincronização com o AVA Moodle...");
  await handleEnrollInMoodle(studentId, Number(student.course_id));
};

  // --- PAGAR TRANSACAO / MENSALIDADE INTEGRADA ---
  const handlePayInvoice = async (invoiceId: number) => {
    try {
      const res = await fetch(`/api/transactions/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAGO", data_pagamento: new Date().toISOString().split("T")[0] })
      });
      if (res.ok) {
        triggerFeedback('success', "Mensalidade quitada com baixa imediata no financeiro!");
        loadAllData();
      } else {
        triggerFeedback('error', "Erro ao processar baixa do boleto.");
      }
    } catch (err) {
      triggerFeedback('error', "Sem conexão de gateway.");
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.nome || !newClass.serie || !newClass.turno) {
      triggerFeedback('error', "Preencha todos os campos da turma.");
      return;
    }
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClass)
      });
      if (res.ok) {
        triggerFeedback('success', "Turma criada com sucesso!");
        setShowClassModal(false);
        setNewClass({ nome: "", serie: "", turno: "MATUTINO" });
        loadAllData();
      }
    } catch (err) {
      triggerFeedback('error', "Erro de rede ao salvar turma.");
    }
  };

  const handleCreateGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrade.student_id || !newGrade.disciplina || !newGrade.nota) {
      triggerFeedback('error', "Preencha todos os campos de avaliação.");
      return;
    }
    try {
      const res = await fetch("/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: Number(newGrade.student_id),
          disciplina: newGrade.disciplina,
          nota: Number(newGrade.nota),
          faltas: Number(newGrade.faltas || 0)
        })
      });
      if (res.ok) {
        triggerFeedback('success', "Nota acadêmica registrada!");
        setShowGradeModal(false);
        setNewGrade({ student_id: "", disciplina: "Matemática", nota: "", faltas: "0" });
        loadAllData();
      }
    } catch (err) {
      triggerFeedback('error', "Erro de conexão ao inserir nota.");
    }
  };

  const handleCreateTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.tipo || !newTx.valor || !newTx.descricao || !newTx.data_vencimento) {
      triggerFeedback('error', "Por favor, preencha os dados da transação financeira.");
      return;
    }
    try {
      const pId = newTx.polo_id ? Number(newTx.polo_id) : (selectedPoloContext !== "MATRIZ" ? Number(selectedPoloContext) : 1);
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: newTx.student_id ? Number(newTx.student_id) : null,
          tipo: newTx.tipo,
          valor: Number(newTx.valor),
          descricao: newTx.descricao,
          data_vencimento: newTx.data_vencimento,
          status: newTx.status,
          categoria: newTx.categoria || (newTx.tipo === "RECEITA" ? "MENSALIDADE" : "DIVERSOS"),
          fornecedor: newTx.fornecedor || (newTx.tipo === "RECEITA" ? "Aluno / Mensalidade" : "Fornecedor de Serviço"),
          polo_id: pId
        })
      });
      if (res.ok) {
        triggerFeedback('success', "Lançamento financeiro concluído!");
        setShowTxModal(false);
        setNewTx({ student_id: "", tipo: "RECEITA", valor: "", descricao: "", data_vencimento: "", status: "PENDENTE", categoria: "", fornecedor: "", polo_id: "" });
        loadAllData();
      }
    } catch (err) {
      triggerFeedback('error', "Erro ao processar lançamento de tesouraria.");
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm("Tem certeza que deseja desvincular e excluir este aluno de forma irrevogável? Todas as suas notas e transações financeiras serão desvinculadas.")) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerFeedback('success', "Aluno removido com sucesso do sistema.");
        loadAllData();
      }
    } catch (err) {
      triggerFeedback('error', "Falha ao remover o estudante selecionado.");
    }
  };

  const handleUpdateTransactionStatus = async (id: number, status: "PAGO" | "PENDENTE" | "ATRASADO") => {
    try {
      const data_pagamento = status === "PAGO" ? new Date().toISOString().split('T')[0] : null;
      const res = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, data_pagamento })
      });
      if (res.ok) {
        triggerFeedback('success', "Baixa da fatura reprocessada no caixa!");
        loadAllData();
      } else {
        triggerFeedback('error', "Erro ao reajustar faturamento.");
      }
    } catch (err) {
      triggerFeedback('error', "Erro ao processar baixa.");
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm("Tem certeza que deseja estornar/excluir este lançamento financeiro?")) return;
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerFeedback('success', "Lançamento de fluxo de caixa estornado com sucesso.");
        loadAllData();
      }
    } catch (err) {
      triggerFeedback('error', "Falha ao apagar lançamento.");
    }
  };

  const handleDeleteGrade = async (id: number) => {
    if (!confirm("Deseja mesmo remover esta nota lançada?")) return;
    try {
      const res = await fetch(`/api/grades/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerFeedback('success', "Avaliação escolar removida com sucesso do boletim.");
        loadAllData();
      }
    } catch (err) {
      triggerFeedback('error', "Falha ao apagar nota avaliativa.");
    }
  };

  // OPERAÇÕES DO CADASTRO DE POLOS
  const handleCreateOrUpdatePolo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolo.nome || !newPolo.cidade) {
      triggerFeedback('error', "Nome e Cidade são obrigatórios.");
      return;
    }
    try {
      const url = editingPolo ? `/api/polos/${editingPolo.id}` : "/api/polos";
      const method = editingPolo ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPolo)
      });
      if (res.ok) {
        triggerFeedback('success', editingPolo ? "Polo modificado com sucesso!" : "Novo Polo registrado!");
        setShowPoloModal(false);
        setEditingPolo(null);
setNewPolo({
  nome: "",
  cidade: "",
  estado: "SP",
  endereco: "",
  mec_codigo: "",
  status: "ATIVO" as any,
  contato_telefone: "",
  asaas_token: "",
  split_enabled: true,
  split_porcentagem_repasse: 20,
  split_dia_vencimento: 25,
  cursos_moodle_apenas: true,
  polo_email: "",   // ← NOVO
  polo_senha: "",   // ← NOVO
});
        loadAllData();
      } else {
        triggerFeedback('error', "Erro no servidor ao salvar Polo.");
      }
    } catch (err) {
      triggerFeedback('error', "Erro de rede ao salvar Polo.");
    }
  };

  const handleDeletePolo = async (id: number) => {
    if (!confirm("Tem certeza que deseja desvincular este Polo? Alunos deste polo voltarão ao Polo Principal.")) return;
    try {
      const res = await fetch(`/api/polos/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerFeedback('success', "Polo removido com sucesso de sua rede.");
        loadAllData();
      }
    } catch (err) {
      triggerFeedback('error', "Falha de rede ao excluir o Polo.");
    }
  };

  // OPERAÇÕES DE USUÁRIOS E CONTROLE DE ACESSOS (PERMISSÕES)
  const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.nome || !newUser.email) {
      triggerFeedback('error', "Nome e E-mail são obrigatórios.");
      return;
    }
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        triggerFeedback('success', editingUser ? "Configurações do operador atualizadas!" : "Colaborador convidado com sucesso!");
        setShowUserModal(false);
        setEditingUser(null);
        setNewUser({
          nome: "", email: "", cargo: "Coordenador", status: "ATIVO" as any,
          perm_alunos: "APENAS_LEITURA" as any,
          perm_academico: "SEM_ACESSO" as any,
          perm_financeiro: "SEM_ACESSO" as any,
          perm_polos: "SEM_ACESSO" as any
        });
        loadAllData();
      } else {
        triggerFeedback('error', "Erro ao processar as credenciais do usuário.");
      }
    } catch (err) {
      triggerFeedback('error', "Erro de conexão ao salvar operador.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Deseja mesmo revogar permanentemente o acesso deste usuário operador do sistema? Ele será bloqueado imediatamente.")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerFeedback('success', "Acesso do usuário revogado e excluído com sucesso.");
        loadAllData();
      }
    } catch (err) {
      triggerFeedback('error', "Erro ao revogar acesso do colaborador.");
    }
  };

  // CONSULTA À INTELIGENCIA ARTIFICIAL (GEMINI)
  const askAI = async (customPrompt?: string) => {
    const textToSend = customPrompt || aiMessage;
    if (!textToSend.trim()) return;

    setAiLoading(true);
    setAiLog(prev => [...prev, { role: 'user', text: textToSend }]);
    setAiMessage("");

    // Agregar contexto resumido do banco de dados para alimentar a IA
    const systemContext = {
      db_mode: dbStatus.mode,
      total_students: students.length,
      total_classes: classes.length,
      students_list: students.map(s => ({ nome: s.nome, matricula: s.matricula, status: s.status })),
      latest_transactions: transactions.slice(0, 10).map(t => ({
        tipo: t.tipo, valor: t.valor, descricao: t.descricao, status: t.status, vencimento: t.data_vencimento
      })),
      academic_avg: grades.length > 0 ? (grades.reduce((acc, current) => acc + Number(current.nota), 0) / grades.length).toFixed(2) : "Sem dados"
    };

    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          context: systemContext
        })
      });

      const result = await res.json();
      if (res.ok && result.text) {
        setAiLog(prev => [...prev, { role: 'assistant', text: result.text }]);
      } else {
        setAiLog(prev => [...prev, { role: 'assistant', text: `❌ Ops! Erro no retorno da Inteligência Artificial: ${result.error || 'Nenhum texto gerado.'}` }]);
      }
    } catch (err: any) {
      setAiLog(prev => [...prev, { role: 'assistant', text: `❌ Erro crítico de rede ao se comunicar com o motor Gemini: ${err.message}` }]);
    } finally {
      setAiLoading(false);
    }
  };

  // CÁLCULOS FINANCEIROS PARA O PAINEL GERAL (CONFORME POLO SELECIONADO)
  const calculateFinances = () => {
    let receitaConfirmada = 0;
    let inadimplenciaTotal = 0;
    let contasPagarPendentes = 0;
    let despesasPagas = 0;

    transactions.forEach(t => {
      // Filtrar por Polo se não for visualização global da Matriz
      if (selectedPoloContext !== "MATRIZ") {
        if (Number(t.polo_id) !== Number(selectedPoloContext)) {
          return;
        }
      }
      const v = Number(t.valor);
      if (t.tipo === "RECEITA") {
        if (t.status === "PAGO") {
          receitaConfirmada += v;
        } else if (t.status === "ATRASADO") {
          inadimplenciaTotal += v;
        }
      } else { // DESPESAS
        if (t.status === "PAGO") {
          despesasPagas += v;
        } else {
          contasPagarPendentes += v;
        }
      }
    });

    const saldoAtual = receitaConfirmada - despesasPagas;

    return { receitaConfirmada, inadimplenciaTotal, contasPagarPendentes, despesasPagas, saldoAtual };
  };

  const financeMeters = calculateFinances();

  // Filtragem de Dados Visualizados com base no Contexto de Polo e Filtros Ativos
  const filteredStudents = students.filter(s => {
    // Isolamento de Polo administrativo
    if (selectedPoloContext !== "MATRIZ") {
      if (Number(s.polo_id) !== Number(selectedPoloContext)) return false;
    }
    
    return s.nome.toLowerCase().includes(searchStudent.toLowerCase()) || 
      s.matricula.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.email.toLowerCase().includes(searchStudent.toLowerCase());
  });

  const filteredTransactions = transactions.filter(t => {
    // Isolamento de Polo para fluxo de caixa
    if (selectedPoloContext !== "MATRIZ") {
      if (Number(t.polo_id) !== Number(selectedPoloContext)) return false;
    }

    // Filtros Adicionais da aba de Fluxo de Caixa
    if (cashFlowCategoryFilter !== "ALL") {
      if (t.categoria !== cashFlowCategoryFilter) return false;
    }
    if (cashFlowSupplierFilter.trim() !== "") {
      const matchSupplier = (t.fornecedor || "").toLowerCase().includes(cashFlowSupplierFilter.toLowerCase());
      if (!matchSupplier) return false;
    }

    return t.descricao.toLowerCase().includes(searchTx.toLowerCase()) ||
      (t.student_nome?.toLowerCase() || "").includes(searchTx.toLowerCase());
  });

  const filteredLeads = leads.filter(l => {
    // Isolamento do Polo para os Leads
    if (selectedPoloContext !== "MATRIZ") {
      if (Number(l.polo_id) !== Number(selectedPoloContext)) return false;
    }

    return l.nome.toLowerCase().includes(searchLead.toLowerCase()) ||
      l.email.toLowerCase().includes(searchLead.toLowerCase()) ||
      (l.telefone || "").includes(searchLead) ||
      (l.origem || "").toLowerCase().includes(searchLead.toLowerCase());
  });

  const navItems = [
    { id: "dashboard", label: "Painel Geral", icon: Layers },
    { id: "alunos", label: "Alunos & Matrículas", icon: Users },
    { id: "crm-leads", label: "CRM & Captação (Leads)", icon: Users, badge: "Lead" },
    { id: "cadastro-cursos", label: "Cadastro de Cursos", icon: BookOpen },
    { id: "academico", label: "Desempenho Acadêmico", icon: GraduationCap },
    { id: "financeiro", label: "Caixa & Tesouraria", icon: DollarSign },
    { id: "secretaria-virtual", label: "Secretaria Virtual", icon: Award },
    { id: "gerenciamento-tickets", label: "Suporte & Tickets", icon: HelpCircle },
    { id: "portal-aluno", label: "Portal do Aluno", icon: IdCard },
    ...(isSuperAdmin ? [
      { id: "moodle-config", label: "Integração Moodle", icon: Globe },
      { id: "cadastro-polos", label: "Cadastro de Polos", icon: MapPin },
      { id: "usuarios-permissoes", label: "Controle de Acessos", icon: ShieldCheck },
      { id: "ia-consultor", label: "IA Consultor Escolar", icon: Sparkles, badge: "Gemini" },
      { id: "vps-deploy", label: "Hospedagem VPS", icon: Server },
    ] : []),
  ].filter(tab => !visibleTabs || visibleTabs.includes(tab.id));

// Guard 1 — aluno já logado → portal do aluno
if (studentToken && studentId) {
  return (
    <StudentPortal
      token={studentToken}
      studentId={studentId}
      studentNome={studentNome}
      email={studentEmail}
      onLogout={handleStudentLogout}
    />
  );
}
 
// Guard 2 — admin/polo já logado → sistema completo
if (sessionToken && sessionRole) {
  // continua para o return principal do App
} else if (authScreen === "admin") {
  // Tela de login admin/polo
  return (
    <LoginPage
      onLogin={(s) => {
        setSessionToken(s.token);
        setSessionRole(s.role);
        setSessionEmail(s.email);
        setSessionNome(s.nome);
        setSessionPoloId(s.poloId);
        setSessionPoloNome(s.poloNome);
      }}
      onShowStudentLogin={() => setAuthScreen("aluno")}
    />
  );
} else {
  // Tela de login do aluno (padrão)
  return (
    <StudentLoginPage
      onLogin={(s) => {
        setStudentToken(s.token);
        setStudentId(s.studentId);
        setStudentNome(s.studentNome);
        setStudentEmail(s.email);
      }}
      onBackToAdmin={() => setAuthScreen("admin")}
    />
  );
}

  return (
     

  <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row antialiased">
      
      {/* NOTIFICAÇÃO DE FEEDBACK */}
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 16 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border ${
              feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
            <span className="font-medium text-sm">{feedback.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MENU LATERAL - DESKTOP */}
      <aside className="hidden md:flex md:flex-col w-64 bg-slate-905 bg-slate-950 text-slate-300 border-r border-slate-900 shrink-0">
        <div className="p-5 border-b border-slate-900 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-inner shadow-indigo-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold font-display tracking-tight text-white leading-none">EduFinance</h1>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full font-semibold">v1.2</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-none font-medium">Magalhães Educação</p>
            </div>
          </div>

          {/* Banco de Dados Status */}
          <div className={`px-2.5 py-2.5 rounded-xl border text-[11px] font-medium flex items-center gap-2 ${
            dbStatus.mode === "MYSQL" 
              ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/50" 
              : "bg-amber-950/40 text-amber-400 border-amber-800/50"
          }`}>
            <Database className="w-3.5 h-3.5 shrink-0" />
            <div className="flex-1 leading-tight">
              <span className="block font-bold">Banco de Dados</span>
              <span className="text-[10px] text-slate-400 capitalize">{dbStatus.mode === "MYSQL" ? "CloudPanel MySQL" : "Modo Local (JSON)"}</span>
            </div>
            <span className={`w-1.5 h-1.5 rounded-full ${dbStatus.mode === "MYSQL" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
          </div>
        </div>


        {/* Abas de Navegação lateral */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-100'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                    isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-505 bg-indigo-500/10 text-indigo-400 animate-pulse'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer do Menu Lateral */}
    <div className="p-4 border-t border-slate-900 text-[10px] text-slate-500 divide-y divide-slate-800/30">
  <div className="pb-3">
    <span className="text-slate-600 font-medium uppercase tracking-wider text-[9px] block mb-1">
      {isSuperAdmin ? "Superadmin" : `Polo: ${sessionPoloNome}`}
    </span>
    <span className="text-slate-350 font-semibold truncate block max-w-full">{sessionEmail}</span>
  </div>
  <div className="pt-2 flex items-center justify-between">
    <span className="text-slate-600">EduFinance v1.3</span>
    <button
      onClick={handleLogout}
      className="text-[10px] text-rose-500 hover:text-rose-300 font-semibold transition-colors"
    >
      Sair
    </button>
  </div>
</div>
      </aside>

      {/* CABEÇALHO MOBILE (TOPBAR) */}
      <header className="flex items-center justify-between bg-slate-950 border-b border-slate-900 p-4 text-white md:hidden shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h1 className="text-base font-bold font-display tracking-tight text-white leading-none">EduFinance</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {loading ? (
            <span className="text-[10px] text-slate-400 animate-pulse">Sincronizando...</span>
          ) : (
            <button 
              onClick={loadAllData} 
              className="text-[10px] bg-slate-900 text-slate-350 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800"
            >
              Sincronizar
            </button>
          )}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-350 hover:text-white border border-slate-800"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* SIDEBAR MÓVEL - DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Painel do Slide */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative max-w-xs w-full bg-slate-950 text-slate-300 flex flex-col z-10 shadow-2xl h-full"
            >
              <div className="p-5 border-b border-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-base font-bold font-display text-white">EduFinance</h1>
                    <p className="text-[10px] text-slate-500">Magalhães Educação</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status do Banco no Celular */}
              <div className="mx-4 mt-4 p-3 rounded-xl bg-slate-900 border border-slate-850 flex items-center gap-2 text-xs">
                <Database className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="flex-1 leading-tight">
                  <span className="block text-[9px] text-slate-600 uppercase font-bold">Conector Ativo</span>
                  <span className="font-bold text-slate-300 text-[11px] truncate block mt-0.5">{dbStatus.mode === "MYSQL" ? "CloudPanel MySQL" : "Local Database"}</span>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full ${dbStatus.mode === "MYSQL" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
              </div>

              <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
                {[
                  { id: 'dashboard', label: 'Painel Geral', icon: Layers },
                  { id: 'alunos', label: 'Alunos & Matrículas', icon: Users },
                  { id: 'crm-leads', label: 'CRM & Captação (Leads)', icon: Users, badge: 'Lead' },
                  { id: 'cadastro-cursos', label: 'Cadastro de Cursos', icon: BookOpen },
                  { id: 'academico', label: 'Desempenho Acadêmico', icon: GraduationCap },
                  { id: 'financeiro', label: 'Caixa & Tesouraria', icon: DollarSign },
                  { id: 'secretaria-virtual', label: 'Secretaria Virtual', icon: Award },
                  { id: 'gerenciamento-tickets', label: 'Suporte & Tickets', icon: HelpCircle },
                  { id: 'portal-aluno', label: 'Portal do Aluno', icon: IdCard },
                  { id: 'moodle-config', label: 'Integração Moodle', icon: Globe },
                  { id: 'cadastro-polos', label: 'Cadastro de Polos', icon: MapPin },
                  { id: 'usuarios-permissoes', label: 'Controle de Acessos', icon: ShieldCheck },
                  { id: 'ia-consultor', label: 'IA Consultor Escolar', icon: Sparkles, badge: 'Gemini' },
                  { id: 'vps-deploy', label: 'Hospedagem VPS', icon: Server },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                          isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-500/10 text-indigo-400'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-900 text-[10px] text-slate-500 divide-y divide-slate-800/30">
                <div className="pb-3">
                  <span className="text-slate-600 font-medium uppercase tracking-wider text-[9px] block mb-1">Operador</span>
                  <span className="text-slate-350 font-semibold truncate block max-w-full">diretor@magalhaes-edu.com.br</span>
                </div>
                <p className="pt-2 text-slate-600 flex justify-between items-center">
                  <span>EduFinance</span>
                  <span>v1.2</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ÁREA PRINCIPAL DA DIREITA (CONTEÚDO E TOPBAR) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-100">
        {/* TOPBAR (DESKTOP) */}
        <header className="hidden md:flex bg-white border-b border-slate-200 py-3.5 px-8 items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold bg-slate-50 px-2 py-1 rounded">Navegação</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-xs font-bold text-slate-700">
              {activeTab === 'dashboard' ? 'Painel Geral' :
               activeTab === 'alunos' ? 'Alunos & Matrículas' :
               activeTab === 'academico' ? 'Desempenho Acadêmico' :
               activeTab === 'financeiro' ? 'Caixa & Tesouraria' :
               activeTab === 'cadastro-polos' ? 'Cadastro de Polos' :
               activeTab === 'usuarios-permissoes' ? 'Controle de Acessos' :
               activeTab === 'ia-consultor' ? 'IA Consultor Escolar' : 
               activeTab === 'cadastro-cursos' ? 'Cadastro de Cursos' :
               activeTab === 'secretaria-virtual' ? 'Secretaria Virtual' :
               activeTab === 'gerenciamento-tickets' ? 'Suporte & Tickets' :
               activeTab === 'portal-aluno' ? 'Portal do Aluno' :
               activeTab === 'moodle-config' ? 'Integração Moodle' : 'Hospedagem VPS'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Seletor Global de Contexto do Polo */}
{isSuperAdmin && (
  <div className="flex items-center gap-2 bg-indigo-50/70 border border-indigo-100 rounded-xl px-3.5 py-1.5 shadow-sm hover:border-indigo-200 transition-colors shrink-0">
    <span className="text-[10px] uppercase font-semibold text-slate-500">Polo Ativo:</span>
    <select
      value={selectedPoloContext}
      onChange={(e) => setSelectedPoloContext(e.target.value)}
      className="text-xs font-bold text-indigo-700 bg-transparent border-0 ring-0 focus:ring-0 cursor-pointer outline-none"
    >
      <option value="MATRIZ">🏢 MATRIZ GERAL (Acesso Total)</option>
      {polos.map(p => (
        <option key={p.id} value={String(p.id)}>📍 {p.nome} ({p.estado})</option>
      ))}
    </select>
  </div>
)}

            {loading ? (
              <span className="text-xs text-slate-400 animate-pulse flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                Sincronizando registros...
              </span>
            ) : (
              <button 
                onClick={loadAllData} 
                className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                Atualizar Dados
              </button>
            )}
            <div className="h-4 w-px bg-slate-200"></div>
<div className="flex items-center gap-2">
  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-inner ${isSuperAdmin ? "bg-indigo-50 text-indigo-700" : "bg-amber-50 text-amber-700"}`}>
    {sessionNome.charAt(0).toUpperCase()}
  </div>
  <div className="flex flex-col">
    <span className="text-xs font-semibold text-slate-700 leading-none">{sessionNome}</span>
    <span className="text-[9px] text-slate-400">{isSuperAdmin ? "Superadmin" : `Polo: ${sessionPoloNome}`}</span>
  </div>
  <button
    onClick={handleLogout}
    className="ml-2 text-[10px] text-rose-500 hover:text-rose-700 font-semibold border border-rose-100 hover:border-rose-200 px-2 py-1 rounded-lg transition-colors"
  >
    Sair
  </button>
</div>
          </div>
        </header>

        {/* SELETOR MOBILE BANNER */}
{isSuperAdmin && (
  <div className="p-4 bg-indigo-50/80 border-b border-indigo-100/50 flex md:hidden flex-col gap-1.5 shrink-0">
    <label className="text-[9px] uppercase font-bold text-indigo-600 block">Polo Ativo:</label>
    <select
      value={selectedPoloContext}
      onChange={(e) => setSelectedPoloContext(e.target.value)}
      className="text-xs font-semibold text-indigo-950 bg-white border border-indigo-200 rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 w-full"
    >
      <option value="MATRIZ">🏢 MATRIZ GERAL</option>
      {polos.map(p => (
        <option key={p.id} value={String(p.id)}>📍 {p.nome} ({p.estado})</option>
      ))}
    </select>
  </div>
)}

        {/* ÁREA DE CONTEÚDO DINÂMICO DOS MÓDULOS */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-full">
          <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
              <p className="text-sm font-medium text-slate-600">Sincronizando registros acadêmicos e financeiros...</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* STATUS DE ALERTA SE HOUVER REGULADOR LOCAL */}
              {dbStatus.mode === "LOCAL" && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-800">Modo de Demostração Local Ativado</h4>
                      <p className="text-xs text-amber-700 leading-relaxed max-w-2xl mt-0.5">
                        O backend está rodando com armazenamento local JSON seguro porque os parâmetros de conexão do banco externo MySQL ainda não foram configurados no arquivo <code>.env</code>. Seus dados estão salvos e operacionais na demo!
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('vps-deploy')}
                    className="text-xs bg-amber-800 hover:bg-amber-900 text-white font-semibold px-4 py-2 rounded-lg whitespace-nowrap self-start sm:self-center transition-colors shadow-sm"
                  >
                    Ativar Meu MySQL
                  </button>
                </div>
              )}

              {/* TAB 1: PAINEL GERAL (DASHBOARD) */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  
                  {/* HEADER DE BOAS VINDAS - ESTILO ERP CORPORATIVO */}
                  <div className="bg-slate-950 text-white rounded-2xl p-6 shadow-md border border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                    <div>
                      <span className="text-[10px] uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-bold">Unidade Escolar Corrente</span>
                      <h2 className="text-xl md:text-2xl font-bold font-display text-white mt-2 leading-tight">Painel de Controle EduFinance</h2>
                      <p className="text-xs text-slate-400 mt-1">Bem-vindo. Relatórios e fluxo financeiro do atualizados para o ano letivo de 2026.</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-left">
                        <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-extrabold">Data do Caixa</span>
                        <span className="text-xs font-semibold text-slate-350">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      
                      <button 
                        onClick={() => setActiveTab('ia-consultor')}
                        className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/15 transition-all hover:scale-102"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse" />
                        IA Consultor
                      </button>
                    </div>
                  </div>

                  {/* CARDS COM MÉTRICAS ESCOLARES E FINANCEIRAS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alunos Matriculados</p>
                        <h3 className="text-3xl font-bold font-display tracking-tight text-slate-800">{filteredStudents.length}</h3>                        <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>100% ativos ou pendentes</span>
                        </p>
                      </div>
                      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Matrícula Escolar Ativa</p>
                        <h3 className="text-3xl font-semibold font-display tracking-tight text-slate-800">{classes.length}</h3>
                        <p className="text-[11px] text-slate-500">Turmas nos três turnos</p>
                      </div>
                      <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Receitas Pagas (Mês)</p>
                        <h3 className="text-3xl font-bold font-display tracking-tight text-emerald-600">
                          {financeMeters.receitaConfirmada.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </h3>
                        <p className="text-[11px] text-slate-500">Lançamentos compensados</p>
                      </div>
                      <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Em Atraso / Cobrança</p>
                        <h3 className="text-3xl font-bold font-display tracking-tight text-rose-600 animate-pulse">
                          {financeMeters.inadimplenciaTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </h3>
                        <p className="text-[11px] text-rose-500 font-medium">Inadimplência do mês</p>
                      </div>
                      <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                    </div>

                  </div>

                  {/* SEÇÃO ANALÍTICA - GRÁFICOS INTERATIVOS */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Visualização de Balanço de Contas */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 space-y-6">
                      <div>
                        <h3 className="text-base font-bold font-display text-slate-800">Visualização de Fluxo de Caixa Recorrente</h3>
                        <p className="text-xs text-slate-500">Comparativo das mensalidades e despesas gerais de manutenção da infraestrutura.</p>
                      </div>

                      {/* Painel do Gráficos SVG customizado estruturado em Tailwind */}
                      <div className="h-64 flex items-end gap-6 pt-4 border-b border-slate-100 pb-2">
                        
                        {/* Receita Total Prevista */}
                        <div className="flex-1 flex flex-col items-center gap-2 group cursor-help">
                          <div className="w-full bg-slate-50 rounded-xl relative h-48 flex items-end">
                            <div className="w-full bg-indigo-500 group-hover:bg-indigo-600 transition-all rounded-b-xl" style={{ height: '80%' }}></div>
                            <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-indigo-900 text-white text-[10px] px-1.5 py-0.5 rounded-md font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                              {(financeMeters.receitaConfirmada + financeMeters.inadimplenciaTotal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                          </div>
                          <span className="text-xs text-slate-600 font-medium text-center">Faturamento Previsto</span>
                        </div>

                        {/* Receita Confirmada */}
                        <div className="flex-1 flex flex-col items-center gap-2 group cursor-help">
                          <div className="w-full bg-slate-50 rounded-xl relative h-48 flex items-end">
                            <div className="w-full bg-emerald-500 group-hover:bg-emerald-600 transition-all rounded-b-xl animate-pulse" style={{ height: `${(financeMeters.receitaConfirmada / (financeMeters.receitaConfirmada + financeMeters.inadimplenciaTotal || 1)) * 80}%` }}></div>
                            <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-emerald-950 text-white text-[10px] px-1.5 py-0.5 rounded-md font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                              {financeMeters.receitaConfirmada.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                          </div>
                          <span className="text-xs text-slate-600 font-medium text-center">Recebido Caixa</span>
                        </div>

                        {/* Despesas Pagas */}
                        <div className="flex-1 flex flex-col items-center gap-2 group cursor-help">
                          <div className="w-full bg-slate-50 rounded-xl relative h-48 flex items-end">
                            <div className="w-full bg-amber-500 group-hover:bg-amber-600 transition-all rounded-b-xl" style={{ height: `${(financeMeters.despesasPagas / (financeMeters.receitaConfirmada + financeMeters.inadimplenciaTotal || 1)) * 80}%` }}></div>
                            <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-950 text-white text-[10px] px-1.5 py-0.5 rounded-md font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                              {financeMeters.despesasPagas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                          </div>
                          <span className="text-xs text-slate-600 font-medium text-center">Despesas Pagas</span>
                        </div>

                        {/* Inadimplência */}
                        <div className="flex-1 flex flex-col items-center gap-2 group cursor-help">
                          <div className="w-full bg-slate-50 rounded-xl relative h-48 flex items-end">
                            <div className="w-full bg-rose-500 group-hover:bg-rose-600 transition-all rounded-b-xl" style={{ height: `${(financeMeters.inadimplenciaTotal / (financeMeters.receitaConfirmada + financeMeters.inadimplenciaTotal || 1)) * 80}%` }}></div>
                            <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-rose-950 text-white text-[10px] px-1.5 py-0.5 rounded-md font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                              {financeMeters.inadimplenciaTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                          </div>
                          <span className="text-xs text-slate-600 font-medium text-center text-rose-700">Atrasos de Caixa</span>
                        </div>

                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                          <span>Faturamento Previsto</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                          <span>Recebidos</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                          <span>Despesas</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 bg-rose-500 rounded-full"></span>
                          <span>Mensalidades Vencidas</span>
                        </div>
                      </div>
                    </div>

                    {/* Resumo do Caixa Líquido e Ações Rápidas */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-base font-bold font-display text-slate-800">Saldo Consolidado</h3>
                          <p className="text-xs text-slate-500">Patrimônio líquido deduzidas despesas operacionais no mês.</p>
                        </div>

                        <div className="bg-slate-55 block p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                          <span className="text-xs text-slate-500 font-medium">Balanço Atual</span>
                          <div className={`text-2xl font-bold font-display tracking-tight mt-1 ${financeMeters.saldoAtual >= 0 ? "text-indigo-600" : "text-rose-600"}`}>
                            {financeMeters.saldoAtual.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Meta mensal de arrecadação:</span>
                            <span className="font-semibold text-slate-700">85% atingidos</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-6 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-700">Atividades Administrativas:</p>
                        <div className="grid grid-cols-1 gap-2">
                          <button 
                            onClick={() => { setShowStudentModal(true); }}
                            className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold p-2.5 rounded-xl text-left flex items-center justify-between transition-colors group"
                          >
                            <span className="flex items-center gap-2">
                              <PlusCircle className="w-4.5 h-4.5" />
                              Nova Matrícula Aluno
                            </span>
                            <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                          </button>

                          <button 
                            onClick={() => { setShowTxModal(true); }}
                            className="text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-semibold p-2.5 rounded-xl text-left flex items-center justify-between transition-all group"
                          >
                            <span className="flex items-center gap-2">
                              <DollarSign className="w-4.5 h-4.5" />
                              Registrar Mensalidade / Conta
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* TABELA DE ALUNOS COM CONTRATOS ATIVOS RECENTES */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                      <div>
                        <h3 className="text-base font-bold font-display text-slate-800">Recentes Alunos Cadastrados</h3>
                        <p className="text-xs text-slate-500">Últimos estudantes inseridos no fluxo do banco de dados.</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('alunos')} 
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5"
                      >
                        Ver todos os Alunos
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-medium text-xs uppercase bg-slate-50/50">
                            <th className="py-3 px-4">Nome completo</th>
                            <th className="py-3 px-4">Matrícula</th>
                            <th className="py-3 px-4">E-mail</th>
                            <th className="py-3 px-4">Status Contrato</th>
                            <th className="py-3 px-4 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {filteredStudents.slice(0, 4).map(s => (
                            <tr key={s.id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="py-3.5 px-4 font-medium text-slate-800">{s.nome}</td>
                              <td className="py-3.5 px-4 text-xs font-mono">{s.matricula}</td>
                              <td className="py-3.5 px-4 text-slate-600">{s.email}</td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                                  s.status === "ATIVO" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                  s.status === "PENDENTE" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                  "bg-slate-100 text-slate-600"
                                }`}>
                                  {s.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button 
                                  onClick={() => handleDeleteStudent(s.id)}
                                  className="text-xs text-rose-500 hover:text-rose-700 font-semibold transition-colors"
                                >
                                  Desvincular
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB: CRM & CAPTAÇÃO (LEADS) */}
              {activeTab === 'crm-leads' && (
                <div className="space-y-6">
                  {/* HEADER DO CRM */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                      <h2 className="text-lg font-bold text-slate-950 font-display">CRM & Captação de Leads</h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Gerencie contatos de interessados e converta-os em matrículas ativas {selectedPoloContext !== 'MATRIZ' ? `para o Polo ${polos.find(p => String(p.id) === selectedPoloContext)?.nome}` : '(Matriz Geral)'}.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          placeholder="Buscar por nome, origem, fone..."
                          value={searchLead}
                          onChange={(e) => setSearchLead(e.target.value)}
                          className="w-full text-xs text-slate-800 bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-505"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setEditingLead(null);
                          setNewLead({
                            nome: "", email: "", telefone: "", status: "NOVO", 
                            polo_id: selectedPoloContext !== 'MATRIZ' ? selectedPoloContext : "1", 
                            course_id: "", origem: "", observacoes: ""
                          });
                          setShowLeadModal(true);
                        }}
                        className="bg-indigo-600 font-semibold hover:bg-indigo-700 text-white rounded-xl text-xs px-4 py-2.5 flex items-center gap-2 shrink-0 shadow-md shadow-indigo-600/10"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Novo Lead
                      </button>
                    </div>
                  </div>

                  {/* KANBAN BOARD */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {(['NOVO', 'CONTACTADO', 'NEGOCIACAO', 'MATRICULADO', 'PERDIDO'] as const).map(colStatus => {
                      const colLeads = filteredLeads.filter(l => l.status === colStatus);
                      const colStyles = 
                        colStatus === 'NOVO' ? { bg: 'bg-slate-50/70', border: 'border-slate-200/50', badge: 'bg-slate-200 text-slate-700', text: 'text-slate-800', label: 'Novo Lead' } :
                        colStatus === 'CONTACTADO' ? { bg: 'bg-blue-50/40', border: 'border-blue-100/30', badge: 'bg-blue-100 text-blue-700', text: 'text-blue-800', label: 'Contactado' } :
                        colStatus === 'NEGOCIACAO' ? { bg: 'bg-amber-50/40', border: 'border-amber-100/30', badge: 'bg-amber-100 text-amber-700', text: 'text-amber-800', label: 'Em Negociação' } :
                        colStatus === 'MATRICULADO' ? { bg: 'bg-emerald-50/40', border: 'border-emerald-100/30', badge: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-800', label: 'Convertido / Aluno' } :
                        { bg: 'bg-rose-50/40', border: 'border-rose-100/30', badge: 'bg-rose-100 text-rose-700', text: 'text-rose-850', label: 'Perdido' };

                      return (
                        <div key={colStatus} className={`${colStyles.bg} border ${colStyles.border} p-4 rounded-2xl flex flex-col min-h-[480px]`}>
                          <div className="flex items-center justify-between mb-4 pb-2 border-b border-dashed border-slate-200">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${colStatus === 'MATRICULADO' ? 'bg-emerald-500' : colStatus === 'PERDIDO' ? 'bg-rose-500' : 'bg-slate-500'}`}></span>
                              {colStyles.label}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colStyles.badge}`}>{colLeads.length}</span>
                          </div>

                          <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] scrollbar-thin">
                            {colLeads.length === 0 ? (
                              <div className="h-24 flex items-center justify-center border border-dashed border-slate-200/60 rounded-xl text-[10px] text-slate-400 font-medium">
                                Nenhum lead
                              </div>
                            ) : (
                              colLeads.map(lead => {
                                const leadPolo = polos.find(p => p.id === lead.polo_id);
                                const leadCourse = courses.find(c => c.id === lead.course_id);
                                return (
                                  <div key={lead.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-1">
                                      <h4 className="text-xs font-bold text-slate-900 leading-tight pr-5">{lead.nome}</h4>
                                      <button 
                                        onClick={() => handleDeleteLead(lead.id)}
                                        className="text-slate-300 hover:text-rose-600 transition-colors absolute right-2.5 top-2.5 opacity-0 group-hover:opacity-100"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {lead.telefone && (
                                      <p className="text-[10px] text-slate-600 font-medium mb-1 flex items-center gap-1.5">
                                        <span>📞</span> {lead.telefone}
                                      </p>
                                    )}
                                    {lead.email && (
                                      <p className="text-[10px] text-slate-500 truncate mb-1">
                                        ✉️ {lead.email}
                                      </p>
                                    )}

                                    <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1 text-[9px] text-slate-500 font-medium">
                                      <div className="flex justify-between">
                                        <span>Origem:</span>
                                        <span className="font-semibold text-slate-700">{lead.origem}</span>
                                      </div>
                                      {leadCourse && (
                                        <div className="flex justify-between">
                                          <span>Interesse:</span>
                                          <span className="font-semibold text-slate-700 truncate max-w-[100px]">{leadCourse.nome}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span>Polo:</span>
                                        <span className="font-semibold text-indigo-650">{leadPolo ? leadPolo.nome : 'Matriz'}</span>
                                      </div>
                                    </div>

                                    {lead.observacoes && (
                                      <div className="mt-2 bg-slate-50 p-2 rounded text-[9px] text-slate-505 text-slate-500 italic max-h-16 overflow-y-auto leading-relaxed">
                                        "{lead.observacoes}"
                                      </div>
                                    )}

                                    <div className="mt-3.5 pt-2 border-t border-slate-100 flex flex-col gap-2">
                                      {/* Mudança rápida de coluna status */}
                                      <div className="flex items-center justify-between gap-1">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase">Mover status:</span>
                                        <select 
                                          value={lead.status}
                                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                                          className="text-[9px] bg-slate-50 border border-slate-200 rounded p-1 font-semibold text-slate-600 outline-none cursor-pointer"
                                        >
                                          <option value="NOVO">Novo</option>
                                          <option value="CONTACTADO">Contactado</option>
                                          <option value="NEGOCIACAO">Negociando</option>
                                          <option value="MATRICULADO">Matriculado</option>
                                          <option value="PERDIDO">Perdido</option>
                                        </select>
                                      </div>

                                      {/* Ações primárias */}
                                      <div className="flex items-center gap-1.5 justify-end">
                                        <button 
                                          onClick={() => {
                                            setEditingLead(lead);
                                            setNewLead({
                                              nome: lead.nome,
                                              email: lead.email,
                                              telefone: lead.telefone,
                                              status: lead.status,
                                              polo_id: String(lead.polo_id),
                                              course_id: lead.course_id ? String(lead.course_id) : "",
                                              origem: lead.origem,
                                              observacoes: lead.observacoes
                                            });
                                            setShowLeadModal(true);
                                          }}
                                          className="text-[9px] text-indigo-600 hover:text-indigo-800 font-bold px-1.5 py-0.5 hover:bg-indigo-50 rounded"
                                        >
                                          Editar
                                        </button>
                                        {lead.status !== 'MATRICULADO' && (
                                          <button 
                                            onClick={() => handleConvertToStudent(lead)}
                                            className="text-[9px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors"
                                          >
                                            🚀 Matricular
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: ALUNOS & MATRÍCULAS */}
              {activeTab === 'alunos' && (
                <div className="space-y-6">
                  
                  {/* BAR DE FILTROS E ADICIONAR */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="relative w-full sm:max-w-md">
                      <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Buscar aluno por nome, matrícula ou e-mail..."
                        value={searchStudent}
                        onChange={(e) => setSearchStudent(e.target.value)}
                        className="w-full text-xs text-slate-800 bg-slate-50 rounded-lg pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => setShowStudentModal(true)}
                      className="w-full sm:w-auto text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <PlusCircle className="w-4.5 h-4.5" />
                      Novo Aluno Matriculado
                    </button>
                  </div>

                  {/* GRID OU TABELA DE ALUNOS */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="text-base font-bold font-display text-slate-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" />
                        Estudantes Cadastrados no Banco de Dados
                      </h3>
                      <p className="text-xs text-slate-500">Lista completa com filtros dinâmicos de alunos no Magalhães Educação.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase bg-slate-50/50">
                            <th className="py-3 px-6">Nome Completo</th>
                            <th className="py-3 px-6">Matrícula</th>
                            <th className="py-3 px-6">E-mail Escolar</th>
                            <th className="py-3 px-6">Contato Telefônico</th>
                            <th className="py-3 px-6">Aniversário</th>
                            <th className="py-3 px-6">Contrato</th>
                            <th className="py-3 px-6 text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {filteredStudents.length > 0 ? (
                            filteredStudents.map(s => (
                              <tr key={s.id} className="hover:bg-slate-50/30 transition-colors">
                                <td className="py-4 px-6 font-semibold text-slate-800">{s.nome}</td>
                                <td className="py-4 px-6 text-xs font-mono font-medium text-slate-600">{s.matricula}</td>
                                <td className="py-4 px-6 text-slate-500">{s.email}</td>
                                <td className="py-4 px-6 text-xs text-slate-600">{s.telefone || "Não cadastrado"}</td>
                                <td className="py-4 px-6 text-xs text-slate-600">{s.data_nascimento ? s.data_nascimento.split('T')[0] : "Não cadastrado"}</td>
                                <td className="py-4 px-6">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                                    s.status === "ATIVO" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                    s.status === "PENDENTE" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                    "bg-slate-100 text-slate-600 border border-slate-200"
                                  }`}>
                                    {s.status}
                                  </span>
                                </td>
<td className="py-4 px-6 text-center">
  <div className="flex items-center justify-center gap-2 flex-wrap">
    {/* Editar */}
    <button
      onClick={() => { setEditingStudent(s); setShowEditStudentModal(true); }}
      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
    >
      Editar
    </button>
    <span className="text-slate-200">|</span>

    {/* Alterar Status */}
    <select
      value={s.status}
      onChange={(e) => handleChangeStudentStatus(s.id, e.target.value)}
      className={`text-[10px] font-bold rounded-full px-2 py-0.5 border outline-none cursor-pointer ${
        s.status === "ATIVO" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
        s.status === "PENDENTE" ? "bg-amber-50 text-amber-700 border-amber-200" :
        "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      <option value="ATIVO">ATIVO</option>
      <option value="PENDENTE">PENDENTE</option>
      <option value="INATIVO">INATIVO</option>
    </select>
    <span className="text-slate-200">|</span>

    {/* AVA Sync */}
    <button
      onClick={() => handleMoodleSync(s.id)}
      className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold"
      title="Sincronizar com AVA Moodle"
    >
      AVA
    </button>
    <span className="text-slate-200">|</span>

    {/* IA */}
    {isSuperAdmin && (
      <button
        onClick={() => {
          setActiveTab('ia-consultor');
          triggerFeedback('success', "Contexto carregado na IA.");
          setAiMessage(`Analise o histórico do aluno ${s.nome} e elabore um feedback pedagógico e financeiro.`);
        }}
        className="text-xs text-purple-600 hover:text-purple-800 font-semibold"
      >
        IA
      </button>
    )}
    {isSuperAdmin && <span className="text-slate-200">|</span>}

    {/* Remover */}
    <button
      onClick={() => handleDeleteStudent(s.id)}
      className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
    >
      Remover
    </button>
  </div>
</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="py-10 text-center text-slate-400 text-sm">
                                Nenhum aluno encontrado correspondente ao termo pesquisado.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: DESEMPENHO ACADÊMICO */}
              {activeTab === 'academico' && (
                <div className="space-y-6">
                  
                  {/* BARRA DE AÇÕES ACADÊMICAS */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Controle de Mensurações de Rendimento</h4>
                      <p className="text-xs text-slate-500">Lançamento de notas em disciplinas e controle de faltas.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => setShowClassModal(true)}
                        className="flex-1 sm:flex-initial text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-lg border border-slate-200 transition-colors"
                      >
                        Nova Turma / Série
                      </button>
                      <button 
                        onClick={() => setShowGradeModal(true)}
                        className="flex-1 sm:flex-initial text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Lançar Nota Trimestral
                      </button>
                    </div>
                  </div>

                  {/* TABELAS ESCOLARES (TURMAS E RENDIMENTO) */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Lista de Turmas */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Turmas Ativas</h4>
                        <p className="text-xs text-slate-500 text-slate-500">Séries cadastradas no ano letivo corrente.</p>
                      </div>

                      <div className="space-y-3">
                        {classes.length > 0 ? (
                          classes.map(c => (
                            <div key={c.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 flex items-center justify-between">
                              <div>
                                <h5 className="text-xs font-bold text-slate-700">{c.nome}</h5>
                                <p className="text-[10px] text-slate-400">Turno: <strong className="uppercase">{c.turno}</strong> | Série: {c.serie}</p>
                              </div>
                              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-semibold whitespace-nowrap">Matriculados</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 py-4 text-center">Nenhuma turma registrada.</p>
                        )}
                      </div>
                    </div>

                    {/* Boletim Geral dos Estudantes */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <BookOpen className="w-4.5 h-4.5 text-indigo-500" />
                          Últimas Avaliações Lançadas
                        </h4>
                        <p className="text-xs text-slate-500">Média individual e taxas de assiduidade escolar registradas.</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase bg-slate-50">
                              <th className="py-2.5 px-4">Estudante</th>
                              <th className="py-2.5 px-4">Componente</th>
                              <th className="py-2.5 px-4">Nota</th>
                              <th className="py-2.5 px-4">Faltas</th>
                              <th className="py-2.5 px-4">Aproveitamento</th>
                              <th className="py-2.5 px-4 text-center">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {grades.length > 0 ? (
                              grades.map(g => (
                                <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-3 px-4 font-semibold text-slate-800">{g.student_nome || "Diferenciado"}</td>
                                  <td className="py-3 px-4 text-xs font-medium text-indigo-700">{g.disciplina}</td>
                                  <td className="py-3 px-4">
                                    <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                                      g.nota >= 7 ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                                    }`}>
                                      {parseFloat(String(g.nota)).toFixed(1)} / 10.0
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-xs text-slate-500">{g.faltas} faltas</td>
                                  <td className="py-3 px-4 text-xs">
                                    <span className={`font-semibold ${g.nota >= 7 ? "text-emerald-600" : "text-amber-600"}`}>
                                      {g.nota >= 7 ? "Aprovado" : "Em Recuperação"}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <button
                                      onClick={() => handleDeleteGrade(g.id)}
                                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold inline-flex items-center gap-1 transition-colors"
                                      title="Remover avaliação do histórico"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      Excluir
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-slate-400">
                                  Nenhuma nota avaliativa registrada no momento.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: FLUXO DE CAIXA (TESOURARIA) */}
              {activeTab === 'financeiro' && (
                <div className="space-y-6">
                  
                  {/* METRIC GERAL FINANCEIRO INTERNO */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Mensalidades Recebidas (Líquidas)</span>
                      <h3 className="text-2xl font-bold font-display tracking-tight text-emerald-400">
                        {financeMeters.receitaConfirmada.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </h3>
                      <p className="text-[10px] text-slate-400">Valores faturados e depositados</p>
                    </div>
                    
                    <div className="space-y-1 border-slate-800 sm:border-l sm:pl-6">
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Inadimplência de Mensalidades</span>
                      <h3 className="text-2xl font-bold font-display tracking-tight text-rose-400">
                        {financeMeters.inadimplenciaTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </h3>
                      <p className="text-[10px] text-slate-400">Faturas vencidas e não compensadas</p>
                    </div>

                    <div className="space-y-1 border-slate-800 sm:border-l sm:pl-6">
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total de Despesas do Mês</span>
                      <h3 className="text-2xl font-bold font-display tracking-tight text-amber-400">
                        {financeMeters.despesasPagas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </h3>
                      <p className="text-[10px] text-slate-400">Folha, impostos, manutenção e serviços</p>
                    </div>
                  </div>

                  {/* BARRA DE PESQUISA E AÇÃO */}
                  <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          placeholder="Buscar por descrição..."
                          value={searchTx}
                          onChange={(e) => setSearchTx(e.target.value)}
                          className="w-full text-xs text-slate-800 bg-slate-50 rounded-lg pl-9 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
                        />
                      </div>

                      <select
                        value={cashFlowCategoryFilter}
                        onChange={(e) => setCashFlowCategoryFilter(e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-700"
                      >
                        <option value="ALL">📂 Categorias: Mostrar Todas</option>
                        <option value="MENSALIDADE">MENSALIDADE</option>
                        <option value="SALARIO">SALÁRIO / ENCARGOS</option>
                        <option value="MATERIAL">MATERIAL DIDÁTICO</option>
                        <option value="MANUTENCAO">MANUTENÇÃO / REFORMA</option>
                        <option value="ALUGUEL">ALUGUEL & CONTAS</option>
                        <option value="IMPOSTO">IMPOSTO / TAXAS</option>
                        <option value="DIVERSOS">SAÍDA/ENTRADA DIVERSA</option>
                      </select>

                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Filtrar por fornecedor/pagador..."
                          value={cashFlowSupplierFilter}
                          onChange={(e) => setCashFlowSupplierFilter(e.target.value)}
                          className="w-full text-xs text-slate-800 bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowTxModal(true)}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors shrink-0"
                    >
                      <PlusCircle className="w-4.5 h-4.5" />
                      Novo Lançamento Caixa
                    </button>
                  </div>

                  {/* HISTÓRICO DE LANÇAMENTOS */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="text-base font-bold font-display text-slate-800 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-indigo-500" />
                        Histórico de Lançamentos de Fluxo de Caixa (Mensalidades e Despesas)
                      </h3>
                      <p className="text-xs text-slate-500 font-sans">Histórico descritivo reconciliado do caixa do Colégio Magalhães.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase bg-slate-50/50">
                            <th className="py-3 px-6">Identificação / Beneficiário</th>
                            <th className="py-3 px-6">Categoria</th>
                            <th className="py-3 px-6">Fornecedor / Pagador</th>
                            <th className="py-3 px-6">Descrição da Transação</th>
                            <th className="py-3 px-6">Polo</th>
                            <th className="py-3 px-6">Tipo</th>
                            <th className="py-3 px-6">Valor Nominal</th>
                            <th className="py-3 px-6">Vencimento</th>
                            <th className="py-3 px-6">Situação</th>
                            <th className="py-3 px-6 text-center">Gestão de Caixa / Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {filteredTransactions.length > 0 ? (
                            filteredTransactions.map(t => (
                              <tr key={t.id} className="hover:bg-slate-50/30 transition-colors text-xs">
                                <td className="py-4 px-6 font-semibold text-slate-800">{t.student_nome || "Lançamento Geral"}</td>
                                <td className="py-4 px-6">
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                                    {t.categoria || "MENSALIDADE"}
                                  </span>
                                </td>
                                <td className="py-4 px-6 font-medium text-slate-700">{t.fornecedor || "EduFinance"}</td>
                                <td className="py-4 px-6 text-slate-600">{t.descricao}</td>
                                <td className="py-4 px-6 font-bold text-indigo-600">
                                  {polos.find(p => p.id === t.polo_id)?.nome || "Matriz Sede"}
                                </td>
                                <td className="py-4 px-6">
                                  <span className={`inline-flex px-1.5 py-0.5 rounded font-bold ${
                                    t.tipo === "RECEITA" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                                  }`}>
                                    {t.tipo}
                                  </span>
                                </td>
                                <td className={`py-4 px-6 font-bold ${t.tipo === 'RECEITA' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                  {t.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </td>
                                <td className="py-4 px-6 text-xs text-slate-500">{t.data_vencimento ? t.data_vencimento.split('T')[0] : "Lançamento Contábil"}</td>
                                <td className="py-4 px-6">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    t.status === "PAGO" ? "bg-emerald-50 text-emerald-700" :
                                    t.status === "PENDENTE" ? "bg-amber-50 text-amber-700" :
                                    "bg-rose-50 text-rose-700 font-bold"
                                  }`}>
                                    {t.status === "PAGO" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                                    {t.status === "PENDENTE" && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                                    {t.status === "ATRASADO" && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                                    {t.status}
                                  </span>
                                </td>
                                <td className="py-2 px-6 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-2">
                                    {t.status !== "PAGO" ? (
                                      <button
                                        onClick={() => handleUpdateTransactionStatus(t.id, "PAGO")}
                                        className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2.5 rounded shadow-xs transition-colors"
                                        title="Dar Baixa - Confirmar Recebimento / Pagamento"
                                      >
                                        Dar Baixa
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleUpdateTransactionStatus(t.id, "PENDENTE")}
                                        className="text-[11px] bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-1 px-2.5 rounded transition-colors"
                                        title="Estornar Baixa - Reverter para Pendente"
                                      >
                                        Estornar
                                      </button>
                                    )}
                                    {t.status === "PENDENTE" && (
                                      <button
                                        onClick={() => handleUpdateTransactionStatus(t.id, "ATRASADO")}
                                        className="text-[11px] bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold py-1 px-2.5 rounded transition-colors"
                                        title="Marcar como Inadimplente"
                                      >
                                        Atrasar
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteTransaction(t.id)}
                                      className="text-[11px] text-rose-500 hover:text-rose-700 font-bold py-1 px-1.5 transition-colors ml-1"
                                      title="Apagar lançamento permanentemente"
                                    >
                                      Excluir
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="py-10 text-center text-slate-400">
                                Nenhuma transação localizada correspondente aos filtros.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: IA CONSULTOR inteligente (GEMINI) */}
              {activeTab === 'ia-consultor' && (
                <div className="space-y-6">
                  
                  <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-indigo-950">
                    {/* Ambient design lines */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 space-y-4 max-w-3xl">
                      <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold uppercase animate-pulse border border-indigo-800/40">
                        <Sparkles className="w-4 h-4" />
                        Motor Inteligente Gemini 3.5 Ativo
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">FinanAI - IA e Assistente de Gestão do Diretor</h2>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        Este assistente analítico lê em tempo real seu faturamento, despesas operacionais e de matrícula. Solicite insights rápidos, geração de termos jurídicos, planos de fidelização ou rascunhos de avisos de cobrança pelo WhatsApp para as faturas vencidas no sistema.
                      </p>
                    </div>
                  </div>

                  {/* INTERFACE DE CHAT DO ASSISTENTE */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Prompt Chips de Atividades Frequentes */}
                    <div className="lg:col-span-1 space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ações Rápidas (Modelos):</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { title: "WhatsApp Cobrança Amigável", text: "Escreva uma mensagem de pós-venda e lembrete amigável de mensalidade escolar pendente para ser enviada por WhatsApp para o aluno em atraso Bruno." },
                          { title: "Relatório de Inadimplência", text: "Analise o caixa atual do colégio com base nos valores faturados em atraso e sugira 3 ações imediatas para reduzir o atraso de pagamentos do colégio sem atrito." },
                          { title: "Desempenho Pedagógico", text: "Com base nas notas das disciplinas registradas na aba acadêmica, sugira um plano de apoio pedagógico ou tutoria de matemática para os alunos com notas abaixo de 7." },
                          { title: "Mensagem Geral de Boas Vindas", text: "Elabore um modelo de e-mail de Boas-Vindas aos novos pais de alunos matriculados no colégio Magalhães Educação, ressaltando o compromisso com ensino de excelência." }
                        ].map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => askAI(chip.text)}
                            type="button"
                            className="bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 text-left p-3.5 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-900 transition-all flex flex-col gap-1.5 shadow-sm block group"
                          >
                            <span className="font-bold font-display flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                              {chip.title}
                            </span>
                            <span className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{chip.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Janela Principal de Conversação e Chat de Logs */}
                    <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 flex flex-col h-[520px] shadow-sm overflow-hidden">
                      
                      {/* Top Header of Chat Console */}
                      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-xs font-bold text-slate-700">Chat Consolidado em Execução</span>
                        </div>
                        <button 
                          onClick={() => setAiLog([{ role: 'assistant', text: "Chat reiniciado pelo Diretor. Como posso colaborar na tesouraria do colégio hoje?" }])}
                          className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold"
                        >
                          Limpar Histórico
                        </button>
                      </div>

                      {/* Chat Logs Window */}
                      <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        {aiLog.map((log, index) => (
                          <div 
                            key={index} 
                            className={`flex ${log.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                              log.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                            }`}>
                              <span className="font-bold text-[10px] uppercase tracking-wide block mb-1.5 opacity-70">
                                {log.role === 'user' ? 'Diretor Geral' : 'FinanAI Consultor'}
                              </span>
                              <div className="whitespace-pre-wrap font-sans font-medium">
                                {log.text}
                              </div>
                            </div>
                          </div>
                        ))}

                        {aiLoading && (
                          <div className="flex justify-start">
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-4 max-w-[85%] flex items-center gap-3">
                              <div className="flex space-x-1.5">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                              </div>
                              <span className="text-xs text-slate-500 font-medium">Consultando registros e analisando com Gemini...</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Chat Input form bar */}
                      <form 
                        onSubmit={(e) => { e.preventDefault(); askAI(); }}
                        className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2shrink-0"
                      >
                        <input 
                          type="text" 
                          placeholder="Pergunte à IA (ex: 'Me dê dicas de como cobrar pais atrasados educadamente'...)"
                          disabled={aiLoading}
                          value={aiMessage}
                          onChange={(e) => setAiMessage(e.target.value)}
                          className="flex-1 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all font-medium"
                        />
                        <button
                          type="submit"
                          disabled={aiLoading || !aiMessage.trim()}
                          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl p-3 shadow-md flex items-center justify-center transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>

                    </div>

                  </div>

                </div>
              )}

              {/* TAB 6: GUIA DE HOSPEDAGEM VPS HOSTINGER (CLOUDPANEL) */}
              {activeTab === 'vps-deploy' && (
                <div className="space-y-6">
                  
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl">
                        <Server className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold font-display text-slate-800">Conexão do Servidor Externo e Deploy na Hostinger (VPS)</h2>
                        <p className="text-xs text-slate-500">Este sistema já foi projetado com suporte integral a conexões de bancos de dados MySQL.</p>
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* COMO CONFIGURAR VARIÁVEIS DE AMBIENTE */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-800">Variáveis de Conexão MySQL Recomendadas</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Para ativar a compatibilidade com o MySQL em sua VPS Hostinger através do CloudPanel, declare as seguintes credenciais em seu arquivo <code>.env.production</code> ou configure-as no painel de ambiente CloudPanel:
                      </p>

                      <div className="bg-slate-900 text-indigo-300 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 space-y-1">
                        <p><span className="text-slate-500"># Credenciais do Banco MySQL Criado via CloudPanel</span></p>
                        <p><span className="text-amber-400">MYSQL_HOST</span>=127.0.0.1</p>
                        <p><span className="text-amber-400">MYSQL_PORT</span>=3306</p>
                        <p><span className="text-amber-400">MYSQL_USER</span>=USUARIO_DO_BANCO_AQUI</p>
                        <p><span className="text-amber-400">MYSQL_PASSWORD</span>=SENHA_DO_BANCO_AQUI</p>
                        <p><span className="text-amber-400">MYSQL_DATABASE</span>=NOME_DO_BANCO_AQUI</p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4.5 h-4.5 text-indigo-600" />
                        Autotrabalho de Migração Consolidada de Tabelas do Banco de Dados
                      </h4>
                      <p className="text-xs text-indigo-700 leading-relaxed">
                        O backend do EduFinance identifica em tempo de execução a presença dessas variáveis no arquivo <code>.env</code> ou variáveis de sistema do CloudPanel. Caso seja encontrado conexões MySQL ativas, ele migrará automaticamente para rodar queries SQL de alta capacidade, fornecendo velocidade industrial para seu Colégio.
                      </p>
                    </div>

                    {/* PASSO A PASSO RESUMIDO DISPONIBILIZADO NO ARQUIVO DEPLOY */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-slate-800">Passo a Passo de Instalação e Execução na VPS Hostinger (PM2):</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">Passo 1</span>
                          <h5 className="text-xs font-bold text-slate-800">Instalação Npm</h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed">Baixe os arquivos e atualize o repositório na VPS. Execute o comando de instalação para instanciar as bibliotecas:</p>
                          <div className="bg-slate-950 text-white p-2 rounded text-[10px] font-mono select-all">npm install</div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">Passo 2</span>
                          <h5 className="text-xs font-bold text-slate-800">Criação do Bundle</h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed">Gere os caminhos e recompile o client estático e bundles do Nginx na porta default do CloudPanel:</p>
                          <div className="bg-slate-950 text-white p-2 rounded text-[10px] font-mono select-all">npm run build</div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">Passo 3</span>
                          <h5 className="text-xs font-bold text-slate-800">Rodar em Background</h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed">Garanta persistência contínua aos pais de alunos subindo o executável robusto PM2:</p>
                          <div className="bg-slate-950 text-white p-2 rounded text-[10px] font-mono select-all">pm2 start dist/server.cjs</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <FileText className="w-10 h-10 text-slate-500" />
                        <div>
                          <h5 className="text-xs font-bold text-slate-800">Documentação Completa Integrada</h5>
                          <p className="text-[11px] text-slate-500">Consulte o arquivo na raiz de sua workspace contendo cada detalhe e scripts: <code>DEPLOY.md</code></p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          const querySelected = `Tenho uma VPS Hostinger com o painel CloudPanel e criei as tabelas usando o arquivo schema.sql. Como faço para hospedar este sistema rodando na VPS Hostinger de forma otimizada?`;
                          setActiveTab('ia-consultor');
                          askAI(querySelected);
                        }}
                        className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors shrink-0 flex items-center gap-1"
                      >
                        <Sparkles className="w-4 h-4" />
                        Pedir Ajuda à IA no Deploy
                      </button>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 7: CADASTRO DE POLOS (FILIAIS / UNIDADES) */}
              {activeTab === 'cadastro-polos' && (
                <div className="space-y-6">
                  
                  {/* Banner superior */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold font-display text-slate-800">Unidades & Polos de Ensino</h2>
                      <p className="text-xs text-slate-500">Registre e administre as filiais acadêmicas e polos autorizados de captação de alunos.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingPolo(null);
                        setNewPolo({
                          nome: "",
                          cidade: "",
                          estado: "PA",
                          endereco: "",
                          mec_codigo: "",
                          status: "ATIVO" as any,
                          contato_telefone: "",
                          asaas_token: "",
                          split_enabled: true,
                          split_porcentagem_repasse: 20,
                          split_dia_vencimento: 25,
                          cursos_moodle_apenas: true
                        });
                        setShowPoloModal(true);
                        setPoloSplits([]);
                        setNewSplit({ nome: "", wallet_id: "", percentual: "" });
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Registrar Novo Polo
                    </button>
                  </div>

                  {/* Filtro de Polos */}
                  <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar por nome do Polo ou Cidade..." 
                        value={searchPolo}
                        onChange={(e) => setSearchPolo(e.target.value)}
                        className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="text-xs font-medium text-slate-400">
                      Total: {(polos || []).length + 1} unidades cadastradas
                    </div>
                  </div>

                  {/* Unidades Sede / Ativas Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Unidade Matriz Permanente */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-950 text-white rounded-2xl shadow-sm border border-slate-800 p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[9px] bg-indigo-500/30 text-indigo-300 font-extrabold px-2 py-0.5 rounded uppercase font-sans">Matriz</span>
                          <h3 className="text-base font-bold font-display mt-2">Polo Sede (Principal)</h3>
                        </div>
                        <div className="p-2 bg-white/10 text-white rounded-xl">
                          <Building2 className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-xs text-slate-300">
                        <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> São Paulo / SP</p>
                        <p className="text-slate-400">Endereço: Av. Paulista, 1000 - Bela Vista</p>
                        <p className="text-slate-400">Código MEC: <span className="font-mono font-bold text-indigo-300">Matriz-101</span></p>
                      </div>

                      <hr className="border-slate-800" />

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Alunos Vinculados</span>
                          <span className="text-lg font-bold font-mono text-indigo-400">{students.filter(s => !s.polo_id).length} alunos</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">ATIVO / SEDE</span>
                      </div>
                    </div>

                    {/* Unidades Adicionais Dinâmicas */}
                    {(polos || [])
                      .filter(p => p.nome.toLowerCase().includes(searchPolo.toLowerCase()) || p.cidade.toLowerCase().includes(searchPolo.toLowerCase()))
                      .map(p => {
                        const count = students.filter(s => s.polo_id === p.id).length;
                        return (
                          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4 flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded uppercase font-sans">Filial</span>
                                  <h3 className="text-base font-bold font-display text-slate-800 mt-2">{p.nome}</h3>
                                </div>
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                  <Building2 className="w-5 h-5" />
                                </div>
                              </div>
                              
                              <div className="space-y-2 text-xs text-slate-600">
                                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {p.cidade} / {p.estado}</p>
                                <p className="text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap">Endereço: {p.endereco || "Não preenchido"}</p>
                                <p className="text-slate-400">Código MEC: <span className="font-mono font-bold text-indigo-600">{p.mec_codigo || "Isento"}</span></p>
                                {p.contato_telefone && <p className="text-slate-500 font-medium">Contato: {p.contato_telefone}</p>}
                                <div className="mt-3 pt-2 border-t border-slate-100/60 grid grid-cols-2 gap-2 text-[10px] leading-tight text-slate-500">
                                  <div>
                                    <span className="font-bold text-slate-500 block">Asaas Gateway</span>
                                    <span className="text-indigo-600 font-semibold">{p.asaas_token ? "✔️ Token Configurado" : "✕ Sem Integração"}</span>
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-500 block">Split ({p.split_porcentagem_repasse || 20}%)</span>
                                    <span className="text-emerald-600 font-semibold">{p.split_enabled ? `Vencimento Dia ${p.split_dia_vencimento || 25}` : "Desativado"}</span>
                                  </div>
                                  <div className="col-span-2 border-t border-slate-100/40 pt-1">
                                    <span className="font-bold text-slate-500 block">Cursos Ativos</span>
                                    <span className="text-amber-600 font-semibold">{p.cursos_moodle_apenas ? "📚 Apenas Moodle (Sincronizado)" : "🌐 Catálogo Completo"}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3 pt-3 border-t border-slate-100">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Alunos Vinculados</span>
                                  <span className="text-base font-bold font-mono text-slate-800">{count} alunos</span>
                                </div>
                                <span className={`text-[11px] font-bold px-2 py-1 rounded ${
                                  p.status === "ATIVO" ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                                }`}>
                                  {p.status || "ATIVO"}
                                </span>
                              </div>

                              <div className="flex gap-2 pt-1.5">
                                <button
onClick={() => {
  setEditingPolo(p);
  setNewPolo({
    nome: p.nome,
    cidade: p.cidade,
    estado: p.estado || "SP",
    endereco: p.endereco || "",
    mec_codigo: p.mec_codigo || "",
    status: p.status || "ATIVO",
    contato_telefone: p.contato_telefone || "",
    asaas_token: p.asaas_token || "",
    split_enabled: p.split_enabled !== undefined ? !!p.split_enabled : true,
    split_porcentagem_repasse: p.split_porcentagem_repasse !== undefined ? p.split_porcentagem_repasse : 20,
    split_dia_vencimento: p.split_dia_vencimento !== undefined ? p.split_dia_vencimento : 25,
    cursos_moodle_apenas: p.cursos_moodle_apenas !== undefined ? !!p.cursos_moodle_apenas : true,
    polo_email: (p as any).polo_email || "",  // ← NOVO
    polo_senha: "",  // ← sempre vazio ao editar (não exibir hash)
  });
  setShowPoloModal(true);
  loadPoloSplits(p.id);
}}
                                  className="flex-1 text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-1.5 rounded-lg border border-slate-200 transition-colors"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeletePolo(p.id)}
                                  className="px-2 text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-1.5 rounded-lg border border-rose-100 transition-colors"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* SUB-SEÇÃO: RELATÓRIO DE REPASSES E SPLIT AUTOMÁTICO (ASAAS) */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 mt-8 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-base font-bold font-display text-slate-800 flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-indigo-600" />
                          Split de Pagamentos & Repasses por Polo
                        </h3>
                        <p className="text-xs text-slate-500">
                          Resumo financeiro calculado automaticamente com base no faturamento recebido da matriz, na janela do dia 25 ao dia 25 de cada mês.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-600 font-bold whitespace-nowrap">Mês de Referência:</label>
                        <select 
                          value={selectedSplitMonth}
                          onChange={(e) => {
                            setSelectedSplitMonth(e.target.value);
                            setAsaasSimulationResult(null);
                          }}
                          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="2026-06">Junho (25/05/2026 a 25/06/2026)</option>
                          <option value="2026-05">Maio (25/04/2026 a 25/05/2026)</option>
                          <option value="2026-04">Abril (25/03/2026 a 25/04/2026)</option>
                          <option value="2026-03">Março (25/02/2026 a 25/03/2026)</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-400 font-extrabold border-b border-slate-200">
                            <th className="py-3 px-4 uppercase tracking-wider">Unidade Polo</th>
                            <th className="py-3 px-4 uppercase tracking-wider">Status Split</th>
                            <th className="py-3 px-4 uppercase tracking-wider text-right">Faturamento Matriz (Janela)</th>
                            <th className="py-3 px-4 uppercase tracking-wider text-center">Porcentagem</th>
                            <th className="py-3 px-4 uppercase tracking-wider text-right">Repasse Calculado</th>
                            <th className="py-3 px-4 uppercase tracking-wider text-center">Ações Asaas</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(() => {
                            // Calcular limites da janela
                            const [yearStr, monthStr] = selectedSplitMonth.split('-');
                            const year = Number(yearStr);
                            const month = Number(monthStr);

                            // Janela de faturamento: dia 25 do mês M-1 ao dia 25 do mês M
                            const prevMonthStr = String(month === 1 ? 12 : month - 1).padStart(2, '0');
                            const prevYearStr = String(month === 1 ? year - 1 : year);
                            
                            const startDateStr = `${prevYearStr}-${prevMonthStr}-25`;
                            const endDateStr = `${yearStr}-${String(month).padStart(2, '0')}-25`;

                            return [
                              // Unidade Sede - Sem split de repasse
                              { id: 9999, nome: "Polo Sede (Principal)", split_enabled: false, split_porcentagem_repasse: 0, split_dia_vencimento: 25 },
                              ...polos
                            ].map(p => {
                              const isSede = p.id === 9999;
                              
                              // Filtrar transações de alunos deste polo dentro do intervalo de datas pagos
                              const poloTx = transactions.filter(t => {
                                if (t.tipo !== 'RECEITA' || t.status !== 'PAGO') return false;
                                
                                // Resolvendo se o aluno pertence a este Polo
                                const std = students.find(s => s.id === t.student_id);
                                if (isSede) {
                                  if (std && std.polo_id) return false;
                                } else {
                                  if (!std || Number(std.polo_id) !== p.id) return false;
                                }

                                // Classificar por data_pagamento ou vencimento na janela do ciclo
                                const payDate = t.data_pagamento || t.data_vencimento;
                                return payDate >= startDateStr && payDate <= endDateStr;
                              });

                              const totalBilling = poloTx.reduce((sum, t) => sum + Number(t.valor), 0);
                              const repassePct = p.split_porcentagem_repasse || 0;
                              const calculatedRepasse = (totalBilling * repassePct) / 100;

                              return (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors text-slate-800">
                                  <td className="py-4 px-4 font-bold">
                                    {p.nome}
                                    <span className="text-[10px] text-slate-405 block font-normal font-mono">
                                      Janela: {startDateStr.split('-').reverse().join('/')} a {endDateStr.split('-').reverse().join('/')}
                                    </span>
                                  </td>
                                  <td className="py-4 px-4">
                                    {isSede ? (
                                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-bold uppercase">
                                        Matriz Central
                                      </span>
                                    ) : p.split_enabled ? (
                                      <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-bold uppercase">
                                        Split Ativo
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-505 bg-slate-100 px-2 py-0.5 rounded-full font-bold uppercase">
                                        Sem Split
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-4 px-4 font-mono font-bold text-slate-805 text-right font-semibold">
                                    R$ {totalBilling.toFixed(2)}
                                  </td>
                                  <td className="py-4 px-4 font-semibold text-center text-slate-600 font-mono">
                                    {repassePct}%
                                  </td>
                                  <td className="py-4 px-4 font-mono font-bold text-indigo-650 text-right">
                                    R$ {calculatedRepasse.toFixed(2)}
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    {!isSede ? (
                                      <button 
                                        type="button"
                                        onClick={async () => {
                                          try {
                                            const randTx = poloTx[0];
                                            const body = {
                                              polo_id: p.id,
                                              valor: totalBilling > 0 ? totalBilling : 950.00,
                                              student_nome: randTx ? students.find(s => s.id === randTx.student_id)?.nome : "José da Silva",
                                              course_nome: randTx ? courses.find(c => c.id === students.find(s => s.id === randTx.student_id)?.course_id)?.nome : "Tecnologia em Sistemas Unidade"
                                            };
                                            const res = await fetch("/api/asaas/simulate-split", {
                                              method: "POST",
                                              headers: { "Content-Type": "application/json" },
                                              body: JSON.stringify(body)
                                            });
                                            if (res.ok) {
                                              const payloadResult = await res.json();
                                              setAsaasSimulationResult(payloadResult);
                                              triggerFeedback('success', `Simulou transação split para ${p.nome}!`);
                                            } else {
                                              triggerFeedback('error', 'Erro do servidor na simulação.');
                                            }
                                          } catch (e) {
                                            triggerFeedback('error', 'Rede instável na simulação.');
                                          }
                                        }}
                                        className="text-[10px] bg-slate-900 hover:bg-indigo-600 text-white font-extrabold px-2.5 py-1.5 rounded-lg transition-all"
                                      >
                                        Simular Split API
                                      </button>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 italic">Sede Retém 100%</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>

                    {/* MOSTRAR JANELA DE RETORNO DO CONTROLE DE SPLIT DO ASAAS */}
                    {asaasSimulationResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-950 text-slate-300 font-mono text-[11px] rounded-xl p-4 space-y-3 relative border border-indigo-500/30"
                      >
                        <div className="flex justify-between items-center text-slate-400 border-b border-white/10 pb-2">
                          <span className="text-indigo-400 font-bold uppercase tracking-widest text-[9px]">Resultado do Split de Pagamentos Asaas</span>
                          <button onClick={() => setAsaasSimulationResult(null)} className="text-slate-400 hover:text-white">✕</button>
                        </div>
                        <p className="text-emerald-400 font-bold">✓ {asaasSimulationResult.message}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <h5 className="text-[10px] uppercase font-black text-slate-500">Payload enviado ao Asaas</h5>
                            <pre className="p-2.5 bg-slate-900 border border-slate-800 text-[10px] rounded leading-tight text-indigo-300 overflow-x-auto max-h-48 whitespace-pre">
                              {JSON.stringify(asaasSimulationResult.request_sent, null, 2)}
                            </pre>
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-[10px] uppercase font-black text-slate-500">Cálculos de Liquidamento</h5>
                            <pre className="p-2.5 bg-slate-900 border border-slate-800 text-[10px] rounded leading-tight text-emerald-400 overflow-x-auto max-h-48 whitespace-pre">
                              {JSON.stringify(asaasSimulationResult.split_calculated, null, 2)}
                            </pre>
                            <h5 className="text-[10px] uppercase font-black text-slate-500 mt-2">Simulação do Webhook Pago recebido</h5>
                            <pre className="p-2 bg-slate-900 border border-slate-800 text-[10px] rounded leading-tight text-amber-400 overflow-x-auto max-h-32 whitespace-pre">
                              {JSON.stringify(asaasSimulationResult.webhook_payload_simulation, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 8: CONTROLE DE ACESSOS (GESTÃO DE USUÁRIOS E PERMISSÕES) */}
              {activeTab === 'usuarios-permissoes' && (
                <div className="space-y-6">
                  
                  {/* Banner superior */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold font-display text-slate-800">Controle de Acessos & Permissões</h2>
                      <p className="text-xs text-slate-500">Configure os e-mails dos colaboradores, seus cargos administrativos e níveis específicos de segurança.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingUser(null);
                        setNewUser({
                          nome: "", email: "", cargo: "Coordenador", status: "ATIVO" as any,
                          perm_alunos: "APENAS_LEITURA" as any,
                          perm_academico: "SEM_ACESSO" as any,
                          perm_financeiro: "SEM_ACESSO" as any,
                          perm_polos: "SEM_ACESSO" as any
                        });
                        setShowUserModal(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Registrar Operador
                    </button>
                  </div>

                  {/* Resumos de Níveis de Acesso Card Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold leading-none uppercase font-sans">Administradores</span>
                        <span className="text-xl font-bold font-mono text-slate-800 leading-tight">{(users || []).filter(u => u.cargo === "Administrador" || u.cargo === "Diretor").length + 1}</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold leading-none uppercase font-sans">Financeiro/Caixa</span>
                        <span className="text-xl font-bold font-mono text-slate-800 leading-tight">{(users || []).filter(u => u.cargo === "Financeiro" || u.perm_financeiro === "ESCRITA_COMPLETA").length}</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                      <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold leading-none uppercase font-sans">Secretaria/Coord.</span>
                        <span className="text-xl font-bold font-mono text-slate-800 leading-tight">{(users || []).filter(u => u.cargo === "Secretário" || u.cargo === "Coordenador").length}</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                      <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold leading-none uppercase font-sans">Portal de Segurança</span>
                        <span className="text-xs text-slate-500 block leading-tight">Ativo CloudPanel</span>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Usuários do Sistema */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Buscar operador por nome ou cargo..." 
                          value={searchUser}
                          onChange={(e) => setSearchUser(e.target.value)}
                          className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-[10px] text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                            <th className="py-3 px-6">Usuário Operador</th>
                            <th className="py-3 px-6">Cargo Escolar</th>
                            <th className="py-3 px-6">Permissão Alunos</th>
                            <th className="py-3 px-6">Acadêmico</th>
                            <th className="py-3 px-6">Financeiro</th>
                            <th className="py-3 px-6">Polos</th>
                            <th className="py-3 px-6">Status</th>
                            <th className="py-3 px-6 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                          
                          {/* Superadmin Diretor Principal Default */}
                          <tr className="hover:bg-slate-50/20 bg-indigo-50/10">
                            <td className="py-4.5 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                                  DM
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800">Diretor Magalhães</p>
                                  <p className="text-[10px] text-slate-400 font-mono">diretor@magalhaes-edu.com.br</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4.5 px-6">
                              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-sans">Diretoria Sede</span>
                            </td>
                            <td className="py-4.5 px-6"><span className="text-emerald-600 font-bold">✓ Gravação</span></td>
                            <td className="py-4.5 px-6"><span className="text-emerald-600 font-bold">✓ Gravação</span></td>
                            <td className="py-4.5 px-6"><span className="text-emerald-600 font-bold">✓ Gravação</span></td>
                            <td className="py-4.5 px-6"><span className="text-emerald-600 font-bold">✓ Gravação</span></td>
                            <td className="py-4.5 px-6">
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase font-sans">GERAL</span>
                            </td>
                            <td className="py-4.5 px-6 text-right text-slate-400 italic">
                              Inalterável (Sede)
                            </td>
                          </tr>

                          {/* Operadores Dinâmicos adicionais */}
                          {(users || [])
                            .filter(u => u.nome.toLowerCase().includes(searchUser.toLowerCase()) || u.cargo.toLowerCase().includes(searchUser.toLowerCase()))
                            .map(u => {
                              const initials = u.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
                              return (
                                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="py-4.5 px-6">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center">
                                        {initials}
                                      </div>
                                      <div>
                                        <p className="font-bold text-slate-800">{u.nome}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4.5 px-6">
                                    <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-bold">{u.cargo}</span>
                                  </td>
                                  
                                  {/* Permissões */}
                                  <td className="py-4.5 px-6">
                                    <span className={`text-[10px] font-bold ${
                                      u.perm_alunos === "ESCRITA_COMPLETA" ? "text-emerald-600" :
                                      u.perm_alunos === "APENAS_LEITURA" ? "text-sky-600" : "text-slate-400"
                                    }`}>
                                      {u.perm_alunos === "ESCRITA_COMPLETA" ? "Gravação" : u.perm_alunos === "APENAS_LEITURA" ? "Leitura" : "Acesso Revogado"}
                                    </span>
                                  </td>
                                  <td className="py-4.5 px-6">
                                    <span className={`text-[10px] font-bold ${
                                      u.perm_academico === "ESCRITA_COMPLETA" ? "text-emerald-600" :
                                      u.perm_academico === "APENAS_LEITURA" ? "text-sky-600" : "text-slate-400"
                                    }`}>
                                      {u.perm_academico === "ESCRITA_COMPLETA" ? "Gravação" : u.perm_academico === "APENAS_LEITURA" ? "Leitura" : "Bloqueado"}
                                    </span>
                                  </td>
                                  <td className="py-4.5 px-6">
                                    <span className={`text-[10px] font-bold ${
                                      u.perm_financeiro === "ESCRITA_COMPLETA" ? "text-emerald-600" :
                                      u.perm_financeiro === "APENAS_LEITURA" ? "text-sky-600" : "text-slate-400"
                                    }`}>
                                      {u.perm_financeiro === "ESCRITA_COMPLETA" ? "Gravação" : u.perm_financeiro === "APENAS_LEITURA" ? "Leitura" : "Bloqueado"}
                                    </span>
                                  </td>
                                  <td className="py-4.5 px-6">
                                    <span className={`text-[10px] font-bold ${
                                      u.perm_polos === "ESCRITA_COMPLETA" ? "text-emerald-600" :
                                      u.perm_polos === "APENAS_LEITURA" ? "text-sky-600" : "text-slate-400"
                                    }`}>
                                      {u.perm_polos === "ESCRITA_COMPLETA" ? "Gravação" : u.perm_polos === "APENAS_LEITURA" ? "Leitura" : "Bloqueado"}
                                    </span>
                                  </td>

                                  <td className="py-4.5 px-6">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-sans ${
                                      u.status === "ATIVO" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                                    }`}>
                                      {u.status || "ATIVO"}
                                    </span>
                                  </td>

                                  <td className="py-4.5 px-6 text-right">
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        onClick={() => {
                                          setEditingUser(u);
                                          setNewUser({
                                            nome: u.nome,
                                            email: u.email,
                                            cargo: u.cargo || "Coordenador",
                                            status: u.status || "ATIVO",
                                            perm_alunos: u.perm_alunos || "SEM_ACESSO",
                                            perm_academico: u.perm_academico || "SEM_ACESSO",
                                            perm_financeiro: u.perm_financeiro || "SEM_ACESSO",
                                            perm_polos: u.perm_polos || "SEM_ACESSO"
                                          });
                                          setShowUserModal(true);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900 font-semibold text-xs"
                                      >
                                        Editar
                                      </button>
                                      <span className="text-slate-300">|</span>
                                      <button
                                        onClick={() => handleDeleteUser(u.id)}
                                        className="text-rose-600 hover:text-rose-900 font-semibold text-xs"
                                      >
                                        Revogar
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 9: CADASTRO DE CURSOS */}
              {activeTab === 'cadastro-cursos' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold font-display text-slate-800">Catálogo de Cursos Ofertados</h2>
                      <p className="text-xs text-slate-500">Cadastre, edite e vincule os cursos escolares para matrículas e integração com o Moodle.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingCourse(null);
                        setNewCourse({ nome: "", carga_horaria: "120", categoria: "Extensão", duracao_meses: "3", preco_mensal: "150", status: "ATIVO", moodle_course_id: "" });
                        setShowCourseModal(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto shadow-indigo-600/10"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Cadastrar Novo Curso
                    </button>
                  </div>
 
                  {/* Resumos Estatísticos de Cursos */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Cursos no AVA</span>
                        <h4 className="text-xl font-bold font-display text-slate-800 mt-1">
                          {moodleCourses.filter(i => i.type === 'course').length}
                        </h4>
                      </div>
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm">
                        <Globe className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Ticket Médio Mensal</span>
                        <h4 className="text-xl font-bold font-display text-slate-800 mt-1 font-mono">
                          R$ {(courses.reduce((sum, c) => sum + Number(c.preco_mensal || 0), 0) / (courses.length || 1)).toFixed(2)}
                        </h4>
                      </div>
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm">
                        <DollarSign className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Alunos Matriculados</span>
                        <h4 className="text-xl font-bold font-display text-slate-800 mt-1 font-mono">
                          {students.filter(s => s.course_id).length}
                        </h4>
                      </div>
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-xl font-bold text-sm">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
 
                  {/* ============================================================
                      TABELA DE CATEGORIAS E CURSOS DO AVA MOODLE (HIERÁRQUICA)
                  ============================================================ */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-indigo-500" />
                          Categorias & Cursos — AVA Moodle
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            ava.imepedu.com.br
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {moodleCourses.filter(i => i.type === 'category').length} categorias ·{' '}
                          {moodleCourses.filter(i => i.type === 'course').length} cursos carregados
                        </p>
                      </div>
                      <button
                        onClick={loadMoodleCourses}
                        disabled={loadingMoodleCourses}
                        className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                      >
                        {loadingMoodleCourses ? (
                          <>
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            Carregando...
                          </>
                        ) : (
                          <>
                            ↻ Atualizar Lista
                          </>
                        )}
                      </button>
                    </div>
 
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-extrabold bg-slate-50">
                            <th className="py-3 px-4">Nome</th>
                            <th className="py-3 px-4">Tipo</th>
                            <th className="py-3 px-4">ID</th>
                            <th className="py-3 px-4">Categoria Pai</th>
                            <th className="py-3 px-4">Visível</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {moodleCourses.length > 0 ? (
                            moodleCourses.map((item) => {
                              const isCategory = item.type === 'category';
                              const indentPx = 16 + ((item.depth || 0) * 20);
                              return (
                                <tr
                                  key={`${item.type}-${item.id}`}
                                  className={`transition-colors ${
                                    isCategory
                                      ? 'bg-slate-50/60 hover:bg-slate-100/60'
                                      : 'hover:bg-indigo-50/30'
                                  }`}
                                >
                                  <td className="py-2.5 px-4" style={{ paddingLeft: `${indentPx}px` }}>
                                    {isCategory ? (
                                      <span className="font-extrabold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                                        <span className="text-amber-500">📁</span>
                                        {item.name}
                                        <span className="text-[9px] text-slate-400 font-normal normal-case">
                                          ({item.coursecount || 0} cursos)
                                        </span>
                                      </span>
                                    ) : (
                                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                                        <span className="text-indigo-400">📘</span>
                                        {item.fullname}
                                        {item.shortname && (
                                          <span className="text-[9px] text-slate-400 font-mono">
                                            ({item.shortname})
                                          </span>
                                        )}
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                      isCategory
                                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                                        : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                    }`}>
                                      {isCategory ? 'Categoria' : 'Curso'}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                      {item.id}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-4 text-[10px] text-slate-500">
                                    {isCategory
                                      ? (item.parent === 0 ? <span className="text-slate-300 italic">Raiz</span> : `ID ${item.parent}`)
                                      : item.categoryname || `Cat. ${item.categoryid}`
                                    }
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      (item.visible === 1 || item.visible === undefined)
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}>
                                      {(item.visible === 1 || item.visible === undefined) ? '✓ Visível' : 'Oculto'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={5} className="py-10 text-center text-slate-400">
                                {loadingMoodleCourses
                                  ? 'Carregando categorias do AVA Moodle...'
                                  : 'Nenhuma categoria carregada. Clique em "Atualizar Lista" ou verifique a integração.'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
 
                  {/* ============================================================
                      TABELA DE CURSOS CADASTRADOS LOCALMENTE (mantida igual)
                  ============================================================ */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-slate-500" />
                      <h3 className="text-sm font-bold text-slate-800">Cursos Cadastrados Localmente</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                        {courses.length}
                      </span>
                    </div>
 
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full max-w-md">
                      <Search className="text-slate-400 w-4 h-4 mr-2" />
                      <input
                        type="text"
                        placeholder="Buscar por nome ou categoria..."
                        value={searchCourse}
                        onChange={(e) => setSearchCourse(e.target.value)}
                        className="bg-transparent text-xs w-full focus:outline-none font-medium text-slate-705"
                      />
                    </div>
 
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-extrabold tracking-wider bg-slate-50/50">
                            <th className="py-3.5 px-6">Identificação do Curso</th>
                            <th className="py-3.5 px-6">Categoria</th>
                            <th className="py-3.5 px-6">Carga Horária</th>
                            <th className="py-3.5 px-6">Mensalidade</th>
                            <th className="py-3.5 px-6">ID Moodle</th>
                            <th className="py-3.5 px-6 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courses
                            .filter(c =>
                              c.nome.toLowerCase().includes(searchCourse.toLowerCase()) ||
                              c.categoria.toLowerCase().includes(searchCourse.toLowerCase())
                            )
                            .map(c => (
                              <tr key={c.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 text-xs">
                                <td className="py-4 px-6 font-sans">
                                  <div>
                                    <p className="font-bold text-slate-800">{c.nome}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">Duração: {c.duracao_meses} meses</p>
                                  </div>
                                </td>
                                <td className="py-4 px-6 md:whitespace-nowrap">
                                  <span className="bg-slate-100 text-slate-750 border border-slate-200 font-bold px-2 py-0.5 rounded text-[10px]">
                                    {c.categoria}
                                  </span>
                                </td>
                                <td className="py-4 px-6 font-semibold text-slate-600">{c.carga_horaria} Horas</td>
                                <td className="py-4 px-6 font-bold text-indigo-600 font-mono">R$ {Number(c.preco_mensal).toFixed(2)}</td>
                                <td className="py-4 px-6">
                                  {c.moodle_course_id ? (
                                    <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono px-1.5 py-0.5 rounded text-[10px] font-bold">
                                      AVA ID: {c.moodle_course_id}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 text-[10px]">Sem vínculo Moodle</span>
                                  )}
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => {
                                        setEditingCourse(c);
                                        setNewCourse({
                                          nome: c.nome,
                                          carga_horaria: String(c.carga_horaria),
                                          categoria: c.categoria,
                                          duracao_meses: String(c.duracao_meses),
                                          preco_mensal: String(c.preco_mensal),
                                          status: c.status || "ATIVO",
                                          moodle_course_id: String(c.moodle_course_id || "")
                                        });
                                        setShowCourseModal(true);
                                      }}
                                      className="text-indigo-600 hover:text-indigo-900 font-semibold text-xs"
                                    >
                                      Editar
                                    </button>
                                    <span className="text-slate-300">|</span>
                                    <button
                                      onClick={() => handleDeleteCourse(c.id)}
                                      className="text-rose-600 hover:text-rose-900 font-semibold text-xs"
                                    >
                                      Excluir
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
 
                </div>
              )}

              {/* TAB 10: GERENCIAMENTO DE TICKETS / SUPORTE */}
              {activeTab === 'gerenciamento-tickets' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-display text-slate-800">Canais de Atendimento & Suporte</h2>
                    <p className="text-xs text-slate-500">Monitore chamados de alunos, emita pareceres acadêmicos e preste suporte remoto à rede.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Lista à Esquerda */}
                    <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-sm">
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Chamados Recentes</h4>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
                        <Search className="text-slate-400 w-3.5 h-3.5 mr-1.5" />
                        <input
                          type="text"
                          placeholder="Pesquisar tickets..."
                          value={searchTicket}
                          onChange={(e) => setSearchTicket(e.target.value)}
                          className="bg-transparent focus:outline-none w-full text-[11px]"
                        />
                      </div>

                      <div className="space-y-2 max-h-[480px] overflow-y-auto">
                        {tickets
                          .filter(t => t.assunto.toLowerCase().includes(searchTicket.toLowerCase()) || t.descricao.toLowerCase().includes(searchTicket.toLowerCase()))
                          .map(t => {
                            const student = students.find(s => s.id === t.student_id);
                            const priorityColor = t.prioridade === "ALTA" ? "bg-rose-100 text-rose-800" : t.prioridade === "MEDIA" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-800";
                            const statusColor = t.status === "RESOLVIDO" ? "bg-emerald-100 text-emerald-800" : t.status === "EM_ATENDIMENTO" ? "bg-sky-100 text-sky-800" : "bg-amber-100 text-amber-800";
                            
                            return (
                              <button
                                key={t.id}
                                onClick={() => {
                                  const selectEl = document.getElementById('select-ticket-reply') as HTMLSelectElement;
                                  if (selectEl) {
                                    selectEl.value = String(t.id);
                                  }
                                }}
                                className="w-full text-left p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all space-y-2 block text-slate-700"
                              >
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                  <span className={`px-1.5 py-0.5 rounded ${priorityColor}`}>{t.prioridade}</span>
                                  <span className={`px-1.5 py-0.5 rounded-full ${statusColor}`}>{t.status}</span>
                                </div>
                                <h5 className="text-xs font-bold text-slate-800 truncate">{t.assunto}</h5>
                                <p className="text-[10px] text-slate-40s line-clamp-2 leading-tight">{t.descricao}</p>
                                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-semibold pt-1 border-t border-slate-100">
                                  <Users className="w-2.5 h-2.5" />
                                  <span className="truncate">{student?.nome || "Aluno Especial"}</span>
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    {/* Área de Resolução no Centro/Direita */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-sm">
                      <div className="text-center py-6 text-slate-400 space-y-2">
                        <HelpCircle className="w-10 h-10 mx-auto text-slate-200" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-750">Central de Resolução de Ouvidoria</h4>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Selecione chamados estudantis ao lado. Escreva pareceres acadêmicos oficiais com reflexo imediato no portal privado do aluno.</p>
                        </div>
                      </div>

                      <hr className="border-slate-100" />

                      {/* Simulador de Atendimento Rápido */}
                      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4 animate-fade-in">
                        <h4 className="text-xs font-bold text-slate-705 flex items-center gap-1.5">
                          <PlusCircle className="text-indigo-600 w-4 h-4" />
                          Atendimento Rápido (Simular Resposta)
                        </h4>
                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Selecione o Chamado de Suporte *</label>
                            <select
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 outline-none font-medium text-slate-800"
                              id="select-ticket-reply"
                            >
                              <option value="">Selecione...</option>
                              {tickets.filter(t => t.status !== "RESOLVIDO").map(t => (
                                <option key={t.id} value={t.id}>#{t.id} - {t.assunto} ({students.find(s=>s.id===t.student_id)?.nome})</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Resposta / Parecer Oficial *</label>
                            <textarea
                              id="text-ticket-reply"
                              rows={3}
                              placeholder="Forneça as diretrizes acadêmicas ou financeiras para este estudante..."
                              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none font-medium text-slate-800"
                            ></textarea>
                          </div>
                          <button
                            onClick={() => {
                              const selectEl = document.getElementById('select-ticket-reply') as HTMLSelectElement;
                              const textEl = document.getElementById('text-ticket-reply') as HTMLTextAreaElement;
                              if (selectEl?.value && textEl?.value) {
                                handleReplyTicket(Number(selectEl.value), textEl.value);
                                selectEl.value = "";
                                textEl.value = "";
                              } else {
                                triggerFeedback('error', "Selecione um ticket e digite uma resposta para enviar.");
                              }
                            }}
                            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow"
                          >
                            Registrar Resposta e Resolver Ticket
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 11: SECRETARIA VIRTUAL */}
              {activeTab === 'secretaria-virtual' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-display text-slate-800">Secretaria Virtual Inteligente</h2>
                    <p className="text-xs text-slate-500">Gere e emita declarações de matrícula, diplomas de conclusão e carteirinhas estudantis instantaneamente.</p>
                  </div>

                  {/* Grid de Alunos */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                      <h4 className="text-xs font-bold uppercase text-slate-400">Emissão de Documentação Oficial</h4>
                      <span className="text-[10px] text-slate-400 font-sans">Selo MEC / Hash de Validação Coletivo</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-extrabold tracking-wider bg-slate-50/50">
                            <th className="py-3 px-6">Aluno</th>
                            <th className="py-3 px-6">Matrícula</th>
                            <th className="py-3 px-6">Curso Vinculado</th>
                            <th className="py-3 px-6 text-center">Ações Secretaria Virtual</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map(s => {
                              // Buscar curso primeiro na tabela local, depois nos cursos do Moodle
                            const courseLocal = courses.find(c => c.id === s.course_id);
                            const courseMoodle = moodleCourses.find(c => c.type === "course" && c.id === s.course_id);
                            const studentTx = transactions.find(t => t.student_id === s.id && t.descricao?.includes("Matrícula"));
                            const cursoFromTx = studentTx?.descricao?.replace(/^Matrícula — /, "").replace(/ - Parcela.*$/, "").trim();
                            const courseNome = (s as any).course_nome      // ← campo novo do banco
                            || courseLocal?.nome
                            || (courseMoodle as any)?.fullname
                            || cursoFromTx
                            || "Curso não vinculado";
                           

                              // Buscar polo
                            const polo = polos.find(p => p.id === s.polo_id);
                            const poloNome = polo?.nome || (s.polo_id ? `Polo ${s.polo_id}` : "Polo Sede");

                            return (
                                <tr key={s.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 text-xs">
                                <td className="py-4.5 px-6 font-bold text-slate-800">{s.nome}</td>
                                <td className="py-4.5 px-6 font-mono font-medium text-slate-500">{s.matricula}</td>
                                <td className="py-4.5 px-6 font-semibold text-slate-750">
                                <div>
                                  <p className="font-semibold text-slate-800">{courseNome}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">📍 {poloNome}</p>
                                </div>
                                </td>

                                <td className="py-4.5 px-6">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => setActiveStudentDoc({ type: 'carteirinha', student: s })}
                                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2.5 py-1.5 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 hover:scale-[1.02]"
                                    >
                                      <IdCard className="w-3.5 h-3.5" />
                                      Carteirinha
                                    </button>
                                    <button
                                      onClick={() => setActiveStudentDoc({ type: 'declaracao', student: s })}
                                      className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-2.5 py-1.5 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 hover:scale-[1.02]"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      Declaração
                                    </button>
                                    <button
                                      onClick={() => setActiveStudentDoc({ type: 'diploma', student: s })}
                                      className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1.5 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 hover:scale-[1.02]"
                                    >
                                      <Award className="w-3.5 h-3.5" />
                                      Diploma
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 12: PORTAL DO ALUNO COM FINANCEIRO INTEGRADO */}
              {activeTab === 'portal-aluno' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold font-display text-slate-800">Portal de autoatendimento do Aluno</h2>
                      <p className="text-xs text-slate-500">Selecione um aluno abaixo para simular a visão de autoatendimento acadêmico e financeiro.</p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs font-bold text-slate-500 font-sans">Selecionar Aluno:</span>
                      <select
                        value={selectedPortalStudentId || ""}
                        onChange={(e) => setSelectedPortalStudentId(e.target.value ? Number(e.target.value) : null)}
                        className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                      >
                        <option value="">-- Escolha um Aluno --</option>
                        {filteredStudents.map(s => (
                          <option key={s.id} value={s.id}>{s.nome} - {s.matricula}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {!selectedPortalStudentId ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-4 shadow-sm animate-fade-in">
                      <IdCard className="w-16 h-16 mx-auto text-slate-200" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-700">Central de autoatendimento vazia</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Selecione uma conta estudantil no seletor para acessar histórico, mensalidades integradas, sincronização de Moodle e abertura de chamados.</p>
                      </div>
                    </div>
                  ) : (() => {
const student = students.find(s => s.id === selectedPortalStudentId);
if (!student) return null;
const course = courses.find(c => c.id === student.course_id);
const courseMoodle = moodleCourses.find(c => c.type === "course" && c.id === student.course_id);
const studentTx = transactions.find(t => t.student_id === student.id && t.descricao?.includes("Matrícula"));
const cursoFromTx = studentTx?.descricao?.replace(/^Matrícula — /, "").replace(/ - Parcela.*$/, "").trim();
const courseNome = (student as any).course_nome
  || course?.nome
  || (courseMoodle as any)?.fullname
  || cursoFromTx
  || "Sem curso";
const polo = polos.find(p => p.id === student.polo_id);
const invoiceFee = course ? Number(course.preco_mensal) : 289.90;

const studentTxs = transactions.filter(t => t.student_id === student.id);
                    
                    return (
                      <div className="space-y-6 animate-fade-in text-slate-700">
                        {/* Cartão de Identificação Estudantil no Portal */}
                        <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl border border-slate-850">
                          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg border border-indigo-400">
                                {student.nome.split(' ').map(n=>n[0]).slice(0,2).join('')}
                              </div>
                              <div>
                                <h3 className="text-base font-bold font-display">{student.nome}</h3>
                                <p className="text-xs text-slate-400">Curso: {courseNome} - Unidade: {polo?.nome || "Polo Sede"}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-500 block uppercase font-bold">Matrícula Escolar</span>
                              <span className="font-mono text-sm font-bold text-indigo-400">{student.matricula}</span>
                            </div>
                          </div>
                        </div>

                        {/* Duas colunas do portal */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Coluna Financeiro do Estudante */}
                          <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4 shadow-sm">
                              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                                <h3 className="text-sm font-bold text-slate-850 flex items-center gap-1.5 font-sans">
                                  <DollarSign className="text-indigo-600 w-4 h-4" />
                                  Mensalidades & Boletos Integrados
                                </h3>
                                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-extrabold font-sans">Semestre Vigente</span>
                              </div>

                              <div className="space-y-3">
                                {studentTxs.length === 0 ? (
                                  <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                                    <div className="space-y-0.5">
                                      <h4 className="text-xs font-bold text-slate-800 font-sans">Mensalidade Matrícula Regular</h4>
                                      <p className="text-[10px] text-slate-405">Gere e emita a transação para constar no extrato financeiro geral.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <p className="text-xs font-bold text-slate-800 font-mono">R$ {invoiceFee.toFixed(2)}</p>
                                      <button 
                                        onClick={async () => {
                                          try {
                                            const res = await fetch("/api/transactions", {
                                              method: "POST",
                                              headers: { "Content-Type": "application/json" },
                                              body: JSON.stringify({
                                                student_id: student.id,
                                                tipo: "RECEITA",
                                                valor: invoiceFee,
                                                descricao: `Mensalidade Regular - ${course?.nome || "Padrão"}`,
                                                data_vencimento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                                                status: "PENDENTE"
                                              })
                                            });
                                            if (res.ok) {
                                              triggerFeedback('success', "Guia gerada com segurança no financeiro do aluno!");
                                              loadAllData();
                                            }
                                          } catch(err){}
                                        }}
                                        className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow"
                                      >
                                        Emitir Cobrança
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  studentTxs.map(t => (
                                    <div key={t.id} className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-xl flex items-center justify-between border border-slate-200 transition-all">
                                      <div className="space-y-0.5">
                                        <h4 className="text-xs font-bold text-slate-850">{t.descricao}</h4>
                                        <p className="text-[10px] text-slate-500">
                                          Vencimento: {t.data_vencimento 
                                            ? new Date(t.data_vencimento.split("T")[0] + "T12:00:00").toLocaleDateString("pt-BR")
                                          : "—"}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-4 text-slate-700">
                                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${t.status === "PAGO" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                                          {t.status}
                                        </span>
                                        <p className="text-xs font-bold text-slate-800 font-mono">R$ {Number(t.valor).toFixed(2)}</p>
                                        {t.status === "PENDENTE" && (
                                          <button
                                            onClick={() => handlePayInvoice(t.id)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow shadow-indigo-600/5 hover:scale-[1.02]"
                                          >
                                            Quitar Simulado (PIX)
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Portal Direita: Moodle & Suporte */}
                          <div className="space-y-4">
                            {/* Bloco Moodle API Link */}
                            <div className="bg-white rounded-2xl p-5 border border-slate-100 space-y-4 shadow-sm font-sans">
                              <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Integração Moodle</h3>
                              <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 space-y-3 text-xs">
                                <p className="font-sans text-slate-600 font-medium leading-relaxed">
                                  Sua matrícula possui conector ativo via Web Services nos servidores do AVA Moodle.
                                </p>
                                <div className="space-y-1 text-slate-700">
                                  <span className="text-[10px] text-slate-400 block font-semibold">Status de Enturmação</span>
                                  <span className={`text-[10px] font-bold uppercase rounded-full px-2 py-0.5 ${student.moodle_sync_status === "SUCESSO" ? "bg-emerald-150 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                    {student.moodle_sync_status || "PENDENTE DE ENVIO"}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleMoodleSync(student.id)}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] py-2 rounded-xl transition-all font-sans flex items-center justify-center gap-1.5 mt-2 hover:scale-[1.01]"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                  Matricular no AVA Moodle
                                </button>
                              </div>
                            </div>

                            {/* Suporte Rápido */}
                            <div className="bg-white rounded-2xl p-5 border border-slate-100 space-y-4 shadow-sm">
                              <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider font-sans">Abrir Chamado Pedagógico</h3>
                              <div className="space-y-3 text-xs">
                                <input
                                  type="text"
                                  id="student-add-test-subject"
                                  placeholder="Assunto / Tópico"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                                />
                                <textarea
                                  id="student-add-test-desc"
                                  rows={2}
                                  placeholder="Explique o que ocorreu de forma resumida..."
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none font-medium text-slate-700 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                                ></textarea>
                                <button
                                  onClick={async () => {
                                    const subEl = document.getElementById('student-add-test-subject') as HTMLInputElement;
                                    const descEl = document.getElementById('student-add-test-desc') as HTMLTextAreaElement;
                                    if (subEl?.value && descEl?.value) {
                                      try {
                                        const res = await fetch("/api/tickets", {
                                          method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({
                                            student_id: student.id,
                                            assunto: subEl.value,
                                            descricao: descEl.value,
                                            categoria: "SECRETARIA",
                                            prioridade: "MEDIA"
                                          })
                                        });
                                        if (res.ok) {
                                          triggerFeedback('success', "Ticket aberto da visão do aluno com sucesso!");
                                          subEl.value = "";
                                          descEl.value = "";
                                          loadAllData();
                                        }
                                      } catch(e){}
                                    } else {
                                      triggerFeedback('error', "Preencha o assunto e a descrição.");
                                    }
                                  }}
                                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] py-1.5 rounded-lg transition-all"
                                >
                                  Abrir Ticket de Ajuda
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 13: CONFIGURAÇÃO DE INTEGRAÇÃO MOODLE */}
              {activeTab === 'moodle-config' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 space-y-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-200">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold font-display text-slate-800">Conexão API Moodle Integration</h2>
                        <p className="text-xs text-slate-500">Conecte o banco escolar ao moodle via Web Services REST para provisionamento automático.</p>
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Form de Configs */}
                      <form onSubmit={handleSaveMoodleConfig} className="lg:col-span-1 space-y-4 text-xs font-sans text-slate-700">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 block font-sans">Endereço DNS do Moodle *</label>
                          <input
                            type="text"
                            required
                            value={moodleConfig.url}
                            onChange={(e) => setMoodleConfig({ ...moodleConfig, url: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none font-medium text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-605 block">WebService Access Token (Token MD5) *</label>
                          <input
                            type="password"
                            required
                            placeholder="Inserir token Md5..."
                            value={moodleConfig.token || ""}
                            onChange={(e) => setMoodleConfig({ ...moodleConfig, token: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none font-mono"
                          />
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                          <input
                            type="checkbox"
                            className="rounded-md accent-indigo-600"
                            checked={!!moodleConfig.auto_sync}
                            onChange={(e) => setMoodleConfig({ ...moodleConfig, auto_sync: e.target.checked })}
                          />
                          <div className="leading-tight">
                            <span className="block font-bold text-[11px] text-slate-700">Ativar Auto-Sincronismo</span>
                            <span className="text-[9px] text-slate-400">Garante enturmação instantânea ao matricular.</span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md mt-2 shadow-indigo-600/10"
                        >
                          Salvar Configurações Moodle API
                        </button>
                      </form>

                      {/* Exposição Teórica das API calls do Moodle */}
                      <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 text-slate-300 font-sans border border-slate-850 space-y-4">
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                          <Database className="w-4 h-4 text-indigo-400" />
                          WebService Rest Integrativo (Moodle Web Services)
                        </h4>
                        <p className="text-xs text-slate-405 leading-relaxed">
                          Rotinas nativas em segundo plano que invocam chamadas seguras de acordo com a correspondência de id de curso/classe na estrutura:
                        </p>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                          <div className="text-sky-455 flex items-center justify-between">
                            <span>1. core_user_create_users</span>
                            <span className="text-[9px] bg-sky-950/40 text-sky-400 px-1 py-0.5 rounded border border-sky-800/40 font-mono">Criar Usuário AVA</span>
                          </div>
                          <div className="text-emerald-455 flex items-center justify-between">
                            <span>2. enrol_manual_enrol_users</span>
                            <span className="text-[9px] bg-emerald-950/40 text-emerald-400 px-1 py-0.5 rounded border border-emerald-800/40 font-semibold font-mono">Matricular em Classe</span>
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-400 space-y-1 sm:text-xs">
                          <p className="leading-relaxed">
                            Ao matricular um estudante no EduFinance ERP com Moodle integrado ativo, o backend agenda a rotina e efetua a chamada HTTP REST retornando metadados de êxito direto na ficha do estudante.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER DO SISTEMA (DENTRO DA COLUNA DIREITA SCROLLÁVEL) */}
      <footer className="bg-slate-950 text-slate-500 text-xs py-6 border-t border-slate-900 shrink-0 select-none mt-auto">
        <div className="w-full px-8 text-center space-y-2">
          <p>© 2026 EduFinance — Magalhães Educação. Todos os direitos reservados.</p>
          <p className="text-[10px] text-slate-600">Sistema otimizado para VPS Hostinger, conectores MySQL dedicados e compilação Nginx em CloudPanel.</p>
        </div>
      </footer>

      </div> {/* fim da coluna principal (direita) */}

      {/* POPUPS DE CADASTROS (MODAIS) */}

      {/* MODAL DO ASAAS */}

          {showCobrancaModal && (
  <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">Gerar Cobrança Asaas</h3>
              <p className="text-[11px] text-emerald-100 mt-0.5">{cobrancaStudentNome}</p>
            </div>
          </div>
          {!cobrancaResult && (
            <button onClick={() => setShowCobrancaModal(false)} className="text-white/60 hover:text-white font-bold text-lg">✕</button>
          )}
        </div>
      </div>
 
      <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
 
        {/* Formulário — só exibe se não gerou ainda */}
        {!cobrancaResult ? (
          <form onSubmit={handleGerarCobranca} className="space-y-4">
 
            {/* Descrição */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Descrição *</label>
              <input
                type="text"
                required
                value={cobrancaDescricao}
                onChange={(e) => setCobrancaDescricao(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800"
              />
            </div>
 
            <div className="grid grid-cols-2 gap-4">
              {/* Valor Total */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Valor Total (R$) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  placeholder="1200.00"
                  value={cobrancaValor}
                  onChange={(e) => setCobrancaValor(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800"
                />
              </div>
 
              {/* Número de Parcelas */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Parcelas *</label>
                <select
                  value={cobrancaParcelas}
                  onChange={(e) => setCobrancaParcelas(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800"
                >
              {Array.from({ length: 24 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>
                  {n}x {cobrancaValor ? `(R$ ${(Number(cobrancaValor) / n).toFixed(2)}/mês)` : ""}
                </option>
              ))}
            </select>
            </div>
            </div>
 
            {/* Vencimento primeira parcela */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Vencimento 1ª Parcela *</label>
              <input
                type="date"
                required
                value={cobrancaVencimento}
                onChange={(e) => setCobrancaVencimento(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800"
              />
            </div>
            {/* Desconto por pontualidade */}
<div className="space-y-1">
  <label className="text-[11px] font-bold text-slate-600 block">
    Desconto por Pontualidade (R$)
    <span className="text-[10px] text-slate-400 font-normal ml-1">— válido até o vencimento</span>
  </label>
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">R$</span>
    <input
      type="number"
      min="0"
      step="0.01"
      placeholder="0.00"
      value={cobrancaDesconto}
      onChange={(e) => setCobrancaDesconto(e.target.value)}
      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 pl-8 outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800"
    />
  </div>
  {Number(cobrancaDesconto) > 0 && cobrancaValor && (
    <p className="text-[10px] text-emerald-600 font-semibold">
      ✓ Aluno paga R$ {(Number(cobrancaValor) / Number(cobrancaParcelas) - Number(cobrancaDesconto)).toFixed(2)} se pagar até o vencimento
    </p>
  )}
</div>
 
            {/* Preview */}
            {cobrancaValor && cobrancaParcelas && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-1">
                <p className="text-[10px] font-extrabold text-emerald-700 uppercase">Resumo da Cobrança</p>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Valor total:</span>
                  <span className="font-bold">R$ {Number(cobrancaValor).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Parcelas:</span>
                  <span className="font-bold">{cobrancaParcelas}x de R$ {(Number(cobrancaValor) / Number(cobrancaParcelas)).toFixed(2)}</span>
                </div>
                {Number(cobrancaDesconto) > 0 && (
                <div className="flex justify-between text-xs text-emerald-700">
                  <span>Desconto pontualidade:</span>
                  <span className="font-bold">- R$ {Number(cobrancaDesconto).toFixed(2)} por parcela</span>
                </div>
                )}
                <div className="flex justify-between text-xs text-slate-700">
                  <span>1ª parcela:</span>
                  <span className="font-bold">{cobrancaVencimento ? new Date(cobrancaVencimento + "T12:00:00").toLocaleDateString("pt-BR") : "—"}</span>
                </div>
              </div>
            )}
 
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCobrancaModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs py-2.5 rounded-xl transition-colors"
              >
                Pular por agora
              </button>
              <button
                type="submit"
                disabled={cobrancaLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {cobrancaLoading ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Gerando...</>
                ) : (
                  <><DollarSign className="w-3.5 h-3.5" />Gerar Boletos no Asaas</>
                )}
              </button>
            </div>
          </form>
 
        ) : (
          /* Resultado da cobrança gerada */
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Cobranças geradas com sucesso!</h4>
              <p className="text-xs text-slate-500 mt-0.5">{cobrancaResult.total_parcelas} boleto(s) criado(s) no Asaas</p>
            </div>
 
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {cobrancaResult.payments?.map((p: any) => (
                <div key={p.parcela} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Parcela {p.parcela}/{cobrancaResult.total_parcelas}</p>
                    <p className="text-[10px] text-slate-500">Venc: {new Date(p.vencimento + "T12:00:00").toLocaleDateString("pt-BR")} · R$ {p.valor.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    {p.invoiceUrl && (
                      <a
                        href={p.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        Ver Boleto
                      </a>
                    )}
                    {p.invoiceUrl && (
                      <button
                        onClick={() => { navigator.clipboard.writeText(p.invoiceUrl); triggerFeedback("success", "Link copiado!"); }}
                        className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        Copiar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
 
            {/* Copiar todos os links */}
            <button
              onClick={() => {
                const links = cobrancaResult.payments
                  ?.map((p: any) => `Parcela ${p.parcela}: ${p.invoiceUrl}`)
                  .join("\n");
                const texto = `💰 Cobranças — ${cobrancaStudentNome}\n\n${links}\n\nTotal: R$ ${cobrancaResult.valor_total?.toFixed(2)} em ${cobrancaResult.total_parcelas}x`;
                navigator.clipboard.writeText(texto);
                triggerFeedback("success", "Todos os links copiados!");
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
            >
              <Copy className="w-3.5 h-3.5" />
              Copiar Todos os Links para WhatsApp
            </button>
 
            <button
              onClick={() => { setShowCobrancaModal(false); setCobrancaResult(null); }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs py-2.5 rounded-xl transition-colors"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </motion.div>
  </div>
)}





      {/* MODAL 5: POLOS (FILIAIS E PARCEIROS) */}
      {showPoloModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden"
          >
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold font-display">{editingPolo ? "Editar Polo de Ensino" : "Registrar Nova Unidade Polo"}</h3>
                <p className="text-[11px] text-slate-400">Configure as informações físicas e de splits financeiros.</p>
              </div>
              <button onClick={() => setShowPoloModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateOrUpdatePolo} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Nome do Polo / Unidade *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Polo Campinas - Centro"
                  value={newPolo.nome}
                  onChange={(e) => setNewPolo({...newPolo, nome: e.target.value})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Município / Cidade *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Campinas"
                    value={newPolo.cidade}
                    onChange={(e) => setNewPolo({...newPolo, cidade: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Estado / UF *</label>
                  <select 
                    value={newPolo.estado}
                    onChange={(e) => setNewPolo({...newPolo, estado: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                  >
                    {["PA", "SP", "RJ", "MG", "ES", "PR", "SC", "RS", "BA", "PE", "CE", "DF", "GO"].map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Endereço Completo</label>
                <input 
                  type="text" 
                  placeholder="Ex: Av. Francisco Glicério, 1420"
                  value={newPolo.endereco}
                  onChange={(e) => setNewPolo({...newPolo, endereco: e.target.value})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Código MEC</label>
                  <input 
                    type="text" 
                    placeholder="Ex: MECC-4859"
                    value={newPolo.mec_codigo}
                    onChange={(e) => setNewPolo({...newPolo, mec_codigo: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Telefone Contato</label>
                  <input 
                    type="text" 
                    placeholder="(19) 3212-0000"
                    value={newPolo.contato_telefone}
                    onChange={(e) => setNewPolo({...newPolo, contato_telefone: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Situação de Operação</label>
                <select 
                  value={newPolo.status}
                  onChange={(e) => setNewPolo({...newPolo, status: e.target.value})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                >
                  <option value="ATIVO">ATIVO - Captação Aberta</option>
                  <option value="RESERVADO">BLOQUEADO - Manutenção / Fechado</option>
                </select>
              </div>

              {/* INTEGRAÇÃO ASAAS E CONFIGURAÇÃO DE SPLIT */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100">
                  <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    🔑 Gateway & Split de Pagamento Asaas
                  </h4>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-900 block uppercase">Token API / Chave do Polo Sede (Asaas)</label>
                    <input 
                      type="password" 
                      placeholder="Identificador ou Bearer Token do Polo..."
                      value={newPolo.asaas_token}
                      onChange={(e) => setNewPolo({...newPolo, asaas_token: e.target.value})}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-slate-800"
                    />
                    <p className="text-[9px] text-slate-500">Chave exclusiva de liquidação. Deixe preenchido para habilitar envio de webhook.</p>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <input 
                      type="checkbox" 
                      id="modal_split_enabled"
                      checked={newPolo.split_enabled}
                      onChange={(e) => setNewPolo({...newPolo, split_enabled: e.target.checked})}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="modal_split_enabled" className="text-[11px] font-bold text-slate-700 cursor-pointer">
                      Habilitar split de repasse acadêmico
                    </label>
                  </div>

                  {newPolo.split_enabled && (
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-2 border-t border-indigo-100/60 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">Porcentagem Repasse (%)</label>
                        <input 
                          type="number" 
                          min="0"
                          max="100"
                          value={newPolo.split_porcentagem_repasse}
                          onChange={(e) => setNewPolo({...newPolo, split_porcentagem_repasse: Number(e.target.value)})}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 font-bold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">Dia Vencimento Janela</label>
                        <input 
                          type="number" 
                          min="1"
                          max="31"
                          value={newPolo.split_dia_vencimento}
                          onChange={(e) => setNewPolo({...newPolo, split_dia_vencimento: Number(e.target.value)})}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 font-bold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <p className="col-span-2 text-[9px] text-indigo-600 leading-tight">
                        Faturamento calculado do dia <span className="font-bold">{newPolo.split_dia_vencimento || 25}</span> a <span className="font-bold">{newPolo.split_dia_vencimento || 25}</span> de cada mês na janela de apuração.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="modal_moodle_only"
                    checked={newPolo.cursos_moodle_apenas}
                    onChange={(e) => setNewPolo({...newPolo, cursos_moodle_apenas: e.target.checked})}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="modal_moodle_only" className="text-[11px] font-bold text-slate-700 cursor-pointer select-none">
                    Liberar apenas Cursos que estão no Moodle
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 pl-6 leading-tight">
                  Quando ativo, este Polo só visualizará e poderá matricular estudantes em cursos que possuem um ID correspondente no ambiente Moodle integrado.
                </p>
              </div>

              {/* Acesso ao Sistema */}
<div className="border-t border-slate-100 pt-4 space-y-3">
  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
    🔐 Credenciais de Acesso ao Sistema
  </h4>
  <p className="text-[10px] text-slate-400 leading-relaxed">
    Defina o e-mail e senha que o responsável deste polo usará para entrar no EduFinance. Ele terá acesso apenas aos dados deste polo.
  </p>
 
  <div className="space-y-1">
    <label className="text-[11px] font-bold text-slate-600 block">
      E-mail de Acesso {!editingPolo && "*"}
    </label>
    <input
      type="email"
      required={!editingPolo}
      placeholder="polo.breubranco@imepedu.com.br"
      value={newPolo.polo_email}
      onChange={(e) => setNewPolo({ ...newPolo, polo_email: e.target.value })}
      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800"
    />
  </div>
 
  <div className="space-y-1">
    <label className="text-[11px] font-bold text-slate-600 block">
      Senha de Acesso {editingPolo ? "(deixe em branco para manter)" : "*"}
    </label>
    <input
      type="password"
      required={!editingPolo}
      placeholder={editingPolo ? "••••••• (não alterar)" : "Mínimo 6 caracteres"}
      value={newPolo.polo_senha}
      onChange={(e) => setNewPolo({ ...newPolo, polo_senha: e.target.value })}
      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800"
    />
  </div>
</div>

{/* SPLITS DO POLO */}
<div className="border-t border-slate-100 pt-4 space-y-4">
  <div className="flex items-center justify-between">
    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
      ⚡ Splits de Pagamento Asaas
    </h4>
    {(() => {
      const total = poloSplits.reduce((sum, s) => sum + Number(s.percentual), 0);
      return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          total > 100 ? "bg-rose-100 text-rose-700" :
          total === 100 ? "bg-emerald-100 text-emerald-700" :
          "bg-amber-100 text-amber-700"
        }`}>
          Total: {total.toFixed(1)}%
          {total > 100 && " ⚠️ Ultrapassa 100%"}
        </span>
      );
    })()}
  </div>
 
  <p className="text-[10px] text-slate-400 leading-relaxed">
    Configure os destinatários que receberão um percentual de cada cobrança gerada. O restante fica na conta do polo.
  </p>
 
  {/* Lista de splits existentes */}
  {loadingPoloSplits ? (
    <p className="text-[11px] text-slate-400 animate-pulse">Carregando splits...</p>
  ) : poloSplits.length > 0 ? (
    <div className="space-y-2">
      {poloSplits.map((split) => (
        <div key={split.id || split.wallet_id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{split.nome}</p>
            <p className="text-[9px] text-slate-400 font-mono truncate">{split.wallet_id}</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 shrink-0 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
            {split.percentual}%
          </span>
          {editingPolo && (
            <button
              type="button"
              onClick={() => handleDeleteSplit(split.id!, editingPolo.id)}
              className="text-rose-500 hover:text-rose-700 transition-colors shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-[11px] text-slate-400 italic">
      {editingPolo ? "Nenhum split configurado ainda." : "Salve o polo primeiro para adicionar splits."}
    </p>
  )}
 
  {/* Formulário para adicionar novo split — só ao editar polo existente */}
  {editingPolo && (
    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 space-y-3">
      <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Adicionar Split</p>
 
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Nome (ex: Fundo de Marketing)"
          value={newSplit.nome}
          onChange={(e) => setNewSplit({ ...newSplit, nome: e.target.value })}
          className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800"
        />
        <input
          type="text"
          placeholder="Wallet ID do Asaas (ex: waId_xxx...)"
          value={newSplit.wallet_id}
          onChange={(e) => setNewSplit({ ...newSplit, wallet_id: e.target.value })}
          className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-slate-800"
        />
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              min="0.01"
              max="100"
              step="0.01"
              placeholder="Percentual"
              value={newSplit.percentual}
              onChange={(e) => setNewSplit({ ...newSplit, percentual: e.target.value })}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800 pr-6"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">%</span>
          </div>
          <button
            type="button"
            onClick={() => handleAddSplit(editingPolo.id)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )}
 
  {/* Aviso quando criando polo novo */}
  {!editingPolo && (
    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] text-amber-700 font-medium">
      💡 Após salvar o polo, edite-o para configurar os splits de pagamento.
    </div>
  )}
</div>



              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowPoloModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  {editingPolo ? "Salvar Alterações" : "Criar Polo Unidade"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 6: CONTROLE DE PERMISSÕES E USUÁRIOS */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden"
          >
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold font-display">{editingUser ? "Alterar Credenciais" : "Registrar Novo Usuário"}</h3>
                <p className="text-[11px] text-slate-400">Configure os e-mails e permissões de segurança corporativa.</p>
              </div>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateOrUpdateUser} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Nome do Operador *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Carlos Heitor Silva"
                  value={newUser.nome}
                  onChange={(e) => setNewUser({...newUser, nome: e.target.value})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">E-mail Corporativo *</label>
                <input 
                  type="email" 
                  required
                  placeholder="Ex: carlos.silva@escola-edu.com.br"
                  value={newUser.email}
                  disabled={!!editingUser}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800 disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Cargo Institucional *</label>
                  <select 
                    value={newUser.cargo}
                    onChange={(e) => setNewUser({...newUser, cargo: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Diretor">Diretor Operacional</option>
                    <option value="Coordenador">Coordenador Acadêmico</option>
                    <option value="Secretário">Secretário Escolar</option>
                    <option value="Financeiro">Auxiliar Financeiro</option>
                    <option value="Supervisor">Supervisor de Polo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Estado da Conta</label>
                  <select 
                    value={newUser.status}
                    onChange={(e) => setNewUser({...newUser, status: e.target.value as any})}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                  >
                    <option value="ATIVO">ATIVO - Acesso Permitido</option>
                    <option value="SUSPENSO">SUSPENSO - Revogado</option>
                  </select>
                </div>
              </div>

              {/* NÍVEIS DE PERMISSÕES GRANULARES */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 block border-b border-slate-200 pb-1.5 uppercase tracking-wide">Permissões Granulares por Módulo</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Módulo de Alunos</span>
                    <select 
                      value={newUser.perm_alunos}
                      onChange={(e) => setNewUser({...newUser, perm_alunos: e.target.value as any})}
                      className="bg-white border border-slate-200 rounded px-1.5 py-1 text-[11px] font-medium"
                    >
                      <option value="SEM_ACESSO">Sem Acesso</option>
                      <option value="APENAS_LEITURA">Apenas Leitura</option>
                      <option value="ESCRITA_COMPLETA">Escrita Total (CRUD)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Módulo Acadêmico</span>
                    <select 
                      value={newUser.perm_academico}
                      onChange={(e) => setNewUser({...newUser, perm_academico: e.target.value as any})}
                      className="bg-white border border-slate-200 rounded px-1.5 py-1 text-[11px] font-medium"
                    >
                      <option value="SEM_ACESSO">Sem Acesso</option>
                      <option value="APENAS_LEITURA">Apenas Leitura</option>
                      <option value="ESCRITA_COMPLETA">Escrita Total (CRUD)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Módulo Financeiro</span>
                    <select 
                      value={newUser.perm_financeiro}
                      onChange={(e) => setNewUser({...newUser, perm_financeiro: e.target.value as any})}
                      className="bg-white border border-slate-200 rounded px-1.5 py-1 text-[11px] font-medium"
                    >
                      <option value="SEM_ACESSO">Sem Acesso</option>
                      <option value="APENAS_LEITURA">Apenas Leitura</option>
                      <option value="ESCRITA_COMPLETA">Escrita Total (CRUD)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Gestão de Polos</span>
                    <select 
                      value={newUser.perm_polos}
                      onChange={(e) => setNewUser({...newUser, perm_polos: e.target.value as any})}
                      className="bg-white border border-slate-200 rounded px-1.5 py-1 text-[11px] font-medium"
                    >
                      <option value="SEM_ACESSO">Sem Acesso</option>
                      <option value="APENAS_LEITURA">Apenas Leitura</option>
                      <option value="ESCRITA_COMPLETA">Escrita Total (CRUD)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  {editingUser ? "Salvar Credenciais" : "Ativar Operador"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* POPUPS DE CADASTROS (MODAIS) */}

      {/* MODAL: NOVO OU EDITAR LEAD (CRM) */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden"
          >
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold font-display">{editingLead ? "Editar Lead" : "Cadastro de Novo Lead"}</h3>
                <p className="text-[11px] text-slate-400">Registre dados de captação comercial do interessado.</p>
              </div>
              <button onClick={() => setShowLeadModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateOrUpdateLead} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Nome do Lead *</label>
                <input 
                  type="text" 
                  required
                  value={newLead.nome}
                  onChange={(e) => setNewLead({ ...newLead, nome: e.target.value })}
                  placeholder="Ex: Pedro Henrique"
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">E-mail</label>
                  <input 
                    type="email" 
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="Ex: pedro@email.com"
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    value={newLead.telefone}
                    onChange={(e) => setNewLead({ ...newLead, telefone: e.target.value })}
                    placeholder="Ex: (11) 99999-9999"
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Status Comercial</label>
                  <select 
                    value={newLead.status}
                    onChange={(e) => setNewLead({ ...newLead, status: e.target.value as any })}
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="NOVO">Novo Lead</option>
                    <option value="CONTACTADO">Contactado</option>
                    <option value="NEGOCIACAO">Em Negociação</option>
                    <option value="MATRICULADO">Convertido / Matriculado</option>
                    <option value="PERDIDO">Perdido</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Origem de Captação</label>
                  <input 
                    type="text" 
                    value={newLead.origem}
                    onChange={(e) => setNewLead({ ...newLead, origem: e.target.value })}
                    placeholder="Ex: Instagram Ads, Google..."
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Selecione o Polo de Captação</label>
                  <select 
                    value={newLead.polo_id}
                    onChange={(e) => setNewLead({ ...newLead, polo_id: e.target.value })}
                    disabled={selectedPoloContext !== 'MATRIZ'}
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-100"
                  >
                    {polos.map(p => (
                      <option key={p.id} value={String(p.id)}>{p.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Curso de Interesse</label>
                  <select 
                    value={newLead.course_id}
                    onChange={(e) => setNewLead({ ...newLead, course_id: e.target.value })}
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Nenhum / Diversos</option>
                    {courses.map(c => (
                      <option key={c.id} value={String(c.id)}>{c.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Observações do Lead</label>
                <textarea 
                  rows={3}
                  value={newLead.observacoes || ""}
                  onChange={(e) => setNewLead({ ...newLead, observacoes: e.target.value })}
                  placeholder="Ex: Solicitou detalhes do valor das parcelas e desconto corporativo..."
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-505"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3.5">
                <button 
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-4 py-2"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-indigo-600 font-bold hover:bg-indigo-700 text-white text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
                >
                  {editingLead ? "Salvar Alterações" : "Salvar Lead"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 1: NOVO ALUNO */}
      {showStudentModal && (
  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
    >
      {/* Header fixo */}
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
        <div>
          <h3 className="text-base font-bold font-display">Matrícula de Novo Estudante</h3>
          <p className="text-[11px] text-slate-400">O aluno será matriculado automaticamente no AVA Moodle.</p>
        </div>
        <button onClick={() => setShowStudentModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
      </div>
 
      {/* Conteúdo com scroll */}
      <form onSubmit={handleCreateStudent} className="flex flex-col flex-1 overflow-hidden">
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
 
          {/* Nome */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-600 block">Nome Completo *</label>
            <input type="text" required placeholder="Ex: Ana Maria Peixoto" value={newStudent.nome}
              onChange={(e) => setNewStudent({ ...newStudent, nome: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800" />
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">E-mail *</label>
              <input type="email" required placeholder="ana.maria@email.com" value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800" />
            </div>
 
            {/* CPF */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">CPF *</label>
              <input type="text" required placeholder="000.000.000-00" maxLength={14}
                value={newStudent.cpf}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "");
                  if (v.length > 11) v = v.slice(0, 11);
                  v = v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                  setNewStudent({ ...newStudent, cpf: v });
                }}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800" />
              {newStudent.cpf && newStudent.cpf.replace(/\D/g, "").length === 11 && !validarCPFLocal(newStudent.cpf) && (
                <p className="text-[10px] text-rose-600 font-semibold">⚠️ CPF inválido</p>
              )}
            </div>
 
            {/* Telefone */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Telefone</label>
              <input type="text" placeholder="(11) 99999-8888" value={newStudent.telefone}
                onChange={(e) => setNewStudent({ ...newStudent, telefone: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800" />
            </div>
 
            {/* Data Nascimento */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Data de Nascimento</label>
              <input type="date" value={newStudent.data_nascimento}
                onChange={(e) => setNewStudent({ ...newStudent, data_nascimento: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800" />
            </div>
          </div>
 
          {/* Polo — só superadmin vê o select */}
          {isSuperAdmin ? (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Polo do Aluno</label>
              <select value={newStudent.polo_id || ""} onChange={(e) => setNewStudent({ ...newStudent, polo_id: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800">
                <option value="">Polo Sede (Principal)</option>
                {polos.map(p => <option key={p.id} value={p.id}>{p.nome} - {p.cidade}/{p.estado}</option>)}
              </select>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Polo do Aluno</label>
              <div className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700 flex items-center gap-2">
                <span>📍</span>
                {sessionPoloNome || "Polo atual"}
              </div>
            </div>
          )}
 
          {/* Curso AVA */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 block flex items-center justify-between">
              <span>Curso do AVA Moodle *
                {loadingMoodleCourses && <span className="text-[9px] text-indigo-500 animate-pulse ml-1">carregando...</span>}
              </span>
              <button type="button" onClick={loadMoodleCourses} className="text-[9px] text-indigo-500 hover:text-indigo-700 underline font-normal">↻ Atualizar</button>
            </label>
            <select required value={newStudent.course_id || ""}
              onChange={(e) => setNewStudent({ ...newStudent, course_id: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white font-medium text-slate-800">
              <option value="">Selecione uma categoria ou curso...</option>
              {(() => {
                const categories = moodleCourses.filter(i => i.type === "category");
                const coursesList = moodleCourses.filter(i => i.type === "course");
                return categories.map(cat => (
                  <optgroup key={`cat-${cat.id}`} label={`📁 ${cat.name} (${cat.coursecount} cursos)`}>
                    <option value={`cat_${cat.id}`}>✦ Todos os cursos de {cat.name}</option>
                    {coursesList.filter(c => c.categoryid === cat.id).map(course => (
                      <option key={`course-${course.id}`} value={String(course.id)}>└ {course.fullname}</option>
                    ))}
                  </optgroup>
                ));
              })()}
            </select>
            <p className="text-[9px] text-indigo-600 font-medium bg-indigo-50 rounded-lg p-2">
              📚 Ao confirmar, o aluno é automaticamente matriculado no AVA Moodle.
            </p>
          </div>
 
        </div>
 
        {/* Footer fixo com botões */}
        <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0 bg-white">
          <button type="button" onClick={() => setShowStudentModal(false)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors">
            Cancelar
          </button>
          <button type="submit"
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
            Efetuar Matrícula
          </button>
        </div>
      </form>
    </motion.div>
  </div>
)}

      {/* MODAL 2: NOVA TURMA */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full overflow-hidden"
          >
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold font-display">Cadastrar Nova Turma</h3>
                <p className="text-[11px] text-slate-455 text-slate-400">Insira a série escolar.</p>
              </div>
              <button onClick={() => setShowClassModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateClass} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Nome da Turma *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: 9º Ano A - Fundamental"
                  value={newClass.nome}
                  onChange={(e) => setNewClass({...newClass, nome: e.target.value})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Série *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: 9º Ano"
                  value={newClass.serie}
                  onChange={(e) => setNewClass({...newClass, serie: e.target.value})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1 hidden">
                <label className="text-[11px] font-bold text-slate-600 block">Turno Estudo *</label>
                <select 
                  value={newClass.turno}
                  onChange={(e) => setNewClass({...newClass, turno: e.target.value as any})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                >
                  <option value="MATUTINO">Matutino (Manhã)</option>
                  <option value="VESPERTINO">Vespertino (Tarde)</option>
                  <option value="NOTURNO">Noturno (Noite)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
                >
                  Criar Turma
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 3: REGISTRO DE NOTA TRIMESTRAL */}
      {showGradeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full overflow-hidden"
          >
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold font-display">Lançar Média de Rendimento</h3>
                <p className="text-[11px] text-slate-400">Adicione as medições pedagógicas.</p>
              </div>
              <button onClick={() => setShowGradeModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateGrade} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Estudante *</label>
                <select 
                  required
                  value={newGrade.student_id}
                  onChange={(e) => setNewGrade({...newGrade, student_id: e.target.value})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                >
                  <option value="">Selecione o Aluno...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.nome} ({s.matricula})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Componente Curricular *</label>
                <select 
                  value={newGrade.disciplina}
                  onChange={(e) => setNewGrade({...newGrade, disciplina: e.target.value})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                >
                  <option value="Matemática">Matemática</option>
                  <option value="Português">Português (Língua e Literatura)</option>
                  <option value="História">História</option>
                  <option value="Ciências / Biologia">Ciências / Biologia</option>
                  <option value="Geografia">Geografia</option>
                  <option value="Inglês">Inglês</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Nota Trimestral (0-10) *</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    placeholder="9.5"
                    value={newGrade.nota}
                    onChange={(e) => setNewGrade({...newGrade, nota: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Faltas no Período</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="0"
                    value={newGrade.faltas}
                    onChange={(e) => setNewGrade({...newGrade, faltas: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowGradeModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  Confirmar Nota
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 4: NOVO LANÇAMENTO FINANCEIRO */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full overflow-hidden"
          >
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold font-display">Novo Lançamento Financeiro</h3>
                <p className="text-[11px] text-slate-400">Lance receitas ou despesas da sua tesouraria.</p>
              </div>
              <button onClick={() => setShowTxModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateTx} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Tipo de Caixa *</label>
                <select 
                  value={newTx.tipo}
                  onChange={(e) => setNewTx({...newTx, tipo: e.target.value as any})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                >
                  <option value="RECEITA">RECEITA - Mensalidade, Taxas ou Matrículas</option>
                  <option value="DESPESA">DESPESA - Infraestrutura, Fornecedores ou Pessoal</option>
                </select>
              </div>

              {newTx.tipo === "RECEITA" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Associar ao Estudante (Opcional)</label>
                  <select 
                    value={newTx.student_id}
                    onChange={(e) => setNewTx({...newTx, student_id: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                  >
                    <option value="">Lançamento corporativo genérico...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.nome} ({s.matricula})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block font-mono uppercase">Categoria / Centro de Custo *</label>
                <select 
                  value={newTx.categoria}
                  onChange={(e) => setNewTx({...newTx, categoria: e.target.value})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-semibold text-slate-800"
                >
                  <option value="">Selecione a Categoria...</option>
                  <option value="MENSALIDADE">MENSALIDADE (Receita de curso)</option>
                  <option value="SALARIO">SALÁRIO / ENCARGOS (Despesa Folha)</option>
                  <option value="MATERIAL">MATERIAL DIDÁTICO (Insumos)</option>
                  <option value="MANUTENCAO">MANUTENÇÃO / REFORMA (Instalações)</option>
                  <option value="ALUGUEL">ALUGUEL & CONTAS (Infraestrutura)</option>
                  <option value="IMPOSTO">IMPOSTO / TAXAS (Fiscal)</option>
                  <option value="DIVERSOS">SAÍDA/ENTRADA DIVERSA (Administrativo)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Fornecedor / Pagador / Destinatário *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Sabesp, Professor Silva, Fornecedor X..."
                  value={newTx.fornecedor}
                  onChange={(e) => setNewTx({...newTx, fornecedor: e.target.value})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block font-sans">Lançar no Polo Escolar</label>
                <select 
                  value={newTx.polo_id}
                  onChange={(e) => setNewTx({...newTx, polo_id: e.target.value})}
                  disabled={selectedPoloContext !== 'MATRIZ'}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800 disabled:opacity-60"
                >
                  {polos.map(p => (
                    <option key={p.id} value={String(p.id)}>{p.nome} ({p.estado})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Identificação / Descrição *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Mensalidade Escolar - Maio / 2026"
                  value={newTx.descricao}
                  onChange={(e) => setNewTx({...newTx, descricao: e.target.value})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Valor Nominal *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="850.00"
                    value={newTx.valor}
                    onChange={(e) => setNewTx({...newTx, valor: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Vencimento *</label>
                  <input 
                    type="date" 
                    required
                    value={newTx.data_vencimento}
                    onChange={(e) => setNewTx({...newTx, data_vencimento: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Situação de Compensação</label>
                <select 
                  value={newTx.status}
                  onChange={(e) => setNewTx({...newTx, status: e.target.value as any})}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                >
                  <option value="PENDENTE">A receber / Pagar (Pendente)</option>
                  <option value="PAGO">Pago / Compensado</option>
                  <option value="ATRASADO">Vencido (Inadimplente)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowTxModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
                >
                  Efetuar Lançamento
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL: Modal de EDIÇÃO de aluno */}

        {showEditStudentModal && editingStudent && (
  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
    >
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
        <div>
          <h3 className="text-base font-bold font-display">Editar Aluno</h3>
          <p className="text-[11px] text-slate-400 font-mono">{editingStudent.matricula}</p>
        </div>
        <button onClick={() => { setShowEditStudentModal(false); setEditingStudent(null); }} className="text-slate-400 hover:text-white font-bold">✕</button>
      </div>
 
      <form onSubmit={handleEditStudent} className="flex flex-col flex-1 overflow-hidden">
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
 
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 block">Nome Completo *</label>
            <input type="text" required value={editingStudent.nome || ""}
              onChange={(e) => setEditingStudent({ ...editingStudent, nome: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800" />
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">E-mail *</label>
              <input type="email" required value={editingStudent.email || ""}
                onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800" />
            </div>
 
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">CPF</label>
              <input type="text" placeholder="000.000.000-00" maxLength={14}
                value={editingStudent.cpf ? editingStudent.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : ""}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "");
                  if (v.length > 11) v = v.slice(0, 11);
                  v = v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                  setEditingStudent({ ...editingStudent, cpf: v });
                }}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800" />
            </div>
 
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Telefone</label>
              <input type="text" value={editingStudent.telefone || ""}
                onChange={(e) => setEditingStudent({ ...editingStudent, telefone: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800" />
            </div>
 
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Data de Nascimento</label>
              <input type="date" value={editingStudent.data_nascimento ? editingStudent.data_nascimento.split("T")[0] : ""}
                onChange={(e) => setEditingStudent({ ...editingStudent, data_nascimento: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800" />
            </div>
          </div>
 
          {isSuperAdmin && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Polo</label>
              <select value={editingStudent.polo_id || ""}
                onChange={(e) => setEditingStudent({ ...editingStudent, polo_id: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800">
                <option value="">Polo Sede (Principal)</option>
                {polos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
          )}
 
          {/* Matrícula — somente leitura */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 block">Matrícula</label>
            <div className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg p-2.5 font-mono font-bold text-slate-600">
              {editingStudent.matricula}
            </div>
          </div>
 
        </div>
 
        <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0 bg-white">
          <button type="button" onClick={() => { setShowEditStudentModal(false); setEditingStudent(null); }}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100">Cancelar</button>
          <button type="submit"
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white">Salvar Alterações</button>
        </div>
      </form>
    </motion.div>
  </div>
)}


      {/* MODAL: VISUALIZADOR DE DOCUMENTOS DA SECRETARIA VIRTUAL */}
      {activeStudentDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden"
          >
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center sm:px-6">
              <div>
                <h3 className="text-sm font-bold font-display uppercase tracking-wider">Secretaria Oficial Virtual</h3>
                <p className="text-[10px] text-slate-400 font-sans">Visualizando documento gerado eletronicamente.</p>
              </div>
              <button onClick={() => setActiveStudentDoc(null)} className="text-slate-400 hover:text-white font-bold h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center transition-colors">✕</button>
            </div>

            <div className="p-6 bg-slate-50 flex justify-center items-center min-h-[300px]">
              {activeStudentDoc.type === 'carteirinha' && (
                <div className="w-80 h-48 bg-slate-950 rounded-2xl p-4 text-white relative border border-slate-800 shadow-xl overflow-hidden font-sans">
                  {/* Background Accents */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start border-b border-slate-900 pb-2">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">EduFinance Academy</h4>
                      <p className="text-[7px] text-slate-500 font-semibold font-mono">DIPLOMA REGIONAL VINCULADO</p>
                    </div>
                    <span className="text-[8px] bg-indigo-950 border border-indigo-900 text-indigo-400 px-1.5 py-0.5 rounded font-black">STUDENT ID</span>
                  </div>

                  <div className="flex gap-3 mt-3 items-center">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 border border-indigo-500/20 text-white flex items-center justify-center font-bold text-lg shrink-0">
                      {activeStudentDoc.student.nome.split(' ').map((n: string)=>n[0]).slice(0,2).join('').toUpperCase()}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h5 className="text-[11px] font-bold text-slate-100 truncate">{activeStudentDoc.student.nome}</h5>
                      <p className="text-[8px] text-slate-400 font-semibold truncate">Curso: {courses.find(c=>c.id===activeStudentDoc.student.course_id)?.nome || "Não Vinculado"}</p>
                      <p className="text-[7px] text-slate-500 font-mono">Matrícula: {activeStudentDoc.student.matricula}</p>
                      <p className="text-[7px] text-slate-500 font-mono">Polo: {polos.find(p=>p.id===activeStudentDoc.student.polo_id)?.nome || "Polo Sede Principal"}</p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-900/50 pt-2 flex justify-between items-end text-[7px] text-slate-500 font-semibold">
                    <div>
                      <p>SITUAÇÃO: <span className="text-emerald-400 font-bold">ATIVO</span></p>
                      <p>VENCIMENTO: <span className="font-mono">31/12/2026</span></p>
                    </div>
                    <div className="bg-white p-0.5 rounded shrink-0">
                      {/* Fake Barcode representation */}
                      <div className="w-16 h-4 bg-slate-950 flex gap-[2px] p-[1px] items-stretch">
                        <div className="w-[1px] bg-white"></div>
                        <div className="w-[2px] bg-white"></div>
                        <div className="w-[1px] bg-white"></div>
                        <div className="w-[3px] bg-white"></div>
                        <div className="w-[1px] bg-white"></div>
                        <div className="w-[2px] bg-white"></div>
                        <div className="w-[1px] bg-white"></div>
                        <div className="w-[3px] bg-white"></div>
                        <div className="w-[1px] bg-white"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStudentDoc.type === 'declaracao' && (
                <div className="w-full max-w-md bg-white border border-slate-300 shadow-lg p-8 font-serif text-[11px] text-slate-800 space-y-4 rounded-lg relative">
                  {/* Decorative Header */}
                  <div className="text-center space-y-1 pb-4 border-b border-slate-200">
                    <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-900 font-sans">EduFinance - Ministério da Educação</h4>
                    <p className="text-[8.5px] font-mono text-slate-505 font-sans">SISTEMA INTEGRADO DE GESTÃO ESCOLAR E DIRETORIA</p>
                  </div>

                  <h5 className="text-center font-bold uppercase tracking-wide text-xs pt-2 font-sans text-slate-800">Declaração de Matrícula Ativa</h5>

                  <p className="leading-relaxed text-justify text-[11px] indent-6 text-slate-700">
                    Declaramos para os devidos fins de direito e comprovação escolar que o(a) estudante <strong className="text-slate-950 font-sans">{activeStudentDoc.student.nome}</strong> está devidamente matriculado(a) sob o registro de matrícula oficial nº <strong className="text-slate-950 font-mono">{activeStudentDoc.student.matricula}</strong> no curso escolar de <strong className="text-slate-950">{courses.find(c=>c.id===activeStudentDoc.student.course_id)?.nome || "Técnico Profissionalizante Geral"}</strong>, frequentando regularmente as aulas teóricas e atividades supervisionadas polo conector <span className="italic">{polos.find(p=>p.id===activeStudentDoc.student.polo_id)?.nome || "Principal Sede SP"}</span>.
                  </p>

                  <p className="text-[10px] text-slate-500 pt-6 text-center font-sans">
                    São Paulo / SP, {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}.
                  </p>

                  {/* Signatures */}
                  <div className="flex justify-around items-end pt-8 text-[8px] text-slate-400 font-sans text-center">
                    <div>
                      <div className="w-24 border-b border-slate-300 mx-auto mb-1"></div>
                      <p className="font-bold text-slate-600">Assinatura do Estudante</p>
                    </div>
                    <div>
                      <div className="w-24 border-b border-slate-300 mx-auto mb-1"></div>
                      <p className="font-bold text-slate-600">Diretoria Acadêmica SIGE</p>
                    </div>
                  </div>
                </div>
              )}

              {activeStudentDoc.type === 'diploma' && (
                <div className="w-full max-w-lg bg-emerald-50/10 border-4 border-double border-amber-600/30 p-8 font-serif text-[10px] text-slate-800 space-y-4 rounded-xl relative overflow-hidden bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] bg-[size:16px_16px]">
                  {/* Decorative gold border corners */}
                  <div className="absolute top-2 left-2 right-2 bottom-2 border border-amber-600/10 pointer-events-none"></div>

                  <div className="text-center space-y-1 pb-3">
                    <span className="text-[14px] text-amber-600">⚜</span>
                    <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-950 font-sans text-amber-805">CENTRO UNIVERSITÁRIO EDUFINANCE</h4>
                    <p className="text-[8px] tracking-widest text-slate-404 font-sans leading-none">AUTORIZADO SOB AS DIRETRIZES DA LDB - MEC</p>
                  </div>

                  <h5 className="text-center italic font-bold text-slate-900 text-base font-display text-amber-700 py-1">Diploma de Conclusão Acadêmica</h5>

                  <p className="leading-relaxed text-justify text-slate-700 text-[11px] indent-8">
                    A Reitoria Acadêmica do EduFinance, no uso de suas prerrogativas institucionais, confere solenemente a outorga de grau ao formando <strong className="font-sans text-slate-950">{activeStudentDoc.student.nome}</strong> por haver concluído com exímio aproveitamento teórico e prático todas as exigências do curso de <strong className="text-slate-950">{courses.find(c=>c.id===activeStudentDoc.student.course_id)?.nome || "Administração Escolar Cooperativa"}</strong>, com carga horária curricular integralizada de {courses.find(c=>c.id===activeStudentDoc.student.course_id)?.carga_horaria || "120"} horas de grade.
                  </p>

                  <p className="italic text-[10px] text-slate-500 font-sans text-center pt-2">
                    Outorgado em São Paulo, {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}.
                  </p>

                  {/* Signatures */}
                  <div className="flex justify-around items-end pt-8 text-[8px] text-slate-400 font-sans text-center">
                    <div>
                      <div className="w-24 border-b border-amber-600/30 mx-auto mb-1"></div>
                      <p className="font-bold text-amber-800">Reitor Unificado</p>
                    </div>
                    <div>
                      <div className="w-24 border-b border-amber-600/30 mx-auto mb-1"></div>
                      <p className="font-bold text-amber-800">Diretoria de Registro</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-2 px-6">
              <button
                onClick={() => {
                  triggerFeedback('success', "Filtrado e registrado para emissão física via VPS!");
                  setActiveStudentDoc(null);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow"
              >
                Imprimir Documento
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
