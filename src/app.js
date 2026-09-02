import { translatePrompt, translateViaDictionary } from './translator.js';
import { getNaturalSpatialName, getSpatialDescription, buildFinalPrompt, buildNegativePrompt } from './spatial.js';
import { PRESET_GROUPS, LAYOUT_TEMPLATES, COLOR_PALETTE, ART_STYLES } from './presets.js';

/**
 * Application State
 */
const state = {
  aspectRatio: "16:9",
  cols: 6,
  rows: 3,
  areas: [],
  selectedAreaId: null,
  whiteBg: false,
  gridBorders: true,
  activeArtStyle: "photorealistic",
  customPresets: [],
  characterProfileKo: "",
  characterProfileEn: "",
  characterHistory: [],
  prefixPrompt: "RAW candid photo, authentic portrait photography, shot on 50mm f/1.8 lens, natural human skin texture with subtle pores, soft daylight studio lighting, unretouched real person photography",
  suffixPrompt: "clean neutral background, true-to-life skin tones, natural shadows, sharp focus, 35mm film grain, high dynamic range",
  format: "natural",
  mockupEnabled: true,
  
  // Drag state
  isDragging: false,
  dragStartCell: null,
  dragCurrentCell: null,
};

// DOM Elements
const elements = {
  canvasViewport: document.getElementById("canvas-viewport"),
  canvasWrapper: document.getElementById("canvas-wrapper"),
  gridBoard: document.getElementById("grid-board"),
  selectionBox: document.getElementById("selection-box"),
  areasContainer: document.getElementById("areas-container"),
  
  // Controls
  colsCount: document.getElementById("cols-count"),
  rowsCount: document.getElementById("rows-count"),
  btnColsDec: document.getElementById("cols-dec"),
  btnColsInc: document.getElementById("cols-inc"),
  btnRowsDec: document.getElementById("rows-dec"),
  btnRowsInc: document.getElementById("rows-inc"),
  
  // Ratio buttons
  ratioButtons: document.querySelectorAll(".ratio-btn"),
  
  // Templates
  templatesContainer: document.getElementById("templates-container"),

  // Character Profile
  inputCharacterKo: document.getElementById("input-character-ko"),
  btnApplyProfile: document.getElementById("btn-apply-profile"),
  btnSaveProfile: document.getElementById("btn-save-profile"),
  btnClearProfile: document.getElementById("btn-clear-profile"),
  profileEnInput: document.getElementById("profile-en-input"),
  profileHistoryChips: document.getElementById("profile-history-chips"),
  
  // Art Styles & Toggles
  artStylesContainer: document.getElementById("art-styles-container"),
  toggleWhiteBg: document.getElementById("toggle-white-bg"),
  toggleGridBorders: document.getElementById("toggle-grid-borders"),
  toggleMockup: document.getElementById("toggle-mockup"),
  
  // Header Controls (Theme & Updates)
  btnThemeToggle: document.getElementById("btn-theme-toggle"),
  themeIcon: document.getElementById("theme-icon"),
  themeLabel: document.getElementById("theme-label"),
  btnCheckUpdate: document.getElementById("btn-check-update"),
  updateBadgeText: document.getElementById("update-badge-text"),
  updatePulseDot: document.getElementById("update-pulse-dot"),
  modalUpdate: document.getElementById("modal-update"),
  btnCloseUpdateModal: document.getElementById("btn-close-update-modal"),
  btnCancelUpdate: document.getElementById("btn-cancel-update"),
  btnDownloadUpdate: document.getElementById("btn-download-update"),
  updateCurrentVer: document.getElementById("update-current-ver"),
  updateLatestVer: document.getElementById("update-latest-ver"),
  updateStatusBox: document.getElementById("update-status-box"),
  updateReleaseNotes: document.getElementById("update-release-notes"),
  updateNotesContent: document.getElementById("update-notes-content"),
  chkAutoUpdate: document.getElementById("chk-auto-update"),

  // Area Editor & Presets (Windows Explorer Tree Selector)
  areaTabs: document.getElementById("area-tabs"),
  editorCard: document.getElementById("area-editor-card"),
  activeAreaTitle: document.getElementById("active-area-title"),
  presetTreeWrapper: document.getElementById("preset-tree-wrapper"),
  presetTreeBtn: document.getElementById("preset-tree-btn"),
  presetTreeSelectedText: document.getElementById("preset-tree-selected-text"),
  presetTreeArrow: document.getElementById("preset-tree-arrow"),
  presetTreePopover: document.getElementById("preset-tree-popover"),
  presetTreeSearch: document.getElementById("preset-tree-search"),
  presetTreeBody: document.getElementById("preset-tree-body"),
  customPresetSelect: document.getElementById("custom-preset-select"),
  inputKoPrompt: document.getElementById("input-ko-prompt"),
  inputEnPrompt: document.getElementById("input-en-prompt"),
  btnTranslate: document.getElementById("btn-translate"),
  btnDeleteArea: document.getElementById("btn-delete-area"),

  // Custom Presets Management Drawer & Modal
  btnToggleCustomManage: document.getElementById("btn-toggle-custom-manage"),
  customManageDrawer: document.getElementById("custom-manage-drawer"),
  customChipsContainer: document.getElementById("custom-chips-container"),
  btnAddCustomPreset: document.getElementById("btn-add-custom-preset"),
  btnSaveAsPreset: document.getElementById("btn-save-as-preset"),
  modalCustomPreset: document.getElementById("modal-custom-preset"),
  modalPresetTitle: document.getElementById("modal-preset-title"),
  btnClosePresetModal: document.getElementById("btn-close-preset-modal"),
  btnCancelPreset: document.getElementById("btn-cancel-preset"),
  btnSavePresetConfirm: document.getElementById("btn-save-preset-confirm"),
  presetEditId: document.getElementById("preset-edit-id"),
  presetInputLabel: document.getElementById("preset-input-label"),
  presetInputKo: document.getElementById("preset-input-ko"),
  presetInputEn: document.getElementById("preset-input-en"),
  
  // Global Prompts
  inputPrefix: document.getElementById("input-prefix"),
  inputSuffix: document.getElementById("input-suffix"),
  
  // Outputs
  formatSelect: document.getElementById("format-select"),
  outputPrompt: document.getElementById("output-prompt"),
  outputNegative: document.getElementById("output-negative"),
  btnCopyPrompt: document.getElementById("btn-copy-prompt"),
  btnCopyNegative: document.getElementById("btn-copy-negative"),
  btnExportJson: document.getElementById("btn-export-json"),
  btnImportJson: document.getElementById("btn-import-json"),
  fileImport: document.getElementById("file-import"),
  btnClearAll: document.getElementById("btn-clear-all"),
  toastContainer: document.getElementById("toast-container")
};

/**
 * Aspect Ratio Map (Width / Height)
 */
const RATIO_MAP = {
  "16:9": 16 / 9,
  "9:16": 9 / 16,
  "1:1": 1,
  "4:3": 4 / 3,
  "3:4": 3 / 4,
  "3:2": 3 / 2,
  "2:3": 2 / 3,
  "21:9": 21 / 9
};

// =============================================================================
// Theme Management (Light Mode / Dark Mode)
// =============================================================================

function initThemeUI() {
  const savedTheme = localStorage.getItem("visual_grid_theme") || "dark";
  applyTheme(savedTheme);

  if (elements.btnThemeToggle) {
    elements.btnThemeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("visual_grid_theme", next);
      showToast(`${next === "light" ? "☀️ 라이트 모드" : "🌙 다크 모드"}가 적용되었습니다.`);
    });
  }
}

function applyTheme(theme) {
  if (document.documentElement && document.documentElement.setAttribute) {
    document.documentElement.setAttribute("data-theme", theme);
  } else if (document.body && document.body.setAttribute) {
    document.body.setAttribute("data-theme", theme);
  }
  if (elements.themeIcon) {
    elements.themeIcon.textContent = theme === "light" ? "☀️" : "🌙";
  }
  if (elements.themeLabel) {
    elements.themeLabel.textContent = theme === "light" ? "라이트" : "다크";
  }
}

// =============================================================================
// Version & Update Checker System (GitHub Releases API)
// =============================================================================

const CURRENT_APP_VERSION = "v1.0.0";
const GITHUB_REPO_API = "https://api.github.com/repos/solokjd-eng/Visual-Grid-Prompt-Web/releases/latest";
let latestReleaseData = null;

function initUpdateCheckerUI() {
  if (elements.updateBadgeText) {
    elements.updateBadgeText.textContent = CURRENT_APP_VERSION;
  }

  // Auto Check preference
  const autoCheck = localStorage.getItem("vgs_auto_check_update") !== "false";
  if (elements.chkAutoUpdate) {
    elements.chkAutoUpdate.checked = autoCheck;
    elements.chkAutoUpdate.addEventListener("change", (e) => {
      localStorage.setItem("vgs_auto_check_update", e.target.checked ? "true" : "false");
    });
  }

  // Button Click -> Manual Check
  if (elements.btnCheckUpdate) {
    elements.btnCheckUpdate.addEventListener("click", () => {
      checkForUpdates(true);
    });
  }

  // Modal Events
  if (elements.btnCloseUpdateModal) {
    elements.btnCloseUpdateModal.addEventListener("click", closeUpdateModal);
  }
  if (elements.btnCancelUpdate) {
    elements.btnCancelUpdate.addEventListener("click", closeUpdateModal);
  }
  if (elements.modalUpdate) {
    elements.modalUpdate.addEventListener("click", (e) => {
      if (e.target === elements.modalUpdate) closeUpdateModal();
    });
  }

  if (elements.btnDownloadUpdate) {
    elements.btnDownloadUpdate.addEventListener("click", downloadLatestRelease);
  }

  // Auto-check on launch after 1.5 seconds if enabled
  if (autoCheck) {
    setTimeout(() => {
      checkForUpdates(false);
    }, 1500);
  }
}

