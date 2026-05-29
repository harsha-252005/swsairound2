import { useNotifications } from '../context/NotificationContext'
import { X, Bell, CheckCheck, Check } from 'lucide-react'

const formatTime = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function NotificationDrawer() {
  const { notifications, drawerOpen, setDrawerOpen, markOne, markAll } = useNotifications()

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-200 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-blue-500" />
            <span className="text-slate-800 font-semibold text-sm">Notifications</span>
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAll}
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium
                  px-2 py-1 rounded-lg hover:bg-blue-50 transition-all duration-150"
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                <Bell size={20} className="opacity-40" />
              </div>
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs text-slate-300">Upload more than 3 files to trigger one</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-5 py-4 flex items-start justify-between gap-3 transition-colors duration-100
                    ${n.read ? 'bg-white' : 'bg-blue-50/60 hover:bg-blue-50'}`}
                >
                  <div className="flex gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-slate-200' : 'bg-blue-500'}`} />
                    <div className="min-w-0">
                      <p className={`text-sm leading-snug ${n.read ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>
                        {n.message}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">{formatTime(n.timestamp)}</p>
                    </div>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markOne(n.id)}
                      title="Mark as read"
                      className="p-1 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-100 transition-all duration-150 shrink-0 mt-0.5"
                    >
                      <Check size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
