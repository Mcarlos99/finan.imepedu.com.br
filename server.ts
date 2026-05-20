import express from "express";
import path from "path";
import fs from "fs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Student, Class, Grade, Transaction, DBConfigStatus } from "./src/types";

// Carregar variáveis de ambiente(.env)
dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === "production";

// STATUS DA CONEXÃO DO BANCO DE DADOS
let dbStatus: DBConfigStatus = {
  mode: "LOCAL",
  initialized: false,
};

let mysqlPool: mysql.Pool | null = null;
const LOCAL_DB_PATH = path.join(process.cwd(), "db_local.json");

// Verificar e criar arquivo de banco local se não existir (auto-healing)
const ensureLocalDB = () => {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const defaultData = {
      students: [
        { id: 1, nome: "Ana Clara J. Santos", email: "ana.clara@escola.com.br", matricula: "MAT2026001", status: "ATIVO", data_nascimento: "2010-04-12", data_nascimento_format: "12/04/2010", telefone: "(11) 98765-4321" },
        { id: 2, nome: "Bruno M. Albuquerque", email: "bruno.albuquerque@escola.com.br", matricula: "MAT2026002", status: "ATIVO", data_nascimento: "2009-08-22", data_nascimento_format: "22/08/2009", telefone: "(11) 97654-3210" },
        { id: 3, nome: "Carlos Eduardo Lima", email: "carlos.lima@escola.com.br", matricula: "MAT2026003", status: "PENDENTE", data_nascimento: "2011-01-05", data_nascimento_format: "05/01/2011", telefone: "(11) 96543-2109" },
        { id: 4, nome: "Giovanna Mendes Rocha", email: "giovanna.rocha@escola.com.br", matricula: "MAT2026004", status: "ATIVO", data_nascimento: "2010-11-30", data_nascimento_format: "30/11/2010", telefone: "(11) 95432-1098" },
        { id: 5, nome: "Leonardo Martins Costa", email: "leonardo.costa@escola.com.br", matricula: "MAT2026005", status: "INATIVO", data_nascimento: "2008-05-18", data_nascimento_format: "18/05/2008", telefone: "(11) 94321-0987" }
      ],
      classes: [
        { id: 1, nome: "9º Ano A - Fundamental", serie: "9º Ano", turno: "MATUTINO" },
        { id: 2, nome: "1º Ano B - Ensino Médio", serie: "1º Ano Médio", turno: "VESPERTINO" },
        { id: 3, nome: "3º Ano C - Ensino Médio", serie: "3º Ano Médio", turno: "NOTURNO" }
      ],
      grades: [
        { id: 1, student_id: 1, disciplina: "Matemática", nota: 8.5, faltas: 2 },
        { id: 2, student_id: 1, disciplina: "Português", nota: 9.0, faltas: 0 },
        { id: 3, student_id: 1, disciplina: "História", nota: 7.5, faltas: 3 },
        { id: 4, student_id: 2, disciplina: "Matemática", nota: 6.0, faltas: 5 },
        { id: 5, student_id: 2, disciplina: "Português", nota: 7.0, faltas: 4 },
        { id: 6, student_id: 4, disciplina: "Matemática", nota: 9.5, faltas: 1 },
        { id: 7, student_id: 4, disciplina: "Português", nota: 8.8, faltas: 1 }
      ],
      transactions: [
        { id: 1, student_id: 1, tipo: "RECEITA", valor: 850.00, descricao: "Mensalidade Escolar - Maio / 2026", data_vencimento: "2026-05-10", data_pagamento: "2026-05-09", status: "PAGO" },
        { id: 2, student_id: 2, tipo: "RECEITA", valor: 950.00, descricao: "Mensalidade Escolar - Maio / 2026", data_vencimento: "2026-05-10", data_pagamento: null, status: "ATRASADO" },
        { id: 3, student_id: 3, tipo: "RECEITA", valor: 850.00, descricao: "Mensalidade Escolar - Maio / 2026", data_vencimento: "2026-05-15", data_pagamento: null, status: "PENDENTE" },
        { id: 4, student_id: 4, tipo: "RECEITA", valor: 850.00, descricao: "Mensalidade Escolar - Maio / 2026", data_vencimento: "2026-05-10", data_pagamento: "2026-05-10", status: "PAGO" },
        { id: 5, student_id: null, tipo: "DESPESA", valor: 1200.00, descricao: "Energia Elétrica - Unidade Principal", data_vencimento: "2026-05-25", data_pagamento: "2026-05-18", status: "PAGO" },
        { id: 6, student_id: null, tipo: "DESPESA", valor: 500.00, descricao: "Manutenção do laboratório de informática", data_vencimento: "2026-05-28", data_pagamento: null, status: "PENDENTE" },
        { id: 7, student_id: null, tipo: "DESPESA", valor: 3150.00, descricao: "Suprimentos pedagógicos e material de escritório", data_vencimento: "2026-05-05", data_pagamento: "2026-05-05", status: "PAGO" }
      ]
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(defaultData, null, 2), "utf8");
    console.log("Banco de dados JSON local auto-gerado com dados sementes com sucesso.");
  }
};

