import { test, expect } from "@playwright/test";

test.describe("React Flow 노드 에디터 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 페이지로 이동
    await page.goto("http://localhost:5173/");
    await expect(page).toHaveTitle("Vite + React + TS");
  });

  test("노드 드래그 앤 드롭 테스트", async ({ page }) => {
    // 노드 버튼들 변수로 분리
    const inputNodeButton = page.getByText("Input Node", { exact: true });
    const defaultNodeButton = page.getByText("Default Node", { exact: true });
    const outputNodeButton = page.getByText("Output Node", { exact: true });
    const canvas = page.locator(".react-flow__pane");

    // 사이드바의 노드 버튼들이 존재하는지 확인
    await expect(inputNodeButton).toBeVisible();
    await expect(defaultNodeButton).toBeVisible();
    await expect(outputNodeButton).toBeVisible();

    // 초기 노드 개수 확인 (기본적으로 1개의 input node가 있음)
    const initialNodes = await page.locator(".react-flow__node").count();

    // Output Node를 사이드바에서 캔버스로 드래그 앤 드롭
    await outputNodeButton.dragTo(canvas, {
      targetPosition: { x: 400, y: 600 },
    });

    await page.waitForTimeout(2000);

    // 새로운 노드가 추가되었는지 확인
    const finalNodes = await page.locator(".react-flow__node").count();
    expect(finalNodes).toBe(initialNodes + 1);

    // 추가된 노드들이 올바른 텍스트를 가지고 있는지 확인
    await expect(
      page.locator(".react-flow__node").filter({ hasText: "input node" }),
    ).toHaveCount(1);
    await expect(
      page.locator(".react-flow__node").filter({ hasText: "output node" }),
    ).toHaveCount(1);
  });

  test.skip("노드 이동 테스트", async ({ page }) => {
    // 초기 노드가 존재하는지 확인
    const initialNode = page.locator(".react-flow__node").first();
    await expect(initialNode).toBeVisible();
    await expect(initialNode).toContainText("input node");

    // 초기 노드의 위치 정보 가져오기
    const initialBoundingBox = await initialNode.boundingBox();
    expect(initialBoundingBox).not.toBeNull();

    // 노드를 다른 위치로 드래그
    const canvas = page.locator(".react-flow__pane");
    await initialNode.dragTo(canvas, {
      targetPosition: { x: 800, y: 400 },
    });

    // 노드가 이동되었는지 확인 (위치가 변경되었는지)
    const newBoundingBox = await initialNode.boundingBox();
    expect(newBoundingBox).not.toBeNull();

    // 위치가 실제로 변경되었는지 확인
    if (initialBoundingBox && newBoundingBox) {
      expect(Math.abs(newBoundingBox.x - initialBoundingBox.x)).toBeGreaterThan(
        50,
      );
    }

    // 노드가 여전히 올바른 텍스트를 가지고 있는지 확인
    await expect(initialNode).toContainText("input node");

    // 추가 테스트: 여러 노드 추가 후 각각 이동
    const inputNodeButton = page.locator("text=Input Node").first();
    await inputNodeButton.dragTo(canvas, {
      targetPosition: { x: 300, y: 200 },
    });

    const outputNodeButton = page.locator("text=Output Node").first();
    await outputNodeButton.dragTo(canvas, {
      targetPosition: { x: 700, y: 600 },
    });

    // 모든 노드가 올바르게 배치되었는지 확인
    const allNodes = await page.locator(".react-flow__node").count();
    expect(allNodes).toBe(3);

    // 각 노드 타입별로 개수 확인
    await expect(
      page.locator(".react-flow__node").filter({ hasText: "input node" }),
    ).toHaveCount(2);
    await expect(
      page.locator(".react-flow__node").filter({ hasText: "output node" }),
    ).toHaveCount(1);
  });

  test.skip("노드 상호 작용 및 연결 테스트", async ({ page }) => {
    // 여러 노드 추가
    const canvas = page.locator(".react-flow__pane");

    // Input Node 추가
    const inputNodeButton = page.locator("text=Input Node").first();
    await inputNodeButton.dragTo(canvas, {
      targetPosition: { x: 200, y: 300 },
    });

    // Default Node 추가
    const defaultNodeButton = page.locator("text=Default Node").first();
    await defaultNodeButton.dragTo(canvas, {
      targetPosition: { x: 500, y: 300 },
    });

    // Output Node 추가
    const outputNodeButton = page.locator("text=Output Node").first();
    await outputNodeButton.dragTo(canvas, {
      targetPosition: { x: 800, y: 300 },
    });

    // 노드들이 정상적으로 추가되었는지 확인
    await expect(page.locator(".react-flow__node")).toHaveCount(4); // 기본 1개 + 추가 3개

    // 노드 핸들(연결점)이 존재하는지 확인
    const nodeHandles = page.locator(".react-flow__handle");
    await expect(nodeHandles.first()).toBeVisible();

    // 각 노드가 독립적으로 이동 가능한지 테스트
    const nodes = await page.locator(".react-flow__node").all();

    for (let i = 0; i < Math.min(nodes.length, 2); i++) {
      const node = nodes[i];
      const initialBox = await node.boundingBox();

      await node.dragTo(canvas, {
        targetPosition: { x: 100 + i * 150, y: 100 + i * 100 },
      });

      const newBox = await node.boundingBox();

      if (initialBox && newBox) {
        expect(Math.abs(newBox.x - initialBox.x)).toBeGreaterThan(10);
      }
    }
  });
});
