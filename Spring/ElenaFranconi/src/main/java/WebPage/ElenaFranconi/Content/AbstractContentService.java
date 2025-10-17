package WebPage.ElenaFranconi.Content;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import WebPage.ElenaFranconi.Storage.FileType;
import WebPage.ElenaFranconi.Storage.StorageService;

@Service
public abstract class AbstractContentService<T extends Content> {

	@Autowired
	private StorageService storageService;

	// HELPER METHODS

	protected void handleMediaAttachments(T content, MultipartFile coverImage, List<MultipartFile> images,
			List<MultipartFile> files, List<MultipartFile> videos) {
		UUID contentId = content.getId();

		if (coverImage != null && !coverImage.isEmpty()) {
			if (!isValidImage(coverImage)) {
				throw new IllegalArgumentException("Invalid image format for cover image");
			}
			String path = storageService.storeFile(coverImage, contentId, FileType.IMAGE);
			content.setCoverImagePath(normalizePath(path));
		}

		if (images != null) {
			for (MultipartFile image : images) {
				if (image != null && !image.isEmpty()) {
					if (!isValidImage(image)) {
						throw new IllegalArgumentException("Invalid image format");
					}
					String path = storageService.storeFile(image, contentId, FileType.IMAGE);
					content.getImagePaths().add(normalizePath(path));
				}
			}
		}

		if (files != null) {
			for (MultipartFile file : files) {
				if (file != null && !file.isEmpty()) {
					if (!isValidFile(file)) {
						throw new IllegalArgumentException("Invalid file format");
					}
					String path = storageService.storeFile(file, contentId, FileType.FILE);
					content.getFilePaths().add(normalizePath(path));
				}
			}
		}

		if (videos != null) {
			for (MultipartFile video : videos) {
				if (video != null && !video.isEmpty()) {
					if (!isValidVideo(video)) {
						throw new IllegalArgumentException("Invalid video format");
					}
					String path = storageService.storeFile(video, contentId, FileType.VIDEO);
					content.getVideoPaths().add(normalizePath(path));
				}
			}
		}
	}

	protected void prepareContent(T content) {
		content.setCreatedAt(LocalDateTime.now());
		content.setArchived(false);
		content.setContentStatus(content.calculateContentStatus());
		content.setRelevantDate(content.calculateRelevantDate());
	}

	// VALIDATION METHODS
	protected String normalizePath(String path) {
		return path.replace("\\", "/");
	}

	protected boolean isValidImage(MultipartFile file) {
		String contentType = file.getContentType();
		if (contentType == null) {
			return false;
		}

		List<String> allowedTypes = Arrays.asList("image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif");

		return allowedTypes.contains(contentType);
	}

	protected boolean isValidFile(MultipartFile file) {
		String contentType = file.getContentType();
		if (contentType == null) {
			return false;
		}
		List<String> allowedTypes = Arrays.asList("application/pdf", "application/msword",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel",
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/zip",
				"application/x-rar-compressed", "text/plain", "application/x-7z-compressed", "application/x-tar",
				"application/json", "application/xml", "application/vnd.oasis.opendocument.text",
				"application/vnd.oasis.opendocument.spreadsheet", "application/vnd.oasis.opendocument.presentation",
				"application/vnd.oasis.opendocument.graphics", "application/vnd.oasis.opendocument.chart",
				"application/vnd.oasis.opendocument.database", "application/vnd.oasis.opendocument.formula");
		return allowedTypes.contains(contentType);
	}

	protected boolean isValidVideo(MultipartFile file) {
		String contentType = file.getContentType();
		if (contentType == null) {
			return false;
		}

		List<String> allowedTypes = Arrays.asList("video/mp4", "video/x-msvideo", "video/x-matroska", "video/webm",
				"video/quicktime", "video/mpeg");

		return allowedTypes.contains(contentType);
	}
}
