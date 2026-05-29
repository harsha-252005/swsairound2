package com.example.smartdochubs.service;

import com.example.smartdochubs.model.Document;
import com.example.smartdochubs.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    private final DocumentRepository repository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public DocumentService(DocumentRepository repository) {
        this.repository = repository;
    }

    public Document save(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        Document doc = new Document();
        doc.setFileName(fileName);
        doc.setOriginalName(file.getOriginalFilename());
        doc.setFileSize(file.getSize());
        doc.setFileType(file.getContentType());
        doc.setFilePath(filePath.toString());
        doc.setUploadDate(LocalDateTime.now());
        doc.setStatus("UPLOADED");

        return repository.save(doc);
    }

    public List<Document> getAll() {
        return repository.findAll();
    }

    public Document getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Document not found: " + id));
    }
}