function closeUpdateModal() {
  if (elements.modalUpdate) {
    elements.modalUpdate.style.display = "none";
  }
}

async function checkForUpdates(manual = false) {
  if (typeof fetch === "undefined") return;
  if (manual && elements.updateBadgeText) {
    elements.updateBadgeText.textContent = "확인 중...";
  }

  try {
    const res = await fetch(GITHUB_REPO_API, {
      headers: { "Accept": "application/vnd.github.v3+json" }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    latestReleaseData = data;
    const latestVer = data.tag_name || data.name || CURRENT_APP_VERSION;

    const hasNewVersion = isVersionNewer(latestVer, CURRENT_APP_VERSION);

    if (hasNewVersion) {
      // New version available!
      if (elements.btnCheckUpdate) {
        elements.btnCheckUpdate.classList.add("has-update");
      }
      if (elements.updateBadgeText) {
        elements.updateBadgeText.textContent = `⚡ ${latestVer}`;
      }
      if (elements.updatePulseDot) {
        elements.updatePulseDot.style.display = "inline-block";
      }

      openUpdateModal(latestVer, data, true);
    } else {
      // Already on latest version
      if (elements.btnCheckUpdate) {
        elements.btnCheckUpdate.classList.remove("has-update");
      }
      if (elements.updateBadgeText) {
        elements.updateBadgeText.textContent = CURRENT_APP_VERSION;
      }
      if (elements.updatePulseDot) {
        elements.updatePulseDot.style.display = "none";
      }

      if (manual) {
        openUpdateModal(latestVer, data, false);
      }
    }
  } catch (err) {
    console.warn("Update check failed:", err);
    if (elements.updateBadgeText) {
      elements.updateBadgeText.textContent = CURRENT_APP_VERSION;
    }
    if (manual) {
      showToast("업데이트 정보를 확인하지 못했습니다 (인터넷 연결 확인).");
    }
  }
}

function isVersionNewer(latest, current) {
  const l = latest.replace(/^v/, "").split(".").map(Number);
  const c = current.replace(/^v/, "").split(".").map(Number);

  for (let i = 0; i < Math.max(l.length, c.length); i++) {
    const numL = l[i] || 0;
    const numC = c[i] || 0;
    if (numL > numC) return true;
    if (numL < numC) return false;
  }
  return false;
}

function openUpdateModal(latestVer, releaseData, isNewAvailable) {
  if (!elements.modalUpdate) return;

  if (elements.updateCurrentVer) elements.updateCurrentVer.textContent = CURRENT_APP_VERSION;
  if (elements.updateLatestVer) elements.updateLatestVer.textContent = latestVer;

  if (elements.updateStatusBox) {
    if (isNewAvailable) {
      elements.updateStatusBox.className = "update-status-box has-update";
      elements.updateStatusBox.innerHTML = `🎉 <strong>새로운 업데이트(${latestVer})</strong>가 준비되어 있습니다!`;
    } else {
      elements.updateStatusBox.className = "update-status-box latest";
      elements.updateStatusBox.innerHTML = `✅ 현재 <strong>최신 버전(${CURRENT_APP_VERSION})</strong>을 사용하고 있습니다.`;
    }
  }

  if (elements.updateReleaseNotes && elements.updateNotesContent) {
    if (releaseData && releaseData.body) {
      elements.updateReleaseNotes.style.display = "block";
      elements.updateNotesContent.textContent = releaseData.body;
    } else {
      elements.updateReleaseNotes.style.display = "none";
    }
  }

  if (elements.btnDownloadUpdate) {
    elements.btnDownloadUpdate.style.display = isNewAvailable ? "inline-block" : "none";
    const isWeb = window.location.protocol.startsWith("http");
    elements.btnDownloadUpdate.textContent = isWeb 
      ? "🚀 지금 최신 버전으로 즉시 새로고침 (0초 적용)" 
      : "⚡ 지금 최신 버전 다운로드 (HTML)";
  }

  elements.modalUpdate.style.display = "flex";
}

function downloadLatestRelease() {
  const isWeb = window.location.protocol.startsWith("http");
  if (isWeb) {
    showToast("최신 버전으로 즉시 새로고침하여 적용합니다...");
    setTimeout(() => {
      window.location.reload(true);
    }, 300);
    return;
  }

  // Local file usage: Open release download
  if (latestReleaseData && latestReleaseData.assets && latestReleaseData.assets.length > 0) {
    const htmlAsset = latestReleaseData.assets.find(a => a.name.endsWith(".html")) || latestReleaseData.assets[0];
    if (htmlAsset && htmlAsset.browser_download_url) {
      window.open(htmlAsset.browser_download_url, "_blank");
      showToast("최신 버전 다운로드를 시작했습니다!");
      return;
    }
  }
  window.open("https://solokjd-eng.github.io/Visual-Grid-Prompt-Web/", "_blank");
}

// =============================================================================
// Initialize Application
// =============================================================================

export function initApp() {
  initThemeUI();
  initUpdateCheckerUI();
  initArtStylesUI();
  initPresetsUI();
  initCustomPresetsUI();
  initLayoutTemplatesUI();
  initCharacterProfileUI();
  bindEvents();
  
  // Load saved state or default template
  const saved = localStorage.getItem("visual_grid_prompt_saved_state");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
    } catch (e) {
      loadTemplate(LAYOUT_TEMPLATES[0]);
    }
  } else {
    loadTemplate(LAYOUT_TEMPLATES[0]);
  }

  // Setup ResizeObserver for fluid auto-scaling of canvas
  if (window.ResizeObserver && elements.canvasViewport) {
    const ro = new ResizeObserver(() => {
      updateCanvasDimensions();
    });
    ro.observe(elements.canvasViewport);
  }

  updateCanvasDimensions();
  renderGridCells();
  renderAreas();
  updateUIInputs();
  updatePromptOutput();
}

/**
 * Initialize Art Style Presets UI
 */
function initArtStylesUI() {
  if (!elements.artStylesContainer) return;
  elements.artStylesContainer.innerHTML = "";

  ART_STYLES.forEach(style => {
    const btn = document.createElement("button");
    btn.className = `btn-art-style ${state.activeArtStyle === style.id ? "active" : ""}`;
    btn.type = "button";
    btn.dataset.styleId = style.id;
    btn.innerHTML = `<span>${style.icon}</span><span>${style.name}</span>`;

    btn.addEventListener("click", () => {
      applyArtStyle(style);
    });

    elements.artStylesContainer.appendChild(btn);
  });
}

function applyArtStyle(style) {
  state.activeArtStyle = style.id;
  state.prefixPrompt = style.prefix;
  state.suffixPrompt = style.suffix;
  // 사용자가 수동 설정한 백색 배경(whiteBg) 및 그리드선 설정은 화풍 전환 시 유지 (덮어쓰지 않음)

  // Update active UI classes on style buttons
  if (elements.artStylesContainer) {
    elements.artStylesContainer.querySelectorAll(".btn-art-style").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.styleId === style.id);
    });
  }

  // Sync toggle checkboxes (현재 사용자 설정 상태 유지)
  if (elements.toggleWhiteBg) {
    elements.toggleWhiteBg.checked = state.whiteBg;
    elements.toggleWhiteBg.parentElement.classList.toggle("active", state.whiteBg);
  }
  if (elements.toggleGridBorders) {
    elements.toggleGridBorders.checked = state.gridBorders;
    elements.toggleGridBorders.parentElement.classList.toggle("active", state.gridBorders);
  }

  // Sync input text boxes
  if (elements.inputPrefix) elements.inputPrefix.value = state.prefixPrompt;
  if (elements.inputSuffix) elements.inputSuffix.value = state.suffixPrompt;

  updatePromptOutput();
  saveState();
  showToast(`🎨 화풍이 '${style.name}'(으)로 변경되었습니다!`);
}

/**
 * Default Character Profile Presets for Quick Start
 */
const DEFAULT_CHARACTER_PRESETS = [
  "20대 한국 여성, 검은 뿔테 안경, 긴 흑발 포니테일, 핑크 요가복",
  "은발 단발의 사이버펑크 여전사, 네온 블루 바이저, 전술 바디슈트",
  "금발 웨이브 헤어의 판타지 마법사, 푸른 로브, 신비로운 분위기",
  "단정한 갈색 숏컷의 여대생, 화이트 셔츠, 베이지 가디건"
];

