"""Build the Sovo research report: render SVG charts into report.html, then print to PDF with headless Chromium."""
import pathlib, subprocess, html

HERE = pathlib.Path(__file__).parent
SRC = HERE / "report.html"
OUT_HTML = HERE / "_rendered.html"
OUT_PDF = HERE / "Sovo_Chennai_Community_Research.pdf"
CHROME = sorted(pathlib.Path("/opt/pw-browsers").glob("chromium-*/chrome-linux*/chrome"))[-1]

INK, MUTED, GRID = "#1d232b", "#6b7380", "#d9dde3"
C_CHN, C_IND, C_GLB, C_SOVO = "#2a6fdb", "#d9822b", "#7a5bc7", "#c0392b"


def pos_map(title, xl, xr, yb, yt, pts, zone):
    W, H, P = 640, 470, 60
    iw, ih = W - 2 * P, H - 2 * P
    X = lambda v: P + v / 100 * iw
    Y = lambda v: P + (100 - v) / 100 * ih
    s = [f'<svg viewBox="0 0 {W} {H}" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="Liberation Sans, sans-serif">']
    zx0, zy0, zx1, zy1, zlabel = zone
    s.append(f'<rect x="{X(zx0)}" y="{Y(zy1)}" width="{X(zx1)-X(zx0)}" height="{Y(zy0)-Y(zy1)}" fill="{C_SOVO}" fill-opacity="0.08" stroke="{C_SOVO}" stroke-dasharray="5 4" rx="8"/>')
    s.append(f'<text x="{X(zx0)+8}" y="{Y(zy1)+16}" font-size="11" fill="{C_SOVO}" font-weight="bold">{html.escape(zlabel)}</text>')
    s.append(f'<rect x="{P}" y="{P}" width="{iw}" height="{ih}" fill="none" stroke="{GRID}"/>')
    s.append(f'<line x1="{X(50)}" y1="{P}" x2="{X(50)}" y2="{P+ih}" stroke="{GRID}"/>')
    s.append(f'<line x1="{P}" y1="{Y(50)}" x2="{P+iw}" y2="{Y(50)}" stroke="{GRID}"/>')
    s.append(f'<text x="{P}" y="{H-P+22}" font-size="12" fill="{MUTED}">&#8592; {html.escape(xl)}</text>')
    s.append(f'<text x="{P+iw}" y="{H-P+22}" font-size="12" fill="{MUTED}" text-anchor="end">{html.escape(xr)} &#8594;</text>')
    s.append(f'<text x="{P-12}" y="{P+ih}" font-size="12" fill="{MUTED}" transform="rotate(-90 {P-12} {P+ih})">&#8592; {html.escape(yb)}</text>')
    s.append(f'<text x="{P-12}" y="{P}" font-size="12" fill="{MUTED}" text-anchor="end" transform="rotate(-90 {P-12} {P})">{html.escape(yt)} &#8594;</text>')
    s.append(f'<text x="{P}" y="{P-22}" font-size="15" font-weight="bold" fill="{INK}">{html.escape(title)}</text>')
    for label, x, y, kind, anchor in pts:
        c = {"chn": C_CHN, "ind": C_IND, "glb": C_GLB, "sovo": C_SOVO}[kind]
        r = 7 if kind == "sovo" else 5
        s.append(f'<circle cx="{X(x)}" cy="{Y(y)}" r="{r}" fill="{c}" stroke="#fff" stroke-width="1.5"/>')
        dx = 9 if anchor == "start" else -9
        weight = "bold" if kind == "sovo" else "normal"
        s.append(f'<text x="{X(x)+dx}" y="{Y(y)+4}" font-size="10.5" fill="{INK}" font-weight="{weight}" text-anchor="{anchor}">{html.escape(label)}</text>')
    lx = P
    for name, c in [("Chennai", C_CHN), ("Other Indian city", C_IND), ("Global", C_GLB), ("Sovo opportunity", C_SOVO)]:
        s.append(f'<circle cx="{lx+5}" cy="{H-14}" r="5" fill="{c}"/><text x="{lx+14}" y="{H-10}" font-size="11" fill="{MUTED}">{name}</text>')
        lx += 130
    s.append("</svg>")
    return "".join(s)


