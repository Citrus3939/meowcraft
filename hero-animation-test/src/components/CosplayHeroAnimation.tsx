import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type AnimationStage = "floating" | "forming" | "breathing" | "hair" | "reveal";

type Particle = {
  word: string;
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  rotation: number;
  stretch: number;
  letterSpacing: number;
  hairDX: number;
  hairDY: number;
};

type LoadedImage = {
  image: HTMLImageElement;
  ok: boolean;
};

type Props = {
  avatarSilhouetteSrc: string;
  wigPhotoSrc: string;
  words?: string[];
  particleCount?: number;
};

const DEFAULT_WORDS = [
  "Miku",
  "Cosplay",
  "Wig",
  "Custom",
  "Handmade",
  "Anime",
  "Styling",
  "Twin Tails",
  "Vocaloid",
  "Commission",
  "Craft",
  "Fiber",
  "Character",
  "Kawaii",
  "Stage",
  "Identity",
  "Silhouette",
  "Performance",
  "Studio",
  "Detail",
];

const random = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function loadImage(src: string): Promise<LoadedImage> {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve({ image, ok: true });
    image.onerror = () => resolve({ image, ok: false });
    image.src = src;
  });
}

function createParticles(count: number, width: number, height: number, words: string[]): Particle[] {
  return Array.from({ length: count }, (_, index) => {
    const x = random(-width * 0.1, width * 1.1);
    const y = random(-height * 0.1, height * 1.1);
    const size = random(12, 32);
    const alpha = random(0.22, 0.84);

    return {
      word: words[index % words.length],
      x,
      y,
      startX: x,
      startY: y,
      targetX: x,
      targetY: y,
      vx: random(-0.12, 0.12),
      vy: random(-0.1, 0.1),
      size,
      alpha,
      baseAlpha: alpha,
      rotation: random(-0.08, 0.08),
      stretch: 1,
      letterSpacing: 0,
      hairDX: random(-180, 180),
      hairDY: random(80, 260),
    };
  });
}

function makeFallbackAvatarPoints(count: number, width: number, height: number): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  const centerX = width * 0.5;
  const centerY = height * 0.48;
  const scale = Math.min(width, height) * 0.26;

  for (let i = 0; i < count * 8; i += 1) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random());
    const faceX = Math.cos(t) * scale * 0.72 * r;
    const faceY = Math.sin(t) * scale * 0.78 * r;
    const twin = Math.random();
    let x = centerX + faceX;
    let y = centerY + faceY;

    if (twin < 0.35) {
      x = centerX - scale * 1.1 + Math.cos(t) * scale * 0.55 * r;
      y = centerY + scale * 0.16 + Math.sin(t) * scale * 1.1 * r;
    } else if (twin < 0.7) {
      x = centerX + scale * 1.1 + Math.cos(t) * scale * 0.55 * r;
      y = centerY + scale * 0.16 + Math.sin(t) * scale * 1.1 * r;
    }

    points.push({ x, y });
  }

  return points.slice(0, count);
}

