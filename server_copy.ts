import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Student, Class, Grade, Transaction, DBConfigStatus } from "./src/types";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3002;
const isProd = process.env.NODE_ENV === "production";

const MOODLE_URL = process.env.MOODLE_URL || "https://ava.imepedu.com.br";
const MOODLE_TOKEN = process.env.MOODLE_TOKEN || "a7fe17703259c9c3cd64b1324ada075e";
const MOODLE_DEFAULT_PASSWORD = process.env.MOODLE_DEFAULT_PASSWORD || "ImepEdu@2026!";

// ==========================================
// EMAIL CONFIG (Nodemailer + Gmail)
// ==========================================
const EMAIL_USER = process.env.EMAIL_USER || "magalhaeseducacao.aedu@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "tfha akja cnyc urjv";
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@imepedu.com.br";
const SITE_URL = process.env.APP_URL || "https://finan.imepedu.com.br";
const AVA_URL = process.env.MOODLE_URL || "https://ava.imepedu.com.br";

const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS.replace(/\s/g, ""),
  },
});

// Função para enviar email de boas-vindas ao aluno
async function sendWelcomeEmail(params: {
  nome: string;
  email: string;
  matricula: string;
  username: string;
  password: string;
  curso?: string;
  valor_matricula?: number;
  num_parcelas?: number;
  polo_nome?: string;
}) {
  const { nome, email, matricula, username, password, curso, valor_matricula, num_parcelas, polo_nome } = params;

  const primeiroNome = nome.split(" ")[0];

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao IMEPEDU</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#1e1b4b;border-radius:16px 16px 0 0;padding:32px;text-align:center;">
              <img src="https://site.imepedu.com.br/images/logo.png" alt="IMEPEDU" style="max-height:60px;max-width:200px;object-fit:contain;" />
              <p style="color:#a5b4fc;font-size:12px;margin:12px 0 0 0;letter-spacing:2px;text-transform:uppercase;">Instituto Magalhães de Educação Profissional</p>
            </td>
          </tr>

          <!-- BOAS VINDAS -->
          <tr>
            <td style="background-color:#ffffff;padding:40px 40px 20px 40px;">
              <h1 style="color:#1e1b4b;font-size:24px;margin:0 0 8px 0;">Olá, ${primeiroNome}! 🎓</h1>
              <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px 0;">
                Sua matrícula foi realizada com sucesso! Estamos muito felizes em tê-lo(a) como nosso aluno(a).
                Abaixo você encontra todas as informações necessárias para começar sua jornada.
              </p>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px 0;" />
            </td>
          </tr>

          <!-- DADOS DA MATRÍCULA -->
          <tr>
            <td style="background-color:#ffffff;padding:0 40px 24px 40px;">
              <h2 style="color:#1e1b4b;font-size:16px;margin:0 0 16px 0;">📋 Dados da Matrícula</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">
                    <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Nome</span><br/>
                    <strong style="color:#1e293b;font-size:14px;">${nome}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">
                    <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Matrícula</span><br/>
                    <strong style="color:#4f46e5;font-size:14px;font-family:monospace;">${matricula}</strong>
                  </td>
                </tr>
                ${curso ? `
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">
                    <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Curso</span><br/>
                    <strong style="color:#1e293b;font-size:14px;">${curso}</strong>
                  </td>
                </tr>` : ""}
                ${polo_nome ? `
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">
                    <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Polo / Unidade</span><br/>
                    <strong style="color:#1e293b;font-size:14px;">${polo_nome}</strong>
                  </td>
                </tr>` : ""}
                ${valor_matricula && num_parcelas ? `
                <tr>
                  <td style="padding:12px 16px;">
                    <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Investimento</span><br/>
                    <strong style="color:#059669;font-size:14px;">R$ ${valor_matricula.toFixed(2)} em ${num_parcelas}x de R$ ${(valor_matricula / num_parcelas).toFixed(2)}</strong>
                  </td>
                </tr>` : ""}
              </table>
            </td>
          </tr>

          <!-- CREDENCIAIS AVA -->
          <tr>
            <td style="background-color:#ffffff;padding:0 40px 24px 40px;">
              <h2 style="color:#1e1b4b;font-size:16px;margin:0 0 16px 0;">🔐 Suas Credenciais de Acesso</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef2ff;border-radius:12px;border:1px solid #c7d2fe;">
                <tr>
                  <td style="padding:16px;">
                    <p style="color:#3730a3;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;font-weight:bold;">Use as mesmas credenciais nos dois portais:</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #c7d2fe;">
                          <span style="color:#6366f1;font-size:12px;font-weight:bold;">👤 USUÁRIO</span><br/>
                          <span style="color:#1e1b4b;font-size:16px;font-family:monospace;font-weight:bold;">${username}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="color:#6366f1;font-size:12px;font-weight:bold;">🔑 SENHA</span><br/>
                          <span style="color:#1e1b4b;font-size:16px;font-family:monospace;font-weight:bold;">${password}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- LINKS DE ACESSO -->
          <tr>
            <td style="background-color:#ffffff;padding:0 40px 40px 40px;">
              <h2 style="color:#1e1b4b;font-size:16px;margin:0 0 16px 0;">🌐 Portais de Acesso</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">
                      <tr>
                        <td style="padding:16px;">
                          <p style="margin:0 0 4px 0;color:#166534;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">📚 Local de Estudos</p>
                          <p style="margin:0 0 12px 0;color:#15803d;font-size:13px;">Acesse suas aulas, materiais e atividades</p>
                          <a href="${AVA_URL}" style="display:inline-block;background-color:#16a34a;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:bold;">${AVA_URL}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#eff6ff;border-radius:12px;border:1px solid #bfdbfe;">
                      <tr>
                        <td style="padding:16px;">
                          <p style="margin:0 0 4px 0;color:#1e40af;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">💰 Portal Financeiro</p>
                          <p style="margin:0 0 12px 0;color:#1d4ed8;font-size:13px;">Acompanhe suas mensalidades e boletos</p>
                          <a href="${SITE_URL}" style="display:inline-block;background-color:#2563eb;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:bold;">${SITE_URL}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#1e1b4b;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
              <p style="color:#a5b4fc;font-size:12px;margin:0 0 8px 0;">IMEPEDU — Instituto Magalhães de Educação Profissional</p>
              <p style="color:#6366f1;font-size:11px;margin:0;">Este é um email automático, por favor não responda.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await emailTransporter.sendMail({
      from: `"IMEPEDU" <${EMAIL_FROM}>`,
      to: email,
      subject: `🎓 Bem-vindo(a) ao IMEPEDU, ${primeiroNome}! Suas credenciais de acesso`,
      html,
    });
    console.log(`✅ Email de boas-vindas enviado para ${email}`);
    return true;
  } catch (e: any) {
    console.error(`❌ Erro ao enviar email para ${email}:`, e.message);
    return false;
  }
}

// ==========================================
// AUTH CONFIG
// ==========================================
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@imepedu.com.br";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

// Session store em memória (simples, sem dependências extras)
const sessions = new Map<string, { userId: string; email: string; role: "superadmin" | "polo" | "aluno"; poloId: number | null; poloNome: string | null; studentId: number | null; studentNome: string | null; expiresAt: number }>();

function createSession(data: { email: string; role: "superadmin" | "polo" | "aluno"; poloId: number | null; poloNome: string | null; studentId?: number | null; studentNome?: string | null }) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 1000 * 60 * 60 * 8; // 8 horas
  sessions.set(token, { userId: token, ...data, studentId: data.studentId || null, studentNome: data.studentNome || null, expiresAt });
  return token;
}

function getSession(token: string) {
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) { sessions.delete(token); return null; }
  return session;
}

// Middleware de autenticação
function requireAuth(req: any, res: any, next: any) {
  const token = req.headers["x-session-token"] || req.cookies?.["session_token"];
  if (!token) { res.status(401).json({ error: "Não autenticado." }); return; }
  const session = getSession(token as string);
  if (!session) { res.status(401).json({ error: "Sessão expirada. Faça login novamente." }); return; }
  req.session = session;
  next();
}

// Middleware de autenticação opcional (para filtrar dados por polo)
function optionalAuth(req: any, res: any, next: any) {
  const token = req.headers["x-session-token"] || req.cookies?.["session_token"];
  if (token) {
    const session = getSession(token as string);
    if (session) req.session = session;
  }
  next();
}

// Hash de senha simples
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + SESSION_SECRET).digest("hex");
}

let dbStatus: DBConfigStatus = { mode: "LOCAL", initialized: false };
let mysqlPool: mysql.Pool | null = null;
const LOCAL_DB_PATH = path.join(process.cwd(), "db_local.json");

// ==========================================
// SEED DATA
// ==========================================
const DEFAULT_DB_DATA = {
  students: [], classes: [], grades: [], transactions: [],
  polos: [], users: [], courses: [], tickets: [], leads: [],
  moodle_config: { url: MOODLE_URL, token: MOODLE_TOKEN, auto_sync: true, connected: true }
};

// ==========================================
// DB LOCAL (JSON) - com proteção total
// ==========================================
const ensureLocalDB = () => {
  let needsReset = false;
  if (!fs.existsSync(LOCAL_DB_PATH)) { needsReset = true; }
  else {
    const raw = fs.readFileSync(LOCAL_DB_PATH, "utf8").trim();
    if (!raw) { needsReset = true; }
    else {
      try {
        const p = JSON.parse(raw);
        if (!p || typeof p !== "object") needsReset = true;
      } catch { needsReset = true; }
    }
  }
  if (needsReset) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(DEFAULT_DB_DATA, null, 2), "utf8");
    console.log("db_local.json recriado com dados seed.");
  }
};

