"""Legendas: cada fala no seu tempo (o mesmo cálculo do filme) → autogenius-1-minuto.srt"""
import os, sys, json, subprocess
D = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ.get('LIB', os.path.expanduser('~/lemo-opuscar'))
TL = json.load(open(os.path.join(D, 'timeline.json'))); L = json.load(open(os.path.join(D, 'lines.json'))); DU = json.load(open(os.path.join(D, 'voice', 'dur.json')))
cues = [{'t0': TL['lines'][l['id']], 't1': TL['lines'][l['id']] + max(1.8, DU[l['id']] + 0.6), 'text': l['text']} for l in L]
p = os.path.join(D, 'out', 'cues.json'); os.makedirs(os.path.dirname(p), exist_ok=True); json.dump(cues, open(p, 'w'), ensure_ascii=False)
subprocess.run([sys.executable, os.path.join(LIB, 'core/render/srt.py'), p, os.path.join(D, 'autogenius-1-minuto.srt')], check=True)
