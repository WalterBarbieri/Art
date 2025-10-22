package WebPage.ElenaFranconi.Event.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Event.Event;
import WebPage.ElenaFranconi.EventDateSlot.dto.EventDateSlotDto;
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
	private UUID linkedCourseId;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private ContentStatus contentStatus;
	private LocalDate relevantDate;
	private boolean archived;

	public EventDto(UUID id, String title, String description, String coverImagePath, List<String> imagePaths,
			List<String> filePaths, List<String> videoPaths, List<EventDateSlotDto> eventDateSlots, String location,
			UUID linkedCourseId, LocalDateTime createdAt, LocalDateTime updatedAt, ContentStatus contentStatus,
			LocalDate relevantDate, boolean archived) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.coverImagePath = coverImagePath;
		this.imagePaths = imagePaths;
		this.filePaths = filePaths;
		this.videoPaths = videoPaths;
		this.eventDateSlots = eventDateSlots;
		this.location = location;
		this.linkedCourseId = linkedCourseId;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.contentStatus = contentStatus;
		this.relevantDate = relevantDate;
		this.archived = archived;
	}

	public static EventDto fromEvent(Event event) {
		List<EventDateSlotDto> dateSlotDtos = EventDateSlotDto.fromEventDateSlots(event.getDateSlots());
		return new EventDto(event.getId(), event.getTitle(), event.getDescription(), event.getCoverImagePath(),
				event.getImagePaths(), event.getFilePaths(), event.getVideoPaths(), dateSlotDtos, event.getLocation(),
				event.getLinkedCourse() != null ? event.getLinkedCourse().getId() : null, event.getCreatedAt(),
				event.getUpdatedAt(), event.getContentStatus(), event.calculateRelevantDate(), event.isArchived());
	}

	public static List<EventDto> fromEventList(List<Event> events) {
		return events.stream().map(EventDto::fromEvent).toList();
	}

}
