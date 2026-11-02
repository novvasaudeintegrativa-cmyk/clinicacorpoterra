# Design — Terapeuta Luis Manoel

Sistema visual do site de agendamento. Documentado no mesmo formato/rigor do `DESIGN.md` do
projeto Ressurgir, mas com a paleta própria deste cliente (verde-petróleo/madeira/âmbar, lida do
Instagram dele) — **não** a paleta teal/menta do Ressurgir, que é de outra marca. Referência viva:
[index.html](index.html) + [styles.css](styles.css).

> A paleta hoje é um tema de TESTE ("opção 3: visual livre" — ver comentário no topo do
> `styles.css`). Quando a paleta definitiva do Instagram for confirmada, trocar só os tokens em
> `:root`; nada mais no CSS deveria precisar mudar.

## Princípios

1. **Verde é ação, âmbar é destaque pontual.** `--brand` carrega botões, chips ativos e tudo que
   avança no fluxo de agendamento. `--accent` (âmbar) marca só o que precisa chamar atenção uma
   vez por seção (grifo no H1, ícone do "como funciona").
2. **Creme/surface, nunca cinza puro.** Fundos puxam para o bege (`--bg`) e os cards para um creme
   mais claro (`--surface`); bordas em `--line` (bege-areia), não cinza neutro.
3. **Serifado para títulos, sem serifa para o resto.** Fraunces (serifada, peso 400) em H1/H2 e
   nomes de profissional/depoimento; Inter no corpo, rótulos e botões.
4. **Pílula é a forma da ação.** Botões, chips de mês/horário e os "passos" do agendamento são
   sempre `border-radius: 999px` — nunca quadrado com canto reto para algo clicável.
5. **Sombra suave, não plana.** Ao contrário do Ressurgir (que não usa sombra), aqui cards usam
   `--shadow` suave — é a linguagem desta marca, mais aconchegante/orgânica que um painel interno.
6. **Claro e escuro.** Toda cor vem de um token; o tema escuro só redefine os tokens (já implementado
   via `prefers-color-scheme`).

---

## Cores

### Tokens

| Token | Claro | Escuro | Uso |
| --- | --- | --- | --- |
| `--brand` | `#2F6454` | `#6FC0A4` | Verde do avatar: botões principais, chip ativo, bordas de foco, títulos de destaque |
| `--brand-ink` | `#FFFCF5` | `#0C1F18` | Texto sobre `--brand` |
| `--brand-soft` | `#E1ECE5` | `#24392F` | Fundo de pills de prova social, hover de card, "passo concluído" |
| `--accent` | `#E8A91C` | `#F2B72E` | Âmbar: grifo no H1, número do "como funciona", botão claro sobre faixa escura |
| `--wood` | `#B27A3C` | `#D09A5C` | Madeira/âmbar secundário: borda tracejada de depoimento-exemplo, tag "Exemplo" |
| `--bg` | `#F6F0E4` | `#14201C` | Fundo da página |
| `--surface` | `#FFFCF5` | `#1C2B26` | Cards (etapa do agendamento, depoimento, "como funciona") |
| `--ink` | `#23302B` | `#EFEADF` | Texto principal |
| `--muted` | `#6F7468` | `#A3AB9F` | Texto secundário, rótulo, placeholder |
| `--line` | `#E5D9C3` | `#2F423B` | Bordas, chip inativo, divisória |
| `--danger` | `#A33A3A` | `#E59A92` | Erro de validação no formulário |
| `--danger-soft` | `#F6E4E0` | `#3B2522` | Fundo da caixa de erro |

### Regras de contraste

- Texto sobre `--brand` usa sempre `--brand-ink` (nunca `--ink` direto).
- Texto sobre `--accent` usa `#23302B` fixo (ink claro), mesmo no tema escuro — o âmbar continua
  claro o bastante nos dois temas.
- `--wood` é só decorativo/tag, nunca cor de texto de corpo.

### Implementação

