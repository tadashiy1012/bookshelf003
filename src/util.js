import pdfjs from 'pdfjs-dist';

const getDoc = (file) => {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.addEventListener('load', async (ev) => {
            const buf = ev.target.result;
            try {
                const doc = await pdfjs.getDocument(new Uint8Array(buf));   
                resolve(doc);
            } catch (err) {
                reject(err);
            }
        });
        fr.readAsArrayBuffer(file);
    });
}

const makeThumbnail = (doc) => {
    return new Promise(async (resolve, reject) => {
        const page = await doc.getPage(1);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const viewport = page.getViewport(0.3);
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({
            canvasContext: ctx,
            viewport: viewport
        });
        canvas.toBlob((resp) => {
            resolve(resp);
        }, 'image/png');
    });
};

export {
    getDoc,
    makeThumbnail
};