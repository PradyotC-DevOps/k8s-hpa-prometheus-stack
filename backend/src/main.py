# src/main.py
from flask import Flask, jsonify
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
CORS(app) # Allow Vite frontend to talk to Flask

# Automatically tracks request counts, latencies, etc.
metrics = PrometheusMetrics(app)

# Static information as metric
metrics.info('app_info', 'Application info', version='1.0.0')

@app.route('/api/ping')
def ping():
    # A simple endpoint for the frontend to hit and generate load
    return jsonify({"status": "success", "message": "pong"})

if __name__ == '__main__':
    # We won't actually use this block because we are using Gunicorn, 
    # but it's good practice to keep for local non-docker testing.
    app.run(host='0.0.0.0', port=5000)