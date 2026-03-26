// import {searchNotes,updateSearchStatus,focusResult,nextResult,prevResult,expandAncestors,captureExpansionState,restoreExpansionState} from './search.js';
// import {runOCR,ocrImageInNote,ocrImageInNote} from './ocr.js'
// import {extractImages,hasImage,isBase64Image} from './image.js'
// import {toggleChildren,addNewNote,addChild,addSibling,deleteNote} from './functional.js'
// import {renderLatex,renderContent,createNoteElement,   makeEditable,getNoteData,exportNotes,importNotes,normalize,buildNoteFromData} from './core.js'

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

document.getElementById("globalToggleControls")
.addEventListener("click", () => {
    globalControlsCollapsed = !globalControlsCollapsed;
    document.querySelectorAll(".controls .note-actions")
    .forEach(el => {
        el.style.display = globalControlsCollapsed ? "none" : "inline";
    });
});
document.body.addEventListener("click", e => {
    if (e.target.matches(".toggle-single")) {
        const actions = e.target.closest(".controls").querySelector(".note-actions");
        actions.style.display = actions.style.display === "none" ? "inline" : "none";
    }
});

function selectNote(li) {
    if (selectedNote) selectedNote.classList.remove("selected");
    selectedNote = li;
    li.classList.add("selected");
    // requestAnimationFrame(() => li.scrollIntoView({ block: 'center' }));
}

document.body.addEventListener("click", e => {
    const note = e.target.closest("li");
    if (note) selectNote(note);
});
// function logCalls(obj) {
//     for (const key of Object.keys(obj)) {
//         if (typeof obj[key] === 'function') {
//             const original = obj[key];
//             obj[key] = function(...args) {
//                 console.log(`Called ${key} with`, args);
//                 return original.apply(this, args);
//             }
//         }
//     }
// }
//
// // Example:
// logCalls(window); // risky, will wrap all global functions

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
