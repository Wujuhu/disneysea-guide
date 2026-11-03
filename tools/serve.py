"""Optional local preview: python tools/serve.py. No third-party dependencies."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import unquote, urlsplit
import argparse

ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, '.webp': 'image/webp'}
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def do_GET(self):
        request_path = unquote(urlsplit(self.path).path).lstrip('/') or 'index.html'
        destination = (ROOT/request_path).resolve()
        allowed = request_path in {'index.html','app.js','data.js','planner.js','styles.css'} or request_path.startswith('assets/')
        if not allowed or not destination.is_relative_to(ROOT) or not destination.is_file():
            self.send_error(404)
            return
        super().do_GET()
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--port',type=int,default=4173)
    args=parser.parse_args()
    print(f'Preview: http://127.0.0.1:{args.port}',flush=True)
    ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
