# POE 流派攻略

流亡黯道（Path of Exile）流派攻略靜態網站，可依職業、昇華、流派、標籤、評價搜尋，並附上表格中的所有教學／POB 超連結。

資料來源：[3.30開荒表格](https://docs.google.com/spreadsheets/d/1wggB29XhxQLtSuHn1DlF4rGgkhnrxKUU_pSWAO0-3L8/edit?gid=1998218776)（作者：蛋捲）

## 使用

網站檔案都在 `web/`，純靜態，直接用瀏覽器開啟 `web/index.html` 即可（不需伺服器）。推到 `main` 後由 `.github/workflows/pages.yml` 自動把 `web/` 發佈到 GitHub Pages。

- 搜尋框支援多個關鍵字（空白分隔），按 `/` 快速聚焦
- 點卡片開啟詳細資訊，網址會變成 `#/b/<id>`，可直接分享

## 流派詳細攻略（guide.html）

目前已完成聖宗「魔力流」4 個流派：咒術枯萎、冰霜新星．寒冰彈、天雷之珠．軌跡、閃電新星．行進。
每篇包含：流派概要、昇華順序、A1～A11 章節流程與技能變更、各階段技能連結、黃裝建議數值、裝備進程（過完章節 → 過渡 → 終局）、參考來源。

- 內容寫在 `web/data/guides.js`；文字中的 `{{English Name}}` 會自動顯示成「台服名稱＋國際服英文＋圖示」
- 對照表 `web/data/names.js`、圖示 `web/assets/icons/` 由 `scripts/twnames.py` + `scripts/build_names.py tw.json web` 從 poedb.tw 產生
- `scripts/pobdecode.py`、`scripts/pobcompact.py` 可解碼 POB 匯出碼，方便整理技能組與裝備

## 輿圖策略攻略（web/strategy.html）

3.30 輿圖系統變更、開荒推圖流程（拿滿 4 顆虛空石）、8 種刷錢策略（含天賦、絲線、步驟、收益、SSF 適用度）與參考來源。內容寫在 `web/data/strategies.js`，收益多為來源作者自述。

## 更新資料

試算表更新後執行：

```bash
python scripts/sync_sheet.py
```

腳本會下載試算表 HTML、展開合併儲存格、解析超連結（還原 Google 轉址並去除 YouTube `si` 追蹤參數），輸出 `web/data/builds.js`。版本號取自試算表標題。

## 檔案結構

| 檔案 | 說明 |
| --- | --- |
| `web/index.html` | 流派列表頁 |
| `web/guide.html` | 流派詳細攻略頁 |
| `web/styles.css`、`web/guide.css` | 樣式 |
| `web/app.js` | 搜尋、篩選、詳細頁邏輯 |
| `web/guide.js` | 攻略頁渲染 |
| `web/data/builds.js` | 流派資料（自動產生） |
| `web/data/guides.js` | 4 個流派的攻略內容 |
| `web/strategy.html`、`web/strategy.js`、`web/data/strategies.js` | 輿圖策略攻略頁 |
| `web/data/visible.js` | 顯示白名單：只列出陣列中的流派 id，清空即顯示全部 |
| `web/data/names.js`、`web/assets/icons/` | 台服／國際服名稱對照與圖示（自動產生） |
| `scripts/` | 試算表同步、名稱對照、POB 解碼腳本 |
| `.github/workflows/pages.yml` | GitHub Pages 部署 |
