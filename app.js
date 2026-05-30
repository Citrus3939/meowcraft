const STORAGE_KEY = "trade-journal-records";

const form = document.querySelector("#tradeForm");
const tableBody = document.querySelector("#tradeTableBody");
const formTitle = document.querySelector("#formTitle");
const resetFormButton = document.querySelector("#resetFormButton");
const clearAllButton = document.querySelector("#clearAllButton");
const screenshotInput = document.querySelector("#screenshot");
const screenshotPreview = document.querySelector("#screenshotPreview");
const previewImage = document.querySelector("#previewImage");
const previewName = document.querySelector("#previewName");
const removeScreenshotButton = document.querySelector("#removeScreenshotButton");
const totalTrades = document.querySelector("#totalTrades");
const avgRatio = document.querySelector("#avgRatio");
const openTrades = document.querySelector("#openTrades");
const completedTrades = document.querySelector("#completedTrades");
const searchInput = document.querySelector("#searchInput");
const directionFilter = document.querySelector("#directionFilter");

let trades = loadTrades();
let screenshotDraft = {
  data: "",
  name: ""
};

render();

form.addEventListener("submit", handleSubmit);
resetFormButton.addEventListener("click", resetForm);
clearAllButton.addEventListener("click", clearAllTrades);
removeScreenshotButton.addEventListener("click", removeScreenshot);
screenshotInput.addEventListener("change", handleScreenshotChange);
tableBody.addEventListener("click", handleTableAction);
searchInput.addEventListener("input", render);
directionFilter.addEventListener("change", render);

function handleSubmit(event) {
  event.preventDefault();

  const existingId = getValue("tradeId");
  const trade = {
    id: existingId || createId(),
    symbol: getValue("symbol"),
    direction: getValue("direction"),
    entryTime: getValue("entryTime"),
    exitTime: getValue("exitTime"),
    entryPrice: getNumber("entryPrice"),
    exitPrice: getOptionalNumber("exitPrice"),
    stopLoss: getNumber("stopLoss"),
    takeProfit: getNumber("takeProfit"),
    volume: getValue("volume"),
    reason: getValue("reason"),
    review: getValue("review"),
    screenshot: screenshotDraft.data,
    screenshotName: screenshotDraft.name,
    updatedAt: new Date().toISOString()
  };

  if (existingId) {
    trades = trades.map((item) => (item.id === existingId ? trade : item));
  } else {
    trades = [trade, ...trades];
  }

  saveTrades();
  render();
  resetForm();
}

function handleScreenshotChange(event) {
  const [file] = event.target.files;

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("请上传图片格式的交易截图。");
    screenshotInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    screenshotDraft = {
      data: String(reader.result),
      name: file.name
    };
    showScreenshotPreview();
  });
  reader.readAsDataURL(file);
}

function handleTableAction(event) {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const trade = trades.find((item) => item.id === button.dataset.id);

  if (!trade) {
    return;
  }

  if (button.dataset.action === "edit") {
    editTrade(trade);
  }

  if (button.dataset.action === "delete") {
    deleteTrade(trade);
  }
}

