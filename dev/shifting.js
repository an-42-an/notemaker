function moveLeft(li) {
    const parentLi = li.parentElement.closest('li');
    if (!parentLi) return;

    const grandUl = parentLi.parentElement;
    const next = parentLi.nextElementSibling;

    if (next) {
        grandUl.insertBefore(li, next);
    } else {
        grandUl.appendChild(li);
    }

    li.dataset.parentId = parentLi.dataset.parentId ?? null;
}
function moveRight(li) {
    const prev = li.previousElementSibling;
    if (!prev) return;

    let childUl = prev.querySelector(':scope > ul.child-notes');

    if (!childUl) {
        childUl = document.createElement('ul');
        childUl.className = 'child-notes';
        prev.appendChild(childUl);
    }

    childUl.style.display = 'block';

    childUl.appendChild(li);
    li.dataset.parentId = prev.dataset.id;
}
function moveUp(li) {
    const prev = li.previousElementSibling;
    if (!prev) return;

    const parentUl = li.parentElement;
    parentUl.insertBefore(li, prev);
}
function moveDown(li) {
    const next = li.nextElementSibling;
    if (!next) return;

    const parentUl = li.parentElement;
    parentUl.insertBefore(next, li);
}
