const STORAGE_KEY = "tamagotchi_v3_sequential_records_v2";
const OLD_KEY = "tamagotchi_v3_family_records_v1";

const STAGES = ["baby", "child", "teen", "adult", "elder"];
const TIMELINE_BASE_STAGES = ["baby", "child", "teen", "adult"];
const STAGE_LABEL = {
  baby: "幼儿期",
  child: "儿童期",
  teen: "青春期",
  adult: "成年期",
  elder: "老年期"
};

const tabs = [
  { id: "family", label: "家谱图谱" },
  { id: "character", label: "角色资料库" },
  { id: "foods", label: "食物资料库" },
  { id: "items", label: "道具资料库" },
  { id: "rules", label: "养育注意事项" }
];
const FOOD_IMAGE_DIR = "./food-icons";
const ITEM_IMAGE_DIR = "./item-icons";
const FOOD_SOURCE_FILTER_OPTIONS = ["商店", "代码", "老头"];
const ITEM_SOURCE_FILTER_OPTIONS = ["商店", "代码", "老头", "神灯/宝箱"];


const state = {
  activeTab: "family",
  records: [],
  currentDraft: null,
  characters: characterProfiles,
  items: normalizeItemLibrary(itemLibrary),
  foods: normalizeFoodLibrary(foodLibrary),
  faq: faqSeed,
  selectorModal: {
    mode: "",
    stage: ""
  }
};
const sourceFilterState = {
  item: new Set(),
  food: new Set()
};

function createDraft(generationIndex = null) {
  const idx = generationIndex || nextGenerationIndex();
  return {
    generationIndex: idx,
    parity: idx % 2 === 1 ? "odd" : "even",
    stageIndex: 0,
    gender: "",
    spouseCharacterId: "none",
    spouseNote: "",
    stageCharacters: {
      baby: "",
      child: "",
      teen: "",
      adult: "",
      elder: ""
    }
  };
}

function nextGenerationIndex() {
  if (!state.records.length) return 1;
  return Math.max(...state.records.map((r) => r.generationIndex)) + 1;
}

function currentStage() {
  return STAGES[state.currentDraft.stageIndex] || STAGES[0];
}

function parityLabel(parity) {
  return parity === "odd" ? "Odd" : "Even";
}

function normalizeGenderValue(value) {
  const raw = normalizeText(value);
  if (raw === "male") return "boy";
  if (raw === "female") return "girl";
  if (raw === "boy" || raw === "girl") return raw;
  return "";
}

function formatGenderLabel(value) {
  const normalized = normalizeGenderValue(value);
  if (normalized === "boy") return "boy";
  if (normalized === "girl") return "girl";
  return "-";
}

function normalizeProfileGender(value) {
  const raw = normalizeText(value);
  if (raw === "male") return "boy";
  if (raw === "female") return "girl";
  return raw;
}

function formatAnyLabel(value) {
  const raw = normalizeText(value);
  if (!raw) return "-";
  if (raw === "any") return "Any";
  if (raw === "odd") return "Odd";
  if (raw === "even") return "Even";
  return String(value);
}

function formatRankLabel(value) {
  const raw = normalizeText(value);
  if (!raw || raw === "any") return "-";
  return String(value);
}

function stageOrderValue(stage) {
  const idx = STAGES.indexOf(stage);
  return idx === -1 ? 99 : idx;
}

function rankOrderValue(rank) {
  const raw = normalizeText(rank);
  if (raw === "s") return 0;
  if (raw === "a") return 1;
  if (raw === "b") return 2;
  if (raw === "c") return 3;
  if (raw === "d") return 4;
  return 5;
}

function getProfileByName(name) {
  return state.characters.find((profile) => profile.name === name) || null;
}

function getProfileById(id) {
  return state.characters.find((x) => x.id === id);
}

function getCharacterChineseName(profile) {
  const note = String(profile && profile.note ? profile.note : "");
  const matched = note.match(/中文名[:：]\s*([^；;]+)/);
  return matched ? matched[1].trim() : "";
}

function parseSleepValueFromNote(noteText) {
  const note = String(noteText || "");
  const matched = note.match(/睡眠[:：]\s*([^；;]+)/);
  return matched ? matched[1].trim() : "";
}

function formatSleepClockText(value, periodLabel) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const matched = raw.match(/^(\d{1,2})(?:[.:](\d{1,2}))?$/);
  if (!matched) return raw;
  const hour24 = Number(matched[1]);
  const minute = matched[2] ? Number(matched[2]) : 0;
  if (!Number.isFinite(hour24) || !Number.isFinite(minute)) return raw;
  const hour12 = hour24 % 12 || 12;
  const minuteText = minute ? (":" + String(minute).padStart(2, "0")) : "";
  return hour12 + minuteText + periodLabel;
}

function formatSleepDisplayText(rawSleepText) {
  const raw = String(rawSleepText || "").trim();
  if (!raw) return "-";
  const matched = raw.match(/^(\d{1,2}(?:[.:]\d{1,2})?)\s*[~～-]\s*(\d{1,2}(?:[.:]\d{1,2})?)$/);
  if (!matched) return raw;
  const start = formatSleepClockText(matched[1], "PM");
  const end = formatSleepClockText(matched[2], "AM");
  if (!start || !end) return raw;
  return start + "～" + end;
}

function getProfileSleepDisplayText(profile) {
  const sleepText = parseSleepValueFromNote(profile && profile.note);
  return formatSleepDisplayText(sleepText);
}

function getCharacterDisplayName(profile) {
  if (!profile) return "";
  return getCharacterChineseName(profile) || profile.name;
}

function getFixedStageProfile(stage, gender) {
  const normalized = normalizeGenderValue(gender);
  if (!normalized) return null;
  if (stage === "baby") return getProfileByName(normalized === "boy" ? "Kuroteletchi" : "Shiroteletchi");
  if (stage === "elder") return getProfileByName(normalized === "boy" ? "Ojitchi" : "Otokitchi");
  return null;
}

function applyAutoStageCharacter(draft, stage) {
  if (!draft) return;
  const fixed = getFixedStageProfile(stage, draft.gender);
  if (!fixed) return;
  draft.stageCharacters[stage] = fixed.id;
}

function inferGenderFromFixedStageProfile(stage, profile) {
  if (!profile) return "";
  const male = getFixedStageProfile(stage, "boy");
  const female = getFixedStageProfile(stage, "girl");
  if (male && male.id === profile.id) return "boy";
  if (female && female.id === profile.id) return "girl";
  return "";
}

function getCharacterChoicesByStage(stage, draft, includeParity = true) {
  const currentDraft = draft || state.currentDraft;
  if (stage === "baby") {
    return state.characters
      .filter((profile) => profile.stage === "baby")
      .slice()
      .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  }
  if (stage === "elder") {
    const fixed = getFixedStageProfile(stage, currentDraft && currentDraft.gender);
    return fixed ? [fixed] : [];
  }
  return state.characters
    .filter((profile) => profileMatches(profile, {
      stage: stage,
      gender: currentDraft ? currentDraft.gender : "",
      parity: includeParity && currentDraft ? currentDraft.parity : ""
    }))
    .slice()
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

function getCharacterChoicesForCurrentStage() {
  return getCharacterChoicesByStage(currentStage(), state.currentDraft, true);
}

function getAdultSpouseChoices() {
  return getCharacterChoicesByStage("adult", state.currentDraft, false);
}

function normalizeRecord(record) {
  const next = {
    ...record,
    gender: normalizeGenderValue(record && record.gender),
    spouseCharacterId: record && record.spouseCharacterId ? String(record.spouseCharacterId) : "none",
    spouseNote: record && record.spouseNote ? String(record.spouseNote) : "",
    stageCharacters: {
      baby: "",
      child: "",
      teen: "",
      adult: "",
      elder: "",
      ...(record && record.stageCharacters ? record.stageCharacters : {})
    }
  };
  if (typeof next.stageIndexDone !== "number") next.stageIndexDone = 0;
  return next;
}

function isValidTabId(id) {
  return tabs.some((tab) => tab.id === id);
}

function openTab(id) {
  const nextId = isValidTabId(id) ? id : "family";
  state.activeTab = nextId;
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === nextId);
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === "panel-" + nextId);
  });
  saveState();
}

function renderTabs() {
  const el = document.getElementById("tabs");
  el.innerHTML = "";
  tabs.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (tab.id === state.activeTab ? " active" : "");
    btn.type = "button";
    btn.dataset.tab = tab.id;
    btn.textContent = tab.label;
    btn.addEventListener("click", () => openTab(tab.id));
    el.appendChild(btn);
  });
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.records)) state.records = parsed.records.map(normalizeRecord);
      if (isValidTabId(parsed.activeTab)) state.activeTab = parsed.activeTab;
      if (parsed.currentDraft) {
        state.currentDraft = parsed.currentDraft;
        normalizeDraft();
      } else {
        state.currentDraft = createDraft();
      }
      return;
    } catch (error) {
    }
  }

  // 旧版本降级迁移（node 结构 -> 简化代记录）
  const oldRaw = localStorage.getItem(OLD_KEY);
  if (oldRaw) {
    try {
      const oldParsed = JSON.parse(oldRaw);
      const nodes = Array.isArray(oldParsed.nodes) ? oldParsed.nodes : [];
      const grouped = new Map();
      nodes.forEach((n) => {
        const g = Number(n.generation && n.generation.index) || 1;
        if (!grouped.has(g)) grouped.set(g, []);
        grouped.get(g).push(n);
      });
      const generations = Array.from(grouped.keys()).sort((a, b) => a - b);
      state.records = generations.map((g) => {
        const list = grouped.get(g);
        const pick = list[0] || {};
        const teen = list.find((x) => x.stage === "teen");
        const adult = list.find((x) => x.stage === "adult");
        return {
          id: "migrate_" + g,
          generationIndex: g,
          parity: g % 2 === 1 ? "odd" : "even",
          gender: normalizeGenderValue(pick.gender || ""),
          spouseCharacterId: "none",
          spouseNote: adult && adult.spouse ? "已记录配偶关系" : "",
          stageCharacters: {
            baby: "",
            child: "",
            teen: teen ? (teen.character || "") : "",
            adult: adult ? (adult.character || "") : "",
            elder: ""
          },
          stageIndexDone: adult ? 3 : 2,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
      });
      state.currentDraft = createDraft();
      saveState();
      return;
    } catch (error) {
    }
  }

  state.records = [];
  state.currentDraft = createDraft();
}

