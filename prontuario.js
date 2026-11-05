/*
 * Prontuário (protótipo). Dados FICTÍCIOS em memória: nada é salvo nem enviado.
 *
 * Integração com o NewCRM (PRD, "Prontuário"): trocar PACIENTES por uma chamada autenticada
 * (conta do tenant) a /prontuario/:paciente_id, e gravar evolução/condutas pelas mesmas funções.
 * Modelo previsto no NewCRM (tabela `pacientes`, por tenant):
 *   id (uuid, usado em /prontuario/:id), codigo (nº legível PR-000123, sequencial por tenant),
 *   tenant_id, nome, nascimento, whatsapp, email, cidade, criado_em.
 *   `agendamentos.paciente_id`, `evolucoes` (paciente_id, data, texto) e `condutas` (paciente_id, tipo, nome, posologia).
 * Dado de saúde é sensível (LGPD): não usar localStorage nem URL com dados pessoais.
 */
(function () {
  const $ = (s) => document.querySelector(s);
  const TIPOS = { cha: ['🍵', 'Chá'], suplemento: ['💊', 'Suplemento'], habito: ['🌿', 'Hábito'], exame: ['🧪', 'Exame'] };

  const PACIENTES = [
    { id: 'p1', codigo: 'PR-000123', email: 'maria@exemplo.com', nome: 'Maria Exemplo da Silva', nasc: '1984-05-12', cidade: 'Cuiabá, MT', whatsapp: '(65) 90000-0001', desde: '2026-03-10',
      tags: ['Retorno', 'Online'], queixa: 'Cansaço persistente, sono irregular e desconforto intestinal há cerca de 8 meses.',
      evolucao: [
        { data: '2026-10-20', texto: 'Relata melhora no sono após ajuste de horários. Mantido o plano e reforçada a hidratação.' },
        { data: '2026-09-22', texto: 'Iniciado plano individual. Orientações de alimentação e rotina explicadas e entendidas.' },
        { data: '2026-03-10', texto: 'Primeira consulta. Avaliação completa de histórico, rotina e sintomas.' },
      ],
      condutas: [
        { nome: 'Chá de camomila', tipo: 'cha', pos: '1 xícara antes de dormir' },
        { nome: 'Magnésio (conforme orientação)', tipo: 'suplemento', pos: 'Dose e horário definidos na consulta' },
        { nome: 'Água ao longo do dia', tipo: 'habito', pos: 'Meta combinada com a paciente' },
      ] },
    { id: 'p2', codigo: 'PR-000124', email: 'ana@exemplo.com', nome: 'Ana Teste Souza', nasc: '1991-11-03', cidade: 'Várzea Grande, MT', whatsapp: '(65) 90000-0002', desde: '2026-10-05',
      tags: ['Primeira consulta'], queixa: 'Quer entender a falta de energia durante a tarde.',
      evolucao: [{ data: '2026-10-05', texto: 'Primeira consulta. Combinado retorno em 30 dias.' }],
      condutas: [{ nome: 'Hemograma completo', tipo: 'exame', pos: 'Trazer resultado no retorno' }] },
    { id: 'p3', codigo: 'PR-000125', email: 'carla@exemplo.com', nome: 'Carla Modelo Lima', nasc: '1978-02-27', cidade: 'Rondonópolis, MT', whatsapp: '(66) 90000-0003', desde: '2025-08-14',
      tags: ['Acompanhamento'], queixa: 'Acompanhamento de rotina e ajuste de hábitos.',
      evolucao: [{ data: '2026-10-28', texto: 'Consulta de acompanhamento. Sem queixas novas.' }, { data: '2025-08-14', texto: 'Primeira consulta.' }],
      condutas: [] },
  ];

  let atual = PACIENTES[0];

  const fmtData = (iso) => { const [y, m, d] = iso.split('-'); return d + '/' + m + '/' + y; };
  const idade = (iso) => { const n = new Date(), b = new Date(iso); let a = n.getFullYear() - b.getFullYear(); if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--; return a; };
  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function renderPaciente() {
    const p = atual;
    $('#p-avatar').textContent = p.nome.split(' ').slice(0, 2).map((s) => s[0]).join('');
    $('#p-nome').textContent = p.nome;
    $('#p-sub').textContent = idade(p.nasc) + ' anos · ' + p.cidade;
    const tags = $('#p-tags'); tags.replaceChildren();
    p.tags.forEach((t) => tags.append(el('li', null, t)));

    const ficha = $('#p-ficha'); ficha.replaceChildren();
    [['Nº do prontuário', p.codigo], ['Nascimento', fmtData(p.nasc)], ['WhatsApp', p.whatsapp], ['E-mail', p.email], ['Paciente desde', fmtData(p.desde)], ['Consultas', String(p.evolucao.length)]]
      .forEach(([k, v]) => { const d = el('div'); d.append(el('dt', null, k), el('dd', null, v)); ficha.append(d); });

    $('#p-queixa').textContent = p.queixa;
    renderEvolucao();
    renderCondutas();
  }

  function renderEvolucao() {
    const ol = $('#p-evolucao'); ol.replaceChildren();
    atual.evolucao.forEach((e) => {
      const li = el('li'); const t = el('time', null, fmtData(e.data)); t.dateTime = e.data;
      li.append(t, el('p', null, e.texto)); ol.append(li);
    });
  }

  function renderCondutas() {
    const ul = $('#p-condutas'); ul.replaceChildren();
    $('#cont-condutas').textContent = atual.condutas.length + (atual.condutas.length === 1 ? ' item' : ' itens');
    if (!atual.condutas.length) ul.append(el('li', 'vazio', 'Nenhuma conduta registrada.'));
    atual.condutas.forEach((c, i) => {
      const li = el('li', 'conduta');
      const ic = el('span', 'ic', TIPOS[c.tipo][0]); ic.setAttribute('aria-hidden', 'true');
      const info = el('div'); info.append(el('strong', null, c.nome), el('span', 'pos', TIPOS[c.tipo][1] + (c.pos ? ' · ' + c.pos : '')));
      const rm = el('button', 'rm', '×'); rm.type = 'button'; rm.setAttribute('aria-label', 'Remover ' + c.nome);
      rm.addEventListener('click', () => { atual.condutas.splice(i, 1); renderCondutas(); });
      li.append(ic, info, rm); ul.append(li);
    });
  }

  const sel = $('#sel-paciente');
  PACIENTES.forEach((p) => { const o = el('option', null, p.nome); o.value = p.id; sel.append(o); });
  sel.addEventListener('change', () => { atual = PACIENTES.find((p) => p.id === sel.value); renderPaciente(); });

  $('#form-evo').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const txt = $('#evo-texto').value.trim();
    if (!txt) return;
    const hoje = new Date(); const iso = hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0') + '-' + String(hoje.getDate()).padStart(2, '0');
    atual.evolucao.unshift({ data: iso, texto: txt });
    $('#evo-texto').value = '';
    renderPaciente();
  });

  $('#form-conduta').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const nome = $('#c-nome').value.trim();
    if (!nome) return;
    atual.condutas.push({ nome, tipo: $('#c-tipo').value, pos: $('#c-posologia').value.trim() });
    ev.target.reset();
    renderCondutas();
  });

  $('#btn-imprimir').addEventListener('click', () => window.print());

  renderPaciente();
})();
