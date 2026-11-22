// Pure JavaScript PDF generator for Hyper-CSR (Pending Book)
// Generates standard compliant PDF 1.4 A4 Landscape
// Zero external npm dependencies required

function escapePdf(str) {
    if (!str) return '';
    return String(str)
        .replace(/[\r\n\t]+/g, ' ')
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, '-')
        .replace(/\u2022/g, '*')
        .replace(/\u2026/g, '...')
        .replace(/[^\x20-\x7E]/g, '') // Keep clean printable ASCII
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');
}

function truncateText(str, width) {
    if (!str) return '-';
    // ~4.8 pt per character for Helvetica 8pt
    const maxChars = Math.max(3, Math.floor(width / 4.8));
    const s = String(str).trim();
    if (s.length > maxChars) {
        return s.substring(0, maxChars - 2) + '..';
    }
    return s;
}

function generatePendingBookPdf({
    shopName = 'Hypertech Digital',
    shopAddress = '',
    shopPhone = '',
    generatedDate = new Date().toLocaleDateString('en-GB'),
    records = []
}) {
    // A4 Landscape: 842 x 595 pt
    const pageWidth = 842;
    const pageHeight = 595;
    const margin = 30;
    const usableWidth = pageWidth - 2 * margin; // 782 pt

    const columns = [
        { header: 'SL', key: 'sl', width: 28 },
        { header: 'CSR #', key: 'csr_number', width: 52 },
        { header: 'INTAKE DATE', key: 'date', width: 75 },
        { header: 'CUSTOMER NAME', key: 'customer_name', width: 125 },
        { header: 'PHONE', key: 'customer_phone', width: 85 },
        { header: 'PRODUCT / DEVICE', key: 'item_name', width: 135 },
        { header: 'COMPLAINT / ISSUE', key: 'issue', width: 170 },
        { header: 'STATUS', key: 'status', width: 65 },
        { header: 'MODE', key: 'service_mode', width: 47 }
    ];

    const rowsPerPage = 22;
    const pageCount = Math.max(1, Math.ceil(records.length / rowsPerPage));

    const objects = [];
    let objId = 1;

    function addObj(content) {
        const id = objId++;
        objects.push({ id, content });
        return id;
    }

    const catalogId = addObj(''); // obj 1
    const pagesId = addObj('');   // obj 2
    const fontId = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'); // obj 3
    const fontBoldId = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'); // obj 4

    const pageObjIds = [];

    for (let p = 0; p < pageCount; p++) {
        const pageRows = records.slice(p * rowsPerPage, (p + 1) * rowsPerPage);
        let stream = '';

        // 1. Title Banner
        stream += 'BT\n';
        stream += `/F2 15 Tf\n`;
        stream += `0.1 0.1 0.2 rg\n`;
        stream += `${margin} ${pageHeight - margin - 12} Td\n`;
        stream += `(${escapePdf(shopName)} - PENDING SERVICE REGISTER (PENDING BOOK)) Tj\n`;
        stream += 'ET\n';

        // 2. Subtitle / Metadata
        const metaStr = `Total Pending Records: ${records.length} | Generated: ${generatedDate} ${shopPhone ? `| Tel: ${shopPhone}` : ''} | Page ${p + 1} of ${pageCount}`;
        stream += 'BT\n';
        stream += `/F1 8.5 Tf\n`;
        stream += `0.4 0.4 0.4 rg\n`;
        stream += `${margin} ${pageHeight - margin - 26} Td\n`;
        stream += `(${escapePdf(metaStr)}) Tj\n`;
        stream += 'ET\n';

        // Header separator line
        const headerLineY = pageHeight - margin - 34;
        stream += `0.8 0.8 0.8 RG\n1 w\n${margin} ${headerLineY} m ${pageWidth - margin} ${headerLineY} l S\n`;

        // 3. Table Header
        let currentY = headerLineY - 18;
        // Table Header background
        stream += `0.2 0.25 0.35 rg\n${margin} ${currentY - 4} ${usableWidth} 18 re f\n`;

        // Table Header text
        let colX = margin + 5;
        stream += 'BT\n/F2 8.5 Tf\n1 1 1 rg\n';
        for (const col of columns) {
            stream += `1 0 0 1 ${colX} ${currentY} Tm (${escapePdf(col.header)}) Tj\n`;
            colX += col.width;
        }
        stream += 'ET\n';

        // 4. Table Rows
        currentY -= 17;
        for (let i = 0; i < pageRows.length; i++) {
            const r = pageRows[i];
            const isAlt = i % 2 === 1;

            // Row background
            if (isAlt) {
                stream += `0.96 0.96 0.97 rg\n${margin} ${currentY - 4} ${usableWidth} 16 re f\n`;
            }

            // Bottom border line
            stream += `0.9 0.9 0.9 RG\n0.5 w\n${margin} ${currentY - 4} m ${pageWidth - margin} ${currentY - 4} l S\n`;

            // Draw status highlight dot / text
            colX = margin + 5;
            stream += 'BT\n/F1 8 Tf\n0.15 0.15 0.15 rg\n';
            for (const col of columns) {
                let text = '';
                if (col.key === 'sl') {
                    text = String(p * rowsPerPage + i + 1);
                } else if (col.key === 'date') {
                    try {
                        text = r.created_at ? new Date(r.created_at).toLocaleDateString('en-GB') : '-';
                        if (text === 'Invalid Date') text = String(r.created_at).substring(0, 10);
                    } catch {
                        text = '-';
                    }
                } else {
                    text = r[col.key] != null ? String(r[col.key]) : '-';
                }

                const truncated = truncateText(text, col.width - 4);
                stream += `1 0 0 1 ${colX} ${currentY} Tm (${escapePdf(truncated)}) Tj\n`;
                colX += col.width;
            }
            stream += 'ET\n';

            currentY -= 16;
        }

        // 5. Footer note
        stream += 'BT\n';
        stream += `/F1 7.5 Tf\n`;
        stream += `0.5 0.5 0.5 rg\n`;
        stream += `${margin} ${margin} Td\n`;
        stream += `(Hyper-CSR System | Official Confidential Pending Register) Tj\n`;
        stream += 'ET\n';

        const streamLen = Buffer.byteLength(stream, 'utf8');
        const contentsId = addObj(`<< /Length ${streamLen} >>\nstream\n${stream}\nendstream`);
        const pageId = addObj(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentsId} 0 R >>`);
        pageObjIds.push(pageId);
    }

    // Assemble catalog and pages
    objects[0].content = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
    objects[1].content = `<< /Type /Pages /Kids [${pageObjIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageObjIds.length} >>`;

    // Serialize output
    let out = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    const xrefOffsets = [];

    for (const obj of objects) {
        xrefOffsets[obj.id] = Buffer.byteLength(out, 'utf8');
        out += `${obj.id} 0 obj\n${obj.content}\nendobj\n`;
    }

    const xrefStart = Buffer.byteLength(out, 'utf8');
    out += `xref\n0 ${objects.length + 1}\n`;
    out += `0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i++) {
        const offset = String(xrefOffsets[i]).padStart(10, '0');
        out += `${offset} 00000 n \n`;
    }

    out += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
    return Buffer.from(out, 'utf8');
}

module.exports = { generatePendingBookPdf };
