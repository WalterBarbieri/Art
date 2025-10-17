package WebPage.ElenaFranconi.Storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StorageService {
	public final String uploadDir = "uploads";

	public StorageService() {
		Path uploadPath = Paths.get(uploadDir);
		try {
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}
		} catch (IOException e) {
			throw new RuntimeException("Could not initialize storage", e);
		}
	}

	// POST METHODS

	public String storeFile(MultipartFile file, UUID contentId, FileType fileType) {
		String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
		String subDir = fileType.getDirectoryName();
		Path contDirPath = Paths.get(uploadDir, "content", contentId.toString(), subDir);
		try {
			if (!Files.exists(contDirPath)) {
				Files.createDirectories(contDirPath);
			}
			Path destinationPath = contDirPath.resolve(fileName);
			Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);
			return normalizePath(Paths.get("content", contentId.toString(), subDir, fileName).toString());
		} catch (IOException e) {
			throw new RuntimeException("Failed to store file " + fileName, e);
		}
	}

	// GET METHODS
	public Path loadFile(String relativePath) {
		return Paths.get(uploadDir).resolve(relativePath);
	}

	// DELETE METHODS
	public void deleteFile(String relativePath) {
		try {
			Path filePath = loadFile(relativePath);
			Files.deleteIfExists(filePath);
		} catch (IOException e) {
			throw new RuntimeException("Failed to delete file: " + relativePath, e);
		}
	}

	public void deleteAllContentFiles(UUID contentId) {
		Path contDir = Paths.get(uploadDir, "content", contentId.toString());
		try {
			if (Files.exists(contDir)) {
				Files.walk(contDir).sorted(Comparator.reverseOrder()).forEach(path -> {
					try {
						Files.deleteIfExists(path);
					} catch (IOException e) {
						throw new RuntimeException("Failed to delete file: " + path, e);
					}
				});
				Files.deleteIfExists(contDir);
			}
		} catch (IOException e) {
			throw new RuntimeException("Could not delete content files or directory", e);
		}
	}

	// LOGIC METHODS

	private String normalizePath(String path) {
		return path.replace("\\", "/");
	}
}
