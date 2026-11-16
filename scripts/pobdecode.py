"""Decode a Path of Building export code to readable summary. usage: pobdecode.py code.txt out.xml"""
import base64, zlib, sys, re
import xml.etree.ElementTree as ET
sys.stdout.reconfigure(encoding='utf-8')
code = open(sys.argv[1], encoding='utf-8').read().strip()
xml = zlib.decompress(base64.urlsafe_b64decode(code + '=' * (-len(code) % 4))).decode('utf-8')
open(sys.argv[2], 'w', encoding='utf-8').write(xml)
root = ET.fromstring(xml)
b = root.find('Build')
print('BUILD', b.attrib)
for st in b.findall('PlayerStat'):
    if st.get('stat') in ('Life', 'Mana', 'EnergyShield', 'TotalDPS', 'CombinedDPS', 'FireResist', 'ColdResist', 'LightningResist', 'ChaosResist', 'Str', 'Dex', 'Int', 'Speed', 'ManaUnreserved', 'Armour', 'Evasion', 'SpellSuppressionChance', 'EffectiveSpellSuppressionChance', 'BlockChance', 'SpellBlockChance'):
        print('  ', st.get('stat'), st.get('value'))
print('\nNOTES:\n', (b.findtext('Notes') or root.findtext('Notes') or '')[:3000])
sk = root.find('Skills')
for ss in sk.findall('SkillSet'):
    print('\n== SkillSet', ss.get('title'))
    for g in ss.findall('Skill'):
        gems = [f"{x.get('nameSpec')}({x.get('level')}/{x.get('quality')}){'' if x.get('enabled','true')=='true' else '[off]'}" for x in g.findall('Gem')]
        print('  [', g.get('slot') or '', g.get('label') or '', ']', ' + '.join(gems))
tree = root.find('Tree')
for spec in tree.findall('Spec'):
    nodes = spec.get('nodes', '').split(',')
    print('\n== TreeSpec', spec.get('title'), 'nodes', len(nodes), 'ver', spec.get('treeVersion'), 'asc', spec.get('ascendClassId'))
    u = spec.find('URL')
    if u is not None: print('   url', (u.text or '').strip()[:200])
    for s in spec.findall('Sockets/Socket'):
        pass
items = root.find('Items')
print('\n== ITEMS')
for it in items.findall('Item'):
    txt = (it.text or '').strip()
    print('--- id', it.get('id'))
    print(txt)
for iset in items.findall('ItemSet'):
    print('== ItemSet', iset.get('title'), [(s.get('name'), s.get('itemId')) for s in iset.findall('Slot') if s.get('itemId') != '0'])
cfg = root.find('Config')
