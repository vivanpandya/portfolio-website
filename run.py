import http.server
import socketserver

from http.server import SimpleHTTPRequestHandler

class SecureHandler(SimpleHTTPRequestHandler):

    def end_headers(self):

        self.send_header(
            "X-Frame-Options",
            "DENY"
        )

        self.send_header(
            "X-Content-Type-Options",
            "nosniff"
        )

        self.send_header(
            "Referrer-Policy",
            "strict-origin-when-cross-origin"
        )

        self.send_header(
            "Permissions-Policy",
            "camera=(), microphone=(), geolocation=()"
        )

        super().end_headers()

PORT = 8080

Handler = SecureHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    httpd.serve_forever()