function editTrade(trade) {
  setValue("tradeId", trade.id);
  setValue("symbol", trade.symbol);
  setValue("direction", trade.direction);
  setValue("entryTime", trade.entryTime);
  setValue("exitTime", trade.exitTime);
  setValue("entryPrice", trade.entryPrice);
  setValue("exitPrice", trade.exitPrice ?? "");
  setValue("stopLoss", trade.stopLoss);
  setValue("takeProfit", trade.takeProfit);
  setValue("volume", trade.volume);
  setValue("reason", trade.reason);
  setValue("review", trade.review);

  screenshotDraft = {
    data: trade.screenshot || "",
    name: trade.screenshotName || ""
  };
  screenshotInput.value = "";
  showScreenshotPreview();

  formTitle.textContent = "编辑交易";
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteTrade(trade) {
  const confirmed = confirm(`确定删除 ${trade.symbol} 的这笔交易记录吗？`);

  if (!confirmed) {
    return;
  }

  trades = trades.filter((item) => item.id !== trade.id);
  saveTrades();
  render();
}

function clearAllTrades() {
  if (!trades.length) {
    return;
  }

  const confirmed = confirm("确定清空全部交易记录吗？此操作无法撤销。");

  if (!confirmed) {
    return;
  }

  trades = [];
  saveTrades();
  render();
  resetForm();
}

function resetForm() {
  form.reset();
  setValue("tradeId", "");
  screenshotDraft = {
    data: "",
    name: ""
  };
  screenshotInput.value = "";
  showScreenshotPreview();
  formTitle.textContent = "新增交易";
}

function removeScreenshot() {
  screenshotDraft = {
    data: "",
    name: ""
  };
  screenshotInput.value = "";
  showScreenshotPreview();
}

function render() {
  renderStats();

  if (!trades.length) {
    renderEmptyState("还没有交易记录", "先新增一笔交易，建立你的可复盘样本库。");
    return;
  }

  const filteredTrades = getFilteredTrades();

  if (!filteredTrades.length) {
    renderEmptyState("没有匹配的交易", "换一个关键词或筛选条件再试试。");
    return;
  }

  const sortedTrades = [...filteredTrades].sort((a, b) => {
    return new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime();
  });

  tableBody.innerHTML = sortedTrades.map(renderTradeRow).join("");
}

function renderEmptyState(title, detail) {
  tableBody.innerHTML = `
    <tr>
      <td colspan="10" class="empty-state">
        <div class="empty-panel">
          <strong>${title}</strong>
          <span>${detail}</span>
        </div>
      </td>
    </tr>
  `;
}

function getFilteredTrades() {
  const keyword = searchInput.value.trim().toLowerCase();
  const direction = directionFilter.value;

  return trades.filter((trade) => {
    const matchesDirection = direction === "全部" || trade.direction === direction;
    const searchable = [trade.symbol, trade.reason, trade.volume, trade.review]
      .join(" ")
      .toLowerCase();
    const matchesKeyword = !keyword || searchable.includes(keyword);

    return matchesDirection && matchesKeyword;
  });
}

function renderTradeRow(trade) {
  const holdingTime = formatHoldingTime(trade.entryTime, trade.exitTime);
  const ratio = calculateRiskReward(trade);
  const ratioClass = ratio === "--" ? "ratio empty" : "ratio";
  const statusClass = trade.exitTime ? "closed" : "open";
  const statusText = trade.exitTime ? "已平仓" : "持仓中";
  const screenshot = trade.screenshot
    ? `<a href="${escapeAttribute(trade.screenshot)}" target="_blank" rel="noreferrer"><img class="thumbnail" src="${escapeAttribute(trade.screenshot)}" alt="${escapeAttribute(trade.screenshotName || "交易截图")}"></a>`
    : '<span class="cell-sub">未上传</span>';
  const exitPrice = trade.exitPrice === null || trade.exitPrice === undefined || trade.exitPrice === "" ? "未平仓" : formatNumber(trade.exitPrice);

  return `
    <tr>
      <td>
        <span class="cell-title">${escapeHtml(trade.symbol)}</span>
        <span class="cell-sub">${escapeHtml(trade.direction)}</span>
        <span class="status-pill ${statusClass}">${statusText}</span>
      </td>
      <td>${formatMultiline(trade.reason)}</td>
      <td>
        <span class="cell-title">${formatDateTime(trade.entryTime)} / ${formatNumber(trade.entryPrice)}</span>
        <span class="cell-sub">${trade.exitTime ? formatDateTime(trade.exitTime) : "未出场"} / ${exitPrice}</span>
      </td>
      <td>${holdingTime}</td>
      <td>${escapeHtml(trade.volume)}</td>
      <td>
        <span class="cell-title">止损 ${formatNumber(trade.stopLoss)}</span>
        <span class="cell-sub">止盈 ${formatNumber(trade.takeProfit)}</span>
      </td>
      <td><span class="${ratioClass}">${ratio}</span></td>
      <td>${screenshot}</td>
      <td>${trade.review ? formatMultiline(trade.review) : '<span class="cell-sub">待复盘</span>'}</td>
      <td>
        <div class="row-actions">
          <button type="button" data-action="edit" data-id="${escapeAttribute(trade.id)}">编辑</button>
          <button type="button" data-action="delete" data-id="${escapeAttribute(trade.id)}">删除</button>
        </div>
      </td>
    </tr>
  `;
}

function renderStats() {
  const openCount = trades.filter((trade) => !trade.exitTime).length;
  const completedCount = trades.length - openCount;

  totalTrades.textContent = String(trades.length);
  openTrades.textContent = String(openCount);
  completedTrades.textContent = String(completedCount);

  const ratios = trades
    .map(calculateRiskRewardValue)
    .filter((ratio) => Number.isFinite(ratio));

  if (!ratios.length) {
    avgRatio.textContent = "--";
    return;
  }

  const average = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
  avgRatio.textContent = `1:${average.toFixed(2)}`;
}

function calculateRiskReward(trade) {
  const ratio = calculateRiskRewardValue(trade);

  if (!Number.isFinite(ratio)) {
    return "--";
  }

  return `1:${ratio.toFixed(2)}`;
}

function calculateRiskRewardValue(trade) {
  const entry = Number(trade.entryPrice);
  const stopLoss = Number(trade.stopLoss);
  const takeProfit = Number(trade.takeProfit);
  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(takeProfit - entry);

  if (!risk || !Number.isFinite(risk) || !Number.isFinite(reward)) {
    return NaN;
  }

  return reward / risk;
}

function formatHoldingTime(entryTime, exitTime) {
  if (!entryTime || !exitTime) {
    return "持仓中";
  }

  const diff = new Date(exitTime).getTime() - new Date(entryTime).getTime();

  if (!Number.isFinite(diff) || diff < 0) {
    return "时间有误";
  }

  const minutes = Math.floor(diff / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const remainingMinutes = minutes % 60;
  const parts = [];

  if (days) {
    parts.push(`${days}天`);
  }

  if (hours) {
    parts.push(`${hours}小时`);
  }

  if (remainingMinutes || !parts.length) {
    parts.push(`${remainingMinutes}分钟`);
  }

  return parts.join(" ");
}

function formatDateTime(value) {
  if (!value) {
    return "--";
  }

  return value.replace("T", " ");
}

function formatNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "--";
  }

  return number.toLocaleString("zh-CN", {
    maximumFractionDigits: 4
  });
}

function formatMultiline(value) {
  return escapeHtml(value).replaceAll("\n", "<br>");
}

function showScreenshotPreview() {
  const hasScreenshot = Boolean(screenshotDraft.data);

  screenshotPreview.hidden = !hasScreenshot;
  previewImage.src = hasScreenshot ? screenshotDraft.data : "";
  previewName.textContent = screenshotDraft.name || "已上传截图";
}

function loadTrades() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("读取交易记录失败：", error);
    return [];
  }
}

function saveTrades() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  } catch (error) {
    alert("保存失败：浏览器本地存储空间可能已满，请尝试删除较大的截图。");
    console.error("保存交易记录失败：", error);
  }
}

function createId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getValue(id) {
  return document.querySelector(`#${id}`).value.trim();
}

function getNumber(id) {
  return Number(document.querySelector(`#${id}`).value);
}

function getOptionalNumber(id) {
  const value = document.querySelector(`#${id}`).value;
  return value === "" ? null : Number(value);
}

function setValue(id, value) {
  document.querySelector(`#${id}`).value = value;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
