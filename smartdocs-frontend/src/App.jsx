import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Bell, FileStack } from 'lucide-react'
import FileUpload from './components/FileUpload'
import DocumentsPage from './pages/DocumentsPage'
import NotificationDrawer from './components/NotificationDrawer'
import { NotificationProvider, useNotifications } from './context/NotificationContext'

function Nav() {
  const { unreadCount, setDrawerOpen } = useNotifications()
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <FileStack size={20} className="text-blue-600" />
          <span className="font-bold text-slate-800 text-base tracking-tight">SmartDocHub</span>
        </div>
        <div className="flex gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`
            }
          >
            Upload
          </NavLink>
          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`
            }
          >
            Documents
          </NavLink>
        </div>
      </div>
      <button
        onClick={() => setDrawerOpen(true)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[9px] font-bold min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Livvic, sans-serif', fontSize: '14px', borderRadius: '10px' },
            success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
            error: { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
          }}
        />
        <Nav />
        <NotificationDrawer />
        <Routes>
          <Route path="/" element={<FileUpload />} />
          <Route path="/documents" element={<DocumentsPage />} />
        </Routes>
      </NotificationProvider>
    </BrowserRouter>
  )
}
