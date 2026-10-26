/**
 * Synthetic xBD Dataset & BDANet Explorer - Interactive Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  const bundle = window.DATASET_BUNDLE;
  if (!bundle) {
    console.error("DATASET_BUNDLE not loaded.");
    return;
  }

  // Combined sample lists
  const allSamples = [...bundle.test_samples, ...bundle.train_samples];
  let filteredSamples = [...bundle.test_samples]; // default to test samples for prediction availability
  let currentSampleIndex = 0;
  let activeTierFilter = "all";
  let currentViewMode = "quad";

  // Elements
  const splitTabs = document.querySelectorAll(".filter-tab");
  const sampleSelect = document.getElementById("sampleSelect");
  const prevBtn = document.getElementById("prevSampleBtn");
  const nextBtn = document.getElementById("nextSampleBtn");
  const viewTabs = document.querySelectorAll(".view-mode-tab");

  // Quad views
  const quadPreImg = document.getElementById("quadPreImg");
  const quadPostImg = document.getElementById("quadPostImg");
  const quadLocImg = document.getElementById("quadLocImg");
  const quadDmgImg = document.getElementById("quadDmgImg");

  // Slider view
  const sliderWrap = document.getElementById("sliderWrap");
  const sliderBeforeImg = document.getElementById("sliderBeforeImg");
  const sliderAfterImg = document.getElementById("sliderAfterImg");
  const sliderAfterWrap = document.getElementById("sliderAfterWrap");
  const sliderHandle = document.getElementById("sliderHandle");

  // BBox Inspector
  const bboxWrap = document.getElementById("bboxWrap");
  const bboxBaseImg = document.getElementById("bboxBaseImg");
  const bboxSvg = document.getElementById("bboxSvg");
  const buildingsList = document.getElementById("buildingsList");
  const buildingCountBadge = document.getElementById("buildingCountBadge");

  // Comparison view
  const comparisonViewWrap = document.getElementById("comparisonViewWrap");
  const comparisonImg = document.getElementById("comparisonImg");

  // Metadata ribbon
  const sampleIdTag = document.getElementById("sampleIdTag");
  const splitBadge = document.getElementById("splitBadge");
  const damagePills = document.getElementById("damagePills");

  // Code tabs
  const codeTabBtns = document.querySelectorAll(".code-tab-btn");
  const codeBody = document.getElementById("codeBody");
  const copyCodeBtn = document.getElementById("copyCodeBtn");

  // Lightbox Modal
  const modalOverlay = document.getElementById("modalOverlay");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  // -------------------------------------------------------------
  // Populate Samples Selector
  // -------------------------------------------------------------
  function updateSampleDropdown() {
    sampleSelect.innerHTML = "";
    filteredSamples.forEach((s, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = `${s.id} (${s.split.toUpperCase()} - ${s.buildings.length} bldgs)`;
      sampleSelect.appendChild(opt);
    });
    sampleSelect.value = currentSampleIndex;
  }

  // -------------------------------------------------------------
  // Render Active Sample
  // -------------------------------------------------------------
  function renderActiveSample() {
    if (!filteredSamples.length) return;
    const s = filteredSamples[currentSampleIndex];

    // 1. Update Ribbon
    sampleIdTag.textContent = s.id;
    splitBadge.textContent = s.split;
    splitBadge.className = `split-badge ${s.split}`;

    // Count tiers for this sample
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    s.buildings.forEach(b => { counts[b.damage_level] = (counts[b.damage_level] || 0) + 1; });

    damagePills.innerHTML = `
      <span class="damage-pill c1">● ${counts[1] || 0} Undamaged</span>
      <span class="damage-pill c2">● ${counts[2] || 0} Minor</span>
      <span class="damage-pill c3">● ${counts[3] || 0} Major</span>
      <span class="damage-pill c4">● ${counts[4] || 0} Destroyed</span>
    `;

    // 2. Update Quad View
    quadPreImg.src = s.pre_image;
    quadPostImg.src = s.post_image;
    quadLocImg.src = s.loc_target;
    quadDmgImg.src = s.dmg_target;

    // 3. Update Slider View
    sliderBeforeImg.src = s.pre_image;
    sliderAfterImg.src = s.post_image;

    // 4. Update BBox Inspector
    bboxBaseImg.src = s.post_image;
    renderBBoxes(s.buildings);

    // 5. Update Model Prediction Tab state
    const compTab = document.querySelector('[data-mode="comparison"]');
    if (s.comparison) {
      compTab.style.display = "flex";
      comparisonImg.src = s.comparison;
    } else {
      compTab.style.display = "none";
      if (currentViewMode === "comparison") {
        switchViewMode("quad");
      }
    }

    sampleSelect.value = currentSampleIndex;
  }

  // -------------------------------------------------------------
  // Render BBoxes & Interactive SVG
  // -------------------------------------------------------------
  function renderBBoxes(buildings) {
    bboxSvg.innerHTML = "";
    buildingsList.innerHTML = "";
    buildingCountBadge.textContent = `${buildings.length} Buildings`;

    buildings.forEach((b, idx) => {
      const [x, y, w, h] = b.bbox;
      const isVisible = activeTierFilter === "all" || b.damage_level === parseInt(activeTierFilter);

      // SVG Rect
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", w);
      rect.setAttribute("height", h);
      rect.setAttribute("rx", "2");
      rect.setAttribute("class", `building-rect c${b.damage_level}`);
      rect.id = `rect-${idx}`;
      if (!isVisible) rect.style.display = "none";

      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = `Building #${b.id}: ${b.damage_name} (Level ${b.damage_level})`;
      rect.appendChild(title);

      bboxSvg.appendChild(rect);

      // Sidebar Item
      const item = document.createElement("div");
      item.className = "building-list-item";
      item.id = `item-${idx}`;
      if (!isVisible) item.style.display = "none";

      const classColors = { 1: "#34d399", 2: "#facc15", 3: "#fb923c", 4: "#f87171" };
      item.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="display:inline-block; width:10px; height:10px; border-radius:2px; background:${classColors[b.damage_level]}"></span>
          <strong>#${b.id}</strong>
          <span style="color:#94a3b8; font-size:0.75rem;">(${w}×${h}px)</span>
        </div>
        <span style="font-size:0.75rem; color:${classColors[b.damage_level]}; font-weight:600;">${b.damage_name}</span>
      `;

      // Hover link interactions
      rect.addEventListener("mouseenter", () => {
        rect.classList.add("active");
        item.classList.add("active");
        item.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      rect.addEventListener("mouseleave", () => {
        rect.classList.remove("active");
        item.classList.remove("active");
      });

      item.addEventListener("mouseenter", () => {
        rect.classList.add("active");
        item.classList.add("active");
      });
      item.addEventListener("mouseleave", () => {
        rect.classList.remove("active");
        item.classList.remove("active");
      });

      buildingsList.appendChild(item);
    });
  }

  // -------------------------------------------------------------
  // View Mode Switcher
  // -------------------------------------------------------------
  function switchViewMode(mode) {
    currentViewMode = mode;
    viewTabs.forEach(t => t.classList.toggle("active", t.dataset.mode === mode));

    document.getElementById("quadGrid").style.display = mode === "quad" ? "grid" : "none";
    sliderWrap.style.display = mode === "slider" ? "block" : "none";
    bboxWrap.style.display = mode === "bbox" ? "grid" : "none";
    comparisonViewWrap.style.display = mode === "comparison" ? "block" : "none";
  }

  viewTabs.forEach(tab => {
    tab.addEventListener("click", () => switchViewMode(tab.dataset.mode));
  });

  // -------------------------------------------------------------
  // Wipe Slider Drag Logic
  // -------------------------------------------------------------
  let isDraggingSlider = false;

  function updateSliderPosition(e) {
    const rect = sliderWrap.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let posX = clientX - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const pct = (posX / rect.width) * 100;
    sliderAfterWrap.style.width = `${pct}%`;
    sliderHandle.style.left = `${pct}%`;
  }

  sliderWrap.addEventListener("mousedown", (e) => {
    isDraggingSlider = true;
    updateSliderPosition(e);
  });
  window.addEventListener("mousemove", (e) => {
    if (isDraggingSlider) updateSliderPosition(e);
  });
  window.addEventListener("mouseup", () => {
    isDraggingSlider = false;
  });

  // Touch support for slider
  sliderWrap.addEventListener("touchstart", (e) => {
    isDraggingSlider = true;
    updateSliderPosition(e);
  });
  window.addEventListener("touchmove", (e) => {
    if (isDraggingSlider) updateSliderPosition(e);
  });
  window.addEventListener("touchend", () => {
    isDraggingSlider = false;
  });

  // -------------------------------------------------------------
  // Split Filters & Sample Selection
  // -------------------------------------------------------------
  splitTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      splitTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const split = tab.dataset.split;
      if (split === "all") {
        filteredSamples = allSamples;
      } else if (split === "train") {
        filteredSamples = bundle.train_samples;
      } else {
        filteredSamples = bundle.test_samples;
      }
      currentSampleIndex = 0;
      updateSampleDropdown();
      renderActiveSample();
    });
  });

  sampleSelect.addEventListener("change", (e) => {
    currentSampleIndex = parseInt(e.target.value);
    renderActiveSample();
  });

  prevBtn.addEventListener("click", () => {
    if (currentSampleIndex > 0) {
      currentSampleIndex--;
    } else {
      currentSampleIndex = filteredSamples.length - 1;
    }
    renderActiveSample();
  });

  nextBtn.addEventListener("click", () => {
    if (currentSampleIndex < filteredSamples.length - 1) {
      currentSampleIndex++;
    } else {
      currentSampleIndex = 0;
    }
    renderActiveSample();
  });

  // Tier Filter Buttons in BBox Inspector
  const tierFilterBtns = document.querySelectorAll(".filter-tier-btn");
  tierFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tierFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeTierFilter = btn.dataset.tier;
      const s = filteredSamples[currentSampleIndex];
      renderBBoxes(s.buildings);
    });
  });

  // -------------------------------------------------------------
  // JSON Code Viewer
  // -------------------------------------------------------------
  const jsonSnippets = {
    train: JSON.stringify(bundle.train_samples.map(s => ({
      id: s.id,
      pre_image: s.pre_image,
      post_image: s.post_image,
      loc_target: s.loc_target,
      dmg_target: s.dmg_target
    })), null, 2),
    test: JSON.stringify(bundle.test_samples.map(s => ({
      id: s.id,
      pre_image: s.pre_image,
      post_image: s.post_image,
      loc_target: s.loc_target,
      dmg_target: s.dmg_target
    })), null, 2),
    meta: JSON.stringify(bundle.test_samples[0].buildings, null, 2),
    stats: JSON.stringify(bundle.stats, null, 2)
  };

  codeTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      codeTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.code;
      codeBody.textContent = jsonSnippets[target];
    });
  });

  copyCodeBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(codeBody.textContent).then(() => {
      const origText = copyCodeBtn.textContent;
      copyCodeBtn.textContent = "✓ Copied!";
      copyCodeBtn.style.color = "#34d399";
      setTimeout(() => {
        copyCodeBtn.textContent = origText;
        copyCodeBtn.style.color = "";
      }, 2000);
    });
  });

  // -------------------------------------------------------------
  // Lightbox Modal for Figures
  // -------------------------------------------------------------
  const figureCards = document.querySelectorAll(".figure-card");
  figureCards.forEach(card => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      const title = card.querySelector(".figure-card-title");
      modalImg.src = img.src;
      modalTitle.textContent = title ? title.textContent : "Figure Preview";
      modalOverlay.style.display = "flex";
    });
  });

  modalCloseBtn.addEventListener("click", () => {
    modalOverlay.style.display = "none";
  });
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) modalOverlay.style.display = "none";
  });

  // -------------------------------------------------------------
  // Initial Run
  // -------------------------------------------------------------
  updateSampleDropdown();
  renderActiveSample();
  codeBody.textContent = jsonSnippets.train;
});
