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

### 4.1 Escopo ampliado — CRM completo da clínica

> Fonte: `Docs/CRM - CLÍNICA CORPO TERRA.md` (levantamento do cliente, 04/11/2026). Mostra que o
> lado da clínica é um **CRM completo** (funil, WhatsApp, fidelização, indicadores), não só
> agenda + financeiro. Os módulos abaixo somam-se aos de §4.

1. **Cadastro e gestão de pacientes**
   - Dados pessoais e histórico de atendimento.
   - Status do paciente: **ativo, inativo, novo lead**.
   - Registro de interesses e necessidades.
   - (Liga com o prontuário de §5: paciente passa a ser entidade própria.)
2. **Funil comercial**
   - Captação e organização de leads.
   - Etapas do atendimento até a conversão (lead → consulta agendada → paciente).
   - Registro de **motivos de perda**.
3. **Integração com WhatsApp**
   - Centralização das conversas.
   - Mensagens automáticas e follow-ups.
   - Distribuição de leads entre atendentes.
4. **Agenda e acompanhamento** (estende o módulo Agenda de §4)
   - Agendamentos e **confirmações automáticas**.
   - **Lembretes** de consultas e retornos.
   - Controle de **faltas e remarcações**.
5. **Relacionamento e fidelização**
   - Reativação de pacientes inativos.
   - Mensagens de aniversário.
   - Acompanhamento pós-consulta.
   - Campanhas segmentadas.
6. **Gestão comercial e indicadores**
   - Taxa de conversão de leads.
   - Faturamento e ticket médio.
   - Desempenho dos vendedores/atendentes.
   - Origem dos leads e resultado das campanhas.
7. **Integrações e segurança**
   - Integração com **TGA** e formulários.
   - Integração com **Meta Ads**.
   - **Controle de acesso por funcionário** (perfis/permissões).
   - Proteção de dados conforme a **LGPD**.

**Impactos nas decisões anteriores**
- Lembrete/confirmação por WhatsApp, antes "candidato natural" (§5), agora **entra no escopo**.
- Há "atendentes", "vendedores" e "acesso por funcionário": o cliente prevê mais gente além do
  Luis Manoel. Isso **enfraquece a premissa de "conta única do tenant"** usada para proteger o
  prontuário — será preciso permissão por perfil, com prontuário restrito aos profissionais (todos eles, ver §4.3).
- Meta Ads e origem de leads reaproveitam o que o NewCRM já tem (Tráfego/campanhas), mas o
  `segmento = clinica` não pode esconder esses módulos.
- Reativação, aniversário e campanhas segmentadas exigem base de pacientes com data de nascimento,
  último atendimento e consentimento (LGPD) de contato.

### 4.2 Telas: o que já está projetado e o que falta (04/11/2026)

Legenda: **Protótipo** = tela navegável em `sistema/` ou no site (dados fictícios); **Mockup** = tela
em `mockups/index.html`, usada em `apresentacao-sistema.html`.

**Site público**
| Tela | Protótipo | Mockup |
|---|---|---|
| Página de vendas (`index.html`) | sim | sim |
| Agendamento (`agendar.html`) | sim | sim |
| Confirmação (`confirmacao.html`) | sim | sim |

**Sistema, perfil profissional**
| Tela | Protótipo | Mockup |
|---|---|---|
| Login | sim | sim |
| Agenda | sim | sim |
| Pacientes (lista com status, origem, leads, indicadores rápidos) | sim, ampliada em 04/11 | sim, ampliada |
| Cadastro do paciente (contato, interesses, histórico, LGPD, ações de WhatsApp) | sim, nova | sim, nova |
| Relacionamento e fidelização (reativar, aniversário, pós-consulta, campanha segmentada) | sim, nova | sim, nova |
| Prontuário | sim | sim |
| Exames | sim | sim |
| Financeiro | sim | sim |
| Horários e tipos de consulta | sim | sim |

**Sistema, perfil paciente**
| Tela | Protótipo | Mockup |
|---|---|---|
| Início | sim | sim |
| Consultas | sim | **falta** |
| Meus exames | sim | sim |
| Meus dados | sim | **falta** |