function normalizeDraft() {
  const d = state.currentDraft;
  if (!d.stageCharacters) {
    d.stageCharacters = { baby: "", child: "", teen: "", adult: "", elder: "" };
  }
  d.gender = normalizeGenderValue(d.gender);
  if (!d.spouseCharacterId) d.spouseCharacterId = "none";
  if (typeof d.stageIndex !== "number") d.stageIndex = 0;
  d.stageIndex = Math.max(0, Math.min(STAGES.length - 1, d.stageIndex));
  if (!d.generationIndex) d.generationIndex = nextGenerationIndex();
  d.parity = d.generationIndex % 2 === 1 ? "odd" : "even";
  applyAutoStageCharacter(d, "baby");
  if (d.stageIndex >= STAGES.indexOf("elder")) applyAutoStageCharacter(d, "elder");
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    activeTab: state.activeTab,
    records: state.records,
    currentDraft: state.currentDraft
  }));
}

function profileMatches(profile, condition) {
  if (condition.stage && profile.stage !== condition.stage) return false;
  const condGender = normalizeGenderValue(condition.gender);
  const profileGender = normalizeProfileGender(profile.gender);
  if (condGender && profileGender !== "any" && profileGender !== condGender) return false;
  if (condition.parity && profile.parity !== "any" && profile.parity !== condition.parity) return false;
  return true;
}

function getFoodById(foodId) {
  const target = String(foodId || "").trim();
  if (!target) return null;
  return state.foods.find((food) => String(food.id || "").trim() === target) || null;
}

function getFoodByName(name) {
  const target = normalizeText(name);
  if (!target) return null;
  return state.foods.find((food) => {
    return normalizeText(food.chinese) === target || normalizeText(food.english) === target;
  }) || null;
}

function formatFoodText(food, fallbackName) {
  if (food) {
    if (food.chinese && food.english) return food.chinese + " / " + food.english;
    return food.chinese || food.english || fallbackName || "-";
  }
  return fallbackName || "-";
}

function resolveFoodPreferenceList(foodIds, foodNames) {
  const list = [];
  const ids = Array.isArray(foodIds) ? foodIds : [];
  const names = Array.isArray(foodNames) ? foodNames : [];
  ids.forEach((id) => {
    const food = getFoodById(id);
    list.push({
      id: id,
      image: food && food.image ? food.image : "",
      text: formatFoodText(food, id)
    });
  });
  names.forEach((name) => {
    const food = getFoodByName(name);
    const text = formatFoodText(food, name);
    if (list.some((item) => item.text === text)) return;
    list.push({
      id: food && food.id ? food.id : name,
      image: food && food.image ? food.image : "",
      text: text
    });
  });
  return list;
}

function resolveFoodPreferenceDetailList(foodIds, foodNames) {
  const details = [];
  const appendFood = (food, fallback) => {
    const fallbackText = String(fallback || "").trim();
    const chinese = String(food && food.chinese ? food.chinese : fallbackText).trim() || "-";
    const english = String(food && food.english ? food.english : "").trim() || "-";
    const id = String(food && food.id ? food.id : fallbackText).trim();
    const key = [id, chinese, english].join("|");
    if (details.some((entry) => entry.key === key)) return;
    details.push({
      key,
      id,
      image: food && food.image ? food.image : "",
      chinese,
      english
    });
  };

  const ids = Array.isArray(foodIds) ? foodIds : [];
  const names = Array.isArray(foodNames) ? foodNames : [];
  ids.forEach((id) => appendFood(getFoodById(id), id));
  names.forEach((name) => appendFood(getFoodByName(name), name));
  return details;
}

function renderTimelineFoodHover(profile) {
  if (!profile) return "";
  const likedFoods = resolveFoodPreferenceDetailList(profile.favoriteFoodIds, profile.favoriteFoods);
  const dislikedFoods = resolveFoodPreferenceDetailList(profile.dislikedFoodIds, profile.dislikedFoods);
  const sleepDisplay = getProfileSleepDisplayText(profile);

  const toItems = (foods) => renderTimelineFoodItems(foods);

  return (
    '<div class="timeline-food-hover">' +
    '<div class="timeline-food-group"><div class="timeline-food-title">喜欢食物</div>' + toItems(likedFoods) + "</div>" +
    '<div class="timeline-food-group"><div class="timeline-food-title">讨厌食物</div>' + toItems(dislikedFoods) + "</div>" +
    '<div class="timeline-sleep-row"><div class="timeline-food-title">睡眠时间</div><div class="timeline-sleep-value">' + escapeHtml(sleepDisplay) + "</div></div>" +
    "</div>"
  );
}

function renderTimelineFoodItems(foods, itemClass = "") {
  if (!foods.length) return '<div class="timeline-food-empty">-</div>';
  return foods.map((food) => {
    const thumb = renderFoodThumbHtml(food, "thumb food-pref-thumb", "食物图", "thumb food-pref-thumb");
    const rowClass = itemClass ? ("timeline-food-item " + itemClass) : "timeline-food-item";
    return (
      '<div class="' + rowClass + '">' +
      thumb +
      '<div class="timeline-food-names">' +
      '<div class="timeline-food-zh">' + escapeHtml(food.chinese) + "</div>" +
      '<div class="timeline-food-en">' + escapeHtml(food.english) + "</div>" +
      "</div></div>"
    );
  }).join("");
}

function renderTimelineFoodPanel(profile) {
  if (!profile) return '<div class="timeline-food-empty">-</div>';
  const likedFoods = resolveFoodPreferenceDetailList(profile.favoriteFoodIds, profile.favoriteFoods);
  const dislikedFoods = resolveFoodPreferenceDetailList(profile.dislikedFoodIds, profile.dislikedFoods);
  const sleepDisplay = getProfileSleepDisplayText(profile);
  return (
    '<div class="timeline-food-modal-body">' +
    '<div class="timeline-food-modal-group"><div class="timeline-food-title">喜欢食物</div>' + renderTimelineFoodItems(likedFoods, "timeline-food-item-modal") + "</div>" +
    '<div class="timeline-food-modal-group"><div class="timeline-food-title">讨厌食物</div>' + renderTimelineFoodItems(dislikedFoods, "timeline-food-item-modal") + "</div>" +
    '<div class="timeline-sleep-row timeline-sleep-row-modal"><div class="timeline-food-title">睡眠时间</div><div class="timeline-sleep-value">' + escapeHtml(sleepDisplay) + "</div></div>" +
    "</div>"
  );
}

function ensureCharacterAvailable() {
  const d = state.currentDraft;
  const stage = currentStage();
  applyAutoStageCharacter(d, stage);
  const choices = getCharacterChoicesForCurrentStage();
  const selected = d.stageCharacters[stage];
  const exists = choices.some((c) => c.id === selected);
  if (!exists && (stage === "child" || stage === "teen" || stage === "adult")) {
    d.stageCharacters[stage] = "";
  }
}

function getSpouseDisplayName(spouseCharacterId) {
  if (!spouseCharacterId || spouseCharacterId === "none") return "无";
  const profile = getProfileById(spouseCharacterId);
  return profile ? getCharacterDisplayName(profile) : "未匹配";
}

function renderChoiceCard(profile, selected) {
  const selectedClass = selected ? " active" : "";
  const imageHtml = profile && profile.image
    ? '<img class="thumb" src="' + escapeAttr(profile.image) + '" alt="图" />'
    : '<div class="thumb empty">角色</div>';
  const name = profile ? getCharacterDisplayName(profile) : "-";
  return '<div class="choice-card' + selectedClass + '">' + imageHtml + '<div class="choice-card-name">' + escapeHtml(name) + "</div></div>";
}

function renderEditorChoiceCard(profile, action, fallbackName) {
  const imageHtml = profile && profile.image
    ? '<img class="thumb" src="' + escapeAttr(profile.image) + '" alt="图" />'
    : '<div class="thumb empty">角色</div>';
  const name = profile ? getCharacterDisplayName(profile) : (fallbackName || "-");
  const actionAttr = action ? ' data-action="' + escapeAttr(action) + '"' : "";
  const editBtn = action
    ? '<button class="choice-card-edit-btn" type="button" data-action="' + escapeAttr(action) + '">修改</button>'
    : "";
  return '<div class="choice-card choice-card-editable"' + actionAttr + '>' + editBtn + imageHtml + '<div class="choice-card-name">' + escapeHtml(name) + "</div></div>";
}

function renderCurrentPickPreview() {
  const box = document.getElementById("currentPickPreview");
  const stage = currentStage();
  const draft = state.currentDraft;
  const selectedId = state.currentDraft.stageCharacters[stage];
  const selected = getProfileById(selectedId);
  if (stage !== "adult" && !selected) {
    box.innerHTML = renderEditorChoiceCard(null, "edit-stage", "请选择");
    return;
  }
  const stageAction = (stage === "baby" || stage === "child" || stage === "teen" || stage === "adult") ? "edit-stage" : "";
  if (stage === "adult") {
    const currentCard = renderEditorChoiceCard(selected, "edit-stage", "请选择");
    const spouse = getProfileById(draft.spouseCharacterId);
    const spouseCard = spouse
      ? renderEditorChoiceCard(spouse, "edit-spouse")
      : renderEditorChoiceCard(null, "edit-spouse", "无");
    box.innerHTML =
      '<div class="current-pick-grid">' +
      '<div class="current-pick-cell"><div class="current-pick-tag">当前阶段拓麻</div>' + currentCard + "</div>" +
      '<div class="current-pick-cell">' +
      '<div class="current-pick-tag">配偶</div>' +
      spouseCard +
      "</div>" +
      "</div>";
    return;
  }
  box.innerHTML = renderEditorChoiceCard(selected, stageAction);
}

function renderSpousePreview() {
  const text = "当前：" + getSpouseDisplayName(state.currentDraft.spouseCharacterId || "none");
  document.getElementById("spousePickedLabel").textContent = text;
}

