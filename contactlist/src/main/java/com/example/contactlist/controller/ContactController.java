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

import java.io.IOError;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static com.example.contactlist.constant.Constant.IMAGE_DIRECTORY;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/contacts")
@AllArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<Contact> createContact(@RequestBody Contact contact) {
        Contact saved = contactService.saveContact(contact);
        return ResponseEntity.created(URI.create("/contacts/" + saved.getId())).body(saved); // Use actual ID
    }

    @GetMapping
    public ResponseEntity<Page<Contact>> getContacts(@RequestParam(value = "page", defaultValue = "0") int page,
                                                     @RequestParam(value = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok().body(contactService.getAllContacts(page, size)); // Fixed typo in service call
    }

    @GetMapping("/{id}")  // Unique sub-path for single contact
    public ResponseEntity<Contact> getContact(@PathVariable("id") String id) {  // Use @PathVariable for RESTful style
        return ResponseEntity.ok().body(contactService.getContact(id));
    }

    @PutMapping("/image")  // More specific path; adjust as needed
    public ResponseEntity<String> saveImage(@RequestParam("id") String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok().body(contactService.saveImage(id, file));
    }


    @GetMapping(value = "/image/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable("filename") String filename) {
        try {
            filename = filename.replaceAll("[^a-zA-Z0-9._-]", ""); // Sanitize filename
            Path filePath = Paths.get(IMAGE_DIRECTORY, filename);
            System.out.println("Attempting to read file: " + filePath);
            if (!Files.exists(filePath)) {
                System.out.println("File not found: " + filePath);
                return ResponseEntity.notFound().build();
            }
            byte[] image = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "image/png"))
                    .body(image);
        } catch (IOException e) {
            System.err.println("Error reading image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}