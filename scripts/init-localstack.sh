#!/bin/sh
set -e

ENDPOINT="http://localstack:4566"

echo "Waiting for LocalStack to be ready..."
until curl -sf "$ENDPOINT/_localstack/health" > /dev/null 2>&1; do
  sleep 1
done
echo "LocalStack is ready."

echo "Creating S3 buckets..."
aws --endpoint-url="$ENDPOINT" s3 mb s3://capiro-documents-dev 2>/dev/null || echo "Bucket capiro-documents-dev already exists"
aws --endpoint-url="$ENDPOINT" s3 mb s3://capiro-exports-dev 2>/dev/null || echo "Bucket capiro-exports-dev already exists"

echo "Creating SQS FIFO queues..."
aws --endpoint-url="$ENDPOINT" sqs create-queue \
  --queue-name document-ingestion.fifo \
  --attributes FifoQueue=true,ContentBasedDeduplication=true \
  2>/dev/null || echo "Queue document-ingestion.fifo already exists"

aws --endpoint-url="$ENDPOINT" sqs create-queue \
  --queue-name submission-generation.fifo \
  --attributes FifoQueue=true,ContentBasedDeduplication=true \
  2>/dev/null || echo "Queue submission-generation.fifo already exists"

aws --endpoint-url="$ENDPOINT" sqs create-queue \
  --queue-name notification.fifo \
  --attributes FifoQueue=true,ContentBasedDeduplication=true \
  2>/dev/null || echo "Queue notification.fifo already exists"

echo ""
echo "=== LocalStack resources initialized ==="
echo "S3 Buckets:"
aws --endpoint-url="$ENDPOINT" s3 ls
echo ""
echo "SQS Queues:"
aws --endpoint-url="$ENDPOINT" sqs list-queues
echo ""
echo "Done."