function initCharacterProfileUI() {
  // Load history from localStorage
  const savedHistory = localStorage.getItem("vgs_character_history");
  if (savedHistory) {
    try {
      state.characterHistory = JSON.parse(savedHistory);
    } catch (e) {
      state.characterHistory = [...DEFAULT_CHARACTER_PRESETS];
    }
  } else {
    state.characterHistory = [...DEFAULT_CHARACTER_PRESETS];
  }

  // Restore current value if exists in state
  if (state.characterProfileKo && elements.inputCharacterKo) {
    elements.inputCharacterKo.value = state.characterProfileKo;
  }
  if (state.characterProfileEn && elements.profileEnInput) {
    elements.profileEnInput.value = state.characterProfileEn;
  }

  renderCharacterHistoryChips();

  if (elements.btnApplyProfile) {
    elements.btnApplyProfile.addEventListener("click", () => {
      applyCharacterProfile(elements.inputCharacterKo?.value);
    });
  }

  if (elements.inputCharacterKo) {
    elements.inputCharacterKo.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        applyCharacterProfile(elements.inputCharacterKo?.value);
      }
    });
  }

  if (elements.profileEnInput) {
    elements.profileEnInput.addEventListener("input", () => {
      state.characterProfileEn = elements.profileEnInput.value.trim();
      updatePromptOutput();
      saveState();
    });
  }

  if (elements.btnClearProfile) {
    elements.btnClearProfile.addEventListener("click", () => {
      if (elements.inputCharacterKo) elements.inputCharacterKo.value = "";
      if (elements.profileEnInput) elements.profileEnInput.value = "";
      state.characterProfileKo = "";
      state.characterProfileEn = "";
      updatePromptOutput();
      saveState();
      showToast("인물 묘사가 비워졌습니다 (공란 처리).");
    });
  }

  if (elements.btnSaveProfile) {
    elements.btnSaveProfile.addEventListener("click", () => {
      const text = elements.inputCharacterKo?.value.trim();
      if (!text) {
        showToast("저장할 인물 묘사를 먼저 입력하세요!");
        return;
      }
      applyCharacterProfile(text, true);
      showToast("⭐ 인물 묘사가 기록/즐겨찾기에 저장되었습니다!");
    });
  }
}

async function applyCharacterProfile(textKo, saveToHistory = true) {
  const clean = (textKo || "").trim();
  state.characterProfileKo = clean;

  if (clean) {
    const en = await translatePrompt(clean);
    state.characterProfileEn = en;
    if (elements.profileEnInput) elements.profileEnInput.value = en;

    if (saveToHistory) {
      state.characterHistory = [clean, ...state.characterHistory.filter(h => h !== clean)].slice(0, 10);
      localStorage.setItem("vgs_character_history", JSON.stringify(state.characterHistory));
      renderCharacterHistoryChips();
    }
    showToast("👤 인물 프로필이 적용되었습니다!");
  } else {
    state.characterProfileEn = "";
    if (elements.profileEnInput) elements.profileEnInput.value = "";
  }

  updatePromptOutput();
  saveState();
}

function renderCharacterHistoryChips() {
  if (!elements.profileHistoryChips) return;
  elements.profileHistoryChips.innerHTML = "";

  (state.characterHistory || []).forEach(item => {
    const chip = document.createElement("div");
    chip.className = "history-chip";
    chip.title = "클릭하여 이 인물 묘사 적용";
    
    const label = document.createElement("span");
    label.textContent = item.length > 20 ? item.slice(0, 20) + "..." : item;
    
    const del = document.createElement("span");
    del.className = "history-chip-del";
    del.innerHTML = "×";
    del.title = "이 기록 삭제";
    del.addEventListener("click", (e) => {
      e.stopPropagation();
      state.characterHistory = state.characterHistory.filter(h => h !== item);
      localStorage.setItem("vgs_character_history", JSON.stringify(state.characterHistory));
      renderCharacterHistoryChips();
    });

    chip.appendChild(label);
    chip.appendChild(del);

    chip.addEventListener("click", () => {
      if (elements.inputCharacterKo) elements.inputCharacterKo.value = item;
      applyCharacterProfile(item, false);
    });

    elements.profileHistoryChips.appendChild(chip);
  });
}

/**
 * =============================================================================
 * Preset Application (구도 교체 Replace 로직)
 * =============================================================================
 */
function setPresetToActiveArea({ ko, en }) {
  const activeArea = getSelectedArea();
  if (!activeArea) {
    showToast("먼저 캔버스에서 영역(Area)을 선택하세요!");
    return;
  }

  // 기존 내용을 새로 선택한 프리셋으로 1:1 교체 (Replace)
  activeArea.koPrompt = ko || "";
  activeArea.prompt = en || ko || "";

  if (elements.inputKoPrompt) elements.inputKoPrompt.value = activeArea.koPrompt;
  if (elements.inputEnPrompt) elements.inputEnPrompt.value = activeArea.prompt;

  renderAreas();
  updatePromptOutput();
  saveState();
  showToast(`구도가 '${ko}'(으)로 교체되었습니다.`);
}

/**
 * Initialize Windows Explorer-Style Tree Preset Selector
 */
function initPresetsUI() {
  if (!elements.presetTreeBtn || !elements.presetTreePopover || !elements.presetTreeBody) return;

  renderExplorerTree();

  // 토글 탐색기 팝오버 열기/닫기
  elements.presetTreeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isCollapsed = elements.presetTreePopover.classList.toggle("collapsed");
    elements.presetTreeBtn.classList.toggle("open", !isCollapsed);
    if (!isCollapsed && elements.presetTreeSearch) {
      elements.presetTreeSearch.focus();
    }
  });

  // 바깥 영역 클릭 시 탐색기 닫기
  document.addEventListener("click", (e) => {
    if (e && e.target && elements.presetTreeWrapper && !elements.presetTreeWrapper.contains(e.target)) {
      elements.presetTreePopover.classList.add("collapsed");
      elements.presetTreeBtn.classList.remove("open");
    }
  });

  // 실시간 검색 필터링
  if (elements.presetTreeSearch) {
    elements.presetTreeSearch.addEventListener("input", () => {
      const q = elements.presetTreeSearch.value.trim().toLowerCase();
      filterExplorerTree(q);
    });
  }
}

function renderExplorerTree() {
  if (!elements.presetTreeBody) return;
  elements.presetTreeBody.innerHTML = "";

  PRESET_GROUPS.forEach((grp) => {
    // 1. Folder Wrapper
    const folderWrap = document.createElement("div");
    folderWrap.className = "tree-folder-group";
    folderWrap.dataset.groupName = grp.group;

    // 2. Folder Header (대분류 폴더)
    const folderHeader = document.createElement("div");
    folderHeader.className = "tree-folder";
    folderHeader.innerHTML = `
      <span class="tree-folder-arrow">▶</span>
      <span class="tree-folder-icon">${grp.icon || "📁"}</span>
      <span class="tree-folder-label">${grp.group}</span>
      <span class="tree-folder-count">(${grp.items.length})</span>
    `;

    // 3. Folder Children (소분류 항목 리스트)
    const childrenWrap = document.createElement("div");
    childrenWrap.className = "tree-folder-children collapsed";

    grp.items.forEach(item => {
      const itemEl = document.createElement("div");
      itemEl.className = "tree-item";
      itemEl.dataset.ko = item.ko;
      itemEl.dataset.en = item.en;
      itemEl.dataset.label = item.label;
      itemEl.innerHTML = `
        <span class="tree-item-icon">📄</span>
        <span class="tree-item-label">${item.label}</span>
      `;

      itemEl.addEventListener("click", (e) => {
        e.stopPropagation();
        setPresetToActiveArea({ ko: item.ko, en: item.en });
        if (elements.presetTreeSelectedText) {
          const shortGrp = grp.group.split(' ')[0];
          elements.presetTreeSelectedText.textContent = `⚡ [${shortGrp}] ${item.label}`;
        }
        elements.presetTreePopover.classList.add("collapsed");
        elements.presetTreeBtn.classList.remove("open");
      });

      childrenWrap.appendChild(itemEl);
    });

    // 폴더 클릭 시 하위 항목 아코디언 토글
    folderHeader.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = folderHeader.classList.toggle("open");
      childrenWrap.classList.toggle("collapsed", !isOpen);
    });

    folderWrap.appendChild(folderHeader);
    folderWrap.appendChild(childrenWrap);
    elements.presetTreeBody.appendChild(folderWrap);
  });
}

function filterExplorerTree(query) {
  const groups = elements.presetTreeBody.querySelectorAll(".tree-folder-group");
  groups.forEach(grpEl => {
    const folderHeader = grpEl.querySelector(".tree-folder");
    const childrenWrap = grpEl.querySelector(".tree-folder-children");
    const items = grpEl.querySelectorAll(".tree-item");

    if (!query) {
      grpEl.style.display = "block";
      items.forEach(it => it.style.display = "flex");
      return;
    }

    let hasMatch = false;
    items.forEach(it => {
      const text = `${it.dataset.label} ${it.dataset.ko} ${it.dataset.en}`.toLowerCase();
      if (text.includes(query)) {
        it.style.display = "flex";
        hasMatch = true;
      } else {
        it.style.display = "none";
      }
    });

    if (hasMatch) {
      grpEl.style.display = "block";
      folderHeader.classList.add("open");
      childrenWrap.classList.remove("collapsed");
    } else {
      grpEl.style.display = "none";
    }
  });
}

/**
 * =============================================================================
 * Custom Presets Management (나만의 프리셋 셀렉트, 관리 서랍, Drag & Drop)
 * =============================================================================
 */

const DEFAULT_CUSTOM_PRESETS = [
  { id: "cp_1", label: "태아자세 누운 전신", ko: "태아자세로 누워 있는 전신", en: "Full body lying in fetal position" },
  { id: "cp_2", label: "무릎 안고 앉기", ko: "무릎을 세우고 앉아서 양손으로 자신의 무릎을 감싸고 있는 자세의 전신", en: "Full body sitting with knees bent and covering knees with hands" },
  { id: "cp_3", label: "핑크 바디슈트", ko: "핑크색 타이트한 운동 전신 슈트, 맨발, 핑크색 발톱", en: "pink tight exercise full body suit, bare feet, pink feet top" }
];

let draggedPresetIndex = null;

