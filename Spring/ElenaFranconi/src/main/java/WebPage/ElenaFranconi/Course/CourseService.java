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
import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Course.dto.CourseRequestDto;
import WebPage.ElenaFranconi.Exceptions.BadRequestException;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;

@Service
public class CourseService extends AbstractContentService<Course> {
	@Autowired
	private CourseRepository courseRepository;

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

	// LOGIC METHODS
	public Course saveCourse(CourseRequestDto body) {
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

		prepareContent(course);

		course = courseRepository.save(course);

		handleMediaAttachments(course, body.getCoverImage(), body.getImages(), body.getFiles(), body.getVideos());

		return courseRepository.save(course);
	}

}
