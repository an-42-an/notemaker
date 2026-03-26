function extractImages(title) {
    return [...title.matchAll(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi)]
    .map(m => m[1])
}

function hasImage(title) {
    return extractImages(title).length > 0
}

function isBase64Image(str) {
    return str.trim().startsWith('data:image/');
}
