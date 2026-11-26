# 04 · Testes e falhas (visão da Qualidade)

**Como foi feito:** leitura do código. Não executei o sistema em navegador para este parecer, e não há testes automatizados no projeto. Tudo abaixo foi deduzido do código; vale confirmar clicando.

## Falhas encontradas

### Críticas
1. **Fuso horário errado para Mato Grosso.** `app.js` envia `inicio: "...T09:00:00-03:00"` fixo. Cuiabá usa UTC−4. Se a clínica atende em MT, todo horário gravado fica **uma hora diferente** do que o paciente escolheu, em qualquer outro sistema que leia a data (lembretes, Meet/Zoom, calendário). Corrigir: guardar o fuso da clínica (ex.: `America/Cuiaba`) e converter no servidor.
2. **Dupla marcação.** (a) "Remarcar" na área do paciente leva a `agendar.html`, que cria uma consulta nova e deixa a antiga. (b) A checagem de horário livre é feita só pelo site no mock; o servidor precisa travar (restrição no banco). O 409 está tratado na tela, mas ainda não existe servidor que o devolva.
3. **Nada é salvo.** Qualquer ação na agenda, cadastro, prontuário e horários some ao recarregar. Se alguém usar o protótipo com paciente real, perde tudo e não percebe (só há aviso pequeno).

### Importantes
4. **Cancelar sem confirmação e sem motivo** (`agenda.html`). Um clique cancela. Também não há desfazer.
5. **Sem status "Faltou".** Faltas contadas fixas em 0 (`['Faltas no mês', 0, '']`) e `p.faltas` nunca muda.
6. **"Consultas hoje" é a coluna 0 (segunda)**, não o dia de hoje. A agenda mostra "9 a 13 de novembro" e hoje é fim de novembro: está desatualizada sempre.
7. **Horário escolhido pode não caber na duração.** O site oferece horários antes de escolher o tipo (60 vs 45 min). Se for 14:00 e 14:50 (livre só 50 min), uma consulta de 60 min invade a seguinte.
8. **Intervalo entre consultas e antecedência mínima** (regras em `horarios.html`) são campos que não são usados por nada. Paciente pode marcar para daqui a 5 minutos e sem intervalo.
9. **Horários configurados em texto livre** ("09:00–12:00"). "9h as 12" ou "09:00-12:00" (hífen comum) não são lidos igual. Sem validação.
10. **Login aceita qualquer senha** e o perfil é decidido pelo e-mail. Ok no protótipo, mas é a primeira coisa a trocar. `sessionStorage` é forjável no console.
11. **Mesmo paciente sempre logado** (`pacienteLogado: 'p1'`). Área do paciente mostra sempre "Maria". Não há teste de que um paciente não veja dados de outro: isso tem que ser regra do servidor.
12. **Sem campos obrigatórios no cadastro** (`cadastro.html` é leitura). Onde existe formulário (site), as validações de nome/WhatsApp/consentimento estão em `app.js`; não revisei cada regra. Confirmar: WhatsApp com DDD, e-mail válido, consentimento LGPD marcado.

### Pode esperar
13. Sem proteção contra duplo clique no "Confirmar": o botão desativa durante o envio (bom) e `idempotency_key` evita repetição (bom). Falta só testar com servidor real.
14. Fila de espera, feriados e exceções (folga de um dia) não existem.
15. Evolução do prontuário sem hora e sem autor; `maxlength=2000` pode ser curto para anamnese.
16. Upload de exame não valida tipo/tamanho nem guarda arquivo (tela avisa).

## Consulta online: como o link é gerado e entregue
- **Não é gerado.** Em `horarios.html` há só um campo de texto "Link da consulta online" preenchido com "Google Meet". Em nenhum ponto do código um link é criado ou associado a uma consulta.
- Na confirmação do site: "a confirmação e o link da consulta chegam pelo WhatsApp". No sistema do paciente: o botão "Entrar na consulta" mostra aviso, não abre nada.
- **Inconsistência de ferramenta:** a regra do projeto é Zoom para videochamadas; a tela diz Google Meet.
- O que falta: decidir se é **um link fixo da sala do profissional** (mais simples, risco: qualquer paciente que o tenha entra na sala de outro) ou **um link por consulta** (criado pela API do Zoom/Meet ao confirmar). Entregar: no e-mail/WhatsApp de confirmação, no lembrete e no botão da área do paciente, liberado perto do horário.

## Casos de borda a testar quando houver servidor
Dois pacientes confirmando o mesmo horário ao mesmo tempo · remarcar para horário já ocupado · cancelar consulta passada · paciente sem WhatsApp · paciente com mesmo nome e dia de nascimento · consulta que cruza o almoço · mudança de horário de atendimento com consultas já marcadas · horário de verão (hoje não existe no Brasil, mas o fuso do paciente online pode ser outro) · paciente online em outro estado · falta do paciente com consulta paga (Fase 2) · profissional com folga · trocar profissional de uma consulta.

## O que não pude testar
- Execução no navegador (cliques, layout em celular).
- Integração com servidor (não existe).
- Envio real de WhatsApp, e-mail e criação de link de videochamada.
- Desempenho e uso simultâneo (sem servidor).
