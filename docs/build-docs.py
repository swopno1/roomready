#!/usr/bin/env python3
"""Build docs/index.html from docs/PLAN.md (the /docs route).

Usage: python3 docs/build-docs.py
Reads PLAN.md next to this script, renders it with python-markdown
(tables + fenced code), and writes index.html with the RoomReady
editorial styling. No external dependencies in the output.
"""
import pathlib
import markdown

HERE = pathlib.Path(__file__).resolve().parent
PLAN = HERE / "PLAN.md"
OUT = HERE / "index.html"

CSS = """
:root { --cream:#f5efe3; --ink:#1c2420; --teal:#226355; --teal-dark:#1d3a2f;
  --accent:#a94e24; --line:#ddd3bd; --card:#fffdf7; }
* { box-sizing:border-box; }
body { margin:0; background:var(--cream); color:var(--ink);
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  line-height:1.6; }
header { background:var(--teal-dark); color:#f5efe3; padding:28px 20px; }
header .wrap, main, footer .wrap { max-width:860px; margin:0 auto; }
header h1 { font-family:Georgia,"Times New Roman",serif; margin:0 0 6px;
  font-size:30px; }
header p { margin:4px 0; opacity:.9; }
header a { color:#f5efe3; }
nav.toc { background:var(--card); border-bottom:2px solid var(--line);
  padding:12px 20px; font-size:14px; }
nav.toc .wrap { max-width:860px; margin:0 auto; }
nav.toc a { color:var(--teal); margin-right:14px; text-decoration:none;
  font-weight:600; }
main { padding:24px 20px 40px; }
h1,h2,h3 { font-family:Georgia,"Times New Roman",serif; color:var(--teal-dark); }
h2 { border-bottom:2px solid var(--line); padding-bottom:6px; margin-top:36px; }
h3 { margin-top:28px; }
table { border-collapse:collapse; width:100%; margin:16px 0;
  font-size:14px; display:block; overflow-x:auto; }
th, td { border:1px solid var(--line); padding:8px 10px; text-align:left; }
th { background:var(--teal-dark); color:#f5efe3; }
tr:nth-child(even) td { background:#faf6ea; }
code { background:#ece4cd; padding:1px 5px; border-radius:4px;
  font-size:13px; }
pre { background:var(--teal-dark); color:#f5efe3; padding:14px;
  border-radius:8px; overflow-x:auto; }
pre code { background:none; padding:0; color:inherit; }
blockquote { border-left:4px solid var(--accent); margin:16px 0;
  padding:8px 16px; background:var(--card); }
hr { border:none; border-top:2px solid var(--line); margin:32px 0; }
a { color:var(--teal); }
footer { border-top:2px solid var(--line); padding:20px;
  color:#666; font-size:13px; }
"""

TOC = [
    ("Product", "#1-product-definition"),
    ("Platforms", "#2-platforms"),
    ("Architecture", "#3-architecture"),
    ("Suite wiring", "#4-wiring-with-vivereply-suite"),
    ("Features", "#5-proposed-features-phased"),
    ("Android", "#6-android-app-plan-capacitor"),
    ("Auth", "#7-authentication--authorization-with-vivereply-suite"),
    ("Security", "#8-security--standards-measurements-policy"),
    ("Legal", "#9-legal-pages"),
    ("Deployment", "#10-production-deployment"),
    ("Testing", "#11-testing--qa"),
    ("Roadmap", "#12-roadmap--milestones"),
    ("Decisions", "#13-decisions-needed-from-the-founder"),
]

md = PLAN.read_text(encoding="utf-8")
html = markdown.markdown(md, extensions=["tables", "fenced_code", "toc"])
toc_links = " ".join(f'<a href="{href}">{label}</a>' for label, href in TOC)

page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RoomReady — Production Plan</title>
<meta name="description" content="RoomReady production plan: PWA + Android, wired with ViveReply Suite. Features, auth, security, legal, deployment, roadmap.">
<style>{CSS}</style>
</head>
<body>
<header><div class="wrap">
<h1>RoomReady — Production Plan</h1>
<p>Version 1.0 · draft for founder review · 5 November 2026</p>
<p>PWA + Android, wired with ViveReply Suite. Plan only — no app code
changes accompany this document. &nbsp;·&nbsp; <a href="../">Back to the app</a>
&nbsp;·&nbsp; <a href="PLAN.md">Read as Markdown</a></p>
</div></header>
<nav class="toc"><div class="wrap">{toc_links}</div></nav>
<main>
{html}
</main>
<footer><div class="wrap">
<p>RoomReady · offline-first housekeeping for resorts ·
<a href="https://github.com/swopno1/roomready">swopno1/roomready</a> ·
Plan prepared by Cosmo for Md Amir Hossain. Not legal advice.
Pricing intentionally absent — Suite pricing is negotiated per project
and stays private.</p>
</div></footer>
</body>
</html>
"""
OUT.write_text(page, encoding="utf-8")
print(f"Wrote {OUT} ({len(page)} bytes)")