function initCustomPresetsUI() {
  const saved = localStorage.getItem("visual_grid_custom_presets");
  if (saved) {
    try {
      state.customPresets = JSON.parse(saved);
    } catch (e) {
      state.customPresets = [...DEFAULT_CUSTOM_PRESETS];
    }
  } else {
    state.customPresets = [...DEFAULT_CUSTOM_PRESETS];
  }

  renderCustomPresets();

  // 커스텀 프리셋 셀렉트 변경 시 즉시 구도 교체
  if (elements.customPresetSelect) {
    elements.customPresetSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (!val) return;
      const selectedOpt = e.target.selectedOptions[0];
      const ko = selectedOpt ? selectedOpt.dataset.ko : "";
      const en = selectedOpt ? selectedOpt.dataset.en : val;
      
      setPresetToActiveArea({ ko, en });
      e.target.value = ""; // 리셋
    });
  }

  // 관리 서랍 토글 (아래로 커지면서 펼쳐짐)
  if (elements.btnToggleCustomManage && elements.customManageDrawer) {
    elements.btnToggleCustomManage.addEventListener("click", () => {
      const isCollapsed = elements.customManageDrawer.classList.toggle("collapsed");
      elements.btnToggleCustomManage.classList.toggle("open", !isCollapsed);
    });
  }

  if (elements.btnAddCustomPreset) {
    elements.btnAddCustomPreset.addEventListener("click", () => {
      openPresetModal(null);
    });
  }

  if (elements.btnSaveAsPreset) {
    elements.btnSaveAsPreset.addEventListener("click", () => {
      saveCurrentInputAsPreset();
    });
  }

  if (elements.btnClosePresetModal) {
    elements.btnClosePresetModal.addEventListener("click", closePresetModal);
  }

  if (elements.btnCancelPreset) {
    elements.btnCancelPreset.addEventListener("click", closePresetModal);
  }

  if (elements.modalCustomPreset) {
    elements.modalCustomPreset.addEventListener("click", (e) => {
      if (e.target === elements.modalCustomPreset) {
        closePresetModal();
      }
    });
  }

  if (elements.btnSavePresetConfirm) {
    elements.btnSavePresetConfirm.addEventListener("click", savePresetFromModal);
  }
}

function updateCustomPresetSelect() {
  if (!elements.customPresetSelect) return;
  const count = state.customPresets ? state.customPresets.length : 0;
  elements.customPresetSelect.innerHTML = `<option value="">▼ ⭐ 나만의 프리셋 (${count}개 등록됨)</option>`;

  if (state.customPresets && state.customPresets.length > 0) {
    state.customPresets.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.en || item.ko;
      opt.textContent = `⭐ ${item.label || item.ko}`;
      opt.dataset.ko = item.ko;
      opt.dataset.en = item.en || item.ko;
      elements.customPresetSelect.appendChild(opt);
    });
  }
}

function renderCustomPresets() {
  updateCustomPresetSelect();

  if (!elements.customChipsContainer) return;
  elements.customChipsContainer.innerHTML = "";

  if (!state.customPresets || state.customPresets.length === 0) {
    elements.customChipsContainer.innerHTML = `<span style="font-size:10.5px; color:var(--text-muted); font-style:italic; padding:4px;">등록된 커스텀 프리셋이 없습니다. [➕ 새 프리셋 생성]을 눌러보세요.</span>`;
    return;
  }

  state.customPresets.forEach((item, index) => {
    const chip = document.createElement("div");
    chip.className = "custom-chip";
    chip.draggable = true;
    chip.dataset.index = index;

    // Drag handle
    const handle = document.createElement("span");
    handle.className = "custom-chip-drag-handle";
    handle.textContent = "⠿";
    handle.title = "마우스로 끌어서 순서 변경 (Drag & Drop)";

    // Label span (click to replace active area)
    const label = document.createElement("span");
    label.className = "custom-chip-label";
    label.textContent = item.label || item.ko;
    label.title = `클릭하여 [${item.label || item.ko}] 구도로 교체`;
    label.addEventListener("click", () => {
      setPresetToActiveArea({ ko: item.ko, en: item.en || item.ko });
    });

    // Action buttons (edit, delete)
    const actions = document.createElement("span");
    actions.className = "custom-chip-actions";

    const btnEdit = document.createElement("button");
    btnEdit.className = "custom-chip-btn edit";
    btnEdit.type = "button";
    btnEdit.innerHTML = "✏️";
    btnEdit.title = "이 프리셋 수정";
    btnEdit.addEventListener("click", (e) => {
      e.stopPropagation();
      openPresetModal(item);
    });

    const btnDel = document.createElement("button");
    btnDel.className = "custom-chip-btn delete";
    btnDel.type = "button";
    btnDel.innerHTML = "×";
    btnDel.title = "이 프리셋 삭제";
    btnDel.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteCustomPreset(item.id);
    });

    actions.appendChild(btnEdit);
    actions.appendChild(btnDel);

    chip.appendChild(handle);
    chip.appendChild(label);
    chip.appendChild(actions);

    // HTML5 Drag & Drop
    chip.addEventListener("dragstart", (e) => {
      draggedPresetIndex = index;
      chip.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", index);
    });

    chip.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      chip.classList.add("drag-over");
    });

    chip.addEventListener("dragleave", () => {
      chip.classList.remove("drag-over");
    });

    chip.addEventListener("drop", (e) => {
      e.preventDefault();
      chip.classList.remove("drag-over");
      const targetIndex = index;
      if (draggedPresetIndex !== null && draggedPresetIndex !== targetIndex) {
        const [movedItem] = state.customPresets.splice(draggedPresetIndex, 1);
        state.customPresets.splice(targetIndex, 0, movedItem);
        saveCustomPresetsToStorage();
        renderCustomPresets();
        showToast("프리셋 순서가 변경되었습니다.");
      }
    });

    chip.addEventListener("dragend", () => {
      chip.classList.remove("dragging");
      draggedPresetIndex = null;
      document.querySelectorAll(".custom-chip").forEach(c => c.classList.remove("drag-over"));
    });

    elements.customChipsContainer.appendChild(chip);
  });
}

function openPresetModal(preset = null) {
  if (!elements.modalCustomPreset) return;

  if (preset) {
    if (elements.modalPresetTitle) elements.modalPresetTitle.textContent = "✏️ 커스텀 프리셋 수정";
    if (elements.presetEditId) elements.presetEditId.value = preset.id;
    if (elements.presetInputLabel) elements.presetInputLabel.value = preset.label || "";
    if (elements.presetInputKo) elements.presetInputKo.value = preset.ko || "";
    if (elements.presetInputEn) elements.presetInputEn.value = preset.en || "";
  } else {
    if (elements.modalPresetTitle) elements.modalPresetTitle.textContent = "➕ 새 커스텀 프리셋 추가";
    if (elements.presetEditId) elements.presetEditId.value = "";
    if (elements.presetInputLabel) elements.presetInputLabel.value = "";
    if (elements.presetInputKo) elements.presetInputKo.value = "";
    if (elements.presetInputEn) elements.presetInputEn.value = "";
  }

  elements.modalCustomPreset.style.display = "flex";
  if (elements.presetInputLabel) elements.presetInputLabel.focus();
}

function closePresetModal() {
  if (elements.modalCustomPreset) {
    elements.modalCustomPreset.style.display = "none";
  }
}

async function savePresetFromModal() {
  const label = (elements.presetInputLabel?.value || "").trim();
  const ko = (elements.presetInputKo?.value || "").trim();
  let en = (elements.presetInputEn?.value || "").trim();

  if (!ko && !label) {
    showToast("프리셋 이름 또는 한글 프롬프트를 입력하세요!");
    return;
  }

  const finalLabel = label || ko.slice(0, 15);
  const finalKo = ko || label;

  if (!en && finalKo) {
    en = translateViaDictionary(finalKo) || (await translatePrompt(finalKo));
  }

  const editId = elements.presetEditId?.value;

  if (editId) {
    const target = state.customPresets.find(p => p.id === editId);
    if (target) {
      target.label = finalLabel;
      target.ko = finalKo;
      target.en = en;
      showToast(`'${finalLabel}' 프리셋이 수정되었습니다.`);
    }
  } else {
    const newPreset = {
      id: "cp_" + Date.now(),
      label: finalLabel,
      ko: finalKo,
      en: en
    };
    state.customPresets.push(newPreset);
    showToast(`'${finalLabel}' 프리셋이 등록되었습니다!`);
  }

  saveCustomPresetsToStorage();
  renderCustomPresets();
  closePresetModal();
}

function saveCurrentInputAsPreset() {
  const currentKo = elements.inputKoPrompt?.value?.trim() || "";
  const currentEn = elements.inputEnPrompt?.value?.trim() || "";

  if (!currentKo && !currentEn) {
    showToast("먼저 영역 프롬프트 입력창에 내용을 작성하세요!");
    return;
  }

  openPresetModal(null);
  if (elements.presetInputLabel) elements.presetInputLabel.value = currentKo.slice(0, 12);
  if (elements.presetInputKo) elements.presetInputKo.value = currentKo;
  if (elements.presetInputEn) elements.presetInputEn.value = currentEn;
}

function deleteCustomPreset(id) {
  state.customPresets = state.customPresets.filter(p => p.id !== id);
  saveCustomPresetsToStorage();
  renderCustomPresets();
  showToast("프리셋이 삭제되었습니다.");
}

function saveCustomPresetsToStorage() {
  localStorage.setItem("visual_grid_custom_presets", JSON.stringify(state.customPresets));
}

/**
 * Initialize Templates Horizontal Bar
 */
function initLayoutTemplatesUI() {
  elements.templatesContainer.innerHTML = "";
  LAYOUT_TEMPLATES.forEach(tpl => {
    const btn = document.createElement("button");
    btn.className = "btn-template";
    btn.innerHTML = `<span>${tpl.name}</span>`;
    btn.addEventListener("click", () => {
      loadTemplate(tpl);
      showToast(`레이아웃 템플릿 '${tpl.name}' 적용 완료!`);
    });
    elements.templatesContainer.appendChild(btn);
  });
}

