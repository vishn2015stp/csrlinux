import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { X, Save, Printer, ArrowLeftRight, FileText, PackagePlus, Receipt } from 'lucide-react';
import A4PrintModal from './A4PrintModal';

export default function JobDetailModal({ jobId, onClose, onRefresh }) {
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [newLog, setNewLog] = useState('');
    const [logs, setLogs] = useState([]);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [printDocType, setPrintDocType] = useState('service_report');
    const [invoice, setInvoice] = useState({
        service_fees: 0,
        part_costs: 0,
        spares: '',
        warranty: '',
        total: 0,
        taxable_amount: 0,
        gst_rate: 18,
        gst_type: 'CGST_SGST',
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 0,
        grand_total: 0,
        proforma_number: '',
        customer_gstin: '',
        invoice_type: 'Service Report'
    });
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
        showTechnician: true,
        showSerialNo: true,
        showCustomerPhone: true,
        invoiceTerms: 'Thank you for choosing Hypertech Digital.\nAll repairs come with a standard 30-day warranty unless otherwise stated.',
        proformaTerms: '1. This is a Proforma Invoice / Quotation and not a final Tax Invoice.\n2. Quotation is valid for 15 days from date of issue.\n3. Repairs will commence upon customer approval of this estimate.\n4. Spares subject to market availability.'
    });

    // Product editing states
    const [isEditingProduct, setIsEditingProduct] = useState(false);
    const [editItemName, setEditItemName] = useState('');
    const [editSerialNo, setEditSerialNo] = useState('');
    const [editBrand, setEditBrand] = useState('');
    const [editModel, setEditModel] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editAccessories, setEditAccessories] = useState('');
    const [editIssue, setEditIssue] = useState('');
    const [editIsIntaken, setEditIsIntaken] = useState(false);

    // Inventory and spares states
    const [inventoryList, setInventoryList] = useState([]);
    const [selectedInventoryId, setSelectedInventoryId] = useState('');
    const [newSpareName, setNewSpareName] = useState('');
    const [newSpareCost, setNewSpareCost] = useState('');
    const [newSpareHsn, setNewSpareHsn] = useState('8473');
    const [newSpareQty, setNewSpareQty] = useState(1);
    const [newSpareGstRate, setNewSpareGstRate] = useState(18);

    const isDelivered = job?.status?.trim().toLowerCase() === 'delivered' || job?.status?.trim().toLowerCase() === 'completed' || job?.status?.trim().toLowerCase() === 'returned';

    useEffect(() => {
        const load = async () => {
            const j = await api.getComplaint(jobId);
            if (j) {
                setJob(j);
                const c = await api.getCustomer(j.customer_id);
                setCustomer(c);
                setEditItemName(j.item_name || '');
                setEditSerialNo(j.serial_no || '');
                setEditBrand(j.brand || '');
                setEditModel(j.model || '');
                setEditPassword(j.password || '');
                setEditAccessories(j.accessories || '');
                setEditIssue(j.issue || '');
                setEditIsIntaken(j.is_device_intaken === 1);
            }
            const sLogs = await api.getServiceRecords(jobId);
            setLogs(sLogs); // api returns desc

            // Fetch invoice/billing records
            try {
                const invoices = await api.getInvoices(jobId);
                if (invoices && invoices.length > 0) {
                    setInvoice(prev => ({
                        ...prev,
                        ...invoices[0],
                        gst_rate: invoices[0].gst_rate !== undefined ? invoices[0].gst_rate : 18,
                        gst_type: invoices[0].gst_type || 'CGST_SGST'
                    }));
                }
            } catch (err) {
                console.error('Error fetching invoice:', err);
            }

            // Fetch inventory items
            try {
                const inv = await api.getInventory();
                setInventoryList(inv || []);
            } catch (err) {
                console.error('Error fetching inventory:', err);
            }

            try {
                const settings = await api.getSettings();
                if (settings.print_settings) {
                    const parsed = JSON.parse(settings.print_settings);
                    setPrintConfig(prev => ({ ...prev, ...parsed }));
                    if (parsed.defaultGstRate) {
                        setInvoice(prev => ({
                            ...prev,
                            gst_rate: prev.gst_rate !== undefined ? prev.gst_rate : parsed.defaultGstRate
                        }));
                    }
                }
            } catch (e) {}
        };
        load();
    }, [jobId]);

    const handleSaveProduct = async () => {
        try {
            const updates = {
                item_name: editItemName,
                serial_no: editSerialNo,
                brand: editBrand || null,
                model: editModel || null,
                password: editPassword || null,
                accessories: editAccessories || null,
                issue: editIssue,
                is_device_intaken: job.is_device_intaken === 1 ? 1 : (editIsIntaken ? 1 : 0)
            };

            const justIntaken = job.is_device_intaken === 0 && updates.is_device_intaken === 1;
            if (justIntaken) {
                updates.status = 'Intaken';
            }

            // Detect and log edited fields
            const changes = [];
            if ((job.item_name || '').trim() !== (editItemName || '').trim()) {
                changes.push(`Item Name from "${job.item_name || '—'}" to "${editItemName}"`);
            }
            if ((job.serial_no || '').trim() !== (editSerialNo || '').trim()) {
                changes.push(`Serial No from "${job.serial_no || '—'}" to "${editSerialNo}"`);
            }
            if ((job.brand || '').trim() !== (editBrand || '').trim()) {
                changes.push(`Brand from "${job.brand || '—'}" to "${editBrand}"`);
            }
            if ((job.model || '').trim() !== (editModel || '').trim()) {
                changes.push(`Model from "${job.model || '—'}" to "${editModel}"`);
            }
            if ((job.password || '').trim() !== (editPassword || '').trim()) {
                changes.push(`Password updated`);
            }
            if ((job.accessories || '').trim() !== (editAccessories || '').trim()) {
                changes.push(`Accessories from "${job.accessories || '—'}" to "${editAccessories}"`);
            }
            if ((job.issue || '').trim() !== (editIssue || '').trim()) {
                changes.push(`Issue Description from "${job.issue || '—'}" to "${editIssue}"`);
            }
            if (job.is_device_intaken === 0 && editIsIntaken) {
                changes.push('Device Intaken from "No" to "Yes"');
            }

            await api.updateComplaint(jobId, updates);
            setJob(prev => ({
                ...prev,
                ...updates
            }));
            setIsEditingProduct(false);

            if (changes.length > 0) {
                await api.createServiceRecord({
                    complaint_id: jobId,
                    technician: user?.username || 'Unknown',
                    issues: `Edited request details: ${changes.join(', ')}`,
                    resolution_status: 'Details Updated'
                });
            }

            if (justIntaken) {
                await api.createStatusLog({
                    complaint_id: jobId,
                    status: 'Intaken',
                    technician: user?.username || 'Unknown'
                });

                await api.createServiceRecord({
                    complaint_id: jobId,
                    technician: user?.username || 'Unknown',
                    issues: `Device intaken for service (Status: Intaken)`,
                    resolution_status: 'Intaken'
                });
            }

            const sLogs = await api.getServiceRecords(jobId);
            setLogs(sLogs);

            if (onRefresh) onRefresh();
            alert("Product details updated successfully!");
        } catch (err) {
            alert("Failed to update product details: " + err.message);
        }
    };

    const handleQuickIntake = async () => {
        try {
            const updates = {
                is_device_intaken: 1,
                status: 'Intaken'
            };
            await api.updateComplaint(jobId, updates);
            setJob(prev => ({
                ...prev,
                is_device_intaken: 1,
                status: 'Intaken'
            }));
            setEditIsIntaken(true);

            await api.createStatusLog({
                complaint_id: jobId,
                status: 'Intaken',
                technician: user?.username || 'Unknown'
            });

            await api.createServiceRecord({
                complaint_id: jobId,
                technician: user?.username || 'Unknown',
                issues: `Device intaken for service (Status: Intaken)`,
                resolution_status: 'Intaken'
            });

            const sLogs = await api.getServiceRecords(jobId);
            setLogs(sLogs);

            if (onRefresh) onRefresh();
            alert("Device marked as Taken for Service! Status updated to Intaken.");
        } catch (err) {
            alert("Failed to update status: " + err.message);
        }
    };

    const handleStatusChange = async (e) => {
        if (isDelivered) {
            alert("This job is already completed/delivered and cannot be edited.");
            return;
        }
        let newStatus = e.target.value;
        
        if (newStatus === 'Delivered' && job?.status?.trim().toLowerCase() === 'return') {
            newStatus = 'Returned';
        }

        if (newStatus === 'Delivered' || newStatus === 'Completed' || newStatus === 'Returned') {
            const confirmMsg = newStatus === 'Completed'
                ? "Are you sure you want to mark this request as Completed? Once marked as Completed, you will no longer be able to edit this request or its billing."
                : `Are you sure you want to mark this request as ${newStatus}? Once marked as ${newStatus}, you will no longer be able to edit this request or its billing.`;
            const confirmAction = window.confirm(confirmMsg);
            if (!confirmAction) {
                e.target.value = job.status;
                return;
            }
            const captchaCode = Math.floor(1000 + Math.random() * 9000).toString();
            const captchaPrompt = window.prompt(`To confirm marking as ${newStatus}, please type the verification code: ${captchaCode}`);
            if (captchaPrompt !== captchaCode) {
                alert("Verification failed. Action cancelled.");
                e.target.value = job.status;
                return;
            }
        }
        await api.updateComplaint(jobId, { status: newStatus });
        setJob(prev => ({ ...prev, status: newStatus }));
        
        await api.createStatusLog({
            complaint_id: jobId,
            status: newStatus,
            technician: user?.username || 'Unknown'
        });

        await api.createServiceRecord({
            complaint_id: jobId,
            technician: user?.username || 'Unknown',
            issues: `Status updated to: ${newStatus}`,
            resolution_status: newStatus
        });
        
        const sLogs = await api.getServiceRecords(jobId);
        setLogs(sLogs);

        if (onRefresh) onRefresh();
    };

    const handleWarrantyStatusChange = async (e) => {
        const newWStatus = e.target.value;
        try {
            await api.updateComplaint(jobId, { warranty_status: newWStatus });
            setJob(prev => ({ ...prev, warranty_status: newWStatus }));

            await api.createStatusLog({
                complaint_id: jobId,
                status: `Warranty (${newWStatus})`,
                technician: user?.username || 'Unknown'
            });

            await api.createServiceRecord({
                complaint_id: jobId,
                technician: user?.username || 'Unknown',
                issues: `Warranty status updated to: ${newWStatus}`,
                resolution_status: `Warranty: ${newWStatus}`
            });

            const sLogs = await api.getServiceRecords(jobId);
            setLogs(sLogs);

            if (onRefresh) onRefresh();
        } catch (err) {
            alert("Failed to update warranty status: " + err.message);
        }
    };

    const getSparesList = () => {
        if (!invoice.spares) return [];
        if (invoice.spares.startsWith('[')) {
            try {
                return JSON.parse(invoice.spares);
            } catch (e) {
                return [{ name: invoice.spares, cost: parseFloat(invoice.part_costs) || 0 }];
            }
        }
        return [{ name: invoice.spares, cost: parseFloat(invoice.part_costs) || 0 }];
    };

    const sparesList = getSparesList();

    const handleSelectInventory = (itemId) => {
        setSelectedInventoryId(itemId);
        if (!itemId) return;
        const found = inventoryList.find(i => i.id === itemId);
        if (found) {
            setNewSpareName(found.name || '');
            setNewSpareCost(found.unit_price || 0);
            setNewSpareHsn(found.hsn_code || '8473');
            setNewSpareGstRate(found.gst_rate !== undefined ? found.gst_rate : 18);
        }
    };

    const handleAddSpare = () => {
        if (!newSpareName.trim()) return;
        const unitPrice = parseFloat(newSpareCost) || 0;
        const qty = parseInt(newSpareQty, 10) || 1;
        const totalCost = unitPrice * qty;
        const newSpare = {
            name: newSpareName.trim(),
            unit_price: unitPrice,
            qty: qty,
            cost: totalCost,
            hsn: newSpareHsn || '8473',
            gst_rate: parseFloat(newSpareGstRate) || 18,
            inventory_id: selectedInventoryId || null
        };
        const updatedList = [...sparesList, newSpare];
        const newPartCosts = updatedList.reduce((sum, s) => {
            const itemQty = parseFloat(s.qty) || 1;
            const itemPrice = s.unit_price !== undefined ? parseFloat(s.unit_price) : (parseFloat(s.cost) || 0);
            return sum + (s.cost !== undefined && s.unit_price === undefined ? parseFloat(s.cost) : (itemQty * itemPrice));
        }, 0);

        const serviceFees = parseFloat(invoice.service_fees) || 0;
        const taxable = serviceFees + newPartCosts;
        const gstRateVal = invoice.gst_rate !== undefined ? parseFloat(invoice.gst_rate) : 18;
        const gstTypeVal = invoice.gst_type || 'CGST_SGST';
        const totalTax = gstTypeVal === 'NONE' ? 0 : Math.round((taxable * gstRateVal / 100) * 100) / 100;
        const finalGrandTotal = taxable + totalTax;

        setInvoice(prev => ({
            ...prev,
            spares: JSON.stringify(updatedList),
            part_costs: newPartCosts,
            taxable_amount: taxable,
            grand_total: finalGrandTotal,
            total: finalGrandTotal
        }));
        setNewSpareName('');
        setNewSpareCost('');
        setSelectedInventoryId('');
        setNewSpareQty(1);
    };

    const handleRemoveSpare = (index) => {
        const updatedList = sparesList.filter((_, idx) => idx !== index);
        const newPartCosts = updatedList.reduce((sum, s) => {
            const itemQty = parseFloat(s.qty) || 1;
            const itemPrice = s.unit_price !== undefined ? parseFloat(s.unit_price) : (parseFloat(s.cost) || 0);
            return sum + (s.cost !== undefined && s.unit_price === undefined ? parseFloat(s.cost) : (itemQty * itemPrice));
        }, 0);

        const serviceFees = parseFloat(invoice.service_fees) || 0;
        const taxable = serviceFees + newPartCosts;
        const gstRateVal = invoice.gst_rate !== undefined ? parseFloat(invoice.gst_rate) : 18;
        const gstTypeVal = invoice.gst_type || 'CGST_SGST';
        const totalTax = gstTypeVal === 'NONE' ? 0 : Math.round((taxable * gstRateVal / 100) * 100) / 100;
        const finalGrandTotal = taxable + totalTax;

        setInvoice(prev => ({
            ...prev,
            spares: updatedList.length > 0 ? JSON.stringify(updatedList) : '',
            part_costs: newPartCosts,
            taxable_amount: taxable,
            grand_total: finalGrandTotal,
            total: finalGrandTotal
        }));
    };

    const handleAddLog = async () => {
        if (isDelivered) {
            alert("This job is already delivered and cannot be edited.");
            return;
        }
        if (!newLog.trim()) return;
        await api.createServiceRecord({
            complaint_id: jobId,
            technician: user?.username || 'Unknown',
            issues: newLog,
            resolution_status: 'Update'
        });
        setNewLog('');
        const sLogs = await api.getServiceRecords(jobId);
        setLogs(sLogs);
    };

    const handleSaveInvoice = async () => {
        if (isDelivered) {
            alert("This job is already delivered and cannot be edited.");
            return;
        }
        try {
            const serviceFees = parseFloat(invoice.service_fees) || 0;
            const partCosts = parseFloat(invoice.part_costs) || 0;
            const taxable = serviceFees + partCosts;
            const gstRateVal = invoice.gst_rate !== undefined ? parseFloat(invoice.gst_rate) : 18;
            const gstTypeVal = invoice.gst_type || 'CGST_SGST';

            let cgst = 0;
            let sgst = 0;
            let igst = 0;
            if (gstTypeVal === 'CGST_SGST' && gstRateVal > 0) {
                cgst = Math.round((taxable * (gstRateVal / 2) / 100) * 100) / 100;
                sgst = Math.round((taxable * (gstRateVal / 2) / 100) * 100) / 100;
            } else if (gstTypeVal === 'IGST' && gstRateVal > 0) {
                igst = Math.round((taxable * gstRateVal / 100) * 100) / 100;
            }
            const totalTax = cgst + sgst + igst;
            const grandTotalVal = taxable + totalTax;

            const csrNum = job.csr_number || job.id.split('-')[0].toUpperCase();
            const profNum = invoice.proforma_number || `PI-${new Date().getFullYear()}-${csrNum.replace('#', '')}`;
            const recNum = invoice.receipt_number || `INV-${csrNum.replace('#', '')}`;

            const saved = await api.createInvoice({
                complaint_id: jobId,
                receipt_number: recNum,
                proforma_number: profNum,
                service_fees: serviceFees,
                part_costs: partCosts,
                taxable_amount: taxable,
                gst_rate: gstRateVal,
                gst_type: gstTypeVal,
                cgst_amount: cgst,
                sgst_amount: sgst,
                igst_amount: igst,
                grand_total: grandTotalVal,
                total: grandTotalVal,
                spares: invoice.spares || '',
                warranty: invoice.warranty || '',
                customer_gstin: invoice.customer_gstin || '',
                invoice_type: invoice.invoice_type || 'Service Report'
            });
            
            setInvoice(saved);
            alert("Billing, inventory & GST details saved successfully!");
        } catch (err) {
            alert("Failed to save billing details: " + err.message);
        }
    };

    const markAsReturned = async () => {
        if (window.confirm("Mark this device as returned to the customer?")) {
            const captchaCode = Math.floor(1000 + Math.random() * 9000).toString();
            const captchaPrompt = window.prompt(`To confirm returning this device, please type the verification code: ${captchaCode}`);
            if (captchaPrompt !== captchaCode) {
                alert("Verification failed. Action cancelled.");
                return;
            }
            await api.updateComplaint(jobId, { flag_r: true, status: 'Returned' });
            setJob(prev => ({ ...prev, status: 'Returned' }));

            // Log completion timestamp
            await api.createStatusLog({
                complaint_id: jobId,
                status: 'Returned',
                technician: user?.username || 'Unknown'
            });

            await api.createServiceRecord({
                complaint_id: jobId,
                technician: user?.username || 'Unknown',
                issues: `Device returned to customer (Status: Returned)`,
                resolution_status: 'Returned'
            });

            const sLogs = await api.getServiceRecords(jobId);
            setLogs(sLogs);

            if (onRefresh) onRefresh();
            alert("Returned successfully.");
            onClose();
        }
    };

    if (!job || !customer) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', width: '900px', maxWidth: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>

                {/* Header */}
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-color)', borderRadius: '8px 8px 0 0' }}>
                    <h2 className="modal-title" style={{ margin: 0, color: 'var(--text-primary)' }}>PENDING BOOK DETAIL</h2>
                    <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body-grid" style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, color: 'var(--text-primary)' }}>

                    {/* Left Column - Details */}
                    <div>
                        <div style={{ background: '#f6f3eb', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <strong style={{ color: '#35a7e6' }}>Tracking ID:</strong> <span>{job.csr_number || job.id.split('-')[0].toUpperCase()}</span>
                                <strong style={{ color: '#35a7e6' }}>Date Rcvd:</strong> <span>{new Date(job.created_at).toLocaleDateString('en-GB').replace(/\//g, '-')}</span>
                                <strong style={{ color: '#35a7e6' }}>Created By:</strong> <span style={{ textTransform: 'capitalize' }}>{job.created_by || 'Admin'}</span>
                                <strong style={{ color: '#35a7e6' }}>Customer:</strong> <span>{customer.name}</span>
                                <strong style={{ color: '#35a7e6' }}>Mobile:</strong> <span>{customer.phone}</span>
                                {customer.address && <><strong style={{ color: '#35a7e6' }}>Address:</strong> <span>{customer.address}</span></>}
                                {customer.location && (job.service_mode || 'On Center') !== 'On Center' && <><strong style={{ color: '#35a7e6' }}>Location:</strong> <span>{customer.location}</span></>}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Product & Complaint</h3>
                                {!isDelivered && (
                                    <button 
                                        onClick={() => {
                                            if (isEditingProduct) {
                                                // Reset to actual job values on cancel
                                                setEditItemName(job.item_name || '');
                                                setEditSerialNo(job.serial_no || '');
                                                setEditIssue(job.issue || '');
                                                setEditIsIntaken(job.is_device_intaken === 1);
                                            }
                                            setIsEditingProduct(!isEditingProduct);
                                        }}
                                        style={{ 
                                            background: '#4c566a', 
                                            color: '#fff', 
                                            padding: '2px 8px', 
                                            fontSize: '0.8rem', 
                                            border: 'none', 
                                            borderRadius: '4px', 
                                            cursor: 'pointer' 
                                        }}
                                    >
                                        {isEditingProduct ? 'Cancel' : 'Edit Details'}
                                    </button>
                                )}
                            </div>

                            {isEditingProduct ? (
                                <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Item Name *</label>
                                        <input 
                                            type="text" 
                                            value={editItemName} 
                                            onChange={e => setEditItemName(e.target.value)} 
                                            style={{ width: '100%', padding: '0.4rem', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Serial Number</label>
                                        <input 
                                            type="text" 
                                            value={editSerialNo} 
                                            onChange={e => setEditSerialNo(e.target.value.toUpperCase())} 
                                            style={{ width: '100%', padding: '0.4rem', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', textTransform: 'uppercase' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Brand</label>
                                        <input 
                                            type="text" 
                                            value={editBrand} 
                                            onChange={e => setEditBrand(e.target.value)} 
                                            style={{ width: '100%', padding: '0.4rem', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Model</label>
                                        <input 
                                            type="text" 
                                            value={editModel} 
                                            onChange={e => setEditModel(e.target.value)} 
                                            style={{ width: '100%', padding: '0.4rem', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Device Password / PIN</label>
                                        <input 
                                            type="text" 
                                            value={editPassword} 
                                            onChange={e => setEditPassword(e.target.value)} 
                                            style={{ width: '100%', padding: '0.4rem', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Accessories</label>
                                        <input 
                                            type="text" 
                                            value={editAccessories} 
                                            onChange={e => setEditAccessories(e.target.value)} 
                                            style={{ width: '100%', padding: '0.4rem', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Issue Description *</label>
                                        <textarea 
                                            value={editIssue} 
                                            onChange={e => setEditIssue(e.target.value)} 
                                            rows="3"
                                            style={{ width: '100%', padding: '0.4rem', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }}
                                        ></textarea>
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                                        <input 
                                            type="checkbox" 
                                            id="editIsIntaken" 
                                            checked={editIsIntaken} 
                                            onChange={e => setEditIsIntaken(e.target.checked)} 
                                            disabled={job.is_device_intaken === 1}
                                            style={{ cursor: job.is_device_intaken === 1 ? 'not-allowed' : 'pointer' }}
                                        />
                                        <label htmlFor="editIsIntaken" style={{ fontSize: '0.9rem', color: job.is_device_intaken === 1 ? '#777' : 'var(--text-primary)', cursor: job.is_device_intaken === 1 ? 'not-allowed' : 'pointer' }}>
                                            Device Taken for Service (Intaken) {job.is_device_intaken === 1 && "(Locked)"}
                                        </label>
                                    </div>

                                    <button 
                                        onClick={handleSaveProduct} 
                                        style={{ 
                                            padding: '0.5rem', 
                                            background: '#35a7e6', 
                                            color: 'var(--panel-bg)', 
                                            fontWeight: 'bold', 
                                            border: 'none', 
                                            borderRadius: '4px', 
                                            cursor: 'pointer',
                                            marginTop: '4px'
                                        }}
                                    >
                                        Save Details
                                    </button>
                                </div>
                            ) : (
                                <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '4px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                        <div>
                                            <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{job.item_name}</strong>
                                            {job.brand && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Brand: {job.brand}</div>}
                                            {job.model && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Model: {job.model}</div>}
                                            {job.serial_no && <div style={{ fontSize: '0.85rem', color: '#35a7e6', marginTop: '2px' }}>S/N: {job.serial_no}</div>}
                                            {job.password && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Password: {job.password}</div>}
                                            {job.accessories && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Accessories: {job.accessories}</div>}
                                        </div>
                                        <div>
                                            {job.is_device_intaken === 1 ? (
                                                <span style={{ background: 'rgba(163, 190, 140, 0.2)', color: '#a3be8c', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #a3be8c' }}>
                                                    Intaken (Taken for Service)
                                                </span>
                                            ) : (
                                                <span style={{ background: 'rgba(235, 203, 139, 0.2)', color: '#ebcb8b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #ebcb8b' }}>
                                                    On-Site (Not Taken)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <p style={{ margin: '0 0 1rem 0', whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
                                        {job.issue}
                                    </p>

                                    {job.is_device_intaken !== 1 && !isDelivered && (
                                        <button 
                                            onClick={handleQuickIntake} 
                                            style={{ 
                                                width: '100%', 
                                                padding: '0.5rem', 
                                                background: '#ebcb8b', 
                                                color: 'var(--panel-bg)', 
                                                fontWeight: 'bold', 
                                                border: 'none', 
                                                borderRadius: '4px', 
                                                cursor: 'pointer',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            Mark as Taken for Service (Intake Device)
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: '#a3be8c' }}>Service Status</h3>
                            <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '4px' }}>
                                {isDelivered ? (
                                    <div style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: '#a3be8c',
                                        color: 'var(--panel-bg)',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        textTransform: 'uppercase'
                                    }}>
                                        {job.status === 'Completed' ? 'Completed (Locked)' : job.status === 'Returned' ? 'Returned (Locked)' : 'Delivered (Locked)'}
                                    </div>
                                ) : (
                                    <select
                                        value={job.status}
                                        onChange={handleStatusChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'var(--panel-bg)',
                                            border: '1px solid var(--border-color)',
                                            color: 'var(--text-primary)',
                                            borderRadius: '6px',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {(job.service_mode || 'On Center') === 'Onsite' && job.is_device_intaken !== 1 ? (
                                            <>
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Warranty">Warranty</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="Pending">Pending</option>
                                                <option value="Intaken">Intaken</option>
                                                <option value="Waiting for Spare">Waiting for Spare</option>
                                                <option value="Replaced">Replaced</option>
                                                <option value="Send to Service Center">Send to Service Center</option>
                                                <option value="Ready">Ready</option>
                                                <option value="Return">Return</option>
                                                <option value="Warranty">Warranty</option>
                                                <option value="Delivered">Delivered</option>
                                            </>
                                        )}
                                    </select>
                                )}
                            </div>

                            {/* Warranty Status Update Option */}
                            {job.status === 'Warranty' && (
                                <div style={{ background: '#f6f3eb', padding: '1rem', borderRadius: '4px', marginTop: '1rem', border: '1px solid var(--border-color)' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Warranty Tracking</h4>
                                    
                                    {job.warranty_details && (
                                        <div style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>Warranty Details</span>
                                            <strong>{job.warranty_details}</strong>
                                        </div>
                                    )}

                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Warranty Status</label>
                                        {isDelivered ? (
                                            <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--accent)' }}>
                                                {job.warranty_status || 'Packed'}
                                            </strong>
                                        ) : (
                                            <select
                                                value={job.warranty_status || 'Packed'}
                                                onChange={handleWarrantyStatusChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.4rem',
                                                    background: 'var(--panel-bg)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--text-primary)',
                                                    borderRadius: '4px',
                                                    fontSize: '0.9rem',
                                                    cursor: 'pointer',
                                                    margin: 0
                                                }}
                                            >
                                                <option value="Packed">Packed</option>
                                                <option value="Sent">Sent</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Item Returned">Item Returned</option>
                                                <option value="Warranty Rejected">Warranty Rejected</option>
                                            </select>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Logs & Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                        <div style={{ background: '#f6f3eb', padding: '1rem', borderRadius: '4px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: '0 0 1rem 0' }}>Technician Logs</h3>

                            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', maxHeight: '200px' }}>
                                {logs.map(lg => (
                                    <div key={lg.id} style={{ background: 'var(--panel-bg)', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                                        <div style={{ color: '#35a7e6', marginBottom: '2px' }}>{new Date(lg.created_at).toLocaleString('en-GB').replace(/\//g, '-')} - {lg.technician}</div>
                                        <div>{lg.issues}</div>
                                    </div>
                                ))}
                                {logs.length === 0 && <div style={{ color: '#4c566a', fontStyle: 'italic' }}>No logs yet...</div>}
                            </div>

                            {!isDelivered && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input type="text" value={newLog} onChange={e => setNewLog(e.target.value)} placeholder="Add a log entry..." style={{ flex: 1, padding: '0.5rem', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }} />
                                    <button onClick={handleAddLog} style={{ padding: '0.5rem 1rem', background: '#35a7e6', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Save size={16} /></button>
                                </div>
                            )}
                        </div>

                        <div style={{ background: '#f6f3eb', padding: '1rem', borderRadius: '4px', marginTop: '1.5rem' }}>
                            {isDelivered ? (
                                <>
                                    <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: '0 0 1rem 0', color: '#a3be8c' }}>Billing, Inventory & GST (Locked)</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                        <div>
                                            <span style={{ color: '#35a7e6', display: 'block', fontSize: '0.8rem' }}>Service Charge</span>
                                            <strong style={{ fontSize: '1.1rem' }}>₹{invoice.service_fees || 0}</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: '#35a7e6', display: 'block', fontSize: '0.8rem' }}>Spare Cost</span>
                                            <strong style={{ fontSize: '1.1rem' }}>₹{invoice.part_costs || 0}</strong>
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                        <span style={{ color: '#35a7e6', display: 'block', fontSize: '0.8rem' }}>Spares Used</span>
                                        {sparesList.length > 0 ? (
                                            <div style={{ marginTop: '4px' }}>
                                                {sparesList.map((s, idx) => (
                                                    <div key={idx} style={{ display: 'inline-block', background: '#f2f2f2', padding: '2px 8px', borderRadius: '4px', marginRight: '6px', marginBottom: '4px', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                                                        {s.name} {s.qty ? `x${s.qty}` : ''} (₹{s.cost})
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <strong>None</strong>
                                        )}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', alignItems: 'end' }}>
                                        <div>
                                            <span style={{ color: '#35a7e6', display: 'block', fontSize: '0.8rem' }}>Warranty Period</span>
                                            <strong>{invoice.warranty || 'No warranty'}</strong>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ color: '#35a7e6', display: 'block', fontSize: '0.8rem' }}>Grand Total (incl. GST)</span>
                                            <strong style={{ fontSize: '1.25rem', color: '#a3be8c' }}>₹{invoice.grand_total || invoice.total || (parseFloat(invoice.service_fees || 0) + parseFloat(invoice.part_costs || 0))}</strong>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: '0 0 1rem 0', color: '#35a7e6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Receipt size={18} /> Billing, Inventory & Proforma Invoice
                                    </h3>
                                    
                                    <div className="billing-inputs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Service Charge (₹)</label>
                                            <input 
                                                type="number" 
                                                value={invoice.service_fees || ''} 
                                                onChange={e => {
                                                    const val = parseFloat(e.target.value) || 0;
                                                    const pCost = parseFloat(invoice.part_costs) || 0;
                                                    const taxable = val + pCost;
                                                    const gRate = invoice.gst_rate !== undefined ? parseFloat(invoice.gst_rate) : 18;
                                                    const gTax = invoice.gst_type === 'NONE' ? 0 : Math.round((taxable * gRate / 100) * 100) / 100;
                                                    setInvoice(prev => ({
                                                        ...prev,
                                                        service_fees: e.target.value,
                                                        taxable_amount: taxable,
                                                        total: taxable + gTax,
                                                        grand_total: taxable + gTax
                                                    }));
                                                }}
                                                placeholder="0"
                                                style={{ width: '100%', padding: '0.4rem', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', margin: 0 }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Spare Parts Total (₹)</label>
                                            <input 
                                                type="number" 
                                                disabled
                                                value={invoice.part_costs || 0} 
                                                style={{ width: '100%', padding: '0.4rem', background: '#f2f2f2', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', margin: 0, cursor: 'not-allowed' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Taxable Subtotal (₹)</label>
                                            <input 
                                                type="number" 
                                                disabled
                                                value={(parseFloat(invoice.service_fees) || 0) + (parseFloat(invoice.part_costs) || 0)} 
                                                style={{ width: '100%', padding: '0.4rem', background: '#f2f2f2', border: '1px solid var(--border-color)', color: '#35a7e6', borderRadius: '4px', margin: 0, cursor: 'not-allowed', fontWeight: 'bold' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Inventory & Spares Section */}
                                    <div style={{ background: 'var(--panel-bg)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <PackagePlus size={15} color="#35a7e6" /> Add Inventory & Spare Parts
                                            </label>
                                            {inventoryList.length > 0 && (
                                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{inventoryList.length} items available in stock</span>
                                            )}
                                        </div>

                                        {/* Inventory selector dropdown */}
                                        {inventoryList.length > 0 && (
                                            <div style={{ marginBottom: '6px' }}>
                                                <select
                                                    value={selectedInventoryId}
                                                    onChange={e => handleSelectInventory(e.target.value)}
                                                    style={{ width: '100%', padding: '0.4rem', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.85rem', color: '#1e293b' }}
                                                >
                                                    <option value="">-- Choose from Master Inventory (Auto-fills price & HSN) --</option>
                                                    {inventoryList.map(item => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name} — ₹{item.unit_price} (Stock: {item.quantity}) [{item.category}]
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {/* Manual / Auto-filled item inputs */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '6px', alignItems: 'center' }}>
                                            <input 
                                                type="text" 
                                                value={newSpareName}
                                                onChange={e => setNewSpareName(e.target.value)}
                                                placeholder="Part Name..."
                                                style={{ padding: '0.4rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', margin: 0, fontSize: '0.85rem' }}
                                            />
                                            <input 
                                                type="number" 
                                                value={newSpareCost}
                                                onChange={e => setNewSpareCost(e.target.value)}
                                                placeholder="Unit Price (₹)"
                                                title="Unit Price"
                                                style={{ padding: '0.4rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', margin: 0, fontSize: '0.85rem' }}
                                            />
                                            <input 
                                                type="number" 
                                                min="1"
                                                value={newSpareQty}
                                                onChange={e => setNewSpareQty(e.target.value)}
                                                placeholder="Qty"
                                                title="Quantity"
                                                style={{ padding: '0.4rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', margin: 0, fontSize: '0.85rem' }}
                                            />
                                            <input 
                                                type="text" 
                                                value={newSpareHsn}
                                                onChange={e => setNewSpareHsn(e.target.value)}
                                                placeholder="HSN (8473)"
                                                title="HSN Code"
                                                style={{ padding: '0.4rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', margin: 0, fontSize: '0.85rem' }}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={handleAddSpare}
                                                style={{ background: 'var(--accent)', color: 'black', padding: '0.4rem 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', height: '100%' }}
                                            >
                                                Add
                                            </button>
                                        </div>

                                        {/* Added Spares List */}
                                        <div style={{ marginTop: '8px' }}>
                                            {sparesList.map((spare, index) => {
                                                const qty = parseFloat(spare.qty) || 1;
                                                const unitPrice = spare.unit_price !== undefined ? parseFloat(spare.unit_price) : (parseFloat(spare.cost) || 0);
                                                const itemTotal = spare.cost !== undefined && spare.unit_price === undefined ? parseFloat(spare.cost) : (qty * unitPrice);
                                                return (
                                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '4px 8px', borderRadius: '4px', marginBottom: '4px', fontSize: '0.85rem', border: '1px solid #e2e8f0', color: '#1e293b' }}>
                                                        <div>
                                                            <b>{spare.name}</b> {qty > 1 ? `x${qty} @ ₹${unitPrice}` : ''}
                                                            <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '6px' }}>(HSN: {spare.hsn || '8473'})</span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <strong>₹{itemTotal.toFixed(2)}</strong>
                                                            <button type="button" onClick={() => handleRemoveSpare(index)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0 4px', fontSize: '1rem', fontWeight: 'bold' }}>✕</button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {sparesList.length === 0 && (
                                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', marginTop: '4px' }}>No spare parts added yet.</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* GST & Proforma Invoice Details */}
                                    <div style={{ background: 'var(--panel-bg)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                                            GST & Tax Invoice Settings
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '6px' }}>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>GST Mode</label>
                                                <select 
                                                    value={invoice.gst_type || 'CGST_SGST'}
                                                    onChange={e => {
                                                        const mode = e.target.value;
                                                        const sFees = parseFloat(invoice.service_fees) || 0;
                                                        const pCosts = parseFloat(invoice.part_costs) || 0;
                                                        const taxable = sFees + pCosts;
                                                        const gRate = mode === 'NONE' ? 0 : (invoice.gst_rate !== undefined ? parseFloat(invoice.gst_rate) : 18);
                                                        const gTax = mode === 'NONE' ? 0 : Math.round((taxable * gRate / 100) * 100) / 100;
                                                        setInvoice(prev => ({
                                                            ...prev,
                                                            gst_type: mode,
                                                            total: taxable + gTax,
                                                            grand_total: taxable + gTax
                                                        }));
                                                    }}
                                                    style={{ width: '100%', padding: '0.4rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '0.85rem' }}
                                                >
                                                    <option value="CGST_SGST">Intra-State (CGST + SGST)</option>
                                                    <option value="IGST">Inter-State (IGST)</option>
                                                    <option value="NONE">Exempt / No GST (0%)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>GST Rate (%)</label>
                                                <select 
                                                    value={invoice.gst_rate !== undefined ? invoice.gst_rate : 18}
                                                    onChange={e => {
                                                        const r = parseFloat(e.target.value) || 0;
                                                        const sFees = parseFloat(invoice.service_fees) || 0;
                                                        const pCosts = parseFloat(invoice.part_costs) || 0;
                                                        const taxable = sFees + pCosts;
                                                        const gTax = invoice.gst_type === 'NONE' ? 0 : Math.round((taxable * r / 100) * 100) / 100;
                                                        setInvoice(prev => ({
                                                            ...prev,
                                                            gst_rate: r,
                                                            total: taxable + gTax,
                                                            grand_total: taxable + gTax
                                                        }));
                                                    }}
                                                    style={{ width: '100%', padding: '0.4rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '0.85rem' }}
                                                >
                                                    <option value="18">18% (Standard IT/Electronics)</option>
                                                    <option value="12">12%</option>
                                                    <option value="5">5%</option>
                                                    <option value="28">28%</option>
                                                    <option value="0">0% (Nil)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Customer GSTIN (Optional)</label>
                                                <input 
                                                    type="text" 
                                                    value={invoice.customer_gstin || ''}
                                                    onChange={e => setInvoice(prev => ({ ...prev, customer_gstin: e.target.value.toUpperCase() }))}
                                                    placeholder="32AAAAA0000A1Z5"
                                                    style={{ width: '100%', padding: '0.4rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '0.85rem', margin: 0 }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Proforma Invoice #</label>
                                                <input 
                                                    type="text" 
                                                    value={invoice.proforma_number || ''}
                                                    onChange={e => setInvoice(prev => ({ ...prev, proforma_number: e.target.value }))}
                                                    placeholder={`PI-${new Date().getFullYear()}-${(job.csr_number || job.id.split('-')[0]).replace('#','')}`}
                                                    style={{ width: '100%', padding: '0.4rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '0.85rem', margin: 0 }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Warranty Period</label>
                                                <input 
                                                    type="text" 
                                                    value={invoice.warranty || ''} 
                                                    onChange={e => setInvoice(prev => ({ ...prev, warranty: e.target.value }))}
                                                    placeholder="e.g. 3 Months / No warranty"
                                                    style={{ width: '100%', padding: '0.4rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '0.85rem', margin: 0 }}
                                                />
                                            </div>
                                        </div>

                                        {/* Real-time Tax & Total Summary */}
                                        <div style={{ marginTop: '8px', padding: '6px 10px', background: 'rgba(53, 167, 230, 0.08)', border: '1px solid rgba(53, 167, 230, 0.25)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.85rem' }}>
                                            <div>
                                                <span style={{ color: 'var(--text-secondary)' }}>Taxable: </span>
                                                <strong>₹{((parseFloat(invoice.service_fees) || 0) + (parseFloat(invoice.part_costs) || 0)).toFixed(2)}</strong>
                                            </div>
                                            <div>
                                                <span style={{ color: 'var(--text-secondary)' }}>
                                                    {invoice.gst_type === 'IGST' ? `IGST (${invoice.gst_rate || 18}%): ` : `GST (${invoice.gst_rate || 18}%): `}
                                                </span>
                                                <strong>₹{invoice.gst_type === 'NONE' ? '0.00' : (((parseFloat(invoice.service_fees) || 0) + (parseFloat(invoice.part_costs) || 0)) * ((invoice.gst_rate !== undefined ? parseFloat(invoice.gst_rate) : 18) / 100)).toFixed(2)}</strong>
                                            </div>
                                            <div>
                                                <span style={{ color: 'var(--text-secondary)' }}>Grand Total: </span>
                                                <strong style={{ color: '#10b981', fontSize: '1.05rem' }}>
                                                    ₹{(
                                                        ((parseFloat(invoice.service_fees) || 0) + (parseFloat(invoice.part_costs) || 0)) +
                                                        (invoice.gst_type === 'NONE' ? 0 : (((parseFloat(invoice.service_fees) || 0) + (parseFloat(invoice.part_costs) || 0)) * ((invoice.gst_rate !== undefined ? parseFloat(invoice.gst_rate) : 18) / 100)))
                                                    ).toFixed(2)}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '0.5rem' }}>
                                        <button 
                                            onClick={handleSaveInvoice} 
                                            style={{ 
                                                width: '100%', 
                                                padding: '0.6rem', 
                                                background: '#35a7e6', 
                                                color: 'var(--panel-bg)', 
                                                fontWeight: 'bold', 
                                                border: 'none', 
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                fontSize: '0.9rem',
                                                margin: 0
                                            }}
                                        >
                                            <Save size={16} /> Save Billing & GST Details
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Document Print & Proforma Generation Buttons */}
                        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <button 
                                type="button"
                                onClick={() => { setPrintDocType('service_report'); setShowPrintModal(true); }} 
                                style={{ 
                                    background: '#334155', 
                                    color: '#fff', 
                                    padding: '0.85rem', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    gap: '0.5rem', 
                                    border: 'none', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <Printer size={18} /> Print Service Report (A4)
                            </button>
                            <button 
                                type="button"
                                onClick={() => { setPrintDocType('proforma'); setShowPrintModal(true); }} 
                                style={{ 
                                    background: 'var(--accent)', 
                                    color: '#000', 
                                    padding: '0.85rem', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    gap: '0.5rem', 
                                    border: 'none', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <FileText size={18} /> Create Proforma Invoice (GST)
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* A4 Document Print Modal */}
            <A4PrintModal
                isOpen={showPrintModal}
                onClose={() => setShowPrintModal(false)}
                initialDocType={printDocType}
                job={job}
                customer={customer}
                invoice={invoice}
                config={printConfig}
            />
        </div>
    );
}