function sampleOpaquePixels(
  image: HTMLImageElement,
  count: number,
  width: number,
  height: number,
): Array<{ x: number; y: number }> {
  const offscreen = document.createElement("canvas");
  const maxSide = 420;
  const ratio = image.naturalWidth / image.naturalHeight;
  offscreen.width = ratio >= 1 ? maxSide : Math.round(maxSide * ratio);
  offscreen.height = ratio >= 1 ? Math.round(maxSide / ratio) : maxSide;

  const context = offscreen.getContext("2d", { willReadFrequently: true });
  if (!context) return makeFallbackAvatarPoints(count, width, height);

  context.clearRect(0, 0, offscreen.width, offscreen.height);
  context.drawImage(image, 0, 0, offscreen.width, offscreen.height);

  const pixels = context.getImageData(0, 0, offscreen.width, offscreen.height).data;
  const candidates: Array<{ x: number; y: number }> = [];
  const step = Math.max(2, Math.floor(Math.sqrt((offscreen.width * offscreen.height) / (count * 16))));

  for (let y = 0; y < offscreen.height; y += step) {
    for (let x = 0; x < offscreen.width; x += step) {
      const alpha = pixels[(y * offscreen.width + x) * 4 + 3];
      if (alpha > 32) candidates.push({ x, y });
    }
  }

  if (candidates.length < count * 0.3) return makeFallbackAvatarPoints(count, width, height);

  const bounds = candidates.reduce(
    (acc, point) => ({
      minX: Math.min(acc.minX, point.x),
      minY: Math.min(acc.minY, point.y),
      maxX: Math.max(acc.maxX, point.x),
      maxY: Math.max(acc.maxY, point.y),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );

  const sourceW = bounds.maxX - bounds.minX || 1;
  const sourceH = bounds.maxY - bounds.minY || 1;
  const targetW = Math.min(width * 0.72, height * 0.72 * (sourceW / sourceH));
  const targetH = targetW / (sourceW / sourceH);
  const offsetX = width * 0.5 - targetW * 0.5;
  const offsetY = height * 0.48 - targetH * 0.5;

  const points: Array<{ x: number; y: number }> = [];
  const stride = Math.max(1, Math.floor(candidates.length / count));
  const shuffledStart = Math.floor(Math.random() * stride);

  for (let i = shuffledStart; points.length < count; i += stride) {
    const point = candidates[i % candidates.length];
    points.push({
      x: offsetX + ((point.x - bounds.minX) / sourceW) * targetW,
      y: offsetY + ((point.y - bounds.minY) / sourceH) * targetH,
    });
  }

  return points;
}

function drawTextWithLetterSpacing(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
) {
  if (spacing <= 0.2) {
    context.fillText(text, x, y);
    return;
  }

  let cursor = x;
  for (const char of text) {
    context.fillText(char, cursor, y);
    cursor += context.measureText(char).width + spacing;
  }
}

export function CosplayHeroAnimation({
  avatarSilhouetteSrc,
  wigPhotoSrc,
  words = DEFAULT_WORDS,
  particleCount = 360,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const stageRef = useRef<AnimationStage>("floating");
  const assetsRef = useRef<{ avatar: LoadedImage | null; wig: LoadedImage | null }>({ avatar: null, wig: null });
  const pointerRef = useRef({ x: 0, y: 0 });
  const breathRef = useRef({ scale: 1 });
  const maskRef = useRef({ progress: 0 });
  const [stageLabel, setStageLabel] = useState("Lexicon drift");
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [customWig, setCustomWig] = useState<string | null>(null);

  const activeAvatarSrc = customAvatar ?? avatarSilhouetteSrc;
  const activeWigSrc = customWig ?? wigPhotoSrc;

  const draw = useCallback((delta: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const particles = particlesRef.current;
    const stage = stageRef.current;
    const pointerX = pointerRef.current.x * 18;
    const pointerY = pointerRef.current.y * 14;

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#050711";
    context.fillRect(0, 0, width, height);

    const gradient = context.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.45, width * 0.8);
    gradient.addColorStop(0, "rgba(72, 228, 255, 0.20)");
    gradient.addColorStop(0.4, "rgba(147, 102, 255, 0.10)");
    gradient.addColorStop(1, "rgba(5, 7, 17, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.scale(breathRef.current.scale, breathRef.current.scale);
    context.translate(-width * 0.5, -height * 0.5);

    for (const particle of particles) {
      if (stage === "floating") {
        particle.x += particle.vx * delta * 0.06;
        particle.y += particle.vy * delta * 0.06;
        if (particle.x < -120) particle.x = width + 120;
        if (particle.x > width + 120) particle.x = -120;
        if (particle.y < -80) particle.y = height + 80;
        if (particle.y > height + 80) particle.y = -80;
      }

      if (stage === "breathing") {
        particle.x += Math.sin(performance.now() * 0.0007 + particle.startX) * 0.012 * delta;
        particle.y += Math.cos(performance.now() * 0.0006 + particle.startY) * 0.012 * delta;
      }

      context.save();
      context.globalAlpha = clamp(particle.alpha, 0, 1);
      context.translate(particle.x + pointerX * (particle.size / 34), particle.y + pointerY * (particle.size / 34));
      context.rotate(particle.rotation);
      context.scale(particle.stretch, 1);
      context.font = `${particle.size}px Inter, ui-sans-serif, system-ui`;
      context.fillStyle = stage === "hair" ? "rgba(140, 245, 255, 0.72)" : "rgba(220, 252, 255, 0.88)";
      context.shadowColor = "rgba(0, 212, 255, 0.32)";
      context.shadowBlur = stage === "floating" ? 10 : 4;
      drawTextWithLetterSpacing(context, particle.word, 0, 0, particle.letterSpacing);
      context.restore();
    }

    context.restore();

    if (stage === "hair" || stage === "reveal") {
      context.save();
      context.globalCompositeOperation = "lighter";
      context.strokeStyle = `rgba(112, 230, 255, ${stage === "hair" ? 0.22 : 0.12})`;
      context.lineWidth = 1;
      for (let i = 0; i < 36; i += 1) {
        const t = i / 35;
        const startX = width * (0.18 + t * 0.64);
        const startY = height * 0.28 + Math.sin(t * Math.PI * 4) * 28;
        context.beginPath();
        context.moveTo(startX, startY);
        context.bezierCurveTo(
          startX - 90,
          height * 0.44,
          startX + 110,
          height * 0.72,
          startX + Math.sin(t * Math.PI) * 90,
          height * 0.92,
        );
        context.stroke();
      }
      context.restore();
    }

    if (stage === "reveal") {
      const wig = assetsRef.current.wig;
      const progress = maskRef.current.progress;
      context.save();
      context.globalAlpha = progress;
      context.beginPath();
      context.ellipse(width * 0.5, height * 0.5, width * (0.08 + progress * 0.55), height * (0.08 + progress * 0.5), 0, 0, Math.PI * 2);
      context.clip();

      if (wig?.ok) {
        const ratio = wig.image.naturalWidth / wig.image.naturalHeight;
        const drawH = height * 0.82;
        const drawW = drawH * ratio;
        context.drawImage(wig.image, width * 0.5 - drawW * 0.5, height * 0.5 - drawH * 0.5, drawW, drawH);
      } else {
        const fallback = context.createLinearGradient(width * 0.2, height * 0.2, width * 0.8, height * 0.8);
        fallback.addColorStop(0, "#8ff7ff");
        fallback.addColorStop(0.5, "#62d8e4");
        fallback.addColorStop(1, "#26364c");
        context.fillStyle = fallback;
        context.fillRect(width * 0.18, height * 0.16, width * 0.64, height * 0.72);
      }
      context.restore();
    }
  }, []);

  useEffect(() => {
    let disposed = false;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      const context = canvas.getContext("2d");
      context?.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = createParticles(
        window.innerWidth < 720 ? Math.floor(particleCount * 0.58) : particleCount,
        rect.width,
        rect.height,
        words,
      );
    };

    resize();
    window.addEventListener("resize", resize);

    Promise.all([loadImage(activeAvatarSrc), loadImage(activeWigSrc)]).then(([avatar, wig]) => {
      if (disposed) return;
      assetsRef.current = { avatar, wig };
    });

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerRef.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    let last = performance.now();
    const tick = (time: number) => {
      if (document.hidden) {
        animationFrameRef.current = requestAnimationFrame(tick);
        last = time;
        return;
      }

      const delta = Math.min(time - last, 48);
      last = time;
      draw(delta);
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    const timeline = gsap.timeline({ delay: 3 });
    const startFormation = () => {
      const rect = canvas.getBoundingClientRect();
      const avatar = assetsRef.current.avatar;
      const targets = avatar?.ok
        ? sampleOpaquePixels(avatar.image, particlesRef.current.length, rect.width, rect.height)
        : makeFallbackAvatarPoints(particlesRef.current.length, rect.width, rect.height);
      const maxDistance = Math.hypot(rect.width, rect.height);
      stageRef.current = "forming";
      setStageLabel("Magnetic assemble");

      particlesRef.current.forEach((particle, index) => {
        const target = targets[index % targets.length];
        particle.targetX = target.x;
        particle.targetY = target.y;
        const distance = Math.hypot(particle.x - target.x, particle.y - target.y);
        const normalized = distance / maxDistance;
        gsap.to(particle, {
          x: target.x,
          y: target.y,
          alpha: clamp(particle.baseAlpha + 0.22, 0.35, 0.95),
          rotation: random(-0.025, 0.025),
          duration: 1.35 + (1 - normalized) * 0.95,
          ease: "power3.out",
          delay: normalized * 0.12,
        });
      });
    };

    timeline
      .call(startFormation)
      .to(
        breathRef.current,
        {
          scale: 1.02,
          duration: 1.1,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
          onStart: () => {
            stageRef.current = "breathing";
            setStageLabel("Avatar breath");
          },
        },
        "+=2.35",
      )
      .call(() => {
        stageRef.current = "hair";
        setStageLabel("Text to fiber");
        particlesRef.current.forEach((particle) => {
          const direction = particle.x < canvas.getBoundingClientRect().width * 0.5 ? -1 : 1;
          gsap.to(particle, {
            x: particle.x + direction * random(80, 240),
            y: particle.y + random(70, 260),
            alpha: random(0.1, 0.42),
            stretch: random(1.8, 3.4),
            letterSpacing: random(2, 7),
            rotation: direction * random(0.18, 0.5),
            duration: random(1.2, 2.2),
            ease: "power2.inOut",
          });
        });
      }, undefined, "+=2")
      .to(maskRef.current, {
        progress: 1,
        duration: 1.5,
        ease: "power2.inOut",
        onStart: () => {
          stageRef.current = "reveal";
          setStageLabel("Final wig reveal");
        },
      });

    const handleVisibility = () => {
      if (document.hidden) {
        timeline.pause();
        gsap.globalTimeline.pause();
      } else {
        gsap.globalTimeline.resume();
        timeline.resume();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      disposed = true;
      timeline.kill();
      gsap.killTweensOf(particlesRef.current);
      gsap.killTweensOf(breathRef.current);
      gsap.killTweensOf(maskRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (customAvatar) URL.revokeObjectURL(customAvatar);
      if (customWig) URL.revokeObjectURL(customWig);
    };
  }, [activeAvatarSrc, activeWigSrc, customAvatar, customWig, draw, particleCount, words]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "wig") => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "avatar") setCustomAvatar(url);
    if (type === "wig") setCustomWig(url);
  };

  return (
    <section className="cosplay-hero" aria-label="Cosplay custom wig animated hero">
      <canvas ref={canvasRef} className="cosplay-hero__canvas" />
      <div className="cosplay-hero__overlay">
        <p className="cosplay-hero__kicker">Custom character identity studio</p>
        <h1>Words become wigs.</h1>
        <p>
          A React, TypeScript, GSAP and Canvas prototype for Shopify hero storytelling.
        </p>
        <div className="cosplay-hero__status" aria-live="polite">
          {stageLabel}
        </div>
        <div className="cosplay-hero__uploads" aria-label="Demo asset upload controls">
          <label>
            Avatar PNG
            <input accept="image/png,image/webp,image/jpeg" type="file" onChange={(event) => handleUpload(event, "avatar")} />
          </label>
          <label>
            Wig PNG
            <input accept="image/png,image/webp,image/jpeg" type="file" onChange={(event) => handleUpload(event, "wig")} />
          </label>
        </div>
      </div>
    </section>
  );
}
