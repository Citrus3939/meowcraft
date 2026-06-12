# Cosplay Wig Hero Animation Prototype

React + TypeScript + GSAP + Canvas 2D prototype for a Shopify homepage hero animation.

## Important: how to preview

`index.html` is a Vite entry file. Opening it directly from the file system will not compile `src/main.tsx`.

Use one of these options:

- For the React + TypeScript version:

  ```bash
  cd hero-animation-test
  npm install
  npm run dev
  ```

- For a direct double-click preview, open:

  ```text
  hero-animation-test/standalone.html
  ```

`standalone.html` uses plain browser JavaScript + Canvas + GSAP CDN so it can run without Vite.

## Run locally

```bash
cd hero-animation-test
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Resource structure

```text
hero-animation-test/
  public/
    assets/
      miku-avatar.png      # transparent PNG silhouette for target sampling
      finished-wig.png     # final wig PNG/JPG for mask reveal
  src/
    components/
      CosplayHeroAnimation.tsx
    styles/
      app.css
    main.tsx
```

The demo runs even if the PNG files are missing:

- Missing avatar PNG falls back to a procedural twin-tail silhouette.
- Missing wig image falls back to a cyan gradient reveal.
- The on-page upload controls can be used to test custom PNG files immediately.

## Animation flow

1. **Lexicon drift**
   - English cosplay words are randomized across the full-screen Canvas.
   - Font size: 12-32px.
   - Opacity is randomized.
   - Slow drifting motion and pointer parallax are applied.

2. **Magnetic assemble**
   - After about 3 seconds, words are attracted to target points.
   - Target points are sampled from non-transparent pixels of `miku-avatar.png`.
   - GSAP animates each word to its point with `power3.out`.
   - Farther particles start with slightly faster travel, then ease into position.

3. **Avatar breath**
   - The formed avatar holds and gently breathes between `0.98` and `1.02` scale.
   - A small amount of text drift remains to keep the silhouette alive.

4. **Text to fiber**
   - Words fade down.
   - Horizontal stretch increases.
   - Letter spacing increases.
   - Particles move along left/right hair-like vectors.
   - Canvas curves are drawn as additional hair strands.

5. **Final wig reveal**
   - A soft elliptical Canvas mask reveals `finished-wig.png`.
   - Transition duration is about 1.5 seconds.

## Performance notes

- React does not re-render every frame.
- All particle state is stored in refs.
- Canvas 2D rendering is driven by `requestAnimationFrame`.
- GSAP only mutates particle numeric properties.
- Canvas is Retina-aware and clamps DPR to 2 for stability.
- Particle count is reduced on mobile.
- The animation pauses GSAP timelines when the tab is hidden.
- The image alpha scan is performed once per loaded avatar image.
- `willReadFrequently` is used for the alpha sampling canvas.

## Shopify integration

Recommended Shopify approach:

1. Build the component as a static bundle:

   ```bash
   npm run build
   ```

2. Upload the generated JS/CSS assets from `dist/assets/` to Shopify theme assets.

3. Add a theme section, for example:

   ```liquid
   <section id="cosplay-hero-root"></section>
   {{ 'cosplay-hero.css' | asset_url | stylesheet_tag }}
   <script type="module" src="{{ 'cosplay-hero.js' | asset_url }}"></script>
   ```

4. In the bundle entry for Shopify, mount the React component into `#cosplay-hero-root`.

5. Store image files in Shopify theme assets or Files and pass the URLs as:

   ```tsx
   <CosplayHeroAnimation
     avatarSilhouetteSrc="{{ 'miku-avatar.png' | asset_url }}"
     wigPhotoSrc="{{ 'finished-wig.png' | asset_url }}"
   />
   ```

If the store uses a strict Content Security Policy, keep images on the same Shopify CDN origin and avoid remote cross-origin assets for alpha sampling.

