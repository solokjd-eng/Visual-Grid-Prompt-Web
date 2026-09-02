/**
 * 원본 ComfyUI 노드 100% 동일 샷/구도 프리셋 및 레이아웃 템플릿, 화풍 스타일 프리셋
 */

// 🎨 화풍 & 아트 스타일 프리셋 (실사, 반실사, 2D애니, 설정화, 3D)
export const ART_STYLES = [
  {
    id: "photorealistic",
    name: "📷 극실사 사진 (Photorealistic RAW)",
    icon: "📷",
    prefix: "RAW candid photo, authentic portrait photography, shot on 50mm f/1.8 lens, natural human skin texture with subtle pores, soft daylight studio lighting, unretouched real person photography",
    suffix: "clean neutral background, true-to-life skin tones, natural shadows, sharp focus, 35mm film grain, high dynamic range",
    whiteBg: false,
    gridBorders: true
  },
  {
    id: "semi_realistic",
    name: "✨ 반실사 (Semi-Realistic / 2.5D)",
    icon: "✨",
    prefix: "semi-realistic 2.5D digital painting, refined facial features, smooth shading, aesthetic webtoon cover illustration style, intricate hair detailing, soft ambient lighting",
    suffix: "clean studio backdrop, luminous skin highlights, vibrant harmonious palette, crisp artwork, high resolution digital art",
    whiteBg: false,
    gridBorders: true
  },
  {
    id: "anime",
    name: "🎨 2D 애니 / 웹툰 (Anime & Manga)",
    icon: "🎨",
    prefix: "masterpiece anime illustration, crisp line art, vibrant cel shading, modern webtoon aesthetic, dynamic studio key visual, expressive features",
    suffix: "clean comic panel divider lines, rich saturated colors, sharp linework, high quality 2D art",
    whiteBg: false,
    gridBorders: true
  },
  {
    id: "concept_sheet",
    name: "📐 캐릭터 설정화 (Concept Art Sheet)",
    icon: "📐",
    prefix: "concept art character model sheet, character design turnaround reference, multiple views and poses of the same character, production design documentation",
    suffix: "clean pure white background, studio white backdrop, uniform neutral lighting, clean production artwork, sharp focus on all panels",
    whiteBg: true,
    gridBorders: true
  },
  {
    id: "cg_3d",
    name: "🎮 3D CG 캐릭터 (3D CGI / Unreal 5)",
    icon: "🎮",
    prefix: "3D character model render, Octane Render, Unreal Engine 5, Subsurface Scattering (SSS) realistic skin shader, ray tracing reflections, cinematic 3D lighting",
    suffix: "clean studio void backdrop, physically based rendering (PBR) materials, ambient occlusion, 8k textures, volumetric lighting",
    whiteBg: false,
    gridBorders: true
  }
];

