import { test, expect } from "@playwright/test";

test.describe("React Flow 텍스트 변환 기능", () => {
  test("시나리오 1: 기본 대소문자 변환 테스트", async ({ page }) => {
    // Given: 페이지 로드
    await page.goto("http://localhost:5173/");

    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState("networkidle");

    // React Flow가 렌더링될 때까지 대기
    await page.waitForSelector(".react-flow", { timeout: 5000 });

    // When: 페이지 로드 시 자동으로 변환 실행됨

    // Then: 각 노드의 텍스트 내용 확인

    // node 1에 "hello"가 있는지 확인
    const node1Text = await page.locator("text=hello").first();
    await expect(node1Text).toBeVisible();

    // node 2에 "world"가 있는지 확인
    const node2Text = await page.locator("text=world").first();
    await expect(node2Text).toBeVisible();

    // uppercase transform 노드 확인
    const transformNode = await page.locator("text=uppercase transform");
    await expect(transformNode).toBeVisible();

    // incoming texts 노드에서 변환된 결과 확인
    const incomingTextsNode = await page.locator("text=incoming texts:");
    await expect(incomingTextsNode).toBeVisible();

    // "HELLO world" 텍스트가 표시되는지 확인
    const resultText = await page.locator("text=HELLO");
    await expect(resultText).toBeVisible();

    const worldText = await page.locator("text=world");
    await expect(worldText).toBeVisible();

    console.log(
      "✅ 시나리오 1 테스트 통과: 기본 대소문자 변환이 정상적으로 동작합니다.",
    );
  });

  test("시나리오 1 상세 검증: 정확한 텍스트 변환 결과 확인", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173/");
    await page.waitForLoadState("networkidle");
    await page.waitForSelector(".react-flow");

    // incoming texts 노드 영역을 더 정확하게 찾기
    const incomingTextsContainer = await page
      .locator("div")
      .filter({
        hasText: "incoming texts:",
      })
      .first();

    await expect(incomingTextsContainer).toBeVisible();

    // 해당 컨테이너 내에서 "HELLO"와 "world" 텍스트 확인
    await expect(incomingTextsContainer.locator("text=HELLO")).toBeVisible();
    await expect(incomingTextsContainer.locator("text=world")).toBeVisible();

    // 스크린샷으로 시각적 확인
    await page.screenshot({
      path: "test-results/scenario1-result.png",
      fullPage: true,
    });

    console.log(
      '✅ 상세 검증 완료: "HELLO world" 변환 결과가 올바르게 표시됩니다.',
    );
  });
});
