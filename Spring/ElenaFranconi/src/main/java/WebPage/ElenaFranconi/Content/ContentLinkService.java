package WebPage.ElenaFranconi.Content;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import WebPage.ElenaFranconi.Course.Course;
import WebPage.ElenaFranconi.Course.CourseRepository;
import WebPage.ElenaFranconi.Event.Event;
import WebPage.ElenaFranconi.Event.EventRepository;
import WebPage.ElenaFranconi.Exceptions.BadRequestException;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;

@Service
public class ContentLinkService {

	@Autowired
	private CourseRepository courseRepository;

	@Autowired
	private EventRepository eventRepository;

	@Transactional
	public void linkCourseAndEvent(UUID courseId, UUID eventId) {
		Course course = courseRepository.findById(courseId)
				.orElseThrow(() -> new NotFoundException("Course not found: " + courseId));
		Event event = eventRepository.findById(eventId)
				.orElseThrow(() -> new NotFoundException("Event not found: " + eventId));

		if (course.getLinkedEvent() != null || event.getLinkedCourse() != null) {
			throw new BadRequestException("Course or Event is already linked.");
		}

		course.setLinkedEvent(event);
		event.setLinkedCourse(course);

		courseRepository.save(course);
		eventRepository.save(event);
	}

	@Transactional
	public void unlinkCourseAndEvent(UUID courseId, UUID eventId) {
		Course course = courseRepository.findById(courseId)
				.orElseThrow(() -> new NotFoundException("Course not found: " + courseId));
		Event event = eventRepository.findById(eventId)
				.orElseThrow(() -> new NotFoundException("Event not found: " + eventId));

		if (course.getLinkedEvent() == null || event.getLinkedCourse() == null) {
			throw new BadRequestException("Course or Event is not linked.");
		}

		if (!course.getLinkedEvent().getId().equals(event.getId())
				|| !event.getLinkedCourse().getId().equals(course.getId())) {
			throw new BadRequestException("Course and Event are not linked to each other.");
		}

		course.setLinkedEvent(null);
		event.setLinkedCourse(null);

		courseRepository.save(course);
		eventRepository.save(event);
	}
}
