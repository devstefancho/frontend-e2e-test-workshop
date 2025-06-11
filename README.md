# E2E Workshop

## 샘플 코드

```bash
cd playwright-init/ # Playwright Test
npx playwright test --ui


cd my-react-app/ # Reactflow Test
pnpm install
pnpm run dev
```

## Playwright MCP

open `https://github.com/microsoft/playwright-mcp` page

MCP 등록하기
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--vision"
      ]
    }
  }
}
```

MCP 실행을 위한 프롬프트 예시
```
Prompt 1 : localhost:5173 페이지를 열어서 테스트를 하면 좋은 케이스를 3개만 확인해줘

Prompt 2 : 너가 확인한 3개의 테스트를 진행해줘

Prompt 3 : 테스트를 기반으로 playwright 코드를 작성해줘
```

## Playwright Chrome Extension

Playwright CRX : `https://chromewebstore.google.com/detail/playwright-crx/jambeljnbnfbkcpnoiaedcabbgmnnlcd`

## 워크숍 슬라이드

```bash
open ./e2e-workshop-slides.html
```

## 워크숍 상세내용

```bash
open ./workshop-guide.md
```
