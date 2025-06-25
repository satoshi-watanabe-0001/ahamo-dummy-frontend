#!/bin/bash
set -e

echo "🏗️ フロントエンドビルド実行中..."

echo "🔍 TypeScript型チェック実行中..."
npx tsc --noEmit --skipLibCheck

echo "📦 Viteビルド実行中..."
npx vite build

echo "📦 S3アップロード用資材準備中..."

if [[ ! -d "dist" ]]; then
    echo "❌ distディレクトリが見つかりません"
    exit 1
fi

echo "✅ ビルド資材の準備が完了しました"
echo "📁 アップロード対象: dist/"
ls -la dist/