function closeSelectorModal() {
  document.getElementById("selectorModalMask").classList.remove("open");
  state.selectorModal.mode = "";
  state.selectorModal.stage = "";
}

function openSelectorModal(mode) {
  const stage = currentStage();
  state.selectorModal.mode = mode;
  state.selectorModal.stage = stage;

  const titleEl = document.getElementById("selectorModalTitle");
  const descEl = document.getElementById("selectorModalDesc");
  const listEl = document.getElementById("selectorModalList");
  listEl.innerHTML = "";

  if (mode === "stage") {
    titleEl.textContent = "选择当前阶段角色";
    if (stage === "baby") {
      descEl.textContent = "请选择幼儿期角色；选择后会自动匹配性别。";
    } else if (stage === "elder") {
      descEl.textContent = "老年期角色按性别自动匹配。";
    } else {
      descEl.textContent = "请选择当前阶段角色（图片 + 中文）。";
    }

    const selectedId = state.currentDraft.stageCharacters[stage];
    const choices = getCharacterChoicesForCurrentStage();
    if (!choices.length) {
      listEl.innerHTML = '<div class="empty">当前阶段无可选角色。</div>';
    } else {
      choices.forEach((profile) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "choice-card" + (profile.id === selectedId ? " active" : "");
        card.innerHTML = (profile.image
          ? '<img class="thumb" src="' + escapeAttr(profile.image) + '" alt="图" />'
          : '<div class="thumb empty">角色</div>') +
          '<div class="choice-card-name">' + escapeHtml(getCharacterDisplayName(profile)) + "</div>";
        card.disabled = stage === "elder";
        card.addEventListener("click", () => {
          if (stage === "baby") {
            const inferredGender = inferGenderFromFixedStageProfile("baby", profile);
            if (inferredGender) {
              state.currentDraft.gender = inferredGender;
            }
            applyAutoStageCharacter(state.currentDraft, "baby");
            if (state.currentDraft.stageCharacters.elder || state.currentDraft.stageIndex >= STAGES.indexOf("elder")) {
              applyAutoStageCharacter(state.currentDraft, "elder");
            }
          } else {
            state.currentDraft.stageCharacters[stage] = profile.id;
          }
          state.currentDraft.stageCharacters[stage] = profile.id;
          saveState();
          renderCurrentEntry();
          closeSelectorModal();
        });
        listEl.appendChild(card);
      });
    }
  } else if (mode === "spouse") {
    titleEl.textContent = "选择配偶";
    descEl.textContent = "请选择成年期配偶（可选“无”）。";
    const selectedId = state.currentDraft.spouseCharacterId || "none";

    const noneCard = document.createElement("button");
    noneCard.type = "button";
    noneCard.className = "choice-card" + (selectedId === "none" ? " active" : "");
    noneCard.innerHTML = '<div class="thumb empty">无</div><div class="choice-card-name">无</div>';
    noneCard.addEventListener("click", () => {
      state.currentDraft.spouseCharacterId = "none";
      saveState();
      renderCurrentEntry();
      closeSelectorModal();
    });
    listEl.appendChild(noneCard);

    getAdultSpouseChoices().forEach((profile) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "choice-card" + (selectedId === profile.id ? " active" : "");
      card.innerHTML = (profile.image
        ? '<img class="thumb" src="' + escapeAttr(profile.image) + '" alt="图" />'
        : '<div class="thumb empty">角色</div>') +
        '<div class="choice-card-name">' + escapeHtml(getCharacterDisplayName(profile)) + "</div>";
      card.addEventListener("click", () => {
        state.currentDraft.spouseCharacterId = profile.id;
        saveState();
        renderCurrentEntry();
        closeSelectorModal();
      });
      listEl.appendChild(card);
    });
  }

  document.getElementById("selectorModalMask").classList.add("open");
}

