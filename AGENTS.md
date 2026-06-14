# AGENTS.md

## Cursor Cloud specific instructions

### Current state of `main`

As of this writing, the `main` branch is a **placeholder**: it contains only `README.md`
and no application code, dependency manifests (no `package.json`, `requirements.txt`,
`pyproject.toml`, etc.), build system, services, or databases. There is nothing to
install, build, run, or test on `main`.

Because there is no application on `main`:

- There is **no dev server / app to run** and **no automated tests / lint** to execute.
- The update script is intentionally a no-op until real code (and a dependency manifest)
  lands on `main`.

### Where the real work lives

Actual product prototypes currently live in unmerged `origin/cursor/*` feature branches
(e.g. static landing-page sites, a trading journal, a Vite/React hero-animation prototype,
Python report scripts, a Pine Script strategy). Only check those out if explicitly asked.
When one of them is merged into `main`, revisit setup:

- A Vite/React prototype (in a nested folder) uses **npm** — run `npm install` then
  `npm run dev` inside that folder.
- The plain static sites just need any static file server (e.g. `python3 -m http.server`)
  or opening `index.html` directly.
- The Python scripts need `pip install openpyxl`.

### Toolchain available in the environment

Node `v22.x`, npm `10.x`, Python `3.12`, and git are preinstalled, so most future
frontend/Python work needs no extra system setup.
