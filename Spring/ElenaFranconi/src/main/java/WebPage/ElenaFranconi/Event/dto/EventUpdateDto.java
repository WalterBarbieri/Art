package WebPage.ElenaFranconi.Event.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

import WebPage.ElenaFranconi.Content.Media.MediaUpdateDto;
import WebPage.ElenaFranconi.EventDateSlot.dto.EventDateSlotUpdateDto;
import WebPage.ElenaFranconi.PressReview.dto.PressReviewRequestDto;
import WebPage.ElenaFranconi.PressReview.dto.PressReviewUpdateDto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EventUpdateDto implements MediaUpdateDto {

	@NotBlank(message = "Title is required")
	private String title;

	@NotBlank(message = "Description is required")
	private String description;

	// Existing event date slots to update
	private List<EventDateSlotUpdateDto> eventDateSlots;
	// Existing event date slots to remove
	private List<UUID> removedEventDateSlotIds;
	// New event dates to add
	private List<LocalDateTime> newEventDateSlots;

	@Min(value = 1, message = "Maximum participants must be at least 1")
	private int maxParticipants;

	@NotBlank(message = "Location is required")
	private String location;

	@Nullable
	private String informations;
	@Nullable
	private String googleMapsLink;

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