const readLocalData = () => {
  try {
    ensureLocalDB();
    const raw = fs.readFileSync(LOCAL_DB_PATH, "utf8").trim();
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DB_DATA));
    const parsed = JSON.parse(raw);
    return {
      students:     Array.isArray(parsed.students)     ? parsed.students     : [],
      classes:      Array.isArray(parsed.classes)      ? parsed.classes      : [],
      grades:       Array.isArray(parsed.grades)       ? parsed.grades       : [],
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      polos:        Array.isArray(parsed.polos)        ? parsed.polos        : [],
      users:        Array.isArray(parsed.users)        ? parsed.users        : [],
      courses:      Array.isArray(parsed.courses)      ? parsed.courses      : [],
      tickets:      Array.isArray(parsed.tickets)      ? parsed.tickets      : [],
      leads:        Array.isArray(parsed.leads)        ? parsed.leads        : [],
      moodle_config: parsed.moodle_config || DEFAULT_DB_DATA.moodle_config,
    };
  } catch (err: any) {
    console.error("Erro ao ler db_local.json:", err.message);
    return JSON.parse(JSON.stringify(DEFAULT_DB_DATA));
  }
};

const writeLocalData = (data: any) => {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
};

// ==========================================
// MOODLE API HELPER
// ==========================================
async function callMoodle(wsfunction: string, params: Record<string, string | number> = {}) {
  const url = new URL(`${MOODLE_URL}/webservice/rest/server.php`);
  url.searchParams.set("wstoken", MOODLE_TOKEN);
  url.searchParams.set("wsfunction", wsfunction);
  url.searchParams.set("moodlewsrestformat", "json");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const response = await fetch(url.toString());
  const data = await response.json();
  if (data && data.exception) throw new Error(`Moodle: ${data.message}`);
  return data;
}

// ==========================================
// INIT DB
// ==========================================
const initDatabase = async () => {
  ensureLocalDB();
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;
  const port = Number(process.env.MYSQL_PORT) || 3306;

  if (host && user && database) {
    try {
      console.log(`Conectando ao MySQL em: ${host}:${port}...`);
      mysqlPool = mysql.createPool({ host, port, user, password, database, waitForConnections: true, connectionLimit: 10, queueLimit: 0 });
      const connection = await mysqlPool.getConnection();
      console.log("Conexão MySQL ativa e carregada com sucesso.");
      connection.release();
      dbStatus = { mode: "MYSQL", host, database, initialized: true };
    } catch (err: any) {
      console.error("Erro MySQL:", err.message);
      dbStatus = { mode: "LOCAL", initialized: true, error: err.message };
    }
  } else {
    dbStatus = { mode: "LOCAL", initialized: true, error: "Variáveis MySQL ausentes." };
  }
};

// ==========================================
// DUAL-ENGINE HELPERS
// ==========================================
async function fetchStudents(): Promise<Student[]> {
  if (dbStatus.mode === "MYSQL" && mysqlPool) {
    const [rows] = await mysqlPool.query("SELECT * FROM students ORDER BY nome ASC");
    return rows as Student[];
  }
  const data = readLocalData();
  return data.students;
}

async function addStudent(student: any): Promise<Student> {
  if (dbStatus.mode === "MYSQL" && mysqlPool) {
    const [result]: any = await mysqlPool.query(
      "INSERT INTO students (nome, email, matricula, status, data_nascimento, telefone, polo_id, course_id, course_nome, moodle_sync_status, moodle_sync_date, cpf, valor_matricula, num_parcelas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [student.nome, student.email, student.matricula, student.status, student.data_nascimento || null, student.telefone, student.polo_id || null, student.course_id || null, student.course_nome || null, "PENDENTE", null, student.cpf || null, student.valor_matricula || null, student.num_parcelas || 1]
    );
    return { id: result.insertId, ...student } as any;
  }
  const data = readLocalData();
  const newId = data.students.length > 0 ? Math.max(...data.students.map((s: any) => s.id)) + 1 : 1;
  const newStudent = { id: newId, ...student, moodle_sync_status: "PENDENTE", moodle_sync_date: null };
  data.students.push(newStudent);
  writeLocalData(data);
  return newStudent;
}

// Gerar matrícula automática baseada no polo
async function gerarMatricula(polo_id: number | null): Promise<string> {
  let prefixo = "MAT";

  if (polo_id && dbStatus.mode === "MYSQL" && mysqlPool) {
    const [poloRows]: any = await mysqlPool.query("SELECT nome FROM polos WHERE id = ? LIMIT 1", [polo_id]);
    if (poloRows[0]?.nome) {
      // Pegar iniciais do nome do polo (ex: "Breu Branco" → "BB", "AVA" → "AVA")
      const palavras = poloRows[0].nome.trim().split(/\s+/);
      if (palavras.length === 1) {
        prefixo = palavras[0].substring(0, 3).toUpperCase();
      } else {
        prefixo = palavras.map((p: string) => p[0]).join("").toUpperCase();
      }
    }
  } else if (polo_id) {
    const data = readLocalData();
    const polo = (data.polos || []).find((p: any) => p.id === polo_id);
    if (polo?.nome) {
      const palavras = polo.nome.trim().split(/\s+/);
      if (palavras.length === 1) {
        prefixo = palavras[0].substring(0, 3).toUpperCase();
      } else {
        prefixo = palavras.map((p: string) => p[0]).join("").toUpperCase();
      }
    }
  }

  // Buscar o maior número sequencial já usado para este prefixo
  let nextNum = 1;
  if (dbStatus.mode === "MYSQL" && mysqlPool) {
    const [rows]: any = await mysqlPool.query(
      "SELECT matricula FROM students WHERE matricula LIKE ? ORDER BY id DESC LIMIT 1",
      [`${prefixo}-%`]
    );
    if (rows.length > 0) {
      const lastNum = parseInt(rows[0].matricula.split("-").pop() || "0", 10);
      if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }
  } else {
    const data = readLocalData();
    const matching = (data.students || [])
      .filter((s: any) => s.matricula?.startsWith(`${prefixo}-`))
      .map((s: any) => parseInt(s.matricula.split("-").pop() || "0", 10))
      .filter((n: number) => !isNaN(n));
    if (matching.length > 0) nextNum = Math.max(...matching) + 1;
  }

  return `${prefixo}-${String(nextNum).padStart(3, "0")}`;
}

async function updateStudent(id: number, student: any): Promise<boolean> {
  if (dbStatus.mode === "MYSQL" && mysqlPool) {
    const [result]: any = await mysqlPool.query(
      "UPDATE students SET nome = COALESCE(?, nome), email = COALESCE(?, email), matricula = COALESCE(?, matricula), status = COALESCE(?, status), data_nascimento = COALESCE(?, data_nascimento), telefone = COALESCE(?, telefone), polo_id = COALESCE(?, polo_id), course_id = COALESCE(?, course_id) WHERE id = ?",
      [student.nome, student.email, student.matricula, student.status, student.data_nascimento || null, student.telefone, student.polo_id || null, student.course_id || null, id]
    );
    return result.affectedRows > 0;
  }
  const data = readLocalData();
  const index = data.students.findIndex((s: any) => s.id === id);
  if (index !== -1) { data.students[index] = { ...data.students[index], ...student }; writeLocalData(data); return true; }
  return false;
}

