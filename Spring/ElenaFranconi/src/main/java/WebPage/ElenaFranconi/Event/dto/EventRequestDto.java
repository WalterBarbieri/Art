package WebPage.ElenaFranconi.Event.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EventRequestDto {
	@NotBlank(message = "Title is required")
	private String title;

	@NotBlank(message = "Description is required")
	private String description;

	@NotEmpty(message = "At least one event date is required")
	private List<LocalDateTime> eventDates;

	@Min(value = 1, message = "Maximum participants must be at least 1")
	private int maxParticipants;

	@NotBlank(message = "Location is required")
	private String location;

	@Nullable
	private String informations;

	@Nullable
	private String googleMapsLink;

	@NotNull(message = "Cover Image is required")
	private MultipartFile coverImage;

	@Nullable
	private List<MultipartFile> images;

	@Nullable
	private List<MultipartFile> files;

	@Nullable
	private List<MultipartFile> videos;
}
