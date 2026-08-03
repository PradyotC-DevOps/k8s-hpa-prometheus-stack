FROM python:3.12-slim AS builder
WORKDIR /app
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH" PIP_NO_CACHE_DIR=1
COPY requirements.txt .
RUN pip install -r requirements.txt

FROM python:3.12-slim AS runtime
WORKDIR /app
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
COPY --from=builder /opt/venv /opt/venv
COPY src/ ./src/
USER 1000:1000
EXPOSE 5000
CMD ["gunicorn", "--workers=4", "--threads=2", "--bind=0.0.0.0:5000", "src.main:app"]