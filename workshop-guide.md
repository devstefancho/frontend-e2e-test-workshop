# E2E 테스트 워크샵 진행 가이드

## 🎯 워크샵 개요

- **목적**: ReactFlow를 사용하는 프로젝트에 E2E 테스트 완성하기
- **시간**: 3시간 (08:30 - 11:30)
- **참가자**: 프론트엔드 개발자 3명
- **준비물**: 노트북, 다과 (☕ 커피, 🍪 쿠키, 🍰 케이크)

## 📋 사전 준비사항

### 환경 설정
```bash
# React 프로젝트 생성 (Vite 사용)
npm create vite@latest reactflow-e2e-demo -- --template react-ts
cd reactflow-e2e-demo

# 필요한 패키지 설치
npm install reactflow
npm install -D @playwright/test

# Playwright 초기화
npm init playwright@latest

# AI 도구 설정
# Playwright MCP 활용을 위한 Claude Desktop 앱 준비
```

### 필요한 VS Code 확장 프로그램
- Playwright Test for VSCode
- GitHub Copilot (선택사항)

## 🚀 세션별 진행 가이드

### 1. 오프닝 & 아이스브레이킹 (08:30-08:45)

#### 진행 방법
1. **환영 인사와 다과 준비**
   - 아침 커피와 함께 편안한 분위기 조성
   - 각자 좋아하는 간식 선택하며 대화

2. **"테스트를 미루는 이유" 공유**
   - 각자 포스트잇에 적기
   - 화이트보드에 붙이며 공유
   - 공감대 형성

3. **오늘의 목표 선언**
   ```
   "오늘 우리는 ReactFlow E2E 테스트를 완성하고,
   테스트 작성이 즐거운 개발 문화를 만듭니다!"
   ```

### 2. E2E 테스트의 가치와 Playwright 소개 (08:45-09:10)

#### 핵심 메시지
- 테스트는 '귀찮은 일'이 아닌 '투자'
- 한 번 작성하면 영원히 우리를 지켜주는 수호천사

#### 실제 사례 공유
```javascript
// 실제로 버그를 잡은 테스트 예시
test('노드 삭제 시 연결선도 함께 삭제되어야 함', async ({ page }) => {
  // 이 테스트가 프로덕션 장애를 막았습니다!
});
```

#### Playwright 장점 데모
- 자동 대기 기능
- 스크린샷/비디오 녹화
- 멀티 브라우저 지원

### 3. 샘플 앱 세팅 (09:10-09:25)

#### ReactFlow 샘플 앱 만들기
참가자들이 슬라이드의 코드를 복사해서 직접 세팅하도록 안내:

1. 새 React 프로젝트 생성 (Vite 추천)
2. ReactFlow 설치
3. App.tsx 코드 복사 붙여넣기
4. API 모킹 설정
5. 로컬에서 실행 확인

### 4. 핸즈온 1: 기본 설정과 첫 테스트 (09:25-09:55)

#### Step 1: Playwright 설정
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

#### Step 2: 첫 번째 테스트 작성
```typescript
// tests/reactflow-basic.spec.ts
import { test, expect } from '@playwright/test';

test('ReactFlow 캔버스가 표시되어야 함', async ({ page }) => {
  await page.goto('/');
  
  const canvas = page.locator('.react-flow__renderer');
  await expect(canvas).toBeVisible();
});
```

#### Step 3: AI 도구 활용하기
```bash
# Playwright MCP 사용 예시
"캔버스에 노드를 추가하는 테스트를 작성해줘"
```

### 5. 휴식 시간 (09:55-10:05)
- ☕ 커피 리필
- 🍪 간식 타임
- 질문 및 네트워킹

### 6. 핸즈온 2: ReactFlow 핵심 기능 테스트 (10:05-10:45)

#### 구현할 테스트 목록

##### 1. Drag & Drop 테스트
```typescript
test('노드를 드래그하여 이동할 수 있어야 함', async ({ page }) => {
  await page.goto('/');
  
  // 노드 추가
  await page.click('[data-testid="add-node-button"]');
  
  // 노드 선택 및 드래그
  const node = page.locator('[data-id="node-1"]');
  const initialBox = await node.boundingBox();
  
  await node.dragTo(page.locator('.react-flow__renderer'), {
    targetPosition: { x: 300, y: 200 }
  });
  
  // 위치 변경 확인
  const movedBox = await node.boundingBox();
  expect(movedBox.x).not.toBe(initialBox.x);
});
```

