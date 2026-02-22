package WebPage.ElenaFranconi.Content.Media;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import WebPage.ElenaFranconi.PressReview.dto.PressReviewRequestDto;
import WebPage.ElenaFranconi.PressReview.dto.PressReviewUpdateDto;

public interface MediaUpdateDto {
	MultipartFile getCoverImage();

	List<MultipartFile> getImages();

	List<MultipartFile> getFiles();

	List<MultipartFile> getVideos();

	List<String> getRemovedImages();

	List<String> getRemovedFiles();

	List<String> getRemovedVideos();

	List<UUID> getRemovedPressReviewIds();

	List<PressReviewRequestDto> getNewPressReviews();

	List<PressReviewUpdateDto> getUpdatedPressReviews();
}
