from pathlib import Path
import re, requests
from fontTools import subset
from fontTools.ttLib import TTFont
root=Path(__file__).resolve().parents[1]
text=''.join((root/name).read_text(encoding='utf-8') for name in ['index.html','app.js','data.js','planner.js'])
chars=''.join(sorted(set(''.join(re.findall(r'[\u3000-\u9fff]',text))+'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:;!?/¥·—，。！？：；（）')))
r=requests.get('https://fonts.googleapis.com/css2',params={'family':'Noto Sans SC:wght@400..700','display':'swap','text':chars},headers={'User-Agent':'Mozilla/5.0'},timeout=25)
r.raise_for_status()
url=re.search(r'url\(([^)]+)\)',r.text).group(1)
font=requests.get(url,timeout=25)
font.raise_for_status()
(root/'assets'/'guide-sans.woff2').write_bytes(font.content)
(root/'research'/'font-source.json').write_text(__import__('json').dumps({'family':'Noto Sans SC','source':'https://fonts.google.com/noto/specimen/Noto+Sans+SC','download':url,'characters':len(chars),'license':'SIL Open Font License 1.1'},ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Font saved: {len(font.content)} bytes, {len(chars)} characters')

font_path=root/'assets'/'guide-sans.woff2'
loaded=TTFont(font_path)
options=subset.Options()
subsetter=subset.Subsetter(options=options)
subsetter.populate(text=chars)
subsetter.subset(loaded)
loaded.flavor='woff2'
loaded.save(font_path)
print(f'Subset WOFF2: {font_path.stat().st_size} bytes')
