"""Compact POB summary + JSON. usage: pobcompact.py file.xml out.json"""
import sys, re, json
import xml.etree.ElementTree as ET
sys.stdout.reconfigure(encoding='utf-8')
root = ET.parse(sys.argv[1]).getroot()

SKIP = re.compile(r'^(Unique ID|Item Level|Quality|Sockets|LevelReq|Implicits|Rarity|Crafted|Prefix|Suffix|Armour|Evasion|Energy Shield|Ward|Radius|Limited|Selected|Catalyst|Has Alt|League|Shaper|Elder|Crusader|Redeemer|Hunter|Warlord|Synthesised|Foulborn|ArmourBasePercentile|EnergyShieldBasePercentile|EvasionBasePercentile|WardBasePercentile|Variant|Talisman|Cluster Jewel|Requires|Source)', re.I)

def parse_item(txt):
    lines = [l.strip() for l in txt.strip().splitlines() if l.strip()]
    rarity = lines[0].replace('Rarity: ', '') if lines and lines[0].startswith('Rarity') else ''
    rest = lines[1:]
    name = rest[0] if rest else ''
    base = rest[1] if len(rest) > 1 and rarity.upper() in ('RARE', 'UNIQUE', 'RELIC') else ''
    body = rest[2:] if base else rest[1:]
    sockets = next((l.split(': ', 1)[1] for l in lines if l.startswith('Sockets:')), '')
    mods = []
    for l in body:
        if SKIP.match(l):
            continue
        l = re.sub(r'\{[^}]*\}', '', l).strip()
        if l:
            mods.append(l)
    return {'rarity': rarity, 'name': name, 'base': base, 'sockets': sockets, 'mods': mods}

items = {it.get('id'): parse_item(it.text or '') for it in root.find('Items').findall('Item')}
out = {'build': root.find('Build').attrib, 'skillsets': [], 'trees': [], 'itemsets': []}
for ss in root.find('Skills').findall('SkillSet'):
    groups = []
    for g in ss.findall('Skill'):
        gems = [{'name': x.get('nameSpec'), 'lvl': x.get('level'), 'q': x.get('quality'), 'on': x.get('enabled', 'true') == 'true'} for x in g.findall('Gem')]
        if gems:
            groups.append({'slot': g.get('slot') or '', 'label': g.get('label') or '', 'enabled': g.get('enabled', 'true') == 'true', 'gems': gems})
    out['skillsets'].append({'title': ss.get('title'), 'groups': groups})
for spec in root.find('Tree').findall('Spec'):
    u = spec.find('URL')
    out['trees'].append({'title': spec.get('title'), 'nodes': len(spec.get('nodes', '').split(',')), 'url': (u.text or '').strip() if u is not None else ''})
for iset in root.find('Items').findall('ItemSet'):
    slots = []
    for s in iset.findall('Slot'):
        if s.get('itemId') not in (None, '0') and s.get('itemId') in items:
            slots.append({'slot': s.get('name'), **items[s.get('itemId')]})
    out['itemsets'].append({'title': iset.get('title'), 'slots': slots})
# items not in any set but present (e.g., leveling uniques)
json.dump(out, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# print compact text
print('BUILD', out['build'].get('className'), out['build'].get('ascendClassName'), 'lvl', out['build'].get('level'))
for ss in out['skillsets']:
    print(f"\n## Skills: {ss['title']}")
    for g in ss['groups']:
        gl = ' + '.join(f"{x['name']}{'' if x['on'] else '(off)'}" for x in g['gems'])
        print(f"  - [{g['slot']}{(' ' + g['label']) if g['label'] else ''}]{'' if g['enabled'] else ' (DISABLED)'} {gl}")
print('\n## Trees:', [(t['title'], t['nodes']) for t in out['trees']])
for s in out['itemsets']:
    print(f"\n## Items: {s['title']}")
    for it in s['slots']:
        if it['slot'].startswith('Flask') or 'Swap' in it['slot']:
            print(f"  * {it['slot']}: {it['rarity']} {it['name']} | {it['base']} | {'; '.join(it['mods'][:6])}")
        else:
            print(f"  * {it['slot']}: {it['rarity']} {it['name']} | {it['base']} | sockets {it['sockets']}\n      " + '\n      '.join(it['mods']))
