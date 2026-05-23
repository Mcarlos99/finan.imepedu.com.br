import React, { useState } from "react";
import { GraduationCap, User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface StudentLoginPageProps {
  onLogin: (session: { token: string; studentId: number; studentNome: string; email: string }) => void;
  onBackToAdmin: () => void;
}

export default function StudentLoginPage({ onLogin, onBackToAdmin }: StudentLoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/aluno/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("student_token", data.token);
        localStorage.setItem("student_id", String(data.studentId));
        localStorage.setItem("student_nome", data.nome);
        localStorage.setItem("student_email", data.email);
        onLogin({ token: data.token, studentId: data.studentId, studentNome: data.nome, email: data.email });
      } else {
        setError(data.error || "Usuário ou senha incorretos.");
      }
    } catch {
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30 mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white font-display tracking-tight">Portal do Aluno</h1>
          <p className="text-slate-400 text-sm mt-1">IMEPEDU — Acesso Estudantil</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-base font-bold text-white mb-6">Entrar no Portal</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Usuário</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="seu.nome ou email completo"
                  className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <p className="text-[9px] text-slate-500">Use a parte antes do @ do seu e-mail</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-10 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <p className="text-xs text-rose-300 font-medium">{error}</p>
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Entrando...</>
              ) : "Acessar Portal"}
            </button>
          </form>
        </div>

        {/* Link para admin */}
        <div className="text-center mt-6">
          <button onClick={onBackToAdmin} className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
            Acesso Administrativo →
          </button>
        </div>

        <p className="text-center text-slate-600 text-[11px] mt-4">
          © 2026 IMEPEDU — Portal Estudantil
        </p>
      </motion.div>
    </div>
  );
}
