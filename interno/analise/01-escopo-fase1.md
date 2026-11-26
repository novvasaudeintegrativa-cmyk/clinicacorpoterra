# 01 · Escopo da Fase 1 (visão do PO)

Base: leitura de `sistema/*.html`, `sistema/dados.js`, `sistema/sistema.js`, `agendar.html`, `app.js`, `api.js`, `config.js`, `confirmacao.html`. Nada foi executado em navegador.

## Ponto de partida
O que existe é um **protótipo clicável**: os dados vivem na memória da página (`dados.js`) e somem ao recarregar. O site de agendamento roda em `MODO: 'mock'`. Não há servidor, banco nem login real. Isso não é falha, o próprio código avisa. Mas muda a pergunta: "falta o quê para a Fase 1 funcionar de verdade?"

## O que a Fase 1 pede e o que existe

| Necessidade da Fase 1 | Situação |
|---|---|
| Paciente agenda pelo site | Fluxo de 5 etapas existe (mock). Falta ligar ao servidor |
| Recepção/profissional vê a agenda | Existe, mas é uma grade fixa "Seg 9 a Sex 13" (não é calendário real) |
| Confirmar / realizar / cancelar | Existe na agenda (status só em memória) |
| **Remarcar** | **Não existe.** Só um contador "Remarcações" no cadastro e um botão que faz `remarc++` |
| **Criar consulta pela recepção** (telefone, WhatsApp, balcão) | **Não existe.** A agenda só mostra o que já veio do site |
| **Consulta presencial** | **Não existe.** O texto "online" está fixo no código (agenda, site, área do paciente) |
| **Registrar falta do paciente** | **Não existe** status "Faltou". "Faltas no mês" é um 0 fixo |
| Configurar horários e tipos | Tela existe (`horarios.html`), mas "Salvar" só mostra aviso |
| Cadastro, prontuário, exames | Existem (consistentes com a regra de pacientes compartilhados) |
| Área do paciente | Existe. Paciente não cancela nem remarca sozinho ("fale pelo WhatsApp") |

## Sobra (adiar ou tirar da Fase 1)
- **Financeiro** (`financeiro.html`, item no menu): o pedido diz que é Fase 2. Sugestão: esconder do menu até a Fase 2, para não parecer algo pronto. Os dados dele (`lancamentos`, `meses`) são fictícios e soltos, não atrapalham.
- **Relacionamento** (`relacionamento.html`): lembretes e reativação são úteis, mas dependem de WhatsApp real. Só o **lembrete de consulta** é Fase 1; reativação e pós-consulta podem esperar.
- **Interesses / status do paciente / LGPD de marketing**: úteis, não bloqueiam o agendamento.

## Perfil que falta
Os perfis hoje são só **Profissional** e **Paciente**. O contexto cita recepção. Não existe perfil de **Atendente/recepção** (agenda sem prontuário). Hoje a recepção teria que entrar como Profissional e veria o prontuário. Decisão do cliente: há recepção ou o profissional faz tudo?

## Ordem sugerida para fechar a Fase 1
1. Ligar ao servidor (login real, agenda, pacientes salvos). Sem isso nada é "pronto".
2. Remarcar e cancelar (recepção e paciente).
3. Marcar consulta pela recepção (com a mesma checagem de horário do site).
4. Presencial vs online: tipo de consulta com local ou link.
5. Status "Faltou" e contagem real de faltas.
6. Lembrete de consulta pelo WhatsApp.
7. Perfil de recepção (se houver).

## Encaixe do Financeiro depois
Bom: o tipo de consulta já tem campo `valor`, e `lancamentos` já pensa em receita/despesa. Cuidado: se o valor ficar só no tipo de consulta, mudar o preço depois altera o histórico. Ver `03-estrutura-dados.md`.
