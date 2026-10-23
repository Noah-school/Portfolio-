# Portfolio

Personal portfolio site for Noah Verstraeten, live at <https://portfolio.xenophon.be>. 

Built with [Astro](https://astro.build): a landing page with an interactive project card fan, project write-ups, a blog with RSS, and a printable Resume.

## Getting started

Requires Node.js (the Docker image uses Node 26).

You can view and build the project with these commands:
```sh
npm install
npm run dev       
npm run build     
npm run preview
```

## Project layout

| Path | Contents |
| --- | --- |
| `src/pages/` | Routes: home, CV, blog, project pages, RSS feed |
| `src/content/projects/` | Project write-ups (Markdown) |
| `src/content/blog/` | Blog posts (Markdown) |
| `src/content.config.ts` | Content collection schemas |
| `src/components/` | UI components, including the card fan (`CardFan.astro`, `cards.js`) |
| `src/data/cv.json` | CV data rendered by `src/pages/cv.astro` |
| `src/layouts/` | Base and article layouts |
| `public/` | Static assets (favicons, card art, resume PDF) |

## Adding content

- **Project:** add a Markdown file to `src/content/projects/`.
- **Blog post:** add a Markdown file to `src/content/blog/`.

Frontmatter must match the schemas in `src/content.config.ts`.

## Print Resume PDF

```sh
npm run pdf
```

Builds the site, serves it, and prints `/cv/` to `public/Noah-Verstraeten-Resume.pdf` using Puppeteer. It expects Chrome at `/usr/bin/google-chrome`; set `CHROME` to use another binary.

## Deployment

The `Dockerfile` builds the site in a Node image and serves `dist/` with nginx (config in `nginx.conf`).

```sh
docker compose up -d --build
```
