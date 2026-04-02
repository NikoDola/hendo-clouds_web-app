const preview = document.getElementById("preview");
const colorPicker = document.getElementById("colorPicker");
const addColorBtn = document.getElementById("addColor");
const downloadBtn = document.getElementById("download");
const downloadPngBtn = document.getElementById("downloadPng");

const colorListEl = document.getElementById("colorList");
const colorCountEl = document.getElementById("colorCount");
const selectCategory = document.getElementById("select-category");
const selectFontEl = document.getElementById("select-font");
const uniqueSearchEl = document.getElementById("unique-search");
const sloganUniquesWrapEl = document.getElementById("slogan-uniques-wrap");
const resetFiltersBtn = document.getElementById("reset-filters");
const sloganTooltipEl = document.getElementById("slogan-tooltip");

/* state */
let selectedValue = "all"; // all | fill | outline
let selectedFont = "all"; // all | <font>
let uniqueSearch = "";
let colors = ["#ffffff"];
let svgs = [];
/** Unique names temporarily hidden from the list (not deleted). */
let excludedUniques = new Set();
let sloganTooltipTimer = null;

/* data from slogans/manifest.json */
let sloganFiles = []; // array of filenames (strings)
let sloganItems = []; // parsed items

function parseSloganFilename(filename) {
  // Expected:
  // - slogan-fill_<font>_<unique>.svg
  // - slogan-outline_<font>_<unique>.svg
  // NOTE: <unique> itself may contain underscores; we join the rest back.
  const base = String(filename || "");
  const m = base.match(/^slogan-(fill|outline)_(.+)\.svg$/i);
  if (!m) return null;

  const mode = m[1].toLowerCase();
  const rest = m[2]; // <font>_<unique>
  const parts = rest.split("_");
  const font = (parts.shift() || "").trim();
  const unique = parts.join("_").trim();
  if (!font) return null;

  return { filename: base, mode, font, unique };
}

function naturalLabelFromItem(item) {
  // Display the thing you actually want to search: the unique part
  return (item.unique || item.filename)
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getFilteredItems() {
  const fontOk = selectedFont === "all"
    ? () => true
    : (it) => it.font === selectedFont;

  const modeOk = selectedValue === "all"
    ? () => true
    : (it) => it.mode === selectedValue;

  const q = (uniqueSearch || "").trim().toLowerCase();
  const textOk = !q
    ? () => true
    : (it) => (it.unique || "").toLowerCase().includes(q);

  const notExcluded = (it) => !excludedUniques.has(it.unique);

  return sloganItems.filter(it => fontOk(it) && modeOk(it) && textOk(it) && notExcluded(it));
}

function getFilesToLoad() {
  const items = getFilteredItems();
  return items.map(it => it.filename);
}

/* ============================= */
/* SVG NORMALIZATION (IMPORTANT) */
/* ============================= */
function normalizeSvg(svgEl) {
  // remove embedded styles
  svgEl.querySelectorAll("style").forEach(s => s.remove());

  // remove class & inline styles that override JS
  svgEl.querySelectorAll("*").forEach(el => {
    el.removeAttribute("class");
    el.removeAttribute("style");
  });
}

/* ============================= */
/* LOAD SVGs */
/* ============================= */
function loadSvgs() {
  preview.innerHTML = "";
  svgs = [];

  const files = getFilesToLoad();
  if (!files.length) return;

  Promise.all(
    files.map(file =>
      fetch(`./slogans/${encodeURIComponent(file)}`).then(r => r.text())
    )
  ).then(results => {
    results.forEach((svgText, i) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = svgText.trim();

      const svgEl = wrapper.querySelector("svg");
      if (!svgEl) return;

      normalizeSvg(svgEl);

      preview.appendChild(svgEl);

      const parsed = parseSloganFilename(files[i]);
      svgs.push({
        name: files[i].replace(".svg", ""),
        svgEl,
        mode: parsed?.mode || "fill"
      });
    });

    recolorAll();
  });
}

