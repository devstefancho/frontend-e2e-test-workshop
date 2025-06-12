import { test, expect } from "@playwright/test";

test.describe("커스텀 노드 플로우 애플리케이션", () => {
  test("초기 페이지 로드 및 UI 요소 테스트", async ({ page }) => {
    // 애플리케이션으로 이동
    await page.goto("http://localhost:5173/");

    // 페이지 제목 확인
    await expect(page).toHaveTitle("Vite + React + TS");

    // 메인 헤딩이 보이는지 확인
    await expect(page.locator("text=Custom Node Flow")).toBeVisible();

    // 노드 1이 초기 텍스트 'hello'와 함께 존재하는지 확인
    const node1Input = page.getByRole("textbox").first();
    await expect(node1Input).toBeVisible();
    await expect(node1Input).toHaveValue("hello");

    // 노드 2가 초기 텍스트 'world'와 함께 존재하는지 확인
    const node2Input = page.getByRole("textbox").nth(1);
    await expect(node2Input).toBeVisible();
    await expect(node2Input).toHaveValue("world");

    // 대문자 변환 노드가 보이는지 확인
    await expect(page.locator("text=uppercase transform")).toBeVisible();

    // 들어오는 텍스트 패널이 초기값을 보여주는지 확인
    await expect(page.locator("text=incoming texts:")).toBeVisible();
    await expect(page.locator("text=HELLO")).toBeVisible();
    await expect(page.locator("text=world")).toBeVisible();

    // 노드들이 존재하는지 확인 (노드 컨테이너 체크)
    await expect(page.locator("text=node 1")).toBeVisible();
    await expect(page.locator("text=node 2")).toBeVisible();
  });

  test("노드 입력 텍스트 업데이트 테스트", async ({ page }) => {
    // 애플리케이션으로 이동
    await page.goto("http://localhost:5173/");

    // 페이지가 완전히 로드될 때까지 대기
    await expect(page.locator("text=Custom Node Flow")).toBeVisible();

    // 첫 번째 노드 입력 필드를 클릭하고 텍스트 업데이트
    const node1Input = page.locator('input[value="hello"]').first();
    await node1Input.click();
    await page.keyboard.press("Control+a");
    await node1Input.fill("testing");

    // 들어오는 텍스트 패널이 'TESTING'(대문자 변환)을 보여주는지 확인
    await expect(page.locator("text=TESTING")).toBeVisible();

    // 두 번째 노드 입력 필드를 클릭하고 텍스트 업데이트
    const node2Input = page.locator('input[value="world"]').first();
    await node2Input.click();
    await page.keyboard.press("Control+a");
    await node2Input.fill("application");

    // 들어오는 텍스트 패널이 'TESTING'과 'application' 모두 보여주는지 확인
    await expect(page.locator("text=TESTING")).toBeVisible();
    await expect(page.locator("text=application")).toBeVisible();

    // 입력 필드들이 업데이트되었는지 확인
    await expect(page.locator('input[value="testing"]')).toBeVisible();
    await expect(page.locator('input[value="application"]')).toBeVisible();
  });

  test("실시간 텍스트 변환 테스트", async ({ page }) => {
    // 애플리케이션으로 이동
    await page.goto("http://localhost:5173/");

    // 초기 로드 대기
    await expect(page.locator("text=Custom Node Flow")).toBeVisible();

    // 실시간 업데이트를 확인하기 위해 여러 번 텍스트 변경 테스트
    const node1Input = page.getByRole("textbox").first();

    // 테스트 케이스 1: 'react'로 변경
    await node1Input.click();
    await page.keyboard.press("Control+a");
    await node1Input.fill("react");
    await expect(
      page.locator('[data-testid="rf__node-4"]').locator("text=REACT"),
    ).toBeVisible();

    // 테스트 케이스 2: 'playwright'로 변경
    await node1Input.click();
    await page.keyboard.press("Control+a");
    await node1Input.fill("playwright");
    await expect(
      page.locator('[data-testid="rf__node-4"]').locator("text=PLAYWRIGHT"),
    ).toBeVisible();

    // 이전 텍스트가 더 이상 보이지 않는지 확인
    await expect(
      page.getByTestId("rf__node-4").locator("text=REACT"),
    ).not.toBeVisible();

    // 두 번째 노드도 테스트
    const node2Input = page.locator("input").nth(1);
    await node2Input.click();
    await page.keyboard.press("Control+a");
    await node2Input.fill("testing");

    // 두 노드의 출력이 모두 보이는지 확인
    await expect(
      page.locator('[data-testid="rf__node-4"]').locator("text=PLAYWRIGHT"),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="rf__node-4"]').locator("text=testing"),
    ).toBeVisible();
  });
});
