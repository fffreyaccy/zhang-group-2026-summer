const PROCURE_KEY = "zg2026-procure";
const WISH_KEY = "zg2026-wishes";

const PROCURE_ITEMS = [
  "防晒霜 / 晒后修复",
  "帽子、墨镜",
  "泳衣 / 换洗衣物",
  "防滑拖鞋、沙滩拖鞋",
  "充电宝、充电器",
  "驱蚊液 / 花露水",
  "常备药（肠胃、创可贴、晕车）",
  "冰块、饮料、啤酒",
  "烧烤肉类（牛肉卷、鸡翅、香肠）",
  "蔬菜（生菜、玉米、茄子、土豆）",
  "海鲜烤料（生蚝、虾、鱿鱼等）",
  "调料（盐、椒盐、蒜蓉、酱料）",
  "一次性餐具、锡纸、炭火（如需）",
  "纸巾、垃圾袋、湿巾",
  "桌游 / 扑克（可选）",
  "想带回去的特产预算（鱼丸、干货等）",
];

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function renderProcure() {
  const list = document.getElementById("procure-list");
  const checked = new Set(loadJSON(PROCURE_KEY, []));

  list.innerHTML = PROCURE_ITEMS.map((item, index) => {
    const id = `p-${index}`;
    const on = checked.has(item);
    return `
      <li>
        <label class="${on ? "done" : ""}">
          <input type="checkbox" id="${id}" data-item="${escapeAttr(item)}" ${on ? "checked" : ""} />
          <span>${escapeHtml(item)}</span>
        </label>
      </li>
    `;
  }).join("");

  list.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      const next = new Set(loadJSON(PROCURE_KEY, []));
      if (input.checked) next.add(input.dataset.item);
      else next.delete(input.dataset.item);
      saveJSON(PROCURE_KEY, [...next]);
      renderProcure();
    });
  });
}

function renderWishes() {
  const list = document.getElementById("wish-items");
  const wishes = loadJSON(WISH_KEY, []);

  list.innerHTML = wishes
    .map(
      (wish, index) => `
      <li>
        <div>
          <span class="who">${escapeHtml(wish.name)}</span>
          <span>${escapeHtml(wish.item)}</span>
        </div>
        <button type="button" data-index="${index}" aria-label="删除">删除</button>
      </li>
    `
    )
    .join("");

  list.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = loadJSON(WISH_KEY, []);
      next.splice(Number(btn.dataset.index), 1);
      saveJSON(WISH_KEY, next);
      renderWishes();
    });
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("'", "&#39;");
}

document.getElementById("wish-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const item = String(data.get("item") || "").trim();
  if (!name || !item) return;

  const wishes = loadJSON(WISH_KEY, []);
  wishes.unshift({ name, item, at: Date.now() });
  saveJSON(WISH_KEY, wishes);
  form.reset();
  renderWishes();
});

document.getElementById("reset-procure").addEventListener("click", () => {
  if (confirm("确定清空所有采购勾选吗？")) {
    saveJSON(PROCURE_KEY, []);
    renderProcure();
  }
});

function setupReveal() {
  const nodes = document.querySelectorAll(
    ".section-head, .day, .villa-hero, .villa-specs, .villa-gallery figure, .activity-list li, .guide-grid article, .food-list li, .panel, .tips"
  );
  nodes.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  nodes.forEach((el) => io.observe(el));
}

renderProcure();
renderWishes();
setupReveal();