/**
 * Load Predefined Template
 */
function loadTemplate(tpl) {
  state.aspectRatio = tpl.aspectRatio;
  state.cols = tpl.cols;
  state.rows = tpl.rows;
  state.whiteBg = tpl.whiteBg;
  state.gridBorders = tpl.gridBorders;
  state.characterSheetStyle = tpl.characterSheetStyle;
  state.prefixPrompt = tpl.prefixPrompt || state.prefixPrompt;
  state.suffixPrompt = tpl.suffixPrompt || state.suffixPrompt;
  state.areas = JSON.parse(JSON.stringify(tpl.areas));
  state.selectedAreaId = state.areas.length > 0 ? state.areas[0].id : null;

  updateCanvasDimensions();
  renderGridCells();
  renderAreas();
  updateUIInputs();
  updatePromptOutput();
  saveState();
}

// =============================================================================
// Canvas & Grid Render Functions (Fluid Auto-Fit)
// =============================================================================

function updateCanvasDimensions() {
  if (!elements.canvasViewport || !elements.canvasWrapper) return;

  const containerW = Math.max(260, elements.canvasViewport.clientWidth - 32);
  const ratio = RATIO_MAP[state.aspectRatio] || (16 / 9);

  let targetW, targetH;

  if (ratio >= 1.3) {
    // Wide Landscape (16:9, 21:9, 3:2, 4:3)
    targetW = Math.min(containerW, 580);
    targetW = Math.max(targetW, 280);
    targetH = Math.round(targetW / ratio);
  } else if (ratio >= 0.95 && ratio <= 1.25) {
    // Square / Near-Square (1:1, 4:3 portrait)
    targetW = Math.min(containerW, 400);
    targetW = Math.max(targetW, 260);
    targetH = Math.round(targetW / ratio);
  } else {
    // Tall Portrait (9:16, 3:4, 2:3) - Give generous vertical height
    targetH = 480;
    targetW = Math.round(targetH * ratio);
    
    // If width exceeds container, scale proportionally
    if (targetW > containerW) {
      targetW = containerW;
      targetH = Math.round(targetW / ratio);
    }
  }

  targetW = Math.round(targetW);
  targetH = Math.round(targetH);

  elements.canvasWrapper.style.width = `${targetW}px`;
  elements.canvasWrapper.style.height = `${targetH}px`;

  // Update ratio buttons
  elements.ratioButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.ratio === state.aspectRatio);
  });

  // Update stepper counts
  elements.colsCount.textContent = state.cols;
  elements.rowsCount.textContent = state.rows;
}

function renderGridCells() {
  elements.gridBoard.style.gridTemplateColumns = `repeat(${state.cols}, 1fr)`;
  elements.gridBoard.style.gridTemplateRows = `repeat(${state.rows}, 1fr)`;
  elements.gridBoard.innerHTML = "";

  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.dataset.col = c;
      cell.dataset.row = r;
      elements.gridBoard.appendChild(cell);
    }
  }
}

function renderAreas() {
  elements.areasContainer.innerHTML = "";

  const totalCols = state.cols;
  const totalRows = state.rows;

  state.areas.forEach((area, index) => {
    const palette = COLOR_PALETTE[index % COLOR_PALETTE.length];
    const isSelected = area.id === state.selectedAreaId;

    const leftPct = (area.c1 / totalCols) * 100;
    const topPct = (area.r1 / totalRows) * 100;
    const widthPct = ((area.c2 - area.c1 + 1) / totalCols) * 100;
    const heightPct = ((area.r2 - area.r1 + 1) / totalRows) * 100;

    const box = document.createElement("div");
    box.className = `area-box ${isSelected ? "selected" : ""}`;
    box.style.left = `${leftPct}%`;
    box.style.top = `${topPct}%`;
    box.style.width = `${widthPct}%`;
    box.style.height = `${heightPct}%`;
    box.style.borderColor = palette.border;
    box.style.backgroundColor = palette.bg;
    box.style.color = palette.border;
    box.style.setProperty('--area-glow', palette.glow);
    box.style.setProperty('--area-border', palette.border);

    if (isSelected) {
      box.style.boxShadow = `0 0 25px ${palette.glow}, inset 0 0 15px ${palette.glow}`;
    }

    const spatialName = getNaturalSpatialName(area.c1, area.c2, area.r1, area.r2, totalCols, totalRows);

    // Area Header
    const header = document.createElement("div");
    header.className = "area-header";

    // Compact [1], [2] badge only in top-left
    const badge = document.createElement("div");
    badge.className = "area-badge";
    badge.innerHTML = `<span>[${area.id}]</span>`;
    badge.title = `[${area.id}] ${spatialName}`;

    // Close Button [x] with robust click & mousedown deletion
    const closeBtn = document.createElement("button");
    closeBtn.className = "area-close-btn";
    closeBtn.innerHTML = "×";
    closeBtn.title = "이 영역 삭제 (마우스 우클릭으로도 삭제 가능)";

    const handleDelete = (e) => {
      e.stopPropagation();
      e.preventDefault();
      deleteArea(area.id);
    };

    closeBtn.addEventListener("mousedown", handleDelete);
    closeBtn.addEventListener("click", handleDelete);
    closeBtn.addEventListener("touchstart", handleDelete);

    header.appendChild(badge);
    header.appendChild(closeBtn);
    box.appendChild(header);

    // Mockup silhouette SVG vector graphic if enabled
    if (state.mockupEnabled) {
      const mockupWrap = document.createElement("div");
      mockupWrap.className = "area-mockup-wrapper";
      mockupWrap.innerHTML = getMockupSvg(`${area.koPrompt || ''} ${area.prompt || ''}`);
      box.appendChild(mockupWrap);
    }

    // =========================================================================
    // Area Body: 한글 프롬프트만 투명 배경에 선명하게 표시 (영문 서술 제거)
    // =========================================================================
    const areaBody = document.createElement("div");
    areaBody.className = "area-body";

    const ko = area.koPrompt ? area.koPrompt.trim() : "";
    const en = area.prompt ? area.prompt.trim() : "";

    if (ko) {
      const mainText = document.createElement("div");
      mainText.className = "area-prompt-main";
      mainText.textContent = ko;
      areaBody.appendChild(mainText);
    } else if (en) {
      const mainText = document.createElement("div");
      mainText.className = "area-prompt-main";
      mainText.textContent = en;
      areaBody.appendChild(mainText);
    } else {
      const emptyText = document.createElement("div");
      emptyText.className = "area-prompt-empty";
      emptyText.textContent = "✏️ 작성";
      areaBody.appendChild(emptyText);
    }

    box.appendChild(areaBody);

    // =========================================================================
    // Mouse Events on Area Box
    // 1. Left Click -> Select Area ONLY (DO NOT drag-create)
    // 2. Right Click -> Delete Area
    // =========================================================================
    box.addEventListener("mousedown", (e) => {
      if (e.target.closest(".area-close-btn")) {
        return; // [x] 버튼 자체 핸들러가 처리
      }

      if (e.button === 0) {
        // Left click: Stop propagation so canvasWrapper drag creation DOES NOT fire
        e.stopPropagation();
        selectArea(area.id);
        if (elements.inputKoPrompt) {
          elements.inputKoPrompt.focus();
        }
      } else if (e.button === 2) {
        // Right click: Delete area
        e.preventDefault();
        e.stopPropagation();
        deleteArea(area.id);
      }
    });

    box.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteArea(area.id);
    });

    elements.areasContainer.appendChild(box);
  });

  renderAreaTabs();
}

/**
 * 포즈 및 구도에 따른 정밀 벡터 SVG 실루엣 생성기 (화면 꽉 찬 실제 렌더링 비율)
 */
