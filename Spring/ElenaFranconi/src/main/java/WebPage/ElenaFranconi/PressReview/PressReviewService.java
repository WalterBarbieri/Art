package WebPage.ElenaFranconi.PressReview;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import WebPage.ElenaFranconi.Content.Content;
import WebPage.ElenaFranconi.Content.ContentRepository;
import WebPage.ElenaFranconi.Course.Course;
import WebPage.ElenaFranconi.Event.Event;
import WebPage.ElenaFranconi.Exceptions.BadRequestException;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import WebPage.ElenaFranconi.PressReview.dto.PressReviewRequestDto;
import WebPage.ElenaFranconi.Storage.FileType;
import WebPage.ElenaFranconi.Storage.StorageService;

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
	public PressReview createPressReview(PressReviewRequestDto body) {
		if (body.getImage() == null || body.getImage().isEmpty()) {
			throw new IllegalArgumentException("Image is required for press review");
		}

		if (!isValidImage(body.getImage())) {
			throw new IllegalArgumentException("Invalid image format for press review");
		}

		Content content = contentRepository.findById(body.getContentId())
				.orElseThrow(() -> new NotFoundException(body.getContentId()));

		boolean urlExists = false;

		if (content instanceof Course) {
			urlExists = pressReviewRepository.existsByCourseIdAndUrl(body.getContentId(), body.getUrl());
		} else if (content instanceof Event) {
			urlExists = pressReviewRepository.existsByEventIdAndUrl(body.getContentId(), body.getUrl());
		}

		if (urlExists) {
			throw new BadRequestException("A press review with the same URL already exists for this content");
		}

		String path = storageService.storeFile(body.getImage(), body.getContentId(), FileType.PRESS_REVIEW);
		PressReview pressReview = new PressReview();
		pressReview.setImagePath(normalizePath(path));
		pressReview.setUrl(body.getUrl());
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
	@Transactional(readOnly = true)
	public List<PressReview> findPressReviewByCourseId(UUID courseId) {
		return pressReviewRepository.findByCourseId(courseId);
	}

	@Transactional(readOnly = true)
	public List<PressReview> findPressReviewByEventId(UUID eventId) {
		return pressReviewRepository.findByEventId(eventId);
	}

	// VALIDATION METHODS
	private String normalizePath(String path) {
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