function persistDraftAsRecord(stageIndexDone) {
  const d = state.currentDraft;
  const doneIndex = typeof stageIndexDone === "number" ? stageIndexDone : d.stageIndex;
  d.spouseNote = getSpouseDisplayName(d.spouseCharacterId);
  const saved = {
    id: "gen_" + d.generationIndex,
    generationIndex: d.generationIndex,
    parity: d.parity,
    gender: d.gender,
    spouseCharacterId: d.spouseCharacterId,
    spouseNote: d.spouseNote,
    stageCharacters: { ...d.stageCharacters },
    stageIndexDone: doneIndex,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  const idx = state.records.findIndex((x) => x.generationIndex === d.generationIndex);
  if (idx > -1) {
    state.records[idx] = saved;
  } else {
    state.records.push(saved);
  }
  state.records.sort((a, b) => a.generationIndex - b.generationIndex);
}

function validateCurrentStage() {
  const d = state.currentDraft;
  const stage = currentStage();
  if (!d.gender) return "请先选择本代性别。";
  applyAutoStageCharacter(d, stage);
  if ((stage === "child" || stage === "teen" || stage === "adult") && !d.stageCharacters[stage]) {
    return "请先选择当前阶段角色。";
  }
  if (stage === "adult" && !d.spouseCharacterId) {
    return "请选择成年期配偶（可选“无”）。";
  }
  return "";
}

function shouldOpenStageSelectorByMissingRole(stage, draft) {
  if (stage !== "child" && stage !== "teen" && stage !== "adult") return false;
  const d = draft || state.currentDraft;
  return !(d && d.stageCharacters && d.stageCharacters[stage]);
}

function renderCurrentEntry() {
  const d = state.currentDraft;
  const stage = currentStage();
  ensureCharacterAvailable();
  const parityZh = d.parity === "odd" ? "奇数代" : "偶数代";
  document.getElementById("currentGenLabel").textContent = "第" + d.generationIndex + "代 · " + parityZh;
  document.getElementById("currentStageLabel").textContent = STAGE_LABEL[stage];
  document.getElementById("genderInput").value = d.gender;
  document.getElementById("genderWrap").style.display = stage === "baby" ? "block" : "none";
  document.getElementById("spouseWrap").style.display = "none";
  document.getElementById("currentPickTitle").style.display = stage === "adult" ? "none" : "block";
  renderSpousePreview();
  renderCurrentPickPreview();
}

function saveCurrentStage(manualStageForward) {
  const d = state.currentDraft;
  const stage = currentStage();
  const validationError = validateCurrentStage();
  if (validationError) {
    if (manualStageForward && shouldOpenStageSelectorByMissingRole(stage, d)) {
      openSelectorModal("stage");
    }
    showStatus("recordStatus", validationError, true);
    return;
  }

  if (manualStageForward) {
    if (stage === "adult" && d.spouseCharacterId && d.spouseCharacterId !== "none") {
      // 如果曾进入过老年期后回退修改为“有配偶”，需清理老年记录，避免时间线误判为已到达老年期。
      d.stageCharacters.elder = "";
      persistDraftAsRecord(STAGES.indexOf("adult"));
      state.currentDraft = createDraft(nextGenerationIndex());
      saveState();
      renderAll();
      showStatus("recordStatus", "已记录配偶并进入下一代幼儿期。", false);
      return;
    }
    if (stage === "elder") {
      persistDraftAsRecord(STAGES.indexOf("elder"));
      state.currentDraft = createDraft(nextGenerationIndex());
      saveState();
      renderAll();
      showStatus("recordStatus", "已完成本代并进入下一代幼儿期。", false);
      return;
    }
    d.stageIndex += 1;
    applyAutoStageCharacter(d, currentStage());
  }

  persistDraftAsRecord(d.stageIndex);
  saveState();
  renderAll();
  if (manualStageForward) {
    const nextStage = currentStage();
    if (shouldOpenStageSelectorByMissingRole(nextStage, state.currentDraft)) {
      openSelectorModal("stage");
      showStatus("recordStatus", "请选择当前阶段角色。", false);
      return;
    }
  }
  showStatus("recordStatus", manualStageForward ? "已保存并进入下一阶段。" : "已保存当前阶段。", false);
}

function moveToPreviousStage() {
  const d = state.currentDraft;
  if (d.stageIndex <= 0) {
    showStatus("recordStatus", "当前已经是幼儿期。", true);
    return;
  }
  d.stageIndex -= 1;
  saveState();
  renderAll();
  const prevStage = currentStage();
  if (shouldOpenStageSelectorByMissingRole(prevStage, state.currentDraft)) {
    openSelectorModal("stage");
    showStatus("recordStatus", "请选择当前阶段角色。", false);
    return;
  }
  showStatus("recordStatus", "已回到上一阶段。", false);
}

function createDraftFromRecord(record, targetStage) {
  const stage = targetStage || "baby";
  const stageIndex = STAGES.includes(stage) ? STAGES.indexOf(stage) : 0;
  state.currentDraft = {
    generationIndex: Number(record.generationIndex) || 1,
    parity: record.parity || ((Number(record.generationIndex) || 1) % 2 === 1 ? "odd" : "even"),
    stageIndex: stageIndex,
    gender: normalizeGenderValue(record.gender),
    spouseCharacterId: record.spouseCharacterId || "none",
    spouseNote: record.spouseNote || "",
    stageCharacters: {
      baby: "",
      child: "",
      teen: "",
      adult: "",
      elder: "",
      ...(record.stageCharacters || {})
    }
  };
  normalizeDraft();
}

function recalcStageIndexDone(stageCharacters) {
  let maxIndex = -1;
  STAGES.forEach((stage, idx) => {
    if (stageCharacters && stageCharacters[stage]) {
      maxIndex = idx;
    }
  });
  return maxIndex === -1 ? 0 : maxIndex;
}

function deleteCurrentStageRecord() {
  const draft = state.currentDraft;
  const stage = currentStage();
  const stageLabel = STAGE_LABEL[stage];

  if (stage === "baby" || stage === "elder") {
    showStatus("recordStatus", stageLabel + "为自动阶段，不能直接删除。", true);
    return;
  }

  const hasStageValue = !!draft.stageCharacters[stage];
  const hasAdultSpouse = stage === "adult" && draft.spouseCharacterId && draft.spouseCharacterId !== "none";
  if (!hasStageValue && !hasAdultSpouse) {
    showStatus("recordStatus", "当前阶段暂无可删除记录。", true);
    return;
  }

  const ok = window.confirm("确定删除当前阶段（" + stageLabel + "）记录吗？");
  if (!ok) return;

  draft.stageCharacters[stage] = "";
  if (stage === "adult") {
    draft.spouseCharacterId = "none";
    draft.spouseNote = "";
    draft.stageCharacters.elder = "";
  }

  const genIndex = Number(draft.generationIndex) || 1;
  const recordIndex = state.records.findIndex((record) => Number(record.generationIndex) === genIndex);
  if (recordIndex > -1) {
    const targetRecord = state.records[recordIndex];
    const nextStageCharacters = {
      baby: "",
      child: "",
      teen: "",
      adult: "",
      elder: "",
      ...(targetRecord.stageCharacters || {})
    };
    nextStageCharacters[stage] = "";
    if (stage === "adult") {
      nextStageCharacters.elder = "";
      targetRecord.spouseCharacterId = "none";
      targetRecord.spouseNote = "无";
    }
    targetRecord.stageCharacters = nextStageCharacters;
    targetRecord.stageIndexDone = recalcStageIndexDone(nextStageCharacters);
    targetRecord.updatedAt = Date.now();
  }

  saveState();
  renderAll();
  showStatus("recordStatus", "已删除当前阶段（" + stageLabel + "）记录。", false);
}

function deleteGenerationRecord(generationIndex) {
  const genIndex = Number(generationIndex) || 0;
  if (!genIndex) return;
  const ok = window.confirm("确定删除第 " + genIndex + " 代的全部记录吗？");
  if (!ok) return;

  state.records = state.records.filter((record) => Number(record.generationIndex) !== genIndex);
  if (Number(state.currentDraft.generationIndex) === genIndex) {
    state.currentDraft = createDraft(genIndex);
  }
  saveState();
  renderAll();
  showStatus("recordStatus", "已删除第 " + genIndex + " 代全部记录。", false);
}

function getSortedTimelineRecords() {
  const deduped = new Map();
  state.records.forEach((record) => {
    const key = Number(record.generationIndex) || 0;
    const exist = deduped.get(key);
    if (!exist || (Number(record.updatedAt) || 0) >= (Number(exist.updatedAt) || 0)) {
      deduped.set(key, record);
    }
  });
  return Array.from(deduped.values()).sort((a, b) => a.generationIndex - b.generationIndex);
}

function renderTimeline() {
  const box = document.getElementById("timeline");
  box.innerHTML = "";

  const records = getSortedTimelineRecords();
  if (!records.length) {
    box.innerHTML = '<div class="empty">暂无记录</div>';
    return;
  }

  records.forEach((gen) => {
    const card = document.createElement("article");
    card.className = "gen-card";
    card.innerHTML =
      '<div class="gen-head">' +
      '<div class="chips"><strong>第 ' + gen.generationIndex + ' 代</strong><span class="chip">性别: ' + escapeHtml(formatGenderLabel(gen.gender)) + '</span></div>' +
      '<div class="chips">' +
      '<button class="text-danger-btn" type="button" data-action="delete-generation" data-generation="' + escapeAttr(String(gen.generationIndex)) + '">删除本代</button>' +
      '</div></div>';

    const hasAdultPair = !!(gen.spouseCharacterId && gen.spouseCharacterId !== "none");
    const elderReached = !hasAdultPair && ((gen.stageIndexDone || 0) >= STAGES.indexOf("elder") || !!(gen.stageCharacters && gen.stageCharacters.elder));
    const timelineStages = elderReached ? STAGES.slice() : TIMELINE_BASE_STAGES;
    const line = document.createElement("div");
    line.className = "stage-line" + (elderReached ? " has-elder" : "") + (hasAdultPair ? " has-adult-pair" : "");
    timelineStages.forEach((stage) => {
      const cell = document.createElement("div");
      cell.className = "stage-cell clickable";
      const stageName = STAGE_LABEL[stage];
      const charId = gen.stageCharacters[stage] || "";
      const profile = getProfileById(charId);
      const charName = profile ? getCharacterDisplayName(profile) : (charId || "未记录");
      const charRank = profile && profile.rank ? profile.rank : "-";
      const rankLabel = formatRankLabel(charRank);
      const nameWithRank = rankLabel !== "-" ? (charName + " · " + rankLabel) : charName;
      const nameClass = charName === "未记录" ? "stage-main-name muted" : "stage-main-name";
      const charImage = profile && profile.image
        ? '<img class="stage-main-img" src="' + escapeAttr(profile.image) + '" alt="角色图" />'
        : '<div class="thumb empty stage-main-img">角色</div>';
      const foodHover = renderTimelineFoodHover(profile);
      const foodButton = profile
        ? '<button class="timeline-food-btn" type="button" data-action="show-food-pref" data-char-id="' + escapeAttr(profile.id || "") + '">ℹ️ 食物喜好</button>'
        : "";
      const hasAdultSpouse = stage === "adult" && gen.spouseCharacterId && gen.spouseCharacterId !== "none";
      if (hasAdultSpouse) {
        const spouseProfile = getProfileById(gen.spouseCharacterId);
        const spouseName = spouseProfile ? getCharacterDisplayName(spouseProfile) : "未记录";
        const spouseRank = spouseProfile && spouseProfile.rank ? spouseProfile.rank : "-";
        const spouseRankLabel = formatRankLabel(spouseRank);
        const spouseNameWithRank = spouseRankLabel !== "-" ? (spouseName + " · " + spouseRankLabel) : spouseName;
        const spouseNameClass = spouseName === "未记录" ? "stage-main-name muted" : "stage-main-name";
        const spouseImage = spouseProfile && spouseProfile.image
          ? '<img class="stage-main-img" src="' + escapeAttr(spouseProfile.image) + '" alt="配偶图" />'
          : '<div class="thumb empty stage-main-img">角色</div>';
        cell.className = "stage-cell clickable stage-cell-adult-pair";
        cell.innerHTML =
          '<div class="stage-adult-pair">' +
          '<div class="stage-adult-col">' +
          '<div class="stage-adult-label">成年期</div>' +
          charImage +
          '<div class="' + nameClass + '">' + escapeHtml(nameWithRank) + "</div>" +
          "</div>" +
          '<div class="stage-adult-col">' +
          '<div class="stage-adult-label">配偶</div>' +
          spouseImage +
          '<div class="' + spouseNameClass + '">' + escapeHtml(spouseNameWithRank) + "</div>" +
          "</div>" +
          "</div>" +
          foodHover +
          foodButton;
      } else {
        cell.innerHTML =
          '<strong>' + stageName + '</strong>' +
          charImage +
          '<div class="' + nameClass + '">' + escapeHtml(nameWithRank) + '</div>' +
          foodHover +
          foodButton;
      }
      const foodBtn = cell.querySelector("[data-action='show-food-pref']");
      if (foodBtn) {
        foodBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          const charId = foodBtn.getAttribute("data-char-id") || "";
          const targetProfile = getProfileById(charId) || profile;
          openTimelineFoodModal(targetProfile);
        });
      }
      cell.addEventListener("click", () => {
        createDraftFromRecord(gen, stage);
        saveState();
        renderAll();
        showStatus("recordStatus", "已跳转到第 " + gen.generationIndex + " 代 · " + STAGE_LABEL[stage] + "。", false);
      });
      line.appendChild(cell);
    });

    card.appendChild(line);
    box.appendChild(card);
  });
}