function hideSloganTooltip() {
  if (!sloganTooltipEl) return;
  sloganTooltipEl.style.display = "none";
  if (sloganTooltipTimer) {
    clearTimeout(sloganTooltipTimer);
    sloganTooltipTimer = null;
  }
}

function showSloganTooltipAt(x, y, text) {
  if (!sloganTooltipEl) return;

  if (sloganTooltipTimer) clearTimeout(sloganTooltipTimer);

  sloganTooltipEl.textContent = text;
  sloganTooltipEl.style.display = "block";

  // Initial position (we'll clamp after measuring)
  let left = x + 12;
  let top = y + 12;
  sloganTooltipEl.style.left = `${left}px`;
  sloganTooltipEl.style.top = `${top}px`;

  // Clamp into viewport
  const rect = sloganTooltipEl.getBoundingClientRect();
  const pad = 12;
  const maxLeft = window.innerWidth - rect.width - pad;
  const maxTop = window.innerHeight - rect.height - pad;
  left = Math.min(left, maxLeft);
  top = Math.min(top, maxTop);
  left = Math.max(pad, left);
  top = Math.max(pad, top);
  sloganTooltipEl.style.left = `${left}px`;
  sloganTooltipEl.style.top = `${top}px`;

  sloganTooltipTimer = setTimeout(() => {
    sloganTooltipEl.style.display = "none";
    sloganTooltipTimer = null;
  }, 3000);
}

/* ============================= */
/* SELECT CHANGE */
/* ============================= */
selectCategory.addEventListener("change", () => {
  selectedValue = selectCategory.value;
  renderUniqueChips();
  loadSvgs();
});

if (selectFontEl) {
  selectFontEl.addEventListener("change", () => {
    selectedFont = selectFontEl.value;
    renderUniqueChips();
    loadSvgs();
  });
}

if (uniqueSearchEl) {
  uniqueSearchEl.addEventListener("input", () => {
    uniqueSearch = uniqueSearchEl.value || "";
    renderUniqueChips();
    loadSvgs();
  });
}

if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener("click", () => {
    excludedUniques.clear();
    if (uniqueSearchEl) {
      uniqueSearchEl.value = "";
      uniqueSearch = "";
    }
    renderUniqueChips();
    loadSvgs();
  });
}

/* ============================= */
/* ADD COLOR */
/* ============================= */
addColorBtn.onclick = () => {
  colors.push(colorPicker.value);
  renderColors();
  recolorAll();
};

/* ============================= */
/* COLOR UI */
/* ============================= */
function renderColors() {
  colorListEl.innerHTML = "";
  colorCountEl.textContent = colors.length;

  colors.forEach((color, index) => {
    const item = document.createElement("div");
    item.className = "colorItem";
    item.style.background = color;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.onclick = e => {
      e.stopPropagation();
      colors.splice(index, 1);
      renderColors();
      recolorAll();
    };

    item.appendChild(removeBtn);
    colorListEl.appendChild(item);
  });
}

/* ============================= */
/* APPLY COLORS */
/* ============================= */
function recolorAll() {
  svgs.forEach(({ svgEl, mode }) => {
    svgEl.querySelectorAll("defs").forEach(d => d.remove());

    const shapes = svgEl.querySelectorAll(
      "path, rect, circle, line, polyline, polygon"
    );

    if (colors.length === 0) {
      shapes.forEach(el => el.setAttribute("fill", "#000000"));
      return;
    }

    if (colors.length === 1) {
      shapes.forEach(el => {
        el.setAttribute("fill", colors[0]);
      });
      return;
    }

    /* vertical gradient */
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    const id = `grad-${Math.random().toString(36).slice(2)}`;

    grad.setAttribute("id", id);
    grad.setAttribute("x1", "0%");
    grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "0%");
    grad.setAttribute("y2", "100%");

    colors.forEach((c, i) => {
      const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop.setAttribute("offset", `${(i / (colors.length - 1)) * 100}%`);
      stop.setAttribute("stop-color", c);
      grad.appendChild(stop);
    });

    defs.appendChild(grad);
    svgEl.prepend(defs);

    shapes.forEach(el => {
      el.setAttribute("fill", `url(#${id})`);
    });
  });
}

