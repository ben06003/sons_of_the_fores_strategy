"""從 Google 試算表同步流派資料到 data/builds.js（含儲存格超連結）。

用法：
    python scripts/sync_sheet.py            # 直接從 Google 下載
    python scripts/sync_sheet.py sheet.html # 使用本機已下載的 htmlview 檔
"""
import html
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

SHEET_ID = "1wggB29XhxQLtSuHn1DlF4rGgkhnrxKUU_pSWAO0-3L8"
GID = "1998218776"
EDIT_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit?gid={GID}"
HTML_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/htmlview/sheet?headers=true&gid={GID}"
TITLE_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/htmlview"
OUT = Path(__file__).resolve().parent.parent / "web" / "data" / "builds.js"

TAGS = {
    "🏹": "弓流派", "🔪": "近戰", "💪": "坦克", "🔮": "直擊法術",
    "💎": "綁傳奇", "🩸": "持續", "👻": "召喚", "💣": "陷阱地雷",
    "🤡": "搞耍", "🗿": "圖騰", "🎇": "華麗",
}
URL_RE = re.compile(r"https?://[^\s<>\"'，、]+")


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8")


def real_url(href):
    href = html.unescape(href)
    p = urllib.parse.urlparse(href)
    if p.netloc.endswith("google.com") and p.path == "/url":
        href = urllib.parse.parse_qs(p.query).get("q", [href])[0]
    # 去掉 YouTube 分享追蹤參數
    href = re.sub(r"([?&])si=[^&]*&?", r"\1", href).rstrip("?&")
    return href


def clean_text(cell_html):
    t = re.sub(r"<br\s*/?>", "\n", cell_html)
    t = html.unescape(re.sub(r"<[^>]+>", "", t)).replace(" ", " ")
    lines = [re.sub(r"[ \t　]+", " ", l).strip() for l in t.split("\n")]
    return "\n".join(l for l in lines if l)


def parse_cell(cell_html):
    links = []
    for href, label in re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', cell_html, re.S):
        links.append({"label": clean_text(label), "url": real_url(href)})
    text = clean_text(cell_html)
    seen = {l["url"] for l in links}
    for u in URL_RE.findall(text):
        u = real_url(u)
        if u not in seen:
            links.append({"label": u, "url": u})
            seen.add(u)
    return text, links


def parse_grid(page):
    """展開 rowspan/colspan，回傳 [[(text, links), ...], ...]"""
    table = re.search(r"<table[^>]*>(.*?)</table>", page, re.S).group(1)
    rows = re.findall(r"<tr[^>]*>(.*?)</tr>", table, re.S)
    grid, pending = [], {}  # pending[col] = [remaining_rows, cell]
    for row in rows:
        cells = re.findall(r"<t([dh])([^>]*)>(.*?)</t[dh]>", row, re.S)
        out, col, it = [], 0, iter(cells)
        while True:
            if col in pending:
                pending[col][0] -= 1
                out.append(pending[col][1])
                if pending[col][0] == 0:
                    del pending[col]
                col += 1
                continue
            try:
                _, attrs, body = next(it)
            except StopIteration:
                break
            rs = int((re.search(r'rowspan="(\d+)"', attrs) or [0, 1])[1])
            cs = int((re.search(r'colspan="(\d+)"', attrs) or [0, 1])[1])
            cell = parse_cell(body)
            for k in range(cs):
                out.append(cell)
                if rs > 1:
                    pending[col + k] = [rs - 1, cell]
            col += cs
        grid.append(out)
    return grid


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    page = open(sys.argv[1], encoding="utf-8").read() if len(sys.argv) > 1 else fetch(HTML_URL)
    try:
        title = re.search(r"<title>(.*?)</title>", fetch(TITLE_URL)).group(1).split(" - ")[0]
    except Exception:
        title = "3.30開荒表格"
    version = (re.search(r"\d+\.\d+", title) or [""])[0]

    grid = parse_grid(page)
    header_idx = next(i for i, r in enumerate(grid) if any(c[0] == "流派" for c in r))
    header = [c[0].strip() for c in grid[header_idx]]
    idx = {name: header.index(name) for name in ["角色", "昇華", "流派", "標籤", "刷圖", "打王", "總評", "備註", "教學連結", "評價"]}
    notice = next((c[0] for c in grid[header_idx - 1] if "服用須知" in c[0]), "") if header_idx else ""

    builds, used_ids, footnotes = [], set(), []
    for r in grid[header_idx + 1:]:
        get = lambda k: r[idx[k]] if idx[k] < len(r) else ("", [])
        name = get("流派")[0].replace("\n", " ").strip()
        if not name:
            continue
        if get("角色") is get("流派"):  # 整列合併 = 表格附註
            if name not in footnotes:
                footnotes.append(name)
            continue
        cls = re.sub(r"\s+", "", get("角色")[0])
        asc = re.sub(r"\s+", "", get("昇華")[0])
        tags = [e for e in TAGS if e in get("標籤")[0]]
        guide_text, guide_links = get("教學連結")
        review_text, review_links = get("評價")
        base = f"{cls}-{asc}-{name}"
        bid, n = base, 2
        while bid in used_ids:
            bid, n = f"{base}-{n}", n + 1
        used_ids.add(bid)
        builds.append({
            "id": bid,
            "version": version,
            "class": cls,
            "ascendancy": asc,
            "name": name,
            "tags": tags,
            "mapping": get("刷圖")[0].strip(),
            "bossing": get("打王")[0].strip(),
            "overall": get("總評")[0].strip(),
            "remark": get("備註")[0],
            "guideText": guide_text,
            "guides": guide_links,
            "review": review_text,
            "reviewLinks": review_links,
        })

    data = {
        "version": version,
        "source": {"title": title, "author": "蛋捲", "url": EDIT_URL, "notice": notice, "footnotes": footnotes},
        "tags": TAGS,
        "builds": builds,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        "// 由 scripts/sync_sheet.py 自動產生，請勿手動編輯\n"
        f"// 資料來源：{title}（作者：蛋捲） {EDIT_URL}\n"
        "window.POE_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"已寫入 {len(builds)} 個流派 → {OUT}")


if __name__ == "__main__":
    main()