function getMockupSvg(text = "") {
  const lower = (text || "").toLowerCase();

  // 1. 태아자세 / 누운 자세 (Fetal / Lying down) - 가로로 넓게 꽉 찬 웅크린 포즈
  if (lower.includes("fetal") || lower.includes("lying") || lower.includes("누워") || lower.includes("태아") || lower.includes("누운") || lower.includes("바닥에") || lower.includes("sleeping")) {
    return `<svg viewBox="0 0 100 70" class="mockup-svg" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
      <!-- Head resting on arms -->
      <ellipse cx="24" cy="38" rx="10" ry="13" stroke-width="2.4"/>
      <!-- Curled Spine & Torso filling the wide frame -->
      <path d="M 34 26 Q 64 12 86 32 Q 94 44 88 58" stroke-width="2.6" stroke-linecap="round"/>
      <!-- Curled Legs (Fetal Knees tucked up) -->
      <path d="M 88 58 L 56 64 L 42 48" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Arms tucked under head -->
      <path d="M 30 46 L 44 54 L 34 62" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Ground shadow line -->
      <line x1="6" y1="67" x2="94" y2="67" stroke-width="1.8" stroke-dasharray="4,4" opacity="0.45"/>
    </svg>`;
  }

  // 2. 앉은 자세 / 무릎 세운 자세 (Sitting / Kneeling with knees bent) - 위아래/좌우 꽉 찬 착석 포즈
  if (lower.includes("sitting") || lower.includes("seated") || lower.includes("kneeling") || lower.includes("앉아") || lower.includes("앉은") || lower.includes("무릎")) {
    return `<svg viewBox="0 0 100 100" class="mockup-svg" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
      <!-- Head -->
      <ellipse cx="48" cy="16" rx="9" ry="12" stroke-width="2.4"/>
      <!-- Leaning Back & Torso -->
      <path d="M 40 28 L 56 28 L 52 60 L 36 60 Z" stroke-width="2.4" stroke-linecap="round"/>
      <!-- High Bent Knees & Legs filling the frame -->
      <path d="M 52 60 L 82 50 L 78 88 L 40 88" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 36 60 L 24 88 L 40 88" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Arms hugging knees -->
      <path d="M 44 34 L 76 52 L 78 70" stroke-width="2.4" stroke-linecap="round"/>
      <!-- Base ground line -->
      <line x1="10" y1="90" x2="90" y2="90" stroke-width="2" opacity="0.5"/>
    </svg>`;
  }

  // 3. 얼굴 초근접 / 매크로 (Extreme Close-up / Macro) - 화면 밖으로 눈/코/입이 150% 줌인 꽉 찬 앵글
  if (lower.includes("extreme close-up") || lower.includes("macro") || lower.includes("초근접") || lower.includes("눈") || lower.includes("eye")) {
    return `<svg viewBox="0 0 100 100" class="mockup-svg" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid slice">
      <!-- Viewfinder corner brackets -->
      <path d="M 6 22 L 6 6 L 22 6 M 94 22 L 94 6 L 78 6 M 6 78 L 6 94 L 22 94 M 94 78 L 94 94 L 78 94" stroke-width="2.8" stroke-linecap="round"/>
      <!-- Big Eyebrow line across frame -->
      <path d="M 8 28 Q 50 14 92 28" stroke-width="3.2" stroke-linecap="round"/>
      <!-- Macro Focused Eye taking 80% width -->
      <ellipse cx="50" cy="50" rx="38" ry="24" stroke-width="2.8"/>
      <circle cx="50" cy="50" r="16" fill="currentColor" opacity="0.25" stroke="currentColor" stroke-width="2.4"/>
      <circle cx="50" cy="50" r="7" fill="currentColor"/>
      <circle cx="54" cy="46" r="2.5" fill="#fff"/>
      <!-- Lips/Nose bridge hint -->
      <path d="M 24 84 Q 50 96 76 84" stroke-width="2.6" stroke-linecap="round"/>
    </svg>`;
  }

  // 4. 얼굴 45도 / 측면 (Face 45° Three-Quarter) - 두상 중심의 꽉 찬 3/4 바스트 앵글
  if ((lower.includes("three-quarter") && (lower.includes("face") || lower.includes("얼굴"))) || (lower.includes("45도") && (lower.includes("얼굴") || lower.includes("face"))) || lower.includes("profile") || (lower.includes("측면") && !lower.includes("전신"))) {
    return `<svg viewBox="0 0 100 100" class="mockup-svg" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
      <!-- 3/4 Head Contour filling 85% of frame -->
      <path d="M 40 8 Q 74 10 78 40 Q 80 66 58 78 L 40 78 Q 20 72 22 40 Z" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M 34 78 L 28 98 M 58 78 L 68 98 M 8 99 Q 50 90 92 99" stroke-width="2.6" stroke-linecap="round"/>
      <!-- 3/4 Face symmetry curve -->
      <path d="M 58 12 Q 68 42 56 74" stroke-width="1.4" stroke-dasharray="3,3" opacity="0.65"/>
      <line x1="26" y1="40" x2="76" y2="40" stroke-width="1.4" stroke-dasharray="3,3" opacity="0.65"/>
      <!-- Eyes & Features -->
      <circle cx="44" cy="38" r="3.5" fill="currentColor"/>
      <circle cx="66" cy="38" r="3.5" fill="currentColor"/>
      <path d="M 46 60 Q 54 66 62 60" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`;
  }

  // 5. 얼굴 정면 (Face Front / Portrait) - 85%를 꽉 채우는 정면 인물 바스트 앵글
  if (lower.includes("face") || lower.includes("얼굴") || lower.includes("portrait") || (lower.includes("정면") && !lower.includes("전신"))) {
    return `<svg viewBox="0 0 100 100" class="mockup-svg" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
      <!-- Head Oval filling 85% frame -->
      <ellipse cx="50" cy="40" rx="27" ry="34" stroke-width="2.4"/>
      <path d="M 23 30 Q 50 4 77 30" stroke-width="2.4" stroke-linecap="round"/>
      <!-- Neck & Shoulders stretching to bottom corners -->
      <path d="M 36 74 L 36 88 M 64 74 L 64 88 M 12 98 Q 50 88 88 98" stroke-width="2.6" stroke-linecap="round"/>
      <!-- Symmetry guide cross -->
      <line x1="50" y1="8" x2="50" y2="76" stroke-width="1.4" stroke-dasharray="3,3" opacity="0.65"/>
      <line x1="23" y1="40" x2="77" y2="40" stroke-width="1.4" stroke-dasharray="3,3" opacity="0.65"/>
      <!-- Eyes, Nose, Smile -->
      <circle cx="39" cy="38" r="3.6" fill="currentColor"/>
      <circle cx="61" cy="38" r="3.6" fill="currentColor"/>
      <path d="M 49 48 L 47 55 L 53 55" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 41 64 Q 50 70 59 64" stroke-width="2.4" stroke-linecap="round"/>
    </svg>`;
  }

  // 6. 상반신 / 가슴 / 허리 (Upper Body / Bust / Waist) - 화면 상단~하단 꽉 채운 상반신
  if (lower.includes("upper body") || lower.includes("bust") || lower.includes("waist") || lower.includes("상반신") || lower.includes("가슴") || lower.includes("허리")) {
    return `<svg viewBox="0 0 100 100" class="mockup-svg" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
      <!-- Head -->
      <ellipse cx="50" cy="18" rx="11" ry="14" stroke-width="2.4"/>
      <path d="M 44 32 L 44 38 M 56 32 L 56 38" stroke-width="2"/>
      <!-- Shoulders & Torso expanding wide -->
      <path d="M 14 48 Q 50 38 86 48 L 78 98 L 22 98 Z" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 14 48 L 6 94 M 86 48 L 94 94" stroke-width="2.4" stroke-linecap="round"/>
    </svg>`;
  }

  // 7. 하반신 / 다리 (Lower Body / Legs)
  if (lower.includes("lower body") || lower.includes("legs") || lower.includes("하반신") || lower.includes("다리")) {
    return `<svg viewBox="0 0 100 100" class="mockup-svg" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
      <path d="M 30 14 L 70 14 L 62 38 L 38 38 Z" stroke-width="2.4"/>
      <path d="M 40 38 L 36 94 L 26 96 M 60 38 L 64 94 L 74 96" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="50" y1="38" x2="50" y2="76" stroke-width="2"/>
    </svg>`;
  }

  // 8. 전신 (Full Body Standing - 세로 칸에 맞춰 머리부터 발끝까지 95% 꽉 차는 마네킹 전신 비율)
  if (lower.includes("full body") || lower.includes("전신")) {
    return `<svg viewBox="0 0 46 100" class="mockup-svg" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
      <!-- Head at top 4-15% -->
      <ellipse cx="23" cy="9" rx="5.5" ry="7.5" stroke-width="1.8"/>
      <!-- Neck -->
      <path d="M 21 16.5 L 21 19 M 25 16.5 L 25 19" stroke-width="1.5"/>
      <!-- Shoulders, Torso, Slim Waist, Hips (Fashion Mannequin curve) -->
      <path d="M 11 21 Q 23 18 35 21 L 31 39 Q 23 44 15 39 Z" stroke-width="1.8" stroke-linejoin="round"/>
      <!-- Arms -->
      <path d="M 11 21 L 7 42 L 6 56 M 35 21 L 39 42 L 40 56" stroke-width="1.8" stroke-linecap="round"/>
      <!-- Legs stretching all the way to 96% bottom height -->
      <path d="M 17 40 L 15 70 L 13 96 L 9 98" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 29 40 L 31 70 L 33 96 L 37 98" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Center vertical posture line -->
      <line x1="23" y1="2" x2="23" y2="98" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.45"/>
    </svg>`;
  }

  // 9. 발 클로즈업 (Feet / Foot Sole / Arch Close-up)
  if (lower.includes("feet") || lower.includes("foot") || lower.includes("toes") || lower.includes("발") || lower.includes("발등") || lower.includes("발바닥")) {
    return `<svg viewBox="0 0 100 100" class="mockup-svg" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
      <!-- Ankle & Foot Contour with graceful arch & toes -->
      <path d="M 38 12 L 36 48 Q 34 66 18 78 L 18 86 Q 44 86 64 82 Q 86 78 88 64 Q 88 52 74 46 L 52 42 L 52 12" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Toe separators -->
      <circle cx="24" cy="80" r="3" fill="currentColor"/>
      <circle cx="32" cy="80" r="2.5" fill="currentColor"/>
      <circle cx="40" cy="79" r="2.2" fill="currentColor"/>
      <!-- Ground line -->
      <line x1="8" y1="92" x2="92" y2="92" stroke-width="2" stroke-dasharray="4,4" opacity="0.5"/>
    </svg>`;
  }

  // 10. 손 클로즈업 (Hand & Fingers Gesture Close-up)
  if (lower.includes("hand") || lower.includes("palm") || lower.includes("손") || lower.includes("손등") || lower.includes("손바닥") || lower.includes("fingers")) {
    return `<svg viewBox="0 0 100 100" class="mockup-svg" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
      <!-- Wrist & Palm -->
      <path d="M 36 94 L 38 64 L 22 52 L 28 36 L 40 48 L 42 22 L 52 22 L 52 46 L 56 16 L 66 16 L 64 48 L 68 24 L 78 26 L 74 54 Q 72 74 58 94 Z" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="38" y1="94" x2="58" y2="94" stroke-width="2.6" stroke-linecap="round"/>
    </svg>`;
  }

  // 11. 엉덩이부 (Hips & Buttocks Focus)
  if (lower.includes("hip") || lower.includes("buttocks") || lower.includes("pelvis") || lower.includes("엉덩이") || lower.includes("골반")) {
    return `<svg viewBox="0 0 100 100" class="mockup-svg" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
      <!-- Waist to Hips & Buttocks Contour -->
      <path d="M 30 14 Q 24 44 18 64 Q 14 84 38 88 L 44 88 M 70 14 Q 76 44 82 64 Q 86 84 62 88 L 56 88" stroke-width="2.6" stroke-linecap="round"/>
      <!-- Center pelvic line / Spine base -->
      <path d="M 50 18 L 50 68 Q 50 82 44 88 M 50 68 Q 50 82 56 88" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Gluteal curves -->
      <path d="M 28 66 Q 50 80 44 88 M 72 66 Q 50 80 56 88" stroke-width="2" opacity="0.6"/>
    </svg>`;
  }

  // 12. 가슴 클로즈업 / 쇄골 (Chest & Neckline Close-up)
  if (lower.includes("chest") || lower.includes("가슴 클로즈업") || lower.includes("쇄골") || lower.includes("collarbone")) {
    return `<svg viewBox="0 0 100 100" class="mockup-svg" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
      <!-- Neck & Collarbones -->
      <path d="M 40 10 L 40 28 M 60 10 L 60 28 M 16 38 Q 40 34 50 42 Q 60 34 84 38" stroke-width="2.4" stroke-linecap="round"/>
      <!-- Chest curve / Bust contour -->
      <path d="M 18 42 Q 36 78 50 64 Q 64 78 82 42" stroke-width="2.6" stroke-linecap="round"/>
      <!-- Torso outline -->
      <path d="M 22 70 L 26 96 M 78 70 L 74 96" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`;
  }

  // Default: Humanoid Silhouette
  return `<svg viewBox="0 0 100 100" class="mockup-svg" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
    <circle cx="50" cy="26" r="14" stroke-width="2.4"/>
    <path d="M 24 82 C 24 56 76 56 76 82" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`;
}

