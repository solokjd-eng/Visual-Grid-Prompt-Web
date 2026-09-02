# 🎨 Visual Grid Regional Prompt Web (비주얼 그리드 프롬프트 웹)

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Web_%7C_Windows_%7C_Mac_%7C_Linux_%7C_Mobile-blue?logo=html5)
[![Live Demo](https://img.shields.io/badge/Online_App-Live_Demo_Running-success?logo=github)](https://solokjd-eng.github.io/Visual-Grid-Prompt-Web/)
[![Download](https://img.shields.io/badge/Download-Single_File_HTML-brightgreen?logo=download)](https://github.com/solokjd-eng/Visual-Grid-Prompt-Web/releases/latest)
[![ComfyUI Node](https://img.shields.io/badge/ComfyUI_Node-ComfyUI--Visual--Regional--Prompt-orange?logo=python)](https://github.com/solokjd-eng/ComfyUI-Visual-Regional-Prompt)
![License](https://img.shields.io/badge/License-MIT-green.svg)

### 🚀 [▶ 온라인 웹 사이트에서 즉시 사용하기 (Live App)](https://solokjd-eng.github.io/Visual-Grid-Prompt-Web/)
### 📦 [▶ 무설치 단독 파일 (Visual_Grid_Prompt.html) 다운로드](https://github.com/solokjd-eng/Visual-Grid-Prompt-Web/releases/latest)

**설치 없이 브라우저에서 마우스 드래그로 원하는 공간 구도를 디자인하고, 최신 AI(Krea 2, MiniMax, Flux, Midjourney, Imagen 3, ChatGPT, Gemini 등)에 최적화된 프롬프트를 자동 생성하는 인터랙티브 웹 도구**

[한국어 기능 설명](#-주요-기능) | [English Overview](#-english-overview)

</div>

---

## 🌟 화면 구성 및 주요 기능 (Overview)

```text
┌────────────────────────────────────────────────────────┐
│ 캔버스 영역 (9:16 / 16:9 / 1:1 자유 분할)              │
│ ┌───────────────┬───────────────┬────────────────────┐ │
│ │ [1]           │ [2]           │ [3]                │ │
│ │   ( ⊙.⊙ )     │   (  |  )     │    ( ─.─ )         │ │
│ │  얼굴 정면    │   전신 마네킹 │    무릎 안기       │ │
│ └───────────────┴───────────────┴────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ 우측 에디터: 5대 아트 스타일 + 커스텀 프리셋 서랍 + 실시간 번역│
└────────────────────────────────────────────────────────┘
```

---

## 📸 핵심 기능 상세 (Key Features)

### 1. 🖱️ 마우스 클릭 & 드래그 영역 생성 (Visual Grid Drag & Drop)
* 바둑판 격자 위에서 마우스로 원하는 칸을 드래그하여 즉시 직사각형 구역을 생성합니다.
* 각 구역마다 번호와 고유 네온 컬러가 부여되어 시각적으로 구도를 한눈에 파악할 수 있습니다.

### 2. 🧍 실제 생성 비율 1:1 동적 벡터 실루엣 뷰어 (Mannequin Overlay)
* **전신 (Full Body)**: 세로 칸을 위아래 96% 꽉 채우는 패션 마네킹 실루엣 렌더링.
* **얼굴 초근접 (Extreme Macro Close-up)**: 150% 매크로 줌인과 뷰파인더 브래킷 앵글.
* **얼굴 정면/측면**: 인물 바스트 85% 이상 꽉 찬 포트레이트 가이드.
* **착석 / 누운 자세**: 종횡비 맞춤 밀착 실루엣.
* 프롬프트 텍스트 배경을 완전 투명화하여 뒤쪽 실루엣이 100% 선명하게 노출됩니다.

### 3. ⭐ 나만의 커스텀 프리셋 시스템 (Custom Presets Drawer)
* **접이식 드롭다운 아코디언 서랍**: 프리셋을 수십 개 등록해도 세로 스크롤로 화면 공간을 컴팩트하게 유지.
* **마우스 드래그 앤 드롭(Drag & Drop)**: 마우스로 끌어서 순서를 자유자재로 정렬.
* **원클릭 등록 (`💾 현재 입력 등록`)**: 입력창에 작성한 텍스트를 1초 만에 프리셋으로 저장.
* **상단 메인 드롭다운 연동**: 상단 `▼ ⚡ 프리셋 선택` 메뉴 최상단에도 커스텀 프리셋이 자동 동기화.

### 4. 🎨 5대 프리미엄 아트 스타일 프리셋 (Art Styles)
1. 📷 **극실사 사진 (Photorealistic RAW)**: 50mm f/1.8 렌즈, 자연스러운 피부 모공 질감, 스튜디오 조명.
2. ✨ **반실사 (Semi-Realistic / 2.5D)**: 세련된 디지털 페인팅, 부드러운 음영의 2.5D 비주얼.
3. 🎨 **2D 애니 / 웹툰 (Anime & Manga)**: 깔끔한 라인 아트, 선명한 셀 채색, 트렌디 애니 스타일.
4. 📐 **캐릭터 설정화 (Concept Art Sheet)**: 턴어라운드/삼면도 공식 캐릭터 모델 시트.
5. 🎮 **3D CG 캐릭터 (3D CGI / Unreal 5)**: 언리얼 엔진 5 / 옥테인 시네마틱 3D 렌더.

### 5. 🌐 직접 한글 입력 & 실시간 자동 영문 번역
* 한글로 프롬프트를 입력하면 구글 실시간 번역 및 AI 최적화 사전으로 즉시 영문 변환(`Ctrl+Enter`).

### 6. 👤 리사이즈 가능한 캐릭터 프로필 & 다중 저장 히스토리
* 모서리를 마우스로 자유롭게 늘릴 수 있는 한글/영문 멀티라인 텍스트 영역.
* 즐겨찾기(`⭐ 저장`) 및 비우기(`🗑️`) 지원.

### 7. 📐 반응형 뷰포트 (Fluid Responsive Viewport)
* 크롬 화면 확대/축소(100%, 80%, 50%) 및 창 크기 변경 시 캔버스 종횡비 100% 자동 유지.

---

## 🚀 사용 방법 (How to Use)

### 방법 1: 웹 브라우저에서 바로 사용 (Live Web)
👉 **[https://solokjd-eng.github.io/Visual-Grid-Prompt-Web/](https://solokjd-eng.github.io/Visual-Grid-Prompt-Web/)** 링크를 누르면 웹 브라우저에서 즉시 실행됩니다.

### 방법 2: 오프라인 무설치 단일 파일 다운로드 (Single-File HTML)
1. **[Visual_Grid_Prompt.html 다운로드](https://github.com/solokjd-eng/Visual-Grid-Prompt-Web/releases/latest)**
2. 다운로드받은 `.html` 파일을 더블클릭하면 인터넷 연결 없이도 오프라인에서 100% 독립 실행됩니다.

---

## 🧩 ComfyUI 커스텀 노드 버전
ComfyUI 내부에서 노드로 직접 연동하여 사용하고 싶으시다면 **[ComfyUI-Visual-Regional-Prompt](https://github.com/solokjd-eng/ComfyUI-Visual-Regional-Prompt)** 저장소를 이용해 주세요.

---

## 📄 라이선스 (License)
MIT License