// 엑셀 표 기반 체계적 샷/구도 프리셋 그룹 (캐릭터 설정화 특화 10대 분류)
export const PRESET_GROUPS = [
  {
    group: "얼굴 (헤어부터 쇄골까지)",
    icon: "👤",
    items: [
      { label: "정면", ko: "얼굴 (헤어부터 쇄골까지): 정면", en: "portrait from hair to collarbone, front view, detailed face and hairstyle" },
      { label: "측면", ko: "얼굴 (헤어부터 쇄골까지): 측면", en: "portrait from hair to collarbone, side profile view" },
      { label: "45도 측면", ko: "얼굴 (헤어부터 쇄골까지): 45도 측면", en: "portrait from hair to collarbone, three-quarter view, 45-degree angle" },
      { label: "위에서 본", ko: "얼굴 (헤어부터 쇄골까지): 위에서 본 (하이앵글)", en: "portrait from hair to collarbone, high angle, from above" },
      { label: "아래에서 본", ko: "얼굴 (헤어부터 쇄골까지): 아래에서 본 (로우앵글)", en: "portrait from hair to collarbone, low angle, from below" },
      { label: "후면", ko: "얼굴 (헤어부터 쇄골까지): 후면 (뒷모습)", en: "back of head and hairstyle, back view, from behind, collarbone line" }
    ]
  },
  {
    group: "얼굴 초근접",
    icon: "👁️",
    items: [
      { label: "정면", ko: "얼굴 초근접: 정면", en: "extreme macro close-up of face, front view, macro eyes and lips detail" },
      { label: "측면", ko: "얼굴 초근접: 측면", en: "extreme macro close-up of face, side profile view" },
      { label: "45도 측면", ko: "얼굴 초근접: 45도 측면", en: "extreme macro close-up of face, three-quarter view, 45-degree angle" }
    ]
  },
  {
    group: "상반신 가슴까지",
    icon: "👚",
    items: [
      { label: "정면", ko: "상반신 가슴까지: 정면", en: "bust shot, upper body to chest, front view, neckline detail" },
      { label: "측면", ko: "상반신 가슴까지: 측면", en: "bust shot, upper body to chest, side profile view" },
      { label: "45도 측면", ko: "상반신 가슴까지: 45도 측면", en: "bust shot, upper body to chest, three-quarter view" },
      { label: "위에서 본", ko: "상반신 가슴까지: 위에서 본 (하이앵글)", en: "bust shot, upper body to chest, high angle, looking down" },
      { label: "아래에서 본", ko: "상반신 가슴까지: 아래에서 본 (로우앵글)", en: "bust shot, upper body to chest, low angle, looking up" }
    ]
  },
  {
    group: "상반신 허리까지",
    icon: "👗",
    items: [
      { label: "정면", ko: "상반신 허리까지: 정면", en: "waist shot, upper body to waist, front view, outfit detail" },
      { label: "측면", ko: "상반신 허리까지: 측면", en: "waist shot, upper body to waist, side profile view" },
      { label: "45도 측면", ko: "상반신 허리까지: 45도 측면", en: "waist shot, upper body to waist, three-quarter view" },
      { label: "위에서 본", ko: "상반신 허리까지: 위에서 본 (하이앵글)", en: "waist shot, upper body to waist, high angle, from above" },
      { label: "아래에서 본", ko: "상반신 허리까지: 아래에서 본 (로우앵글)", en: "waist shot, upper body to waist, low angle, from below" }
    ]
  },
  {
    group: "가슴 클로즈업",
    icon: "✨",
    items: [
      { label: "정면", ko: "가슴 클로즈업: 정면", en: "close-up shot focused on chest and neckline, front view, outfit detail" },
      { label: "측면", ko: "가슴 클로즈업: 측면", en: "close-up shot focused on chest, side profile view" },
      { label: "45도 측면", ko: "가슴 클로즈업: 45도 측면", en: "close-up shot focused on chest, three-quarter angle" },
      { label: "위에서 본", ko: "가슴 클로즈업: 위에서 본 (하이앵글)", en: "close-up shot focused on chest, high angle, top-down view" },
      { label: "아래에서 본", ko: "가슴 클로즈업: 아래에서 본 (로우앵글)", en: "close-up shot focused on chest, low angle, looking up" }
    ]
  },
  {
    group: "전신",
    icon: "🧍",
    items: [
      { label: "정면", ko: "전신: 정면", en: "full body shot, front view, standing pose" },
      { label: "측면", ko: "전신: 측면", en: "full body shot, side profile view, standing" },
      { label: "45도 측면", ko: "전신: 45도 측면", en: "full body shot, three-quarter view, 45-degree angle standing" },
      { label: "후면", ko: "전신: 후면 (뒷모습)", en: "full body shot from behind, back view, full outfit and hair details" },
      { label: "자연스러운 워킹 포즈", ko: "전신: 자연스러운 워킹 포즈", en: "full body shot, natural walking pose on runway, dynamic posture" }
    ]
  },
  {
    group: "하반신 엉덩이부터 다리까지 (각선미 강조)",
    icon: "🦵",
    items: [
      { label: "정면", ko: "하반신 엉덩이부터 다리까지: 정면", en: "lower body shot from hips to legs, legs focus, front view, slender leg lines" },
      { label: "측면", ko: "하반신 엉덩이부터 다리까지: 측면", en: "lower body shot from hips to legs, side profile view" },
      { label: "45도 측면", ko: "하반신 엉덩이부터 다리까지: 45도 측면", en: "lower body shot from hips to legs, three-quarter view" },
      { label: "후면", ko: "하반신 엉덩이부터 다리까지: 후면 (뒷모습)", en: "lower body shot from hips to legs, back view, hips and legs focus" },
      { label: "매혹적인 포즈", ko: "하반신 엉덩이부터 다리까지: 매혹적인 각선미 포즈", en: "lower body shot from hips to legs, graceful leg lines, seductive posture" }
    ]
  },
  {
    group: "엉덩이부",
    icon: "🍑",
    items: [
      { label: "정면", ko: "엉덩이부: 골반 정면", en: "pelvis and hip area focus shot, front view" },
      { label: "측면", ko: "엉덩이부: 엉덩이 측면", en: "hip and buttocks side profile shot" },
      { label: "후면", ko: "엉덩이부: 엉덩이 후면 (뒷모습)", en: "buttocks and rear hip focus shot, back view" },
      { label: "아래에서 본", ko: "엉덩이부: 아래에서 본 (로우앵글)", en: "hip and buttocks shot, low angle, looking up" }
    ]
  },
  {
    group: "손 클로즈업",
    icon: "🖐️",
    items: [
      { label: "손등", ko: "손 클로즈업: 손등", en: "detailed close-up of back of hand, elegant hand gesture, clean manicure" },
      { label: "손바닥", ko: "손 클로즈업: 손바닥", en: "detailed close-up of open palm, graceful hand gesture, finger detail" }
    ]
  },
  {
    group: "발 클로즈업",
    icon: "🦶",
    items: [
      { label: "발등", ko: "발 클로즈업: 발등 (맨발)", en: "detailed close-up of top of feet and toes, feet arch, bare feet" },
      { label: "발바닥", ko: "발 클로즈업: 발바닥", en: "detailed close-up of sole of bare foot, foot sole texture" },
      { label: "발 정면", ko: "발 클로즈업: 발 정면", en: "detailed close-up of feet front view, toes and ankle detail" },
      { label: "발 45도 측면", ko: "발 클로즈업: 발 45도 측면", en: "detailed close-up of feet three-quarter view, ankle line" },
      { label: "발 측면", ko: "발 클로즈업: 발 측면", en: "detailed close-up of feet side profile, ankle and heel line" }
    ]
  }
];

