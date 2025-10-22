package WebPage.ElenaFranconi.PressReview;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import WebPage.ElenaFranconi.Content.Content;
import WebPage.ElenaFranconi.Content.ContentRepository;
import WebPage.ElenaFranconi.Course.Course;
import WebPage.ElenaFranconi.Event.Event;
import WebPage.ElenaFranconi.Exceptions.BadRequestException;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import WebPage.ElenaFranconi.Storage.FileType;
import WebPage.ElenaFranconi.Storage.StorageService;
import jakarta.transaction.Transactional;

@Service
public class PressReviewService {
	@Autowired
	private PressReviewRepository pressReviewRepository;

	@Autowired
	private StorageService storageService;

	@Autowired
	private ContentRepository contentRepository;

	// POST METHODS

	@Transactional
	public PressReview createPressReview(UUID contentId, String url, MultipartFile image) {
		if (image == null || image.isEmpty()) {
			throw new IllegalArgumentException("Image is required for press review");
		}

		if (!isValidImage(image)) {
			throw new IllegalArgumentException("Invalid image format for press review");
		}

		Content content = contentRepository.findById(contentId).orElseThrow(() -> new NotFoundException(contentId));

		String path = storageService.storeFile(image, contentId, FileType.PRESS_REVIEW);
		PressReview pressReview = new PressReview();
		pressReview.setImagePath(normalizePath(path));
		pressReview.setUrl(url);
		if (content instanceof Course course) {
			pressReview.setCourse(course);
		} else if (content instanceof Event event) {
			pressReview.setEvent(event);
		} else {
			throw new BadRequestException("Invalid Content Type");
		}
		return pressReviewRepository.save(pressReview);
	}

	// GET METHODS
	@Transactional
	public List<PressReview> findPressReviewByCourseId(UUID courseId) {
		return pressReviewRepository.findByCourseId(courseId);
	}

	@Transactional
	public List<PressReview> findPressReviewByEventId(UUID eventId) {
		return pressReviewRepository.findByEventId(eventId);
	}

	// VALIDATION METHODS
	protected String normalizePath(String path) {
		return path.replace("\\", "/");
	}

	private boolean isValidImage(MultipartFile file) {
		String contentType = file.getContentType();
		if (contentType == null) {
			return false;
		}

		List<String> allowedTypes = Arrays.asList("image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif");

		return allowedTypes.contains(contentType);
	}

}
