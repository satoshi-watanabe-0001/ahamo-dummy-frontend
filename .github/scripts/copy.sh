#!/bin/bash
set -e

echo "🏗️ S3デプロイ用ビルド資材準備開始..."

echo "📦 依存関係インストール中..."
npm ci

echo "🏗️ アプリケーションビルド中..."
npm run build

if [ -d "dist" ]; then
    echo "✅ ビルド成果物確認: dist/ディレクトリが生成されました"
    ls -la dist/
else
    echo "❌ エラー: dist/ディレクトリが見つかりません"
    exit 1
fi

echo "✅ S3デプロイ用ビルド資材準備完了"
