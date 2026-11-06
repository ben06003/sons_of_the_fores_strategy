// 建築示意圖（側視圖，座標 0~100 x 0~60）
using System;
using System.Drawing;
using System.Drawing.Drawing2D;

class Diagram
{
    Graphics g; RectangleF box; float u, sc, ox, oy;
    Func<float, bool, string, Font> font;
    static readonly Color LogC = Color.FromArgb(150, 102, 62), LogDark = Color.FromArgb(96, 62, 36), LogEnd = Color.FromArgb(222, 186, 138);
    static readonly Color PlankC = Color.FromArgb(205, 160, 108), Red = Color.FromArgb(200, 60, 60), Green = Color.FromArgb(60, 135, 70);
    static readonly Color BoxBg = Color.FromArgb(247, 250, 252);

    public Diagram(Graphics g, RectangleF box, float u, Func<float, bool, string, Font> font)
    {
        this.g = g; this.box = box; this.u = u; this.font = font;
        sc = Math.Min((box.Width - 2 * u) / 100f, (box.Height - 2 * u) / 60f);
        ox = box.X + (box.Width - sc * 100) / 2; oy = box.Y + (box.Height - sc * 60) / 2;
    }
    PointF P(float x, float y) { return new PointF(ox + x * sc, oy + y * sc); }

    void Ground(float y)
    {
        PointF a = P(0, y);
        RectangleF r = new RectangleF(box.X + 1, a.Y, box.Width - 2, box.Bottom - a.Y - 2);
        using (SolidBrush b = new SolidBrush(Color.FromArgb(225, 236, 214))) g.FillRectangle(b, r);
        using (Pen p = new Pen(Color.FromArgb(120, 160, 100), 0.6f * sc)) g.DrawLine(p, box.X + 1, a.Y, box.Right - 1, a.Y);
    }
    void Log(float x1, float y1, float x2, float y2, float th = 3.4f, bool ghost = false)
    {
        PointF a = P(x1, y1), b = P(x2, y2);
        int al = ghost ? 80 : 255;
        using (Pen o = new Pen(Color.FromArgb(al, LogDark), (th + 0.9f) * sc)) { o.StartCap = LineCap.Round; o.EndCap = LineCap.Round; g.DrawLine(o, a, b); }
        using (Pen p = new Pen(Color.FromArgb(al, LogC), th * sc)) { p.StartCap = LineCap.Round; p.EndCap = LineCap.Round; g.DrawLine(p, a, b); }
        using (Pen h = new Pen(Color.FromArgb(ghost ? 30 : 80, 255, 255, 255), th * 0.25f * sc)) g.DrawLine(h, a, b);
    }
    void LogEndView(float x, float y, float r = 2.1f)
    {
        PointF c = P(x, y);
        float rr = r * sc;
        using (SolidBrush b = new SolidBrush(LogEnd)) g.FillEllipse(b, c.X - rr, c.Y - rr, rr * 2, rr * 2);
        using (Pen p = new Pen(LogDark, 0.5f * sc))
        {
            g.DrawEllipse(p, c.X - rr, c.Y - rr, rr * 2, rr * 2);
            g.DrawEllipse(p, c.X - rr * 0.45f, c.Y - rr * 0.45f, rr * 0.9f, rr * 0.9f);
        }
    }
    void Plank(float x1, float y1, float x2, float y2)
    {
        using (Pen o = new Pen(LogDark, 2.0f * sc)) g.DrawLine(o, P(x1, y1), P(x2, y2));
        using (Pen p = new Pen(PlankC, 1.4f * sc)) g.DrawLine(p, P(x1, y1), P(x2, y2));
    }
    void Planks(float x1, float x2, float y, float seg)
    {
        for (float x = x1; x < x2 - 0.5f; x += seg) Plank(x + 0.4f, y, Math.Min(x + seg, x2) - 0.4f, y);
    }
    void Spike(float x, float yBottom, float yTop)
    {
        Log(x, yBottom, x, yTop + 2.5f, 2.8f);
        PointF a = P(x - 1.7f, yTop + 2.3f), b = P(x + 1.7f, yTop + 2.3f), c = P(x, yTop);
        using (SolidBrush br = new SolidBrush(LogEnd)) g.FillPolygon(br, new[] { a, b, c });
        using (Pen p = new Pen(LogDark, 0.5f * sc)) g.DrawPolygon(p, new[] { a, b, c });
    }
    void Label(float x, float y, string s, Color c)
    {
        Font f = font(Math.Max(1.6f * u, 3.0f * sc), true, "Microsoft JhengHei UI");
        SizeF sz = g.MeasureString(s, f);
        PointF p = P(x, y);
        float lx = p.X - sz.Width / 2;
        lx = Math.Max(box.X + 3, Math.Min(lx, box.Right - sz.Width - 3));
        RectangleF r = new RectangleF(lx, p.Y - sz.Height / 2, sz.Width, sz.Height);
        using (SolidBrush b = new SolidBrush(Color.FromArgb(230, 255, 255, 255))) g.FillRectangle(b, r);
        using (SolidBrush b = new SolidBrush(c)) g.DrawString(s, f, b, r.X, r.Y);
    }
    void Cross(float x, float y, float s)
    {
        using (Pen p = new Pen(Red, 1.1f * sc)) { g.DrawLine(p, P(x - s, y - s), P(x + s, y + s)); g.DrawLine(p, P(x - s, y + s), P(x + s, y - s)); }
    }
    void Arrow(float x1, float y1, float x2, float y2, Color c)
    {
        using (Pen p = new Pen(c, 0.8f * sc)) { p.CustomEndCap = new AdjustableArrowCap(3.5f, 3.5f); g.DrawLine(p, P(x1, y1), P(x2, y2)); }
    }
    void DashRect(float x1, float y1, float x2, float y2)
    {
        PointF a = P(x1, y1), b = P(x2, y2);
        RectangleF r = new RectangleF(a.X, a.Y, b.X - a.X, b.Y - a.Y);
        using (SolidBrush br = new SolidBrush(BoxBg)) g.FillRectangle(br, r);
        using (Pen p = new Pen(Red, 0.6f * sc)) { p.DashStyle = DashStyle.Dash; g.DrawRectangle(p, r.X, r.Y, r.Width, r.Height); }
    }

