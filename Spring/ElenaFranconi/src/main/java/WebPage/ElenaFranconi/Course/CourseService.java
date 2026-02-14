package WebPage.ElenaFranconi.Course;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import WebPage.ElenaFranconi.Content.AbstractContentService;
import WebPage.ElenaFranconi.Content.ContentLinkService;
import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Course.dto.CourseDto;
import WebPage.ElenaFranconi.Course.dto.CourseRequestDto;
import WebPage.ElenaFranconi.Course.dto.CourseUpdateDto;
import WebPage.ElenaFranconi.Exceptions.BadRequestException;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import WebPage.ElenaFranconi.PressReview.PressReview;
import WebPage.ElenaFranconi.PressReview.dto.PressReviewDto;

@Service
public class CourseService extends AbstractContentService<Course> {
	@Autowired
	private CourseRepository courseRepository;

	@Autowired
	private ContentLinkService contentLinkService;

	// POST METHODS

	@Transactional
	public Course createCourse(CourseRequestDto body) {
		return saveCourse(body);
	}

	// GET METHODS
	@Transactional(readOnly = true)
	public Course findCourseById(UUID id) {
		return courseRepository.findById(id).orElseThrow(() -> new NotFoundException(id));
	}

	@Transactional(readOnly = true)
	public List<Course> findAllCourse() {
		return courseRepository.findAll();
	}

	@Transactional(readOnly = true)
	public List<Course> findAllActiveCourse() {
		return courseRepository.findByArchived(false);
	}

	@Transactional(readOnly = true)
	public List<Course> findCourseByContentStatusAndActive(ContentStatus contentStatus) {
		return courseRepository.findByContentStatusAndArchived(contentStatus, false);
	}

	@Transactional(readOnly = true)
	public List<Course> findAllActiveCourseSorted() {
		return courseRepository.findAllActiveCoursesSorted();
	}

	@Transactional(readOnly = true)
	public List<Course> findAllActiveCourseSortedInv() {
		return courseRepository.findAllActiveCoursesSortedInv();
	}

	@Transactional(readOnly = true)
	Page<Course> findActiveCoursesSortedPaged(int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return courseRepository.findActiveCoursesSortedPaged(pageable);
	}

	// PUT METHODS
	@Transactional
	public Course editCourse(UUID courseId, CourseUpdateDto body) {
		Course course = findCourseById(courseId);
		return updateCourse(course, body);
	}

	// PATCH METHODS
	@Transactional
	public Course linkToEvent(UUID courseId, UUID eventId) {
		contentLinkService.linkCourseAndEvent(courseId, eventId);
		return findCourseById(courseId);
	}

	@Transactional
	public Course unlinkFromEvent(UUID courseId, UUID eventId) {
		contentLinkService.unlinkCourseAndEvent(courseId, eventId);
		return findCourseById(courseId);
	}

	@Transactional
	public Course patchArchived(UUID courseId) {
		Course course = findCourseById(courseId);
		if (course.getLinkedEvent() != null) {
			throw new BadRequestException("Cannot archive a course linked to events. Unlink them first.");
		}
		course.setArchived(!course.isArchived());
		return courseRepository.save(course);
	}

	// LOGIC METHODS

	public CourseDto getCourseDto(Course course) {
		List<PressReview> pressReviews = getCombinedPressReviews(course);
		CourseDto dto = CourseDto.fromCourse(course);
		dto.setPressReviews(PressReviewDto.fromPressReviewList(pressReviews, course.getId()));
		return dto;
	}

	public CourseDto getCourseDtoById(UUID courseId) {
		Course course = findCourseById(courseId);
		return getCourseDto(course);
	}

	private Course saveCourse(CourseRequestDto body) {
		if (body.getDateFrom().isAfter(body.getDateTo())) {
			throw new BadRequestException("The start date must be before or equal the end date.");
		}
		Course course = new Course();
		course.setTitle(body.getTitle());
		course.setDescription(body.getDescription());
		course.setDateFrom(body.getDateFrom());
		course.setDateTo(body.getDateTo());
		course.setLocation(body.getLocation());
		course.setMaxParticipants(body.getMaxParticipants());
		course.setInformations(body.getInformations());
		course.setGoogleMapsLink(body.getGoogleMapsLink());

		prepareContent(course);

		course = courseRepository.save(course);

		handleMediaAttachments(course, body.getCoverImage(), body.getImages(), body.getFiles(), body.getVideos());

		return courseRepository.save(course);
	}

	private Course updateCourse(Course course, CourseUpdateDto body) {
		if (body.getTitle() != null && !body.getTitle().isBlank() && !body.getTitle().equals(course.getTitle())) {
			course.setTitle(body.getTitle());
		}
		if (body.getDescription() != null && !body.getDescription().isBlank()
				&& !body.getDescription().equals(course.getDescription())) {
			course.setDescription(body.getDescription());
		}
		if (body.getDateFrom() != null && body.getDateTo() != null) {
			if (body.getDateFrom().isAfter(body.getDateTo())) {
				throw new BadRequestException("The start date must be before or equal the end date.");
			}
			if (!body.getDateFrom().equals(course.getDateFrom())) {
				course.setDateFrom(body.getDateFrom());
			}
			if (!body.getDateTo().equals(course.getDateTo())) {
				course.setDateTo(body.getDateTo());
			}
		} else if (body.getDateFrom() != null || body.getDateTo() != null) {
			throw new BadRequestException("Both start and end dates must be provided together.");
		}
		if (body.getLocation() != null && !body.getLocation().isBlank()
				&& !body.getLocation().equals(course.getLocation())) {
			course.setLocation(body.getLocation());
		}
		if (body.getMaxParticipants() > 0 && body.getMaxParticipants() != course.getMaxParticipants()) {
			course.setMaxParticipants(body.getMaxParticipants());
		}
		if (body.getInformations() != null && !body.getInformations().isBlank()
				&& !body.getInformations().equals(course.getInformations())) {
			course.setInformations(body.getInformations());
		}
		if (body.getGoogleMapsLink() != null && !body.getGoogleMapsLink().isBlank()
				&& !body.getGoogleMapsLink().equals(course.getGoogleMapsLink())) {
			course.setGoogleMapsLink(body.getGoogleMapsLink());
		}

		refreshContentStatusAndDate(course);

		handleMediaUpdate(course, body);

		return courseRepository.save(course);

	}
}
