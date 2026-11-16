(function () {
  "use strict";

  const DATA = window.POE_DATA;
  const builds = DATA.builds;
  const TAGS = DATA.tags;
  const RANK = { "強": 3, "中": 2, "中下": 1 };
  const GUIDES = (window.POE_GUIDES && window.POE_GUIDES.guides) || {};
  const guideUrl = (id) => `guide.html?id=${encodeURIComponent(id)}`;

  const $ = (id) => document.getElementById(id);
  const els = {
    q: $("q"), version: $("fVersion"), cls: $("fClass"), asc: $("fAsc"),
    tag: $("fTag"), overall: $("fOverall"), sort: $("fSort"), reset: $("reset"),
    list: $("list"), count: $("count"), dialog: $("detail"), body: $("detailBody"),
  };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
  const uniq = (arr) => [...new Set(arr.filter(Boolean))];
  const norm = (s) => String(s ?? "").toLowerCase().replace(/[\s．・·.\-（）()]/g, "");

  // ---------- 初始化 ----------
  $("versionBadge").textContent = `版本 ${DATA.version}`;
  document.title = `POE ${DATA.version} 流派攻略`;

  function fillSelect(sel, values, allLabel, labelFn = (v) => v) {
    const cur = sel.value;
    sel.innerHTML = `<option value="">${allLabel}</option>` +
      values.map((v) => `<option value="${esc(v)}">${esc(labelFn(v))}</option>`).join("");
    if (values.includes(cur)) sel.value = cur;
  }

  fillSelect(els.version, uniq(builds.map((b) => b.version)), "全部");
  els.version.value = DATA.version;
  fillSelect(els.cls, uniq(builds.map((b) => b.class)), "全部職業");
  fillSelect(els.tag, Object.keys(TAGS), "全部標籤", (k) => `${k} ${TAGS[k]}`);
  fillSelect(els.overall, ["強", "中", "中下", "-"].filter((v) => builds.some((b) => b.overall === v)), "全部");
  updateAscOptions();

  function updateAscOptions() {
    const pool = els.cls.value ? builds.filter((b) => b.class === els.cls.value) : builds;
    fillSelect(els.asc, uniq(pool.map((b) => b.ascendancy)), "全部昇華");
  }

  // ---------- 搜尋 ----------
  const searchIndex = new Map(builds.map((b) => [b.id, norm([
    b.class, b.ascendancy, b.name, b.remark, b.guideText, b.review,
    b.tags.map((t) => TAGS[t]).join(" "),
    b.guides.map((g) => g.label).join(" "),
  ].join(" "))]));

  function filtered() {
    const terms = els.q.value.trim().split(/\s+/).map(norm).filter(Boolean);
    let res = builds.filter((b) =>
      (!els.version.value || b.version === els.version.value) &&
      (!els.cls.value || b.class === els.cls.value) &&
      (!els.asc.value || b.ascendancy === els.asc.value) &&
      (!els.tag.value || b.tags.includes(els.tag.value)) &&
      (!els.overall.value || b.overall === els.overall.value) &&
      terms.every((t) => searchIndex.get(b.id).includes(t))
    );
    if (els.sort.value === "overall") {
      const score = (b) => (RANK[b.overall] || 0) * 100 + (RANK[b.bossing] || 0) * 10 + (RANK[b.mapping] || 0);
      res = [...res].sort((a, b) => score(b) - score(a));
    }
    return res;
  }

  function highlight(text) {
    const terms = els.q.value.trim().split(/\s+/).filter(Boolean)
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const safe = esc(text);
    if (!terms.length) return safe;
    return safe.replace(new RegExp(`(${terms.map(esc).join("|")})`, "gi"), "<mark>$1</mark>");
  }

  const ratingClass = (v) => `r-${esc(v || "none")}`;
  const ratingChip = (label, v) =>
    `<span class="rating">${label}<b class="${ratingClass(v)}">${esc(v || "—")}</b></span>`;
  const tagChips = (tags) => tags.map((t) => `<span class="tag" title="${esc(TAGS[t])}">${t} ${esc(TAGS[t])}</span>`).join("");

  // ---------- 列表 ----------
  function render() {
    const res = filtered();
    els.count.textContent = `共 ${res.length} 個流派（總計 ${builds.length}）`;
    if (!res.length) {
      els.list.innerHTML = `<p class="empty">找不到符合的流派，試試其他關鍵字或清除篩選。</p>`;
      return;
    }
    els.list.innerHTML = res.map((b) => {
      const links = b.guides.length + b.reviewLinks.length;
      return `
      <button type="button" class="card" data-id="${esc(b.id)}">
        <div class="card-meta">${highlight(b.class)} <span aria-hidden="true">›</span> ${highlight(b.ascendancy)}</div>
        <h2>${highlight(b.name)}</h2>
        ${b.tags.length ? `<div class="card-meta">${tagChips(b.tags)}</div>` : ""}
        ${b.remark ? `<p class="remark">${highlight(b.remark)}</p>` : ""}
        <div class="ratings">
          ${ratingChip("刷圖", b.mapping)}${ratingChip("打王", b.bossing)}${ratingChip("總評", b.overall)}
          ${links ? `<span class="rating link-count" title="超連結數">🔗 ${links}</span>` : ""}
          ${GUIDES[b.id] ? `<span class="rating has-guide" title="有完整攻略">📖 攻略</span>` : ""}
        </div>
      </button>`;
    }).join("");
  }

  // ---------- 詳細頁 ----------
  // 把文字中出現的連結標籤換成 <a>，沒對到的連結附在後面
  function linkify(text, links) {
    let html = esc(text);
    const rest = [];
    [...links].sort((a, b) => b.label.length - a.label.length).forEach((l) => {
      const label = esc(l.label);
      const a = `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      if (label && html.includes(label) && !html.includes(`>${label}</a>`)) {
        html = html.replace(label, a);
      } else {
        rest.push(`<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label || l.url)}</a>`);
      }
    });
    if (rest.length) html += (html ? "<br>" : "") + rest.join("<br>");
    return html;
  }

  function linkList(links) {
    if (!links.length) return "";
    return `<ul class="link-list">${links.map((l) =>
      `<li><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>
       <span class="url">${esc(l.url)}</span></li>`).join("")}</ul>`;
  }

  function section(title, inner) {
    return `<h3>${title}</h3>${inner || `<p class="none">（表格未提供）</p>`}`;
  }

  function openDetail(id) {
    const b = builds.find((x) => x.id === id);
    if (!b) return;
    const allLinks = [...b.guides, ...b.reviewLinks];
    els.body.innerHTML = `
      <div class="card-meta">${esc(b.class)} › ${esc(b.ascendancy)} · 版本 ${esc(b.version)}</div>
      <h2>${esc(b.name)}</h2>
      ${b.tags.length ? `<div class="card-meta">${tagChips(b.tags)}</div>` : ""}
      ${GUIDES[b.id] ? `<a class="guide-btn" href="${guideUrl(b.id)}">📖 完整攻略：章節流程・黃裝數值・裝備進程</a>` : ""}
      ${section("評分", `<div class="rating-table">
        <div><span>刷圖</span><b class="${ratingClass(b.mapping)}">${esc(b.mapping || "—")}</b></div>
        <div><span>打王</span><b class="${ratingClass(b.bossing)}">${esc(b.bossing || "—")}</b></div>
        <div><span>總評</span><b class="${ratingClass(b.overall)}">${esc(b.overall || "—")}</b></div>
      </div>`)}
      ${section("備註", b.remark && `<p>${esc(b.remark)}</p>`)}
      ${section("教學連結", (b.guideText || b.guides.length) && `<p>${linkify(b.guideText, b.guides)}</p>`)}
      ${section("評價", (b.review || b.reviewLinks.length) && `<p>${linkify(b.review, b.reviewLinks)}</p>`)}
      ${allLinks.length ? section(`所有超連結（${allLinks.length}）`, linkList(allLinks)) : ""}
    `;
    if (!els.dialog.open) els.dialog.showModal();
    els.dialog.scrollTop = 0;
  }

  // ---------- 網址狀態 ----------
  function syncHash() {
    const m = location.hash.match(/^#\/b\/(.+)$/);
    if (m) openDetail(decodeURIComponent(m[1]));
    else if (els.dialog.open) els.dialog.close();
  }

  els.list.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) location.hash = `#/b/${encodeURIComponent(card.dataset.id)}`;
  });
  els.dialog.addEventListener("close", () => {
    if (location.hash.startsWith("#/b/")) history.replaceState(null, "", location.pathname + location.search);
  });
  els.dialog.addEventListener("click", (e) => { if (e.target === els.dialog) els.dialog.close(); });
  $("closeDetail").addEventListener("click", () => els.dialog.close());
  window.addEventListener("hashchange", syncHash);

  els.cls.addEventListener("change", () => { updateAscOptions(); render(); });
  [els.version, els.asc, els.tag, els.overall, els.sort].forEach((s) => s.addEventListener("change", render));
  // 讓搜尋也能用技能英文名（如 Hexblast）找到有攻略的流派
  Object.entries(GUIDES).forEach(([id, g]) => {
    if (searchIndex.has(id)) searchIndex.set(id, searchIndex.get(id) + norm(`${g.subtitle || ""} ${g.hero || ""}`));
  });
  els.q.addEventListener("input", render);
  els.reset.addEventListener("click", () => {
    els.q.value = ""; els.cls.value = ""; els.tag.value = ""; els.overall.value = "";
    els.sort.value = ""; els.version.value = DATA.version;
    updateAscOptions(); els.asc.value = ""; render(); els.q.focus();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== els.q && !els.dialog.open) { e.preventDefault(); els.q.focus(); }
  });

  // ---------- 頁尾 ----------
  const src = DATA.source;
  $("footer").innerHTML = `
    ${src.notice ? `<p class="notice">${esc(src.notice)}</p>` : ""}
    ${(src.footnotes || []).map((f) => `<p>※ ${esc(f)}</p>`).join("")}
    <p>資料來源：<a href="${esc(src.url)}" target="_blank" rel="noopener noreferrer">${esc(src.title)}</a>（作者：${esc(src.author)}）。本站僅整理呈現，評價內容皆屬原作者個人看法。</p>
  `;

  render();
  syncHash();
})();
