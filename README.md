# travisbarton.com

Static personal website for Travis Barton.

## V1 structure

- `index.html`: homepage with three featured areas
  - Bird photos
  - Cool tech projects and blogs
  - Nail art
- `ros2-robot.html`: robot project page
- `friction-removal-agent-platforms.html`: essay page
- `styles.css`: shared site styles
- `script.js`: minimal section-nav highlighting

## Content notes

- The homepage is intentionally plain and fast: no build tooling, no framework, minimal JavaScript.
- Bird and nail sections currently use explicit placeholders.
- To replace a placeholder, keep the existing `<figure>` and swap the `.placeholder-frame` block for an `<img>` tag.
- Placeholder paths in the cards show the intended file locations for future assets.

## Deploy

This repo is ready to deploy as a static site to GitHub Pages or any static host.
