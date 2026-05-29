package com.example.smartdochubs.controller;

import com.example.smartdochubs.model.Document;
import com.example.smartdochubs.service.DocumentService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService service;

    public DocumentController(DocumentService service) {
        this.service = service;
    }

    @PostMapping("/upload")
    public ResponseEntity<Document> upload(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(service.save(file));
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
}
