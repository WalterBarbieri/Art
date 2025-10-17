package WebPage.ElenaFranconi.Event.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Event.Event;
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
	private List<LocalDateTime> eventDates;
	private String location;
	private UUID linkedCourseId;
	private LocalDateTime createdAt;
	private ContentStatus contentStatus;
	private LocalDateTime relevantDate;
	private boolean archived;

	public EventDto(UUID id, String title, String description, String coverImagePath, List<String> imagePaths,
			List<String> filePaths, List<String> videoPaths, List<LocalDateTime> eventDates, String location,
			UUID linkedCourseId, LocalDateTime createdAt, ContentStatus contentStatus, LocalDateTime relevantDate,
			boolean archived) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.coverImagePath = coverImagePath;
		this.imagePaths = imagePaths;
		this.filePaths = filePaths;
		this.videoPaths = videoPaths;
		this.eventDates = eventDates;
		this.location = location;
		this.linkedCourseId = linkedCourseId;
		this.createdAt = createdAt;
		this.contentStatus = contentStatus;
		this.relevantDate = relevantDate;
		this.archived = archived;
	}

	public static EventDto fromEvent(Event event) {
		return new EventDto(event.getId(), event.getTitle(), event.getDescription(), event.getCoverImagePath(),
				event.getImagePaths(), event.getFilePaths(), event.getVideoPaths(), event.getEventDates(),
				event.getLocation(), event.getLinkedCourse() != null ? event.getLinkedCourse().getId() : null,
				event.getCreatedAt(), event.getContentStatus(), event.calculateRelevantDate(), event.isArchived());
	}

	public static List<EventDto> fromEventList(List<Event> events) {
		return events.stream().map(EventDto::fromEvent).toList();
	}
}
