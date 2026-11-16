"""Look up TW (台服) names + icons on poedb.tw for English names.
usage: twnames.py names.txt out.json   (appends/caches)"""
import sys, re, json, time, os, html, urllib.request, urllib.parse
sys.stdout.reconfigure(encoding='utf-8')
names = [l.strip() for l in open(sys.argv[1], encoding='utf-8') if l.strip()]
out_path = sys.argv[2]
cache = json.load(open(out_path, encoding='utf-8')) if os.path.exists(out_path) else {}

def slug(n):
    n = n.replace("'", '').replace(',', '')
    return re.sub(r'\s+', '_', n.strip())

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode('utf-8', 'replace')

for n in names:
    if n in cache and cache[n].get('tw'):
        continue
    m = None
    ALIAS={'Red Nightmare':'The_Red_Nightmare','Increased Duration':'More_Duration_Support','Balance of Terror':'Balance_of_Terror'}
    for cand in ((ALIAS[n],) if n in ALIAS else (slug(n), slug(n) + '_Support')):
        url = 'https://poedb.tw/tw/' + urllib.parse.quote(cand)
        try:
            s = fetch(url)
        except Exception as e:
            s = ''
        m = re.search(r'class="itemName[^"]*">\s*(.*?)</div>', s, re.S)
        if m:
            break
        time.sleep(0.3)
    tw = ''
    if m:
        parts = [html.unescape(re.sub('<[^>]+>', '', p)).strip() for p in re.findall(r'<span class="lc">(.*?)</span>', m.group(1), re.S)]
        tw = ' '.join(p for p in parts if p)
    icon = ''
    im = re.search(r'class="itemboximage">\s*<img[^>]*src="([^"]+)"', s)
    if im:
        icon = im.group(1)
    cache[n] = {'tw': tw, 'icon': icon, 'url': url}
    print(n, '=>', tw, '|', icon.rsplit('/', 1)[-1] if icon else '-')
    time.sleep(0.4)
json.dump(cache, open(out_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