##### 2. Node 연결 테스트
```typescript
test('두 노드를 연결할 수 있어야 함', async ({ page }) => {
  await page.goto('/');
  
  // 두 개의 노드 추가
  await page.click('[data-testid="add-node-button"]');
  await page.click('[data-testid="add-node-button"]');
  
  // 첫 번째 노드의 source handle에서 시작
  const sourceHandle = page.locator('[data-id="node-1"] .source');
  const targetHandle = page.locator('[data-id="node-2"] .target');
  
  await sourceHandle.dragTo(targetHandle);
  
  // 연결선 확인
  const edge = page.locator('.react-flow__edge');
  await expect(edge).toBeVisible();
});
```

##### 3. 상태 검증 테스트
```typescript
test('연결된 노드 정보가 올바르게 저장되어야 함', async ({ page }) => {
  // ... 노드 추가 및 연결 ...
  
  // 저장 버튼 클릭
  await page.click('[data-testid="save-button"]');
  
  // alert 메시지 확인 (실제 프로젝트에서는 toast나 API 확인)
  page.on('dialog', dialog => {
    expect(dialog.message()).toBe('저장되었습니다!');
    dialog.accept();
  });
});
```

### 7. 핸즈온 3: 통합 시나리오 (10:45-11:10)

#### 전체 플로우 테스트
```typescript
test('전체 워크플로우: 노드 생성부터 저장까지', async ({ page }) => {
  await page.goto('/');
  
  // 1. 노드 3개 추가
  for (let i = 0; i < 3; i++) {
    await page.click('[data-testid="add-node-button"]');
    await page.waitForTimeout(500); // 애니메이션 대기
  }
  
  // 2. 노드 위치 조정 (삼각형 형태로 배치)
  await page.locator('[data-id="node-1"]').dragTo(page.locator('.react-flow__renderer'), {
    targetPosition: { x: 250, y: 100 }
  });
  await page.locator('[data-id="node-2"]').dragTo(page.locator('.react-flow__renderer'), {
    targetPosition: { x: 150, y: 300 }
  });
  await page.locator('[data-id="node-3"]').dragTo(page.locator('.react-flow__renderer'), {
    targetPosition: { x: 350, y: 300 }
  });
  
  // 3. 노드 연결 (1→2, 1→3)
  const connections = [
    { source: 'node-1', target: 'node-2' },
    { source: 'node-1', target: 'node-3' }
  ];
  
  for (const { source, target } of connections) {
    const sourceHandle = page.locator(`[data-id="${source}"] .source`);
    const targetHandle = page.locator(`[data-id="${target}"] .target`);
    await sourceHandle.dragTo(targetHandle);
  }
  
  // 4. 저장 및 검증
  page.on('dialog', dialog => {
    expect(dialog.message()).toBe('저장되었습니다!');
    dialog.accept();
  });
  
  await page.click('[data-testid="save-button"]');
  
  // 스크린샷 저장 (선택사항)
  await page.screenshot({ path: 'tests/screenshots/complete-flow.png' });
});
```

#### CI/CD 통합 설정
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
      
    - name: Run E2E tests
      run: npx playwright test
      
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### 8. 마무리 & 액션 플랜 (11:10-11:30)

#### 테스트 문화 정착을 위한 팀 규칙

1. **PR 규칙**
   - 새로운 기능 = 새로운 테스트
   - 버그 수정 = 회귀 테스트 추가

2. **테스트 작성 팁**
   - 페어 프로그래밍으로 테스트 작성
   - AI 도구 적극 활용
   - 테스트 코드 리뷰 필수

3. **목표 설정**
   - 1주차: 핵심 기능 테스트 커버리지 50%
   - 2주차: 70%
   - 1개월: 90% 달성

4. **동기부여 시스템**
   - 주간 "Best Test Writer" 선정
   - 테스트로 버그를 잡으면 팀 채널에 공유
   - 월간 테스트 커버리지 달성 시 회식

## 💡 추가 팁과 트릭

### 디버깅 팁
```bash
# 헤드리스 모드 끄고 실행
npx playwright test --headed

# 특정 테스트만 실행
npx playwright test -g "노드 연결"

# 디버그 모드
npx playwright test --debug
```

### 유용한 Playwright 명령어
```typescript
// 네트워크 요청 모킹
await page.route('**/api/nodes', async route => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({ nodes: mockNodes })
  });
});

// 콘솔 로그 확인
page.on('console', msg => console.log(msg.text()));

// 대기 전략
await page.waitForLoadState('networkidle');
await page.waitForSelector('.node', { state: 'visible' });
```

