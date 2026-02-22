package WebPage.ElenaFranconi.Course.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

import WebPage.ElenaFranconi.Content.Media.MediaUpdateDto;
import WebPage.ElenaFranconi.PressReview.dto.PressReviewRequestDto;
import WebPage.ElenaFranconi.PressReview.dto.PressReviewUpdateDto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CourseUpdateDto implements MediaUpdateDto {

	@NotBlank(message = "Title is required")
	private String title;

	@NotBlank(message = "Description is required")
	private String description;

	@NotNull(message = "Start date is required")
	private LocalDate dateFrom;

	@NotNull(message = "End date is required")
	private LocalDate dateTo;

	@NotBlank(message = "Location is required")
	private String location;

	@Nullable
	private String informations;

	@Nullable
	private String googleMapsLink;

	@Min(value = 1, message = "Maximum participants must be at least 1")
	private int maxParticipants;

	// Existing media to remove
	@Nullable
	private List<String> removedImages;
	@Nullable
	private List<String> removedFiles;
	@Nullable
	private List<String> removedVideos;

	// New media to add
	@Nullable
	private MultipartFile coverImage;
	@Nullable
	private List<MultipartFile> images;
	@Nullable
	private List<MultipartFile> files;
	@Nullable
	private List<MultipartFile> videos;

	// Press Reviews
	@Nullable
	private List<UUID> removedPressReviewIds;
	@Nullable
	private List<PressReviewRequestDto> newPressReviews;
	@Nullable
	private List<PressReviewUpdateDto> updatedPressReviews;

}
