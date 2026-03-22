#!/bin/bash
# Capiro — AWS Amplify Deployment Script
# Run this from your local Capiro directory:
#   bash deploy.sh
#
# Prerequisites:
#   - AWS CLI configured (aws sts get-caller-identity works)
#   - GitHub repo: neomartinez30/Capiro
#   - GitHub personal access token with repo scope

set -e

APP_NAME="capiro-web"
REGION="us-east-1"
REPO="https://github.com/neomartinez30/Capiro"
BRANCH="main"

echo "=== Capiro AWS Amplify Deployment ==="

# Step 1: Create Amplify app
echo ""
echo "Step 1: Creating Amplify app..."
APP_ID=$(aws amplify create-app \
  --name "$APP_NAME" \
  --repository "$REPO" \
  --platform WEB \
  --region "$REGION" \
  --build-spec "$(cat amplify.yml)" \
  --custom-rules '[{"source":"</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>","target":"/index.html","status":"200"}]' \
  --environment-variables "VITE_APP_ENV=production" \
  --query 'app.appId' \
  --output text 2>/dev/null) || {
    echo "Note: If the app already exists, fetching existing app ID..."
    APP_ID=$(aws amplify list-apps --region "$REGION" --query "apps[?name=='$APP_NAME'].appId" --output text)
}

if [ -z "$APP_ID" ]; then
  echo "ERROR: Could not create or find Amplify app. Check your AWS credentials."
  exit 1
fi

echo "App ID: $APP_ID"

# Step 2: Connect branch
echo ""
echo "Step 2: Connecting branch '$BRANCH'..."
aws amplify create-branch \
  --app-id "$APP_ID" \
  --branch-name "$BRANCH" \
  --stage PRODUCTION \
  --enable-auto-build \
  --region "$REGION" 2>/dev/null || echo "Branch may already be connected, continuing..."

# Step 3: Start deployment
echo ""
echo "Step 3: Starting build & deploy..."
JOB_ID=$(aws amplify start-job \
  --app-id "$APP_ID" \
  --branch-name "$BRANCH" \
  --job-type RELEASE \
  --region "$REGION" \
  --query 'jobSummary.jobId' \
  --output text)

echo "Job ID: $JOB_ID"

# Step 4: Wait for deployment
echo ""
echo "Step 4: Waiting for deployment to complete..."
while true; do
  STATUS=$(aws amplify get-job \
    --app-id "$APP_ID" \
    --branch-name "$BRANCH" \
    --job-id "$JOB_ID" \
    --region "$REGION" \
    --query 'job.summary.status' \
    --output text)

  echo "  Status: $STATUS"

  if [ "$STATUS" = "SUCCEED" ]; then
    break
  elif [ "$STATUS" = "FAILED" ] || [ "$STATUS" = "CANCELLED" ]; then
    echo "ERROR: Deployment $STATUS"
    echo "Check the Amplify console for details:"
    echo "  https://$REGION.console.aws.amazon.com/amplify/home#/$APP_ID"
    exit 1
  fi

  sleep 10
done

# Step 5: Get URL
echo ""
echo "=== Deployment Complete ==="
DEFAULT_DOMAIN=$(aws amplify get-app \
  --app-id "$APP_ID" \
  --region "$REGION" \
  --query 'app.defaultDomain' \
  --output text)

echo ""
echo "Your app is live at:"
echo "  https://$BRANCH.$DEFAULT_DOMAIN"
echo ""
echo "Amplify Console:"
echo "  https://$REGION.console.aws.amazon.com/amplify/home#/$APP_ID"
echo ""
echo "Every push to '$BRANCH' will auto-deploy."
