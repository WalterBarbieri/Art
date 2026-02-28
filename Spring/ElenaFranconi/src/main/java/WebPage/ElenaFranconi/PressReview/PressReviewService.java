package WebPage.ElenaFranconi.PressReview;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import WebPage.ElenaFranconi.Content.Content;
import WebPage.ElenaFranconi.Course.Course;
import WebPage.ElenaFranconi.Event.Event;
import WebPage.ElenaFranconi.Exceptions.BadRequestException;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import WebPage.ElenaFranconi.PressReview.dto.PressReviewRequestDto;
import WebPage.ElenaFranconi.PressReview.dto.PressReviewUpdateDto;
import WebPage.ElenaFranconi.Storage.FileType;
import WebPage.ElenaFranconi.Storage.StorageService;

@Service
public class PressReviewService<T extends Content> {
	@Autowired
	private PressReviewRepository pressReviewRepository;

	@Autowired
	private StorageService storageService;

	// POST METHODS

	public PressReview createPressReview(T content, PressReviewRequestDto body) {
		if (body.getImage() == null || body.getImage().isEmpty()) {
			throw new IllegalArgumentException("Image is required for press review");
		}

		if (!isValidImage(body.getImage())) {
			throw new IllegalArgumentException("Invalid image format for press review");
		}

		boolean urlExists = false;

		if (content instanceof Course) {
			urlExists = pressReviewRepository.existsByCourseIdAndUrl(content.getId(), body.getUrl());
		} else if (content instanceof Event) {
			urlExists = pressReviewRepository.existsByEventIdAndUrl(content.getId(), body.getUrl());
		}

		if (urlExists) {
			throw new BadRequestException("A press review with the same URL already exists for this content");
		}

		String path = storageService.storeFile(body.getImage(), content.getId(), FileType.PRESS_REVIEW);
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

	// PUT METHODS
	public PressReview editPressReview(T content, PressReviewUpdateDto body) {
		PressReview pressReview = this.findPressReviewById(body.getId());

		if (content instanceof Course ? !pressReview.getCourse().getId().equals(content.getId())
				: !pressReview.getEvent().getId().equals(content.getId())) {
			throw new BadRequestException("Press review does not belong to the specified content");
		}

		if (body.getUrl() != null && !body.getUrl().isEmpty() && !body.getUrl().equals(pressReview.getUrl())) {
			boolean urlExists = false;

			if (content instanceof Course) {
				urlExists = pressReviewRepository.existsByCourseIdAndUrl(content.getId(), body.getUrl());
			} else if (content instanceof Event) {
				urlExists = pressReviewRepository.existsByEventIdAndUrl(content.getId(), body.getUrl());
			}

			if (urlExists) {
				throw new BadRequestException("A press review with the same URL already exists for this content");
			}

			pressReview.setUrl(body.getUrl());
		}

		if (body.getImage() != null && !body.getImage().isEmpty()) {
			if (!isValidImage(body.getImage())) {
				throw new BadRequestException("Invalid image format for press review");
			}
			storageService.deleteFile(pressReview.getImagePath());
			String path = storageService.storeFile(body.getImage(), content.getId(), FileType.PRESS_REVIEW);
			pressReview.setImagePath(normalizePath(path));
		}
		return pressReviewRepository.save(pressReview);
	}

	// DELETE METHODS
	public void deletePressReview(UUID pressReviewId) {
		try {
			PressReview pressReview = findPressReviewById(pressReviewId);
			storageService.deleteFile(pressReview.getImagePath());
			pressReviewRepository.delete(pressReview);
		} catch (Exception e) {
			throw new BadRequestException("Error deleting press review: " + e.getMessage());
		}
	}

	// HELPER METHODS
	private PressReview findPressReviewById(UUID pressReviewId) {
		return pressReviewRepository.findById(pressReviewId).orElseThrow(() -> new NotFoundException(pressReviewId));
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
