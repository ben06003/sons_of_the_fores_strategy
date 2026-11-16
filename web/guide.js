(function () {
  "use strict";

  const DATA = window.POE_DATA;
  const NAMES = window.POE_NAMES || {};
  const G = window.POE_GUIDES;
  const id = new URLSearchParams(location.search).get("id");
  const build = DATA.builds.find((b) => b.id === id);
  const guide = G.guides[id];
  const root = document.getElementById("guide");
  const toc = document.getElementById("toc");

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));

  document.getElementById("versionBadge").textContent = `版本 ${DATA.version}`;

  if (!build || !guide) {
    root.innerHTML = `<div class="panel warn"><p>找不到這個流派的攻略。</p><p><a href="index.html">← 回到流派列表</a></p></div>`;
    return;
  }
  document.title = `${build.name}｜${build.ascendancy} 攻略`;

  // ---------- 名稱（台服 + 國際服） ----------
  function info(en) {
    const n = NAMES[en] || {};
    return { en, tw: n.tw || en, icon: n.icon || "", color: n.color || "" };
  }
  function nm(en, cls = "") {
    const n = info(en);
    const img = n.icon ? `<img src="${esc(n.icon)}" alt="" loading="lazy">` : "";
    const enPart = n.tw !== en ? `<span class="en">${esc(en)}</span>` : "";
    return `<span class="nm ${cls}">${img}<span class="tw">${esc(n.tw)}</span>${enPart}</span>`;
  }
  // 文字中的 {{English Name}} 轉成雙語名稱
  function rich(text) {
    return esc(text)
      .replace(/&lt;(\/?)b&gt;/g, "<$1b>") // 只允許 <b> 粗體
      .replace(/\{\{(.+?)\}\}/g, (_, en) => nm(en.replace(/&#39;/g, "'").replace(/&amp;/g, "&")));
  }
  const paras = (arr) => (arr || []).map((p) => `<p>${rich(p)}</p>`).join("");

  function gemChip(g) {
    let name = g, main = false, opt = false;
    if (name.startsWith("*")) { main = true; name = name.slice(1); }
    if (name.startsWith("?")) { opt = true; name = name.slice(1); }
    const n = info(name);
    const img = n.icon ? `<img src="${esc(n.icon)}" alt="" loading="lazy">` : "";
    return `<span class="gem ${main ? "main" : ""} ${opt ? "opt" : ""} ${n.color ? "c-" + n.color : ""}" title="${opt ? "可選" : ""}">
      ${img}<span class="t"><b>${esc(n.tw)}</b>${n.tw !== name ? `<span>${esc(name)}</span>` : ""}</span></span>`;
  }
  function sockets(s) {
    if (!s) return "";
    return `<span class="sockets" title="插槽顏色">${[...s].map((c) => `<span class="sock ${c}"></span>`).join("")}</span>`;
  }
  function linkGroups(groups) {
    return `<div class="links-grid">${groups.map((l) => `
      <div class="link-group">
        <header><span class="slot">${rich(l.slot || "")}${sockets(l.sockets)}</span>${l.note ? `<span class="note">${rich(l.note)}</span>` : ""}</header>
        <div class="gem-chain">${l.gems.map(gemChip).join('<span class="chain-sep"></span>')}</div>
      </div>`).join("")}</div>`;
  }

  // ---------- 區塊 ----------
  const sections = [];
  const add = (key, title, html) => sections.push({ key, title, html });

  const heroIcon = info(guide.hero).icon;
  root.innerHTML = `
    <div class="crumbs"><a href="index.html">流派列表</a> › ${esc(build.class)} › ${esc(build.ascendancy)}</div>
    <div class="hero">
      ${heroIcon ? `<img src="${esc(heroIcon)}" alt="">` : "<span></span>"}
      <div>
        <h1>${esc(build.name)}<small>${esc(guide.subtitle || "")}</small></h1>
        <div class="ratings">
          <span class="rating">刷圖<b class="r-${esc(build.mapping)}">${esc(build.mapping)}</b></span>
          <span class="rating">打王<b class="r-${esc(build.bossing)}">${esc(build.bossing)}</b></span>
          <span class="rating">總評<b class="r-${esc(build.overall)}">${esc(build.overall)}</b></span>
        </div>
      </div>
    </div>`;

  add("overview", "流派概要", `
    ${paras(guide.summary)}
    ${guide.basis ? `<div class="panel warn"><b>資料版本說明：</b>${rich(guide.basis)}</div>` : ""}
    ${G.shared.patchNote ? `<div class="panel">${rich(G.shared.patchNote)}</div>` : ""}
    <div class="pc">
      <div class="panel pros"><h4>優點</h4><ul>${(guide.pros || []).map((x) => `<li>${rich(x)}</li>`).join("")}</ul></div>
      <div class="panel cons"><h4>缺點</h4><ul>${(guide.cons || []).map((x) => `<li>${rich(x)}</li>`).join("")}</ul></div>
    </div>
    ${guide.mechanics ? `<h3>核心機制</h3>${paras(guide.mechanics)}` : ""}`);

  const asc = typeof guide.ascendancy === "string" ? G.shared[guide.ascendancy] : guide.ascendancy;
  if (asc) {
    add("ascendancy", "昇華順序", `<div class="asc-row">${asc.map((a, i) => `
      <div class="asc"><div class="n">第 ${i + 1} 次・${esc(a.lab)}</div><b>${rich(a.node)}</b><div class="n">${rich(a.note || "")}</div></div>`).join("")}</div>`);
  }

  const acts = typeof guide.acts === "string" ? G.shared[guide.acts] : guide.acts;
  if (acts) {
    add("acts", "A1～A11 章節流程・技能變更", `
      ${guide.actsIntro ? `<div class="panel tip">${rich(guide.actsIntro)}</div>` : ""}
      <div class="timeline">${acts.map((a) => {
        const sw = guide.actSwitch && guide.actSwitch[a.act];
        return `
        <div class="act">
          <div class="act-badge">${esc(a.act)}<small>Lv ${esc(a.level)}</small></div>
          <div class="act-body">
            <h3>${rich(a.title)}</h3>
            <ol>${a.steps.map((s) => `<li>${rich(s).replace(/【昇華】/g, '<span class="lab">【昇華試煉】</span>')}</li>`).join("")}</ol>
            ${a.links ? `<h3>此階段連結</h3>${linkGroups(a.links)}` : ""}
            ${a.switch ? `<div class="switch">${rich(a.switch)}</div>` : ""}
            ${sw ? `<div class="switch">${rich(sw)}</div>` : ""}
          </div>
        </div>`;
      }).join("")}</div>`);
  }

  if (guide.stages) {
    add("links", "各階段技能連結", guide.stages.map((s) => `
      <h3>${esc(s.title)} <span class="lead">｜${esc(s.when || "")}</span></h3>
      ${s.desc ? paras([s.desc]) : ""}
      ${linkGroups(s.links)}`).join("") +
      `<p class="lead">金框＝主技能；虛線＝可選。插槽顏色僅供參考，以實際裝備為準。</p>`);
  }

  if (guide.rares) {
    add("rares", "黃裝建議數值", `
      ${guide.raresIntro ? `<div class="panel tip">${rich(guide.raresIntro)}</div>` : ""}
      <div class="rare-grid">${guide.rares.map((r) => `
        <div class="rare">
          <h3><span>${esc(r.slot)}</span>${sockets(r.sockets)}</h3>
          <div class="base">底材：${(r.base || []).map((b) => nm(b)).join("、")}</div>
          <ul>${r.stats.map((s) => `<li class="${s.must ? "must" : ""}"><span class="k">${rich(s.k)}</span><span class="v">${esc(s.v || "")}</span></li>`).join("")}</ul>
          ${r.note ? `<div class="rnote">${rich(r.note)}</div>` : ""}
        </div>`).join("")}</div>
      <p class="lead">★ ＝必備詞綴。數值為「過完章節～早期輿圖」可接受的門檻，越高越好。</p>`);
  }

  if (guide.phases) {
    add("progression", "裝備進程：過完章節 → 過渡 → 終局", `<div class="phases">${guide.phases.map((p) => `
      <section class="phase">
        <header><b>${esc(p.title)}</b><span>${esc(p.when || "")}</span></header>
        <div class="pbody">
          ${paras(p.desc)}
          ${p.items ? `<table class="items-tbl"><thead><tr><th>部位</th><th>裝備</th><th>說明</th></tr></thead><tbody>
            ${p.items.map((it) => `<tr><td>${esc(it.slot)}</td><td class="${it.rare ? "r" : "u"}">${it.rare ? esc(it.name) : nm(it.name)}</td><td>${rich(it.why || "")}</td></tr>`).join("")}
          </tbody></table>` : ""}
          ${p.links ? `<h3>技能連結</h3>${linkGroups(p.links)}` : ""}
        </div>
      </section>`).join("")}</div>`);
  }

  if (guide.sources) {
    add("sources", "參考來源", `<ul class="src-list">${guide.sources.map((s) => `
      <li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>${s.note ? `　<span class="lead">${esc(s.note)}</span>` : ""}<span class="url">${esc(s.url)}</span></li>`).join("")}</ul>`);
  }

  root.insertAdjacentHTML("beforeend", sections.map((s) => `<section id="${s.key}"><h2>${esc(s.title)}</h2>${s.html}</section>`).join(""));
  toc.innerHTML = sections.map((s) => `<a href="#${s.key}">${esc(s.title)}</a>`).join("");

  // 目錄高亮
  const links = [...toc.querySelectorAll("a")];
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  sections.forEach((s) => obs.observe(document.getElementById(s.key)));

  document.getElementById("footer").innerHTML = `
    <p>名稱格式：台服名稱＋<span style="opacity:.7">國際服英文</span>；圖示來源 poedb.tw。內容整理自各來源作者的 POB 與影片說明，數值僅供參考。</p>
    <p><a href="index.html">← 回到流派列表</a></p>`;
})();
