function searchNotes(query) {
    document.querySelectorAll('#notes li').forEach(li => console.log(li, li.dataset.ocr));

    query = query.trim().toLowerCase();
    searchResults = [];
    searchIndex = -1;
    // search cleared → restore state
    if (!query) {
        searchResults = [];searchIndex = -1;updateSearchStatus();
        if (searchExpansionSnapshot) {
            restoreExpansionState(searchExpansionSnapshot);
            searchExpansionSnapshot = null;
        }
        document.querySelectorAll('.search-hit')
        .forEach(el => el.classList.remove('search-hit'));
        return;
    }

    // always reset to original state before each incremental search
    if (!searchExpansionSnapshot) {
        searchExpansionSnapshot = captureExpansionState();
    } else {
        restoreExpansionState(searchExpansionSnapshot);
    }

    // clear previous highlights
    document.querySelectorAll('.search-hit').forEach(el => {
        el.classList.remove('search-hit');
        document.getElementById('searchStatus').textContent = '';
    });

    const allNotes = document.querySelectorAll('#notes li');
    for (const li of allNotes) {
        const btn = li.querySelector('.note-button');
        const rawTitle = btn.dataset.raw || btn.innerText || '';
        const titleNoImages = rawTitle.replace(/<img\s+[^>]*>/gi, '');
        console.log(li);
        const titleText = titleNoImages.toLowerCase();
        const ocrText = (li.dataset.ocr || '').toLowerCase();
        const text = titleText + '\n' + ocrText;

        if (text.includes(query)) {
            btn.classList.add('search-hit');
            expandAncestors(li);
            searchResults.push(li);
            updateSearchStatus();
        }
    }
}
function updateSearchStatus() {
    const el = document.getElementById('searchStatus');
    if (!el) return;
    el.textContent = `${searchResults.length} result(s)`;
}
function focusResult(i) {
    if (!searchResults.length) return;
    const li = searchResults[i];
    li.scrollIntoView({ block: 'start' });
    li.querySelector('.note-button')?.focus?.();
}
function nextResult() {
    if (!searchResults.length) return;
    searchIndex = (searchIndex + 1) % searchResults.length;
    focusResult(searchIndex);
}
function prevResult() {
    if (!searchResults.length) return;
    searchIndex = (searchIndex - 1 + searchResults.length) % searchResults.length;
    focusResult(searchIndex);
}
function expandAncestors(li) {
    let parentLi = li.closest('ul').closest('li');

    while (parentLi) {
        const btn = parentLi.querySelector('.expand-btn');
        const childList = parentLi.querySelector('.child-notes');

        if (btn && childList && childList.style.display === 'none') {
            toggleChildren(btn);
        }

        parentLi = parentLi.closest('ul').closest('li');
    }
}
function captureExpansionState() {
    const state = new Set();
    document.querySelectorAll('#notes li').forEach(li => {
        const ul = li.querySelector('.child-notes');
        if (ul && ul.style.display === 'block') {
            state.add(li.dataset.id);
        }
    });
    return state;
}
function restoreExpansionState(state) {
    document.querySelectorAll('#notes li').forEach(li => {
        const ul = li.querySelector('.child-notes');
        const btn = li.querySelector('.expand-btn');
        if (!ul || !btn) return;

        if (state.has(li.dataset.id)) {
            if (ul.style.display === 'none') toggleChildren(btn);
        } else {
            if (ul.style.display === 'block') toggleChildren(btn);
        }
    });
}