export const LAYOUT_TEMPLATES = [
  {
    id: "char_sheet_3",
    name: "👑 캐릭터 시트 (3분할 앙상블)",
    aspectRatio: "16:9",
    cols: 6,
    rows: 3,
    whiteBg: true,
    gridBorders: true,
    characterSheetStyle: true,
    prefixPrompt: "masterpiece, best quality, ultra detailed, 1girl, silver hair, glowing blue eyes, elegant design",
    suffixPrompt: "sharp focus, photorealistic 8k, uniform lighting",
    areas: [
      {
        id: 1,
        c1: 0, c2: 2, r1: 0, r2: 2,
        koPrompt: "전신 45도 측면, 완벽한 포즈와 의상 디테일",
        prompt: "full body, three-quarter view, 45-degree angle, complete outfit details"
      },
      {
        id: 2,
        c1: 3, c2: 5, r1: 0, r2: 0,
        koPrompt: "얼굴 초근접 정면, 아름다운 미소",
        prompt: "extreme close-up face, front view, macro detail, gentle warm smile"
      },
      {
        id: 3,
        c1: 3, c2: 5, r1: 1, r2: 2,
        koPrompt: "상반신 가슴 45도 측면, 의상 상체 디테일",
        prompt: "bust shot, upper body, three-quarter view, 45-degree angle"
      }
    ]
  },
  {
    id: "char_sheet_4",
    name: "📐 4컷 멀티 앵글 시트 (4-Panel Grid)",
    aspectRatio: "1:1",
    cols: 4,
    rows: 4,
    whiteBg: true,
    gridBorders: true,
    characterSheetStyle: true,
    prefixPrompt: "masterpiece, best quality, concept art character sheet, 1boy, handsome anime style",
    suffixPrompt: "clean lines, uniform studio lighting, high resolution",
    areas: [
      {
        id: 1,
        c1: 0, c2: 1, r1: 0, r2: 1,
        koPrompt: "얼굴 정면",
        prompt: "face, front view, detailed facial features"
      },
      {
        id: 2,
        c1: 2, c2: 3, r1: 0, r2: 1,
        koPrompt: "얼굴 측면",
        prompt: "face, side profile view"
      },
      {
        id: 3,
        c1: 0, c2: 1, r1: 2, r2: 3,
        koPrompt: "상반신 허리 정면",
        prompt: "waist shot, waist up, front view"
      },
      {
        id: 4,
        c1: 2, c2: 3, r1: 2, r2: 3,
        koPrompt: "전신 후면",
        prompt: "full body, back view, from behind"
      }
    ]
  },
  {
    id: "comic_strip",
    name: "💬 만화 컷 분할 (Comic Story Layout)",
    aspectRatio: "16:9",
    cols: 6,
    rows: 2,
    whiteBg: false,
    gridBorders: true,
    characterSheetStyle: false,
    prefixPrompt: "manga style, dynamic anime illustration, vivid cinematic colors",
    suffixPrompt: "high contrast, dramatic lighting",
    areas: [
      {
        id: 1,
        c1: 0, c2: 1, r1: 0, r2: 1,
        koPrompt: "얼굴 초근접 정면",
        prompt: "extreme close-up face, front view, macro detail"
      },
      {
        id: 2,
        c1: 2, c2: 3, r1: 0, r2: 1,
        koPrompt: "소품 오브젝트 (검을 쥔 손)",
        prompt: "detailed prop, focused object, hands gripping sword"
      },
      {
        id: 3,
        c1: 4, c2: 5, r1: 0, r2: 1,
        koPrompt: "전신 정면",
        prompt: "full body, front view"
      }
    ]
  },
  {
    id: "duo_faceoff",
    name: "⚔️ 2인 대치 샷 (Side-by-Side Duel)",
    aspectRatio: "16:9",
    cols: 6,
    rows: 3,
    whiteBg: false,
    gridBorders: false,
    characterSheetStyle: false,
    prefixPrompt: "masterpiece, highly detailed, dramatic rivalry, epic fantasy scene",
    suffixPrompt: "cinematic lighting, particle effects, 8k wallpaper",
    areas: [
      {
        id: 1,
        c1: 0, c2: 2, r1: 0, r2: 2,
        koPrompt: "상반신 가슴 45도 측면, 푸른 불꽃의 마법사",
        prompt: "bust shot, upper body, three-quarter view, glowing blue mage"
      },
      {
        id: 2,
        c1: 3, c2: 5, r1: 0, r2: 2,
        koPrompt: "상반신 가슴 45도 측면, 붉은 화염의 검사",
        prompt: "bust shot, upper body, three-quarter view, fierce flame warrior"
      }
    ]
  },
  {
    id: "vertical_story",
    name: "📱 9:16 숏폼 세로 3단 스토리 (Vertical Story)",
    aspectRatio: "9:16",
    cols: 3,
    rows: 6,
    whiteBg: false,
    gridBorders: true,
    characterSheetStyle: false,
    prefixPrompt: "aesthetic webtoon art, vertical composition, vibrant colors",
    suffixPrompt: "clean lines, beautiful background",
    areas: [
      {
        id: 1,
        c1: 0, c2: 2, r1: 0, r2: 1,
        koPrompt: "자연 숲 배경, 푸른 하늘",
        prompt: "lush forest, trees, dappled sunlight, blue sky"
      },
      {
        id: 2,
        c1: 0, c2: 2, r1: 2, r2: 3,
        koPrompt: "얼굴 초근접 45도 측면",
        prompt: "extreme close-up face, three-quarter view, 45-degree angle"
      },
      {
        id: 3,
        c1: 0, c2: 2, r1: 4, r2: 5,
        koPrompt: "소품 오브젝트 (맞잡은 두 손)",
        prompt: "detailed prop, focused object, two hands holding gently"
      }
    ]
  }
];

