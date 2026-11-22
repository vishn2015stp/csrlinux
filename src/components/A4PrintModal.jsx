import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, FileText, CheckCircle, ShieldCheck } from 'lucide-react';
import { numberToWords } from '../lib/numberToWords';

export default function A4PrintModal({
    isOpen,
    onClose,
    initialDocType = 'service_report',
    job,
    customer,
    invoice = {},
    config = {}
}) {
    const [docType, setDocType] = useState(initialDocType);

    useEffect(() => {
        setDocType(initialDocType);
    }, [initialDocType]);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('has-print-portal');
        } else {
            document.body.classList.remove('has-print-portal');
        }
        return () => {
            document.body.classList.remove('has-print-portal');
        };
    }, [isOpen]);

    if (!isOpen || !job || !customer) return null;

    // Parse spares list
    let sparesList = [];
    if (invoice.spares) {
        if (typeof invoice.spares === 'string' && invoice.spares.startsWith('[')) {
            try {
                sparesList = JSON.parse(invoice.spares);
            } catch (e) {
                sparesList = [{ name: invoice.spares, cost: parseFloat(invoice.part_costs) || 0 }];
            }
        } else if (Array.isArray(invoice.spares)) {
            sparesList = invoice.spares;
        } else if (typeof invoice.spares === 'string' && invoice.spares.trim()) {
            sparesList = [{ name: invoice.spares, cost: parseFloat(invoice.part_costs) || 0 }];
        }
    }

    // Calculations
    const serviceFee = parseFloat(invoice.service_fees) || 0;
    const sparesTotal = sparesList.reduce((sum, s) => {
        const itemQty = parseFloat(s.qty) || 1;
        const itemPrice = s.unit_price !== undefined ? parseFloat(s.unit_price) : (parseFloat(s.cost) || 0);
        return sum + (s.cost !== undefined && s.unit_price === undefined ? parseFloat(s.cost) : (itemQty * itemPrice));
    }, 0);

    const taxableAmount = serviceFee + sparesTotal;
    const gstRate = invoice.gst_rate !== undefined ? parseFloat(invoice.gst_rate) : (parseFloat(config.defaultGstRate) || 18);
    const gstType = invoice.gst_type || 'CGST_SGST'; // 'CGST_SGST' | 'IGST' | 'NONE'

    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    let totalTax = 0;

    if (gstType === 'CGST_SGST' && gstRate > 0) {
        cgstAmount = Math.round((taxableAmount * (gstRate / 2) / 100) * 100) / 100;
        sgstAmount = Math.round((taxableAmount * (gstRate / 2) / 100) * 100) / 100;
        totalTax = cgstAmount + sgstAmount;
    } else if (gstType === 'IGST' && gstRate > 0) {
        igstAmount = Math.round((taxableAmount * gstRate / 100) * 100) / 100;
        totalTax = igstAmount;
    }

    const grandTotal = taxableAmount + totalTax;
    const todayStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const validUntilDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').replace(/\//g, '-');

    const csrNumber = job.csr_number || (job.id ? job.id.split('-')[0].toUpperCase() : 'PENDING');
    const proformaNo = invoice.proforma_number || `PI-${new Date().getFullYear()}-${csrNumber.replace('#', '')}`;
    const receiptNo = invoice.receipt_number || `INV-${csrNumber.replace('#', '')}`;

    const shopName = config.shopName || 'Hypertech Digital';
    const shopAddress = config.shopAddress || '';
    const shopPhone = config.shopPhone || '';
    const shopEmail = config.shopEmail || '';
    const shopGstin = config.shopGstin || '';
    const stateName = config.stateName || 'Kerala';
    const stateCode = config.stateCode || '32';

    const handlePrint = () => {
        window.print();
    };

    const modalContent = (
        <div className="a4-modal-overlay">
            {/* Top Toolbar (Non-print) */}
            <div className="a4-modal-toolbar non-print">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 'bold', marginRight: '6px' }}>DOCUMENT TYPE:</span>
                    <button
                        type="button"
                        onClick={() => setDocType('service_report')}
                        style={{
                            background: docType === 'service_report' ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                            color: docType === 'service_report' ? '#000' : '#e2e8f0',
                            border: '1px solid ' + (docType === 'service_report' ? 'var(--accent)' : '#475569'),
                            padding: '6px 14px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.85rem'
                        }}
                    >
                        📋 Service Report
                    </button>
                    <button
                        type="button"
                        onClick={() => setDocType('proforma')}
                        style={{
                            background: docType === 'proforma' ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                            color: docType === 'proforma' ? '#000' : '#e2e8f0',
                            border: '1px solid ' + (docType === 'proforma' ? 'var(--accent)' : '#475569'),
                            padding: '6px 14px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.85rem'
                        }}
                    >
                        💼 Proforma Invoice (GST)
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={handlePrint}
                        style={{
                            background: '#10b981',
                            color: '#fff',
                            border: 'none',
                            padding: '7px 18px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.9rem'
                        }}
                    >
                        <Printer size={16} /> Print (A4)
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            padding: '7px 14px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.9rem'
                        }}
                    >
                        <X size={16} /> Close
                    </button>
                </div>
            </div>

            {/* A4 Paper Sheet Preview / Printout */}
            <div className="a4-print-sheet">
                {/* Header */}
                <div style={{ borderBottom: '2px solid #111', paddingBottom: '10px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {shopName}
                            </h1>
                            {shopAddress && (
                                <div style={{ fontSize: '11px', color: '#374151', marginTop: '3px', whiteSpace: 'pre-line', lineHeight: '1.3' }}>
                                    {shopAddress}
                                </div>
                            )}
                            <div style={{ fontSize: '11px', color: '#374151', marginTop: '3px' }}>
                                {shopPhone && <span><b>Phone:</b> {shopPhone} &nbsp;|&nbsp; </span>}
                                {shopEmail && <span><b>Email:</b> {shopEmail}</span>}
                            </div>
                            {(shopGstin || stateName) && (
                                <div style={{ fontSize: '11px', color: '#111', marginTop: '2px' }}>
                                    {shopGstin && <span><b>GSTIN:</b> {shopGstin} &nbsp;|&nbsp; </span>}
                                    {stateName && <span><b>State:</b> {stateName} {stateCode ? `(${stateCode})` : ''}</span>}
                                </div>
                            )}
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                display: 'inline-block',
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                fontSize: '13px',
                                color: '#0f172a',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase'
                            }}>
                                {docType === 'service_report' && 'SERVICE REPORT'}
                                {docType === 'proforma' && 'PROFORMA INVOICE'}
                            </div>
                            <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '3px' }}>
                                {docType === 'proforma' && '(ESTIMATE / QUOTATION)'}
                                {docType === 'service_report' && '(WORK & TESTING SUMMARY)'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metadata Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    gap: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '8px 10px',
                    marginBottom: '12px',
                    fontSize: '11.5px'
                }}>
                    <div>
                        <div><b>{docType === 'proforma' ? 'Proforma Invoice #' : 'Receipt #'}:</b> {docType === 'proforma' ? proformaNo : receiptNo}</div>
                        <div><b>Tracking CSR #:</b> #{csrNumber}</div>
                        <div><b>Date of Issue:</b> {todayStr}</div>
                        {docType === 'proforma' && <div><b>Valid Until:</b> {validUntilDate}</div>}
                    </div>
                    <div>
                        <div><b>Service Mode:</b> {job.service_mode || 'On Center'}</div>
                        {config.showTechnician && <div><b>Technician / Engr:</b> {job.created_by || 'Admin'}</div>}
                        <div><b>Intake Date:</b> {new Date(job.created_at).toLocaleDateString('en-GB').replace(/\//g, '-')}</div>
                    </div>
                </div>

                {/* Customer & Device Dual Box */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    {/* Customer */}
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px 10px', fontSize: '11.5px' }}>
                        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', marginBottom: '4px', color: '#0f172a' }}>
                            CUSTOMER DETAILS
                        </div>
                        <div><b>Name:</b> {customer.name}</div>
                        {config.showCustomerPhone && <div><b>Phone:</b> {customer.phone}</div>}
                        {customer.email && <div><b>Email:</b> {customer.email}</div>}
                        {customer.address && <div><b>Address:</b> {customer.address}</div>}
                        {invoice.customer_gstin && <div><b>Customer GSTIN:</b> {invoice.customer_gstin}</div>}
                    </div>

                    {/* Device */}
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px 10px', fontSize: '11.5px' }}>
                        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', marginBottom: '4px', color: '#0f172a' }}>
                            DEVICE / PRODUCT DETAILS
                        </div>
                        <div><b>Item / Device:</b> {job.item_name}</div>
                        {(job.brand || job.model) && (
                            <div><b>Brand / Model:</b> {[job.brand, job.model].filter(Boolean).join(' ')}</div>
                        )}
                        {config.showSerialNo && <div><b>Serial No:</b> {job.serial_no || '—'}</div>}
                        {job.accessories && <div><b>Accessories:</b> {job.accessories}</div>}
                    </div>
                </div>

                {/* Complaint / Issue Box */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px 10px', marginBottom: '12px', fontSize: '11.5px' }}>
                    <div style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}>REPORTED COMPLAINT / PROBLEM:</div>
                    <div style={{ color: '#334155' }}>{job.issue || 'No specific issue specified.'}</div>
                </div>

                {/* Document-Specific Body */}
                {docType === 'service_report' ? (
                    <>
                        {/* Work Done Box */}
                        <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px 10px', marginBottom: '12px', fontSize: '11.5px' }}>
                            <div style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}>DIAGNOSIS & WORK PERFORMED:</div>
                            <div style={{ color: '#334155' }}>
                                {job.issue} (Complete diagnostic & repair service executed)
                            </div>
                        </div>

                        {/* Spares / Materials Table */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', marginBottom: '12px' }}>
                            <thead>
                                <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #334155' }}>
                                    <th style={{ padding: '6px 8px', textAlign: 'left' }}>Sl</th>
                                    <th style={{ padding: '6px 8px', textAlign: 'left' }}>Item / Description</th>
                                    <th style={{ padding: '6px 8px', textAlign: 'center' }}>Warranty</th>
                                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '5px 8px' }}>1</td>
                                    <td style={{ padding: '5px 8px' }}>Service, Labor & Diagnostics</td>
                                    <td style={{ padding: '5px 8px', textAlign: 'center' }}>30 Days Service</td>
                                    <td style={{ padding: '5px 8px', textAlign: 'right' }}>₹{serviceFee.toFixed(2)}</td>
                                </tr>
                                {sparesList.map((spare, idx) => {
                                    const qty = parseFloat(spare.qty) || 1;
                                    const unitPrice = spare.unit_price !== undefined ? parseFloat(spare.unit_price) : (parseFloat(spare.cost) || 0);
                                    const itemCost = spare.cost !== undefined && spare.unit_price === undefined ? parseFloat(spare.cost) : (qty * unitPrice);
                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '5px 8px' }}>{idx + 2}</td>
                                            <td style={{ padding: '5px 8px' }}>
                                                {spare.name} {qty > 1 ? `(Qty: ${qty})` : ''}
                                            </td>
                                            <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                                                {spare.warranty || invoice.warranty || 'Standard'}
                                            </td>
                                            <td style={{ padding: '5px 8px', textAlign: 'right' }}>₹{itemCost.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                ) : (
                    /* Proforma Invoice Table */
                    <>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '12px' }}>
                            <thead>
                                <tr style={{ background: '#f1f5f9', borderTop: '1px solid #cbd5e1', borderBottom: '1.5px solid #0f172a' }}>
                                    <th style={{ padding: '6px 6px', textAlign: 'center', width: '30px' }}>#</th>
                                    <th style={{ padding: '6px 6px', textAlign: 'left' }}>Description of Goods / Services</th>
                                    <th style={{ padding: '6px 6px', textAlign: 'center', width: '65px' }}>HSN/SAC</th>
                                    <th style={{ padding: '6px 6px', textAlign: 'center', width: '40px' }}>Qty</th>
                                    <th style={{ padding: '6px 6px', textAlign: 'right', width: '70px' }}>Rate (₹)</th>
                                    <th style={{ padding: '6px 6px', textAlign: 'right', width: '80px' }}>Taxable (₹)</th>
                                    <th style={{ padding: '6px 6px', textAlign: 'center', width: '50px' }}>GST %</th>
                                    <th style={{ padding: '6px 6px', textAlign: 'right', width: '75px' }}>Tax (₹)</th>
                                    <th style={{ padding: '6px 6px', textAlign: 'right', width: '85px' }}>Total (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Service Fee Item */}
                                {serviceFee > 0 && (
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '6px 6px', textAlign: 'center' }}>1</td>
                                        <td style={{ padding: '6px 6px' }}>
                                            <b>Service & Repair Labor</b>
                                            <div style={{ fontSize: '10px', color: '#64748b' }}>Technical diagnostic & repair charges</div>
                                        </td>
                                        <td style={{ padding: '6px 6px', textAlign: 'center' }}>998713</td>
                                        <td style={{ padding: '6px 6px', textAlign: 'center' }}>1</td>
                                        <td style={{ padding: '6px 6px', textAlign: 'right' }}>{serviceFee.toFixed(2)}</td>
                                        <td style={{ padding: '6px 6px', textAlign: 'right' }}>{serviceFee.toFixed(2)}</td>
                                        <td style={{ padding: '6px 6px', textAlign: 'center' }}>{gstRate}%</td>
                                        <td style={{ padding: '6px 6px', textAlign: 'right' }}>
                                            {((serviceFee * gstRate) / 100).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '6px 6px', textAlign: 'right', fontWeight: 'bold' }}>
                                            {(serviceFee * (1 + gstRate / 100)).toFixed(2)}
                                        </td>
                                    </tr>
                                )}

                                {/* Spare Parts Items */}
                                {sparesList.map((spare, idx) => {
                                    const qty = parseFloat(spare.qty) || 1;
                                    const unitPrice = spare.unit_price !== undefined ? parseFloat(spare.unit_price) : (parseFloat(spare.cost) || 0);
                                    const itemTaxable = spare.cost !== undefined && spare.unit_price === undefined ? parseFloat(spare.cost) : (qty * unitPrice);
                                    const itemHsn = spare.hsn || spare.hsn_code || '8473';
                                    const itemGstRate = spare.gst_rate !== undefined ? parseFloat(spare.gst_rate) : gstRate;
                                    const itemTax = (itemTaxable * itemGstRate) / 100;
                                    const itemTotal = itemTaxable + itemTax;

                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '6px 6px', textAlign: 'center' }}>{serviceFee > 0 ? idx + 2 : idx + 1}</td>
                                            <td style={{ padding: '6px 6px' }}>
                                                <b>{spare.name}</b>
                                                {spare.warranty && (
                                                    <div style={{ fontSize: '10px', color: '#059669' }}>Warranty: {spare.warranty}</div>
                                                )}
                                            </td>
                                            <td style={{ padding: '6px 6px', textAlign: 'center' }}>{itemHsn}</td>
                                            <td style={{ padding: '6px 6px', textAlign: 'center' }}>{qty}</td>
                                            <td style={{ padding: '6px 6px', textAlign: 'right' }}>{unitPrice.toFixed(2)}</td>
                                            <td style={{ padding: '6px 6px', textAlign: 'right' }}>{itemTaxable.toFixed(2)}</td>
                                            <td style={{ padding: '6px 6px', textAlign: 'center' }}>{itemGstRate}%</td>
                                            <td style={{ padding: '6px 6px', textAlign: 'right' }}>{itemTax.toFixed(2)}</td>
                                            <td style={{ padding: '6px 6px', textAlign: 'right', fontWeight: 'bold' }}>{itemTotal.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}

                                {serviceFee === 0 && sparesList.length === 0 && (
                                    <tr>
                                        <td colSpan="9" style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>
                                            No billing items added.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                )}

                {/* Financial Totals & Tax Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '12px' }}>
                    {/* Left: Amount in Words & Bank Details */}
                    <div>
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 10px', marginBottom: '8px', fontSize: '11px' }}>
                            <div style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}>AMOUNT IN WORDS:</div>
                            <div style={{ fontStyle: 'italic', color: '#1e293b', fontWeight: '600' }}>
                                {numberToWords(grandTotal)}
                            </div>
                        </div>

                        {(config.bankName || config.accountNo || config.upiId) && (
                            <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 10px', fontSize: '10.5px' }}>
                                <div style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '3px' }}>BANK & PAYMENT DETAILS:</div>
                                {config.bankName && <div><b>Bank:</b> {config.bankName}</div>}
                                {config.accountName && <div><b>A/C Name:</b> {config.accountName}</div>}
                                {config.accountNo && <div><b>A/C No:</b> {config.accountNo}</div>}
                                {config.ifsc && <div><b>IFSC Code:</b> {config.ifsc}</div>}
                                {config.upiId && <div><b>UPI ID:</b> {config.upiId}</div>}
                            </div>
                        )}
                    </div>

                    {/* Right: Totals Box */}
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden', fontSize: '11.5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', borderBottom: '1px solid #f1f5f9' }}>
                            <span>Service & Labor:</span>
                            <span>₹{serviceFee.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', borderBottom: '1px solid #f1f5f9' }}>
                            <span>Parts & Spares:</span>
                            <span>₹{sparesTotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', background: '#f8fafc' }}>
                            <span>Total Taxable Value:</span>
                            <span>₹{taxableAmount.toFixed(2)}</span>
                        </div>

                        {gstType === 'CGST_SGST' && gstRate > 0 && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 10px', borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                                    <span>CGST ({(gstRate / 2).toFixed(1)}%):</span>
                                    <span>₹{cgstAmount.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 10px', borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                                    <span>SGST ({(gstRate / 2).toFixed(1)}%):</span>
                                    <span>₹{sgstAmount.toFixed(2)}</span>
                                </div>
                            </>
                        )}

                        {gstType === 'IGST' && gstRate > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 10px', borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                                <span>IGST ({gstRate}%):</span>
                                <span>₹{igstAmount.toFixed(2)}</span>
                            </div>
                        )}

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            background: '#0f172a',
                            color: '#ffffff',
                            fontWeight: '800',
                            fontSize: '13px'
                        }}>
                            <span>GRAND TOTAL:</span>
                            <span>₹{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Terms & Conditions */}
                <div style={{
                    borderTop: '1px dashed #94a3b8',
                    paddingTop: '8px',
                    marginBottom: '16px',
                    fontSize: '9.5px',
                    color: '#475569',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.4'
                }}>
                    <div style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '2px' }}>TERMS & CONDITIONS:</div>
                    {docType === 'proforma' 
                        ? (config.proformaTerms || '1. This is a Proforma Invoice / Quotation and not a final Tax Invoice.\n2. Quotation is valid for 15 days from date of issue.\n3. Repairs will commence upon customer approval of this estimate.\n4. Spares subject to market availability.')
                        : (config.invoiceTerms || 'Thank you for choosing Hypertech Digital.\nAll repairs come with standard service warranty unless otherwise stated.')}
                </div>

                {/* Signatures Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '24px', paddingTop: '10px' }}>
                    <div style={{ textAlign: 'center', width: '180px' }}>
                        <div style={{ borderBottom: '1px solid #334155', height: '35px', marginBottom: '4px' }}></div>
                        <div style={{ fontSize: '10.5px', fontWeight: '600', color: '#334155' }}>Customer Signature</div>
                    </div>

                    <div style={{ textAlign: 'center', width: '220px' }}>
                        <div style={{ fontSize: '10.5px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>
                            For {shopName}
                        </div>
                        <div style={{ borderBottom: '1px solid #334155', height: '25px', marginBottom: '4px' }}></div>
                        <div style={{ fontSize: '10.5px', fontWeight: '600', color: '#334155' }}>Authorized Signatory</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const printRoot = document.getElementById('print-root') || document.body;
    return createPortal(modalContent, printRoot);
}
