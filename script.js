const consultationForm = document.querySelector("#consultationForm");
const toast = document.querySelector("#toast");
const heroVideo = document.querySelector(".hero-video");
const videoFrame = document.querySelector(".video-frame");
const backToTop = document.querySelector("#backToTop");
const slideTextSelector = [
  ".hero-lead",
  ".section-header > p:not(.eyebrow)",
  ".feature-card p",
  ".work-card > p",
  ".process-list p",
  ".tier-card > p:not(.tier-label)",
  ".workshop-card > p",
  ".testimonial-card > p",
  ".faq-list details > p",
  ".consultation-layout > div > p:not(.eyebrow)",
  ".form-note",
  ".footer-grid > p",
  ".contact-note",
].join(",");

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

function setupSlideTextAnimations() {
  const slideTextItems = [...document.querySelectorAll(slideTextSelector)];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!slideTextItems.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    slideTextItems.forEach((item) => {
      item.classList.add("slide-copy", "is-slide-visible");
    });
    return;
  }

  slideTextItems.forEach((item, index) => {
    item.classList.add("slide-copy");
    item.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const item = entry.target;

        if (entry.isIntersecting) {
          item.classList.add("is-slide-visible");
          item.classList.remove("is-slide-out");
          return;
        }

        item.classList.remove("is-slide-visible");

        if (entry.boundingClientRect.top < 0) {
          item.classList.add("is-slide-out");
        } else {
          item.classList.remove("is-slide-out");
        }
      });
    },
    {
      threshold: 0.22,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  slideTextItems.forEach((item) => observer.observe(item));
}

setupSlideTextAnimations();