```css
:root {
  --bg: #f6f0e4; --surface: #fffcf5; --ink: #23302b; --muted: #6f7468; --line: #e5d9c3;
  --brand: #2f6454; --brand-ink: #fffcf5; --brand-soft: #e1ece5;
  --accent: #e8a91c; --wood: #b27a3c;
  --danger: #a33a3a; --danger-soft: #f6e4e0;
  --radius: 20px; --radius-sm: 12px;
  --shadow: 0 10px 30px -12px rgba(60, 50, 30, .25);
  --font-title: "Fraunces", Georgia, serif;
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #14201c; --surface: #1c2b26; --ink: #efeadf; --muted: #a3ab9f; --line: #2f423b;
    --brand: #6fc0a4; --brand-ink: #0c1f18; --brand-soft: #24392f; --accent: #f2b72e; --wood: #d09a5c;
    --danger: #e59a92; --danger-soft: #3b2522;
    --shadow: 0 10px 30px -12px rgba(0, 0, 0, .6);
  }
}
```

---

## Tipografia

| Papel | Fonte | Token | Uso |
| --- | --- | --- | --- |
| Títulos | Fraunces 400/600 | `--font-title` | H1, H2, nome do profissional, citação de depoimento |
| Corpo | Inter 400/500/600 | `--font-body` | Parágrafos, rótulos, botões, chips |

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap">
```

### Escala

| Nome | Tamanho | Peso | Fonte | Exemplo |
| --- | --- | --- | --- | --- |
| H1 (hero) | `clamp(2rem, 6vw, 3rem)` | 400 | Título | "Volte a ter *energia* pra viver" |
| H2 (seção) | `clamp(1.5rem, 4vw, 2.1rem)` | 400 | Título | "Como funciona o atendimento" |
| Título de card | 1.1rem | 600 | Título | Nome do profissional, "1. Você agenda" |
| Corpo | 1rem/1.6 | 400 | Corpo | Parágrafos |
| Secundário (`.muted`) | herdado, cor `--muted` | 400 | Corpo | Descrição, nota de rodapé |
| Rótulo de campo | 0.875rem | 500 | Corpo | "Nome completo", "WhatsApp" |
| Eyebrow/tag | 0.7–0.75rem, maiúsculas | 600 | Corpo | "Exemplo — trocar por depoimento real" |

---

## Espaçamento e raios

Valores em uso hoje (sem base fixa rígida — próxima tela deve puxar destes, não inventar novo):
**8 · 10 · 12 · 14 · 16 · 18 · 20 · 24 · 28 · 32 · 40 · 56 px.**

| Token | Valor | Onde |
| --- | --- | --- |
| `--radius-sm` | 12px | Campo, chip de FAQ, item de "dores" |
| `--radius` | 20px | Card (etapa, depoimento, "como funciona"), imagem hero |
| pílula | 999px | Botão, chip de mês/horário/passo, prova social |

- Largura máxima do conteúdo: `.wrap` em 1040px; o fluxo de agendamento (`main.wrap`) em 720px.
- Margem lateral mínima: 20px (`.wrap` padding).

---

## Componentes

### Botões

```css
.btn { font: inherit; font-weight: 600; padding: 13px 26px; border: 0; border-radius: 999px;
  background: var(--brand); color: var(--brand-ink); cursor: pointer;
  transition: transform .15s, filter .15s; }
.btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
.btn:disabled { opacity: .5; cursor: wait; transform: none; }
.btn--ghost { background: transparent; color: var(--brand); border: 1px solid var(--line); }
.btn--sm { padding: 9px 18px; font-size: .9rem; }
.btn--lg { padding: 16px 32px; font-size: 1.05rem; margin-top: 20px; }
.btn--claro { background: var(--accent); color: #23302b; }
```

**Texto do botão:** verbo direto ("Agendar minha consulta", "Continuar"), nunca "Enviar"/"OK".

### Campos

```css
label { display: block; margin-bottom: 16px; font-size: .875rem; font-weight: 500; }
input:not([type=checkbox]), textarea {
  display: block; width: 100%; margin-top: 6px; padding: 12px 14px; font: inherit;
  border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--bg); color: var(--ink);
}
input:focus, textarea:focus, button:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
```

- Rótulo sempre acima do campo, nunca como placeholder sozinho.
- Checkbox (`.check`) usa `accent-color: var(--brand)`.

### Card de escolha (profissional / tipo de consulta)

```css
.card { text-align: left; display: flex; flex-direction: column; gap: 2px; padding: 16px 18px;
  background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius-sm); cursor: pointer;
  transition: border-color .15s, background .15s; }
