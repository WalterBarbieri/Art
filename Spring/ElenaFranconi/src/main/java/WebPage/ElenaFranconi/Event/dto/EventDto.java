package WebPage.ElenaFranconi.Event.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Event.Event;
import WebPage.ElenaFranconi.EventDateSlot.dto.EventDateSlotDto;
import WebPage.ElenaFranconi.PressReview.dto.PressReviewDto;
import lombok.Data;

@Data
public class EventDto {

	private UUID id;
	private String title;
	private String description;
	private String coverImagePath;
	private List<String> imagePaths;
	private List<String> filePaths;
	private List<String> videoPaths;
	private List<EventDateSlotDto> eventDateSlots;
	private String location;
	private String informations;
	private String googleMapsLink;
	private UUID linkedCourseId;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private ContentStatus contentStatus;
	private LocalDate relevantDate;
	private boolean archived;
	private List<PressReviewDto> pressReviews;

	public static EventDto fromEvent(Event event) {
		List<EventDateSlotDto> dateSlotDtos = EventDateSlotDto.fromEventDateSlots(event.getDateSlots());
		EventDto dto = new EventDto();
		dto.setId(event.getId());
		dto.setTitle(event.getTitle());
		dto.setDescription(event.getDescription());
		dto.setCoverImagePath(event.getCoverImagePath());
		dto.setImagePaths(event.getImagePaths());
		dto.setFilePaths(event.getFilePaths());
		dto.setVideoPaths(event.getVideoPaths());
		dto.setEventDateSlots(dateSlotDtos);
		dto.setLocation(event.getLocation());
		dto.setInformations(event.getInformations());
		dto.setGoogleMapsLink(event.getGoogleMapsLink());
		dto.setLinkedCourseId(event.getLinkedCourse() != null ? event.getLinkedCourse().getId() : null);
		dto.setCreatedAt(event.getCreatedAt());
		dto.setUpdatedAt(event.getUpdatedAt());
		dto.setContentStatus(event.getContentStatus());
		dto.setRelevantDate(event.calculateRelevantDate());
		dto.setArchived(event.isArchived());
		dto.setPressReviews(PressReviewDto.fromPressReviewList(event.getPressReviews()));
		return dto;
	}

	public static List<EventDto> fromEventList(List<Event> events) {
		return events.stream().map(EventDto::fromEvent).toList();
	}

}
