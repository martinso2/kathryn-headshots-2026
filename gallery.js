const STORAGE_KEY = "kathryn-headshots-2026-selection";

const articles = [...document.querySelectorAll("[data-file]")];
const checks = [...document.querySelectorAll("input[data-select]")];
const countEl = document.querySelector("[data-count]");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const emptyEl = document.querySelector("[data-empty]");
const copyBtn = document.querySelector("[data-copy]");
const clearBtn = document.querySelector("[data-clear]");
const dialog = document.querySelector("#viewer");
const viewerImg = document.querySelector("#viewer-image");
const viewerName = document.querySelector("#viewer-name");
const viewerCheck = document.querySelector("#viewer-check");
const viewerRetouched = document.querySelector("#viewer-retouched");

let filter = "all";
let viewerIndex = 0;
let clearTimer = 0;

function selectedFiles() {
  return checks.filter((box) => box.checked).map((box) => box.value);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedFiles()));
}

function restore() {
  try {
    const saved = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    checks.forEach((box) => {
      box.checked = saved.has(box.value);
    });
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function render() {
  const selected = new Set(selectedFiles());
  let visible = 0;

  articles.forEach((article) => {
    const show = filter === "all" || selected.has(article.dataset.file);
    article.hidden = !show;
    if (show) visible += 1;
  });

  countEl.textContent = String(selected.size);
  copyBtn.disabled = selected.size === 0;
  clearBtn.disabled = selected.size === 0;
  emptyEl.hidden = visible !== 0;

  if (dialog.open) syncViewer();
}

function boxFor(file) {
  return checks.find((box) => box.value === file);
}

function syncViewer() {
  const article = articles[viewerIndex];
  if (!article) return;
  const file = article.dataset.file;
  const source = article.querySelector("img");
  viewerImg.src = source.currentSrc || source.src;
  viewerImg.alt = source.alt;
  viewerName.textContent = file;
  viewerCheck.checked = Boolean(boxFor(file)?.checked);
  viewerRetouched.hidden = !file.endsWith("-Edit.jpg");
}

function openViewer(index) {
  viewerIndex = index;
  syncViewer();
  if (!dialog.open) dialog.showModal();
}

function stepViewer(direction) {
  const total = articles.length;
  viewerIndex = (viewerIndex + direction + total) % total;
  syncViewer();
}

function disarmClear() {
  clearBtn.textContent = "Clear";
  clearBtn.dataset.armed = "false";
  window.clearTimeout(clearTimer);
}

checks.forEach((box) => {
  box.addEventListener("change", () => {
    disarmClear();
    save();
    render();
  });
});

function openFromPortrait(target) {
  const opener = target.closest("[data-open]");
  if (!opener) return;
  const article = opener.closest("[data-file]");
  openViewer(articles.indexOf(article));
}

document.querySelector("#gallery").addEventListener("dblclick", (event) => {
  openFromPortrait(event.target);
});

document.querySelector("#gallery").addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  if (!event.target.closest("[data-open]")) return;
  event.preventDefault();
  openFromPortrait(event.target);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.setAttribute("aria-pressed", String(active));
    });
    render();
  });
});

copyBtn.addEventListener("click", async () => {
  const names = selectedFiles();
  if (!names.length) return;
  try {
    await navigator.clipboard.writeText(names.join("\n"));
    copyBtn.textContent = "Copied";
  } catch {
    copyBtn.textContent = "Copy failed";
  }
  window.setTimeout(() => {
    copyBtn.textContent = "Copy names";
  }, 1600);
});

clearBtn.addEventListener("click", () => {
  if (clearBtn.dataset.armed !== "true") {
    clearBtn.dataset.armed = "true";
    clearBtn.textContent = "Clear all?";
    clearTimer = window.setTimeout(disarmClear, 2400);
    return;
  }
  checks.forEach((box) => {
    box.checked = false;
  });
  disarmClear();
  save();
  render();
});

viewerCheck.addEventListener("change", () => {
  const file = articles[viewerIndex]?.dataset.file;
  const box = boxFor(file);
  if (!box) return;
  box.checked = viewerCheck.checked;
  disarmClear();
  save();
  render();
});

document.querySelector("[data-prev]").addEventListener("click", () => stepViewer(-1));
document.querySelector("[data-next]").addEventListener("click", () => stepViewer(1));
document.querySelector("[data-close]").addEventListener("click", () => dialog.close());

dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    stepViewer(1);
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    stepViewer(-1);
  }
});

document.querySelector("[data-total]").textContent = String(articles.length);
restore();
render();
