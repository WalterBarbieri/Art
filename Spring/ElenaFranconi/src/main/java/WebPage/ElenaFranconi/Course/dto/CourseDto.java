package WebPage.ElenaFranconi.Course.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Course.Course;
import lombok.Data;

@Data
public class CourseDto {

	private UUID id;
	private String title;
	private String description;
	private String coverImagePath;
	private List<String> imagePaths;
	private List<String> filePaths;
	private List<String> videoPaths;
	private LocalDateTime dateFrom;
	private LocalDateTime dateTo;
	private String location;
	private UUID linkedEventId;
	private LocalDateTime createdAt;
	private ContentStatus contentStatus;
	private LocalDateTime relevantDate;
	private boolean archived;

	public CourseDto(UUID id, String title, String description, String coverImagePath, List<String> imagePaths,
			List<String> filePaths, List<String> videoPaths, LocalDateTime dateFrom, LocalDateTime dateTo,
			String location, UUID linkedEventId, LocalDateTime createdAt, ContentStatus contentStatus,
			LocalDateTime relevantDate, boolean archived) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.coverImagePath = coverImagePath;
		this.imagePaths = imagePaths;
		this.filePaths = filePaths;
		this.videoPaths = videoPaths;
		this.dateFrom = dateFrom;
		this.dateTo = dateTo;
		this.location = location;
		this.linkedEventId = linkedEventId;
		this.createdAt = createdAt;
		this.contentStatus = contentStatus;
		this.relevantDate = relevantDate;
		this.archived = archived;
	}

	public static CourseDto fromCourse(Course course) {
		return new CourseDto(course.getId(), course.getTitle(), course.getDescription(), course.getCoverImagePath(),
				course.getImagePaths(), course.getFilePaths(), course.getVideoPaths(), course.getDateFrom(),
				course.getDateTo(), course.getLocation(),
				course.getLinkedEvent() != null ? course.getLinkedEvent().getId() : null, course.getCreatedAt(),
				course.getContentStatus(), course.calculateRelevantDate(), course.isArchived());
	}

	public static List<CourseDto> fromCourseList(List<Course> courses) {
		return courses.stream().map(CourseDto::fromCourse).toList();
	}

}
