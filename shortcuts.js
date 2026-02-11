document.addEventListener("keydown", e => {
    // Tab inside editable note
    if (e.key === "Tab" && document.activeElement?.isContentEditable) {
        e.preventDefault();
        document.execCommand("insertText", false, "    ");
        return;
    }

    if (!selectedNote) return;

    // create child (Ctrl+Shift+Enter)
    if (e.ctrlKey && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        selectedNote.querySelector(".add-child").click();
    }

    // create sibling (Ctrl+Enter)
    if (e.ctrlKey && !e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        selectedNote.querySelector(".add-sibling").click();
    }

    // delete (Ctrl+Delete)
    if (e.ctrlKey && e.key === "Delete") {
        e.preventDefault();
        selectedNote.querySelector(".delete-note").click();
        selectedNote = null;
    }

    // expand/collapse (Ctrl+Space)
    if (e.ctrlKey && !e.shiftKey && e.key === " ") {
        e.preventDefault();
        selectedNote.querySelector(".expand-btn")?.click();
    }

    // toggle sidebar (Ctrl+Shift+Space)
    if (e.ctrlKey && e.shiftKey && e.key === " ") {
        e.preventDefault();
        selectedNote.querySelector(".toggle-single")?.click();
    }

    // Down
    if (e.key === "ArrowDown") {
        const next = getNextSibling(selectedNote);
        if (next) selectNote(next);
    }

    // Up
    if (e.key === "ArrowUp") {
        const prev = getPrevSibling(selectedNote);
        if (prev) selectNote(prev);
    }

    // Right : first child
    if (e.key === "ArrowRight") {
        const child = getFirstChild(selectedNote);
        if (child) selectNote(child);
    }

    // Left : parent
    if (e.key === "ArrowLeft") {
        const parent = getParentNote(selectedNote);
        if (parent) selectNote(parent);
    }

});