async function downloadTimelineTable() {
  const records = getSortedTimelineRecords();
  if (!records.length) {
    showStatus("recordStatus", "暂无可导出的世代时间线记录。", true);
    return;
  }
  if (!window.ExcelJS || !window.ExcelJS.Workbook) {
    showStatus("recordStatus", "ExcelJS 未加载完成，请稍后重试。", true);
    return;
  }

  showStatus("recordStatus", "正在生成 Excel（含图片）...", false);

  const toAbsoluteUrl = (src) => {
    const raw = String(src || "").trim();
    if (!raw) return "";
    try {
      return new URL(raw, window.location.href).href;
    } catch (error) {
      return raw;
    }
  };
  const normalizeImageExt = (value) => {
    const ext = String(value || "").toLowerCase();
    if (ext === "jpg") return "jpeg";
    if (ext === "png" || ext === "jpeg" || ext === "gif") return ext;
    return "";
  };
  const parseDataUrl = (dataUrl) => {
    const raw = String(dataUrl || "").trim();
    const m = raw.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/i);
    if (!m) return null;
    const ext = normalizeImageExt(m[1]);
    if (!ext) return null;
    return { extension: ext, base64: m[2] };
  };
  const blobToDataUrl = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => resolve("");
      reader.readAsDataURL(blob);
    });
  };
  const imageUrlToPngDataUrl = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = "sync";
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const width = Math.max(1, Number(img.naturalWidth) || 1);
          const height = Math.max(1, Number(img.naturalHeight) || 1);
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve("");
            return;
          }
          ctx.fillStyle = "#f3f4f6";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/png"));
        } catch (error) {
          resolve("");
        }
      };
      img.onerror = () => resolve("");
      img.src = imageUrl;
    });
  };
  const fetchImageData = async (imageUrl) => {
    try {
      const res = await fetch(imageUrl, { cache: "no-store" });
      if (!res.ok) return null;
      const blob = await res.blob();
      const dataUrl = await blobToDataUrl(blob);
      const parsed = parseDataUrl(dataUrl);
      if (parsed) return parsed;
      const pngDataUrl = await imageUrlToPngDataUrl(imageUrl);
      return parseDataUrl(pngDataUrl);
    } catch (error) {
      const pngDataUrl = await imageUrlToPngDataUrl(imageUrl);
      return parseDataUrl(pngDataUrl);
    }
  };
  const getStageData = (gen, stage, options) => {
    const cfg = options || {};
    const hasSpouse = !!(gen.spouseCharacterId && gen.spouseCharacterId !== "none");
    const elderReached = !hasSpouse && ((gen.stageIndexDone || 0) >= STAGES.indexOf("elder") || !!(gen.stageCharacters && gen.stageCharacters.elder));
    const visibleStages = elderReached ? STAGES.slice() : TIMELINE_BASE_STAGES;
    if (!cfg.ignoreTimelineVisibility && !visibleStages.includes(stage)) {
      return { name: "-", rank: "-", imageUrl: "" };
    }
    if (cfg.isSpouse) {
      if (!hasSpouse) return { name: "-", rank: "-", imageUrl: "" };
      const spouse = getProfileById(gen.spouseCharacterId);
      return {
        name: spouse ? getCharacterDisplayName(spouse) : "未记录",
        rank: spouse && spouse.rank ? formatRankLabel(spouse.rank) : "-",
        imageUrl: spouse && spouse.image ? toAbsoluteUrl(spouse.image) : ""
      };
    }
    const charId = gen.stageCharacters[stage] || "";
    const profile = getProfileById(charId);
    return {
      name: profile ? getCharacterDisplayName(profile) : (charId || "未记录"),
      rank: profile && profile.rank ? formatRankLabel(profile.rank) : "-",
      imageUrl: profile && profile.image ? toAbsoluteUrl(profile.image) : ""
    };
  };

  const workbook = new window.ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("世代时间线");
  sheet.columns = [
    { header: "世代", width: 16 },
    { header: "幼儿期", width: 20 },
    { header: "儿童期", width: 20 },
    { header: "青春期", width: 20 },
    { header: "成年期", width: 20 },
    { header: "配偶", width: 20 },
    { header: "老年期", width: 20 }
  ];

  const stageColumns = [
    { col: 2, stage: "baby", options: {} },
    { col: 3, stage: "child", options: {} },
    { col: 4, stage: "teen", options: {} },
    { col: 5, stage: "adult", options: {} },
    { col: 6, stage: "adult", options: { isSpouse: true, ignoreTimelineVisibility: true } },
    { col: 7, stage: "elder", options: {} }
  ];

  const headerRow = sheet.getRow(1);
  headerRow.height = 24;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };
    cell.border = {
      top: { style: "thin", color: { argb: "FFD1D5DB" } },
      left: { style: "thin", color: { argb: "FFD1D5DB" } },
      bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
      right: { style: "thin", color: { argb: "FFD1D5DB" } }
    };
  });

  const imageIdCache = new Map();
  let failCount = 0;
  const getImageId = async (imageUrl) => {
    if (!imageUrl) return -1;
    if (imageIdCache.has(imageUrl)) return imageIdCache.get(imageUrl);
    const parsed = await fetchImageData(imageUrl);
    if (!parsed) {
      imageIdCache.set(imageUrl, -1);
      return -1;
    }
    try {
      const imageId = workbook.addImage({
        base64: "data:image/" + parsed.extension + ";base64," + parsed.base64,
        extension: parsed.extension
      });
      imageIdCache.set(imageUrl, imageId);
      return imageId;
    } catch (error) {
      imageIdCache.set(imageUrl, -1);
      return -1;
    }
  };

  for (let i = 0; i < records.length; i += 1) {
    const gen = records[i];
    const rowIndex = i + 2;

    const genCell = sheet.getCell(rowIndex, 1);
    genCell.value = "第 " + gen.generationIndex + " 代\n性别：" + formatGenderLabel(gen.gender);
    genCell.font = { bold: true };
    genCell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

    stageColumns.forEach((entry) => {
      const data = getStageData(gen, entry.stage, entry.options);
      const cell = sheet.getCell(rowIndex, entry.col);
      cell.value = (data.name || "-") + "\n等级：" + (data.rank || "-");
      cell.alignment = { vertical: "bottom", horizontal: "center", wrapText: true };
    });

    const row = sheet.getRow(rowIndex);
    row.height = 84;
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFD1D5DB" } },
        left: { style: "thin", color: { argb: "FFD1D5DB" } },
        bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
        right: { style: "thin", color: { argb: "FFD1D5DB" } }
      };
    });

    for (let j = 0; j < stageColumns.length; j += 1) {
      const entry = stageColumns[j];
      const data = getStageData(gen, entry.stage, entry.options);
      const imageId = await getImageId(data.imageUrl);
      if (imageId < 0) {
        if (data.imageUrl) failCount += 1;
        continue;
      }
      sheet.addImage(imageId, {
        tl: { col: entry.col - 1 + 0.2, row: rowIndex - 1 + 0.08 },
        ext: { width: 44, height: 44 },
        editAs: "oneCell"
      });
    }
  }

  const fileName = "世代时间线_" + new Date().toISOString().slice(0, 10) + ".xlsx";
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(link.href), 2000);

  const warnText = failCount > 0 ? ("，有 " + failCount + " 张图片未嵌入") : "";
  showStatus("recordStatus", "已下载 Excel 表格（含图片）" + warnText + "。", failCount > 0);
}

function renderCharacterLibrary() {
  const keyword = normalizeText(document.getElementById("charKeywordFilter").value);
  const stage = document.getElementById("charStageFilter").value;
  const rank = document.getElementById("charRankFilter").value;
  const parity = document.getElementById("charParityFilter").value;
  const list = document.getElementById("characterList");
  list.innerHTML = "";

  const filtered = state.characters.filter((c) => {
    const chineseName = getCharacterChineseName(c);
    const keywordOk = !keyword ||
      normalizeText(c.name).includes(keyword) ||
      normalizeText(chineseName).includes(keyword) ||
      normalizeText(c.id).includes(keyword);
    const stageOk = stage === "all" || c.stage === stage;
    const rankOk = rank === "all" || c.rank === rank;
    const parityOk = !parity || parity === "all" || c.parity === parity;
    return keywordOk && stageOk && rankOk && parityOk;
  }).slice().sort((a, b) => {
    const rankDiff = rankOrderValue(a.rank) - rankOrderValue(b.rank);
    if (rankDiff !== 0) return rankDiff;
    const stageDiff = stageOrderValue(a.stage) - stageOrderValue(b.stage);
    if (stageDiff !== 0) return stageDiff;
    return String(a.id).localeCompare(String(b.id));
  });

  if (!filtered.length) {
    list.innerHTML = '<div class="empty">没有匹配资料。</div>';
    return;
  }

  filtered.forEach((char) => {
    const chineseName = getCharacterChineseName(char) || char.name;
    const rankMeta = getRankPillMeta(char.rank);
    const likedFoods = resolveFoodPreferenceList(char.favoriteFoodIds, char.favoriteFoods);
    const dislikedFoods = resolveFoodPreferenceList(char.dislikedFoodIds, char.dislikedFoods);
    const sleepDisplay = getProfileSleepDisplayText(char);
    const toFoodRows = (title, foods) => {
      const content = foods.length
        ? foods.map((food) => {
          const thumb = renderFoodThumbHtml(food, "thumb food-pref-thumb", "食物图", "thumb food-pref-thumb");
          return '<div class="food-pref-row">' + thumb + '<span class="food-pref-name">' + escapeHtml(food.text) + "</span></div>";
        }).join("")
        : '<div class="food-pref-row"><span class="food-pref-name">-</span></div>';
      return '<div class="food-pref-row"><span class="food-pref-title">' + title + '：</span><div class="food-pref-list">' + content + "</div></div>";
    };
    const sleepRow = '<div class="food-pref-row food-pref-sleep-row"><span class="food-pref-title">睡眠时间：</span><span class="food-pref-name">' + escapeHtml(sleepDisplay) + "</span></div>";
    const card = document.createElement("article");
    card.className = "item-card";
    card.innerHTML =
      '<div class="item-head">' +
      (char.image
        ? '<img class="thumb" src="' + escapeAttr(char.image) + '" alt="图" />'
        : '<div class="thumb empty">角色</div>') +
      '<div class="name-block"><strong>' + escapeHtml(chineseName) + '</strong><div class="hint name-en-hint">' + escapeHtml(char.name) + '</div></div>' +
      '<span class="rank-pill ' + rankMeta.cls + '">' + escapeHtml(rankMeta.label) + "</span>" +
      '</div>' +
      '<div class="char-meta">阶段: ' + STAGE_LABEL[char.stage] + ' ｜ 奇偶: ' + formatAnyLabel(char.parity) + "</div>" +
      toFoodRows("喜欢", likedFoods) +
      toFoodRows("不喜欢", dislikedFoods) +
      sleepRow;
    card.addEventListener("click", () => openProfileModal(char));
    list.appendChild(card);
  });
}

function renderItemLibrary() {
  refreshItemSourceTags();
  const keyword = normalizeText(document.getElementById("itemKeywordFilter").value);
  const usage = document.getElementById("itemUsageFilter").value;
  const stage = document.getElementById("itemStageFilter").value;
  const sourceKeys = sourceFilterState.item;
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  const filtered = state.items.filter((item) => {
    const textPool = [
      item.name,
      item.nameZh
    ].map((value) => normalizeText(value)).join(" ");
    const byKeyword = !keyword || textPool.includes(keyword);
    const byUsage = usage === "all" || item.usageMode === usage;
    const byStage = stage === "all" || (item.usableStages || []).includes(stage);
    const canonicalSources = extractCanonicalSources(item.sources || [], "item");
    const bySource = !sourceKeys.size || canonicalSources.some((entry) => sourceKeys.has(normalizeSourceKey(entry)));
    return byKeyword && byUsage && byStage && bySource;
  });

  if (!filtered.length) {
    list.innerHTML = '<div class="empty">没有匹配道具。</div>';
    return;
  }

  filtered.forEach((item) => {
    const stageText = (item.usableStages || []).map((s) => STAGE_LABEL[s] || s).join(" / ") || "-";
    const sourceText = extractCanonicalSources(item.sources || [], "item").join(" / ") || "未分类";
    const codeText = (item.codes || []).map((code) => String(code || "").trim()).filter(Boolean).join("_");
    const sourceLine = "来源：" + sourceText + (codeText ? " ｜ 代码：" + codeText : "");
    const noteText = String(item.note || "").trim();
    const noteHtml = noteText ? ('<div class="hint item-note">' + escapeHtml(noteText) + '</div>') : "";
    const usageMeta = getUsagePillMeta(item.usageMode);
    const usagePillHtml = usageMeta
      ? ('<span class="usage-pill ' + usageMeta.cls + '">' + escapeHtml(usageMeta.label) + "</span>")
      : "";
    const card = document.createElement("article");
    card.className = "item-card";
    card.innerHTML =
      '<div class="item-head">' +
      renderItemThumbHtml(item, "thumb food-library-thumb", "道具图") +
      '<div class="name-block"><strong>' + escapeHtml(item.nameZh || item.name || "-") + (item.isRecommended ? " ⭐" : "") + '</strong><div class="hint name-en-hint">' + escapeHtml(item.name || "-") + '</div></div>' +
      usagePillHtml +
      '</div>' +
      '<div class="food-price">价格：' + (item.price ?? "-") + '</div>' +
      '<div class="hint">可用阶段：' + escapeHtml(stageText) + '</div>' +
      '<div class="hint">' + escapeHtml(sourceLine) + '</div>' +
      noteHtml;
    card.addEventListener("click", () => openItemModal(item));
    list.appendChild(card);
  });
}