.card:hover { border-color: var(--brand); background: var(--brand-soft); }
.card strong { font-family: var(--font-title); font-size: 1.1rem; font-weight: 600; }
```

### Chip (mês, horário, FAQ não usa chip)

```css
.chip { font: inherit; padding: 9px 18px; border: 1px solid var(--line); border-radius: 999px;
  background: var(--bg); color: inherit; cursor: pointer; }
.chip.on, .chip:hover { background: var(--brand); color: var(--brand-ink); border-color: var(--brand); }
```

### Passos do agendamento

```css
.passos { display: flex; gap: 8px; list-style: none; padding: 0; margin: 8px 0 20px; overflow-x: auto; }
.passos li { flex: 1 0 auto; font-size: .8rem; padding: 7px 14px; border-radius: 999px;
  border: 1px solid var(--line); color: var(--muted); white-space: nowrap; text-align: center; }
.passos li.on { background: var(--brand); border-color: var(--brand); color: var(--brand-ink); font-weight: 600; }
.passos li.feito { background: var(--brand-soft); border-color: var(--brand-soft); color: var(--brand); }
```

Padrão: passo atual preenchido (`--brand`), passo concluído em tom suave (`--brand-soft`), passo
futuro só com borda.

### Calendário

```css
.calendario { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-top: 20px; }
.dia { aspect-ratio: 1; border: 0; border-radius: 50%; background: var(--brand-soft); color: var(--brand);
  font-weight: 600; cursor: pointer; }
.dia:hover:not(:disabled) { background: var(--brand); color: var(--brand-ink); }
.dia:disabled { background: transparent; color: var(--muted); opacity: .4; cursor: default; font-weight: 400; }
```

Único componente circular do sistema (todo o resto é pílula ou card de canto arredondado).

### Card de etapa (container do fluxo de agendamento)

```css
.etapa { background: var(--surface); border-radius: var(--radius); padding: 28px; margin-bottom: 32px;
  box-shadow: var(--shadow); }
```

### Aviso / erro

```css
.aviso { padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 16px; }
.aviso--erro { background: var(--danger-soft); color: var(--danger); }
```

### FAQ

```css
.faq details { background: var(--surface); border-radius: var(--radius-sm); margin-bottom: 10px; padding: 0 18px; }
.faq summary { cursor: pointer; padding: 16px 0; font-weight: 600; }
```

---

## Escrita

- Português direto, voz ativa, frases curtas (ver seção "Quebra de objeções" do site como referência).
- Nunca prometer cura ou resultado garantido — aviso legal fixo no rodapé.
- Mensagem de erro de formulário diz o que falta, não "campo inválido": "Informe um WhatsApp válido
  com DDD."
- Texto de botão é o próximo passo, não "Enviar": "Continuar", "Confirmar agendamento".

## Responsivo e acessibilidade

- Breakpoint único em 800px (`@media (min-width: 800px)`) para grades de 1→2/3 colunas.
- Foco visível em todo controle (`outline: 2px solid var(--brand)`).
- `prefers-color-scheme: dark` já suportado nos tokens — nenhuma cor é hardcoded fora de `:root`.
- Checar contraste nos dois temas antes de publicar uma seção nova.

---

## Pendências de marca

- Paleta é provisória ("tema de TESTE") até a paleta definitiva do Instagram ser confirmada com o
  cliente — ver PRD §6.1.
- Fotos reais do Luis Manoel e da clínica ainda não estão em `img/` (hero e seção "Quem vai te
  atender" usam placeholder de gradiente até lá).
