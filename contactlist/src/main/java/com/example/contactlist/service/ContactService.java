package com.example.contactlist.service;

import com.example.contactlist.model.Contact;
import com.example.contactlist.repository.ContactRepo;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
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
        return contactRepo.findById(id).orElse(null);
    }

    public Contact saveContact(Contact contact) {
        return contactRepo.save(contact);
    }

    public void deleteContact(Contact contact) {
        contactRepo.delete(contact);  // Implement as needed
    }

    public String saveImage(String id, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty or missing");
        }
        Contact contact = getContact(id);
        if (contact == null) {
            throw new IllegalArgumentException("Contact not found for ID: " + id);
        }
        String imageUrl = imageFunction.apply(id, file);
        contact.setImageUrl(imageUrl);
        contactRepo.save(contact);
        return imageUrl;
    }

    private final Function<String, String> fileExtension = fileName -> {
        if (!StringUtils.hasText(fileName)) return ".png";  // Handle null/empty filename
        return Optional.of(fileName)
                .filter(name -> name.contains("."))
                .map(name -> "." + name.substring(name.lastIndexOf(".") + 1))  // Fixed: 'name' not 'fileName'
                .orElse(".png");
    };

    private final BiFunction<String, MultipartFile, String> imageFunction = (id, image) -> {
        String sanitizedId = id.replaceAll("[^a-zA-Z0-9.-]", "_");  // Sanitize to prevent invalid chars
        String fileName = sanitizedId + fileExtension.apply(image.getOriginalFilename());
        try (InputStream inputStream = image.getInputStream()) {
            Path fileStorage = Paths.get(IMAGE_DIRECTORY).toAbsolutePath().normalize();

            // Debug: Print the path (check console/logs)
            System.out.println("Image directory path: " + fileStorage);

            // Fixed: Always create directories (idempotent, handles missing parents)
            Files.createDirectories(fileStorage);

            Path targetPath = fileStorage.resolve(fileName);
            Files.copy(inputStream, targetPath, REPLACE_EXISTING);

            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/contacts/image/" + fileName).toUriString();
        } catch (IOException exception) {
            exception.printStackTrace();  // Full details in logs
            throw new RuntimeException("Unable to save image: " + exception.getMessage(), exception);
        }
    };
}