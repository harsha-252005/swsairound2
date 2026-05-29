package com.example.smartdochubs.controller;

import com.example.smartdochubs.model.Document;
import com.example.smartdochubs.model.Notification;
import com.example.smartdochubs.service.DocumentService;
import com.example.smartdochubs.service.NotificationService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService service;
    private final NotificationService notificationService;

    public DocumentController(DocumentService service, NotificationService notificationService) {
        this.service = service;
        this.notificationService = notificationService;
    }

    @PostMapping("/upload")
    public ResponseEntity<List<Document>> upload(@RequestParam("files") List<MultipartFile> files) throws IOException {
        List<Document> saved = new ArrayList<>();
        for (MultipartFile file : files) {
            saved.add(service.save(file));
        }
        if (files.size() > 3) {
            notificationService.send(files.size() + " files uploaded successfully", "UPLOAD");
        }
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        Document doc = service.getById(id);
        Resource resource = new FileSystemResource(doc.getFilePath());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getOriginalName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @GetMapping("/notifications/unread")
    public ResponseEntity<List<Notification>> getUnread() {
        return ResponseEntity.ok(notificationService.getUnread());
    }

    @PostMapping("/notifications/read")
    public ResponseEntity<Void> markRead() {
        notificationService.markAllRead();
        return ResponseEntity.ok().build();
    }
}