async function deleteStudent(id: number): Promise<boolean> {
  if (dbStatus.mode === "MYSQL" && mysqlPool) {
    const [result]: any = await mysqlPool.query("DELETE FROM students WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
  const data = readLocalData();
  const filtered = data.students.filter((s: any) => s.id !== id);
  const deleted = filtered.length !== data.students.length;
  data.students = filtered;
  writeLocalData(data);
  return deleted;
}

// ==========================================
// ROTAS
// ==========================================

app.get("/api/db-status", (req, res) => res.json(dbStatus));

// --- ALUNOS ---
app.get("/api/students", async (req, res) => {
  try { res.json(await fetchStudents()); }
  catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/students", async (req, res) => {
  try {
    const { nome, email, status, data_nascimento, telefone, polo_id, course_id, cpf, valor_matricula, num_parcelas, course_nome_hint } = req.body;
    if (!nome || !email) { res.status(400).json({ error: "Campos obrigatórios ausentes." }); return; }
    if (!cpf) { res.status(400).json({ error: "CPF é obrigatório." }); return; }
    const safeCourseId = (course_id && !String(course_id).startsWith("cat_")) ? Number(course_id) : null;
    const safeDataNasc = data_nascimento && data_nascimento.trim() !== "" ? data_nascimento : null;
    // Gerar matrícula automática
    const matricula = await gerarMatricula(polo_id ? Number(polo_id) : null);

    // Resolver nome do curso
    // Prioridade: 1) course_nome_hint do frontend, 2) banco local, 3) Moodle API
    let course_nome: string | null = course_nome_hint || null;

    if (!course_nome && safeCourseId) {
      // Curso individual — buscar localmente
      if (dbStatus.mode === "MYSQL" && mysqlPool) {
        const [cRows]: any = await mysqlPool.query("SELECT nome FROM courses WHERE id = ? LIMIT 1", [safeCourseId]);
        course_nome = cRows[0]?.nome || null;
      }
      // Se não achou localmente, buscar no Moodle
      if (!course_nome) {
        try {
          const moodleResult = await callMoodle("core_course_get_courses", { "options[ids][0]": String(safeCourseId) });
          if (Array.isArray(moodleResult) && moodleResult[0]?.fullname) {
            course_nome = moodleResult[0].fullname;
          }
        } catch {}
      }
    }
    // Se for categoria e não tiver hint, usar nome genérico
    if (!course_nome && course_id && String(course_id).startsWith("cat_")) {
      const catId = String(course_id).replace("cat_", "");
      course_nome = `Categoria ${catId}`;
    }
    const student = await addStudent({ nome, email, matricula, status: status || "ATIVO", data_nascimento: safeDataNasc, telefone: telefone || "", polo_id: polo_id ? Number(polo_id) : null, course_id: safeCourseId, course_nome, cpf: cpf.replace(/\D/g, ""), valor_matricula: valor_matricula ? Number(valor_matricula) : null, num_parcelas: num_parcelas ? Number(num_parcelas) : 1 });

    // Enviar email de boas-vindas em background (não bloquear a resposta)
    const username = email.toLowerCase().split("@")[0].replace(/[^a-z0-9._-]/g, "").substring(0, 100);
    const ALUNO_DEFAULT_PASSWORD = process.env.ALUNO_DEFAULT_PASSWORD || "ImepEdu@2026!";

    // Buscar nome do polo e curso para o email
    let polo_nome: string | undefined;
    let curso_nome: string | undefined;

    if (polo_id && dbStatus.mode === "MYSQL" && mysqlPool) {
      const [poloRows]: any = await mysqlPool.query("SELECT nome FROM polos WHERE id = ? LIMIT 1", [Number(polo_id)]);
      polo_nome = poloRows[0]?.nome;
    }

    // Enviar email de boas-vindas (async, não bloqueia)
    sendWelcomeEmail({
      nome,
      email,
      matricula,
      username,
      password: ALUNO_DEFAULT_PASSWORD,
      curso: curso_nome,
      polo_nome,
      valor_matricula: valor_matricula ? Number(valor_matricula) : undefined,
      num_parcelas: num_parcelas ? Number(num_parcelas) : undefined,
    }).catch(e => console.error("Falha no email de boas-vindas:", e.message));

    res.status(201).json(student);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const updated = await updateStudent(Number(req.params.id), req.body);
    if (updated) { res.json({ success: true }); } else { res.status(404).json({ error: "Aluno não encontrado." }); }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const deleted = await deleteStudent(Number(req.params.id));
    if (deleted) { res.json({ success: true }); } else { res.status(404).json({ error: "Aluno não encontrado." }); }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// PATCH /api/students/:id/status — alterar status do aluno
app.patch("/api/students/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!["ATIVO", "INATIVO", "PENDENTE"].includes(status)) {
      res.status(400).json({ error: "Status inválido." }); return;
    }
    const ok = await updateStudent(id, { status });
    if (ok) res.json({ success: true, status });
    else res.status(404).json({ error: "Aluno não encontrado." });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- MOODLE ---

// Buscar cursos reais do AVA Moodle
app.get("/api/moodle/courses", async (req, res) => {
  try {
    // Buscar todos os cursos
    const coursesRaw = await callMoodle("core_course_get_courses");

    if (!Array.isArray(coursesRaw)) {
      res.json([]); return;
    }

    const allCourses = coursesRaw
      .filter((c: any) => c.id !== 1)
      .map((c: any) => ({
        id: c.id,
        fullname: c.fullname,
        shortname: c.shortname,
        categoryid: c.categoryid,
        categoryname: c.categoryname || c.category_name || null,
        visible: c.visible ?? 1,
      }));

    // Tentar buscar nomes das categorias via core_course_get_categories
    // (função diferente de core_course_category_get_categories)
    let categoryNamesMap = new Map<number, string>();
    try {
      const catsRaw = await callMoodle("core_course_get_categories");
      if (Array.isArray(catsRaw)) {
        catsRaw.forEach((cat: any) => {
          categoryNamesMap.set(cat.id, cat.name);
        });
      }
    } catch {
      // Se também não tiver, derivar nome genérico a partir dos próprios cursos
      // Agrupar por categoryid e usar o prefixo numérico do curso como pista
    }

    // Se não conseguiu nomes, criar nomes legíveis a partir do categoryid
    // Baseado nos dados conhecidos: categoryid=42 (visto na resposta anterior)
    const getCategoryName = (categoryid: number, fallbackFromCourse?: string): string => {
      if (categoryNamesMap.has(categoryid)) {
        return categoryNamesMap.get(categoryid)!;
      }
      if (fallbackFromCourse) return fallbackFromCourse;
      return `Categoria ${categoryid}`;
    };

    // Derivar categorias únicas agrupando cursos
    const categoryMap = new Map<number, { id: number; name: string; count: number }>();
    allCourses.forEach((c: any) => {
      if (!categoryMap.has(c.categoryid)) {
        categoryMap.set(c.categoryid, {
          id: c.categoryid,
          name: getCategoryName(c.categoryid, c.categoryname),
          count: 0,
        });
      }
      categoryMap.get(c.categoryid)!.count++;
    });

    // Montar lista plana: categoria → cursos ordenados → próxima categoria
    const flatList: any[] = [];

    const sortedCategories = Array.from(categoryMap.values())
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

    sortedCategories.forEach((cat) => {
      flatList.push({
        type: "category",
        id: cat.id,
        name: cat.name,
        parent: 0,
        depth: 0,
        coursecount: cat.count,
        visible: 1,
      });

      const catCourses = allCourses
        .filter((c: any) => c.categoryid === cat.id)
        .sort((a: any, b: any) => a.fullname.localeCompare(b.fullname, "pt-BR"));

      catCourses.forEach((course: any) => {
        flatList.push({
          type: "course",
          id: course.id,
          fullname: course.fullname,
          shortname: course.shortname,
          categoryid: cat.id,
          categoryname: cat.name,
          depth: 1,
          visible: course.visible,
        });
      });
    });

    res.json(flatList);
  } catch (e: any) {
    console.error("/api/moodle/courses error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Matricular aluno no Moodle (cria usuário se não existir)
app.post("/api/moodle/enroll", async (req, res) => {
  try {
    const { student_id, moodle_course_id } = req.body;
    if (!student_id || !moodle_course_id) { res.status(400).json({ error: "student_id e moodle_course_id são obrigatórios." }); return; }

    // Buscar aluno
    let student: any = null;
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [rows]: any = await mysqlPool.query("SELECT * FROM students WHERE id = ?", [student_id]);
      student = rows[0] || null;
    } else {
      student = readLocalData().students.find((s: any) => s.id === Number(student_id)) || null;
    }
    if (!student) { res.status(404).json({ error: "Aluno não encontrado." }); return; }

    // Verificar se usuário já existe no Moodle
    let moodleUserId: number | null = null;
    try {
      const search = await callMoodle("core_user_get_users", { "criteria[0][key]": "email", "criteria[0][value]": student.email });
      if (search?.users?.length > 0) { moodleUserId = search.users[0].id; }
    } catch (e: any) { console.warn("Busca Moodle:", e.message); }

    // Criar usuário no Moodle se não existir
    if (!moodleUserId) {
      const username = student.email.toLowerCase().split("@")[0].replace(/[^a-z0-9._-]/g, "").substring(0, 100);
      const createUrl = new URL(`${MOODLE_URL}/webservice/rest/server.php`);
      createUrl.searchParams.set("wstoken", MOODLE_TOKEN);
      createUrl.searchParams.set("wsfunction", "core_user_create_users");
      createUrl.searchParams.set("moodlewsrestformat", "json");
      createUrl.searchParams.set("users[0][username]", username);
      createUrl.searchParams.set("users[0][password]", MOODLE_DEFAULT_PASSWORD);
      createUrl.searchParams.set("users[0][firstname]", student.nome.split(" ")[0]);
      createUrl.searchParams.set("users[0][lastname]", student.nome.split(" ").slice(1).join(" ") || student.nome);
      createUrl.searchParams.set("users[0][email]", student.email);
      createUrl.searchParams.set("users[0][auth]", "manual");

      const createRes = await fetch(createUrl.toString());
      const createData = await createRes.json();
      if (createData?.exception) throw new Error(`Criar usuário Moodle: ${createData.message}`);
      moodleUserId = createData[0]?.id;
    }

    if (!moodleUserId) throw new Error("Não foi possível obter ID do usuário no Moodle.");

    // Matricular no curso (roleid=5 = aluno)
    const enrollUrl = new URL(`${MOODLE_URL}/webservice/rest/server.php`);
    enrollUrl.searchParams.set("wstoken", MOODLE_TOKEN);
    enrollUrl.searchParams.set("wsfunction", "enrol_manual_enrol_users");
    enrollUrl.searchParams.set("moodlewsrestformat", "json");
    enrollUrl.searchParams.set("enrolments[0][roleid]", "5");
    enrollUrl.searchParams.set("enrolments[0][userid]", String(moodleUserId));
    enrollUrl.searchParams.set("enrolments[0][courseid]", String(moodle_course_id));

    const enrollRes = await fetch(enrollUrl.toString());
    const enrollText = await enrollRes.text();
    const enrollData = enrollText ? JSON.parse(enrollText) : null;
    if (enrollData?.exception) throw new Error(`Matricular Moodle: ${enrollData.message}`);

    // Atualizar status sync do aluno
    const syncDate = new Date().toISOString().split("T")[0];
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      await mysqlPool.query("UPDATE students SET moodle_sync_status = 'SINCRONIZADO', moodle_sync_date = ? WHERE id = ?", [syncDate, student_id]);
    } else {
      const data = readLocalData();
      const idx = data.students.findIndex((s: any) => s.id === Number(student_id));
      if (idx !== -1) { data.students[idx].moodle_sync_status = "SINCRONIZADO"; data.students[idx].moodle_sync_date = syncDate; writeLocalData(data); }
    }

    const username = student.email.toLowerCase().split("@")[0].replace(/[^a-z0-9._-]/g, "").substring(0, 100);
    res.json({ success: true, message: `Aluno "${student.nome}" matriculado no AVA com sucesso!`, moodle_user_id: moodleUserId, moodle_course_id, synced_at: syncDate, ava_login: { url: MOODLE_URL, username, password: MOODLE_DEFAULT_PASSWORD } });
  } catch (e: any) {
    console.error("/api/moodle/enroll error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Cursos matriculados de um aluno no Moodle
app.get("/api/moodle/student-courses/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const search = await callMoodle("core_user_get_users", { "criteria[0][key]": "email", "criteria[0][value]": email });
    if (!search?.users?.length) { res.json({ enrolled: false, courses: [] }); return; }
    const moodleUserId = search.users[0].id;
    const enrolled = await callMoodle("core_enrol_get_users_courses", { userid: String(moodleUserId) });
    const courses = Array.isArray(enrolled) ? enrolled.map((c: any) => ({ id: c.id, fullname: c.fullname, shortname: c.shortname, progress: c.progress || 0 })) : [];
    res.json({ enrolled: courses.length > 0, moodle_user_id: moodleUserId, courses });
  } catch (e: any) {
    console.error("/api/moodle/student-courses error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Config Moodle
app.get("/api/moodle/config", (req, res) => {
  try {
    const data = readLocalData();
    res.json(data.moodle_config || { url: MOODLE_URL, token: MOODLE_TOKEN, auto_sync: true, connected: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/moodle/config", (req, res) => {
  try {
    const { url, token, auto_sync, connected } = req.body;
    const newConfig = { url: url || MOODLE_URL, token: token || MOODLE_TOKEN, auto_sync: auto_sync !== undefined ? !!auto_sync : true, connected: connected !== undefined ? !!connected : true };
    try { const data = readLocalData(); data.moodle_config = newConfig; writeLocalData(data); } catch (e: any) { console.warn("Não persistiu moodle_config:", e.message); }
    res.json(newConfig);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/moodle/sync/:studentId", async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    let student: any = null;
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [rows]: any = await mysqlPool.query("SELECT * FROM students WHERE id = ?", [studentId]);
      student = rows[0] || null;
    } else {
      student = readLocalData().students.find((s: any) => s.id === studentId) || null;
    }
    if (!student) { res.status(404).json({ error: "Aluno não encontrado." }); return; }

    // Redireciona para enroll se tiver course_id
    if (student.course_id) {
      req.body = { student_id: studentId, moodle_course_id: student.course_id };
      // Chama a lógica de enroll diretamente
      res.json({ success: true, message: `Use /api/moodle/enroll para matricular o aluno no curso do AVA.`, student_email: student.email });
    } else {
      res.json({ success: false, message: "Aluno sem curso vinculado. Selecione um curso do AVA primeiro." });
    }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- POLOS ---
app.get("/api/polos", async (req, res) => {
  try {
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try { const [rows] = await mysqlPool.query("SELECT * FROM polos ORDER BY nome ASC"); res.json(rows); return; } catch {}
    }
    res.json(readLocalData().polos || []);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/polos", async (req, res) => {
  try {
    const { nome, cidade, estado, endereco, mec_codigo, status, contato_telefone, asaas_token, split_enabled, split_porcentagem_repasse, split_dia_vencimento, cursos_moodle_apenas, polo_email, polo_senha } = req.body;
    if (!nome || !cidade) { res.status(400).json({ error: "Nome e cidade são obrigatórios." }); return; }
    const emailNorm = polo_email ? polo_email.toLowerCase().trim() : null;
    const senhaHash = polo_senha ? hashPassword(polo_senha) : null;
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const [result]: any = await mysqlPool.query(
          "INSERT INTO polos (nome, cidade, estado, endereco, mec_codigo, status, contato_telefone, asaas_token, split_enabled, split_porcentagem_repasse, split_dia_vencimento, cursos_moodle_apenas, polo_email, polo_senha_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [nome, cidade, estado || "SP", endereco || "", mec_codigo || "", status || "ATIVO", contato_telefone || "", asaas_token || "", split_enabled ? 1 : 0, Number(split_porcentagem_repasse || 20), Number(split_dia_vencimento || 25), cursos_moodle_apenas ? 1 : 0, emailNorm, senhaHash]
        );
        res.status(201).json({ id: result.insertId, nome, cidade, estado, endereco, mec_codigo, status, contato_telefone, asaas_token, split_enabled, split_porcentagem_repasse, split_dia_vencimento, cursos_moodle_apenas, polo_email: emailNorm }); return;
      } catch (err: any) { res.status(500).json({ error: err.message }); return; }
    }
    const data = readLocalData();
    const newId = data.polos.length > 0 ? Math.max(...data.polos.map((p: any) => p.id)) + 1 : 1;
    const newPolo = { id: newId, nome, cidade, estado: estado || "SP", endereco: endereco || "", mec_codigo: mec_codigo || "", status: status || "ATIVO", contato_telefone: contato_telefone || "", asaas_token: asaas_token || "", split_enabled: !!split_enabled, split_porcentagem_repasse: Number(split_porcentagem_repasse || 20), split_dia_vencimento: Number(split_dia_vencimento || 25), cursos_moodle_apenas: !!cursos_moodle_apenas, polo_email: emailNorm, polo_senha_hash: senhaHash };
    data.polos.push(newPolo);
    writeLocalData(data);
    res.status(201).json({ ...newPolo, polo_senha_hash: undefined });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.put("/api/polos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const { nome, cidade, estado, endereco, mec_codigo, status, contato_telefone, asaas_token, split_enabled, split_porcentagem_repasse, split_dia_vencimento, cursos_moodle_apenas, polo_email, polo_senha } = req.body;
        const emailNorm2 = polo_email ? polo_email.toLowerCase().trim() : null;
        const senhaHash2 = polo_senha ? hashPassword(polo_senha) : null;
        await mysqlPool.query("UPDATE polos SET nome=?, cidade=?, estado=?, endereco=?, mec_codigo=?, status=?, contato_telefone=?, asaas_token=?, split_enabled=?, split_porcentagem_repasse=?, split_dia_vencimento=?, cursos_moodle_apenas=?, polo_email=COALESCE(?,polo_email), polo_senha_hash=COALESCE(?,polo_senha_hash) WHERE id=?",
          [nome, cidade, estado, endereco, mec_codigo, status, contato_telefone, asaas_token, split_enabled ? 1 : 0, Number(split_porcentagem_repasse || 20), Number(split_dia_vencimento || 25), cursos_moodle_apenas ? 1 : 0, emailNorm2, senhaHash2, id]);
        res.json({ success: true }); return;
      } catch {}
    }
    const data = readLocalData();
    const index = data.polos.findIndex((p: any) => p.id === id);
    if (index !== -1) { data.polos[index] = { ...data.polos[index], ...req.body, id }; writeLocalData(data); res.json({ success: true }); }
    else { res.status(404).json({ error: "Polo não encontrado." }); }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/polos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try { await mysqlPool.query("DELETE FROM polos WHERE id = ?", [id]); res.json({ success: true }); return; } catch {}
    }
    const data = readLocalData();
    data.polos = (data.polos || []).filter((p: any) => p.id !== id);
    writeLocalData(data);
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ==========================================
// POLO SPLITS CRUD
// ==========================================

// GET /api/polos/:id/splits — listar splits de um polo
app.get("/api/polos/:id/splits", async (req, res) => {
  try {
    const poloId = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [rows] = await mysqlPool.query(
        "SELECT * FROM polo_splits WHERE polo_id = ? ORDER BY id ASC", [poloId]
      );
      res.json(rows); return;
    }
    const data = readLocalData();
    res.json((data.polo_splits || []).filter((s: any) => s.polo_id === poloId));
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// POST /api/polos/:id/splits — adicionar split ao polo
app.post("/api/polos/:id/splits", async (req, res) => {
  try {
    const poloId = Number(req.params.id);
    const { nome, wallet_id, percentual } = req.body;
    if (!nome || !wallet_id || percentual === undefined) {
      res.status(400).json({ error: "nome, wallet_id e percentual são obrigatórios." }); return;
    }
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [result]: any = await mysqlPool.query(
        "INSERT INTO polo_splits (polo_id, nome, wallet_id, percentual) VALUES (?, ?, ?, ?)",
        [poloId, nome, wallet_id, Number(percentual)]
      );
      res.status(201).json({ id: result.insertId, polo_id: poloId, nome, wallet_id, percentual: Number(percentual) }); return;
    }
    const data = readLocalData();
    if (!data.polo_splits) data.polo_splits = [];
    const newId = data.polo_splits.length > 0 ? Math.max(...data.polo_splits.map((s: any) => s.id)) + 1 : 1;
    const newSplit = { id: newId, polo_id: poloId, nome, wallet_id, percentual: Number(percentual) };
    data.polo_splits.push(newSplit);
    writeLocalData(data);
    res.status(201).json(newSplit);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// PUT /api/polos/splits/:splitId — editar split
app.put("/api/polos/splits/:splitId", async (req, res) => {
  try {
    const splitId = Number(req.params.splitId);
    const { nome, wallet_id, percentual } = req.body;
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      await mysqlPool.query(
        "UPDATE polo_splits SET nome = COALESCE(?, nome), wallet_id = COALESCE(?, wallet_id), percentual = COALESCE(?, percentual) WHERE id = ?",
        [nome || null, wallet_id || null, percentual !== undefined ? Number(percentual) : null, splitId]
      );
      res.json({ success: true }); return;
    }
    const data = readLocalData();
    const idx = (data.polo_splits || []).findIndex((s: any) => s.id === splitId);
    if (idx !== -1) {
      data.polo_splits[idx] = { ...data.polo_splits[idx], nome: nome || data.polo_splits[idx].nome, wallet_id: wallet_id || data.polo_splits[idx].wallet_id, percentual: percentual !== undefined ? Number(percentual) : data.polo_splits[idx].percentual };
      writeLocalData(data);
      res.json({ success: true });
    } else { res.status(404).json({ error: "Split não encontrado." }); }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/polos/splits/:splitId — remover split
app.delete("/api/polos/splits/:splitId", async (req, res) => {
  try {
    const splitId = Number(req.params.splitId);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      await mysqlPool.query("DELETE FROM polo_splits WHERE id = ?", [splitId]);
      res.json({ success: true }); return;
    }
    const data = readLocalData();
    data.polo_splits = (data.polo_splits || []).filter((s: any) => s.id !== splitId);
    writeLocalData(data);
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- COURSES (local/mysql) ---
app.get("/api/courses", async (req, res) => {
  try {
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try { const [rows] = await mysqlPool.query("SELECT * FROM courses ORDER BY nome ASC"); res.json(rows); return; } catch {}
    }
    res.json(readLocalData().courses || []);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/courses", async (req, res) => {
  try {
    const { nome, carga_horaria, categoria, duracao_meses, preco_mensal, status, moodle_course_id } = req.body;
    if (!nome) { res.status(400).json({ error: "Nome é obrigatório." }); return; }
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const [result]: any = await mysqlPool.query("INSERT INTO courses (nome, carga_horaria, categoria, duracao_meses, preco_mensal, status, moodle_course_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [nome, Number(carga_horaria || 0), categoria || "Extensão", Number(duracao_meses || 1), Number(preco_mensal || 0), status || "ATIVO", moodle_course_id || ""]);
        res.status(201).json({ id: result.insertId, nome, carga_horaria, categoria, duracao_meses, preco_mensal, status, moodle_course_id }); return;
      } catch {}
    }
    const data = readLocalData();
    const newId = (data.courses || []).length > 0 ? Math.max(...data.courses.map((c: any) => c.id)) + 1 : 1;
    const newCourse = { id: newId, nome, carga_horaria: Number(carga_horaria || 0), categoria: categoria || "Extensão", duracao_meses: Number(duracao_meses || 1), preco_mensal: Number(preco_mensal || 0), status: status || "ATIVO", moodle_course_id: moodle_course_id || "" };
    if (!data.courses) data.courses = [];
    data.courses.push(newCourse);
    writeLocalData(data);
    res.status(201).json(newCourse);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.put("/api/courses/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const { nome, carga_horaria, categoria, duracao_meses, preco_mensal, status, moodle_course_id } = req.body;
        await mysqlPool.query("UPDATE courses SET nome=?, carga_horaria=?, categoria=?, duracao_meses=?, preco_mensal=?, status=?, moodle_course_id=? WHERE id=?",
          [nome, Number(carga_horaria || 0), categoria, Number(duracao_meses || 1), Number(preco_mensal || 0), status, moodle_course_id || "", id]);
        res.json({ success: true }); return;
      } catch {}
    }
    const data = readLocalData();
    const index = (data.courses || []).findIndex((c: any) => c.id === id);
    if (index !== -1) { data.courses[index] = { ...data.courses[index], ...req.body, id }; writeLocalData(data); res.json(data.courses[index]); }
    else { res.status(404).json({ error: "Curso não encontrado." }); }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/courses/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try { await mysqlPool.query("DELETE FROM courses WHERE id = ?", [id]); res.json({ success: true }); return; } catch {}
    }
    const data = readLocalData();
    data.courses = (data.courses || []).filter((c: any) => c.id !== id);
    writeLocalData(data);
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- TICKETS ---
app.get("/api/tickets", async (req, res) => {
  try {
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const [rows] = await mysqlPool.query("SELECT t.*, s.nome as student_nome FROM tickets t LEFT JOIN students s ON t.student_id = s.id ORDER BY t.id DESC");
        res.json(rows); return;
      } catch {}
    }
    const data = readLocalData();
    res.json((data.tickets || []).map((t: any) => { const s = (data.students || []).find((st: any) => st.id === t.student_id); return { ...t, student_nome: s ? s.nome : "Externo" }; }));
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/tickets", async (req, res) => {
  try {
    const { student_id, assunto, categoria, descricao, prioridade } = req.body;
    if (!student_id || !assunto || !descricao) { res.status(400).json({ error: "Campos obrigatórios ausentes." }); return; }
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const [result]: any = await mysqlPool.query("INSERT INTO tickets (student_id, assunto, categoria, descricao, prioridade, status, data_abertura) VALUES (?, ?, ?, ?, ?, 'ABERTO', ?)",
          [Number(student_id), assunto, categoria || "SECRETARIA", descricao, prioridade || "MEDIA", new Date().toISOString().split("T")[0]]);
        res.status(201).json({ id: result.insertId, student_id, assunto, categoria, descricao, prioridade, status: "ABERTO" }); return;
      } catch {}
    }
    const data = readLocalData();
    const newId = (data.tickets || []).length > 0 ? Math.max(...data.tickets.map((t: any) => t.id)) + 1 : 1;
    const newTicket = { id: newId, student_id: Number(student_id), assunto, categoria: categoria || "SECRETARIA", descricao, prioridade: prioridade || "MEDIA", status: "ABERTO", data_abertura: new Date().toISOString().split("T")[0] };
    if (!data.tickets) data.tickets = [];
    data.tickets.push(newTicket);
    writeLocalData(data);
    res.status(201).json(newTicket);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.put("/api/tickets/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const { status, resposta_suporte } = req.body;
        await mysqlPool.query("UPDATE tickets SET status=?, resposta_suporte=? WHERE id=?", [status, resposta_suporte || null, id]);
        res.json({ success: true }); return;
      } catch {}
    }
    const data = readLocalData();
    const index = (data.tickets || []).findIndex((t: any) => t.id === id);
    if (index !== -1) { data.tickets[index] = { ...data.tickets[index], ...req.body, id }; writeLocalData(data); res.json(data.tickets[index]); }
    else { res.status(404).json({ error: "Ticket não encontrado." }); }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- LEADS ---
app.get("/api/leads", async (req, res) => {
  try {
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try { const [rows] = await mysqlPool.query("SELECT * FROM leads ORDER BY id DESC"); res.json(rows); return; } catch {}
    }
    res.json(readLocalData().leads || []);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/leads", async (req, res) => {
  try {
    const { nome, email, telefone, status, polo_id, course_id, origem, observacoes } = req.body;
    if (!nome) { res.status(400).json({ error: "Nome é obrigatório." }); return; }
    const today = new Date().toISOString().split("T")[0];
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const [result]: any = await mysqlPool.query("INSERT INTO leads (nome, email, telefone, status, polo_id, course_id, origem, observacoes, data_cadastro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [nome, email || "", telefone || "", status || "NOVO", polo_id ? Number(polo_id) : 1, course_id ? Number(course_id) : null, origem || "", observacoes || "", today]);
        res.status(201).json({ id: result.insertId, nome, email, telefone, status, polo_id, course_id, origem, observacoes, data_cadastro: today }); return;
      } catch {}
    }
    const data = readLocalData();
    const newId = (data.leads || []).length > 0 ? Math.max(...data.leads.map((l: any) => l.id)) + 1 : 1;
    const newLead = { id: newId, nome, email: email || "", telefone: telefone || "", status: status || "NOVO", polo_id: polo_id ? Number(polo_id) : 1, course_id: course_id ? Number(course_id) : null, origem: origem || "", observacoes: observacoes || "", data_cadastro: today };
    if (!data.leads) data.leads = [];
    data.leads.push(newLead);
    writeLocalData(data);
    res.status(201).json(newLead);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.put("/api/leads/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const { nome, email, telefone, status, polo_id, course_id, origem, observacoes } = req.body;
        await mysqlPool.query("UPDATE leads SET nome=?, email=?, telefone=?, status=?, polo_id=?, course_id=?, origem=?, observacoes=? WHERE id=?",
          [nome, email, telefone, status, polo_id, course_id || null, origem, observacoes, id]);
        res.json({ success: true }); return;
      } catch {}
    }
    const data = readLocalData();
    const index = (data.leads || []).findIndex((l: any) => l.id === id);
    if (index !== -1) { data.leads[index] = { ...data.leads[index], ...req.body, id }; writeLocalData(data); res.json(data.leads[index]); }
    else { res.status(404).json({ error: "Lead não encontrado." }); }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/leads/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try { await mysqlPool.query("DELETE FROM leads WHERE id = ?", [id]); res.json({ success: true }); return; } catch {}
    }
    const data = readLocalData();
    data.leads = (data.leads || []).filter((l: any) => l.id !== id);
    writeLocalData(data);
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- USERS ---
app.get("/api/users", async (req, res) => {
  try {
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try { const [rows] = await mysqlPool.query("SELECT * FROM system_users ORDER BY id DESC"); res.json(rows); return; } catch {}
    }
    res.json(readLocalData().users || []);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/users", async (req, res) => {
  try {
    const { nome, email, cargo, status, perm_alunos, perm_academico, perm_financeiro, perm_polos } = req.body;
    if (!nome || !email) { res.status(400).json({ error: "Nome e e-mail são obrigatórios." }); return; }
    const today = new Date().toISOString().split("T")[0];
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const [result]: any = await mysqlPool.query("INSERT INTO system_users (nome, email, cargo, status, data_cadastro, perm_alunos, perm_academico, perm_financeiro, perm_polos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [nome, email, cargo || "Operador", status || "ATIVO", today, perm_alunos || "SEM_ACESSO", perm_academico || "SEM_ACESSO", perm_financeiro || "SEM_ACESSO", perm_polos || "SEM_ACESSO"]);
        res.status(201).json({ id: result.insertId, nome, email, cargo, status, data_cadastro: today, perm_alunos, perm_academico, perm_financeiro, perm_polos }); return;
      } catch {}
    }
    const data = readLocalData();
    const newId = data.users.length > 0 ? Math.max(...data.users.map((u: any) => u.id)) + 1 : 1;
    const newUser = { id: newId, nome, email, cargo: cargo || "Operador", status: status || "ATIVO", data_cadastro: today, perm_alunos: perm_alunos || "APENAS_LEITURA", perm_academico: perm_academico || "SEM_ACESSO", perm_financeiro: perm_financeiro || "SEM_ACESSO", perm_polos: perm_polos || "SEM_ACESSO" };
    data.users.push(newUser);
    writeLocalData(data);
    res.status(201).json(newUser);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try {
        const { nome, email, cargo, status, perm_alunos, perm_academico, perm_financeiro, perm_polos } = req.body;
        await mysqlPool.query("UPDATE system_users SET nome=?, email=?, cargo=?, status=?, perm_alunos=?, perm_academico=?, perm_financeiro=?, perm_polos=? WHERE id=?",
          [nome, email, cargo, status, perm_alunos, perm_academico, perm_financeiro, perm_polos, id]);
        res.json({ success: true }); return;
      } catch {}
    }
    const data = readLocalData();
    const index = data.users.findIndex((u: any) => u.id === id);
    if (index !== -1) { data.users[index] = { ...data.users[index], ...req.body, id }; writeLocalData(data); res.json({ success: true }); }
    else { res.status(404).json({ error: "Usuário não encontrado." }); }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      try { await mysqlPool.query("DELETE FROM system_users WHERE id = ?", [id]); res.json({ success: true }); return; } catch {}
    }
    const data = readLocalData();
    data.users = (data.users || []).filter((u: any) => u.id !== id);
    writeLocalData(data);
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- TURMAS ---
app.get("/api/classes", async (req, res) => {
  try {
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [rows] = await mysqlPool.query("SELECT * FROM classes ORDER BY nome ASC");
      res.json(rows); return;
    }
    res.json(readLocalData().classes || []);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/classes", async (req, res) => {
  try {
    const { nome, serie, turno } = req.body;
    if (!nome || !serie || !turno) { res.status(400).json({ error: "Campos obrigatórios ausentes." }); return; }
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [result]: any = await mysqlPool.query("INSERT INTO classes (nome, serie, turno) VALUES (?, ?, ?)", [nome, serie, turno]);
      res.status(201).json({ id: result.insertId, nome, serie, turno }); return;
    }
    const data = readLocalData();
    const newId = data.classes.length > 0 ? Math.max(...data.classes.map((c: any) => c.id)) + 1 : 1;
    const newClass = { id: newId, nome, serie, turno };
    data.classes.push(newClass);
    writeLocalData(data);
    res.status(201).json(newClass);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- NOTAS ---
app.get("/api/grades", async (req, res) => {
  try {
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [rows] = await mysqlPool.query("SELECT g.*, s.nome as student_nome FROM grades g INNER JOIN students s ON g.student_id = s.id ORDER BY g.id DESC");
      res.json(rows); return;
    }
    const data = readLocalData();
    res.json((data.grades || []).map((g: any) => { const s = (data.students || []).find((st: any) => st.id === g.student_id); return { ...g, student_nome: s ? s.nome : "Desconhecido" }; }));
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/grades", async (req, res) => {
  try {
    const { student_id, disciplina, nota, faltas } = req.body;
    if (!student_id || !disciplina || nota == null) { res.status(400).json({ error: "Campos obrigatórios ausentes." }); return; }
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [result]: any = await mysqlPool.query("INSERT INTO grades (student_id, disciplina, nota, faltas) VALUES (?, ?, ?, ?)", [student_id, disciplina, nota, faltas || 0]);
      res.status(201).json({ id: result.insertId, student_id, disciplina, nota, faltas }); return;
    }
    const data = readLocalData();
    const newId = data.grades.length > 0 ? Math.max(...data.grades.map((g: any) => g.id)) + 1 : 1;
    const newGrade = { id: newId, student_id: Number(student_id), disciplina, nota: Number(nota), faltas: Number(faltas || 0) };
    data.grades.push(newGrade);
    writeLocalData(data);
    res.status(201).json(newGrade);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/grades/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [result]: any = await mysqlPool.query("DELETE FROM grades WHERE id = ?", [id]);
      if (result.affectedRows > 0) { res.json({ success: true }); } else { res.status(404).json({ error: "Não encontrada." }); } return;
    }
    const data = readLocalData();
    const filtered = data.grades.filter((g: any) => g.id !== id);
    const deleted = filtered.length !== data.grades.length;
    data.grades = filtered;
    writeLocalData(data);
    if (deleted) { res.json({ success: true }); } else { res.status(404).json({ error: "Não encontrada." }); }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- TRANSAÇÕES ---
app.get("/api/transactions", async (req, res) => {
  try {
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [rows] = await mysqlPool.query("SELECT t.*, s.nome as student_nome FROM transactions t LEFT JOIN students s ON t.student_id = s.id ORDER BY t.data_vencimento DESC");
      res.json(rows); return;
    }
    const data = readLocalData();
    res.json((data.transactions || []).map((t: any) => { const s = t.student_id ? (data.students || []).find((st: any) => st.id === t.student_id) : null; return { ...t, student_nome: s ? s.nome : "Diversos" }; }));
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { student_id, tipo, valor, descricao, data_vencimento, data_pagamento, status, categoria, fornecedor, polo_id } = req.body;
    if (!tipo || !valor || !descricao || !data_vencimento) { res.status(400).json({ error: "Campos obrigatórios ausentes." }); return; }
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [result]: any = await mysqlPool.query("INSERT INTO transactions (student_id, tipo, valor, descricao, data_vencimento, data_pagamento, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [student_id || null, tipo, valor, descricao, data_vencimento, data_pagamento || null, status || "PENDENTE"]);
      res.status(201).json({ id: result.insertId, student_id, tipo, valor, descricao, data_vencimento, data_pagamento, status: status || "PENDENTE", categoria: categoria || "DIVERSOS", fornecedor: fornecedor || "Geral", polo_id: polo_id || 1 }); return;
    }
    const data = readLocalData();
    const newId = data.transactions.length > 0 ? Math.max(...data.transactions.map((t: any) => t.id)) + 1 : 1;
    let finalPoloId = polo_id ? Number(polo_id) : 1;
    if (student_id && !polo_id) { const s = (data.students || []).find((st: any) => st.id === Number(student_id)); if (s?.polo_id) finalPoloId = Number(s.polo_id); }
    const newTx = { id: newId, student_id: student_id ? Number(student_id) : null, tipo, valor: Number(valor), descricao, data_vencimento, data_pagamento: data_pagamento || null, status: status || "PENDENTE", categoria: categoria || (tipo === "RECEITA" ? "MENSALIDADE" : "DIVERSOS"), fornecedor: fornecedor || (tipo === "RECEITA" ? "Aluno / Mensalidade" : "Fornecedor"), polo_id: finalPoloId };
    data.transactions.push(newTx);
    writeLocalData(data);
    res.status(201).json(newTx);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.put("/api/transactions/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, data_pagamento } = req.body;
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [result]: any = await mysqlPool.query("UPDATE transactions SET status = ?, data_pagamento = ? WHERE id = ?", [status, data_pagamento || null, id]);
      if (result.affectedRows > 0) { res.json({ success: true }); } else { res.status(404).json({ error: "Não encontrada." }); } return;
    }
    const data = readLocalData();
    const index = data.transactions.findIndex((t: any) => t.id === id);
    if (index !== -1) { data.transactions[index].status = status; data.transactions[index].data_pagamento = data_pagamento || null; writeLocalData(data); res.json({ success: true }); }
    else { res.status(404).json({ error: "Não encontrada." }); }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [result]: any = await mysqlPool.query("DELETE FROM transactions WHERE id = ?", [id]);
      if (result.affectedRows > 0) { res.json({ success: true }); } else { res.status(404).json({ error: "Não encontrada." }); } return;
    }
    const data = readLocalData();
    const filtered = data.transactions.filter((t: any) => t.id !== id);
    const deleted = filtered.length !== data.transactions.length;
    data.transactions = filtered;
    writeLocalData(data);
    if (deleted) { res.json({ success: true }); } else { res.status(404).json({ error: "Não encontrada." }); }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- ASAAS SPLIT ---
app.post("/api/asaas/simulate-split", (req, res) => {
  try {
    const { polo_id, valor, student_nome, course_nome } = req.body;
    const data = readLocalData();
    const polo = (data.polos || []).find((p: any) => p.id === Number(polo_id));
    if (!polo) { res.status(404).json({ error: "Polo não encontrado." }); return; }
    const pct = polo.split_porcentagem_repasse || 20;
    const valorPolo = (valor * pct) / 100;
    res.json({ success: true, message: "Split simulado com sucesso!", split_calculated: { total: Number(valor), transfer_percentage: pct, retained_by_matrix: Number(valor) - valorPolo, transferred_to_polo: valorPolo } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- IA GEMINI ---
app.post("/api/ai/analyze", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) { res.status(400).json({ error: "Falta o prompt." }); return; }
    if (!process.env.GEMINI_API_KEY) { res.status(500).json({ error: "Configure GEMINI_API_KEY no .env." }); return; }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
    const systemInstruction = `Você é o Assistente Virtual "FinanAI" da plataforma EduFinance, especializado em gestão escolar e financeira do Brasil. Responda sempre em Português do Brasil (PT-BR) com formatação Markdown.`;
    const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: `CONTEXTO:\n${JSON.stringify(context || {})}\n\nPERGUNTA:\n${prompt}`, config: { systemInstruction, temperature: 0.7 } });
    res.json({ text: response.text });
  } catch (e: any) { res.status(500).json({ error: `Falha na IA: ${e.message}` }); }
});

// ==========================================
// START
// ==========================================
async function startServer() {
  await initDatabase();
  if (!isProd) {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => { res.sendFile(path.join(distPath, "index.html")); });
  }
  app.listen(PORT, "0.0.0.0", () => { console.log(`Servidor rodando em http://localhost:${PORT}`); });
}

// ==========================================
// ASAAS — COBRANÇA PARCELADA
// ==========================================

// Validar CPF matematicamente
function validarCPF(cpf: string): boolean {
  const c = cpf.replace(/\D/g, "");
  if (c.length !== 11 || /^(\d)+$/.test(c)) return false;
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
}

// Buscar token Asaas do polo do aluno
async function getAsaasToken(poloId: number | null): Promise<string | null> {
  if (!poloId) return process.env.ASAAS_TOKEN || null;
  if (dbStatus.mode === "MYSQL" && mysqlPool) {
    const [rows]: any = await mysqlPool.query("SELECT asaas_token FROM polos WHERE id = ? LIMIT 1", [poloId]);
    return rows[0]?.asaas_token || process.env.ASAAS_TOKEN || null;
  }
  const data = readLocalData();
  const polo = data.polos?.find((p: any) => p.id === poloId);
  return polo?.asaas_token || process.env.ASAAS_TOKEN || null;
}

const ASAAS_URL = "https://api.asaas.com/v3";

// POST /api/asaas/gerar-cobranca
app.post("/api/asaas/gerar-cobranca", async (req, res) => {
  try {
    const { student_id, valor_total, num_parcelas, descricao, vencimento_primeira, desconto_fixo } = req.body;

    if (!student_id || !valor_total || !num_parcelas) {
      res.status(400).json({ error: "student_id, valor_total e num_parcelas são obrigatórios." }); return;
    }

    // Buscar aluno
    let student: any = null;
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [rows]: any = await mysqlPool.query("SELECT * FROM students WHERE id = ? LIMIT 1", [student_id]);
      student = rows[0];
    } else {
      const data = readLocalData();
      student = data.students?.find((s: any) => s.id === Number(student_id));
    }

    if (!student) { res.status(404).json({ error: "Aluno não encontrado." }); return; }
    if (!student.cpf) { res.status(400).json({ error: "Aluno sem CPF cadastrado." }); return; }

    const cpfLimpo = student.cpf.replace(/\D/g, "");
    if (!validarCPF(cpfLimpo)) { res.status(400).json({ error: "CPF do aluno inválido." }); return; }

    // Buscar token Asaas do polo
    const asaasToken = await getAsaasToken(student.polo_id);
    if (!asaasToken) { res.status(400).json({ error: "Token Asaas não configurado para este polo." }); return; }

    const headers = { "access_token": asaasToken, "Content-Type": "application/json" };

    // 1. Verificar se cliente já existe no Asaas pelo CPF
    let customerId = student.asaas_customer_id || null;

    if (!customerId) {
      const searchRes = await fetch(`${ASAAS_URL}/customers?cpfCnpj=${cpfLimpo}`, { headers: headers as any });
      const searchData = await searchRes.json();

      if (searchData.data && searchData.data.length > 0) {
        customerId = searchData.data[0].id;
      } else {
        // Criar cliente no Asaas
        const createRes = await fetch(`${ASAAS_URL}/customers`, {
          method: "POST",
          headers: headers as any,
          body: JSON.stringify({
            name: student.nome,
            cpfCnpj: cpfLimpo,
            email: student.email,
            phone: student.telefone || undefined,
          }),
        });
        const createData = await createRes.json();
        if (!createData.id) {
          res.status(500).json({ error: `Erro ao criar cliente no Asaas: ${createData.errors?.[0]?.description || JSON.stringify(createData)}` }); return;
        }
        customerId = createData.id;
      }

      // Salvar asaas_customer_id no banco
      if (dbStatus.mode === "MYSQL" && mysqlPool) {
        await mysqlPool.query("UPDATE students SET asaas_customer_id = ? WHERE id = ?", [customerId, student_id]);
      }
    }

    // 2. Gerar cobranças parceladas
    const valorTotal = Number(valor_total);
    const parcelas = Number(num_parcelas);
    const valorParcela = Math.round((valorTotal / parcelas) * 100) / 100;
    const primeiroVencimento = vencimento_primeira || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const payments: any[] = [];
    const errors: string[] = [];

    for (let i = 0; i < parcelas; i++) {
      // Calcular vencimento de cada parcela (mensal)
      const vencDate = new Date(primeiroVencimento);
      vencDate.setMonth(vencDate.getMonth() + i);
      const vencimento = vencDate.toISOString().split("T")[0];

      // Ajustar última parcela para cobrir diferença de centavos
      const valorEsta = i === parcelas - 1
        ? Math.round((valorTotal - valorParcela * (parcelas - 1)) * 100) / 100
        : valorParcela;

      // Buscar splits configurados para o polo do aluno
      let splitConfig: any[] = [];
      if (student.polo_id && dbStatus.mode === "MYSQL" && mysqlPool) {
        const [splitRows]: any = await mysqlPool.query(
          "SELECT wallet_id, percentual FROM polo_splits WHERE polo_id = ?", [student.polo_id]
        );

        // Buscar a wallet da própria conta do polo para excluir do split
        let ownWalletIds: string[] = [];
        try {
          const walletRes = await fetch(`${ASAAS_URL}/wallets`, {
            headers: { "access_token": asaasToken } as any,
          });
          const walletData = await walletRes.json();
          if (walletData.data) {
            ownWalletIds = walletData.data.map((w: any) => w.id);
          }
        } catch (e) {
          console.warn("Não foi possível buscar wallets do polo:", e);
        }

        splitConfig = splitRows
          .filter((s: any) => {
            if (!s.wallet_id || Number(s.percentual) <= 0) return false;
            // Excluir walletId que pertence à própria conta do polo
            if (ownWalletIds.includes(String(s.wallet_id).trim())) {
              console.warn(`Split ignorado: walletId ${s.wallet_id} pertence à própria conta do polo.`);
              return false;
            }
            return true;
          })
          .map((s: any) => ({
            walletId: String(s.wallet_id).trim(),
            percentualValue: parseFloat(Number(s.percentual).toFixed(2)),
          }));

        console.log("Split config para polo", student.polo_id, ":", JSON.stringify(splitConfig));
        if (ownWalletIds.length > 0) {
          console.log("Wallets próprias do polo (excluídas do split):", ownWalletIds);
        }
      }

      const paymentBody: any = {
        customer: customerId,
        billingType: "BOLETO",
        value: valorEsta,
        dueDate: vencimento,
        description: `${descricao || "Mensalidade"} - Parcela ${i + 1}/${parcelas}`,
        externalReference: `student_${student_id}_parcela_${i + 1}`,
        ...(desconto_fixo && Number(desconto_fixo) > 0 ? {
          discount: {
            value: Number(desconto_fixo),
            dueDateLimitDays: 0,
            type: "FIXED",
          }
        } : {}),
      };

      // Adicionar splits se configurados
      if (splitConfig.length > 0) {
        paymentBody.split = splitConfig;
      }

      // Tentar gerar com split; se falhar, gerar sem split
      let payRes = await fetch(`${ASAAS_URL}/payments`, {
        method: "POST",
        headers: headers as any,
        body: JSON.stringify(paymentBody),
      });

      let payData = await payRes.json();

      // Se erro de split, tentar sem split e logar aviso
      if (!payData.id && payData.errors && splitConfig.length > 0) {
        console.warn(`Split rejeitado pelo Asaas para polo ${student.polo_id} — gerando boleto sem split. Erro: ${payData.errors?.[0]?.description}`);
        const paymentBodySemSplit = { ...paymentBody };
        delete paymentBodySemSplit.split;
        payRes = await fetch(`${ASAAS_URL}/payments`, {
          method: "POST",
          headers: headers as any,
          body: JSON.stringify(paymentBodySemSplit),
        });
        payData = await payRes.json();
        if (payData.id) {
          console.warn(`⚠️ Boleto ${i + 1}/${parcelas} gerado SEM split — habilite split no painel Asaas para ativar repasses automáticos.`);
        }
      }

      if (payData.id) {
        payments.push({
          parcela: i + 1,
          id: payData.id,
          valor: valorEsta,
          vencimento,
          invoiceUrl: payData.invoiceUrl,
          bankSlipUrl: payData.bankSlipUrl,
          status: payData.status,
        });

        // Salvar transação no banco local
        if (dbStatus.mode === "MYSQL" && mysqlPool) {
          await mysqlPool.query(
            "INSERT INTO transactions (student_id, tipo, valor, descricao, data_vencimento, status, categoria, fornecedor, polo_id, asaas_payment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status=status",
            [student_id, "RECEITA", valorEsta, `${descricao || "Mensalidade"} - Parcela ${i + 1}/${parcelas}`, vencimento, "PENDENTE", "MENSALIDADE", student.nome, student.polo_id || 1, payData.id]
          );
        }
      } else {
        errors.push(`Parcela ${i + 1}: ${payData.errors?.[0]?.description || JSON.stringify(payData)}`);
      }
    }

    // Atualizar valor_matricula e num_parcelas no aluno
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      await mysqlPool.query(
        "UPDATE students SET valor_matricula = ?, num_parcelas = ? WHERE id = ?",
        [valorTotal, parcelas, student_id]
      );
    }

    res.json({
      success: true,
      customer_id: customerId,
      total_parcelas: parcelas,
      valor_total: valorTotal,
      valor_parcela: valorParcela,
      payments,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (e: any) {
    console.error("/api/asaas/gerar-cobranca error:", e.message);
    res.status(500).json({ error: e.message });
  }
});


// ==========================================
// ROTAS DE AUTENTICAÇÃO
// ==========================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ error: "E-mail e senha são obrigatórios." }); return; }

    // Superadmin via .env
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      const token = createSession({ email: ADMIN_EMAIL, role: "superadmin", poloId: null, poloNome: null });
      res.json({ success: true, token, role: "superadmin", email: ADMIN_EMAIL, nome: "Administrador Geral", poloId: null, poloNome: null });
      return;
    }

    // Usuário de polo no banco
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [rows]: any = await mysqlPool.query(
        "SELECT * FROM polos WHERE polo_email = ? AND polo_senha_hash = ? AND status = \'ATIVO\' LIMIT 1",
        [email.toLowerCase(), hashPassword(password)]
      );
      if (rows.length > 0) {
        const polo = rows[0];
        const token = createSession({ email: polo.polo_email, role: "polo", poloId: polo.id, poloNome: polo.nome });
        res.json({ success: true, token, role: "polo", email: polo.polo_email, nome: polo.nome, poloId: polo.id, poloNome: polo.nome });
        return;
      }
    } else {
      const data = readLocalData();
      const polo = (data.polos || []).find((p: any) =>
        p.polo_email?.toLowerCase() === email.toLowerCase() &&
        p.polo_senha_hash === hashPassword(password) &&
        p.status === "ATIVO"
      );
      if (polo) {
        const token = createSession({ email: polo.polo_email, role: "polo", poloId: polo.id, poloNome: polo.nome });
        res.json({ success: true, token, role: "polo", email: polo.polo_email, nome: polo.nome, poloId: polo.id, poloNome: polo.nome });
        return;
      }
    }

    res.status(401).json({ error: "E-mail ou senha incorretos." });
  } catch (e: any) {
    console.error("/api/auth/login error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/auth/me", (req, res) => {
  const token = req.headers["x-session-token"] as string;
  if (!token) { res.status(401).json({ error: "Não autenticado." }); return; }
  const session = getSession(token);
  if (!session) { res.status(401).json({ error: "Sessão expirada." }); return; }
  res.json({ success: true, role: session.role, email: session.email, poloId: session.poloId, poloNome: session.poloNome, studentId: session.studentId, studentNome: session.studentNome });
});

app.post("/api/auth/logout", (req, res) => {
  const token = req.headers["x-session-token"] as string;
  if (token) sessions.delete(token);
  res.json({ success: true });
});

// ==========================================
// LOGIN DO ALUNO
// ==========================================

app.post("/api/auth/aluno/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) { res.status(400).json({ error: "Usuário e senha são obrigatórios." }); return; }

    // Username pode ser: parte antes do @ do email, ou o email completo
    const usernameNorm = username.toLowerCase().trim();

    let student: any = null;

    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      // Buscar por email exato ou por parte antes do @
      const [rows]: any = await mysqlPool.query(
        "SELECT * FROM students WHERE LOWER(email) = ? OR LOWER(SUBSTRING_INDEX(email, '@', 1)) = ? LIMIT 1",
        [usernameNorm, usernameNorm]
      );
      student = rows[0] || null;
    } else {
      const data = readLocalData();
      student = (data.students || []).find((s: any) =>
        s.email?.toLowerCase() === usernameNorm ||
        s.email?.toLowerCase().split("@")[0] === usernameNorm
      );
    }

    if (!student) { res.status(401).json({ error: "Usuário não encontrado." }); return; }

    // Senha padrão: ImepEdu@2026! (ou senha customizada se implementar futuramente)
    const ALUNO_DEFAULT_PASSWORD = process.env.ALUNO_DEFAULT_PASSWORD || "ImepEdu@2026!";
    if (password !== ALUNO_DEFAULT_PASSWORD) {
      res.status(401).json({ error: "Senha incorreta." }); return;
    }

    const token = createSession({
      email: student.email,
      role: "aluno",
      poloId: student.polo_id || null,
      poloNome: null,
      studentId: student.id,
      studentNome: student.nome,
    });

    res.json({
      success: true,
      token,
      role: "aluno",
      email: student.email,
      nome: student.nome,
      studentId: student.id,
      matricula: student.matricula,
    });
  } catch (e: any) {
    console.error("/api/auth/aluno/login error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// ==========================================
// PORTAL DO ALUNO — DADOS EM TEMPO REAL
// ==========================================

// GET /api/portal/aluno/:studentId — dados completos do portal
app.get("/api/portal/aluno/:studentId", async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);

    // Buscar aluno
    let student: any = null;
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [rows]: any = await mysqlPool.query("SELECT * FROM students WHERE id = ? LIMIT 1", [studentId]);
      student = rows[0];
    } else {
      const data = readLocalData();
      student = (data.students || []).find((s: any) => s.id === studentId);
    }
    if (!student) { res.status(404).json({ error: "Aluno não encontrado." }); return; }

    // Buscar notas
    let grades: any[] = [];
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [gradeRows]: any = await mysqlPool.query(
        "SELECT * FROM grades WHERE student_id = ? ORDER BY created_at DESC", [studentId]
      );
      grades = gradeRows;
    } else {
      const data = readLocalData();
      grades = (data.grades || []).filter((g: any) => g.student_id === studentId);
    }

    // Buscar transações/parcelas do banco
    let transactions: any[] = [];
    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const [txRows]: any = await mysqlPool.query(
        "SELECT * FROM transactions WHERE student_id = ? ORDER BY data_vencimento ASC", [studentId]
      );
      transactions = txRows;
    } else {
      const data = readLocalData();
      transactions = (data.transactions || []).filter((t: any) => t.student_id === studentId);
    }

    // Buscar status em tempo real do Asaas para cada transação com asaas_payment_id
    const asaasToken = await getAsaasToken(student.polo_id);
    const parcelas: any[] = [];

    for (const tx of transactions) {
      if (tx.asaas_payment_id && asaasToken) {
        try {
          const payRes = await fetch(`${ASAAS_URL}/payments/${tx.asaas_payment_id}`, {
            headers: { "access_token": asaasToken } as any,
          });
          const payData = await payRes.json();
          if (payData.id) {
            // Atualizar status no banco se mudou
            if (payData.status !== tx.status && dbStatus.mode === "MYSQL" && mysqlPool) {
              const statusMap: Record<string, string> = {
                "RECEIVED": "PAGO", "CONFIRMED": "PAGO", "PENDING": "PENDENTE",
                "OVERDUE": "ATRASADO", "REFUNDED": "ESTORNADO"
              };
              const newStatus = statusMap[payData.status] || tx.status;
              if (newStatus !== tx.status) {
                await mysqlPool.query("UPDATE transactions SET status = ? WHERE id = ?", [newStatus, tx.id]);
                tx.status = newStatus;
              }
            }
            parcelas.push({
              id: tx.id,
              asaas_id: payData.id,
              descricao: tx.descricao,
              valor: tx.valor,
              data_vencimento: tx.data_vencimento,
              status: (() => {
                const s = payData.status;
                if (s === "RECEIVED" || s === "CONFIRMED") return "PAGO";
                if (s === "OVERDUE") return "ATRASADO";
                if (s === "REFUNDED") return "ESTORNADO";
                return "PENDENTE";
              })(),
              invoiceUrl: payData.invoiceUrl,
              bankSlipUrl: payData.bankSlipUrl,
              nossoNumero: payData.nossoNumero,
              invoiceNumber: payData.invoiceNumber,
              paymentDate: payData.paymentDate,
              clientPaymentDate: payData.clientPaymentDate,
            });
            continue;
          }
        } catch (e) {
          console.warn("Asaas fetch error for payment", tx.asaas_payment_id, e);
        }
      }
      // Sem ID Asaas — usar dados do banco
      parcelas.push({
        id: tx.id,
        asaas_id: null,
        descricao: tx.descricao,
        valor: tx.valor,
        data_vencimento: tx.data_vencimento,
        status: tx.status,
        invoiceUrl: null,
        bankSlipUrl: null,
      });
    }

    res.json({
      student: {
        id: student.id,
        nome: student.nome,
        email: student.email,
        matricula: student.matricula,
        cpf: student.cpf,
        telefone: student.telefone,
        polo_id: student.polo_id,
        course_id: student.course_id,
        moodle_sync_status: student.moodle_sync_status,
        valor_matricula: student.valor_matricula,
        num_parcelas: student.num_parcelas,
      },
      grades,
      parcelas,
    });

  } catch (e: any) {
    console.error("/api/portal/aluno error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// ==========================================
// WEBHOOK ASAAS
// ==========================================

app.post("/api/asaas/webhook", async (req, res) => {
  try {
    const event = req.body;
    console.log("Asaas webhook received:", event?.event, event?.payment?.id);

    if (!event?.payment?.id) { res.json({ received: true }); return; }

    const paymentId = event.payment.id;
    const asaasStatus = event.payment.status;

    const statusMap: Record<string, string> = {
      "RECEIVED": "PAGO",
      "CONFIRMED": "PAGO",
      "PENDING": "PENDENTE",
      "OVERDUE": "ATRASADO",
      "REFUNDED": "ESTORNADO",
      "REFUND_REQUESTED": "ESTORNADO",
      "CHARGEBACK_REQUESTED": "ESTORNADO",
    };

    const newStatus = statusMap[asaasStatus];
    if (!newStatus) { res.json({ received: true }); return; }

    if (dbStatus.mode === "MYSQL" && mysqlPool) {
      const dataPagamento = (asaasStatus === "RECEIVED" || asaasStatus === "CONFIRMED")
        ? (event.payment.clientPaymentDate || event.payment.paymentDate || new Date().toISOString().split("T")[0])
        : null;

      await mysqlPool.query(
        "UPDATE transactions SET status = ?, data_pagamento = COALESCE(?, data_pagamento) WHERE asaas_payment_id = ?",
        [newStatus, dataPagamento, paymentId]
      );

      console.log(`Webhook: payment ${paymentId} → ${newStatus}`);
    }

    res.json({ received: true });
  } catch (e: any) {
    console.error("/api/asaas/webhook error:", e.message);
    res.status(500).json({ error: e.message });
  }
});


startServer();