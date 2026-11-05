/* Estrutura comum das telas do sistema: barra lateral, topo, acesso por perfil e funções de apoio.
   ATENÇÃO (protótipo): o "login" daqui só guarda o perfil na aba. No sistema real, o acesso é validado no servidor. */
(function () {
  const D = window.DADOS, body = document.body;
  const papel = sessionStorage.getItem('papel');
  if (!papel || papel !== body.dataset.papel) { location.replace('login.html'); return; }

  const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
    <symbol id="i-cal" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></symbol>
    <symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17.5" cy="9" r="2.4"/><path d="M17 14c2.5 0 4 1.7 4 4"/></symbol>
    <symbol id="i-file" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></symbol>
    <symbol id="i-flask" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/><path d="M7.5 15h9"/></symbol>
    <symbol id="i-wallet" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M16 14.5h2"/></symbol>
    <symbol id="i-home" viewBox="0 0 24 24"><path d="M3.5 11 12 4l8.5 7M6 9.5V20h12V9.5"/></symbol>
    <symbol id="i-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m20 20-4.2-4.2"/></symbol>
    <symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></symbol>
    <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
    <symbol id="i-down" viewBox="0 0 24 24"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></symbol>
    <symbol id="i-up" viewBox="0 0 24 24"><path d="M12 16V5M7 9l5-5 5 5M5 20h14"/></symbol>
    <symbol id="i-leaf" viewBox="0 0 24 24"><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14M5 19c2-4 5-7 9-9"/></symbol>
    <symbol id="i-video" viewBox="0 0 24 24"><rect x="3" y="6.5" width="12" height="11" rx="2.5"/><path d="m15 11 6-3.5v9L15 13z"/></symbol>
    <symbol id="i-printer" viewBox="0 0 24 24"><path d="M7 9V3h10v6M7 17H4.5V9h15v8H17M7 14h10v7H7z"/></symbol>
    <symbol id="i-eye" viewBox="0 0 24 24"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/></symbol>
    <symbol id="i-out" viewBox="0 0 24 24"><path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9"/></symbol>
  </svg>`;
  const ico = (n) => `<svg class="ic"><use href="#${n}"/></svg>`;

  const NAV = {
    prof: [['agenda.html', 'Agenda', 'i-cal'], ['pacientes.html', 'Pacientes', 'i-users'], ['relacionamento.html', 'Relacionamento', 'i-leaf'], ['exames.html', 'Exames', 'i-flask'], ['financeiro.html', 'Financeiro', 'i-wallet'], ['horarios.html', 'Horários', 'i-gear']],
    pac: [['paciente.html', 'Início', 'i-home'], ['paciente-consultas.html', 'Consultas', 'i-cal'], ['paciente-exames.html', 'Exames', 'i-flask'], ['paciente-dados.html', 'Meus dados', 'i-users']],
  };
  const eu = papel === 'prof' ? { nome: D.profissional.nome, rotulo: 'Profissional' } : { nome: D.pacientes.find((p) => p.id === D.pacienteLogado).nome, rotulo: 'Paciente' };
  const iniciais = (n) => n.split(' ').slice(0, 2).map((s) => s[0]).join('').toUpperCase();
  const ativo = body.dataset.nav || '';

  document.body.insertAdjacentHTML('afterbegin', SPRITE);
  const conteudo = document.getElementById('conteudo');
  const side = document.createElement('nav');
  side.className = 'side'; side.setAttribute('aria-label', 'Principal');
  side.innerHTML = `<a class="brand" href="${NAV[papel][0][0]}"><span>Clínica<br>Corpo Terra<small>${papel === 'prof' ? 'Software de Gestão de Clínica' : 'Área do paciente'}</small></span></a>`
    + NAV[papel].map(([h, t, i]) => `<a class="nv${h === ativo ? ' on' : ''}" href="${h}"${h === ativo ? ' aria-current="page"' : ''}>${ico(i)}<span>${t}</span></a>`).join('')
    + `<div class="who"><span class="av">${iniciais(eu.nome)}</span><div>${eu.nome}<small>${eu.rotulo}</small></div><button type="button" id="sair" aria-label="Sair">${ico('i-out')}</button></div>`;

  const area = document.createElement('div');
  area.className = 'area';
  area.innerHTML = `<div class="mhead">Clínica Corpo Terra</div>
    <header class="topo"><div><h1></h1><p></p></div><div class="acoes" id="acoes"></div></header>`;
  area.querySelector('h1').textContent = body.dataset.titulo || '';
  area.querySelector('p').textContent = body.dataset.sub || '';
  area.append(conteudo);
  const app = document.createElement('div');
  app.className = 'app'; app.append(side, area);
  body.prepend(app);
  const tpl = document.getElementById('acoes-tpl');
  if (tpl) document.getElementById('acoes').append(tpl.content);
  document.getElementById('sair').onclick = () => { sessionStorage.clear(); location.href = 'login.html'; };

  // ---- funções de apoio usadas pelas telas ----
  window.S = {
    D, ico, iniciais,
    el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; },
    fmtData(iso) { const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}`; },
    brl(n) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); },
    idade(iso) { const n = new Date(), b = new Date(iso); let a = n.getFullYear() - b.getFullYear(); if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--; return a; },
    paciente(id) { return D.pacientes.find((p) => p.id === id); },
    toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg; document.body.append(t); setTimeout(() => t.remove(), 2600); },
    $: (s, r = document) => r.querySelector(s),
    $$: (s, r = document) => [...r.querySelectorAll(s)],
  };
})();
