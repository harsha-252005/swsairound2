import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let client = null

export const connectSocket = (onNotification) => {
  try {
    client = new Client({
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/notifications', (message) => {
          try {
            onNotification(JSON.parse(message.body))
          } catch {
            // ignore malformed messages
          }
        })
      },
      onStompError: () => {},
      onWebSocketError: () => {},
    })
    client.activate()
  } catch {
    // ignore connection errors
  }
}

export const disconnectSocket = () => {
  try {
    if (client) client.deactivate()
  } catch {
    // ignore
  }
}
