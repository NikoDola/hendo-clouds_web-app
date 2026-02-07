const preview = document.getElementById("preview");
const colorPicker = document.getElementById("colorPicker");
const addColorBtn = document.getElementById("addColor");
const downloadBtn = document.getElementById("download");
const downloadPngBtn = document.getElementById("downloadPng");

const colorListEl = document.getElementById("colorList");
const colorCountEl = document.getElementById("colorCount");
const selectCategory = document.getElementById("select-category");
const selectAllSlogansEl = document.getElementById("select-all-slogans");
const selectSloganEl = document.getElementById("select-slogan");
const selectSloganWrapEl = document.getElementById("select-slogan-wrap");
const selectSloganOverlayEl = document.getElementById("select-slogan-overlay");
const sloganTooltipEl = document.getElementById("slogan-tooltip");

/* state */
let selectedValue = "fill";
let colors = ["#ffffff"];
let svgs = [];
let selectAllSlogans = true;
let selectedSloganVariant = "galaxy";
let sloganTooltipTimer = null;

const sloganVariants = 
["galaxy", "intergalactic", "magic-power", "next-level", "mind-over-metter", "my-magical-power", 
  "imagination", "dream", "dreams-to-reality", "hidden power", "unlock-potential", "aim-for-the-stars",
   "believe-in-yourself", "destined-for-greatness", "envision-beauty", "cloudy","cloudy-vision",
   "cloud-company","sea-of-clouds","clear-skies", "beautiful-clouds", "synchronicity", "very-special",
  "special","mind-body-spirit", "rare", "on-of-a-kind", "from-the-heart", "from-the-bottom-of-the-heart",
"alchemy", "chicago-to-tokyo","neon-lights", "designed-to-win", "purpose"];

/* base filenames (fill template) */
const slogans = sloganVariants.map(v => `slogan-fill_${v}.svg`);

function getFilesForMode(mode) {
  if (selectAllSlogans) return slogans.map(f => f.replace("fill", mode));
  return [`slogan-${mode}_${selectedSloganVariant}.svg`];
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
function loadSvgs(mode) {
  preview.innerHTML = "";
  svgs = [];

  const files = getFilesForMode(mode);

  Promise.all(
    files.map(file =>
      fetch(`./slogans/${mode}/${file}`).then(r => r.text())
    )
  ).then(results => {
    results.forEach((svgText, i) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = svgText.trim();

      const svgEl = wrapper.querySelector("svg");
      if (!svgEl) return;

      normalizeSvg(svgEl);

      preview.appendChild(svgEl);

      svgs.push({
        name: files[i].replace(".svg", ""),
        svgEl,
        mode
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

function updateSloganSelectLockUI() {
  const locked = !!selectAllSlogans;
  selectSloganEl.disabled = locked;
  if (selectSloganWrapEl) {
    selectSloganWrapEl.classList.toggle("isDisabled", locked);
  }
  if (!locked) hideSloganTooltip();
}

/* ============================= */
/* SELECT CHANGE */
/* ============================= */
selectCategory.addEventListener("change", () => {
  selectedValue = selectCategory.value;
  loadSvgs(selectedValue);
});

selectAllSlogansEl.addEventListener("change", () => {
  selectAllSlogans = !!selectAllSlogansEl.checked;
  updateSloganSelectLockUI();
  loadSvgs(selectedValue);
});

selectSloganEl.addEventListener("change", () => {
  selectedSloganVariant = selectSloganEl.value;
  if (!selectAllSlogans) loadSvgs(selectedValue);
});

if (selectSloganOverlayEl) {
  selectSloganOverlayEl.addEventListener("click", e => {
    if (!selectAllSlogans) return;
    showSloganTooltipAt(
      e.clientX,
      e.clientY,
      "You need to uncheck “Select all” so you can select a specific slogan."
    );
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
downloadBtn.onclick = async () => {
  if (typeof JSZip === "undefined") {
    alert(
      "ZIP download library (JSZip) failed to load. If you're offline or a network is blocked, PNG export can still work."
    );
    return;
  }

  try {
    const zip = new JSZip();

    for (const mode of ["fill", "outline"]) {
      const folder = zip.folder(mode);
      await exportMode(mode, folder);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = selectAllSlogans
      ? "slogans.zip"
      : `slogan-${selectedSloganVariant}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(a.href), 250);
  } catch (err) {
    // The most common cause is running from file:// (fetch can't load local SVG files)
    const isFile = window.location?.protocol === "file:";
    const hint = isFile
      ? "\n\nIt looks like you're opening this page from your file system. The ZIP export needs a local web server so it can fetch the SVG files.\nTry: run a local server in the repo (e.g. VS Code/Live Server) and open http://localhost/..."
      : "";
    alert(`ZIP export failed.${hint}`);
    console.error(err);
  }
};

downloadPngBtn.onclick = async () => {
  // When "Select all" is enabled, the preview contains multiple SVGs.
  // In that case, download the first one as a convenience.
  const first = svgs[0];
  if (!first?.svgEl) return;

  const pngBlob = await svgToPng(first.svgEl);
  if (!pngBlob) return;

  const a = document.createElement("a");
  a.href = URL.createObjectURL(pngBlob);

  const baseName = selectAllSlogans
    ? `${first.name}-${first.mode}`
    : `slogan-${first.mode}_${selectedSloganVariant}`;
  a.download = `${baseName}.png`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(a.href), 250);
};

async function exportMode(mode, folder) {
  const files = getFilesForMode(mode);

  for (let i = 0; i < files.length; i++) {
    const url = `./slogans/${mode}/${files[i]}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url} (${res.status})`);
    }
    const svgText = await res.text();

    const wrapper = document.createElement("div");
    wrapper.innerHTML = svgText.trim();
    const svgEl = wrapper.querySelector("svg");
    if (!svgEl) throw new Error(`Invalid SVG file: ${url}`);

    normalizeSvg(svgEl);
    recolorSingle(svgEl);

    const svgStr = new XMLSerializer().serializeToString(svgEl);
    folder.file(files[i], svgStr);

    const pngBlob = await svgToPng(svgEl);
    if (pngBlob) {
      folder.file(files[i].replace(".svg", ".png"), pngBlob);
    }
  }
}

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
function svgToPng(svgEl) {
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

      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
function initSloganSelector() {
  selectSloganEl.innerHTML = "";

  sloganVariants.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v.replace(/-/g, " ");
    selectSloganEl.appendChild(opt);
  });

  // set defaults
  selectAllSlogansEl.checked = true;
  selectAllSlogans = true;
  selectedSloganVariant = sloganVariants[0];
  selectSloganEl.value = selectedSloganVariant;
  updateSloganSelectLockUI();
}

initSloganSelector();
renderColors();
loadSvgs(selectedValue);
