package com.example.smartdochubs.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String originalName;
    private Long fileSize;
    private String fileType;
    private String filePath;
    private LocalDateTime uploadDate;
    private String status;
}
