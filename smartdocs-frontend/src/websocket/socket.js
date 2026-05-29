// Vercel serverless does not support WebSocket persistent connections.
// Using polling instead — checks for new notifications every 10 seconds.

let interval = null

export const connectSocket = (onNotification) => {
  let lastCount = 0

  const poll = async () => {
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      const unread = data.filter((n) => !n.read)
      if (unread.length > lastCount) {
        const newOnes = unread.slice(0, unread.length - lastCount)
        newOnes.forEach((n) => onNotification(n))
      }
      lastCount = unread.length
    } catch {
      // ignore network errors
    }
  }

  poll()
  interval = setInterval(poll, 10000)
}

export const disconnectSocket = () => {
  if (interval) clearInterval(interval)
}
