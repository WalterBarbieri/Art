package WebPage.ElenaFranconi.Course;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import WebPage.ElenaFranconi.Course.dto.CourseDto;
import WebPage.ElenaFranconi.Course.dto.CourseRequestDto;
import WebPage.ElenaFranconi.Course.dto.CourseUpdateDto;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/course")
public class CourseController {
	@Autowired
	private CourseService courseService;

	// POST METHODS
	@PreAuthorize("hasAuthority('ADMIN')")
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<CourseDto> createCourse(@Valid @ModelAttribute CourseRequestDto body) {
		Course savedCourse = courseService.createCourse(body);
		CourseDto dto = courseService.getCourseDto(savedCourse);
		return ResponseEntity.status(HttpStatus.CREATED).body(dto);
	}

	// GET METHODS

	@GetMapping("/{id}")
	public ResponseEntity<CourseDto> getCourseById(@PathVariable UUID id) {
		return ResponseEntity.ok(courseService.getCourseDtoById(id));
	}

	// PUT METHODS
	@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<CourseDto> updateCourse(@PathVariable UUID id, @Valid @ModelAttribute CourseUpdateDto body) {
		Course updatedCourse = courseService.editCourse(id, body);
		CourseDto dto = courseService.getCourseDto(updatedCourse);
		return ResponseEntity.ok(dto);
	}

	// PATCH METHODS
	@PatchMapping("/{courseId}/link-event")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<CourseDto> linkToEvent(@PathVariable UUID courseId, @RequestParam UUID eventId) {
		Course course = courseService.linkToEvent(courseId, eventId);
		return ResponseEntity.ok(courseService.getCourseDto(course));
	}

	@PatchMapping("/{courseId}/unlink-event")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<CourseDto> unlinkFromEvent(@PathVariable UUID courseId, @RequestParam UUID eventId) {
		Course course = courseService.unlinkFromEvent(courseId, eventId);
		return ResponseEntity.ok(courseService.getCourseDto(course));
	}

	@PatchMapping("/{courseId}/archive")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<CourseDto> archiveCourse(@PathVariable UUID courseId) {
		Course course = courseService.patchArchived(courseId);
		return ResponseEntity.ok(courseService.getCourseDto(course));
	}
}
