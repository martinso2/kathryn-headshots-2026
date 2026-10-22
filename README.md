# Kathryn — Headshots

Proof gallery for Kathryn’s portraits, photographed by Harry Martin Photography on October 21, 2026.

The page is plain HTML styled with Tailwind. Colors and type follow the KMC Art Advisory board in `style-guide/style-1.png`: signature blue, warm ivory, soft stone, charcoal, and muted blue.

## Open the gallery

From this folder:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Set `PORT` if 3000 is already in use:

```bash
PORT=3001 npm run dev
```

## Choosing portraits

Each frame shows its filename underneath, with a checkbox beside the name.

- Checked portraits pick up a blue border, and the count at the top updates.
- **Selected** hides everything that is not checked.
- **Copy names** copies the checked filenames to the clipboard so they can be pasted into a message and sent to Harry.
- **Clear** asks once, then drops the selection.
- Double-click a portrait to open it larger. Control-click or right-click an image to save or share it. Arrow keys move between frames in the large view. The checkbox there is the same selection.

Choices are saved in this browser, so a refresh keeps them.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Gallery page |
| `gallery.js` | Selection, filter, and viewer |
| `globals.css` | Tailwind theme and brand colors |
| `styles.css` | Compiled CSS the page loads |
| `server.js` | Local static server |
| `images/` | The 32 proofs |

## Rebuild the CSS

`styles.css` is already built. After changing classes in `index.html` or `gallery.js`, rebuild it:

```bash
npm install
npm run build:css
```
