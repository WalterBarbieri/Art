package WebPage.ElenaFranconi.PressReview;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import WebPage.ElenaFranconi.PressReview.dto.PressReviewDto;
import WebPage.ElenaFranconi.PressReview.dto.PressReviewRequestDto;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/press-review")
public class PressReviewController {

	@Autowired
	private PressReviewService pressReviewService;

	// GET METHODS

	@GetMapping("/course/{courseId}")
	public List<PressReviewDto> getByCourse(@PathVariable UUID courseId) {
		return PressReviewDto.fromPressReviewList(pressReviewService.findPressReviewByCourseId(courseId), courseId);
	}

	@GetMapping("/event/{eventId}")
	public List<PressReviewDto> getByEvent(@PathVariable UUID eventId) {
		return PressReviewDto.fromPressReviewList(pressReviewService.findPressReviewByEventId(eventId), eventId);
	}

	// POST METHODS
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public PressReviewDto createPressReview(@Valid @ModelAttribute PressReviewRequestDto body) {
		PressReview pressReview = pressReviewService.createPressReview(body);
		return PressReviewDto.fromPressReview(pressReview, body.getContentId());
	}

}
