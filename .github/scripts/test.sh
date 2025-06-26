#!/bin/bash
set -e

echo "🧪 フロントエンドテスト実行中..."

echo "📦 依存関係インストール中..."
npm ci

echo "📋 ESLintチェック実行中..."
if npm run lint; then
    echo "✅ ESLintチェック完了"
else
    echo "⚠️ ESLintチェックでエラーが発生しましたが、処理を継続します"
fi

echo "🔍 TypeScript型チェック実行中..."
npx tsc --noEmit --skipLibCheck

echo "🧪 単体テスト実行中（E2Eテストを除外）..."
npx vitest run --exclude="tests/e2e/**"

echo "📊 テストカバレッジ生成中..."
npx vitest run --coverage --exclude="tests/e2e/**"

echo "✅ すべてのテストが完了しました"
