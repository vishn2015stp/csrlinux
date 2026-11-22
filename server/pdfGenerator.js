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

    // Removed MODE column, distributed width cleanly across remaining 8 columns (total = 782 pt)
    const columns = [
        { header: 'SL', key: 'sl', width: 28 },
        { header: 'CSR #', key: 'csr_number', width: 54 },
        { header: 'INTAKE DATE', key: 'date', width: 80 },
        { header: 'CUSTOMER NAME', key: 'customer_name', width: 135 },
        { header: 'PHONE', key: 'customer_phone', width: 90 },
        { header: 'PRODUCT / DEVICE', key: 'item_name', width: 155 },
        { header: 'COMPLAINT / ISSUE', key: 'issue', width: 175 },
        { header: 'STATUS', key: 'status', width: 65 }
    ];

    // Status metrics for heading summary box
    let returnCount = 0;
    let readyCount = 0;
    let warrantyCount = 0;
    let pendingCount = 0;

    for (const r of records) {
        const s = String(r.status || '').trim().toUpperCase();
        if (s.includes('RETURN')) {
            returnCount++;
        } else if (s.includes('READY')) {
            readyCount++;
        } else if (s.includes('WARR')) {
            warrantyCount++;
        } else {
            pendingCount++;
        }
    }

    const rowsPerPage = 24;
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

        // ================= HEADER =================
        // 1. Left Side: Title & Metadata
        stream += 'BT\n';
        stream += `/F2 14 Tf\n`;
        stream += `0.1 0.15 0.25 rg\n`;
        stream += `${margin} ${pageHeight - margin - 8} Td\n`;
        stream += `(${escapePdf(shopName)} - PENDING SERVICE REGISTER) Tj\n`;
        stream += 'ET\n';

        const metaStr1 = `Total Pending Records: ${records.length} | Generated: ${generatedDate} ${shopPhone ? `| Tel: ${escapePdf(shopPhone)}` : ''}`;
        stream += 'BT\n';
        stream += `/F1 8.5 Tf\n`;
        stream += `0.35 0.35 0.35 rg\n`;
        stream += `${margin} ${pageHeight - margin - 23} Td\n`;
        stream += `(${escapePdf(metaStr1)}) Tj\n`;
        stream += 'ET\n';

        const metaStr2 = `${shopAddress ? `${escapePdf(shopAddress)} | ` : ''}Page ${p + 1} of ${pageCount} | Confidential Shop Register`;
        stream += 'BT\n';
        stream += `/F1 8 Tf\n`;
        stream += `0.5 0.5 0.5 rg\n`;
        stream += `${margin} ${pageHeight - margin - 35} Td\n`;
        stream += `(${escapePdf(metaStr2)}) Tj\n`;
        stream += 'ET\n';

        // 2. Right Side: Status Summary Box (matches spreadsheet image)
        const boxWidth = 140;
        const boxHeight = 48; // 4 rows x 12pt
        const boxX = pageWidth - margin - boxWidth; // 672
        const boxY = pageHeight - margin - boxHeight - 2; // 515
        const colSplitX = boxX + 88; // label column: 88pt, count column: 52pt

        // Box background
        stream += `1 1 1 rg\n${boxX} ${boxY} ${boxWidth} ${boxHeight} re f\n`;

        // Outer border
        stream += `0.2 0.2 0.2 RG\n1 w\n${boxX} ${boxY} ${boxWidth} ${boxHeight} re S\n`;

        // Vertical divider between label and count
        stream += `0.5 w\n${colSplitX} ${boxY} m ${colSplitX} ${boxY + boxHeight} l S\n`;

        // Horizontal dividers
        for (let rowIdx = 1; rowIdx <= 3; rowIdx++) {
            const lineY = boxY + rowIdx * 12;
            stream += `${boxX} ${lineY} m ${boxX + boxWidth} ${lineY} l S\n`;
        }

        // Status rows: label, count, color [r, g, b]
        const statusRows = [
            { label: 'RETURN', count: returnCount, color: [0.0, 0.15, 0.75] },    // Blue
            { label: 'READY', count: readyCount, color: [0.0, 0.52, 0.15] },      // Green
            { label: 'WARRENTY', count: warrantyCount, color: [0.85, 0.38, 0.0] }, // Orange
            { label: 'PENDING', count: pendingCount, color: [0.82, 0.1, 0.1] }      // Red
        ];

        // Draw status rows from top to bottom
        for (let idx = 0; idx < statusRows.length; idx++) {
            const item = statusRows[idx];
            const rowBaseY = boxY + (3 - idx) * 12 + 3;

            // Draw label (black, bold)
            stream += 'BT\n/F2 8.5 Tf\n0 0 0 rg\n';
            stream += `1 0 0 1 ${boxX + 12} ${rowBaseY} Tm (${escapePdf(item.label)}) Tj\n`;
            stream += 'ET\n';

            // Draw count (colored, bold, centered in count column)
            const countStr = String(item.count);
            const countWidthApprox = countStr.length * 5.8;
            const countX = colSplitX + Math.round((52 - countWidthApprox) / 2);

            stream += 'BT\n/F2 9.5 Tf\n';
            stream += `${item.color[0]} ${item.color[1]} ${item.color[2]} rg\n`;
            stream += `1 0 0 1 ${countX} ${rowBaseY} Tm (${escapePdf(countStr)}) Tj\n`;
            stream += 'ET\n';
        }

        // 3. Header separator line
        const headerLineY = boxY - 8;
        stream += `0.8 0.8 0.8 RG\n1 w\n${margin} ${headerLineY} m ${pageWidth - margin} ${headerLineY} l S\n`;

        // 4. Table Header
        let currentY = headerLineY - 18;
        stream += `0.2 0.25 0.35 rg\n${margin} ${currentY - 4} ${usableWidth} 18 re f\n`;

        let colX = margin + 5;
        stream += 'BT\n/F2 8.5 Tf\n1 1 1 rg\n';
        for (const col of columns) {
            stream += `1 0 0 1 ${colX} ${currentY} Tm (${escapePdf(col.header)}) Tj\n`;
            colX += col.width;
        }
        stream += 'ET\n';

        // 5. Table Rows
        currentY -= 17;
        for (let i = 0; i < pageRows.length; i++) {
            const r = pageRows[i];
            const isAlt = i % 2 === 1;

            if (isAlt) {
                stream += `0.96 0.96 0.97 rg\n${margin} ${currentY - 4} ${usableWidth} 16 re f\n`;
            }

            stream += `0.9 0.9 0.9 RG\n0.5 w\n${margin} ${currentY - 4} m ${pageWidth - margin} ${currentY - 4} l S\n`;

            colX = margin + 5;
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

                // Highlight status column with matching color
                if (col.key === 'status') {
                    const stUpper = text.toUpperCase();
                    let sColor = '0.2 0.2 0.2';
                    if (stUpper.includes('RETURN')) sColor = '0.0 0.15 0.75';
                    else if (stUpper.includes('READY')) sColor = '0.0 0.52 0.15';
                    else if (stUpper.includes('WARR')) sColor = '0.85 0.38 0.0';
                    else if (stUpper.includes('PENDING')) sColor = '0.82 0.1 0.1';

                    stream += 'BT\n/F2 8 Tf\n' + sColor + ' rg\n';
                    stream += `1 0 0 1 ${colX} ${currentY} Tm (${escapePdf(truncated)}) Tj\nET\n`;
                } else {
                    stream += 'BT\n/F1 8 Tf\n0.15 0.15 0.15 rg\n';
                    stream += `1 0 0 1 ${colX} ${currentY} Tm (${escapePdf(truncated)}) Tj\nET\n`;
                }
                colX += col.width;
            }

            currentY -= 16;
        }

        // 6. Footer note
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
