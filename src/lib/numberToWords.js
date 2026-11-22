// Number to Indian Rupees in words conversion

const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertBelowThousand(n) {
    let str = '';
    if (n >= 100) {
        str += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
    }
    if (n > 0) {
        if (n < 20) {
            str += ones[n] + ' ';
        } else {
            str += tens[Math.floor(n / 10)] + ' ';
            if (n % 10 > 0) {
                str += ones[n % 10] + ' ';
            }
        }
    }
    return str.trim();
}

export function numberToWords(num) {
    if (num === null || num === undefined || isNaN(num)) return 'Zero Rupees Only';
    const amount = parseFloat(num);
    if (amount === 0) return 'Zero Rupees Only';

    const [rupeesPart, paisePart] = amount.toFixed(2).split('.');
    let n = parseInt(rupeesPart, 10);
    const paise = parseInt(paisePart, 10);

    if (n === 0 && paise > 0) {
        return `Indian Rupees ${convertBelowThousand(paise)} Paise Only`;
    }

    let words = '';

    // Crores (>= 1,00,00,000)
    if (n >= 10000000) {
        const crores = Math.floor(n / 10000000);
        words += convertBelowThousand(crores) + ' Crore ';
        n %= 10000000;
    }

    // Lakhs (>= 1,00,000)
    if (n >= 100000) {
        const lakhs = Math.floor(n / 100000);
        words += convertBelowThousand(lakhs) + ' Lakh ';
        n %= 100000;
    }

    // Thousands (>= 1,000)
    if (n >= 1000) {
        const thousands = Math.floor(n / 1000);
        words += convertBelowThousand(thousands) + ' Thousand ';
        n %= 1000;
    }

    // Hundreds & Below
    if (n > 0) {
        words += convertBelowThousand(n) + ' ';
    }

    words = words.trim();
    let result = 'Indian Rupees ' + words;

    if (paise > 0) {
        result += ' and ' + convertBelowThousand(paise) + ' Paise';
    }

    result += ' Only';
    return result;
}
