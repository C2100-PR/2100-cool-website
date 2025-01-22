#!/bin/bash

# Force deploy to us-west1
gcloud run deploy zena-service \
  --image gcr.io/zena-harris-works/zena-app \
  --platform managed \
  --region us-west1 \
  --allow-unauthenticated \
  --min-instances 1 \
  --memory 1Gi \
  --timeout 3600 \
  --port 3000

# Verify health check
gcloud compute health-checks update http lb-for-warp-drive \
  --check-interval 10s \
  --healthy-threshold 1 \
  --timeout 5s \
  --unhealthy-threshold 2