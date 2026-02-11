function toggleChildren(btn) {
    const li = btn.closest('li');
    const childList = li.querySelector('.child-notes');
    if (!childList) return;
    if (childList.style.display === "none") {
        childList.style.display = "block";
        btn.textContent = "▲";
    } else {
        childList.style.display = "none";
        btn.textContent = "🔽";
    }
}

function addNewNote() {
    const newNote = createNoteElement();
    document.getElementById('notes').appendChild(newNote);
    requestAnimationFrame(() => selectNote(newNote));
}

function addChild(control) {
    const li = control.closest('li');
    const childList = li.querySelector('.child-notes');
    const newChild = createNoteElement();
    requestAnimationFrame(() => selectNote(newChild));
    // set parentId here
    newChild.dataset.parentId = li.dataset.id;
    childList.appendChild(newChild);
    childList.style.display = "block";
    const expandBtn = li.querySelector('.expand-btn');
    expandBtn.style.visibility = "visible";
    expandBtn.textContent = "▲";
}

function addSibling(control) {
    const li = control.closest('li');
    const newLi = createNoteElement();
    newLi.dataset.parentId = li.dataset.parentId;
    li.parentNode.insertBefore(newLi, li);
    requestAnimationFrame(() => selectNote(newLi));
}

function deleteNote(control) {
    const li = control.closest('li');
    li.remove();
}
