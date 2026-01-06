package WebPage.ElenaFranconi.Course.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Course.Course;
import WebPage.ElenaFranconi.PressReview.dto.PressReviewDto;
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
	private LocalDate dateFrom;
	private LocalDate dateTo;
	private String location;
	private String informations;
	private String googleMapsLink;
	private int maxParticipants;
	private long confirmedParticipants;
	private boolean full;
	private UUID linkedEventId;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private ContentStatus contentStatus;
	private LocalDate relevantDate;
	private boolean archived;
	private List<PressReviewDto> pressReviews;

	public static CourseDto fromCourse(Course course) {
		long confirmedParticipants = course.countParticipants();
		boolean full = course.isFull();
		CourseDto dto = new CourseDto();
		dto.setId(course.getId());
		dto.setTitle(course.getTitle());
		dto.setDescription(course.getDescription());
		dto.setCoverImagePath(course.getCoverImagePath());
		dto.setImagePaths(course.getImagePaths());
		dto.setFilePaths(course.getFilePaths());
		dto.setVideoPaths(course.getVideoPaths());
		dto.setDateFrom(course.getDateFrom());
		dto.setDateTo(course.getDateTo());
		dto.setLocation(course.getLocation());
		dto.setInformations(course.getInformations());
		dto.setGoogleMapsLink(course.getGoogleMapsLink());
		dto.setMaxParticipants(course.getMaxParticipants());
		dto.setConfirmedParticipants(confirmedParticipants);
		dto.setFull(full);
		dto.setLinkedEventId(course.getLinkedEvent() != null ? course.getLinkedEvent().getId() : null);
		dto.setCreatedAt(course.getCreatedAt());
		dto.setUpdatedAt(course.getUpdatedAt());
		dto.setContentStatus(course.getContentStatus());
		dto.setRelevantDate(course.calculateRelevantDate());
		dto.setArchived(course.isArchived());

		return dto;
	}

	public static List<CourseDto> fromCourseList(List<Course> courses) {
		return courses.stream().map(CourseDto::fromCourse).toList();
	}

}
