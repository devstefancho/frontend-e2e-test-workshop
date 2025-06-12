import { test, expect } from "@playwright/test";

test("네이버에서 USB 검색", async ({ page }) => {
  // 네이버 홈페이지 접속
  await page.goto("https://www.naver.com");

  // 페이지 타이틀 확인
  await expect(page).toHaveTitle("NAVER");

  // 검색창 클릭
  const searchBox = page.locator(
    'input[placeholder*="검색어를 입력해 주세요"]',
  );
  await searchBox.click();

  // "usb" 입력
  await searchBox.fill("usb");

  // 엔터키로 검색 실행
  // await searchBox.press("Enter");

  // 검색 결과 페이지로 이동 확인
  await expect(page).toHaveURL(/search\.naver\.com.*query=usb/);

  // 검색 결과 페이지 타이틀 확인
  await expect(page).toHaveTitle(/usb.*네이버 검색/);

  // 검색 결과가 있는지 확인
  const searchResults = page.locator(
    ".list_news, .api_subject_bx, .total_wrap",
  );
  await expect(searchResults.first()).toBeVisible();

  // 스크린샷 저장 (선택사항)
  await page.screenshot({ path: "naver-usb-search.png" });
});
