import { createContext, useContext, useEffect, useState } from 'react'
import { connectSocket, disconnectSocket } from '../websocket/socket'
import axios from 'axios'
import toast from 'react-hot-toast'

const BASE = `${import.meta.env.VITE_API_URL}/api/notifications`
const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    axios.get(BASE)
      .then((res) => setNotifications(res.data))
      .catch(() => {
        // backend not ready yet — notifications will load when available
      })
  }, [])

  useEffect(() => {
    connectSocket((n) => {
      setNotifications((prev) => [n, ...prev])
      toast(n.message, { icon: '🔔', style: { background: '#1e40af', color: '#fff' } })
    })
    return () => disconnectSocket()
  }, [])

  const markOne = async (id) => {
    try {
      await axios.patch(`${BASE}/${id}/read`)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch {
      toast.error('Failed to mark notification as read')
    }
  }

  const markAll = async () => {
    try {
      await axios.patch(`${BASE}/read-all`)
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch {
      toast.error('Failed to mark all notifications as read')
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, drawerOpen, setDrawerOpen, markOne, markAll }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
