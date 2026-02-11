function renderLatex(text) {
    // Replace display math $$...$$
    text = text.replace(/\$\$([^\$]+)\$\$/g, (match, expr) => {
        try {
            return katex.renderToString(expr, { displayMode: true, throwOnError: false });
        } catch (e) {
            return match;
        }
    });

    // Replace inline math $...$
    text = text.replace(/\$([^\$]+)\$/g, (match, expr) => {
        try {
            return katex.renderToString(expr, { throwOnError: false });
        } catch (e) {
            return match;
        }
    });

    return text;
}
function renderContent(content) {
    //console.log('content: ',content)
    if (!content) return '';

    let result = '';
    const sp=content.split('~')
    //console.log(sp)
    if (sp.length===1){return }
    for (let a=0;a<sp.length;a++){
        if (a%2==0){
            result+=sp[a]
        }
        else{
            result+=marked.parse(renderLatex(sp[a]))
        }
        //console.log('result: ',result)
    }
    return result
}
function createNoteElement(content = 'New Note') {
    const li = document.createElement('li');
    // generate id here
    li.dataset.id = crypto.randomUUID();
    li.dataset.parentId = null;
    li.innerHTML = `
    <div class="note">
        <div class="note-button" ondblclick="makeEditable(this)" contenteditable="false">${content}</div>
        <div class="controls">
            <span class="toggle-single">☰</span>
            <div class="note-actions" style="display:none;">
                <span class="add-sibling" onclick="addSibling(this)"> ☝ </span>
                <span class="add-child" onclick="addChild(this)">↳ </span>
                <span class="expand-btn" onclick="toggleChildren(this)">🔽 </span>
                <span class="delete-note" onclick="deleteNote(this)">❌</span>
            </div>
        </div>
    </div>
    <ul class="child-notes"></ul>
    `;
    selectNote(li);
    return li;
}
function makeEditable(el) {
    // Store the raw content for editing
    if (!el.dataset.raw) {
        el.dataset.raw = el.innerText;
    }

    // Show raw content while editing
    el.innerHTML = el.dataset.raw;
    el.setAttribute('contenteditable', 'true');
    setTimeout(()=>el.focus(),10) //Don't remove this, it makes sure rendered latex is shown when blurred

    if (!el.dataset.listenerAttached) {
        el.dataset.listenerAttached = "true";

        el.addEventListener("paste", (e) => {
            e.preventDefault();

            const clipboardItems = e.clipboardData.items;

            // Check for images in clipboard
            for (let i = 0; i < clipboardItems.length; i++) {
                const item = clipboardItems[i];
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    const reader = new FileReader();

                    reader.onload = function(event) {
                        const src = event.target.result;
                        const imgHTML = `<img src="${src}" style="max-width:100%;height:auto;">`;
                        document.execCommand("insertHTML", false, imgHTML);

                    };
                    reader.readAsDataURL(file);
                    return;
                }
            }

            const text = e.clipboardData.getData("text/plain");
            const urlRegex = /^(https?:\/\/[^\s]+)/;

            if (urlRegex.test(text)) {
                document.execCommand("insertHTML", false, `<a href="${text}" target="_blank">${text}</a>`);
            } else {
                document.execCommand("insertText", false, text);
            }
        });

        el.addEventListener("blur", () => {
            el.setAttribute("contenteditable", "false");
            // Invalidate OCR on any edit
            const li = el.closest('li');
            if (li && li.dataset.ocr) {
                delete li.dataset.ocr;
            }
            // Only run OCR if images exist
            li.querySelectorAll('img:not([data-ocr-done])').forEach(img => {
                ocrImageInNote(li, img);
            });

            // Continue with rendering markdown/content
            if (!el.querySelector('img') && !el.querySelector('a')) {
                el.dataset.raw = el.innerText || el.innerHTML;
                const k = renderContent(el.dataset.raw);
                if (k) el.innerHTML = k;
            }
            // If contains image or link, skip rendering
            if (el.querySelector('img') || el.querySelector('a')) {
                el.dataset.raw = el.innerHTML;
                return;
            }
            // Store raw content
            el.dataset.raw = el.innerText || el.innerHTML;
            // Render content with markdown blocks
            const k=renderContent(el.dataset.raw);
            if (k) el.innerHTML = k;
            //console.log(el.innerText,el.dataset.raw)
        });
    }
}
function getNoteData(ul) {
    const data = [];
    for (const li of ul.children) {
        const noteButton = li.querySelector('.note-button');
        // Get raw content if available, otherwise get innerHTML
        const title = noteButton.dataset.raw || noteButton.innerHTML;
        const childUl = li.querySelector('.child-notes');
        const node = {
            id: li.dataset.id,
            parentId: li.dataset.parentId ?? null,
            title,
            children: getNoteData(childUl),
            links: li.dataset.links
            ? JSON.parse(li.dataset.links)
            : []
        };

        // Persist OCR only if images still exist
        if (hasImage(title) && li.dataset.ocr) {
            node.ocr = li.dataset.ocr;
        }

        data.push(node);
    }
    return data;
}
function exportNotes() {
    //const filenameInput = document.getElementById('filenameInput').value.trim();
    //filenameInput ? filenameInput :
    const filename = 'notes.json';

    const data = getNoteData(document.getElementById('notes'));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.json') ? filename : filename + '.json';
    a.click();

    URL.revokeObjectURL(url);
}
function importNotes(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            data.forEach(n => normalize(n));
            const container = document.getElementById('notes');
            container.innerHTML = '';
            data.forEach(note => {
                const li = buildNoteFromData(note);
                // li.dataset.id = note.id;
                // li.dataset.parentId = note.parentId;
                if (note.links && note.links.length) {
                    li.dataset.links = JSON.stringify(note.links);
                }
                if (note.ocr) {
                    li.dataset.ocr = note.ocr;
                }
                container.appendChild(li);
            });
        } catch (e) {
            alert('Failed to load notes: Invalid file format.');
        }
    };
    reader.readAsText(file);
}
function normalize(node, parentId = null) {
    node.id ??= crypto.randomUUID()
    node.parentId = parentId

    node.title ??= ""
    node.children ??= []
    node.links ??= []

    // OCR hygiene
    if (!hasImage(node.title)) {
        delete node.ocr
    }

    for (const child of node.children) {
        normalize(child, node.id)
    }

    return node
}
function buildNoteFromData(item) {
    const li = createNoteElement(item.title);
    li.dataset.id = item.id;
    li.dataset.parentId = item.parentId ?? null;
    if (item.links && item.links.length) {
        li.dataset.links = JSON.stringify(item.links);
    }
    const noteButton = li.querySelector('.note-button');

    // Store raw content
    noteButton.dataset.raw = item.title;
    // Render content with markdown blocks
    const k=renderContent(item.title);
    //console.log(k);
    if (k) noteButton.innerHTML = k;
    else noteButton.innerHTML=item.title

        const childUl = li.querySelector('.child-notes');

    for (const child of item.children) {
        const childLi = buildNoteFromData(child);
        childLi.dataset.parentId = item.id;
        childUl.appendChild(childLi);
    }

    // Hide children initially
    childUl.style.display = 'none';

    if (item.children.length > 0) {
        const toggleBtn = li.querySelector('.expand-btn');
        if (toggleBtn) {
            toggleBtn.style.visibility = 'visible';
            toggleBtn.textContent = '🔽';
        }
    }
    if (item.ocr) {
        li.dataset.ocr = item.ocr;
        li.querySelectorAll('img').forEach(img => {
            img.dataset.ocrDone = '1';
        });
    }

    return li;
}

