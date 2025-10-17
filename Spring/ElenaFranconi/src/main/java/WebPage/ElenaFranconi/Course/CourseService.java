package WebPage.ElenaFranconi.Course;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import WebPage.ElenaFranconi.Content.AbstractContentService;
import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Course.dto.CourseRequestDto;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import jakarta.transaction.Transactional;

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
	@Transactional
	public Course findById(UUID id) {
		return courseRepository.findById(id).orElseThrow(() -> new NotFoundException(id));
	}

	@Transactional
	public List<Course> findAll() {
		return courseRepository.findAll();
	}

	@Transactional
	public List<Course> findAllActive() {
		return courseRepository.findByArchived(false);
	}

	@Transactional
	public List<Course> findByContentStatusAndActive(ContentStatus contentStatus) {
		return courseRepository.findByContentStatusAndArchived(contentStatus, false);
	}

	@Transactional
	public List<Course> findAllActiveSorted() {
		return courseRepository.findAllActiveCoursesSorted();
	}

	@Transactional
	public List<Course> findAllActiveSortedInv() {
		return courseRepository.findAllActiveCoursesSortedInv();
	}

	// LOGIC METHODS
	public Course saveCourse(CourseRequestDto body) {
		Course course = new Course();
		course.setTitle(body.getTitle());
		course.setDescription(body.getDescription());
		course.setDateFrom(body.getDateFrom());
		course.setDateTo(body.getDateTo());
		course.setLocation(body.getLocation());

		prepareContent(course);

		course = courseRepository.save(course);

		handleMediaAttachments(course, body.getCoverImage(), body.getImages(), body.getFiles(), body.getVideos());

		return courseRepository.save(course);
	}

}
