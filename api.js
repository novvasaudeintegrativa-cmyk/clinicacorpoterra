/*
 * Camada de integração com o NewCRM. O resto do site só chama estas 3 funções.
 *
 * CONTRATO (funções públicas do NewCRM, sem login, escopo = tenant):
 *
 *  GET  {API_BASE}/agenda-catalogo?tenant=<slug>
 *       -> { profissionais: [{ id, nome, especialidade, tipos: [{ id, nome, duracao_min }] }] }
 *
 *  GET  {API_BASE}/agenda-disponibilidade?tenant=<slug>&profissional=<id>&mes=YYYY-MM
 *       -> { dias: { "YYYY-MM-DD": ["09:00", "09:50", ...] } }   // só horários LIVRES
 *
 *  POST {API_BASE}/agenda-agendar
 *       body: {
 *         tenant, idempotency_key, origem: "site-agendamento",
 *         paciente: { nome, whatsapp, email, nascimento|null, consentimento_lgpd: true },
 *         profissional_id, tipo_consulta_id,
 *         inicio: "YYYY-MM-DDTHH:mm:00-03:00", duracao_min,
 *         observacoes, utm: { source, medium, campaign }
 *       }
 *       -> 201 { agendamento_id, status: "confirmado" }
 *       -> 409 { erro: "horario_indisponivel" }   // alguém pegou o horário antes
 *
 * No NewCRM, o receptor grava em `agendamentos` (status inicial: confirmado), cria/atualiza
 * o paciente como lead pelo WhatsApp e revalida a disponibilidade no servidor (nunca confiar no site).
 */
(function () {
  const C = window.CONFIG;

  // ---------- MOCK ----------
  const MOCK_PROFISSIONAIS = [
    { id: 'p1', nome: 'Luis Manoel', especialidade: 'Terapia integrativa', dias: [1, 2, 3, 4, 5],
      tipos: [{ id: 't1', nome: 'Primeira consulta', duracao_min: 60 }, { id: 't2', nome: 'Retorno', duracao_min: 45 }] },
    { id: 'p2', nome: 'Profissional 2', especialidade: 'Acompanhamento', dias: [2, 4, 6],
      tipos: [{ id: 't3', nome: 'Sessão individual', duracao_min: 50 }] },
  ];

  function mockSlots(prof, data) {
    const dow = data.getDay();
    if (!prof.dias.includes(dow)) return [];
    const base = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    const seed = data.getDate() + data.getMonth() * 3 + prof.nome.length;
    return base.filter((_, i) => (seed + i) % 4 !== 0); // simula horários já ocupados
  }

  const pad = (n) => String(n).padStart(2, '0');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---------- HTTP ----------
  async function http(path, opts = {}) {
    const res = await fetch(`${C.API_BASE}/${path}`, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...(C.API_KEY ? { apikey: C.API_KEY } : {}), ...(opts.headers || {}) },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) { const e = new Error(body.erro || 'erro_api'); e.status = res.status; throw e; }
    return body;
  }

  // ---------- API pública do módulo ----------
  window.API = {
    async catalogo() {
      if (C.MODO === 'mock') { await sleep(150); return { profissionais: MOCK_PROFISSIONAIS }; }
      return http(`agenda-catalogo?tenant=${encodeURIComponent(C.TENANT)}`);
    },

    // mes = 'YYYY-MM' -> { 'YYYY-MM-DD': ['09:00', ...] }
    async disponibilidade(profissionalId, mes) {
      if (C.MODO === 'mock') {
        await sleep(150);
        const prof = MOCK_PROFISSIONAIS.find((p) => p.id === profissionalId);
        const [y, m] = mes.split('-').map(Number);
        const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
        const dias = {};
        for (let d = 1; d <= new Date(y, m, 0).getDate(); d++) {
          const dt = new Date(y, m - 1, d);
          if (dt <= hoje) continue;
          const s = mockSlots(prof, dt);
          if (s.length) dias[`${y}-${pad(m)}-${pad(d)}`] = s;
        }
        return { dias };
      }
      return (await http(`agenda-disponibilidade?tenant=${encodeURIComponent(C.TENANT)}&profissional=${encodeURIComponent(profissionalId)}&mes=${mes}`));
    },

    async agendar(payload) {
      const body = { tenant: C.TENANT, origem: 'site-agendamento', ...payload };
      if (C.MODO === 'mock') {
        await sleep(300);
        console.info('[mock] payload que iria para o NewCRM:', body);
        return { agendamento_id: 'mock-' + Date.now(), status: 'confirmado' };
      }
      return http('agenda-agendar', { method: 'POST', body: JSON.stringify(body) });
    },
  };
})();
