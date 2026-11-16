"""Add gem colors, download icons, write data/names.js. usage: build_names.py tw.json project_dir"""
import sys, re, json, os, time, urllib.request
sys.stdout.reconfigure(encoding='utf-8')
tw = json.load(open(sys.argv[1], encoding='utf-8'))
proj = sys.argv[2]
icon_dir = os.path.join(proj, 'assets', 'icons')
os.makedirs(icon_dir, exist_ok=True)

def fetch(url, binary=False):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as r:
        b = r.read()
    return b if binary else b.decode('utf-8', 'replace')

out = {}
for en, v in sorted(tw.items()):
    if not v.get('tw'):
        continue
    entry = {'tw': v['tw']}
    icon = v.get('icon', '')
    is_gem = '/Gems/' in icon
    if is_gem and 'color' not in v:
        try:
            s = fetch(v['url'])
            m = re.search(r'<div class="property">([^<]*grants_active_skill[^<]*|[^<]*support[^<]*)</div>', s)
            prop = (m.group(1) if m else '').lower()
            v['color'] = 'R' if 'strength' in prop else 'G' if 'dexterity' in prop else 'B' if 'intelligence' in prop else 'W'
            time.sleep(0.3)
        except Exception as e:
            print('color ERR', en, e)
    if v.get('color'):
        entry['color'] = v['color']
    if icon:
        fname = icon.rsplit('/', 1)[-1]
        # 支援寶石與技能寶石可能同名，加上資料夾前綴避免衝突
        sub = icon.split('/Art/2DItems/', 1)[-1].replace('/', '_') if '/Art/2DItems/' in icon else fname
        path = os.path.join(icon_dir, sub)
        if not os.path.exists(path):
            try:
                open(path, 'wb').write(fetch(icon, binary=True))
                time.sleep(0.2)
            except Exception as e:
                print('icon ERR', en, e); sub = ''
        if sub:
            entry['icon'] = 'assets/icons/' + sub
    out[en] = entry
    print(en, entry)

json.dump(tw, open(sys.argv[1], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
with open(os.path.join(proj, 'data', 'names.js'), 'w', encoding='utf-8') as f:
    f.write('// 台服（繁中）名稱、寶石顏色與圖示對照，來源 poedb.tw；由 scratch 腳本產生\n')
    f.write('window.POE_NAMES = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n')
print('total', len(out))
