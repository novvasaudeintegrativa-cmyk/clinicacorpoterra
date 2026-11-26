# Design — Clínica Corpo Terra

Página de vendas + agendamento online. **Usa o mesmo sistema visual do projeto Ressurgir**
(`C:\Projetos\Ressurgir\DESIGN.md`, referência viva em `ressurgir-one.vercel.app`): Outfit leve com
palavras-chave em negrito, teal profundo, menta, creme, botões em pílula e muito espaço vazio.
Referência viva deste projeto: [index.html](index.html) + [styles.css](styles.css).

> Histórico: a primeira versão usava uma paleta própria (verde-petróleo/madeira/âmbar, Fraunces + Inter)
> lida do Instagram. Foi substituída em 03/11/2026 pelo sistema do Ressurgir, a pedido do Anderson.
> Para ajustar a paleta, altere só os tokens em `:root` do `styles.css`.

## Linguagem visual

| Item | Valor |
| --- | --- |
| Fonte | Outfit para tudo (300 em títulos e textos de apoio, 700 nas palavras-chave, 600 em botões e títulos de card); JetBrains Mono só para o número dos passos |
| Fundos | branco e `--soft` (`#F1F8F7`) alternados; creme `#FDEEE3` no "Como funciona"; teal profundo `#00454D` na faixa de números; degradê `#00454D` → `#007A78` no CTA final |
| Destaque | menta `#00DCC0` sobre teal escuro; `#00716F` (botão) e `#00857F` (texto) sobre fundo claro |
| Botão sobre fundo claro | pílula `#00716F`, texto branco, hover `#005F5D`, pressionado `#004A49` |
| Botão sobre fundo escuro (nav, hero, CTA) | pílula em degradê menta (`#00DCC0` → `#7AF0DC`), texto `#00262C` |
| Cards | raio 12px, borda 1px `--line`, sombra suave só na foto e na etapa do agendamento |
| Títulos | peso 300, `text-wrap: balance`, palavra-chave em `<b>` (700) na cor `--brand-strong` |
| Eyebrow | 12px, maiúsculas, `letter-spacing: .1em`, cor `--accent`, acima de cada título de seção |

## Estrutura da página

Nav escura sticky → hero (eyebrow, título, foto em moldura, CTA) → faixa de números → sinais
(identificação) → como funciona (linha guia + passos) → quem atende → depoimentos → objeções →
agendamento → FAQ → CTA final → rodapé com aviso legal. Seções entram com `.reveal` (fade + subida).

## Regras

- Texto branco só sobre `--brand-strong` ou teal profundo; sobre menta, texto escuro `#00262C`.
- Estado tem forma: passo ativo/concluído do agendamento é pílula com cor + texto.
- Sem emoji como marcador. Sem promessa de cura ou resultado; aviso legal no rodapé.
- Depoimentos: só reais e autorizados. Os cartões atuais são exemplos tracejados a trocar.
- Fotos: `img/hero.jpg` (hero) e `img/luis.jpg` (seção "Quem vai te atender"); sem o arquivo, entra um degradê.
- Tema escuro: os tokens são redefinidos via `prefers-color-scheme`; as faixas teal não mudam.
- Respeitar `prefers-reduced-motion` (já tratado no `.reveal`).

## Tipografia

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap">
```

Escala: h1 `clamp(32px, 5.4vw, 64px)`, h2 `clamp(28px, 4vw, 40px)`, h3 18px/600, corpo 18px, apoio 16px/300.
Largura máxima do conteúdo 1120px; margem lateral mínima 16px.
