package WebPage.ElenaFranconi.Content.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import WebPage.ElenaFranconi.Content.Content;
import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Course.Course;
import WebPage.ElenaFranconi.Event.Event;
import WebPage.ElenaFranconi.EventDateSlot.EventDateSlot;
import lombok.Data;

@Data
public class ContentDto {

	private UUID id;
	private String title;
	private String description;
	private String contentType;
	private String coverImagePath;
	private ContentStatus contentStatus;
	private LocalDate dateFrom;
	private LocalDate dateTo;
	private List<LocalDateTime> eventDates = new ArrayList<>();
	private String location;
	private boolean archived;
	private UUID linkedEventId;
	private UUID linkedCourseId;

	public ContentDto(UUID id, String title, String description, String contentType, String coverImagePath,
			ContentStatus contentStatus, String location, boolean archived) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.contentType = contentType;
		this.coverImagePath = coverImagePath;
		this.contentStatus = contentStatus;
		this.location = location;
		this.archived = archived;
	}

	public static ContentDto fromContent(Content content) {
		ContentDto dto = new ContentDto(content.getId(), content.getTitle(), content.getDescription(),
				content.getClass().getSimpleName(), content.getCoverImagePath(), content.getContentStatus(),
				content.getLocation(), content.isArchived());
		if (content instanceof Course) {
			Course course = (Course) content;
			dto.setDateFrom(course.getDateFrom());
			dto.setDateTo(course.getDateTo());
			dto.setLinkedEventId(course.getLinkedEvent() != null ? course.getLinkedEvent().getId() : null);
		}
		if (content instanceof Event) {
			Event event = (Event) content;
			dto.setEventDates(event.getDateSlots().stream().map(EventDateSlot::getDate).toList());
			dto.setLinkedCourseId(event.getLinkedCourse() != null ? event.getLinkedCourse().getId() : null);
		}
		return dto;
	}

	public static List<ContentDto> fromContentList(List<Content> contents) {
		return contents.stream().map(ContentDto::fromContent).toList();
	}
}
