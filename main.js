marked.setOptions({
    breaks: true,
    gfm: true
});
let searchExpansionSnapshot = null;
let ocrInFlight = 0;
let searchResults = [];
let searchIndex = -1;
let globalControlsCollapsed = true;
let selectedNote = null;
let globalLinksCollapsed = false;
let pendingLinkSource = null;

document.getElementById("globalToggleControls")
.addEventListener("click", () => {
    globalControlsCollapsed = !globalControlsCollapsed;
    document.querySelectorAll(".controls .note-actions")
    .forEach(el => {
        el.style.display = globalControlsCollapsed ? "none" : "inline";
    });
});
document.getElementById("globalToggleLinks")
.addEventListener("click", () => {
    globalLinksCollapsed = !globalLinksCollapsed;

    document.querySelectorAll(".links-bar")
    .forEach(el => {
        el.style.display =
        globalLinksCollapsed
        ? "none"
        : "block";
    });
});

function selectNote(li) {
    if (selectedNote) selectedNote.classList.remove("selected");
    selectedNote = li;
    li.classList.add("selected");
}

function beginLink(li){
    if (pendingLinkSource === li) {
        pendingLinkSource = null;
        document.querySelectorAll('.link-source')
        .forEach(el => el.classList.remove('link-source'));
        return;
    }

    if (!pendingLinkSource) {
        pendingLinkSource = li;
        document.querySelectorAll('.link-source')
        .forEach(el => el.classList.remove('link-source'));

        li.classList.add('link-source');
        return;
    }

    addLink(pendingLinkSource, li);
    pendingLinkSource = null;
    document.querySelectorAll('.link-source')
    .forEach(el => el.classList.remove('link-source'));
}

document.body.addEventListener("click", e => {
    const note = e.target.closest("li");
    if (note) selectNote(note);
});

const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
        for (const node of m.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;

            const imgs = node.querySelectorAll?.('img:not([data-ocr-done])');
            if (!imgs) continue;

            for (const img of imgs) {
                const li = img.closest('li');
                if (li) ocrImageInNote(li, img);
            }
        }
    }
});

observer.observe(document.getElementById('notes'), {
    childList: true,
    subtree: true
});
