import { useState, useEffect } from 'react'
import { DownloadCloud, Printer, Eye, Save, ToggleLeft, ToggleRight, Users, UserPlus, Trash2, Edit2, Lock, RefreshCw, Package, Plus, Search, Tag } from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const DEFAULT_CONFIG = {
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
    showLogo: false,
    showCustomerPhone: true,
    showCustomerEmail: false,
    showSerialNo: true,
    showTechnician: true,
    showServiceMode: true,
    showDeviceIntaken: true,
    invoiceTerms: 'Thank you for choosing Hypertech Digital.\nAll repairs come with a standard 30-day warranty unless otherwise stated.',
    proformaTerms: '1. This is a Proforma Invoice / Quotation and not a final Tax Invoice.\n2. Quotation is valid for 15 days from date of issue.\n3. Repairs will commence upon customer approval of this estimate.\n4. Spares subject to market availability.',
    intakeTerms: 'By leaving your device, you agree to our standard terms of service.\nNot responsible for data loss.',
    activeTab: 'intake'
};

function Toggle({ label, description, checked, onChange }) {
    return (
        <div
            onClick={onChange}
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem 1rem', marginBottom: '0.5rem',
                background: checked ? 'rgba(187,134,252,0.08)' : '#f6f3eb',
                border: `1px solid ${checked ? 'rgba(187,134,252,0.4)' : 'var(--border-color)'}`,
                borderRadius: '8px', cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}
        >
            <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: checked ? '#e0e0e0' : 'var(--text-secondary)' }}>{label}</div>
                {description && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{description}</div>}
            </div>
            {checked
                ? <ToggleRight size={28} color="var(--accent)" />
                : <ToggleLeft size={28} color="#555" />
            }
        </div>
    );
}

