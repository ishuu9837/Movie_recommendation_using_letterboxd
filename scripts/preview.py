"""Local preview with the same security headers as production."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
root = Path(__file__).resolve().parent.parent
headers = json.loads((root/'security-headers.json').read_text())
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs): super().__init__(*args, directory=str(root), **kwargs)
    def end_headers(self):
        for key, value in headers.items():
            if key != 'Strict-Transport-Security': self.send_header(key, value)
        super().end_headers()
class PreviewServer(ThreadingHTTPServer):
    request_queue_size = 128
print('MRS preview: http://127.0.0.1:4173', flush=True)
PreviewServer(('127.0.0.1',4173), Handler).serve_forever()
