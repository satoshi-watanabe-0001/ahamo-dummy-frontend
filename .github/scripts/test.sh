#!/bin/bash
set -e

echo "🧪 フロントエンドテスト実行開始..."

echo "📦 依存関係インストール中..."
npm ci

echo "📋 ESLintチェック実行中..."
if npm run lint; then
    echo "✅ ESLintチェック成功"
else
    echo "⚠️ ESLintチェックでエラーが発生しましたが、処理を継続します"
fi

echo "🔍 TypeScript型チェック実行中..."
if npx tsc --noEmit; then
    echo "✅ TypeScript型チェック成功"
else
    echo "⚠️ TypeScript型チェックでエラーが発生しましたが、処理を継続します"
fi

echo "🧪 単体テスト実行中..."
npm run test

echo "📊 テストカバレッジ生成中..."
npm run test:coverage

echo "✅ フロントエンドテスト完了"