const readLocalData = () => {
  ensureLocalDB();
  const raw = fs.readFileSync(LOCAL_DB_PATH, "utf8");
  let data = JSON.parse(raw);
  let updated = false;

  if (!data.polos) {
    data.polos = [
      { id: 1, nome: "Polo Central Magalhães", cidade: "São Paulo", estado: "SP", endereco: "Av. Paulista, 1200 - Bela Vista", mec_codigo: "POLO-A782", status: "ATIVO", contato_telefone: "(11) 3211-5000", asaas_token: "asaas_prod_82319c823ea98127391a", split_enabled: true, split_porcentagem_repasse: 20, split_dia_vencimento: 25, cursos_moodle_apenas: true },
      { id: 2, nome: "Polo Campinas Digital", cidade: "Campinas", estado: "SP", endereco: "Rua das Flores, 45 - Cambuí", mec_codigo: "POLO-B194", status: "ATIVO", contato_telefone: "(19) 3904-4800", asaas_token: "asaas_token_campinas_7739", split_enabled: true, split_porcentagem_repasse: 15, split_dia_vencimento: 25, cursos_moodle_apenas: true },
      { id: 3, nome: "Polo On-line Nacional (EAD)", cidade: "Belo Horizonte", estado: "MG", endereco: "Praça da Liberdade, 10 - Savassi", mec_codigo: "POLO-EAD9", status: "ATIVO", contato_telefone: "0800-940-1020", asaas_token: "asaas_token_bh_online_1020", split_enabled: false, split_porcentagem_repasse: 25, split_dia_vencimento: 25, cursos_moodle_apenas: true }
    ];
    updated = true;
  }

  if (data.polos && data.polos.length > 0) {
    data.polos.forEach((p: any) => {
      if (p.asaas_token === undefined) {
        p.asaas_token = `asaas_token_polo_${p.id}`;
        p.split_enabled = p.split_enabled !== undefined ? p.split_enabled : true;
        p.split_porcentagem_repasse = p.split_porcentagem_repasse !== undefined ? p.split_porcentagem_repasse : 20;
        p.split_dia_vencimento = p.split_dia_vencimento !== undefined ? p.split_dia_vencimento : 25;
        p.cursos_moodle_apenas = p.cursos_moodle_apenas !== undefined ? p.cursos_moodle_apenas : true;
        updated = true;
      }
    });
  }

  if (!data.users) {
    data.users = [
      { id: 1, nome: "Dr. Alberto Magalhães", email: "diretor@magalhaes-edu.com.br", cargo: "Diretor Geral", status: "ATIVO", data_cadastro: "2025-01-10", perm_alunos: "LEITURA_ESCRITA", perm_academico: "LEITURA_ESCRITA", perm_financeiro: "LEITURA_ESCRITA", perm_polos: "LEITURA_ESCRITA" },
      { id: 2, nome: "Prof. Mariana Pinheiro", email: "mariana.pinheiro@escola.com.br", cargo: "Coordenador Acadêmico", status: "ATIVO", data_cadastro: "2025-06-15", perm_alunos: "LEITURA_ESCRITA", perm_academico: "LEITURA_ESCRITA", perm_financeiro: "APENAS_LEITURA", perm_polos: "APENAS_LEITURA" },
      { id: 3, nome: "Clara Siqueira Santos", email: "clara.financeiro@escola.com.br", cargo: "Tesoureiro e Caixa", status: "ATIVO", data_cadastro: "2025-10-01", perm_alunos: "APENAS_LEITURA", perm_academico: "SEM_ACESSO", perm_financeiro: "LEITURA_ESCRITA", perm_polos: "SEM_ACESSO" }
    ];
    updated = true;
  }

  if (!data.courses) {
    data.courses = [
      { id: 1, nome: "Bacharelado em Engenharia de Software (EAD)", carga_horaria: 3200, categoria: "Bacharelado", duracao_meses: 48, preco_mensal: 389.90, status: "ATIVO", moodle_course_id: "moodle_softeng101" },
      { id: 2, nome: "Administração e Organizações Tecnológicas", carga_horaria: 3000, categoria: "Tecnólogo", duracao_meses: 24, preco_mensal: 299.00, status: "ATIVO", moodle_course_id: "moodle_admintech" },
      { id: 3, nome: "MBA em Marketing de Performance e Growth", carga_horaria: 4200, categoria: "Pós-Graduação", duracao_meses: 18, preco_mensal: 450.00, status: "ATIVO", moodle_course_id: "moodle_mbagrowth" },
      { id: 4, nome: "Gestão Financeira Escolar e VPS Cloud", carga_horaria: 120, categoria: "Extensão", duracao_meses: 3, preco_mensal: 125.00, status: "ATIVO", moodle_course_id: "moodle_vpsfinance" }
    ];
    updated = true;
  }

  if (!data.tickets) {
    data.tickets = [
      { id: 1, student_id: 1, assunto: "Acesso ao Portal do Aluno Moodle instável", categoria: "TECNICO", descricao: "Olá secretaria, meu login no Moodle está dando falha de credenciais temporariamente nos fins de semana.", prioridade: "BAIXA", status: "RESOLVIDO", resposta_suporte: "Olá Ana Clara! Atualizamos seu sincronismo Moodle. Seus cursos e matrículas agora estão totalmente integrados e autenticados de forma estável.", data_abertura: "2026-05-18" },
      { id: 2, student_id: 2, assunto: "Dúvida sobre segunda parcela do acordo", categoria: "FINANCEIRO", descricao: "Gostaria de solicitar a prorrogação no vencimento da parcela de maio devido ao recolhimento atrasado do meu FGTS.", prioridade: "ALTA", status: "ABERTO", data_abertura: "2026-05-20" }
    ];
    updated = true;
  }

  if (!data.moodle_config) {
    data.moodle_config = {
      url: "https://moodle.magalhaes-edu.com.br",
      token: "b719ba798fcb65c82db90ea81fcfc250",
      auto_sync: true,
      connected: true
    };
    updated = true;
  }

  if (!data.leads) {
    data.leads = [
      { id: 1, nome: "Guilherme Silva Rezende", email: "guilherme.leads@outlook.com", telefone: "(11) 98822-1100", status: "NOVO", polo_id: 1, course_id: 1, origem: "Instagram Ads", observacoes: "Tem interesse em Engenharia de Software EAD, pediu informações sobre grade curricular.", data_cadastro: "2026-05-18" },
      { id: 2, nome: "Mariana Souza Queiroz", email: "mariana.queiroz@gmail.com", telefone: "(19) 97711-2233", status: "CONTACTADO", polo_id: 2, course_id: 2, origem: "Google Search", observacoes: "Apresentado o curso de Administração Tecnológica. Retornar na sexta-feira.", data_cadastro: "2026-05-19" },
      { id: 3, nome: "Roberto Nogueira Filho", email: "roberto.filho@hotmail.com", telefone: "(31) 99122-3344", status: "NEGOCIACAO", polo_id: 3, course_id: 3, origem: "Indicação Aluno", observacoes: "Negociando desconto de 15% na matrícula do MBA de performance.", data_cadastro: "2026-05-20" },
      { id: 4, nome: "Camila Fernandes Rosa", email: "camila.rosa@yahoo.com.br", telefone: "(11) 99876-5432", status: "MATRICULADO", polo_id: 1, course_id: 4, origem: "Facebook Ads", observacoes: "Matriculada com sucesso. Integrada ao ambiente Moodle.", data_cadastro: "2026-05-15" }
    ];
    updated = true;
  }

  if (data.transactions && data.transactions.length > 0) {
    data.transactions.forEach((t: any) => {
      let changedTx = false;
      if (t.categoria === undefined) {
        if (t.tipo === "RECEITA") {
          t.categoria = "MENSALIDADE";
          t.fornecedor = "Aluno / Mensalidade";
        } else {
          t.categoria = "DIVERSOS";
          t.fornecedor = "Fornecedor de Serviço";
        }
        changedTx = true;
      }
      if (t.polo_id === undefined) {
        if (t.student_id) {
          const s = data.students?.find((x: any) => x.id === t.student_id);
          t.polo_id = s ? s.polo_id : 1;
        } else {
          t.polo_id = 1;
        }
        changedTx = true;
      }
      if (changedTx) {
        updated = true;
      }
    });
  }

  if (data.students && data.students.length > 0) {
    data.students.forEach((s: any) => {
      let changedThisS = false;
      if (!s.polo_id) {
        s.polo_id = (s.id % 3) + 1;
        changedThisS = true;
      }
      if (!s.course_id) {
        s.course_id = (s.id % 4) + 1;
        changedThisS = true;
      }
      if (!s.moodle_sync_status) {
        s.moodle_sync_status = s.status === 'ATIVO' ? "SINCRONIZADO" : "PENDENTE";
        s.moodle_sync_date = s.status === 'ATIVO' ? new Date().toISOString().split("T")[0] : null;
        changedThisS = true;
      }
      if (changedThisS) {
        const c = data.courses?.find((x: any) => x.id === s.course_id);
        s.course_nome = c ? c.nome : "Engenharia de Software (EAD)";
        const p = data.polos?.find((x: any) => x.id === s.polo_id);
        s.polo_nome = p ? p.nome : "Polo Principal";
        updated = true;
      }
    });
  }

  if (updated) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
  }

  return data;
};