function normalizeText(text) {
  return String(text || "").trim().toLowerCase();
}

function getRankPillMeta(rank) {
  const raw = normalizeText(rank);
  if (raw === "s") return { cls: "pill-tone-s", label: "S" };
  if (raw === "a") return { cls: "pill-tone-a", label: "A" };
  if (raw === "b") return { cls: "pill-tone-b", label: "B" };
  if (raw === "c") return { cls: "pill-tone-c", label: "C" };
  if (raw === "d") return { cls: "pill-tone-d", label: "D" };
  return { cls: "pill-tone-n", label: "N" };
}

function getUsagePillMeta(mode) {
  const raw = normalizeText(mode);
  if (raw === "single_use") return { cls: "pill-tone-s", label: "一次性" };
  if (raw === "breakable") return { cls: "pill-tone-b", label: "几率毁坏" };
  if (raw === "permanent") return { cls: "pill-tone-c", label: "永久" };
  return null;
}

function getCategoryPillMeta(category) {
  const raw = normalizeText(category);
  if (raw === "snack") return { cls: "pill-tone-s", label: "Snack" };
  if (raw === "food") return { cls: "pill-tone-c", label: "Food" };
  return null;
}

function formatFoodCategoryLabel(category) {
  const raw = normalizeText(category);
  if (!raw) return "Uncategorized";
  if (raw === "food") return "Food";
  if (raw === "snack") return "Snack";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function formatItemUsageLabel(mode) {
  const raw = normalizeText(mode);
  if (raw === "single_use") return "一次性";
  if (raw === "permanent") return "永久";
  if (raw === "breakable") return "几率毁坏";
  if (raw === "special") return "特殊物品";
  return "未分类";
}

function normalizeItemNoteText(noteText) {
  const raw = String(noteText || "").trim();
  if (!raw) return { text: "", recommended: false };
  const hasNegative = raw.includes("不推荐");
  const recommended = !hasNegative && (raw.includes("推荐购买") || raw.includes("推荐"));
  let text = raw;
  if (recommended) {
    text = text.replace(/推荐购买/g, "").replace(/推荐/g, "");
  }
  text = text.replace(/\s+/g, " ").trim();
  text = text.replace(/^[，,、；;:：\-\s]+/, "").replace(/[，,、；;:：\-\s]+$/, "").trim();
  return { text, recommended };
}

function cleanFoodId(value, idx) {
  const raw = String(value || "").trim();
  if (raw) return raw;
  const serial = String(idx + 1).padStart(3, "0");
  return "food_" + serial;
}

function cleanNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function normalizeListValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry || "").trim()).filter(Boolean);
  }
  const raw = String(value || "").trim();
  if (!raw) return [];
  return raw
    .split(/[\|,/，、]+/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeSourceKey(value) {
  return normalizeText(value);
}

function parseFoodSources(value) {
  return normalizeListValue(value);
}

function extractCanonicalSources(rawSources, scope) {
  const list = Array.isArray(rawSources) ? rawSources : normalizeListValue(rawSources);
  const set = new Set();
  list.forEach((entry) => {
    const text = normalizeText(entry);
    if (!text) return;
    if (text.includes("商店")) set.add("商店");
    if (text.includes("老头")) set.add("老头");
    if (text.includes("神灯") || text.includes("宝箱") || text.includes("宝箱")) set.add("神灯/宝箱");
    if (text.includes("密码") || text.includes("代码")) set.add("代码");
  });
  const allowed = scope === "food" ? FOOD_SOURCE_FILTER_OPTIONS : ITEM_SOURCE_FILTER_OPTIONS;
  return allowed.filter((label) => set.has(label));
}

function renderSourceTagButtons(containerId, options, selectedSet, onToggle) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  const validKeys = new Set(options.map((option) => normalizeSourceKey(option)));
  Array.from(selectedSet).forEach((key) => {
    if (!validKeys.has(key)) selectedSet.delete(key);
  });
  wrap.innerHTML = "";
  if (!options.length) {
    wrap.innerHTML = '<span class="hint">暂无来源</span>';
    return;
  }
  options.forEach((label) => {
    const key = normalizeSourceKey(label);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mini-tab-btn" + (selectedSet.has(key) ? " active" : "");
    btn.textContent = label;
    btn.addEventListener("click", () => {
      if (selectedSet.has(key)) {
        selectedSet.delete(key);
      } else {
        selectedSet.add(key);
      }
      onToggle();
    });
    wrap.appendChild(btn);
  });
}

function normalizeUsageMode(value, fallbackConsumable) {
  const raw = normalizeText(value);
  if (raw === "single_use" || raw === "一次性") return "single_use";
  if (raw === "permanent" || raw === "永久") return "permanent";
  if (raw === "breakable" || raw === "几率毁坏") return "breakable";
  if (raw === "special" || raw === "特殊物品") return "special";
  if (typeof fallbackConsumable === "boolean") {
    return fallbackConsumable ? "single_use" : "permanent";
  }
  return "single_use";
}

function normalizeItemId(value, idx) {
  const raw = String(value || "").trim();
  if (raw) return raw;
  return "T" + String(idx + 1).padStart(3, "0");
}

function buildItemImagePath(itemId, ext = "png") {
  const id = String(itemId || "").trim();
  if (!id) return "";
  return ITEM_IMAGE_DIR + "/" + id + "." + ext;
}

function renderItemThumbHtml(item, className, altText) {
  const manualImage = String(item && item.image ? item.image : "").trim();
  const itemId = String(item && item.id ? item.id : "").trim();
  let webp = "";
  let png = "";
  if (manualImage) {
    if (manualImage.endsWith(".webp")) {
      webp = manualImage;
      png = manualImage.replace(/\.webp$/i, ".png");
    } else if (manualImage.endsWith(".png")) {
      webp = manualImage.replace(/\.png$/i, ".webp");
      png = manualImage;
    } else {
      return '<img class="' + escapeAttr(className) + '" src="' + escapeAttr(manualImage) + '" alt="' + escapeAttr(altText) + '" />';
    }
  } else if (itemId) {
    webp = buildItemImagePath(itemId, "webp");
    png = buildItemImagePath(itemId, "png");
  }
  if (webp && png) {
    return '<picture><source srcset="' + escapeAttr(webp) + '" type="image/webp" /><img class="' + escapeAttr(className) + '" src="' + escapeAttr(png) + '" alt="' + escapeAttr(altText) + '" /></picture>';
  }
  if (png) {
    return '<img class="' + escapeAttr(className) + '" src="' + escapeAttr(png) + '" alt="' + escapeAttr(altText) + '" />';
  }
  if (webp) {
    return '<img class="' + escapeAttr(className) + '" src="' + escapeAttr(webp) + '" alt="' + escapeAttr(altText) + '" />';
  }
  return '<span class="hint">-</span>';
}

function normalizeItemEntry(item, idx) {
  const normalizedId = normalizeItemId(item && item.id, idx);
  const usageMode = normalizeUsageMode(item && item.usageMode, item && item.consumable);
  const usableStagesRaw = item && item.usableStages ? item.usableStages : (item && item.usable_stage ? item.usable_stage : []);
  const usableStages = normalizeListValue(usableStagesRaw).map((stage) => normalizeText(stage)).filter((stage) => STAGES.includes(stage));
  const sourcesRaw = item && item.sources ? item.sources : (item && item.source ? item.source : []);
  const codesRaw = item && item.codes ? item.codes : (item && item.code ? item.code : []);
  const manualImage = String(item && item.image ? item.image : "").trim();
  const mergedNoteRaw = String(
    item && item.note ? item.note : (item && item.effect ? item.effect : "")
  ).trim();
  const noteResult = normalizeItemNoteText(mergedNoteRaw);
  return {
    id: normalizedId,
    name: String(item && item.name ? item.name : "").trim(),
    nameZh: String(item && item.nameZh ? item.nameZh : "").trim(),
    type: String(item && item.type ? item.type : "tool").trim() || "tool",
    usageMode,
    usableStages: usableStages.length ? usableStages : ["adult"],
    sources: normalizeListValue(sourcesRaw),
    codes: normalizeListValue(codesRaw),
    price: cleanNumber(item && item.price),
    note: noteResult.text,
    isRecommended: noteResult.recommended,
    image: manualImage || buildItemImagePath(normalizedId, "png"),
    breakChance: cleanNumber(item && item.breakChance),
    specialTag: String(item && item.specialTag ? item.specialTag : "").trim(),
    specialRule: String(item && item.specialRule ? item.specialRule : "").trim()
  };
}

function normalizeItemLibrary(list) {
  if (!Array.isArray(list)) return [];
  return list.map((item, idx) => normalizeItemEntry(item, idx));
}

function refreshItemSourceTags() {
  renderSourceTagButtons("itemSourceTags", ITEM_SOURCE_FILTER_OPTIONS, sourceFilterState.item, renderItemLibrary);
}

function buildFoodImagePath(foodId, ext = "png") {
  const id = String(foodId || "").trim();
  if (!id) return "";
  return FOOD_IMAGE_DIR + "/" + id + "." + ext;
}

