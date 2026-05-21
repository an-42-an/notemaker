document.addEventListener("keydown", e => {
    // Tab inside editable note
    if (e.key === "Tab" && document.activeElement?.isContentEditable) {
        e.preventDefault();
        document.execCommand("insertText", false, "    ");
        return;
    }

    if (!selectedNote) return;

    // add child (Ctrl+Shift+Enter)
    if (e.ctrlKey && e.shiftKey && !e.altKey && e.key === "Enter") {
        e.preventDefault();
        selectedNote.querySelector(".add-child").click();
    }

    // add sibling (Ctrl+Alt+Enter)
    if (e.ctrlKey && !e.shiftKey && e.altKey && e.key === "Enter") {
        e.preventDefault();
        selectedNote.querySelector(".add-sibling").click();
    }

    // add after (Ctrl+Enter)
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key === "Enter") {
        e.preventDefault();
        selectedNote.querySelector(".add-after").click();
    }

    // delete (Ctrl+Delete)
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key === "Delete") {
        e.preventDefault();
        selectedNote.querySelector(".delete-note").click();
        selectedNote = null;
    }

    // expand/collapse (Ctrl+Space)
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key === " ") {
        e.preventDefault();
        selectedNote.querySelector(".expand-btn")?.click();
    }

    // toggle sidebar (Ctrl+Shift+Space)
    if (e.ctrlKey && e.shiftKey && !e.altKey && e.key === " ") {
        e.preventDefault();
        selectedNote.querySelector(".toggle-single")?.click();
    }

    // toggle links (Ctrl+Alt+Space)
    if (e.ctrlKey && !e.shiftKey && e.altKey && e.key === " ") {
        e.preventDefault();
        selectedNote.querySelector(".toggle-links").click();
    }

    // add link (Ctrl+Shift+'+')
    if (e.ctrlKey && e.shiftKey && !e.altKey && e.key === "+") {
        e.preventDefault();
        selectedNote.querySelector(".add-link").click();
    }

    // delete link (Ctrl+Shift+'-')
    if (e.ctrlKey && e.shiftKey && !e.altKey && e.code === "Minus") {
        // key==- doesnt work, reduces zoom only
        e.preventDefault();
        selectedNote.querySelector(".remove-link").click();
    }

    // Down
    if (!e.ctrlKey && e.key === "ArrowDown") {
        const next = getNextSibling(selectedNote);
        if (next) selectNote(next);
    }

    // Up
    if (!e.ctrlKey && e.key === "ArrowUp") {
        const prev = getPrevSibling(selectedNote);
        if (prev) selectNote(prev);
    }

    // Right : first child
    if (!e.ctrlKey && e.key === "ArrowRight") {
        const child = getFirstChild(selectedNote);
        if (child) selectNote(child);
    }

    // Left : parent
    if (!e.ctrlKey && e.key === "ArrowLeft") {
        const parent = getParentNote(selectedNote);
        if (parent) selectNote(parent);
    }

    // Shift below parent : Ctrl+Left
    if (e.ctrlKey && e.key === "ArrowLeft") {
        moveLeft(selectedNote);
    }

    // Shift inside prev sibling : Ctrl+Right
    if (e.ctrlKey && e.key === "ArrowRight") {
        moveRight(selectedNote);
    }

    // Shift below next sibling : Ctrl+Down
    if (e.ctrlKey && e.key === "ArrowDown") {
        moveDown(selectedNote);
    }
    // Shift above prev sibling : Ctrl+Up
    if (e.ctrlKey && e.key === "ArrowUp") {
        moveUp(selectedNote);
    }
});
