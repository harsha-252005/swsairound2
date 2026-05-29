package com.example.smartdochubs.service;

import com.example.smartdochubs.model.Notification;
import com.example.smartdochubs.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository repository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    public void send(String message, String type) {
        Notification n = new Notification();
        n.setMessage(message);
        n.setType(type);
        n.setRead(false);
        n.setTimestamp(LocalDateTime.now());
        repository.save(n);
        messagingTemplate.convertAndSend("/topic/notifications", n);
    }

    public List<Notification> getUnread() {
        return repository.findByReadFalse();
    }

    public void markAllRead() {
        List<Notification> unread = repository.findByReadFalse();
        unread.forEach(n -> n.setRead(true));
        repository.saveAll(unread);
    }
}
