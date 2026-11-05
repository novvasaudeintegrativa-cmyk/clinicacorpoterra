(function () {
  const C = window.CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad = (n) => String(n).padStart(2, '0');

  const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const DIAS_SEM = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const novo = () => ({ paciente: null, prof: null, mes: null, dias: {}, dia: null, hora: null, tipo: null, key: crypto.randomUUID() });
  let catalogo = [];
  let S = novo();
  let passo = 1;

  document.title = `Agende sua consulta — ${C.NOME_CLINICA}`;
  $('#marca').textContent = C.NOME_CLINICA;

  // ---------- util ----------
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function erro(msg) {
    const box = $('#erro');
    box.textContent = msg || '';
    box.hidden = !msg;
    if (msg) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function ir(n) {
    passo = n;
    erro('');
    $$('.etapa').forEach((s) => (s.hidden = s.dataset.etapa !== String(n)));
    $$('#passos li').forEach((li) => {
      const p = Number(li.dataset.passo);
      li.classList.toggle('on', p === n);
      li.classList.toggle('feito', n === 'ok' || p < n);
    });
    $('#agendar').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const dataBR = (iso) => { const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}`; };
  const diaLongo = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    const t = new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    return t.charAt(0).toUpperCase() + t.slice(1);
  };
  const duracao = () => S.tipo?.duracao_min ?? 60;
  function preencher(dl, linhas) {
    dl.replaceChildren();
    linhas.forEach(([k, v]) => { dl.append(el('dt', null, k), el('dd', null, v)); });
  }

  // ---------- 1. paciente ----------
  const mascaraTel = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };
  $('[name=whatsapp]').addEventListener('input', (e) => (e.target.value = mascaraTel(e.target.value)));

  $('#form-paciente').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const f = ev.target;
    const nome = f.nome.value.trim();
    const wa = f.whatsapp.value.replace(/\D/g, '');
    const email = f.email.value.trim();
    if (nome.split(/\s+/).length < 2) return erro('Informe seu nome completo.');
    if (wa.length < 10) return erro('Informe um WhatsApp válido com DDD.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return erro('Informe um e-mail válido.');
    if (!f.lgpd.checked) return erro('É necessário concordar com o uso dos dados.');
    S.paciente = { nome, whatsapp: '+55' + wa, email, nascimento: f.nascimento.value || null, consentimento_lgpd: true };
    S.waTela = f.whatsapp.value; // formato digitado, só para exibir
    ir(2);
  });

  // ---------- 2. profissional ----------
  function renderProfissionais() {
    const box = $('#lista-profissionais');
    box.replaceChildren();
    catalogo.forEach((p) => {
      const b = el('button', 'card');
      b.type = 'button';
      b.append(el('strong', null, p.nome), el('span', 'muted', p.especialidade || ''));
      b.addEventListener('click', () => { S.prof = p; S.tipo = null; S.dia = S.hora = null; resetHorarios(); abrirMeses(); ir(3); });
      box.append(b);
    });
  }

  // ---------- 3. data e horário (mesma tela) ----------
  function mesesDisponiveis() {
    const hoje = new Date();
    return Array.from({ length: C.MESES_A_FRENTE + 1 }, (_, i) => {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
      return { ym: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`, label: `${MESES[d.getMonth()]} ${d.getFullYear()}`, d };
    });
  }
  function abrirMeses() {
    const box = $('#lista-meses');
    box.replaceChildren();
    mesesDisponiveis().forEach((m, i) => {
      const b = el('button', 'chip', m.label);
      b.type = 'button';
      b.dataset.ym = m.ym;
      b.addEventListener('click', () => carregarMes(m.ym));
      box.append(b);
      if (i === 0) setTimeout(() => carregarMes(m.ym), 0);
    });
  }
  async function carregarMes(ym) {
    S.mes = ym;
    $$('#lista-meses .chip').forEach((c) => c.classList.toggle('on', c.dataset.ym === ym));
    const cal = $('#calendario');
    cal.replaceChildren(el('p', 'muted', 'Carregando…'));
    try {
      S.dias = (await API.disponibilidade(S.prof.id, ym)).dias || {};
    } catch { cal.replaceChildren(); return erro('Não foi possível carregar a agenda. Tente novamente.'); }
    erro('');
    renderCalendario(ym);
  }
  function renderCalendario(ym) {
    const [y, m] = ym.split('-').map(Number);
    const cal = $('#calendario');
    cal.replaceChildren();
    DIAS_SEM.forEach((d) => cal.append(el('div', 'cal__h', d)));
    const primeiro = new Date(y, m - 1, 1).getDay();
    for (let i = 0; i < primeiro; i++) cal.append(el('div'));
    for (let d = 1; d <= new Date(y, m, 0).getDate(); d++) {
      const iso = `${y}-${pad(m)}-${pad(d)}`;
      const livre = !!S.dias[iso]?.length;
      const b = el('button', 'dia' + (iso === S.dia ? ' sel' : ''), String(d));
      b.type = 'button';
      b.disabled = !livre;
      b.dataset.iso = iso;
      if (livre) b.addEventListener('click', () => escolherDia(iso));
      cal.append(b);
    }
    $('#sem-dias')?.remove();
    if (!Object.keys(S.dias).length) cal.after(Object.assign(el('p', 'muted', 'Sem horários neste mês. Escolha outro mês.'), { id: 'sem-dias' }));
  }
  function escolherDia(iso) {
    S.dia = iso; S.hora = null;
    $$('#calendario .dia').forEach((b) => b.classList.toggle('sel', b.dataset.iso === iso));
    renderHorarios();
  }
  function resetHorarios() {
    $('#dia-escolhido').textContent = 'Escolha um dia no calendário';
    $('#lista-horarios').replaceChildren();
    atualizarResumoParcial();
  }
  function renderHorarios() {
    $('#dia-escolhido').textContent = diaLongo(S.dia);
    const box = $('#lista-horarios');
    box.replaceChildren();
    (S.dias[S.dia] || []).forEach((h) => {
      const b = el('button', 'chip' + (h === S.hora ? ' on' : ''), h);
      b.type = 'button';
      b.addEventListener('click', () => {
        S.hora = h;
        $$('#lista-horarios .chip').forEach((c) => c.classList.toggle('on', c === b));
        atualizarResumoParcial();
      });
      box.append(b);
    });
    atualizarResumoParcial();
  }
  function atualizarResumoParcial() {
    preencher($('#resumo-parcial'), [
      ['Profissional', S.prof ? S.prof.nome : '—'],
      ['Data', S.dia && S.hora ? `${dataBR(S.dia).slice(0, 5)} às ${S.hora}` : 'a escolher'],
      ['Consulta', 'a escolher'],
    ]);
    $('#btn-horario').disabled = !(S.dia && S.hora);
  }
  $('#btn-horario').addEventListener('click', () => { renderTipos(); ir(4); });

  // ---------- 4. tipo de consulta ----------
  function renderTipos() {
    const box = $('#lista-tipos');
    box.replaceChildren();
    S.prof.tipos.forEach((t) => {
      const b = el('button', 'card');
      b.type = 'button';
      b.append(el('strong', null, t.nome), el('span', 'muted', `${t.duracao_min} min`));
      b.addEventListener('click', () => { S.tipo = t; renderResumo(); ir(5); });
      box.append(b);
    });
  }

  // ---------- 5. confirmação ----------
  const linhasResumo = () => [
    ['Paciente', S.paciente.nome],
    ['WhatsApp', S.waTela || S.paciente.whatsapp],
    ['Profissional', S.prof.nome],
    ['Consulta', `${S.tipo.nome} · ${S.tipo.duracao_min} min · online`],
    ['Data', `${dataBR(S.dia)} às ${S.hora}`],
  ];
  function renderResumo() { preencher($('#resumo'), linhasResumo()); }

  $('#btn-confirmar').addEventListener('click', async (ev) => {
    const btn = ev.currentTarget;
    btn.disabled = true;
    erro('');
    try {
      const r = await API.agendar({
        idempotency_key: S.key,
        paciente: S.paciente,
        profissional_id: S.prof.id,
        tipo_consulta_id: S.tipo.id,
        inicio: `${S.dia}T${S.hora}:00-03:00`,
        duracao_min: duracao(),
        observacoes: $('#observacoes').value.trim() || null,
        utm: Object.fromEntries(['source', 'medium', 'campaign'].map((k) => [k, new URLSearchParams(location.search).get('utm_' + k)])),
      });
      // vai para a página de confirmação; guarda só o resumo sem dados pessoais
      try {
        sessionStorage.setItem('agendamento_ok', JSON.stringify({
          profissional: S.prof.nome,
          consulta: `${S.tipo.nome} · ${S.tipo.duracao_min} min · online`,
          data: `${dataBR(S.dia)} às ${S.hora}`,
          codigo: r.agendamento_id,
        }));
      } catch { /* sem armazenamento: a confirmação abre sem o resumo */ }
      location.href = 'confirmacao.html';
    } catch (e) {
      if (e.status === 409) {
        // alguém pegou o horário: volta à tela de data e horário com a agenda atualizada
        S.key = crypto.randomUUID();
        S.hora = null;
        await carregarMes(S.mes);
        if (S.dias[S.dia]?.length) renderHorarios(); else { S.dia = null; resetHorarios(); }
        ir(3);
        erro('Esse horário acabou de ser ocupado. Escolha outro.');
      } else erro('Não foi possível concluir o agendamento. Tente novamente.');
    } finally { btn.disabled = false; }
  });

  // ---------- navegação ----------
  $$('[data-voltar]').forEach((b) => b.addEventListener('click', () => ir(passo - 1)));

  // ---------- init ----------
  API.catalogo().then((c) => { catalogo = c.profissionais || []; renderProfissionais(); })
    .catch(() => erro('Não foi possível carregar os profissionais. Recarregue a página.'));
  atualizarResumoParcial();
  ir(1);
})();