const writeLocalData = (data: any) => {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
};

// INICIALIZALIZAR CONEXÃO DE BANCO DE DADOS
const initDatabase = async () => {
  ensureLocalDB();
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;
  const port = Number(process.env.MYSQL_PORT) || 3306;

  if (host && user && database) {
    try {
      console.log(`Tentando conectar ao banco de dados MySQL em: ${host}:${port}...`);
      
      mysqlPool = mysql.createPool({
        host,
        port,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      // Testar conexão
      const connection = await mysqlPool.getConnection();
      console.log("Conexão MySQL ativa e carregada com sucesso.");
      connection.release();

      dbStatus = {
        mode: "MYSQL",
        host,
        database,
        initialized: true,
      };
    } catch (err: any) {
      console.error("Erro ao conectar no banco MySQL:", err.message);
      console.log("Sistema operando em Modo de Recuperação/Local JSON devido à falha de conexão.");
      dbStatus = {
        mode: "LOCAL",
        initialized: true,
        error: `Falha na conexão MySQL: ${err.message}. Operando em modo de simulação local.`,
      };
    }
  } else {
    console.log("Nenhuma configuração MySQL detectada no ambiente. Operando em modo de simulação local JSON.");
    dbStatus = {
      mode: "LOCAL",
      initialized: true,
      error: "Variáveis do banco de dados MYSQL_HOST, MYSQL_USER, MYSQL_DATABASE ausentes no ambiente.",
    };
  }
};

// AUXILIARES DE QUERIES COMPATÍVEIS COM DUAL-ENGINE
async function fetchStudents(): Promise<Student[]> {
  if (dbStatus.mode === "MYSQL" && mysqlPool) {
    const [rows] = await mysqlPool.query("SELECT * FROM students ORDER BY nome ASC");
    return rows as Student[];
  } else {
    const data = readLocalData();
    return data.students.map((s: any) => {
      const p = data.polos?.find((x: any) => x.id === s.polo_id);
      const c = data.courses?.find((x: any) => x.id === s.course_id);
      return {
        ...s,
        polo_nome: p ? p.nome : "Polo Sede (Principal)",
        course_nome: c ? c.nome : "Engenharia de Software (EAD)"
      };
    });
  }
}

async function addStudent(student: Omit<Student, "id" | "polo_nome" | "course_nome">): Promise<Student> {
  if (dbStatus.mode === "MYSQL" && mysqlPool) {
    const [result]: any = await mysqlPool.query(
      "INSERT INTO students (nome, email, matricula, status, data_nascimento, telefone, polo_id, course_id, moodle_sync_status, moodle_sync_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [student.nome, student.email, student.matricula, student.status, student.data_nascimento, student.telefone, student.polo_id || null, student.course_id || null, "SINCRONIZADO", new Date().toISOString().split("T")[0]]
    );
    return { id: result.insertId, ...student } as any;
  } else {
    const data = readLocalData();
    const newId = data.students.length > 0 ? Math.max(...data.students.map((s: any) => s.id)) + 1 : 1;
    const newStudent: Student = { 
      id: newId, 
      ...student, 
      polo_id: student.polo_id ? Number(student.polo_id) : null,
      course_id: student.course_id ? Number(student.course_id) : null,
      moodle_sync_status: "SINCRONIZADO",
      moodle_sync_date: new Date().toISOString().split("T")[0]
    };
    data.students.push(newStudent);
    writeLocalData(data);
    const p = data.polos?.find((x: any) => x.id === newStudent.polo_id);
    newStudent.polo_nome = p ? p.nome : "Polo Sede (Principal)";
    const c = data.courses?.find((x: any) => x.id === newStudent.course_id);
    newStudent.course_nome = c ? c.nome : "Sem Curso";
    return newStudent;
  }
}

async function updateStudent(id: number, student: Partial<Student>): Promise<boolean> {
  if (dbStatus.mode === "MYSQL" && mysqlPool) {
    const [result]: any = await mysqlPool.query(
      "UPDATE students SET nome = COALESCE(?, nome), email = COALESCE(?, email), matricula = COALESCE(?, matricula), status = COALESCE(?, status), data_nascimento = COALESCE(?, data_nascimento), telefone = COALESCE(?, telefone), polo_id = COALESCE(?, polo_id), course_id = COALESCE(?, course_id) WHERE id = ?",
      [student.nome, student.email, student.matricula, student.status, student.data_nascimento, student.telefone, student.polo_id, student.course_id, id]
    );
    return result.affectedRows > 0;
  } else {
    const data = readLocalData();
    const index = data.students.findIndex((s: any) => s.id === id);
    if (index !== -1) {
      data.students[index] = { 
        ...data.students[index], 
        ...student, 
        polo_id: student.polo_id !== undefined ? (student.polo_id ? Number(student.polo_id) : null) : data.students[index].polo_id,
        course_id: student.course_id !== undefined ? (student.course_id ? Number(student.course_id) : null) : data.students[index].course_id
      };
      // Forçar atualização do carimbo moodle
      if (student.course_id !== undefined || student.status !== undefined) {
        data.students[index].moodle_sync_status = "SINCRONIZADO";
        data.students[index].moodle_sync_date = new Date().toISOString().split("T")[0];
      }
      writeLocalData(data);
      return true;
    }
    return false;
  }
}

async function deleteStudent(id: number): Promise<boolean> {
  if (dbStatus.mode === "MYSQL" && mysqlPool) {
    const [result]: any = await mysqlPool.query("DELETE FROM students WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } else {
    const data = readLocalData();
    const filtered = data.students.filter((s: any) => s.id !== id);
    const deleted = filtered.length !== data.students.length;
    data.students = filtered;
    data.grades = data.grades.filter((g: any) => g.student_id !== id);
    data.transactions = data.transactions.filter((t: any) => t.student_id !== id);
    writeLocalData(data);
    return deleted;
  }
}

// ==== ROTAS DA API =====

// 1. Status do banco de dados
app.get("/api/db-status", (req, res) => {
  res.json(dbStatus);
});

// 2. Alunos
app.get("/api/students", async (req, res) => {
  try {
    const students = await fetchStudents();
    res.json(students);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const { nome, email, matricula, status, data_nascimento, telefone, polo_id } = req.body;
    if (!nome || !email || !matricula) {
      res.status(400).json({ error: "Faltam campos obrigatórios." });
      return;
    }
    const student = await addStudent({
      nome,
      email,
      matricula,
      status: status || "ATIVO",
      data_nascimento,
      telefone: telefone || "",
      polo_id: polo_id ? Number(polo_id) : null
    });
    res.status(201).json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateStudent(id, req.body);
    if (updated) {
      res.json({ success: true, message: "Aluno atualizado com sucesso." });
    } else {
      res.status(404).json({ error: "Aluno não encontrado." });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteStudent(id);
    if (deleted) {
      res.json({ success: true, message: "Aluno removido com sucesso." });
    } else {
      res.status(404).json({ error: "Aluno não encontrado." });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- CURSOS ENDPOINTS (MÉTODO CADASTRO DE CURSOS) ---
app.get("/api/courses", (req, res) => {
  try {
    const data = readLocalData();
    res.json(data.courses || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/courses", (req, res) => {
  try {
    const data = readLocalData();
    const { nome, carga_horaria, categoria, duracao_meses, preco_mensal, status, moodle_course_id } = req.body;
    if (!nome) {
      res.status(400).json({ error: "O nome do curso é obrigatório." });
      return;
    }
    const newId = (data.courses || []).length > 0 ? Math.max(...data.courses.map((c: any) => c.id)) + 1 : 1;
    const newCourse = {
      id: newId,
      nome,
      carga_horaria: Number(carga_horaria || 0),
      categoria: categoria || "Extensão",
      duracao_meses: Number(duracao_meses || 1),
      preco_mensal: Number(preco_mensal || 0),
      status: status || "ATIVO",
      moodle_course_id: moodle_course_id || `moodle_${nome.toLowerCase().replace(/[^a-z0-9]/g, '')}`
    };
    if (!data.courses) data.courses = [];
    data.courses.push(newCourse);
    writeLocalData(data);
    res.status(201).json(newCourse);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/courses/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = readLocalData();
    const index = (data.courses || []).findIndex((c: any) => c.id === id);
    if (index !== -1) {
      data.courses[index] = {
        ...data.courses[index],
        ...req.body,
        id // keep immutable
      };
      writeLocalData(data);
      res.json(data.courses[index]);
    } else {
      res.status(404).json({ error: "Curso não encontrado." });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/courses/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = readLocalData();
    const originalLength = (data.courses || []).length;
    data.courses = (data.courses || []).filter((c: any) => c.id !== id);
    if (data.courses.length < originalLength) {
      writeLocalData(data);
      res.json({ success: true, message: "Curso excluído com sucesso." });
    } else {
      res.status(404).json({ error: "Curso não encontrado." });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- TICKETS ENDPOINTS (SISTEMA DE SUPORTE HELP-DESK/TICKET) ---
app.get("/api/tickets", (req, res) => {
  try {
    const data = readLocalData();
    const tickets = (data.tickets || []).map((t: any) => {
      const s = data.students?.find((student: any) => student.id === t.student_id);
      return {
        ...t,
        student_nome: s ? s.nome : "Aluno Externo"
      };
    });
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/tickets", (req, res) => {
  try {
    const data = readLocalData();
    const { student_id, assunto, categoria, descricao, prioridade } = req.body;
    if (!student_id || !assunto || !descricao) {
      res.status(400).json({ error: "Campos obrigatórios ausentes." });
      return;
    }
    const newId = (data.tickets || []).length > 0 ? Math.max(...data.tickets.map((t: any) => t.id)) + 1 : 1;
    const newTicket = {
      id: newId,
      student_id: Number(student_id),
      assunto,
      categoria: categoria || "SECRETARIA",
      descricao,
      prioridade: prioridade || "MEDIA",
      status: "ABERTO",
      data_abertura: new Date().toISOString().split("T")[0]
    };
    if (!data.tickets) data.tickets = [];
    data.tickets.push(newTicket);
    writeLocalData(data);
    res.status(201).json(newTicket);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/tickets/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = readLocalData();
    const index = (data.tickets || []).findIndex((t: any) => t.id === id);
    if (index !== -1) {
      data.tickets[index] = {
        ...data.tickets[index],
        ...req.body,
        id
      };
      writeLocalData(data);
      res.json(data.tickets[index]);
    } else {
      res.status(404).json({ error: "Ticket não encontrado." });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- GESTÃO DE LEADS (CRM) ---
app.get("/api/leads", (req, res) => {
  try {
    const data = readLocalData();
    res.json(data.leads || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/leads", (req, res) => {
  try {
    const data = readLocalData();
    const { nome, email, telefone, status, polo_id, course_id, origem, observacoes } = req.body;
    if (!nome) {
      res.status(400).json({ error: "O nome do Lead é obrigatório." });
      return;
    }
    const newId = (data.leads || []).length > 0 ? Math.max(...data.leads.map((l: any) => l.id)) + 1 : 1;
    const newLead = {
      id: newId,
      nome,
      email: email || "",
      telefone: telefone || "",
      status: status || "NOVO",
      polo_id: polo_id ? Number(polo_id) : 1,
      course_id: course_id ? Number(course_id) : null,
      origem: origem || "Não especificada",
      observacoes: observacoes || "",
      data_cadastro: new Date().toISOString().split("T")[0]
    };
    if (!data.leads) data.leads = [];
    data.leads.push(newLead);
    writeLocalData(data);
    res.status(201).json(newLead);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/leads/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = readLocalData();
    const index = (data.leads || []).findIndex((l: any) => l.id === id);
    if (index !== -1) {
      data.leads[index] = {
        ...data.leads[index],
        ...req.body,
        id
      };
      writeLocalData(data);
      res.json(data.leads[index]);
    } else {
      res.status(404).json({ error: "Lead não encontrado." });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/leads/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = readLocalData();
    if (!data.leads) data.leads = [];
    const filtered = data.leads.filter((l: any) => l.id !== id);
    const deleted = filtered.length !== data.leads.length;
    data.leads = filtered;
    writeLocalData(data);
    if (deleted) {
      res.json({ success: true, message: "Lead excluído com sucesso." });
    } else {
      res.status(404).json({ error: "Lead não encontrado." });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- GESTÃO MOODLE CONFIG ENDPOINTS ---
app.get("/api/moodle/config", (req, res) => {
  try {
    const data = readLocalData();
    res.json(data.moodle_config || {
      url: "https://moodle.magalhaes-edu.com.br",
      token: "",
      auto_sync: true,
      connected: false
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/moodle/config", (req, res) => {
  try {
    const data = readLocalData();
    const { url, token, auto_sync, connected } = req.body;
    data.moodle_config = {
      url: url || "https://moodle.magalhaes-edu.com.br",
      token: token || "",
      auto_sync: auto_sync !== undefined ? !!auto_sync : true,
      connected: connected !== undefined ? !!connected : true
    };
    writeLocalData(data);
    res.json(data.moodle_config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/moodle/sync/:studentId", (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const data = readLocalData();
    const studentIndex = data.students?.findIndex((s: any) => s.id === studentId);
    if (studentIndex === -1 || studentIndex === undefined) {
      res.status(404).json({ error: "Aluno não encontrado." });
      return;
    }
    
    // Simular requisição HTTP Moodle WebService (REST JSON ws)
    const s = data.students[studentIndex];
    const c = data.courses?.find((x: any) => x.id === s.course_id);
    const mConfig = data.moodle_config || {};
    
    s.moodle_sync_status = "SINCRONIZADO";
    s.moodle_sync_date = new Date().toISOString().split("T")[0];
    writeLocalData(data);
    
    res.json({
      success: true,
      message: `Sincronização realizada com sucesso! Vinculou Aluno '${s.nome}' ao Moodle.`,
      moodle_incoming_payload: {
        wsfunction: "enrol_manual_enrol_users",
        moodle_url: mConfig.url || "https://moodle.magalhaes-edu.com.br",
        enrollment: {
          roleid: 5,
          username: s.email,
          course_moodle_id: c?.moodle_course_id || "moodle_softeng101"
        }
      },
      synced_at: s.moodle_sync_date
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Turmas
app.get("/api/classes", async (req, res) => {
  try {
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [rows] = await mysqlPool.query("SELECT * FROM classes");
      res.json(rows);
    } else {
      res.json(readLocalData().classes);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/classes", async (req, res) => {
  try {
    const { nome, serie, turno } = req.body;
    if (!nome || !serie || !turno) {
       res.status(400).json({ error: "Campos obrigatórios ausentes." });
       return;
    }
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [result]: any = await mysqlPool.query(
        "INSERT INTO classes (nome, serie, turno) VALUES (?, ?, ?)",
        [nome, serie, turno]
      );
      res.status(201).json({ id: result.insertId, nome, serie, turno });
    } else {
      const data = readLocalData();
      const newId = data.classes.length > 0 ? Math.max(...data.classes.map((c: any) => c.id)) + 1 : 1;
      const newClass = { id: newId, nome, serie, turno };
      data.classes.push(newClass);
      writeLocalData(data);
      res.status(201).json(newClass);
    }
  } catch (error: any) {
     res.status(500).json({ error: error.message });
  }
});

// 4. Notas Acadêmicas
app.get("/api/grades", async (req, res) => {
  try {
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [rows] = await mysqlPool.query(
        `SELECT g.*, s.nome as student_nome 
         FROM grades g 
         INNER JOIN students s ON g.student_id = s.id 
         ORDER BY g.id DESC`
      );
      res.json(rows);
    } else {
      const data = readLocalData();
      const gradesWithNames = data.grades.map((g: any) => {
        const s = data.students.find((std: any) => std.id === g.student_id);
        return {
          ...g,
          student_nome: s ? s.nome : "Desconhecido"
        };
      });
      res.json(gradesWithNames);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/grades", async (req, res) => {
  try {
    const { student_id, disciplina, nota, faltas } = req.body;
    if (!student_id || !disciplina || nota == null) {
      res.status(400).json({ error: "Campos obrigatórios em falta." });
      return;
    }
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [result]: any = await mysqlPool.query(
        "INSERT INTO grades (student_id, disciplina, nota, faltas) VALUES (?, ?, ?, ?)",
        [student_id, disciplina, nota, faltas || 0]
      );
      res.status(201).json({ id: result.insertId, student_id, disciplina, nota, faltas });
    } else {
      const data = readLocalData();
      const newId = data.grades.length > 0 ? Math.max(...data.grades.map((g: any) => g.id)) + 1 : 1;
      const newGrade = { id: newId, student_id: Number(student_id), disciplina, nota: Number(nota), faltas: Number(faltas || 0) };
      data.grades.push(newGrade);
      writeLocalData(data);
      res.status(201).json(newGrade);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Financeiro
app.get("/api/transactions", async (req, res) => {
  try {
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [rows] = await mysqlPool.query(
        `SELECT t.*, s.nome as student_nome 
         FROM transactions t 
         LEFT JOIN students s ON t.student_id = s.id 
         ORDER BY t.data_vencimento DESC`
      );
      res.json(rows);
    } else {
      const data = readLocalData();
      const list = data.transactions.map((t: any) => {
        let name = "Diversos (Despesa / Outros)";
        if (t.student_id) {
          const s = data.students.find((std: any) => std.id === t.student_id);
          if (s) name = s.nome;
        }
        return {
          ...t,
          student_nome: name
        };
      });
      res.json(list);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { student_id, tipo, valor, descricao, data_vencimento, data_pagamento, status, categoria, fornecedor, polo_id } = req.body;
    if (!tipo || !valor || !descricao || !data_vencimento) {
      res.status(400).json({ error: "Parâmetros obrigatórios em falta." });
      return;
    }
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [result]: any = await mysqlPool.query(
        "INSERT INTO transactions (student_id, tipo, valor, descricao, data_vencimento, data_pagamento, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [student_id || null, tipo, valor, descricao, data_vencimento, data_pagamento || null, status || "PENDENTE"]
      );
      res.status(201).json({ id: result.insertId, student_id, tipo, valor, descricao, data_vencimento, data_pagamento, status, categoria: categoria || "DIVERSOS", fornecedor: fornecedor || "Geral", polo_id: polo_id ? Number(polo_id) : 1 });
    } else {
      const data = readLocalData();
      const newId = data.transactions.length > 0 ? Math.max(...data.transactions.map((t: any) => t.id)) + 1 : 1;
      
      let finalPoloId = polo_id ? Number(polo_id) : 1;
      if (student_id && !polo_id) {
        const s = data.students.find((std: any) => std.id === Number(student_id));
        if (s) {
          finalPoloId = Number(s.polo_id) || 1;
        }
      }

      const newTx = {
        id: newId,
        student_id: student_id ? Number(student_id) : null,
        tipo,
        valor: Number(valor),
        descricao,
        data_vencimento,
        data_pagamento: data_pagamento || null,
        status: status || "PENDENTE",
        categoria: categoria || (tipo === "RECEITA" ? "MENSALIDADE" : "DIVERSOS"),
        fornecedor: fornecedor || (tipo === "RECEITA" ? "Aluno / Mensalidade" : "Fornecedor de Serviço"),
        polo_id: finalPoloId
      };
      data.transactions.push(newTx);
      writeLocalData(data);
      res.status(201).json(newTx);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar transação (mudar status de pagamento / dar baixa em faturas / marcar como atrasado)
app.put("/api/transactions/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, data_pagamento } = req.body;
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [result]: any = await mysqlPool.query(
        "UPDATE transactions SET status = ?, data_pagamento = ? WHERE id = ?",
        [status, data_pagamento || null, id]
      );
      if (result.affectedRows > 0) {
        res.json({ success: true, message: "Transação atualizada." });
      } else {
        res.status(404).json({ error: "Transação não encontrada." });
      }
    } else {
      const data = readLocalData();
      const index = data.transactions.findIndex((t: any) => t.id === id);
      if (index !== -1) {
        data.transactions[index].status = status;
        data.transactions[index].data_pagamento = data_pagamento || null;
        writeLocalData(data);
        res.json({ success: true, message: "Transação atualizada localmente." });
      } else {
        res.status(404).json({ error: "Transação não encontrada." });
      }
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Remover transação (estornar faturamento ou apagar despesa errada)
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [result]: any = await mysqlPool.query("DELETE FROM transactions WHERE id = ?", [id]);
      if (result.affectedRows > 0) {
        res.json({ success: true, message: "Lançamento excluído com sucesso do banco." });
      } else {
        res.status(404).json({ error: "Transação não encontrada." });
      }
    } else {
      const data = readLocalData();
      const filtered = data.transactions.filter((t: any) => t.id !== id);
      const deleted = filtered.length !== data.transactions.length;
      data.transactions = filtered;
      writeLocalData(data);
      if (deleted) {
        res.json({ success: true, message: "Lançamento excluído localmente." });
      } else {
        res.status(404).json({ error: "Transação não encontrada." });
      }
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Remover nota (excluir média/boletim lançado por engano)
app.delete("/api/grades/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [result]: any = await mysqlPool.query("DELETE FROM grades WHERE id = ?", [id]);
      if (result.affectedRows > 0) {
        res.json({ success: true, message: "Avaliação removida com sucesso." });
      } else {
        res.status(404).json({ error: "Avaliação não localizada." });
      }
    } else {
      const data = readLocalData();
      const filtered = data.grades.filter((g: any) => g.id !== id);
      const deleted = filtered.length !== data.grades.length;
      data.grades = filtered;
      writeLocalData(data);
      if (deleted) {
        res.json({ success: true, message: "Avaliação removida localmente." });
      } else {
        res.status(404).json({ error: "Avaliação não localizada." });
      }
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Consultor Inteligente (AI Assistant)
app.post("/api/ai/analyze", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Falta a mensagem ou prompt de análise." });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: "Por favor, configure sua chave GEMINI_API_KEY em Configurações > Secrets ou no arquivo .env."
      });
      return;
    }

    // Inicializar o SDK moderno do Google GenAI
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `Você é o Assistente Virtual "FinanAI - Diretor Acadêmico" da plataforma EduFinance, especializada em inteligência financeira para gestão escolar e acadêmica do Brasil. 
Use um tom altamente profissional, polido, empático e de prestação de serviços educacionais de alto padrão.
Você está atendendo o Diretor da escola (diretor@magalhaes-edu.com.br).
Sempre responda em Português do Brasil (PT-BR). Use formatação Markdown (tópicos, negrito, tabelas) para facilitar a leitura.
Se lhe forem fornecidos dados de contexto (alunos, faturas, desempenho acadêmico), analise-os com precisão para dar insights financeiros inteligentes, sugerir estratégias de cobrança amigáveis ou rascunhar mensagens de WhatsApp adequadas para inadimplentes.`;

    const userMessage = `
--- CONTEXTO ATUAL DO SISTEMA ---
${JSON.stringify(context || {})}
---------------------------------

Pergunta/Solicitação do Diretor Escolar:
${prompt}
`;

    // Chamando o modelo recomendado de texto 'gemini-3.5-flash' em conformidade total com o skill.md
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Erro no processamento da IA:", error);
    res.status(500).json({ error: `Falha na Inteligência Artificial: ${error.message}` });
  }
});


// ==========================================
// MÓDULO ADICIONAL: CADASTRO DE POLOS (FILIAIS)
// ==========================================
app.get("/api/polos", async (req, res) => {
  try {
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const [rows] = await mysqlPool.query("SELECT * FROM polos ORDER BY nome ASC");
        res.json(rows);
        return;
      } catch (e) {
        // Fallback se a tabela não existir no MySQL
      }
    }
    const data = readLocalData();
    res.json(data.polos || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/polos", async (req, res) => {
  try {
    const { nome, cidade, estado, endereco, mec_codigo, status, contato_telefone, asaas_token, split_enabled, split_porcentagem_repasse, split_dia_vencimento, cursos_moodle_apenas } = req.body;
    if (!nome || !cidade) {
      res.status(400).json({ error: "Nome e cidade são obrigatórios para registrar o Polo." });
      return;
    }

    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const [result]: any = await mysqlPool.query(
          "INSERT INTO polos (nome, cidade, estado, endereco, mec_codigo, status, contato_telefone, asaas_token, split_enabled, split_porcentagem_repasse, split_dia_vencimento, cursos_moodle_apenas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [nome, cidade, estado || "", endereco || "", mec_codigo || "", status || "ATIVO", contato_telefone || "", asaas_token || "", split_enabled ? 1 : 0, Number(split_porcentagem_repasse || 20), Number(split_dia_vencimento || 25), cursos_moodle_apenas ? 1 : 0]
        );
        res.status(201).json({ id: result.insertId, nome, cidade, estado, endereco, mec_codigo, status, contato_telefone, asaas_token, split_enabled, split_porcentagem_repasse, split_dia_vencimento, cursos_moodle_apenas });
        return;
      } catch (e) {
        // Fallback
      }
    }

    const data = readLocalData();
    const newId = data.polos.length > 0 ? Math.max(...data.polos.map((p: any) => p.id)) + 1 : 1;
    const newPolo = { 
      id: newId, 
      nome, 
      cidade, 
      estado, 
      endereco, 
      mec_codigo, 
      status: status || "ATIVO", 
      contato_telefone,
      asaas_token: asaas_token || "",
      split_enabled: !!split_enabled,
      split_porcentagem_repasse: Number(split_porcentagem_repasse !== undefined ? split_porcentagem_repasse : 20),
      split_dia_vencimento: Number(split_dia_vencimento !== undefined ? split_dia_vencimento : 25),
      cursos_moodle_apenas: !!cursos_moodle_apenas
    };
    data.polos.push(newPolo);
    writeLocalData(data);
    res.status(201).json(newPolo);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/polos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, cidade, estado, endereco, mec_codigo, status, contato_telefone, asaas_token, split_enabled, split_porcentagem_repasse, split_dia_vencimento, cursos_moodle_apenas } = req.body;

    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        await mysqlPool.query(
          "UPDATE polos SET nome=?, cidade=?, estado=?, endereco=?, mec_codigo=?, status=?, contato_telefone=?, asaas_token=?, split_enabled=?, split_porcentagem_repasse=?, split_dia_vencimento=?, cursos_moodle_apenas=? WHERE id=?",
          [nome, cidade, estado, endereco, mec_codigo, status, contato_telefone, asaas_token, split_enabled ? 1 : 0, Number(split_porcentagem_repasse || 20), Number(split_dia_vencimento || 25), cursos_moodle_apenas ? 1 : 0, id]
        );
        res.json({ success: true, message: "Polo atualizado." });
        return;
      } catch (e) {}
    }

    const data = readLocalData();
    const index = data.polos.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      data.polos[index] = { 
        ...data.polos[index], 
        nome, 
        cidade, 
        estado, 
        endereco, 
        mec_codigo, 
        status, 
        contato_telefone,
        asaas_token: asaas_token || "",
        split_enabled: !!split_enabled,
        split_porcentagem_repasse: Number(split_porcentagem_repasse !== undefined ? split_porcentagem_repasse : 20),
        split_dia_vencimento: Number(split_dia_vencimento !== undefined ? split_dia_vencimento : 25),
        cursos_moodle_apenas: !!cursos_moodle_apenas
      };
      writeLocalData(data);
      res.json({ success: true, message: "Polo atualizado localmente." });
    } else {
      res.status(404).json({ error: "Polo não encontrado." });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/polos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        await mysqlPool.query("DELETE FROM polos WHERE id = ?", [id]);
        res.json({ success: true, message: "Polo excluído." });
        return;
      } catch (e) {}
    }

    const data = readLocalData();
    data.polos = (data.polos || []).filter((p: any) => p.id !== id);
    data.students.forEach((s: any) => {
      if (s.polo_id === id) s.polo_id = null;
    });
    writeLocalData(data);
    res.json({ success: true, message: "Polo excluído localmente." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// MÓDULO ADICIONAL: GESTÃO DE USUÁRIOS E PERMISSÕES
// ==========================================
app.get("/api/users", async (req, res) => {
  try {
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const [rows] = await mysqlPool.query("SELECT * FROM system_users ORDER BY id DESC");
        res.json(rows);
        return;
      } catch (e) {}
    }
    const data = readLocalData();
    res.json(data.users || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { nome, email, cargo, status, perm_alunos, perm_academico, perm_financeiro, perm_polos } = req.body;
    if (!nome || !email) {
      res.status(400).json({ error: "Nome e e-mail são obrigatórios para registrar o usuário operador." });
      return;
    }

    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const [result]: any = await mysqlPool.query(
          "INSERT INTO system_users (nome, email, cargo, status, data_cadastro, perm_alunos, perm_academico, perm_financeiro, perm_polos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [nome, email, cargo || "Operador", status || "ATIVO", new Date().toISOString().split('T')[0], perm_alunos || "SEM_ACESSO", perm_academico || "SEM_ACESSO", perm_financeiro || "SEM_ACESSO", perm_polos || "SEM_ACESSO"]
        );
        res.status(201).json({ id: result.insertId, nome, email, cargo, status, data_cadastro: new Date().toISOString().split('T')[0], perm_alunos, perm_academico, perm_financeiro, perm_polos });
        return;
      } catch (e) {}
    }

    const data = readLocalData();
    const newId = data.users.length > 0 ? Math.max(...data.users.map((u: any) => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      nome,
      email,
      cargo: cargo || "Operador",
      status: status || "ATIVO",
      data_cadastro: new Date().toISOString().split('T')[0],
      perm_alunos: perm_alunos || "APENAS_LEITURA",
      perm_academico: perm_academico || "SEM_ACESSO",
      perm_financeiro: perm_financeiro || "SEM_ACESSO",
      perm_polos: perm_polos || "SEM_ACESSO"
    };
    data.users.push(newUser);
    writeLocalData(data);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, email, cargo, status, perm_alunos, perm_academico, perm_financeiro, perm_polos } = req.body;

    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        await mysqlPool.query(
          "UPDATE system_users SET nome=?, email=?, cargo=?, status=?, perm_alunos=?, perm_academico=?, perm_financeiro=?, perm_polos=? WHERE id=?",
          [nome, email, cargo, status, perm_alunos, perm_academico, perm_financeiro, perm_polos, id]
        );
        res.json({ success: true, message: "Usuário atualizado." });
        return;
      } catch (e) {}
    }

    const data = readLocalData();
    const index = data.users.findIndex((u: any) => u.id === id);
    if (index !== -1) {
      data.users[index] = { 
        ...data.users[index], 
        nome, 
        email, 
        cargo, 
        status, 
        perm_alunos, 
        perm_academico, 
        perm_financeiro, 
        perm_polos 
      };
      writeLocalData(data);
      res.json({ success: true, message: "Usuário atualizado localmente." });
    } else {
      res.status(404).json({ error: "Usuário não localizado." });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        await mysqlPool.query("DELETE FROM system_users WHERE id = ?", [id]);
        res.json({ success: true, message: "Usuário excluído do banco MySQL." });
        return;
      } catch (e) {}
    }

    const data = readLocalData();
    data.users = (data.users || []).filter((u: any) => u.id !== id);
    writeLocalData(data);
    res.json({ success: true, message: "Usuário excluído localmente." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// MÓDULO ADICIONAL: SIMULAÇÃO INTEGRAÇÃO ASAAS
// ==========================================
app.post("/api/asaas/simulate-split", (req, res) => {
  try {
    const { polo_id, valor, student_nome, course_nome } = req.body;
    const data = readLocalData();
    const polo = data.polos?.find((p: any) => p.id === Number(polo_id));
    
    if (!polo) {
      res.status(404).json({ error: "Polo não encontrado." });
      return;
    }
    
    const pct = polo.split_porcentagem_repasse || 20;
    const valorPolo = (valor * pct) / 100;
    const valorMatriz = valor - valorPolo;
    
    res.json({
      success: true,
      message: "Operação de Split simulada via API do Asaas!",
      request_sent: {
        url: "https://api.asaas.com/v3/payments",
        headers: {
          "access_token": polo.asaas_token || "asaas_token_generic"
        },
        body: {
          customer: `cus_${Math.random().toString(36).substr(2, 9)}`,
          billingType: "BOLETO",
          value: Number(valor),
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          description: `Mensalidade - ${course_nome || "Curso EduFinance"} - Aluno ${student_nome}`,
          split: polo.split_enabled ? [
            {
              walletId: `wallet_${polo.nome.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
              percentualValue: pct,
              fixedValue: null
            }
          ] : []
        }
      },
      split_calculated: {
        total: Number(valor),
        transfer_percentage: pct,
        retained_by_matrix: valorMatriz,
        transferred_to_polo: valorPolo,
        recipient_token_used: polo.asaas_token ? `***${polo.asaas_token.slice(-6)}` : "Não Configurado"
      },
      webhook_payload_simulation: {
        event: "PAYMENT_RECEIVED",
        payment: {
          id: `pay_${Math.random().toString(36).substr(2, 9)}`,
          value: Number(valor),
          netValue: Number(valor) * 0.99,
          status: "RECEIVED",
          split: [
            {
              walletId: `wallet_${polo.nome.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
              value: valorPolo,
              status: "DONE"
            }
          ]
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// INICIALIZALIZAR SERVIDOR
async function startServer() {
  await initDatabase();

  // Vite middleware setups
  if (!isProd) {
    console.log("Configurando middleware do Vite em desenvolvimento...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Servindo pasta estática dist/ em produção...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
