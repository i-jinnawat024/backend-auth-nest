#!/bin/bash

# เช็ค branch ปัจจุบันจาก environment variable ของ Vercel
BRANCH_NAME="$VERCEL_GIT_COMMIT_REF"

# เงื่อนไข: deploy เฉพาะ branch develop, main, และ release/*
if [[ "$BRANCH_NAME" == "develop" ]] || [[ "$BRANCH_NAME" == "main" ]] || [[ "$BRANCH_NAME" =~ ^release\/.*$ ]]; then
  echo "✅ Deploying branch: $BRANCH_NAME"
  exit 1  # exit 1 = build needed (deploy)
else
  echo "⏭ Skipping deploy for branch: $BRANCH_NAME"
  exit 0  # exit 0 = skip build
fi
