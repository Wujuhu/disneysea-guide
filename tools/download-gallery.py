"""Fetch the official images in research/gallery-sources.json and prepare local WebP assets."""
from concurrent.futures import ThreadPoolExecutor, as_completed
from hashlib import sha256
from io import BytesIO
from pathlib import Path
import json
import time

import requests
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'research' / 'gallery-sources.json'
ASSET_ROOT = (ROOT / 'assets' / 'gallery').resolve()
ASSET_ROOT.mkdir(parents=True, exist_ok=True)


def prepare(record):
    path = (ROOT / record['local']).resolve()
    if not path.is_relative_to(ASSET_ROOT):
        raise ValueError('Gallery destination must stay inside assets/gallery')
    if path.is_file():
        with Image.open(path) as image:
            return {'width': image.width, 'height': image.height,
                    'bytes': path.stat().st_size,
                    'sha256': sha256(path.read_bytes()).hexdigest()}
    for attempt in range(2):
        try:
            response = requests.get(record['sourceImage'], timeout=(7, 20))
            response.raise_for_status()
            with Image.open(BytesIO(response.content)) as original:
                image = ImageOps.exif_transpose(original).convert('RGB')
                if image.width < 300 or image.height < 150:
                    raise ValueError('Source image is too small for a detail photo')
                original_size = [image.width, image.height]
                image.thumbnail((1280, 1280), Image.Resampling.LANCZOS)
                exif = Image.Exif()
                exif[270] = (f"Official image for {record['itemEnglishName']}. "
                             f"Source page: {record['sourcePage']} "
                             f"Source image: {record['sourceImage']} "
                             f"Retrieved: {record['checked']}.")
                exif[315] = 'Tokyo Disney Resort (official source)'
                exif[33432] = 'Rights remain with Tokyo Disney Resort and the respective rights holders.'
                exif[305] = 'DisneySea Guide; resized for web display'
                image.save(path, 'WEBP', quality=85, method=6, exif=exif)
                return {'width': image.width, 'height': image.height,
                        'originalSize': original_size, 'bytes': path.stat().st_size,
                        'sha256': sha256(path.read_bytes()).hexdigest()}
        except (requests.RequestException, OSError, ValueError):
            if attempt:
                raise
            time.sleep(.4)


if __name__ == '__main__':
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    unique = {record['local']: record for record in reversed(manifest['images'])}
    results, failures = {}, []
    with ThreadPoolExecutor(max_workers=6) as pool:
        jobs = {pool.submit(prepare, record): local for local, record in unique.items()}
        for job in as_completed(jobs):
            local = jobs[job]
            try:
                results[local] = job.result()
            except Exception as error:
                failures.append({'local': local, 'error': str(error)})
            if (len(results) + len(failures)) % 25 == 0:
                print(f"Processed {len(results) + len(failures)}/{len(unique)} images", flush=True)
    for record in manifest['images']:
        if record['local'] in results:
            record.update(results[record['local']])
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'saved': len(results), 'bytes': sum(r['bytes'] for r in results.values()),
                      'failures': failures}, ensure_ascii=False, indent=2), flush=True)
    raise SystemExit(bool(failures))
