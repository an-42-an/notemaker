# Notes App

A lightweight browser-based notes app built using plain HTML, CSS, and JavaScript.

Features:
- Nested notes (tree structure)
- Markdown rendering
- LaTeX math support (KaTeX)
- Paste images directly from clipboard
- Import and export notes as JSON
- Fully client-side (no backend)

---

## Important Notes

1. **Enable “Ask where to save each file” in your browser settings**  

   This makes the export (Save to File) feature work more smoothly.

2. **Do not put images/links and markdown inside the same note**  

   Keep them in separate notes for best rendering and consistent behavior.

3. **Double-clicking a currently editing note takes it back to previous version** 

   This is the only way to undo.

---

## How to Use

- Double-click a note to edit it.
- Paste images directly with Ctrl+V.
- Type Markdown within `~ ... ~` and LaTex within `~ $ ... $ ~`
- Use the buttons to add siblings, add children, expand/collapse, or delete.
- Export notes to a `.json` file.
- Import the `.json` file later to restore your notes.

---

## Tech Used

- HTML, CSS, JavaScript
- Marked.js for Markdown
- KaTeX for LaTeX math rendering

