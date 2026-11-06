// 森林之子 合成指南書 — WinForms 桌面程式（C# 5 / .NET Framework 4）
using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using System.Windows.Forms;

class TabDef { public string Key, Label, Glyph; public Color Color; }
class Entry { public string Tab, N, E, D; public List<string> M = new List<string>(); public string Id { get { return Tab + ":" + E; } } }
class GuideSec { public string T, Diagram; public List<string> Items = new List<string>(); }
class IdxItem { public string Label, Sub; public Page Target; }
enum PK { Index, Detail, Guide, Empty }
class Page { public PK Kind; public string Title, Sub; public List<IdxItem> Rows; public Entry Entry; public GuideSec Guide; public int BackIdx; }
class Hit { public RectangleF R; public Action A; }

static class Program
{
    [DllImport("user32.dll")] static extern bool SetProcessDPIAware();
    [STAThread]
    static void Main()
    {
        try { SetProcessDPIAware(); } catch { }
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new BookForm());
    }
}

class BookForm : Form
{
    const string FontUI = "Microsoft JhengHei UI";
    const string FontEmoji = "Segoe UI Emoji";
    const int ROWS = 10;

    static readonly Color PageCol = Color.FromArgb(239, 234, 240);
    static readonly Color Ink = Color.FromArgb(58, 52, 60);
    static readonly Color Muted = Color.FromArgb(140, 130, 142);
    static readonly Color Rule = Color.FromArgb(205, 190, 202);
    static readonly Color Pink = Color.FromArgb(232, 168, 181);
    static readonly Color PinkInk = Color.FromArgb(84, 44, 56);

    List<TabDef> tabs = new List<TabDef>();
    List<Entry> entries = new List<Entry>();
    List<GuideSec> help = new List<GuideSec>();
    List<GuideSec> howto = new List<GuideSec>();
    string sources = "";
    HashSet<string> favs = new HashSet<string>();
    string favFile;

    string tab = "help", prevTab = "help";
    List<Page> pages = new List<Page>();
    int pageIdx;

    TextBox search;
    float d = 1f;
    RectangleF pageR;
    Dictionary<string, RectangleF> tabRects = new Dictionary<string, RectangleF>();
    List<Hit> lastHits = new List<Hit>();
    Dictionary<string, Font> fonts = new Dictionary<string, Font>();

    Timer anim;
    Bitmap animUnder, animOver;
    bool animForward, animating;
    DateTime animStart;
    const double AnimMs = 300;

    public BookForm()
    {
        LoadData();
        SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer | ControlStyles.ResizeRedraw, true);
        DoubleBuffered = true;
        KeyPreview = true;
        Text = "森林之子 指南書";
        BackColor = Color.FromArgb(22, 32, 26);
        using (Graphics g = CreateGraphics()) d = g.DpiX / 96f;
        Rectangle wa = Screen.PrimaryScreen.WorkingArea;
        int h = (int)Math.Min(940 * d, wa.Height * 0.94);
        int w = (int)Math.Min(h * 0.86, wa.Width * 0.95);
        ClientSize = new Size(w, h);
        MinimumSize = new Size((int)(560 * d), (int)(640 * d));
        StartPosition = FormStartPosition.CenterScreen;
        Icon = MakeIcon();

        search = new TextBox();
        search.Font = new Font(FontUI, 11f);
        search.BorderStyle = BorderStyle.FixedSingle;
        search.BackColor = Color.FromArgb(239, 234, 240);
        search.TextChanged += delegate { OnSearch(); };
        Controls.Add(search);
        SendMessage(search.Handle, 0x1501, (IntPtr)1, "搜尋（例：繩子、骨頭、斜撐）");

        anim = new Timer();
        anim.Interval = 15;
        anim.Tick += delegate { Invalidate(); };

