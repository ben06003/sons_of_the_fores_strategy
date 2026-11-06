// 產生 icon.ico（256px PNG 包進 ICO）
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;

static class IconGen
{
    static void Main(string[] args)
    {
        using (Bitmap bmp = new Bitmap(256, 256))
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                g.SmoothingMode = SmoothingMode.AntiAlias;
                g.Clear(Color.Transparent);
                g.FillRectangle(new SolidBrush(Color.FromArgb(34, 58, 42)), 8, 8, 240, 240);
                g.FillRectangle(new SolidBrush(Color.FromArgb(217, 164, 65)), 206, 56, 34, 42);
                g.FillRectangle(new SolidBrush(Color.FromArgb(160, 69, 59)), 206, 108, 34, 42);
                g.FillRectangle(new SolidBrush(Color.FromArgb(79, 109, 143)), 206, 160, 34, 42);
                g.FillRectangle(new SolidBrush(Color.FromArgb(239, 234, 240)), 58, 28, 156, 200);
                using (Pen pen = new Pen(Color.FromArgb(40, 40, 40), 9))
                    for (int y = 46; y <= 210; y += 26) g.DrawArc(pen, 34, y - 9, 46, 18, 180, 200);
                Brush green = new SolidBrush(Color.FromArgb(46, 110, 62));
                int[][] tri = { new[] { 138, 50, 84 }, new[] { 138, 84, 104 }, new[] { 138, 120, 124 } };
                foreach (int[] t in tri)
                    g.FillPolygon(green, new[] { new Point(t[0], t[1]), new Point(t[0] + t[2] / 2, t[1] + 60), new Point(t[0] - t[2] / 2, t[1] + 60) });
                g.FillRectangle(new SolidBrush(Color.FromArgb(110, 72, 40)), 128, 180, 20, 30);
            }
            MemoryStream ms = new MemoryStream();
            bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
            byte[] png = ms.ToArray();
            using (BinaryWriter w = new BinaryWriter(File.Create(args[0])))
            {
                w.Write((ushort)0); w.Write((ushort)1); w.Write((ushort)1);
                w.Write((byte)0); w.Write((byte)0); w.Write((byte)0); w.Write((byte)0);
                w.Write((ushort)1); w.Write((ushort)32); w.Write((uint)png.Length); w.Write((uint)22);
                w.Write(png);
            }
        }
    }
}
