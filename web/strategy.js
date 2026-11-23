(function () {
  "use strict";

  const S = window.POE_STRATEGIES;
  const root = document.getElementById("guide");
  const toc = document.getElementById("toc");

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
  // 資料為手寫可信內容，允許 <b> 標籤
  const rich = (s) => esc(s).replace(/&lt;(\/?)b&gt;/g, "<$1b>");
  const paras = (arr) => (arr || []).map((p) => `<p>${rich(p)}</p>`).join("");
  const list = (arr) => `<ul>${(arr || []).map((x) => `<li>${rich(x)}</li>`).join("")}</ul>`;
  const srcList = (arr) => `<ul class="src-list">${arr.map((s) => `
    <li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>${s.note ? `　<span class="lead">${esc(s.note)}</span>` : ""}<span class="url">${esc(s.url)}</span></li>`).join("")}</ul>`;

  document.getElementById("versionBadge").textContent = `版本 ${S.version}`;
  document.title = `${S.title}｜POE 流派攻略`;

  const sections = [];
  const add = (key, title, html) => sections.push({ key, title, html });

  root.innerHTML = `
    <div class="crumbs"><a href="index.html">流派列表</a> › 策略攻略</div>
    <div class="hero noicon"><div><h1>${esc(S.title)}<small>${esc(S.subtitle)}</small></h1>
      <div class="ratings"><span class="rating">整理日期<b>${esc(S.updated)}</b></span><span class="rating">策略數<b>${S.strategies.length}</b></span></div></div></div>`;

  add("overview", "概要", `${paras(S.intro)}<div class="panel warn"><b>注意：</b>${rich(S.warning)}</div>`);

  add("changes", "3.30 輿圖系統變更", `<table class="items-tbl strat-tbl"><tbody>
    ${S.changes.map((c) => `<tr><td>${esc(c.k)}</td><td>${rich(c.v)}</td></tr>`).join("")}</tbody></table>`);

  const P = S.progression;
  add("progression", P.title, `
    <div class="panel tip">${rich(P.intro)}<br><span class="lead">來源：${esc(P.source)}</span></div>
    <p><b>地圖：</b>${rich(P.maps)}</p>
    <div class="timeline">${P.steps.map((st, i) => `
      <div class="act"><div class="act-badge">${i + 1}</div>
        <div class="act-body"><h3>${rich(st.t)}</h3><p>${rich(st.d)}</p></div></div>`).join("")}</div>
    <h3>小提醒</h3>${list(P.tips)}`);

  add("compare", "策略總覽", `<div class="tbl-scroll"><table class="items-tbl strat-tbl"><thead><tr><th>策略</th><th>機制</th><th>難度</th><th>投入</th><th>SSF</th></tr></thead><tbody>
    ${S.strategies.map((s) => `<tr><td><a href="#s-${esc(s.id)}">${esc(s.name)}</a></td><td>${s.mechanics.map(esc).join("、")}</td><td>${esc(s.difficulty)}</td><td>${esc(s.investment)}</td><td>${esc(s.ssf)}</td></tr>`).join("")}
  </tbody></table></div>`);

  add("strategies", "刷錢策略", `<div class="phases">${S.strategies.map((s) => `
    <section class="phase" id="s-${esc(s.id)}">
      <header><b>${esc(s.name)}</b><span>${s.mechanics.map(esc).join("・")}｜難度 ${esc(s.difficulty)}｜投入 ${esc(s.investment)}</span></header>
      <div class="pbody">
        <p>${rich(s.summary)}</p>
        <table class="items-tbl strat-tbl"><tbody>
          <tr><td>地圖</td><td>${rich(s.maps)}</td></tr>
          <tr><td>輿圖天賦</td><td>${list(s.nodes)}</td></tr>
          <tr><td>絲線</td><td>${rich(s.threads)}</td></tr>
          <tr><td>SSF</td><td>${esc(s.ssf)}</td></tr>
        </tbody></table>
        <h3>步驟</h3><ol>${s.steps.map((x) => `<li>${rich(x)}</li>`).join("")}</ol>
        <div class="panel"><b>收益：</b>${rich(s.returns)}</div>
        <div class="pc">
          <div class="panel pros"><h4>優點</h4>${list(s.pros)}</div>
          <div class="panel cons"><h4>缺點</h4>${list(s.cons)}</div>
        </div>
        ${s.source ? `<p class="lead">原文：<a href="${esc(s.source)}" target="_blank" rel="noopener noreferrer">${esc(s.source)}</a></p>` : ""}
      </div>
    </section>`).join("")}</div>`);

  add("ssf", S.ssf.title, `<div class="panel tip">${rich(S.ssf.intro)}</div>${list(S.ssf.tips)}
    <p><a href="guide.html?id=${encodeURIComponent("聖堂武僧-聖宗-魔力流-咒術枯萎")}">→ 魔幻咒術枯萎聖宗攻略</a></p>`);

  add("videos", "影片", srcList(S.videos));
  add("sources", "參考來源", srcList(S.sources));

  root.insertAdjacentHTML("beforeend", sections.map((s) => `<section id="${s.key}"><h2>${esc(s.title)}</h2>${s.html}</section>`).join(""));
  toc.innerHTML = sections.map((s) => `<a href="#${s.key}">${esc(s.title)}</a>`).join("");

  const links = [...toc.querySelectorAll("a")];
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  sections.forEach((s) => obs.observe(document.getElementById(s.key)));

  document.getElementById("footer").innerHTML = `
    <p>內容整理自各來源攻略，收益數字多為作者自述，僅供參考。輿圖天賦等名詞台服譯名未統一，保留國際服英文。</p>
    <p><a href="index.html">← 回到流派列表</a></p>`;
})();
