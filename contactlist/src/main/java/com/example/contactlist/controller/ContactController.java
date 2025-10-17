package com.example.contactlist.controller;

import com.example.contactlist.model.Contact;
import com.example.contactlist.service.ContactService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static com.example.contactlist.constant.Constant.IMAGE_DIRECTORY;

@RestController
@RequestMapping("/contacts")
@AllArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<?> createContact(@RequestBody Contact contact) {
        try {
            Contact saved = contactService.saveContact(contact);
            return ResponseEntity.created(URI.create("/contacts/" + saved.getId())).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to save contact: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<Page<Contact>> getContacts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok().body(contactService.getAllContacts(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getContact(@PathVariable("id") String id) {
        try {
            return ResponseEntity.ok().body(contactService.getContact(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/image")
    public ResponseEntity<?> saveImage(@RequestParam("id") String id, @RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok().body(contactService.saveImage(id, file));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable("id") String id) {
        try {
            Contact contact = contactService.getContact(id);
            contactService.deleteContact(contact);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping(value = "/image/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable("filename") String filename) {
        try {
            filename = filename.replaceAll("[^a-zA-Z0-9._-]", "");
            Path filePath = Paths.get(IMAGE_DIRECTORY, filename);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            byte[] image = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "image/png"))
                    .body(image);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    static class ErrorResponse {
        private final String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}