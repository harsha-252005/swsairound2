package com.example.smartdochubs.repository;

import com.example.smartdochubs.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
}
