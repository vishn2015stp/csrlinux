import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import { Printer, Plus, Trash2, FileText, CheckCircle2, User, Wrench, Package, ArrowLeft, Monitor, ShoppingBag, Cpu } from 'lucide-react';
import A4PrintModal from '../components/A4PrintModal';

export default function ProformaInvoice() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Quotation Mode: 'sales' (New Device / Custom PC / Product Sales - No Device Intake)
    //                'service' (Repair / Service Estimate on existing customer device)
    const [quoteMode, setQuoteMode] = useState('sales');

    // Customer state
    const [customerData, setCustomerData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        location: '',
        gstin: ''
    });

    // Product Sales / Custom PC Details (for 'sales' mode)
    const [salesData, setSalesData] = useState({
        title: 'Custom Desktop PC Build',
        category: 'Custom PC',
        notes: 'Includes individual component manufacturer warranty (1 to 3 Years). Free hardware assembly, testing & OS driver setup included.',
        fulfillment: 'Direct Sale / Delivery'
    });

    // Device / Repair Details (for 'service' mode)
    const [jobData, setJobData] = useState({
        itemName: '',
        brand: '',
        model: '',
        serialNo: '',
        issue: 'General service and repair quotation',
        serviceMode: 'On Center'
    });

    // Billing & GST state
    const [serviceFee, setServiceFee] = useState(''); // Assembly labor or service fee
    const [sparesList, setSparesList] = useState([]);
    const [gstType, setGstType] = useState('CGST_SGST'); // 'CGST_SGST' | 'IGST' | 'NONE'
    const [gstRate, setGstRate] = useState(18);

    // Spare parts / component entry state
    const [inventory, setInventory] = useState([]);
    const [selectedInvId, setSelectedInvId] = useState('');
    const [newSpareName, setNewSpareName] = useState('');
    const [newSparePartNo, setNewSparePartNo] = useState('');
    const [newSparePrice, setNewSparePrice] = useState('');
    const [newSpareQty, setNewSpareQty] = useState('1');
    const [newSpareHsn, setNewSpareHsn] = useState('8473');

    // Customer autocomplete state
    const [customers, setCustomers] = useState([]);
    const [matchedCustomers, setMatchedCustomers] = useState([]);

    // Print & Feedback state
    const [printConfig, setPrintConfig] = useState({
        shopName: 'Hypertech Digital',
        shopAddress: '',
        shopPhone: '',
        shopEmail: '',
        shopGstin: '',
        stateName: 'Kerala',
        stateCode: '32',
        defaultGstRate: 18,
        bankName: '',
        accountName: '',
        accountNo: '',
        ifsc: '',
        upiId: '',
        proformaTerms: '1. This is a Proforma Invoice / Quotation and not a final Tax Invoice.\n2. Quotation is valid for 15 days from date of issue.\n3. Orders will be processed upon approval.\n4. Hardware components subject to market availability.'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successProforma, setSuccessProforma] = useState(null);
    const [showPrintModal, setShowPrintModal] = useState(false);

    // Load initial data
    const loadInitialData = async () => {
        try {
            const settings = await api.getSettings();
            if (settings.print_settings) {
                const parsed = JSON.parse(settings.print_settings);
                setPrintConfig(prev => ({ ...prev, ...parsed }));
                if (parsed.defaultGstRate !== undefined) {
                    setGstRate(parseFloat(parsed.defaultGstRate) || 18);
                }
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }

        try {
            const res = await fetch('/api/customers');
            const custs = await res.json();
            setCustomers(custs || []);
        } catch (e) {
            console.error('Failed to load customers:', e);
        }

        try {
            const inv = await api.getInventory();
            setInventory(inv || []);
        } catch (e) {
            console.error('Failed to load inventory:', e);
        }
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    // Handle customer phone autocomplete
    const handlePhoneChange = (val) => {
        setCustomerData(prev => ({ ...prev, phone: val }));
        const clean = val.trim();
        if (clean.length >= 4) {
            const matches = customers.filter(c => c.phone && c.phone.trim().includes(clean));
            setMatchedCustomers(matches);
        } else {
            setMatchedCustomers([]);
        }
    };

    const handleSelectExistingCustomer = (cust) => {
        if (!cust) return;
        setCustomerData(prev => ({
            ...prev,
            name: cust.name || '',
            email: cust.email || '',
            address: cust.address || '',
            location: cust.location || ''
        }));
        setMatchedCustomers([]);
    };

    // Preset selection helper for New Device / Custom PC
    const applySalesPreset = (title, category, defaultNotes, defaultAssembly) => {
        setSalesData({
            title,
            category,
            notes: defaultNotes,
            fulfillment: 'Direct Sale / Delivery'
        });
        if (defaultAssembly !== undefined) {
            setServiceFee(defaultAssembly > 0 ? String(defaultAssembly) : '');
        }
    };

    // Component helper tags for custom build PC
    const handleComponentTagClick = (compLabel, hsnDefault = '8473') => {
        setNewSpareName(`${compLabel}: `);
        setNewSpareHsn(hsnDefault);
        setNewSpareQty('1');
        setSelectedInvId('');
    };

    // Handle inventory item selection
    const handleSelectInventoryItem = (itemId) => {
        setSelectedInvId(itemId);
        if (!itemId) return;
        const item = inventory.find(i => String(i.id) === String(itemId));
        if (item) {
            setNewSpareName(item.name || '');
            setNewSparePartNo(item.part_number || '');
            setNewSparePrice(item.unit_price || '');
            setNewSpareHsn(item.hsn_code || '8473');
            if (item.gst_rate !== undefined) {
                setGstRate(parseFloat(item.gst_rate) || 18);
            }
        }
    };

    // Add spare / item to table
    const handleAddSpare = () => {
        if (!newSpareName.trim()) return;
        const qty = parseInt(newSpareQty) || 1;
        const price = parseFloat(newSparePrice) || 0;
        const itemTotal = qty * price;

        const newSpare = {
            id: selectedInvId || undefined,
            name: newSpareName.trim(),
            part_number: newSparePartNo.trim(),
            unit_price: price,
            qty: qty,
            cost: itemTotal,
            hsn: newSpareHsn.trim() || '8473'
        };

        setSparesList(prev => [...prev, newSpare]);
        setSelectedInvId('');
        setNewSpareName('');
        setNewSparePartNo('');
        setNewSparePrice('');
        setNewSpareQty('1');
        setNewSpareHsn('8473');
    };

    const handleRemoveSpare = (index) => {
        setSparesList(prev => prev.filter((_, i) => i !== index));
    };

    // Live Totals calculation
    const sFee = parseFloat(serviceFee) || 0;
    const sparesTotal = sparesList.reduce((sum, s) => sum + (parseFloat(s.cost) || 0), 0);
    const taxableAmount = sFee + sparesTotal;

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

    // Handle Submit & Generate Proforma Invoice
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!customerData.name.trim() || !customerData.phone.trim()) {
            setError('Please provide customer name and phone number.');
            return;
        }

        if (sparesList.length === 0 && sFee === 0) {
            setError('Please add at least one item, component, or service charge to the quotation.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Find or create customer
            let customerId;
            const existingCust = customers.find(c => 
                c.phone && c.phone.trim() === customerData.phone.trim() &&
                c.name && c.name.trim().toLowerCase() === customerData.name.trim().toLowerCase()
            );

            if (existingCust) {
                customerId = existingCust.id;
                await api.updateCustomer({
                    id: customerId,
                    name: customerData.name,
                    phone: customerData.phone,
                    email: customerData.email,
                    address: customerData.address,
                    location: customerData.location || existingCust.location || ''
                });
            } else {
                customerId = uuidv4();
                await api.createCustomer({
                    id: customerId,
                    name: customerData.name,
                    phone: customerData.phone,
                    email: customerData.email,
                    address: customerData.address,
                    location: customerData.location || '',
                    created_at: new Date().toISOString()
                });
            }

            // 2. Prepare Complaint / Quotation record
            const complaintId = uuidv4();
            const now = new Date().toISOString();
            const year = new Date().getFullYear();
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const proformaNo = `PI-${year}-${randomCode}`;

            const isSales = quoteMode === 'sales';

            const complaintPayload = {
                id: complaintId,
                customer_id: customerId,
                item_name: isSales ? (salesData.title || 'Custom PC Build / New Hardware') : (jobData.itemName || 'Device Service'),
                brand: isSales ? null : (jobData.brand || null),
                model: isSales ? (salesData.category || null) : (jobData.model || null),
                serial_no: isSales ? '—' : (jobData.serialNo || '—'),
                issue: isSales ? (salesData.notes || 'Hardware sales quotation') : (jobData.issue || 'Service and repair quotation'),
                status: isSales ? 'Quotation' : 'Pending',
                service_type: isSales ? 'Sales' : 'In-Shop',
                service_mode: isSales ? salesData.fulfillment : jobData.serviceMode,
                is_device_intaken: isSales ? 0 : 1, // 0 for sales (NO device intaken!), 1 for repairs
                created_at: now,
                created_by: user?.username || 'admin'
            };

            const createdComplaint = await api.createComplaint(complaintPayload);

            // 3. Create Invoice entry in DB with Proforma details
            const invoiceId = uuidv4();
            const invoiceData = {
                id: invoiceId,
                complaint_id: complaintId,
                receipt_number: `INV-${createdComplaint.csr_number ? createdComplaint.csr_number.replace('#', '') : randomCode}`,
                proforma_number: proformaNo,
                service_fees: sFee,
                part_costs: sparesTotal,
                taxable_amount: taxableAmount,
                gst_rate: gstRate,
                gst_type: gstType,
                cgst_amount: cgstAmount,
                sgst_amount: sgstAmount,
                igst_amount: igstAmount,
                grand_total: grandTotal,
                total: grandTotal,
                spares: JSON.stringify(sparesList),
                customer_gstin: customerData.gstin ? customerData.gstin.trim() : null,
                invoice_type: isSales ? 'SALES_PROFORMA' : 'PROFORMA',
                warranty: isSales ? 'Manufacturer Warranty' : '30 Days',
                created_at: now
            };

            await api.createInvoice(invoiceData);

            const proformaPackage = {
                job: {
                    ...createdComplaint,
                    service_type: isSales ? 'Sales' : 'In-Shop',
                    is_device_intaken: isSales ? 0 : 1,
                    created_at: now
                },
                customer: {
                    id: customerId,
                    name: customerData.name,
                    phone: customerData.phone,
                    email: customerData.email,
                    address: customerData.address,
                    gstin: customerData.gstin
                },
                invoice: invoiceData
            };

            setSuccessProforma(proformaPackage);
            setShowPrintModal(true);

        } catch (err) {
            console.error(err);
            setError('Failed to create Proforma Invoice: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetForm = () => {
        setCustomerData({ name: '', phone: '', email: '', address: '', location: '', gstin: '' });
        setSalesData({
            title: 'Custom Desktop PC Build',
            category: 'Custom PC',
            notes: 'Includes individual component manufacturer warranty (1 to 3 Years). Free hardware assembly, testing & OS driver setup included.',
            fulfillment: 'Direct Sale / Delivery'
        });
        setJobData({ itemName: '', brand: '', model: '', serialNo: '', issue: 'General service and repair quotation', serviceMode: 'On Center' });
        setServiceFee('');
        setSparesList([]);
        setGstType('CGST_SGST');
        setGstRate(printConfig.defaultGstRate || 18);
        setSuccessProforma(null);
        setError(null);
    };

    return (
        <div className="container" style={{ maxWidth: '1200px' }}>
            {/* Top Switcher Navigation */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <button
                    onClick={() => navigate('/intake')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '0.65rem 1.25rem',
                        borderBottom: '3px solid transparent',
                        color: 'var(--text-secondary)',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        borderRadius: 0,
                        margin: 0
                    }}
                >
                    📋 New Service Request (Intake)
                </button>
                <button
                    onClick={() => navigate('/proforma')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '0.65rem 1.25rem',
                        borderBottom: '3px solid var(--accent)',
                        color: 'var(--accent)',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        borderRadius: 0,
                        margin: 0
                    }}
                >
                    💼 New Proforma Invoice (GST)
                </button>
            </div>

            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
                        <FileText size={28} color="var(--accent)" />
                        Create Proforma Invoice / Quotation
                    </h1>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                        Generate an official A4 quotation for new devices, custom build PCs, hardware sales, or service estimates.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--panel-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
            </div>

            {/* ── QUOTATION PURPOSE SELECTOR ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                background: '#f6f3eb',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1.5px solid var(--border-color)',
                marginBottom: '1.5rem'
            }}>
                <button
                    type="button"
                    onClick={() => setQuoteMode('sales')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        padding: '0.85rem 1rem',
                        background: quoteMode === 'sales' ? 'var(--panel-bg)' : 'transparent',
                        border: quoteMode === 'sales' ? '2px solid var(--accent)' : '1px solid transparent',
                        borderRadius: '6px',
                        color: quoteMode === 'sales' ? 'var(--accent)' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: quoteMode === 'sales' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    <Monitor size={20} />
                    <div style={{ textAlign: 'left' }}>
                        <div>New Device / Custom PC Build</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
                            No device intake required (Sales quotation for products, new PCs, laptops & spares)
                        </div>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => setQuoteMode('service')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        padding: '0.85rem 1rem',
                        background: quoteMode === 'service' ? 'var(--panel-bg)' : 'transparent',
                        border: quoteMode === 'service' ? '2px solid var(--accent)' : '1px solid transparent',
                        borderRadius: '6px',
                        color: quoteMode === 'service' ? 'var(--accent)' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: quoteMode === 'service' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    <Wrench size={20} />
                    <div style={{ textAlign: 'left' }}>
                        <div>Service & Repair Estimate</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
                            Device taken for service (Quote for repair diagnostics, labor & replacement spares)
                        </div>
                    </div>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(207,102,121,0.15)', color: 'var(--danger)', border: '1px solid rgba(207,102,121,0.3)', borderRadius: '6px', marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            {/* Success Banner (when created) */}
            {successProforma && (
                <div style={{ background: '#f6f3eb', border: '1.5px solid var(--accent)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                <CheckCircle2 size={22} />
                                Proforma Invoice Created Successfully!
                            </div>
                            <div style={{ marginTop: '4px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                <b>Proforma #:</b> {successProforma.invoice.proforma_number} &nbsp;|&nbsp; 
                                <b>Customer:</b> {successProforma.customer.name} ({successProforma.customer.phone}) &nbsp;|&nbsp; 
                                <b>Total:</b> ₹{successProforma.invoice.grand_total.toFixed(2)}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setShowPrintModal(true)}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.65rem 1.25rem', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                <Printer size={16} /> Print / Preview A4
                            </button>
                            <button
                                onClick={handleResetForm}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.65rem 1rem', background: 'var(--panel-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                Create Another
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    
                    {/* Section 1: Customer Information */}
                    <div className="card" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.65rem', marginBottom: '1rem' }}>
                            <User size={18} color="var(--accent)" />
                            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>1. Customer Details</h3>
                        </div>

                        {/* Phone with Auto-lookup */}
                        <div style={{ marginBottom: '0.85rem', position: 'relative' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Customer Phone Number *</label>
                            <input
                                type="text"
                                required
                                value={customerData.phone}
                                onChange={e => handlePhoneChange(e.target.value)}
                                placeholder="Enter phone number..."
                                style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box' }}
                            />
                            {matchedCustomers.length > 0 && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: 'var(--panel-bg)', border: '1px solid var(--accent)', borderRadius: '6px', marginTop: '4px', boxShadow: '0 6px 16px rgba(0,0,0,0.4)', maxHeight: '180px', overflowY: 'auto' }}>
                                    <div style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 'bold', borderBottom: '1px solid var(--border-color)' }}>
                                        Matching Existing Customers (Click to Autofill):
                                    </div>
                                    {matchedCustomers.map(c => (
                                        <div
                                            key={c.id}
                                            onClick={() => handleSelectExistingCustomer(c)}
                                            style={{ padding: '8px 10px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                                        >
                                            <div style={{ fontWeight: 'bold' }}>{c.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.phone} {c.address ? `• ${c.address}` : ''}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Customer Name */}
                        <div style={{ marginBottom: '0.85rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Customer / Company Name *</label>
                            <input
                                type="text"
                                required
                                value={customerData.name}
                                onChange={e => setCustomerData({ ...customerData, name: e.target.value })}
                                placeholder="e.g. John Doe / Apex Corp"
                                style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box' }}
                            />
                        </div>

                        {/* Customer GSTIN */}
                        <div style={{ marginBottom: '0.85rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Customer GSTIN (Optional)</label>
                            <input
                                type="text"
                                value={customerData.gstin}
                                onChange={e => setCustomerData({ ...customerData, gstin: e.target.value.toUpperCase() })}
                                placeholder="e.g. 32AAAAA0000A1Z5"
                                style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box', fontFamily: 'monospace' }}
                            />
                        </div>

                        {/* Email & Location */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '0.85rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Email</label>
                                <input
                                    type="email"
                                    value={customerData.email}
                                    onChange={e => setCustomerData({ ...customerData, email: e.target.value })}
                                    placeholder="customer@email.com"
                                    style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Location / City</label>
                                <input
                                    type="text"
                                    value={customerData.location}
                                    onChange={e => setCustomerData({ ...customerData, location: e.target.value })}
                                    placeholder="e.g. Kollam"
                                    style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Billing Address</label>
                            <textarea
                                rows={2}
                                value={customerData.address}
                                onChange={e => setCustomerData({ ...customerData, address: e.target.value })}
                                placeholder="Full street address, building, pincode..."
                                style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box', resize: 'vertical' }}
                            />
                        </div>
                    </div>

                    {/* Section 2: Quotation Subject / Scope */}
                    <div className="card" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.65rem', marginBottom: '1rem' }}>
                            {quoteMode === 'sales' ? <ShoppingBag size={18} color="var(--accent)" /> : <Wrench size={18} color="var(--accent)" />}
                            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                                {quoteMode === 'sales' ? '2. Quotation Subject (No Device Intake)' : '2. Device Details (Intake for Service)'}
                            </h3>
                        </div>

                        {quoteMode === 'sales' ? (
                            <>
                                {/* Quick Preset Buttons */}
                                <div style={{ marginBottom: '0.85rem' }}>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Quick Presets (Click to Load):</label>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {[
                                            { label: '🖥️ Custom Build PC', title: 'Custom Desktop PC Build', cat: 'Custom PC', notes: 'Components carry 1-3 Years Manufacturer Warranty. Assembly, burn-in testing & OS setup included.', fee: 1000 },
                                            { label: '💼 Office Desktop PC', title: 'Intel Core i5 Office Desktop PC', cat: 'Desktop PC', notes: 'Standard 3 Years Manufacturer Warranty on components. Pre-configured & ready to use.', fee: 500 },
                                            { label: '💻 New Laptop Sale', title: 'New Laptop Package', cat: 'Laptop', notes: '1 Year Onsite Brand Warranty + Free initial setup and driver installation.', fee: 0 },
                                            { label: '🖨️ Printer & Supplies', title: 'Multifunction Laser/Tank Printer', cat: 'Printer', notes: '1 Year Standard Brand Warranty. Includes initial starter ink/toner pack.', fee: 0 },
                                            { label: '📹 CCTV Setup', title: 'Security CCTV & DVR System', cat: 'CCTV / Security', notes: 'Includes 2 Years Camera & DVR Warranty, complete cabling & remote viewing setup.', fee: 1500 },
                                            { label: '📦 Hardware Components', title: 'Computer Hardware & Peripherals', cat: 'Components', notes: 'Standard manufacturer warranty applicable on all items.', fee: 0 }
                                        ].map(preset => (
                                            <button
                                                key={preset.label}
                                                type="button"
                                                onClick={() => applySalesPreset(preset.title, preset.cat, preset.notes, preset.fee)}
                                                style={{
                                                    background: salesData.title === preset.title ? 'var(--accent)' : 'var(--bg-color)',
                                                    color: salesData.title === preset.title ? '#000' : 'var(--text-primary)',
                                                    border: '1px solid var(--border-color)',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.78rem',
                                                    cursor: 'pointer',
                                                    fontWeight: salesData.title === preset.title ? 'bold' : 'normal'
                                                }}
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quotation Title */}
                                <div style={{ marginBottom: '0.85rem' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Quotation Title / Configuration Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={salesData.title}
                                        onChange={e => setSalesData({ ...salesData, title: e.target.value })}
                                        placeholder="e.g. Custom Gaming PC (Core i7 / 16GB / RTX 4060)"
                                        style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box', fontWeight: 'bold' }}
                                    />
                                </div>

                                {/* Category & Fulfillment Mode */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '0.85rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Category</label>
                                        <select
                                            value={salesData.category}
                                            onChange={e => setSalesData({ ...salesData, category: e.target.value })}
                                            style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box', cursor: 'pointer' }}
                                        >
                                            <option value="Custom PC">Custom PC Build</option>
                                            <option value="Laptop">New Laptop</option>
                                            <option value="Desktop PC">Branded Desktop PC</option>
                                            <option value="Printer">Printer / Scanner</option>
                                            <option value="CCTV / Security">CCTV & Surveillance</option>
                                            <option value="Components">Hardware Components</option>
                                            <option value="Networking">Networking Equipment</option>
                                            <option value="General">General Merchandise</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Delivery / Fulfillment</label>
                                        <select
                                            value={salesData.fulfillment}
                                            onChange={e => setSalesData({ ...salesData, fulfillment: e.target.value })}
                                            style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box', cursor: 'pointer' }}
                                        >
                                            <option value="Direct Sale / Delivery">Direct Sale / In-Store Pickup</option>
                                            <option value="On-Site Delivery & Setup">On-Site Delivery & Installation</option>
                                            <option value="Courier / Dispatch">Courier / Freight Dispatch</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Quotation Scope / Warranty Notes */}
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Quotation Notes / Warranty Terms</label>
                                    <textarea
                                        rows={3}
                                        value={salesData.notes}
                                        onChange={e => setSalesData({ ...salesData, notes: e.target.value })}
                                        placeholder="Warranty details, payment schedule, delivery timeline..."
                                        style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box', resize: 'vertical' }}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Device / Item Name */}
                                <div style={{ marginBottom: '0.85rem' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Item / Device Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={jobData.itemName}
                                        onChange={e => setJobData({ ...jobData, itemName: e.target.value })}
                                        placeholder="e.g. Dell Inspiron 15 / Canon LBP 2900"
                                        style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box' }}
                                    />
                                </div>

                                {/* Brand & Model */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '0.85rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Brand</label>
                                        <input
                                            type="text"
                                            value={jobData.brand}
                                            onChange={e => setJobData({ ...jobData, brand: e.target.value })}
                                            placeholder="e.g. Dell, HP, Canon"
                                            style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Model / Spec</label>
                                        <input
                                            type="text"
                                            value={jobData.model}
                                            onChange={e => setJobData({ ...jobData, model: e.target.value })}
                                            placeholder="e.g. Core i5 11th Gen"
                                            style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                {/* Serial Number & Service Mode */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '0.85rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Serial Number</label>
                                        <input
                                            type="text"
                                            value={jobData.serialNo}
                                            onChange={e => setJobData({ ...jobData, serialNo: e.target.value.toUpperCase() })}
                                            placeholder="e.g. 5CD1234XYZ or —"
                                            style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Service Mode</label>
                                        <select
                                            value={jobData.serviceMode}
                                            onChange={e => setJobData({ ...jobData, serviceMode: e.target.value })}
                                            style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box', cursor: 'pointer' }}
                                        >
                                            <option value="On Center">On Center (Carry-in)</option>
                                            <option value="On-Site">On-Site Service</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Scope of Work / Estimated Repairs */}
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Reported Problem / Proposed Repairs</label>
                                    <textarea
                                        rows={3}
                                        value={jobData.issue}
                                        onChange={e => setJobData({ ...jobData, issue: e.target.value })}
                                        placeholder="Describe the diagnosis, proposed repair work, upgrades, or servicing..."
                                        style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box', resize: 'vertical' }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Section 3: Billing, Components, Spares & GST Breakdown */}
                <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.65rem', marginBottom: '1rem' }}>
                        <Package size={18} color="var(--accent)" />
                        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                            {quoteMode === 'sales' ? '3. Hardware Components, Products & Assembly Fee' : '3. Spares, Labor Charges & GST Calculation'}
                        </h3>
                    </div>

                    {/* Labor / Assembly Charge */}
                    <div style={{ maxWidth: '380px', marginBottom: '1.25rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            {quoteMode === 'sales' ? 'Assembly, Testing & Installation Charges (₹)' : 'Service / Labor Charge (₹)'}
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={serviceFee}
                            onChange={e => setServiceFee(e.target.value)}
                            placeholder={quoteMode === 'sales' ? 'Optional (e.g. 500 or 0)' : 'e.g. 500'}
                            style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1rem', fontWeight: 'bold' }}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                            {quoteMode === 'sales' ? 'Enter 0 or leave empty if assembly is free or not applicable.' : 'Technician diagnostic & repair labor charges.'}
                        </div>
                    </div>

                    {/* Items / Spares Entry Box */}
                    <div style={{ background: '#f6f3eb', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Plus size={16} color="var(--accent)" /> 
                            {quoteMode === 'sales' ? 'Add Item / Hardware Component to Quotation' : 'Add Spare Parts to Quotation'}
                        </div>

                        {/* Custom PC Component Quick-Tags (Shown in Sales Mode) */}
                        {quoteMode === 'sales' && (
                            <div style={{ marginBottom: '0.75rem' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Cpu size={14} color="var(--accent)" />
                                    <b>Custom PC Build Component Helpers</b> (Click to quickly prefix item):
                                </div>
                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                    {[
                                        { label: 'Processor (CPU)', hsn: '8473' },
                                        { label: 'Motherboard', hsn: '8473' },
                                        { label: 'RAM Memory', hsn: '8473' },
                                        { label: 'SSD / Storage', hsn: '8471' },
                                        { label: 'Graphics Card (GPU)', hsn: '8473' },
                                        { label: 'Power Supply (SMPS)', hsn: '8504' },
                                        { label: 'Cabinet / Case', hsn: '8473' },
                                        { label: 'Monitor Display', hsn: '8528' },
                                        { label: 'Keyboard & Mouse', hsn: '8471' },
                                        { label: 'UPS Backup', hsn: '8504' }
                                    ].map(tag => (
                                        <button
                                            key={tag.label}
                                            type="button"
                                            onClick={() => handleComponentTagClick(tag.label, tag.hsn)}
                                            style={{
                                                background: 'rgba(0,0,0,0.05)',
                                                border: '1px dashed var(--border-color)',
                                                padding: '3px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.74rem',
                                                cursor: 'pointer',
                                                color: 'var(--text-primary)'
                                            }}
                                        >
                                            + {tag.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Inventory Dropdown Selector */}
                        <div style={{ marginBottom: '0.75rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>
                                Pick from Catalog / Stock Inventory (Optional):
                            </label>
                            <select
                                value={selectedInvId}
                                onChange={e => handleSelectInventoryItem(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.88rem' }}
                            >
                                <option value="">-- Choose from inventory stock ({inventory.length} items cataloged) --</option>
                                {inventory.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} {item.part_number ? `(${item.part_number})` : ''} - ₹{item.unit_price} [Stock: {item.quantity}]
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Part entry inputs */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', alignItems: 'flex-end' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Item / Component Name *</label>
                                <input
                                    type="text"
                                    value={newSpareName}
                                    onChange={e => setNewSpareName(e.target.value)}
                                    placeholder={quoteMode === 'sales' ? "e.g. Intel Core i5 12400F Processor" : "e.g. 512GB NVMe SSD"}
                                    style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.85rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Unit Price (₹) *</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={newSparePrice}
                                    onChange={e => setNewSparePrice(e.target.value)}
                                    placeholder="₹ 0.00"
                                    style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.85rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Qty</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={newSpareQty}
                                    onChange={e => setNewSpareQty(e.target.value)}
                                    placeholder="1"
                                    style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.85rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>HSN/SAC</label>
                                <input
                                    type="text"
                                    value={newSpareHsn}
                                    onChange={e => setNewSpareHsn(e.target.value)}
                                    placeholder="8473"
                                    style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.85rem' }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddSpare}
                                style={{ padding: '0.55rem 1.25rem', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', height: '36px' }}
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Spares / Components Table */}
                    {sparesList.length > 0 ? (
                        <div className="table-responsive" style={{ marginBottom: '1.25rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                                <thead>
                                    <tr style={{ background: '#f6f3eb', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                        <th style={{ padding: '0.6rem 0.75rem' }}>#</th>
                                        <th style={{ padding: '0.6rem 0.75rem' }}>Description of Goods / Components</th>
                                        <th style={{ padding: '0.6rem 0.75rem' }}>HSN</th>
                                        <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Qty</th>
                                        <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Unit Rate (₹)</th>
                                        <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Total (₹)</th>
                                        <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sparesList.map((s, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>{idx + 1}</td>
                                            <td style={{ padding: '0.6rem 0.75rem', fontWeight: '600' }}>
                                                {s.name}
                                                {s.part_number && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '6px' }}>({s.part_number})</span>}
                                            </td>
                                            <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'monospace' }}>{s.hsn || '8473'}</td>
                                            <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>{s.qty || 1}</td>
                                            <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>₹{parseFloat(s.unit_price || 0).toFixed(2)}</td>
                                            <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 'bold' }}>₹{parseFloat(s.cost || 0).toFixed(2)}</td>
                                            <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSpare(idx)}
                                                    style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '2px 6px' }}
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                            {quoteMode === 'sales' 
                                ? 'No components or hardware items added yet. Click component helpers or use the dropdown to add items.'
                                : 'No spare parts added to this quote yet. You can add parts above or proceed with service charges only.'}
                        </div>
                    )}

                    {/* GST Settings & Summary Box */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', background: '#f6f3eb', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        {/* GST Configuration */}
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>GST Tax Settings</div>
                            <div style={{ marginBottom: '0.75rem' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Tax Type</label>
                                <select
                                    value={gstType}
                                    onChange={e => setGstType(e.target.value)}
                                    style={{ width: '100%', padding: '0.55rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                    <option value="CGST_SGST">Intra-State: CGST + SGST (50/50 Split)</option>
                                    <option value="IGST">Inter-State: IGST (Full Tax)</option>
                                    <option value="NONE">Exempt / No GST (0%)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>GST Rate (%)</label>
                                <select
                                    value={gstRate}
                                    disabled={gstType === 'NONE'}
                                    onChange={e => setGstRate(parseFloat(e.target.value))}
                                    style={{ width: '100%', padding: '0.55rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                    <option value="18">18% (Standard Hardware & Tech Services)</option>
                                    <option value="12">12% (Electronics / Selected Hardware)</option>
                                    <option value="5">5% (Special / Concessional)</option>
                                    <option value="0">0% (Nil Rated)</option>
                                </select>
                            </div>
                        </div>

                        {/* Quotation Summary */}
                        <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Quotation Total Summary</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.88rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    {quoteMode === 'sales' ? 'Goods / Hardware Total:' : 'Spare Parts Total:'}
                                </span>
                                <span>₹{sparesTotal.toFixed(2)}</span>
                            </div>
                            {sFee > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.88rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>
                                        {quoteMode === 'sales' ? 'Assembly & Testing Fee:' : 'Service / Labor Charge:'}
                                    </span>
                                    <span>₹{sFee.toFixed(2)}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem', borderTop: '1px solid var(--border-color)', paddingTop: '4px', fontWeight: '600' }}>
                                <span>Taxable Total:</span>
                                <span>₹{taxableAmount.toFixed(2)}</span>
                            </div>
                            {gstType === 'CGST_SGST' && gstRate > 0 && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <span>CGST ({(gstRate / 2)}%):</span>
                                        <span>₹{cgstAmount.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <span>SGST ({(gstRate / 2)}%):</span>
                                        <span>₹{sgstAmount.toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                            {gstType === 'IGST' && gstRate > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <span>IGST ({gstRate}%):</span>
                                    <span>₹{igstAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '2px solid var(--border-color)', fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                                <span>Grand Total:</span>
                                <span>₹{grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Actions */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '0.85rem 2rem',
                            background: 'var(--accent)',
                            color: '#000',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        <Printer size={18} />
                        {loading ? 'Generating Quotation...' : 'Generate & Print Proforma Invoice (A4)'}
                    </button>
                    <button
                        type="button"
                        onClick={handleResetForm}
                        style={{
                            padding: '0.85rem 1.5rem',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Reset Form
                    </button>
                </div>
            </form>

            {/* A4 Print Modal */}
            {successProforma && (
                <A4PrintModal
                    isOpen={showPrintModal}
                    onClose={() => setShowPrintModal(false)}
                    initialDocType="proforma"
                    job={successProforma.job}
                    customer={successProforma.customer}
                    invoice={successProforma.invoice}
                    config={printConfig}
                />
            )}
        </div>
    );
}
