const consultationForm = document.querySelector("#consultationForm");
const toast = document.querySelector("#toast");
const heroVideo = document.querySelector(".hero-video");
const videoFrame = document.querySelector(".video-frame");
const backToTop = document.querySelector("#backToTop");

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.hidden = false;

  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.hidden = true;
  }, 5200);
}

consultationForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(consultationForm);
  const character = formData.get("character") || "你的角色";
  const email = formData.get("email");

  showToast(`已生成 ${character} 的定制咨询请求。正式接入 Shopify 后，可将表单内容发送到 ${email}。`);
  consultationForm.reset();
});

heroVideo?.addEventListener("canplay", () => {
  videoFrame?.classList.add("is-video-ready");
});

heroVideo?.addEventListener("error", () => {
  videoFrame?.classList.remove("is-video-ready");
});

function updateBackToTopVisibility() {
  if (!backToTop) return;

  backToTop.classList.toggle("is-visible", window.scrollY > 520);
}

window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
updateBackToTopVisibility();

backToTop?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
