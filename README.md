# 🎨 Visual Grid Regional Prompt Studio (Web Pro)
### 📐 AI 비주얼 공간 분할 & 캐릭터 설정화 인터랙티브 프롬프트 생성기

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Web_%7C_Chrome_%7C_Edge_%7C_Safari_%7C_Mobile-blue?logo=html5)
[![Live Demo](https://img.shields.io/badge/Online_App-Live_Demo_Running-success?logo=github)](https://solokjd-eng.github.io/Visual-Grid-Prompt-Web/)
[![Download](https://img.shields.io/badge/Download-Single_File_HTML-brightgreen?logo=download)](https://github.com/solokjd-eng/Visual-Grid-Prompt-Web/releases/latest)
[![ComfyUI Node](https://img.shields.io/badge/ComfyUI_Node-ComfyUI--Visual--Regional--Prompt-orange?logo=python)](https://github.com/solokjd-eng/ComfyUI-Visual-Regional-Prompt)
![License](https://img.shields.io/badge/License-MIT-green.svg)

### 🚀 [▶ 온라인 웹 사이트에서 즉시 사용하기 (Live Web App)](https://solokjd-eng.github.io/Visual-Grid-Prompt-Web/)
### 📦 [▶ 무설치 단일 파일 (Visual_Grid_Prompt.html) 다운로드](https://github.com/solokjd-eng/Visual-Grid-Prompt-Web/releases/latest)

**설치 0개, 다운로드 없이 브라우저에서 마우스 드래그로 원하는 공간 구도를 디자인하고, 최신 AI(Midjourney, Flux, Krea 2, ComfyUI, ChatGPT, Gemini, SDXL 등)에 최적화된 프롬프트를 자동 생성하는 차세대 인터랙티브 웹 도구입니다.**

[🇰🇷 한국어 설명](#-주요-기능) | [🌐 Global Multi-Language Support](#-글로벌-다국어-지원-global-browser-translate) | [English Overview](#-english-overview)

</div>

---

## 🌟 화면 구성 (UI Overview)

```text
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ 📐 Visual Grid Prompt Studio [Web Pro]   [ 🌙 다크 ]  [ 🔄 v1.0.0 ]  [ 📥 ]  [ 💾 ]  [ 🗑️ ]│
├───────────────────────────────────────────┬───────────────────────────────────────────┤
│ 캔버스 영역 (9:16 / 16:9 / 1:1 자유 분할) │ 영역 [1] 프롬프트 설정 [선택됨 (ACTIVE)]   │
│ ┌───────────────┬───────────────────────┐ │ ├───────────────────────────────────────┤ │
│ │ [1]           │ [2]                   │ │ ▼ 📁 기본 프리셋 (탐색기 트리 10대 분류) │ │
│ │   ( ⊙.⊙ )     │      (  |  )          │ │ ▼ ⭐ 나만의 프리셋 (독립 2단 드롭다운)  │ │
│ │  얼굴 정면    │   전신 마네킹 턴어라운│ │ ├───────────────────────────────────────┤ │
│ └───────────────┴───────────────────────┘ │ 한글 직접 입력 (Ctrl+Enter 로 즉시 번역)│ │
│                                           │ [ ⚙️ 커스텀 프리셋 관리 (드래그 순서정렬)▼]│
├───────────────────────────────────────────┴───────────────────────────────────────────┤
│ 5대 화풍 프리셋 (극실사/반실사/2D애니/설정화/3D CG) + 백색배경 고정 + 최종 영문 프롬프트│
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📸 핵심 기능 상세 (Key Features)

### 1. 📂 윈도우 탐색기형 샷/구도 트리 셀렉터 (Windows Explorer Tree View)
* **대분류 접이식 폴더 UI**: 평소에는 대분류 폴더만 깔끔하게 보이다가 클릭 시 윈도우 탐색기처럼 하위 소분류가 펼쳐집니다.
* **캐릭터 시트(설정화) 특화 10대 핵심 분류 탑재**:
  1. **👤 얼굴 (헤어부터 쇄골까지)**: 정면, 측면, 45도 측면, 위에서 본(하이앵글), 아래에서 본(로우앵글), 후면(뒷머리)
  2. **👁️ 얼굴 초근접 (Extreme Macro Close-up)**: 정면, 측면, 45도 측면
  3. **👚 상반신 가슴까지 (Bust Shot)**: 정면, 측면, 45도 측면, 위에서 본, 아래에서 본
  4. **👗 상반신 허리까지 (Waist Shot)**: 정면, 측면, 45도 측면, 위에서 본, 아래에서 본
  5. **✨ 가슴 클로즈업 (Chest & Neckline)**: 정면, 측면, 45도 측면, 위에서 본, 아래에서 본
  6. **🧍 전신 (Full Body Turnaround)**: 정면, 측면, 45도 측면, 후면(뒷모습 전신), 자연스러운 워킹 포즈
  7. **🦵 하반신 (엉덩이부터 다리/각선미)**: 정면, 측면, 45도 측면, 후면, 매혹적인 포즈
  8. **🍑 엉덩이부 (Hips & Buttocks)**: 골반 정면, 엉덩이 측면, 엉덩이 후면(뒷태), 아래에서 본
  9. **🖐️ 손 클로즈업 (Hands & Fingers)**: 손등, 손바닥
  10. **🦶 발 클로즈업 (Feet & Toes)**: 발등(맨발), 발바닥, 발 정면, 발 45도 측면, 발 측면
* **실시간 검색 기능**: 상단 검색창에 부위나 앵글(예: `쇄골`, `발등`, `워킹`)을 입력하면 즉시 필터링됩니다.

---

### 2. ⚡ 1:1 구도 교체 (Replace) 시스템
* 프리셋이나 구도를 변경할 때 이전 프롬프트 뒤에 쉼표로 계속 누적되지 않고, **선택한 새 구도로 캔버스 실루엣과 텍스트가 깨끗하게 1:1 즉시 교체**됩니다.

---

### 3. ⭐ 나만의 프리셋 (커스텀) 전용 드롭다운 & 관리 서랍
* **독립 2단 셀렉트**: 기본 프리셋과 섞이지 않도록 바로 아래에 나만의 커스텀 프리셋 전용 셀렉트 제공.
* **[⚙️ 커스텀 프리셋 관리] 서랍**:
  * 클릭 시 아래로 부드럽게 열리는 아코디언 드로어.
  * **마우스 드래그 앤 드롭(Drag & Drop)**으로 프리셋 순서 자유 변경.
  * `[💾 현재 입력 등록]`, `[➕ 새 프리셋 생성]`, `✏️ 수정`, `× 삭제` 지원.

---

### 4. ☀️ 라이트 모드 / 🌙 다크 모드 (고시인성 스위처)
* **화이트 스튜디오 라이트 테마**: 눈이 편안한 스튜디오 화이트 배경에 깊이 있는 딥 차콜(#0f172a) 폰트를 적용하여 **텍스트와 실루엣의 시인성을 극대화**.
* **테마 설정 영구 기억**: 브라우저를 껐다 켜도 사용자가 선택한 테마를 기억합니다.

---

### 5. ⚪ 화풍 전환 시 사용자 설정 (백색 배경 등) 영구 유지
* 극실사, 반실사, 2D 애니, 3D CG 등 화풍 버튼을 자유롭게 바꿔도, **사용자가 설정해 둔 `백색 배경 (White Backdrop)` 토글 상태가 풀리지 않고 완벽하게 고정**됩니다.

---

### 6. 🧍 신체 부위별 정밀 벡터 SVG 실루엣 뷰어
* 전신, 얼굴 초근접, 상반신, 손, 발, 엉덩이, 착석 포즈 등에 맞춰 **캔버스 내부에 정밀 벡터 SVG 실루엣이 100% 동적 렌더링**됩니다.
* 텍스트 배경을 완전 투명화하여 뒤쪽 실루엣이 가려지지 않고 선명하게 보입니다.

---

### 7. 🌐 글로벌 다국어 지원 (Global Browser Translate)
* 크롬 / 엣지 / 사파리 등의 브라우저 자동 번역 기능을 통해 **전 세계 100개국 이상의 언어(영어, 일본어, 중국어, 스페인어 등)로 모든 메뉴와 버튼이 1초 만에 자동 번역**됩니다.
* 최종 생성 프롬프트는 **전 세계 AI 표준인 '영어(English)'로 생성**되므로 글로벌 사용자 모두에게 완벽하게 호환됩니다.

---

## 🚀 시작하기 (Getting Started)

### 1) 온라인 웹 사이트에서 실행 (가장 추천 ⭐)
별도의 설치나 파일 다운로드 없이 즐겨찾기 등록 후 즉시 사용하세요:  
👉 **[https://solokjd-eng.github.io/Visual-Grid-Prompt-Web/](https://solokjd-eng.github.io/Visual-Grid-Prompt-Web/)**

### 2) 오프라인 단일 HTML 파일 다운로드
인터넷이 없는 환경에서도 사용할 수 있는 100% 무설치 단일 파일입니다:  
👉 **[Visual_Grid_Prompt.html 다운로드](https://github.com/solokjd-eng/Visual-Grid-Prompt-Web/releases/latest)**

---

## 🧩 ComfyUI 커스텀 노드 버전
ComfyUI 워크플로우 내부에서 커스텀 노드로 직접 연동하여 사용하고 싶으시다면 **[ComfyUI-Visual-Regional-Prompt](https://github.com/solokjd-eng/ComfyUI-Visual-Regional-Prompt)** 저장소를 이용해 주세요.

---

## 📄 라이선스 (License)
This project is open-sourced under the **MIT License**.
