function getParentNote(li) {
    const parentUl = li.parentElement;
    return li.dataset.parentId!== "null"?parentUl.parentElement:null;
}

function getFirstChild(li) {
    const ul = li.querySelector(":scope > ul.child-notes");
    return ul ? ul.firstElementChild : null;
}

function getNextSibling(li) {
    return li.nextElementSibling;
}

function getPrevSibling(li) {
    return li.previousElementSibling;
}
