import React, { useState, useEffect } from "react";
import { GraduationCap, DollarSign, BookOpen, LogOut, RefreshCw, CheckCircle2, Clock, AlertCircle, ExternalLink, Copy, Award, HelpCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StudentPortalProps {
  token: string;
  studentId: number;
  studentNome: string;
  email: string;
  onLogout: () => void;
}

export default function StudentPortal({ token, studentId, studentNome, email, onLogout }: StudentPortalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"financeiro" | "notas" | "suporte">("financeiro");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Estados do ticket
  const [ticketAssunto, setTicketAssunto] = useState("");
  const [ticketCategoria, setTicketCategoria] = useState("SECRETARIA");
  const [ticketPrioridade, setTicketPrioridade] = useState("MEDIA");
  const [ticketDescricao, setTicketDescricao] = useState("");
  const [ticketLoading, setTicketLoading] = useState(false);
  const [meuTickets, setMeuTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const triggerFeedback = (type: "success" | "error", text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch(`/api/portal/aluno/${studentId}`, {
        headers: { "x-session-token": token },
      });
      const d = await res.json();
      if (res.ok) setData(d);
      else triggerFeedback("error", d.error || "Erro ao carregar dados.");
    } catch {
      triggerFeedback("error", "Erro de conexão.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await fetch(`/api/tickets?student_id=${studentId}`, {
        headers: { "x-session-token": token },
      });
      const d = await res.json();
      if (res.ok) {
        const meus = Array.isArray(d) ? d.filter((t: any) => t.student_id === studentId) : [];
        setMeuTickets(meus);
      }
    } catch {}
    finally { setLoadingTickets(false); }
  };

  const handleAbrirTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketAssunto || !ticketDescricao) {
      triggerFeedback("error", "Preencha o assunto e a descrição.");
      return;
    }
    setTicketLoading(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-token": token },
        body: JSON.stringify({
          student_id: studentId,
          assunto: ticketAssunto,
          categoria: ticketCategoria,
          prioridade: ticketPrioridade,
          descricao: ticketDescricao,
        }),
      });
      if (res.ok) {
        triggerFeedback("success", "Ticket aberto com sucesso! O polo já foi notificado.");
        setTicketAssunto("");
        setTicketDescricao("");
        setTicketCategoria("SECRETARIA");
        setTicketPrioridade("MEDIA");
        loadTickets();
      } else {
        const err = await res.json();
        triggerFeedback("error", err.error || "Erro ao abrir ticket.");
      }
    } catch {
      triggerFeedback("error", "Erro de rede.");
    } finally {
      setTicketLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { if (activeTab === "suporte") loadTickets(); }, [activeTab]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerFeedback("success", `${label} copiado!`);
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case "PAGO": return { bg: "bg-emerald-50 border-emerald-100", badge: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, label: "Pago" };
      case "ATRASADO": return { bg: "bg-rose-50 border-rose-100", badge: "bg-rose-100 text-rose-700", icon: <AlertCircle className="w-4 h-4 text-rose-500" />, label: "Em Atraso" };
      case "ESTORNADO": return { bg: "bg-slate-50 border-slate-100", badge: "bg-slate-100 text-slate-600", icon: <AlertCircle className="w-4 h-4 text-slate-400" />, label: "Estornado" };
      default: return { bg: "bg-amber-50 border-amber-100", badge: "bg-amber-100 text-amber-700", icon: <Clock className="w-4 h-4 text-amber-500" />, label: "Pendente" };
    }
  };

  const ticketStatusStyle = (status: string) => {
    switch (status) {
      case "RESOLVIDO": return "bg-emerald-100 text-emerald-700";
      case "EM_ATENDIMENTO": return "bg-sky-100 text-sky-700";
      default: return "bg-amber-100 text-amber-700";
    }
  };

  const ticketStatusLabel = (status: string) => {
    switch (status) {
      case "RESOLVIDO": return "Resolvido";
      case "EM_ATENDIMENTO": return "Em Atendimento";
      default: return "Aguardando";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 16 }} exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border ${feedback.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
            {feedback.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
            <span className="font-medium text-sm">{feedback.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-900 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl"><GraduationCap className="w-5 h-5 text-white" /></div>
          <div>
            <h1 className="text-sm font-bold text-white font-display">Portal do Aluno</h1>
            <p className="text-[10px] text-slate-500">IMEPEDU</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-white">{studentNome}</p>
            <p className="text-[10px] text-slate-500">{email}</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-rose-400 font-semibold transition-colors border border-slate-800 hover:border-rose-800 px-3 py-1.5 rounded-lg">
            <LogOut className="w-3.5 h-3.5" />Sair
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
            <p className="text-sm text-slate-500">Carregando seu portal...</p>
          </div>
        ) : (
          <>
            {/* Card do Aluno */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-400">
                    {studentNome.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <h2 className="text-base font-bold font-display">{studentNome}</h2>
                    <p className="text-xs text-slate-400">Matrícula: <span className="font-mono text-indigo-400">{data?.student?.matricula}</span></p>
                    {data?.student?.moodle_sync_status && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${data.student.moodle_sync_status === "SINCRONIZADO" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                        AVA: {data.student.moodle_sync_status}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => loadData(true)} disabled={refreshing}
                  className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-2 rounded-xl transition-colors border border-slate-700 disabled:opacity-50">
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                  {refreshing ? "Atualizando..." : "Atualizar"}
                </button>
              </div>

              {data?.student?.valor_matricula && (
                <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Valor Total</span>
                    <span className="text-sm font-bold text-white">R$ {Number(data.student.valor_matricula).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Parcelas</span>
                    <span className="text-sm font-bold text-white">{data.student.num_parcelas}x</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Pagas</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {data.parcelas?.filter((p: any) => p.status === "PAGO").length || 0}/{data.student.num_parcelas}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs — agora com 3 abas */}
            <div className="flex gap-2 bg-white rounded-xl p-1.5 border border-slate-200 shadow-sm">
              <button onClick={() => setActiveTab("financeiro")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "financeiro" ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}>
                <DollarSign className="w-4 h-4" />Mensalidades
              </button>
              <button onClick={() => setActiveTab("notas")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "notas" ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}>
                <BookOpen className="w-4 h-4" />Notas
              </button>
              <button onClick={() => setActiveTab("suporte")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "suporte" ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}>
                <HelpCircle className="w-4 h-4" />Suporte
                {meuTickets.filter(t => t.status !== "RESOLVIDO").length > 0 && (
                  <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {meuTickets.filter(t => t.status !== "RESOLVIDO").length}
                  </span>
                )}
              </button>
            </div>

            {/* Aba Financeiro */}
            {activeTab === "financeiro" && (
              <div className="space-y-3">
                {!data?.parcelas?.length ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                    <DollarSign className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                    <p className="text-sm font-bold text-slate-600">Nenhuma cobrança registrada ainda.</p>
                    <p className="text-xs text-slate-400 mt-1">As parcelas aparecerão aqui após serem geradas pela secretaria.</p>
                  </div>
                ) : (
                  data.parcelas.map((p: any, idx: number) => {
                    const s = statusStyle(p.status);
                    return (
                      <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                        className={`bg-white rounded-2xl border ${s.bg} p-4 shadow-sm`}>
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3">
                            {s.icon}
                            <div>
                              <p className="text-xs font-bold text-slate-800">{p.descricao}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                Vencimento: <span className="font-semibold">
                                  {p.data_vencimento ? new Date(p.data_vencimento + "T12:00:00").toLocaleDateString("pt-BR") : "—"}
                                </span>
                                {p.paymentDate && (
                                  <span className="ml-2 text-emerald-600">· Pago em: {new Date(p.paymentDate + "T12:00:00").toLocaleDateString("pt-BR")}</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 ml-auto">
                            <div className="text-right">
                              <p className="text-sm font-bold text-slate-800">R$ {Number(p.valor).toFixed(2)}</p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
                            </div>
                          </div>
                        </div>
                        {p.status !== "PAGO" && p.status !== "ESTORNADO" && p.invoiceUrl && (
                          <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2 flex-wrap">
                            <a href={p.invoiceUrl} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors">
                              <ExternalLink className="w-3 h-3" />Ver Boleto
                            </a>
                            <button onClick={() => copyToClipboard(p.invoiceUrl, "Link do boleto")}
                              className="flex items-center gap-1.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition-colors">
                              <Copy className="w-3 h-3" />Copiar Link
                            </button>
                          </div>
                        )}
                        {p.status === "PAGO" && (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />Pagamento confirmado
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}

            {/* Aba Notas */}
            {activeTab === "notas" && (
              <div className="space-y-3">
                {!data?.grades?.length ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                    <BookOpen className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                    <p className="text-sm font-bold text-slate-600">Nenhuma nota lançada ainda.</p>
                    <p className="text-xs text-slate-400 mt-1">As notas aparecerão aqui após serem registradas.</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-indigo-500" />
                        <span className="text-xs font-bold text-slate-700">Média Geral</span>
                      </div>
                      <span className={`text-lg font-bold font-mono ${(data.grades.reduce((s: number, g: any) => s + Number(g.nota), 0) / data.grades.length) >= 7 ? "text-emerald-600" : "text-rose-600"}`}>
                        {(data.grades.reduce((s: number, g: any) => s + Number(g.nota), 0) / data.grades.length).toFixed(1)}
                      </span>
                    </div>
                    {data.grades.map((g: any, idx: number) => (
                      <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{g.disciplina}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Faltas: {g.faltas || 0}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-bold font-mono ${Number(g.nota) >= 7 ? "text-emerald-600" : "text-rose-600"}`}>
                            {parseFloat(String(g.nota)).toFixed(1)}
                          </span>
                          <p className={`text-[10px] font-bold ${Number(g.nota) >= 7 ? "text-emerald-500" : "text-rose-500"}`}>
                            {Number(g.nota) >= 7 ? "Aprovado" : "Recuperação"}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Aba Suporte */}
            {activeTab === "suporte" && (
              <div className="space-y-4">

                {/* Formulário de novo ticket */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-indigo-500" />
                      Abrir Chamado
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Sua mensagem será enviada diretamente ao polo.</p>
                  </div>

                  <form onSubmit={handleAbrirTicket} className="p-5 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">Assunto *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Dúvida sobre mensalidade"
                        value={ticketAssunto}
                        onChange={(e) => setTicketAssunto(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 block">Categoria</label>
                        <select value={ticketCategoria} onChange={(e) => setTicketCategoria(e.target.value)}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800">
                          <option value="SECRETARIA">Secretaria</option>
                          <option value="FINANCEIRO">Financeiro</option>
                          <option value="ACADEMICO">Acadêmico</option>
                          <option value="TECNICO">Suporte Técnico</option>
                          <option value="OUTROS">Outros</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 block">Prioridade</label>
                        <select value={ticketPrioridade} onChange={(e) => setTicketPrioridade(e.target.value)}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800">
                          <option value="BAIXA">Baixa</option>
                          <option value="MEDIA">Média</option>
                          <option value="ALTA">Alta</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">Mensagem *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Descreva sua dúvida ou solicitação em detalhes..."
                        value={ticketDescricao}
                        onChange={(e) => setTicketDescricao(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium text-slate-800 resize-none"
                      />
                    </div>

                    <button type="submit" disabled={ticketLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                      {ticketLoading ? (
                        <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Enviando...</>
                      ) : (
                        <><Send className="w-3.5 h-3.5" />Enviar Chamado</>
                      )}
                    </button>
                  </form>
                </div>

                {/* Meus tickets anteriores */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Meus Chamados</h3>
                    <button onClick={loadTickets} disabled={loadingTickets}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold disabled:opacity-50">
                      {loadingTickets ? "Carregando..." : "↻ Atualizar"}
                    </button>
                  </div>

                  {loadingTickets ? (
                    <div className="text-center py-4 text-slate-400 text-xs">Carregando chamados...</div>
                  ) : meuTickets.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
                      <HelpCircle className="w-8 h-8 mx-auto text-slate-200 mb-2" />
                      <p className="text-xs text-slate-500">Nenhum chamado aberto ainda.</p>
                    </div>
                  ) : (
                    meuTickets.map((t: any, idx: number) => (
                      <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{t.assunto}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{t.categoria} · {t.prioridade}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${ticketStatusStyle(t.status)}`}>
                            {ticketStatusLabel(t.status)}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 bg-slate-50 rounded-lg p-2.5 leading-relaxed">
                          {t.descricao}
                        </p>

                        {t.resposta_suporte && (
                          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 space-y-1">
                            <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider">Resposta do Polo</p>
                            <p className="text-[11px] text-indigo-800 leading-relaxed">{t.resposta_suporte}</p>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}