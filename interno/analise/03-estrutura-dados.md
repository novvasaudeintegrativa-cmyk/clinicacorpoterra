# 03 · Estrutura de dados (visão do Engenheiro)

## Como os dados são guardados hoje
- Tudo em `sistema/dados.js`, um objeto `window.DADOS` na memória da página.
- **Cada tela carrega esse arquivo de novo.** Mudar status na agenda e abrir o prontuário não leva a mudança junto. Recarregar apaga tudo. É de propósito (protótipo), mas significa que **nada está salvo em lugar nenhum**.
- Site de agendamento: `config.js` com `MODO: 'mock'`; o contrato com o servidor está bem descrito em `api.js` (3 chamadas). Isso é um ponto forte: ligar ao NewCRM é trocar o modo.
- Login: `sessionStorage.setItem('papel', ...)`. Qualquer pessoa abre o console e vira "prof". Documentado no código como protótipo. No sistema real a regra precisa estar no servidor.

## Riscos de perda de dados
| Risco | Efeito |
|---|---|
| Sem persistência | Todo cadastro, evolução e status sai da tela ao recarregar |
| Upload de exame só na lista | Arquivo escolhido não é guardado (a tela avisa) |
| Prontuário em memória | Evolução digitada se perde. Alto risco se alguém usar o protótipo como se fosse real |
| Sem histórico de alterações | Hoje não há quem/quando mudou. Para prontuário e agenda isso precisa existir |

## O que impede crescer
1. **Agenda ligada a posição de grade** (`dia: 0..4`, `hora: índice em horas`), não a data e hora reais. Não permite outra semana, outro mês, horário fora das 7 linhas, nem consulta de 45 min em horário quebrado (o site oferece "09:50"). Trocar por `inicio` e `fim` em data-hora com fuso.
2. **Paciente guarda coisas de agenda dentro dele** (`proxima`, `faltas`, `remarc`). Esses números devem ser calculados das consultas, senão ficam diferentes da agenda.
3. **`consultasPaciente` é uma lista separada da `agenda`.** São duas verdades para a mesma consulta. Deve ser uma tabela só (consulta) com paciente, profissional, início, fim, tipo, modalidade, status.
4. **Um só profissional na prática** (`D.profissional`). A regra nova é vários profissionais com pacientes compartilhados: falta `profissional_id` na consulta, na evolução (autor) e nas condutas.
5. **Tipo de consulta sem modalidade, sem local, sem link.**
6. Evolução sem autor e sem hora (só data). Pedido do PRD: registrar quem escreveu.
7. IDs como `'p1'`, `'a1'`: no banco, usar UUID gerado pelo servidor. `'e' + (length+1)` pode repetir.

## Modelo mínimo sugerido (Fase 1)
`unidade` · `profissional` · `paciente` · `tipo_consulta` (nome, duração, modalidade, preço opcional) · `consulta` (paciente, profissional, tipo, início, fim, modalidade, status, motivo_cancelamento, link_online, criado_por) · `bloqueio_agenda` · `evolucao` (consulta, autor, texto, criado_em) · `exame` (arquivo no armazenamento privado, liberado) · `log_acesso`.

Regra de integridade que precisa estar **no banco**, não só na tela: dois agendamentos ativos do mesmo profissional não podem se sobrepor (restrição de exclusão por intervalo no PostgreSQL/Supabase).

## Encaixe do Financeiro (Fase 2)
Fácil, se na Fase 1 já constar:
- `consulta.id` estável para ligar uma cobrança a ela;
- `tipo_consulta.valor` vira **valor combinado na consulta** (copiado no momento da marcação), para mudar o preço depois sem alterar o histórico;
- `unidade_id` em todas as tabelas (a Loja é a unidade 2, como já definido);
- `profissional_id` na consulta, para comissão.
Hoje o `lancamentos` não aponta para consulta nenhuma (descrição em texto: "Consulta · Carla Modelo"). Isso precisará ser refeito, mas não atrapalha a Fase 1.

## Dados reais no projeto
Não encontrei dado real de paciente nas telas do sistema: nomes são fictícios ("Maria Exemplo da Silva") e e-mails `@exemplo.com`. O nome "Luis Manoel" é o profissional do cliente (dado do negócio, não de paciente). Não abri arquivos fora de `sistema/` e do site de agendamento (o `.env` está ignorado pelo git).

## Outros pontos técnicos
- `api.js`: o envio de `utm` e `origem: "site-agendamento"` coleta origem/campanha. O combinado do projeto é não ter material de marketing/origem. Se o sistema for assumir isso, remover do contrato ou confirmar com você.
- `app.js`: o fuso `-03:00` está fixo (ver `04-testes-e-falhas.md`).
- CSS e JS dependem de fonte do Google Fonts; sem internet o sistema carrega, só com fonte padrão. Ok.
