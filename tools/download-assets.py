from pathlib import Path
import concurrent.futures, json, shutil
import requests

root = Path(__file__).resolve().parents[1]
items = json.loads((root/'research'/'sources.json').read_text(encoding='utf-8'))
(root/'assets'/'attractions').mkdir(exist_ok=True)
def download(item):
    path=root/item['local']
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists(): return f"cached {item['id']}"
    r=requests.get(item['image'], timeout=20)
    r.raise_for_status()
    path.write_bytes(r.content)
    return f"saved {item['id']} ({len(r.content)} bytes)"
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    for result in pool.map(download, items): print(result)
shutil.copyfile(root/'research'/'Im0.jpg',root/'assets'/'official-map.jpg')