function IntakePreview({ config }) {
    const today = new Date().toLocaleString('en-GB').replace(/\//g, '-');
    return (
        <div style={{
            background: '#fff', color: '#000',
            padding: '20px', borderRadius: '0',
            fontFamily: "'Courier New', monospace", fontSize: '12px',
            width: '280px', margin: '0 auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
            <div style={{ textAlign: 'center', borderBottom: '1px dashed #000', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{config.shopName || 'Your Shop Name'}</div>
                {config.shopAddress && <div style={{ fontSize: '10px', marginTop: '4px', whiteSpace: 'pre-line' }}>{config.shopAddress}</div>}
                {config.shopPhone && <div style={{ fontSize: '10px' }}>Tel: {config.shopPhone}</div>}
                {config.shopEmail && <div style={{ fontSize: '10px' }}>{config.shopEmail}</div>}
                <div style={{ marginTop: '8px', fontWeight: 'bold' }}>SERVICE REQUEST SLIP</div>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <div><b>Date:</b> {today}</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>CSR #: 789012</div>
            </div>

            <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '8px 0', margin: '8px 0' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Customer</div>
                <div>John Smith</div>
                {config.showCustomerPhone && <div>Tel: 055-1234567</div>}
                {config.showCustomerEmail && <div>john@example.com</div>}
            </div>

            <div style={{ margin: '8px 0' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Device</div>
                <div>MacBook Pro 2021</div>
                {config.showSerialNo && <div>S/N: C02XY1234</div>}
                {config.showServiceMode && <div>Mode: On Center</div>}
                {config.showDeviceIntaken && <div>Intaken: Yes</div>}
            </div>

            <div style={{ borderTop: '1px dashed #000', margin: '10px 0', paddingTop: '8px', fontSize: '10px', textAlign: 'center', whiteSpace: 'pre-line' }}>
                {config.intakeTerms || 'Your footer terms here.'}
            </div>
        </div>
    );
}

function InvoicePreview({ config }) {
    const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    return (
        <div style={{
            background: '#fff', color: '#000',
            padding: '24px', borderRadius: '0',
            fontFamily: 'Arial, sans-serif', fontSize: '13px',
            width: '320px', margin: '0 auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '14px', marginBottom: '14px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{config.shopName || 'Your Shop Name'}</div>
                {config.shopAddress && <div style={{ fontSize: '11px', marginTop: '4px', whiteSpace: 'pre-line' }}>{config.shopAddress}</div>}
                {config.shopPhone && <div style={{ fontSize: '11px' }}>Tel: {config.shopPhone}</div>}
                {config.shopEmail && <div style={{ fontSize: '11px' }}>{config.shopEmail}</div>}
                <div style={{ marginTop: '10px', fontSize: '15px', fontWeight: 'bold', letterSpacing: '1px' }}>SERVICE REPORT</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '12px' }}>
                <div>
                    <div><b>Receipt #:</b> INV-5821</div>
                    <div><b>Date:</b> {today}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div><b>CSR #:</b> 789012</div>
                    {config.showTechnician && <div><b>Tech:</b> Admin</div>}
                </div>
            </div>

            <div style={{ background: '#f5f5f5', padding: '8px 10px', borderRadius: '4px', marginBottom: '12px', fontSize: '12px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Customer</div>
                <div>John Smith</div>
                {config.showCustomerPhone && <div>055-1234567</div>}
                <div style={{ marginTop: '4px' }}><b>Device:</b> MacBook Pro 2021</div>
                {config.showSerialNo && <div><b>S/N:</b> C02XY1234</div>}
            </div>

            <div style={{ marginBottom: '12px', fontSize: '12px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Work Performed</div>
                <div style={{ background: '#f9f9f9', padding: '6px', border: '1px solid #ddd' }}>
                    Screen replacement and full system diagnostic.
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '12px' }}>
                <thead>
                    <tr style={{ background: 'var(--border-color)', color: 'var(--text-primary)' }}>
                        <th style={{ padding: '5px 8px', textAlign: 'left' }}>Description</th>
                        <th style={{ padding: '5px 8px', textAlign: 'right' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '5px 8px' }}>Service & Labor</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right' }}>$80.00</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '5px 8px' }}>Spare Parts</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right' }}>$120.00</td>
                    </tr>
                    <tr style={{ fontWeight: 'bold', background: '#f0f0f0' }}>
                        <td style={{ padding: '8px' }}>TOTAL</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>$200.00</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ textAlign: 'center', fontSize: '10px', color: '#555', borderTop: '1px dashed var(--text-secondary)', paddingTop: '8px', whiteSpace: 'pre-line' }}>
                {config.invoiceTerms || 'Your footer terms here.'}
            </div>
        </div>
    );
}

export default function Settings() {
    const { user, isAdmin } = useAuth();
    const [loadingConfig, setLoadingConfig] = useState(false)
    const [message, setMessage] = useState({ text: '', type: '' })
    const [printConfig, setPrintConfig] = useState(DEFAULT_CONFIG);
    const [activeTab, setActiveTab] = useState('intake');

    // Inventory states
    const [inventory, setInventory] = useState([]);
    const [invSearch, setInvSearch] = useState('');
    const [invCategoryFilter, setInvCategoryFilter] = useState('All');
    const [showAddInvModal, setShowAddInvModal] = useState(false);
    const [editingInvItem, setEditingInvItem] = useState(null);
    const [invForm, setInvForm] = useState({
        name: '',
        part_number: '',
        category: 'General',
        unit_price: '',
        cost_price: '',
        quantity: '0',
        hsn_code: '8473',
        gst_rate: '18'
    });
    const [invMessage, setInvMessage] = useState({ text: '', type: '' });

    // User management states
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'STAFF' });
    const [userMessage, setUserMessage] = useState({ text: '', type: '' });

    // Password change states
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' })

    // User editing states
    const [editingUser, setEditingUser] = useState(null)
    const [editUserPassword, setEditUserPassword] = useState('')
    const [editUserRole, setEditUserRole] = useState('STAFF')
    const [editUserActive, setEditUserActive] = useState(true)

    // Top-level Settings Tabs State (Print Layout vs. User Management vs. Inventory vs. Security/Change Password)
    const [activeSettingsTab, setActiveSettingsTab] = useState(isAdmin ? 'print' : 'password');

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage({ text: '', type: '' });
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ text: 'New passwords do not match', type: 'error' });
            return;
        }
        try {
            await api.changePassword(user.id, passwordData.currentPassword, passwordData.newPassword);
            setPasswordMessage({ text: '✓ Password updated successfully!', type: 'success' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setPasswordMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setPasswordMessage({ text: err.message || 'Failed to update password', type: 'error' });
        }
    }

    const handleStartEditUser = (u) => {
        setEditingUser(u);
        setEditUserPassword('');
        setEditUserRole(u.role);
        setEditUserActive(u.is_active !== false);
    }

    const handleCancelEditUser = () => {
        setEditingUser(null);
    }

    const handleSaveEditUser = async (e) => {
        e.preventDefault();
        setUserMessage({ text: '', type: '' });
        try {
            await api.updateUser(editingUser.id, {
                password: editUserPassword || undefined,
                role: editUserRole,
                is_active: editUserActive
            });
            setUserMessage({ text: '✓ User account updated successfully!', type: 'success' });
            setEditingUser(null);
            loadUsers();
            setTimeout(() => setUserMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setUserMessage({ text: err.message || 'Failed to update user', type: 'error' });
        }
    }

    const loadUsers = async () => {
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadInventory = async () => {
        try {
            const data = await api.getInventory();
            setInventory(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveNewItem = async (e) => {
        e.preventDefault();
        if (!invForm.name.trim()) return;
        try {
            await api.createInventoryItem(invForm);
            setInvMessage({ text: '✓ Inventory item added successfully!', type: 'success' });
            setShowAddInvModal(false);
            setInvForm({ name: '', part_number: '', category: 'General', unit_price: '', cost_price: '', quantity: '0', hsn_code: '8473', gst_rate: '18' });
            loadInventory();
            setTimeout(() => setInvMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setInvMessage({ text: err.message || 'Failed to add item', type: 'error' });
        }
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        if (!editingInvItem || !editingInvItem.name.trim()) return;
        try {
            await api.updateInventoryItem(editingInvItem.id, editingInvItem);
            setInvMessage({ text: '✓ Item updated successfully!', type: 'success' });
            setEditingInvItem(null);
            loadInventory();
            setTimeout(() => setInvMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setInvMessage({ text: err.message || 'Failed to update item', type: 'error' });
        }
    };

    const handleDeleteItem = async (id, name) => {
        if (!window.confirm(`Delete item "${name}" from inventory?`)) return;
        try {
            await api.deleteInventoryItem(id);
            setInvMessage({ text: '✓ Item deleted!', type: 'success' });
            loadInventory();
            setTimeout(() => setInvMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setInvMessage({ text: err.message || 'Failed to delete item', type: 'error' });
        }
    };

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings = await api.getSettings();
                if (settings.print_settings) {
                    setPrintConfig({ ...DEFAULT_CONFIG, ...JSON.parse(settings.print_settings) });
                }
            } catch (err) {
                console.error(err);
            }
        };
        loadSettings();
        loadUsers();
        loadInventory();
    }, [isAdmin]);

    const set = (key, val) => setPrintConfig(prev => ({ ...prev, [key]: val }));

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!newUser.username.trim() || !newUser.password.trim()) return;
        try {
            await api.createUser(newUser);
            setUserMessage({ text: '✓ User created successfully!', type: 'success' });
            setNewUser({ username: '', password: '', role: 'STAFF' });
            loadUsers();
            setTimeout(() => setUserMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setUserMessage({ text: err.message, type: 'error' });
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.deleteUser(id);
                loadUsers();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleSave = async () => {
        setLoadingConfig(true);
        try {
            await api.updateSetting('print_settings', JSON.stringify(printConfig));
            setMessage({ text: '✓ Configuration saved successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setMessage({ text: 'Failed to save: ' + err.message, type: 'error' });
        }
        setLoadingConfig(false);
    }

    const handleBackup = async () => {
        setLoadingConfig(true)
        try {
            const a = document.createElement('a')
            a.href = '/api/download-db'
            a.download = `hypertech_backup_${new Date().toISOString().split('T')[0]}.json`
            a.click()
            setMessage({ text: '✓ Backup downloaded!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: `Backup failed: ${error.message}`, type: 'error' })
        } finally {
            setLoadingConfig(false)
        }
    }

    const sectionStyle = { marginBottom: '1.5rem' };
    const sectionTitleStyle = {
        fontSize: '0.7rem', fontWeight: '700', letterSpacing: '1.5px',
        textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem'
    };
    const inputStyle = {
        width: '100%', padding: '0.6rem 0.75rem', marginBottom: '0.75rem',
        background: '#f6f3eb', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
        borderRadius: '6px', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '0.9rem'
    };

    return (
        <div className="container" style={{ maxWidth: '1400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ margin: 0 }}>Settings</h1>
                {isAdmin && (
                    <button onClick={handleBackup} disabled={loadingConfig} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--panel-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                        <DownloadCloud size={16} color="var(--accent)" /> Backup Database
                    </button>
                )}
            </div>

            {/* Top-level settings tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
                {isAdmin && (
                    <button 
                        onClick={() => setActiveSettingsTab('print')} 
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '0.75rem 1rem',
                            borderBottom: activeSettingsTab === 'print' ? '3px solid var(--accent)' : '3px solid transparent',
                            color: activeSettingsTab === 'print' ? 'var(--accent)' : 'var(--text-secondary)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            borderRadius: 0,
                            margin: 0
                        }}
                    >
                        Print Layout
                    </button>
                )}
                {isAdmin && (
                    <button 
                        onClick={() => setActiveSettingsTab('users')} 
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '0.75rem 1rem',
                            borderBottom: activeSettingsTab === 'users' ? '3px solid var(--accent)' : '3px solid transparent',
                            color: activeSettingsTab === 'users' ? 'var(--accent)' : 'var(--text-secondary)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            borderRadius: 0,
                            margin: 0
                        }}
                    >
                        User Management
                    </button>
                )}
                <button 
                    onClick={() => setActiveSettingsTab('inventory')} 
                    style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        borderBottom: activeSettingsTab === 'inventory' ? '3px solid var(--accent)' : '3px solid transparent',
                        color: activeSettingsTab === 'inventory' ? 'var(--accent)' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        borderRadius: 0,
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <Package size={16} />
                    Inventory & Stock
                </button>
                <button 
                    onClick={() => setActiveSettingsTab('password')} 
                    style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        borderBottom: activeSettingsTab === 'password' ? '3px solid var(--accent)' : '3px solid transparent',
                        color: activeSettingsTab === 'password' ? 'var(--accent)' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        borderRadius: 0,
                        margin: 0
                    }}
                >
                    Change Password
                </button>
            </div>

            {message.text && (
                <div style={{
                    padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem',
                    background: message.type === 'success' ? 'rgba(3,218,198,0.1)' : 'rgba(207,102,121,0.1)',
                    color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                    border: `1px solid ${message.type === 'success' ? 'rgba(3,218,198,0.3)' : 'rgba(207,102,121,0.3)'}`
                }}>
                    {message.text}
                </div>
            )}

            {/* ── PRINT LAYOUT CARD ── */}
            {activeSettingsTab === 'print' && isAdmin && (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {/* Card header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: '#f6f3eb' }}>
                        <Printer size={22} color="var(--accent)" />
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Print Layout Designer</h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Changes update the live preview instantly</p>
                        </div>
                    </div>

                    <div className="settings-designer">

                        {/* ── LEFT PANEL: Controls ── */}
                        <div className="settings-left-panel">

                            {/* Shop Identity */}
                            <div style={sectionStyle}>
                                <div style={sectionTitleStyle}>Shop Identity</div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Shop Name</label>
                                <input style={inputStyle} value={printConfig.shopName} onChange={e => set('shopName', e.target.value)} placeholder="Hypertech Digital" />
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Address</label>
                                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={printConfig.shopAddress} onChange={e => set('shopAddress', e.target.value)} placeholder={"224 Park Dr.\nGotham City"} />
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Phone</label>
                                <input style={inputStyle} value={printConfig.shopPhone} onChange={e => set('shopPhone', e.target.value)} placeholder="055-000-0000" />
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Email</label>
                                <input style={inputStyle} value={printConfig.shopEmail} onChange={e => set('shopEmail', e.target.value)} placeholder="info@shop.com" />
                            </div>

                            {/* GST & Tax Details */}
                            <div style={sectionStyle}>
                                <div style={sectionTitleStyle}>GST & Tax Information</div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Shop GSTIN</label>
                                <input style={inputStyle} value={printConfig.shopGstin || ''} onChange={e => set('shopGstin', e.target.value)} placeholder="e.g. 32AAAAA0000A1Z5" />
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>State Name</label>
                                        <input style={inputStyle} value={printConfig.stateName || ''} onChange={e => set('stateName', e.target.value)} placeholder="Kerala" />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>State Code</label>
                                        <input style={inputStyle} value={printConfig.stateCode || ''} onChange={e => set('stateCode', e.target.value)} placeholder="32" />
                                    </div>
                                </div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Default GST Rate (%)</label>
                                <input type="number" style={inputStyle} value={printConfig.defaultGstRate ?? 18} onChange={e => set('defaultGstRate', parseFloat(e.target.value) || 0)} placeholder="18" />
                            </div>

                            {/* Bank & Payment Details */}
                            <div style={sectionStyle}>
                                <div style={sectionTitleStyle}>Bank & Payment Details (For Invoices/Proforma)</div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Bank Name</label>
                                <input style={inputStyle} value={printConfig.bankName || ''} onChange={e => set('bankName', e.target.value)} placeholder="State Bank of India" />
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Account Holder Name</label>
                                <input style={inputStyle} value={printConfig.accountName || ''} onChange={e => set('accountName', e.target.value)} placeholder="Hypertech Digital" />
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Account Number</label>
                                <input style={inputStyle} value={printConfig.accountNo || ''} onChange={e => set('accountNo', e.target.value)} placeholder="123456789012" />
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>IFSC Code</label>
                                <input style={inputStyle} value={printConfig.ifsc || ''} onChange={e => set('ifsc', e.target.value)} placeholder="SBIN0001234" />
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>UPI ID (for QR / Quick Pay)</label>
                                <input style={inputStyle} value={printConfig.upiId || ''} onChange={e => set('upiId', e.target.value)} placeholder="hypertech@upi" />
                            </div>

                            {/* Visibility */}
                            <div style={sectionStyle}>
                                <div style={sectionTitleStyle}>Show / Hide Fields</div>
                                <Toggle label="Customer Phone" checked={printConfig.showCustomerPhone} onChange={() => set('showCustomerPhone', !printConfig.showCustomerPhone)} />
                                <Toggle label="Customer Email" checked={printConfig.showCustomerEmail} onChange={() => set('showCustomerEmail', !printConfig.showCustomerEmail)} />
                                <Toggle label="Device Serial Number" checked={printConfig.showSerialNo} onChange={() => set('showSerialNo', !printConfig.showSerialNo)} />
                                <Toggle label="Service Mode" description="On Center / On-Site" checked={printConfig.showServiceMode} onChange={() => set('showServiceMode', !printConfig.showServiceMode)} />
                                <Toggle label="Device Intaken status" checked={printConfig.showDeviceIntaken} onChange={() => set('showDeviceIntaken', !printConfig.showDeviceIntaken)} />
                                <Toggle label="Technician Name on Service Report" checked={printConfig.showTechnician} onChange={() => set('showTechnician', !printConfig.showTechnician)} />
                            </div>

                            {/* Footer Text */}
                            <div style={sectionStyle}>
                                <div style={sectionTitleStyle}>Footer / Terms Text</div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Intake Slip Footer</label>
                                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={printConfig.intakeTerms} onChange={e => set('intakeTerms', e.target.value)} />
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Service Report Footer</label>
                                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={printConfig.invoiceTerms} onChange={e => set('invoiceTerms', e.target.value)} />
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Proforma Invoice / Quotation Terms</label>
                                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={printConfig.proformaTerms || ''} onChange={e => set('proformaTerms', e.target.value)} />
                            </div>

                            <button onClick={handleSave} disabled={loadingConfig} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.85rem', borderRadius: '8px', fontSize: '1rem', fontWeight: '700' }}>
                                <Save size={18} />
                                {loadingConfig ? 'Saving...' : 'Save Configuration'}
                            </button>
                        </div>

                        {/* ── RIGHT PANEL: Live Preview ── */}
                        <div className="settings-right-panel">
                            {/* Tab switcher */}
                            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
                                {['intake', 'invoice'].map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                        flex: 1, padding: '0.85rem', background: 'transparent', border: 'none',
                                        borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
                                        color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
                                        fontWeight: activeTab === tab ? '700' : '400',
                                        cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        transition: 'all 0.2s'
                                    }}>
                                        <Eye size={16} />
                                        {tab === 'intake' ? 'Intake Slip Preview' : 'Service Report Preview'}
                                    </button>
                                ))}
                            </div>

                            {/* Preview area */}
                            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}>
                                <div>
                                    <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Live Preview · Not actual size
                                    </div>
                                    {activeTab === 'intake'
                                        ? <IntakePreview config={printConfig} />
                                        : <InvoicePreview config={printConfig} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* ── USER MANAGEMENT CARD ── */}
            {activeSettingsTab === 'users' && isAdmin && (
                <div className="card" style={{ padding: 0, overflow: 'hidden', marginTop: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: '#f6f3eb' }}>
                        <Users size={22} color="var(--accent)" />
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>User Management</h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Manage system access and assign roles</p>
                        </div>
                    </div>

                    {userMessage.text && (
                        <div style={{
                            margin: '1.5rem 1.5rem 0 1.5rem',
                            padding: '0.75rem 1rem', borderRadius: '6px',
                            background: userMessage.type === 'success' ? 'rgba(3,218,198,0.1)' : 'rgba(207,102,121,0.1)',
                            color: userMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
                            border: `1px solid ${userMessage.type === 'success' ? 'rgba(3,218,198,0.3)' : 'rgba(207,102,121,0.3)'}`
                        }}>
                            {userMessage.text}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '1.5rem' }}>
                        {/* User List Panel */}
                        <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
                            <h3 style={{ fontSize: '0.85rem', color: '#35a7e6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Active Accounts</h3>
                            <div className="table-responsive">
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                                            <th style={{ padding: '0.5rem' }}>Username</th>
                                            <th style={{ padding: '0.5rem' }}>Access Role</th>
                                            <th style={{ padding: '0.5rem' }}>Status</th>
                                            <th style={{ padding: '0.5rem', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>{u.username}</td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        padding: '2px 8px',
                                                        borderRadius: '12px',
                                                        background: u.role === 'ADMIN' ? 'rgba(187,134,252,0.15)' : 'rgba(0, 0, 0, 0.03)',
                                                        color: u.role === 'ADMIN' ? 'var(--accent)' : 'var(--text-secondary)',
                                                        fontWeight: 'bold'
                                                    }}>{u.role}</span>
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        padding: '2px 8px',
                                                        borderRadius: '12px',
                                                        background: u.is_active !== false ? 'rgba(3,218,198,0.15)' : 'rgba(207,102,121,0.15)',
                                                        color: u.is_active !== false ? 'var(--success)' : 'var(--danger)',
                                                        fontWeight: 'bold'
                                                    }}>{u.is_active !== false ? 'Active' : 'Inactive'}</span>
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => handleStartEditUser(u)}
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: 'var(--text-secondary)',
                                                            cursor: 'pointer',
                                                            padding: '4px',
                                                            marginRight: '8px'
                                                        }}
                                                        title="Edit User"
                                                    >
                                                        <Edit2 size={16} color="var(--accent)" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        disabled={u.username === 'admin'}
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: 'var(--danger)',
                                                            cursor: u.username === 'admin' ? 'not-allowed' : 'pointer',
                                                            padding: '4px'
                                                        }}
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Edit or Create User Form Panel */}
                        <div style={{ flex: '1 1 45%', minWidth: '300px', background: '#f6f3eb', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            {editingUser ? (
                                <>
                                    <h3 style={{ fontSize: '0.85rem', color: '#35a7e6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', marginTop: 0 }}>Edit User: {editingUser.username}</h3>
                                    <form onSubmit={handleSaveEditUser}>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Password (leave blank to keep current)</label>
                                            <input
                                                type="password"
                                                value={editUserPassword}
                                                onChange={e => setEditUserPassword(e.target.value)}
                                                placeholder="Enter new password (optional)..."
                                                style={{
                                                    width: '100%', padding: '0.6rem 0.75rem',
                                                    background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                                                    borderRadius: '6px', boxSizing: 'border-box'
                                                }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Access Role</label>
                                            <select
                                                value={editUserRole}
                                                disabled={editingUser.username === 'admin'}
                                                onChange={e => setEditUserRole(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '0.6rem 0.75rem',
                                                    background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                                                    borderRadius: '6px', boxSizing: 'border-box', cursor: editingUser.username === 'admin' ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                <option value="STAFF">STAFF (Read & Service Actions)</option>
                                                <option value="ADMIN">ADMIN (Full Control & Settings)</option>
                                            </select>
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Status</label>
                                            <select
                                                value={editUserActive ? "true" : "false"}
                                                disabled={editingUser.username === 'admin'}
                                                onChange={e => setEditUserActive(e.target.value === "true")}
                                                style={{
                                                    width: '100%', padding: '0.6rem 0.75rem',
                                                    background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                                                    borderRadius: '6px', boxSizing: 'border-box', cursor: editingUser.username === 'admin' ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button type="submit" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem' }}>
                                                <Save size={18} />
                                                Save Changes
                                            </button>
                                            <button type="button" onClick={handleCancelEditUser} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <h3 style={{ fontSize: '0.85rem', color: '#35a7e6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', marginTop: 0 }}>Create User Account</h3>
                                    <form onSubmit={handleCreateUser}>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Username</label>
                                            <input
                                                type="text"
                                                required
                                                value={newUser.username}
                                                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                                placeholder="Enter username..."
                                                style={{
                                                    width: '100%', padding: '0.6rem 0.75rem',
                                                    background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                                                    borderRadius: '6px', boxSizing: 'border-box'
                                                }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={newUser.password}
                                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                                placeholder="Enter password..."
                                                style={{
                                                    width: '100%', padding: '0.6rem 0.75rem',
                                                    background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                                                    borderRadius: '6px', boxSizing: 'border-box'
                                                }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Access Role</label>
                                            <select
                                                value={newUser.role}
                                                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                                style={{
                                                    width: '100%', padding: '0.6rem 0.75rem',
                                                    background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                                                    borderRadius: '6px', boxSizing: 'border-box', cursor: 'pointer'
                                                }}
                                            >
                                                <option value="STAFF">STAFF (Read & Service Actions)</option>
                                                <option value="ADMIN">ADMIN (Full Control & Settings)</option>
                                            </select>
                                        </div>
                                        <button type="submit" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem' }}>
                                            <UserPlus size={18} />
                                            Create User
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── CHANGE PASSWORD CARD ── */}
            {activeSettingsTab === 'password' && (
                <div className="card" style={{ padding: 0, overflow: 'hidden', marginTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: '#f6f3eb' }}>
                    <Lock size={22} color="var(--accent)" />
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Change Password</h2>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Update your account password for security</p>
                    </div>
                </div>

                {passwordMessage.text && (
                    <div style={{
                        margin: '1.5rem 1.5rem 0 1.5rem',
                        padding: '0.75rem 1rem', borderRadius: '6px',
                        background: passwordMessage.type === 'success' ? 'rgba(3,218,198,0.1)' : 'rgba(207,102,121,0.1)',
                        color: passwordMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
                        border: `1px solid ${passwordMessage.type === 'success' ? 'rgba(3,218,198,0.3)' : 'rgba(207,102,121,0.3)'}`
                    }}>
                        {passwordMessage.text}
                    </div>
                )}

                <div style={{ padding: '1.5rem', maxWidth: '500px' }}>
                    <form onSubmit={handleChangePassword}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Current Password</label>
                            <input
                                type="password"
                                required
                                value={passwordData.currentPassword}
                                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                placeholder="Enter current password..."
                                style={{
                                    width: '100%', padding: '0.6rem 0.75rem',
                                    background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                                    borderRadius: '6px', boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>New Password</label>
                            <input
                                type="password"
                                required
                                value={passwordData.newPassword}
                                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                placeholder="Enter new password..."
                                style={{
                                    width: '100%', padding: '0.6rem 0.75rem',
                                    background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                                    borderRadius: '6px', boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Confirm New Password</label>
                            <input
                                type="password"
                                required
                                value={passwordData.confirmPassword}
                                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                placeholder="Confirm new password..."
                                style={{
                                    width: '100%', padding: '0.6rem 0.75rem',
                                    background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                                    borderRadius: '6px', boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem 1.5rem' }}>
                            <Save size={18} />
                            Change Password
                        </button>
                    </form>
                </div>
                </div>
            )}

            {/* ── INVENTORY & STOCK MANAGEMENT TAB ── */}
            {activeSettingsTab === 'inventory' && (
                <div style={{ maxWidth: '1200px' }}>
                    {/* Header Card */}
                    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Package size={24} color="var(--accent)" />
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Inventory & Spare Parts Stock</h2>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        Manage spare parts, stock levels, unit prices, HSN codes, and GST rates for repair quotations and billing.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setInvForm({ name: '', part_number: '', category: 'General', unit_price: '', cost_price: '', quantity: '0', hsn_code: '8473', gst_rate: '18' });
                                    setShowAddInvModal(true);
                                }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '0.65rem 1.25rem', background: 'var(--accent)',
                                    color: '#000', border: 'none', borderRadius: '6px',
                                    cursor: 'pointer', fontWeight: 'bold'
                                }}
                            >
                                <Plus size={18} />
                                Add Spare / Item
                            </button>
                        </div>

                        {/* Quick Stats Bar */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem', background: '#f6f3eb', padding: '1rem', borderRadius: '8px',
                            border: '1px solid var(--border-color)', marginBottom: '1.25rem'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Items Cataloged</div>
                                <div style={{ fontWeight: '700', fontSize: '1.3rem', marginTop: '2px', color: 'var(--accent)' }}>{inventory.length}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Units In Stock</div>
                                <div style={{ fontWeight: '700', fontSize: '1.3rem', marginTop: '2px' }}>
                                    {inventory.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Low Stock Alert (&le; 3 units)</div>
                                <div style={{ fontWeight: '700', fontSize: '1.3rem', marginTop: '2px', color: inventory.filter(i => (parseInt(i.quantity) || 0) <= 3).length > 0 ? 'var(--danger)' : 'var(--success)' }}>
                                    {inventory.filter(i => (parseInt(i.quantity) || 0) <= 3).length}
                                </div>
                            </div>
                        </div>

                        {/* Search & Filter Toolbar */}
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.4rem 0.75rem' }}>
                                <Search size={16} color="var(--text-secondary)" />
                                <input
                                    type="text"
                                    value={invSearch}
                                    onChange={e => setInvSearch(e.target.value)}
                                    placeholder="Search by part name, part #, or HSN code..."
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none', fontSize: '0.88rem' }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Tag size={16} color="var(--text-secondary)" />
                                <select
                                    value={invCategoryFilter}
                                    onChange={e => setInvCategoryFilter(e.target.value)}
                                    style={{ padding: '0.45rem 0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.88rem', cursor: 'pointer' }}
                                >
                                    {['All', 'General', 'Storage', 'RAM', 'Screen/Display', 'Battery', 'Printer Parts', 'Motherboard/IC', 'Accessories', 'Power/Adapters'].map(cat => (
                                        <option key={cat} value={cat}>{cat} Categories</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={loadInventory}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--panel-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.45rem 0.85rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                                <RefreshCw size={14} /> Refresh
                            </button>
                        </div>
                    </div>

                    {/* Feedback message */}
                    {invMessage.text && (
                        <div style={{
                            padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem',
                            background: invMessage.type === 'success' ? 'rgba(3,218,198,0.1)' : 'rgba(207,102,121,0.1)',
                            color: invMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
                            border: `1px solid ${invMessage.type === 'success' ? 'rgba(3,218,198,0.3)' : 'rgba(207,102,121,0.3)'}`
                        }}>
                            {invMessage.text}
                        </div>
                    )}

                    {/* Inventory Table Card */}
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="table-responsive">
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                                <thead>
                                    <tr style={{ background: '#f6f3eb', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                        <th style={{ padding: '0.75rem 1rem' }}>Item / Part Name</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>HSN / SAC</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Unit Selling Price</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Cost Price</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Stock Qty</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>GST Rate</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory
                                        .filter(item => {
                                            const matchesSearch = !invSearch.trim() ||
                                                (item.name || '').toLowerCase().includes(invSearch.toLowerCase()) ||
                                                (item.part_number || '').toLowerCase().includes(invSearch.toLowerCase()) ||
                                                (item.hsn_code || '').toLowerCase().includes(invSearch.toLowerCase());
                                            const matchesCat = invCategoryFilter === 'All' || item.category === invCategoryFilter;
                                            return matchesSearch && matchesCat;
                                        })
                                        .map(item => {
                                            const qty = parseInt(item.quantity) || 0;
                                            const stockBadge = qty === 0 
                                                ? { bg: 'rgba(207,102,121,0.15)', color: 'var(--danger)', label: 'Out of Stock (0)' }
                                                : qty <= 3 
                                                ? { bg: 'rgba(255,183,77,0.15)', color: '#ffb74d', label: `Low (${qty})` }
                                                : { bg: 'rgba(3,218,198,0.15)', color: 'var(--success)', label: `${qty} in stock` };

                                            return (
                                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                    <td style={{ padding: '0.75rem 1rem' }}>
                                                        <div style={{ fontWeight: '600' }}>{item.name}</div>
                                                        {item.part_number && (
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                                                                PN: {item.part_number}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem' }}>
                                                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', color: 'var(--text-secondary)' }}>
                                                            {item.category || 'General'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                                                        {item.hsn_code || '-'}
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--accent)' }}>
                                                        ₹{Number(item.unit_price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                                                        {item.cost_price ? `₹${Number(item.cost_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                                                        <span style={{ fontSize: '0.75rem', padding: '3px 9px', borderRadius: '12px', fontWeight: '600', background: stockBadge.bg, color: stockBadge.color }}>
                                                            {stockBadge.label}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: '600' }}>
                                                        {item.gst_rate ?? 18}%
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                                            <button
                                                                onClick={() => setEditingInvItem({ ...item })}
                                                                title="Edit Item"
                                                                style={{ padding: '4px 8px', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--accent)' }}
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteItem(item.id, item.name)}
                                                                title="Delete Item"
                                                                style={{ padding: '4px 8px', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--danger)' }}
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    {inventory.length === 0 && (
                                        <tr>
                                            <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                No inventory items registered yet. Click "+ Add Spare / Item" to add parts.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── ADD ITEM MODAL ── */}
                    {showAddInvModal && (
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                            <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', width: '100%', maxWidth: '520px', padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                                        <Plus size={18} color="var(--accent)" /> Add Spare Part / Inventory Item
                                    </h3>
                                    <button onClick={() => setShowAddInvModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}>✕</button>
                                </div>
                                <form onSubmit={handleSaveNewItem}>
                                    <div style={{ marginBottom: '0.85rem' }}>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Item / Part Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={invForm.name}
                                            onChange={e => setInvForm({ ...invForm, name: e.target.value })}
                                            placeholder="e.g. Kingston 512GB NVMe SSD"
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '0.85rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Part # / Model</label>
                                            <input
                                                type="text"
                                                value={invForm.part_number}
                                                onChange={e => setInvForm({ ...invForm, part_number: e.target.value })}
                                                placeholder="e.g. SNV2S/500G"
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Category</label>
                                            <select
                                                value={invForm.category}
                                                onChange={e => setInvForm({ ...invForm, category: e.target.value })}
                                                style={{ ...inputStyle, cursor: 'pointer' }}
                                            >
                                                {['General', 'Storage', 'RAM', 'Screen/Display', 'Battery', 'Printer Parts', 'Motherboard/IC', 'Accessories', 'Power/Adapters'].map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '0.85rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Selling Price (₹) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={invForm.unit_price}
                                                onChange={e => setInvForm({ ...invForm, unit_price: e.target.value })}
                                                placeholder="e.g. 2800"
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Cost / Purchase Price (₹)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={invForm.cost_price}
                                                onChange={e => setInvForm({ ...invForm, cost_price: e.target.value })}
                                                placeholder="e.g. 2200"
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Initial Stock Qty</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={invForm.quantity}
                                                onChange={e => setInvForm({ ...invForm, quantity: e.target.value })}
                                                placeholder="0"
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>HSN / SAC</label>
                                            <input
                                                type="text"
                                                value={invForm.hsn_code}
                                                onChange={e => setInvForm({ ...invForm, hsn_code: e.target.value })}
                                                placeholder="8473"
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>GST Rate (%)</label>
                                            <select
                                                value={invForm.gst_rate}
                                                onChange={e => setInvForm({ ...invForm, gst_rate: e.target.value })}
                                                style={{ ...inputStyle, cursor: 'pointer' }}
                                            >
                                                <option value="0">0% (Nil)</option>
                                                <option value="5">5%</option>
                                                <option value="12">12%</option>
                                                <option value="18">18%</option>
                                                <option value="28">28%</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button type="submit" style={{ flex: 1, padding: '0.75rem', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                                            Add to Inventory
                                        </button>
                                        <button type="button" onClick={() => setShowAddInvModal(false)} style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer' }}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* ── EDIT ITEM MODAL ── */}
                    {editingInvItem && (
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                            <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', width: '100%', maxWidth: '520px', padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                                        <Edit2 size={18} color="var(--accent)" /> Edit Inventory Item
                                    </h3>
                                    <button onClick={() => setEditingInvItem(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}>✕</button>
                                </div>
                                <form onSubmit={handleUpdateItem}>
                                    <div style={{ marginBottom: '0.85rem' }}>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Item / Part Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={editingInvItem.name}
                                            onChange={e => setEditingInvItem({ ...editingInvItem, name: e.target.value })}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '0.85rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Part # / Model</label>
                                            <input
                                                type="text"
                                                value={editingInvItem.part_number || ''}
                                                onChange={e => setEditingInvItem({ ...editingInvItem, part_number: e.target.value })}
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Category</label>
                                            <select
                                                value={editingInvItem.category || 'General'}
                                                onChange={e => setEditingInvItem({ ...editingInvItem, category: e.target.value })}
                                                style={{ ...inputStyle, cursor: 'pointer' }}
                                            >
                                                {['General', 'Storage', 'RAM', 'Screen/Display', 'Battery', 'Printer Parts', 'Motherboard/IC', 'Accessories', 'Power/Adapters'].map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '0.85rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Selling Price (₹) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={editingInvItem.unit_price}
                                                onChange={e => setEditingInvItem({ ...editingInvItem, unit_price: e.target.value })}
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Cost / Purchase Price (₹)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editingInvItem.cost_price || ''}
                                                onChange={e => setEditingInvItem({ ...editingInvItem, cost_price: e.target.value })}
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Quantity In Stock</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={editingInvItem.quantity}
                                                onChange={e => setEditingInvItem({ ...editingInvItem, quantity: e.target.value })}
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>HSN / SAC</label>
                                            <input
                                                type="text"
                                                value={editingInvItem.hsn_code || ''}
                                                onChange={e => setEditingInvItem({ ...editingInvItem, hsn_code: e.target.value })}
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>GST Rate (%)</label>
                                            <select
                                                value={editingInvItem.gst_rate ?? 18}
                                                onChange={e => setEditingInvItem({ ...editingInvItem, gst_rate: e.target.value })}
                                                style={{ ...inputStyle, cursor: 'pointer' }}
                                            >
                                                <option value="0">0% (Nil)</option>
                                                <option value="5">5%</option>
                                                <option value="12">12%</option>
                                                <option value="18">18%</option>
                                                <option value="28">28%</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button type="submit" style={{ flex: 1, padding: '0.75rem', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                                            Save Changes
                                        </button>
                                        <button type="button" onClick={() => setEditingInvItem(null)} style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer' }}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