function renderFoodThumbHtml(food, className, altText, emptyClassName) {
  const fallbackClass = emptyClassName || className;
  const manualImage = String(food && food.image ? food.image : "").trim();
  const foodId = String(food && food.id ? food.id : "").trim();
  let webp = "";
  let png = "";

  if (manualImage) {
    if (manualImage.endsWith(".webp")) {
      webp = manualImage;
      png = manualImage.replace(/\.webp$/i, ".png");
    } else if (manualImage.endsWith(".png")) {
      webp = manualImage.replace(/\.png$/i, ".webp");
      png = manualImage;
    } else {
      return '<img class="' + escapeAttr(className) + '" src="' + escapeAttr(manualImage) + '" alt="' + escapeAttr(altText) + '" />';
    }
  } else if (foodId) {
    webp = buildFoodImagePath(foodId, "webp");
    png = buildFoodImagePath(foodId, "png");
  }

  if (webp && png) {
    return '<picture><source srcset="' + escapeAttr(webp) + '" type="image/webp" /><img class="' + escapeAttr(className) + '" src="' + escapeAttr(png) + '" alt="' + escapeAttr(altText) + '" /></picture>';
  }
  if (png) {
    return '<img class="' + escapeAttr(className) + '" src="' + escapeAttr(png) + '" alt="' + escapeAttr(altText) + '" />';
  }
  if (webp) {
    return '<img class="' + escapeAttr(className) + '" src="' + escapeAttr(webp) + '" alt="' + escapeAttr(altText) + '" />';
  }
  return '<span class="hint">-</span>';
}

function normalizeFoodEntry(food, idx) {
  const sourceRaw = String(food && food.source ? food.source : "").trim();
  const categoryRaw = String(food && food.category ? food.category : "").trim().toLowerCase();
  const normalizedId = cleanFoodId(food && food.id, idx);
  const manualImage = String(food && food.image ? food.image : "").trim();
  return {
    id: normalizedId,
    category: categoryRaw || "uncategorized",
    english: String(food && food.english ? food.english : "").trim(),
    chinese: String(food && food.chinese ? food.chinese : "").trim(),
    image: manualImage || buildFoodImagePath(normalizedId, "png"),
    code: String(food && food.code ? food.code : "").trim(),
    price: cleanNumber(food && food.price),
    source: sourceRaw || "未分类",
    note: String(food && food.note ? food.note : "").trim()
  };
}

function normalizeFoodLibrary(list) {
  if (!Array.isArray(list)) return [];
  return list.map((food, idx) => normalizeFoodEntry(food, idx));
}

function getFoodPreferenceLinks(food) {
  const foodId = String(food.id || "").trim();
  const cn = normalizeText(food.chinese);
  const en = normalizeText(food.english);
  const liked = [];
  const disliked = [];

  state.characters.forEach((char) => {
    const favorIds = Array.isArray(char.favoriteFoodIds) ? char.favoriteFoodIds : [];
    const dislikeIds = Array.isArray(char.dislikedFoodIds) ? char.dislikedFoodIds : [];
    const favor = Array.isArray(char.favoriteFoods) ? char.favoriteFoods : [];
    const dislike = Array.isArray(char.dislikedFoods) ? char.dislikedFoods : [];

    const likeById = foodId && favorIds.some((id) => String(id).trim() === foodId);
    const dislikeById = foodId && dislikeIds.some((id) => String(id).trim() === foodId);
    const likeByName = favor.some((name) => {
      const t = normalizeText(name);
      return t === cn || t === en;
    });
    const dislikeByName = dislike.some((name) => {
      const t = normalizeText(name);
      return t === cn || t === en;
    });

    const charLabel = getCharacterChineseName(char) || char.name;
    if (likeById || likeByName) {
      liked.push({ id: char.id, name: char.name, chineseName: charLabel, image: char.image || "" });
    }
    if (dislikeById || dislikeByName) {
      disliked.push({ id: char.id, name: char.name, chineseName: charLabel, image: char.image || "" });
    }
  });

  return { liked, disliked };
}

function refreshFoodCategoryOptions() {
  const select = document.getElementById("foodCategoryFilter");
  if (!select) return;
  const current = select.value || "all";
  select.innerHTML = '<option value="all">全部</option>';
  const unique = Array.from(new Set(state.foods.map((food) => String(food.category || "").trim()).filter(Boolean)));
  unique.forEach((category) => {
    const opt = document.createElement("option");
    opt.value = category;
    opt.textContent = category;
    select.appendChild(opt);
  });
  select.value = unique.includes(current) || current === "all" ? current : "all";
}

function refreshFoodSourceTags() {
  renderSourceTagButtons("foodSourceTags", FOOD_SOURCE_FILTER_OPTIONS, sourceFilterState.food, renderFoodLibrary);
}

function renderFoodLibrary() {
  refreshFoodCategoryOptions();
  refreshFoodSourceTags();
  const keyword = normalizeText(document.getElementById("foodKeywordFilter").value);
  const category = document.getElementById("foodCategoryFilter").value;
  const sourceKeys = sourceFilterState.food;
  const list = document.getElementById("foodList");
  list.innerHTML = "";

  const filtered = state.foods.filter((food) => {
    const byKeyword = !keyword ||
      normalizeText(food.chinese).includes(keyword) ||
      normalizeText(food.english).includes(keyword) ||
      normalizeText(food.code).includes(keyword);
    const byCategory = category === "all" || normalizeText(food.category) === normalizeText(category);
    const canonicalSources = extractCanonicalSources(parseFoodSources(food.source), "food");
    const bySource = !sourceKeys.size || canonicalSources.some((entry) => sourceKeys.has(normalizeSourceKey(entry)));
    return byKeyword && byCategory && bySource;
  });

  if (!filtered.length) {
    list.innerHTML = '<div class="empty">没有匹配食物。</div>';
    return;
  }

  filtered.forEach((food) => {
    const relation = getFoodPreferenceLinks(food);
    const sourceText = extractCanonicalSources(parseFoodSources(food.source), "food").join(" / ") || "未分类";
    const codeText = String(food.code || "").trim();
    const sourceLine = "来源：" + sourceText + (codeText ? " ｜ 代码：" + codeText : "");
    const categoryMeta = getCategoryPillMeta(food.category);
    const categoryPillHtml = categoryMeta
      ? ('<span class="category-pill ' + categoryMeta.cls + '">' + escapeHtml(categoryMeta.label) + "</span>")
      : "";
    const renderRelationRows = (rows) => {
      if (!rows.length) {
        return '<div class="char-link-item"><span>-</span></div>';
      }
      return rows.map((entry) => {
        const thumb = entry.image
          ? '<img class="thumb" src="' + escapeAttr(entry.image) + '" alt="拓麻图" />'
          : "";
        return '<div class="char-link-item">' + thumb + "<span>" + escapeHtml(entry.chineseName) + " / " + escapeHtml(entry.name) + "</span></div>";
      }).join("");
    };
    const card = document.createElement("article");
    card.className = "item-card";
    card.innerHTML =
      '<div class="item-head">' +
      renderFoodThumbHtml(food, "thumb food-library-thumb", "图", "thumb food-library-thumb") +
      '<div class="food-name-inline"><strong>' + escapeHtml(food.chinese || "-") + '</strong><span class="hint">' + escapeHtml(food.english || "-") + "</span></div>" +
      categoryPillHtml +
      '</div>' +
      '<div class="food-price">价格：' + (food.price ?? "-") + "</div>" +
      '<div class="hint">' + escapeHtml(sourceLine) + '</div>' +
      '<div class="hint" style="margin-top:6px;">喜爱拓麻：</div>' +
      '<div class="char-link-list">' + renderRelationRows(relation.liked) + "</div>" +
      '<div class="hint" style="margin-top:6px;">讨厌拓麻：</div>' +
      '<div class="char-link-list">' + renderRelationRows(relation.disliked) + "</div>";
    card.addEventListener("click", () => openFoodModal(food, relation));
    list.appendChild(card);
  });
}

function renderRulesFaq() {
  const box = document.getElementById("rulesFaq");
  box.innerHTML = "";
  state.faq.forEach((entry) => {
    const details = document.createElement("details");
    details.innerHTML = '<summary>' + escapeHtml(entry.q) + '</summary><p class="hint faq-answer" style="margin:8px 0 0; line-height:1.7;">' + escapeHtml(entry.a) + '</p>';
    box.appendChild(details);
  });
}

function openProfileModal(profile) {
  const favoriteText = (Array.isArray(profile.favoriteFoodIds) && profile.favoriteFoodIds.length)
    ? profile.favoriteFoodIds.join("、")
    : ((Array.isArray(profile.favoriteFoods) && profile.favoriteFoods.length) ? profile.favoriteFoods.join("、") : "-");
  const dislikedText = (Array.isArray(profile.dislikedFoodIds) && profile.dislikedFoodIds.length)
    ? profile.dislikedFoodIds.join("、")
    : ((Array.isArray(profile.dislikedFoods) && profile.dislikedFoods.length) ? profile.dislikedFoods.join("、") : "-");
  document.getElementById("modalTitle").textContent = profile.name;
  document.getElementById("modalMeta").textContent = "阶段：" + STAGE_LABEL[profile.stage] + " ｜ 奇偶：" + formatAnyLabel(profile.parity) + " ｜ 等级：" + formatRankLabel(profile.rank);
  document.getElementById("modalFoods").textContent = "喜欢食物ID：" + favoriteText + " ｜ 讨厌食物ID：" + dislikedText;
  document.getElementById("modalExtra").textContent = profile.note || "";
  document.getElementById("detailModalMask").classList.add("open");
}

function openItemModal(item) {
  const stageText = (item.usableStages || []).map((s) => STAGE_LABEL[s] || s).join(" / ") || "-";
  const sourceText = extractCanonicalSources(item.sources || [], "item").join(" / ") || "未分类";
  const codeText = (item.codes || []).join("_") || "-";
  const extra = [
    item.note ? "备注：" + item.note : "",
    item.breakChance !== null && item.breakChance !== undefined ? "毁坏概率：" + item.breakChance : "",
    item.specialTag ? "特殊标签：" + item.specialTag : "",
    item.specialRule ? "特殊规则：" + item.specialRule : ""
  ].filter(Boolean).join(" ｜ ");
  document.getElementById("modalTitle").textContent = (item.nameZh || item.name || "-") + (item.isRecommended ? " ⭐" : "") + " / " + (item.name || "-");
  document.getElementById("modalMeta").textContent = "ID：" + (item.id || "-") + " ｜ 类型：" + (item.type || "-") + " ｜ 使用：" + formatItemUsageLabel(item.usageMode) + " ｜ 价格：" + (item.price ?? "-");
  document.getElementById("modalFoods").textContent = "可用阶段：" + stageText + " ｜ 来源：" + sourceText + " ｜ 代码：" + codeText;
  document.getElementById("modalExtra").textContent = extra || "-";
  document.getElementById("detailModalMask").classList.add("open");
}