    public void Draw(string kind)
    {
        g.SmoothingMode = SmoothingMode.AntiAlias;
        Color ink = Color.FromArgb(70, 60, 70), blue = Color.FromArgb(40, 100, 96);
        switch (kind)
        {
            case "collapse":
                Ground(54);
                using (Pen sep = new Pen(Color.FromArgb(200, 200, 208), 0.5f * sc)) { sep.DashStyle = DashStyle.Dash; g.DrawLine(sep, P(50, 4), P(50, 54)); }
                Log(6, 54, 6, 30); Log(44, 54, 44, 30);
                Log(3, 30, 24, 38); Log(24, 38, 47, 30);
                Arrow(24, 21, 24, 32, Red);
                Label(25, 9, "✗ 跨距太長會塌", Red);
                Log(57, 54, 57, 30); Log(76, 54, 76, 30); Log(95, 54, 95, 30);
                Log(54, 30, 98, 30);
                Label(76, 9, "✓ 中間加柱子", Green);
                Label(76, 44, "中柱", ink);
                break;
            case "beam":
                Ground(54);
                Log(22, 54, 22, 24); Log(78, 54, 78, 24);
                Log(14, 24, 86, 24);
                Label(22, 39, "① 直立柱", blue);
                Label(50, 13, "② 橫放原木當樑", blue);
                Label(78, 39, "③ 另一端撐起", blue);
                Label(50, 48, "柱子用斧頭砍短 → 調整高度", ink);
                break;
            case "strut":
                Ground(54);
                Log(12, 54, 12, 20); Log(88, 54, 88, 20);
                Log(50, 54, 50, 20, 3.4f, true); Cross(50, 36, 4);
                Log(8, 20, 92, 20);
                Log(12, 34, 26, 20, 2.6f); Log(88, 34, 74, 20, 2.6f);
                Label(30, 31, "斜撐（半截原木）", blue);
                Label(74, 31, "斜撐", blue);
                Label(50, 47, "有斜撐後，中柱可以拆", Red);
                Label(50, 11, "樑", ink);
                break;
            case "platform":
                Ground(54);
                Log(14, 54, 14, 33); Log(50, 54, 50, 33); Log(86, 54, 86, 33);
                Log(10, 33, 90, 33);
                Planks(10, 90, 29.6f, 7f);
                Label(50, 19, "③ 原木劈成木板，鋪滿", blue);
                Label(32, 44, "① 柱子", blue);
                Label(70, 42, "② 樑圍成方形", blue);
                break;
            case "wall":
                Ground(54);
                for (int i = 0; i < 7; i++) Log(14, 51.5f - i * 4.1f, 86, 51.5f - i * 4.1f, 3.6f);
                DashRect(56, 26, 74, 39);
                DashRect(24, 34, 36, 53.6f);
                Log(22.6f, 53.5f, 22.6f, 34.5f, 2.2f); Log(37.4f, 53.5f, 37.4f, 34.5f, 2.2f);
                Label(50, 10, "原木橫放，疊約 7 層高", blue);
                Label(65, 32.5f, "窗", Red);
                Label(30, 19, "門：砍到底＋兩側半截原木", Red);
                Arrow(30, 21.5f, 30, 33, Red);
                break;
            case "roof":
                Ground(54);
                for (int i = 0; i < 6; i++) { LogEndView(18, 51.5f - i * 4.4f); LogEndView(82, 51.5f - i * 4.4f); }
                Log(14, 28, 50, 8); Log(86, 28, 50, 8);
                for (int i = 1; i < 6; i++)
                {
                    float t = i / 6f;
                    LogEndView(14 + 36 * t, 28 - 20 * t - 2.7f, 1.3f);
                    LogEndView(86 - 36 * t, 28 - 20 * t - 2.7f, 1.3f);
                }
                LogEndView(50, 8, 2.4f);
                Label(18, 41, "牆", ink); Label(82, 41, "牆", ink);
                Label(50, 25, "② 原木斜靠在牆頂", blue);
                Label(50, 36, "③ 木板橫向鋪滿", blue);
                Label(50, 47, "① 先蓋好兩面牆", blue);
                break;
            case "stairs":
                Ground(54);
                Log(73, 54, 73, 22); Log(94, 54, 94, 22);
                Log(70, 22, 97, 22); Planks(70, 97, 18.8f, 6.5f);
                float[] xs = { 18, 30, 42, 54, 66 };
                for (int i = 0; i < xs.Length; i++)
                {
                    float y = 49 - i * 6;
                    Log(xs[i], 54, xs[i], y, 2.4f);
                    Plank(xs[i] - 6, y - 1.3f, xs[i] + 5, y - 1.3f);
                }
                Label(34, 20, "柱子＋橫木逐級往上", blue);
                Label(84, 10, "接到平台", blue);
                break;
            case "base":
                Ground(56);
                Spike(4, 56, 41); Spike(8.5f, 56, 41); Spike(91.5f, 56, 41); Spike(96, 56, 41);
                Log(24, 56, 24, 40); Log(50, 56, 50, 40); Log(76, 56, 76, 40);
                Log(20, 40, 80, 40);
                Log(24, 49, 32, 40, 2.4f); Log(76, 49, 68, 40, 2.4f);
                Planks(20, 80, 37, 6f);
                for (int i = 0; i < 4; i++) { LogEndView(23, 33.3f - i * 4.2f, 1.9f); LogEndView(77, 33.3f - i * 4.2f, 1.9f); }
                Log(19, 19, 50, 5); Log(81, 19, 50, 5);
                LogEndView(50, 5, 2f);
                Label(50, 26, "牆＋屋頂", blue);
                Label(50, 50, "柱子＋斜撐撐起高架地板", blue);
                Label(7, 34, "防禦牆", Red); Label(93, 34, "防禦牆", Red);
                break;
        }
    }
}