export const COLOR_PALETTE = [
  { border: "#00f0ff", bg: "rgba(0, 240, 255, 0.22)", glow: "rgba(0, 240, 255, 0.6)", text: "#00f0ff" },
  { border: "#ff007f", bg: "rgba(255, 0, 127, 0.22)", glow: "rgba(255, 0, 127, 0.6)", text: "#ff007f" },
  { border: "#ffe600", bg: "rgba(255, 230, 0, 0.22)", glow: "rgba(255, 230, 0, 0.6)", text: "#ffe600" },
  { border: "#a100ff", bg: "rgba(161, 0, 255, 0.22)", glow: "rgba(161, 0, 255, 0.6)", text: "#a100ff" },
  { border: "#00ff66", bg: "rgba(0, 255, 102, 0.22)", glow: "rgba(0, 255, 102, 0.6)", text: "#00ff66" },
  { border: "#ff5e00", bg: "rgba(255, 94, 0, 0.22)", glow: "rgba(255, 94, 0, 0.6)", text: "#ff5e00" },
  { border: "#00e5ff", bg: "rgba(0, 229, 255, 0.22)", glow: "rgba(0, 229, 255, 0.6)", text: "#00e5ff" },
  { border: "#ff0055", bg: "rgba(255, 0, 85, 0.22)", glow: "rgba(255, 0, 85, 0.6)", text: "#ff0055" },
  { border: "#b8ff00", bg: "rgba(184, 255, 0, 0.22)", glow: "rgba(184, 255, 0, 0.6)", text: "#b8ff00" },
  { border: "#e056fd", bg: "rgba(224, 86, 253, 0.22)", glow: "rgba(224, 86, 253, 0.6)", text: "#e056fd" }
];