**Telas que ainda não existem** (vindas do levantamento do cliente, §4.1)
1. **Funil comercial**: quadro de leads por etapa, com registro do motivo de perda (módulo 2).
2. **Conversas do WhatsApp**: caixa de entrada centralizada e distribuição de leads entre atendentes (módulo 3).
3. **Mensagens automáticas**: modelos de mensagem, regras de follow-up, lembrete e confirmação (módulos 3 e 4).
4. **Faltas e remarcações**: lista de pendências da agenda e histórico por paciente (módulo 4).
5. **Indicadores**: conversão de leads, faturamento, ticket médio, desempenho por atendente, origem dos leads e resultado de campanhas (módulo 6).
6. **Equipe e permissões**: cadastro de funcionários e perfil de atendente, com acesso por pessoa (módulo 7).
7. **Integrações**: Meta Ads, TGA e formulários (módulo 7; TGA ainda indefinido).
8. **LGPD e segurança**: termo de consentimento, registro de acessos, recuperar senha e sessão (módulo 7).
9. **Perfil de atendente**: menu e telas próprias, sem acesso ao prontuário.

Ordem sugerida para projetar o que falta: mockups do paciente (2 telas), depois funil, conversas e
mensagens automáticas (MVP de relacionamento), e por fim indicadores, equipe e integrações.

### 4.3 Pacientes compartilhados entre todos os profissionais (stakeholder, 06/11/2026)

**Regra definida em reunião com o stakeholder:** como a clínica é integrativa, **todos os pacientes são
compartilhados com todos os profissionais**. Em algum momento do tratamento, o profissional pede que o
paciente siga para outro tratamento com outro profissional, para dar continuidade. Por isso o paciente
não pertence a um profissional; pertence à clínica.

Impactos no desenho:
- **Cadastro do paciente:** um só por pessoa, da clínica, visível a todos os profissionais. Não existe
  "carteira de pacientes" por profissional.
- **Prontuário:** todos os profissionais abrem o prontuário de qualquer paciente, para a continuidade do
  tratamento. Continua fechado para gestor, administrador do sistema e atendente. Cada evolução registra
  o profissional autor e a data.
- **Registro de acessos (LGPD):** como todos veem tudo, fica anotado quem abriu cada ficha e cada exame.
  Dado de saúde segue sendo sensível, então rever D-05 do backlog do NewCRM.
- **Agenda:** cada profissional tem a sua; o mesmo paciente pode ser atendido por mais de um.
- **Área do paciente:** mostra as consultas e os exames com todos os profissionais.
- **Encaminhamento (a validar):** registrar que o profissional X encaminhou o paciente ao Y é uma
  funcionalidade natural dessa regra, mas ainda não está no escopo.
- **Fase 2 (Loja):** a regra de comissão precisa dizer a quem pertence o atendimento quando há
  encaminhamento.

## 5. Fora de escopo (por enquanto)

- Cadastro/login de paciente — fica no site público, não no NewCRM.
- Pagamento de consulta — não discutido ainda; decidir se entra aqui ou fica fora.
- Notificação automática (lembrete de consulta por WhatsApp) — não discutido ainda, mas é candidato
  natural a reaproveitar a infra de envio de WhatsApp que o NewCRM já tem.
- **Prontuário (ficha clínica do paciente)** — levantado em 02/11/2026. É dado de saúde (categoria
  sensível pela LGPD), e a premissa de **um profissional só (Luis Manoel)** caiu: a clínica terá vários
  profissionais e todos veem todos os pacientes (§4.3). O acesso "só profissionais" passa a exigir
  permissão por perfil, não basta a conta única do tenant. Falta desenhar: página
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
6. **O que é "TGA"?** — citado no levantamento (§4.1-7) como integração junto com formulários.
   Confirmar com o cliente o que é e que dados trocam.
7. **Quem são os "atendentes/vendedores"?** — o levantamento prevê distribuição de leads e
   desempenho por vendedor, e a clínica terá vários profissionais (§4.3). Quantas pessoas da equipe
   terão login e com que permissões?
8. **Prioridade entre módulos** — o escopo cresceu muito (§4.1). Definir um MVP (sugestão: pacientes
   + agenda + lembretes WhatsApp) e deixar funil, fidelização e indicadores para fases seguintes.

## 7. Próximo passo sugerido

Depois de confirmar o cliente real e a prioridade, desenhar:
- O schema do `agendamentos` + `profissionais` + `horarios_disponiveis` no Supabase do NewCRM.
- O contrato da função receptora (quais campos o site público precisa mandar).
- As telas de Agenda e Financeiro da clínica dentro do NewCRM.
