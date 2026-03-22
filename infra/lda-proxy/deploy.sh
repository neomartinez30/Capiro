#!/bin/bash
# Deploy the LDA proxy Lambda + Function URL
# Run from the infra/lda-proxy/ directory

set -e

FUNCTION_NAME="capiro-lda-proxy"
ROLE_ARN="arn:aws:iam::967807252336:role/capiro-lambda-role"
REGION="us-east-1"

echo "📦 Packaging Lambda..."
zip -j lda-proxy.zip index.mjs

echo "🚀 Creating Lambda function..."
aws lambda create-function \
  --function-name "$FUNCTION_NAME" \
  --runtime nodejs20.x \
  --role "$ROLE_ARN" \
  --handler index.handler \
  --timeout 15 \
  --memory-size 128 \
  --zip-file fileb://lda-proxy.zip \
  --description "CORS proxy for LDA Senate API registrant search" \
  --region "$REGION" 2>/dev/null || \
aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --zip-file fileb://lda-proxy.zip \
  --region "$REGION"

echo "🔗 Creating Function URL (public, with CORS)..."
aws lambda create-function-url-config \
  --function-name "$FUNCTION_NAME" \
  --auth-type NONE \
  --cors AllowOrigins='["https://capiro.ai","https://www.capiro.ai","http://localhost:5173"]',AllowMethods='["GET","OPTIONS"]',AllowHeaders='["Content-Type"]' \
  --region "$REGION" 2>/dev/null || \
aws lambda update-function-url-config \
  --function-name "$FUNCTION_NAME" \
  --auth-type NONE \
  --cors AllowOrigins='["https://capiro.ai","https://www.capiro.ai","http://localhost:5173"]',AllowMethods='["GET","OPTIONS"]',AllowHeaders='["Content-Type"]' \
  --region "$REGION"

echo "🔓 Adding public invoke permission..."
aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal '*' \
  --function-url-auth-type NONE \
  --region "$REGION" 2>/dev/null || echo "(Permission already exists)"

echo ""
echo "✅ Done! Get your Function URL with:"
echo "   aws lambda get-function-url-config --function-name $FUNCTION_NAME --region $REGION"
echo ""
echo "Then update src/config/integrations.js with the URL."

rm -f lda-proxy.zip
