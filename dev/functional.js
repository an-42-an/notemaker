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

function addAfter(control) {
    const li = control.closest('li');
    const newLi = createNoteElement();
    newLi.dataset.parentId = li.dataset.parentId;

    li.parentNode.insertBefore(newLi, li.nextSibling);
    requestAnimationFrame(() => selectNote(newLi));
}

function deleteNote(control) {
    const li = control.closest('li');
    li.remove();
}
function toggleSingle(el) {
    const actions = el
    .closest(".controls")
    .querySelector(".note-actions");

    actions.style.display =
    actions.style.display === "none"
    ? "inline"
    : "none";
}
function addLink(a,b){
    const aid = a.dataset.id;
    const bid = b.dataset.id;

    const alinks = JSON.parse(a.dataset.links || "[]");
    const blinks = JSON.parse(b.dataset.links || "[]");

    if (!alinks.includes(bid)) alinks.push(bid);
    if (!blinks.includes(aid)) blinks.push(aid);
    // console.log(alinks,blinks)
    a.dataset.links = JSON.stringify(alinks);
    b.dataset.links = JSON.stringify(blinks);

    renderLinks(a);
    renderLinks(b);
}
function renderLinks(li){
    const bar = li.querySelector('.links-bar');
    const links = JSON.parse(li.dataset.links || "[]");

    bar.innerHTML = "";

    links.forEach((id,i)=>{
        const a = document.createElement('a');
        a.textContent = i+1;
        a.href = `#${id}`;

        a.onclick = e=>{
            e.preventDefault();
            e.stopPropagation();
            const target = document.querySelector(`[data-id="${id}"]`);
            if (!target) return;
            expandAncestors(target);
            target.scrollIntoView({behavior:'smooth', block:'center'});
            selectNote(target);
        };

        bar.appendChild(a);
    });

    bar.style.display = globalLinksCollapsed ? "none" : "block";
}
function toggleLinks(el) {
    const li = el.closest('li');
    const bar = li.querySelector('.links-bar');

    if (!bar) return;

    bar.style.display =
    bar.style.display === 'none'
    ? 'block'
    : 'none';
}
