# PRD — Site de agendamento + CRM de clínica (Clínica Corpo Terra)

> Pasta e nome provisórios — ajustar para o nome real do cliente quando definido.
> Criado em 02/11/2026, a partir de conversa sobre expandir o NewCRM pra atender clínica (não só
> congresso/lançamento, que é o que o NewCRM já faz hoje).

## 1. Contexto

O NewCRM foi construído pra funil de lançamento/congresso: leads por WhatsApp/Instagram, pipeline,
campanhas, tráfego com checkout (Eduzz/Kiwify). Apareceu uma demanda diferente: uma **clínica** que
precisa de **agendamento de consulta** — paciente escolhe profissional, mês, dia, horário disponível
e tipo de consulta — além de controle financeiro específico de clínica.

## 2. Decisão de arquitetura (confirmada com o Anderson em 02/11/2026)

**São dois projetos separados:**

1. **Site público de agendamento** — projeto à parte, fora do NewCRM. Onde o paciente se cadastra e
   marca a consulta. Ainda não definido se vai ser site próprio, sistema separado, ou outra forma.
2. **Lado da clínica, dentro do NewCRM** — não hospeda o cadastro/reserva do paciente. Só **recebe**
   o agendamento feito no site público (parecido com o padrão já usado no Tráfego: uma função pública
   que grava o dado, tipo `coletar-evento`) e depois a equipe da clínica gerencia esse dado — vê a
   agenda, confirma/cancela, financeiro, etc.

Essa separação já elimina do escopo do NewCRM: cadastro de paciente, fluxo de reserva, login público.
O NewCRM só precisa de um **receptor** da marcação + telas de gestão pro lado da clínica.

## 3. O que o site público (projeto separado) precisa ter

- Cadastro do paciente (qualquer pessoa pode se cadastrar).
- Fluxo de agendamento:
  - Escolher **profissional**.
  - Escolher **mês**.
  - Escolher **dia**.
  - Escolher **horário disponível** (precisa saber quais horários já estão ocupados).
  - Escolher **tipo de consulta**.
- Depois de confirmado, repassar o agendamento pro NewCRM (webhook/API — formato ainda não definido,
  ver §6).

> Este documento registra os requisitos do ponto de vista de quem vai gerenciar o CRM da clínica;
> quem for construir o site público usa isto como referência do que ele precisa coletar e enviar,
> mas o desenho de telas/UX do site em si é outro projeto.

## 4. O que o lado da clínica (dentro do NewCRM) precisa ter

- **Segmentação por tenant:** campo `segmento` no tenant (ex.: `congresso`, `clinica`, `generico`)
  que liga/desliga módulos na tela — clínica não precisa ver Tráfego/checkout de lançamento, por
  exemplo, e congresso não precisa ver Agenda.
- **Módulo Agenda:**
  - Profissionais (cadastro: nome, especialidade/tipo de consulta que atende).
  - Horários disponíveis por profissional (dia da semana, janela de horário, ou agenda mês a mês).
  - Agendamentos recebidos do site público (status: confirmado, cancelado, remarcado, realizado).
  - Visão de calendário/lista pra equipe acompanhar.
- **Financeiro da clínica:** receitas/despesas específicas da clínica (reaproveita conceito já
  previsto no backlog do NewCRM — N-08/N-09/N-10 do Congresso são financeiro genérico, dá pra
  generalizar em vez de duplicar).
- **Receptor do agendamento:** função pública (sem login, parecida com `coletar-evento`) que recebe
  o que o site público manda e grava em `agendamentos`, vinculando ao tenant certo.

## 5. Fora de escopo (por enquanto)

- Cadastro/login de paciente — fica no site público, não no NewCRM.
- Pagamento de consulta — não discutido ainda; decidir se entra aqui ou fica fora.
- Notificação automática (lembrete de consulta por WhatsApp) — não discutido ainda, mas é candidato
  natural a reaproveitar a infra de envio de WhatsApp que o NewCRM já tem.
- **Prontuário (ficha clínica do paciente)** — levantado em 02/11/2026. É dado de saúde (categoria
  sensível pela LGPD), mas como esse cliente tem **um profissional só (Luis Manoel)**, o acesso
  "só o terapeuta vê" sai de graça da regra padrão do NewCRM (a própria conta de login do tenant já
  é exclusiva dele — não precisa de login por profissional nem RLS especial). Falta desenhar: página
  própria por paciente (`/prontuario/:paciente_id`), paciente como entidade própria (hoje só existe
  `agendamentos` + lead por WhatsApp), e impressão/PDF via CSS de impressão do navegador (sem gerar
  PDF no servidor). Rever D-05 do backlog do NewCRM (papel de operador de dados / LGPD com clientes
  de saúde) mesmo assim, por ser dado de saúde.
- **Atendimento é online** (confirmado 02/11/2026) — não precisa de campo de endereço/local físico
  no agendamento nem no site.

## 6. Decisões pendentes

1. **Cliente** — nome definido em 03/11/2026: **Clínica Corpo Terra** (profissional: Luis Manoel). A pasta
   do projeto e o repositório ainda usam o nome provisório "terapeutaluismanoel".
2. **Prioridade/prazo** — o NewCRM está em corrida contra o congelamento do Congresso Câncer
   (16/11/2026); este projeto novo precisa de uma decisão de prioridade: entra em paralelo, ou só
   depois do congelamento?
3. **Formato do repasse do site público pro NewCRM** — webhook, API própria, ou banco compartilhado.
   Depende de como o site público for construído (e por quem).
4. **Pagamento da consulta** — entra no fluxo de agendamento ou é tratado à parte (ex.: pago no
   consultório)?
5. **Quem constrói o site público** — mesma equipe, terceirizado, ou outra ferramenta (ex.: Cal.com,
   algo pronto) adaptada?

## 7. Próximo passo sugerido

Depois de confirmar o cliente real e a prioridade, desenhar:
- O schema do `agendamentos` + `profissionais` + `horarios_disponiveis` no Supabase do NewCRM.
- O contrato da função receptora (quais campos o site público precisa mandar).
- As telas de Agenda e Financeiro da clínica dentro do NewCRM.
