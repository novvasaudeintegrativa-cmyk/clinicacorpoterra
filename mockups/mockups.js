/* Abas, escala e dados de exemplo dos mockups.
   Modos: index.html            -> navegação completa
          index.html#s-agenda   -> abre direto nessa tela
          index.html?embed=1#s-agenda -> só a tela (para colocar em slides) */
(function () {
  const screens = [...document.querySelectorAll(".screen")];
  const grupos = { site: "Parte 1 · Site", acesso: "Parte 2 · Acesso", prof: "Parte 2 · Profissional", atend: "Parte 2 · Atendente", pac: "Parte 2 · Paciente" };
  const gBox = document.getElementById("grupos"), aBox = document.getElementById("abas");
  const embed = new URLSearchParams(location.search).has("embed");
  if (embed) document.body.classList.add("embed");
  let atual = null;

  /* ---- dados de exemplo ---- */
  function calendario(el) {
    const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    dias.forEach((d) => { const b = document.createElement("b"); b.textContent = d; el.append(b); });
    // Novembro de 2026 começa num domingo; os dias 1 a 3 já passaram
    for (let d = 1; d <= 30; d++) {
      const i = document.createElement("i"), dow = (d - 1) % 7;
      const livre = d > 3 && dow >= 1 && dow <= 5 && d !== 11 && d !== 20;
      if (!livre) i.className = "off";
      if (d === 12) i.className = "sel";
      i.textContent = d; el.append(i);
    }
  }
  function semana(el) {
    const cab = ["", "Seg 9", "Ter 10", "Qua 11", "Qui 12", "Sex 13"];
    const horas = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
    const ev = [[0, 0, "c", "Maria Exemplo", "Retorno"], [0, 3, "c", "Carla Modelo", "Acompanhamento"], [1, 1, "a", "Ana Teste", "Primeira consulta"],
      [1, 4, "c", "Paula Demo", "Retorno"], [2, 2, "c", "Renata Fictícia", "Primeira consulta"], [3, 0, "c", "Júlia Exemplo", "Retorno"],
      [3, 5, "a", "Marta Teste", "Retorno"], [4, 1, "c", "Lúcia Demo", "Retorno"]];
    cab.forEach((t) => { const d = document.createElement("div"); d.className = "h"; d.textContent = t; el.append(d); });
    horas.forEach((h, r) => {
      const hr = document.createElement("div"); hr.className = "hr"; hr.textContent = h; el.append(hr);
      for (let c = 0; c < 5; c++) {
        const cell = document.createElement("div"), e = ev.find((x) => x[0] === c && x[1] === r);
        if (e) { cell.className = "ev " + e[2]; const b = document.createElement("b"), s = document.createElement("small"); b.textContent = e[3]; s.textContent = e[4]; cell.append(b, s); }
        el.append(cell);
      }
    });
  }
  document.querySelectorAll("[data-cal]").forEach(calendario);
  document.querySelectorAll("[data-wk]").forEach(semana);

  /* ---- abas ---- */
  Object.entries(grupos).forEach(([id, nome]) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "grupo"; b.dataset.g = id; b.textContent = nome;
    b.onclick = () => abrirGrupo(id); gBox.append(b);
  });
  function abrirGrupo(g) {
    gBox.querySelectorAll(".grupo").forEach((b) => b.classList.toggle("on", b.dataset.g === g));
    aBox.replaceChildren();
    screens.filter((s) => s.dataset.grupo === g).forEach((s) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "aba"; b.dataset.id = s.id; b.textContent = s.dataset.aba;
      b.onclick = () => abrir(s.id); aBox.append(b);
    });
    abrir(screens.find((s) => s.dataset.grupo === g).id);
  }
  function abrir(id) {
    atual = id;
    screens.forEach((s) => s.classList.toggle("on", s.id === id));
    aBox.querySelectorAll(".aba").forEach((b) => b.classList.toggle("on", b.dataset.id === id));
    history.replaceState(null, "", location.search + "#" + id);
    escalar();
  }
  function escalar() {
    const st = document.querySelector(".screen.on .stage");
    if (!st) return;
    const porAltura = embed ? innerHeight / 880 : Infinity; // no slide, a tela também precisa caber na altura
    const k = Math.min(1, st.parentElement.clientWidth / 1680, porAltura);
    st.style.setProperty("--k", k.toFixed(4));
  }
  addEventListener("resize", escalar);
  addEventListener("keydown", (e) => {
    if (embed) return;
    const i = screens.findIndex((s) => s.id === atual);
    if (e.key === "ArrowRight" && i < screens.length - 1) { const n = screens[i + 1]; abrirGrupo(n.dataset.grupo); abrir(n.id); }
    if (e.key === "ArrowLeft" && i > 0) { const n = screens[i - 1]; abrirGrupo(n.dataset.grupo); abrir(n.id); }
  });

  const alvo = screens.find((s) => s.id === location.hash.slice(1)) || screens[0];
  abrirGrupo(alvo.dataset.grupo); abrir(alvo.id);
})();
