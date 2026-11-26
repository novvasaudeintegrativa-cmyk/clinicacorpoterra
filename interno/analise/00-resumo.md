# 00 · Resumo da análise do sistema (Fase 1: atendimento e agendamento)

Pareceres completos: [01 escopo](01-escopo-fase1.md) · [02 fluxo e telas](02-fluxo-e-telas.md) · [03 estrutura de dados](03-estrutura-dados.md) · [04 testes e falhas](04-testes-e-falhas.md).

## Veredito: precisa de ajustes
O que existe é um **protótipo clicável bem feito**, não um sistema pronto: nada é salvo, não há login nem servidor, e faltam partes essenciais do agendamento (remarcar, marcar pela recepção, presencial, falta). A base visual e o contrato com o servidor (`api.js`) estão bons e aceleram o resto.
Nenhum dado real de paciente foi encontrado nas telas analisadas.

## Ajustes por prioridade

### Crítico
| # | Problema | Onde | Sugestão |
|---|---|---|---|
| 1 | Nada é salvo; login falso (perfil forjável) | `sistema/dados.js`, `sistema.js`, `login.html` | Ligar ao servidor (NewCRM/Supabase) com login real e permissão por perfil no servidor |
| 2 | Fuso fixo `-03:00`; Mato Grosso é UTC−4 | `app.js` (envio do `inicio`) | Fuso da clínica configurável (`America/Cuiaba`), conversão no servidor |
| 3 | "Remarcar" do paciente cria consulta nova e deixa a antiga | `paciente.html` → `agendar.html` | Fluxo de remarcação que troca o horário da consulta existente |
| 4 | Sobreposição de horários só evitada pela tela | `api.js`, banco | Restrição no banco que impede dois agendamentos do mesmo profissional no mesmo intervalo |
| 5 | Agenda presa a posição de grade (Seg–Sex, 7 linhas), não a data real | `dados.js`, `agenda.html` | Consulta com início e fim reais; semana navegável |

### Importante
| # | Problema | Onde | Sugestão |
|---|---|---|---|
| 6 | Sem criar consulta pela recepção | `agenda.html` | Botão "Nova consulta" |
| 7 | Tudo "online" fixo; falta presencial | agenda, `app.js`, paciente | Modalidade no tipo de consulta; endereço no presencial |
| 8 | Sem remarcar na agenda; sem status "Faltou" | `agenda.html`, `cadastro.html` | Remarcar com horários livres; status Faltou com contagem real |
| 9 | Cancelar sem confirmação e sem motivo | `agenda.html` | Confirmar e registrar motivo |
| 10 | Horário escolhido antes do tipo (duração) | `agendar.html`/`app.js` | Tipo primeiro, depois horários que cabem |
| 11 | Link da consulta online não é criado nem entregue; Meet na tela, Zoom no projeto | `horarios.html`, `paciente.html` | Definir sala fixa ou link por consulta; entregar no WhatsApp, lembrete e botão |
| 12 | Regras de intervalo e antecedência não são usadas; horários em texto livre | `horarios.html` | Aplicar no cálculo de horários livres; seletor de hora; feriados e folgas |
| 13 | Consulta duplicada em duas listas; contadores do paciente guardados | `dados.js` | Uma tabela de consultas; calcular faltas e próxima consulta |
| 14 | Sem perfil de recepção (se houver) | `sistema.js` | Perfil Atendente: agenda sem prontuário |

### Pode esperar
Financeiro (Fase 2) e Relacionamento fora do menu até lá · fila de espera · autor e hora na evolução · validação e armazenamento privado de exames · `utm` e `origem` no contrato de `api.js` (ver pergunta 6) · visão por dia no celular.

## Encaixe do Financeiro depois
Sem bloqueio, desde que a Fase 1 já tenha: consulta com `id` estável, `unidade_id` em tudo, `profissional_id` na consulta e valor copiado para a consulta na hora da marcação.

## O que ficou de fora e por quê
- **Não executei o sistema no navegador** nem tirei capturas: a análise é de leitura de código.
- **Não usei os agentes PRUMO como sessões separadas.** Os quatro pareceres foram escritos aqui, cada um pelo ponto de vista do papel (po, ux-design-expert, architect, qa). Se quiser a rodada com cada agente de verdade, me diga.
- Não revisei: `relacionamento.html`, `financeiro.html`, `pacientes.html` e `exames.html` em detalhe (só lógica de exames); `prontuario.js/css` da raiz; textos do site além do fluxo de agendamento.
- Integração com servidor, WhatsApp, Zoom/Meet: não existem para testar.
- Uso simultâneo e desempenho: sem servidor, não há o que medir.

## Perguntas para você
1. **Quem usa e quantas pessoas ao mesmo tempo?** O texto que você colou veio com o espaço dos usuários e do uso simultâneo em branco. Há recepção ou só os profissionais?
2. A clínica fica em **Mato Grosso (fuso UTC−4)**? E os pacientes online, de qualquer lugar?
3. **Presencial:** onde é o atendimento? Todos os profissionais fazem os dois?
4. **Ferramenta de videochamada:** Zoom (como o combinado) ou Meet? Sala fixa do profissional ou link novo por consulta?
5. **Cancelar e remarcar:** o paciente pode sozinho (com prazo mínimo)? Ou sempre pela recepção?
6. O envio de `origem` e `utm` pelo site continua? Combinamos tirar o que for de marketing.
7. Faltas: a clínica quer **cobrar** ou apenas registrar? (Isso muda o desenho da Fase 2.)
8. Prioridade: o que você quer corrigir primeiro? Sugiro os itens 1 a 5.

Aguardando sua decisão. Nada foi alterado fora de `analise/`.