function renderAreaTabs() {
  elements.areaTabs.innerHTML = "";
  state.areas.forEach((area, index) => {
    const palette = COLOR_PALETTE[index % COLOR_PALETTE.length];
    const isSelected = area.id === state.selectedAreaId;

    const tab = document.createElement("div");
    tab.className = `area-tab ${isSelected ? "active" : ""}`;
    if (isSelected) {
      tab.style.background = palette.border;
      tab.style.color = "#000";
      tab.style.fontWeight = "800";
      tab.style.boxShadow = `0 0 14px ${palette.glow}`;
      tab.style.borderColor = palette.border;
      tab.innerHTML = `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#000"></span> 영역 [${area.id}] 🎯`;
    } else {
      tab.style.background = "var(--bg-surface)";
      tab.style.color = "var(--text-secondary)";
      tab.style.fontWeight = "600";
      tab.style.boxShadow = "none";
      tab.style.borderColor = "var(--border-subtle)";
      tab.innerHTML = `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${palette.border}"></span> 영역 [${area.id}]`;
    }

    tab.addEventListener("click", () => selectArea(area.id));
    elements.areaTabs.appendChild(tab);
  });

  if (state.areas.length === 0) {
    elements.areaTabs.innerHTML = `<span style="font-size:11px;color:var(--text-muted);padding:4px 0;">빈 격자 칸을 마우스 좌클릭 드래그하여 영역을 생성하세요.</span>`;
  }
}

// =============================================================================
// Mouse Drag & Area Creation Logic (Empty Cells Only)
// =============================================================================

function getCellFromMouseEvent(e) {
  const rect = elements.canvasWrapper.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width - 1));
  const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height - 1));

  const col = Math.floor((x / rect.width) * state.cols);
  const row = Math.floor((y / rect.height) * state.rows);

  return {
    col: Math.max(0, Math.min(col, state.cols - 1)),
    row: Math.max(0, Math.min(row, state.rows - 1))
  };
}

function handleMouseDown(e) {
  // Only Left-Click on canvas background/cells can start drag creation
  if (e.button !== 0) {
    return;
  }

  // If clicked inside an existing area box or any interactive button, ignore!
  if (e.target.closest(".area-box") || e.target.closest(".area-close-btn") || e.target.closest("button")) {
    return;
  }
  
  const cell = getCellFromMouseEvent(e);
  state.isDragging = true;
  state.dragStartCell = cell;
  state.dragCurrentCell = cell;

  updateSelectionBox();
  elements.selectionBox.style.display = "block";
}

function handleMouseMove(e) {
  if (!state.isDragging) return;
  state.dragCurrentCell = getCellFromMouseEvent(e);
  updateSelectionBox();
}

function handleMouseUp(e) {
  if (!state.isDragging) return;
  state.isDragging = false;
  elements.selectionBox.style.display = "none";

  if (!state.dragStartCell || !state.dragCurrentCell) return;

  const c1 = Math.min(state.dragStartCell.col, state.dragCurrentCell.col);
  const c2 = Math.max(state.dragStartCell.col, state.dragCurrentCell.col);
  const r1 = Math.min(state.dragStartCell.row, state.dragCurrentCell.row);
  const r2 = Math.max(state.dragStartCell.row, state.dragCurrentCell.row);

  createNewArea(c1, c2, r1, r2);
}

function updateSelectionBox() {
  if (!state.dragStartCell || !state.dragCurrentCell) return;

  const c1 = Math.min(state.dragStartCell.col, state.dragCurrentCell.col);
  const c2 = Math.max(state.dragStartCell.col, state.dragCurrentCell.col);
  const r1 = Math.min(state.dragStartCell.row, state.dragCurrentCell.row);
  const r2 = Math.max(state.dragStartCell.row, state.dragCurrentCell.row);

  const leftPct = (c1 / state.cols) * 100;
  const topPct = (r1 / state.rows) * 100;
  const widthPct = ((c2 - c1 + 1) / state.cols) * 100;
  const heightPct = ((r2 - r1 + 1) / state.rows) * 100;

  elements.selectionBox.style.left = `${leftPct}%`;
  elements.selectionBox.style.top = `${topPct}%`;
  elements.selectionBox.style.width = `${widthPct}%`;
  elements.selectionBox.style.height = `${heightPct}%`;
}

function createNewArea(c1, c2, r1, r2) {
  const nextId = state.areas.length > 0 ? Math.max(...state.areas.map(a => a.id)) + 1 : 1;

  const newArea = {
    id: nextId,
    c1, c2, r1, r2,
    koPrompt: "",
    prompt: ""
  };

  state.areas.push(newArea);
  state.selectedAreaId = nextId;

  renderAreas();
  updateUIInputs();
  updatePromptOutput();
  saveState();

  showToast(`영역 [${nextId}] 생성 완료!`);
  if (elements.inputKoPrompt) {
    elements.inputKoPrompt.focus();
  }
}

function deleteArea(areaId) {
  state.areas = state.areas.filter(a => a.id !== areaId);
  
  // Re-index area IDs for clean sequence
  state.areas.forEach((a, idx) => {
    a.id = idx + 1;
  });

  if (state.selectedAreaId === areaId) {
    state.selectedAreaId = state.areas.length > 0 ? state.areas[0].id : null;
  }

  renderAreas();
  updateUIInputs();
  updatePromptOutput();
  saveState();
  showToast(`영역 [${areaId}] 이(가) 해제(삭제)되었습니다.`);
}

function selectArea(areaId) {
  state.selectedAreaId = areaId;
  renderAreas();
  updateUIInputs();
}

// =============================================================================
// Editor & Translation Operations
// =============================================================================

function getSelectedArea() {
  return state.areas.find(a => a.id === state.selectedAreaId);
}

function updateUIInputs() {
  const current = getSelectedArea();
  if (current) {
    elements.editorCard.style.display = "block";

    // Active Area Color Synchronization
    const areaIndex = state.areas.findIndex(a => a.id === current.id);
    const palette = COLOR_PALETTE[areaIndex >= 0 ? areaIndex % COLOR_PALETTE.length : 0];

    elements.editorCard.style.setProperty('--active-area-color', palette.border);
    elements.editorCard.style.setProperty('--active-area-glow', palette.glow);
    elements.activeAreaTitle.innerHTML = `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${palette.border};box-shadow:0 0 10px ${palette.border};flex-shrink:0;"></span><span style="white-space:nowrap;">영역 [${current.id}] 프롬프트 설정</span><span style="font-size:10px;background:${palette.border};color:#000;padding:2px 7px;border-radius:10px;font-weight:800;box-shadow:0 0 8px ${palette.glow};white-space:nowrap;display:inline-block;flex-shrink:0;">선택됨 (ACTIVE)</span>`;
    
    elements.inputKoPrompt.value = current.koPrompt || "";
    elements.inputKoPrompt.placeholder = `👉 [영역 ${current.id}] 에 적용할 한글 프롬프트를 입력하세요 (예: 전신 정면, 은발에 푸른 눈...)`;

    elements.inputEnPrompt.value = current.prompt || "";
    elements.inputEnPrompt.placeholder = `👉 [Area ${current.id}] AI 영어 프롬프트 (자동 번역 또는 직접 수정)`;

    elements.btnTranslate.innerHTML = `✨ [영역 ${current.id}] 번역 & 적용 (Ctrl+Enter)`;
  } else {
    elements.editorCard.style.display = state.areas.length > 0 ? "block" : "none";
    elements.editorCard.style.removeProperty('--active-area-color');
    elements.editorCard.style.removeProperty('--active-area-glow');
    elements.editorCard.style.removeProperty('--active-area-bg');
    elements.activeAreaTitle.textContent = "영역을 선택하거나 새로 드래그하세요";
    elements.inputKoPrompt.value = "";
    elements.inputKoPrompt.placeholder = "편집할 영역을 먼저 선택하세요";
    elements.inputEnPrompt.value = "";
    elements.btnTranslate.innerHTML = `✨ 한글 번역 & 적용 (Ctrl+Enter)`;
  }

  // Sync Art Style Buttons
  if (elements.artStylesContainer) {
    elements.artStylesContainer.querySelectorAll(".btn-art-style").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.styleId === state.activeArtStyle);
    });
  }

  // Toggles
  elements.toggleWhiteBg.checked = state.whiteBg;
  elements.toggleWhiteBg.parentElement.classList.toggle("active", state.whiteBg);

  elements.toggleGridBorders.checked = state.gridBorders;
  elements.toggleGridBorders.parentElement.classList.toggle("active", state.gridBorders);

  elements.toggleMockup.checked = state.mockupEnabled;
  elements.toggleMockup.parentElement.classList.toggle("active", state.mockupEnabled);

  // Global inputs
  elements.inputPrefix.value = state.prefixPrompt;
  elements.inputSuffix.value = state.suffixPrompt;
}

