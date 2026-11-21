# -*- coding: utf-8 -*-
import os
import json

ROOT = os.path.dirname(os.path.abspath(__file__))
INDEX_PATH = os.path.join(ROOT, "index.html")
GS_PATH = os.path.join(ROOT, "Englishvoice.gs")
TXT_PATH = os.path.join(ROOT, "Englishvoice.txt")
INDEX_TXT_PATH = os.path.join(ROOT, "Index.txt")

with open(INDEX_PATH, 'r', encoding='utf-8') as f:
    html_content = f.read()

encoded_html = json.dumps(html_content, ensure_ascii=False)

with open(GS_PATH, 'r', encoding='utf-8') as f:
    gs_content = f.read()

prefix = 'const EMBEDDED_HTML = '
suffix = '\n\nfunction doGet'

start_idx = gs_content.find(prefix)
if start_idx == -1:
    raise ValueError("Could not find 'const EMBEDDED_HTML = ' in Englishvoice.gs")

end_idx = gs_content.find(suffix, start_idx)
if end_idx == -1:
    raise ValueError("Could not find 'function doGet' after EMBEDDED_HTML in Englishvoice.gs")

new_gs = gs_content[:start_idx + len(prefix)] + encoded_html + ';' + gs_content[end_idx:]

with open(GS_PATH, 'w', encoding='utf-8') as f:
    f.write(new_gs)

with open(TXT_PATH, 'w', encoding='utf-8') as f:
    f.write(new_gs)

with open(INDEX_TXT_PATH, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"✅ Successfully embedded index.html ({len(html_content)} chars) into Englishvoice.gs without regex escape issues!")
