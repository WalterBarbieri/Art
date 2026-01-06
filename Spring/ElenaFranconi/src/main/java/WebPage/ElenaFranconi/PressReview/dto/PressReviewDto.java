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

	public static PressReviewDto fromPressReview(PressReview pressReview) {
		PressReviewDto dto = new PressReviewDto();
		dto.setId(pressReview.getId());
		dto.setUrl(pressReview.getUrl());
		dto.setImagePath(pressReview.getImagePath());
		dto.setCreatedAt(pressReview.getCreatedAt());
		dto.setUpdatedAt(pressReview.getUpdatedAt());
		return dto;
	}

	public static List<PressReviewDto> fromPressReviewList(List<PressReview> prs) {
		return prs.stream().map(PressReviewDto::fromPressReview).toList();
	}
}