function openFoodModal(food, relation) {
  document.getElementById("modalTitle").textContent = (food.chinese || "-") + " / " + (food.english || "-");
  document.getElementById("modalMeta").textContent =
    "分类：" + (food.category || "uncategorized") + " ｜ 代码：" + (food.code || "-") + " ｜ 价格：" + (food.price ?? "-") + " ｜ 来源：" + (extractCanonicalSources(parseFoodSources(food.source), "food").join(" / ") || "未分类");
  document.getElementById("modalFoods").textContent =
    "喜爱拓麻：" + (relation.liked.length ? relation.liked.map((entry) => entry.chineseName).join("、") : "-") +
    " ｜ 讨厌拓麻：" + (relation.disliked.length ? relation.disliked.map((entry) => entry.chineseName).join("、") : "-");
  document.getElementById("modalExtra").textContent = food.note || "-";
  document.getElementById("detailModalMask").classList.add("open");
}

function closeModal() {
  document.getElementById("detailModalMask").classList.remove("open");
}

function openTimelineFoodModal(profile) {
  const titleEl = document.getElementById("timelineFoodModalTitle");
  const bodyEl = document.getElementById("timelineFoodModalBody");
  const displayName = profile ? getCharacterDisplayName(profile) : "未记录";
  titleEl.textContent = displayName + " 的食物喜好";
  bodyEl.innerHTML = renderTimelineFoodPanel(profile);
  document.getElementById("timelineFoodModalMask").classList.add("open");
}

function closeTimelineFoodModal() {
  document.getElementById("timelineFoodModalMask").classList.remove("open");
}

function openContactModal() {
  document.getElementById("contactModalMask").classList.add("open");
}

function closeContactModal() {
  document.getElementById("contactModalMask").classList.remove("open");
}

function showStatus(id, text, isWarn) {
  const el = document.getElementById(id);
  el.className = "status " + (isWarn ? "warn" : "ok");
  el.textContent = text;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(text) {
  return escapeHtml(text);
}

function renderAll() {
  renderCurrentEntry();
  renderTimeline();
  renderCharacterLibrary();
  renderItemLibrary();
  renderFoodLibrary();
  renderRulesFaq();
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function setFilterCollapsedState(card, toggleBtn, collapsed) {
  card.classList.toggle("is-collapsed", collapsed);
  toggleBtn.setAttribute("aria-expanded", collapsed ? "false" : "true");
  toggleBtn.setAttribute("aria-label", collapsed ? "展开筛选" : "收起筛选");
  toggleBtn.dataset.collapsed = collapsed ? "1" : "0";
}

function bindFilterToggle(toggleId, cardSelector) {
  const toggleBtn = document.getElementById(toggleId);
  const card = document.querySelector(cardSelector);
  if (!toggleBtn || !card) return;
  toggleBtn.addEventListener("click", () => {
    if (!isMobileViewport()) return;
    const collapsed = !card.classList.contains("is-collapsed");
    setFilterCollapsedState(card, toggleBtn, collapsed);
  });
}

function syncFilterPanelsForViewport() {
  const configs = [
    { toggleId: "charFilterToggleBtn", selector: "#panel-character .filter-card" },
    { toggleId: "itemFilterToggleBtn", selector: "#panel-items .filter-card" },
    { toggleId: "foodFilterToggleBtn", selector: "#panel-foods .filter-card" }
  ];
  const mobile = isMobileViewport();
  configs.forEach(({ toggleId, selector }) => {
    const toggleBtn = document.getElementById(toggleId);
    const card = document.querySelector(selector);
    if (!toggleBtn || !card) return;
    if (!mobile) {
      setFilterCollapsedState(card, toggleBtn, false);
      return;
    }
    const collapsed = toggleBtn.dataset.collapsed ? toggleBtn.dataset.collapsed === "1" : true;
    setFilterCollapsedState(card, toggleBtn, collapsed);
  });
}

function bindEvents() {
  const updateTimelineTooltipPosition = (event) => {
    const timeline = document.getElementById("timeline");
    const cell = event.target && event.target.closest ? event.target.closest(".stage-cell") : null;
    if (!timeline || !cell || !timeline.contains(cell)) return;
    const tooltip = cell.querySelector(".timeline-food-hover");
    if (!tooltip) return;
    tooltip.style.setProperty("--tooltip-x", event.clientX + "px");
    tooltip.style.setProperty("--tooltip-y", event.clientY + "px");
  };

  const timelineEl = document.getElementById("timeline");
  if (timelineEl) {
    timelineEl.addEventListener("mousemove", updateTimelineTooltipPosition);
    timelineEl.addEventListener("mouseover", updateTimelineTooltipPosition);
    timelineEl.addEventListener("click", (event) => {
      const target = event.target && event.target.closest ? event.target.closest("[data-action='delete-generation']") : null;
      if (!target) return;
      const generation = Number(target.getAttribute("data-generation") || 0);
      if (!generation) return;
      deleteGenerationRecord(generation);
    });
  }

  document.getElementById("genderInput").addEventListener("change", (e) => {
    state.currentDraft.gender = normalizeGenderValue(e.target.value);
    state.currentDraft.stageCharacters.baby = "";
    state.currentDraft.stageCharacters.elder = "";
    applyAutoStageCharacter(state.currentDraft, "baby");
    if (state.currentDraft.stageIndex >= STAGES.indexOf("elder")) {
      applyAutoStageCharacter(state.currentDraft, "elder");
    }
    saveState();
    renderAll();
  });

  document.getElementById("prevStageBtn").addEventListener("click", () => {
    moveToPreviousStage();
  });

  document.getElementById("saveStageBtn").addEventListener("click", () => {
    saveCurrentStage(false);
  });

  document.getElementById("nextStageBtn").addEventListener("click", () => {
    saveCurrentStage(true);
  });

  document.getElementById("deleteCurrentRecordBtn").addEventListener("click", () => {
    deleteCurrentStageRecord();
  });

  document.getElementById("spouseQuickPickBtn").addEventListener("click", () => {
    if (currentStage() !== "adult") {
      showStatus("recordStatus", "仅成年期可选择配偶。", true);
      return;
    }
    openSelectorModal("spouse");
  });

  document.getElementById("currentPickPreview").addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.getAttribute("data-action");
    if (action === "edit-stage") {
      openSelectorModal("stage");
      return;
    }
    if (action === "edit-spouse") {
      if (currentStage() !== "adult") {
        showStatus("recordStatus", "仅成年期可修改配偶。", true);
        return;
      }
      openSelectorModal("spouse");
    }
  });

  document.getElementById("resetDataBtn").addEventListener("click", () => {
    const ok = window.confirm("确定清空所有世代记录吗？该操作不可恢复。");
    if (!ok) return;
    state.records = [];
    state.currentDraft = createDraft(1);
    saveState();
    renderAll();
    showStatus("recordStatus", "已清空全部记录。", false);
  });

  const downloadTimelineTableBtn = document.getElementById("downloadTimelineTableBtn");
  if (downloadTimelineTableBtn) {
    downloadTimelineTableBtn.addEventListener("click", downloadTimelineTable);
  }

  document.getElementById("charKeywordFilter").addEventListener("input", renderCharacterLibrary);
  document.getElementById("charStageFilter").addEventListener("change", renderCharacterLibrary);
  document.getElementById("charRankFilter").addEventListener("change", renderCharacterLibrary);
  document.querySelectorAll("#charParityTabs .mini-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.value || "";
      const input = document.getElementById("charParityFilter");
      const alreadySelected = input.value === value;
      input.value = alreadySelected ? "" : value;
      document.querySelectorAll("#charParityTabs .mini-tab-btn").forEach((node) => {
        node.classList.toggle("active", !alreadySelected && node === btn);
      });
      renderCharacterLibrary();
    });
  });

  document.getElementById("itemKeywordFilter").addEventListener("input", renderItemLibrary);
  document.getElementById("itemUsageFilter").addEventListener("change", renderItemLibrary);
  document.getElementById("itemStageFilter").addEventListener("change", renderItemLibrary);
  document.getElementById("foodKeywordFilter").addEventListener("input", renderFoodLibrary);
  document.getElementById("foodCategoryFilter").addEventListener("change", renderFoodLibrary);
  bindFilterToggle("charFilterToggleBtn", "#panel-character .filter-card");
  bindFilterToggle("itemFilterToggleBtn", "#panel-items .filter-card");
  bindFilterToggle("foodFilterToggleBtn", "#panel-foods .filter-card");
  window.addEventListener("resize", syncFilterPanelsForViewport);

  document.getElementById("closeModalBtn").addEventListener("click", closeModal);
  document.getElementById("detailModalMask").addEventListener("click", (event) => {
    if (event.target.id === "detailModalMask") closeModal();
  });
  document.getElementById("closeSelectorModalBtn").addEventListener("click", closeSelectorModal);
  document.getElementById("selectorModalMask").addEventListener("click", (event) => {
    if (event.target.id === "selectorModalMask") closeSelectorModal();
  });
  document.getElementById("closeTimelineFoodModalBtn").addEventListener("click", closeTimelineFoodModal);
  document.getElementById("timelineFoodModalMask").addEventListener("click", (event) => {
    if (event.target.id === "timelineFoodModalMask") closeTimelineFoodModal();
  });
  document.getElementById("openContactModalBtn").addEventListener("click", openContactModal);
  document.getElementById("closeContactModalBtn").addEventListener("click", closeContactModal);
  document.getElementById("contactModalMask").addEventListener("click", (event) => {
    if (event.target.id === "contactModalMask") closeContactModal();
  });
}

function init() {
  loadState();
  renderTabs();
  openTab(state.activeTab);
  const parityFilter = document.getElementById("charParityFilter");
  if (parityFilter) {
    parityFilter.value = "";
  }
  syncFilterPanelsForViewport();
  bindEvents();
  renderAll();
}

init();