async function applyActiveAreaPrompt() {
  const current = getSelectedArea();
  if (!current) return;

  const koText = elements.inputKoPrompt.value.trim();
  current.koPrompt = koText;

  if (koText) {
    const translated = await translatePrompt(koText);
    current.prompt = translated;
    elements.inputEnPrompt.value = translated;
  } else {
    current.prompt = elements.inputEnPrompt.value.trim();
  }

  renderAreas();
  updatePromptOutput();
  saveState();
  showToast("프롬프트가 적용되었습니다!");
}

function appendChipToActiveArea(chip) {
  const current = getSelectedArea();
  if (!current) {
    showToast("먼저 편집할 영역을 선택하세요!");
    return;
  }

  // Append Korean
  if (elements.inputKoPrompt.value.trim()) {
    elements.inputKoPrompt.value += `, ${chip.ko}`;
  } else {
    elements.inputKoPrompt.value = chip.ko;
  }

  // Append English
  if (elements.inputEnPrompt.value.trim()) {
    elements.inputEnPrompt.value += `, ${chip.en}`;
  } else {
    elements.inputEnPrompt.value = chip.en;
  }

  current.koPrompt = elements.inputKoPrompt.value;
  current.prompt = elements.inputEnPrompt.value;

  renderAreas();
  updatePromptOutput();
  saveState();
}

function updatePromptOutput() {
  const finalPos = buildFinalPrompt({
    areas: state.areas,
    cols: state.cols,
    rows: state.rows,
    aspectRatio: state.aspectRatio,
    format: state.format,
    whiteBg: state.whiteBg,
    gridBorders: state.gridBorders,
    characterSheetStyle: state.characterSheetStyle,
    prefixPrompt: state.prefixPrompt,
    suffixPrompt: state.suffixPrompt,
    characterProfile: state.characterProfileEn
  });

  const finalNeg = buildNegativePrompt({
    gridBorders: state.gridBorders
  });

  elements.outputPrompt.value = finalPos;
  elements.outputNegative.value = finalNeg;
}

function saveState() {
  localStorage.setItem("visual_grid_prompt_saved_state", JSON.stringify(state));
}

// =============================================================================
// Event Listeners Binding
// =============================================================================

function bindEvents() {
  // Canvas Mouse Dragging
  elements.canvasWrapper.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);

  // Prevent context menu on canvas wrapper
  elements.canvasWrapper.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  // Resize window
  window.addEventListener("resize", () => {
    updateCanvasDimensions();
  });

  // Aspect ratio switch
  elements.ratioButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      state.aspectRatio = btn.dataset.ratio;
      updateCanvasDimensions();
      renderAreas();
      updatePromptOutput();
      saveState();
    });
  });

  // Steppers
  elements.btnColsDec.addEventListener("click", () => {
    if (state.cols > 1) {
      state.cols--;
      updateCanvasDimensions();
      renderGridCells();
      renderAreas();
      updatePromptOutput();
      saveState();
    }
  });

  elements.btnColsInc.addEventListener("click", () => {
    if (state.cols < 20) {
      state.cols++;
      updateCanvasDimensions();
      renderGridCells();
      renderAreas();
      updatePromptOutput();
      saveState();
    }
  });

  elements.btnRowsDec.addEventListener("click", () => {
    if (state.rows > 1) {
      state.rows--;
      updateCanvasDimensions();
      renderGridCells();
      renderAreas();
      updatePromptOutput();
      saveState();
    }
  });

  elements.btnRowsInc.addEventListener("click", () => {
    if (state.rows < 20) {
      state.rows++;
      updateCanvasDimensions();
      renderGridCells();
      renderAreas();
      updatePromptOutput();
      saveState();
    }
  });

  // Toggles
  elements.toggleWhiteBg.addEventListener("change", (e) => {
    state.whiteBg = e.target.checked;
    e.target.parentElement.classList.toggle("active", state.whiteBg);
    updatePromptOutput();
    saveState();
  });

  elements.toggleGridBorders.addEventListener("change", (e) => {
    state.gridBorders = e.target.checked;
    e.target.parentElement.classList.toggle("active", state.gridBorders);
    updatePromptOutput();
    saveState();
  });

  elements.toggleMockup.addEventListener("change", (e) => {
    state.mockupEnabled = e.target.checked;
    e.target.parentElement.classList.toggle("active", state.mockupEnabled);
    renderAreas();
    saveState();
  });

  // Area prompt input events
  elements.inputKoPrompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      applyActiveAreaPrompt();
    }
  });

  elements.inputKoPrompt.addEventListener("input", () => {
    const current = getSelectedArea();
    if (current) {
      current.koPrompt = elements.inputKoPrompt.value;
      const fastEn = translateViaDictionary(current.koPrompt);
      if (fastEn && fastEn !== current.koPrompt) {
        elements.inputEnPrompt.value = fastEn;
        current.prompt = fastEn;
      }
      renderAreas();
      updatePromptOutput();
    }
  });

  elements.inputEnPrompt.addEventListener("input", () => {
    const current = getSelectedArea();
    if (current) {
      current.prompt = elements.inputEnPrompt.value;
      renderAreas();
      updatePromptOutput();
      saveState();
    }
  });

  elements.btnTranslate.addEventListener("click", applyActiveAreaPrompt);

  elements.btnDeleteArea.addEventListener("click", () => {
    if (state.selectedAreaId) {
      deleteArea(state.selectedAreaId);
    }
  });

  // Global inputs
  elements.inputPrefix.addEventListener("input", () => {
    state.prefixPrompt = elements.inputPrefix.value;
    updatePromptOutput();
    saveState();
  });

  elements.inputSuffix.addEventListener("input", () => {
    state.suffixPrompt = elements.inputSuffix.value;
    updatePromptOutput();
    saveState();
  });

  // Output format selector
  elements.formatSelect.addEventListener("change", (e) => {
    state.format = e.target.value;
    updatePromptOutput();
    saveState();
  });

  // Copy Buttons
  elements.btnCopyPrompt.addEventListener("click", () => {
    navigator.clipboard.writeText(elements.outputPrompt.value).then(() => {
      showToast("✨ 포지티브 프롬프트가 복사되었습니다!");
    });
  });

  elements.btnCopyNegative.addEventListener("click", () => {
    navigator.clipboard.writeText(elements.outputNegative.value).then(() => {
      showToast("🚫 네거티브 프롬프트가 복사되었습니다!");
    });
  });

  // Clear All
  elements.btnClearAll.addEventListener("click", () => {
    if (confirm("모든 영역을 초기화하시겠습니까?")) {
      state.areas = [];
      state.selectedAreaId = null;
      renderAreas();
      updateUIInputs();
      updatePromptOutput();
      saveState();
      showToast("모든 영역이 초기화되었습니다.");
    }
  });

  // Export JSON
  elements.btnExportJson.addEventListener("click", () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `visual_grid_preset_${state.aspectRatio.replace(':', '_')}.json`);
    dlAnchorElem.click();
    showToast("프리셋 JSON 파일이 다운로드되었습니다.");
  });

  // Import JSON
  elements.btnImportJson.addEventListener("click", () => {
    elements.fileImport.click();
  });

  elements.fileImport.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.areas && Array.isArray(parsed.areas)) {
          Object.assign(state, parsed);
          updateCanvasDimensions();
          renderGridCells();
          renderAreas();
          updateUIInputs();
          updatePromptOutput();
          saveState();
          showToast("프리셋 JSON 파일을 성공적으로 불러왔습니다!");
        } else {
          alert("유효하지 않은 프리셋 JSON 형식입니다.");
        }
      } catch (err) {
        alert("JSON 파일을 파싱하는 도중 오류가 발생했습니다: " + err.message);
      }
    };
    reader.readAsText(file);
  });

  // Keyboard Shortcuts
  window.addEventListener("keydown", (e) => {
    if (e.key === "Delete" && state.selectedAreaId && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      deleteArea(state.selectedAreaId);
    }
  });
}

/**
 * Toast Notification Popup
 */
export function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>⚡</span><span>${message}</span>`;
  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

// Start app once DOM loaded
document.addEventListener("DOMContentLoaded", initApp);
