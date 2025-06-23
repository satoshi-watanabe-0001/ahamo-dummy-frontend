import { test, expect } from '@playwright/test';

test.describe('統合購入フロー E2E テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('正常系: 統合購入フローの完全実行', async ({ page }) => {
    await page.click('text=統合購入フロー (10ステップ)');
    
    await expect(page.locator('h2')).toContainText('契約タイプを選択してください');
    
    await page.click('input[value="new"]');
    await page.click('text=次へ進む');
    
    await expect(page.locator('h2')).toContainText('利用状況をお聞かせください');
    
    await page.click('input[value="3-7GB"]');
    await page.click('input[value="少ない"]');
    await page.click('input[value="個人利用"]');
    await page.click('text=次へ進む');
    
    await expect(page.locator('h2')).toContainText('プラン選択');
    
    await page.click('input[value="basic"]');
    await page.click('text=次へ進む');
    
    await expect(page.locator('h2')).toContainText('端末を選択してください');
    
    await expect(page.locator('.device-catalog')).toBeVisible();
  });

  test('バリデーション: 必須項目未選択時のエラー表示', async ({ page }) => {
    await page.click('text=統合購入フロー (10ステップ)');
    
    await page.click('text=次へ進む');
    
    await expect(page.locator('.error-message')).toBeVisible();
  });

  test('API統合: バックエンドとの通信確認', async ({ page }) => {
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/v1/devices') && response.status() === 200
    );
    
    await page.click('text=統合購入フロー (10ステップ)');
    await page.click('input[value="new"]');
    await page.click('text=次へ進む');
    await page.click('input[value="3-7GB"]');
    await page.click('input[value="少ない"]');
    await page.click('input[value="個人利用"]');
    await page.click('text=次へ進む');
    await page.click('input[value="basic"]');
    await page.click('text=次へ進む');
    
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });

  test('レスポンシブ対応: モバイル表示での動作確認', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.click('text=統合購入フロー (10ステップ)');
    
    await expect(page.locator('h2')).toContainText('契約タイプを選択してください');
    await expect(page.locator('.progress-bar')).toBeVisible();
  });
});
