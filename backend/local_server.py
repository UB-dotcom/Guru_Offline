"""
Local OfflineTutorAI HTTP Bridge Server

Provides zero-dependency loopback HTTP API for React Native mobile frontend:
- POST /ask_tutor
- POST /api/tutor/ask
- GET /health
- GET /api/curricula/published

Runs 100% offline with SQLite FTS5 curriculum retrieval.
"""

import os
import sys
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from OfflineTutorAI.service import TutorService
from OfflineTutorAI.api.services.tutor_api import TutorAPIService

# Initialize backend services
tutor_service = TutorService()
api_service = TutorAPIService()


class LocalTutorHandler(BaseHTTPRequestHandler):

    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        if self.path in ('/', '/health'):
            self._set_headers(200)
            payload = {
                "status": "healthy",
                "service": "OfflineTutorAI",
                "mode": "100% On-Device Offline RAG",
                "database": "SQLite FTS5 Active"
            }
            self.wfile.write(json.dumps(payload).encode('utf-8'))
            return

        if self.path == '/api/curricula/published':
            self._set_headers(200)
            try:
                packages = api_service.get_available_published_curricula()
                self.wfile.write(json.dumps(packages).encode('utf-8'))
            except Exception as e:
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)

        try:
            data = json.loads(body.decode('utf-8')) if body else {}
        except Exception:
            self._set_headers(400)
            self.wfile.write(json.dumps({"error": "Invalid JSON body"}).encode('utf-8'))
            return

        # /ask_tutor (Standard React Native integration endpoint)
        if self.path in ('/ask_tutor', '/api/tutor/ask'):
            question = data.get('question', '')
            subject = data.get('subject')
            language = data.get('language', 'en')
            conversation_history = data.get('conversation_history', [])

            if not question:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Question is required"}).encode('utf-8'))
                return

            try:
                result = tutor_service.ask_tutor(
                    question=question,
                    subject=subject,
                    language=language,
                    conversation_history=conversation_history
                )

                response_payload = {
                    "answer": result.answer,
                    "sources": result.sources,
                    "retrieved_chunks": [c.to_dict() for c in result.retrieved_chunks] if hasattr(result, 'retrieved_chunks') else [],
                    "safety_status": result.safety_status,
                    "latency_ms": result.latency_ms,
                    "is_offline": True,
                    "engine": "OfflineTutorAI (SQLite FTS5 + SLM)"
                }

                self._set_headers(200)
                self.wfile.write(json.dumps(response_payload).encode('utf-8'))
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

    def log_message(self, format, *args):
        # Concise logging
        sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")


def run_server(host='0.0.0.0', port=8080):
    server = HTTPServer((host, port), LocalTutorHandler)
    print(f"============================================================")
    print(f"   OfflineTutorAI Local Bridge Server Running on port {port}")
    print(f"   • Localhost:       http://127.0.0.1:{port}/ask_tutor")
    print(f"   • Android Emulator: http://10.0.2.2:{port}/ask_tutor")
    print(f"   • Health Check:     http://127.0.0.1:{port}/health")
    print(f"   • 100% Offline:    Zero Cloud API Dependency")
    print(f"============================================================")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping OfflineTutorAI server.")
        server.server_close()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    run_server(port=port)