/* ============================= */
/* DOWNLOAD BOTH MODES */
/* ============================= */
function downloadBlob(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 250);
}

function getFileForVariant(mode, variant) {
  // Legacy helper (kept for safety). New logic uses filenames directly.
  return `slogan-${mode}_${variant}.svg`;
}

function getNiceBaseNameFromFilename(filename) {
  const item = parseSloganFilename(filename);
  if (!item) return filename.replace(/\.svg$/i, "");
  const safeUnique = (item.unique || "slogan").trim();
  return `slogan-${item.mode}_${item.font}_${safeUnique}`;
}

async function exportFileToZip(zipFolder, filename) {
  const url = `./slogans/${encodeURIComponent(filename)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
  const svgText = await res.text();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = svgText.trim();
  const svgEl = wrapper.querySelector("svg");
  if (!svgEl) throw new Error(`Invalid SVG file: ${url}`);

  normalizeSvg(svgEl);
  recolorSingle(svgEl);

  const svgStr = new XMLSerializer().serializeToString(svgEl);
  zipFolder.file(filename, svgStr);

  const pngBlob = await svgToPng(svgEl);
  if (pngBlob) {
    const base = getNiceBaseNameFromFilename(filename);
    zipFolder.file(`${base}.png`, pngBlob);
  }
}

downloadBtn.onclick = async () => {
  if (typeof JSZip === "undefined") {
    alert(
      "ZIP download library (JSZip) failed to load. If you're offline or a network is blocked, PNG export can still work."
    );
    return;
  }

  try {
    const zip = new JSZip();

    const filesToExport = getFilesToLoad();
    if (!filesToExport.length) return;

    const folder = zip.folder("slogans");
    if (!folder) throw new Error("Failed to create zip folder");

    for (const filename of filesToExport) {
      await exportFileToZip(folder, filename);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const zipName = filesToExport.length > 1
      ? "slogans-svg+png.zip"
      : `${getNiceBaseNameFromFilename(filesToExport[0])}-svg+png.zip`;
    downloadBlob(blob, zipName);
  } catch (err) {
    // The most common cause is running from file:// (fetch can't load local SVG files)
    const isFile = window.location?.protocol === "file:";
    const hint = isFile
      ? "\n\nIt looks like you're opening this page from your file system. The ZIP export needs a local web server so it can fetch the SVG files.\nTry: run a local server in the repo (e.g. VS Code/Live Server) and open http://localhost/..."
      : "";
    const message =
      err && typeof err === "object" && "message" in err
        ? String(err.message)
        : String(err);
    alert(`ZIP export failed: ${message}${hint}`);
    console.error("ZIP export failed:", err);
  }
};

downloadPngBtn.onclick = async () => {
  if (svgs.length > 1) {
    if (typeof JSZip === "undefined") {
      alert(
        "ZIP download library (JSZip) failed to load, so I can't bundle multiple PNGs. Try the ZIP button, or check your network."
      );
      return;
    }

    if (!svgs.length) return;

    const zip = new JSZip();
    const folder = zip.folder("png");

    for (const item of svgs) {
      if (!item?.svgEl) continue;
      const pngBlob = await svgToPng(item.svgEl);
      if (!pngBlob) continue;
      const filename = `${item.name}.svg`;
      const base = getNiceBaseNameFromFilename(filename);
      folder.file(`${base}.png`, pngBlob);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, "slogans-pngs.zip");
    return;
  }

  // Single-slogan mode: download one PNG directly.
  const first = svgs[0];
  if (!first?.svgEl) return;

  const pngBlob = await svgToPng(first.svgEl);
  if (!pngBlob) return;

  const baseName = getNiceBaseNameFromFilename(`${first.name}.svg`);
  downloadBlob(pngBlob, `${baseName}.png`);
};

function recolorSingle(svgEl) {
  svgEl.querySelectorAll("defs").forEach(d => d.remove());

  const shapes = svgEl.querySelectorAll(
    "path, rect, circle, line, polyline, polygon"
  );

  if (colors.length === 1) {
    shapes.forEach(el => el.setAttribute("fill", colors[0]));
  }

  if (colors.length > 1) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    const id = "export-grad";

    grad.setAttribute("id", id);
    grad.setAttribute("x1", "0%");
    grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "0%");
    grad.setAttribute("y2", "100%");

    colors.forEach((c, i) => {
      const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop.setAttribute("offset", `${(i / (colors.length - 1)) * 100}%`);
      stop.setAttribute("stop-color", c);
      grad.appendChild(stop);
    });

    defs.appendChild(grad);
    svgEl.prepend(defs);

    shapes.forEach(el => el.setAttribute("fill", `url(#${id})`));
  }
}

