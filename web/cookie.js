(function () {
  "use strict";

  const C = window.COOKIE_GUIDE;
  const root = document.getElementById("guide");
  const toc = document.getElementById("toc");

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
  // 資料為手寫可信內容，允許 <b> 標籤
  const rich = (s) => esc(s).replace(/&lt;(\/?)b&gt;/g, "<$1b>");
  const list = (arr) => `<ul>${(arr || []).map((x) => `<li>${rich(x)}</li>`).join("")}</ul>`;
  // 影片時間 "m:ss" → 秒，用於跳轉連結
  const secs = (t) => t.split(":").reduce((a, b) => a * 60 + Number(b), 0);
  const shot = (src, alt) => `<a class="shot" href="${esc(src)}" target="_blank" rel="noopener"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" /></a>`;

  document.title = C.title;

  const sections = [];
  const add = (key, title, html) => sections.push({ key, title, html });

  root.innerHTML = `
    <div class="hero noicon"><div><h1>${esc(C.title)}<small>${esc(C.subtitle)}</small></h1>
      <div class="ratings"><span class="rating">整理日期<b>${esc(C.updated)}</b></span><span class="rating">副本數<b>${C.dungeons.length}</b></span></div></div></div>`;

  add("overview", "每日副本概要",`${C.intro.map((p) => `<p>${rich(p)}</p>`).join("")}
    <p>${rich(C.summary)}</p>
    <div class="panel warn"><b>注意：</b>${rich(C.warning)}</div>`);

  add("summary", "副本總覽", `<div class="tbl-scroll"><table class="items-tbl strat-tbl"><thead><tr><th>副本</th><th>首領</th><th>首領屬性</th><th>弱點</th><th>關卡</th><th>戰鬥力</th></tr></thead><tbody>
    ${C.dungeons.map((d) => `<tr><td><a href="#d-${esc(d.id)}">${esc(d.name)}</a></td><td>${esc(d.boss)}</td><td>${esc(d.element)}</td><td>${esc(d.weak)}</td><td>${esc(d.stage)}</td><td>${esc(d.power)}</td></tr>`).join("")}
  </tbody></table></div>`);

  add("runes", "核心餅乾與糖符文", `<div class="phases">${C.cores.map((c) => `
    <section class="phase">
      <header><b>${esc(c.name)}</b><span>${esc(c.tag)}｜${esc(c.meta)}</span></header>
      <div class="pbody cookie-row">
        <div>
          <table class="items-tbl strat-tbl"><tbody>
            <tr><td>糖符文</td><td>${rich(c.rune)}</td></tr>
            <tr><td>技能</td><td>${rich(c.skill)}</td></tr>
          </tbody></table>
          <div class="panel tip">${rich(c.note)}</div>
        </div>
        ${c.img ? shot(c.img, `${c.name} 糖符文`) : ""}
      </div>
    </section>`).join("")}</div>
    <h3>技能說明截圖</h3>${shot(C.skillsImg, "貝果、海妖、好莓技能說明")}`);

  add("lineups", "每日副本陣容", `<div class="phases">${C.dungeons.map((d) => `
    <section class="phase" id="d-${esc(d.id)}">
      <header><b>${esc(d.name)}</b><span>${esc(d.boss)}｜${esc(d.element)}屬性・弱點${esc(d.weak)}｜第 ${esc(d.stage)} 關｜戰鬥力 ${esc(d.power)}</span></header>
      <div class="pbody cookie-row lineup">
        <div>
          ${list(d.notes)}
          <p class="lead"><a href="${esc(C.video.url)}&t=${secs(d.at)}s" target="_blank" rel="noopener noreferrer">▶ 影片 ${esc(d.at)} 看實戰</a></p>
        </div>
        ${shot(d.img, `${d.name} 陣容`)}
      </div>
    </section>`).join("")}</div>`);

  const G = C.guild;
  add("guild", "公會討伐戰", `
    <p>${rich(G.intro)}</p>
    <table class="items-tbl strat-tbl"><tbody>
      <tr><td>首領</td><td>${esc(G.boss)}（${esc(G.element)}屬性・弱點${esc(G.weak)}）</td></tr>
      <tr><td>戰鬥力</td><td>${esc(G.power)}</td></tr>
      <tr><td>作者傷害</td><td>${esc(G.damage)}</td></tr>
    </tbody></table>
    <h3>陣容</h3>${shot(G.img, "公會討伐戰陣容")}
    <h3>12 隻餅乾的糖符文</h3>
    <div class="tbl-scroll"><table class="items-tbl strat-tbl"><thead><tr><th>餅乾</th><th>糖符文</th><th>備註</th></tr></thead><tbody>
      ${G.members.map((m) => `<tr><td>${esc(m.name)}</td><td>${rich(m.rune)}</td><td>${rich(m.note)}</td></tr>`).join("")}
    </tbody></table></div>
    <h3>月光魔法師的重點</h3>
    <div class="cookie-row"><div>${list(G.tips)}</div>${shot(G.skillImg, "月光魔法師技能：新月祝福")}</div>
    <h3>裝備副屬性</h3>
    <table class="items-tbl strat-tbl"><tbody>${G.equipment.map((e) => `<tr><td>${esc(e.k)}</td><td>${rich(e.v)}</td></tr>`).join("")}</tbody></table>
    <h3>卡片與傭兵團</h3>${list(G.cards)}`);

  const R = C.crumble;
  add("crumble", "碎屑爭奪戰（新活動）", `
    <p>${rich(R.intro)}</p>
    <div class="phases">${R.sections.map((x) => `
      <section class="phase">
        <header><b>${esc(x.t)}</b></header>
        <div class="pbody ${x.img ? "cookie-row" : ""}"><div>${list(x.items)}</div>${x.img ? shot(x.img, x.t) : ""}</div>
      </section>`).join("")}</div>
    <div class="panel warn">${rich(R.review)}</div>`);

  const vids = [C.video, G.video, R.video];
  add("sources", "來源", `<ul class="src-list">${vids.map((v) => `<li><a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">${esc(v.label)}</a>　<span class="lead">${esc(v.author)}・${esc(v.date)}</span><span class="url">${esc(v.url)}</span></li>`).join("")}</ul>`);

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
    <p>內容與截圖整理自 ${esc(C.video.author)} 的影片，版權屬原作者與遊戲公司。每日副本陣容中的餅乾名稱僅標註影片中有點開的角色。</p>
    <p><a href="index.html">← 回到首頁</a></p>`;
})();
