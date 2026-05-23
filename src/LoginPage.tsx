import React, { useState } from "react";
import { GraduationCap, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface LoginPageProps {
  onLogin: (session: { token: string; role: "superadmin" | "polo"; email: string; nome: string; poloId: number | null; poloNome: string | null }) => void;
  onShowStudentLogin: () => void;
}

export default function LoginPage({ onLogin, onShowStudentLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("session_token", data.token);
        localStorage.setItem("session_role", data.role);
        localStorage.setItem("session_email", data.email);
        localStorage.setItem("session_nome", data.nome);
        localStorage.setItem("session_polo_id", data.poloId ? String(data.poloId) : "");
        localStorage.setItem("session_polo_nome", data.poloNome || "");
        onLogin({ token: data.token, role: data.role, email: data.email, nome: data.nome, poloId: data.poloId, poloNome: data.poloNome });
      } else {
        setError(data.error || "Erro ao fazer login.");
      }
    } catch {
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30 mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white font-display tracking-tight">EduFinance</h1>
          <p className="text-slate-400 text-sm mt-1">Sistema de Gestão Escolar — IMEPEDU</p>
        </div>

        {/* Card de login */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-base font-bold text-white mb-6">Acesso ao Sistema</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* E-mail */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com.br"
                  className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-10 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <p className="text-xs text-rose-300 font-medium">{error}</p>
              </motion.div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Entrando...
                </>
              ) : (
                "Entrar no Sistema"
              )}
            </button>
          </form>
        </div>
        <div className="text-center mt-6">
          <button
          onClick={onShowStudentLogin}
          className="text-slate-500 hover:text-indigo-400 text-xs transition-colors font-medium"
          >👨‍🎓 Sou Aluno — Acessar Portal Estudantil
          </button>
        </div>

        <p className="text-center text-slate-600 text-[11px] mt-6">
          © 2026 IMEPEDU — Acesso restrito a usuários autorizados
        </p>
      </motion.div>
    </div>
  );
}
