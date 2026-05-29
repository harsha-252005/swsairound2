package com.example.smartdochubs.controller;

import com.example.smartdochubs.model.Notification;
import com.example.smartdochubs.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markOne(@PathVariable Long id) {
        service.markOneRead(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAll() {
        service.markAllRead();
        return ResponseEntity.ok().build();
    }
}