        pages = Build(tab);
        DoLayout();
    }

    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    static extern IntPtr SendMessage(IntPtr h, int msg, IntPtr w, string l);

    // ---------- 資料 ----------
    void LoadData()
    {
        string json;
        using (Stream s = typeof(BookForm).Assembly.GetManifestResourceStream("craft.json"))
        using (StreamReader r = new StreamReader(s, Encoding.UTF8)) json = r.ReadToEnd();
        JavaScriptSerializer ser = new JavaScriptSerializer();
        ser.MaxJsonLength = int.MaxValue;
        Dictionary<string, object> root = ser.Deserialize<Dictionary<string, object>>(json);
        foreach (object o in (IEnumerable)root["tabs"])
        {
            Dictionary<string, object> t = (Dictionary<string, object>)o;
            tabs.Add(new TabDef { Key = S(t, "key"), Label = S(t, "label"), Glyph = S(t, "glyph"), Color = ColorTranslator.FromHtml(S(t, "color")) });
        }
        LoadGuides(root, "help", help);
        LoadGuides(root, "howto", howto);
        foreach (object o in (IEnumerable)root["items"])
        {
            Dictionary<string, object> t = (Dictionary<string, object>)o;
            Entry e = new Entry { Tab = S(t, "tab"), N = S(t, "n"), E = S(t, "e"), D = S(t, "d") };
            if (t.ContainsKey("m")) foreach (object m in (IEnumerable)t["m"]) e.M.Add(m.ToString());
            entries.Add(e);
        }
        sources = S(root, "sources");

        string dir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "SotfGuide");
        favFile = Path.Combine(dir, "favs.txt");
        try { if (File.Exists(favFile)) foreach (string l in File.ReadAllLines(favFile, Encoding.UTF8)) if (l.Trim() != "") favs.Add(l.Trim()); } catch { }
    }
    static void LoadGuides(Dictionary<string, object> root, string key, List<GuideSec> list)
    {
        if (!root.ContainsKey(key)) return;
        foreach (object o in (IEnumerable)root[key])
        {
            Dictionary<string, object> t = (Dictionary<string, object>)o;
            GuideSec g = new GuideSec { T = S(t, "t"), Diagram = S(t, "diagram") };
            foreach (object i in (IEnumerable)t["items"]) g.Items.Add(i.ToString());
            list.Add(g);
        }
    }
    static string S(Dictionary<string, object> d, string k) { object v; return d.TryGetValue(k, out v) && v != null ? v.ToString() : ""; }
    void SaveFavs()
    {
        try { Directory.CreateDirectory(Path.GetDirectoryName(favFile)); File.WriteAllLines(favFile, favs.ToArray(), Encoding.UTF8); } catch { }
    }

    TabDef Tab(string key)
    {
        foreach (TabDef t in tabs) if (t.Key == key) return t;
        return new TabDef { Key = "search", Label = "搜尋", Glyph = "🔍", Color = Color.FromArgb(70, 110, 120) };
    }
    List<TabDef> VisibleTabs()
    {
        List<TabDef> l = new List<TabDef>(tabs);
        if (tab == "search") l.Add(Tab("search"));
        return l;
    }

    // ---------- 頁面建立 ----------
    List<Page> Build(string key)
    {
        TabDef td = Tab(key);
        List<Page> targets = new List<Page>();
        List<IdxItem> items = new List<IdxItem>();
        if (key == "help" || key == "howto")
        {
            foreach (GuideSec g in (key == "help" ? help : howto))
            {
                Page p = new Page { Kind = PK.Guide, Title = g.T, Guide = g };
                targets.Add(p); items.Add(new IdxItem { Label = g.T, Sub = g.Items.Count + " 則", Target = p });
            }
        }
        else
        {
            List<Entry> list;
            if (key == "fav") list = entries.Where(e => favs.Contains(e.Id)).ToList();
            else if (key == "search") list = entries.Where(e => Match(e, search.Text)).ToList();
            else list = entries.Where(e => e.Tab == key).ToList();
            foreach (Entry e in list)
            {
                Page p = new Page { Kind = PK.Detail, Title = e.N, Entry = e };
                targets.Add(p); items.Add(new IdxItem { Label = e.N, Sub = e.E, Target = p });
            }
            if (key == "search")
            {
                foreach (GuideSec g in help.Concat(howto))
                {
                    GuideSec f = new GuideSec { T = g.T, Diagram = g.Diagram, Items = g.Items.Where(i => Has(g.T + " " + i, search.Text)).ToList() };
                    if (f.Items.Count == 0) continue;
                    Page p = new Page { Kind = PK.Guide, Title = g.T, Guide = f };
                    targets.Add(p); items.Add(new IdxItem { Label = "📖 " + g.T, Sub = "說明", Target = p });
                }
            }
        }

        List<Page> result = new List<Page>();
        if (items.Count == 0)
        {
            result.Add(new Page { Kind = PK.Empty, Title = td.Label, Sub = key == "fav" ? "還沒有最愛\n在詳細頁點右上角的 ☆ 加入" : "找不到符合的資料" });
            return result;
        }
        int perPage = ROWS * 2;
        int idxCount = (items.Count + perPage - 1) / perPage;
        for (int i = 0; i < idxCount; i++)
        {
            Page ip = new Page { Kind = PK.Index, Title = key == "search" ? "搜尋：" + search.Text : td.Label, Rows = items.Skip(i * perPage).Take(perPage).ToList() };
            ip.Sub = idxCount > 1 ? "目錄 " + (i + 1) + " / " + idxCount : "目錄";
            foreach (IdxItem it in ip.Rows) it.Target.BackIdx = i;
            result.Add(ip);
        }
        result.AddRange(targets);
        return result;
    }

    string CatLabel(string key) { return Tab(key).Label; }
    bool Match(Entry e, string q)
    {
        return Has(e.N + " " + e.E + " " + e.D + " " + CatLabel(e.Tab) + " " + string.Join(" ", e.M), q);
    }
    static bool Has(string hay, string q)
    {
        hay = hay.ToLowerInvariant();
        foreach (string w in q.ToLowerInvariant().Split(new[] { ' ', '　' }, StringSplitOptions.RemoveEmptyEntries))
            if (!hay.Contains(w)) return false;
        return true;
    }

    // ---------- 導覽 ----------
    void GoTo(int idx)
    {
        if (idx < 0 || idx >= pages.Count || idx == pageIdx) return;
        int target = idx;
        Flip(delegate { pageIdx = target; }, idx > pageIdx);
    }
    void SwitchTab(string key)
    {
        if (key == tab) { GoTo(0); return; }
        int a = TabOrder(tab), b = TabOrder(key);
        if (tab == "search") { suppressSearch = true; search.Text = ""; suppressSearch = false; }
        Flip(delegate { tab = key; pages = Build(key); pageIdx = 0; }, b > a);
    }
    int TabOrder(string key) { List<TabDef> v = VisibleTabs(); for (int i = 0; i < v.Count; i++) if (v[i].Key == key) return i; return 99; }

    bool suppressSearch;
    void OnSearch()
    {
        if (suppressSearch) return;
        string q = search.Text.Trim();
        if (q == "")
        {
            if (tab == "search") { tab = prevTab; pages = Build(tab); pageIdx = 0; }
        }
        else
        {
            if (tab != "search") prevTab = tab;
            tab = "search"; pages = Build("search"); pageIdx = 0;
        }
        DoLayout(); Invalidate();
    }

    void Flip(Action change, bool forward)
    {
        FinishAnim();
        Size sz = PageSize();
        Bitmap oldB = RenderPage(pages[pageIdx], pageIdx, pages.Count, sz, null);
        change();
        DoLayout();
        Bitmap newB = RenderPage(pages[pageIdx], pageIdx, pages.Count, sz, null);
        animUnder = forward ? newB : oldB;
        animOver = forward ? oldB : newB;
        animForward = forward;
        animStart = DateTime.Now;
        animating = true;
        anim.Start();
        Invalidate();
    }
    void FinishAnim()
    {
        if (!animating) return;
        animating = false; anim.Stop();
        if (animUnder != null) animUnder.Dispose();
        if (animOver != null) animOver.Dispose();
        animUnder = animOver = null;
    }

    // ---------- 版面 ----------
    void DoLayout()
    {
        float W = ClientSize.Width, H = ClientSize.Height;
        float top = 62 * d, m = 18 * d, spiral = 30 * d, tabW = 112 * d;
        pageR = new RectangleF(m + spiral, top, W - m - spiral - tabW - 4 * d, H - top - m);
        if (search != null)
        {
            int sw = (int)Math.Min(300 * d, pageR.Width * 0.5f);
            search.SetBounds((int)(pageR.Right - sw), (int)(18 * d), sw, search.PreferredHeight);
        }
        tabRects.Clear();
        List<TabDef> v = VisibleTabs();
        float gap = 5 * d;
        float th = Math.Min(60 * d, (pageR.Height - 30 * d) / v.Count - gap);
        float y = pageR.Top + 16 * d;
        foreach (TabDef t in v) { tabRects[t.Key] = new RectangleF(pageR.Right - 14 * d, y, tabW + 10 * d, th); y += th + gap; }
    }
    Size PageSize() { return new Size(Math.Max(1, (int)pageR.Width), Math.Max(1, (int)pageR.Height)); }
    protected override void OnResize(EventArgs e) { base.OnResize(e); FinishAnim(); DoLayout(); Invalidate(); }

    // ---------- 繪圖：外框 ----------
    protected override void OnPaint(PaintEventArgs e)
    {
        Graphics g = e.Graphics;
        g.SmoothingMode = SmoothingMode.AntiAlias;
        g.TextRenderingHint = TextRenderingHint.AntiAliasGridFit;
        g.InterpolationMode = InterpolationMode.HighQualityBilinear;

        using (LinearGradientBrush bg = new LinearGradientBrush(ClientRectangle, Color.FromArgb(34, 48, 38), Color.FromArgb(14, 20, 16), 90f))
            g.FillRectangle(bg, ClientRectangle);
        using (SolidBrush b = new SolidBrush(Color.FromArgb(217, 164, 65)))
            g.DrawString("森林之子 指南書", F(20 * d, true), b, pageR.Left - 10 * d, 16 * d);
        using (SolidBrush b = new SolidBrush(Color.FromArgb(140, 160, 145)))
            g.DrawString("Sons Of The Forest", F(11 * d), b, pageR.Left - 8 * d, 42 * d);

        // 書籤（被頁面蓋住的部分）
        foreach (TabDef t in VisibleTabs()) if (t.Key != tab) DrawTab(g, t, tabRects[t.Key], false);

        // 線圈背面
        DrawSpiral(g, false);

        // 頁面陰影
        using (GraphicsPath sp = RR(new RectangleF(pageR.X + 5 * d, pageR.Y + 7 * d, pageR.Width, pageR.Height), 22 * d))
        using (SolidBrush sb = new SolidBrush(Color.FromArgb(90, 0, 0, 0))) g.FillPath(sb, sp);

        if (animating)
        {
            double t = Math.Min(1, (DateTime.Now - animStart).TotalMilliseconds / AnimMs);
            float ease = (float)(1 - Math.Pow(1 - t, 3));
            float frac = animForward ? 1 - ease : ease;
            g.DrawImage(animUnder, pageR);
            float w = pageR.Width * frac;
            if (w > 2)
            {
                RectangleF over = new RectangleF(pageR.X, pageR.Y, w, pageR.Height);
                g.DrawImage(animOver, over);
                float sw = Math.Min(40 * d, pageR.Width - w + 1);
                if (sw > 2)
                {
                    RectangleF sh = new RectangleF(over.Right - 1, pageR.Y + 4 * d, sw, pageR.Height - 8 * d);
                    using (LinearGradientBrush lb = new LinearGradientBrush(sh, Color.FromArgb(110, 0, 0, 0), Color.FromArgb(0, 0, 0, 0), 0f)) g.FillRectangle(lb, sh);
                }
                RectangleF fold = new RectangleF(over.Right - Math.Min(w, 60 * d), pageR.Y, Math.Min(w, 60 * d), pageR.Height);
                using (LinearGradientBrush lb = new LinearGradientBrush(fold, Color.FromArgb(0, 0, 0, 0), Color.FromArgb(60, 0, 0, 0), 0f)) g.FillRectangle(lb, fold);
            }
            if (t >= 1) { FinishAnim(); Invalidate(); }
        }
        else
        {
            List<Hit> hits = new List<Hit>();
            using (Bitmap bmp = RenderPage(pages[pageIdx], pageIdx, pages.Count, PageSize(), hits))
                g.DrawImageUnscaled(bmp, (int)pageR.X, (int)pageR.Y);
            lastHits = hits;
        }

        DrawSpiral(g, true);
        TabDef act = Tab(tab);
        if (tabRects.ContainsKey(tab)) DrawTab(g, act, tabRects[tab], true);
    }

    void DrawTab(Graphics g, TabDef t, RectangleF r, bool active)
    {
        if (active) r = new RectangleF(r.X - 10 * d, r.Y - 2 * d, r.Width + 10 * d, r.Height + 4 * d);
        using (GraphicsPath p = RR(r, 7 * d))
        using (SolidBrush b = new SolidBrush(active ? t.Color : Blend(t.Color, Color.Black, 0.25f))) g.FillPath(b, p);
        RectangleF inner = new RectangleF(r.X + 14 * d + (active ? 6 * d : 0), r.Y + 5 * d, r.Width - 22 * d - (active ? 6 * d : 0), r.Height - 10 * d);
        using (GraphicsPath p = RR(inner, 4 * d))
        using (SolidBrush b = new SolidBrush(active ? Color.FromArgb(250, 247, 250) : Color.FromArgb(226, 220, 226))) g.FillPath(b, p);
        // 橫向：左圖示、右文字
        float gs = Math.Min(inner.Height, 30 * d);
        RectangleF gr = new RectangleF(inner.X + 2 * d, inner.Y + (inner.Height - gs) / 2, gs, gs);
        Glyph(g, t.Glyph, gr, Math.Min(gs * 0.62f, 19 * d), Blend(t.Color, Color.Black, 0.35f));
        RectangleF lr = new RectangleF(gr.Right + 1 * d, inner.Y, inner.Right - gr.Right - 2 * d, inner.Height);
        Txt(g, t.Label, FitW(g, t.Label, Math.Min(13 * d, inner.Height * 0.48f), 8 * d, true, lr.Width), Blend(t.Color, Color.Black, 0.45f), lr, StringAlignment.Near, StringAlignment.Center);
    }

    void DrawSpiral(Graphics g, bool front)
    {
        float step = 24 * d;
        float x = pageR.Left;
        using (Pen dark = new Pen(Color.FromArgb(38, 38, 40), 4.2f * d))
        using (Pen hi = new Pen(Color.FromArgb(150, 150, 155), 1.3f * d))
        using (SolidBrush hole = new SolidBrush(Color.FromArgb(70, 62, 70)))
        {
            for (float y = pageR.Top + 22 * d; y < pageR.Bottom - 16 * d; y += step)
            {
                RectangleF ring = new RectangleF(x - 24 * d, y - 7 * d, 40 * d, 15 * d);
                if (!front)
                {
                    g.DrawArc(dark, ring, 20, 150);
                }
                else
                {
                    g.FillEllipse(hole, x + 11 * d, y - 3.5f * d, 7 * d, 7 * d);
                    g.DrawArc(dark, ring, 175, 160);
                    g.DrawArc(hi, new RectangleF(ring.X, ring.Y - 1.2f * d, ring.Width, ring.Height), 200, 110);
                }
            }
        }
    }

    // ---------- 繪圖：頁面 ----------
    Bitmap RenderPage(Page p, int idx, int total, Size sz, List<Hit> hits)
    {
        Bitmap bmp = new Bitmap(sz.Width, sz.Height, System.Drawing.Imaging.PixelFormat.Format32bppPArgb);
        using (Graphics g = Graphics.FromImage(bmp))
        {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.TextRenderingHint = TextRenderingHint.AntiAliasGridFit;
            g.Clear(Color.Transparent);
            float PW = sz.Width, PH = sz.Height;
            RectangleF all = new RectangleF(0, 0, PW - 1, PH - 1);
            using (GraphicsPath pp = RR(all, 22 * d))
            {
                using (LinearGradientBrush lb = new LinearGradientBrush(all, Color.FromArgb(244, 240, 245), Color.FromArgb(232, 226, 234), 90f)) g.FillPath(lb, pp);
                using (Pen pen = new Pen(Color.FromArgb(214, 205, 216), 1.2f * d)) g.DrawPath(pen, pp);
            }
            if (hits == null) hits = new List<Hit>();
            float pad = Math.Max(PW * 0.075f, 40 * d);
            TabDef td = p.Entry != null ? Tab(p.Entry.Tab) : Tab(tab);

            // 標題
            float u = PH / 100f;
            Font tf = FitW(g, p.Title, 4.6f * u, 2.4f * u, true, PW - pad * 2 - 8 * u);
            Txt(g, p.Title, tf, Ink, new RectangleF(pad, 5.5f * u, PW - pad * 2, 7 * u), StringAlignment.Center, StringAlignment.Center);
            string sub = p.Kind == PK.Detail ? p.Entry.E : (p.Sub ?? "");
            if (p.Kind != PK.Empty)
                Txt(g, sub, F(2.0f * u), Muted, new RectangleF(pad, 12.4f * u, PW - pad * 2, 3.4f * u), StringAlignment.Center, StringAlignment.Center);
            using (Pen rp = new Pen(Rule, 1.4f * d)) g.DrawLine(rp, pad, 17f * u, PW - pad, 17f * u);
            // 角落：分類 / 頁碼
            Txt(g, (p.Kind == PK.Detail ? CatLabel(p.Entry.Tab) : td.Label), F(1.7f * u, true), td.Color, new RectangleF(pad, 2.2f * u, PW * 0.4f, 3 * u), StringAlignment.Near, StringAlignment.Center);
            Txt(g, (idx + 1) + " / " + total, F(1.7f * u), Muted, new RectangleF(PW - pad - PW * 0.3f, 2.2f * u, PW * 0.3f, 3 * u), StringAlignment.Far, StringAlignment.Center);

            float bodyTop = 20 * u, bodyBottom = 86 * u;
            if (p.Kind == PK.Detail) DrawDetail(g, p.Entry, td, PW, pad, u, bodyTop, bodyBottom, hits);
            else if (p.Kind == PK.Index) DrawIndex(g, p, td, PW, pad, u, bodyTop, bodyBottom, hits);
            else if (p.Kind == PK.Guide) DrawGuide(g, p.Guide, td, PW, pad, u, bodyTop, bodyBottom);
            else
            {
                Glyph(g, td.Glyph, new RectangleF(0, 28 * u, PW, 18 * u), 12 * u, Color.FromArgb(190, 180, 192));
                Txt(g, p.Sub, F(2.6f * u), Muted, new RectangleF(pad, 50 * u, PW - pad * 2, 14 * u), StringAlignment.Center, StringAlignment.Near);
            }

            // 底部按鈕
            float bh = 6 * u, by = 90 * u, bw = PW * 0.28f;
            if (idx > 0) Button(g, "◀  上一頁", new RectangleF(pad * 0.7f, by, bw, bh), u, hits, delegate { GoTo(pageIdx - 1); });
            if (idx < total - 1) Button(g, "下一頁  ▶", new RectangleF(PW - pad * 0.7f - bw, by, bw, bh), u, hits, delegate { GoTo(pageIdx + 1); });
            if (p.Kind == PK.Detail || p.Kind == PK.Guide)
            {
                int back = p.BackIdx;
                float cw = PW * 0.2f;
                Button(g, "目錄", new RectangleF((PW - cw) / 2, by, cw, bh), u, hits, delegate { GoTo(back); });
            }
            if (p.Kind == PK.Index && idx == 0 && tab == "help")
                Txt(g, sources, F(1.45f * u), Muted, new RectangleF(pad, 80.5f * u, PW - pad * 2, 7 * u), StringAlignment.Center, StringAlignment.Near, false);
        }
        return bmp;
    }

    void DrawIndex(Graphics g, Page p, TabDef td, float PW, float pad, float u, float top, float bottom, List<Hit> hits)
    {
        if (tab == "help") bottom -= 6 * u;
        float rowH = (bottom - top) / ROWS;
        float gap = 2.2f * u;
        float cw = (PW - pad * 2 - gap) / 2;
        for (int i = 0; i < p.Rows.Count; i++)
        {
            IdxItem it = p.Rows[i];
            int col = i / ROWS, row = i % ROWS;
            if (p.Rows.Count <= ROWS) { col = 0; cw = PW - pad * 2; }
            RectangleF r = new RectangleF(pad + col * (cw + gap), top + row * rowH, cw, rowH * 0.84f);
            using (GraphicsPath gp = RR(r, 1.2f * u))
            {
                using (SolidBrush b = new SolidBrush(Color.FromArgb(252, 250, 252))) g.FillPath(b, gp);
                using (Pen pen = new Pen(Color.FromArgb(222, 212, 222), 1.2f * d)) g.DrawPath(pen, gp);
            }
            using (SolidBrush b = new SolidBrush(td.Color)) g.FillRectangle(b, r.X, r.Y + r.Height * 0.2f, 0.6f * u, r.Height * 0.6f);
            Entry e = it.Target.Entry;
            float gx = r.X + 1.6f * u;
            if (e != null)
            {
                Glyph(g, MatGlyph(e.N + e.E, e.Tab), new RectangleF(gx, r.Y, r.Height, r.Height), r.Height * 0.48f, Blend(Tab(e.Tab).Color, Color.Black, 0.2f));
                gx += r.Height + 0.4f * u;
            }
            float tw = r.Right - gx - 5 * u;
            Font nf = FitW(g, it.Label, Math.Min(2.5f * u, r.Height * 0.36f), 1.4f * u, true, tw);
            Txt(g, it.Label, nf, Ink, new RectangleF(gx, r.Y + r.Height * 0.08f, tw, r.Height * 0.52f), StringAlignment.Near, StringAlignment.Center);
            Txt(g, it.Sub, F(Math.Min(1.6f * u, r.Height * 0.24f)), Muted, new RectangleF(gx, r.Y + r.Height * 0.56f, tw, r.Height * 0.38f), StringAlignment.Near, StringAlignment.Center);
            if (e != null && favs.Contains(e.Id))
                Txt(g, "★", F(2.2f * u), Color.FromArgb(201, 162, 39), new RectangleF(r.Right - 5 * u, r.Y, 4 * u, r.Height), StringAlignment.Center, StringAlignment.Center);
            else
                Txt(g, "›", F(3 * u), Rule, new RectangleF(r.Right - 5 * u, r.Y, 4 * u, r.Height), StringAlignment.Center, StringAlignment.Center);
            Page target = it.Target;
            hits.Add(new Hit { R = r, A = delegate { GoTo(pages.IndexOf(target)); } });
        }
    }

    void DrawDetail(Graphics g, Entry e, TabDef td, float PW, float pad, float u, float top, float bottom, List<Hit> hits)
    {
        // 最愛
        bool fav = favs.Contains(e.Id);
        RectangleF star = new RectangleF(PW - pad - 5 * u, 5.8f * u, 5 * u, 6 * u);
        Txt(g, fav ? "★" : "☆", F(4 * u), fav ? Color.FromArgb(201, 162, 39) : Muted, star, StringAlignment.Center, StringAlignment.Center);
        string id = e.Id;
        hits.Add(new Hit { R = star, A = delegate { if (favs.Contains(id)) favs.Remove(id); else favs.Add(id); SaveFavs(); Invalidate(); } });

        // 材料：圖示 + 圖示 + 圖示
        int n = e.M.Count;
        int perRow = n <= 4 ? n : (n <= 6 ? 3 : 4);
        float avail = PW - pad * 2;
        float cs = Math.Min(15 * u, avail / (perRow + (perRow - 1) * 0.34f));
        float plus = cs * 0.34f;
        int rows = (n + perRow - 1) / perRow;
        float y = top + 1 * u;
        for (int r = 0; r < rows; r++)
        {
            int c = Math.Min(perRow, n - r * perRow);
            float rowW = c * cs + (c - 1) * plus;
            float x = (PW - rowW) / 2;
            for (int i = 0; i < c; i++)
            {
                int k = r * perRow + i;
                if (i > 0 || r > 0)
                {
                    float px = i > 0 ? x - plus : x - plus * 0.9f;
                    if (i > 0) Txt(g, "+", F(cs * 0.3f, true), Muted, new RectangleF(px, y, plus, cs * 0.8f), StringAlignment.Center, StringAlignment.Center);
                }
                DrawMat(g, e.M[k], e.Tab, new RectangleF(x, y, cs, cs), td);
                x += cs + plus;
            }
            y += cs + 2.2f * u;
        }

        // 說明框
        y += 1 * u;
        string body = e.D ?? "";
        RectangleF box = new RectangleF(pad, y, PW - pad * 2, bottom - y);
        if (body != "" && box.Height > 8 * u)
        {
            float ip = 2 * u;
            Font hf = F(1.9f * u, true);
            float textW = box.Width - ip * 2;
            Font bf = Fit(g, body, 2.6f * u, 1.5f * u, false, textW, box.Height - ip * 2 - 3.2f * u);
            float th = g.MeasureString(body, bf, (int)textW).Height;
            box.Height = Math.Min(box.Height, th + ip * 2 + 3.4f * u);
            using (GraphicsPath gp = RR(box, 1.6f * u))
            {
                using (SolidBrush b = new SolidBrush(Color.FromArgb(251, 248, 251))) g.FillPath(b, gp);
                using (Pen pen = new Pen(Color.FromArgb(220, 207, 217), 1.3f * d)) g.DrawPath(pen, gp);
            }
            Txt(g, "說明", hf, td.Color, new RectangleF(box.X + ip, box.Y + ip * 0.7f, textW, 3 * u), StringAlignment.Near, StringAlignment.Center);
            Txt(g, body, bf, Ink, new RectangleF(box.X + ip, box.Y + ip + 3 * u, textW, box.Height - ip * 2 - 3 * u), StringAlignment.Near, StringAlignment.Near, false);
            y = box.Bottom + 2 * u;
        }

        // 做法步驟
        if (bottom - y > 9 * u && e.M.Count > 0 && e.Tab != "print")
        {
            string steps = e.Tab == "fire" && e.E == "Campfire"
                ? "① 按 B 開指南書選擇營火  ② 放上木棍與原木  ③ 用打火機點燃"
                : IsBuild(e.Tab)
                ? "① 按 B 開指南書放置藍圖  ② 把材料放進藍圖  ③ 或叫 Kelvin「完成建築」"
                : "① 按 I 開背包  ② 把上面的材料放到合成墊  ③ 點齒輪圖示完成";
            RectangleF sr = new RectangleF(pad, y, PW - pad * 2, Math.Min(7 * u, bottom - y));
            using (GraphicsPath gp = RR(sr, 1.6f * u))
            using (Pen pen = new Pen(Color.FromArgb(225, 200, 210), 1.2f * d) { DashStyle = DashStyle.Dash }) g.DrawPath(pen, gp);
            Font sf = FitW(g, steps, 1.9f * u, 1.2f * u, false, sr.Width - 3 * u);
            Txt(g, steps, sf, PinkInk, sr, StringAlignment.Center, StringAlignment.Center);
        }
        else if (e.Tab == "print" && bottom - y > 9 * u)
        {
            RectangleF sr = new RectangleF(pad, y, PW - pad * 2, Math.Min(7 * u, bottom - y));
            using (GraphicsPath gp = RR(sr, 1.6f * u))
            using (Pen pen = new Pen(Color.FromArgb(225, 200, 210), 1.2f * d) { DashStyle = DashStyle.Dash }) g.DrawPath(pen, gp);
            Txt(g, "到 3D 印表機（GPS 綠點）前選擇圖樣列印", F(1.9f * u), PinkInk, sr, StringAlignment.Center, StringAlignment.Center);
        }
    }

    static bool IsBuild(string t) { return t == "house" || t == "defense" || t == "storage" || t == "furniture" || t == "transport"; }

    static readonly Regex QtyRx = new Regex(@"^(.*?)\s*((?:約\s*)?\d+\s*ml)$");
    void DrawMat(Graphics g, string mat, string tabKey, RectangleF r, TabDef td)
    {
        string name = mat, qty = "";
        int x = mat.IndexOf('×');
        if (x >= 0) { name = mat.Substring(0, x).Trim(); qty = "×" + mat.Substring(x + 1).Trim(); }
        else { Match m = QtyRx.Match(mat); if (m.Success) { name = m.Groups[1].Value.Trim(); qty = m.Groups[2].Value.Replace(" ", ""); } }
        using (GraphicsPath gp = RR(r, r.Width * 0.12f))
        {
            using (SolidBrush b = new SolidBrush(Color.FromArgb(253, 252, 253))) g.FillPath(b, gp);
            using (Pen pen = new Pen(Color.FromArgb(216, 204, 214), 1.5f * d)) g.DrawPath(pen, gp);
        }
        Glyph(g, MatGlyph(name, tabKey), new RectangleF(r.X, r.Y + r.Height * 0.06f, r.Width, r.Height * 0.58f), r.Height * 0.36f, Color.FromArgb(85, 72, 80));
        Font nf = FitW(g, name, r.Height * 0.15f, r.Height * 0.09f, true, r.Width * 0.92f);
        Txt(g, name, nf, Ink, new RectangleF(r.X + r.Width * 0.03f, r.Y + r.Height * 0.64f, r.Width * 0.94f, r.Height * 0.3f), StringAlignment.Center, StringAlignment.Center);
        if (qty != "")
        {
            Font qf = F(r.Height * 0.14f, true);
            SizeF qs = g.MeasureString(qty, qf);
            RectangleF qb = new RectangleF(r.Right - qs.Width - r.Width * 0.02f, r.Y - qs.Height * 0.35f, qs.Width + r.Width * 0.06f, qs.Height * 1.05f);
            using (GraphicsPath gp = RR(qb, qb.Height / 2))
            using (SolidBrush b = new SolidBrush(td.Color)) g.FillPath(b, gp);
            Txt(g, qty, qf, Color.White, qb, StringAlignment.Center, StringAlignment.Center);
        }
    }

    void DrawGuide(Graphics g, GuideSec s, TabDef td, float PW, float pad, float u, float top, float bottom)
    {
        if (!string.IsNullOrEmpty(s.Diagram))
        {
            RectangleF db = new RectangleF(pad, top - 1 * u, PW - pad * 2, 31 * u);
            using (GraphicsPath gp = RR(db, 1.6f * u))
            {
                using (SolidBrush b = new SolidBrush(Color.FromArgb(247, 250, 252))) g.FillPath(b, gp);
                using (Pen pen = new Pen(Color.FromArgb(214, 222, 228), 1.2f * d)) g.DrawPath(pen, gp);
            }
            new Diagram(g, db, u, F).Draw(s.Diagram);
            top = db.Bottom + 2.5f * u;
        }
        float w = PW - pad * 2 - 4 * u;
        float gapv = 1.6f * u;
        float px = 2.8f * u;
        Font f = null;
        for (; px > 1.4f * u; px -= 0.1f * u)
        {
            f = F(px);
            float tot = 0;
            foreach (string it in s.Items) tot += g.MeasureString(it, f, (int)w).Height + gapv;
            if (tot <= bottom - top) break;
        }
        float y = top + 1 * u;
        int i = 0;
        foreach (string it in s.Items)
        {
            i++;
            float h = g.MeasureString(it, f, (int)w).Height;
            float dot = px * 1.15f;
            using (SolidBrush b = new SolidBrush(td.Color)) g.FillEllipse(b, pad, y + px * 0.12f, dot, dot);
            Txt(g, i.ToString(), F(px * 0.7f, true), Color.White, new RectangleF(pad, y + px * 0.12f, dot, dot), StringAlignment.Center, StringAlignment.Center);
            Txt(g, it, f, Ink, new RectangleF(pad + 4 * u, y, w, h + 2), StringAlignment.Near, StringAlignment.Near, false);
            y += h + gapv;
        }
    }

    void Button(Graphics g, string text, RectangleF r, float u, List<Hit> hits, Action a)
    {
        using (GraphicsPath gp = RR(r, r.Height * 0.3f))
        using (SolidBrush b = new SolidBrush(Pink)) g.FillPath(b, gp);
        Txt(g, text, F(2.1f * u), PinkInk, r, StringAlignment.Center, StringAlignment.Center);
        hits.Add(new Hit { R = r, A = a });
    }

    // ---------- 圖示對照 ----------
    static readonly string[][] GlyphMap = {
        // 建築名稱（放前面，避免被材料名先比對到）
        new[]{"十字架","✝"}, new[]{"床","🛏"}, new[]{"椅","🪑"}, new[]{"沙發","🛋"}, new[]{"花盆","🌱"}, new[]{"雨水","🌧"}, new[]{"晾乾","🥩"},
        new[]{"壁爐","🔥"}, new[]{"木筏","🛶"}, new[]{"船","🛶"}, new[]{"傳送","🌀"}, new[]{"神龕","🗿"}, new[]{"防禦牆","🧱"}, new[]{"木刺","🔱"},
        new[]{"瞭望塔","🗼"}, new[]{"鳥屋","🐦"}, new[]{"兔籠","🐇"}, new[]{"稻草人","🎃"}, new[]{"時鐘","🕰"}, new[]{"吊燈","💡"}, new[]{"腿燈","💡"},
        new[]{"聚光燈","🔦"}, new[]{"警報","🚨"}, new[]{"梯","🪜"}, new[]{"步道","👣"}, new[]{"平台","🟫"}, new[]{"門","🚪"}, new[]{"地板","🟫"},
        new[]{"小屋","🛖"}, new[]{"木屋","🏡"}, new[]{"樹屋","🌳"}, new[]{"斜頂","⛺"}, new[]{"雪橇","🛷"}, new[]{"滑翔翼","🪂"}, new[]{"戰利品","🦌"},
        new[]{"地毯","🦌"}, new[]{"桌","🍽"}, new[]{"層架","📚"}, new[]{"壁架","📚"}, new[]{"紙靶","🎯"}, new[]{"鍍層","⚙"},
        new[]{"儲存","📦"}, new[]{"儲物","📦"}, new[]{"架","📦"}, new[]{"箱","📦"}, new[]{"滑索","⚓"}, new[]{"繫船","⚓"},
        // 材料
        new[]{"木板","🟫"}, new[]{"石塊","🧱"}, new[]{"防水布","⛺"}, new[]{"燈泡","💡"}, new[]{"龜殼","🐢"}, new[]{"無線電","📻"}, new[]{"手榴彈","💣"},
        new[]{"手臂","💪"}, new[]{"腿","🦵"}, new[]{"怪物皮甲","👹"}, new[]{"騎士","🛴"},
        new[]{"樹脂","🧪"}, new[]{"C4","💣"}, new[]{"炸彈","💣"}, new[]{"汽油彈","🔥"}, new[]{"打火機","🔥"}, new[]{"火把","🔥"}, new[]{"營火","🔥"}, new[]{"火堆","🔥"},
        new[]{"頭骨燈","💀"}, new[]{"頭骨","💀"}, new[]{"骨頭","🦴"}, new[]{"原木","🌲"}, new[]{"木棍","🥢"}, new[]{"小石頭","⚫"}, new[]{"石頭","⛰"},
        new[]{"繩","➰"}, new[]{"布","🧣"}, new[]{"膠帶","⭕"}, new[]{"樹葉","🍃"}, new[]{"獸皮","🦌"}, new[]{"電線","🔌"}, new[]{"電池","🔋"},
        new[]{"電路板","💾"}, new[]{"伏特加","🍾"}, new[]{"羽毛","🐦"}, new[]{"美工刀","🔪"}, new[]{"手錶","⌚"}, new[]{"硬幣","💰"},
        new[]{"科技網","🕸"}, new[]{"抓鉤","⚓"}, new[]{"滑索","⚓"}, new[]{"雪果","🍒"}, new[]{"毒蠅傘","🍄"}, new[]{"箭","🏹"}, new[]{"弓","🏹"},
        new[]{"長矛","🔱"}, new[]{"棍棒","🏏"}, new[]{"蘆薈","🌵"}, new[]{"蓍草","🌼"}, new[]{"柳蘭","🌸"}, new[]{"木賊","🌾"}, new[]{"菊苣","🌷"},
        new[]{"香脂根","🌻"}, new[]{"魔鬼棒","🌿"}, new[]{"罐頭","🥫"}, new[]{"開罐器","🔧"}, new[]{"貓食","🐱"}, new[]{"電鋸","🪚"}, new[]{"手電筒","🔦"},
        new[]{"護甲","🛡"}, new[]{"藥劑","💊"}, new[]{"修理","🔨"}, new[]{"水壺","💧"}, new[]{"面具","🎭"}, new[]{"雪橇","🛷"}
    };
    string MatGlyph(string name, string tabKey)
    {
        foreach (string[] kv in GlyphMap) if (name.Contains(kv[0])) return kv[1] == "🪚" ? "⚙" : kv[1];
        if (name == "頭") return "👤";
        return Tab(tabKey).Glyph;
    }

    // ---------- 共用繪圖工具 ----------
    Font F(float px, bool bold = false, string fam = FontUI)
    {
        px = Math.Max(4f, (float)Math.Round(px * 2) / 2f);
        string k = fam + px + bold;
        Font f;
        if (!fonts.TryGetValue(k, out f)) { f = new Font(fam, px, bold ? FontStyle.Bold : FontStyle.Regular, GraphicsUnit.Pixel); fonts[k] = f; }
        return f;
    }
    Font FitW(Graphics g, string s, float px, float min, bool bold, float w)
    {
        for (; px > min; px -= 0.5f) if (g.MeasureString(s, F(px, bold)).Width <= w) return F(px, bold);
        return F(min, bold);
    }
    Font Fit(Graphics g, string s, float px, float min, bool bold, float w, float h)
    {
        for (; px > min; px -= 0.5f) if (g.MeasureString(s, F(px, bold), (int)w).Height <= h) return F(px, bold);
        return F(min, bold);
    }
    void Txt(Graphics g, string s, Font f, Color c, RectangleF r, StringAlignment h, StringAlignment v, bool noWrap = true)
    {
        using (SolidBrush b = new SolidBrush(c))
        using (StringFormat sf = new StringFormat())
        {
            sf.Alignment = h; sf.LineAlignment = v; sf.Trimming = StringTrimming.EllipsisCharacter;
            if (noWrap && s.IndexOf('\n') < 0) sf.FormatFlags = StringFormatFlags.NoWrap;
            g.DrawString(s, f, b, r, sf);
        }
    }
    void Glyph(Graphics g, string s, RectangleF r, float px, Color c)
    {
        Txt(g, s, F(px, false, FontEmoji), c, r, StringAlignment.Center, StringAlignment.Center);
    }
    static Color Blend(Color a, Color b, float t)
    {
        return Color.FromArgb((int)(a.R + (b.R - a.R) * t), (int)(a.G + (b.G - a.G) * t), (int)(a.B + (b.B - a.B) * t));
    }
    static GraphicsPath RR(RectangleF r, float rad)
    {
        GraphicsPath p = new GraphicsPath();
        float dd = Math.Min(rad * 2, Math.Min(r.Width, r.Height));
        if (dd <= 0.5f) { p.AddRectangle(r); return p; }
        p.AddArc(r.X, r.Y, dd, dd, 180, 90);
        p.AddArc(r.Right - dd, r.Y, dd, dd, 270, 90);
        p.AddArc(r.Right - dd, r.Bottom - dd, dd, dd, 0, 90);
        p.AddArc(r.X, r.Bottom - dd, dd, dd, 90, 90);
        p.CloseFigure();
        return p;
    }
    static Icon MakeIcon()
    {
        try
        {
            Icon ic = Icon.ExtractAssociatedIcon(Application.ExecutablePath);
            if (ic != null) return ic;
        }
        catch { }
        return SystemIcons.Application;
    }

    // ---------- 輸入 ----------
    protected override void OnMouseDown(MouseEventArgs e)
    {
        base.OnMouseDown(e);
        ActiveControl = null;
        if (animating) FinishAnim();
        if (e.Button == MouseButtons.XButton1) { GoTo(pageIdx - 1); return; }
        if (e.Button == MouseButtons.XButton2) { GoTo(pageIdx + 1); return; }
        if (e.Button != MouseButtons.Left) return;
        foreach (KeyValuePair<string, RectangleF> kv in tabRects)
            if (kv.Value.Contains(e.Location) && e.X > pageR.Right) { SwitchTab(kv.Key); return; }
        // 以目前頁面重新計算可點擊區域，避免用到翻頁前的舊資料
        List<Hit> hits = new List<Hit>();
        using (RenderPage(pages[pageIdx], pageIdx, pages.Count, PageSize(), hits)) { }
        lastHits = hits;
        PointF pt = new PointF(e.X - pageR.X, e.Y - pageR.Y);
        foreach (Hit h in hits) if (h.R.Contains(pt)) { h.A(); return; }
    }
    protected override void OnMouseMove(MouseEventArgs e)
    {
        base.OnMouseMove(e);
        bool hand = false;
        foreach (KeyValuePair<string, RectangleF> kv in tabRects) if (kv.Value.Contains(e.Location) && e.X > pageR.Right) hand = true;
        PointF pt = new PointF(e.X - pageR.X, e.Y - pageR.Y);
        foreach (Hit h in lastHits) if (h.R.Contains(pt)) hand = true;
        Cursor = hand ? Cursors.Hand : Cursors.Default;
    }
    protected override void OnMouseWheel(MouseEventArgs e)
    {
        base.OnMouseWheel(e);
        GoTo(pageIdx + (e.Delta < 0 ? 1 : -1));
    }
    protected override bool ProcessCmdKey(ref Message msg, Keys k)
    {
        if (k == (Keys.Control | Keys.F)) { search.Focus(); search.SelectAll(); return true; }
        if (k == Keys.Escape)
        {
            if (search.Text != "") { search.Text = ""; ActiveControl = null; }
            else GoTo(pages[pageIdx].Kind == PK.Index ? 0 : pages[pageIdx].BackIdx);
            return true;
        }
        if (search.Focused)
        {
            if (k == Keys.Enter || k == Keys.Down) { ActiveControl = null; return true; }
            return base.ProcessCmdKey(ref msg, k);
        }
        if (k == Keys.Left || k == Keys.PageUp) { GoTo(pageIdx - 1); return true; }
        if (k == Keys.Right || k == Keys.PageDown) { GoTo(pageIdx + 1); return true; }
        if (k == Keys.Home) { GoTo(0); return true; }
        if (k == Keys.Up || k == Keys.Down)
        {
            List<TabDef> v = VisibleTabs();
            int i = TabOrder(tab) + (k == Keys.Down ? 1 : -1);
            if (i >= 0 && i < v.Count) SwitchTab(v[i].Key);
            return true;
        }
        return base.ProcessCmdKey(ref msg, k);
    }
}
