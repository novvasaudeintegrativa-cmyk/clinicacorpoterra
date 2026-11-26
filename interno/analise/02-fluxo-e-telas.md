# 02 · Fluxo e telas (visão do Design)

Análise feita lendo o código das telas. Não foi aberto em navegador para este parecer.

## Fluxo: paciente agenda pelo site (`agendar.html`)
Escolhe profissional → mês → dia e horário → tipo de consulta → resumo e confirmação. Bom:
- Cada etapa tem um objetivo só; voltar funciona; o resumo vem antes de confirmar.
- Se o horário for ocupado (409), volta para a data com aviso claro e agenda atualizada. Ótimo tratamento.
- A confirmação não guarda dados pessoais no navegador.

Problemas:
1. **Escolhe horário antes do tipo de consulta.** A duração (60 min vs 45 min) só aparece depois, então os horários mostrados podem não caber no tipo escolhido. Inverter: tipo → data/horário.
2. **Tudo é "online"** (texto fixo). Para presencial falta escolher a modalidade e mostrar o endereço.
3. Não há tela de "Não encontrei horário": se a agenda do mês está cheia, o paciente não tem alternativa (lista de espera ou WhatsApp).

## Fluxo: recepção
- **Criar consulta:** não existe. A recepção só vê o que veio do site. Precisa de botão "Nova consulta" na agenda (escolher paciente existente ou novo, tipo, modalidade, horário).
- **Agenda (`agenda.html`):** é uma tabela fixa Seg–Sex com 7 linhas. Faltam: navegar entre semanas, ver o dia de hoje, visão por dia, mais de um profissional lado a lado, horário de almoço e bloqueios (folga, feriado). O subtítulo "Semana de 9 a 13 de novembro" está escrito à mão.
- **Detalhe da consulta:** mostra sempre "· online". Os botões estão bons, mas "Cancelar consulta" age na hora, sem confirmar nem pedir motivo. Um clique errado cancela.
- **Remarcar:** não existe na agenda. No cadastro, "Remarcar" só soma 1 no contador, não muda o horário.
- **Faltou:** não há status. Hoje a recepção teria que cancelar.
- Filtro por status está bom. Faltam busca por paciente e filtro por profissional.

## Fluxo: paciente na área dele
- "Entrar na consulta" só mostra aviso ("o link chega pelo WhatsApp"). Para online, o botão deveria abrir o link e só aparecer perto do horário.
- **"Remarcar" na tela inicial leva a `agendar.html`**, que cria uma consulta nova. A antiga continuaria marcada: dupla marcação por design. Deve remarcar a consulta existente.
- Cancelar/remarcar: "fale com a clínica pelo WhatsApp". Aceitável no começo, mas é trabalho manual para a recepção.

## Clareza das telas
- Bom: linguagem simples, protótipo avisa o que não é real, contraste e rótulos de acessibilidade presentes (`aria-label`, `role`).
- `horarios.html`: campos de horário são texto livre ("09:00–12:00"). Um erro de digitação quebra a agenda. Usar seletores de hora.
- `horarios.html`: "Link da consulta online" é um campo com "Google Meet" escrito. Não está claro se é o link fixo ou a ferramenta. Ver `04-testes-e-falhas.md`.
- Menu mostra **Financeiro** (Fase 2) e **Relacionamento** para quem é só recepção: poluição de menu.
- Em telas de celular a recepção provavelmente usa o computador; a grade semanal em celular precisa de visão por dia.

## Prioridade de telas novas/ajustadas
1. Agenda real (semana navegável + visão do dia + "Nova consulta").
2. Remarcar (modal com novos horários livres).
3. Status "Faltou" e confirmação ao cancelar (com motivo opcional).
4. Modalidade presencial/online em tipo de consulta, agenda, site e área do paciente.
5. Inverter ordem no site: tipo antes do horário.
6. Horários com seletor de hora, exceções e feriados.
