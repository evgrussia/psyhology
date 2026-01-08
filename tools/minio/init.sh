#!/bin/sh
set -eu

MC="/usr/bin/mc"
ALIAS_NAME="local"
MINIO_HOST="${MINIO_HOST:-http://minio:9000}"
MINIO_ROOT_USER="${MINIO_ROOT_USER:-minioadmin}"
MINIO_ROOT_PASSWORD="${MINIO_ROOT_PASSWORD:-minioadmin}"

echo "Configuring MinIO alias..."
$MC alias set "$ALIAS_NAME" "$MINIO_HOST" "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" >/dev/null 2>&1 || true

echo "Waiting for MinIO to be ready..."
attempt=0
until $MC ls "$ALIAS_NAME" >/dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ "$attempt" -gt 60 ]; then
    echo "MinIO is not ready after 60s"
    exit 1
  fi
  sleep 1
done

ensure_bucket() {
  bucket="$1"
  echo "Ensuring bucket: $bucket"
  $MC mb --ignore-existing "$ALIAS_NAME/$bucket" >/dev/null

  # Public read for direct GET via generated public URL
  $MC anonymous set download "$ALIAS_NAME/$bucket" >/dev/null

  # CORS for browser uploads via pre-signed URLs
  $MC cors set "$ALIAS_NAME/$bucket" /minio-init/cors.json >/dev/null
}

ensure_bucket "emotional-balance-media"
ensure_bucket "emotional-balance-audio"

echo "MinIO initialization completed."