### AI 도구 활용 예시
```
프롬프트 예시:
"ReactFlow에서 노드를 선택하고 Delete 키를 눌러 삭제하는 테스트를 작성해줘"
"두 노드 사이의 연결선을 클릭하여 삭제하는 테스트가 필요해"
"노드의 텍스트를 더블클릭하여 편집하는 시나리오를 테스트하고 싶어"
```

## 📚 참고 자료

- [Playwright 공식 문서](https://playwright.dev)
- [ReactFlow 테스팅 가이드](https://reactflow.dev/docs/guides/testing/)
- [E2E 테스트 베스트 프랙티스](https://testingjavascript.com/)

## 🎉 워크샵 후 과제

1. 각자 하나씩 새로운 테스트 시나리오 작성해보기
2. 다음 주 코드 리뷰 시간에 공유
3. 팀 블로그에 오늘 배운 내용 정리하여 포스팅

---

**Remember**: 테스트는 미래의 나와 동료를 위한 선물입니다! 🎁선언**
   ```
   "오늘 우리는 ReactFlow E2E 테스트를 완성하고,
   테스트 작성이 즐거운 개발 문화를 만듭니다!"
   ```

### 2. E2E 테스트의 가치와 Playwright 소개 (14:20-14:50)

#### 핵심 메시지
- 테스트는 '귀찮은 일'이 아닌 '투자'
- 한 번 작성하면 영원히 우리를 지켜주는 수호천사

#### 실제 사례 공유
```javascript
// 실제로 버그를 잡은 테스트 예시
test('노드 삭제 시 연결선도 함께 삭제되어야 함', async ({ page }) => {
  // 이 테스트가 프로덕션 장애를 막았습니다!
});
```

#### Playwright 장점 데모
- 자동 대기 기능
- 스크린샷/비디오 녹화
- 멀티 브라우저 지원

### 3. 핸즈온 1: 기본 설정과 첫 테스트 (14:50-15:30)

#### Step 1: Playwright 설정
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

#### Step 2: 첫 번째 테스트 작성
```typescript
// tests/reactflow-basic.spec.ts
import { test, expect } from '@playwright/test';

test('ReactFlow 캔버스가 표시되어야 함', async ({ page }) => {
  await page.goto('/flow-editor');
  
  const canvas = page.locator('.react-flow__renderer');
  await expect(canvas).toBeVisible();
});
```

#### Step 3: AI 도구 활용하기
```bash
# Playwright MCP 사용 예시
"캔버스에 노드를 추가하는 테스트를 작성해줘"
```

### 4. 핸즈온 2: ReactFlow 핵심 기능 테스트 (15:40-16:30)

#### 구현할 테스트 목록

##### 1. Drag & Drop 테스트
```typescript
test('노드를 드래그하여 이동할 수 있어야 함', async ({ page }) => {
  await page.goto('/flow-editor');
  
  // 노드 추가
  await page.click('[data-testid="add-node-button"]');
  
  // 노드 선택 및 드래그
  const node = page.locator('[data-id="node-1"]');
  const initialBox = await node.boundingBox();
  
  await node.dragTo(page.locator('.react-flow__renderer'), {
    targetPosition: { x: 300, y: 200 }
  });
  
  // 위치 변경 확인
  const movedBox = await node.boundingBox();
  expect(movedBox.x).not.toBe(initialBox.x);
});
```

##### 2. Node 연결 테스트
```typescript
test('두 노드를 연결할 수 있어야 함', async ({ page }) => {
  await page.goto('/flow-editor');
  
  // 두 개의 노드 추가
  await page.click('[data-testid="add-node-button"]');
  await page.click('[data-testid="add-node-button"]');
  
  // 첫 번째 노드의 source handle에서 시작
  const sourceHandle = page.locator('[data-id="node-1"] .source-handle');
  const targetHandle = page.locator('[data-id="node-2"] .target-handle');
  
  await sourceHandle.dragTo(targetHandle);
  
  // 연결선 확인
  const edge = page.locator('.react-flow__edge');
  await expect(edge).toBeVisible();
});
```

##### 3. 상태 검증 테스트
```typescript
test('연결된 노드 정보가 올바르게 저장되어야 함', async ({ page }) => {
  // ... 노드 추가 및 연결 ...
  
  // 저장 버튼 클릭
  await page.click('[data-testid="save-button"]');
  
  // API 호출 확인
  const saveResponse = await page.waitForResponse(
    response => response.url().includes('/api/save-flow')
  );
  
  const savedData = await saveResponse.json();
  expect(savedData.nodes).toHaveLength(2);
  expect(savedData.edges).toHaveLength(1);
});
```

### 5. 핸즈온 3: 통합 시나리오 (16:30-16:50)

#### 전체 플로우 테스트
```typescript
test('전체 워크플로우: 노드 생성부터 저장까지', async ({ page }) => {
  await page.goto('/flow-editor');
  
  // 1. 노드 3개 추가
  for (let i = 0; i < 3; i++) {
    await page.click('[data-testid="add-node-button"]');
    await page.waitForTimeout(500); // 애니메이션 대기
  }
  
  // 2. 노드 위치 조정 (삼각형 형태로 배치)
  await page.locator('[data-id="node-1"]').dragTo(page.locator('.react-flow__renderer'), {
    targetPosition: { x: 250, y: 100 }
  });
  await page.locator('[data-id="node-2"]').dragTo(page.locator('.react-flow__renderer'), {
    targetPosition: { x: 150, y: 300 }
  });
  await page.locator('[data-id="node-3"]').dragTo(page.locator('.react-flow__renderer'), {
    targetPosition: { x: 350, y: 300 }
  });
  
  // 3. 노드 연결 (1→2, 1→3, 2→3)
  const connections = [
    { source: 'node-1', target: 'node-2' },
    { source: 'node-1', target: 'node-3' },
    { source: 'node-2', target: 'node-3' }
  ];
  
  for (const { source, target } of connections) {
    const sourceHandle = page.locator(`[data-id="${source}"] .source-handle`);
    const targetHandle = page.locator(`[data-id="${target}"] .target-handle`);
    await sourceHandle.dragTo(targetHandle);
  }
  
  // 4. 저장 및 검증
  await page.click('[data-testid="save-button"]');
  
  // 성공 메시지 확인
  await expect(page.locator('.success-toast')).toContainText('저장되었습니다');
  
  // 저장된 데이터 검증
  const response = await page.waitForResponse(
    res => res.url().includes('/api/save-flow') && res.status() === 200
  );
  
  const savedData = await response.json();
  expect(savedData.nodes).toHaveLength(3);
  expect(savedData.edges).toHaveLength(3);
});
```

#### CI/CD 통합 설정
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
      
    - name: Run E2E tests
      run: npx playwright test
      
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### 6. 마무리 & 액션 플랜 (16:50-17:00)

#### 테스트 문화 정착을 위한 팀 규칙

1. **PR 규칙**
   - 새로운 기능 = 새로운 테스트
   - 버그 수정 = 회귀 테스트 추가

2. **테스트 작성 팁**
   - 페어 프로그래밍으로 테스트 작성
   - AI 도구 적극 활용
   - 테스트 코드 리뷰 필수

3. **목표 설정**
   - 1주차: 핵심 기능 테스트 커버리지 50%
   - 2주차: 70%
   - 1개월: 90% 달성

4. **동기부여 시스템**
   - 주간 "Best Test Writer" 선정
   - 테스트로 버그를 잡으면 팀 채널에 공유
   - 월간 테스트 커버리지 달성 시 회식

## 💡 추가 팁과 트릭

### 디버깅 팁
```bash
# 헤드리스 모드 끄고 실행
npx playwright test --headed

# 특정 테스트만 실행
npx playwright test -g "노드 연결"

# 디버그 모드
npx playwright test --debug
```

### 유용한 Playwright 명령어
```typescript
// 네트워크 요청 모킹
await page.route('**/api/nodes', async route => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({ nodes: mockNodes })
  });
});

// 콘솔 로그 확인
page.on('console', msg => console.log(msg.text()));

// 대기 전략
await page.waitForLoadState('networkidle');
await page.waitForSelector('.node', { state: 'visible' });
```

### AI 도구 활용 예시
```
프롬프트 예시:
"ReactFlow에서 노드를 선택하고 Delete 키를 눌러 삭제하는 테스트를 작성해줘"
"두 노드 사이의 연결선을 클릭하여 삭제하는 테스트가 필요해"
"노드의 텍스트를 더블클릭하여 편집하는 시나리오를 테스트하고 싶어"
```

## 📚 참고 자료

- [Playwright 공식 문서](https://playwright.dev)
- [ReactFlow 테스팅 가이드](https://reactflow.dev/docs/guides/testing/)
- [E2E 테스트 베스트 프랙티스](https://testingjavascript.com/)

## 🎉 워크샵 후 과제

1. 각자 하나씩 새로운 테스트 시나리오 작성해보기
2. 다음 주 코드 리뷰 시간에 공유
3. 팀 블로그에 오늘 배운 내용 정리하여 포스팅

---

**Remember**: 테스트는 미래의 나와 동료를 위한 선물입니다! 🎁