# Map 1: x = structured(0) -> spontaneous(100); y = interest-focused(0) -> people-focused(100)
MAP1 = pos_map(
    "Map 1 — How gatherings are organised vs. what they are about",
    "Structured", "Spontaneous", "Interest-focused", "People-focused",
    [
        ("QFI quiz", 15, 30, "chn", "start"),
        ("Chennai Runners", 22, 40, "chn", "start"),
        ("Freelancers Club", 12, 58, "chn", "start"),
        ("Trekking Club", 34, 47, "chn", "start"),
        ("Kommune open mic", 32, 22, "chn", "start"),
        ("Urban Sketchers", 45, 12, "chn", "start"),
        ("Silent reading clubs", 64, 20, "chn", "start"),
        ("Board-game nights", 56, 40, "chn", "start"),
        ("Supper clubs", 28, 72, "chn", "start"),
        ("Strangers Meetup", 42, 88, "chn", "end"),
        ("Coffee raves", 78, 58, "chn", "end"),
        ("House parties", 92, 92, "chn", "end"),
        ("Cubbon Reads", 70, 28, "ind", "start"),
        ("Daud Run Club", 74, 66, "ind", "start"),
        ("Oopar Club", 36, 80, "ind", "end"),
        ("Timeleft", 20, 92, "glb", "start"),
        ("Pub Choir", 40, 60, "glb", "start"),
        ("Sovo: Collective Making", 48, 70, "sovo", "start"),
    ],
    (38, 55, 70, 80, "WHITESPACE"),
)

# Map 2: x = networking(0) -> community(100); y = passive consumption(0) -> active participation(100)
MAP2 = pos_map(
    "Map 2 — Why people come vs. what they actually do there",
    "Networking", "Community", "Passive consumption", "Active participation",
    [
        ("Startup networking", 6, 22, "chn", "start"),
        ("Freelancers Club", 16, 34, "chn", "start"),
        ("CreativeMornings", 38, 18, "ind", "start"),
        ("Strangers Meetup", 40, 46, "chn", "start"),
        ("Supper clubs", 55, 28, "chn", "start"),
        ("Comedy / open-mic audience", 64, 10, "chn", "start"),
        ("Kutcheri season", 76, 4, "chn", "start"),
        ("Coffee raves", 56, 55, "chn", "start"),
        ("Silent reading", 74, 42, "chn", "start"),
        ("Board games", 70, 63, "chn", "end"),
        ("QFI quiz", 80, 70, "chn", "start"),
        ("Runners / Trekking", 84, 76, "chn", "end"),
        ("Urban Sketchers", 76, 71, "chn", "end"),
        ("Pub Choir", 60, 86, "glb", "end"),
        ("48 Hour Film Project", 58, 98, "glb", "end"),
        ("Sovo: Collective Making", 90, 88, "sovo", "end"),
    ],
    (62, 80, 100, 100, "WHITESPACE"),
)

# Saturation bar chart (analyst score 1-5)
SAT = [
    ("Running / fitness", 5.0), ("Startup & professional networking", 4.7), ("Stand-up & open mic (audience)", 4.3),
    ("Reading (incl. silent reading)", 4.0), ("Workshops (pottery, paint & sip)", 3.9), ("Heritage & photo walks", 3.8),
    ("Trekking / outdoors", 3.6), ("Board games", 3.3), ("Quizzing", 3.0), ("Supper clubs", 2.6),
    ("'Meet strangers' mixers", 2.6), ("Sober / day raves", 2.0), ("Peer critique of creative work", 1.4),
    ("Group singing (non-audition)", 1.2), ("Collective making with strangers", 1.0),
]


def sat_chart():
    W, rowh, lw = 640, 24, 250
    H = len(SAT) * rowh + 50
    bw = W - lw - 60
    s = [f'<svg viewBox="0 0 {W} {H}" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="Liberation Sans, sans-serif">']
    for i in range(0, 6):
        x = lw + bw * i / 5
        s.append(f'<line x1="{x}" y1="10" x2="{x}" y2="{H-30}" stroke="{GRID}"/><text x="{x}" y="{H-14}" font-size="10" fill="{MUTED}" text-anchor="middle">{i}</text>')
    for i, (name, v) in enumerate(SAT):
        y = 14 + i * rowh
        c = "#b8c2d0" if v >= 3 else ("#7fa7e6" if v >= 2 else C_SOVO)
        s.append(f'<text x="{lw-8}" y="{y+13}" font-size="11" fill="{INK}" text-anchor="end">{html.escape(name)}</text>')
        s.append(f'<rect x="{lw}" y="{y+2}" width="{bw*v/5}" height="{rowh-8}" fill="{c}" rx="2"/>')
        s.append(f'<text x="{lw+bw*v/5+5}" y="{y+13}" font-size="10.5" fill="{MUTED}">{v:.1f}</text>')
    s.append("</svg>")
    return "".join(s)


def main():
    doc = SRC.read_text()
    doc = doc.replace("{{MAP1}}", MAP1).replace("{{MAP2}}", MAP2).replace("{{SATCHART}}", sat_chart())
    OUT_HTML.write_text(doc)
    subprocess.run([
        CHROME, "--headless=new", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer",
        f"--print-to-pdf={OUT_PDF}", OUT_HTML.as_uri(),
    ], check=True, capture_output=True)
    OUT_HTML.unlink()
    print("wrote", OUT_PDF)


if __name__ == "__main__":
    main()
