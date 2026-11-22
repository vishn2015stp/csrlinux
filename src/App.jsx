import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Menu, Plus, FileText, X as CloseIcon } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Intake from './pages/Intake'
import ProformaInvoice from './pages/ProformaInvoice'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Requests from './pages/Requests'
import { useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'transparent', padding: '0.25rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', margin: 0 }}>
            <Menu size={24} color="var(--text-primary)" />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.25rem' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '28px', width: '28px', borderRadius: '4px', objectFit: 'cover' }} /> Hyper-CSR
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#f6f3eb', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', border: '1px solid var(--border-color)', fontWeight: 'bold' }}>
            User: <span style={{ color: '#35a7e6' }}>{user?.username}</span>
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      <div 
        className={`mobile-overlay ${isSidebarOpen ? 'show' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/intake" element={<ProtectedRoute><Intake /></ProtectedRoute>} />
          <Route path="/proforma" element={<ProtectedRoute><ProformaInvoice /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Floating Action Menu Button (Speed Dial) */}
      <div className="floating-fab-container non-print">
        {showFabMenu && (
          <div className="floating-fab-menu">
            <button
              onClick={() => {
                navigate('/intake');
                setShowFabMenu(false);
              }}
              className="floating-fab-item"
              title="Add New Service Request (Intake)"
            >
              <div className="floating-fab-icon-box" style={{ background: '#35a7e6' }}>
                <Plus size={18} color="#000" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.88rem', color: 'var(--text-primary)' }}>New Service Request</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Log device for repair intake</div>
              </div>
            </button>
            <button
              onClick={() => {
                navigate('/proforma');
                setShowFabMenu(false);
              }}
              className="floating-fab-item"
              title="Create Proforma Invoice / Quotation"
            >
              <div className="floating-fab-icon-box" style={{ background: '#10b981' }}>
                <FileText size={18} color="#fff" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.88rem', color: 'var(--text-primary)' }}>New Proforma Invoice</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Quotation with inventory & GST</div>
              </div>
            </button>
          </div>
        )}

        <button
          onClick={() => setShowFabMenu(!showFabMenu)}
          className={`floating-add-btn ${showFabMenu ? 'active' : ''}`}
          title="Create New Request or Proforma Invoice"
          aria-expanded={showFabMenu}
        >
          {showFabMenu ? <CloseIcon size={20} /> : <Plus size={20} />}
          <span>{showFabMenu ? 'Close' : 'Add New'}</span>
        </button>
      </div>

      {showFabMenu && (
        <div
          className="fab-backdrop"
          onClick={() => setShowFabMenu(false)}
        />
      )}
    </>
  )
}

export default App
