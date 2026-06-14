const consultationForm = document.querySelector("#consultationForm");
const toast = document.querySelector("#toast");
const heroVideo = document.querySelector(".hero-video");
const videoFrame = document.querySelector(".video-frame");
const backToTop = document.querySelector("#backToTop");
const galleryLightbox = document.querySelector("#galleryLightbox");
const lightboxGrid = document.querySelector("#lightboxGrid");
const lightboxClose = document.querySelector(".lightbox-close");
const galleryButtons = [...document.querySelectorAll(".work-photo[data-gallery]")];

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

function closeGalleryLightbox() {
  if (!galleryLightbox || !lightboxGrid) return;

  galleryLightbox.hidden = true;
  lightboxGrid.replaceChildren();
  document.body.classList.remove("is-lightbox-open");
}

function openGalleryLightbox(galleryId) {
  if (!galleryLightbox || !lightboxGrid || !galleryId) return;

  const images = [1, 2, 3, 4].map((index) => {
    const image = document.createElement("img");
    image.src = `assets/split/${galleryId}-${index}.jpg`;
    image.alt = `作品 ${galleryId} 造型 ${index}`;
    image.loading = "lazy";
    return image;
  });

  lightboxGrid.replaceChildren(...images);
  galleryLightbox.hidden = false;
  document.body.classList.add("is-lightbox-open");
  lightboxClose?.focus();
}

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.getAttribute("aria-hidden") === "true") return;
    openGalleryLightbox(button.dataset.gallery);
  });
});

lightboxClose?.addEventListener("click", closeGalleryLightbox);

galleryLightbox?.addEventListener("click", (event) => {
  if (event.target === galleryLightbox) {
    closeGalleryLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && galleryLightbox && !galleryLightbox.hidden) {
    closeGalleryLightbox();
  }
});

const tiltCards = [...document.querySelectorAll(".work-photo")];
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const MAX_TILT = 6;

function handleTiltMove(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * -MAX_TILT;
  const rotateY = ((x - centerX) / centerX) * MAX_TILT;

  card.style.transform =
    `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
}

function handleTiltLeave(event) {
  event.currentTarget.style.transform = "";
}

function applyTiltBindings() {
  const enableTilt = finePointer.matches && !reducedMotion.matches;

  tiltCards.forEach((card) => {
    card.removeEventListener("mousemove", handleTiltMove);
    card.removeEventListener("mouseleave", handleTiltLeave);
    card.style.transform = "";

    if (enableTilt) {
      card.addEventListener("mousemove", handleTiltMove);
      card.addEventListener("mouseleave", handleTiltLeave);
    }
  });
}

applyTiltBindings();
finePointer.addEventListener?.("change", applyTiltBindings);
reducedMotion.addEventListener?.("change", applyTiltBindings);
