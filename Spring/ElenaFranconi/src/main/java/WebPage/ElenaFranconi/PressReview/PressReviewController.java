package WebPage.ElenaFranconi.PressReview;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import WebPage.ElenaFranconi.PressReview.dto.PressReviewDto;

@RestController
@RequestMapping("/api/press-reviews")
public class PressReviewController {

	@Autowired
	private PressReviewService pressReviewService;

	// GET METHODS

	@GetMapping("/course/{courseId}")
	public List<PressReviewDto> getByCourse(@PathVariable UUID courseId) {
		return PressReviewDto.fromPressReviewList(pressReviewService.findPressReviewByCourseId(courseId));
	}

	@GetMapping("/event/{eventId}")
	public List<PressReviewDto> getByEvent(@PathVariable UUID eventId) {
		return PressReviewDto.fromPressReviewList(pressReviewService.findPressReviewByEventId(eventId));
	}

	// POST METHODS
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public PressReviewDto createPressReview(@PathVariable UUID contentId, @PathVariable String url,
			@PathVariable MultipartFile image) {
		PressReview pressReview = pressReviewService.createPressReview(contentId, url, image);
		return PressReviewDto.fromPressReview(pressReview);
	}

}
