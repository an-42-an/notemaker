# 📖 Notes App

A lightweight browser-based notes app built using plain HTML, CSS, and JavaScript. 

Essentially a glorified text editor with nested notes, image search, and Markdown support.

Features:
- Nested notes (tree structure)
- Markdown rendering
- LaTeX math support (KaTeX)
- Paste images directly from clipboard
- OCR on pasted images (searchable text inside images)
- Full-text search (includes OCR content)
- Import and export notes as JSON
- Fully client-side (no backend, no data leaves your browser)

---

## Important Notes

1. **Enable “Ask where to save each file” in your browser settings** 

   This makes the export (Save to File) feature work smoothly.

2. **Do not put images/links and markdown inside the same note** 

   Keep them in separate notes for consistent rendering.

3. **Double-clicking a currently editing note reverts it to the previous version** 

   This is the only way to undo.

---

## How to Use

- Go to [notemaker](https://an-42-an.github.io/notemaker/dev).
- Click Add New Note to get started.
- Double-click a note to edit it.
- Paste images directly with Ctrl+V.
- Type Markdown within `~ ... ~` and LaTeX within `~ $ ... $ ~`
- Use the ☰ button at the top to toggle all controls.
- Use the ☰ button near each note to toggle all controls of that note.
- Use keyboard shortcuts or the control buttons to
  - Add sibling
  - Add child
  - Expand / collapse
  - Delete note
- Export notes to a `.json` file.
- Import the `.json` file later to restore your notes.

---

## Keyboard shortcuts

### Creation
- **Ctrl + Enter** : Create sibling note under current note
- **Ctrl + Alt + Enter** : Create sibling note above current note
- **Ctrl + Shift + Enter** : Create child note 

### Deletion
- **Ctrl + Delete** : Delete selected note 

### Expand / Toggle
- **Ctrl + Space** : Expand / collapse selected note 
- **Ctrl + Shift + Space** : Toggle note controls (☰)

### Navigation
- **Arrow Up** : Select previous sibling 
- **Arrow Down** : Select next sibling 
- **Arrow Right** : Select first child 
- **Arrow Left** : Select parent 

---

## Tech Used

- HTML, CSS, JavaScript
- Marked.js for Markdown
- KaTeX for LaTeX math rendering
- Tesseract for OCR

