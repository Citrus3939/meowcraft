const storageKey = "meowCraftOrders";

const demoOrder = {
  id: "MC-20260603-001",
  nickname: "Demo",
  contact: "",
  character: "甜粉双马尾角色",
  series: "示例作品",
  budget: "¥300 - ¥600",
  services: ["假毛造型", "发包", "配件固定"],
  deadline: "2026-07-20",
  notes: "示例订单，用于演示查询效果。",
  statusIndex: 3,
  createdAt: "2026-06-03",
};

const statuses = [
  "已提交需求",
  "等待报价",
  "已确认定金",
  "排期中",
  "制作中",
  "拍照确认",
  "待尾款",
  "已发货",
  "已完成",
];

const orderForm = document.querySelector("#orderForm");
const trackForm = document.querySelector("#trackForm");
const submissionResult = document.querySelector("#submissionResult");
const trackResult = document.querySelector("#trackResult");

function loadOrders() {
  try {
    const savedOrders = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const hasDemo = savedOrders.some((order) => order.id === demoOrder.id);
    return hasDemo ? savedOrders : [demoOrder, ...savedOrders];
  } catch {
    return [demoOrder];
  }
}

function saveOrders(orders) {
  const customOrders = orders.filter((order) => order.id !== demoOrder.id);
  localStorage.setItem(storageKey, JSON.stringify(customOrders));
}

function buildOrderId() {
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const randomPart = String(Math.floor(Math.random() * 900) + 100);
  return `MC-${datePart}-${randomPart}`;
}

function getCheckedServices(formData) {
  return formData.getAll("services").filter(Boolean);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderOrder(order) {
  const activeStatus = statuses[order.statusIndex] || statuses[0];
  const services = order.services?.length ? order.services.join("、") : "待沟通";

  trackResult.innerHTML = `
    <span class="status-pill">${escapeHtml(activeStatus)}</span>
    <h3>${escapeHtml(order.id)} · ${escapeHtml(order.character)}</h3>
    <p>昵称：${escapeHtml(order.nickname || "未填写")}</p>
    <p>作品：${escapeHtml(order.series || "未填写")}</p>
    <p>定制内容：${escapeHtml(services)}</p>
    <p>预算：${escapeHtml(order.budget || "待报价")}；希望收到日期：${escapeHtml(order.deadline || "待沟通")}</p>
    <ol class="progress-list">
      ${statuses
        .map((status, index) => `<li class="${index <= order.statusIndex ? "" : "pending"}">${escapeHtml(status)}</li>`)
        .join("")}
    </ol>
  `;
}

orderForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(orderForm);
  const services = getCheckedServices(formData);

  if (!services.length) {
    submissionResult.hidden = false;
    submissionResult.innerHTML = "<strong>请选择至少一项需要的服务。</strong>";
    return;
  }

  const order = {
    id: buildOrderId(),
    nickname: formData.get("nickname"),
    contact: formData.get("contact"),
    character: formData.get("character"),
    series: formData.get("series"),
    budget: formData.get("budget"),
    services,
    deadline: formData.get("deadline"),
    notes: formData.get("notes"),
    statusIndex: 0,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);

  submissionResult.hidden = false;
  submissionResult.innerHTML = `
    <strong>定制申请已生成！</strong>
    <p>你的模拟订单号是：<strong>${escapeHtml(order.id)}</strong></p>
    <p>当前 Demo 已把订单保存在本机浏览器。正式上线时可接入后台、邮箱或表格收集。</p>
  `;

  trackForm.orderId.value = order.id;
  renderOrder(order);
  orderForm.reset();
  submissionResult.scrollIntoView({ behavior: "smooth", block: "center" });
});

trackForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const orderId = new FormData(trackForm).get("orderId")?.trim().toUpperCase();
  const order = loadOrders().find((item) => item.id.toUpperCase() === orderId);

  if (!order) {
    trackResult.innerHTML = `
      <strong>没有找到这个订单。</strong>
      <p>请检查订单号是否正确，或提交一个新的定制申请生成模拟订单。</p>
    `;
    return;
  }

  renderOrder(order);
});