/* ============================= */
/* SVG → PNG */
/* ============================= */
function svgToPng(svgEl, options = {}) {
  const scale = Number.isFinite(options.scale) ? options.scale : 4;
  return new Promise(resolve => {
    const svgStr = new XMLSerializer().serializeToString(svgEl);
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      // Prefer viewBox sizing (Illustrator exports often omit width/height)
      const vb = (svgEl.getAttribute("viewBox") || "")
        .trim()
        .split(/\s+/)
        .map(Number);

      const vbW = vb.length === 4 ? vb[2] : NaN;
      const vbH = vb.length === 4 ? vb[3] : NaN;

      const width = Number.isFinite(img.width) && img.width > 0
        ? img.width
        : (Number.isFinite(vbW) ? vbW : 512);
      const height = Number.isFinite(img.height) && img.height > 0
        ? img.height
        : (Number.isFinite(vbH) ? vbH : 512);

      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(b => {
        resolve(b);
        URL.revokeObjectURL(url);
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    img.src = url;
  });
}

/* ============================= */
/* INIT */
/* ============================= */
function renderFontSelect() {
  if (!selectFontEl) return;
  const fonts = Array.from(new Set(sloganItems.map(it => it.font))).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  const prev = selectedFont;
  selectFontEl.innerHTML = "";

  const optAll = document.createElement("option");
  optAll.value = "all";
  optAll.textContent = "All fonts";
  selectFontEl.appendChild(optAll);

  fonts.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    selectFontEl.appendChild(opt);
  });

  // restore selection if possible
  selectedFont = fonts.includes(prev) ? prev : "all";
  selectFontEl.value = selectedFont;
}

function renderUniqueChips() {
  if (!sloganUniquesWrapEl) return;
  sloganUniquesWrapEl.innerHTML = "";

  const items = getFilteredItems();
  const uniques = [...new Set(items.map(it => it.unique))].sort((a, b) =>
    (a || "").localeCompare(b || "", undefined, { sensitivity: "base" })
  );

  uniques.forEach(unique => {
    const chip = document.createElement("span");
    chip.className = "sloganUniqueChip";
    chip.textContent = (unique || "").replace(/-/g, " ");
    const xBtn = document.createElement("button");
    xBtn.type = "button";
    xBtn.className = "chipRemove";
    xBtn.setAttribute("aria-label", "Remove from list");
    xBtn.textContent = "×";
    xBtn.onclick = () => {
      excludedUniques.add(unique);
      renderUniqueChips();
      loadSvgs();
    };
    chip.appendChild(xBtn);
    sloganUniquesWrapEl.appendChild(chip);
  });
}

async function initSlogansFromManifest() {
  const res = await fetch("./slogans/manifest.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load slogans/manifest.json (${res.status})`);
  sloganFiles = await res.json();
  if (!Array.isArray(sloganFiles)) throw new Error("manifest.json must be an array of filenames");

  sloganItems = sloganFiles
    .map(parseSloganFilename)
    .filter(Boolean);

  renderFontSelect();
  renderUniqueChips();
}

renderColors();
initSlogansFromManifest()
  .then(() => loadSvgs())
  .catch(err => {
    console.error("Failed to init slogans:", err);
    alert(
      "Failed to load slogans manifest. Make sure you are running a local web server (not file://) and that slogans/manifest.json exists."
    );
  });
