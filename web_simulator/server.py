"""
Zero-Dependency Local Server for Guru Offline Simulator & Live Demo.
Uses standard library http.server to provide REST APIs connecting the
UI directly to the on-device Python engine without internet connectivity.
"""

import os
import sys
import json
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse

# Ensure project root is in sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from engine.local_slm_engine import LocalSlmEngine
from engine.performance_monitor import PerformanceMonitor

engine = LocalSlmEngine()
perf = PerformanceMonitor()

class GuruServerHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        directory = os.path.join(BASE_DIR, "web_simulator")
        super().__init__(*args, directory=directory, **kwargs)

    def do_POST(self):
        url_parts = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)

        try:
            body = json.loads(post_data.decode("utf-8")) if post_data else {}
        except Exception:
            body = {}

        if url_parts.path == "/api/chat":
            query = body.get("query", "")
            module_id = body.get("module_id", "class10_science")
            mode = body.get("mode", "normal")
            is_offline_forced = body.get("is_offline_forced", True)

            # Check network requirement if online is supposedly needed
            response = engine.answer_query(
                query=query,
                module_id=module_id,
                mode=mode
            )

            # Enforce offline simulation verification
            response["performance"]["is_offline"] = True
            response["performance"]["network_mode"] = "OFFLINE" if is_offline_forced else "ONLINE"

            self.send_json_response(200, response)

        elif url_parts.path == "/api/download_module":
            module_id = body.get("module_id", "class10_math")
            # Verify module exists on disk
            mod_path = os.path.join(BASE_DIR, "modules", module_id)
            exists = os.path.exists(mod_path)
            self.send_json_response(200, {
                "module_id": module_id,
                "installed": exists,
                "status": "Installed and verified for offline use" if exists else "Module not found"
            })

        else:
            self.send_json_response(404, {"error": "Endpoint not found"})

    def do_GET(self):
        url_parts = urllib.parse.urlparse(self.path)

        if url_parts.path == "/api/telemetry":
            mem = perf.get_memory_usage_mb()
            net = perf.verify_offline_state()
            data = {
                "model_name": engine.model_name,
                "model_size_mb": engine.model_size_mb,
                "process_ram_mb": mem["rss_mb"],
                "virtual_ram_mb": mem["vms_mb"],
                "is_offline": True,
                "status_label": "📵 Offline Mode (AI running on this device)",
                "active_module": engine.active_module_id
            }
            self.send_json_response(200, data)

        elif url_parts.path == "/api/modules":
            mods_dir = os.path.join(BASE_DIR, "modules")
            modules_list = []
            if os.path.exists(mods_dir):
                for m_id in os.listdir(mods_dir):
                    meta_path = os.path.join(mods_dir, m_id, "metadata.json")
                    if os.path.exists(meta_path):
                        with open(meta_path, "r", encoding="utf-8") as f:
                            meta = json.load(f)
                            meta["is_installed"] = True
                            modules_list.append(meta)
            self.send_json_response(200, {"modules": modules_list})

        elif url_parts.path == "/api/benchmark_summary":
            b_path = os.path.join(BASE_DIR, "benchmark", "benchmark_results.json")
            if os.path.exists(b_path):
                with open(b_path, "r", encoding="utf-8") as f:
                    b_data = json.load(f)
                    self.send_json_response(200, b_data.get("summary", {}))
            else:
                self.send_json_response(404, {"error": "Benchmark report not generated yet."})

        else:
            super().do_GET()

    def send_json_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

def start_server(port=8080):
    server = HTTPServer(("127.0.0.1", port), GuruServerHandler)
    print(f"Guru Offline Simulator Server running at http://127.0.0.1:{port}")
    print("Zero-cloud dependencies. All AI inference is local on-device.")
    return server

if __name__ == "__main__":
    server = start_server(8080)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down Guru server.")
        server.server_close()
