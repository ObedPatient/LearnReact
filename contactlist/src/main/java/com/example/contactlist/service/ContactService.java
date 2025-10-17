package com.example.contactlist.service;

import com.example.contactlist.model.Contact;
import com.example.contactlist.repository.ContactRepo;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Function;

import static com.example.contactlist.constant.Constant.IMAGE_DIRECTORY;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@Transactional(rollbackOn = Exception.class)
@AllArgsConstructor
public class ContactService {

    private final ContactRepo contactRepo;

    public Page<Contact> getAllContacts(int page, int size) {
        return contactRepo.findAll(PageRequest.of(page, size, Sort.by("name")));
    }

    public Contact getContact(String id) {
        return contactRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Contact not found: " + id));
    }

    public Contact saveContact(Contact contact) {
        // Ensure ID is null for new contacts
        if (contact.getId() != null && contact.getId().isEmpty()) {
            contact.setId(null);
        }
        try {
            return contactRepo.save(contact); // Persist for new contacts, merge for existing
        } catch (ConstraintViolationException e) {
            throw new IllegalArgumentException("Validation failed: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to save contact: " + e.getMessage(), e);
        }
    }

    public Contact updateContact(String id, Contact contact) {
        if (!contactRepo.existsById(id)) {
            throw new IllegalArgumentException("Contact not found: " + id);
        }
        contact.setId(id);
        try {
            return contactRepo.save(contact);
        } catch (ConstraintViolationException e) {
            throw new IllegalArgumentException("Validation failed: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to update contact: " + e.getMessage(), e);
        }
    }

    public void deleteContact(Contact contact) {
        if (contact == null || !contactRepo.existsById(contact.getId())) {
            throw new IllegalArgumentException("Contact not found");
        }
        contactRepo.delete(contact);
    }

    public String saveImage(String id, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty or missing");
        }
        Contact contact = getContact(id);
        String imageUrl = imageFunction.apply(id, file);
        contact.setImageUrl(imageUrl);
        contactRepo.save(contact);
        return imageUrl;
    }

    private final Function<String, String> fileExtension = fileName -> Optional.ofNullable(fileName)
            .filter(name -> name.contains("."))
            .map(name -> "." + name.substring(name.lastIndexOf(".") + 1))
            .orElse(".png");

    private final BiFunction<String, MultipartFile, String> imageFunction = (id, image) -> {
        String sanitizedId = id.replaceAll("[^a-zA-Z0-9.-]", "_");
        String fileName = sanitizedId + fileExtension.apply(image.getOriginalFilename());
        try {
            Path fileStorage = Paths.get(IMAGE_DIRECTORY).toAbsolutePath().normalize();
            Files.createDirectories(fileStorage);
            Path targetPath = fileStorage.resolve(fileName);
            Files.copy(image.getInputStream(), targetPath, REPLACE_EXISTING);
            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/contacts/image/" + fileName)
                    .toUriString();
        } catch (IOException exception) {
            throw new RuntimeException("Unable to save image: " + exception.getMessage(), exception);
        }
    };
}