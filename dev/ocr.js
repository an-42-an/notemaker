async function runOCR(imageSrc) {
    const result = await Tesseract.recognize(
        imageSrc,
        'eng',
        {
            //logger: m => console.log(m.status, m.progress)
        }
    );

    return result.data.text || '';
}
async function ocrImageInNote(li, img) {
    if (img.dataset.ocrDone) return;
    img.dataset.ocrDone = '1';
    ocrInFlight++;
    updateOCRStatus();
    const text = await runOCR(img.src);
    li.dataset.ocr = (li.dataset.ocr || '') + '\n' + text;
    ocrInFlight--;
    updateOCRStatus();
}
function updateOCRStatus() {
    const el = document.getElementById('ocrStatus');
    if (!el) return;
    el.textContent = ocrInFlight > 0
    ? `OCR running (${ocrInFlight})…`
    : 'OCR idle';
}
