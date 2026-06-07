const consultationForm = document.querySelector("#consultationForm");
const toast = document.querySelector("#toast");
const heroVideo = document.querySelector(".hero-video");
const videoFrame = document.querySelector(".video-frame");
const backToTop = document.querySelector("#backToTop");
const whatLayout = document.querySelector(".what-layout");
const craftSteps = [...document.querySelectorAll(".craft-story-steps li")];
const carouselSlides = [...document.querySelectorAll(".carousel-slide")];
const carouselDots = [...document.querySelectorAll(".carousel-dots span")];
const carouselButtons = [...document.querySelectorAll("[data-carousel-action]")];

let activeCarouselIndex = 0;

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

function setCarouselStage(index) {
  if (!carouselSlides.length) return;

  const nextIndex = (index + carouselSlides.length) % carouselSlides.length;
  activeCarouselIndex = nextIndex;

  carouselSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === nextIndex);
  });

  carouselDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === nextIndex);
  });

  craftSteps.forEach((step, stepIndex) => {
    step.classList.toggle("is-active", stepIndex === nextIndex);
  });
}

function setupCraftStory() {
  if (!whatLayout || !carouselSlides.length || !craftSteps.length) return;

  setCarouselStage(0);

  craftSteps.forEach((step) => {
    step.querySelector("button")?.addEventListener("click", () => {
      setCarouselStage(Number(step.dataset.stage || 0));
    });
  });

  carouselButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.carouselAction === "next" ? 1 : -1;
      setCarouselStage(activeCarouselIndex + direction);
    });
  });

  if (!("IntersectionObserver" in window)) {
    whatLayout.classList.add("is-visible");
    return;
  }

  const layoutObserver = new IntersectionObserver(
    ([entry]) => {
      whatLayout.classList.toggle("is-visible", entry.isIntersecting);
    },
    { threshold: 0.18 },
  );

  layoutObserver.observe(whatLayout);

  const stepObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      setCarouselStage(Number(visibleEntry.target.dataset.stage || 0));
    },
    {
      threshold: [0.35, 0.6, 0.85],
      rootMargin: "-18% 0px -42% 0px",
    },
  );

  craftSteps.forEach((step) => stepObserver.observe(step));
}

setupCraftStory();
