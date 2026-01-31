package WebPage.ElenaFranconi.PressReview.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import WebPage.ElenaFranconi.PressReview.PressReview;
import lombok.Data;

@Data
public class PressReviewDto {
	private UUID id;
	private String url;
	private String imagePath;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private boolean isOwn;

	public static PressReviewDto fromPressReview(PressReview pressReview, UUID contentId) {
		PressReviewDto dto = new PressReviewDto();
		dto.setId(pressReview.getId());
		dto.setUrl(pressReview.getUrl());
		dto.setImagePath(pressReview.getImagePath());
		dto.setCreatedAt(pressReview.getCreatedAt());
		dto.setUpdatedAt(pressReview.getUpdatedAt());
		dto.setOwn((pressReview.getCourse() != null && pressReview.getCourse().getId().equals(contentId))
				|| (pressReview.getEvent() != null && pressReview.getEvent().getId().equals(contentId)));
		return dto;
	}

	public static List<PressReviewDto> fromPressReviewList(List<PressReview> prs, UUID contentId) {
		return prs.stream().map(pr -> fromPressReview(pr, contentId)).toList();
	}
}
